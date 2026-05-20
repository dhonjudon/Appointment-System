import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logoimage.png';
import DoctorSidebar from '../components/DoctorSidebar';

function Patients() {
  const [activeTab, setActiveTab] = useState('Patients');

  const patients = [
    { id: 'SP-1024', name: 'Sarah Patel', initials: 'SP', color: 'bg-[#eefaf6] text-[#1b6a55]', status: 'Confirmed', statusColor: 'text-[#1b6a55]', appointment: '22 May 2025, 10:30 AM' },
    { id: 'RK-2098', name: 'Rahul Kumar', initials: 'RK', color: 'bg-[#f3f0ff] text-[#6b46c1]', status: 'Pending', statusColor: 'text-[#e08a46]', appointment: '23 May 2025, 02:00 PM' },
    { id: 'AN-3091', name: 'Anita Nair', initials: 'AN', color: 'bg-[#eefaf6] text-[#1b6a55]', status: 'Confirmed', statusColor: 'text-[#1b6a55]', appointment: '24 May 2025, 11:00 AM' },
    { id: 'MJ-4120', name: 'Michael Johnson', initials: 'MJ', color: 'bg-[#fff4eb] text-[#e08a46]', status: 'Pending', statusColor: 'text-[#e08a46]', appointment: '25 May 2025, 04:30 PM' },
    { id: 'PK-5122', name: 'Priya Kapoor', initials: 'PK', color: 'bg-[#fcebeb] text-[#d65e5e]', status: 'Confirmed', statusColor: 'text-[#1b6a55]', appointment: '26 May 2025, 09:15 AM' },
    { id: 'DS-6125', name: 'Dinesh Singh', initials: 'DS', color: 'bg-[#fff4eb] text-[#e08a46]', status: 'Pending', statusColor: 'text-[#e08a46]', appointment: '26 May 2025, 11:45 AM' },
    { id: 'NT-7130', name: 'Neha Tiwari', initials: 'NT', color: 'bg-[#eefaf6] text-[#1b6a55]', status: 'Confirmed', statusColor: 'text-[#1b6a55]', appointment: '27 May 2025, 01:20 PM' },
    { id: 'AS-8124', name: 'Amit Shah', initials: 'AS', color: 'bg-[#f3f0ff] text-[#6b46c1]', status: 'Confirmed', statusColor: 'text-[#1b6a55]', appointment: '28 May 2025, 03:00 PM' },
  ];

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
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Patients</h1>
              <p className="text-gray-500 font-semibold text-sm">Manage and view your patients</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by patient name or ID..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-700 placeholder-gray-400 shadow-sm"
                />
              </div>
              <div className="flex gap-4 sm:w-auto w-full">
                <select className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] bg-white text-sm font-semibold text-gray-700 shadow-sm appearance-none sm:min-w-[160px] cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}>
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                </select>
                <button className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition shadow-sm flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                </button>
              </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {patients.map((patient, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
                  <div className="flex gap-4 items-center mb-6">
                    <div className={`w-12 h-12 rounded-full ${patient.color} flex items-center justify-center font-extrabold text-[15px] shrink-0`}>
                      {patient.initials}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-[15px] mb-1">{patient.name}</h3>
                      <p className="text-gray-500 font-semibold text-[12px]">ID: {patient.id}</p>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm text-[11px] font-extrabold ${patient.statusColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${patient.status === 'Confirmed' ? 'bg-[#1b6a55]' : 'bg-[#e08a46]'}`}></span>
                      {patient.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-6 bg-gray-50 rounded-xl p-3">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <div>
                      <p className="text-[11px] text-gray-500 font-semibold mb-0.5">Next Appointment</p>
                      <p className="text-[13px] font-extrabold text-gray-800">{patient.appointment}</p>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl border-2 border-[#1b6a55] text-[#1b6a55] font-extrabold text-[13px] hover:bg-[#1b6a55] hover:text-white transition group-hover:shadow-md">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center items-center gap-2 pb-20">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-400 hover:text-gray-700 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Previous
              </button>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-lg bg-[#1b6a55] text-white font-extrabold text-sm flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-extrabold text-sm flex items-center justify-center transition">2</button>
                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-extrabold text-sm flex items-center justify-center transition">3</button>
                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-extrabold text-sm flex items-center justify-center transition">4</button>
                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-extrabold text-sm flex items-center justify-center transition">5</button>
              </div>
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-800 hover:text-[#1b6a55] transition">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </main>

        {/* Floating Action Button */}
        <button className="absolute bottom-8 right-8 w-14 h-14 bg-[#1b6a55] hover:bg-[#145140] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1b6a55]/30 transition transform hover:scale-105 z-20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
    </div>
  );
}

export default Patients;
