import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppointmentBooked from "./pages/AppointmentBooked";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import AppointmentConfirm from "./pages/AppointmentConform";
import DoctorsList from "./pages/DoctorsList";
import Onboarding from "./pages/onboarding";
import Appointments from "./pages/Appointments";
import Profile from "./pages/profile";
function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Routes with Navbar */}
          <Route
            path="/doctors"
            element={
              <>
                <Navbar />
                <DoctorsList />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/doctors/:id"
            element={
              <>
                <Navbar />
                <DoctorProfile />
              </>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <>
                <Navbar />
                <BookAppointment />
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
          <Route
            path="/appointment"
            element={
              <>
                <Navbar />
                <Appointments />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
