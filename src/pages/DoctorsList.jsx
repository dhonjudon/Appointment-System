// DoctorsList.jsx
// Browse and search doctors with filtering by specialty, hospital, and availability
// Displays paginated doctor cards with ratings, experience, and consultation fees

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Building2,
  Stethoscope,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Loader2,
} from "lucide-react";

const API = "http://localhost:3000/api";

// Utility
const cx = (...a) => a.filter(Boolean).join(" ");
const getToken = () => localStorage.getItem("token") || "";

// Axios instance with auth header — doctors list is public so token is optional,
// but we send it anyway for consistency across the app.
const api = axios.create({
  baseURL: API,
  headers: { Authorization: `Bearer ${getToken()}` },
});

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      {/* Placeholder shimmer card while loading */}
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="h-6 bg-gray-100 rounded w-20" />
        <div className="h-9 bg-gray-100 rounded-xl w-28" />
      </div>
    </div>
  );
}

// Main component: displays doctors list with search, filters, and navigation
export default function DoctorsList() {
  const navigate = useNavigate();

  // Data state
  const [doctorsData, setDoctorsData] = useState([]);
  const [specialties, setSpecialties] = useState(["All Specialties"]);
  const [hospitals, setHospitals] = useState(["All Hospitals"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedHospital, setSelectedHospital] = useState("All Hospitals");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

  // Debounce search — 350 ms delay so we don't filter on every keystroke
  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setDebouncedSearch(searchQuery),
      350,
    );
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get("/doctors", { params: { limit: 100 } })
      .then(({ data }) => {
        const items = Array.isArray(data?.data?.items) ? data.data.items : [];
        setDoctorsData(items);

        // Derive unique specialties from the response — stays in sync with DB
        const specs = [
          "All Specialties",
          ...new Set(items.map((d) => d.specialization_name).filter(Boolean)),
        ];
        setSpecialties(specs);

        /*
         * Derive unique hospital names from the response.
         * The /doctors list endpoint doesn't join hospitals, but each doctor
         * has a primary hospital name if the backend joins it. If the field
         * is not present we fall back to an empty list derived from details.
         * We use 'hospital_name' (from the doctor record) when available.
         */
        const hospSet = new Set();
        items.forEach((d) => {
          if (d.hospital_name) hospSet.add(d.hospital_name);
        });
        setHospitals(["All Hospitals", ...Array.from(hospSet)]);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors:", err);
        setError("Could not load doctors. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = doctorsData.filter((doctor) => {
    const q = debouncedSearch.toLowerCase();

    const matchesSearch =
      !q ||
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(q) ||
      (doctor.specialization_name || "").toLowerCase().includes(q) ||
      (doctor.hospital_name || "").toLowerCase().includes(q);

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      doctor.specialization_name === selectedSpecialty;

    const matchesHospital =
      selectedHospital === "All Hospitals" ||
      doctor.hospital_name === selectedHospital;

    // 'available' field may not exist in the basic list — treat missing as available
    const matchesAvailability =
      !showAvailableOnly || doctor.available !== false;

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesHospital &&
      matchesAvailability
    );
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All Specialties");
    setSelectedHospital("All Hospitals");
    setShowAvailableOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedSpecialty !== "All Specialties" ||
    selectedHospital !== "All Hospitals" ||
    showAvailableOnly;

  const SidebarContent = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-gray-800">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Availability toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-emerald-50/50 transition-all">
          <span className="text-sm font-medium text-gray-700">
            Available Today
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-all" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
        </label>
      </div>

      {/* Specialization filter — derived from DB */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Specialization
        </label>
        <div className="space-y-1.5">
          {specialties.map((spec) => (
            <label
              key={spec}
              className={cx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                selectedSpecialty === spec
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-gray-50 border border-transparent hover:bg-emerald-50/40",
              )}
            >
              <input
                type="radio"
                name="specialty"
                checked={selectedSpecialty === spec}
                onChange={() => setSelectedSpecialty(spec)}
                className="sr-only"
              />
              <div
                className={cx(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedSpecialty === spec
                    ? "border-emerald-500"
                    : "border-gray-300",
                )}
              >
                {selectedSpecialty === spec && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <span
                className={cx(
                  "text-sm",
                  selectedSpecialty === spec
                    ? "text-emerald-700 font-semibold"
                    : "text-gray-600",
                )}
              >
                {spec}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Hospital filter — derived from DB via the doctors payload */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Hospital
          </span>
        </label>
        <select
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 cursor-pointer"
        >
          {hospitals.map((hosp) => (
            <option key={hosp} value={hosp}>
              {hosp}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div
      className="h-screen overflow-hidden flex bg-gradient-to-b from-emerald-50 to-white"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* ── Desktop sidebar ── */}
      <div className="hidden md:block w-72 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto">
        <SidebarContent />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white h-full overflow-y-auto shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 lg:px-10 pt-10 pb-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Find Your <span className="text-emerald-600">Perfect Doctor</span>
            </h1>
            <p className="text-gray-400 text-base">
              Connect with world-class healthcare professionals tailored to your
              needs
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or hospital…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white border-2 border-emerald-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results strip */}
        <div className="px-6 lg:px-10 mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="text-emerald-600 font-bold text-base">
              {filteredDoctors.length}
            </span>{" "}
            doctors found
          </p>
          {/* Mobile filter button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Doctor grid */}
        <div className="px-6 lg:px-10 pb-10">
          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
              <p className="text-red-500 font-medium mb-3">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Doctor cards */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                  />
                ))}
              </div>

              {/* Empty state */}
              {filteredDoctors.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-400 text-sm mb-5">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor, onClick }) {
  const fullName =
    `${doctor.first_name || ""} ${doctor.last_name || ""}`.trim();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 cursor-pointer"
    >
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar — initials fallback since /doctors list doesn't return an image URL */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all">
              {doctor.first_name?.[0] || "D"}
            </div>
            {doctor.available !== false && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-base group-hover:text-emerald-600 transition-colors truncate">
              Dr. {fullName}
            </h3>
            <p className="text-emerald-600 text-xs font-semibold mt-0.5">
              {doctor.specialization_name}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-gray-800 font-semibold text-xs">
                {Number(doctor.average_rating).toFixed(2)}
              </span>
              <span className="text-gray-400 text-xs">
                ({doctor.total_reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-1.5">
          {doctor.hospital_name && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{doctor.hospital_name}</span>
            </div>
          )}
          {doctor.years_of_experience > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{doctor.years_of_experience} years experience</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-800">
              Rs{doctor.consultation_fee}
            </span>
            <span className="text-gray-400 text-xs ml-1">/ visit</span>
          </div>
          <Link
            to={`/doctors/${doctor.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 hover:shadow-emerald-200"
          >
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
