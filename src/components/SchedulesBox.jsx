import React from "react";
import { Link } from "react-router-dom";

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatTime = (timeValue) => {
  if (!timeValue) return "";
  const [hours, minutes] = String(timeValue).slice(0, 5).split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

function SchedulesBox({ appointments = [] }) {
  const items = appointments.slice(0, 3);

  return (
    <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 border border-transparent relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 pl-2">
        <h3 className="font-extrabold text-[13px] text-gray-900 tracking-wider flex items-center">
          UPCOMING SCHEDULES
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </h3>
        <Link
          to="/appointment"
          className="text-[#388e7b] font-bold text-[13px] hover:underline flex items-center"
        >
          See all
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.map((appointment) => {
            const status = String(
              appointment.status || "pending",
            ).toLowerCase();
            const statusClasses =
              status === "completed"
                ? "bg-[#ddeadb] text-[#1b6a55]"
                : status === "confirmed"
                  ? "bg-[#ddeadb] text-[#1b6a55]"
                  : status === "rescheduled"
                    ? "bg-[#e8f3ff] text-[#2563eb]"
                    : "bg-[#ffecd1] text-[#b37012]";
            return (
              <div
                key={appointment.id}
                className="border border-[#a8cfc3] rounded-[0.8rem] p-3 flex justify-between items-center bg-[#f7fcfb]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10.5 h-10.5 rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {appointment.doctor_first_name?.[0] || "D"}
                    {appointment.doctor_last_name?.[0] || ""}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-[14px] truncate">
                      Dr. {appointment.doctor_first_name || "Doctor"}{" "}
                      {appointment.doctor_last_name || ""}
                    </h4>
                    <p className="text-gray-500 text-[12px] font-medium leading-tight truncate">
                      {appointment.specialization_name || "Specialist"}
                      <br />
                      {appointment.hospital_name || "Hospital"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#1b6a55] font-bold text-[13px]">
                    {formatDate(appointment.appointment_date)}
                  </p>
                  <p className="text-gray-600 text-[12px] font-semibold mb-1">
                    {formatTime(appointment.start_time)}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-extrabold px-3 py-0.5 min-w-[80px] text-center rounded-full ${statusClasses}`}
                  >
                    {status === "completed"
                      ? "Completed"
                      : status === "rescheduled"
                        ? "Rescheduled"
                        : status === "confirmed"
                          ? "Confirmed"
                          : "Pending"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[0.8rem] border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-6 text-center text-sm text-gray-500 font-medium">
            Your upcoming appointments will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedulesBox;
