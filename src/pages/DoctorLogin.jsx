import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logoimage.png";

function DoctorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if user is a doctor
      if (data.data.role !== "doctor") {
        throw new Error(
          "This account is not a doctor account. Please use Patient Login.",
        );
      }

      const userId = data.data.id;

      // Fetch doctor ID from doctors table using user_id
      const doctorResponse = await fetch(
        `http://localhost:3000/api/doctors/user/${userId}`,
      );

      if (!doctorResponse.ok) {
        throw new Error("Failed to fetch doctor profile");
      }

      const doctorData = await doctorResponse.json();
      const doctorId = doctorData.data?.id;

      if (!doctorId) {
        throw new Error("Doctor profile not found");
      }

      // Store credentials
      localStorage.setItem("userID", userId);
      localStorage.setItem("doctorId", doctorId);
      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("userEmail", data.data.email);
      sessionStorage.setItem("userID", userId);
      sessionStorage.setItem("doctorId", doctorId);

      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-emerald-50 to-white font-sans overflow-hidden relative">
      {/* LEFT SIDE - Form */}
      <div className="w-full md:w-[45%] lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative">
        <div className="w-full max-w-sm xl:max-w-md px-4 bg-transparent">
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={logoImg} alt="logo" className="h-[4.5rem] mb-3" />
            <h2 className="text-[1.20rem] font-extrabold text-gray-900 text-center tracking-tight">
              Doctor Log In
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage your appointments & patients
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="w-full" onSubmit={handleSubmit}>
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
                  placeholder="e.g, doctor@gmail.com"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  className="w-full bg-transparent outline-none text-gray-800 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              className="w-full py-2.5 mb-6 border-2 border-[#0f5c51] text-[#0f5c51] font-bold rounded-full flex justify-center items-center hover:bg-[#0f5c51] hover:text-white transition-colors group disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && (
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
              )}
            </button>

            {/* Links */}
            <div className="text-center text-sm mb-6">
              <p className="text-gray-600 font-medium">
                Don't have an account?{" "}
                <Link
                  to="/doctor/register"
                  className="text-[#0e5c53] hover:underline font-bold"
                >
                  Register as Doctor
                </Link>
              </p>
            </div>

            {/* Patient vs Doctor toggle */}
            <div className="border-t border-gray-200 pt-6 mb-4">
              <p className="text-center text-xs text-gray-500 mb-3">
                Are you a patient?
              </p>
              <Link
                to="/login"
                className="w-full py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-full flex justify-center items-center hover:bg-gray-100 transition-colors"
              >
                Patient Login
              </Link>
            </div>

            {/* Admin Login Link */}
            <div>
              <p className="text-center text-xs text-gray-500 mb-3">
                Are you an administrator?
              </p>
              <Link
                to="/admin/login"
                className="w-full py-2 border-2 border-red-400 text-red-600 font-bold rounded-full flex justify-center items-center hover:bg-red-50 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Image (hidden on mobile) */}
      <div className="hidden md:flex md:w-[55%] lg:w-1/2 bg-gradient-to-br from-emerald-100 to-emerald-200 flex-col justify-end items-center p-8 relative overflow-hidden">
        <svg
          className="absolute top-0 right-0 w-96 h-96 opacity-10"
          fill="currentColor"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="80" />
        </svg>
        <div className="text-center z-10 mb-10">
          <h3 className="text-3xl font-extrabold text-emerald-900 mb-3">
            Welcome Back, Doctor
          </h3>
          <p className="text-emerald-700 text-lg font-medium">
            Manage your practice efficiently
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
