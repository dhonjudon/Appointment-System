// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const doctorsData = [
//   {
//     id: 1,
//     name: "Dr. Anna Kowalski",
//     specialty: "ENT Specialist",
//     hospital: "City Medical Center",
//     rating: 4.87,
//     reviews: 124,
//     available: true,
//     experience: 12,
//     nextAvailable: "Today, 3:00 PM",
//     consultationFee: 120,
//     image:
//       "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 2,
//     name: "Dr. Priya Sharma",
//     specialty: "Cardiologist",
//     hospital: "Heart & Vascular Institute",
//     rating: 4.92,
//     reviews: 256,
//     available: true,
//     experience: 15,
//     nextAvailable: "Tomorrow, 10:00 AM",
//     consultationFee: 150,
//     image:
//       "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 3,
//     name: "Dr. Marcus Johnson",
//     specialty: "Neurologist",
//     hospital: "Neuro Sciences Hospital",
//     rating: 4.78,
//     reviews: 189,
//     available: false,
//     experience: 18,
//     nextAvailable: "Dec 12, 2:00 PM",
//     consultationFee: 180,
//     image:
//       "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 4,
//     name: "Dr. Maria Santos",
//     specialty: "Dermatologist",
//     hospital: "City Medical Center",
//     rating: 4.95,
//     reviews: 312,
//     available: true,
//     experience: 10,
//     nextAvailable: "Today, 5:30 PM",
//     consultationFee: 130,
//     image:
//       "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 5,
//     name: "Dr. James Chen",
//     specialty: "Orthopedic Surgeon",
//     hospital: "St. Mary's Hospital",
//     rating: 4.83,
//     reviews: 145,
//     available: true,
//     experience: 14,
//     nextAvailable: "Tomorrow, 9:00 AM",
//     consultationFee: 160,
//     image:
//       "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 6,
//     name: "Dr. Fatima Al-Hassan",
//     specialty: "Pediatrician",
//     hospital: "Children's Healthcare",
//     rating: 4.91,
//     reviews: 278,
//     available: true,
//     experience: 11,
//     nextAvailable: "Today, 4:00 PM",
//     consultationFee: 110,
//     image:
//       "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 7,
//     name: "Dr. David Williams",
//     specialty: "Cardiologist",
//     hospital: "Heart & Vascular Institute",
//     rating: 4.89,
//     reviews: 198,
//     available: true,
//     experience: 16,
//     nextAvailable: "Tomorrow, 11:30 AM",
//     consultationFee: 140,
//     image:
//       "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 8,
//     name: "Dr. Sofia Rodriguez",
//     specialty: "Neurologist",
//     hospital: "Neuro Sciences Hospital",
//     rating: 4.94,
//     reviews: 267,
//     available: true,
//     experience: 13,
//     nextAvailable: "Today, 6:00 PM",
//     consultationFee: 145,
//     image:
//       "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     id: 9,
//     name: "Dr. Michael Thompson",
//     specialty: "General Physician",
//     hospital: "City Medical Center",
//     rating: 4.81,
//     reviews: 342,
//     available: true,
//     experience: 20,
//     nextAvailable: "Today, 2:00 PM",
//     consultationFee: 100,
//     image:
//       "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
//   },
// ];

// const specialties = [
//   "All Specialties",
//   "ENT Specialist",
//   "Cardiologist",
//   "Neurologist",
//   "Dermatologist",
//   "Orthopedic Surgeon",
//   "Pediatrician",
//   "General Physician",
// ];

// const hospitals = [
//   "All Hospitals",
//   "City Medical Center",
//   "Heart & Vascular Institute",
//   "Neuro Sciences Hospital",
//   "St. Mary's Hospital",
//   "Children's Healthcare",
// ];

// function DoctorsList() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
//   const [selectedHospital, setSelectedHospital] = useState("All Hospitals");
//   const [showAvailableOnly, setShowAvailableOnly] = useState(false);

//   const filteredDoctors = doctorsData.filter((doctor) => {
//     const matchesSearch =
//       doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesSpecialty =
//       selectedSpecialty === "All Specialties" ||
//       doctor.specialty === selectedSpecialty;
//     const matchesHospital =
//       selectedHospital === "All Hospitals" ||
//       doctor.hospital === selectedHospital;
//     const matchesAvailability = !showAvailableOnly || doctor.available;

//     return (
//       matchesSearch &&
//       matchesSpecialty &&
//       matchesHospital &&
//       matchesAvailability
//     );
//   });

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedSpecialty("All Specialties");
//     setSelectedHospital("All Hospitals");
//     setShowAvailableOnly(false);
//   };

//   const hasActiveFilters =
//     searchQuery ||
//     selectedSpecialty !== "All Specialties" ||
//     selectedHospital !== "All Hospitals" ||
//     showAvailableOnly;

//   return (
//     <div className="h-screen overflow-hidden bg-linear-to-b from-emerald-50 to-white flex">
//       {/* Fixed Sidebar Filters */}
//       <div className="w-72 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
//             {hasActiveFilters && (
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
//               >
//                 Clear all
//               </button>
//             )}
//           </div>

