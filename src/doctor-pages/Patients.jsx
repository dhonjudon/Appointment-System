import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import logoImg from "../assets/logoimage.png";
import { NotificationBell } from "../components/NotificationBell";

const API_BASE_URL = "http://localhost:3000/api";

const NAV_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, to: "/doctor/dashboard" },
  { label: "Patients", Icon: Users, to: "/doctor/patients" },
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
          <Link
            to="/doctor/profile"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition"
          >
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
          </Link>
        </div>
      ) : (
        <div className="px-2 pb-4 shrink-0 flex justify-center">
          <Link to="/doctor/profile" title="Open profile">
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face"
              alt="doctor"
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-100"
            />
          </Link>
        </div>
      )}
    </aside>
  );
}

function Patients() {
  const [activeTab, setActiveTab] = useState("Patients");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Get doctor ID from localStorage (set during login)
  const doctorId = localStorage.getItem("doctorId") || 1;

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/doctors/${doctorId}/patients?page=${currentPage}&limit=8`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch patients: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          // Transform API data to match UI format
          const formattedPatients = data.data.items.map((patient, index) => {
            const initials =
              `${patient.first_name?.charAt(0) || ""}${patient.last_name?.charAt(0) || ""}`.toUpperCase();
            const colors = [
              {
                bg: "bg-[#eefaf6] text-[#1b6a55]",
                status: "Confirmed",
                statusColor: "text-[#1b6a55]",
              },
              {
                bg: "bg-[#f3f0ff] text-[#6b46c1]",
                status: "Pending",
                statusColor: "text-[#e08a46]",
              },
              {
                bg: "bg-[#fff4eb] text-[#e08a46]",
                status: "Confirmed",
                statusColor: "text-[#1b6a55]",
              },
              {
                bg: "bg-[#fcebeb] text-[#d65e5e]",
                status: "Confirmed",
                statusColor: "text-[#1b6a55]",
              },
            ];
            const colorScheme = colors[index % colors.length];

            return {
              id: patient.user_id,
              name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
              initials: initials || "P",
              color: colorScheme.bg,
              status: colorScheme.status,
              statusColor: colorScheme.statusColor,
              appointment: patient.last_visit_date
                ? new Date(patient.last_visit_date).toLocaleDateString() +
                  ", " +
                  new Date(patient.last_visit_date).toLocaleTimeString()
                : "No appointment",
              email: patient.email,
              phone: patient.phone,
              totalVisits: patient.total_visits || 0,
            };
          });

          setPatients(formattedPatients);
          setPagination({
            page: data.data.page,
            limit: data.data.limit,
            total: data.data.total,
            total_pages: data.data.total_pages,
          });
        }

        // Fetch doctor data
        const doctorRes = await fetch(
          `${API_BASE_URL}/doctors/${doctorId}/panel`,
        );
        if (doctorRes.ok) {
          const doctorDataRes = await doctorRes.json();
          setDoctorData(doctorDataRes.data?.doctor);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId, currentPage]);

  // Filter patients based on search and status
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "All Status" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-linear-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activePath="/doctor/patients"
        doctorData={doctorData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-18 bg-transparent px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <NotificationBell userId={doctorData?.user_id} />
            <div className="text-right hidden sm:block">
              <p className="text-[12px] text-gray-500 font-semibold mb-0.5">
                Good Morning,
              </p>
              <h4 className="text-[14px] font-extrabold text-gray-800 leading-none">
                Dr. Sharma
              </h4>
            </div>
            <img
              src="https://ui-avatars.com/api/?name=Dr+Sharma&background=1b6a55&color=fff&size=40"
              alt="Dr. Sharma"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-300 mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                Patients
              </h1>
              <p className="text-gray-500 font-semibold text-sm">
                Manage and view your patients
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by patient name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-700 placeholder-gray-400 shadow-sm"
                />
              </div>
              <div className="flex gap-4 sm:w-auto w-full">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] bg-white text-sm font-semibold text-gray-700 shadow-sm appearance-none sm:min-w-40 cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 0.5rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                    paddingRight: `2.5rem`,
                  }}
                >
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                </select>
                <button className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition shadow-sm flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b6a55]"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-semibold text-sm">
                  Error loading patients: {error}
                </p>
              </div>
            )}

            {/* Patients Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group"
                    >
                      <div className="flex gap-4 items-center mb-6">
                        <div
                          className={`w-12 h-12 rounded-full ${patient.color} flex items-center justify-center font-extrabold text-[15px] shrink-0`}
                        >
                          {patient.initials}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-[15px] mb-1">
                            {patient.name}
                          </h3>
                          <p className="text-gray-500 font-semibold text-[12px]">
                            ID: {patient.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center mb-6">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm text-[11px] font-extrabold ${patient.statusColor}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${patient.status === "Confirmed" ? "bg-[#1b6a55]" : "bg-[#e08a46]"}`}
                          ></span>
                          {patient.status}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mb-6 bg-gray-50 rounded-xl p-3">
                        <svg
                          className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-[11px] text-gray-500 font-semibold mb-0.5">
                            Next Appointment
                          </p>
                          <p className="text-[13px] font-extrabold text-gray-800">
                            {patient.appointment}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="w-full py-2.5 rounded-xl border-2 border-[#1b6a55] text-[#1b6a55] font-extrabold text-[13px] hover:bg-[#1b6a55] hover:text-white transition group-hover:shadow-md"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 font-semibold">
                      No patients found
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.total_pages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-2 pb-20">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.total_pages || 1) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg font-extrabold text-sm flex items-center justify-center transition ${
                        currentPage === page
                          ? "bg-[#1b6a55] text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.total_pages, currentPage + 1),
                    )
                  }
                  disabled={currentPage === pagination.total_pages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-800 hover:text-[#1b6a55] transition disabled:opacity-50"
                >
                  Next
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Floating Action Button */}

        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedPatient(null)}
            ></div>

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Patient Details
                </h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                  aria-label="Close patient details"
                >
                  <svg
                    className="w-5 h-5 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full ${selectedPatient.color} flex items-center justify-center font-extrabold text-lg shrink-0`}
                  >
                    {selectedPatient.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold">
                      Patient ID: {selectedPatient.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-gray-500 font-semibold mb-1">Email</p>
                    <p className="text-gray-800 font-bold break-all">
                      {selectedPatient.email || "Not available"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-gray-500 font-semibold mb-1">Phone</p>
                    <p className="text-gray-800 font-bold">
                      {selectedPatient.phone || "Not available"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-gray-500 font-semibold mb-1">Status</p>
                    <p className="text-gray-800 font-bold">
                      {selectedPatient.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-gray-500 font-semibold mb-1">
                      Total Visits
                    </p>
                    <p className="text-gray-800 font-bold">
                      {selectedPatient.totalVisits}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-emerald-700 font-semibold text-sm mb-1">
                    Last / Next Appointment
                  </p>
                  <p className="text-gray-800 font-extrabold">
                    {selectedPatient.appointment}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="px-4 py-2 rounded-xl bg-[#1b6a55] hover:bg-[#145140] text-white font-bold text-sm transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;
