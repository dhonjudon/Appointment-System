import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ClipboardList,
  CreditCard,
  Check,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const STEPS = [
  { n: 1, label: "Date", Icon: Calendar },
  { n: 2, label: "Time", Icon: Clock },
  { n: 3, label: "Details", Icon: ClipboardList },
  { n: 4, label: "Payment", Icon: CreditCard },
];

const API_BASE = "http://localhost:3000/api";
const DEFAULT_DOCTOR_IMAGE =
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face";

const DEFAULT_DOCTOR = {
  id: null,
  name: "Selected doctor",
  specialty: "General consultation",
  consultationFee: 0,
  image: DEFAULT_DOCTOR_IMAGE,
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

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const resolveUserId = (storedUser) => {
  const s = storedUser || getStoredUser();
  const candidates = [
    localStorage.getItem("userId"),
    localStorage.getItem("userID"),
    localStorage.getItem("patientId"),
    s?.id,
    s?.data?.id,
    s?.data?.user?.id,
    s?.user?.id,
    s?.user_id,
  ];

  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) return value;
  }

  return null;
};

const toISODate = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseISODate = (isoDate) => {
  if (!isoDate) return null;
  const [year, month, day] = String(isoDate)
    .slice(0, 10)
    .split("-")
    .map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const normalizeDoctor = (doctor = {}) => {
  const firstName = doctor.first_name || "";
  const lastName = doctor.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const displayName = doctor.name || (fullName ? `Dr. ${fullName}` : "");

  return {
    ...DEFAULT_DOCTOR,
    ...doctor,
    id: doctor.id || DEFAULT_DOCTOR.id,
    name: displayName || DEFAULT_DOCTOR.name,
    specialty:
      doctor.specialty ||
      doctor.specialization_name ||
      DEFAULT_DOCTOR.specialty,
    consultationFee:
      doctor.consultationFee ??
      doctor.consultation_fee ??
      DEFAULT_DOCTOR.consultationFee,
    image: doctor.image || DEFAULT_DOCTOR_IMAGE,
  };
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const normalizeScheduleDay = (value) => {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const text = String(value).toLowerCase();
  const names = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  for (let index = 0; index < names.length; index += 1) {
    if (text.startsWith(names[index])) return index;
  }
  const asNumber = Number(value);
  return Number.isInteger(asNumber) ? asNumber : null;
};

const isPast = (year, month, day) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
};

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDraft = location.state?.bookingDraft || null;
  const doctor = normalizeDoctor(
    location.state?.doctor || bookingDraft?.doctor || DEFAULT_DOCTOR,
  );
  const currentUserId = resolveUserId(getStoredUser());
  const [currentMonth, setCurrentMonth] = useState(
    parseISODate(bookingDraft?.appointment_date) || new Date(),
  );
  const [currentStep, setCurrentStep] = useState(bookingDraft ? 4 : 1);
  const [selectedDate, setSelectedDate] = useState(
    parseISODate(bookingDraft?.appointment_date),
  );
  const [selectedSlot, setSelectedSlot] = useState(bookingDraft?.slot || null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [visitType, setVisitType] = useState(
    bookingDraft?.visitType || "General Consultation",
  );
  const [description, setDescription] = useState(
    bookingDraft?.description || "",
  );
  const [payMethod] = useState("khalti");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedDate || !doctor?.id) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }

    let isMounted = true;
    const fetchAvailableSlots = async () => {
      setSlotsLoading(true);
      setError("");
      if (toISODate(selectedDate) !== bookingDraft?.appointment_date) {
        setSelectedSlot(null);
      }

      try {
        const date = toISODate(selectedDate);
        const res = await fetch(
          `${API_BASE}/doctors/${doctor.id}/schedules?date=${date}`,
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Unable to load available slots.");
        }

        if (isMounted) {
          const slots = buildSlots(
            data.data?.schedules || [],
            data.data?.booked_slots || [],
          );
          setAvailableSlots(slots);

          if (bookingDraft?.slot && bookingDraft.appointment_date === date) {
            const draftSlot = bookingDraft.slot;
            const matchingSlot = slots.find(
              (slot) =>
                slot.schedule_id === draftSlot.schedule_id &&
                slot.start_time === draftSlot.start_time,
            );
            setSelectedSlot(matchingSlot || draftSlot);
          }
        }
      } catch (err) {
        if (isMounted) {
          setAvailableSlots([]);
          setError(err.message || "Unable to load available slots.");
        }
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    };

    fetchAvailableSlots();

    return () => {
      isMounted = false;
    };
  }, [bookingDraft, doctor?.id, selectedDate]);

  useEffect(() => {
    if (!doctor?.id) {
      setAllSchedules([]);
      return;
    }

    let isMounted = true;

    const fetchAllSchedules = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/doctors/${doctor.id}/all-schedules`,
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Unable to load doctor schedules.");
        }

        if (isMounted) {
          setAllSchedules(
            (data.data?.items || []).filter(
              (schedule) => schedule.is_active !== false,
            ),
          );
        }
      } catch (err) {
        if (isMounted) {
          setAllSchedules([]);
          setError(err.message || "Unable to load doctor schedules.");
        }
      }
    };

    fetchAllSchedules();

    return () => {
      isMounted = false;
    };
  }, [doctor?.id]);

  const { weeks, monthLabel } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    const cells = [];
    for (let index = firstDow - 1; index >= 0; index -= 1) {
      cells.push({ day: prevDays - index, cur: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, cur: true });
    }
    while (cells.length % 7 !== 0) {
      cells.push({
        day: cells.length - (firstDow + daysInMonth) + 1,
        cur: false,
      });
    }

    const rows = [];
    for (let row = 0; row < cells.length / 7; row += 1) {
      rows.push(cells.slice(row * 7, row * 7 + 7));
    }

    return {
      weeks: rows,
      monthLabel: currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [currentMonth]);

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  const hasAvailabilityOnDate = (date) => {
    if (!date) return false;
    const iso = toISODate(date);
    const dow = date.getDay();

    return allSchedules.some((schedule) => {
      if (schedule.is_active === false) return false;

      if (schedule.schedule_type === "date" && schedule.specific_date) {
        return String(schedule.specific_date).slice(0, 10) === iso;
      }

      if (schedule.schedule_type === "day") {
        return normalizeScheduleDay(schedule.day_of_week) === dow;
      }

      return false;
    });
  };

  const canProceed = () => {
    if (currentStep === 1) return Boolean(selectedDate);
    if (currentStep === 2) return Boolean(selectedSlot);
    if (currentStep === 3) return Boolean(visitType && description.trim());
    if (currentStep === 4) {
      return Boolean(
        selectedDate &&
        selectedSlot &&
        visitType &&
        description.trim() &&
        payMethod === "khalti",
      );
    }
    return false;
  };

  const bookAppointment = async () => {
    if (!currentUserId) {
      throw new Error(
        "Please log in again before confirming this appointment.",
      );
    }
    if (!doctor?.id) {
      throw new Error(
        "Doctor information is missing. Please select a doctor again.",
      );
    }
    if (!selectedDate || !selectedSlot) {
      throw new Error("Please select a date and time slot.");
    }

    const appointmentPayload = {
      user_id: currentUserId,
      doctor_id: Number(doctor.id),
      hospital_id: selectedSlot.hospital_id,
      schedule_id: selectedSlot.schedule_id,
      appointment_date: toISODate(selectedDate),
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      reason: `${visitType}${description.trim() ? `: ${description.trim()}` : ""}`,
    };

    const appointmentRes = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentPayload),
    });
    const appointmentData = await appointmentRes.json().catch(() => ({}));
    if (!appointmentRes.ok || appointmentData.success === false) {
      throw new Error(
        appointmentData.message ||
          `Booking failed with status ${appointmentRes.status}`,
      );
    }

    const appointment = appointmentData.data;
    const paymentRes = await fetch(`${API_BASE}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: appointment.id,
        user_id: currentUserId,
        provider: "khalti",
        payment_method: payMethod,
        currency: "NPR",
        metadata: {
          source: "book-appointment-page",
          gateway: "khalti-demo",
          dummy: true,
        },
      }),
    });
    const paymentData = await paymentRes.json().catch(() => ({}));
    if (!paymentRes.ok || paymentData.success === false) {
      throw new Error(paymentData.message || "Payment creation failed.");
    }

    const verifyRes = await fetch(
      `${API_BASE}/payments/${paymentData.data.id}/verify`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          status: "paid",
          provider_payment_id: `demo_khalti_${Date.now()}`,
        }),
      },
    );
    const verifyData = await verifyRes.json().catch(() => ({}));
    if (!verifyRes.ok || verifyData.success === false) {
      throw new Error(verifyData.message || "Payment verification failed.");
    }

    return { appointment, payment: verifyData.data };
  };

  const handleNext = async () => {
    setError("");
    if (!canProceed()) {
      const messages = [
        "Please select a date.",
        "Please select a time slot.",
        "Please complete all visit details.",
        "Please confirm the dummy payment.",
      ];
      setError(messages[currentStep - 1]);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setLoading(true);
    try {
      const result = await bookAppointment();
      navigate(`/appointment-confirm?id=${result.appointment.id}`, {
        state: {
          appointment: result.appointment,
          payment: result.payment,
          doctor,
          date: dateLabel,
          time: selectedSlot.display,
          visitType,
          description,
        },
      });
    } catch (err) {
      setError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="h-screen overflow-hidden flex  bg-[#DFF2EB] ">
      <aside className="w-68 shrink-0 bg-white border-r border-gray-300 h-162.5 flex flex-col h-screen overflow-y-auto fixed">
        <div className="px-7 pt-7 flex-1 overflow-y-auto flex flex-col justify-center items-center">
          <div className="space-y-1 flex flex-col">
            <div className="ml-8 w-0.5 h-10 bg-emerald-400" />
            {STEPS.map((step, idx) => {
              const done = currentStep > step.n;
              const active = currentStep === step.n;
              const { Icon } = step;
              return (
                <div key={step.n}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-emerald-50 border border-emerald-200"
                        : "opacity-70"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        done
                          ? "bg-emerald-500"
                          : active
                            ? "bg-emerald-500 shadow-md shadow-emerald-200"
                            : "bg-gray-100"
                      }`}
                    >
                      {done ? (
                        <Check
                          className="w-6 h-6 text-white"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${active ? "text-white" : "text-gray-400"}`}
                          strokeWidth={2}
                        />
                      )}
                    </div>
                    <span
                      className={`text-lg font-semibold ${active || done ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {step.label}
                    </span>
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`ml-8 w-0.5 h-9 ${done ? "bg-emerald-400" : "bg-gray-100"}`}
                    />
                  )}
                </div>
              );
            })}
            <div className="ml-8 w-0.5 h-10 bg-gray-100" />
          </div>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto flex flex-col ml-65">
        <header className="shrink-0 bg-emerald-50 border-b border-gray-100 px-10 py-4">
          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-100"
            />
            <div>
              <p className="text-base font-bold text-gray-800 leading-tight">
                {doctor.name}
              </p>
              <p className="text-sm text-emerald-600 font-medium">
                {doctor.specialty}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-gray-400">
                Step {currentStep} of {STEPS.length}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-10 py-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                {(() => {
                  const { Icon } = STEPS[currentStep - 1];
                  return (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon
                        className="w-5 h-5 text-emerald-600"
                        strokeWidth={1.8}
                      />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {
                      [
                        "Select a Date",
                        "Choose a Time",
                        "Visit Details",
                        "Payment",
                      ][currentStep - 1]
                    }
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {currentStep === 1 &&
                      "Pick a convenient day for your appointment"}
                    {currentStep === 2 &&
                      (selectedDate ? dateLabel : "Available time slots")}
                    {currentStep === 3 &&
                      "Help the doctor prepare for your visit"}
                    {currentStep === 4 &&
                      `Consultation fee - Rs ${doctor.consultationFee}`}
                  </p>
                </div>
              </div>

              <div className="px-8 py-7">
                {currentStep === 1 && (
                  <div>
                    <div className="bg-white rounded-2xl border border-[#DFF2EB] shadow-sm p-4 overflow-hidden">
                      <div className="flex items-center justify-between border-b-2 border-[#A7A7A7] py-3 mb-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentMonth(
                              (date) =>
                                new Date(
                                  date.getFullYear(),
                                  date.getMonth() - 1,
                                ),
                            )
                          }
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <span className="text-[18px] font-extrabold text-gray-800">
                          {monthLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentMonth(
                              (date) =>
                                new Date(
                                  date.getFullYear(),
                                  date.getMonth() + 1,
                                ),
                            )
                          }
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 mb-1">
                        {WEEKDAYS.map((day) => (
                          <div
                            key={day}
                            className="text-center text-[14px] font-bold text-[#51C833] py-1"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-y-0.5">
                        {weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="contents">
                            {week.map((cell, cellIndex) => {
                              const year = currentMonth.getFullYear();
                              const month = currentMonth.getMonth();
                              const past =
                                cell.cur && isPast(year, month, cell.day);
                              const cellDate = cell.cur
                                ? new Date(year, month, cell.day)
                                : null;
                              const selected =
                                cell.cur && isSameDay(cellDate, selectedDate);
                              const isToday =
                                cell.cur && isSameDay(cellDate, new Date());
                              const isWeekend =
                                cellIndex === 0 || cellIndex === 6;
                              const available =
                                cell.cur &&
                                !past &&
                                hasAvailabilityOnDate(cellDate);
                              return (
                                <button
                                  type="button"
                                  key={cellIndex}
                                  disabled={!cell.cur || past || !available}
                                  onClick={() => {
                                    if (cell.cur && !past && available) {
                                      setSelectedDate(cellDate);
                                    }
                                  }}
                                  className={`relative w-10 h-10 m-1 flex flex-col items-center justify-center rounded-full text-[16px] font-light transition-all ${
                                    cell.cur && !past && available
                                      ? "cursor-pointer hover:bg-emerald-50"
                                      : cell.cur && !past && !available
                                        ? "cursor-not-allowed bg-gray-50"
                                        : "cursor-default"
                                  }`}
                                >
                                  <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                                      selected
                                        ? "bg-[#51C833] text-white shadow-sm"
                                        : isToday
                                          ? "bg-emerald-100 text-emerald-700"
                                          : !cell.cur
                                            ? "text-gray-300"
                                            : past
                                              ? "text-gray-300"
                                              : !available
                                                ? "text-gray-300 line-through"
                                                : isWeekend
                                                  ? "text-rose-400"
                                                  : "text-gray-700"
                                    }`}
                                  >
                                    {cell.day}
                                  </span>
                                  {isToday && !selected && (
                                    <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#51C833]" />
                                  )}
                                  {cell.cur && !past && !available && (
                                    <span className="absolute inset-x-2 bottom-2 h-px bg-gray-300 rotate-[-20deg]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <Calendar
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          strokeWidth={2}
                        />
                        <span className="text-sm font-semibold text-emerald-800">
                          {dateLabel}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    {slotsLoading ? (
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm font-medium text-gray-500">
                        Loading available time slots...
                      </div>
                    ) : availableSlots.length ? (
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {availableSlots.map((slot) => {
                          const active =
                            selectedSlot?.schedule_id === slot.schedule_id &&
                            selectedSlot?.start_time === slot.start_time;
                          return (
                            <button
                              type="button"
                              key={`${slot.schedule_id}-${slot.start_time}`}
                              onClick={() => setSelectedSlot(slot)}
                              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold border transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                              }`}
                            >
                              {slot.display}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm font-medium text-gray-500">
                        No available time slots.
                      </div>
                    )}

                    {selectedSlot && (
                      <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <Clock
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          strokeWidth={2}
                        />
                        <span className="text-sm font-semibold text-emerald-800">
                          {selectedSlot.display}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                        Visit type
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {[
                          "General Consultation",
                          "Follow-up",
                          "New Symptoms",
                        ].map((type) => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setVisitType(type)}
                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                              visitType === type
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                        Reason for visit
                      </label>
                      <textarea
                        rows={5}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Briefly describe symptoms, concerns, or what you want to discuss."
                        className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>

                    <BookingSummary
                      doctor={doctor}
                      dateLabel={dateLabel}
                      selectedSlot={selectedSlot}
                      visitType={visitType}
                    />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                          <CreditCard
                            className="h-5 w-5 text-emerald-600"
                            strokeWidth={1.8}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            Dummy Khalti payment
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            No real payment will be taken. Confirming creates a
                            demo payment record and confirms the appointment.
                          </p>
                        </div>
                      </div>
                    </div>

                    <BookingSummary
                      doctor={doctor}
                      dateLabel={dateLabel}
                      selectedSlot={selectedSlot}
                      visitType={visitType}
                      description={description}
                      showTotal
                    />
                  </div>
                )}

                {error && (
                  <div className="mt-5 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl text-sm font-bold transition-all ${
                  canProceed() && !loading
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="30 60"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    {currentStep === 4 ? "Confirm Booking" : "Continue"}
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function BookingSummary({
  doctor,
  dateLabel,
  selectedSlot,
  visitType,
  description,
  showTotal = false,
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 px-5 py-5">
      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-4">
        Booking Summary
      </p>
      <div className="space-y-2.5 text-sm">
        <SummaryRow
          icon={
            <Stethoscope
              className="w-4 h-4 text-emerald-500"
              strokeWidth={1.8}
            />
          }
          label={doctor.name}
          sub={doctor.specialty}
        />
        {dateLabel && (
          <SummaryRow
            icon={
              <Calendar
                className="w-4 h-4 text-emerald-500"
                strokeWidth={1.8}
              />
            }
            label={dateLabel}
          />
        )}
        {selectedSlot && (
          <SummaryRow
            icon={
              <Clock className="w-4 h-4 text-emerald-500" strokeWidth={1.8} />
            }
            label={selectedSlot.display}
          />
        )}
        {visitType && (
          <SummaryRow
            icon={
              <ClipboardList
                className="w-4 h-4 text-emerald-500"
                strokeWidth={1.8}
              />
            }
            label={visitType}
            sub={description}
          />
        )}
      </div>
      {showTotal && (
        <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-2xl font-black text-emerald-600">
            Rs {doctor.consultationFee}
          </span>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ icon, label, sub }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="font-medium text-gray-800">
        {label}
        {sub && (
          <span className="text-gray-400 font-normal ml-1.5">- {sub}</span>
        )}
      </span>
    </div>
  );
}
