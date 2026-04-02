import React from 'react';

function SchedulesBox() {
  return (
    <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 border border-transparent relative overflow-hidden flex flex-col h-[290px]">

      <div className="flex justify-between items-center mb-6 pl-2 shrink-0">
        <h3 className="font-extrabold text-[13px] text-gray-900 tracking-wider flex items-center">
          UPCOMING SCHEDULES
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </h3>
        <a href="#" className="text-[#388e7b] font-bold text-[13px] hover:underline flex items-center">
          See all
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-grow scrollbar-thin scrollbar-thumb-gray-200">
        {/* Card 1 */}
        <div className="border border-[#70b3a3] rounded-[0.8rem] p-3 flex justify-between items-center bg-[#f7fcfb]">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm">PS</div>
            <div>
              <h4 className="font-bold text-gray-900 text-[14px]">Dr.Pritam Shakya</h4>
              <p className="text-gray-500 text-[12px] font-medium leading-tight">Neurologist<br />Bir Hopsital</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#1b6a55] font-bold text-[13px]">March 24</p>
            <p className="text-gray-600 text-[12px] font-semibold mb-1">9:00 AM</p>
            <span className="inline-block bg-[#ddeadb] text-[#1b6a55] text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full">Confirmed</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-[#a8cfc3] rounded-[0.8rem] p-3 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm">AP</div>
            <div>
              <h4 className="font-bold text-gray-900 text-[14px]">Dr.Amrita Pandey</h4>
              <p className="text-gray-500 text-[12px] font-medium leading-tight">Gastroenterologist<br />Patan Hopsital</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#1b6a55] font-bold text-[13px]">March 26</p>
            <p className="text-gray-600 text-[12px] font-semibold mb-1">2:00 PM</p>
            <span className="inline-block bg-[#ffecd1] text-[#b37012] text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full">Pending</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-[#a8cfc3] rounded-[0.8rem] p-3 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm">SS</div>
            <div>
              <h4 className="font-bold text-gray-900 text-[14px]">Dr.Amrita Pandey</h4>
              <p className="text-gray-500 text-[12px] font-medium leading-tight">Cardiologist<br />Norvic</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#1b6a55] font-bold text-[13px]">March 28</p>
            <p className="text-gray-600 text-[12px] font-semibold mb-1">3:30 PM</p>
            <span className="inline-block bg-[#ddeadb] text-[#1b6a55] text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full">Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulesBox;
