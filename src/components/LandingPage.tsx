import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronRight, X, Calendar, Clock } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const heroImages = [
    'https://plus.unsplash.com/premium_photo-1665203619621-b0fd7ccb6244?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1674575272313-81c6d6e39341?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1758691461888-b74515208d7a?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Sample doctors data
  const doctors = [
    {
      id: 1,
      name: 'Dr. Binita Sharma',
      specialty: 'Cardiologist',
      price: 'Rs. 500/consultation',
      image: 'https://plus.unsplash.com/premium_photo-1682089874677-3eee554feb19?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 2,
      name: 'Dr. Suman Shrestha',
      specialty: 'Neurologist',
      price: 'Rs. 450/consultation',
      image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&h=250&fit=crop&crop=top',
    },
    {
      id: 3,
      name: 'Dr. Sunita Poudel',
      specialty: 'Pediatrician',
      price: 'Rs. 400/consultation',
      image: 'https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?h=400&w=350&fit=crop&crop=right&crop=top',
    },
    {
      id: 4,
      name: 'Dr. Deepak Bhattarai',
      specialty: 'Orthopedist',
      price: 'Rs.550/consultation',
      image: 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 5,
      name: 'Dr. Roshan Basnet',
      specialty: 'Dermatologist',
      price: 'Rs. 600/consultation',
      image: 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?h=300&w=400&&fit=crop&crop=top',
    },
    {
      id: 6,
      name: 'Dr. Anisha Gurung',
      specialty: 'Psychiatrist',
      price: 'Rs. 400/consultation',
      image: 'https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?h=300&w=400&fit=crop&crop=top&crop=right',
    },
    {
      id: 7,
      name: 'Dr. Sabina Karki',
      specialty: 'Oncologist',
      price: 'Rs. 650/consultation',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 8,
      name: 'Dr. Arjun Lama',
      specialty: 'Dentist',
      price: 'Rs. 800/consultation',
      image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?h=400&w=400&fit=crop&crop=top',
    }
  ];

  const features = [
    {
      title: 'Find Doctors Easily',
      description: 'Browse through our extensive network of verified doctors across all specialties',
      icon: '🔍',
    },
    {
      title: 'Instant Booking',
      description: 'Book appointments with just a few clicks and get instant confirmation',
      icon: '⚡',
    },
    {
      title: 'Secure Records',
      description: 'Your medical records are encrypted and securely stored for your protection',
      icon: '🔒',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-600">Swastha Sewa</h1>
            </div>

            {/* Nav Links - Hidden on mobile */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
                Home
              </a>
              <a href="#doctors" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
                Doctors
              </a>
              <a href="#contact" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
                Contact
              </a>
              <a href="#about" className="text-gray-800 hover:text-green-600 transition-colors duration-200">
                About
              </a>
            </div>

            {/* Login Button */}
            <button 
              onClick={() => {
                setIsModalOpen(true);
                setIsLogin(true);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium">
              Login/Signup
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Book Your Doctor Appointment Online
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Connect with experienced healthcare professionals at your convenience. Easy scheduling, secure video consultations, and complete peace of mind.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
                
                {/* Search Results Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-40 max-h-80 overflow-y-auto">
                    {doctors
                      .filter(doc =>
                        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setShowBookingDetails(true);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                        >
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                            <p className="text-sm text-gray-500">{doc.specialty}</p>
                          </div>
                          <span className="text-green-600 font-semibold text-sm">{doc.price}</span>
                        </button>
                      ))}
                    {searchQuery && doctors.filter(doc =>
                      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No doctors found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-medium">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => {
                setIsModalOpen(true);
                setIsLogin(false);
              }}
              className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg inline-flex items-center gap-2 group">
              Book Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="hidden md:block">
            <div className="rounded-2xl shadow-lg overflow-hidden md:min-h-[520px]">
              <div
                className="flex h-[520px] transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeHeroIndex * 100}%)` }}
              >
                {heroImages.map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    src={src}
                    alt={`Doctor appointment illustration ${index + 1}`}
                    className="flex-none w-full h-full object-cover"
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveHeroIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                    activeHeroIndex === index ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Show hero image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-green-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Our platform provides a seamless healthcare experience with top-quality services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS SECTION */}
      <section id="doctors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Top Doctors</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Meet our highly qualified and experienced doctors ready to help you
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200"
            >
              {/* Doctor Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{doctor.specialty}</p>

                {/* Price */}
                <p className="text-green-600 font-semibold mb-4">{doctor.price}</p>

                {/* Book Button */}
                <button 
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowBookingDetails(true);
                  }}
                  className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="hidden md:block rounded-2xl shadow-lg overflow-hidden">
            <img
              src="/images/logo.png"
              alt="About Swastha Sewa"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Swastha Sewa</h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Swastha Sewa is a modern healthcare platform dedicated to making quality medical services accessible to everyone. We believe healthcare shouldn't be complicated or time-consuming.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-green-600 text-2xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Trusted Doctors</h3>
                  <p className="text-gray-500">All our doctors are verified, experienced professionals dedicated to your health.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-green-600 text-2xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Easy Access</h3>
                  <p className="text-gray-500">Book appointments anytime, anywhere with just a few clicks on your device.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 text-green-600 text-2xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Secure & Private</h3>
                  <p className="text-gray-500">Your medical data is encrypted and protected with industry-leading security standards.</p>
                </div>
              </div>
            </div>

            <button className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium inline-flex items-center gap-2 group">
              Learn More
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-blue-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
              <p className="text-gray-500 text-lg max-w-2xl mb-8">
                Need help with booking, patient support, or general enquiries? Our care team is here to assist you.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Phone</h3>
                  <p className="text-gray-500">Call our support line for immediate assistance.</p>
                  <p className="mt-4 font-semibold text-green-600"> 01- 746 483 23 </p>
                  <p className="mt-4 font-semibold text-green-600"> 01- 974 475 10 </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Email</h3>
                  <p className="text-gray-500">Send us your questions or appointment requests by email.</p>
                  <button
                    onClick={() => setIsEmailPopupOpen(true)}
                    className="mt-4 text-left font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    support@swasthasewa.com
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Office</h3>
                  <p className="text-gray-500">Visit us at our main healthcare center.</p>
                  <p className="mt-4 font-semibold text-gray-800">Satdobato - 4, Lalitpur City</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Hours</h3>
                  <p className="text-gray-500">Our care team is available to support your needs.</p>
                  <p className="mt-4 font-semibold text-gray-800">Mon - Sat: 8am - 8pm</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow-2xl overflow-hidden bg-white">
              <img
                src="https://plus.unsplash.com/premium_photo-1723629715874-1881d24380c1?h=600&w=900&fit=crop"
                alt="Contact support"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Health Journey Today</h2>
              <p className="text-green-50 text-lg mb-8 leading-relaxed">
                Take the first step towards better health. Book an appointment with our trusted doctors and get personalized care from the comfort of your home.
              </p>
              <button className="bg-white text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-200 font-semibold text-lg inline-flex items-center gap-2 group">
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Right - Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/virtual.jpg"
                alt="Virtual doctor appointment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-green-50">Happy Patients</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-green-50">Verified Doctors</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-green-50">Available Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2">© 2024 Swastha Sewa. All rights reserved.</p>
          <p className="text-sm">Healthcare at your fingertips - Book with confidence</p>
        </div>
      </footer>

      {/* BOOKING DETAILS MODAL */}
      {showBookingDetails && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Confirm Your Appointment</h2>
              <button
                onClick={() => {
                  setShowBookingDetails(false);
                  setSelectedDoctor(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Doctor Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedDoctor.name}</h3>
                  <p className="text-gray-500">{selectedDoctor.specialty}</p>
                  <p className="text-green-600 font-semibold mt-2">{selectedDoctor.price}</p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Tomorrow', 'Day after', 'Next Week'].map((date, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`py-2 px-3 rounded-lg font-medium transition-all ${
                        selectedDate === date
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'].map((time, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => {
                  setShowBookingDetails(false);
                  setIsModalOpen(true);
                  setIsLogin(false);
                }}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL POPUP MODAL */}
      {isEmailPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Send Us an Email</h2>
              <button
                onClick={() => setIsEmailPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Appointment request"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us what you need help with..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <button
                onClick={() => {
                  setIsEmailPopupOpen(false);
                  setContactName('');
                  setContactSubject('');
                  setContactMessage('');
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN/SIGNUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isLogin ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm mb-6">Sign in to access your appointments</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium">
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm mb-6">Sign up to book your first appointment</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium">
                    Create Account
                  </button>
                </div>
              )}

              {/* Toggle Between Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmail('');
                      setPassword('');
                    }}
                    className="text-green-600 font-semibold hover:text-green-700"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
