import React, { useState, useEffect } from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';
import SchedulesBox from '../components/SchedulesBox';
import FollowUpsBox from '../components/FollowUpsBox';

function Dashboard() {
  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { title: "Special Discount on Full Body Checkups", desc: "Available for a limited time at listed diagnostic centers." },
    { title: "New Cardiology Wing Open", desc: "Norvic International just expanded its capacity." },
    { title: "Free Flu Shots", desc: "Register early to get your free seasonal flu shot." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 sm:px-6 lg:px-10 py-6 md:py-8 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <h1 className="text-2xl md:text-[2rem] font-sans font-extrabold text-gray-900 mb-6 md:mb-8 tracking-tight">
          Good morning , Sarah! <span className="text-2xl md:text-3xl">👋</span>
        </h1>

        {/* Modular Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* LEFT COLUMN (Takes 7 cols on XL) */}
          <div className="xl:col-span-7 flex flex-col gap-8">

            {/* Top Row: Schedules & Follow Ups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchedulesBox />
              <FollowUpsBox />
            </div>

            {/* Middle Row: Ads Slideshow */}
            <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] pb-3">
              <div
                className="w-full h-48 md:h-56 rounded-t-[1.2rem] lg:h-[280px] bg-[#2b8871] relative flex items-center overflow-hidden transition-colors"
                style={{ background: `linear-gradient(135deg, #1f6b57 0%, #388e7b 100%)` }}
              >
                {/* Animated Background SVG shapes */}
                <div className="absolute top-0 right-0 opacity-20">
                  <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ffffff" d="M45.7,-76.4C58.9,-69.3,69.1,-55.3,77.5,-40.7C85.9,-26.1,92.5,-10.9,90.3,3.5C88.1,17.9,77.1,31.4,66.3,43.2C55.5,54.9,44.9,64.9,32.1,72.4C19.3,79.8,4.3,84.7,-10.2,85.2C-24.7,85.6,-39.7,81.6,-51.7,73.4C-63.7,65.2,-72.7,52.8,-80.1,38.9C-87.5,25,-93.3,9.5,-91.6,-5C-89.9,-19.5,-80.7,-33,-70.6,-44C-60.5,-55,-49.5,-63.5,-37.2,-71.2C-24.9,-78.9,-11.3,-85.7,2.2,-89.4C15.7,-93.1,32.5,-83.5,45.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
                  </svg>
                </div>

                {/* Slideshow Content */}
                <div className="px-6 md:px-8 lg:px-12 z-10 w-full animate-fadeIn transition duration-500 key={currentSlide}">
                  <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold font-sans mb-1 md:mb-2 leading-tight">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-[#aee0cf] text-xs md:text-sm lg:text-base font-medium max-w-[200px] sm:max-w-sm">
                    {slides[currentSlide].desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center px-6 mt-4 gap-2">
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${currentSlide === i ? 'bg-[#2b8871]' : 'bg-gray-300'}`} onClick={() => setCurrentSlide(i)}></div>
                  ))}
                </div>
                <span className="text-gray-500 font-bold text-[11px] ml-2">Hospital Campaigns near you</span>
              </div>
            </div>

            {/* Bottom Row: Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 md:p-6 border border-white border-l-[8px] border-l-[#2b8871] flex flex-col justify-between min-h-[220px] md:h-[300px]">
                <div>
                  <h4 className="text-[#2b8871] font-extrabold text-[14px] md:text-[18px] tracking-wider mb-2 md:mb-3 uppercase">Norvic International</h4>
                  <h3 className="font-extrabold text-gray-900 text-lg md:text-2xl mb-2 md:mb-3">Women's Health Week</h3>
                  <p className="text-gray-500 font-semibold text-xs md:text-sm mb-4 md:mb-5">Free gynecology consultations. Apr 5-10</p>
                </div>
                <a href="#" className="font-extrabold text-[#2b8871] text-[13px] hover:underline flex items-center">
                  Learn more <span className="ml-1">→</span>
                </a>
              </div>

              <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 md:p-6 border border-white border-l-[8px] border-l-[#2b8871] flex flex-col justify-between min-h-[220px] md:h-[300px]">
                <div>
                  <h4 className="text-[#2b8871] font-extrabold text-[14px] md:text-[18px] tracking-wider mb-2 md:mb-3 uppercase">Grande Hospital</h4>
                  <h3 className="font-extrabold text-gray-900 text-lg md:text-2xl mb-2 md:mb-3">Diabetes Screening Drive</h3>
                  <p className="text-gray-500 font-semibold text-xs md:text-sm mb-4 md:mb-5">Free HbA1c testing. Apr 2, 9AM-1PM</p>
                </div>
                <a href="#" className="font-extrabold text-[#2b8871] text-[13px] hover:underline flex items-center">
                  Register <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Takes 5 cols on XL) */}
          <div className="xl:col-span-5 bg-white rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/60 flex flex-col gap-6 md:gap-8 h-full">

            {/* Sidebar Top Header */}
            <div className="flex justify-between items-center -mb-2">
              <h2 className="text-[1.25rem] font-extrabold text-[#115546]">Appointments(3)</h2>
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

                {/* Doc 3 */}
                <div className="bg-[#e9eded] rounded-[0.8rem] p-3 flex gap-4">
                  <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold flex-shrink-0">RP</div>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 font-bold text-[10px]">4:00 PM</span>
                      <span className="text-gray-400 font-black cursor-pointer leading-none">...</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-[13px]">Dr. Rajesh Patel</h4>
                    <p className="text-gray-500 text-[11px] font-semibold">Physiotherapist</p>
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
