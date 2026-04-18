import React from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';

function RescheduleDate({ setSelectedDate }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full animate-fadeIn">
      <div className="w-full max-w-sm ml-16">
        <InteractiveCalendar 
          isModal={true}
          onDateSelect={(date) => setSelectedDate(date)} 
        />
      </div>
    </div>
  );
}

export default RescheduleDate;
