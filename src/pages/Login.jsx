// Login.jsx
// User authentication page
// Handles email/password login with remember me functionality and token storage

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import doctorImg from "../assets/doctor.png";
import logoImg from "../assets/logoimage.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      // Submit login credentials to API
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || "Unable to log in.");
      }

      // Store auth token and user data based on remember me preference
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authUser", JSON.stringify(result.data));
      console.log(result.data);
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data));

      // Redirect to dashboard after successful login
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eef2f5] font-sans overflow-hidden relative">
      {/* LEFT SIDE - Form */}
      <div className="w-full md:w-[45%] lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative">
        <div className="w-full max-w-sm xl:max-w-md px-4 bg-transparent">
          {/* Logo */}
          <div className="flex items-center justify-start mb-10">
            <img src={logoImg} alt="logo" className="h-[4.5rem]" />
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-gray-900 mb-8 ml-1">Log In</h2>

          {/* Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            {error ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 transition-colors py-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 mr-2 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="e.g,yourname@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                Password
              </label>
              <div className="relative border-b border-gray-400 focus-within:border-gray-800 transition-colors py-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 mr-2 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent outline-none text-gray-800 font-medium"
                />
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800 ml-2 mr-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1.1rem] w-[1.1rem]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1.1rem] w-[1.1rem]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-8 text-sm font-bold">
              <label className="flex items-center text-gray-900 cursor-pointer ml-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="mr-2 rounded border-gray-400 w-[14px] h-[14px]"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-[#0e5c53] hover:underline font-semibold pr-1"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mb-12 border-2 border-[#0f5c51] text-[#0f5c51] font-bold rounded-full flex justify-center items-center hover:bg-[#0f5c51] hover:text-white transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 mt-[1px] group-hover:text-white text-[#0f5c51]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            {/* Social Icons */}
            <div className="flex justify-center gap-[1.1rem] mb-10 mr-1">
              <button
                type="button"
                className="w-[3rem] h-[3rem] rounded-full border-[1.5px] border-gray-600 flex items-center justify-center hover:bg-gray-200 text-gray-600 outline-none"
              >
                <span className="font-bold text-lg">G</span>
              </button>
              <button
                type="button"
                className="w-[3rem] h-[3rem] rounded-full border-[1.5px] border-gray-600 flex items-center justify-center hover:bg-gray-200 text-gray-600 outline-none"
              >
                <svg
                  viewBox="0 0 384 512"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="pb-[2px]"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-[3rem] h-[3rem] rounded-full border-[1.5px] border-gray-600 flex items-center justify-center hover:bg-gray-200 text-gray-600 outline-none"
              >
                <span className="font-bold text-lg">f</span>
              </button>
            </div>

            {/* Register */}
            <div className="text-center text-[13px] font-bold text-gray-900 mt-2">
              New to Swastha Sewa? Register for free
              <div className="mt-3">
                <Link
                  to="/register"
                  className="text-[#0f5c51] hover:underline font-extrabold text-[14px]"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Image and Overlay Text */}
      <div className="w-full md:w-[55%] lg:w-1/2 relative hidden md:block">
        {/* The image takes up the entire right column height */}
        <img
          src={doctorImg}
          alt="Doctor"
          className="w-full h-full object-cover object-center"
        />

        {/* Floating text overlapping onto the right column space (or slightly left) */}
        <div className="absolute top-[22%] -left-4 md:-left-20 lg:-left-32 xl:-left-[15rem] z-20">
          <h2
            className="text-[2rem] lg:text-[2.2rem] font-serif font-extrabold text-[#0f5c51] mb-2 leading-[1.2] tracking-wide"
            style={{ textShadow: "1px 1px 12px rgba(255,255,255,0.7)" }}
          >
            A Healthier You is Just
            <br />
            an Appointment Away
          </h2>
          <p
            className="text-gray-900 text-base font-bold ml-1"
            style={{ textShadow: "1px 1px 8px rgba(255,255,255,0.8)" }}
          >
            Access expert care ,effortlessly
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-gray-900 z-30">
        Terms of Use | Privacy Link
      </div>
    </div>
  );
}

export default Login;
