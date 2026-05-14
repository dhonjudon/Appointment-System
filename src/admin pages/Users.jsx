import React, { useState } from "react";
import {
  Download,
  Plus,
  Users as UsersIcon,
  Search,
  Bell,
  Grid,
} from "lucide-react";

const usersData = [
  {
    initials: "PS",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@swastha.np",
    role: "Doctor",
    contact: "+977 98-4512-0001",
    joined: "Jan 10, 2024",
    status: "Active",
    color: "bg-green-600",
  },
  {
    initials: "RS",
    name: "Rajan Shrestha",
    email: "rajan.shrestha@gmail.com",
    role: "Patient",
    contact: "+977 98-4512-3456",
    joined: "Mar 5, 2025",
    status: "Active",
    color: "bg-orange-500",
  },
  {
    initials: "AV",
    name: "Dr. Amit Verma",
    email: "amit.verma@swastha.np",
    role: "Doctor",
    contact: "+977 98-5500-1122",
    joined: "Feb 14, 2023",
    status: "Active",
    color: "bg-blue-500",
  },
  {
    initials: "SR",
    name: "Sita Rai",
    email: "sita.rai@gmail.com",
    role: "Patient",
    contact: "+977 98-4501-2345",
    joined: "Aug 19, 2025",
    status: "Cancelled",
    color: "bg-red-500",
  },
  {
    initials: "RP",
    name: "Dr. Rajesh Patel",
    email: "rajesh.patel@swastha.np",
    role: "Doctor",
    contact: "+977 97-8901-3344",
    joined: "May 1, 2022",
    status: "Active",
    color: "bg-green-600",
  },
  {
    initials: "AG",
    name: "Anita Gurung",
    email: "anita.g@yahoo.com",
    role: "Patient",
    contact: "+977 98-5623-7890",
    joined: "Nov 30, 2025",
    status: "Pending",
    color: "bg-gray-400",
  },
];

const StatCard = ({ icon: Icon, value, title, iconColorClass }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${iconColorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800 leading-none mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  </div>
);

const Users = () => {
  const [activeTab, setActiveTab] = useState("All Users");

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        {/* Unified Page Header */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Users Management
              </h2>
              <p className="text-sm text-gray-500">
                3,248 patients · 62 doctors registered
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
          </div>

          {/* Right side: Search, Icons, Profile */}
          <div className="flex items-center gap-6">
            {/* Header Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, doctors..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-64 text-gray-600"
              />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors relative bg-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white">
                <Grid className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold cursor-pointer hover:bg-brand-teal/90 transition-colors shadow-sm">
              SA
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={UsersIcon}
            value="3,310"
            title="Total Users"
            iconColorClass="bg-brand-teal/10 text-brand-teal"
          />
          <StatCard
            icon={UsersIcon}
            value="62"
            title="Doctors"
            iconColorClass="bg-blue-50 text-blue-500"
          />
          <StatCard
            icon={UsersIcon}
            value="3,248"
            title="Patients"
            iconColorClass="bg-orange-50 text-orange-500"
          />
        </div>

        {/* Filters and Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {["All Users", "Doctors", "Patients"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-colors ${
                  activeTab === tab
                    ? "bg-brand-teal text-white border-brand-teal"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab !== "All Users" && <UsersIcon className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-64 text-gray-600"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.color}`}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          {user.name}
                        </h4>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-sm font-medium ${user.role === "Doctor" ? "text-blue-500" : "text-orange-500"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 font-medium">
                      {user.contact}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">{user.joined}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : user.status === "Pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-sm font-medium text-brand-teal hover:text-brand-teal/80 transition-colors">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="py-4 px-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
            <span className="text-sm text-gray-500">
              Showing 1–6 of 3,310 users
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Prev
              </button>
              <button className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
