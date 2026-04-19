import React, { useEffect, useState } from "react";

const MiniCalendar = ({
  scheduleDays = [],
  availableDates = [],
  bookedDates = [],
  selectedDate = null,
  onDateSelect,
  compact = false,
  interactive = true,
}) => {
  const normalizedScheduleDays = Array.from(
    new Set(
      scheduleDays
        .map((day) => Number(day))
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
    ),
  );
  const hasScheduleDays = normalizedScheduleDays.length > 0;

  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate || new Date()),
  );

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const defaultAvailable = [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30];
  const defaultBooked = [3, 10, 17, 24];

  const available =
    availableDates.length > 0 ? availableDates : defaultAvailable;
  const booked = hasScheduleDays
    ? bookedDates
    : bookedDates.length > 0
      ? bookedDates
      : defaultBooked;

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getDayStatus = (day) => {
    if (booked.includes(day)) return "booked";
    if (hasScheduleDays) {
      const weekday = new Date(year, month, day).getDay();
      return normalizedScheduleDays.includes(weekday) ? "available" : "none";
    }
    if (available.includes(day)) return "available";
    return "none";
  };

  const isSelectedDay = (day) => {
    return (
      selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const handleDateClick = (day, status) => {
    if (interactive && status === "available" && onDateSelect) {
      onDateSelect(new Date(year, month, day));
    }
  };

  const buildCalendarDays = () => {
    const grid = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = 0; i < 42; i++) {
      const dayNumber = i - startDay + 1;

      if (dayNumber < 1) {
        grid.push({
          key: `prev-${i}`,
          day: prevMonthDays + dayNumber,
          isCurrentMonth: false,
          status: "none",
        });
      } else if (dayNumber > daysInMonth) {
        grid.push({
          key: `next-${i}`,
          day: dayNumber - daysInMonth,
          isCurrentMonth: false,
          status: "none",
        });
      } else {
        grid.push({
          key: `current-${dayNumber}`,
          day: dayNumber,
          isCurrentMonth: true,
          status: getDayStatus(dayNumber),
        });
      }
    }

    return grid;
  };

  const days = buildCalendarDays();

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:border-emerald-300 flex items-center justify-center"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h4 className="text-sm font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h4>
        <button
          onClick={nextMonth}
          className="h-7 w-7 rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:border-emerald-300 flex items-center justify-center"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
      <div className="mb-1.5 grid grid-cols-7 gap-0.5">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            className="h-6 flex items-center justify-center text-[10px] font-medium text-gray-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const isSelected = day.isCurrentMonth && isSelectedDay(day.day);
          const isAvailable = day.status === "available";
          const isBooked = day.status === "booked";

          let baseClass =
            "h-8 w-8 rounded-lg text-xs font-medium transition-all flex items-center justify-center mx-auto";
          let stateClass = "text-gray-300";
          let cursorClass = "cursor-default";

          if (day.isCurrentMonth) {
            stateClass = "text-gray-600 hover:bg-gray-50";
          }

          if (isAvailable && interactive) {
            stateClass = isSelected
              ? "bg-emerald-500 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
            cursorClass = "cursor-pointer";
          } else if (isAvailable && !interactive) {
            stateClass = "bg-emerald-50 text-emerald-700";
            cursorClass = "cursor-default";
          }

          if (isBooked) {
            stateClass = "bg-gray-100 text-gray-400 line-through";
            cursorClass = "cursor-not-allowed";
          }

          return (
            <button
              type="button"
              key={day.key}
              disabled={!interactive || !day.isCurrentMonth || !isAvailable}
              onClick={() => handleDateClick(day.day, day.status)}
              className={`${baseClass} ${stateClass} ${cursorClass}`}
            >
              {day.day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center gap-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500"></div>
          <span className="text-[10px] font-medium text-gray-500">
            Available
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-gray-300"></div>
          <span className="text-[10px] font-medium text-gray-500">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
