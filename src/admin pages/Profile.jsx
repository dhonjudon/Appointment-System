import React from "react";
import Header from "../components/Header";
import { Pencil, MapPin, Save } from "lucide-react";

const Profile = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8 relative">
        <Header
          title="Profile"
          subtitle="Manage your account"
          showSearch={false}
        />

        {/* Banner Section */}
        <div className="bg-[#1a3d36] rounded-xl mb-6 p-8 relative overflow-hidden flex items-center">
          {/* Background circles */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-brand-DEFAULT/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute right-32 bottom-0 w-48 h-48 bg-brand-DEFAULT/20 rounded-full blur-3xl translate-y-1/4"></div>

          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-brand-DEFAULT flex items-center justify-center text-white text-3xl font-bold border-4 border-[#1a3d36]">
                SA
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center border-2 border-[#1a3d36] text-white hover:bg-orange-500 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Super Admin
              </h2>
              <p className="text-gray-300 text-sm mb-3">
                superadmin@syncdoc.health
              </p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/10 text-gray-200 text-xs font-medium rounded-full">
                  Administrator
                </span>
                <span className="px-3 py-1 bg-white/10 text-gray-200 text-xs font-medium rounded-full">
                  Full Access
                </span>
                <span className="px-3 py-1 bg-white/10 text-gray-200 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Personal Information
              </h3>
              <p className="text-sm text-gray-500">
                Update your profile details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5 border-t border-gray-100 pt-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Super"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="superadmin@syncdoc.health"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+977 98-0000-0000"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  defaultValue="Administrator"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  Department
                </label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700 bg-white">
                  <option>IT Administration</option>
                  <option>Management</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 mb-2">
                Bio
              </label>
              <textarea
                rows="3"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700 resize-none"
                defaultValue="Manages the Syncdoc platform. Oversees appointments, doctors, and overall system health."
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <button className="px-5 py-2 border border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Discard
              </button>
              <button className="px-5 py-2 bg-brand-DEFAULT text-white font-bold text-sm rounded-lg hover:bg-brand-DEFAULT/90 transition-colors flex items-center gap-2">
                <span className="text-base leading-none">💾</span> Save Changes
              </button>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                  Location
                </h3>
                <p className="text-xs text-gray-500">Address & location info</p>
              </div>
            </div>

            <div className="mb-5 border-t border-gray-100 pt-5">
              <label className="block text-xs font-bold text-gray-500 mb-2">
                City
              </label>
              <input
                type="text"
                defaultValue="Kathmandu"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 mb-2">
                Country
              </label>
              <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700 bg-white">
                <option>Nepal</option>
                <option>India</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 mb-2">
                Hospital / Clinic Name
              </label>
              <input
                type="text"
                defaultValue="Syncdoc Medical Center"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-700"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button className="px-5 py-2 bg-brand-DEFAULT text-white font-bold text-sm rounded-lg hover:bg-brand-DEFAULT/90 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
