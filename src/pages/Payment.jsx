import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CreditCard, Banknote, Smartphone, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";
import khaltiLogo from "../assets/khalti logo.jpg";
import esewaLogo from "../assets/esewa logo.png";
import siddharthaLogo from "../assets/siddartha.jpg";
import nepalLogo from "../assets/nepal.jpeg";
import nabilLogo from "../assets/nabil.jpeg";
import globalImeLogo from "../assets/global ime.jpeg";
import nicAsiaLogo from "../assets/nic asia.png";
import nepalInvestmentLogo from "../assets/nepal investment.png";
import himalayanLogo from "../assets/himalayan.jpeg";
import everestLogo from "../assets/everest.png";
import sanimaLogo from "../assets/sanima.png";
import kumariLogo from "../assets/kumari.jpeg";
import prabhuLogo from "../assets/prabhu.png";
import rastriyaBanijyaLogo from "../assets/rastriya banijya.png";
import machhapuchreLogo from "../assets/machapuchre.png";

const METHOD_LABELS = {
  khalti: "Khalti",
  esewa: "eSewa",
  card: "Card Payment",
  bank: "Online Banking",
  cash: "Cash on Visitation",
};

const PROVIDER_META = {
  khalti: {
    brand: "Khalti",
    headerBg: "bg-[#6f46eb]",
    buttonBg: "bg-[#6f46eb] hover:bg-[#5b3dd6]",
    accent: "text-white",
    logoSrc: khaltiLogo,
  },
  esewa: {
    brand: "eSewa",
    headerBg: "bg-[#16a34a]",
    buttonBg: "bg-[#16a34a] hover:bg-[#15803d]",
    accent: "text-white",
    logoSrc: esewaLogo,
  },
};

const BANK_META = {
  "Siddhartha Bank": {
    headerBg: "bg-[#eab308]",
    buttonBg: "bg-[#eab308] hover:bg-[#ca8a04]",
    badge: "bg-[#eab308] text-black",
    accent: "text-black",
    logoSrc: siddharthaLogo,
  },
  "Nepal Bank": {
    headerBg: "bg-[#2563eb]",
    buttonBg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    badge: "bg-white text-[#2563eb]",
    accent: "text-white",
    logoSrc: nepalLogo,
  },
  "Nabil Bank": {
    headerBg: "bg-gradient-to-r from-[#059669] to-[#dc2626]",
    buttonBg: "bg-[#059669] hover:bg-[#047857]",
    badge: "bg-[#dc2626] text-white",
    accent: "text-white",
    logoSrc: nabilLogo,
  },
  "Global IME Bank": {
    headerBg: "bg-gradient-to-r from-[#2563eb] to-[#dc2626]",
    buttonBg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    badge: "bg-[#dc2626] text-white",
    accent: "text-white",
    logoSrc: globalImeLogo,
  },
  "NIC Asia Bank": {
    headerBg: "bg-[#dc2626]",
    buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
    badge: "bg-white text-[#dc2626]",
    accent: "text-white",
    logoSrc: nicAsiaLogo,
  },
  "Nepal Investment Mega Bank": {
    headerBg: "bg-gradient-to-r from-[#dc2626] to-[#2563eb]",
    buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
    badge: "bg-[#2563eb] text-white",
    accent: "text-white",
    logoSrc: nepalInvestmentLogo,
  },
  "Himalayan Bank": {
    headerBg: "bg-[#dc2626]",
    buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
    badge: "bg-[#dc2626] text-white",
    accent: "text-white",
    logoSrc: himalayanLogo,
  },
  "Everest Bank": {
    headerBg: "bg-[#dc2626]",
    buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
    badge: "bg-[#dc2626] text-white",
    accent: "text-white",
    logoSrc: everestLogo,
  },
  "Sanima Bank": {
    headerBg: "bg-gradient-to-r from-[#2563eb] to-[#16a34a]",
    buttonBg: "bg-[#16a34a] hover:bg-[#15803d]",
    badge: "bg-[#2563eb] text-white",
    accent: "text-white",
    logoSrc: sanimaLogo,
  },
  "Kumari Bank": {
    headerBg: "bg-[#38bdf8]",
    buttonBg: "bg-[#38bdf8] hover:bg-[#0ea5e9]",
    badge: "bg-[#fde047] text-black",
    accent: "text-white",
    logoSrc: kumariLogo,
  },
  "Prabhu Bank": {
    headerBg: "bg-[#dc2626]",
    buttonBg: "bg-[#dc2626] hover:bg-[#b91c1c]",
    badge: "bg-[#dc2626] text-white",
    accent: "text-white",
    logoSrc: prabhuLogo,
  },
  "Rastriya Banijya Bank": {
    headerBg: "bg-gradient-to-r from-[#2563eb] via-[#d97706] to-[#dc2626]",
    buttonBg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    badge: "bg-[#d97706] text-white",
    accent: "text-white",
    logoSrc: rastriyaBanijyaLogo,
  },
  "Machhapuchchhre Bank": {
    headerBg: "bg-gradient-to-r from-[#2563eb] to-[#dc2626]",
    buttonBg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    badge: "bg-[#dc2626] text-white",
    accent: "text-white",
    logoSrc: machhapuchreLogo,
  },
};

