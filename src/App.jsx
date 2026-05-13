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
    </BrowserRouter>
  );
}

export default App;