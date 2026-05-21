import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Plus,
  Users as UsersIcon,
  Search,
  Bell,
  Grid,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { NotificationBell } from "../components/NotificationBell";
import { checkAdminSession } from "../utils/adminAuth";

const API_BASE_URL = "http://localhost:3000/api";
const PAGE_SIZE = 10;

const StatCard = ({ icon: Icon, value, title, iconColorClass }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${iconColorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800 leading-none mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  </div>
);

const defaultForm = {
  role: "doctor",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  specialization_id: "",
  license_number: "",
  years_of_experience: "",
  consultation_fee: "",
  bio: "",
};

const Users = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Users");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    doctors: 0,
    patients: 0,
  });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!checkAdminSession()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const loadSpecialties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/specializations`);
        if (!response.ok) return;
        const payload = await response.json();
        setSpecialties(Array.isArray(payload.data) ? payload.data : []);
      } catch {
        setSpecialties([]);
      }
    };

    loadSpecialties();
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (searchTerm.trim()) params.set("search", searchTerm.trim());
        if (activeTab === "Doctors") params.set("role", "doctor");
        if (activeTab === "Patients") params.set("role", "user");

        const response = await fetch(
          `${API_BASE_URL}/admin/users?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const payload = await response.json();
        const items = payload.data?.items || [];

        const normalized = items.map((item, idx) => {
          const isDoctor = item.role === "doctor";
          const initials =
            `${item.first_name?.charAt(0) || (isDoctor ? "D" : "P")}${item.last_name?.charAt(0) || ""}`.toUpperCase();

          return {
            id: item.user_id,
            initials,
            name: isDoctor
              ? `Dr. ${item.first_name || ""} ${item.last_name || ""}`.trim()
              : `${item.first_name || ""} ${item.last_name || ""}`.trim(),
            email: item.email,
            role: isDoctor
              ? "Doctor"
              : item.role === "admin"
                ? "Admin"
                : "Patient",
            contact: item.phone || "N/A",
            joined: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "N/A",
            status: item.is_active ? "Active" : "Inactive",
            color: isDoctor
              ? [
                  "bg-blue-500",
                  "bg-green-600",
                  "bg-purple-500",
                  "bg-indigo-500",
                ][idx % 4]
              : [
                  "bg-orange-500",
                  "bg-yellow-500",
                  "bg-pink-500",
                  "bg-cyan-500",
                ][idx % 4],
            specialization: item.specialization_name || "",
            doctor_id: item.doctor_id,
          };
        });

        setAllUsers(normalized);
        setTotalPages(payload.data?.total_pages || 1);
        setTotalUsers(payload.data?.total || 0);
        setStats({
          totalUsers: payload.data?.summary?.total_users || 0,
          doctors: payload.data?.summary?.doctors || 0,
          patients: payload.data?.summary?.patients || 0,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch users");
          setAllUsers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [activeTab, page, searchTerm]);

  const filteredUsers = useMemo(() => allUsers, [allUsers]);

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Role", "Contact", "Status", "Joined"];
    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.role,
      user.contact,
      user.status,
      user.joined,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const openAddUserModal = () => {
    setFormData(defaultForm);
    setIsAddUserModalOpen(true);
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("First name, last name, email, and password are required");
      return;
    }

    if (
      formData.role === "doctor" &&
      (!formData.specialization_id || !formData.license_number.trim())
    ) {
      setError("Specialization and license number are required for doctors");
      return;
    }

    try {
      setCreatingUser(true);
      setError(null);

      if (formData.role === "doctor") {
        const response = await fetch(`${API_BASE_URL}/doctors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            specialization_id: Number(formData.specialization_id),
            license_number: formData.license_number,
            years_of_experience: Number(formData.years_of_experience || 0),
            consultation_fee: Number(formData.consultation_fee || 0),
            bio: formData.bio,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || "Failed to create doctor");
        }

        const userId = payload.data?.user_id;
        if (userId && formData.phone.trim()) {
          await fetch(`${API_BASE_URL}/profile/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: formData.phone }),
          });
        }
      } else {
        const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: "user",
          }),
        });

        const registerPayload = await registerResponse.json();
        if (!registerResponse.ok) {
          throw new Error(
            registerPayload.message || "Failed to create patient",
          );
        }

        const userId = registerPayload.data?.id;
        if (!userId) {
          throw new Error("User was created but no user ID was returned");
        }

        const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
          }),
        });

        const profilePayload = await profileResponse.json();
        if (!profileResponse.ok) {
          throw new Error(
            profilePayload.message || "Failed to create patient profile",
          );
        }
      }

      setIsAddUserModalOpen(false);
      setFormData(defaultForm);
      setPage(1);
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#DFF2EB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 gap-4">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Users Management
                </h2>
                <p className="text-sm text-gray-500">
                  {stats.patients.toLocaleString()} patients ·{" "}
                  {stats.doctors.toLocaleString()} doctors registered
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={openAddUserModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b6a55] text-white rounded-lg text-sm font-medium hover:bg-[#145140] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients, doctors..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-64 text-gray-600"
                />
              </div>
              <NotificationBell />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={UsersIcon}
              value={stats.totalUsers.toString()}
              title="Total Users"
              iconColorClass="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={UsersIcon}
              value={stats.doctors.toString()}
              title="Doctors"
              iconColorClass="bg-blue-50 text-blue-500"
            />
            <StatCard
              icon={UsersIcon}
              value={stats.patients.toString()}
              title="Patients"
              iconColorClass="bg-orange-50 text-orange-500"
            />
          </div>

          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {["All Users", "Doctors", "Patients"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-colors ${
                    activeTab === tab
                      ? "bg-[#1b6a55] text-white border-[#1b6a55]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab !== "All Users" && <UsersIcon className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 px-6 text-center">
                      <div className="text-gray-500">Loading users...</div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="py-8 px-6 text-center">
                      <div className="text-red-500 font-semibold">{error}</div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.color}`}
                          >
                            {user.initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">
                              {user.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-sm font-medium ${user.role === "Doctor" ? "text-blue-500" : user.role === "Admin" ? "text-indigo-500" : "text-orange-500"}`}
                        >
                          {user.role}
                        </span>
                        {user.specialization && (
                          <p className="text-xs text-gray-400 mt-1">
                            {user.specialization}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600 font-medium">
                          {user.contact}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">
                          {user.joined}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            user.status === "Active"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-sm font-medium text-[#1b6a55] hover:text-[#145140] transition-colors">
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 px-6 text-center">
                      <p className="text-gray-500">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="py-4 px-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
              <span className="text-sm text-gray-500">
                Showing page {page} of {totalPages} ·{" "}
                {totalUsers.toLocaleString()} matching records
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="px-4 py-2 bg-[#1b6a55] text-white rounded-lg text-sm font-medium hover:bg-[#145140] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Add User</h2>
                <p className="text-sm text-gray-500">
                  Create a new doctor or patient account
                </p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateUser}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((current) => ({ ...current, role: "doctor" }))
                  }
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    formData.role === "doctor"
                      ? "bg-[#1b6a55] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Add Doctor
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((current) => ({ ...current, role: "patient" }))
                  }
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    formData.role === "patient"
                      ? "bg-[#1b6a55] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Add Patient
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    placeholder="Temporary password"
                  />
                </div>
              </div>

              {formData.role === "doctor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      name="specialization_id"
                      value={formData.specialization_id}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white"
                    >
                      <option value="">Select specialization</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="License number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      name="years_of_experience"
                      type="number"
                      value={formData.years_of_experience}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="Years of experience"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee
                    </label>
                    <input
                      name="consultation_fee"
                      type="number"
                      value={formData.consultation_fee}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      placeholder="Consultation fee"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal min-h-24"
                      placeholder="Doctor bio"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="py-2 px-4 bg-[#1b6a55] text-white rounded-lg text-sm font-medium hover:bg-[#145140] transition disabled:opacity-50"
                >
                  {creatingUser
                    ? "Saving..."
                    : `Add ${formData.role === "doctor" ? "Doctor" : "Patient"}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
