// Appointments.jsx
// Full appointment management page for patients
// Features: tabbed view (Upcoming, Completed, All), appointment cards, modals for detail/cancel/review
// Integrates with backend API for real-time appointment state management

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  Check,
  AlertTriangle,
  FileText,
} from "lucide-react";

const API = "http://localhost:3000/api";

// Utility: join classnames, filter falsy values
const cx = (...a) => a.filter(Boolean).join(" ");

// Retrieve user from localStorage with fallback
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

// Extract user ID from various storage formats (handles multiple response types)
// Retrieve and resolve user ID from various localStorage formats
const resolveUserId = (storedUser) => {
  const candidates = [
    storedUser?.id,
    storedUser?.data?.id,
    storedUser?.data?.user?.id,
    storedUser?.user?.id,
    storedUser?.user_id,
  ];

  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isInteger(value) && value > 0) return value;
  }

  return null;
};
const getToken = () => localStorage.getItem("token") || "";

// Axios instance with JWT authentication for API requests
const authAxios = () =>
  axios.create({ headers: { Authorization: `Bearer ${getToken()}` } });

// Status styling configuration: colors, icons, labels for each appointment state
const STATUS_CFG = {
  confirmed: {
    label: "Confirmed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    Icon: AlertCircle,
  },
  rescheduled: {
    label: "Rescheduled",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    Icon: RefreshCw,
  },
  completed: {
    label: "Completed",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
    Icon: XCircle,
  },
};

// Date/time formatters for consistent display
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const fmtTime = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = Number(h);
  return `${hour % 12 || 12}:${m} ${hour < 12 ? "AM" : "PM"}`;
};

