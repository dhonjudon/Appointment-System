import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logoimage.png";
import DoctorSidebar from "../components/DoctorSidebar";
import { NotificationBell } from "../components/NotificationBell";

const API_BASE_URL = "http://localhost:3000/api";

function DoctorProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [doctorData, setDoctorData] = useState(null);

  const doctorId =
    localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization_id: "",
    license_number: "",
    years_of_experience: "",
    consultation_fee: "",
    bio: "",
    password: "",
    confirm_password: "",
  });

  // Load current profile data on mount
  useEffect(() => {
    if (!doctorId) {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch doctor details
        const doctorRes = await fetch(`${API_BASE_URL}/doctors/${doctorId}`);
        if (!doctorRes.ok) throw new Error("Failed to load doctor profile");
        const doctorJson = await doctorRes.json();
        const doctorDetails = doctorJson.data || {};
        setDoctorData(doctorDetails);

        // Fetch user profile for phone/email
        let profileData = null;
        if (doctorDetails.user_id) {
          const profileRes = await fetch(
            `${API_BASE_URL}/profile/${doctorDetails.user_id}`,
          );
          if (profileRes.ok) {
            const profileJson = await profileRes.json();
            profileData = profileJson.data || {};
          }
        }

        // Populate form with fetched data
        setFormData({
          first_name: doctorDetails.first_name || "",
          last_name: doctorDetails.last_name || "",
          email: profileData?.email || doctorDetails.email || "",
          phone: profileData?.phone || doctorDetails.phone || "",
          specialization_id: String(doctorDetails.specialization_id || ""),
          license_number: doctorDetails.license_number || "",
          years_of_experience: String(doctorDetails.years_of_experience || ""),
          consultation_fee: String(doctorDetails.consultation_fee || ""),
          bio: doctorDetails.bio || "",
          password: "",
          confirm_password: "",
        });

        // Fetch specialties from API
        const specsRes = await fetch(`${API_BASE_URL}/specializations`);
        if (specsRes.ok) {
          const specsJson = await specsRes.json();
          setSpecialties(Array.isArray(specsJson.data) ? specsJson.data : []);
        }
      } catch (err) {
        setError(err.message || "Failed to load profile data");
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [doctorId]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInitials = (firstName, lastName) => {
    const first = (firstName || "").trim().charAt(0).toUpperCase();
    const last = (lastName || "").trim().charAt(0).toUpperCase();
    return `${first}${last}` || "DR";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (formData.password && formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build doctor update payload
      const doctorPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        specialization_id: parseInt(formData.specialization_id),
        license_number: formData.license_number,
        years_of_experience: parseInt(formData.years_of_experience),
        consultation_fee: parseFloat(formData.consultation_fee),
        bio: formData.bio,
      };

      // Only add password if provided
      if (formData.password) {
        doctorPayload.password = formData.password;
      }

      // Update doctor record with PUT
      const doctorRes = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorPayload),
      });

      const doctorText = await doctorRes.text();
      let doctorData = {};
      try {
        doctorData = doctorText ? JSON.parse(doctorText) : {};
      } catch (_err) {
        doctorData = { message: doctorText || "Unexpected server response" };
      }

      if (!doctorRes.ok) {
        throw new Error(
          doctorData.message || "Failed to update doctor profile",
        );
      }

      // If we have a user_id, also update the user profile with phone/email
      if (
        doctorData.data?.user_id ||
        (doctorData.data && doctorData.data.user_id)
      ) {
        const userId = doctorData.data.user_id;
        const userPayload = {
          email: formData.email,
          phone: formData.phone,
        };

        await fetch(`${API_BASE_URL}/profile/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userPayload),
        });
      }

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred while updating profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-linear-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-18 bg-transparent px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div>
            <p className="text-[12px] text-gray-500 font-semibold mb-0.5">
              Doctor account
            </p>
            <h1 className="text-[18px] font-extrabold text-gray-900">
              Profile setup
            </h1>
          </div>
          <NotificationBell userId={doctorData?.user_id} />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-300 mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                Profile Setup
              </h1>
              <p className="text-gray-500 font-semibold text-sm">
                Update your profile information and preferences
              </p>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-semibold text-sm">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 font-semibold text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                  {/* Profile Picture Section */}
                  <div className="lg:col-span-3 flex flex-col items-center">
                    <h3 className="w-full text-left text-sm font-extrabold text-gray-900 mb-6">
                      Profile Picture
                    </h3>
                    <div className="w-40 h-40 rounded-full bg-[#1b6a55] mb-6 border-4 border-gray-50 shadow-inner overflow-hidden flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-white tracking-wider">
                        {getInitials(formData.first_name, formData.last_name)}
                      </span>
                    </div>
                  </div>

                  {/* Right Form Areas */}
                  <div className="lg:col-span-9 flex flex-col gap-10">
                    {/* Row 1: Personal Info & Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="col-span-1">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[12px] font-extrabold text-gray-700 mb-1.5 flex items-center gap-1">
                              Specialty <span className="text-red-500">*</span>
                              <svg
                                className="w-3.5 h-3.5 text-[#1b6a55]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                            </label>
                            <select
                              name="specialization_id"
                              value={formData.specialization_id}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 bg-white appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: `right 0.75rem center`,
                                backgroundRepeat: `no-repeat`,
                                backgroundSize: `1.5em 1.5em`,
                                paddingRight: `2.5rem`,
                              }}
                            >
                              {specialties.map((specialty) => (
                                <option key={specialty.id} value={specialty.id}>
                                  {specialty.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Contact Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Credentials & Security */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      {/* Credentials */}
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                          Credentials
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="col-span-2">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              License Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="license_number"
                              value={formData.license_number}
                              onChange={handleInputChange}
                              placeholder="Enter your license number"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Experience (Years){" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="years_of_experience"
                              value={formData.years_of_experience}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Consultation Fee
                            </label>
                            <input
                              type="number"
                              name="consultation_fee"
                              value={formData.consultation_fee}
                              onChange={handleInputChange}
                              placeholder="Enter consultation fee"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800"
                            />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-[12px] font-extrabold text-gray-700 mb-1.5">
                              Bio
                            </label>
                            <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              placeholder="Enter your bio"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 h-20"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Security */}
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                          Security
                        </h3>
                        <div className="flex flex-col gap-5">
                          <div>
                            <label className="text-[12px] font-extrabold text-gray-700 mb-1.5 flex items-center gap-1">
                              Change Password
                              <svg
                                className="w-3.5 h-3.5 text-[#1b6a55]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  placeholder="Enter new password"
                                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 placeholder-gray-400"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                  <svg
                                    className="w-4 h-4 text-gray-400 hover:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                              <div className="relative">
                                <input
                                  type="password"
                                  name="confirm_password"
                                  value={formData.confirm_password}
                                  onChange={handleInputChange}
                                  placeholder="Confirm new password"
                                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20 focus:border-[#1b6a55] transition text-sm font-semibold text-gray-800 placeholder-gray-400"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                  <svg
                                    className="w-4 h-4 text-gray-400 hover:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-[11px] text-gray-500 font-semibold">
                              Leave blank if you don't want to change password
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-extrabold text-sm hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b6a55] text-white font-extrabold text-sm hover:bg-[#145140] transition shadow-md shadow-[#1b6a55]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                              ></path>
                            </svg>
                            Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorProfileSetup;
