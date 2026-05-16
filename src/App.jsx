import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User Pages
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/Dashboard";
import AppointmentBooked from "./pages/AppointmentBooked";
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";

// Admin Pages
import Layout from "./components/Layout";
import AdminDashboard from "./admin pages/Dashboard";
import Users from "./admin pages/Users";
import Profile from "./admin pages/Profile";
import AdminDoctorProfile from "./admin pages/DoctorProfile";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <BrowserRouter>
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
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
