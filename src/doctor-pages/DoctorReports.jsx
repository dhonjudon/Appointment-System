import React, { useState } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';

const StarRating = ({ rating, size = "w-5 h-5" }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ProgressBar = ({ value, colorClass }) => (
  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${value}%` }}></div>
  </div>
);

function DoctorReports() {
  const reviews = [
    {
      id: 1,
      patientName: 'Sarah Patel',
      date: 'May 18, 2026',
      rating: 5,
      recommendation: 'Definitely Yes',
      emoji: '🤩',
      text: 'Dr. Sharma is incredibly knowledgeable and took the time to answer all my questions. I felt very well cared for during my visit.',
      tags: ['Thorough Examination', 'Friendly Staff']
    },
    {
      id: 2,
      patientName: 'Rahul Kumar',
      date: 'May 15, 2026',
      rating: 4,
      recommendation: 'Definitely Yes',
      emoji: '🤩',
      text: 'Great experience overall. The wait time was a little long, but the consultation was excellent and the doctor was very polite.',
      tags: ['Punctual Doctor', 'Clean facility']
    },
    {
      id: 3,
      patientName: 'Anita Nair',
      date: 'May 10, 2026',
      rating: 3,
      recommendation: 'May Be',
      emoji: '🤔',
      text: 'The facility was nice but the booking process was a bit confusing. The doctor was okay.',
      tags: ['Clean facility']
    }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-b from-emerald-50 to-white font-sans overflow-hidden">
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-[72px] bg-transparent px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] text-gray-500 font-semibold mb-0.5">Good Morning,</p>
              <h4 className="text-[14px] font-extrabold text-gray-800 leading-none">Dr. Sharma</h4>
            </div>
            <img src="https://ui-avatars.com/api/?name=Dr+Sharma&background=1b6a55&color=fff&size=40" alt="Dr. Sharma" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Patient Reports & Feedback</h1>
                <p className="text-gray-500 font-semibold text-sm">View ratings and reviews submitted by your patients</p>
              </div>
              <button className="bg-white border-2 border-[#1b6a55] text-[#1b6a55] font-extrabold text-[13px] px-5 py-2.5 rounded-xl hover:bg-[#1b6a55] hover:text-white transition shadow-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export PDF
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Analytics Column */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Overall Rating Box */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                   <h3 className="font-extrabold text-gray-800 text-[15px] mb-4 self-start">Overall Rating</h3>
                   <h1 className="text-6xl font-black text-[#1b6a55] mb-2">4.7</h1>
                   <StarRating rating={5} size="w-7 h-7 mb-2" />
                   <p className="text-gray-500 font-bold text-[13px]">Based on 1247 reviews</p>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                   <h3 className="font-extrabold text-gray-800 text-[15px] mb-5">Rating Distribution</h3>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[13px] text-gray-700 font-extrabold">
                        <span className="w-3">5</span>
                        <StarRating rating={1} size="w-3.5 h-3.5 text-yellow-400" />
                        <ProgressBar value={85} colorClass="bg-[#1b6a55]" />
                        <span className="w-8 text-right text-gray-500">85%</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-gray-700 font-extrabold">
                        <span className="w-3">4</span>
                        <StarRating rating={1} size="w-3.5 h-3.5 text-yellow-400" />
                        <ProgressBar value={35} colorClass="bg-[#4bc0c0]" />
                        <span className="w-8 text-right text-gray-500">35%</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-gray-700 font-extrabold">
                        <span className="w-3">3</span>
                        <StarRating rating={1} size="w-3.5 h-3.5 text-yellow-400" />
                        <ProgressBar value={15} colorClass="bg-yellow-400" />
                        <span className="w-8 text-right text-gray-500">15%</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-gray-700 font-extrabold">
                        <span className="w-3">2</span>
                        <StarRating rating={1} size="w-3.5 h-3.5 text-yellow-400" />
                        <ProgressBar value={5} colorClass="bg-orange-400" />
                        <span className="w-8 text-right text-gray-500">5%</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-gray-700 font-extrabold">
                        <span className="w-3">1</span>
                        <StarRating rating={1} size="w-3.5 h-3.5 text-yellow-400" />
                        <ProgressBar value={2} colorClass="bg-red-500" />
                        <span className="w-8 text-right text-gray-500">2%</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Reviews List Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="font-extrabold text-gray-800 text-[17px]">Recent Reviews</h3>
                    <select className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/20">
                      <option>Newest First</option>
                      <option>Highest Rated</option>
                      <option>Lowest Rated</option>
                    </select>
                  </div>
                  
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[#1b6a55] text-white flex items-center justify-center font-extrabold text-[13px]">
                               {review.patientName.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div>
                               <h4 className="font-extrabold text-gray-800 text-[14px]">{review.patientName}</h4>
                               <div className="flex items-center gap-2 mt-1">
                                 <StarRating rating={review.rating} size="w-3.5 h-3.5" />
                                 <span className="text-[11px] font-bold text-gray-400">{review.date}</span>
                               </div>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-2xl" title={review.recommendation}>{review.emoji}</span>
                            <span className="text-[10px] font-bold text-gray-400 mt-1">{review.recommendation}</span>
                          </div>
                        </div>
                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-3">"{review.text}"</p>
                        
                        {review.tags && review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.tags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[10px] font-extrabold text-[#1b6a55]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-extrabold text-gray-700 transition">
                    Load More Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorReports;
