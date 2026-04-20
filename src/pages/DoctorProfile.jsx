// DoctorProfile.jsx
// Displays detailed doctor information with interactive appointment booking calendar
// Features: doctor profile sidebar, professional overview, services, and date picker

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Building2,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  BadgeCheck,
  Stethoscope,
  Heart,
  ClipboardList,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  ShieldCheck,
} from "lucide-react";

// ─── Configuration & Utilities ───
const API = "http://localhost:3000/api";
const cx = (...a) => a.filter(Boolean).join(" "); // Classname combiner (removes falsy values)
const getToken = () => localStorage.getItem("token") || "";
const authApi = () =>
  axios.create({ headers: { Authorization: `Bearer ${getToken()}` } }); // Authenticated API requests

// Day of week mapping: string labels and name-to-index conversion
const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAME_TO_INDEX = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Convert day value (number or string) to day-of-week index (0-6)
const normalizeScheduleDay = (value) => {
  const numericValue = Number(value);
  if (
    Number.isInteger(numericValue) &&
    numericValue >= 0 &&
    numericValue <= 6
  ) {
    return numericValue;
  }

  const key = String(value || "")
    .trim()
    .toLowerCase();
  return Object.prototype.hasOwnProperty.call(DAY_NAME_TO_INDEX, key)
    ? DAY_NAME_TO_INDEX[key]
    : null;
};
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DEFAULTS = {
  name: "—",
  specialty: "—",
  hospital: "—",
  location: "—",
  email: "—",
  rating: 0,
  reviews: 0,
  experience: "—",
  consultationFee: 0,
  about: "No biography provided.",
  qualifications: [],
  services: [],
  conditionsTreated: [],
  feeIncludes: [
    "Doctor consultation",
    "Digital prescription",
    "7-day follow-up chat",
  ],
  hospitals: [],
  consultationModes: ["In-person"],
};

