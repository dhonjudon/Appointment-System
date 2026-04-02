import React, { useState } from 'react';
import RescheduleModal from './RescheduleModal';

function AppointmentBooked() {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef2f5] px-6 lg:px-10 py-8 font-sans pb-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* Main Booking Success Card */}
            <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-8 border border-gray-100">
              
              {/* Header section */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#2b8871] flex items-center justify-center text-white flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[1.35rem] font-extrabold text-[#115546] tracking-tight">Appointment Booked !</h2>
                  <p className="text-gray-600 text-[13px] font-semibold">You will receive a confirmation mail shortly.</p>
                </div>
              </div>

              <hr className="border-gray-200 mb-6" />

               {/* Center Details */}
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                 <div className="flex-1">
                    <p className="text-gray-400 font-extrabold text-[11px] tracking-wider mb-2 uppercase">Test Centre</p>
                    <h3 className="text-[17px] font-extrabold text-gray-900 mb-1 leading-tight tracking-tight">Jan Sewa Diagnostic Centre</h3>
                    <p className="text-gray-600 text-[13px] font-semibold">Baneshwor, Kathmandu, Bagmati Province</p>
                 </div>
                 <button className="h-10 px-4 border border-[#2b8871] text-[#2b8871] rounded-md flex items-center gap-2 hover:bg-[#f0f7f5] transition whitespace-nowrap self-start font-bold text-[13px]">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   View Location
                 </button>
              </div>

              {/* Patient & Booking ID */}
              <div className="flex flex-col md:flex-row justify-between mb-8">
                 <div className="flex-1">
                    <p className="text-[#8ac9ba] font-bold text-[11px] tracking-wider mb-3 uppercase">Booked For</p>
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full border border-[#8ac9ba] text-[#59a896] flex items-center justify-center text-[10px] font-bold bg-[#f1f8f6]">RS</div>
                         <div className="leading-tight">
                           <p className="text-gray-900 font-extrabold text-[13px]">Ram Shrestha</p>
                           <p className="text-gray-400 text-[10px] font-bold">EKAPT483RNR</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full border border-[#8ac9ba] text-[#59a896] flex items-center justify-center text-[10px] font-bold bg-[#f1f8f6]">SS</div>
                         <div className="leading-tight">
                           <p className="text-gray-900 font-extrabold text-[13px]">Sita Shrestha</p>
                           <p className="text-gray-400 text-[10px] font-bold">EKAPT486TSD</p>
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-6 md:mt-0 flex flex-col md:items-start self-start">
                    <p className="text-gray-400 font-extrabold text-[11px] tracking-wider mb-2 uppercase">Booking ID</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#eef2f5] text-gray-700 font-bold text-[13px] px-3 py-1 rounded-sm tracking-wide">SS-2026-48XSE</span>
                      <button className="border border-[#7bc2b1] text-[#2b8871] font-bold text-[10px] px-2 py-1 rounded-sm hover:bg-gray-50 flex items-center gap-1">
                         Copy
                      </button>
                    </div>
                 </div>
              </div>

              <hr className="border-gray-200 mb-6" />

              {/* Date, Time & Reschedule */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-9 h-9 border border-[#8ac9ba] rounded-full flex items-center justify-center text-[#2b8871] bg-[#f7fbf8]">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   </div>
                   <div>
                      <p className="text-[#8ac9ba] font-bold text-[10px] tracking-wider mb-0.5 uppercase">Date and Time</p>
                      <p className="text-gray-900 font-extrabold text-[14px]">03:30 PM <span className="text-gray-600 font-bold ml-1">TUE, March 31, 2026</span></p>
                   </div>
                 </div>

                 <button 
                  onClick={() => setIsRescheduleOpen(true)}
                  className="h-10 px-5 border border-[#2b8871] text-[#2b8871] font-bold text-[13px] rounded-md hover:bg-[#f0f7f5] transition flex items-center gap-2"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   RESCHEDULE
                 </button>
              </div>

            </div>

            {/* Instructions box */}
            <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-8 border border-gray-100 flex flex-col gap-4">
               <h3 className="flex items-center gap-2 text-[14.5px] font-extrabold text-gray-900">
                 <span className="w-6 h-6 rounded-md bg-[#eaf4f1] text-[#2b8871] flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                 </span>
                 Instructions to follow
               </h3>
               <ul className="pl-2 space-y-2 mt-2">
                 <li className="flex items-start gap-2 text-[13px] font-semibold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#449c86] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    The selected package require fasting for 12 hours
                 </li>
                 <li className="flex items-start gap-2 text-[13px] font-semibold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#449c86] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Eat soft food before night
                 </li>
                 <li className="flex items-start gap-2 text-[13px] font-semibold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#449c86] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Please wear light coloured clothes for better ECG scanning
                 </li>
                 <li className="flex items-start gap-2 text-[13px] font-semibold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#449c86] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Arrive 10 minutes prior to your schedule.
                 </li>
               </ul>
            </div>

            {/* FAQS box */}
            <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-8 border border-gray-100 flex flex-col gap-4 min-h-[150px]">
               <h3 className="flex items-center gap-2 text-[14.5px] font-extrabold text-gray-900">
                 <span className="w-6 h-6 rounded-md bg-[#eaf4f1] text-[#2b8871] flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </span>
                 FAQS
               </h3>
               <p className="pl-8 text-sm text-gray-400 font-medium italic">No frequently asked questions available for this center yet.</p>
            </div>
            
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="bg-white rounded-[1.2rem] shadow-sm p-7 border border-gray-100">
                <h3 className="text-lg font-extrabold text-gray-900 mb-4 pb-4 border-b border-[#a8cfc3]">Booking Details</h3>
                
                <p className="text-[#8ac9ba] font-bold text-[11px] tracking-wider mb-4 uppercase">Package/Test Added</p>
                <div className="flex flex-col gap-3 mb-8">
                  <p className="text-gray-800 font-bold text-[13px]">Complete Blood Picture(CBP)</p>
                  <p className="text-gray-800 font-bold text-[13px]">Health Men Test</p>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-800 font-bold text-[13px]">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                     </svg>
                     Home Collection
                  </div>
                  <div className="flex items-center gap-3 text-gray-800 font-bold text-[13px]">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                     </svg>
                     Deduction from Wallet
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-200 flex justify-between items-center">
                   <p className="text-gray-900 font-extrabold text-[13px]">Total Amount Paid</p>
                   <p className="text-[#2b8871] font-extrabold text-[15px]">Rs.4150 /-</p>
                </div>
             </div>

             {/* Right side blank blocks */}
             <div className="bg-white rounded-[1.2rem] shadow-sm border border-gray-100 min-h-[150px]"></div>
             <div className="bg-white rounded-[1.2rem] shadow-sm border border-gray-100 h-[80px]"></div>
          </div>

        </div>
      </div>
      
      {/* Reschedule Modal State Output */}
      {isRescheduleOpen && <RescheduleModal onClose={() => setIsRescheduleOpen(false)} />}

    </div>
  );
}

export default AppointmentBooked;
