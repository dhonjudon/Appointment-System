import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logoimage.png";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [showFinishAlert, setShowFinishAlert] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navLinksRef = useRef({});

  useEffect(() => {
    const activeLink = navLinksRef.current[currentPath];
    if (activeLink) {
      setUnderlineStyle({
        left: `${activeLink.offsetLeft}px`,
        width: `${activeLink.offsetWidth}px`,
      });
    }
  }, [currentPath]);

  const registerNavLink = (path, element) => {
    navLinksRef.current[path] = element;
  };

  const handleNavClick = (e, target, onNavigate) => {
    if (currentPath === "/payment") {
      e.preventDefault();
      setShowFinishAlert(true);
      return;
    }
    if (typeof onNavigate === "function") onNavigate();
  };

  if (currentPath === "/login" || currentPath === "/register") {
    return null;
  }
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center" onClick={(e) => handleNavClick(e, "/dashboard")}>
          <img
            src={logoImg}
            alt="Swastha Sewa Logo"
            className="h-10 md:h-[3.8rem]"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center h-full relative">
          {/* Sliding Underline */}
          <div
            className="absolute bottom-0 h-[3px] bg-[#22c55e] transition-all duration-300 ease-in-out"
            style={underlineStyle}
          ></div>

          <div className="flex items-center space-x-10">
            <Link
              ref={(el) => registerNavLink("/dashboard", el)}
              to="/dashboard"
              onClick={(e) => handleNavClick(e, "/dashboard")}
              className={`relative flex items-center text-[15px] font-bold transition-colors py-2 ${currentPath === "/dashboard" ? "text-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
            >
              Overview
            </Link>
            <Link
              ref={(el) => registerNavLink("/appointment", el)}
              to="/appointment"
              onClick={(e) => handleNavClick(e, "/appointment")}
              className={`relative flex items-center text-[15px] font-bold transition-colors py-2 ${currentPath === "/appointment" ? "text-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
            >
              Appointments
            </Link>

            <Link
              ref={(el) => registerNavLink("/doctors", el)}
              to="/doctors"
              onClick={(e) => handleNavClick(e, "/doctors")}
              className={`relative flex items-center text-[15px] font-bold transition-colors py-2 ${currentPath === "/doctors" ? "text-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
            >
              Doctors
            </Link>
            <Link
              ref={(el) => registerNavLink("/payment-history", el)}
              to="/payment-history"
              onClick={(e) => handleNavClick(e, "/payment-history")}
              className={`relative flex items-center text-[15px] font-bold transition-colors py-2 ${currentPath === "/payment-history" ? "text-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
            >
              Payment History
            </Link>
            <Link
              ref={(el) => registerNavLink("/feedback", el)}
              to="/feedback"
              onClick={(e) => handleNavClick(e, "/feedback")}
              className={`relative flex items-center text-[15px] font-bold transition-colors py-2 ${currentPath === "/feedback" ? "text-[#388e7b]" : "text-gray-800 hover:text-[#388e7b]"}`}
            >
              Feedback
            </Link>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-5">
          {/* Search Icon */}
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

          {/* Notification Bell */}
          <button className="w-10 h-10 rounded-full bg-[#eef2f5] flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[22px] w-[22px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff4b4b] border-[2px] border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
              3
            </span>
          </button>

          {/* Profile Avatar */}
          <button className="w-8 h-8 md:w-[42px] md:h-[42px] rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors bg-[#d8c3b5]" onClick={(e) => handleNavClick(e, '/dashboard')}>
            <img
              src="https://ui-avatars.com/api/?name=Sarah&background=d8c3b5&color=fff&size=40"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-[4px] text-gray-700 ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
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

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden absolute top-[100%] left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-60" : "max-h-0"}`}
      >
        <div className="flex flex-col px-4 py-2">
          <Link
            to="/dashboard"
            onClick={(e) => { handleNavClick(e, '/dashboard', () => setIsMobileMenuOpen(false)); }}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${currentPath === "/dashboard" ? "text-[#388e7b]" : "text-gray-800"}`}
          >
            Overview
          </Link>
          <Link
            to="/appointment"
            onClick={(e) => { handleNavClick(e, '/appointment', () => setIsMobileMenuOpen(false)); }}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${currentPath === "/appointment" ? "text-[#388e7b]" : "text-gray-800"}`}
          >
            Appointments
          </Link>
          <Link
            to="/doctors"
            onClick={(e) => { handleNavClick(e, '/doctors', () => setIsMobileMenuOpen(false)); }}
            className="py-3 px-2 font-bold text-[15px] border-b border-gray-100 text-gray-800"
          >
            Doctors
          </Link>
          <Link
            to="/payment-history"
            onClick={(e) => { handleNavClick(e, '/payment-history', () => setIsMobileMenuOpen(false)); }}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${currentPath === "/payment-history" ? "text-[#388e7b]" : "text-gray-800"}`}
          >
            Payment History
          </Link>
          <Link 
            to="/feedback" 
            onClick={(e) => { handleNavClick(e, '/feedback', () => setIsMobileMenuOpen(false)); }}
            className={`py-3 px-2 font-bold text-[15px] border-b border-gray-100 ${
              currentPath === '/feedback'
                ? 'text-[#388e7b]'
                : 'text-gray-800'
            }`}
          >
            Feedback
          </Link>
        </div>
      </div>
      {showFinishAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <p className="text-lg font-semibold text-gray-900">Finish payment first</p>
            <p className="mt-2 text-sm text-gray-600">Please complete or cancel your payment before navigating away.</p>
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowFinishAlert(false)} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">OK</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
