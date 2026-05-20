import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppointmentBooked from "./pages/AppointmentBooked";
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import LandingPage from "./pages/LandingPage";
import Payment from "./pages/Payment";
import PaymentHistory from "./pages/PaymentHistory";

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = ["/", "/home", "/login", "/register"].includes(
    location.pathname,
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<AppointmentBooked />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
