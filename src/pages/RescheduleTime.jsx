import React from 'react';

function RescheduleTime({ selectedTime, setSelectedTime, times }) {
  return (
    <div className="w-full animate-fadeIn flex flex-col gap-5">
      <div className="flex">
        <div className="bg-[#eef5f3] border border-[#a8cfc3] text-[#2b8871] px-4 py-2 rounded-md font-bold text-[13px] flex items-center gap-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Fri, April 1, 2026
        </div>
      </div>

      {Object.entries(times).map(([period, slots]) => (
        <div key={period}>
          <h4 className="text-[#8ac9ba] font-extrabold text-[12px] tracking-wider mb-3 uppercase">{period}</h4>
          <div className="grid grid-cols-4 gap-3">
             {slots.map((time, idx) => {
                const isSpecial = time === '7:00 AM' || time === '9:00 AM'; // from mockup greyed out logic
                if (isSpecial) {
                  return (
                    <button key={idx} disabled className="bg-[#e6ecea] text-gray-500 border border-gray-200 rounded-md py-2 text-[13px] font-bold cursor-not-allowed">
                      {time}
                    </button>
                  );
                }
                const isSelected = selectedTime === time;
                return (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedTime(time)}
                    className={`border rounded-md py-2 text-[13px] font-bold transition-all ${
                      isSelected ? 'bg-[#2b8871] border-[#2b8871] text-white shadow-md' : 'border-[#8ac9ba] text-gray-700 hover:bg-[#f0f7f5]'
                    }`}
                  >
                    {time}
                  </button>
                );
             })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RescheduleTime;
