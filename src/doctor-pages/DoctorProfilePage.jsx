import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import { NotificationBell } from "../components/NotificationBell";

const API_BASE_URL = "http://localhost:3000/api";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not available";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Not available";
  return parsed.toLocaleString();
};

const formatTime = (timeValue) => {
  if (!timeValue) return "";
  const [hoursText, minutesText = "00"] = String(timeValue).split(":");
  const hours = Number(hoursText);
  if (!Number.isFinite(hours)) return String(timeValue);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = ((hours + 11) % 12) + 1;
  return `${displayHours}:${minutesText.padStart(2, "0")} ${suffix}`;
};

const formatScheduleLabel = (schedule) => {
  if (!schedule) return "Unknown schedule";
  if (schedule.schedule_type === "date" && schedule.specific_date) {
    return `Specific date: ${schedule.specific_date}`;
  }
  if (schedule.schedule_type === "day") {
    const dayIndex = Number(schedule.day_of_week);
    return Number.isInteger(dayIndex) && dayNames[dayIndex]
      ? dayNames[dayIndex]
      : "Weekly schedule";
  }
  return "Schedule";
};

const getDoctorId = () =>
  localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

function DoctorProfilePage() {
  const navigate = useNavigate();
  const doctorId = getDoctorId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [panelData, setPanelData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const [detailsRes, panelRes, schedulesRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/doctors/${doctorId}`),
          fetch(`${API_BASE_URL}/doctors/${doctorId}/panel`),
          fetch(`${API_BASE_URL}/doctors/${doctorId}/schedules`),
        ]);

        let detailsPayload = null;
        if (detailsRes.status === "fulfilled" && detailsRes.value.ok) {
          const detailsJson = await detailsRes.value.json();
          detailsPayload = detailsJson.data || null;
          if (isMounted) setDoctorProfile(detailsPayload);
        }

        if (panelRes.status === "fulfilled" && panelRes.value.ok) {
          const panelJson = await panelRes.value.json();
          if (isMounted) setPanelData(panelJson.data || null);
        }

        if (schedulesRes.status === "fulfilled" && schedulesRes.value.ok) {
          const schedulesJson = await schedulesRes.value.json();
          const scheduleItems = schedulesJson.data?.schedules || [];
          if (isMounted)
            setSchedules(Array.isArray(scheduleItems) ? scheduleItems : []);
        }

        if (!detailsPayload) {
          const detailsFailed =
            detailsRes.status === "rejected" || !detailsRes.value?.ok;
          if (detailsFailed) {
            throw new Error("Unable to load doctor profile");
          }
        }

        if (detailsPayload?.user_id) {
          const profileRes = await fetch(
            `${API_BASE_URL}/profile/${detailsPayload.user_id}`,
          );
          if (profileRes.ok) {
            const profileJson = await profileRes.json();
            if (isMounted) setProfileData(profileJson.data || null);
          }
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || "Failed to load doctor profile");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [doctorId]);

  const doctor = doctorProfile || panelData?.doctor || {};
  const profile = profileData || {};
  const fullName = [doctor.first_name, doctor.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const displayName = fullName ? `Dr. ${fullName}` : "Doctor Profile";
  const initials = fullName
    ? fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  const primaryHospital = Array.isArray(doctor.hospitals)
    ? doctor.hospitals.find((hospital) => hospital?.is_primary) ||
      doctor.hospitals[0]
    : null;

  const stats = useMemo(
    () => [
      {
        label: "Total patients",
        value: panelData?.total_patients ?? doctor.total_patients ?? 0,
      },
      {
        label: "Today appointments",
        value: panelData?.today_appointment_count ?? 0,
      },
      {
        label: "Upcoming 7 days",
        value: panelData?.upcoming_7days_count ?? 0,
      },
      {
        label: "Consultation fee",
        value:
          doctor.consultation_fee !== undefined &&
          doctor.consultation_fee !== null
            ? `Rs ${doctor.consultation_fee}`
            : "Not set",
      },
    ],
    [doctor.consultation_fee, doctor.total_patients, panelData],
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-linear-to-b from-emerald-50 to-white font-sans overflow-hidden">
        <DoctorSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-semibold">
            Loading doctor profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-linear-to-b from-emerald-50 to-white font-sans overflow-hidden">
        <DoctorSidebar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg w-full bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <h1 className="text-xl font-extrabold text-gray-900 mb-2">
              Doctor Profile
            </h1>
            <p className="text-sm text-red-700 font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="px-4 py-2.5 rounded-xl bg-[#1b6a55] text-white font-bold text-sm hover:bg-[#145140] transition"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-linear-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-18 bg-transparent px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div>
            <p className="text-[12px] text-gray-500 font-semibold mb-0.5">
              Doctor account
            </p>
            <h1 className="text-[18px] font-extrabold text-gray-900">
              Profile overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell
              userId={doctor.user_id || panelData?.doctor?.user_id}
            />
            <Link
              to="/doctor/profile-setup"
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition"
            >
              Edit profile
            </Link>
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="px-4 py-2.5 rounded-xl bg-[#1b6a55] text-white font-bold text-sm hover:bg-[#145140] transition"
            >
              Back to dashboard
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-300 mx-auto space-y-6">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-100 shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-600 mb-1">
                      {doctor.specialization_name || "Specialist"}
                    </p>
                    <h2 className="text-3xl font-black text-gray-900 mb-1">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-500 font-semibold mb-2">
                      Doctor ID: {doctor.id || doctorId}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-600">
                      <span className="px-3 py-1.5 rounded-full bg-gray-100">
                        {doctor.years_of_experience !== undefined &&
                        doctor.years_of_experience !== null
                          ? `${doctor.years_of_experience} years experience`
                          : "Experience not set"}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-gray-100">
                        {doctor.license_number
                          ? `License ${doctor.license_number}`
                          : "License not set"}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-gray-100">
                        {doctor.average_rating !== undefined &&
                        doctor.average_rating !== null
                          ? `${doctor.average_rating} rating`
                          : "No rating yet"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4 min-w-35"
                    >
                      <p className="text-[11px] text-gray-500 font-semibold mb-1">
                        {item.label}
                      </p>
                      <p className="text-lg font-black text-gray-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-black text-gray-900 mb-5">
                    Professional details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-gray-500 font-semibold mb-1">
                        Specialization
                      </p>
                      <p className="text-gray-900 font-bold">
                        {doctor.specialization_name || "Not available"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-gray-500 font-semibold mb-1">
                        Consultation fee
                      </p>
                      <p className="text-gray-900 font-bold">
                        {doctor.consultation_fee !== undefined &&
                        doctor.consultation_fee !== null
                          ? `Rs ${doctor.consultation_fee}`
                          : "Not available"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-gray-500 font-semibold mb-1">
                        License number
                      </p>
                      <p className="text-gray-900 font-bold">
                        {doctor.license_number || "Not available"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-gray-500 font-semibold mb-1">
                        Joined on
                      </p>
                      <p className="text-gray-900 font-bold">
                        {formatDateTime(doctor.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                    <p className="text-emerald-700 font-bold text-sm mb-2">
                      Bio
                    </p>
                    <p className="text-gray-700 text-sm leading-6">
                      {doctor.bio || "No bio has been added yet."}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-black text-gray-900 mb-5">
                    Hospital affiliations
                  </h3>
                  {Array.isArray(doctor.hospitals) &&
                  doctor.hospitals.length > 0 ? (
                    <div className="space-y-3">
                      {doctor.hospitals.map((hospital) => (
                        <div
                          key={hospital.id}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-start justify-between gap-4"
                        >
                          <div>
                            <p className="font-bold text-gray-900">
                              {hospital.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {[
                                hospital.address_line1,
                                hospital.city,
                                hospital.state,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Address not available"}
                            </p>
                          </div>
                          {hospital.is_primary && (
                            <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wide">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-semibold">
                      No hospital affiliations were returned by the API.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-black text-gray-900 mb-5">
                    Contact details
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-semibold mb-1">Email</p>
                      <p className="text-gray-900 font-bold break-all">
                        {doctor.email || "Not available"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold mb-1">Phone</p>
                      <p className="text-gray-900 font-bold">
                        {profile.phone || "Not available"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold mb-1">Role</p>
                      <p className="text-gray-900 font-bold">
                        {profile.role || "doctor"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold mb-1">
                        Primary hospital
                      </p>
                      <p className="text-gray-900 font-bold">
                        {primaryHospital?.name || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-black text-gray-900 mb-5">
                    Schedule overview
                  </h3>
                  {schedules.length > 0 ? (
                    <div className="space-y-3">
                      {schedules.slice(0, 6).map((schedule) => (
                        <div
                          key={schedule.id}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                        >
                          <p className="text-sm font-bold text-gray-900 mb-1">
                            {formatScheduleLabel(schedule)}
                          </p>
                          <p className="text-xs text-gray-500 font-semibold">
                            {formatTime(schedule.start_time)} -{" "}
                            {formatTime(schedule.end_time)}
                          </p>
                          <p className="text-xs text-gray-500 font-semibold mt-1">
                            Slots: {schedule.slot_duration_minutes || 30} min,
                            Max patients: {schedule.max_patients_per_slot || 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-semibold">
                      No active schedules returned yet.
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-lg font-black text-gray-900 mb-5">
                    Today&apos;s appointments
                  </h3>
                  {Array.isArray(panelData?.today_appointments) &&
                  panelData.today_appointments.length > 0 ? (
                    <div className="space-y-3">
                      {panelData.today_appointments
                        .slice(0, 5)
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                          >
                            <p className="text-sm font-bold text-gray-900">
                              {appointment.first_name || appointment.last_name
                                ? `${appointment.first_name || ""} ${appointment.last_name || ""}`.trim()
                                : "Patient"}
                            </p>
                            <p className="text-xs text-gray-500 font-semibold mt-1">
                              {formatTime(appointment.start_time)} -{" "}
                              {formatTime(appointment.end_time)}
                            </p>
                            <p className="text-xs text-gray-500 font-semibold mt-1">
                              {appointment.status || "Scheduled"}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-semibold">
                      No appointments are scheduled for today.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorProfilePage;