// Main component: appointment list with tabs and management modals
export default function Appointments() {
  const user = getUser();
  const userId = resolveUserId(user);

  // Tab and pagination state
  const [tab, setTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allStats, setAllStats] = useState({
    total: 1,
    upcoming: 1,
    completed: 0,
    cancelled: 0,
  });

  // Modal management: tracks which appointment is selected and which modal is open
  const [selected, setSelected] = useState(null); // appointment object
  const [modalType, setModalType] = useState(null); // "detail" | "cancel" | "review"
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: "" });
  const [toast, setToast] = useState(null);

  // Toast notification helper with auto-dismiss
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch paginated appointments from API with tab filtering
  const fetchAppointments = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Map tabs to status query parameters
      const statusParam = tab === "past" ? "completed" : undefined;

      const { data } = await authAxios().get(
        `${API}/users/${userId}/appointments`,
        {
          params: {
            page,
            limit: 8,
            ...(statusParam ? { status: statusParam } : {}),
          },
        },
      );

      let items = data.data.items || [];

      // Client-side filter for upcoming tab (active statuses only)
      if (tab === "upcoming") {
        items = items.filter((a) =>
          ["pending", "confirmed", "rescheduled"].includes(a.status),
        );
      }

      setAppointments(items);
      setTotalPages(data.data.total_pages || 1);

      // Build aggregate stats from all appointments
      if (tab === "all") {
        setAllStats({
          total: data.data.total || 0,
          upcoming: items.filter((a) =>
            ["pending", "confirmed", "rescheduled"].includes(a.status),
          ).length,
          completed: items.filter((a) => a.status === "completed").length,
          cancelled: items.filter((a) => a.status === "cancelled").length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [userId, tab, page]);

  // Reset to page 1 when tab changes
  useEffect(() => {
    setPage(1);
  }, [tab]);
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Cancel appointment via API
  const handleCancel = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await authAxios().patch(`${API}/appointments/${selected.id}/cancel`, {
        user_id: userId,
      });
      showToast("success", "Appointment cancelled successfully.");
      setModalType(null);
      setSelected(null);
      fetchAppointments();
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not cancel appointment.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Submit review for completed appointment
  const handleReview = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await authAxios().post(`${API}/reviews`, {
        doctor_id: selected.doctor_id,
        user_id: userId,
        appointment_id: selected.id,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text,
      });
      showToast("success", "Review submitted — thank you!");
      setModalType(null);
      setSelected(null);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Could not submit review.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Modal state setters
  const openDetail = (a) => {
    setSelected(a);
    setModalType("detail");
  };
  const openCancel = (a, e) => {
    e.stopPropagation();
    setSelected(a);
    setModalType("cancel");
  };
  const openReview = (a, e) => {
    e.stopPropagation();
    setSelected(a);
    setReviewForm({ rating: 5, review_text: "" });
    setModalType("review");
  };
  const closeModal = () => {
    setSelected(null);
    setModalType(null);
  };

  const TABS = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Completed" },
    { id: "all", label: "All" },
  ];

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

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-1">
            My Health Journey
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            My Appointments
          </h1>
          <p className="text-gray-400 text-sm">
            Manage, track and review all your consultations in one place.
          </p>

          {/* Stats strip */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              {
                label: "Total",
                value: allStats.total,
                icon: <FileText className="w-4 h-4" />,
                color: "text-gray-600",
                bg: "bg-gray-50",
              },
              {
                label: "Upcoming",
                value: allStats.upcoming,
                icon: <Calendar className="w-4 h-4" />,
                color: "text-emerald-700",
                bg: "bg-emerald-50",
              },
              {
                label: "Completed",
                value: allStats.completed,
                icon: <CheckCircle2 className="w-4 h-4" />,
                color: "text-blue-700",
                bg: "bg-blue-50",
              },
              {
                label: "Cancelled",
                value: allStats.cancelled,
                icon: <XCircle className="w-4 h-4" />,
                color: "text-red-600",
                bg: "bg-red-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={cx(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-100",
                  s.bg,
                )}
              >
                <span className={s.color}>{s.icon}</span>
                <div>
                  <p className="text-[11px] text-gray-400 leading-none">
                    {s.label}
                  </p>
                  <p
                    className={cx(
                      "text-lg font-bold leading-none mt-0.5",
                      s.color,
                    )}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 w-fit mb-7">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cx(
                "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                tab === t.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : appointments.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appt={appt}
                  onOpen={openDetail}
                  onCancel={openCancel}
                  onReview={openReview}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cx(
                        "w-9 h-9 rounded-xl text-sm font-semibold transition-all",
                        p === page
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ DETAIL MODAL ══ */}
      {modalType === "detail" && selected && (
        <Modal onClose={closeModal} title="Appointment Details">
          <StatusBadge status={selected.status} />
          <div className="mt-5 space-y-3">
            <InfoBlock label="Doctor">
              <p className="font-semibold text-gray-800">
                Dr. {selected.doctor_first_name} {selected.doctor_last_name}
              </p>
              <p className="text-emerald-600 text-sm">
                {selected.specialization_name}
              </p>
            </InfoBlock>
            <div className="grid grid-cols-2 gap-3">
              <InfoBlock
                label="Date"
                icon={<Calendar className="w-3.5 h-3.5" />}
              >
                <p className="font-medium text-gray-800 text-sm">
                  {fmtDate(selected.appointment_date)}
                </p>
              </InfoBlock>
              <InfoBlock label="Time" icon={<Clock className="w-3.5 h-3.5" />}>
                <p className="font-medium text-gray-800 text-sm">
                  {fmtTime(selected.start_time)} — {fmtTime(selected.end_time)}
                </p>
              </InfoBlock>
            </div>
            {selected.hospital_name && (
              <InfoBlock
                label="Hospital"
                icon={<MapPin className="w-3.5 h-3.5" />}
              >
                <p className="font-medium text-gray-800 text-sm">
                  {selected.hospital_name}
                </p>
              </InfoBlock>
            )}
            {selected.reason && (
              <InfoBlock label="Reason for Visit">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selected.reason}
                </p>
              </InfoBlock>
            )}
            {selected.status === "cancelled" && selected.cancelled_at && (
              <InfoBlock label="Cancelled On">
                <p className="text-red-600 text-sm">
                  {fmtDate(selected.cancelled_at)}
                </p>
              </InfoBlock>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            {["pending", "confirmed", "rescheduled"].includes(
              selected.status,
            ) && (
              <button
                onClick={() => {
                  closeModal();
                  setTimeout(() => {
                    setSelected(selected);
                    setModalType("cancel");
                  }, 50);
                }}
                className="flex-1 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all"
              >
                Cancel Appointment
              </button>
            )}
            {selected.status === "completed" && (
              <button
                onClick={() => {
                  closeModal();
                  setTimeout(() => {
                    setSelected(selected);
                    setReviewForm({ rating: 5, review_text: "" });
                    setModalType("review");
                  }, 50);
                }}
                className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all"
              >
                Leave Review
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* ══ CANCEL MODAL ══ */}
      {modalType === "cancel" && selected && (
        <Modal onClose={closeModal} title="Cancel Appointment">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
            <p className="text-red-700 text-sm font-medium">
              Are you sure you want to cancel your appointment with{" "}
              <strong>
                Dr. {selected.doctor_first_name} {selected.doctor_last_name}
              </strong>{" "}
              on <strong>{fmtDate(selected.appointment_date)}</strong>?
            </p>
            <p className="text-red-400 text-xs mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Keep Appointment
            </button>
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                "Yes, Cancel"
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* ══ REVIEW MODAL ══ */}
      {modalType === "review" && selected && (
        <Modal onClose={closeModal} title="Leave a Review">
          <p className="text-gray-500 text-sm mb-5">
            How was your experience with{" "}
            <span className="font-semibold text-gray-700">
              Dr. {selected.doctor_first_name} {selected.doctor_last_name}
            </span>
            ?
          </p>
          {/* Star rating */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setReviewForm((r) => ({ ...r, rating: n }))}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cx(
                      "w-8 h-8",
                      n <= reviewForm.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Review text */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Your Review
            </label>
            <textarea
              rows={4}
              value={reviewForm.review_text}
              onChange={(e) =>
                setReviewForm((r) => ({ ...r, review_text: e.target.value }))
              }
              placeholder="Share your experience…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 resize-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleReview}
              disabled={actionLoading}
              className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────
function AppointmentCard({ appt, onOpen, onCancel, onReview }) {
  const cfg = STATUS_CFG[appt.status] || STATUS_CFG.pending;
  const isActive = ["pending", "confirmed", "rescheduled"].includes(
    appt.status,
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(appt)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(appt);
      }}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 cursor-pointer animate-[fadeUp_0.4s_ease]"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Doctor initials avatar */}
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base shrink-0">
            {appt.doctor_first_name?.[0] || "D"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">
              Dr. {appt.doctor_first_name} {appt.doctor_last_name}
            </h3>
            <p className="text-emerald-600 text-xs font-medium mt-0.5">
              {appt.specialization_name}
            </p>
          </div>
        </div>
        {/* Status badge */}
        <span
          className={cx(
            "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
            cfg.bg,
            cfg.text,
          )}
        >
          <span className={cx("w-1.5 h-1.5 rounded-full", cfg.dot)} />
          {cfg.label}
        </span>
      </div>

      {/* Date/time chips */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400">Date</p>
            <p className="text-xs font-semibold text-gray-700">
              {fmtDate(appt.appointment_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
          <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-[10px] text-gray-400">Time</p>
            <p className="text-xs font-semibold text-gray-700">
              {fmtTime(appt.start_time)}
            </p>
          </div>
        </div>
      </div>

      {/* Hospital */}
      {appt.hospital_name && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          {appt.hospital_name}
        </p>
      )}

      {/* Reason snippet */}
      {appt.reason && (
        <p className="text-xs text-gray-400 italic mb-3 line-clamp-1">
          "{appt.reason}"
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(appt);
          }}
          className="flex-1 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"
        >
          View Details
        </button>
        {isActive && (
          <button
            onClick={(e) => onCancel(appt, e)}
            className="flex-1 py-2 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
          >
            Cancel
          </button>
        )}
        {appt.status === "completed" && (
          <button
            onClick={(e) => onReview(appt, e)}
            className="flex-1 py-2 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <Star className="w-3 h-3" /> Review
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Reusable modal wrapper ───────────────────────────────────────────────────
function Modal({ onClose, title, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-[fadeUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        cfg.bg,
        cfg.text,
      )}
    >
      <span className={cx("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ─── Info block ───────────────────────────────────────────────────────────────
function InfoBlock({ label, icon, children }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <p className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
        >
          <div className="flex gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3.5 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="h-14 bg-gray-100 rounded-xl" />
            <div className="h-14 bg-gray-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ tab }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <div className="w-16 h-16 mx-auto mb-5 bg-emerald-50 rounded-full flex items-center justify-center">
        <Calendar className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {tab === "upcoming"
          ? "No upcoming appointments"
          : "No appointments found"}
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        {tab === "upcoming"
          ? "Book a consultation with one of our doctors."
          : "Your appointment history will appear here."}
      </p>
      {tab === "upcoming" && (
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          Find a Doctor <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
