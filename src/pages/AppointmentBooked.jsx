import React, { useState } from 'react';
import RescheduleModal from './RescheduleModal';
import logoImg from '../assets/logoimage.png';

function AppointmentBooked() {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(1);

  const faqs = [
    { question: "How much time does it take to confirm my appointment?", answer: "Usually within a few minutes of booking." },
    { question: "can i schedule my health checkup?", answer: "yes,you can reschedule your apointment .You cam so from the Booking history page and chat with our customer support team" },
    { question: "What if miss my appointment slot?", answer: "Please contact our support for a direct rescheduling." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white font-sans pb-20">



      <div className="px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

            {/* LEFT COLUMN */}
            <div className="xl:col-span-8 flex flex-col gap-6">

              {/* Main Booking Success Card */}
              <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-8 pt-7 border border-[#dcefed] flex flex-col justify-between h-auto lg:min-h-[480px]">

                {/* Header section */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-[28px] h-[28px] rounded-full bg-[#2b8871] flex items-center justify-center text-white flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex items-baseline gap-4 w-full">
                    <h2 className="text-[1.3rem] font-extrabold text-[#2b8871] tracking-tight">Appointment Booked !</h2>
                    <p className="text-gray-600 text-[13px] font-bold">You will receive a confirmation mail shortly.</p>
                  </div>
                </div>

                <hr className="border-[#dae9e7] mb-6" />

                {/* Center Details */}
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                  <div className="flex-1">
                    <p className="text-gray-400 font-extrabold text-[11px] tracking-wider mb-2 uppercase">Test Centre</p>
                    <h3 className="text-[18px] font-black text-gray-900 mb-0.5 leading-tight tracking-tight">Jan Sewa Diagonistic Centre</h3>
                    <p className="text-gray-500 text-[13px] font-extrabold">Baneshwor,Kathmandu,Bagmati Province</p>
                  </div>

                  <div className="flex flex-col items-end gap-5">
                    <button className="h-10 px-5 border-[1.5px] border-[#2b8871] text-[#2b8871] rounded-md flex items-center justify-center gap-2 hover:bg-[#f0f7f5] transition whitespace-nowrap self-start font-bold text-[13px] mt-1 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View Location
                    </button>

                    <div className="flex flex-col items-end">
                      <p className="text-[#8ac9ba] font-bold text-[11px] tracking-wider mb-2 uppercase">Booking ID</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#eef2f5] text-gray-700 font-extrabold text-[12.5px] px-[12px] py-[4px] rounded-md tracking-wide">SS-2026-4823X</span>
                        <button className="border border-[#7bc2b1] text-[#2b8871] font-bold text-[10.5px] px-[10px] py-[3px] rounded-[4px] hover:bg-gray-50 flex items-center gap-1 bg-white">
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="flex flex-col gap-8 mb-8">
                  <div>
                    <p className="text-[#8ac9ba] font-bold text-[11px] tracking-wider mb-3 uppercase">Booked For</p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-[34px] h-[34px] rounded-full border-[1.5px] border-[#8ac9ba] text-[#2b8871] flex items-center justify-center text-[10px] font-black bg-white">RS</div>
                        <div className="leading-tight">
                          <p className="text-gray-900 font-extrabold text-[13px]">Ram Shrestha</p>
                          <p className="text-gray-400 text-[11px] font-bold">EKAPT483RNB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-[34px] h-[34px] rounded-full border-[1.5px] border-[#8ac9ba] text-[#2b8871] flex items-center justify-center text-[10px] font-black bg-white">SS</div>
                        <div className="leading-tight">
                          <p className="text-gray-900 font-extrabold text-[13px]">Sita Shrestha</p>
                          <p className="text-gray-400 text-[11px] font-bold">EKAPT486TSD</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-[#dae9e7] mb-6" />

                {/* Date, Time & Reschedule */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-md flex items-center justify-center text-[#95b8b0] bg-[#eff5f4]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="leading-tight">
                      <p className="text-[#8ac9ba] font-extrabold text-[10px] tracking-wider mb-0.5 uppercase">Date and Time</p>
                      <p className="text-gray-900 font-black text-[14px]">03:30 PM <span className="text-gray-600 font-extrabold ml-1">TUE,March 31,2026</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsRescheduleOpen(true)}
                    className="h-10 px-5 border-[1.5px] border-[#2b8871] text-[#2b8871] font-bold text-[13px] rounded-md hover:bg-[#f0f7f5] transition flex items-center gap-2 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    RESCHEDULE
                  </button>
                </div>

              </div>

              {/* Instructions box */}
              <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-7 pt-6 border border-[#dcefed] flex flex-col gap-4 justify-between h-[230px]">
                <h3 className="flex items-center gap-3 text-[15px] font-black text-gray-900 mb-1">
                  <span className="w-8 h-8 rounded-md bg-[#eaf4f1] text-[#7bb8a7] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Instructions to follow
                </h3>
                <ul className="pl-3 space-y-2 mt-2">
                  <li className="flex items-start gap-2 text-[13px] font-bold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-[17px] text-[#2b8871] mt-[1px]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    The selected package require fasting for 12 hours
                  </li>
                  <li className="flex items-start gap-2 text-[13px] font-bold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-[17px] text-[#2b8871] mt-[1px]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Eat soft food before night
                  </li>
                  <li className="flex items-start gap-2 text-[13px] font-bold text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-[17px] text-[#2b8871] mt-[1px]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Please wear light coloured clothes for better ECG scanning
                  </li>
                  <li className="flex items-start gap-2 text-[13px] font-semibold text-[#8ac9ba]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-[17px] mt-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </li>
                  <li className="flex items-start gap-2 text-[13px] font-semibold text-[#8ac9ba] pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-[17px] mt-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </li>
                </ul>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-[1.2rem] shadow-sm p-7 border border-[#dcefed] flex flex-col justify-between h-auto lg:min-h-[480px]">
                <h3 className="text-[17px] font-black text-gray-900 mb-5 pb-5 border-b border-[#a8cfc3]">Booking Details</h3>

                <p className="text-[#8ac9ba] font-bold text-[11px] tracking-wider mb-5 uppercase">Package/Test Added</p>
                <div className="flex flex-col gap-4 mb-7 pl-1 border-b border-gray-100 pb-8">
                  <div className="flex justify-between items-center text-gray-800 font-bold text-[13px]">
                    <span>Complete Blood Picture(CBP)</span>
                    <span className="text-[11.5px] font-extrabold text-gray-900">Rs 1750 /-</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-800 font-bold text-[13px]">
                    <span>Health Men Test</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#2b8871] font-bold text-[12px]">2x</span>
                      <span className="text-[11.5px] font-extrabold text-gray-900">Rs 2800 /-</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-8 pl-1">
                  <div className="flex items-center gap-3 text-gray-800 font-bold text-[12.5px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home Collection
                  </div>
                  <div className="flex items-center gap-3 text-gray-800 font-bold text-[12.5px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Deduction from Wallet
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-between items-center pl-1">
                  <p className="text-gray-900 font-black text-[13px]">Total Amount Paid</p>
                  <p className="text-[#2b8871] font-black text-[15px]">Rs.4150 /-</p>
                </div>
              </div>

              {/* Support Help Block */}
              <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-7 pt-6 border border-[#dcefed] flex flex-col justify-between h-[230px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-[34px] h-[34px] rounded-full bg-[#f1f6f5] flex items-center justify-center text-[#5c9888]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-black text-gray-900 tracking-tight">We can help you</h3>
                </div>
                <p className="text-[#2b8871] text-[13.5px] font-bold leading-[1.6] mb-8 pr-4">
                  Get quick support for your booking, rescheduling, or any issues &mdash; all in one place.
                </p>
                <div className="flex justify-end mt-1">
                  <button className="bg-[#43a18a] hover:bg-[#2b8871] text-white font-extrabold text-[12.5px] px-[18px] py-[10px] rounded-[0.5rem] flex items-center gap-2 transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    Chat with us
                  </button>
                </div>
              </div>
            </div>

            {/* FULL WIDTH FAQS */}
            <div className="xl:col-span-12">
              <div className="bg-white rounded-[1.2rem] shadow-sm p-6 lg:p-7 pt-6 border border-[#dcefed] flex flex-col gap-4">
                <h3 className="flex items-start gap-3 text-[14.5px] font-extrabold text-gray-900 mb-1">
                  <span className="w-8 h-8 rounded-md bg-[#eaf4f1] text-[#2b8871] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-[#7bb8a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div className="flex flex-col mt-[2px]">
                    <span className="text-[15px] font-black">FAQS</span>
                    <span className="text-[12px] font-semibold text-gray-600 mt-[2px]">May be we have already answered your question</span>
                  </div>
                </h3>

                <div className="flex flex-col mt-2">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 pt-3">
                      <button
                        className="w-full flex items-center justify-between text-left"
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      >
                        <span className="font-bold text-[13px] text-gray-900 pr-4">{faq.question}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${openFaqIndex === idx ? 'bg-[#2b8871] text-white' : 'bg-[#eaf4f1] text-[#2b8871]'}`}>
                          {openFaqIndex === idx ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                          )}
                        </div>
                      </button>
                      {openFaqIndex === idx && (
                        <div className="mt-3 text-[13px] leading-relaxed font-bold text-gray-500 animate-fadeIn pr-8">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Reschedule Modal State Output */}
      {isRescheduleOpen && <RescheduleModal onClose={() => setIsRescheduleOpen(false)} />}

    </div>
  );
}

export default AppointmentBooked;
