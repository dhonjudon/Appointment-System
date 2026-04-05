import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import StarRating from "../components/StarRating";

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, date, time } = location.state || {};

  const [formData, setFormData] = useState({
    reason: "",
    notes: "",
    isFirstVisit: true,
    notifyBySMS: true,
    notifyByEmail: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if no booking data
  if (!doctor || !date || !time) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#f0fdfa] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-[#10b981]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Booking Selected
          </h2>
          <p className="text-gray-500 mb-6">
            Please select a doctor and time slot first.
          </p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-[#0f766e] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0d6b63] transition"
          >
            Find a Doctor
          </Link>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(date);
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#0f766e] to-[#10b981] rounded-full flex items-center justify-center animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Appointment Confirmed! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Your appointment has been successfully booked.
          </p>

          {/* Appointment Summary */}
          <div className="bg-[#f0fdfa] rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#10b981] flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                <p className="text-[#0f766e] text-sm font-semibold">
                  {doctor.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#0f766e]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-semibold text-gray-700">
                {appointmentDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-gray-400">•</span>
              <span className="font-semibold text-gray-700">{time}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/appointment"
              className="w-full bg-gradient-to-r from-[#0f766e] to-[#10b981] text-white font-bold py-3.5 rounded-xl hover:from-[#0d6b63] hover:to-[#0ea572] transition"
            >
              View My Appointments
            </Link>
            <Link
              to="/dashboard"
              className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] px-4 sm:px-6 lg:px-10 py-6 md:py-8">
      <div className="max-w-[900px] mx-auto">
        {/* Back Link */}
        <Link
          to={`/doctors/${doctor.id}`}
          className="inline-flex items-center gap-2 text-[#0f766e] font-bold text-sm hover:underline mb-6"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Doctor Profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,118,110,0.08)] border border-gray-100 p-6 md:p-8">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
                Complete Your Booking
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Reason for Visit */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reason for Visit *
                  </label>
                  <select
                    required
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 outline-none text-sm font-medium bg-white transition-all"
                  >
                    <option value="">Select a reason...</option>
                    <option value="checkup">General Checkup</option>
                    <option value="followup">Follow-up Visit</option>
                    <option value="consultation">Consultation</option>
                    <option value="treatment">Treatment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Describe your symptoms or any information the doctor should know..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 outline-none text-sm font-medium resize-none transition-all"
                  />
                </div>

                {/* First Visit Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700">
                    Is this your first visit?
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, isFirstVisit: true })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                        formData.isFirstVisit
                          ? "bg-[#0f766e] text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, isFirstVisit: false })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                        !formData.isFirstVisit
                          ? "bg-[#0f766e] text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Notification Preferences
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifyBySMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notifyBySMS: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-[#0f766e] focus:ring-[#10b981]"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        Send SMS reminder
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifyByEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notifyByEmail: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-[#0f766e] focus:ring-[#10b981]"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        Send email confirmation
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0f766e] to-[#10b981] text-white font-bold py-4 rounded-xl hover:from-[#0d6b63] hover:to-[#0ea572] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Confirm Booking – ${doctor.consultationFee}</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,118,110,0.08)] border border-gray-100 p-5 md:p-6 sticky top-24">
              <h3 className="text-lg font-extrabold text-gray-900 mb-4">
                Booking Summary
              </h3>

              {/* Doctor Card */}
              <div className="flex items-center gap-4 p-4 bg-[#f0fdfa] rounded-xl mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#10b981] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {doctor.name}
                  </h4>
                  <p className="text-[#0f766e] text-sm font-semibold">
                    {doctor.specialty}
                  </p>
                  <StarRating rating={doctor.rating} size="sm" />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#0f766e]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Date</p>
                    <p className="text-sm font-bold text-gray-800">
                      {appointmentDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#0f766e]"
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
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Time</p>
                    <p className="text-sm font-bold text-gray-800">{time}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">
                    Consultation Fee
                  </span>
                  <span className="text-xl font-extrabold text-[#0f766e]">
                    ${doctor.consultationFee}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
