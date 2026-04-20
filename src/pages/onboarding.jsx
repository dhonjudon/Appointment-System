// Onboarding.jsx
// Two-step post-registration flow to collect user profile and medical history
// Step 1: Personal information (name, DOB, address, contact)
// Step 2: Medical history (allergies, conditions, medications, surgeries)
// Uses decorative left panel design with form fields on the right

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  User,
  Calendar,
  Droplets,
  Phone,
  MapPin,
  AlertTriangle,
  Pill,
  Stethoscope,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import logoImg from "../assets/logoimage.png";

const API = "http://localhost:3000/api";

// Get authenticated user from localStorage
const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

// Available blood groups for selection
const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
// Gender options
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

// Utility: join classnames, filtering falsy values
const cx = (...args) => args.filter(Boolean).join(" ");

// Base input CSS classes with error state handling
const inputCls = (hasError) =>
  cx(
    "w-full px-4 py-3 rounded-xl border text-gray-800 text-sm placeholder-gray-400 bg-white",
    "focus:outline-none focus:ring-2 transition-all duration-150",
    hasError
      ? "border-red-300 focus:ring-red-100 focus:border-red-400"
      : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500",
  );

export default function Onboarding() {
  const navigate = useNavigate();
  const user = getUser();

  // Wizard state: tracks current step (1 or 2)
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null); // { type, msg }

  // Step 1: Personal profile form fields
  const [profile, setProfile] = useState({
    user_id: user.id || "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    blood_group: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  // Step 2: Medical history form fields
  const [medical, setMedical] = useState({
    allergies: "",
    chronic_conditions: "",
    current_medications: "",
    surgeries: "",
    family_history: "",
    notes: "",
    is_visible_to_doctors: false,
  });

  // Helper: create onChange handlers for profile fields
  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  // Helper: create onChange handlers for medical fields
  const setM = (k) => (e) => setMedical((m) => ({ ...m, [k]: e.target.value }));

  // Show toast notification for 3.5 seconds then auto-dismiss
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Validate step 1 required fields
  const validateStep1 = () => {
    const e = {};
    if (!profile.first_name.trim()) e.first_name = "Required";
    if (!profile.last_name.trim()) e.last_name = "Required";
    if (!profile.date_of_birth) e.date_of_birth = "Required";
    if (!profile.gender) e.gender = "Required";
    if (!profile.phone.trim()) e.phone = "Required";
    if (!profile.address_line1.trim()) e.address_line1 = "Required";
    if (!profile.city.trim()) e.city = "Required";
    if (!profile.country.trim()) e.country = "Required";
    if (!profile.blood_group) e.blood_group = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  // Validate step 2 required fields
  const validateStep2 = () => {
    const e = {};
    if (!medical.allergies.trim()) e.allergies = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  // Save profile and move to step 2
  const handleStep1Next = async () => {
    if (!validateStep1()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      // POST profile to API with JWT auth
      await axios.post(`${API}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStep(2);
      setErrors({});
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Save medical history and redirect to dashboard
  const handleStep2Submit = async () => {
    if (!validateStep2()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      // POST medical history to API with JWT auth
      await axios.post(
        `${API}/medical-history`,
        { user_id: profile.user_id, ...medical },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast("success", "All done! Redirecting to your dashboard…");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to save medical history.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen flex bg-emerald-50"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Decorative left panel with emerald gradient and circles */}
      {/*
        Fixed height = 100vh, overflow hidden, no scroll.
        Uses sticky to stay in place while the right panel scrolls.
      */}
      <aside className="hidden lg:flex lg:w-[40%] xl:w-[36%] h-screen sticky top-0 overflow-hidden flex-col  bg-gradient-to-b from-emerald-300 to-[#0d3d30] ">
        {/* Radial mesh gradient overlay */}
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 25%, #1d6b50 0%, transparent 55%)," +
              "radial-gradient(ellipse at 80% 75%, #0a2e22 0%, transparent 55%)," +
              "#0d3d30",
          }}
        /> */}
        {/* Decorative rings */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/5" />
        <div className="absolute -top-8  -right-8  w-52 h-52 rounded-full border border-white/5" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full border border-white/5" />
        <div className="absolute bottom-24 right-8 w-28 h-28 rounded-full bg-emerald-500/10" />
        {/* Content sits on top of the decorations */}
        <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-12">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-start mb-10">
              <img src={logoImg} alt="logo" className="h-[4.5rem]" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Swastha Sewa
            </span>
          </div>

          {/* Hero copy — centred vertically */}
          <div className="my-auto">
            <p className="text-[#0d3d30] text-xs font-bold tracking-[0.2em] uppercase mb-5">
              Welcome aboard
            </p>
            <h1
              className="text-white font-bold leading-[1.15] mb-5"
              style={{ fontSize: "clamp(1.9rem, 2.8vw, 2.7rem)" }}
            >
              Your health journey{" "}
              <span className="text-[#0d3d30]">starts here.</span>
            </h1>
            <p className="text-emerald-200/60 text-sm leading-relaxed max-w-xs">
              Complete your profile in two quick steps and unlock personalised
              care from world-class doctors.
            </p>

            {/* Step progress cards */}
            <div className="mt-10 space-y-3">
              {[
                {
                  n: 1,
                  label: "Personal Information",
                  sub: "Tell us about yourself",
                  icon: User,
                },
                {
                  n: 2,
                  label: "Medical History",
                  sub: "Help doctors help you",
                  icon: Stethoscope,
                },
              ].map(({ n, label, sub, icon: Icon }) => (
                <div
                  key={n}
                  className={cx(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-500",
                    step === n
                      ? "bg-white/10 border-white/20"
                      : step > n
                        ? "opacity-50 border-transparent"
                        : "opacity-30 border-transparent",
                  )}
                >
                  {/* Step number / checkmark */}
                  <div
                    className={cx(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all",
                      step > n
                        ? "bg-emerald-500 text-white"
                        : step === n
                          ? "bg-white text-emerald-800"
                          : "bg-white/20 text-white/50",
                    )}
                  >
                    {step > n ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      n
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{label}</p>
                    <p className="text-emerald-300/60 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer security note */}
          <div className="flex items-center gap-2 mt-auto">
            <Shield className="w-3.5 h-3.5 text-emerald-500/60" />
            <p className="text-[#0d3d30]/50 text-xs">
              Your data is encrypted and never shared without consent.
            </p>
          </div>
        </div>
      </aside>

      {/* Right panel with form fields */}
      <main className="flex-1 overflow-y-auto bg-white">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-[#0d3d30] px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">Swastha Sewa</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-emerald-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-700 ease-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {/* Toast notification */}
        {toast && (
          <div
            className={cx(
              "fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5",
              "rounded-2xl shadow-2xl text-sm font-semibold",
              "animate-[slideInRight_0.3s_ease]",
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-500 text-white",
            )}
          >
            {toast.type === "success" ? (
              <Check className="w-4 h-4" strokeWidth={3} />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {toast.msg}
          </div>
        )}

        {/* Form container */}
        <div className="max-w-2xl mx-auto px-6 sm:px-10 py-10">
          {/* Step heading */}
          <div className="mb-8">
            <span className="text-emerald-600 text-[11px] font-bold tracking-[0.2em] uppercase">
              Step {step} of 2
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              {step === 1 ? "Personal Information" : "Medical History"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {step === 1
                ? "Fields marked * are required."
                : "Help us provide better care — * fields are required."}
            </p>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-7" key="step1">
              {/* Name */}
              <Section icon={<User className="w-4 h-4" />} label="Full Name">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name *" error={errors.first_name}>
                    <input
                      value={profile.first_name}
                      onChange={setP("first_name")}
                      placeholder="John"
                      className={inputCls(errors.first_name)}
                    />
                  </Field>
                  <Field label="Last Name *" error={errors.last_name}>
                    <input
                      value={profile.last_name}
                      onChange={setP("last_name")}
                      placeholder="Doe"
                      className={inputCls(errors.last_name)}
                    />
                  </Field>
                </div>
              </Section>

              {/* Personal details */}
              <Section
                icon={<Calendar className="w-4 h-4" />}
                label="Personal Details"
              >
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Date of Birth *" error={errors.date_of_birth}>
                    <input
                      type="date"
                      value={profile.date_of_birth}
                      onChange={setP("date_of_birth")}
                      className={inputCls(errors.date_of_birth)}
                    />
                  </Field>
                  <Field label="Gender *" error={errors.gender}>
                    <select
                      value={profile.gender}
                      onChange={setP("gender")}
                      className={inputCls(errors.gender)}
                    >
                      <option value="">Select</option>
                      {GENDERS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Blood Group *" error={errors.blood_group}>
                    <select
                      value={profile.blood_group}
                      onChange={setP("blood_group")}
                      className={inputCls(errors.blood_group)}
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Section>

              {/* Contact */}
              <Section icon={<Phone className="w-4 h-4" />} label="Contact">
                <Field label="Phone Number *" error={errors.phone}>
                  <input
                    value={profile.phone}
                    onChange={setP("phone")}
                    placeholder="+977 98XXXXXXXX"
                    className={inputCls(errors.phone)}
                  />
                </Field>
              </Section>

              {/* Address */}
              <Section icon={<MapPin className="w-4 h-4" />} label="Address">
                <div className="space-y-4">
                  <Field label="Address Line 1 *" error={errors.address_line1}>
                    <input
                      value={profile.address_line1}
                      onChange={setP("address_line1")}
                      placeholder="Street address"
                      className={inputCls(errors.address_line1)}
                    />
                  </Field>
                  <Field label="Address Line 2">
                    <input
                      value={profile.address_line2}
                      onChange={setP("address_line2")}
                      placeholder="Apartment, floor (optional)"
                      className={inputCls()}
                    />
                  </Field>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="City *" error={errors.city}>
                      <input
                        value={profile.city}
                        onChange={setP("city")}
                        placeholder="Kathmandu"
                        className={inputCls(errors.city)}
                      />
                    </Field>
                    <Field label="State">
                      <input
                        value={profile.state}
                        onChange={setP("state")}
                        placeholder="Bagmati"
                        className={inputCls()}
                      />
                    </Field>
                    <Field label="Country *" error={errors.country}>
                      <input
                        value={profile.country}
                        onChange={setP("country")}
                        placeholder="Nepal"
                        className={inputCls(errors.country)}
                      />
                    </Field>
                  </div>
                  <div className="sm:w-1/3">
                    <Field label="Postal Code">
                      <input
                        value={profile.postal_code}
                        onChange={setP("postal_code")}
                        placeholder="44600"
                        className={inputCls()}
                      />
                    </Field>
                  </div>
                </div>
              </Section>

              {/* Emergency contact */}
              <Section
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Emergency Contact"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Contact Name">
                    <input
                      value={profile.emergency_contact_name}
                      onChange={setP("emergency_contact_name")}
                      placeholder="Jane Doe"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Contact Phone">
                    <input
                      value={profile.emergency_contact_phone}
                      onChange={setP("emergency_contact_phone")}
                      placeholder="+977 98XXXXXXXX"
                      className={inputCls()}
                    />
                  </Field>
                </div>
              </Section>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-6" key="step2">
              {/* Visibility toggle — required */}
              <div className="flex items-start justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      Share with Doctors *
                    </p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      Allow your treating doctors to view this history for
                      better care. You can change this anytime from your
                      profile.
                    </p>
                  </div>
                </div>
                {/* Custom toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setMedical((m) => ({
                      ...m,
                      is_visible_to_doctors: !m.is_visible_to_doctors,
                    }))
                  }
                  className={cx(
                    "relative shrink-0 w-12 h-6 rounded-full transition-all duration-300",
                    medical.is_visible_to_doctors
                      ? "bg-emerald-500"
                      : "bg-gray-300",
                  )}
                >
                  <span
                    className={cx(
                      "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300",
                      medical.is_visible_to_doctors ? "left-7" : "left-1",
                    )}
                  />
                </button>
              </div>

              {/* Allergies — required */}
              <Field
                label="Allergies *"
                error={errors.allergies}
                icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
              >
                <textarea
                  rows={3}
                  value={medical.allergies}
                  onChange={setM("allergies")}
                  placeholder="e.g. Penicillin, Peanuts, Dust mites…"
                  className={cx(inputCls(errors.allergies), "resize-none")}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Chronic Conditions"
                  icon={<Stethoscope className="w-4 h-4 text-emerald-500" />}
                >
                  <textarea
                    rows={3}
                    value={medical.chronic_conditions}
                    onChange={setM("chronic_conditions")}
                    placeholder="e.g. Diabetes Type 2, Hypertension…"
                    className={cx(inputCls(), "resize-none")}
                  />
                </Field>
                <Field
                  label="Current Medications"
                  icon={<Pill className="w-4 h-4 text-emerald-500" />}
                >
                  <textarea
                    rows={3}
                    value={medical.current_medications}
                    onChange={setM("current_medications")}
                    placeholder="e.g. Metformin 500mg daily…"
                    className={cx(inputCls(), "resize-none")}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Past Surgeries"
                  icon={<FileText className="w-4 h-4 text-emerald-500" />}
                >
                  <textarea
                    rows={3}
                    value={medical.surgeries}
                    onChange={setM("surgeries")}
                    placeholder="e.g. Appendectomy 2018…"
                    className={cx(inputCls(), "resize-none")}
                  />
                </Field>
                <Field
                  label="Family Medical History"
                  icon={<Heart className="w-4 h-4 text-emerald-500" />}
                >
                  <textarea
                    rows={3}
                    value={medical.family_history}
                    onChange={setM("family_history")}
                    placeholder="e.g. Heart disease — father…"
                    className={cx(inputCls(), "resize-none")}
                  />
                </Field>
              </div>

              <Field label="Additional Notes">
                <textarea
                  rows={3}
                  value={medical.notes}
                  onChange={setM("notes")}
                  placeholder="Anything else your doctor should know…"
                  className={cx(inputCls(), "resize-none")}
                />
              </Field>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            {step === 2 ? (
              <button
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={step === 1 ? handleStep1Next : handleStep2Submit}
              disabled={saving}
              className={cx(
                "flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white",
                "bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all",
                "shadow-lg shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </>
              ) : step === 1 ? (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Complete Setup <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Visually groups form fields under a labelled section header */
function Section({ icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-emerald-500">{icon}</span>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Wraps a single input/textarea with a label and optional error message */
function Field({ label, error, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {icon && <span className="shrink-0">{icon}</span>}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
