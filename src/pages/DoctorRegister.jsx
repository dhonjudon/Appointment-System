import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logoimage.png";

function DoctorRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    consultationFee: "",
    bio: "",
  });

  const [specializations, setSpecializations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewSpecModal, setShowNewSpecModal] = useState(false);
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecDesc, setNewSpecDesc] = useState("");
  const [specLoading, setSpecLoading] = useState(false);
  const [specError, setSpecError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch specializations
    const fetchSpecializations = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/specializations",
        );
        const data = await response.json();

        if (response.ok && data.data && Array.isArray(data.data)) {
          setSpecializations(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
      }
    };
    fetchSpecializations();
  }, []);

  const handleAddNewSpecialization = async (e) => {
    e.preventDefault();
    setSpecError("");

    if (!newSpecName.trim()) {
      setSpecError("Specialization name is required");
      return;
    }

    setSpecLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/specializations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newSpecName.trim(),
            description: newSpecDesc.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create specialization");
      }

      // Add new specialization to list and select it
      setSpecializations([...specializations, data.data]);
      setFormData((prev) => ({
        ...prev,
        specialization: data.data.id.toString(),
      }));

      // Close modal and reset form
      setShowNewSpecModal(false);
      setNewSpecName("");
      setNewSpecDesc("");
    } catch (err) {
      setSpecError(err.message || "Failed to create specialization");
    } finally {
      setSpecLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setError("First and last names are required");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.specialization || !formData.licenseNumber) {
      setError("Specialization and license number are required");
      return;
    }

    setLoading(true);

    try {
      // Register as doctor user
      const registerRes = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: "doctor",
          }),
        },
      );

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.message || "Registration failed");
      }

      const userId = registerData.data.id;

      // Add doctor details
      const doctorRes = await fetch("http://localhost:3000/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          specialization_id: parseInt(formData.specialization),
          license_number: formData.licenseNumber,
          years_of_experience: formData.yearsOfExperience
            ? parseInt(formData.yearsOfExperience)
            : 0,
          consultation_fee: formData.consultationFee
            ? parseFloat(formData.consultationFee)
            : 0,
          bio: formData.bio || null,
        }),
      });

      const doctorData = await doctorRes.json();

      if (!doctorRes.ok) {
        throw new Error(doctorData.message || "Failed to add doctor details");
      }

      // Store credentials
      localStorage.setItem("doctorId", doctorData.data.id);
      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("userEmail", formData.email);
      sessionStorage.setItem("doctorId", doctorData.data.id);

      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-emerald-50 to-white font-sans overflow-hidden relative">
      {/* LEFT SIDE - Form */}
      <div className="w-full md:w-[45%] lg:w-1/2 flex flex-col justify-center items-center py-6 px-4 md:px-8 z-10 relative overflow-y-auto">
        <div className="w-full max-w-sm xl:max-w-md bg-transparent mt-8 md:mt-0">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={logoImg} alt="logo" className="h-[4.5rem] mb-3" />
            <h2 className="text-[1.35rem] font-extrabold text-gray-900 text-center tracking-tight">
              Register as Doctor
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Join our medical community
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  First Name
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[18px] w-[18px] text-gray-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  Last Name
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                Email Address
              </label>
              <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[18px] w-[18px] text-gray-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  Password
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[18px] w-[18px] text-gray-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  Confirm Password
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[18px] w-[18px] text-gray-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Phone & Specialization */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  Phone Number
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  Specialization
                </label>
                <div className="flex gap-2">
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="flex-1 bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3 text-gray-800 font-medium text-[14px]"
                    required
                  >
                    <option value="">Select specialization...</option>
                    {specializations.length > 0 ? (
                      specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading specializations...</option>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewSpecModal(true)}
                    className="px-3 py-2 bg-emerald-100 border-[1.5px] border-emerald-300 text-emerald-700 font-bold rounded-[5px] hover:bg-emerald-200 transition-colors text-sm whitespace-nowrap"
                    title="Add new specialization"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* License Number & Years of Experience */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  License Number *
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                  Years of Experience
                </label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Consultation Fee & Bio */}
            <div className="mb-4">
              <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                Consultation Fee ($)
              </label>
              <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">
                Professional Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3 text-gray-800 font-medium text-[14px] outline-none resize-none h-20"
                placeholder="Tell patients about yourself..."
              />
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mb-4 bg-[#0f5c51] text-white font-bold rounded-full flex justify-center items-center hover:bg-[#0d4a41] transition-colors disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create Doctor Account"}
            </button>

            {/* Links */}
            <div className="text-center text-sm mb-4">
              <p className="text-gray-600 font-medium">
                Already have an account?{" "}
                <Link
                  to="/doctor/login"
                  className="text-[#0e5c53] hover:underline font-bold"
                >
                  Login as Doctor
                </Link>
              </p>
            </div>

            {/* Patient vs Doctor toggle */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-center text-xs text-gray-500 mb-3">
                Are you a patient?
              </p>
              <Link
                to="/register"
                className="w-full py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-full flex justify-center items-center hover:bg-gray-100 transition-colors text-sm"
              >
                Register as Patient
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Image (hidden on mobile) */}
      <div className="hidden md:flex md:w-[55%] lg:w-1/2 bg-gradient-to-br from-blue-100 to-blue-200 flex-col justify-end items-center p-8 relative overflow-hidden">
        <svg
          className="absolute top-0 right-0 w-96 h-96 opacity-10"
          fill="currentColor"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="80" />
        </svg>
        <div className="text-center z-10 mb-10">
          <h3 className="text-3xl font-extrabold text-blue-900 mb-3">
            Join Our Network
          </h3>
          <p className="text-blue-700 text-lg font-medium">
            Reach more patients today
          </p>
        </div>
      </div>

      {/* New Specialization Modal */}
      {showNewSpecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add New Specialization
            </h3>

            {specError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{specError}</p>
              </div>
            )}

            <form onSubmit={handleAddNewSpecialization}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Specialization Name *
                </label>
                <input
                  type="text"
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  placeholder="e.g., Cardiology"
                  className="w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus:border-gray-600 rounded-[5px] transition-colors py-2 px-3 text-gray-800 font-medium text-sm outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newSpecDesc}
                  onChange={(e) => setNewSpecDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus:border-gray-600 rounded-[5px] transition-colors py-2 px-3 text-gray-800 font-medium text-sm outline-none resize-none h-20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSpecModal(false);
                    setNewSpecName("");
                    setNewSpecDesc("");
                    setSpecError("");
                  }}
                  className="flex-1 py-2 px-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={specLoading}
                  className="flex-1 py-2 px-3 bg-[#0f5c51] text-white font-bold rounded-lg hover:bg-[#0d4a41] transition-colors disabled:opacity-50"
                >
                  {specLoading ? "Adding..." : "Add Specialization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorRegister;