const banks = [
  "Nabil Bank",
  "Global IME Bank",
  "NIC Asia Bank",
  "Nepal Investment Mega Bank",
  "Himalayan Bank",
  "Everest Bank",
  "Sanima Bank",
  "Siddhartha Bank",
  "Kumari Bank",
  "Prabhu Bank",
  "Nepal Bank",
  "Rastriya Banijya Bank",
  "Machhapuchchhre Bank",
];

const getPaymentIcon = (method) => {
  switch (method) {
    case "khalti":
    case "esewa":
      return Smartphone;
    case "card":
      return CreditCard;
    case "bank":
      return Banknote;
    case "cash":
      return ShieldCheck;
    default:
      return CreditCard;
  }
};

const formatDateTime = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const createVisitId = () => {
  return `VISIT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
};

const buildQrMatrix = (value) => {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  const finder = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  const placeFinder = (row, col) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        matrix[row + y][col + x] = finder[y][x] === 1;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  for (let i = 0; i < size; i += 1) {
    if (i !== 6) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }
  }

  const center = size - 7;
  matrix[center][center] = true;
  matrix[center - 1][center] = true;
  matrix[center][center - 1] = true;
  matrix[center - 1][center - 1] = true;

  const hash = Array.from(value).reduce((acc, char) => (acc * 37 + char.charCodeAt(0)) % 65535, 7);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inFinder = (y < 7 && x < 7) || (y < 7 && x >= size - 7) || (y >= size - 7 && x < 7);
      const inTiming = x === 6 || y === 6;
      const isCenter = y >= center && x >= center && y < center + 3 && x < center + 3;
      if (inFinder || inTiming || isCenter) continue;
      matrix[y][x] = ((hash + x * 3 + y * 5) % 2) === 0;
    }
  }

  return matrix;
};

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState("khalti");
  const [fields, setFields] = useState({
    phone: "",
    mpin: "",
    password: "",
    fullName: "",
    accountNumber: "",
    transactionPin: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    bankName: banks[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visitId, setVisitId] = useState(createVisitId());
  const [providerLoggedIn, setProviderLoggedIn] = useState(false);
  const [providerLoginLoading, setProviderLoginLoading] = useState(false);
  // PIN modal state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPin, setPendingPin] = useState("");
  const [pinProcessing, setPinProcessing] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalState, setTransactionModalState] = useState("idle");
  const [transactionModalMessage, setTransactionModalMessage] = useState("");
  const [providerRedirectOpen, setProviderRedirectOpen] = useState(false);
  const [providerRedirectMessage, setProviderRedirectMessage] = useState("");
  const [loggingOutOpen, setLoggingOutOpen] = useState(false);
  const [pendingMethod, setPendingMethod] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [successTitle, setSuccessTitle] = useState("Payment successful");
  const [successText, setSuccessText] = useState("Thanks — you're being redirected to confirmation.");

  const handleBack = () => {
    if (booking) {
      navigate("/book-appointment", {
        state: {
          bookingState: {
            ...booking,
            restoreStep: 4,
          },
        },
      });
      return;
    }
    navigate(-1);
  }; 
  const [transactionStatus, setTransactionStatus] = useState("idle");
  const [transactionMessage, setTransactionMessage] = useState("Waiting for provider login.");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const transactionTimers = useRef([]);
  const pinInputRef = useRef(null);

  const providerMeta = PROVIDER_META[method] || null;
  const selectedBankMeta = BANK_META[fields.bankName] || {
    headerBg: "bg-[#047857]",
    buttonBg: "bg-[#047857] hover:bg-[#065f46]",
    badge: "bg-[#047857] text-white",
    accent: "text-white",
  };
  const providerRequiresLogin = method === "khalti" || method === "esewa" || method === "bank";
  const actionLabel = method === "cash" ? "Book Now" : "Pay Now";

  const resetProviderSession = () => {
    setProviderLoggedIn(false);
  };

  const showProviderRedirectPopup = (providerName) => {
    setProviderRedirectMessage(`Redirect to ${providerName}? This feature is only available in the official ${providerName} app.`);
    setProviderRedirectOpen(true);
  };

  const loadPaymentHistory = () => {
    try {
      const saved = window.localStorage.getItem("appointment_payment_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore invalid history data
    }
    return [];
  };

  const savePaymentHistory = (history) => {
    try {
      window.localStorage.setItem("appointment_payment_history", JSON.stringify(history));
    } catch (e) {
      // ignore storage failures
    }
  };

  const addPaymentHistoryEntry = (entry) => {
    const next = [entry, ...paymentHistory].slice(0, 20);
    setPaymentHistory(next);
    savePaymentHistory(next);
  };

  const handleProviderLogin = () => {
    setError("");
    if (method === "khalti" || method === "esewa") {
      if (!/^[0-9]{10}$/.test(fields.phone)) {
        setError(`${METHOD_LABELS[method]} mobile number must be exactly 10 digits.`);
        return;
      }
      if (!fields.password || !fields.password.trim()) {
        setError("Password is required to login to your provider.");
        return;
      }
      setProviderLoginLoading(true);
      setTimeout(() => {
        setProviderLoggedIn(true);
        setProviderLoginLoading(false);
      }, 900);
      return;
    }
    if (method === "bank") {
      if (!fields.bankName.trim()) {
        setError("Please select a bank.");
        return;
      }
      if (!fields.fullName.trim()) {
        setError("Full name is required.");
        return;
      }
      if (!fields.accountNumber.trim()) {
        setError("Account number is required.");
        return;
      }
      if (!fields.password || !fields.password.trim()) {
        setError("Password is required to login to your bank.");
        return;
      }
      setProviderLoginLoading(true);
      setTimeout(() => {
        setProviderLoggedIn(true);
        setProviderLoginLoading(false);
      }, 900);
      return;
    }
  };

  useEffect(() => {
    try {
      const draft = JSON.parse(window.localStorage.getItem("appointment_payment_draft") || "null") || booking || {};
      draft.paymentMethod = METHOD_LABELS[method] || method;
      window.localStorage.setItem("appointment_payment_draft", JSON.stringify(draft));
    } catch (e) {
      // ignore
    }
  }, [method, booking]);

  useEffect(() => {
    const stateBooking = location.state?.booking;
    if (stateBooking) {
      setBooking(stateBooking);
      window.localStorage.setItem("appointment_payment_draft", JSON.stringify(stateBooking));
      if (stateBooking.paymentMethod) setMethod(stateBooking.paymentMethod);
      return;
    }

    const stored = window.localStorage.getItem("appointment_payment_draft");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooking(parsed);
        if (parsed.paymentMethod) setMethod(parsed.paymentMethod);
      } catch (err) {
        window.localStorage.removeItem("appointment_payment_draft");
      }
    }
  }, [location.state]);

  useEffect(() => {
    setVisitId((prev) => prev || createVisitId());
  }, []);

  const handleMethodChange = (key) => {
    if (key === method) return;
    // if already logged in to a provider, show a brief "logging out" popup
    if (providerLoggedIn) {
      setPendingMethod(key);
      setLoggingOutOpen(true);
      setTimeout(() => {
        setProviderLoggedIn(false);
        setLoggingOutOpen(false);
        setMethod(key);
        setPendingMethod(null);
      }, 1500);
      return;
    }
    setMethod(key);
  };

  useEffect(() => {
    resetProviderSession();
    setTransactionStatus("idle");
    setTransactionMessage("Waiting for provider login.");
  }, [method]);

  useEffect(() => {
    setPaymentHistory(loadPaymentHistory());
  }, []);

  useEffect(() => {
    return () => {
      transactionTimers.current.forEach(clearTimeout);
    };
  }, []);

  // Keyboard support for PIN modal
  useEffect(() => {
    if (!pinModalOpen) return;
    const handleKeyDown = (e) => {
      if (pinProcessing) return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        addPinDigit(parseInt(e.key, 10));
      } else if (e.key === "Backspace") {
        e.preventDefault();
        backspacePin();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (pendingPin.length === 4) handleConfirmPin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pinModalOpen, pinProcessing, pendingPin]);

  useEffect(() => {
    if (pinModalOpen && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [pinModalOpen]);

  const doctorName = useMemo(() => {
    if (!booking?.doctor) return "Unknown Doctor";
    return booking.doctor.name ? booking.doctor.name : `${booking.doctor.first_name || ""} ${booking.doctor.last_name || ""}`.trim();
  }, [booking]);

  const qrCells = useMemo(() => buildQrMatrix(visitId), [visitId]);

  const normalizeCardNumber = (value) => value.replace(/\s+/g, "");

  const failTransactionInvalidCardDetails = (message = "Card details invalid. Please check your card details.") => {
    setLoading(false);
    setTransactionStatus("failed");
    setTransactionModalOpen(true);
    setTransactionModalState("failed");
    setTransactionModalMessage(message);
    setTransactionMessage("Transaction failed due to invalid card details.");
    setError("Card details invalid. Please check your card information.");
    setPinProcessing(false);
    if (pinModalOpen) {
      setPinModalOpen(false);
    }
  };

  const validate = () => {
    setError("");
    if (method === "khalti" || method === "esewa") {
      if (!/^[0-9]{10}$/.test(fields.phone)) {
        setError("Phone number must be exactly 10 digits.");
        return false;
      }
    }
    if (method === "bank") {
      if (!fields.fullName.trim()) {
        setError("Full name is required.");
        return false;
      }
      if (!fields.accountNumber.trim()) {
        setError("Account number is required.");
        return false;
      }
    }
    if (method === "card") {
      if (!fields.cardName.trim()) {
        setError("Cardholder name is required.");
        return false;
      }
      const rawCard = normalizeCardNumber(fields.cardNumber);
      if (!/^[0-9]{12,19}$/.test(rawCard)) {
        setError("Card number must be between 12 and 19 digits.");
        return false;
      }
      if (!fields.expiry) {
        setError("Expiry date is required.");
        return false;
      }
      let expDate = null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(fields.expiry)) {
        expDate = new Date(fields.expiry);
      } else if (/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(fields.expiry)) {
        const [m, yy] = fields.expiry.split('/');
        expDate = new Date(`20${yy}-${m}-01`);
      } else if (/^\d{4}-\d{2}$/.test(fields.expiry)) {
        const [y, m] = fields.expiry.split('-');
        expDate = new Date(`${y}-${m}-01`);
      } else {
        setError("Expiry must be a valid date.");
        return false;
      }
      if (!expDate || Number.isNaN(expDate.getTime())) {
        setError("Expiry must be a valid date.");
        return false;
      }
      const now = new Date();
      const expYear = expDate.getFullYear();
      const expMonth = expDate.getMonth();
      if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth())) {
        setError("Card expired");
        return false;
      }
      if (!/^[0-9]{3,4}$/.test(fields.cvv)) {
        setError("CVV must be 3 or 4 digits.");
        return false;
      }
    }
    return true;
  };

  const isValidForSubmit = () => {
    if (method === "cash") return true;
    // If provider requires login, only require that the provider is logged in.
    if (providerRequiresLogin) return providerLoggedIn;
    if (method === "card") {
      if (!fields.cardName.trim()) return false;
      if (!/^[0-9]{12,19}$/.test(fields.cardNumber.replace(/\s+/g, ""))) return false;
      if (!fields.expiry) return false;
      if (!/^[0-9]{3,4}$/.test(fields.cvv)) return false;
    }
    return true;
  };

  const canSubmit = useMemo(() => isValidForSubmit(), [method, fields, providerLoggedIn]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 shadow-lg p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No booking details found</h2>
          <p className="text-gray-600 mb-6">Please select a doctor and complete the appointment flow first.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/doctors")}
              className="rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Browse Doctors
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-emerald-600 px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFieldChange = (key, value) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const completePayment = () => {
    setLoading(false);
    setTransactionStatus("completed");
    setTransactionMessage(method === "cash" ? "Cash payment confirmed. Please pay at the clinic." : "Payment confirmed. Redirecting...");
    setSuccessTitle(method === "cash" ? "Appointment confirmed" : "Transaction successful");
    setSuccessText(method === "cash" ? "Your appointment has been booked successfully." : "Your payment was successful. Redirecting to appointment confirmation.");
    setTransactionModalState("success");
    setTransactionModalMessage(method === "cash" ? "Your appointment is booked successfully." : "Your payment completed successfully.");
    setTransactionModalOpen(true);
    
    const transactionId = `${METHOD_LABELS[method].toUpperCase().replace(/\s+/g, '')}-${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
    const now = new Date();
    const entry = {
      id: `PAY${String(Date.now()).slice(-6)}`,
      date: now.toISOString().split('T')[0],
      amount: booking?.doctor?.consultationFee ?? 0,
      method: METHOD_LABELS[method],
      doctor: doctorName,
      service: "Consultation",
      status: method === "cash" ? "pending" : "completed",
      transactionId: transactionId,
      timestamp: now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
    };
    addPaymentHistoryEntry(entry);
    window.localStorage.removeItem("appointment_payment_draft");
    if (pinModalOpen) {
      setPinModalOpen(false);
    }
    setPinProcessing(false);
  };

  // central payment flow so it can be reused from submit and PIN confirm
  const proceedWithPayment = () => {
    setTransactionModalOpen(true);
    setTransactionModalState("loading");
    setTransactionModalMessage("Processing payment...");
    setLoading(true);
    setTransactionStatus("pending");
    setTransactionMessage("Initiating secure transaction...");
    transactionTimers.current.forEach(clearTimeout);
    transactionTimers.current = [];

    const pendingTimer = window.setTimeout(() => {
      setTransactionStatus("processing");
      setTransactionMessage("Verifying transaction status...");
      setTransactionModalMessage("Verifying your transaction...");
    }, 1000);

    const resultTimer = window.setTimeout(() => {
      const successful = Math.random() > 0.05;
      if (successful) {
        completePayment();
      } else {
        setLoading(false);
        setTransactionStatus("failed");
        setTransactionModalState("failed");
        setTransactionModalMessage("Internal server error. Please try again in a few minutes.");
        setTransactionMessage("Internal server error. Please try again in a few minutes.");
        setError("Internal server error. Please try again in a few minutes.");
        setPinProcessing(false);
      }
    }, 2600);

    transactionTimers.current.push(pendingTimer, resultTimer);
  };

  const handleSubmit = () => {
    if (providerRequiresLogin && !providerLoggedIn) {
      setError("Please login to your selected payment provider first.");
      return;
    }

    // For provider methods, prompt for PIN in a modal if not already provided
    const pinKey = method === "bank" ? "transactionPin" : "mpin";
    if (providerRequiresLogin && providerLoggedIn && !/^[0-9]{4}$/.test(fields[pinKey])) {
      setPendingPin("");
      setPinModalOpen(true);
      return;
    }

    if (method !== "cash") {
      if (method === "card") {
        const rawCard = normalizeCardNumber(fields.cardNumber);
        if (/^[0-9]{12,19}$/.test(rawCard) && !/^[357]/.test(rawCard)) {
          failTransactionInvalidCardDetails("Card details invalid. Card number must begin with 3, 5, or 7.");
          return;
        }
      }
      if (!validate()) return;
    }
    setError("");
    if (method === "cash") {
      setTransactionStatus("completed");
      setTransactionMessage("Cash appointment confirmed. Pay at the clinic.");
      completePayment();
      return;
    }

    // proceed with the payment flow
    proceedWithPayment();
  };

  const handleConfirmPin = () => {
    const pin = (pendingPin || "").replace(/[^0-9]/g, "").slice(0, 4);
    if (!/^[0-9]{4}$/.test(pin)) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }
    const pinKey = method === "bank" ? "transactionPin" : "mpin";
    setFields((cur) => ({ ...cur, [pinKey]: pin }));
    setPendingPin("");
    setPinProcessing(true);
    setTransactionModalOpen(true);
    setTransactionModalState("loading");
    setTransactionModalMessage("Processing payment...");
    setPinModalOpen(false);
    setTimeout(() => {
      proceedWithPayment();
    }, 120);
  };

  const handleTransactionModalDone = () => {
    setTransactionModalOpen(false);
    setLoading(false);
    setPinProcessing(false);
    navigate("/appointment", {
      state: {
        booking: {
          ...booking,
          paymentMethod: METHOD_LABELS[method],
          visitId: method === "cash" ? visitId : undefined,
        },
      },
    });
  };

  const handleTransactionRetry = () => {
    setTransactionModalOpen(false);
    setTransactionModalState("idle");
    setTransactionModalMessage("");
    setError("");
    setTransactionStatus("idle");
    navigate("/book-appointment", {
      state: {
        bookingState: {
          ...booking,
          restoreStep: 4,
        },
      },
    });
  };

  const addPinDigit = (d) => {
    if (pinProcessing) return;
    setPendingPin((p) => (p.length < 4 ? p + String(d) : p));
  };

  const backspacePin = () => {
    if (pinProcessing) return;
    setPendingPin((p) => p.slice(0, -1));
  };

  const handlePinInputChange = (value) => {
    if (pinProcessing) return;
    setPendingPin(value.replace(/[^0-9]/g, "").slice(0, 4));
  };

  const clearPin = () => {
    if (pinProcessing) return;
    setPendingPin("");
  };

  // Formatting helpers
  const formatCardNumber = (value) => value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value) => {
    const v = String(value || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const d = new Date(v);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = String(d.getFullYear()).slice(-2);
      return `${mm}/${yy}`;
    }
    if (/^\d{2}\/\d{2}$/.test(v)) return v;
    return "";
  };

  const handleFieldChangeFormatted = (key, value) => {
    if (key === 'cardNumber') value = formatCardNumber(value);
    if (key === 'expiry') {
      // accept full date (YYYY-MM-DD) from a date picker, or MM/YY typed, or YYYY-MM month
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        // store ISO date (full date)
        // keep value as-is
      } else if (/^\d{2}\/\d{2}$/.test(value)) {
        const [m, yy] = value.split('/');
        value = `20${yy}-${m.padStart(2, '0')}-01`;
      } else if (/^\d{4}-\d{2}$/.test(value)) {
        const [y, m] = value.split('-');
        value = `${y}-${m}-01`;
      }
    }
    if (key === 'phone') value = value.replace(/[^0-9]/g, '').slice(0,10);
    if (key === 'cvv' || key === 'mpin' || key === 'transactionPin') value = value.replace(/[^0-9]/g, '').slice(0,4);
    setFields((current) => ({ ...current, [key]: value }));
  };

  const copyVisitId = async () => {
    try {
      await navigator.clipboard.writeText(visitId);
      // small success feedback
      setError('Visit ID copied to clipboard');
      setTimeout(() => setError(''), 1400);
    } catch (err) {
      setError('Unable to copy Visit ID');
      setTimeout(() => setError(''), 1400);
    }
  };

  const downloadQrSvg = () => {
    const svg = document.querySelector('#payment-qr-svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${visitId}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const SummaryRow = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
      <span>{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4 py-10">
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">{transactionModalState === "loading" ? "Processing payment" : transactionModalState === "success" ? "Success" : "Transaction failed"}</p>
                <p className="mt-2 text-sm text-gray-600">{transactionModalMessage}</p>
              </div>
              <button type="button" onClick={() => setTransactionModalOpen(false)} className="rounded-full px-3 py-2 text-gray-500 hover:bg-gray-100">
                ✕
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center">
              {transactionModalState === "loading" ? (
                <svg className="h-12 w-12 animate-spin text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : transactionModalState === "success" ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-3xl">✓</div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-3xl">✕</div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {transactionModalState === "failed" ? (
                <button type="button" onClick={handleTransactionRetry} className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700">
                  Try again
                </button>
              ) : null}
              {transactionModalState === "success" ? (
                <button type="button" onClick={handleTransactionModalDone} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                  Done
                </button>
              ) : (
                <button type="button" onClick={() => setTransactionModalOpen(false)} className="rounded-full bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
            <p className="text-lg font-semibold text-gray-900">Cancel payment?</p>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to cancel your payment? You'll be returned to the booking step.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button onClick={() => setShowCancelConfirm(false)} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">No, keep payment</button>
              <button onClick={() => { setShowCancelConfirm(false); navigate('/book-appointment', { state: { bookingState: { ...booking, restoreStep: 4 } } }); }} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">Yes, cancel</button>
            </div>
          </div>
        </div>
      )}
      {loggingOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <p className="text-lg font-semibold text-gray-900">Logging out</p>
            <p className="mt-2 text-sm text-gray-600">Switching to the selected payment service...</p>
            <div className="mt-6 flex items-center justify-center">
              <svg className="h-10 w-10 animate-spin text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {providerRedirectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Redirect to provider</h3>
            <p className="text-sm text-gray-600 mb-6">{providerRedirectMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProviderRedirectOpen(false)}
                className="rounded-2xl px-4 py-2 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setProviderRedirectOpen(false)}
                className="rounded-2xl px-4 py-2 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                Open App
              </button>
            </div>
          </div>
        </div>
      )}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter 4-digit {method === 'bank' ? 'Transaction PIN' : 'MPIN'}</h3>
            <p className="text-sm text-gray-600 mb-4">Please enter your 4-digit PIN to confirm payment.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter 4-digit {method === 'bank' ? 'Transaction PIN' : 'MPIN'}</label>
              <input
                ref={pinInputRef}
                type="password"
                inputMode="numeric"
                value={pendingPin}
                onChange={(e) => handlePinInputChange(e.target.value)}
                maxLength={4}
                placeholder="••••"
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg tracking-[0.5em] text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
              />
            </div>
            <div className="flex justify-center gap-3 mb-4">
              {[0,1,2,3].map((i) => (
                <div key={i} className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 text-2xl">
                  {pendingPin[i] ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1,2,3,4,5,6,7,8,9].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => addPinDigit(d)}
                  disabled={pinProcessing}
                  className="rounded-xl py-3 bg-gray-100 hover:bg-gray-200 text-lg font-medium"
                >
                  {d}
                </button>
              ))}
              <button type="button" onClick={clearPin} disabled={pinProcessing} className="rounded-xl py-3 bg-gray-100 hover:bg-gray-200 text-sm">Clear</button>
              <button type="button" onClick={() => addPinDigit(0)} disabled={pinProcessing} className="rounded-xl py-3 bg-gray-100 hover:bg-gray-200 text-lg">0</button>
              <button type="button" onClick={backspacePin} disabled={pinProcessing} className="rounded-xl py-3 bg-gray-100 hover:bg-gray-200 text-lg">⌫</button>
            </div>

            <div className="flex justify-end gap-3 items-center">
              <button
                type="button"
                onClick={() => { if (!pinProcessing) { setPinModalOpen(false); setPendingPin(""); } }}
                className="rounded-2xl px-4 py-2 border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                disabled={pinProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPin}
                disabled={pendingPin.length !== 4 || pinProcessing}
                className={`rounded-2xl px-4 py-2 bg-emerald-600 text-white text-sm font-semibold ${(pendingPin.length !== 4 || pinProcessing) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-emerald-700'}`}
              >
                {pinProcessing ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-[1200px] mx-auto grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-emerald-700 font-semibold uppercase tracking-[0.3em]">Payment</p>
              <h1 className="mt-3 text-3xl font-extrabold text-gray-900">Complete your booking</h1>
            </div>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="text-lg font-bold text-gray-900">{doctorName}</p>
                  <p className="text-sm text-emerald-700">{booking?.doctor?.specialty || "General Health"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-2xl font-extrabold text-emerald-700">Rs {booking?.doctor?.consultationFee ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Select payment method</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(METHOD_LABELS).map(([key, label]) => {
                  const Icon = getPaymentIcon(key);
                  const providerOption = PROVIDER_META[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleMethodChange(key)}
                      className={`flex items-center gap-3 rounded-3xl border p-4 text-left transition-all duration-200 transform ${method === key ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-gray-200 bg-white hover:border-emerald-200 hover:-translate-y-0.5"} focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2`}
                    >
                      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${providerOption ? `${key === "khalti" ? "bg-[#6f46eb] text-white" : "bg-[#16a34a] text-white"}` : "bg-emerald-100 text-emerald-700"}`}>
                        {providerOption ? (
                          <img src={providerOption.logoSrc} alt={`${providerOption.brand} logo`} className="h-6 w-auto object-contain" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </span>
                      <span className="font-semibold text-gray-900">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Payment details</p>
              {method === "khalti" || method === "esewa" ? (
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-gray-200 overflow-hidden">
                    <div className={`p-5 ${providerMeta?.headerBg || "bg-gray-800"}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                          {providerMeta?.logoSrc ? (
                            <img
                              src={providerMeta.logoSrc}
                              alt={`${providerMeta.brand} logo`}
                              className="h-8 w-auto object-contain"
                            />
                          ) : (
                            <span className="text-white text-xl font-bold">{providerMeta?.brand?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{providerMeta?.brand}</p>
                          <p className="text-sm text-white/80">
                            {providerLoggedIn ? "Wallet Connected" : `Enter your ${providerMeta?.brand} credentials`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!providerLoggedIn ? (
                      <div className="bg-white p-6 grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{providerMeta?.brand} Mobile Number</label>
                          <input
                            type="tel"
                            value={fields.phone}
                            onChange={(e) => handleFieldChangeFormatted("phone", e.target.value)}
                            placeholder="9841234567"
                            className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{providerMeta?.brand} Password</label>
                          <input
                            type="password"
                            value={fields.password}
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                            disabled={providerLoginLoading}
                            placeholder="Enter your password"
                            className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleProviderLogin}
                          disabled={providerLoggedIn || providerLoginLoading}
                          className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold text-white ${providerMeta?.buttonBg || "bg-gray-800"} ${(providerLoggedIn || providerLoginLoading) ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {providerLoggedIn ? "Connected" : providerLoginLoading ? "Connecting..." : `Login to ${providerMeta?.brand}`}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-b from-gray-50 to-white p-6">
                        <div className={`${providerMeta?.headerBg} rounded-3xl p-6 mb-6 text-white`}>
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <p className="text-sm opacity-90">Balance</p>
                              <p className="text-3xl font-bold mt-1">{providerMeta?.brand === "Khalti" ? "NPR" : "Rs"} XXXX.XX</p>
                            </div>
                            <div className="text-3xl">💰</div>
                          </div>
                          <div className="border-t border-white/20 pt-4">
                            <p className="text-sm opacity-90">Rewards / Points</p>
                            <p className="text-2xl font-bold mt-1">XXXX.XX</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => showProviderRedirectPopup(providerMeta?.brand || "this service")} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-2xl">📤</span>
                            <span className="text-xs font-medium text-gray-700">Send Money</span>
                          </button>
                          <button type="button" onClick={() => showProviderRedirectPopup(providerMeta?.brand || "this service")} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-2xl">💳</span>
                            <span className="text-xs font-medium text-gray-700">Load Money</span>
                          </button>
                          <button type="button" onClick={() => showProviderRedirectPopup(providerMeta?.brand || "this service")} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-2xl">🏦</span>
                            <span className="text-xs font-medium text-gray-700">Transfer</span>
                          </button>
                          <button type="button" onClick={() => showProviderRedirectPopup(providerMeta?.brand || "this service")} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-2xl">💸</span>
                            <span className="text-xs font-medium text-gray-700">Withdraw</span>
                          </button>
                        </div>

                        <div className="mt-6 text-center text-sm text-gray-600">
                          You are logged in. Click <span className="font-semibold">Pay Now</span> below to complete payment.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : method === "bank" ? (
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-gray-200 overflow-hidden">
                    <div className={`p-5 ${selectedBankMeta.headerBg}`}>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selectedBankMeta.badge} ${selectedBankMeta.logoSrc ? "p-2" : "text-xl font-bold"}`}>
                          {selectedBankMeta.logoSrc ? (
                            <img
                              src={selectedBankMeta.logoSrc}
                              alt={`${fields.bankName} logo`}
                              className="h-full w-auto object-contain"
                            />
                          ) : (
                            fields.bankName.split(" ").map((word) => word[0]).join("")
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{fields.bankName}</p>
                          <p className="text-sm text-white/80">
                            {providerLoggedIn ? "Connected" : "Log in with your bank credentials"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank</label>
                        <select
                          value={fields.bankName}
                          onChange={(e) => handleFieldChange("bankName", e.target.value)}
                          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                        >
                          {banks.map((bank) => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                        <input
                          type="text"
                          value={fields.fullName}
                          onChange={(e) => handleFieldChange("fullName", e.target.value)}
                          placeholder="Ram Shrestha"
                          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account number / Bank ID</label>
                        <input
                          type="text"
                          value={fields.accountNumber}
                          onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
                          placeholder="123456789012"
                          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                          type="password"
                          value={fields.password}
                          onChange={(e) => handleFieldChange("password", e.target.value)}
                          disabled={providerLoginLoading}
                          placeholder="Enter your password"
                          className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                        />
                      </div>
                      {!providerLoggedIn ? (
                        <>
                          <button
                            type="button"
                            onClick={handleProviderLogin}
                            disabled={providerLoggedIn || providerLoginLoading}
                            className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold text-white ${selectedBankMeta.buttonBg} ${(providerLoggedIn || providerLoginLoading) ? "opacity-70 cursor-not-allowed" : ""}`}
                          >
                            {providerLoggedIn ? "Connected" : providerLoginLoading ? "Connecting..." : "Login to bank"}
                          </button>
                        </>
                      ) : (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-gray-700 shadow-sm">
                          <div className={`mb-5 rounded-[1.5rem] p-5 text-white shadow-inner ${selectedBankMeta.headerBg}`}>
                            <div className="flex items-center justify-between gap-4 mb-5">
                              <div>
                                <p className="text-xs uppercase opacity-80">{fields.bankName}</p>
                                <p className="mt-3 text-3xl font-semibold">Rs XXXX.XX</p>
                              </div>
                              <div className="text-3xl">🏦</div>
                            </div>
                            <div className="rounded-3xl bg-white/10 p-4">
                              <p className="text-xs uppercase opacity-80">Last login</p>
                              <p className="mt-2 text-2xl font-semibold">Today</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <button type="button" onClick={() => showProviderRedirectPopup(fields.bankName)} className="flex flex-col items-center gap-2 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-white transition">
                              <span className="text-2xl">💱</span>
                              Transfer
                            </button>
                            <button type="button" onClick={() => showProviderRedirectPopup(fields.bankName)} className="flex flex-col items-center gap-2 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-white transition">
                              <span className="text-2xl">📄</span>
                              Statements
                            </button>
                            <button type="button" onClick={() => showProviderRedirectPopup(fields.bankName)} className="flex flex-col items-center gap-2 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-white transition">
                              <span className="text-2xl">💳</span>
                              Pay Bills
                            </button>
                            <button type="button" onClick={() => showProviderRedirectPopup(fields.bankName)} className="flex flex-col items-center gap-2 rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-white transition">
                              <span className="text-2xl">🔒</span>
                              Secure Login
                            </button>
                          </div>
                          <div className="text-center text-sm text-gray-600">Bank login successful. Click <span className="font-semibold">Pay Now</span> to continue.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : method === "card" ? (
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder name</label>
                    <input
                      type="text"
                      value={fields.cardName}
                      onChange={(e) => handleFieldChange("cardName", e.target.value)}
                      placeholder="Ram Shrestha"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card number</label>
                    <input
                      type="text"
                      value={fields.cardNumber}
                      onChange={(e) => handleFieldChangeFormatted("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                      <input
                        type="month"
                        value={fields.expiry && fields.expiry.length === 5 ? `20${fields.expiry.split('/')[1]}-${fields.expiry.split('/')[0]}` : ''}
                        onChange={(e) => handleFieldChangeFormatted("expiry", e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        value={fields.cvv}
                        onChange={(e) => handleFieldChangeFormatted("cvv", e.target.value)}
                        placeholder="123"
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
                    Please take the QR code or visit ID to the clinic on the day of your appointment.
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-white p-5">
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                        <input
                          type="text"
                          value={fields.fullName}
                          onChange={(e) => handleFieldChange("fullName", e.target.value)}
                          placeholder="Full name"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                        <input
                          type="tel"
                          value={fields.phone}
                          onChange={(e) => handleFieldChangeFormatted("phone", e.target.value)}
                          placeholder="98XXXXXXXX"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                        />
                      </div>
                      <span className="text-sm text-gray-500">Visit ID</span>
                      <span className="text-lg font-semibold text-gray-900">{visitId}</span>
                      <div className="w-full rounded-3xl overflow-hidden border border-gray-200 bg-white p-3 inline-flex justify-center">
                        <svg id="payment-qr-svg" viewBox="0 0 150 150" className="w-48 h-48">
                          {qrCells.map((row, rowIndex) =>
                            row.map((value, colIndex) => (
                              <rect
                                key={`${rowIndex}-${colIndex}`}
                                x={12 + colIndex * 6}
                                y={12 + rowIndex * 6}
                                width="5"
                                height="5"
                                rx="1"
                                fill={value ? "#111827" : "#f8fafc"}
                              />
                            ))
                          )}
                        </svg>
                      </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={copyVisitId}
                            title="Copy Visit ID"
                            className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm hover:bg-emerald-100 hover:shadow-sm transform hover:-translate-y-0.5 transition"
                          >
                            Copy Visit ID
                          </button>
                          <button
                            type="button"
                            onClick={downloadQrSvg}
                            title="Download QR (SVG)"
                            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm hover:bg-gray-50 hover:shadow-sm transform hover:-translate-y-0.5 transition"
                          >
                            Download QR (SVG)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <p className="text-sm font-semibold text-emerald-700 mb-4">Payment summary</p>
              <SummaryRow label="Doctor" value={doctorName} />
              <SummaryRow label="Specialist" value={booking?.doctor?.specialty || "General Health"} />
              <SummaryRow label="Date" value={formatDateTime(booking.selectedDate)} />
              <SummaryRow label="Time" value={booking.selectedTime || "Not selected"} />
              <SummaryRow label="Method" value={METHOD_LABELS[method]} />
              <div className="mt-4 border-t border-emerald-100 pt-4 text-sm text-gray-700">
                <div className="flex items-center justify-between font-semibold text-gray-900">
                  <span>Total amount</span>
                  <span>Rs {booking?.doctor?.consultationFee ?? 0}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row items-stretch sm:items-center justify-between">
              <Link
                to="/book-appointment"
                state={{ doctor: booking.doctor }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Back to Booking
              </Link>
              <div className="inline-flex items-center gap-3">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : null}
                  {success ? "Success! Redirecting..." : loading ? "Processing payment..." : actionLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Recent payments</p>
                <p className="text-sm text-gray-500">Quick history from your last checkout attempts.</p>
              </div>
            </div>
            <div className="space-y-4">
              {paymentHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No recent payments yet.</p>
              ) : (
                paymentHistory.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">{item.method}</p>
                        <p className="text-gray-500">{item.date} · {item.doctor}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Completed" ? "bg-emerald-100 text-emerald-700" : item.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                      <span>ID {item.id}</span>
                      <span className="font-semibold">{item.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Transaction status</p>
                <p className="text-sm text-gray-500">{transactionMessage}</p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${transactionStatus === "completed" ? "bg-emerald-100 text-emerald-700" : transactionStatus === "processing" || transactionStatus === "pending" ? "bg-amber-100 text-amber-700" : transactionStatus === "failed" ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-700"}`}>
                {(transactionStatus === "processing" || transactionStatus === "pending") && (
                  <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                <span>{transactionStatus === "pending" ? "Pending" : transactionStatus === "processing" ? "Processing" : transactionStatus === "failed" ? "Failed" : transactionStatus === "completed" ? "Completed" : "Idle"}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {transactionStatus === "completed" ? (
                <p>Your latest transaction was completed successfully.</p>
              ) : transactionStatus === "failed" ? (
                <p className="text-rose-600">If the payment fails again, try another provider or verify your details.</p>
              ) : (
                <p>Transaction status updates as the payment progresses.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Secure payment experience</p>
                <p className="text-sm text-gray-500">Complete your transaction with trusted providers and finish booking your appointment securely.</p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <p>• Use a 10-digit mobile number for Khalti and eSewa.</p>
              <p>• Card entries are validated for a realistic payment flow.</p>
              <p>• Enter the credentials for your selected payment provider and proceed to pay.</p>
              <p>• After successful payment, you will be redirected to the booking confirmation page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
