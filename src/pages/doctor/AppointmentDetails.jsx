import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Check,
  AlertCircle,
  Save,
  Info,
  X,
  Stethoscope,
  Tag,
  Calendar,
  Repeat,
  PanelLeftClose,
  PanelLeftOpen,
  Loader,
} from "lucide-react";
import logo from "../../assets/logoimage.png";
import logoShort from "../../assets/logo.png";

// ── API BASE URL ──────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000/api";

/* ─────────────────────── nav items ─────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, to: "/doctor/dashboard" },
  { label: "Appointment Setup", Icon: CalendarDays, to: "/doctor/setup" },
  { label: "Patients", Icon: Users, to: "/doctor/patients" },
  {
    label: "Appointment Details",
    Icon: ClipboardList,
    to: "/doctor/appointments",
  },
];

const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_ABBR = ["S", "M", "T", "W", "T", "F", "S"];

const newSlot = () => ({
  id: crypto.randomUUID(),
  start: "09:00",
  end: "17:00",
  maxPatients: 10,
});

const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
};

const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
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

/* ═══════════════════════════════════════════════════════ */
export default function AppointmentSetup() {
  const location = useLocation();

  /* ── sidebar collapsed state ── */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ── mode: "day" | "date" ── */
  const [mode, setMode] = useState("day");

  /* ── calendar ── */
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  /* ── schedules ── */
  const [daySchedules, setDaySchedules] = useState({});
  const [dateSchedules, setDateSchedules] = useState({});

  /* ── ui state ── */
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const doctorId =
    localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

  /* ── Initialize data on mount ── */
  useEffect(() => {
    if (doctorId) {
      fetchExistingSchedules();
    }
  }, [doctorId]);

  const fetchExistingSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/doctors/${doctorId}/schedules`);
      if (!res.ok) throw new Error("Failed to fetch schedules");

      const data = await res.json();
      // Parse existing schedules from API if needed
      setLoading(false);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setLoading(false);
    }
  };

  const saveSchedules = async () => {
    try {
      setLoading(true);
      setSaveError(null);

      // Save day schedules
      for (const [day, slots] of Object.entries(daySchedules)) {
        for (const slot of slots) {
          const res = await fetch(
            `${API_BASE}/doctors/${doctorId}/availability`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "day",
                day_of_week: parseInt(day),
                start_time: slot.start,
                end_time: slot.end,
                max_patients: slot.maxPatients,
                slot_duration_minutes: 30,
              }),
            },
          );
          if (!res.ok) throw new Error("Failed to save day schedule");
        }
      }

      // Save date-specific schedules
      for (const [dateKey, slots] of Object.entries(dateSchedules)) {
        for (const slot of slots) {
          const res = await fetch(
            `${API_BASE}/doctors/${doctorId}/availability`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "date",
                specific_date: dateKey,
                start_time: slot.start,
                end_time: slot.end,
                max_patients: slot.maxPatients,
                slot_duration_minutes: 30,
              }),
            },
          );
          if (!res.ok) throw new Error("Failed to save date schedule");
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setLoading(false);
    } catch (err) {
      console.error("Error saving schedules:", err);
      setSaveError(err.message);
      setLoading(false);
    }
  };

  /* ─── calendar grid ─── */
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

  /* ─── slot helpers ─── */
  const getSlotsFor = (key, isDay) =>
    (isDay ? daySchedules : dateSchedules)[key] || [];
  const setSlotsFor = (key, isDay, slots) => {
    if (isDay) setDaySchedules((p) => ({ ...p, [key]: slots }));
    else setDateSchedules((p) => ({ ...p, [key]: slots }));
  };
  const addSlot = (key, isDay) =>
    setSlotsFor(key, isDay, [...getSlotsFor(key, isDay), newSlot()]);
  const removeSlot = (key, isDay, id) =>
    setSlotsFor(
      key,
      isDay,
      getSlotsFor(key, isDay).filter((s) => s.id !== id),
    );
  const updateSlot = (key, isDay, id, field, value) =>
    setSlotsFor(
      key,
      isDay,
      getSlotsFor(key, isDay).map((s) =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    );

  /* ─── active key ─── */
  const activeKey =
    mode === "day"
      ? selectedDays.length === 1
        ? selectedDays[0]
        : null
      : selectedDate
        ? toISODate(selectedDate)
        : null;
  const activeSlots =
    activeKey != null ? getSlotsFor(activeKey, mode === "day") : [];

  /* ─── toggle day / date click ─── */
  const toggleDay = (dow) => {
    setSelectedDays((prev) =>
      prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow],
    );
    setSelectedDate(null);
  };
  const handleDateClick = (cellDate) => {
    if (mode === "day") toggleDay(cellDate.getDay());
    else {
      setSelectedDate(cellDate);
      setSelectedDays([]);
    }
  };

  /* ─── validate & save ─── */
  const validate = () => {
    const errs = {};
    const checkSlots = (slots, key) =>
      slots.forEach((s, i) => {
        if (s.start >= s.end)
          errs[`${key}-${i}`] = "End time must be after start time";
      });
    Object.entries(daySchedules).forEach(([k, v]) => checkSlots(v, `day-${k}`));
    Object.entries(dateSchedules).forEach(([k, v]) =>
      checkSlots(v, `date-${k}`),
    );
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSave = async () => {
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  /* ─── summary ─── */
  const configuredDays = Object.entries(daySchedules).filter(
    ([, v]) => v.length > 0,
  );
  const configuredDates = Object.entries(dateSchedules).filter(
    ([, v]) => v.length > 0,
  );

  /* ─── cell highlight ─── */
  const getCellHighlight = (cell) => {
    if (!cell.cur) return null;
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const cellDate = new Date(y, m, cell.day);
    const dow = cellDate.getDay();
    const iso = toISODate(cellDate);
    if (mode === "date") {
      if (isSameDay(cellDate, selectedDate)) return "selected";
      if (dateSchedules[iso]?.length > 0) return "has-date-override";
      if (daySchedules[dow]?.length > 0) return "has-day";
    } else {
      if (selectedDays.includes(dow)) return "selected";
      if (daySchedules[dow]?.length > 0) return "has-day";
    }
    return null;
  };

  /* ════════════ render ════════════ */
  return (
    <div
      className="h-screen flex overflow-hidden bg-gray-50"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ══════════ SIDE NAVBAR ══════════ */}
      <aside
        className="shrink-0 bg-white border-r border-gray-100 h-screen flex flex-col shadow-sm transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: sidebarOpen ? "256px" : "64px" }}
      >
        {/* Brand row */}
        <div
          className={`flex items-center h-[65px] border-b border-gray-50 px-4 shrink-0 ${sidebarOpen ? "gap-2.5 justify-between" : "justify-center"}`}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 min-w-0">
              {/* <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
                <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
               */}
              <img src={logo} alt="" />
            </div>
          )}
          {!sidebarOpen && (
            <img
              src={logoShort}
              alt=""
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer"
            />
          )}
          {/* Toggle button — only show when open; collapsed version is in the header */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition shrink-0"
            >
              <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-5 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(({ label, Icon, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={!sidebarOpen ? label : undefined}
                className={`flex items-center gap-3 rounded-xl transition-all duration-150 group relative ${
                  sidebarOpen ? "px-4 py-2.5" : "px-0 py-2.5 justify-center"
                } ${
                  active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon
                  className={`shrink-0 transition-all ${
                    sidebarOpen ? "w-4 h-4" : "w-5 h-5"
                  } ${active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
                {sidebarOpen && active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
                {/* Tooltip when collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Doctor info */}
        {sidebarOpen && (
          <div className="px-4 pb-5 shrink-0">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop&crop=face"
                alt="doctor"
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">
                  Dr. Priya Sharma
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  Cardiologist
                </p>
              </div>
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div className="px-2 pb-5 shrink-0 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop&crop=face"
              alt="doctor"
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100"
            />
          </div>
        )}
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0 bg-gradient-to-t from-emerald-200 to-emerald-50">
        {/* Page header */}
        <header className="bg-emerald-0  px-6 py-4 flex items-center justify-between sticky top-0 z-20 gap-4">
          <div className="flex items-center gap-3">
            {/* Expand button — shown when sidebar is collapsed */}
            {/* {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <PanelLeftOpen className="w-4 h-4" strokeWidth={2} />
              </button>
            )} */}
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Appointment Setup
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure your availability schedule
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Schedule saved
              </div>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-100 transition"
            >
              <Save className="w-4 h-4" strokeWidth={2.5} />
              Save Schedule
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="p-6 flex-1">
          {/* 60 / 40 split */}
          <div className="flex gap-5 h-full items-start">
            {/* ══ LEFT 60% ══ */}
            <div className="flex flex-col gap-4" style={{ flex: "0 0 40%" }}>
              {/* Mode toggle */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1.5">
                <button
                  onClick={() => {
                    setMode("day");
                    setSelectedDate(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    mode === "day"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Repeat
                    className={`w-4 h-4 ${mode === "day" ? "text-white" : "text-gray-400"}`}
                    strokeWidth={2}
                  />
                  By Weekday
                  {mode === "day" && (
                    <span className="ml-1 bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      RECURRING
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setMode("date");
                    setSelectedDays([]);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    mode === "date"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Tag
                    className={`w-4 h-4 ${mode === "date" ? "text-white" : "text-gray-400"}`}
                    strokeWidth={2}
                  />
                  By Date
                  {mode === "date" && (
                    <span className="ml-1 bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      OVERRIDE
                    </span>
                  )}
                </button>
              </div>

              {/* Mode hint */}
              <div
                className={`flex items-start gap-2 px-4 py-3 rounded-xl text-xs leading-relaxed border ${
                  mode === "day"
                    ? "bg-blue-50 border-blue-100 text-blue-700"
                    : "bg-amber-50 border-amber-100 text-amber-700"
                }`}
              >
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={2} />
                {mode === "day"
                  ? "Select one or more weekdays. The schedule repeats every week for those days."
                  : "Select a specific date. This overrides any weekday schedule for that day only."}
              </div>

              {/* Weekday quick-select */}
              {mode === "day" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Quick Select
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS_ABBR.map((abbr, dow) => {
                      const selected = selectedDays.includes(dow);
                      const hasSlots = (daySchedules[dow]?.length ?? 0) > 0;
                      return (
                        <button
                          key={dow}
                          onClick={() => toggleDay(dow)}
                          className={`relative flex flex-col items-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                            selected
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                              : hasSlots
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          }`}
                        >
                          {abbr}
                          {hasSlots && !selected && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Month header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        (d) => new Date(d.getFullYear(), d.getMonth() - 1),
                      )
                    }
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="text-sm font-bold text-gray-800">
                    {monthLabel}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        (d) => new Date(d.getFullYear(), d.getMonth() + 1),
                      )
                    }
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                  {WEEKDAYS_SHORT.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[10px] font-bold uppercase tracking-wide pb-2 text-gray-600"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="px-3 pb-4 space-y-1 text-">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1 ">
                      {week.map((cell, ci) => {
                        const y = currentMonth.getFullYear();
                        const m = currentMonth.getMonth();
                        const past = cell.cur && isPast(y, m, cell.day);
                        const cellDate = cell.cur
                          ? new Date(y, m, cell.day)
                          : null;
                        const highlight = cell.cur
                          ? getCellHighlight(cell)
                          : null;
                        const isToday =
                          cell.cur && isSameDay(cellDate, new Date());

                        // Build cell classes — rounded-xl rectangles matching quick-select style
                        let cellCls =
                          "relative h-9 flex items-center justify-center rounded-xl text-[16px] font-semibold transition-all ";
                        let numCls = "";

                        if (!cell.cur) {
                          cellCls += "cursor-default";
                          numCls = "text-gray-200";
                        } else if (past && mode === "date") {
                          cellCls += "cursor-default";
                          numCls = "text-gray-300";
                        } else if (highlight === "selected") {
                          cellCls +=
                            "bg-emerald-500 shadow-md shadow-emerald-200 cursor-pointer";
                          numCls = "text-white font-bold";
                        } else if (highlight === "has-date-override") {
                          cellCls +=
                            "bg-amber-100 border border-amber-300 cursor-pointer hover:bg-amber-200";
                          numCls = "text-amber-800 font-bold";
                        } else if (highlight === "has-day") {
                          cellCls +=
                            "bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100";
                          numCls = "text-emerald-700 font-bold";
                        } else {
                          // No schedule set — gray numbers, no colored background
                          cellCls += "cursor-pointer hover:bg-gray-100 ";
                          numCls = "text-gray-400";
                        }

                        return (
                          <button
                            key={ci}
                            disabled={!cell.cur || (mode === "date" && past)}
                            onClick={() =>
                              cell.cur &&
                              !(mode === "date" && past) &&
                              handleDateClick(cellDate)
                            }
                            className={cellCls}
                          >
                            <span className={numCls}>{cell.day}</span>
                            {isToday && highlight !== "selected" && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                            )}
                            {highlight === "has-date-override" && (
                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="border-t border-gray-50 px-5 py-3 flex items-center gap-5 flex-wrap ">
                  <LegendChip
                    color="bg-emerald-50 border border-emerald-200 text-emerald-700"
                    label="Weekday set"
                  />
                  <LegendChip
                    color="bg-amber-100 border border-amber-300 text-amber-700"
                    label="Date override"
                  />
                  <LegendChip
                    color="bg-emerald-500 text-white"
                    label="Selected"
                  />
                </div>
              </div>

              {/* Active schedule summary */}
              {(configuredDays.length > 0 || configuredDates.length > 0) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Active Schedule
                  </p>
                  <div className="space-y-2">
                    {configuredDays.map(([dow, slots]) => (
                      <div
                        key={dow}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {WEEKDAYS_ABBR[dow]}
                          </span>
                          <span className="font-medium text-gray-700">
                            {WEEKDAYS_FULL[dow]}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {slots.length} slot{slots.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                    {configuredDates.map(([iso, slots]) => (
                      <div
                        key={iso}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" strokeWidth={2.5} />
                          </span>
                          <span className="font-medium text-gray-700">
                            {new Date(iso + "T00:00").toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {slots.length} slot{slots.length !== 1 ? "s" : ""} ·
                          override
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ══ RIGHT 40% ══ */}
            <div
              className="flex flex-col gap-4 min-w-0"
              style={{ flex: "0 0 60%" }}
            >
              {/* No selection placeholder */}
              {activeKey === null &&
                !(mode === "day" && selectedDays.length > 1) && (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                      {mode === "day" ? (
                        <Repeat
                          className="w-7 h-7 text-emerald-300"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <Calendar
                          className="w-7 h-7 text-emerald-300"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                    <p className="text-base font-semibold text-gray-500">
                      {mode === "day"
                        ? "Select a weekday to configure"
                        : "Click a date on the calendar"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 max-w-xs px-4">
                      {mode === "day"
                        ? "Choose one or more days from the quick-select or click days on the calendar"
                        : "Date-specific schedules override your weekday defaults for that day only"}
                    </p>
                  </div>
                )}

              {/* Multi-day banner */}
              {mode === "day" && selectedDays.length > 1 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                  <Info
                    className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      {selectedDays.length} days selected:{" "}
                      {selectedDays
                        .slice()
                        .sort()
                        .map((d) => WEEKDAYS_FULL[d])
                        .join(", ")}
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Slots are configured individually per day below.
                    </p>
                  </div>
                </div>
              )}

              {/* Single-day / single-date editor */}
              {activeKey !== null && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {mode === "day" ? (
                        selectedDays
                          .slice()
                          .sort()
                          .map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200"
                            >
                              <Repeat className="w-3 h-3" strokeWidth={2.5} />
                              {WEEKDAYS_FULL[d]}
                            </span>
                          ))
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200">
                          <Tag className="w-3 h-3" strokeWidth={2.5} />
                          {new Date(activeKey + "T00:00").toLocaleDateString(
                            "en-US",
                            { weekday: "long", month: "long", day: "numeric" },
                          )}
                          <span className="ml-1 bg-amber-200 rounded px-1 text-[9px]">
                            OVERRIDE
                          </span>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (mode === "day" && selectedDays.length > 1) {
                          const s = newSlot();
                          const updates = {};
                          selectedDays.forEach((d) => {
                            updates[d] = [
                              ...(daySchedules[d] || []),
                              { ...s, id: crypto.randomUUID() },
                            ];
                          });
                          setDaySchedules((p) => ({ ...p, ...updates }));
                        } else {
                          addSlot(activeKey, mode === "day");
                        }
                      }}
                      className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition shrink-0"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                      Add Slot
                    </button>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {activeSlots.map((slot, idx) => (
                      <SlotRow
                        key={slot.id}
                        slot={slot}
                        idx={idx}
                        error={
                          errors[
                            `${mode === "day" ? "day" : "date"}-${activeKey}-${idx}`
                          ]
                        }
                        onUpdate={(field, value) =>
                          updateSlot(
                            activeKey,
                            mode === "day",
                            slot.id,
                            field,
                            value,
                          )
                        }
                        onRemove={() =>
                          removeSlot(activeKey, mode === "day", slot.id)
                        }
                      />
                    ))}
                    {activeSlots.length === 0 && (
                      <div className="px-6 py-10 text-center">
                        <Clock
                          className="w-8 h-8 text-gray-200 mx-auto mb-2"
                          strokeWidth={1.5}
                        />
                        <p className="text-sm text-gray-400">
                          No time slots yet. Click "Add Slot" to begin.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Multi-day individual editors */}
              {mode === "day" && selectedDays.length > 1 && (
                <div className="space-y-4">
                  {selectedDays
                    .slice()
                    .sort()
                    .map((dow) => {
                      const slots = daySchedules[dow] || [];
                      return (
                        <div
                          key={dow}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                          <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
                              <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                                {WEEKDAYS_ABBR[dow]}
                              </span>
                              {WEEKDAYS_FULL[dow]}
                            </span>
                            <button
                              onClick={() => addSlot(dow, true)}
                              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                            >
                              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Add Slot
                            </button>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {slots.map((slot, idx) => (
                              <SlotRow
                                key={slot.id}
                                slot={slot}
                                idx={idx}
                                compact
                                onUpdate={(field, value) =>
                                  updateSlot(dow, true, slot.id, field, value)
                                }
                                onRemove={() => removeSlot(dow, true, slot.id)}
                              />
                            ))}
                            {slots.length === 0 && (
                              <div className="px-5 py-5 text-center">
                                <p className="text-xs text-gray-400">
                                  No slots — click Add Slot
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Override notice */}
              {mode === "date" &&
                activeKey &&
                (() => {
                  const dow = new Date(activeKey + "T00:00").getDay();
                  const daySlots = daySchedules[dow] || [];
                  if (daySlots.length === 0) return null;
                  return (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                      <AlertCircle
                        className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                        strokeWidth={2}
                      />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">
                          {WEEKDAYS_FULL[dow]} has a recurring schedule
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          {daySlots
                            .map(
                              (s) => `${fmtTime(s.start)} – ${fmtTime(s.end)}`,
                            )
                            .join(", ")}
                          {" · "}Slots added here override the default for this
                          date only.
                        </p>
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Slot Row ─── */
function SlotRow({ slot, idx, onUpdate, onRemove, error, compact }) {
  return (
    <div
      className={`${compact ? "px-5 py-3" : "px-6 py-5"} flex items-start gap-3`}
    >
      <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[11px] font-bold text-emerald-600 shrink-0 mt-0.5">
        {idx + 1}
      </div>
      <div className="flex-1 grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Start
          </label>
          <div className="relative">
            <Clock
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300"
              strokeWidth={2}
            />
            <input
              type="time"
              value={slot.start}
              onChange={(e) => onUpdate("start", e.target.value)}
              className="w-full pl-8 pr-2 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            End
          </label>
          <div className="relative">
            <Clock
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300"
              strokeWidth={2}
            />
            <input
              type="time"
              value={slot.end}
              onChange={(e) => onUpdate("end", e.target.value)}
              className="w-full pl-8 pr-2 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Max Pts
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={slot.maxPatients}
            onChange={(e) =>
              onUpdate("maxPatients", parseInt(e.target.value) || 1)
            }
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50 transition"
          />
        </div>
        {!compact && slot.start && slot.end && (
          <div className="col-span-3">
            {error ? (
              <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                {error}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 w-fit">
                <Check className="w-3 h-3" strokeWidth={2.5} />
                {fmtTime(slot.start)} – {fmtTime(slot.end)} · up to{" "}
                {slot.maxPatients} patient{slot.maxPatients !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        className="w-6 h-6 rounded-lg hover:bg-gray-100 border border-transparent flex items-center justify-center text-gray-300 hover:text-gray-500 transition mt-0.5 shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

/* ─── Legend chip (rectangle style) ─── */
function LegendChip({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`px-5 py-1 rounded-md text-[12px] font-bold ${color}`}>
        {label}
      </span>
    </div>
  );
}
