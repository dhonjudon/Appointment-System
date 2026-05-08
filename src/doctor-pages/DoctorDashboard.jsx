import React, { useState, useEffect } from "react";
import InteractiveCalendar from "../components/InteractiveCalendar";
import DoctorSidebar from "../components/DoctorSidebar";
import { Link } from "react-router-dom";
import { NotificationBell } from "../components/NotificationBell";

const API_BASE_URL = "http://localhost:3000/api";

function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedToday: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem("doctorId") || 1;

  useEffect(() => {
    fetchDoctorDashboardData();
  }, []);

  const fetchDoctorDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch doctor profile
      const doctorRes = await fetch(`${API_BASE_URL}/doctors/${doctorId}`);
      const doctorData = doctorRes.ok ? await doctorRes.json() : null;

      if (doctorData?.data) {
        setDoctorData(doctorData.data);
      }

      // Fetch doctor patients
      const patientsRes = await fetch(
        `${API_BASE_URL}/doctors/${doctorId}/patients?limit=100`,
      );
      const patientsData = patientsRes.ok
        ? await patientsRes.json()
        : { data: { items: [] } };

      const patientsList = patientsData.data?.items || [];
      setPatients(patientsList.slice(0, 2)); // Show first 2 patients

      // Fetch doctor appointments
      const appointmentsRes = await fetch(
        `${API_BASE_URL}/doctors/${doctorId}/appointments`,
      );
      const appointmentsData = appointmentsRes.ok
        ? await appointmentsRes.json()
        : { data: { items: [] } };

      const appointmentsList = appointmentsData.data?.items || [];
      setAppointments(appointmentsList);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAppts = appointmentsList.filter((apt) => {
        const aptDate = new Date(apt.appointment_date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      }).length;

      const completedAppts = appointmentsList.filter(
        (apt) => apt.status === "completed",
      ).length;

      setStats({
        totalPatients: patientsList.length,
        todayAppointments: todayAppts,
        completedToday: completedAppts,
      });
    } catch (err) {
      console.error("Error fetching doctor dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-gradient-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[72px] bg-transparent px-8 flex items-center justify-between z-10 shrink-0">
          <h1 className="text-xl font-bold text-gray-800"></h1>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-500">
              Tuesday, 28 April 2026
            </span>
            <NotificationBell userId={doctorData?.user_id} />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1500px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="xl:col-span-7 flex flex-col gap-6">
                {/* Banner */}
                <div className="bg-[#1b6a55] rounded-[1.5rem] p-8 relative overflow-hidden text-white shadow-md">
                  <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
                  <div className="absolute right-[10%] bottom-[-40%] w-80 h-80 bg-white/5 rounded-full pointer-events-none"></div>

                  <div className="relative z-10">
                    <p className="text-white/80 text-[10px] font-bold tracking-widest mb-2 uppercase">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                    <h2 className="text-[2rem] font-extrabold mb-1 tracking-tight">
                      Good morning, Dr. {doctorData?.first_name || "Doctor"} 👋
                    </h2>
                    <p className="text-white/90 text-sm mb-6 font-medium">
                      You have {stats.todayAppointments} patients scheduled
                      today
                    </p>

                    <div className="flex gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-[#388e7b] text-white text-[11px] font-extrabold flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white"></span>{" "}
                        On duty
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-[#145140]/80 text-white text-[11px] font-extrabold shadow-sm backdrop-blur-sm">
                        Bir Hospital, Ward 3
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Stats Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {/* Total Patients */}
                  <div className="bg-white p-6 rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center h-36">
                    <div className="w-11 h-11 rounded-xl bg-[#eefaf6] text-[#1b6a55] flex items-center justify-center mb-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.8rem] font-black text-gray-800 leading-none mb-2">
                        {stats.totalPatients}
                      </h3>
                      <p className="text-[12px] font-bold text-gray-500">
                        Total Patients
                      </p>
                    </div>
                  </div>

                  {/* Today's Appointments */}
                  <div className="bg-white p-6 rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center h-36">
                    <div className="w-11 h-11 rounded-xl bg-[#fff4eb] text-[#e08a46] flex items-center justify-center mb-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.8rem] font-black text-gray-800 leading-none mb-2">
                        {stats.todayAppointments}
                      </h3>
                      <p className="text-[12px] font-bold text-gray-500">
                        Today's Appointments
                      </p>
                    </div>
                  </div>

                  {/* Completed Today */}
                  <div className="bg-white p-6 rounded-[1.2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center h-36">
                    <div className="w-11 h-11 rounded-xl bg-[#fcebeb] text-[#d65e5e] flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.8rem] font-black text-gray-800 leading-none mb-2">
                        {stats.completedToday}
                      </h3>
                      <p className="text-[12px] font-bold text-gray-500">
                        Completed Today
                      </p>
                    </div>
                  </div>
                </div>

                {/* TODAY'S APPOINTMENTS LIST */}
                <div className="bg-white rounded-[1.2rem] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-extrabold text-gray-500 tracking-widest uppercase">
                      TODAY'S APPOINTMENTS
                    </h3>
                    <a
                      href="#"
                      className="text-[#1b6a55] text-[12px] font-bold hover:underline"
                    >
                      See all &rarr;
                    </a>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-50">
                    {appointments.length > 0 ? (
                      appointments.slice(0, 5).map((apt, idx) => {
                        const initials =
                          `${apt.patient_first_name?.charAt(0) || "P"}${apt.patient_last_name?.charAt(0) || ""}`.toUpperCase();
                        const statusColors = {
                          confirmed: {
                            bg: "bg-[#eefaf6]",
                            text: "text-[#1b6a55]",
                          },
                          pending: {
                            bg: "bg-[#fff4eb]",
                            text: "text-[#e08a46]",
                          },
                          completed: {
                            bg: "bg-[#e3f2ed]",
                            text: "text-[#2b8871]",
                          },
                          cancelled: {
                            bg: "bg-[#fcebeb]",
                            text: "text-[#d65e5e]",
                          },
                        };
                        const colors =
                          statusColors[apt.status] || statusColors.pending;
                        const time = new Date(
                          apt.appointment_date,
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                        return (
                          <div
                            key={apt.appointment_id || idx}
                            className="py-4 flex justify-between items-center group"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-[42px] h-[42px] rounded-full ${colors.bg} ${colors.text} font-extrabold text-[13px] flex items-center justify-center shrink-0`}
                              >
                                {initials}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-[14px] text-gray-900 mb-0.5 group-hover:text-[#1b6a55] transition">
                                  {apt.patient_first_name}{" "}
                                  {apt.patient_last_name}
                                </h4>
                                <p className="text-[12px] font-semibold text-gray-500">
                                  {apt.service_type || "Consultation"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1.5">
                              <span
                                className={`text-[12px] font-extrabold ${colors.text}`}
                              >
                                {time}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} text-[10px] font-bold capitalize`}
                              >
                                {apt.status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-400 text-[12px] py-8">
                        No appointments scheduled
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column Container (Calendar + Patients) */}
              <div className="xl:col-span-5 bg-white rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/60 flex flex-col gap-6 md:gap-8 h-[900px]">
                {/* Sidebar Top Header */}
                <div className="flex justify-between items-center -mb-2">
                  <h2 className="text-[1.25rem] font-extrabold text-[#115546]">
                    Appointments({appointments.length})
                  </h2>
                  <span className="bg-[#e9ecef] text-gray-800 text-[11px] font-extrabold px-3 py-1.5 rounded-full">
                    {new Date().toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <InteractiveCalendar />

                {/* Patients Info Panel (Styled like Doctors Info Panel) */}
                <div className="bg-white rounded-[1.2rem] shadow-[0_12px_32px_rgba(43,136,113,0.15)] p-5 sm:p-6 border border-gray-200 relative mt-auto">
                  {/* Header */}
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#115546]">
                      Your Patients
                    </h3>
                    <a
                      href="#"
                      className="text-[#388e7b] font-bold text-[12px] sm:text-[13px] hover:underline"
                    >
                      See all
                    </a>
                  </div>

                  {/* List of patients */}
                  <div className="flex flex-col gap-3 mb-6">
                    {patients.length > 0 ? (
                      patients.map((patient, idx) => {
                        const initials =
                          `${patient.first_name?.charAt(0) || "P"}${patient.last_name?.charAt(0) || ""}`.toUpperCase();
                        return (
                          <div
                            key={patient.user_id || idx}
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
                                {patient.first_name} {patient.last_name}
                              </h4>
                              <p className="text-gray-500 text-[11px] font-semibold">
                                {patient.disease_name || "Follow-up"}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-400 text-[12px] py-4">
                        No patients
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex gap-2">
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
                    <button className="flex-1 bg-gradient-to-r from-[#43a18a] to-[#1b6a55] text-white font-extrabold text-[13px] rounded-[0.6rem] hover:from-[#388e7b] hover:to-[#165544] transition flex items-center justify-center border-none shadow-[0_4px_10px_rgba(27,106,85,0.3)]">
                      + Add Patient
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
