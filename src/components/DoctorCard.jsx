import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const {
    id,
    name,
    specialty,
    education,
    rating,
    reviews,
    image,
    available = true,
    experience = 0,
    languages = [],
    nextAvailable = "",
    consultationFee = 0,
    verified = false,
  } = doctor;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const getAvatarGradient = (id) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-cyan-600",
      "from-orange-500 to-red-600",
      "from-emerald-500 to-teal-600",
      "from-rose-500 to-pink-600",
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group hover:-translate-y-1">
      {/* Header with Status Badge */}
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 pb-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-3 border-white shadow-md"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarGradient(id)} flex items-center justify-center text-white font-bold text-xl shadow-md`}
              >
                {initials}
              </div>
            )}
            {verified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <p className="text-blue-600 font-semibold text-sm mb-1">
              {specialty}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="truncate">{education}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{experience}+ years experience</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {available && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Available
            </div>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-6 pt-4 space-y-4">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-amber-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-800">{rating}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              ({reviews} reviews)
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${consultationFee}
            </div>
            <div className="text-xs text-gray-500">Consultation</div>
          </div>
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <div className="flex flex-wrap gap-1.5">
              {languages.slice(0, 3).map((lang, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Available */}
        {nextAvailable && available && (
          <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-xs">Next: {nextAvailable}</span>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/doctors/${id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group/btn"
        >
          <span>Book Appointment</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
