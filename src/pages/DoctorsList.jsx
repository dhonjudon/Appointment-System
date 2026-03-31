import React, { useState } from "react";
import { Link } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";

const doctorsData = [
  {
    id: 1,
    name: "Dr. Anna Kowalski",
    specialty: "ENT Specialist",
    education: "Warsaw Medical Academy",
    rating: 4.87,
    reviews: 124,
    available: true,
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    education: "AIIMS Delhi",
    rating: 4.92,
    reviews: 256,
    available: true,
  },
  {
    id: 3,
    name: "Dr. Amit Verma",
    specialty: "Neurologist",
    education: "Johns Hopkins University",
    rating: 4.78,
    reviews: 189,
    available: false,
  },
  {
    id: 4,
    name: "Dr. Maria Santos",
    specialty: "Dermatologist",
    education: "University of Barcelona",
    rating: 4.95,
    reviews: 312,
    available: true,
  },
  {
    id: 5,
    name: "Dr. James Chen",
    specialty: "Orthopedic Surgeon",
    education: "Stanford Medical School",
    rating: 4.83,
    reviews: 145,
    available: true,
  },
  {
    id: 6,
    name: "Dr. Fatima Al-Hassan",
    specialty: "Pediatrician",
    education: "University of Cairo",
    rating: 4.91,
    reviews: 278,
    available: true,
  },
];

const specialties = [
  "All Specialties",
  "ENT Specialist",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Physiotherapist",
  "General Physician",
];

function DoctorsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      doctor.specialty === selectedSpecialty;
    const matchesAvailability = !showAvailableOnly || doctor.available;

    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 sm:px-6 lg:px-10 py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-[2rem] font-extrabold text-gray-900 tracking-tight">
              Find a Doctor 👨‍⚕️
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Browse our network of qualified specialists
            </p>
          </div>
          <Link
            to="/dashboard"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#0f766e] font-bold text-sm hover:underline"
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
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 outline-none text-sm font-medium transition-all"
              />
            </div>

            {/* Specialty Filter */}
            <div className="md:w-56">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 outline-none text-sm font-medium bg-white transition-all cursor-pointer"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Toggle */}
            <label className="flex items-center gap-3 cursor-pointer md:px-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#10b981] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Available Only
              </span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-500 font-semibold text-sm mb-4">
          Showing {filteredDoctors.length} doctor
          {filteredDoctors.length !== 1 ? "s" : ""}
        </p>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#f0fdfa] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#10b981]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsList;
