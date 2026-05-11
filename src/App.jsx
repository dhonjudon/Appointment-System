import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointmentFlow from "./pages/BookAppointmentFlow";
import AppointmentSuccess from "./pages/AppointmentSuccess";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<AppointmentSuccess />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/book-appointment" element={<BookAppointmentFlow />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
