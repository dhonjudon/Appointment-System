import React from 'react';

function FollowUpsBox() {
  return (
    <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 border border-transparent relative overflow-hidden flex flex-col h-[290px]">
      <div className="flex justify-between items-center mb-6 pl-2 shrink-0">
        <h3 className="font-extrabold text-[13px] text-gray-900 tracking-wider flex items-center">
          FOLLOW-UPS
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[15px] w-[15px] mx-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="ml-2 bg-[#ffebee] text-[#d32f2f] text-[10px] font-extrabold px-2 py-[2px] rounded-full">2 due</span>
        </h3>
        <a href="#" className="text-[#388e7b] font-bold text-[13px] hover:underline flex items-center">
          See all
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-grow scrollbar-thin scrollbar-thumb-gray-200">
        {/* Due Card 1 */}
        <div className="border border-red-300 rounded-[0.8rem] p-3 flex justify-between items-center bg-[#fffaf9]">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm">PS</div>
            <div>
              <h4 className="font-bold text-gray-900 text-[14px]">Dr.Pritam Shakya</h4>
              <p className="text-gray-500 text-[12px] font-medium leading-tight">Neurologist<br />Bir Hopsital</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-[#d32f2f] text-[13px] font-bold">March 24</p>
            <p className="text-gray-600 text-[12px] font-semibold mb-1">9:00 AM</p>
            <span className="inline-block bg-[#ffcccc] text-[#d32f2f] text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full">Reschedule</span>
          </div>
        </div>

        {/* Due Card 2 */}
        <div className="border border-red-300 rounded-[0.8rem] p-3 flex justify-between items-center bg-[#fffaf9]">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm">PS</div>
            <div>
              <h4 className="font-bold text-gray-900 text-[14px]">Dr.Pritam Shakya</h4>
              <p className="text-gray-500 text-[12px] font-medium leading-tight">Neurologist<br />Bir Hopsital</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-[#d32f2f] text-[13px] font-bold">March 24</p>
            <p className="text-gray-600 text-[12px] font-semibold mb-1">9:00 AM</p>
            <span className="inline-block bg-[#ffcccc] text-[#d32f2f] text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full">Reschedule</span>
          </div>
        </div>

        {/* Complete Follow up card */}
        <div className="border border-[#70b3a3] rounded-[0.8rem] p-3 flex justify-between items-center bg-[#f7fcfb]">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm">PS</div>
            <div>
              <h4 className="font-bold text-gray-900 text-[14px]">Dr.Pritam Shakya</h4>
              <p className="text-gray-500 text-[12px] font-medium leading-tight">Neurologist<br />Bir Hopsital</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-[#1b6a55] text-[13px] font-bold">March 24</p>
            <p className="text-gray-600 text-[12px] font-semibold mb-1">9:00 AM</p>
            <span className="inline-block bg-[#ddeadb] text-[#1b6a55] text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full">Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowUpsBox;
