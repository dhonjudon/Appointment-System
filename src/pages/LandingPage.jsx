import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight, Calendar, Clock, Phone, Mail, Navigation } from "lucide-react";
import logoImg from "../assets/logoimage.png";
import doctorImg from "../assets/doctor.png";
import aboutImg from "../assets/about swastha sewa.png";
import officeImg from "../assets/office img.png";
import landingHero from "../assets/landing-hero.png";
import { doctorData } from "../data/doctors";

const features = [
  {
    title: "Find Doctors Easily",
    description: "Browse top specialists and filter by expertise, hospital, or availability.",
    icon: "🔍",
  },
  {
    title: "Trusted Appointments",
    description: "Schedule appointments with verified doctors in just a few clicks.",
    icon: "⚡",
  },
  {
    title: "Secure Care",
    description: "Stay confident with clean patient flow and reliable confirmation details.",
    icon: "🔒",
  },
];

const heroImages = [
  'https://plus.unsplash.com/premium_photo-1665203619621-b0fd7ccb6244?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1674575272313-81c6d6e39341?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1758691461888-b74515208d7a?h=800&w=2232&auto=format&fit=crop&crop=top&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [activeNavLink, setActiveNavLink] = useState("home");
  const navLinksRef = useRef({});

  useEffect(() => {
    const activeLink = navLinksRef.current[activeNavLink];
    if (activeLink) {
      setUnderlineStyle({
        left: `${activeLink.offsetLeft}px`,
        width: `${activeLink.offsetWidth}px`,
      });
    }
  }, [activeNavLink]);

  const registerNavLink = (key, element) => {
    navLinksRef.current[key] = element;
  };

  const featuredDoctors = [
    {
      id: 1,
      name: 'Dr. Binita Sharma',
      specialty: 'Cardiologist',
      price: 'Rs. 500/consultation',
      image:
        'https://plus.unsplash.com/premium_photo-1682089874677-3eee554feb19?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 2,
      name: 'Dr. Suman Shrestha',
      specialty: 'Neurologist',
      price: 'Rs. 450/consultation',
      image:
        'https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&h=250&fit=crop&crop=top',
    },
    {
      id: 3,
      name: 'Dr. Sunita Poudel',
      specialty: 'Pediatrician',
      price: 'Rs. 400/consultation',
      image:
        'https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?h=400&w=350&fit=crop&crop=right&crop=top',
    },
    {
      id: 4,
      name: 'Dr. Deepak Bhattarai',
      specialty: 'Orthopedic Surgeon',
      price: 'Rs. 550/consultation',
      image:
        'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 5,
      name: 'Dr. Roshan Basnet',
      specialty: 'Dermatologist',
      price: 'Rs. 600/consultation',
      image:
        'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 6,
      name: 'Dr. Anisha Gurung',
      specialty: 'Psychiatrist',
      price: 'Rs. 400/consultation',
      image:
        'https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?h=300&w=400&fit=crop&crop=top&crop=right',
    },
    {
      id: 7,
      name: 'Dr. Sabina Karki',
      specialty: 'ENT Specialist',
      price: 'Rs. 650/consultation',
      image:
        'https://images.unsplash.com/photo-1659353888906-adb3e0041693?h=300&w=400&fit=crop&crop=top',
    },
    {
      id: 8,
      name: 'Dr. Arjun Lama',
      specialty: 'General Physician',
      price: 'Rs. 800/consultation',
      image:
        'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?h=400&w=400&fit=crop&crop=top',
    },
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return doctorData.filter((doctor) => {
      return [
        doctor.first_name,
        doctor.last_name,
        doctor.specialization_name,
        doctor.hospital,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  React.useEffect(() => {
    if (isPaused) return undefined;
    const interval = setInterval(() => {
      setActiveHeroIndex((value) => (value + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-900">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="Swastha Sewa Logo" className="h-12 w-auto" />
            <span className="font-bold text-lg text-emerald-700">Swastha Sewa</span>
          </Link>
          <div className="hidden md:flex items-center relative h-full">
            {/* Sliding Underline */}
            <div
              className="absolute bottom-0 h-[3px] bg-[#22c55e] transition-all duration-300 ease-in-out"
              style={underlineStyle}
            ></div>

            <div className="flex items-center gap-8 text-sm font-semibold text-gray-600">
              <Link
                ref={(el) => registerNavLink("home", el)}
                to="/"
                onClick={() => setActiveNavLink("home")}
                className="hover:text-emerald-700 transition py-2"
              >
                Home
              </Link>
              <a
                ref={(el) => registerNavLink("doctors", el)}
                href="#doctors"
                onClick={() => setActiveNavLink("doctors")}
                className="hover:text-emerald-700 transition py-2"
              >
                Doctors
              </a>
              <a
                ref={(el) => registerNavLink("about", el)}
                href="#about"
                onClick={() => setActiveNavLink("about")}
                className="hover:text-emerald-700 transition py-2"
              >
                About
              </a>
              <a
                ref={(el) => registerNavLink("contact", el)}
                href="#contact"
                onClick={() => setActiveNavLink("contact")}
                className="hover:text-emerald-700 transition py-2"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-full border border-emerald-500 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Navigation className="w-4 h-4" />
              Trusted specialists for your health journey
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Book a doctor appointment online with confidence.
              </h1>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-gray-600 leading-8">
                Explore top specialists, compare fees, and schedule your visit with the same trusted care system used by the appointment booking platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition"
              >
                Book Now
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
              >
                Login to continue
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white border border-emerald-100 p-6 shadow-sm">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Trusted Doctors</p>
                <p className="mt-3 text-3xl font-extrabold text-gray-900">24+</p>
                <p className="mt-2 text-sm text-gray-500">Available top specialists across multiple specialties.</p>
              </div>
              <div className="rounded-3xl bg-white border border-emerald-100 p-6 shadow-sm">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Fast Booking</p>
                <p className="mt-3 text-3xl font-extrabold text-gray-900">Seconds</p>
                <p className="mt-2 text-sm text-gray-500">Complete your appointment scheduling quickly and safely.</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-emerald-100 bg-white min-h-[420px]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-transparent" />
            <img
              src={doctorImg}
              alt="Landing hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <section id="doctors" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-14">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          {/* carousel moved below featured doctors */}
          <div className="bg-white px-6 py-10 sm:px-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured top doctors</h2>
                <p className="mt-3 text-gray-600 max-w-2xl">
                  These specialists are highlighted from the integrated booking system and available for fast appointment scheduling.
                </p>
              </div>
              <a
                href="#doctors"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
              >
                View all doctors
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {featuredDoctors.map((doctor) => (
                <div key={doctor.id} className="rounded-[1.5rem] overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{doctor.specialty}</p>
                    <p className="text-sm text-gray-600 mb-5">{doctor.price}</p>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      Login to book
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        className="relative h-[420px] bg-gray-200 mt-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {heroImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Hero ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              activeHeroIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      <section className="bg-emerald-50 py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl bg-white p-8 shadow-sm border border-emerald-100">
                <div className="text-4xl mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid xl:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.3em]">About Swastha Sewa</p>
            <h2 className="text-4xl font-bold text-gray-900">A booking system built for modern health care.</h2>
            <p className="text-gray-600 leading-8">
              Swastha Sewa connects you with trusted specialists across Nepal, offering simple appointment booking, clear pricing, and care coordination from your first click.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 border border-emerald-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Trusted care network</h3>
                <p className="text-gray-600 text-sm">Verified doctors from top hospitals and clinics are available across major specialties.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 border border-emerald-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Seamless booking</h3>
                <p className="text-gray-600 text-sm">Find specialists, book appointments, and manage visits from one secure health platform.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-emerald-100 shadow-lg h-80 sm:h-[420px]">
            <img
              src={aboutImg}
              alt="About Swastha Sewa"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-10 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.3em]">Contact</p>
                <h2 className="text-3xl font-bold text-gray-900">Need help with bookings or support?</h2>
                <p className="text-gray-600 leading-7">
                  Reach out any time for booking assistance, doctor recommendations, or general questions about the appointment flow.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Call our patient support team for quick booking help.</p>
                    <p className="mt-4 font-semibold text-emerald-700">01-746-483-23</p>
                    <p className="font-semibold text-emerald-700">01-974-475-10</p>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-semibold text-gray-900">Email</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Click the address below to open your email app instantly.</p>
                    <a
                      href="mailto:support@swasthasewa.com"
                      className="mt-4 inline-block font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      support@swasthasewa.com
                    </a>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-semibold text-gray-900">Office</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Visit our main healthcare center for in-person assistance.</p>
                    <p className="mt-4 font-semibold text-gray-900">Satdobato - 4, Lalitpur City</p>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-semibold text-gray-900">Hours</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Our care team is available throughout the week for appointment support.</p>
                    <p className="mt-4 font-semibold text-gray-900">Mon - Sat: 8am - 8pm</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] overflow-hidden bg-gray-100">
                <img src={officeImg} alt="Office" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p>© 2026 Swastha Sewa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
