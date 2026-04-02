import React, { useState } from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';

function RescheduleModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);

  // Quick helper to move to next step
  const handleChooseTime = () => {
    if (selectedDate) {
      setStep(2); // Proceeding further is mocked for now
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-t-xl rounded-b-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col pt-6 pb-20">
        
        {/* Header */}
        <h2 className="text-2xl font-serif font-extrabold text-gray-900 px-8 pb-4 border-b-2 border-[#a8cfc3]">
           Reschedule Appointment
        </h2>
        
        {/* Stepper */}
        <div className="px-8 py-8 flex items-center justify-between relative max-w-[85%] mx-auto w-full">
           {/* Connecting Line */}
           <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-200 -z-10 translate-y-[-14px]"></div>
           <div className="absolute top-1/2 left-8 h-0.5 bg-[#2b8871] -z-10 translate-y-[-14px]" style={{ width: `${(step - 1) * 33}%` }}></div>

           {/* Step 1 */}
           <div className="flex flex-col items-center gap-2 bg-white px-2">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 1 ? 'bg-[#2b8871]' : 'bg-gray-300'}`}>1</div>
             <span className={`text-[12px] font-extrabold tracking-wider ${step >= 1 ? 'text-[#2b8871]' : 'text-gray-400'}`}>DATE</span>
           </div>

           {/* Step 2 */}
           <div className="flex flex-col items-center gap-2 bg-white px-2">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step >= 2 ? 'bg-[#2b8871]' : 'bg-[#eaf4f1] text-[#2b8871]'}`}>2</div>
             <span className={`text-[12px] font-extrabold tracking-wider ${step >= 2 ? 'text-[#2b8871]' : 'text-[#8ccbb8]'}`}>TIME</span>
           </div>

           {/* Step 3 */}
           <div className="flex flex-col items-center gap-2 bg-white px-2">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-[#eaf4f1] text-[#2b8871]`}>3</div>
             <span className={`text-[12px] font-extrabold tracking-wider text-[#8ccbb8]`}>REASON</span>
           </div>

           {/* Step 4 */}
           <div className="flex flex-col items-center gap-2 bg-white px-2">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-[#eaf4f1] text-[#2b8871]`}>4</div>
             <span className={`text-[12px] font-extrabold tracking-wider text-[#8ccbb8]`}>CONFIRM</span>
           </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 px-8 lg:px-16 pb-4">
          
          {step === 1 && (
             <div className="w-full max-w-sm mx-auto animate-fadeIn">
               {/* Embed InteractiveCalendar and style it as a card */}
               <InteractiveCalendar 
                 isModal={true}
                 onDateSelect={(date) => setSelectedDate(date)} 
               />
             </div>
          )}

          {step > 1 && (
             <div className="w-full text-center py-20 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800">Step {step} placeholder</h3>
                <p className="text-gray-500 mt-2">The frontend logic proceeds from here.</p>
             </div>
          )}

        </div>

        {/* Footer actions fixed at bottom right inside modal */}
        <div className="absolute bottom-6 right-8 flex gap-4">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 rounded-md border border-[#2b8871] text-[#2b8871] font-bold text-sm hover:bg-[#f0f7f5] transition">
             Cancel
           </button>
           <button 
             onClick={handleChooseTime}
             className={`px-6 py-2.5 rounded-md text-white font-bold text-sm transition ${selectedDate ? 'bg-[#2b8871] hover:bg-[#1a5b4b]' : 'bg-gray-400 cursor-not-allowed'}`}>
             Choose Time
           </button>
        </div>

      </div>
    </div>
  );
}

export default RescheduleModal;
