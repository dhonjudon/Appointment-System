import React from 'react';
import { useNavigate } from 'react-router-dom';

function AppointmentRescheduled({ selectedTime, selectedDate, onClose }) {
  const navigate = useNavigate();

  const handleDone = () => {
    onClose();
    navigate('/appointment');
  };

  let dateString = 'Fri,April,2026';
  if (selectedDate) {
    if (selectedDate instanceof Date) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      dateString = `${days[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    } else {
      dateString = selectedDate.toString().replace(/\s+/g, '');
    }
  }
  
  const formattedTime = selectedTime || '8:00 AM';
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
       <div className="w-12 h-12 bg-[#2b8871] rounded-full flex items-center justify-center text-white mb-4 shadow-sm">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
         </svg>
       </div>
       
       <h3 className="text-[1.1rem] font-extrabold text-gray-900 mb-2">Appointment Rescheduled !</h3>
       <p className="text-gray-500 font-bold text-[13px] leading-tight mb-8">
         Confirmation will be sent to your<br/>registered email and phone
       </p>
       
       <div className="bg-[#eaf4f1] border border-[#a8cfc3] text-[#11382e] rounded-md px-6 py-2.5 font-extrabold text-[13px] tracking-wide mb-8 shadow-sm text-center min-w-[240px]">
          {formattedTime} . {dateString}
       </div>
       
       <button 
         onClick={handleDone}
         className="bg-[#388e7b] hover:bg-[#2b6a5b] text-white font-extrabold text-[14px] px-10 py-2.5 rounded-[0.5rem] transition-colors shadow-md"
       >
         Done
       </button>
    </div>
  );
}

export default AppointmentRescheduled;
