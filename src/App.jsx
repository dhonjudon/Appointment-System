import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AppointmentBooked from './pages/AppointmentBooked';

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
          <Route path="/appointment" element={<AppointmentBooked />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
