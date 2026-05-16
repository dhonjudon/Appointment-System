import React from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';
import DoctorSidebar from '../components/DoctorSidebar';
import { Link } from 'react-router-dom';

function DoctorDashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <header className="h-[72px] bg-transparent px-8 flex items-center justify-between z-10 shrink-0">
          <h1 className="text-xl font-bold text-gray-800"></h1>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-500">Tuesday, 28 April 2026</span>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#1a6654] rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1500px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">

              {/* Left Column */}
              <div className="xl:col-span-7 flex flex-col gap-6">

                {/* Banner */}
                <div className="bg-[#1b6a55] rounded-[1.5rem] p-8 relative overflow-hidden text-white shadow-md">
                  <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
                  <div className="absolute right-[10%] bottom-[-40%] w-80 h-80 bg-white/5 rounded-full pointer-events-none"></div>

                  <div className="relative z-10">
                    <p className="text-white/80 text-[10px] font-bold tracking-widest mb-2 uppercase">Monday Morning</p>
                    <h2 className="text-[2rem] font-extrabold mb-1 tracking-tight">Good morning, Dr. Rajesh 👋</h2>
                    <p className="text-white/90 text-sm mb-6 font-medium">You have 8 patients scheduled today</p>

                    <div className="flex gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-[#388e7b] text-white text-[11px] font-extrabold flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white"></span> On duty
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-[#145140]/80 text-white text-[11px] font-extrabold shadow-sm backdrop-blur-sm">
                        Bir Hospital, Ward 3
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Stats Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {/* Total Patients */}
                  <div className="bg-white p-6 rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center h-36">
                    <div className="w-11 h-11 rounded-xl bg-[#eefaf6] text-[#1b6a55] flex items-center justify-center mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-[1.8rem] font-black text-gray-800 leading-none mb-2">24</h3>
                      <p className="text-[12px] font-bold text-gray-500">Total Patients</p>
                    </div>
                  </div>

                  {/* Today's Appointments */}
                  <div className="bg-white p-6 rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center h-36">
                    <div className="w-11 h-11 rounded-xl bg-[#fff4eb] text-[#e08a46] flex items-center justify-center mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-[1.8rem] font-black text-gray-800 leading-none mb-2">8</h3>
                      <p className="text-[12px] font-bold text-gray-500">Today's Appointments</p>
                    </div>
                  </div>

                  {/* Completed Today */}
                  <div className="bg-white p-6 rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center h-36">
                    <div className="w-11 h-11 rounded-xl bg-[#fcebeb] text-[#d65e5e] flex items-center justify-center mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-[1.8rem] font-black text-gray-800 leading-none mb-2">5</h3>
                      <p className="text-[12px] font-bold text-gray-500">Completed Today</p>
                    </div>
                  </div>
                </div>

                {/* TODAY'S APPOINTMENTS LIST */}
                <div className="bg-white rounded-[1.2rem] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase">TODAY'S APPOINTMENTS</h3>
                    <a href="#" className="text-[#1b6a55] text-[12px] font-bold hover:underline">See all &rarr;</a>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-50">

                    {/* Patient 1 */}
                    <div className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-[42px] h-[42px] rounded-full bg-[#eefaf6] text-[#1b6a55] font-extrabold text-[13px] flex items-center justify-center shrink-0">SP</div>
                        <div>
                          <h4 className="font-extrabold text-[14px] text-gray-900 mb-0.5 group-hover:text-[#1b6a55] transition">Sunita Pandey</h4>
                          <p className="text-[12px] font-semibold text-gray-500">General Checkup - Patan Hospital</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[12px] font-extrabold text-[#1b6a55]">9:00 AM</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#eefaf6] text-[#1b6a55] text-[10px] font-bold">Confirmed</span>
                      </div>
                    </div>

                    {/* Patient 2 */}
                    <div className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-[42px] h-[42px] rounded-full bg-[#fff4eb] text-[#e08a46] font-extrabold text-[13px] flex items-center justify-center shrink-0">RK</div>
                        <div>
                          <h4 className="font-extrabold text-[14px] text-gray-900 mb-0.5 group-hover:text-[#e08a46] transition">Ramesh Karki</h4>
                          <p className="text-[12px] font-semibold text-gray-500">Follow-up - Bir Hospital</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[12px] font-extrabold text-[#e08a46]">10:30 AM</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fff4eb] text-[#e08a46] text-[10px] font-bold">Pending</span>
                      </div>
                    </div>

                    {/* Patient 3 */}
                    <div className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-[42px] h-[42px] rounded-full bg-[#fcebeb] text-[#d65e5e] font-extrabold text-[13px] flex items-center justify-center shrink-0">AS</div>
                        <div>
                          <h4 className="font-extrabold text-[14px] text-gray-900 mb-0.5 group-hover:text-[#d65e5e] transition">Anjali Shrestha</h4>
                          <p className="text-[12px] font-semibold text-gray-500">Consultation - Bir Hospital</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[12px] font-extrabold text-[#d65e5e]">11:00 AM</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fcebeb] text-[#d65e5e] text-[10px] font-bold">New</span>
                      </div>
                    </div>

                    {/* Patient 4 */}
                    <div className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-[42px] h-[42px] rounded-full bg-[#eefaf6] text-[#1b6a55] font-extrabold text-[13px] flex items-center justify-center shrink-0">BM</div>
                        <div>
                          <h4 className="font-extrabold text-[14px] text-gray-900 mb-0.5 group-hover:text-[#1b6a55] transition">Bikram Maharjan</h4>
                          <p className="text-[12px] font-semibold text-gray-500">Neurology - Patan Hospital</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[12px] font-extrabold text-[#1b6a55]">2:00 PM</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#eefaf6] text-[#1b6a55] text-[10px] font-bold">Confirmed</span>
                      </div>
                    </div>

                    {/* Patient 5 */}
                    <div className="py-4 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-[42px] h-[42px] rounded-full bg-[#fff4eb] text-[#e08a46] font-extrabold text-[13px] flex items-center justify-center shrink-0">NK</div>
                        <div>
                          <h4 className="font-extrabold text-[14px] text-gray-900 mb-0.5 group-hover:text-[#e08a46] transition">Nirmala Khadka</h4>
                          <p className="text-[12px] font-semibold text-gray-500">Post-op Review - Bir Hospital</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="text-[12px] font-extrabold text-[#1b6a55]">3:30 PM</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#eefaf6] text-[#1b6a55] text-[10px] font-bold">Confirmed</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column Container (Calendar + Patients) */}
              <div className="xl:col-span-5 bg-white rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/60 flex flex-col gap-6 md:gap-8 h-[900px]">

                {/* Sidebar Top Header */}
                <div className="flex justify-between items-center -mb-2">
                  <h2 className="text-[1.25rem] font-extrabold text-[#115546]">Appointments(8)</h2>
                  <span className="bg-[#e9ecef] text-gray-800 text-[11px] font-extrabold px-3 py-1.5 rounded-full">28 Apr 2026</span>
                </div>

                <InteractiveCalendar />

                {/* Patients Info Panel (Styled like Doctors Info Panel) */}
                <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 sm:p-6 border border-gray-200 relative mt-auto">

                  {/* Header */}
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#115546]">Your Patients</h3>
                    <a href="#" className="text-[#388e7b] font-bold text-[12px] sm:text-[13px] hover:underline">See all</a>
                  </div>

                  {/* List of patients */}
                  <div className="flex flex-col gap-3 mb-6">
                    {/* Patient 1 */}
                    <div className="bg-[#e9eded] rounded-[0.8rem] p-3 flex gap-4">
                      <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold flex-shrink-0">SP</div>
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 font-bold text-[10px]">9:00 AM</span>
                          <span className="text-gray-400 font-black cursor-pointer leading-none">...</span>
                        </div>
                        <h4 className="font-black text-gray-900 text-[13px]">Sunita Pandey</h4>
                        <p className="text-gray-500 text-[11px] font-semibold">General Checkup</p>
                      </div>
                    </div>

                    {/* Patient 2 */}
                    <div className="bg-[#e9eded] rounded-[0.8rem] p-3 flex gap-4">
                      <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold flex-shrink-0">RK</div>
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 font-bold text-[10px]">10:30 AM</span>
                          <span className="text-gray-400 font-black cursor-pointer leading-none">...</span>
                        </div>
                        <h4 className="font-black text-gray-900 text-[13px]">Ramesh Karki</h4>
                        <p className="text-gray-500 text-[11px] font-semibold">Follow-up</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-[0.6rem] bg-[#388e7b] flex items-center justify-center text-white hover:bg-[#2b6a5b] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-[0.6rem] bg-[#388e7b] flex items-center justify-center text-white hover:bg-[#2b6a5b] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-[#43a18a] to-[#1b6a55] text-white font-extrabold text-[13px] rounded-[0.6rem] hover:from-[#388e7b] hover:to-[#165544] transition flex items-center justify-center border-none shadow-[0_4px_10px_rgba(27,106,85,0.3)]">
                      + Add Patient
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

export default DoctorDashboard;
