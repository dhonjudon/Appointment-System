import React, { useState } from "react";
import {
  Building2,
  Calendar,
  Stethoscope,
  Bell,
  CreditCard,
  Settings as SettingsIcon,
  Plus,
  Lock,
  Database,
  Download,
  Folder,
  ChevronDown,
} from "lucide-react";

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      enabled ? "bg-brand-teal" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Section = ({
  icon: Icon,
  title,
  subtitle,
  children,
  onSave,
  onDiscard,
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>

    <div className="space-y-6">{children}</div>

    {onSave && (
      <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-50">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-brand-teal text-white text-sm font-bold rounded-lg hover:bg-brand-teal/90 transition-colors flex items-center gap-2"
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save changes
        </button>
        <button
          onClick={onDiscard}
          className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Discard
        </button>
      </div>
    )}
  </div>
);

const InputField = ({ label, type = "text", defaultValue, placeholder }) => (
  <div className="flex-1">
    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-800"
    />
  </div>
);

const Settings = () => {
  // State for toggles
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [walkIn, setWalkIn] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [requireRules, setRequireRules] = useState(true);
  const [showFee, setShowFee] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [apptReminder, setApptReminder] = useState(true);
  const [newAlerts, setNewAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Security state
  const [twoFactor, setTwoFactor] = useState(false);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [loginActivityLog, setLoginActivityLog] = useState(true);

  // Backup state
  const [automaticBackups, setAutomaticBackups] = useState(true);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8 relative">
        {/* Header matching the image exactly */}
        <div className="flex items-center justify-between pb-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <p className="text-sm text-gray-400 font-medium">
              Manage your clinic's system configuration
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold">
            SA
          </div>
        </div>

        <div className="max-w-5xl">
          {/* Clinic Information */}
          <Section
            icon={Building2}
            title="Clinic Information"
            subtitle="Basic details shown on patient-facing pages and reports"
            onSave={() => {}}
            onDiscard={() => {}}
          >
            <div className="flex gap-6">
              <InputField label="Clinic name" defaultValue="Swastha Sewa" />
              <InputField
                label="Contact number"
                defaultValue="+977-98XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                Address
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-800 min-h-[80px]"
                defaultValue="Kathmandu, Bagmati Province, Nepal"
              ></textarea>
            </div>
            <div className="flex gap-6">
              <InputField label="Email" defaultValue="admin@swasthasewa.com" />
              <InputField
                label="Website"
                defaultValue="https://swasthasewa.com"
              />
            </div>
          </Section>

          {/* Appointment Settings */}
          <Section
            icon={Calendar}
            title="Appointment Settings"
            subtitle="Control how bookings are created and managed"
            onSave={() => {}}
            onDiscard={() => {}}
          >
            <div className="flex gap-6">
              <InputField
                label="Appointment duration"
                defaultValue="15 minutes"
              />
              <InputField label="Max appointments per day" defaultValue="40" />
            </div>
            <div className="flex gap-6">
              <InputField
                label="Cancellation limit"
                defaultValue="1 hour before"
              />
              <InputField label="Approval mode" defaultValue="Auto approve" />
            </div>

            <div className="space-y-0 pt-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Online booking
                  </h4>
                  <p className="text-xs text-gray-500">
                    Allow patients to book via web portal
                  </p>
                </div>
                <Toggle enabled={onlineBooking} onChange={setOnlineBooking} />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Walk-in appointments
                  </h4>
                  <p className="text-xs text-gray-500">
                    Allow same-day walk-in registration
                  </p>
                </div>
                <Toggle enabled={walkIn} onChange={setWalkIn} />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Appointment reminders
                  </h4>
                  <p className="text-xs text-gray-500">
                    Send automated reminders to patients
                  </p>
                </div>
                <Toggle enabled={reminders} onChange={setReminders} />
              </div>
            </div>
          </Section>

          {/* Doctor Management */}
          <Section
            icon={Stethoscope}
            title="Doctor Management"
            subtitle="Manage specializations, schedules, and consultation fees"
            onSave={() => {}}
            onDiscard={() => {}}
          >
            <div className="flex gap-6">
              <InputField
                label="Default consultation fee (NPR)"
                defaultValue="500"
              />
              <InputField
                label="Default session duration"
                defaultValue="20 minutes"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-2">
                Available specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "General Practice",
                  "Cardiology",
                  "Orthopedics",
                  "Pediatrics",
                  "Dermatology",
                ].map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-full text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
                <button className="px-3 py-1.5 border border-brand-teal border-dashed text-brand-teal rounded-full text-xs font-medium flex items-center gap-1 hover:bg-brand-teal/5">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>

            <div className="space-y-0 pt-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Require availability rules
                  </h4>
                  <p className="text-xs text-gray-500">
                    Doctors must set weekly availability before accepting
                    bookings
                  </p>
                </div>
                <Toggle enabled={requireRules} onChange={setRequireRules} />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Show consultation fee publicly
                  </h4>
                  <p className="text-xs text-gray-500">
                    Display fee on the patient booking page
                  </p>
                </div>
                <Toggle enabled={showFee} onChange={setShowFee} />
              </div>
            </div>
          </Section>

          {/* Notification Settings */}
          <Section
            icon={Bell}
            title="Notification Settings"
            subtitle="Choose how the system communicates with staff and patients"
            onSave={() => {}}
            onDiscard={() => {}}
          >
            <div className="space-y-0">
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Email notifications
                  </h4>
                  <p className="text-xs text-gray-500">
                    Send confirmation and update emails
                  </p>
                </div>
                <Toggle enabled={emailNotif} onChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    SMS notifications
                  </h4>
                  <p className="text-xs text-gray-500">
                    Text messages for appointments
                  </p>
                </div>
                <Toggle enabled={smsNotif} onChange={setSmsNotif} />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Appointment reminder (24 hrs)
                  </h4>
                  <p className="text-xs text-gray-500">
                    Remind patients a day before their slot
                  </p>
                </div>
                <Toggle enabled={apptReminder} onChange={setApptReminder} />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    New user alerts
                  </h4>
                  <p className="text-xs text-gray-500">
                    Notify admin when a new user registers
                  </p>
                </div>
                <Toggle enabled={newAlerts} onChange={setNewAlerts} />
              </div>
            </div>
          </Section>

          {/* Security */}
          <Section
            icon={Lock}
            title="Security"
            subtitle="Protect admin access and monitor login activity"
            onSave={() => {}}
            onDiscard={() => {}}
          >
            <div className="flex gap-6">
              <InputField label="Session timeout" defaultValue="15 minutes" />
              <InputField label="Minimum password length" defaultValue="8" />
            </div>

            <div className="space-y-0 pt-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Two-factor authentication
                  </h4>
                  <p className="text-xs text-gray-500">
                    Require OTP on every login
                  </p>
                </div>
                <Toggle enabled={twoFactor} onChange={setTwoFactor} />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Require special characters
                  </h4>
                  <p className="text-xs text-gray-500">
                    Enforce stronger password policy
                  </p>
                </div>
                <Toggle
                  enabled={requireSpecialChars}
                  onChange={setRequireSpecialChars}
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Login activity log
                  </h4>
                  <p className="text-xs text-gray-500">
                    Record all admin login events
                  </p>
                </div>
                <Toggle
                  enabled={loginActivityLog}
                  onChange={setLoginActivityLog}
                />
              </div>
            </div>

            <div className="pt-2">
              <button className="px-4 py-2 border border-red-200 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-400" /> Log out all devices
              </button>
            </div>
          </Section>

          {/* Backup & Data */}
          <Section
            icon={Database}
            title="Backup & Data"
            subtitle="Export records or restore from a previous backup"
          >
            <div className="bg-brand-dark rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-brand-teal mb-1">
                  Last backup
                </p>
                <h4 className="text-lg font-bold text-white mb-0.5">
                  May 15, 2026
                </h4>
                <p className="text-[11px] text-gray-400">
                  11:45 PM — Successful
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
                </button>
                <button className="px-4 py-2 bg-brand-teal text-white text-sm font-bold rounded-lg hover:bg-brand-teal/90 transition-colors flex items-center gap-2">
                  <Database className="w-4 h-4" /> Backup now
                </button>
              </div>
            </div>

            <div className="border border-dashed border-brand-teal/30 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-teal/5 transition-colors mt-6 bg-brand-teal/[0.02]">
              <Folder className="w-8 h-8 text-yellow-400 mb-3 fill-yellow-400" />
              <h4 className="text-sm font-medium text-brand-teal mb-1">
                Restore from backup
              </h4>
              <p className="text-xs text-gray-500">
                Drop a backup file here or click to browse
              </p>
            </div>

            <div className="pt-4 mt-6 flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  Automatic daily backups
                </h4>
                <p className="text-xs text-gray-500">
                  Run backups every night at midnight
                </p>
              </div>
              <Toggle
                enabled={automaticBackups}
                onChange={setAutomaticBackups}
              />
            </div>
          </Section>

          {/* Payment Settings */}
          <Section
            icon={CreditCard}
            title="Payment Settings"
            subtitle="Configure payment gateways and consultation fees"
            onSave={() => {}}
            onDiscard={() => {}}
          >
            <div className="flex gap-6 mb-6">
              <InputField label="Currency" defaultValue="NPR (₹)" />
              <InputField label="Default consultation fee" defaultValue="500" />
            </div>

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-white p-1">
                    <img
                      src="/esewa.png"
                      alt="eSewa logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">eSewa</h4>
                    <p className="text-xs text-gray-500">
                      Nepal's leading digital wallet
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium flex items-center gap-1 border border-green-100">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Connected
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-white p-1">
                    <img
                      src="/khalti.png"
                      alt="Khalti logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Khalti</h4>
                    <p className="text-xs text-gray-500">
                      Digital payment for Nepal
                    </p>
                  </div>
                </div>
                <button className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50">
                  Connect
                </button>
              </div>
            </div>
          </Section>

          {/* System Preferences */}
          <Section
            icon={SettingsIcon}
            title="System Preferences"
            subtitle="General behavior and localization settings"
          >
            <div className="w-1/2 pr-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                  Language
                </label>
                <div className="relative">
                  <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 text-gray-800 appearance-none bg-white">
                    <option value="english">English</option>
                    <option value="nepali">Nepali</option>
                    <option value="hindi">Hindi</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Dark mode
                  </h4>
                  <p className="text-xs text-gray-500">
                    Use dark theme across the admin panel
                  </p>
                </div>
                <Toggle enabled={darkMode} onChange={setDarkMode} />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
