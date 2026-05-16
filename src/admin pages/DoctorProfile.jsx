import React, { useState } from "react";
import { Pencil, Lock, Trash2, ChevronDown, ArrowLeft } from "lucide-react";

const DoctorProfile = ({ setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto p-8">
        {/* Back Button (Optional but helpful for navigation) */}
        <button
          onClick={() => setActiveTab("users")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 flex items-start justify-between">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#205C46] flex items-center justify-center text-white text-xl font-bold">
              PS
            </div>

            {/* Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Dr. Priya Sharma
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                priya.sharma@swastha.np • +977 98-4512-0001
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                  Doctor
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                  Active
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  Joined Jan 10, 2024
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <Lock className="w-4 h-4" /> Suspend
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["Overview", "Appointments", "Schedule"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeSubTab === tab
                  ? "bg-[#205C46] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeSubTab === "Overview" && (
          <div className="flex flex-col gap-6">
            {/* Row 1: Professional Details & Stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Professional Details */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5">
                  Professional details
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      Specialization
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      Cardiology
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      Department
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      Cardiology
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      License no.
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      NMC-20240012
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm text-gray-500 font-medium">
                      Experience
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      8 years
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">
                      Consultation fee
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      NPR 800
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5">
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f9f9f6] rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">
                      Total appointments
                    </p>
                    <p className="text-2xl font-bold text-gray-900">142</p>
                  </div>
                  <div className="bg-[#f9f9f6] rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">
                      This month
                    </p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <div className="bg-[#f9f9f6] rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-[#205C46]">138</p>
                  </div>
                  <div className="bg-[#f9f9f6] rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-2">
                      Cancelled
                    </p>
                    <p className="text-2xl font-bold text-red-600">4</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
              <h3 className="text-base font-bold text-gray-900 mb-5">
                Recent appointments
              </h3>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-2 text-xs font-bold text-gray-900">
                      Patient
                    </th>
                    <th className="py-3 px-2 text-xs font-bold text-gray-900">
                      Date & time
                    </th>
                    <th className="py-3 px-2 text-xs font-bold text-gray-900">
                      Type
                    </th>
                    <th className="py-3 px-2 text-xs font-bold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="py-4 px-2 text-sm font-bold text-gray-800">
                      Raj Kumar
                    </td>
                    <td className="py-4 px-2 text-sm font-bold text-gray-800">
                      May 15, 9:00 AM
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-gray-800">
                      Follow-up
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-[#eaf5f0] text-[#205C46] text-xs font-bold rounded-full">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="py-4 px-2 text-sm font-bold text-gray-800">
                      Sita Rai
                    </td>
                    <td className="py-4 px-2 text-sm font-bold text-gray-800">
                      May 14, 11:00 AM
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-gray-800">
                      Consultation
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-[#eaf5f0] text-[#205C46] text-xs font-bold rounded-full">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 last:border-0">
                    <td className="py-4 px-2 text-sm font-bold text-gray-800">
                      Binod Tamang
                    </td>
                    <td className="py-4 px-2 text-sm font-bold text-gray-800">
                      May 13, 2:00 PM
                    </td>
                    <td className="py-4 px-2 text-sm font-medium text-gray-800">
                      Emergency
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                        Cancelled
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Expand Button */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <button className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
