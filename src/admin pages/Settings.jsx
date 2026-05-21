import React, { useState } from "react";
import {
  Building2,
  Calendar,
  Stethoscope,
  Bell,
  CreditCard,
  Settings as SettingsIcon,
  Lock,
  Database,
  Download,
  Folder,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      enabled ? "bg-[#1b6a55]" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Section = ({ icon: Icon, title, subtitle, children }) => (
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
      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/50 text-gray-800"
    />
  </div>
);

const Settings = () => {
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [walkIn, setWalkIn] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [automaticBackups, setAutomaticBackups] = useState(true);

  return (
    <div className="flex h-screen bg-[#DFF2EB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-500">
                Manage your clinic's system configuration
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1b6a55] flex items-center justify-center text-white font-bold">
              SA
            </div>
          </div>

          <Section
            icon={Building2}
            title="Clinic Information"
            subtitle="Basic details shown on patient-facing pages and reports"
          >
            <div className="flex gap-6 flex-col md:flex-row">
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
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b6a55]/50 text-gray-800 min-h-20"
                defaultValue="Kathmandu, Bagmati Province, Nepal"
              />
            </div>
            <div className="flex gap-6 flex-col md:flex-row">
              <InputField label="Email" defaultValue="admin@swasthasewa.com" />
              <InputField
                label="Website"
                defaultValue="https://swasthasewa.com"
              />
            </div>
          </Section>

          <Section
            icon={Calendar}
            title="Appointment Settings"
            subtitle="Control how bookings are created and managed"
          >
            <div className="flex gap-6 flex-col md:flex-row">
              <InputField
                label="Appointment duration"
                defaultValue="15 minutes"
              />
              <InputField label="Max appointments per day" defaultValue="40" />
            </div>
            <div className="flex gap-6 flex-col md:flex-row">
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

          <Section
            icon={Stethoscope}
            title="Doctor Management"
            subtitle="Manage specializations, schedules, and consultation fees"
          >
            <div className="flex gap-6 flex-col md:flex-row">
              <InputField
                label="Default consultation fee"
                defaultValue="NPR 800"
              />
              <InputField
                label="Consultation duration"
                defaultValue="20 minutes"
              />
            </div>
            <div className="flex gap-6 flex-col md:flex-row">
              <InputField label="Minimum experience" defaultValue="3 years" />
              <InputField
                label="Specialization approval"
                defaultValue="Manual review"
              />
            </div>
          </Section>

          <Section
            icon={Bell}
            title="Notifications"
            subtitle="Choose how admins receive alerts"
          >
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  Email notifications
                </h4>
                <p className="text-xs text-gray-500">
                  Receive updates by email
                </p>
              </div>
              <Toggle enabled={emailNotif} onChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  SMS alerts
                </h4>
                <p className="text-xs text-gray-500">
                  Receive urgent alerts by SMS
                </p>
              </div>
              <Toggle enabled={smsNotif} onChange={setSmsNotif} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  System reminders
                </h4>
                <p className="text-xs text-gray-500">
                  Daily reminders for admins
                </p>
              </div>
              <Toggle
                enabled={automaticBackups}
                onChange={setAutomaticBackups}
              />
            </div>
          </Section>

          <Section
            icon={Lock}
            title="Security"
            subtitle="Protect admin access and audit history"
          >
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  Two-factor authentication
                </h4>
                <p className="text-xs text-gray-500">
                  Add an extra layer of security
                </p>
              </div>
              <Toggle enabled={twoFactor} onChange={setTwoFactor} />
            </div>
            <div className="flex gap-6 flex-col md:flex-row">
              <InputField
                label="Password length"
                defaultValue="12 characters"
              />
              <InputField label="Session timeout" defaultValue="30 minutes" />
            </div>
          </Section>

          <Section
            icon={Database}
            title="Backups"
            subtitle="Control backup and restore behavior"
          >
            <div className="flex items-center justify-between py-4 border-b border-gray-50">
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  Automatic backups
                </h4>
                <p className="text-xs text-gray-500">
                  Backup the database every night
                </p>
              </div>
              <Toggle
                enabled={automaticBackups}
                onChange={setAutomaticBackups}
              />
            </div>
            <div className="flex gap-6 flex-col md:flex-row">
              <InputField label="Retention period" defaultValue="30 days" />
              <InputField
                label="Backup location"
                defaultValue="Secure cloud storage"
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
