// import React, { useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const steps = [
//   { id: 1, key: "date", label: "Date" },
//   { id: 2, key: "time", label: "Time" },
//   { id: 3, key: "bio", label: "Details" },
//   { id: 4, key: "payment", label: "Payment" },
// ];

// const slotOptions = [
//   "07:00",
//   "07:15",
//   "07:30",
//   "07:45",
//   "08:30",
//   "08:45",
//   "09:15",
//   "09:45",
//   "10:00",
//   "10:30",
//   "11:00",
//   "11:15",
//   "11:30",
//   "11:45",
// ];

// const appointmentTypes = [
//   "Follow-up",
//   "Consultation",
//   "Check-up",
//   "Emergency",
//   "Lab Results Review",
//   "Other",
// ];

// const formatWeekday = (date) =>
//   date.toLocaleDateString("en-US", { weekday: "short" });

// const formatMonthDay = (date) =>
//   date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

// const getDayLabel = (date, index) => {
//   if (index === 0) return "Today";
//   if (index === 1) return "Tomorrow";
//   return date.toLocaleDateString("en-US", { weekday: "short" });
// };

// function BookAppointment() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { doctor } = location.state || {};

//   const [weekOffset, setWeekOffset] = useState(0);
//   const [showAllSlots, setShowAllSlots] = useState(false);

//   const upcomingDates = useMemo(() => {
//     const now = new Date();
//     return Array.from({ length: 7 }, (_, i) => {
//       const d = new Date(now);
//       d.setDate(now.getDate() + i + weekOffset * 7);
//       return d;
//     });
//   }, [weekOffset]);

//   const [currentStep, setCurrentStep] = useState(0);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [bioData, setBioData] = useState({
//     appointmentType: "",
//     description: "",
//   });
//   const [paymentData, setPaymentData] = useState({
//     method: "card",
//     cardName: "",
//     cardNumber: "",
//     expiry: "",
//     cvv: "",
//   });

//   // Initialize selected date once
//   React.useEffect(() => {
//     if (!selectedDate && upcomingDates.length > 0) {
//       setSelectedDate(upcomingDates[0]);
//     }
//   }, [upcomingDates, selectedDate]);

//   const visibleSlots = showAllSlots ? slotOptions : slotOptions.slice(0, 12);
//   const hiddenSlotsCount = slotOptions.length - 12;

//   if (!doctor) {
//     return (
//       <div className="h-screen overflow-hidden bg-linear-to-b from-emerald-50 to-white flex items-center justify-center">
//         <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg shadow-emerald-50">
//           <h2 className="mb-2 text-xl font-bold text-gray-800">
//             No Doctor Selected
//           </h2>
//           <p className="mb-6 text-sm text-gray-500">
//             Please open a doctor profile and click Book Now to continue.
//           </p>
//           <Link
//             to="/doctors"
//             className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
//           >
//             Browse Doctors
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const initials = doctor.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2);

//   const canProceed = () => {
//     if (currentStep === 0) return Boolean(selectedDate);
//     if (currentStep === 1) return Boolean(selectedTime);
//     if (currentStep === 2) {
//       return bioData.appointmentType.trim() && bioData.description.trim();
//     }
//     if (currentStep === 3) {
//       if (paymentData.method !== "card") return true;
//       return (
//         paymentData.cardName.trim() &&
//         paymentData.cardNumber.trim().length >= 12 &&
//         paymentData.expiry.trim().length >= 4 &&
//         paymentData.cvv.trim().length >= 3
//       );
//     }
//     return false;
//   };

//   const goNext = () => {
//     if (!canProceed()) return;
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//       return;
//     }
//     navigate("/appointment");
//   };

//   const goBack = () => {
//     if (currentStep === 0) {
//       navigate(`/doctors/${doctor.id}`);
//       return;
//     }
//     setCurrentStep((prev) => prev - 1);
//   };

//   return (
//     <div className="h-screen overflow-hidden bg-linear-to-b from-emerald-50 to-white flex">
//       <div className="w-80 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto">
//         <div className="p-8">
//           <div className="mb-10">
//             <h2 className="text-3xl font-extrabold text-emerald-700 tracking-tight">
//               MicroLab
//             </h2>
//           </div>

//           <div className="space-y-2">
//             {steps.map((step, index) => {
//               const isDone = index < currentStep;
//               const isActive = index === currentStep;

