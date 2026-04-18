import React, { useState } from 'react';

const InteractiveCalendar = ({
  initialDate,
  onDateSelect,
  isModal = false
}) => {
  // Setup valid default date safely
  const defaultDate = initialDate instanceof Date && !isNaN(initialDate) ? initialDate : new Date();

  const [currentMonth, setCurrentMonth] = useState(new Date(defaultDate.getFullYear(), defaultDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Calculate dynamic grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Align to Monday start
  const prevMonthDays = new Date(year, month, 0).getDate();

  const grid = [];
  let row = [];

  // Add previous month padding connecting days
  for (let i = startDay - 1; i >= 0; i--) {
    row.push({ d: prevMonthDays - i, isPrev: true });
  }

  // Fill inside days of the current month
  for (let d = 1; d <= daysInMonth; d++) {
    row.push({ d, isCurrent: true });
    if (row.length === 7) {
      grid.push(row);
      row = [];
    }
  }

  // Connect trailing forward month padding days
  let nextDay = 1;
  while (row.length > 0 && row.length < 7) {
    row.push({ d: nextDay++, isNext: true });
  }
  if (row.length === 7) {
    grid.push(row);
  }

  // Force 6 rows to identically preserve the static height aesthetic styling
  while (grid.length < 5) {
    let nextRow = [];
    for (let i = 0; i < 7; i++) {
      nextRow.push({ d: nextDay++, isNext: true });
    }
    grid.push(nextRow);
  }

  const handleDateClick = (dayObj) => {
    if (dayObj.isPrev || dayObj.isNext) return;

    const newDate = new Date(year, month, dayObj.d);
    setSelectedDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className={`bg-white rounded-[1.2rem] ${isModal ? 'shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-5 w-[300px]' : 'shadow-[0_12px_32px_rgba(43,136,113,0.15)] border border-gray-100 p-6 w-full'}`}>

      {/* Calendar Header */}
      <div className={`flex justify-between items-center ${isModal ? 'mb-4' : 'mb-6'}`}>
        <h3 className={`${isModal ? 'text-[1.15rem]' : 'text-[1.4rem]'} font-extrabold text-gray-950 px-2 tracking-tight`}>
          {monthNames[month]} {year}
        </h3>
        <div className="flex space-x-2 pr-2">
          <button type="button" onClick={handlePrevMonth} className="text-gray-400 hover:text-gray-800 transition p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button type="button" onClick={handleNextMonth} className="text-gray-800 hover:text-gray-900 transition p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className={`text-center font-extrabold text-gray-800 pb-2 ${isModal ? 'text-[11.5px]' : 'text-[12.5px]'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Box container for borders */}
      <div className="rounded-md border-t border-l border-gray-200 overflow-hidden box-border bg-white">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 border-b border-gray-200 box-border">
            {row.map((day, colIndex) => {

              let bgClass = "bg-white hover:bg-gray-50 cursor-pointer";
              let textClass = "text-gray-800";
              let fontClass = "text-[13px] font-semibold";

              const isSelected = selectedDate &&
                selectedDate.getDate() === day.d &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              if (day.isPrev || day.isNext) {
                bgClass = "bg-[#f4f7f8] cursor-default text-gray-300";
                textClass = "text-gray-300";
                fontClass = "text-[13px] font-bold";
              }
              else if (isSelected && day.isCurrent) {
                bgClass = "bg-[#43a18a]";
                textClass = "text-white";
                fontClass = "font-extrabold text-[13px]";
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleDateClick(day)}
                  className={`flex items-center justify-center ${isModal ? 'p-3 text-[12px]' : 'p-[18px] text-[13px]'} border-r border-gray-200 box-border transition-colors ${bgClass}`}
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
