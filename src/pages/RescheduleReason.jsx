import React from 'react';

function RescheduleReason({ selectedReason, setSelectedReason, reasons }) {
  return (
    <div className="w-full animate-fadeIn flex flex-col gap-4">
       <p className="text-gray-600 font-extrabold text-[14px]">Help us understand why you're rescheduling - this helps us prepare better for your visit</p>
       
       <div className="grid grid-cols-2 gap-4 mt-2">
         {reasons.map((reason, idx) => {
           const isSelected = selectedReason === reason;
           // Emulate empty placeholder buttons from mockup
           if (!reason) {
             return <div key={idx} className="border border-[#8ac9ba] rounded-md h-12 flex items-center px-4">
                <div className="w-4 h-4 rounded-full border border-[#a8cfc3]"></div>
             </div>;
           }
           return (
             <button 
               key={idx}
               onClick={() => setSelectedReason(reason)}
               className={`border rounded-md h-12 flex items-center px-4 gap-3 transition-colors ${
                 isSelected ? 'border-[#2b8871] bg-[#f4f9f7]' : 'border-[#8ac9ba] hover:bg-[#f8fbf9]'
               }`}
             >
               <div className="w-4 h-4 rounded-full flex items-center justify-center border border-[#8ac9ba]">
                 {isSelected && <div className="w-2.5 h-2.5 bg-[#2b8871] rounded-full"></div>}
               </div>
               <span className="font-extrabold text-[#11382e] text-[13px]">{reason}</span>
             </button>
           );
         })}
       </div>

       <div className="flex flex-col mt-4">
         <label className="text-gray-700 font-extrabold text-[12.5px] mb-2">Additional notes(optional)</label>
         <textarea 
           className="w-full border border-[#8ac9ba] rounded-lg p-4 outline-none focus:border-[#2b8871] text-[13px] text-gray-800 font-medium resize-none"
           rows="4"
           placeholder="Any details that helps us prepare...."
         ></textarea>
       </div>
    </div>
  );
}

export default RescheduleReason;