//               return (
//                 <div key={step.key} className="relative pb-5">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
//                         isDone || isActive
//                           ? "border-emerald-500 bg-emerald-500 text-white"
//                           : "border-emerald-200 bg-white text-emerald-400"
//                       }`}
//                     >
//                       {isDone ? (
//                         <svg
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={2.5}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       ) : (
//                         step.id
//                       )}
//                     </div>
//                     <p
//                       className={`text-2xl font-semibold ${
//                         isDone || isActive ? "text-gray-800" : "text-gray-400"
//                       }`}
//                     >
//                       {step.label}
//                     </p>
//                   </div>
//                   {index < steps.length - 1 && (
//                     <div
//                       className={`absolute left-4 top-9 h-7 w-0.5 ${
//                         isDone ? "bg-emerald-500" : "bg-emerald-100"
//                       }`}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
//             <div className="mb-3 flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white">
//                 {initials}
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-gray-800">
//                   {doctor.name}
//                 </p>
//                 <p className="text-xs text-emerald-700">{doctor.specialty}</p>
//               </div>
//             </div>
//             <div className="text-xs text-gray-600">
//               Fee:{" "}
//               <span className="font-semibold text-emerald-700">
//                 ${doctor.consultationFee}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 h-screen overflow-y-auto px-6 py-8 lg:px-10">
//         <div className="mx-auto max-w-4xl">
//           <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
//             <div className="mb-8 flex items-center justify-between gap-3">
//               <h1 className="text-3xl font-bold text-gray-800">
//                 Select Date and Time
//               </h1>
//               {selectedDate && (
//                 <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const newDate = new Date(selectedDate);
//                       newDate.setMonth(newDate.getMonth() - 1);
//                       const today = new Date();
//                       today.setHours(0, 0, 0, 0);
//                       if (newDate >= today) {
//                         setSelectedDate(newDate);
//                       }
//                     }}
//                     className="text-gray-500 hover:text-emerald-600 transition"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 19l-7-7 7-7"
//                       />
//                     </svg>
//                   </button>
//                   <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
//                     {selectedDate.toLocaleDateString("en-US", {
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const newDate = new Date(selectedDate);
//                       newDate.setMonth(newDate.getMonth() + 1);
//                       setSelectedDate(newDate);
//                     }}
//                     className="text-gray-500 hover:text-emerald-600 transition"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>

//             {currentStep === 0 && (
//               <div>
//                 <div className="flex items-center gap-2 mb-6">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setWeekOffset((prev) => Math.max(0, prev - 1))
//                     }
//                     disabled={weekOffset === 0}
//                     className={`p-2 rounded-lg transition ${
//                       weekOffset === 0
//                         ? "text-gray-300 cursor-not-allowed"
//                         : "text-gray-500 hover:bg-gray-100"
//                     }`}
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 19l-7-7 7-7"
//                       />
//                     </svg>
//                   </button>
//                   <div className="flex-1 grid grid-cols-7 gap-2">
//                     {upcomingDates.map((date, index) => {
//                       const active =
//                         selectedDate?.toDateString() === date.toDateString();
//                       const dayLabel = getDayLabel(
//                         date,
//                         index + weekOffset * 7,
//                       );
//                       return (
//                         <button
//                           key={date.toISOString()}
//                           type="button"
//                           onClick={() => setSelectedDate(date)}
//                           className={`rounded-xl py-3 text-center transition-all ${
//                             active
//                               ? "bg-white border-2 border-emerald-500 shadow-sm"
//                               : "hover:bg-gray-50"
//                           }`}
//                         >
//                           <p
//                             className={`text-xs font-medium ${
//                               active ? "text-emerald-600" : "text-gray-500"
//                             }`}
//                           >
//                             {dayLabel}
//                           </p>
//                           <p
//                             className={`mt-1 text-2xl font-bold ${
//                               active ? "text-gray-900" : "text-gray-700"
//                             }`}
//                           >
//                             {date.getDate()}
//                           </p>
//                         </button>
//                       );
//                     })}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => setWeekOffset((prev) => prev + 1)}
//                     className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </div>

//                 {selectedDate && (
//                   <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
//                     <p className="text-sm text-gray-500">Currently Selected:</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <svg
//                         className="w-4 h-4 text-gray-400"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       <p className="text-sm font-medium text-gray-800">
//                         {selectedDate.toLocaleDateString("en-US", {
//                           weekday: "long",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {currentStep === 1 && (
//               <div>
//                 <p className="mb-4 text-base text-gray-600">
//                   Choose a time for{" "}
//                   {selectedDate && formatMonthDay(selectedDate)}
//                 </p>
//                 <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
//                   {visibleSlots.map((slot) => {
//                     const isActive = selectedTime === slot;
//                     return (
//                       <button
//                         key={slot}
//                         type="button"
//                         onClick={() => setSelectedTime(slot)}
//                         className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
//                           isActive
//                             ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100"
//                             : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
//                         }`}
//                       >
//                         {slot}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {!showAllSlots && hiddenSlotsCount > 0 && (
//                   <button
//                     type="button"
//                     onClick={() => setShowAllSlots(true)}
//                     className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
//                   >
//                     Show more slots
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                     <span className="text-gray-500 ml-1">
//                       ({hiddenSlotsCount} available)
//                     </span>
//                   </button>
//                 )}

//                 {selectedDate && selectedTime && (
//                   <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
//                     <p className="text-sm text-gray-500">Currently Selected:</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <svg
//                         className="w-4 h-4 text-gray-400"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       <p className="text-sm font-medium text-gray-800">
//                         {selectedDate.toLocaleDateString("en-US", {
//                           weekday: "long",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                         , {selectedTime} -{" "}
//                         {(() => {
//                           const [hours, minutes] = selectedTime
//                             .split(":")
//                             .map(Number);
//                           const endMinutes = minutes + 30;
//                           const endHours = hours + Math.floor(endMinutes / 60);
//                           const finalMinutes = endMinutes % 60;
//                           return `${String(endHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}`;
//                         })()}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-6">
//                 <div>
//                   <label className="mb-3 block text-sm font-medium text-gray-700">
//                     What is the purpose of your visit?
//                   </label>
//                   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//                     {appointmentTypes.map((type) => {
//                       const isActive = bioData.appointmentType === type;
//                       return (
//                         <button
//                           key={type}
//                           type="button"
//                           onClick={() =>
//                             setBioData((prev) => ({
//                               ...prev,
//                               appointmentType: type,
//                             }))
//                           }
//                           className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
//                             isActive
//                               ? "border-emerald-500 bg-emerald-50 text-emerald-700"
//                               : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
//                           }`}
//                         >
//                           {type}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">
//                     Please describe briefly why you are scheduling this
//                     appointment
//                   </label>
//                   <textarea
//                     rows={5}
//                     value={bioData.description}
//                     onChange={(e) =>
//                       setBioData((prev) => ({
//                         ...prev,
//                         description: e.target.value,
//                       }))
//                     }
//                     placeholder="E.g., I've been experiencing headaches for the past week and would like to get it checked..."
//                     className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
//                   />
//                 </div>

//                 {selectedDate && selectedTime && (
//                   <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
//                     <p className="text-sm text-gray-500">Currently Selected:</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <svg
//                         className="w-4 h-4 text-gray-400"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       <p className="text-sm font-medium text-gray-800">
//                         {selectedDate.toLocaleDateString("en-US", {
//                           weekday: "long",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                         , {selectedTime}
//                         {bioData.appointmentType &&
//                           ` • ${bioData.appointmentType}`}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-5">
//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setPaymentData((prev) => ({ ...prev, method: "card" }))
//                     }
//                     className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
//                       paymentData.method === "card"
//                         ? "border-emerald-500 bg-emerald-50 text-emerald-700"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
//                     }`}
//                   >
//                     Card
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setPaymentData((prev) => ({ ...prev, method: "upi" }))
//                     }
//                     className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
//                       paymentData.method === "upi"
//                         ? "border-emerald-500 bg-emerald-50 text-emerald-700"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
//                     }`}
//                   >
//                     UPI
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setPaymentData((prev) => ({ ...prev, method: "cash" }))
//                     }
//                     className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
//                       paymentData.method === "cash"
//                         ? "border-emerald-500 bg-emerald-50 text-emerald-700"
//                         : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
//                     }`}
//                   >
//                     Cash at Clinic
//                   </button>
//                 </div>

//                 {paymentData.method === "card" && (
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <div className="md:col-span-2">
//                       <label className="mb-2 block text-sm font-medium text-gray-700">
//                         Name on Card
//                       </label>
//                       <input
//                         type="text"
//                         value={paymentData.cardName}
//                         onChange={(e) =>
//                           setPaymentData((prev) => ({
//                             ...prev,
//                             cardName: e.target.value,
//                           }))
//                         }
//                         className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="mb-2 block text-sm font-medium text-gray-700">
//                         Card Number
//                       </label>
//                       <input
//                         type="text"
//                         value={paymentData.cardNumber}
//                         onChange={(e) =>
//                           setPaymentData((prev) => ({
//                             ...prev,
//                             cardNumber: e.target.value,
//                           }))
//                         }
//                         placeholder="1234 5678 9012 3456"
//                         className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-2 block text-sm font-medium text-gray-700">
//                         Expiry
//                       </label>
//                       <input
//                         type="text"
//                         value={paymentData.expiry}
//                         onChange={(e) =>
//                           setPaymentData((prev) => ({
//                             ...prev,
//                             expiry: e.target.value,
//                           }))
//                         }
//                         placeholder="MM/YY"
//                         className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-2 block text-sm font-medium text-gray-700">
//                         CVV
//                       </label>
//                       <input
//                         type="password"
//                         value={paymentData.cvv}
//                         onChange={(e) =>
//                           setPaymentData((prev) => ({
//                             ...prev,
//                             cvv: e.target.value,
//                           }))
//                         }
//                         placeholder="123"
//                         className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-gray-700">
//                   <p className="font-medium text-gray-800">Review</p>
//                   <p className="mt-1">
//                     {selectedDate?.toLocaleDateString("en-US", {
//                       weekday: "long",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                     {", "}
//                     {selectedTime}
//                     {bioData.appointmentType && ` • ${bioData.appointmentType}`}
//                   </p>
//                   <p className="mt-1">
//                     Amount to pay: ${doctor.consultationFee}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={goBack}
//               className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               onClick={goNext}
//               disabled={!canProceed()}
//               className={`rounded-xl px-10 py-3 text-base font-semibold transition-all ${
//                 canProceed()
//                   ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 hover:bg-emerald-600"
//                   : "bg-gray-200 text-gray-400 cursor-not-allowed"
//               }`}
//             >
//               {currentStep === steps.length - 1 ? "Confirm Booking" : "Next"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BookAppointment;

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000/api";

const steps = [
  { id: 1, key: "date", label: "Date" },
  { id: 2, key: "time", label: "Time" },
  { id: 3, key: "bio", label: "Details" },
  { id: 4, key: "payment", label: "Payment" },
];

const appointmentTypes = [
  "Follow-up",
  "Consultation",
  "Check-up",
  "Emergency",
  "Lab Results Review",
  "Other",
];

// ── helpers ──────────────────────────────────────────────────────────────────

const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
};

