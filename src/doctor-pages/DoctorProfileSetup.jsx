import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logoimage.png';
import DoctorSidebar from '../components/DoctorSidebar';

function DoctorProfileSetup() {
  return (
    <div className="flex h-screen bg-gradient-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-[72px] bg-transparent px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] text-gray-500 font-semibold mb-0.5">Good Morning,</p>
              <h4 className="text-[14px] font-extrabold text-gray-800 leading-none">Dr. Sharma</h4>
            </div>
            <img src="https://ui-avatars.com/api/?name=Dr+Sharma&background=1b6a55&color=fff&size=40" alt="Dr. Sharma" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Profile Setup</h1>
              <p className="text-gray-500 font-semibold text-sm">Update your profile information and preferences</p>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                {/* Profile Picture Section */}
                <div className="lg:col-span-3 flex flex-col items-center">
                  <h3 className="w-full text-left text-sm font-extrabold text-gray-900 mb-6">Profile Picture</h3>
                  <div className="w-40 h-40 rounded-full bg-gray-100 mb-6 border-4 border-gray-50 shadow-inner overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Dr+Sharma&background=1b6a55&color=fff&size=160" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-[#1b6a55] text-[#1b6a55] font-extrabold text-sm hover:bg-[#1b6a55] hover:text-white transition w-full justify-center mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    Upload Photo
                  </button>
                  <p className="text-[11px] text-gray-400 font-semibold text-center">JPG, PNG or GIF. Max size of 2MB</p>
                </div>

                {/* Right Form Areas */}
                <div className="lg:col-span-9 flex flex-col gap-10">

                  {/* Row 1: Personal Info & Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

                    {/* Personal Information */}
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="col-span-1">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                          <input type="text" defaultValue="Dr. Rajesh Sharma" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5 flex items-center gap-1">
                            Specialty <span className="text-red-500">*</span>
                            <svg className="w-3.5 h-3.5 text-[#1b6a55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </label>
                          <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 bg-white appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}>
                            <option>Cardiologist</option>
                            <option>Neurologist</option>
                            <option>Pediatrician</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                          <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                          <input type="email" defaultValue="rajesh.sharma@gmail.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">Availability</h3>
                      <div className="flex flex-col gap-5">
                        <div>
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Working Hours <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                              <input type="text" defaultValue="09:00 AM" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-400">to</span>
                            <div className="relative flex-1">
                              <input type="text" defaultValue="05:00 PM" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Days Off</label>
                          <div className="relative">
                            <div className="w-full px-2 py-1.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#1b6a55]/20 focus-within:border-[#1b6a55] transition flex items-center gap-2 flex-wrap min-h-[46px]">
                              <span className="bg-[#eefaf6] text-[#1b6a55] text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                Sunday
                                <button className="hover:bg-[#1b6a55]/20 rounded-full p-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                              </span>
                              <span className="bg-[#eefaf6] text-[#1b6a55] text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                Thursday
                                <button className="hover:bg-[#1b6a55]/20 rounded-full p-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                              </span>
                              <div className="flex-1 min-w-[50px]">
                                <input type="text" className="w-full bg-transparent focus:outline-none text-sm text-gray-700" />
                              </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Row 2: Credentials & Security */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

                    {/* Credentials */}
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">Credentials</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="col-span-2">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Qualifications <span className="text-red-500">*</span></label>
                          <input type="text" defaultValue="MBBS, MD (Cardiology)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Experience(Years) <span className="text-red-500">*</span></label>
                          <input type="text" defaultValue="12" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">Hospital Affiliations <span className="text-red-500">*</span></label>
                          <input type="text" defaultValue="Apollo Hospital, New Delhi" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800" />
                        </div>
                      </div>
                    </div>

                    {/* Security */}
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">Security</h3>
                      <div className="flex flex-col gap-5">
                        <div>
                          <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5 flex items-center gap-1">
                            Change Password
                            <svg className="w-3.5 h-3.5 text-[#1b6a55]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                              <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 placeholder-gray-400" />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                              </div>
                            </div>
                            <div className="relative">
                              <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 placeholder-gray-400" />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-[11px] text-gray-500 font-semibold">Leave blank if you don't want to change password</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-gray-100">
                    <button className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-extrabold text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b6a55] text-white font-extrabold text-sm hover:bg-[#145140] transition shadow-md shadow-[#1b6a55]/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                      Save Profile
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default DoctorProfileSetup;
