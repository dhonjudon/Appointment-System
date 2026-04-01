import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MiniCalendar from "../components/MiniCalendar";
import StarRating from "../components/StarRating";

// Sample doctor data (in real app, fetch from API)
const doctorsDatabase = {
  1: {
    id: 1,
    name: "Dr. Anna Kowalski",
    specialty: "ENT Specialist",
    education: "Warsaw Medical Academy",
    rating: 4.87,
    reviews: 124,
    experience: "12 years",
    languages: ["English", "Polish", "German"],
    about:
      "Dr. Anna Kowalski is a highly experienced ENT specialist with over 12 years of practice. She specializes in treating disorders of the ear, nose, and throat, with particular expertise in pediatric ENT conditions and minimally invasive sinus surgery.",
    consultationFee: 150,
    availableDates: [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30],
    bookedDates: [3, 10, 17, 24],
    timeSlots: [
      "9:00 AM",
      "10:00 AM",
      "11:30 AM",
      "2:00 PM",
      "3:30 PM",
      "5:00 PM",
    ],
  },
  2: {
    id: 2,
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    education: "AIIMS Delhi",
    rating: 4.92,
    reviews: 256,
    experience: "15 years",
    languages: ["English", "Hindi", "Punjabi"],
    about:
      "Dr. Priya Sharma is a renowned cardiologist specializing in interventional cardiology and heart failure management. She has performed over 2000 successful cardiac procedures.",
    consultationFee: 200,
    availableDates: [1, 5, 8, 12, 15, 19, 22, 26, 29],
    bookedDates: [6, 13, 20, 27],
    timeSlots: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  },
};

// Default doctor for any ID not in database
const defaultDoctor = {
  id: 1,
  name: "Dr. Anna Kowalski",
  specialty: "ENT Specialist",
  education: "Warsaw Medical Academy",
  rating: 4.87,
  reviews: 124,
  experience: "12 years",
  languages: ["English", "Polish", "German"],
  about:
    "Dr. Anna Kowalski is a highly experienced ENT specialist with over 12 years of practice. She specializes in treating disorders of the ear, nose, and throat, with particular expertise in pediatric ENT conditions and minimally invasive sinus surgery.",
  consultationFee: 150,
  availableDates: [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30],
  bookedDates: [3, 10, 17, 24],
  timeSlots: [
    "9:00 AM",
    "10:00 AM",
    "11:30 AM",
    "2:00 PM",
    "3:30 PM",
    "5:00 PM",
  ],
};

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctorsDatabase[id] || defaultDoctor;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      navigate("/book-appointment", {
        state: {
          doctor,
          date: selectedDate.toISOString(),
          time: selectedTime,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 sm:px-6 lg:px-10 py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Back Link */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 text-[#0f766e] font-bold text-sm hover:underline mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,118,110,0.08)] border border-gray-100 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-[#0f766e] to-[#10b981] p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  {/* Avatar */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-3xl border-4 border-white/30 shadow-lg">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                      {doctor.name}
                    </h1>
                    <p className="text-emerald-100 font-semibold text-lg mb-3">
                      {doctor.specialty}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        🎓 {doctor.education}
                      </span>
                      <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        ⏱️ {doctor.experience}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-around gap-4 p-4 md:p-6 bg-[#f0fdfa] border-b border-emerald-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <StarRating
                      rating={doctor.rating}
                      size="lg"
                      showValue={false}
                    />
                  </div>
                  <p className="text-[#0f766e] font-extrabold text-xl">
                    {doctor.rating}
                  </p>
                  <p className="text-gray-500 text-xs font-semibold">
                    {doctor.reviews} Reviews
                  </p>
                </div>
                <div className="w-px bg-emerald-200 hidden sm:block"></div>
                <div className="text-center">
                  <p className="text-[#0f766e] font-extrabold text-xl">
                    {doctor.experience}
                  </p>
                  <p className="text-gray-500 text-xs font-semibold">
                    Experience
                  </p>
                </div>
                <div className="w-px bg-emerald-200 hidden sm:block"></div>
                <div className="text-center">
                  <p className="text-[#0f766e] font-extrabold text-xl">
                    ${doctor.consultationFee}
                  </p>
                  <p className="text-gray-500 text-xs font-semibold">
                    Consultation
                  </p>
                </div>
              </div>

              {/* About Section */}
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-extrabold text-gray-900 mb-3">
                  About
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {doctor.about}
                </p>

                {/* Languages */}
                <h3 className="text-lg font-extrabold text-gray-900 mb-3">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {doctor.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-lg"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Contact Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f0fdfa] text-[#0f766e] font-bold text-sm px-6 py-3 rounded-xl hover:bg-emerald-100 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f0fdfa] text-[#0f766e] font-bold text-sm px-6 py-3 rounded-xl hover:bg-emerald-100 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    </svg>
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar & Booking */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Availability Calendar */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,118,110,0.08)] border border-gray-100 p-5 md:p-6">
              <h3 className="text-lg font-extrabold text-[#0f766e] mb-4">
                Availability
              </h3>
              <MiniCalendar
                availableDates={doctor.availableDates}
                bookedDates={doctor.bookedDates}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,118,110,0.08)] border border-gray-100 p-5 md:p-6 animate-fadeIn">
                <h3 className="text-lg font-extrabold text-[#0f766e] mb-2">
                  Select Time
                </h3>
                <p className="text-gray-500 text-sm font-medium mb-4">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {doctor.timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                        selectedTime === time
                          ? "bg-[#0f766e] text-white shadow-lg"
                          : "bg-[#f0fdfa] text-[#0f766e] hover:bg-emerald-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-lg ${
                selectedDate && selectedTime
                  ? "bg-gradient-to-r from-[#0f766e] to-[#10b981] text-white hover:from-[#0d6b63] hover:to-[#0ea572] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {selectedDate && selectedTime
                ? `Book Appointment for ${selectedTime}`
                : "Select Date & Time to Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
