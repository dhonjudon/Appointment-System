import React, { useState } from "react";
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

// User Pages
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/Dashboard";
import AppointmentBooked from "./pages/AppointmentBooked";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import Dashboard from "./pages/Dashboard";
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointmentFlow from "./pages/BookAppointmentFlow";
import AppointmentSuccess from "./pages/AppointmentSuccess";

// Admin Pages
import Layout from "./components/Layout";
import AdminDashboard from "./admin pages/Dashboard";
import Users from "./admin pages/Users";
import Profile from "./admin pages/Profile";
import AdminDoctorProfile from "./admin pages/DoctorProfile";

import BookAppointment from "./pages/BookAppointment";
import AppointmentSetup from "./pages/doctor/AppointmentDetails";
import DoctorDashboard from "./pages/doctor/dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <BrowserRouter>
      {/* <Navbar />  */}
      <div className="bg-gray-50 min-h-screen">
        <Navbar />

        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Pages */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointment" element={<AppointmentBooked />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<AppointmentSuccess />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/book-appointment" element={<BookAppointmentFlow />} />
          <Route path="/book-appointment" element={<BookAppointment />} />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                {activeTab === "dashboard" && <AdminDashboard />}

                {activeTab === "users" && <Users setActiveTab={setActiveTab} />}

                {activeTab === "profile" && <Profile />}

                {activeTab === "doctorProfile" && (
                  <AdminDoctorProfile setActiveTab={setActiveTab} />
                )}

                {activeTab !== "dashboard" &&
                  activeTab !== "users" &&
                  activeTab !== "profile" &&
                  activeTab !== "doctorProfile" && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p className="text-xl">
                        Content for {activeTab} coming soon.
                      </p>
                    </div>
                  )}
              </Layout>
            }
          />
          <Route path="/doctor/schedule" element={<AppointmentSetup />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;