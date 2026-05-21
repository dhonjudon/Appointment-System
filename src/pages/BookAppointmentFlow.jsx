import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api";
const PAYMENT_METHODS = [
  { key: "card", label: "Card" },
  { key: "upi", label: "UPI" },
  { key: "cash", label: "Cash at Clinic" },
];

const toIsoDate = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const toDisplayDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const to12Hour = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const addMinutes = (time24, minutesToAdd) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes + minutesToAdd, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`;
};

const buildSlots = (schedules = [], bookedSlots = []) => {
  const bookedSet = new Set(
    bookedSlots.map((slot) => `${slot.start_time}-${slot.end_time}`),
  );
  const slots = [];

  schedules.forEach((schedule) => {
    const duration = Number(schedule.slot_duration_minutes) || 30;
    let cursor = schedule.start_time.slice(0, 5);
    const endBound = schedule.end_time.slice(0, 5);
    const hospitalId = schedule.hospital_id || null;

    while (cursor < endBound) {
      const endTime = addMinutes(cursor, duration).slice(0, 5);
      if (endTime > endBound) break;

      const normalizedStart = `${cursor}:00`;
      const normalizedEnd = `${endTime}:00`;
      const key = `${normalizedStart}-${normalizedEnd}`;
      if (!bookedSet.has(key)) {
        slots.push({
          schedule_id: schedule.id,
          hospital_id: hospitalId,
          start_time: normalizedStart,
          end_time: normalizedEnd,
          label: `${to12Hour(cursor)} - ${to12Hour(endTime)}`,
        });
      }
      cursor = endTime;
    }
  });

  return slots;
};

function BookAppointmentFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor || null;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visitReason, setVisitReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [userId, setUserId] = useState(
    localStorage.getItem("appointment_user_id") || "",
  );
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const consultationFee = Number(
    doctor?.consultationFee || doctor?.consultation_fee || 0,
  );

  useEffect(() => {
    if (!doctor?.id) return;
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setError("");
        setSelectedSlot(null);

        const date = toIsoDate(selectedDate);
        const { data } = await axios.get(
          `${API_BASE_URL}/doctors/${doctor.id}/schedules?date=${date}`,
        );

        const payload = data?.data || {};
        const slots = buildSlots(
          payload.schedules || [],
          payload.booked_slots || [],
        );
        setAvailableSlots(slots);
      } catch (slotError) {
        console.error(slotError);
        setError("Unable to load schedules for this date.");
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [doctor?.id, selectedDate]);

  const canBook = useMemo(
    () =>
      Number.isInteger(Number(userId)) &&
      Number(userId) > 0 &&
      selectedSlot &&
      visitReason.trim().length >= 5 &&
      paymentMethod,
    [userId, selectedSlot, visitReason, paymentMethod],
  );

  const onConfirm = async () => {
    if (!canBook || !doctor?.id) return;

    try {
      setSubmitting(true);
      setError("");
      localStorage.setItem("appointment_user_id", String(userId));

      const appointmentPayload = {
        user_id: Number(userId),
        doctor_id: Number(doctor.id),
        hospital_id: selectedSlot.hospital_id,
        schedule_id: selectedSlot.schedule_id,
        appointment_date: toIsoDate(selectedDate),
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        reason: visitReason.trim(),
      };

      const appointmentRes = await axios.post(
        `${API_BASE_URL}/appointments`,
        appointmentPayload,
      );
      const appointment = appointmentRes?.data?.data;

      if (!appointment?.id) {
        throw new Error("Failed to create appointment - no ID received");
      }

      const paymentRes = await axios.post(`${API_BASE_URL}/payments`, {
        appointment_id: appointment.id,
        user_id: Number(userId),
        provider: paymentMethod,
        payment_method: paymentMethod,
        currency: "USD",
        metadata: { source: "web-booking" },
      });
      const payment = paymentRes?.data?.data;

      const providerPaymentId = `demo_${paymentMethod}_${Date.now()}`;
      const verifyRes = await axios.patch(
        `${API_BASE_URL}/payments/${payment.id}/verify`,
        {
          user_id: Number(userId),
          status: "paid",
          provider_payment_id: providerPaymentId,
        },
      );

      navigate(`/appointment-confirm?id=${appointment.id}`, {
        state: {
          doctor,
          appointment,
          payment: verifyRes?.data?.data,
          paymentQuote: payment?.quote || null,
          displayDate: toDisplayDate(toIsoDate(selectedDate)),
          displayTime: selectedSlot.label,
          paymentMethod,
          visitReason: visitReason.trim(),
        },
      });
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError?.response?.data?.message || "Booking failed. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-emerald-100 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            No doctor selected
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please choose a doctor first and continue with booking.
          </p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-emerald-500 px-5 py-2 text-white font-semibold"
            onClick={() => navigate("/doctors")}
          >
            Go to doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-emerald-100 bg-white p-5">
          <h1 className="text-xl font-bold text-gray-800">
            Complete Appointment Booking
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Doctor: {doctor.name} | Consultation fee: $
            {consultationFee.toFixed(2)}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">
              1. Select date and slot
            </h2>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              value={toIsoDate(selectedDate)}
              min={toIsoDate(new Date())}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            {loadingSlots ? (
              <p className="text-sm text-gray-500">Loading time slots...</p>
            ) : availableSlots.length ? (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <button
                    type="button"
                    key={`${slot.schedule_id}-${slot.start_time}`}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      selectedSlot?.schedule_id === slot.schedule_id &&
                      selectedSlot?.start_time === slot.start_time
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No open slots for the selected date.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">
              2. Patient and payment details
            </h2>
            <input
              type="number"
              min="1"
              placeholder="Patient user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
            <textarea
              rows={3}
              placeholder="Reason for visit"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.key}
                  type="button"
                  onClick={() => setPaymentMethod(method.key)}
                  className={`rounded-lg border px-2 py-2 text-sm ${
                    paymentMethod === method.key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-5">
          <h3 className="font-semibold text-gray-800">Summary</h3>
          <p className="mt-2 text-sm text-gray-600">
            Date: {toDisplayDate(toIsoDate(selectedDate))} | Slot:{" "}
            {selectedSlot?.label || "Not selected"}
          </p>
          <p className="text-sm text-gray-600">
            Payment method: {paymentMethod.toUpperCase()} | Dynamic total will
            be calculated by backend.
          </p>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onConfirm}
              disabled={!canBook || submitting}
              className={`rounded-lg px-5 py-2 font-semibold ${
                canBook && !submitting
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? "Processing payment..." : "Book and Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointmentFlow;
