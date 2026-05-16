import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AppointmentBooked from './pages/AppointmentBooked';

import DoctorDashboard from './doctor-pages/DoctorDashboard';
import Patients from './doctor-pages/Patients';
import DoctorProfileSetup from './doctor-pages/DoctorProfileSetup';

function AppContent() {
  const location = useLocation();

  // Hide user navbar on doctor pages
  const isDoctorPage = location.pathname.startsWith('/doctor');

  return (
    <div className="bg-[#eef2f5] min-h-screen">
      {!isDoctorPage && <Navbar />}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment" element={<AppointmentBooked />} />

        {/* Doctor Routes */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-patients" element={<Patients />} />
        <Route
          path="/doctor-profile-setup"
          element={<DoctorProfileSetup />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import Dashboard from "./pages/Dashboard";
import AppointmentBooked from "./pages/AppointmentBooked";
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import AppointmentSetup from "./pages/doctor/AppointmentDetails";
import DoctorDashboard from "./pages/doctor/dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
function App() {
  return (
    <BrowserRouter>
      {/* <Navbar />  */}
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<AppointmentBooked />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor/schedule" element={<AppointmentSetup />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;