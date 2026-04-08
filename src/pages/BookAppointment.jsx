import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ClipboardList,
  CreditCard,
  Check,
  Stethoscope,
  MapPin,
  Star,
  RefreshCw,
  MessageSquare,
  Activity,
  AlertCircle,
  FlaskConical,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Smartphone,
  Building2,
} from "lucide-react";

/* ─────────────── constants ─────────────── */
const STEPS = [
  { n: 1, label: "Date", Icon: Calendar },
  { n: 2, label: "Time", Icon: Clock },
  { n: 3, label: "Details", Icon: ClipboardList },
  { n: 4, label: "Payment", Icon: CreditCard },
];

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

const VISIT_TYPES = [
  { label: "Follow-up", Icon: RefreshCw },
  { label: "Consultation", Icon: MessageSquare },
  { label: "Check-up", Icon: Activity },
  { label: "Emergency", Icon: AlertCircle },
  { label: "Lab Results Review", Icon: FlaskConical },
  { label: "Other", Icon: MoreHorizontal },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─────────────── mock doctor ─────────────── */
const MOCK_DOCTOR = {
  name: "Dr. Priya Sharma",
  specialty: "Cardiologist",
  hospital: "Heart & Vascular Institute",
  rating: 4.92,
  reviews: 256,
  experience: 15,
  consultationFee: 150,
  image:
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
};

/* ─────────────── helpers ─────────────── */
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isPast = (year, month, day) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
};