//           {/* Availability Toggle */}
//           <div className="mb-6">
//             <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-emerald-50/50 transition-all">
//               <span className="text-sm text-gray-700">Available Today</span>
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={showAvailableOnly}
//                   onChange={(e) => setShowAvailableOnly(e.target.checked)}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
//                 <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
//               </div>
//             </label>
//           </div>

//           {/* Specialty Filter */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Specialization
//             </label>
//             <div className="space-y-2">
//               {specialties.map((spec) => (
//                 <label
//                   key={spec}
//                   className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
//                     selectedSpecialty === spec
//                       ? "bg-emerald-50 border border-emerald-200"
//                       : "bg-gray-50 border border-transparent hover:bg-emerald-50/50"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="specialty"
//                     checked={selectedSpecialty === spec}
//                     onChange={() => setSelectedSpecialty(spec)}
//                     className="sr-only"
//                   />
//                   <div
//                     className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
//                       selectedSpecialty === spec
//                         ? "border-emerald-500"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     {selectedSpecialty === spec && (
//                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//                     )}
//                   </div>
//                   <span
//                     className={`text-sm ${selectedSpecialty === spec ? "text-emerald-700 font-medium" : "text-gray-600"}`}
//                   >
//                     {spec}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Hospital Filter */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Hospital
//             </label>
//             <select
//               value={selectedHospital}
//               onChange={(e) => setSelectedHospital(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 cursor-pointer"
//             >
//               {hospitals.map((hosp) => (
//                 <option key={hosp} value={hosp}>
//                   {hosp}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 h-screen overflow-y-auto">
//         {/* Hero Header */}
//         <div className="relative overflow-hidden bg-transparent ">
//           <div className="relative px-6 lg:px-10 pt-10 pb-8">
//             <div className="text-center max-w-3xl mx-auto">
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
//                 Find Your{" "}
//                 <span className="text-emerald-600">Perfect Doctor</span>
//               </h1>
//               <p className="text-gray-500 text-lg">
//                 Connect with world-class healthcare professionals tailored to
//                 your needs
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="mt-6 max-w-2xl mx-auto">
//               <div className="relative">
//                 <svg
//                   className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search by doctor name, specialty, or hospital..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-emerald-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-base shadow-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Doctors Grid */}
//         <div className="px-6 lg:px-10 py-8">
//           <div className="flex items-center justify-between mb-6">
//             <p className="text-gray-600">
//               <span className="text-emerald-600 font-semibold">
//                 {filteredDoctors.length}
//               </span>{" "}
//               doctors available
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
//             {filteredDoctors.map((doctor) => (
//               <div
//                 key={doctor.id}
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => navigate(`/doctors/${doctor.id}`)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" || e.key === " ") {
//                     e.preventDefault();
//                     navigate(`/doctors/${doctor.id}`);
//                   }
//                 }}
//                 className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 cursor-pointer"
//               >
//                 <div className="p-5">
//                   <div className="flex gap-4">
//                     {/* Doctor Image */}
//                     <div className="relative">
//                       <img
//                         src={doctor.image}
//                         alt={doctor.name}
//                         className="w-20 h-20 rounded-xl object-cover ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all"
//                       />
//                       {doctor.available && (
//                         <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
//                           <svg
//                             className="w-3 h-3 text-white"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                               clipRule="evenodd"
//                             />
//                           </svg>
//                         </div>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors truncate">
//                         {doctor.name}
//                       </h3>
//                       <p className="text-emerald-600 text-sm font-medium">
//                         {doctor.specialty}
//                       </p>
//                       <div className="flex items-center gap-1 mt-1">
//                         <svg
//                           className="w-4 h-4 text-amber-400"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                         <span className="text-gray-800 font-medium text-sm">
//                           {doctor.rating}
//                         </span>
//                         <span className="text-gray-400 text-sm">
//                           ({doctor.reviews})
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Details */}
//                   <div className="mt-4 space-y-2">
//                     <div className="flex items-center gap-2 text-sm text-gray-500">
//                       <svg
//                         className="w-4 h-4 text-emerald-500"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={1.5}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                         />
//                       </svg>
//                       <span>{doctor.hospital}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-500">
//                       <svg
//                         className="w-4 h-4 text-emerald-500"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={1.5}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       <span>{doctor.experience} years experience</span>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
//                     <div>
//                       <span className="text-2xl font-bold text-gray-800">
//                         ${doctor.consultationFee}
//                       </span>
//                       <span className="text-gray-400 text-sm ml-1">
//                         / visit
//                       </span>
//                     </div>
//                     <Link
//                       to={`/doctors/${doctor.id}`}
//                       onClick={(e) => e.stopPropagation()}
//                       className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-200"
//                     >
//                       Book Now
//                     </Link>
//                   </div>

//                   {/* Next Available */}
//                   {doctor.available && (
//                     <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
//                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//                       <span>Next available: {doctor.nextAvailable}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Empty State */}
//           {filteredDoctors.length === 0 && (
//             <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
//               <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-10 h-10 text-emerald-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={1.5}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 No doctors found
//               </h3>
//               <p className="text-gray-500 mb-4">
//                 Try adjusting your filters to find more doctors
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DoctorsList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const specialties = [
  "All Specialties",
  "ENT Specialist",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "General Physician",
];

