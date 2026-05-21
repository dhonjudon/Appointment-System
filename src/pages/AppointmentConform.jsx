import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  MapPin,
  Calendar,
  ClipboardList,
  FileText,
  MessageCircle,
  HelpCircle,
  Plus,
  X,
  RefreshCw,
  Copy,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE = "http://localhost:3000/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const resolveUserId = (storedUser) => {
  const candidates = [
    storedUser?.id,
    storedUser?.data?.id,
    storedUser?.data?.user?.id,
    storedUser?.user?.id,
    storedUser?.user_id,
  ];
  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) return value;
  }
  return 1;
};

const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addMinutes = (time24, minutesToAdd) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes + minutesToAdd, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}:00`;
};

const to12Hour = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const buildSlots = (schedules = [], bookedSlots = []) => {
  const bookedSet = new Set(
    bookedSlots.map((slot) => `${slot.start_time}-${slot.end_time}`),
  );
  const slots = [];

  schedules.forEach((schedule) => {
    const duration = Number(schedule.slot_duration_minutes) || 30;
    let cursor = String(schedule.start_time || "").slice(0, 5);
    const endBound = String(schedule.end_time || "").slice(0, 5);

    while (cursor && endBound && cursor < endBound) {
      const endTime = addMinutes(cursor, duration).slice(0, 5);
      if (endTime > endBound) break;

      const start_time = `${cursor}:00`;
      const end_time = `${endTime}:00`;
      if (!bookedSet.has(`${start_time}-${end_time}`)) {
        slots.push({
          schedule_id: schedule.id,
          hospital_id: schedule.hospital_id || null,
          start_time,
          end_time,
          display: `${to12Hour(cursor)} - ${to12Hour(endTime)}`,
        });
      }
      cursor = endTime;
    }
  });

  return slots;
};

const formatAppointmentDate = (dateStr) => {
  if (!dateStr) return "—";
  const value = String(dateStr);
  const local = value.includes("T")
    ? new Date(value)
    : (() => {
        const [y, m, d] = value.slice(0, 10).split("-").map(Number);
        return new Date(y, m - 1, d);
      })();
  return local.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatRupees = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "Rs. 0/-";
  return `Rs. ${value.toLocaleString("en-IN")}/-`;
};

const FAQS = [
  {
    q: "How much time does it take to confirm my appointment?",
    a: "it doesnt take much",
  },
  {
    q: "Can I schedule my health checkup?",
    a: "Yes, you can reschedule your appointment. You can do so from the Booking history page and chat with our customer support team.",
  },
  {
    q: "What if I miss my appointment slot?",
    a: "you will be marked as absent but u can reschedule just before ur schedule time ends.",
  },
];

function RescheduleModal({
  appointmentId,
  doctorId,
  userId,
  currentDate,
  onClose,
  onSuccess,
}) {
  const [newDate, setNewDate] = useState(currentDate || toISODate(new Date()));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [reason, setReason] = useState("Patient request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctorId || !newDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }

    let isMounted = true;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setError("");
      setSelectedSlot(null);

      try {
        const res = await fetch(
          `${API_BASE}/doctors/${doctorId}/schedules?date=${newDate}`,
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Unable to load available slots.");
        }

        if (isMounted) {
          setAvailableSlots(
            buildSlots(
              data.data?.schedules || [],
              data.data?.booked_slots || [],
            ),
          );
        }
      } catch (err) {
        if (isMounted) {
          setAvailableSlots([]);
          setError(err.message || "Unable to load available slots.");
        }
      } finally {
        if (isMounted) {
          setSlotsLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [doctorId, newDate]);

  const handleReschedule = async () => {
    if (!newDate || !selectedSlot) {
      return setError("Please select an available date and time slot.");
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/appointments/${appointmentId}/reschedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            new_appointment_date: newDate,
            new_start_time: selectedSlot.start_time,
            new_end_time: selectedSlot.end_time,
            reason,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Error ${res.status}`);
      }
      onSuccess(data.data);
    } catch (err) {
      setError(err.message || "Reschedule failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            <h3 className="text-base font-bold text-gray-800">
              Reschedule Appointment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {!doctorId && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
              Doctor information is missing for this appointment.
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              New Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={toISODate(new Date())}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Available Time Slots
            </label>
            {slotsLoading ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                Loading available slots...
              </div>
            ) : availableSlots.length ? (
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {availableSlots.map((slot) => {
                  const active =
                    selectedSlot?.schedule_id === slot.schedule_id &&
                    selectedSlot?.start_time === slot.start_time;
                  return (
                    <button
                      type="button"
                      key={`${slot.schedule_id}-${slot.start_time}`}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                      }`}
                    >
                      {slot.display}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                No available slots for this date. Please choose another date.
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
              {error}
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReschedule}
            disabled={loading || slotsLoading || !selectedSlot}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelModal({ appointmentId, userId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Error ${res.status}`);
      }
      onSuccess(data.data);
    } catch (err) {
      setError(err.message || "Cancellation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
            <h3 className="text-base font-bold text-gray-800">
              Cancel Appointment
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </p>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
              {error}
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Keep Appointment
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = resolveUserId(getStoredUser());

  const passed = location.state || {};

  const [appointment, setAppointment] = useState(passed.appointment || null);
  const [doctor, setDoctor] = useState(passed.doctor || null);
  const [fetchLoading, setFetchLoading] = useState(!passed.appointment);
  const [fetchError, setFetchError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState({ 1: true });

  useEffect(() => {
    if (appointment) {
      setFetchLoading(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      setFetchError("No appointment data found.");
      setFetchLoading(false);
      return;
    }

    fetch(`${API_BASE}/appointments/${id}`)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`Error ${r.status}`)),
      )
      .then((data) => {
        if (data.success === false) {
          throw new Error(data.message || "Failed to load appointment");
        }
        setAppointment(data.data);
        setFetchLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  }, [appointment]);

  const apptId = appointment?.id || appointment?.appointment_id;

  const bookingId =
    appointment?.booking_id ||
    (apptId ? `SS-2026-${String(apptId).padStart(4, "0")}X` : "—");

  const displayDate = appointment?.appointment_date
    ? formatAppointmentDate(appointment.appointment_date)
    : passed.date || "—";

  const displayTime = appointment?.start_time
    ? (() => {
        const [h, m] = appointment.start_time.split(":");
        const date = new Date();
        date.setHours(+h, +m);
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      })()
    : passed.time || "—";

  const displayDoctor =
    doctor?.name ||
    (appointment?.doctor_first_name && appointment?.doctor_last_name
      ? `${appointment.doctor_first_name} ${appointment.doctor_last_name}`
      : "—");

  const displayHospital = doctor?.hospital || appointment?.hospital_name || "—";
  const displaySpecialty =
    doctor?.specialty || appointment?.specialization_name || "—";
  const displayReason =
    appointment?.reason || passed.visitType || passed.description || "—";
  const consultationFee = Number(
    appointment?.consultation_fee ??
      doctor?.consultationFee ??
      doctor?.consultation_fee ??
      passed.consultationFee ??
      500,
  );
  const totalAmount = Number(
    appointment?.total_amount ??
      appointment?.total_fee ??
      appointment?.amount ??
      appointment?.consultation_fee ??
      doctor?.consultationFee ??
      doctor?.consultation_fee ??
      consultationFee,
  );

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleFaq = (idx) => {
    setExpandedFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-emerald-600">
          <Loader2 className="w-10 h-10 animate-spin" strokeWidth={2} />
          <p className="text-sm font-medium text-gray-500">
            Loading appointment details…
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow p-8 text-center max-w-sm">
          <AlertCircle
            className="w-10 h-10 text-rose-400 mx-auto mb-3"
            strokeWidth={1.5}
          />
          <p className="text-base font-bold text-gray-800 mb-1">
            Failed to load
          </p>
          <p className="text-sm text-gray-500 mb-5">{fetchError}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex flex-col">
      <div className="flex-1 px-6 py-8 max-w-[1100px] mx-auto w-full">
        {cancelled && (
          <div className="mb-5 flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
            <X className="w-5 h-5 text-rose-500 shrink-0" strokeWidth={2.5} />
            <div>
              <p className="text-sm font-bold text-rose-700">
                Appointment Cancelled
              </p>
              <p className="text-xs text-rose-500 mt-0.5">
                Your appointment has been successfully cancelled.
              </p>
            </div>
          </div>
        )}

        {rescheduled && !cancelled && (
          <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
            <CheckCircle
              className="w-5 h-5 text-emerald-500 shrink-0"
              strokeWidth={2.5}
            />
            <div>
              <p className="text-sm font-bold text-emerald-700">
                Appointment Rescheduled
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Your updated appointment details are shown below.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className="w-6 h-6 text-emerald-500 shrink-0"
                    strokeWidth={2}
                  />
                  <div>
                    <h1 className="text-lg font-bold text-emerald-600">
                      {cancelled
                        ? "Appointment Cancelled"
                        : "Appointment Booked !"}
                    </h1>
                    {!cancelled && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        You will receive a confirmation mail shortly.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  Doctor
                </p>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-bold text-gray-800">
                      {displayDoctor}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {displaySpecialty}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {displayHospital}
                    </p>
                  </div>
                  {/* <button
                    type="button"
                    className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    <MapPin
                      className="w-3.5 h-3.5 text-emerald-500"
                      strokeWidth={2}
                    />
                    View Location
                  </button> */}
                </div>
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  Reason
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  {displayReason}
                </p>
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  Booking ID
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                    {bookingId}
                  </span>
                  <button
                    type="button"
                    onClick={copyBookingId}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition"
                  >
                    <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                    Date and Time
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-4 h-4 text-emerald-500"
                      strokeWidth={2}
                    />
                    <p className="text-sm font-bold text-gray-800">
                      {displayTime} {displayDate}
                    </p>
                  </div>
                </div>

                {!cancelled && apptId && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReschedule(true)}
                      className="flex items-center gap-1.5 border border-emerald-300 rounded-lg px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancel(true)}
                      className="flex items-center gap-1.5 border border-rose-300 rounded-lg px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <div className="flex items-center gap-2.5 mb-4">
                <FileText className="w-4 h-4 text-gray-600" strokeWidth={2} />
                <h2 className="text-sm font-bold text-gray-800">
                  Instructions to follow
                </h2>
              </div>
              <ul className="space-y-2">
                {[
                  "Arrive 10 minutes before your scheduled appointment time",
                  "Bring any previous medical records or test reports",
                  "Please wear comfortable clothing for easy examination",
                ].map((instr, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <CheckCircle
                      className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                      strokeWidth={2}
                    />
                    {instr}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <div className="flex items-center gap-2.5 mb-1">
                <HelpCircle className="w-4 h-4 text-gray-600" strokeWidth={2} />
                <h2 className="text-sm font-bold text-gray-800">FAQS</h2>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                May be we have already answered your question
              </p>
              <div className="space-y-1">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between py-3 text-left"
                    >
                      <span className="text-sm text-gray-700 font-medium">
                        {faq.q}
                      </span>
                      {expandedFaqs[idx] ? (
                        <X
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Plus
                          className="w-4 h-4 text-gray-400 shrink-0"
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                    {expandedFaqs[idx] && faq.a && (
                      <p className="pb-3 text-sm text-gray-500 leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                Booking Details
              </h2>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Appointment Info
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <ClipboardList
                    className="w-4 h-4 text-gray-400 shrink-0"
                    strokeWidth={1.8}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Visit Type</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {displayReason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar
                    className="w-4 h-4 text-gray-400 shrink-0"
                    strokeWidth={1.8}
                  />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {displayDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-semibold text-gray-800">
                    {/* {formatRupees(consultationFee)} */}
                    PAID
                  </span>
                </div>
              </div>

              {/* <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Total Fee
                </span>
                <span className="text-base font-black text-emerald-600">
                  {formatRupees(totalAmount)}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {showReschedule && apptId && (
        <RescheduleModal
          appointmentId={apptId}
          doctorId={appointment?.doctor_id || doctor?.id}
          userId={currentUserId}
          currentDate={appointment?.appointment_date?.slice(0, 10)}
          onClose={() => setShowReschedule(false)}
          onSuccess={(updated) => {
            setAppointment(updated);
            setCancelled(false);
            setRescheduled(true);
            setShowReschedule(false);
            window.history.replaceState(
              null,
              "",
              `/appointment-confirm?id=${updated.id || updated.appointment_id}`,
            );
          }}
        />
      )}

      {showCancel && apptId && (
        <CancelModal
          appointmentId={apptId}
          userId={currentUserId}
          onClose={() => setShowCancel(false)}
          onSuccess={() => {
            setCancelled(true);
            setShowCancel(false);
          }}
        />
      )}
    </div>
  );
}
