// Profile.jsx
// User profile management with two tabs: Personal Info and Medical History
// Features: edit profile, update medical history, control doctor visibility, logout

/**
 * User profile management page — two-tab layout.
 *
 * Tabs:
 *   1. Personal Info  → PUT /api/profile/:userId
 *   2. Medical History → PUT /api/medical-history/:userId
 *                        PATCH /api/medical-history/:userId/visibility
 *
 * Extra:
 *   - Logout button clears localStorage and redirects to /login
 *   - All API calls include JWT Bearer token
 *   - Skeleton loaders while fetching
 *
 * Theme: white + emerald-50 — consistent with DoctorsList / Appointments.
 * All icons from lucide-react.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import {
  User,
  Calendar,
  Droplets,
  Phone,
  MapPin,
  AlertTriangle,
  Pill,
  Stethoscope,
  FileText,
  Heart,
  Eye,
  EyeOff,
  Check,
  Loader2,
  LogOut,
  Shield,
  Mail,
  BadgeCheck,
} from "lucide-react";

const API = "http://localhost:3000/api";

// Utility: join classnames, filter falsy values
const cx = (...a) => a.filter(Boolean).join(" ");
// Get user from localStorage
const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
// Get JWT token from localStorage
const getToken = () => localStorage.getItem("token") || "";

// Axios instance with JWT Bearer token for authenticated requests
const authAxios = () =>
  axios.create({ headers: { Authorization: `Bearer ${getToken()}` } });

// Blood group options
const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
// Gender options
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

// Tab configuration
const TABS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "medical", label: "Medical History", icon: Stethoscope },
];

// Input CSS classes with error state handling
const iCls = (hasError) =>
  cx(
    "w-full px-4 py-3 rounded-xl border text-gray-800 text-sm placeholder-gray-300 bg-white",
    "focus:outline-none focus:ring-2 transition-all duration-150",
    hasError
      ? "border-red-300 focus:ring-red-100 focus:border-red-400"
      : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500",
  );

// Main component: user profile management with two tabs
export default function Profile() {
  const navigate = useNavigate();
  const user = getUser();
  const userId = user.id;

  // Tab and loading state
  const [activeTab, setActiveTab] = useState("personal");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMedical, setLoadingMedical] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Personal profile form fields
  const [profile, setProfile] = useState({
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
    email: "",
    role: "",
  });

  // Medical history form fields
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

  // Toast notification with auto-dismiss
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch user profile on mount
  useEffect(() => {
    if (!userId) return;
    authAxios()
      .get(`${API}/profile/${userId}`)
      .then(({ data }) => {
        const d = data.data;
        // Populate profile form with fetched data
        setProfile({
          first_name: d.first_name || "",
          last_name: d.last_name || "",
          date_of_birth: d.date_of_birth?.split("T")[0] || "",
          gender: d.gender || "",
          phone: d.phone || "",
          address_line1: d.address_line1 || "",
          address_line2: d.address_line2 || "",
          city: d.city || "",
          state: d.state || "",
          country: d.country || "",
          postal_code: d.postal_code || "",
          blood_group: d.blood_group || "",
          emergency_contact_name: d.emergency_contact_name || "",
          emergency_contact_phone: d.emergency_contact_phone || "",
          email: d.email || user.email || "",
          role: d.role || user.role || "user",
        });
      })
      .catch(() => showToast("error", "Could not load profile."))
      .finally(() => setLoadingProfile(false));
  }, [userId]);

  // Fetch medical history on mount (404 is acceptable — user may not have one yet)
  useEffect(() => {
    if (!userId) return;
    authAxios()
      .get(`${API}/medical-history/${userId}`)
      .then(({ data }) => {
        const d = data.data;
        // Populate medical form with fetched data
        setMedical({
          allergies: d.allergies || "",
          chronic_conditions: d.chronic_conditions || "",
          current_medications: d.current_medications || "",
          surgeries: d.surgeries || "",
          family_history: d.family_history || "",
          notes: d.notes || "",
          is_visible_to_doctors: d.is_visible_to_doctors || false,
        });
      })
      .catch(() => {
        /* No medical history yet — silently ignore 404 */
      })
      .finally(() => setLoadingMedical(false));
  }, [userId]);

  // Validate personal profile form
  const validatePersonal = () => {
    const e = {};
    if (!profile.first_name.trim()) e.first_name = "Required";
    if (!profile.last_name.trim()) e.last_name = "Required";
    if (!profile.phone.trim()) e.phone = "Required";
    if (!profile.city.trim()) e.city = "Required";
    if (!profile.country.trim()) e.country = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  // Save personal profile to API
  const handleSavePersonal = async () => {
    if (!validatePersonal()) return;
    setSavingPersonal(true);
    try {
      await authAxios().put(`${API}/profile/${userId}`, profile);
      showToast("success", "Profile updated successfully!");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSavingPersonal(false);
    }
  };

  // Save medical history to API
  const handleSaveMedical = async () => {
    setSavingMedical(true);
    try {
      await authAxios().put(`${API}/medical-history/${userId}`, medical);
      showToast("success", "Medical history updated!");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update medical history.",
      );
    } finally {
      setSavingMedical(false);
    }
  };

  // Toggle doctor visibility for medical history
  // Uses optimistic UI: reverts on API failure to keep UI consistent with server
  const handleToggleVisibility = async () => {
    const newVal = !medical.is_visible_to_doctors;
    setMedical((m) => ({ ...m, is_visible_to_doctors: newVal }));
    try {
      await authAxios().patch(`${API}/medical-history/${userId}/visibility`, {
        is_visible_to_doctors: newVal,
      });
      showToast(
        "success",
        newVal ? "Now visible to doctors." : "Hidden from doctors.",
      );
    } catch {
      // Revert optimistic update on failure
      setMedical((m) => ({ ...m, is_visible_to_doctors: !newVal }));
      showToast("error", "Could not update visibility.");
    }
  };

  // Logout: clear storage and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-emerald-50"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {/* Toast */}
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

      {/* ── Profile header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-emerald-100 border-2 border-emerald-400/30">
                {profile.first_name?.[0] ||
                  user.email?.[0]?.toUpperCase() ||
                  "?"}
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {profile.first_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : "Your Profile"}
                </h1>
                <RoleBadge role={profile.role} />
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {profile.email || user.email}
              </p>
              {profile.city && (
                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city}
                  {profile.country ? `, ${profile.country}` : ""}
                </p>
              )}
            </div>

            {/* Blood group chip + Logout */}
            <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
              {profile.blood_group && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
                  <Droplets className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none">
                      Blood
                    </p>
                    <p className="text-red-600 font-bold text-sm leading-none mt-0.5">
                      {profile.blood_group}
                    </p>
                  </div>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Sticky tab strip */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cx(
                "flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200",
                activeTab === id
                  ? "text-emerald-600 border-emerald-600"
                  : "text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-200",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Personal information form */}
        {activeTab === "personal" && (
          <div className="max-w-4xl animate-[fadeUp_0.4s_ease]">
            {loadingProfile ? (
              <Skeleton />
            ) : (
              <div className="space-y-6">
                {/* Full name */}
                <Card
                  title="Full Name"
                  icon={<User className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="First Name *" error={errors.first_name}>
                      <input
                        value={profile.first_name}
                        onChange={setP("first_name")}
                        placeholder="John"
                        className={iCls(errors.first_name)}
                      />
                    </Field>
                    <Field label="Last Name *" error={errors.last_name}>
                      <input
                        value={profile.last_name}
                        onChange={setP("last_name")}
                        placeholder="Doe"
                        className={iCls(errors.last_name)}
                      />
                    </Field>
                  </div>
                </Card>

                {/* Personal details */}
                <Card
                  title="Personal Details"
                  icon={<Calendar className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="grid sm:grid-cols-3 gap-5">
                    <Field label="Date of Birth">
                      <input
                        type="date"
                        value={profile.date_of_birth}
                        onChange={setP("date_of_birth")}
                        className={iCls()}
                      />
                    </Field>
                    <Field label="Gender">
                      <select
                        value={profile.gender}
                        onChange={setP("gender")}
                        className={iCls()}
                      >
                        <option value="">Select</option>
                        {GENDERS.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Blood Group">
                      <select
                        value={profile.blood_group}
                        onChange={setP("blood_group")}
                        className={iCls()}
                      >
                        <option value="">Select</option>
                        {BLOOD_GROUPS.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Card>

                {/* Contact */}
                <Card
                  title="Contact"
                  icon={<Phone className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Phone Number *" error={errors.phone}>
                      <input
                        value={profile.phone}
                        onChange={setP("phone")}
                        placeholder="+977 98XXXXXXXX"
                        className={iCls(errors.phone)}
                      />
                    </Field>
                    <Field label="Email (read-only)">
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50">
                        <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                        <span className="text-gray-400 text-sm truncate">
                          {profile.email}
                        </span>
                      </div>
                    </Field>
                  </div>
                </Card>

                {/* Address */}
                <Card
                  title="Address"
                  icon={<MapPin className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Address Line 1">
                        <input
                          value={profile.address_line1}
                          onChange={setP("address_line1")}
                          placeholder="Street address"
                          className={iCls()}
                        />
                      </Field>
                      <Field label="Address Line 2">
                        <input
                          value={profile.address_line2}
                          onChange={setP("address_line2")}
                          placeholder="Apartment, floor (optional)"
                          className={iCls()}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Field label="City *" error={errors.city}>
                        <input
                          value={profile.city}
                          onChange={setP("city")}
                          placeholder="Kathmandu"
                          className={iCls(errors.city)}
                        />
                      </Field>
                      <Field label="State">
                        <input
                          value={profile.state}
                          onChange={setP("state")}
                          placeholder="Bagmati"
                          className={iCls()}
                        />
                      </Field>
                      <Field label="Country *" error={errors.country}>
                        <input
                          value={profile.country}
                          onChange={setP("country")}
                          placeholder="Nepal"
                          className={iCls(errors.country)}
                        />
                      </Field>
                      <Field label="Postal Code">
                        <input
                          value={profile.postal_code}
                          onChange={setP("postal_code")}
                          placeholder="44600"
                          className={iCls()}
                        />
                      </Field>
                    </div>
                  </div>
                </Card>

                {/* Emergency contact */}
                <Card
                  title="Emergency Contact"
                  icon={<AlertTriangle className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Contact Name">
                      <input
                        value={profile.emergency_contact_name}
                        onChange={setP("emergency_contact_name")}
                        placeholder="Jane Doe"
                        className={iCls()}
                      />
                    </Field>
                    <Field label="Contact Phone">
                      <input
                        value={profile.emergency_contact_phone}
                        onChange={setP("emergency_contact_phone")}
                        placeholder="+977 98XXXXXXXX"
                        className={iCls()}
                      />
                    </Field>
                  </div>
                </Card>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                  <SaveButton
                    loading={savingPersonal}
                    onClick={handleSavePersonal}
                  >
                    Save Changes
                  </SaveButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medical history form */}
        {activeTab === "medical" && (
          <div className="max-w-4xl animate-[fadeUp_0.4s_ease]">
            {loadingMedical ? (
              <Skeleton />
            ) : (
              <div className="space-y-6">
                {/* Doctor visibility toggle */}
                <div className="flex items-start justify-between gap-4 bg-emerald-600 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-white mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Share with Doctors
                      </p>
                      <p className="text-emerald-200/80 text-xs mt-1 leading-relaxed max-w-sm">
                        Allow your treating doctors to access your health
                        records for better personalised care.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleVisibility}
                    className={cx(
                      "relative shrink-0 w-12 h-6 rounded-full transition-all duration-300",
                      medical.is_visible_to_doctors
                        ? "bg-white/30"
                        : "bg-black/20",
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

                {/* Allergies */}
                <Card
                  title="Allergies"
                  icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
                  note="Updated before each prescription"
                >
                  <Field label="Known Allergies">
                    <textarea
                      rows={3}
                      value={medical.allergies}
                      onChange={setM("allergies")}
                      placeholder="e.g. Penicillin, Aspirin, Peanuts, Latex…"
                      className={cx(iCls(), "resize-none")}
                    />
                  </Field>
                </Card>

                {/* Conditions & medications */}
                <Card
                  title="Conditions & Medications"
                  icon={<Pill className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Chronic Conditions">
                      <textarea
                        rows={4}
                        value={medical.chronic_conditions}
                        onChange={setM("chronic_conditions")}
                        placeholder="e.g. Diabetes Type 2, Hypertension…"
                        className={cx(iCls(), "resize-none")}
                      />
                    </Field>
                    <Field label="Current Medications">
                      <textarea
                        rows={4}
                        value={medical.current_medications}
                        onChange={setM("current_medications")}
                        placeholder="e.g. Metformin 500mg, Losartan 50mg…"
                        className={cx(iCls(), "resize-none")}
                      />
                    </Field>
                  </div>
                </Card>

                {/* History */}
                <Card
                  title="History"
                  icon={<FileText className="w-4 h-4 text-emerald-500" />}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Past Surgeries">
                      <textarea
                        rows={4}
                        value={medical.surgeries}
                        onChange={setM("surgeries")}
                        placeholder="e.g. Appendectomy 2018…"
                        className={cx(iCls(), "resize-none")}
                      />
                    </Field>
                    <Field label="Family Medical History">
                      <textarea
                        rows={4}
                        value={medical.family_history}
                        onChange={setM("family_history")}
                        placeholder="e.g. Heart disease — father, Diabetes — mother…"
                        className={cx(iCls(), "resize-none")}
                      />
                    </Field>
                  </div>
                </Card>

                {/* Notes */}
                <Card
                  title="Additional Notes"
                  icon={<FileText className="w-4 h-4 text-emerald-500" />}
                >
                  <Field label="Other Information">
                    <textarea
                      rows={4}
                      value={medical.notes}
                      onChange={setM("notes")}
                      placeholder="Anything else your doctor should know…"
                      className={cx(iCls(), "resize-none")}
                    />
                  </Field>
                </Card>

                {/* Save */}
                <div className="flex justify-end pt-2">
                  <SaveButton
                    loading={savingMedical}
                    onClick={handleSaveMedical}
                  >
                    Save Medical History
                  </SaveButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** White card with a labelled section header */
function Card({ title, icon, note, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
        {icon}
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        {note && (
          <span className="ml-auto text-xs text-gray-400 italic hidden sm:block">
            {note}
          </span>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/** Labelled form field with optional error */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
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

/** Reusable save button with loading spinner */
function SaveButton({ loading, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cx(
        "flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white",
        "bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all",
        "shadow-lg shadow-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed",
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="w-4 h-4" strokeWidth={2.5} /> {children}
        </>
      )}
    </button>
  );
}

/** Role badge displayed next to the user's name */
function RoleBadge({ role }) {
  const map = {
    admin: { label: "Admin", bg: "bg-purple-100 text-purple-700" },
    doctor: { label: "Doctor", bg: "bg-blue-100 text-blue-700" },
    user: { label: "Patient", bg: "bg-emerald-100 text-emerald-700" },
  };
  const cfg = map[role] || map.user;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
        cfg.bg,
      )}
    >
      <BadgeCheck className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

/** Animated skeleton loader for form sections */
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-50">
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
          <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
            <div className="h-11 bg-gray-100 rounded-xl" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
