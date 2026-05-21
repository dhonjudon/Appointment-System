import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastNotification } from "./components/ToastNotification";
import FloatingChatbot from "./components/FloatingChatbot";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppointmentConfirm from "./pages/AppointmentConform";

import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import Dashboard from "./pages/Dashboard";
// import AppointmentBooked from "./pages/AppointmentBooked";
import DoctorsList from "./pages/DoctorsList";
import Appointments from "./pages/Appointments";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import AppointmentSetup from "./pages/doctor/AppointmentDetails";
import DoctorDashboard from "./pages/doctor/dashboard";
// import DoctorDashboards from "./doctor-pages/DoctorDashboard";
import DoctorProfilePage from "./doctor-pages/DoctorProfilePage";
import DoctorProfileSetup from "./doctor-pages/DoctorProfileSetup";
import Profile from "./pages/profile";
import DoctorAppointments from "./pages/doctor/Appointments";
import Patients from "./doctor-pages/Patients";
import AdminDashboard from "./admin pages/Dashboard";
import AdminUsers from "./admin pages/Users";
import AdminAppointments from "./admin pages/Appointments";
import AdminProfile from "./admin pages/Profile";
import AdminSettings from "./admin pages/Settings";
import Feedback from "./pages/Feedback";
function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <ToastNotification />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route
            path="/feedback"
            element={
              <>
                <Navbar />
                <Feedback />
              </>
            }
          />
          <Route
            path="/appointment-confirm"
            element={
              <>
                <Navbar />
                <AppointmentConfirm />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor/schedule" element={<AppointmentSetup />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<Patients />} />
          <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          <Route
            path="/doctor/profile-setup"
            element={<DoctorProfileSetup />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
        <FloatingChatbot />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
