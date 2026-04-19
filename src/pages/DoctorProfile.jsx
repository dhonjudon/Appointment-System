import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import MiniCalendar from "../components/MiniCalendar";

const defaultDoctor = {
  id: 1,
  name: "Dr. Anna Kowalski",
  specialty: "ENT Specialist",
  education: "Warsaw Medical Academy",
  qualifications: ["MD (Otolaryngology)", "Fellowship in Pediatric ENT"],
  hospital: "St. Mary Multispeciality Hospital",
  location: "Downtown Medical District",
  phone: "+48 22 100 2000",
  email: "anna.kowalski@stmarycare.com",
  consultationModes: ["In-person", "Video Consultation"],
  rating: 4.87,
  reviews: 124,
  patientsTreated: 3200,
  responseTime: "Replies in under 1 hour",
  nextAvailable: "Today, 2:00 PM",
  experience: "12 years",
  languages: ["English", "Polish", "German"],
  about:
    "Dr. Anna Kowalski is a highly experienced ENT specialist with over 12 years of practice. She specializes in treating disorders of the ear, nose, and throat, with particular expertise in pediatric ENT conditions and minimally invasive sinus surgery.",
  services: [
    "Endoscopic sinus evaluation",
    "Pediatric ear infection treatment",
    "Sleep apnea screening",
    "Hearing loss consultation",
  ],
  conditionsTreated: [
    "Sinusitis",
    "Tonsillitis",
    "Vertigo",
    "Nasal polyps",
    "Allergic rhinitis",
  ],
  feeIncludes: [
    "Doctor consultation",
    "Digital prescription",
    "7-day follow-up chat",
  ],
  consultationFee: 150,
  availableDates: [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30],
  bookedDates: [3, 10, 17, 24],
  timeSlotsMorning: ["9:00 AM", "10:00 AM", "11:30 AM"],
  timeSlotsAfternoon: ["1:00 PM", "2:00 PM", "3:30 PM"],
  timeSlotsEvening: ["5:00 PM", "6:30 PM"],
};

const mapSchedulesToDates = (schedules = []) => {
  if (!Array.isArray(schedules) || !schedules.length) {
    return {
      availableDates: defaultDoctor.availableDates,
      bookedDates: defaultDoctor.bookedDates,
    };
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const scheduleDays = new Set(
    schedules
      .map((slot) => Number(slot.day_of_week))
      .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6),
  );

  const availableDates = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    if (scheduleDays.has(date.getDay())) {
      availableDates.push(day);
    }
  }

  return {
    availableDates: availableDates.length
      ? availableDates
      : defaultDoctor.availableDates,
    bookedDates: defaultDoctor.bookedDates,
  };
};

