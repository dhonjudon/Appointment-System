import React from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';
import SchedulesBox from '../components/SchedulesBox';
import FollowUpsBox from '../components/FollowUpsBox';

function Dashboard() {
  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white px-4 sm:px-6 lg:px-10 py-6 md:py-8 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Modular Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">

          {/* LEFT COLUMN (Takes 7 cols on XL) */}
          <div className="xl:col-span-7 flex flex-col gap-6 md:gap-8">

            {/* NEW TOP BANNER */}
            <div className="bg-[#2b8871] rounded-[1.4rem] p-8 md:p-10 flex items-center justify-between relative overflow-hidden min-h-[280px]" style={{ background: `linear-gradient(135deg, #1f6b57 0%, #388e7b 100%)` }}>
              {/* Decorative Circle matches the image */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-1/4 -right-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
              <div className="absolute top-[-30px] right-[-10px] w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>

              <div className="z-10 w-full">
                <h2 className="text-white text-2xl md:text-[2rem] font-sans font-extrabold mb-4 tracking-tight">
                  Good morning , Sarah! <span className="text-2xl md:text-3xl">👋</span>
                </h2>
                <p className="text-[#aee0cf] text-sm md:text-base font-semibold mb-7">
                  Your health journey ,managed seemlessly
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#" className="bg-white text-[#115546] font-extrabold text-[13px] md:text-[14px] px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-gray-100 transition shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find a Doctor
                  </a>
                  <a href="#" className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-[13px] md:text-[14px] px-5 py-2.5 rounded-full flex items-center gap-2 transition border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    My Appointments
                  </a>
                </div>
              </div>
            </div>

            {/* 4 SMALL BOXES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {/* Total Visits */}
              <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h3.75l2.25-6 3 12 2.25-6h3.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">5</h3>
                  <p className="text-gray-500 font-bold text-[13px]">Total Visits</p>
                </div>
              </div>

              {/* Upcoming */}
              <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">1</h3>
                  <p className="text-gray-500 font-bold text-[13px]">Upcoming</p>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">2</h3>
                  <p className="text-gray-500 font-bold text-[13px]">Completed</p>
                </div>
              </div>

              {/* Doctors Seen */}
              <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M6 3v3a4 4 0 0 0 8 0V3" />
                    <path d="M10 6v5a6 6 0 0 0 12 0v-2" />
                    <circle cx="22" cy="9" r="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">5</h3>
                  <p className="text-gray-500 font-bold text-[13px]">Doctors Seen</p>
                </div>
              </div>
            </div>

            {/* Schedules & Follow Ups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <SchedulesBox />
              <FollowUpsBox />
            </div>
          </div>

          {/* RIGHT COLUMN (Takes 5 cols on XL) */}
          <div className="xl:col-span-5 bg-white rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/60 flex flex-col gap-6 md:gap-8 h-[900px]">

            {/* Sidebar Top Header */}
            <div className="flex justify-between items-center -mb-2">
              <h2 className="text-[1.25rem] font-extrabold text-[#115546]">Appointments(2)</h2>
              <span className="bg-[#e9ecef] text-gray-800 text-[11px] font-extrabold px-3 py-1.5 rounded-full">10 march 2026</span>
            </div>

            <InteractiveCalendar />

            {/* Doctors Info Panel */}
            <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 sm:p-6 border border-gray-200 relative">

              {/* Header */}
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-[#115546]">Your Doctors</h3>
                <a href="#" className="text-[#388e7b] font-bold text-[12px] sm:text-[13px] hover:underline">See all</a>
              </div>

              {/* List of doctors */}
              <div className="flex flex-col gap-3 mb-6">
                {/* Doc 1 */}
                <div className="bg-[#e9eded] rounded-[0.8rem] p-3 flex gap-4">
                  <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold flex-shrink-0">PS</div>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 font-bold text-[10px]">11:30 AM</span>
                      <span className="text-gray-400 font-black cursor-pointer leading-none">...</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-[13px]">Dr. Priya Sharma</h4>
                    <p className="text-gray-500 text-[11px] font-semibold">Cardiologist</p>
                  </div>
                </div>

                {/* Doc 2 */}
                <div className="bg-[#e9eded] rounded-[0.8rem] p-3 flex gap-4">
                  <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold flex-shrink-0">AV</div>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 font-bold text-[10px]">2:30 PM</span>
                      <span className="text-gray-400 font-black cursor-pointer leading-none">...</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-[13px]">Dr. Amit Verma</h4>
                    <p className="text-gray-500 text-[11px] font-semibold">Neurologist</p>
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
                  + Book an Appointment
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
