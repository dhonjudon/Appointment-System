import React, { useState } from 'react';

const InteractiveCalendar = ({ 
  initialDate = new Date(2026, 2, 10), // March 10, 2026
  onDateSelect,
  isModal = false 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Hardcoded for the design mockup (March 2026)
  const daysInMonth = 31;
  const firstDayOfMonth = 6; 
  
  // Design grid exactly:
  // Row 1: 1..7
  // Row 2: 8..14
  // Row 3: 15..21
  // Row 4: 22..28
  // Row 5: 29, 30, 31, Next: 1, 2, 3, 4

  const grid = [
    [{d: 1}, {d: 2}, {d: 3}, {d: 4}, {d: 5}, {d: 6}, {d: 7}],
    [{d: 8}, {d: 9}, {d: 10, highlighted: 'active'}, {d: 11}, {d: 12}, {d: 13}, {d: 14}],
    [...[15, 16, 17].map(d=>({d})), {d: 18, highlighted: 'light'}, ...[19, 20, 21].map(d=>({d}))],
    ...[
      [{d: 22}, {d: 23}, {d: 24, highlighted: 'light'}, {d: 25}, {d: 26}, {d: 27, highlighted: 'light'}, {d: 28}],
      [{d: 29}, {d: 30}, {d: 31}, {d: 1, next: true}, {d: 2, next: true}, {d: 3, next: true}, {d: 4, next: true}]
    ]
  ];

  const handleDateClick = (day) => {
    if (day.next) return;
    if (onDateSelect) {
      onDateSelect(new Date(2026, 2, day.d));
    }
  };

  return (
    <div className={`bg-white rounded-[1.2rem] ${isModal ? 'shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-8' : 'shadow-[0_12px_32px_rgba(43,136,113,0.15)] border border-gray-100 p-6'}`}>
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[1.4rem] font-extrabold text-gray-950 px-2 tracking-tight">March 2026</h3>
        <div className="flex space-x-2 pr-2">
          <button className="text-gray-400 hover:text-gray-800 transition p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="text-gray-800 hover:text-gray-900 transition p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 mb-4">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
          <div key={day} className="text-center text-[12.5px] font-extrabold text-gray-800 pb-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Box container for borders */}
      <div className="rounded-md border-t border-l border-gray-200 overflow-hidden box-border">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 border-b border-gray-200 box-border">
            {row.map((day, colIndex) => {
              
              let bgClass = "bg-white hover:bg-gray-50 cursor-pointer";
              let textClass = "text-gray-800";
              let fontClass = "text-[13px] font-semibold"; // Normal dates are semi-boldish

              if (day.next) {
                bgClass = "bg-[#f4f7f8] cursor-default"; 
                textClass = "text-gray-300";
                fontClass = "text-[13px] font-bold";
              } 
              else if (day.highlighted === 'active') {
                bgClass = "bg-[#43a18a]"; 
                textClass = "text-white";
                fontClass = "font-extrabold text-[13px]";
              } 
              else if (day.highlighted === 'light') {
                bgClass = "bg-[#ddeadb] cursor-pointer hover:opacity-80"; 
                textClass = "text-gray-900";
                fontClass = "font-extrabold text-[13px]";
              }

              return (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  onClick={() => handleDateClick(day)}
                  className={`
                    flex items-center justify-center p-[18px] border-r border-gray-200 box-border
                    transition-colors ${bgClass}
                  `}
                >
                  <span className={`${textClass} ${fontClass}`}>{day.d}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveCalendar;