const hospitals = [
  "All Hospitals",
  "City Medical Center",
  "Heart & Vascular Institute",
  "Neuro Sciences Hospital",
  "St. Mary's Hospital",
  "Children's Healthcare",
];

function DoctorsList() {
  const navigate = useNavigate();
  const [doctorsData, setDoctorsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedHospital, setSelectedHospital] = useState("All Hospitals");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from API
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedSpecialty !== "All Specialties")
      params.append("specialty", selectedSpecialty);
    if (selectedHospital !== "All Hospitals")
      params.append("hospital", selectedHospital);
    if (showAvailableOnly) params.append("available", showAvailableOnly);

    axios
      .get(`http://localhost:3000/api/doctors?${params.toString()}`) // Replace with your API endpoint
      .then((response) => {
        console.log(response.data.data.items);
        setDoctorsData(
          Array.isArray(response.data.data.items)
            ? response.data.data.items
            : [],
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setDoctorsData([]);
        setLoading(false);
      });
  }, []);

  // Filtered doctors
  const filteredDoctors = doctorsData.filter((doctor) => {
    const firstName = (doctor.first_name || "").toLowerCase();
    const lastName = (doctor.last_name || "").toLowerCase();
    const specialization = (doctor.specialization_name || "").toLowerCase();
    const hospital = (doctor.hospital || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      firstName.includes(query) ||
      lastName.includes(query) ||
      specialization.includes(query) ||
      hospital.includes(query);

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      doctor.specialization_name === selectedSpecialty;

    const matchesHospital =
      selectedHospital === "All Hospitals" ||
      doctor.hospital === selectedHospital;

    const matchesAvailability = !showAvailableOnly || doctor.available;

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

  if (loading) return <p className="p-6 text-gray-500">Loading doctors...</p>;

  return (
    <div className="h-screen overflow-hidden flex bg-gradient-to-b from-emerald-50 to-white">
      {/* Sidebar Filters */}
      <div className="w-72 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          {(searchQuery ||
            selectedSpecialty !== "All Specialties" ||
            selectedHospital !== "All Hospitals" ||
            showAvailableOnly) && (
            <button
              onClick={clearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Availability */}
        <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-emerald-50/50 transition-all mb-6">
          <span className="text-sm text-gray-700">Available Today</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>

        {/* Specialty */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Specialization
          </label>
          <div className="space-y-2">
            {specialties.map((spec) => (
              <label
                key={spec}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedSpecialty === spec ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-transparent hover:bg-emerald-50/50"}`}
              >
                <input
                  type="radio"
                  name="specialty"
                  checked={selectedSpecialty === spec}
                  onChange={() => setSelectedSpecialty(spec)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedSpecialty === spec ? "border-emerald-500" : "border-gray-300"}`}
                >
                  {selectedSpecialty === spec && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                </div>
                <span
                  className={`text-sm ${selectedSpecialty === spec ? "text-emerald-700 font-medium" : "text-gray-600"}`}
                >
                  {spec}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Hospital */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hospital
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

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto px-6 lg:px-10 py-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Find Your <span className="text-emerald-600">Perfect Doctor</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Connect with world-class healthcare professionals tailored to your
            needs
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500"
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
              placeholder="Search by doctor name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-emerald-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all text-base shadow-sm"
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="text-emerald-600 font-semibold">
              {filteredDoctors.length}
            </span>{" "}
            doctors available
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor) => {
            const doctorId = doctor.id;

            return (
            <div
              key={doctorId}
              role="button"
              tabIndex={0}
              onClick={() => doctorId && navigate(`/doctors/${doctorId}`)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && doctorId) {
                  e.preventDefault();
                  navigate(`/doctors/${doctorId}`);
                }
              }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 cursor-pointer"
            >
              <div className="p-5">
                <div className="flex gap-4">
                  {/* Doctor Image */}
                  <div className="relative">
                    <img
                      src={doctor.image || "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face"}
                      alt={doctor.first_name + " " + doctor.last_name}
                      className="w-20 h-20 rounded-xl object-cover ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all"
                    />
                    {doctor.available && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors truncate">
                      {doctor.first_name} {doctor.last_name}
                    </h3>
                    <p className="text-emerald-600 text-sm font-medium">
                      {doctor.specialization_name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-gray-800 font-medium text-sm">
                        {doctor.average_rating}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({doctor.total_reviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {doctor.hospital && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{doctor.hospital}</span>
                    </div>
                  )}
                  {doctor.years_of_experience && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{doctor.years_of_experience} years experience</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      ${doctor.consultation_fee}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/ visit</span>
                  </div>
                  <Link
                    to={`/doctors/${doctorId}`}
                    onClick={(e) => {
                      if (!doctorId) {
                        e.preventDefault();
                        return;
                      }
                      e.stopPropagation();
                    }}
                    className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-200"
                  >
                    Book Now
                  </Link>
                </div>

                {doctor.available && doctor.nextAvailable && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Next available: {doctor.nextAvailable}</span>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters to find more doctors
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsList;