// Main component: displays doctor profile with booking calendar
export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [doctor, setDoctor] = useState(null); // Doctor profile data
  const [schedules, setSchedules] = useState([]); // Available schedule slots
  const [booked, setBooked] = useState([]); // Booked appointment times
  const [loading, setLoading] = useState(true);

  // Calendar navigation: tracks the month being viewed
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Fetch doctor profile and schedules on mount
  useEffect(() => {
    const doctorId = Number(id);
    if (!Number.isInteger(doctorId) || doctorId <= 0) {
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        // Fetch doctor profile and available schedules in parallel
        const [drRes, schRes] = await Promise.allSettled([
          authApi().get(`${API}/doctors/${doctorId}`),
          authApi().get(`${API}/doctors/${doctorId}/schedules`),
        ]);

        if (!mounted) return;

        if (drRes.status === "fulfilled") {
          const d = drRes.value.data?.data || {};
          setDoctor(d);
        } else {
          console.error("Doctor fetch failed:", drRes.reason);
        }

        if (schRes.status === "fulfilled") {
          const rawSchedules = schRes.value.data?.data?.schedules || [];
          const rawBooked = schRes.value.data?.data?.booked_slots || [];
          setSchedules(rawSchedules);
          setBooked(rawBooked);
        } else {
          console.error("Schedules fetch failed:", schRes.reason);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Compute set of days with available schedules (used for calendar marking)
  const scheduledDows = useMemo(() => {
    return new Set(
      schedules
        .map((s) => {
          const d = normalizeScheduleDay(s?.day_of_week);
          return d;
        })
        .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6),
    );
  }, [schedules]);

  // Generate calendar grid: compute week rows and day cells with states
  const { calDays, monthLabel } = useMemo(() => {
    const y = calMonth.getFullYear();
    const m = calMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];

    // Pad start with previous month days (grayed out)
    for (let i = firstDow - 1; i >= 0; i--) {
      cells.push({ day: prevDays - i, cur: false, state: "outside" });
    }

    // Add days of current month with state: available/past/none
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const isPast = date < today;
      const dow = date.getDay();
      const hasSchedule = scheduledDows.has(dow);

      let state = "none"; // No schedule this day
      if (!isPast && hasSchedule) {
        state = "available"; // Has schedule and not in the past
      }
      if (isPast) state = "past"; // Past date (non-clickable)

      cells.push({ day: d, cur: true, state, date });
    }

    // Pad end with next month days to fill final week
    let tail = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ day: tail++, cur: false, state: "outside" });
    }

    // Group cells into weeks
    const weeks = [];
    for (let r = 0; r < cells.length / 7; r++) {
      weeks.push(cells.slice(r * 7, r * 7 + 7));
    }

    return {
      calDays: weeks,
      monthLabel: `${MONTH_NAMES[m]} ${y}`,
    };
  }, [calMonth, scheduledDows]);

  const d = doctor || {};
  const fullName = [d.first_name, d.last_name].filter(Boolean).join(" ");
  const displayName = fullName ? `Dr. ${fullName}` : DEFAULTS.name;
  const initials =
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DR";

  // Primary hospital from the hospitals array returned by the API
  const primaryHospital = Array.isArray(d.hospitals)
    ? d.hospitals.find((h) => h.is_primary) || d.hospitals[0]
    : null;

  const hospitalName = primaryHospital?.name || DEFAULTS.hospital;
  const hospitalAddr = [
    primaryHospital?.address_line1,
    primaryHospital?.city,
    primaryHospital?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const rating = Number(d.average_rating) || DEFAULTS.rating;
  const reviews = Number(d.total_reviews) || DEFAULTS.reviews;
  const experience =
    d.years_of_experience != null
      ? `${d.years_of_experience} yrs`
      : DEFAULTS.experience;
  const fee = Number(d.consultation_fee) || DEFAULTS.consultationFee;
  const bio = d.bio || DEFAULTS.about;
  const specialty = d.specialization_name || DEFAULTS.specialty;

  // Build qualifications: show license number if available
  const qualifications = d.license_number
    ? [`License No: ${d.license_number}`, "MBBS", "MD"]
    : ["MBBS", "MD"];

  const handleBookNow = () => {
    navigate("/book-appointment", {
      state: {
        doctor: {
          id: d.id,
          name: displayName,
          specialty,
          hospital: hospitalName,
          hospital_id: primaryHospital?.id || null,
          schedule_id: schedules[0]?.id || null,
          rating,
          reviews,
          consultationFee: fee,
          image: null,
        },
        schedules,
      },
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading doctor profile…</p>
        </div>
      </div>
    );
  }

  // ─── Render ───
  return (
    <div
      className="h-screen overflow-hidden bg-gradient-to-b from-emerald-50 to-white flex"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Sidebar: doctor profile info and credentials */}
      <aside className="w-80 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto">
        <div className="p-6">
          {/* Profile avatar and basic info */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-100">
              {initials}
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-0.5">
              {displayName}
            </h1>
            <p className="text-emerald-600 font-semibold text-sm">
              {specialty}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-800 text-sm">
                  {rating.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500">{reviews} reviews</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="font-bold text-gray-800 text-sm">{experience}</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100 col-span-2">
              <p className="font-bold text-emerald-600 text-lg">
                Rs {fee.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Consultation fee</p>
            </div>
          </div>

          {/* Hospital affiliation — from real API data */}
          <div className="mb-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Hospital Affiliation
            </p>
            {primaryHospital ? (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Building2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {hospitalName}
                  </p>
                  {hospitalAddr && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {hospitalAddr}
                    </p>
                  )}
                  {primaryHospital.is_primary && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Not specified</p>
            )}

            {/* All affiliated hospitals if more than one */}
            {Array.isArray(d.hospitals) && d.hospitals.length > 1 && (
              <div className="mt-2 space-y-1.5">
                {d.hospitals.slice(1).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-600"
                  >
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {h.name}
                    {h.city && (
                      <span className="text-gray-400">· {h.city}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Credentials / Education */}
          <div className="mb-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Credentials
            </p>
            <div className="space-y-1.5">
              {qualifications.map((q) => (
                <div
                  key={q}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          {d.email && (
            <div className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Contact
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{d.email}</span>
              </div>
            </div>
          )}

          {/* Consultation modes */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Available Modes
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULTS.consultationModes.map((mode) => (
                <span
                  key={mode}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-semibold"
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content: doctor details and booking calendar */}
      <div className="flex-1 h-screen overflow-y-auto">
        {/* Navigation and page title */}
        <div className="px-6 lg:px-10 pt-8 pb-4">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctors
          </Link>
        </div>

        {/* Page header */}
        <div className="text-center px-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Book Your <span className="text-emerald-600">Appointment</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Review the doctor's profile and choose a convenient time
          </p>
        </div>

        {/* Content grid: left side (info cards) and right side (calendar + booking) */}
        <div className="px-6 lg:px-10 pb-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Professional info, services, and inclusions */}
            <div className="space-y-5">
              {/* Professional overview card */}
              <InfoCard
                icon={<Stethoscope className="w-5 h-5" />}
                title="Professional Overview"
              >
                <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
              </InfoCard>

              {/* Services */}
              <InfoCard
                icon={<ClipboardList className="w-5 h-5" />}
                title="Services Offered"
              >
                <ul className="space-y-2">
                  {(DEFAULTS.services.length
                    ? DEFAULTS.services
                    : [
                        "General Consultation",
                        "Follow-up Visit",
                        "Prescription & Referral",
                        "Medical Certificate",
                      ]
                  ).map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </InfoCard>

              {/* Fee includes */}
              <InfoCard
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Consultation Includes"
              >
                <div className="flex flex-wrap gap-2">
                  {DEFAULTS.feeIncludes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </InfoCard>
            </div>

            {/* Right: Interactive calendar and booking summary */}
            <div className="space-y-5">
              {/* Calendar widget for date selection */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Calendar navigation and month display */}
                <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setCalMonth(
                        (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
                      )
                    }
                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="text-center">
                    <p className="text-white font-bold text-base">
                      {monthLabel}
                    </p>
                    <p className="text-emerald-200 text-xs mt-0.5">
                      {scheduledDows.size > 0
                        ? `Available: ${Array.from(scheduledDows)
                            .map((d) => DOW_LABELS[d])
                            .join(", ")}`
                        : "No schedule set"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setCalMonth(
                        (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
                      )
                    }
                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Day-of-week labels row */}
                <div className="grid grid-cols-7 bg-emerald-50 border-b border-emerald-100">
                  {DOW_LABELS.map((d) => (
                    <div
                      key={d}
                      className="py-2.5 text-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid: week rows and day cells */}
                <div className="p-4">
                  {calDays.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                      {/* Render each day cell with appropriate styling based on state */}
                      {week.map((cell, ci) => {
                        if (!cell.cur) {
                          // Outside current month — very faint
                          return (
                            <div
                              key={ci}
                              className="h-10 flex items-center justify-center"
                            >
                              <span className="text-xs text-gray-200">
                                {cell.day}
                              </span>
                            </div>
                          );
                        }

                        const isToday =
                          cell.date &&
                          cell.date.toDateString() ===
                            new Date().toDateString();

                        if (cell.state === "available") {
                          return (
                            <div
                              key={ci}
                              className="relative h-10 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-default"
                              title="Available"
                            >
                              <span
                                className={cx(
                                  "text-sm font-bold text-emerald-700",
                                  isToday && "underline",
                                )}
                              >
                                {cell.day}
                              </span>
                              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                            </div>
                          );
                        }

                        if (cell.state === "past") {
                          return (
                            <div
                              key={ci}
                              className="h-10 flex items-center justify-center rounded-xl"
                            >
                              <span className="text-xs text-gray-300">
                                {cell.day}
                              </span>
                            </div>
                          );
                        }

                        // state === "none" — no schedule this day
                        return (
                          <div
                            key={ci}
                            className="h-10 flex items-center justify-center rounded-xl"
                          >
                            <span
                              className={cx(
                                "text-sm text-gray-400",
                                isToday && "font-bold text-gray-600",
                              )}
                            >
                              {cell.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Calendar legend */}
                <div className="px-5 pb-4 flex items-center gap-5 border-t border-gray-50 pt-3">
                  <LegendItem
                    color="bg-emerald-200 border border-emerald-300"
                    label="Available"
                  />
                  <LegendItem color="bg-gray-100" label="No schedule" />
                  <LegendItem
                    color="bg-gray-50 border border-dashed border-gray-200"
                    label="Past"
                  />
                </div>
              </div>

              {/* Appointment summary with cost breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">
                  Booking Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <SummaryRow label="Doctor" value={displayName} />
                  <SummaryRow label="Specialty" value={specialty} />
                  <SummaryRow label="Hospital" value={hospitalName} />
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">
                      Consultation Fee
                    </span>
                    <span className="text-xl font-black text-emerald-600">
                      Rs {fee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proceed to booking wizard */}
              <button
                onClick={handleBookNow}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable info card component for displaying doctor details
function InfoCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
        <span className="text-emerald-500">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

// Booking summary row: label and value pair
function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="font-semibold text-gray-700 text-right">
        {value || "—"}
      </span>
    </div>
  );
}

// Calendar legend item: color swatch and label
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cx("w-4 h-4 rounded-md", color)} />
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    </div>
  );
}
