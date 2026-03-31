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
  } = doctor;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,118,110,0.08)] border border-gray-100 p-5 hover:shadow-[0_12px_32px_rgba(15,118,110,0.12)] transition-all duration-300 group">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#10b981] flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
          )}
          {available && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-[15px] truncate group-hover:text-[#0f766e] transition-colors">
            {name}
          </h3>
          <p className="text-[#0f766e] font-semibold text-[13px]">
            {specialty}
          </p>
          <p className="text-gray-400 text-[11px] font-medium truncate">
            {education}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[13px] font-bold text-gray-800">
                {rating}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-[12px] text-gray-400 font-medium">
              {reviews} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Link
        to={`/doctors/${id}`}
        className="mt-4 w-full block text-center bg-gradient-to-r from-[#0f766e] to-[#10b981] text-white font-bold text-[13px] py-2.5 rounded-xl hover:from-[#0d6b63] hover:to-[#0ea572] transition-all shadow-sm"
      >
        View Profile
      </Link>
    </div>
  );
};

export default DoctorCard;
