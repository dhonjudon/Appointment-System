import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Importing reusable components used inside dashboard
import InteractiveCalendar from "../components/InteractiveCalendar";
import SchedulesBox from "../components/SchedulesBox";
import FollowUpsBox from "../components/FollowUpsBox";
import Navbar from "./Navbar";
const API_BASE_URL = "http://localhost:3000/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const resolveUserId = () => {
  const storedUser = getStoredUser();
  const candidates = [
    localStorage.getItem("userId"),
    localStorage.getItem("userID"),
    localStorage.getItem("patientId"),
    storedUser?.id,
    storedUser?.data?.id,
    storedUser?.data?.user?.id,
    storedUser?.user?.id,
    storedUser?.user_id,
  ];

  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) return value;
  }

  return null;
};

const toLocalDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatTimeLabel = (timeValue) => {
  if (!timeValue) return "";
  const [hours, minutes] = String(timeValue).slice(0, 5).split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const getDoctorName = (appointment) => {
  const firstName =
    appointment.doctor_first_name || appointment.first_name || "Doctor";
  const lastName = appointment.doctor_last_name || appointment.last_name || "";
  return `Dr. ${firstName} ${lastName}`.trim();
};

const getAppointmentDisplay = (appointment) => ({
  ...appointment,
  dateKey: toLocalDateKey(appointment.appointment_date),
  doctorName: getDoctorName(appointment),
  specialty: appointment.specialization_name || "General",
  hospital: appointment.hospital_name || "Hospital",
  timeLabel: formatTimeLabel(appointment.start_time),
  statusLabel: String(appointment.status || "pending").toLowerCase(),
});

function Dashboard() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    upcoming: 0,
    completed: 0,
    doctorsSeen: 0,
    appointmentCount: 0,
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from localStorage
  const userId = resolveUserId();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!userId) {
      setError("Please log in to view your dashboard.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userRes = await fetch(`${API_BASE_URL}/profile/${userId}`);
      const userData = userRes.ok ? await userRes.json() : null;

      if (userData?.data) {
        setPatientData(userData.data);
      }

      // Fetch appointments to get counts
      const appointmentsRes = await fetch(
        `${API_BASE_URL}/users/${userId}/appointments?page=1&limit=100`,
      );
      const appointmentsData = appointmentsRes.ok
        ? await appointmentsRes.json()
        : { data: { items: [] } };

      const appointments = appointmentsData.data?.items || [];
      setAppointments(appointments);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointment_date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate >= today && apt.status !== "cancelled";
      }).length;

      const completed = appointments.filter(
        (apt) => apt.status === "completed",
      ).length;

      const uniqueDoctors = new Map();
      appointments.forEach((apt) => {
        if (!uniqueDoctors.has(apt.doctor_id)) {
          uniqueDoctors.set(apt.doctor_id, getAppointmentDisplay(apt));
        }
      });
      setDoctors(Array.from(uniqueDoctors.values()).slice(0, 3));

      setStats({
        totalVisits: appointments.length,
        upcoming: upcoming,
        completed: completed,
        doctorsSeen: uniqueDoctors.size,
        appointmentCount: appointments.length,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Set default values on error
      setStats({
        totalVisits: 0,
        upcoming: 0,
        completed: 0,
        doctorsSeen: 0,
        appointmentCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizedAppointments = useMemo(
    () => appointments.map(getAppointmentDisplay).filter((apt) => apt.dateKey),
    [appointments],
  );

  const todayKey = toLocalDateKey(new Date());

  const upcomingAppointments = useMemo(
    () =>
      normalizedAppointments
        .filter(
          (apt) =>
            apt.statusLabel !== "cancelled" &&
            apt.statusLabel !== "completed" &&
            (!todayKey || apt.dateKey >= todayKey),
        )
        .sort((a, b) =>
          `${a.dateKey}${a.start_time}`.localeCompare(
            `${b.dateKey}${b.start_time}`,
          ),
        ),
    [normalizedAppointments, todayKey],
  );

  const followUpAppointments = useMemo(
    () =>
      normalizedAppointments
        .filter((apt) => apt.statusLabel === "completed")
        .sort((a, b) =>
          `${b.dateKey}${b.start_time}`.localeCompare(
            `${a.dateKey}${a.start_time}`,
          ),
        )
        .slice(0, 3),
    [normalizedAppointments],
  );

  const calendarHighlights = useMemo(
    () =>
      normalizedAppointments
        .filter((apt) => apt.statusLabel !== "cancelled")
        .map((apt) => apt.dateKey)
        .filter(Boolean),
    [normalizedAppointments],
  );

  const doctorCards = useMemo(() => {
    const unique = new Map();
    normalizedAppointments.forEach((appointment) => {
      if (!unique.has(appointment.doctor_id)) {
        unique.set(appointment.doctor_id, appointment);
      }
    });
    return Array.from(unique.values()).slice(0, 3);
  }, [normalizedAppointments]);

  useEffect(() => {
    setStats((current) => ({
      ...current,
      upcoming: upcomingAppointments.length,
      completed: normalizedAppointments.filter(
        (apt) => apt.statusLabel === "completed",
      ).length,
      doctorsSeen: doctorCards.length,
      appointmentCount: normalizedAppointments.length,
      totalVisits: normalizedAppointments.length,
    }));
  }, [doctorCards.length, normalizedAppointments, upcomingAppointments.length]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#DFF2EB] px-4 sm:px-6 lg:px-10 py-6 md:py-8 font-sans">
        {/* Centered container with max width */}
        <div className="max-w-[1400px] mx-auto">
          {/* Modular Grid Layout (responsive) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
            {/* LEFT COLUMN (Takes 7 cols on XL) */}
            <div className="xl:col-span-7 flex flex-col gap-6 md:gap-8">
              {/* NEW TOP BANNER */}
              <div
                className="bg-[#DFF2EB] rounded-[1.4rem] p-8 md:p-10 flex items-center justify-between relative overflow-hidden min-h-[280px]"
                style={{
                  background: `linear-gradient(135deg, #1f6b57 0%, #388e7b 100%)`,
                }}
              >
                {/* Decorative Circle matches the image */}
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-1/4 -right-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
                <div className="absolute top-[-30px] right-[-10px] w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>
                {/* Banner Content */}
                <div className="z-10 w-full">
                  {/* Greeting text */}
                  <h2 className="text-white text-2xl md:text-[2rem] font-sans font-extrabold mb-4 tracking-tight">
                    Good morning , {patientData?.first_name || "Guest"}!{" "}
                  </h2>
                  {/* Subtitle */}
                  <p className="text-[#aee0cf] text-sm md:text-base font-semibold mb-7">
                    Your health journey ,managed seemlessly
                  </p>
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-4">
                    {/* Find Doctor Button */}
                    <button
                      type="button"
                      onClick={() => navigate("/doctors")}
                      className="bg-white text-[#115546] font-extrabold text-[13px] md:text-[14px] px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-gray-100 transition shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Find a Doctor
                    </button>
                    {/* My Appointments Button */}
                    <button
                      type="button"
                      onClick={() => navigate("/appointment")}
                      className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-[13px] md:text-[14px] px-5 py-2.5 rounded-full flex items-center gap-2 transition border border-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                      My Appointments
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 SMALL BOXES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {/* Total Visits */}
                <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                  <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12h3.75l2.25-6 3 12 2.25-6h3.75"
                      />
                    </svg>
                  </div>
                  <div>
                    {/* Data */}
                    <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">
                      {stats.totalVisits}
                    </h3>
                    <p className="text-gray-500 font-bold text-[13px]">
                      Total Visits
                    </p>
                  </div>
                </div>

                {/* Upcoming card*/}
                <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                  <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">
                      {stats.upcoming}
                    </h3>
                    <p className="text-gray-500 font-bold text-[13px]">
                      Upcoming
                    </p>
                  </div>
                </div>

                {/* Completed card*/}
                <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                  <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">
                      {stats.completed}
                    </h3>
                    <p className="text-gray-500 font-bold text-[13px]">
                      Completed
                    </p>
                  </div>
                </div>

                {/* Doctors Seen card*/}
                <div className="bg-white rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col justify-center gap-4 min-h-[140px]">
                  <div className="w-11 h-11 rounded-xl bg-[#e3f2ed] flex items-center justify-center text-[#2b8871]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M6 3v3a4 4 0 0 0 8 0V3" />
                      <path d="M10 6v5a6 6 0 0 0 12 0v-2" />
                      <circle cx="22" cy="9" r="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.8rem] font-extrabold text-gray-900 leading-none mb-2">
                      {stats.doctorsSeen}
                    </h3>
                    <p className="text-gray-500 font-bold text-[13px]">
                      Doctors Seen
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedules & Follow Ups components*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <SchedulesBox appointments={upcomingAppointments} />
                <FollowUpsBox appointments={followUpAppointments} />
              </div>
            </div>

            {/* RIGHT COLUMN (Takes 5 cols on XL) */}
            <div className="xl:col-span-5 bg-white rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/60 flex flex-col gap-6 md:gap-8 h-[900px]">
              {/* Sidebar Top Header */}
              <div className="flex justify-between items-center -mb-2">
                <h2 className="text-[1.25rem] font-extrabold text-[#115546]">
                  Appointments({stats.appointmentCount})
                </h2>
                <span className="bg-[#e9ecef] text-gray-800 text-[11px] font-extrabold px-3 py-1.5 rounded-full">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {/* Calendar component */}
              <InteractiveCalendar highlightDates={calendarHighlights} />

              {/* Doctors Info Panel */}
              <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 sm:p-6 border border-gray-200 relative">
                {/* Header */}
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#115546]">
                    Your Doctors
                  </h3>
                  <a
                    href="#"
                    className="text-[#388e7b] font-bold text-[12px] sm:text-[13px] hover:underline"
                  >
                    See all
                  </a>
                </div>

                {/* List of doctors */}
                <div className="flex flex-col gap-3 mb-6">
                  {doctorCards.length > 0 ? (
                    doctorCards.map((doctor, idx) => {
                      const initials =
                        `${doctor.doctor_first_name?.charAt(0) || doctor.first_name?.charAt(0) || "D"}${doctor.doctor_last_name?.charAt(0) || doctor.last_name?.charAt(0) || ""}`.toUpperCase();
                      const specialization =
                        doctor.specialty ||
                        doctor.specialization_name ||
                        "General";
                      return (
                        <div
                          key={doctor.doctor_id || idx}
                          className="bg-[#e9eded] rounded-[0.8rem] p-3 flex gap-4"
                        >
                          <div className="w-[42px] h-[42px] rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between items-start">
                              <span className="text-gray-500 font-bold text-[10px]">
                                {new Date().toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                              <span className="text-gray-400 font-black cursor-pointer leading-none">
                                ...
                              </span>
                            </div>
                            <h4 className="font-black text-gray-900 text-[13px]">
                              {doctor.doctorName}
                            </h4>
                            <p className="text-gray-500 text-[11px] font-semibold">
                              {specialization}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-400 text-[12px] py-4">
                      No doctors scheduled
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2">
                  {/* Call button */}
                  <button className="w-10 h-10 rounded-[0.6rem] bg-[#388e7b] flex items-center justify-center text-white hover:bg-[#2b6a5b] transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  {/* Message button */}
                  <button className="w-10 h-10 rounded-[0.6rem] bg-[#388e7b] flex items-center justify-center text-white hover:bg-[#2b6a5b] transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </button>
                  {/* Book appointment button */}
                  <button
                    onClick={() => navigate("/doctors")}
                    className="flex-1 bg-gradient-to-r from-[#43a18a] to-[#1b6a55] text-white font-extrabold text-[13px] rounded-[0.6rem] hover:from-[#388e7b] hover:to-[#165544] transition flex items-center justify-center border-none shadow-[0_4px_10px_rgba(27,106,85,0.3)]"
                  >
                    + Book an Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
