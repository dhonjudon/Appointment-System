import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Bell,
  ArrowUpDown,
  AlertCircle,
  Loader,
} from "lucide-react";
import logoImg from "../../assets/logoimage.png";

// ── API BASE URL ──────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000/api";

// generate week starting today
function getWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, to: "/" },
  { label: "Patients", Icon: Users, to: "/docotr/patients" },
  { label: "Appointments", Icon: CalendarDays, to: "/doctor/appointments" },
  { label: "Schedule Setup", Icon: Settings, to: "/doctor/schedule" },
];

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, setOpen, activePath, doctorData }) {
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

      {/* Nav */}
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

      {/* Doctor info */}
      {open ? (
        <div className="px-3 pb-4 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face"
              alt="doctor"
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {doctorData?.first_name && doctorData?.last_name
                  ? `Dr. ${doctorData.first_name} ${doctorData.last_name}`
                  : "Doctor"}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">
                {doctorData?.specialization_name || "Specialist"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-2 pb-4 shrink-0 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face"
            alt="doctor"
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100"
          />
        </div>
      )}
    </aside>
  );
}

// ── Doctor Dashboard ─────────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAZ, setSortAZ] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  // API State
  const [doctorData, setDoctorData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get doctorId from localStorage or URL
  const doctorId =
    localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [doctorId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch doctor panel data
      const panelRes = await fetch(`${API_BASE}/doctors/${doctorId}/panel`);
      if (!panelRes.ok) throw new Error("Failed to fetch doctor panel");
      const panelData = await panelRes.json();

      // Fetch doctor patients
      const patientsRes = await fetch(
        `${API_BASE}/doctors/${doctorId}/patients?page=1&limit=50`,
      );
      if (!patientsRes.ok) throw new Error("Failed to fetch patients");
      const patientsData = await patientsRes.json();

      // Fetch today's schedule
      const today = new Date().toISOString().split("T")[0];
      const scheduleRes = await fetch(
        `${API_BASE}/doctors/${doctorId}/appointments?date=${today}`,
      );
      if (!scheduleRes.ok) throw new Error("Failed to fetch schedule");
      const scheduleDataRes = await scheduleRes.json();

      setDoctorData(panelData.data?.doctor);
      setPatients(patientsData.data?.items || []);
      setScheduleData(scheduleDataRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  function getWeekDays() {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }

  // Generate schedule based on appointments
  function generateWeekSlots() {
    const weekDays = getWeekDays().map((d, i) => {
      const shifted = new Date(d);
      shifted.setDate(d.getDate() + weekOffset * 7);
      return shifted;
    });

    return weekDays.map((day) => {
      const dateStr = day.toISOString().split("T")[0];
      // Filter appointments for this day
      const dayAppts = (scheduleData?.items || []).filter(
        (appt) => appt.appointment_date === dateStr,
      );
      return dayAppts.map((appt) => ({
        patient: appt.patient_first_name
          ? `${appt.patient_first_name} ${appt.patient_last_name}`
          : "Patient",
        type: appt.status === "confirmed" ? "consult" : "followup",
        start: appt.start_time,
        end: appt.end_time,
      }));
    });
  }

  const weekDays = getWeekDays().map((d, i) => {
    const shifted = new Date(d);
    shifted.setDate(d.getDate() + weekOffset * 7);
    return shifted;
  });

  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
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

  const weekSlots = generateWeekSlots();

  const filtered = patients
    .filter((p) =>
      (p.first_name + " " + p.last_name)
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const aName = a.first_name + " " + a.last_name;
      const bName = b.first_name + " " + b.last_name;
      return sortAZ ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#DFF2EB]">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#DFF2EB]">
        <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-6 border border-red-200">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#DFF2EB]"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activePath="/"
        doctorData={doctorData}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div>
            <p className="text-[16px] text-gray-500 font-medium">
              Good morning !!
            </p>
            <h1 className="text-base font-extrabold text-gray-800">
              {doctorData?.first_name && doctorData?.last_name
                ? `Dr. ${doctorData.first_name} ${doctorData.last_name}`
                : "Doctor"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 font-medium">
              {dayNames[today.getDay()]}, {monthNames[today.getMonth()]}{" "}
              {today.getDate()}
            </span>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-500">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden gap-4 p-4">
          {/* LEFT: Doctor profile + schedule */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto ">
            {/* Doctor profile card */}
            <div className="bg-white rounded-2xl h-50 border border-gray-100 shadow-sm p-5 shrink-0">
              <div className="flex items-start gap-5">
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face"
                  alt={doctorData?.first_name}
                  className="w-40 h-40 rounded-2xl object-cover ring-2 ring-emerald-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-[35px] font-extrabold text-gray-800">
                    {doctorData?.first_name && doctorData?.last_name
                      ? `Dr. ${doctorData.first_name} ${doctorData.last_name}`
                      : "Doctor"}
                  </h2>
                  <p className="text-[20px] text-emerald-600 font-semibold mt-0.5">
                    {doctorData?.specialization_name || "Specialist"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-gray-700">
                      {doctorData?.average_rating || 0}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      ({doctorData?.total_reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* This week's schedule */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1 overflow-y-auto">
              <div className="flex flex-col justify-center justify-between mb-4">
                <div className="flex justify-between w-full items-center  gap-3">
                  <h3 className="text-xl font-extrabold text-gray-800">
                    This Week's Schedule
                  </h3>
                  {/* Legend */}
                  <div className="flex items-center mr-4 gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      Consult
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-300 inline-block" />
                      Follow-up
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 ">
                  <button
                    onClick={() => setWeekOffset((w) => w - 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-[16px] text-gray-500 font-semibold px-1">
                    Week{" "}
                    {weekOffset === 0 ? "" : weekOffset > 0 ? `` : weekOffset}
                  </span>
                  <button
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Time header */}
              <div className="flex ml-5">
                <div className="w-28 shrink-0" />
                <div className="flex-1  flex text-[14px] text-gray-500 font-semibold mb-2 overflow-hidden">
                  {[
                    "07:00",
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                  ].map((t) => (
                    <div key={t} className="flex-1 text-center">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-2">
                {weekDays.map((day, di) => {
                  const slots = weekSlots[di] || [];
                  const isToday =
                    day.getDate() === today.getDate() &&
                    day.getMonth() === today.getMonth() &&
                    day.getFullYear() === today.getFullYear();

                  return (
                    <div
                      key={di}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded-xl ${isToday ? "bg-emerald-50" : ""}`}
                    >
                      <div className="w-33 shrink-0">
                        <p
                          className={`text-[14px] font-bold ${isToday ? "text-emerald-700" : "text-gray-600"}`}
                        >
                          {dayNames[day.getDay()]} {monthNames[day.getMonth()]}{" "}
                          {day.getDate()} <br />
                          {isToday && (
                            <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                              Today
                            </span>
                          )}
                        </p>
                      </div>
                      {/* Slot bar */}
                      <div className="flex-1 relative h-8 bg-gray-50 rounded-lg overflow-hidden">
                        {slots.length === 0 && (
                          <span className="absolute inset-0 flex items-center pl-3 text-[15px] text-gray-400 font-medium">
                            No appointments
                          </span>
                        )}
                        {slots.map((slot, si) => {
                          const [sh, sm] = slot.start.split(":").map(Number);
                          const [eh, em] = slot.end.split(":").map(Number);
                          const startPct = ((sh - 8 + sm / 60) / 10) * 100;
                          const widthPct = Math.max(
                            ((eh - sh + (em - sm) / 60) / 10) * 100,
                            8,
                          );

                          const typeStyle =
                            slot.type === "consult"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200";

                          return (
                            <div
                              key={si}
                              className={`absolute w-fit top-1 h-6 rounded-md flex items-center px-2 text-[13px] font-bold whitespace-nowrap overflow-hidden ${typeStyle}`}
                              style={{
                                left: `${startPct}%`,
                                width: `${widthPct}%`,
                              }}
                              title={`${slot.patient} — ${slot.type} (${slot.start})`}
                            >
                              {slot.patient}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Patient list */}
          <div className="w-90 shrink-0 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[25px] font-extrabold text-gray-800">
                  Patients
                </h3>
                <span className="text-[15px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              </div>
              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-13 pl-8 pr-3 py-1.5 text-xs rounded-[20px] bg-gray-50 border border-gray-300 outline-none focus:border-emerald-300 focus:ring-1 focus:ring-emerald-100 transition placeholder-gray-400"
                />
              </div>
              {/* Sort */}
              <button
                onClick={() => setSortAZ(!sortAZ)}
                className="flex items-center gap-1.5 text-[13px] text-gray-500 font-semibold hover:text-emerald-700 transition"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortAZ ? "A → Z" : "Z → A"}
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filtered.map((p) => (
                <div
                  key={p.user_id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#DFF2EB]/60 transition cursor-pointer group"
                >
                  <img
                    src="https://i.pravatar.cc/80?img=11"
                    alt={p.first_name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-emerald-100"
                  />
                  <div className="min-w-0">
                    <p className="text-[18px] font-bold text-gray-800 truncate group-hover:text-emerald-700 transition">
                      {p.first_name} {p.last_name}
                    </p>
                    <p className="text-[13px] text-gray-400 font-medium truncate">
                      {p.total_visits} visit{p.total_visits !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
