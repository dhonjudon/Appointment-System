import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const formatMoney = (value) =>
  Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

function AppointmentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  const quote = data.paymentQuote || {};

  if (!data.appointment || !data.payment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
        <div className="max-w-lg rounded-xl border border-emerald-100 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">No recent booking data</h2>
          <p className="mt-2 text-sm text-gray-500">
            Book a new appointment to see live payment and booking details here.
          </p>
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="mt-5 rounded-lg bg-emerald-500 px-5 py-2 text-white font-semibold"
          >
            Book Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-xl border border-emerald-100 bg-white p-6">
          <h1 className="text-2xl font-bold text-emerald-700">Appointment Confirmed</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was successful and appointment is fully confirmed.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">Booking Details</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Doctor: {data.doctor?.name || "N/A"}</p>
            <p>Date: {data.displayDate}</p>
            <p>Time: {data.displayTime}</p>
            <p>Reason: {data.visitReason}</p>
            <p>Appointment ID: {data.appointment?.id}</p>
            <p>Appointment Status: {data.appointment?.status}</p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>Payment ID: {data.payment?.id}</p>
            <p>Provider: {data.payment?.provider}</p>
            <p>Method: {quote.payment_method || data.paymentMethod}</p>
            <p>Status: {data.payment?.status}</p>
            <p>Base Amount: {formatMoney(quote.base_amount || 0)}</p>
            <p>Platform Fee: {formatMoney(quote.platform_fee || 0)}</p>
            <p>Tax: {formatMoney(quote.tax || 0)}</p>
            <p className="font-semibold text-emerald-700">
              Total Paid: {formatMoney(quote.total_amount || data.payment?.amount || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentSuccess;
