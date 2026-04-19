import React, { useState } from 'react';
import RescheduleDate from './RescheduleDate.jsx';
import RescheduleTime from './RescheduleTime.jsx';
import RescheduleReason from './RescheduleReason.jsx';
import RescheduleConfirm from './RescheduleConfirm.jsx';
import AppointmentRescheduled from './AppointmentRescheduled.jsx';

function RescheduleModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  
  // Data blocks
  const times = {
    MORNING: ['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '8:00 AM', '8:30 AM', '10:00 AM', '10:30 AM'],
    AFTERNOON: ['12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], 
    EVENING: ['4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'] 
  };

  const reasons = [
    "Schedule Conflict", "Health condition changed",
    "Travel Plans", "family emergency",
    "Doctor Advised", "work commitments",
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else setStep(5); // Transition to success step 5!
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className={`bg-white rounded-[1.2rem] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col pt-6 transition-all duration-300 border border-gray-100 ${step === 5 ? 'max-w-[450px] pb-6' : 'max-w-[650px] pb-24'}`}>
        
        {/* Header - hide on step 5 */}
        {step !== 5 && (
          <div className="flex justify-between items-center px-8 pb-4 border-b border-[#a8cfc3]">
            <h2 className="text-[1.35rem] font-serif font-extrabold text-gray-900 tracking-tight">
               Reschedule Appointment
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Stepper - hide on step 5 */}
        {step !== 5 && (
          <div className="px-8 py-8 flex items-center justify-between relative mx-auto w-full max-w-[85%]">
             {/* Connecting Line Base */}
             <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-gray-200 -z-10 translate-y-[-14px]"></div>
             {/* Connecting Line Active */}
             <div className="absolute top-1/2 left-8 h-[2px] bg-[#2b8871] -z-10 translate-y-[-14px] transition-all duration-300" style={{ width: `${(step - 1) * 33.33}%` }}></div>

             {/* Step 1 */}
             <div className="flex flex-col items-center gap-2 bg-white px-2">
               <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${step > 1 ? 'bg-[#2b8871] text-white' : step === 1 ? 'bg-[#2b8871] text-white' : 'bg-gray-300 text-white'}`}>
                  {step > 1 ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : '1'}
               </div>
               <span className={`text-[11px] font-extrabold tracking-wider ${step >= 1 ? 'text-[#2b8871]' : 'text-gray-400'}`}>DATE</span>
             </div>

             {/* Step 2 */}
             <div className="flex flex-col items-center gap-2 bg-white px-2">
               <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${step > 2 ? 'bg-[#2b8871] text-white' : step === 2 ? 'bg-[#2b8871] text-white' : 'bg-[#eaf4f1] text-[#2b8871]'}`}>
                  {step > 2 ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : '2'}
               </div>
               <span className={`text-[11px] font-extrabold tracking-wider ${step >= 2 ? 'text-[#2b8871]' : 'text-[#8ccbb8]'}`}>TIME</span>
             </div>

             {/* Step 3 */}
             <div className="flex flex-col items-center gap-2 bg-white px-2">
               <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${step > 3 ? 'bg-[#2b8871] text-white' : step === 3 ? 'bg-[#2b8871] text-white' : 'bg-[#eaf4f1] text-[#2b8871]'}`}>
                  {step > 3 ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : '3'}
               </div>
               <span className={`text-[11px] font-extrabold tracking-wider ${step >= 3 ? 'text-[#2b8871]' : 'text-[#8ccbb8]'}`}>REASON</span>
             </div>

             {/* Step 4 */}
             <div className="flex flex-col items-center gap-2 bg-white px-2">
               <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${step === 4 ? 'bg-[#2b8871] text-white' : 'bg-[#eaf4f1] text-[#2b8871]'}`}>4</div>
               <span className={`text-[11px] font-extrabold tracking-wider ${step >= 4 ? 'text-[#2b8871]' : 'text-[#8ccbb8]'}`}>CONFIRM</span>
             </div>
          </div>
        )}

        {/* Dynamic Content Area */}
        <div className="flex-1 px-8 pb-4 overflow-x-hidden">
          {step === 1 && <RescheduleDate setSelectedDate={setSelectedDate} />}
          {step === 2 && <RescheduleTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} times={times} />}
          {step === 3 && <RescheduleReason selectedReason={selectedReason} setSelectedReason={setSelectedReason} reasons={reasons} />}
          {step === 4 && (
  <RescheduleConfirm 
    selectedDate={selectedDate}
    selectedTime={selectedTime}
    selectedReason={selectedReason}
  />
)}
          {step === 5 && <AppointmentRescheduled selectedTime={selectedTime} selectedDate={selectedDate} onClose={onClose} />}
        </div>

        {/* Footer actions - hide on step 5 */}
        {step !== 5 && (
          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between mt-auto mx-auto border-t border-transparent pt-4 bg-white px-2 z-10">
             {step > 1 ? (
               <button onClick={handleBack} className="text-gray-900 font-extrabold text-[13px] hover:underline">
                 Back
               </button>
             ) : (
               <div></div> 
             )}

             <div className="flex gap-4">
               <button 
                 onClick={onClose}
                 className="px-6 py-2.5 rounded-lg border border-[#2b8871] text-[#2b8871] font-bold text-[13px] hover:bg-[#f0f7f5] transition">
                 Cancel
               </button>
               
               {step === 1 && (
                 <button 
                   onClick={handleNext}
                   className={`px-5 py-2.5 rounded-lg text-white font-extrabold text-[13px] transition ${selectedDate ? 'bg-[#2b8871] hover:bg-[#1a5b4b]' : 'bg-gray-400 cursor-not-allowed'}`}>
                   Choose Date
                 </button>
               )}

               {step === 2 && (
                 <button 
                   onClick={handleNext}
                   className={`px-5 py-2.5 rounded-lg text-white font-extrabold text-[13px] transition ${selectedTime ? 'bg-[#2b8871] hover:bg-[#1a5b4b] shadow-[0_4px_12px_rgba(43,136,113,0.3)]' : 'bg-gray-400 cursor-not-allowed'}`}>
                   Choose Time
                 </button>
               )}

               {step === 3 && (
                 <button 
                   onClick={handleNext}
                   className={`px-5 py-2.5 rounded-lg text-white font-extrabold text-[13px] transition ${selectedReason ? 'bg-[#2b8871] hover:bg-[#1a5b4b] shadow-[0_4px_12px_rgba(43,136,113,0.3)]' : 'bg-gray-400 cursor-not-allowed'}`}>
                   Pick a reason
                 </button>
               )}

               {step === 4 && (
                 <button 
                   onClick={handleNext}
                   className={`px-5 py-2.5 rounded-lg text-white font-extrabold text-[13px] transition bg-[#2b8871] hover:bg-[#1a5b4b] shadow-[0_4px_12px_rgba(43,136,113,0.3)]`}>
                   Confirm Reschedule
                 </button>
               )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RescheduleModal;
