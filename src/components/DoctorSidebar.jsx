import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logoimage.png';

function DoctorSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-[240px] bg-[#1a6654] flex flex-col hidden md:flex shrink-0 shadow-xl z-20">
      <div className="flex items-center gap-3 px-6 py-8">
        <img src={logoImg} alt="Swastha Sewa Logo" className="h-20 object-contain brightness-0 invert" />
      </div>

      <nav className="flex flex-col gap-2 px-4 flex-1 mt-4">
        <Link to="/doctor-dashboard" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition ${currentPath === '/doctor-dashboard' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className="text-[15px]">Dashboard</span>
        </Link>
        <Link to="#" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition ${currentPath === '/doctor-appointments' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className="text-[15px]">Appointments</span>
        </Link>
        <Link to="/doctor-patients" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition ${currentPath === '/doctor-patients' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span className="text-[15px]">Patients</span>
        </Link>
        <Link to="#" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition ${currentPath === '/doctor-reports' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="text-[15px]">Reports</span>
        </Link>
        <Link to="/doctor-profile-setup" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition ${currentPath === '/doctor-profile-setup' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'}`}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="text-[15px]">Settings</span>
        </Link>
      </nav>

      <div className="p-4 mt-auto">
        <button className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition font-bold text-[15px]">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default DoctorSidebar;