const mapDoctorApiToViewModel = (doctorApi = {}, schedules = []) => {
  const firstName = doctorApi.first_name || "";
  const lastName = doctorApi.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const displayName = fullName ? `Dr. ${fullName}` : defaultDoctor.name;

  const primaryHospital = Array.isArray(doctorApi.hospitals)
    ? doctorApi.hospitals.find((hospital) => hospital?.is_primary) ||
      doctorApi.hospitals[0]
    : null;

  const location = [
    primaryHospital?.address_line1,
    primaryHospital?.city,
    primaryHospital?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const yearsOfExperience = Number(doctorApi.years_of_experience);
  const rating = Number(doctorApi.average_rating);
  const reviewCount = Number(doctorApi.total_reviews);
  const consultationFee = Number(doctorApi.consultation_fee);
  const scheduleDates = mapSchedulesToDates(schedules);

  return {
    ...defaultDoctor,
    id: doctorApi.id || defaultDoctor.id,
    name: displayName,
    specialty: doctorApi.specialization_name || defaultDoctor.specialty,
    hospital: primaryHospital?.name || defaultDoctor.hospital,
    location: location || defaultDoctor.location,
    email: doctorApi.email || defaultDoctor.email,
    rating:
      Number.isFinite(rating) && rating > 0 ? rating : defaultDoctor.rating,
    reviews:
      Number.isFinite(reviewCount) && reviewCount >= 0
        ? reviewCount
        : defaultDoctor.reviews,
    experience:
      Number.isFinite(yearsOfExperience) && yearsOfExperience >= 0
        ? `${yearsOfExperience} years`
        : defaultDoctor.experience,
    consultationFee:
      Number.isFinite(consultationFee) && consultationFee > 0
        ? consultationFee
        : defaultDoctor.consultationFee,
    about: doctorApi.bio || defaultDoctor.about,
    qualifications: doctorApi.license_number
      ? [
          defaultDoctor.qualifications[0],
          `License: ${doctorApi.license_number}`,
        ]
      : defaultDoctor.qualifications,
    availableDates: scheduleDates.availableDates,
    bookedDates: scheduleDates.bookedDates,
  };
};

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(defaultDoctor);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorId = Number(id);

    if (!Number.isInteger(doctorId) || doctorId <= 0) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDoctorProfile = async () => {
      try {
        const [doctorResult, schedulesResult] = await Promise.allSettled([
          axios.get(`http://localhost:3000/api/doctors/${doctorId}`),
          axios.get(`http://localhost:3000/api/doctors/${doctorId}/schedules`),
        ]);

        if (doctorResult.status === "fulfilled") {
          const doctorPayload = doctorResult.value?.data?.data || {};
          const schedulePayload =
            schedulesResult.status === "fulfilled"
              ? schedulesResult.value?.data?.data?.schedules || []
              : [];
          const mappedDoctor = mapDoctorApiToViewModel(
            doctorPayload,
            schedulePayload,
          );

          if (isMounted) {
            setDoctor(mappedDoctor);
          }
        } else {
          console.error("Error fetching doctor profile:", doctorResult.reason);
        }

        if (schedulesResult.status === "fulfilled") {
          const schedulePayload = schedulesResult.value?.data?.data?.schedules;
          if (isMounted) {
            setSchedules(Array.isArray(schedulePayload) ? schedulePayload : []);
          }
        } else {
          console.error(
            "Error fetching doctor schedules:",
            schedulesResult.reason,
          );
          if (isMounted) {
            setSchedules([]);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDoctorProfile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleBookAppointment = () => {
    navigate("/book-appointment", {
      state: {
        doctor,
      },
    });
  };

  const totalDates = doctor.availableDates.length + doctor.bookedDates.length;
  const availabilityScore = totalDates
    ? Math.round((doctor.availableDates.length / totalDates) * 100)
    : 0;
  const scheduleDays = Array.from(
    new Set(
      schedules
        .map((slot) => Number(slot.day_of_week))
        .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6),
    ),
  );
  const dynamicAvailabilityScore = scheduleDays.length
    ? Math.round((scheduleDays.length / 7) * 100)
    : availabilityScore;

  if (loading) return <p className="p-6 text-gray-500">Loading profile...</p>;

  return (
    <div className="h-screen overflow-hidden bg-linear-to-b from-emerald-50 to-white flex">
      {/* Fixed Sidebar - Doctor Info */}
      <div className="w-80 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto">
        <div className="p-6">
          {/* Doctor Avatar & Name */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 text-3xl font-bold text-white shadow-lg shadow-emerald-100">
              {initials}
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              {doctor.name}
            </h1>
            <p className="text-emerald-600 font-medium text-sm">
              {doctor.specialty}
            </p>
          </div>

          {/* Rating & Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-gray-800">{doctor.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{doctor.reviews} reviews</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="font-bold text-gray-800">{doctor.experience}</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="font-bold text-gray-800">
                {doctor.patientsTreated}+
              </p>
              <p className="text-xs text-gray-500">Patients</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
              <p className="font-bold text-emerald-600">
                RS{doctor.consultationFee}
              </p>
              <p className="text-xs text-gray-500">Per visit</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-sm">
              <svg
                className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-800">{doctor.hospital}</p>
                <p className="text-gray-500 text-xs">{doctor.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg
                className="w-4 h-4 text-emerald-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                />
              </svg>
              <p className="text-gray-600">{doctor.education}</p>
            </div>
          </div>

          {/* Consultation Modes */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Available Modes
            </p>
            <div className="flex flex-wrap gap-2">
              {doctor.consultationModes.map((mode) => (
                <span
                  key={mode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    mode === "Video Consultation"
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        {/* Header with Back Link */}
        <div className="relative overflow-hidden bg-transparent">
          <div className="relative px-6 lg:px-10 pt-8 pb-6">
            {/* Back Link */}
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
            >
              <svg
                className="h-4 w-4"
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
              Back to Doctors
            </Link>

            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Book Your <span className="text-emerald-600">Appointment</span>
              </h2>
              <p className="text-gray-500 text-lg">
                Select a convenient date and time slot for your consultation
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-10 pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left - About & Details */}
              <div className="space-y-5">
                {/* About */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    Professional Overview
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {doctor.about}
                  </p>
                </div>

                {/* Qualifications */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                      />
                    </svg>
                    Qualifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.qualifications.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                    Services Offered
                  </h3>
                  <ul className="space-y-2">
                    {doctor.services.map((service) => (
                      <li
                        key={service}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conditions Treated */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                    Conditions Treated
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.conditionsTreated.map((condition) => (
                      <span
                        key={condition}
                        className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-100"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fee Includes */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                    Consultation Includes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.feeIncludes.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-emerald-100 bg-emerald-50/50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Calendar & Booking */}
              <div className="space-y-5">
                {/* Calendar Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">
                      Availability Calendar
                    </h3>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {dynamicAvailabilityScore}% slots open
                    </span>
                  </div>

                  <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-xs text-gray-500">Next Available</p>
                      <p className="text-sm font-medium text-gray-800">
                        {doctor.nextAvailable}
                      </p>
                    </div>
                  </div>

                  <MiniCalendar
                    scheduleDays={scheduleDays}
                    availableDates={doctor.availableDates}
                    bookedDates={doctor.bookedDates}
                    interactive={false}
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Booking Mode</span>
                      <span className="font-medium text-gray-800">
                        Date and time on next page
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Response</span>
                      <span className="font-medium text-gray-800">
                        {doctor.responseTime}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="text-gray-500">Consultation Fee</span>
                      <span className="text-lg font-bold text-emerald-600">
                        Rs{doctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleBookAppointment}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200"
                  >
                    <svg
                      className="w-5 h-5"
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
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
