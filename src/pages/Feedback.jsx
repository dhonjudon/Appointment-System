import React, { useState } from "react";

const StarRating = ({
  rating,
  setRating,
  readOnly = false,
  size = "w-5 h-5",
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && setRating && setRating(star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer"}`}
        >
          <svg
            className={`${size} ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const ProgressBar = ({ value, colorClass }) => (
  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
    <div
      className={`h-full ${colorClass} rounded-full`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

function Feedback() {
  const [ratings, setRatings] = useState({
    overall: 4,
    consultation: 4,
    waitTime: 3,
    staff: 4,
    booking: 3,
  });
  const [selectedTags, setSelectedTags] = useState([
    "Thorough Examination",
    "Clean facility",
  ]);
  const tags = [
    "Punctual Doctor",
    "Thorough Examination",
    "Friendly Staff",
    "Clean facility",
    "Easy Booking",
  ];

  const [recommendation, setRecommendation] = useState("Definitely Yes");
  const [feedbackText, setFeedbackText] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSubmit = () => {
    if (!feedbackText.trim()) return;

    const emojis = {
      "Definitely Yes": "🤩",
      "May Be": "🤔",
      "Not Sure": "😐",
      "Probably not": "😞",
    };

    const newReview = {
      id: Date.now(),
      text: feedbackText,
      emoji: emojis[recommendation],
      recommendation: recommendation,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      rating: ratings.overall,
    };

    setReviews([newReview, ...reviews]);
    setFeedbackText("");
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRatingChange = (key, val) => {
    setRatings({ ...ratings, [key]: val });
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#2d4159]">
            Feedback and Doctor Notes
          </h1>
          <p className="text-gray-500 text-sm">
            Review Your visit, read what your doctor noted, and share your
            experience
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-4">
            {/* Top Info Boxes */}
            <div className="flex gap-4">
              {/* Doctor's Note Box */}
              <div className="h-[108px] bg-white rounded-lg shadow-sm border border-[#388e7b]/30 p-4 flex-1 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#388e7b]"></div>
                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded bg-[#e3efeb] text-[#388e7b] flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Doctor's Note
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Diagnosis, suggestion & next steps
                  </p>
                </div>
                <div className="text-right flex flex-col justify-center h-full">
                  <div className="text-2xl font-bold text-[#388e7b]">3</div>
                  <div className="text-[11px] text-gray-500 tracking-tight">
                    visits noted
                  </div>
                </div>
              </div>

              {/* Rate your visit Box */}
              <div className="h-[108px] bg-white rounded-lg shadow-sm border border-[#e88134]/30 p-4 flex-1 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#e88134]"></div>
                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded bg-[#fdf2e9] text-[#e88134] flex items-center justify-center mb-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Rate your visit
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Help other by sharing your experience
                  </p>
                </div>
                <div className="text-right flex flex-col justify-center h-full">
                  <div className="text-2xl font-bold text-[#e88134]">4.7</div>
                  <div className="text-[11px] text-gray-500 tracking-tight">
                    avg rating
                  </div>
                </div>
              </div>
            </div>

            {/* Select Appointment */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[15px] mb-1">Select Appointment</h3>
              <p className="text-xs text-gray-500 mb-3">
                Which appointment are you reviewing?
              </p>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-200 rounded p-2.5 text-sm text-gray-700 outline-none focus:border-[#388e7b] bg-gray-50/50">
                  <option>
                    Dr. Pritam Shakya - Neurologist(March 24,2026)
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Rate Your Experience */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[15px] mb-1">
                Rate Your Experience
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Tap a star to rate each aspect
              </p>

              <div className="space-y-3">
                {[
                  { key: "overall", label: "Overall Experience" },
                  { key: "consultation", label: "Doctor's Consultation" },
                  { key: "waitTime", label: "Wait Time" },
                  { key: "staff", label: "staff behaviour" },
                  { key: "booking", label: "Booking Process" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between max-w-[400px]"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <StarRating
                      rating={ratings[item.key]}
                      setRating={(v) => handleRatingChange(item.key, v)}
                      size="w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* What stood out */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[15px] mb-1">What stood out?</h3>
              <p className="text-xs text-gray-500 mb-4">
                Select all that apply
              </p>
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      selectedTags.includes(tag)
                        ? "bg-[#388e7b] text-white border-[#388e7b]"
                        : "bg-[#eef2f5] text-gray-600 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Tell us more */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[15px] mb-1">Tell us more</h3>
              <p className="text-xs text-gray-500 mb-4">
                Share specific comments and suggestions
              </p>
              <textarea
                className="w-full bg-[#f2fcf7]/60 border border-gray-100 rounded p-3 text-sm placeholder-gray-400 outline-none focus:ring-1 focus:ring-[#388e7b] focus:border-[#388e7b] resize-none"
                rows="3"
                placeholder="write your specific feedback here"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>
            </div>

            {/* Recommend */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[15px] mb-1">
                Would you recommend Swastha Sewa?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Based on your whole experience
              </p>

              <div className="grid grid-cols-4 gap-3 mb-5">
                <button
                  onClick={() => setRecommendation("Definitely Yes")}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all bg-[#eef5fc] ${recommendation === "Definitely Yes" ? "border-2 border-blue-400" : "border border-[#a1bccc]"}`}
                >
                  <span className="text-3xl mb-1.5">🤩</span>
                  <span className="text-xs font-bold text-gray-700">
                    Definitely Yes
                  </span>
                </button>
                <button
                  onClick={() => setRecommendation("May Be")}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all bg-[#fdf9e6] ${recommendation === "May Be" ? "border-2 border-yellow-400" : "border border-[#ecca72]"}`}
                >
                  <span className="text-3xl mb-1.5">🤔</span>
                  <span className="text-xs font-bold text-gray-700">
                    May Be
                  </span>
                </button>
                <button
                  onClick={() => setRecommendation("Not Sure")}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all bg-[#fcf3fb] ${recommendation === "Not Sure" ? "border-2 border-purple-400" : "border border-[#dfa5d5]"}`}
                >
                  <span className="text-3xl mb-1.5">😐</span>
                  <span className="text-xs font-bold text-gray-700">
                    Not Sure
                  </span>
                </button>
                <button
                  onClick={() => setRecommendation("Probably not")}
                  className={`flex flex-col items-center justify-center py-4 rounded-lg transition-all bg-[#fbe9ec] ${recommendation === "Probably not" ? "border-2 border-red-400" : "border border-[#eba0a6]"}`}
                >
                  <span className="text-3xl mb-1.5">😞</span>
                  <span className="text-xs font-bold text-gray-700">
                    Probably not
                  </span>
                </button>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#388e7b] hover:bg-[#2c7564] text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* Top 1247 Box */}
            <div className="h-[108px] bg-white rounded-lg shadow-sm border border-[#2b688d]/30 p-4 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#2b688d]"></div>
              <div className="flex flex-col">
                <div className="w-8 h-8 rounded bg-[#e6eff5] text-[#2b688d] flex items-center justify-center mb-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h3 className="font-bold text-[#2b688d] text-[11px]">
                  Community Ratings
                </h3>
              </div>
              <div className="text-right flex flex-col justify-center h-full">
                <div className="text-[22px] font-bold text-[#2b688d] leading-none mb-0.5">
                  1247
                </div>
                <div className="text-[10px] text-gray-500">total reviews</div>
              </div>
            </div>

            {/* Community Ratings detailed */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-[15px] text-gray-800 mb-4">
                Community Ratings
              </h3>
              <div className="flex flex-col items-center mb-5">
                <h1 className="text-5xl font-extrabold text-[#388e7b] mb-2">
                  4.7
                </h1>
                <StarRating rating={5} readOnly={true} size="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <span className="w-4">5</span>
                  <svg
                    className="w-3 h-3 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <ProgressBar value={85} colorClass="bg-[#388e7b]" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <span className="w-4">4</span>
                  <svg
                    className="w-3 h-3 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <ProgressBar value={35} colorClass="bg-[#4bc0c0]" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <span className="w-4">3</span>
                  <svg
                    className="w-3 h-3 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <ProgressBar value={15} colorClass="bg-yellow-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <span className="w-4">2</span>
                  <svg
                    className="w-3 h-3 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <ProgressBar value={5} colorClass="bg-orange-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <span className="w-4">1</span>
                  <svg
                    className="w-3 h-3 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <ProgressBar value={2} colorClass="bg-red-500" />
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex-1 min-h-[150px] flex flex-col">
              <h3 className="font-bold text-[15px] text-gray-800 mb-4 shrink-0">
                Recent Reviews
              </h3>
              {reviews.length === 0 ? (
                <div className="w-full h-full min-h-[150px] bg-gray-50/50 rounded flex flex-1 items-center justify-center text-gray-400 text-sm">
                  No recent reviews
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 border border-gray-100 rounded-lg bg-gray-50/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{review.emoji}</span>
                          <div>
                            <p className="text-xs font-bold text-gray-700">
                              {review.recommendation}
                            </p>
                            <div className="flex items-center">
                              <StarRating
                                rating={review.rating}
                                readOnly={true}
                                size="w-3 h-3"
                              />
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-[#eaf7f2] rounded-lg shadow-sm border border-[#388e7b]/20 p-5">
              <div className="flex gap-2 items-start mb-3">
                <span className="text-yellow-500 text-lg">💡</span>
                <h3 className="font-bold text-[#388e7b] text-sm mt-0.5">
                  Tips for helpful review
                </h3>
              </div>
              <ul className="text-xs text-gray-700 space-y-2 ml-7 list-none font-medium">
                <li className="relative">
                  <span className="absolute -left-5 text-[#388e7b]">✔</span> Be
                  specific for what was helpful
                </li>
                <li className="relative">
                  <span className="absolute -left-5 text-[#388e7b]">✔</span>{" "}
                  Mention the doctor or staff by role
                </li>
                <li className="relative">
                  <span className="absolute -left-5 text-[#388e7b]">✔</span>{" "}
                  Keep it respectful and constructive
                </li>
                <li className="relative">
                  <span className="absolute -left-5 text-[#388e7b]">✔</span>{" "}
                  Avoid sharing personal health info
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