/* ═══════════════════════════════════════════ */
export default function BookAppointment() {
  const navigate = useNavigate();
  const doctor = MOCK_DOCTOR; // replace with useLocation().state?.doctor

  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [visitType, setVisitType] = useState("");
  const [description, setDescription] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── calendar ── */
  const { weeks, monthLabel } = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();

    const cells = [];
    for (let i = firstDow - 1; i >= 0; i--)
      cells.push({ day: prevDays - i, cur: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
    while (cells.length % 7 !== 0)
      cells.push({
        day: cells.length - (firstDow + daysInMonth) + 1,
        cur: false,
      });

    const rows = [];
    for (let r = 0; r < cells.length / 7; r++)
      rows.push(cells.slice(r * 7, r * 7 + 7));

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

  /* ── validation ── */
  const canProceed = () => {
    if (currentStep === 1) return Boolean(selectedDate);
    if (currentStep === 2) return Boolean(selectedTime);
    if (currentStep === 3) return visitType && description.trim();
    if (currentStep === 4) {
      if (payMethod !== "card") return true;
      return (
        cardName &&
        cardNumber.replace(/\s/g, "").length >= 12 &&
        expiry.length >= 4 &&
        cvv.length >= 3
      );
    }
    return false;
  };

  const handleNext = () => {
    setError("");
    if (!canProceed()) {
      const msgs = [
        "Please select a date.",
        "Please select a time slot.",
        "Please complete all visit details.",
        "Please complete payment information.",
      ];
      return setError(msgs[currentStep - 1]);
    }
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      return;
    }
    setLoading(true);
    setTimeout(() => navigate("/appointment-confirm"), 1500);
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      return;
    }
    navigate(-1);
  };

  /* ════════════ render ════════════ */
  return (
    <div className="h-screen overflow-hidden flex bg-linear-to-b from-emerald-50 to-white">
      {/* ══ SIDEBAR ══ */}
      <aside className="w-[272px] shrink-0 bg-linear-to-r  from-white to-emerald-50 border-r border-gray-300  h-[650px] flex flex-col overflow-y-auto fixed ">
        {/* Steps */}
        <div className="px-7 pt-7 flex-1 overflow-y-auto  flex flex-col justify-center items-center">
          {/* <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
            Booking Steps
          </p> */}
          <div className="space-y-1 flex flex-col">
            <div className={`ml-8 w-0.5 h-10 bg-emerald-400`} />
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
                        : done
                          ? "opacity-70"
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
            <div className={`ml-8 w-0.5 h-10 bg-gray-100`} />
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col ml-65 ">
        {/* Doctor header */}
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
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 px-10 py-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Card */}
            <div className="bg-gray-100 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card header */}
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
                      `Consultation fee · $${doctor.consultationFee}`}
                  </p>
                </div>
              </div>

              <div className="px-8 py-7">
                {/* ── DATE ── */}
                {currentStep === 1 && (
                  <div>
                    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      {/* Month nav bar */}
                      <div className="bg-emerald-50 px-5 py-3.5 flex items-center justify-between">
                        <button
                          onClick={() =>
                            setCurrentMonth(
                              (d) =>
                                new Date(d.getFullYear(), d.getMonth() - 1),
                            )
                          }
                          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-gray-200 flex items-center justify-center text-white transition"
                        >
                          <ChevronLeft className="w-4 h-4" color="black" />
                        </button>
                        <span className="text-black font-bold tracking-wide">
                          {monthLabel}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentMonth(
                              (d) =>
                                new Date(d.getFullYear(), d.getMonth() + 1),
                            )
                          }
                          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-gray-200 flex items-center justify-center text-white transition"
                        >
                          <ChevronRight className="w-4 h-4" color="black" />
                        </button>
                      </div>

                      {/* Weekday row */}
                      <div className="grid grid-cols-7 border-b border-gray-400 bg-emerald-50">
                        {WEEKDAYS.map((d) => (
                          <div
                            key={d}
                            className={`py-2 text-center border-t border-gray-400 text-[11px] font-bold uppercase tracking-wide ${
                              d != "Sat" ? "border-r " : ""
                            }`}
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Day cells */}
                      <div className="bg-emerald-50 divide-y divide-gray-400">
                        {weeks.map((week, wi) => (
                          <div
                            key={wi}
                            className="grid grid-cols-7 divide-x divide-gray-400"
                          >
                            {week.map((cell, ci) => {
                              const y = currentMonth.getFullYear();
                              const m = currentMonth.getMonth();
                              const past = cell.cur && isPast(y, m, cell.day);
                              const cellDate = cell.cur
                                ? new Date(y, m, cell.day)
                                : null;
                              const selected =
                                cell.cur && isSameDay(cellDate, selectedDate);
                              const isToday =
                                cell.cur && isSameDay(cellDate, new Date());
                              const isWknd = ci === 0 || ci === 6;
                              return (
                                <button
                                  key={ci}
                                  disabled={!cell.cur || past}
                                  onClick={() =>
                                    cell.cur &&
                                    !past &&
                                    setSelectedDate(cellDate)
                                  }
                                  className={`relative h-11 flex flex-col items-center justify-center transition-all ${
                                    cell.cur && !past
                                      ? "hover:bg-emerald-50 cursor-pointer"
                                      : "cursor-default"
                                  }`}
                                >
                                  <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                                      selected
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                                        : isToday
                                          ? "border-2 border-emerald-400 text-emerald-600"
                                          : !cell.cur
                                            ? "text-gray-300"
                                            : past
                                              ? "text-gray-300"
                                              : isWknd
                                                ? "text-rose-400"
                                                : "text-gray-700"
                                    }`}
                                  >
                                    {cell.day}
                                  </span>
                                  {isToday && !selected && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
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

                {/* ── TIME ── */}
                {currentStep === 2 && (
                  <div>
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                      {TIME_SLOTS.map((t) => {
                        const active = selectedTime === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold border transition-all ${
                              active
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100 scale-105"
                                : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                            }`}
                          >
                            <Clock
                              className={`w-3.5 h-3.5 ${active ? "text-white" : "text-gray-400"}`}
                              strokeWidth={2}
                            />
                            {t}
                          </button>
                        );
                      })}
                    </div>
                    {selectedDate && selectedTime && (
                      <div className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <Clock
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          strokeWidth={2}
                        />
                        <span className="text-sm font-semibold text-emerald-800">
                          {dateLabel} · {selectedTime}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── DETAILS ── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Purpose of visit
                      </p>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {VISIT_TYPES.map(({ label, Icon }) => {
                          const active = visitType === label;
                          return (
                            <button
                              key={label}
                              onClick={() => setVisitType(label)}
                              className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50"
                              }`}
                            >
                              <Icon
                                className={`w-4 h-4 shrink-0 ${active ? "text-emerald-600" : "text-gray-400"}`}
                                strokeWidth={1.8}
                              />
                              <span className="leading-tight">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Describe your concern
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Briefly describe your symptoms or reason for this appointment…"
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {description.length} chars
                      </p>
                    </div>
                  </div>
                )}

                {/* ── PAYMENT ── */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Payment method
                      </p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { key: "card", Icon: CreditCard, label: "Card" },
                          { key: "upi", Icon: Smartphone, label: "UPI" },
                          {
                            key: "cash",
                            Icon: Banknote,
                            label: "Cash at Clinic",
                          },
                        ].map((m) => (
                          <button
                            key={m.key}
                            onClick={() => setPayMethod(m.key)}
                            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
                              payMethod === m.key
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                            }`}
                          >
                            <m.Icon
                              className={`w-4 h-4 ${payMethod === m.key ? "text-emerald-600" : "text-gray-400"}`}
                              strokeWidth={1.8}
                            />
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {payMethod === "card" && (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          {
                            label: "Name on Card",
                            val: cardName,
                            set: setCardName,
                            ph: "John Doe",
                            type: "text",
                            span: true,
                          },
                          {
                            label: "Card Number",
                            val: cardNumber,
                            set: setCardNumber,
                            ph: "1234 5678 9012 3456",
                            type: "text",
                            span: true,
                          },
                          {
                            label: "Expiry",
                            val: expiry,
                            set: setExpiry,
                            ph: "MM / YY",
                            type: "text",
                            span: false,
                          },
                          {
                            label: "CVV",
                            val: cvv,
                            set: setCvv,
                            ph: "•••",
                            type: "password",
                            span: false,
                          },
                        ].map((f) => (
                          <div
                            key={f.label}
                            className={f.span ? "col-span-2" : ""}
                          >
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                              {f.label}
                            </label>
                            <input
                              type={f.type}
                              value={f.val}
                              onChange={(e) => f.set(e.target.value)}
                              placeholder={f.ph}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {payMethod === "upi" && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 flex items-center gap-3 text-sm text-gray-600">
                        <Smartphone
                          className="w-5 h-5 text-emerald-500 shrink-0"
                          strokeWidth={1.8}
                        />
                        You will be redirected to your UPI app after confirming.
                      </div>
                    )}

                    {payMethod === "cash" && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 flex items-center gap-3 text-sm text-gray-600">
                        <Building2
                          className="w-5 h-5 text-emerald-500 shrink-0"
                          strokeWidth={1.8}
                        />
                        Pay at the clinic reception before your appointment.
                      </div>
                    )}

                    {/* Summary */}
                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-5 py-5">
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
                        {selectedDate && (
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
                        {selectedTime && (
                          <SummaryRow
                            icon={
                              <Clock
                                className="w-4 h-4 text-emerald-500"
                                strokeWidth={1.8}
                              />
                            }
                            label={selectedTime}
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
                          />
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-2xl font-black text-emerald-600">
                          ${doctor.consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mt-5 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Nav */}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Back
              </button>
              <button
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
                    Processing…
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

function SummaryRow({ icon, label, sub }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="font-medium text-gray-800">
        {label}
        {sub && (
          <span className="text-gray-400 font-normal ml-1.5">· {sub}</span>
        )}
      </span>
    </div>
  );
}
