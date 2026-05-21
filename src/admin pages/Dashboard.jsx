import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Stethoscope,
  FileText,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";
import { NotificationBell } from "../components/NotificationBell";
import { checkAdminSession } from "../utils/adminAuth";

const API_BASE_URL = "http://localhost:3000/api";

const statCardBase = {
  patients: "border-t-emerald-500",
  appointments: "border-t-blue-500",
  doctors: "border-t-orange-500",
  totals: "border-t-indigo-500",
};

const statusPalette = {
  completed: "#10b981",
  pending: "#f59e0b",
  cancelled: "#ef4444",
  rescheduled: "#6366f1",
  confirmed: "#3b82f6",
};

const formatDoctorName = (doctor) => {
  const first = doctor?.first_name || doctor?.doctor_first_name || "";
  const last = doctor?.last_name || doctor?.doctor_last_name || "";
  const fullName = `${first} ${last}`.trim();
  return fullName ? `Dr. ${fullName}` : "Doctor";
};

const getInitials = (firstName, lastName) => {
  const first = (firstName || "").trim().charAt(0).toUpperCase();
  const last = (lastName || "").trim().charAt(0).toUpperCase();
  return `${first}${last}` || "DR";
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  highlight,
  subtitle,
  trend,
  trendUp,
  topBorderClass,
  iconClass,
}) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${topBorderClass || ""}`}
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className={`p-2 rounded-lg ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div
        className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
      >
        {trendUp ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800 leading-none">{value}</h3>
      <p className="mt-1 text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-xs text-gray-400">
        <span className="font-semibold text-gray-600">{highlight}</span>{" "}
        {subtitle}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    appointmentsToday: 0,
    newPatientsThisMonth: 0,
  });
  const [overviewData, setOverviewData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);

  useEffect(() => {
    if (!checkAdminSession()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch admin dashboard data");
        }

        const payload = await response.json();
        const data = payload.data || {};
        const totals = data.totals || {};

        setStats({
          totalPatients: totals.patients || 0,
          totalDoctors: totals.doctors || 0,
          totalAppointments: totals.appointments || 0,
          appointmentsToday: totals.today_appointments || 0,
          newPatientsThisMonth: totals.new_patients_this_month || 0,
        });

        setOverviewData(
          Array.isArray(data.appointments_overview)
            ? data.appointments_overview
            : [],
        );
        setStatusData(
          Array.isArray(data.appointments_by_status)
            ? data.appointments_by_status
            : [],
        );
        setTodaySchedule(
          Array.isArray(data.today_schedule) ? data.today_schedule : [],
        );
        setTopDoctors(Array.isArray(data.top_doctors) ? data.top_doctors : []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const overviewChartData = overviewData.map((item) => ({
    day: new Date(item.day).toLocaleDateString("en-US", { weekday: "short" }),
    scheduled: Number(item.scheduled || 0),
    completed: Number(item.completed || 0),
    cancelled: Number(item.cancelled || 0),
  }));

  const pieChartData = statusData.map((item) => ({
    name: item.status || item.name || "Status",
    value: Number(item.count || item.value || 0),
    color:
      statusPalette[(item.status || item.name || "").toLowerCase()] ||
      "#6b7280",
  }));

  const totalStatusCount = pieChartData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="flex h-screen bg-[#DFF2EB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[#DFF2EB] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Live overview of appointments, doctors, and patients
            </p>
          </div>
          <NotificationBell />
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              title="Total Patients"
              value={loading ? "..." : stats.totalPatients.toLocaleString()}
              highlight={`+${stats.newPatientsThisMonth.toLocaleString()}`}
              subtitle="new this month"
              trend="live"
              trendUp={true}
              topBorderClass={statCardBase.patients}
              iconClass="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={Calendar}
              title="Appointments Today"
              value={loading ? "..." : stats.appointmentsToday.toLocaleString()}
              highlight={stats.totalAppointments.toLocaleString()}
              subtitle="total appointments"
              trend="today"
              trendUp={true}
              topBorderClass={statCardBase.appointments}
              iconClass="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={Stethoscope}
              title="Active Doctors"
              value={loading ? "..." : stats.totalDoctors.toLocaleString()}
              highlight="database"
              subtitle="doctor records"
              trend="live"
              trendUp={true}
              topBorderClass={statCardBase.doctors}
              iconClass="bg-orange-50 text-orange-600"
            />
            <StatCard
              icon={FileText}
              title="Appointments Total"
              value={loading ? "..." : stats.totalAppointments.toLocaleString()}
              highlight="system"
              subtitle="all-time records"
              trend="live"
              trendUp={true}
              topBorderClass={statCardBase.totals}
              iconClass="bg-indigo-50 text-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Today's Schedule
                  </h3>
                  <p className="text-sm text-gray-500">
                    Appointments booked for today
                  </p>
                </div>
                <CalendarDays className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-14 text-xs font-bold text-gray-500 pt-1 shrink-0">
                        {item.start_time}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-800 truncate">
                            {`${item.patient_first_name || ""} ${item.patient_last_name || ""}`.trim() ||
                              "Patient"}
                          </h4>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                statusPalette[item.status?.toLowerCase()] ||
                                "#6b7280",
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDoctorName(item)} ·{" "}
                          {item.specialization_name || "Specialist"}
                        </p>
                        <p className="mt-2 text-[11px] text-gray-400 capitalize">
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 py-10 text-center">
                    No appointments scheduled for today.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 xl:col-span-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Appointment Overview
                  </h3>
                  <p className="text-sm text-gray-500">Last 7 days trend</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={overviewChartData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="scheduled"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="cancelled"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 xl:col-span-1">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Appointment Status
                </h3>
                <p className="text-sm text-gray-500">
                  Current system breakdown
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        innerRadius={44}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-gray-800 leading-none">
                      {totalStatusCount}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1">
                      Total
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {pieChartData.length > 0 ? (
                    pieChartData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-600 capitalize">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-bold text-gray-800">
                          {item.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No appointment status data available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Top Doctors by Appointments
                </h3>
                <p className="text-sm text-gray-500">
                  Ordered by highest appointment count
                </p>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                From database
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {topDoctors.length > 0 ? (
                topDoctors.map((doctor, index) => (
                  <div
                    key={doctor.id || index}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#1b6a55] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getInitials(
                          doctor.first_name || doctor.first_name,
                          doctor.last_name || doctor.last_name,
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 truncate">
                          {formatDoctorName(doctor)}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {doctor.specialization ||
                            doctor.specialization_name ||
                            "Specialist"}
                          {doctor.total_reviews !== undefined
                            ? ` · ${doctor.total_reviews} reviews`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-gray-800">
                        {doctor.total_appointments || 0}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                        appointments
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No doctor activity available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
