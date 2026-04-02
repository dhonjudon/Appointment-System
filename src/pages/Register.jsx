import React from 'react';
import { Link } from 'react-router-dom';
import doctorImg from "../assets/doctor.png";
import logoImg from "../assets/logoimage.png";

function Register() {
  return (
    <div className="flex min-h-screen bg-[#eef2f5] font-sans overflow-hidden relative">
      
      {/* LEFT SIDE - Form */}
      <div className="w-full md:w-[45%] lg:w-1/2 flex flex-col justify-center items-center py-6 px-4 md:px-8 z-10 relative overflow-y-auto">
        <div className="w-full max-w-sm xl:max-w-md bg-transparent mt-8 md:mt-0">
          
          {/* Logo & Heading */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={logoImg} alt="logo" className="h-[4.5rem] mb-3" />
            <h2 className="text-[1.35rem] font-extrabold text-gray-900 text-center tracking-tight">Create An Account</h2>
          </div>

          {/* Form */}
          <form className="w-full">
            
            {/* Full name */}
            <div className="mb-4">
              <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">Full name</label>
              <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input type="text" className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]" />
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">Email Address</label>
              <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input type="email" className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]" />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">Password</label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input type="password" className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">Confirm Password</label>
                <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input type="password" className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]" />
                </div>
              </div>
            </div>

            {/* Phone Number & Date of Birth */}
            <div className="flex gap-4 mb-4">
               <div className="flex-1">
                 <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">Phone Number</label>
                 <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                   <input type="tel" className="w-full bg-transparent outline-none text-gray-800 font-medium text-[14px]" />
                 </div>
               </div>
               <div className="flex-1">
                 <label className="block text-[13px] font-bold text-gray-900 mb-[6px] ml-[2px]">Date of Birth</label>
                 <div className="flex items-center w-full bg-[#f4f7f8] border-[1.5px] border-[#aab2b8] focus-within:border-gray-600 rounded-[5px] transition-colors py-[7px] px-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   <input type="text" placeholder="DD/MM/YYYY" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium text-[13px]" />
                 </div>
               </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center mb-6 mt-1 text-[13px] font-bold text-gray-500">
              <input type="checkbox" className="mr-2 rounded border-gray-400 w-[14px] h-[14px] ml-[2px]" />
              <label>I agree to the terms of service and privacy policy</label>
            </div>

            {/* Register Now Button */}
            <button className="w-full py-2.5 mb-6 bg-[#2f705c] text-white font-bold rounded-full flex justify-center items-center hover:bg-[#1f5647] transition-colors shadow-sm">
              Register Now
            </button>

            {/* Separator */}
            <div className="flex items-center justify-center mb-6 opacity-70">
               <div className="h-[1px] bg-gray-600 w-16"></div>
               <span className="text-gray-700 text-[13px] font-semibold mx-3">or Sign up with</span>
               <div className="h-[1px] bg-gray-600 w-16"></div>
            </div>
            
            {/* Social Icons */}
            <div className="flex justify-center gap-[1rem] mb-6">
              <button type="button" className="w-[2.6rem] h-[2.6rem] rounded-full border-[1.5px] border-gray-600 flex items-center justify-center hover:bg-gray-200 text-gray-800 outline-none">
                <span className="font-bold text-[17px]">G</span>
              </button>
              <button type="button" className="w-[2.6rem] h-[2.6rem] rounded-full border-[1.5px] border-gray-600 flex items-center justify-center hover:bg-gray-200 text-gray-800 outline-none">
                <svg viewBox="0 0 384 512" width="16" height="16" fill="currentColor" className="pb-[2px]">
                   <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </button>
              <button type="button" className="w-[2.6rem] h-[2.6rem] rounded-full border-[1.5px] border-gray-600 flex items-center justify-center hover:bg-gray-200 text-gray-800 outline-none">
                <span className="font-bold text-[17px]">f</span>
              </button>
            </div>

            {/* Login Link element under icons */}
            <div className="text-center w-full mb-10 text-[13.5px] font-bold text-gray-900 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0f5c51] hover:underline font-extrabold text-[14px]">Log in</Link>
            </div>
            
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Image and Overlay Text */}
      <div className="w-full md:w-[55%] lg:w-1/2 relative hidden md:block">
         <img src={doctorImg} alt="Doctor" className="w-full h-full object-cover object-center" />
         
         <div className="absolute top-[22%] -left-4 md:-left-10 lg:-left-16 xl:-left-24 z-20">
           <h2 className="text-[2rem] lg:text-[2.2rem] font-serif font-extrabold text-[#0f5c51] mb-2 leading-[1.2] tracking-wide" style={{ textShadow: '1px 1px 12px rgba(255,255,255,0.7)' }}>
             A Healthier You is Just<br/>an Appointment Away
           </h2>
           <p className="text-gray-900 text-base font-bold ml-1" style={{ textShadow: '1px 1px 8px rgba(255,255,255,0.8)' }}>
             Access expert care ,effortlessly
           </p>
         </div>
      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[13.5px] font-bold text-gray-900 z-30">
         Terms of Use | Privacy Link
      </div>
    </div>
  );
}

export default Register;
