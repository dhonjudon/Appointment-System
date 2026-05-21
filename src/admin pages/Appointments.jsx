import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, CalendarDays, Filter } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { NotificationBell } from "../components/NotificationBell";
import { checkAdminSession } from "../utils/adminAuth";

const API_BASE_URL = "http://localhost:3000/api";
const PAGE_SIZE = 12;

const statusBadgeClass = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
  rescheduled: "bg-indigo-50 text-indigo-700",
};

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!checkAdminSession()) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (search.trim()) params.set("search", search.trim());
        if (status) params.set("status", status);

        const response = await fetch(
          `${API_BASE_URL}/admin/appointments?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load appointments");
        }

        const payload = await response.json();
        setAppointments(payload.data?.items || []);
        setTotalPages(payload.data?.total_pages || 1);
        setTotal(payload.data?.total || 0);
      } catch (err) {
        setError(err.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [page, search, status]);

  const statusOptions = useMemo(
    () => ["", "pending", "confirmed", "completed", "cancelled", "rescheduled"],
    [],
  );

  return (
    <div className="flex h-screen bg-[#DFF2EB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[#DFF2EB]  px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
            <p className="text-sm text-gray-500">
              Manage every appointment in the system
            </p>
          </div>
          <NotificationBell />
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm text-emerald-600">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  All Appointments
                </h2>
                <p className="text-sm text-gray-500">
                  {total.toLocaleString()} records available
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search patient or doctor"
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-72 text-gray-600"
                />
              </div>

              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value);
                  }}
                  className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-600 appearance-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option || "all"} value={option}>
                      {option
                        ? option.charAt(0).toUpperCase() + option.slice(1)
                        : "All statuses"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 px-6 text-center text-gray-500"
                    >
                      Loading appointments...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 px-6 text-center text-red-500 font-semibold"
                    >
                      {error}
                    </td>
                  </tr>
                ) : appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">
                          {(appointment.patient_first_name || "") +
                            " " +
                            (appointment.patient_last_name || "")}
                        </div>
                        <p className="text-xs text-gray-500">
                          {appointment.patient_email}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">
                          Dr.{" "}
                          {(appointment.doctor_first_name || "") +
                            " " +
                            (appointment.doctor_last_name || "")}
                        </div>
                        <p className="text-xs text-gray-500">
                          {appointment.specialization_name || "Specialist"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">
                          {appointment.appointment_date}
                        </div>
                        <p className="text-xs text-gray-500">
                          {appointment.start_time} - {appointment.end_time}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${statusBadgeClass[appointment.status] || "bg-gray-100 text-gray-700"}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 px-6 text-center text-gray-500"
                    >
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="py-4 px-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
              <span className="text-sm text-gray-500">
                Showing page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
