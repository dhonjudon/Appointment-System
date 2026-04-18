import React from 'react';

function RescheduleConfirm({ selectedDate, selectedTime, selectedReason }) {

  // ✅ Format selected date nicely
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Not selected';

  return (
    <div className="w-full animate-fadeIn flex flex-col">
      
      {/* Title */}
      <p className="text-gray-500 font-bold text-[13px] mb-3">
        Review your changes before confirming
      </p>

      {/* Info Box */}
      <div className="flex flex-col rounded-[1rem] overflow-hidden border border-[#eaf4f1] shadow-sm">
        
        {/* Previous Date */}
        <div className="flex justify-between items-center bg-[#eef6f4] px-5 py-4 border-b border-[#eaf4f1]">
          <p className="text-[#8ac9ba] font-extrabold text-[11px] tracking-wider uppercase">
            Previous Date
          </p>
          <p className="text-gray-800 font-bold text-[13px]">
            April 10, 2026 {/* Replace with dynamic if needed */}
          </p>
        </div>

        {/* New Date and Time */}
        <div className="flex justify-between items-center bg-[#f5f9f8] px-5 py-4 border-b border-[#eaf4f1]">
          <p className="text-[#8ac9ba] font-extrabold text-[11px] tracking-wider uppercase">
            New Date and Time
          </p>
          <div className="text-right">
            <p className="text-gray-800 font-bold text-[13px]">
              {formattedDate}
            </p>
            <p className="text-gray-600 text-[12px]">
              {selectedTime || 'Time not selected'}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="flex justify-between items-center bg-[#eef6f4] px-5 py-4">
          <p className="text-[#8ac9ba] font-extrabold text-[11px] tracking-wider uppercase">
            Reason
          </p>
          <p className="text-gray-800 font-bold text-[13px] text-right max-w-[60%]">
            {selectedReason || 'Not selected'}
          </p>
        </div>

      </div>

      {/* Info Message */}
      <div className="bg-[#fff9eb] border border-[#f5d996] rounded-[0.8rem] p-4 mt-8 flex items-start gap-3 shadow-sm">
        <div className="text-[#d89728] mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[#a46513] text-[12.5px] font-extrabold leading-tight tracking-wide">
          Rescheduling is free up to 24 hrs before your appointment. A confirmation SMS and email will be sent once confirmed.
        </p>
      </div>

    </div>
  );
}

export default RescheduleConfirm;