import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  getDay,
} from "date-fns";
import logoImg from "../../assets/logoimage.png";

// ── API BASE URL ──────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000/api";

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, to: "/" },
  { label: "Patients", Icon: Users, to: "/doctor/patients" },
  { label: "Appointments", Icon: CalendarDays, to: "/doctor/appointments" },
  { label: "Schedule Setup", Icon: Settings, to: "/doctor/schedule" },
];

// ── color config ──────────────────────────────────────────────────────────────
const TYPE = {
  consult: {
    dot: "bg-emerald-500",
    icon: "bg-emerald-100 border border-emerald-300",
    iconDot: "bg-emerald-500",
    card: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Consult",
  },
  followup: {
    dot: "bg-teal-400",
    icon: "bg-teal-100 border border-teal-300",
    iconDot: "bg-teal-400",
    card: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    label: "Follow-up",
  },
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM → 8 PM

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, setOpen, activePath, doctorData }) {
  const defaultDoctor = {
    avatar: logoImg,
    name: "Dr. Medical",
    specialty: "General",
  };
  const doctor = doctorData || defaultDoctor;
  return (
    <aside
      className="shrink-0 bg-white border-r border-gray-100 h-screen flex flex-col shadow-sm transition-all duration-300 overflow-hidden"
      style={{ width: open ? "260px" : "60px" }}
    >
      {/* Brand */}
      <div
        className={`flex items-center h-16 border-b border-gray-50 px-4 shrink-0 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        {open && (
          <img
            src={logoImg}
            alt="Swastha Sewa Logo"
            className="h-10 md:h-[3.8rem]"
          />
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition shrink-0"
        >
          {open ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, Icon, to }) => {
          const active = activePath === to;
          return (
            <a
              key={to}
              href={to}
              title={!open ? label : undefined}
              className={`flex items-center gap-3 rounded-xl transition-all duration-150 group relative ${
                open ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
              } ${
                active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon
                className={`shrink-0 ${open ? "w-4 h-4" : "w-5 h-5"} ${
                  active
                    ? "text-emerald-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              {open && (
                <span className="text-sm font-semibold truncate">{label}</span>
              )}
              {open && active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
              {!open && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                  {label}
                </div>
              )}
            </a>
          );
        })}
      </nav>
      {open ? (
        <div className="px-3 pb-4 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <img
              src={doctor.avatar}
              alt="doctor"
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {doctor.name}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">
                {doctor.specialty}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-2 pb-4 shrink-0 flex justify-center">
          <img
            src={doctor.avatar}
            alt="doctor"
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100"
          />
        </div>
      )}
    </aside>
  );
}

// ── Mini Calendar (right) ─────────────────────────────────────────────────────
function MiniCalendar({ selectedDate, setSelectedDate, appointments }) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const today = new Date();

  const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  const hasAppt = (day) =>
    !!appointments && !!appointments[format(day, "yyyy-MM-dd")];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-[429px] shrink-0">
      {/* Month nav */}
      <div className="flex items-center justify-between border-b-2 border-[#A7A7A7] py-3 mb-2">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-[18px] font-extrabold text-gray-800">
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1 ">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[14px] font-bold text-[#51C833] py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTod = isToday(day);
          const inMonth = isSameMonth(day, viewMonth);
          const hasA = hasAppt(day);
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`relative w-[40px] h-[40px] m-1 flex flex-col items-center justify-center rounded-full text-[16px] font-light transition-all
                ${isSelected ? "bg-[#51C833] text-white shadow-sm" : isTod ? "bg-emerald-100 text-emerald-700" : inMonth ? "text-gray-700 hover:bg-emerald-50" : "text-gray-300"}
              `}
            >
              {format(day, "d")}
              {hasA && !isSelected && (
                <span
                  className={`absolute bottom-0.5 w-[6px] h-[6px] rounded-full ${isTod ? "bg-[#51C833]" : "bg-[#51C833]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Left Time Schedule ────────────────────────────────────────────────────────
function TimeSchedule({ selectedDate, appointments }) {
  const [expandedId, setExpandedId] = useState(null);
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const appts = appointments[dateKey] || [];

  const getApptAtHour = (hour) => appts.find((a) => a.hour === hour);

  return (
    <div className="flex flex-col gap-0">
      {HOURS.map((hour) => {
        const appt = getApptAtHour(hour);
        const expanded = expandedId === appt?.id;
        const t = appt ? TYPE[appt.type] : null;

        return (
          <div
            key={hour}
            className="flex flex-row items-center gap-3 mt-5 relative min-h-[44px]  group"
          >
            {/* Time label */}
            <div className="w-14 shrink-0  text-[13px] text-gray-600 font-semibold text-right">
              {hour}:00
            </div>

            {/* Line + content */}
            {/* <div className="flex-1 flex flex-col relative pt-3 "> */}
            <div
              className={` relative w-full border-t-2 border-dashed ${appt ? "border-black" : "border-gray-200"}`}
            >
              {appt && (
                <div
                  className={`absolute   ${expanded ? "-top-13 right-100" : "-top-3 right-1/2"} `}
                >
                  <div
                    className={`relative w-full cursor-pointer rounded-xl  transition-all duration-200 overflow-hidden
                    ${expanded ? `${t.card} p-3 mt-1 mb-1` : " inline-flex"}`}
                    onClick={() => setExpandedId(expanded ? null : appt.id)}
                  >
                    {!expanded ? (
                      // Collapsed: just the dot icon
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${t.icon}`}
                        title={`${appt.patient} — ${t.label}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${t.iconDot}`}
                        ></div>
                      </div>
                    ) : (
                      // Expanded card
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-extrabold text-gray-800">
                              {appt.patient}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${t.badge}`}
                            >
                              {t.label}
                            </span>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <p className="text-[11px] text-gray-500 font-semibold">
                              {hour < 12
                                ? `${hour}:00 AM`
                                : hour === 12
                                  ? "12:00 PM"
                                  : `${hour - 12}:00 PM`}
                            </p>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 rotate-180 mt-1" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          {appt.desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Appointments Page ─────────────────────────────────────────────────────
export default function DoctorAppointments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("day"); // "day" | "month"
  const [appointments, setAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorData, setDoctorData] = useState(null);

  const doctorId =
    localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

  // sliding date strip
  const [stripStart, setStripStart] = useState(new Date());
  const STRIP_LEN = 15;
  const stripDays = Array.from({ length: STRIP_LEN }, (_, i) =>
    addDays(stripStart, i),
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    fetchDoctorInfo();
    fetchAppointments();
  }, [doctorId, selectedDate]);

  const fetchDoctorInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/doctors/${doctorId}`);
      if (res.ok) {
        const data = await res.json();
        setDoctorData({
          name: `${data.data.user.first_name || "Dr."} ${data.data.user.last_name || "Medical"}`,
          specialty: data.data.specialization?.name || "General",
          avatar: logoImg,
        });
      }
    } catch (err) {
      console.error("Failed to fetch doctor info:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch(
        `${API_BASE}/doctors/${doctorId}/appointments?date=${dateStr}&page=1&limit=100`,
      );

      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data = await res.json();
      const apptsByDate = {};

      (data.data?.items || []).forEach((appt) => {
        const date = appt.appointment_date;
        if (!apptsByDate[date]) apptsByDate[date] = [];
        const hour = parseInt(appt.start_time.split(":")[0]);
        apptsByDate[date].push({
          id: appt.id,
          patient: `${appt.patient_first_name || "Patient"} ${appt.patient_last_name || ""}`,
          type: appt.status === "confirmed" ? "consult" : "followup",
          hour,
          desc: appt.reason || "Appointment",
          start_time: appt.start_time,
          end_time: appt.end_time,
        });
      });

      setAppointments(apptsByDate);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const apptCount = (appointments[dateKey] || []).length;

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#DFF2EB]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-6">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading appointments...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-6 border border-red-200">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-gray-700 font-medium">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activePath="/appointments"
        doctorData={doctorData}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-base font-extrabold text-gray-800">
              My Appointments
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Manage your schedule
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View toggle */}

            <span className="text-sm text-gray-400 font-medium">
              {format(today, "EEE, MMM d")}
            </span>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-500">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden gap-4 p-4">
          {/* LEFT: Schedule view */}
          <div className="flex-1 bg-white rounded-2xl flex flex-col gap-3 overflow-hidden min-w-0">
            {/* Month and date strip */}
            <div className="bg-white rounded-2xl px-5 py-4 shrink-0">
              {/* Selected date header with legend */}
              <div className="flex items-center justify-between px-1 shrink-0 mb-4">
                <div>
                  <p className="text-[18px] font-bold text-gray-800">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3">
                  {Object.entries(TYPE).map(([key, val]) => (
                    <span
                      key={key}
                      className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${val.dot}`} />
                      {val.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Month selector */}
              <div className="flex justify-center gap-4 overflow-x-auto scrollbar-hide mb-3">
                {months.map((m, idx) => {
                  const isActive =
                    selectedDate.getMonth() === idx &&
                    selectedDate.getFullYear() === today.getFullYear();
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        const d = new Date(selectedDate);
                        d.setMonth(idx);
                        setSelectedDate(d);
                      }}
                      className={`text-[16px] font-bold shrink-0 transition ${
                        isActive
                          ? "text-[#51C833] hover:text-white hover:bg-[#51C833]"
                          : "text-[#A7A7A7] hover:text-gray-500 hover:bg-[#DFF2EB]"
                      } cursor-pointer px-3 py-1 rounded-full`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              {/* Date strip slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStripStart(subDays(stripStart, 8))}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex-1 flex justify-between overflow-hidden gap-1">
                  {stripDays.map((day, i) => {
                    const isSel = isSameDay(day, selectedDate);
                    const isTod = isToday(day);
                    const hasA = !!appointments[format(day, "yyyy-MM-dd")];
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-[12px] text-gray-600 font-bold">
                          {format(day, "EEE")}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                            isSel
                              ? "bg-[#51C833] text-white shadow-md"
                              : isTod
                                ? "bg-emerald-100 text-[#51C833]"
                                : "text-gray-600 hover:bg-[#DFF2EB]"
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                        {hasA && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSel ? "bg-[#51C833]" : "bg-[#51C833]"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setStripStart(addDays(stripStart, 8))}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable time schedule */}
            <div className="flex-1 overflow-y-auto bg-white rounded-2xl border-t border-gray-100 shadow-sm px-5 py-4">
              <TimeSchedule
                selectedDate={selectedDate}
                appointments={appointments}
              />
            </div>
          </div>

          {/* RIGHT: Mini calendar */}
          <div className="flex flex-col gap-4 shrink-0">
            <MiniCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              appointments={appointments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