const addMinutes = (timeStr, mins) => {
  const [h, m] = timeStr.slice(0, 5).split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * Given a schedule (start_time, end_time, slot_duration_minutes)
 * and a list of already-booked slots, generate available time slots.
 */
const generateAvailableSlots = (schedules, bookedSlots) => {
  const slots = [];

  for (const sched of schedules) {
    const duration = sched.slot_duration_minutes || 30;
    let current = sched.start_time.slice(0, 5); // "HH:MM"
    const end = sched.end_time.slice(0, 5);

    while (current < end) {
      const next = addMinutes(current, duration);
      if (next > end) break;

      // Check overlap with booked slots
      const isBooked = bookedSlots.some((b) => {
        const bs = b.start_time.slice(0, 5);
        const be = b.end_time.slice(0, 5);
        return !(next <= bs || current >= be);
      });

      if (!isBooked) {
        slots.push({
          start: current,
          end: next,
          schedule_id: sched.id,
          hospital_id: sched.hospital_id,
        });
      }
      current = next;
    }
  }

  return slots;
};

const getDayLabel = (date, index) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

// ── component ────────────────────────────────────────────────────────────────

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor } = location.state || {};

  const [weekOffset, setWeekOffset] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // { start, end, schedule_id, hospital_id }

  const [availableSlots, setAvailableSlots] = useState([]);
  const [scheduleSource, setScheduleSource] = useState(null); // 'day' | 'date' | null
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const [bioData, setBioData] = useState({
    appointmentType: "",
    description: "",
  });
  const [paymentData, setPaymentData] = useState({
    method: "card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // ── upcoming dates strip ──
  const upcomingDates = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + i + weekOffset * 7);
      return d;
    });
  }, [weekOffset]);

  // Default select today on mount
  useEffect(() => {
    if (!selectedDate && upcomingDates.length > 0) {
      setSelectedDate(upcomingDates[0]);
    }
  }, [upcomingDates, selectedDate]);

  // ── fetch available slots whenever date changes ──
  const fetchSlots = useCallback(
    async (date) => {
      if (!doctor || !date) return;
      setLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);
      setAvailableSlots([]);
      setScheduleSource(null);

      try {
        const iso = toISODate(date);
        const res = await fetch(
          `${API_BASE}/doctors/${doctor.id}/schedules?date=${iso}`,
        );
        if (!res.ok) throw new Error("Failed to fetch schedules");
        const data = await res.json();

        const { schedules = [], booked_slots = [], source } = data.data || {};
        setScheduleSource(source);

        if (schedules.length === 0) {
          setAvailableSlots([]);
          setLoadingSlots(false);
          return;
        }

        const slots = generateAvailableSlots(schedules, booked_slots);
        setAvailableSlots(slots);
      } catch (err) {
        setSlotsError(err.message);
      } finally {
        setLoadingSlots(false);
      }
    },
    [doctor],
  );

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  // ── navigation guards ──
  const canProceed = () => {
    if (currentStep === 0) return Boolean(selectedDate);
    if (currentStep === 1) return Boolean(selectedSlot);
    if (currentStep === 2)
      return bioData.appointmentType.trim() && bioData.description.trim();
    if (currentStep === 3) {
      if (paymentData.method !== "card") return true;
      return (
        paymentData.cardName.trim() &&
        paymentData.cardNumber.replace(/\s/g, "").length >= 12 &&
        paymentData.expiry.trim().length >= 4 &&
        paymentData.cvv.trim().length >= 3
      );
    }
    return false;
  };

  // ── book via API on final confirm ──
  const confirmBooking = async () => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!userId) {
      setBookingError("You must be logged in to book an appointment.");
      return;
    }

    setBooking(true);
    setBookingError(null);

    try {
      const iso = toISODate(selectedDate);
      const body = {
        user_id: parseInt(userId),
        doctor_id: doctor.id,
        schedule_id: selectedSlot.schedule_id,
        hospital_id: selectedSlot.hospital_id || null,
        appointment_date: iso,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        reason: `${bioData.appointmentType}: ${bioData.description}`,
      };

      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      navigate("/appointment", {
        state: { appointment: data.data, doctor },
      });
    } catch (err) {
      setBookingError(err.message);
      setBooking(false);
    }
  };

  const goNext = () => {
    if (!canProceed()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((p) => p + 1);
      return;
    }
    confirmBooking();
  };

  const goBack = () => {
    if (currentStep === 0) {
      navigate(`/doctors/${doctor.id}`);
      return;
    }
    setCurrentStep((p) => p - 1);
  };

  // ── early exit ──
  if (!doctor) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg shadow-emerald-50">
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            No Doctor Selected
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Please open a doctor profile and click Book Now to continue.
          </p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Browse Doctors
          </Link>
        </div>
      </div>
    );
  }

  const initials = (doctor.name || "D")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ── render ──
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-emerald-50 to-white flex">
      {/* ── Sidebar stepper ── */}
      <div className="w-80 shrink-0 bg-white border-r border-emerald-100 h-screen overflow-y-auto">
        <div className="p-8">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-emerald-700 tracking-tight">
              MicroLab
            </h2>
          </div>

          <div className="space-y-2">
            {steps.map((step, index) => {
              const isDone = index < currentStep;
              const isActive = index === currentStep;
              return (
                <div key={step.key} className="relative pb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                        isDone || isActive
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-emerald-200 bg-white text-emerald-400"
                      }`}
                    >
                      {isDone ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <p
                      className={`text-2xl font-semibold ${isDone || isActive ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-9 h-7 w-0.5 ${isDone ? "bg-emerald-500" : "bg-emerald-100"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Doctor card */}
          <div className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {doctor.name}
                </p>
                <p className="text-xs text-emerald-700">{doctor.specialty}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Fee:{" "}
              <span className="font-semibold text-emerald-700">
                ${doctor.consultationFee}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 h-screen overflow-y-auto px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
            {/* ── Step 0: Date ── */}
            {currentStep === 0 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                  Select a Date
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
                    disabled={weekOffset === 0}
                    className={`p-2 rounded-lg transition ${
                      weekOffset === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronIcon dir="left" />
                  </button>
                  <div className="flex-1 grid grid-cols-7 gap-2">
                    {upcomingDates.map((date, index) => {
                      const active =
                        selectedDate?.toDateString() === date.toDateString();
                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`rounded-xl py-3 text-center transition-all ${
                            active
                              ? "bg-white border-2 border-emerald-500 shadow-sm"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <p
                            className={`text-xs font-medium ${active ? "text-emerald-600" : "text-gray-500"}`}
                          >
                            {getDayLabel(date, index + weekOffset * 7)}
                          </p>
                          <p
                            className={`mt-1 text-2xl font-bold ${active ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {date.getDate()}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((p) => p + 1)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                  >
                    <ChevronIcon dir="right" />
                  </button>
                </div>

                {selectedDate && (
                  <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Selected:</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 1: Time ── */}
            {currentStep === 1 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Select a Time
                </h1>
                <p className="mb-6 text-base text-gray-500">
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  {scheduleSource === "date" && (
                    <span className="ml-2 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                      Date override active
                    </span>
                  )}
                </p>

                {loadingSlots && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-10 justify-center">
                    <svg
                      className="animate-spin w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Loading available slots…
                  </div>
                )}

                {!loadingSlots && slotsError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {slotsError}
                  </div>
                )}

                {!loadingSlots &&
                  !slotsError &&
                  availableSlots.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        No available slots on this date.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        The doctor has not set up availability for this day.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(0)}
                        className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                      >
                        ← Pick another date
                      </button>
                    </div>
                  )}

                {!loadingSlots && availableSlots.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {availableSlots.map((slot, i) => {
                      const isActive =
                        selectedSlot?.start === slot.start &&
                        selectedSlot?.schedule_id === slot.schedule_id;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all text-center ${
                            isActive
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100"
                              : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <div className="font-semibold">
                            {fmtTime(slot.start)}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${isActive ? "text-emerald-100" : "text-gray-400"}`}
                          >
                            → {fmtTime(slot.end)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedSlot && (
                  <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Selected:</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      {", "}
                      {fmtTime(selectedSlot.start)} –{" "}
                      {fmtTime(selectedSlot.end)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Details ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  Appointment Details
                </h1>
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Purpose of visit
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {appointmentTypes.map((type) => {
                      const isActive = bioData.appointmentType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setBioData((p) => ({ ...p, appointmentType: type }))
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                            isActive
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Describe your concern briefly
                  </label>
                  <textarea
                    rows={5}
                    value={bioData.description}
                    onChange={(e) =>
                      setBioData((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="E.g., I've been experiencing headaches for the past week…"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                  />
                </div>

                <SelectedSummary
                  date={selectedDate}
                  slot={selectedSlot}
                  extra={
                    bioData.appointmentType
                      ? ` • ${bioData.appointmentType}`
                      : ""
                  }
                />
              </div>
            )}

            {/* ── Step 3: Payment ── */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h1 className="text-3xl font-bold text-gray-800">Payment</h1>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {["card", "upi", "cash"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setPaymentData((p) => ({ ...p, method: m }))
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition capitalize ${
                        paymentData.method === m
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                      }`}
                    >
                      {m === "card"
                        ? "Card"
                        : m === "upi"
                          ? "UPI"
                          : "Cash at Clinic"}
                    </button>
                  ))}
                </div>

                {paymentData.method === "card" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) =>
                          setPaymentData((p) => ({
                            ...p,
                            cardName: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) =>
                          setPaymentData((p) => ({
                            ...p,
                            cardNumber: e.target.value,
                          }))
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiry}
                        onChange={(e) =>
                          setPaymentData((p) => ({
                            ...p,
                            expiry: e.target.value,
                          }))
                        }
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData((p) => ({ ...p, cvv: e.target.value }))
                        }
                        placeholder="123"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-800 mb-1">
                    Booking Summary
                  </p>
                  <p>
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    {selectedSlot &&
                      `, ${fmtTime(selectedSlot.start)} – ${fmtTime(selectedSlot.end)}`}
                    {bioData.appointmentType && ` • ${bioData.appointmentType}`}
                  </p>
                  <p className="mt-1">
                    Fee:{" "}
                    <span className="font-semibold text-emerald-700">
                      ${doctor.consultationFee}
                    </span>
                  </p>
                </div>

                {bookingError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {bookingError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed() || booking}
              className={`rounded-xl px-10 py-3 text-base font-semibold transition-all flex items-center gap-2 ${
                canProceed() && !booking
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-100 hover:bg-emerald-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {booking && (
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {currentStep === steps.length - 1 ? "Confirm Booking" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── small helpers ──

function ChevronIcon({ dir }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

function SelectedSummary({ date, slot, extra = "" }) {
  if (!date) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm text-gray-500">Currently Selected:</p>
      <p className="text-sm font-medium text-gray-800 mt-1">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        {slot && `, ${fmtTime(slot.start)} – ${fmtTime(slot.end)}`}
        {extra}
      </p>
    </div>
  );
}

export default BookAppointment;