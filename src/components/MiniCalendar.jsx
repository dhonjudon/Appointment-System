import React, { useState } from "react";

const MiniCalendar = ({
  availableDates = [],
  bookedDates = [],
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // April 2026

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Sample availability data (green = available, red = booked/unavailable)
  const defaultAvailable = [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30];
  const defaultBooked = [3, 10, 17, 24];

  const available =
    availableDates.length > 0 ? availableDates : defaultAvailable;
  const booked = bookedDates.length > 0 ? bookedDates : defaultBooked;

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getDayStatus = (day) => {
    if (booked.includes(day)) return "booked";
    if (available.includes(day)) return "available";
    return "none";
  };

  const handleDateClick = (day, status) => {
    if (status === "available" && onDateSelect) {
      onDateSelect(new Date(year, month, day));
    }
  };

  const renderDays = () => {
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-7 h-7" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getDayStatus(day);
      let bgClass = "bg-white border border-gray-200";
      let textClass = "text-gray-600";
      let cursor = "cursor-default";

      if (status === "available") {
        bgClass = "bg-emerald-500 border border-emerald-600";
        textClass = "text-white";
        cursor = "cursor-pointer hover:bg-emerald-600";
      } else if (status === "booked") {
        bgClass = "bg-red-400 border border-red-500";
        textClass = "text-white";
        cursor = "cursor-not-allowed";
      }

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day, status)}
          className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold transition-all ${bgClass} ${textClass} ${cursor}`}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="bg-[#f0fdfa] rounded-2xl p-4 border border-emerald-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevMonth}
          className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h4 className="text-sm font-bold text-[#0f766e]">
          {monthNames[month]} {year}
        </h4>
        <button
          onClick={nextMonth}
          className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            className="w-7 h-5 flex items-center justify-center text-[10px] font-bold text-gray-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-emerald-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-[10px] text-gray-500 font-medium">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-400"></div>
          <span className="text-[10px] text-gray-500 font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-gray-200"></div>
          <span className="text-[10px] text-gray-500 font-medium">
            No slots
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
