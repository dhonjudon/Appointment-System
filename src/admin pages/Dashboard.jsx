import React, { useState } from "react";
import Header from "../components/Header";
import {
  Users,
  Calendar,
  Stethoscope,
  DollarSign,
  Plus,
  UserPlus,
  FileText,
  BellRing,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  User,
  X,
  CloudDownload,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const dataAppointments = [
  { name: "Mon", scheduled: 80, completed: 120, cancelled: 40 },
  { name: "Tue", scheduled: 90, completed: 160, cancelled: 45 },
  { name: "Wed", scheduled: 85, completed: 155, cancelled: 48 },
  { name: "Thu", scheduled: 95, completed: 170, cancelled: 46 },
  { name: "Fri", scheduled: 100, completed: 180, cancelled: 50 },
  { name: "Sat", scheduled: 80, completed: 160, cancelled: 45 },
  { name: "Sun", scheduled: 90, completed: 175, cancelled: 48 },
];

const dataRevenue = [
  { name: "Jan", value: 3.2 },
  { name: "Feb", value: 3.8 },
  { name: "Mar", value: 4.2 },
  { name: "Apr", value: 4.8 },
  { name: "May", value: 4.5 },
  { name: "Jun", value: 5.1 },
];

const dataStatus = [
  { name: "Completed", value: 62, color: "#10b981" },
  { name: "Pending", value: 22, color: "#f59e0b" },
  { name: "Cancelled", value: 16, color: "#ef4444" },
  { name: "Follow-ups", value: 8, color: "#3b82f6" },
];

const scheduleToday = [
  {
    time: "9:00",
    name: "Rajan Shrestha",
    doctor: "Dr. Priya Sharma · Cardiology",
    status: "completed",
  },
  {
    time: "10:30",
    name: "Anita Gurung",
    doctor: "Dr. Amit Verma · Neurology",
    status: "pending",
  },
  {
    time: "11:00",
    name: "Bikash Tamang",
    doctor: "Dr. Rajesh Patel · Physio",
    status: "completed",
  },
  {
    time: "1:30",
    name: "Sita Rai",
    doctor: "Dr. Priya Sharma · Cardiology",
    status: "cancelled",
  },
  {
    time: "3:00",
    name: "Dipak Adhikari",
    doctor: "Dr. Sunita KC · ENT",
    status: "completed",
  },
];

const topDoctors = [
  {
    initials: "PS",
    name: "Dr. Priya Sharma",
    role: "Cardiologist · Bir Hospital",
    rating: 4.9,
    appts: 48,
    status: "Active",
    color: "bg-green-600",
  },
  {
    initials: "AV",
    name: "Dr. Amit Verma",
    role: "Neurologist · TUTH",
    rating: 4.8,
    appts: 41,
    status: "Active",
    color: "bg-blue-500",
  },
  {
    initials: "RP",
    name: "Dr. Rajesh Patel",
    role: "Physiotherapist · Nordic",
    rating: 4.7,
    appts: 36,
    status: "Active",
    color: "bg-orange-500",
  },
  {
    initials: "SK",
    name: "Dr. Sunita KC",
    role: "ENT · Patan Hospital",
    rating: 4.6,
    appts: 29,
    status: "On Leave",
    color: "bg-red-500",
  },
];

const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendUp,
  subtitle,
  highlight,
  iconBgClass,
  iconTextClass,
  topBorderClass,
}) => (
  <div
    className={`bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full ${topBorderClass ? `border-t-4 ${topBorderClass}` : ""}`}
  >
    <div className="flex justify-between items-start mb-2">
      <div className={`p-1.5 rounded-lg ${iconBgClass} ${iconTextClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div
        className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
      >
        {trendUp ? (
          <ArrowUp className="w-2.5 h-2.5" />
        ) : (
          <ArrowDown className="w-2.5 h-2.5" />
        )}
        {trend}
      </div>
    </div>
    <div className="mt-auto">
      <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-0.5">
        {value}
      </h3>
      <p className="text-xs text-gray-500 mb-1.5">{title}</p>
      <p className="text-[10px] text-gray-400">
        <span className="font-medium text-gray-600">{highlight}</span>{" "}
        {subtitle}
      </p>
    </div>
  </div>
);

const ActionCard = ({ icon: Icon, title, subtitle, colorClass }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-start cursor-pointer hover:border-brand-teal transition-colors">
    <div className={`p-2 rounded-full mb-3 ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <h4 className="text-sm font-bold text-gray-800">{title}</h4>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

const Dashboard = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("Appointments");

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8 relative">
        <Header title="Dashboard" subtitle="Wednesday, April 29, 2026" />

        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <StatCard
            icon={Users}
            title="Total Patients"
            value="3,248"
            trend="8.2%"
            trendUp={true}
            highlight="+47"
            subtitle="new this week"
            iconBgClass="bg-brand-teal/10"
            iconTextClass="text-brand-teal"
            topBorderClass="border-t-brand-teal"
          />
          <StatCard
            icon={Calendar}
            title="Appointments Today"
            value="184"
            trend="12.4%"
            trendUp={true}
            highlight="31"
            subtitle="pending confirmation"
            iconBgClass="bg-blue-500/10"
            iconTextClass="text-blue-500"
            topBorderClass="border-t-blue-500"
          />
          <StatCard
            icon={User}
            title="Active Doctors"
            value="62"
            trend="3%"
            trendUp={true}
            highlight="5"
            subtitle="on leave today"
            iconBgClass="bg-orange-500/10"
            iconTextClass="text-orange-500"
            topBorderClass="border-t-orange-500"
          />

          {/* Replaced Revenue Card with Generate Report Card */}
          <div
            onClick={() => setIsReportModalOpen(true)}
            className="bg-white px-4 py-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full border-t-4 border-t-red-500 cursor-pointer hover:border-red-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-xl font-bold text-gray-800 leading-tight mb-0.5">
                Generate Report
              </h3>
              <p className="text-xs text-gray-500 mb-1.5">
                Click to open report generator
              </p>
              <p className="text-[10px] text-gray-400">
                <span className="font-medium text-gray-600">Export</span> data
                to CSV/PDF
              </p>
            </div>
          </div>
        </div>

        {/* Charts and Schedule Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Appointments Overview */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Appointments Overview
                </h3>
                <p className="text-sm text-gray-500">Last 7 days trend</p>
              </div>
              <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg">
                This Week <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4 mb-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-brand-teal">
                <div className="w-2 h-2 rounded-full bg-brand-teal"></div>{" "}
                Scheduled
              </div>
              <div className="flex items-center gap-1.5 text-blue-500">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                Completed
              </div>
              <div className="flex items-center gap-1.5 text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>{" "}
                Cancelled
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dataAppointments}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
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
                    dataKey="completed"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="scheduled"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="cancelled"
                    stackId="3"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Today's Schedule
                </h3>
                <p className="text-sm text-gray-500">Apr 29 · 8 upcoming</p>
              </div>
              <button className="text-sm font-medium text-brand-teal">
                See all
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5">
              {scheduleToday.map((item, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                  {i !== scheduleToday.length - 1 && (
                    <div className="absolute left-4 top-6 bottom-0 w-px bg-gray-200 -ml-px h-full z-0"></div>
                  )}
                  <div className="w-12 text-xs font-bold text-gray-500 pt-1 z-10 bg-white">
                    {item.time}
                  </div>
                  <div className="flex-1 bg-white z-10 pb-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-gray-800">
                        {item.name}
                      </h4>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "completed"
                            ? "bg-green-500"
                            : item.status === "pending"
                              ? "bg-orange-400"
                              : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{item.doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-5 gap-4">
            {/* Monthly Revenue */}
            <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Monthly Revenue
                  </h3>
                  <p className="text-[10px] text-gray-500">2026 overview</p>
                </div>
                <button className="text-xs font-medium text-brand-teal flex items-center">
                  Report <span className="ml-1">↗</span>
                </button>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    Rs4.8L{" "}
                    <span className="text-xs font-medium text-brand-teal">
                      ↑ 18% vs last month
                    </span>
                  </h2>
                </div>
                <div className="h-32 mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataRevenue}>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{
                          r: 3,
                          fill: "#14b8a6",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Appointment Status */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800">
                  Appointment Status
                </h3>
                <p className="text-[10px] text-gray-500">
                  This month breakdown
                </p>
              </div>
              <div className="flex-1 flex items-center gap-6">
                <div className="w-1/2 h-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataStatus}
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {dataStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-gray-800 leading-none">
                      184
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1">
                      Total
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3">
                  {dataStatus.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <div className="font-bold text-gray-800">
                        {item.value}
                        {item.name !== "Follow-ups" && "%"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Doctors */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Top Doctors by Appointments
                </h3>
                <p className="text-[10px] text-gray-500">This month</p>
              </div>
              <button className="text-xs font-medium text-brand-teal">
                View all doctors
              </button>
            </div>

            <div className="flex flex-col">
              {topDoctors.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${doc.color}`}
                    >
                      {doc.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[11px] font-medium text-yellow-500 flex items-center gap-1 justify-end">
                        ★ {doc.rating}{" "}
                        <span className="text-gray-400 ml-1">
                          · {doc.appts} appts
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        doc.status === "Active"
                          ? "bg-brand-teal/10 text-brand-teal"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {isReportModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Generate Report
                </h2>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Report Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "Appointments",
                      icon: Calendar,
                      title: "Appointments",
                      subtitle: "Visit records",
                      color: "text-brand-teal",
                    },
                    {
                      id: "Revenue",
                      icon: DollarSign,
                      title: "Revenue",
                      subtitle: "Financial data",
                      color: "text-orange-500",
                    },
                    {
                      id: "Patients",
                      icon: User,
                      title: "Patients",
                      subtitle: "Patient records",
                      color: "text-blue-500",
                    },
                  ].map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        reportType === type.id
                          ? "border-brand-teal bg-brand-teal/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mb-2 ${type.color}`} />
                      <span className="text-sm font-bold text-gray-800">
                        {type.title}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {type.subtitle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      From
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
                        defaultValue="2026-04-30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      To
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
                        defaultValue="2026-05-07"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      Month
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700 appearance-none bg-white">
                        <option>May</option>
                        <option>April</option>
                        <option>March</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      Year
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700 appearance-none bg-white">
                        <option>2026</option>
                        <option>2025</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="flex-[1] py-2 px-4 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="flex-[2] py-2 px-4 bg-brand-teal text-white rounded-lg text-sm font-bold hover:bg-brand-teal/90 transition-colors flex items-center justify-center gap-2"
              >
                <CloudDownload className="w-5 h-5" /> Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
