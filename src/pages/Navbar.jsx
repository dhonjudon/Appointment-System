// Navbar.jsx
// Top navigation bar with logo, menu links, notifications, and user profile
// Responsive design: shows hamburger menu on mobile

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logoimage.png";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* Logo/brand */}
        <Link to="/dashboard" className="flex items-center">
          <img
            src={logoImg}
            alt="Swastha Sewa Logo"
            className="h-10 md:h-[3.8rem]"
          />
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center space-x-10 h-full">
          {/* Dashboard link with active indicator */}
          <Link
            to="/dashboard"
            className={`relative flex items-center text-[15px] font-bold transition-colors pb-1 ${currentPath === "/dashboard" || currentPath === "/" ? "text-[#388e7b] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
          >
            Overview
          </Link>
          {/* Appointments link with active indicator */}
          <Link
            to="/appointment"
            className={`relative flex items-center text-[15px] font-bold transition-colors pb-1 ${currentPath === "/appointment" ? "text-[#388e7b] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
          >
            Appointments
          </Link>

          {/* Doctors link */}
          <Link
            to="/doctors"
            className="relative flex items-center text-[15px] font-bold transition-colors pb-1 text-gray-800 hover:text-[#388e7b]"
          >
            Doctors
          </Link>
        </div>

        {/* Right side: search, notifications, profile */}
        <div className="flex items-center space-x-5">
          {/* Search button */}
          <button className="w-10 h-10 rounded-full bg-[#eef2f5] flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>

          {/* Notification bell with badge */}
          <button className="w-10 h-10 rounded-full bg-[#eef2f5] flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[22px] w-[22px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            {/* Notification count badge */}
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff4b4b] border-[2px] border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
              3
            </span>
          </button>

          {/* User profile avatar */}
          <button className="w-8 h-8 md:w-[42px] md:h-[42px] rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors bg-[#d8c3b5]">
            <img
              src="https://ui-avatars.com/api/?name=Sarah&background=d8c3b5&color=fff&size=40"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Mobile menu toggle button */}
          <button
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-[4px] text-gray-700 ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* Hamburger icon that animates when clicked */}
            <span
              className={`block w-6 h-[2px] bg-current transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden absolute top-[100%] left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-60" : "max-h-0"}`}
      >
        <div className="flex flex-col px-4 py-2">
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${currentPath === "/dashboard" || currentPath === "/" ? "text-[#388e7b]" : "text-gray-800"}`}
          >
            Overview
          </Link>
          <Link
            to="/appointment"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${currentPath === "/appointment" ? "text-[#388e7b]" : "text-gray-800"}`}
          >
            Appointments
          </Link>
          <Link
            to="/doctors"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${currentPath === "/doctors" ? "text-[#388e7b]" : "text-gray-800"}`}
          >
            Doctors
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
