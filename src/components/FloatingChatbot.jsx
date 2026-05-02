import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";

const API_BASE = "http://localhost:3000/api";

const hiddenPrefixes = ["/admin", "/doctor/"];
const hiddenRoutes = ["/login", "/register", "/admin/login", "/doctor/login"];

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return (
      localStorage.getItem("userId") ||
      localStorage.getItem("patientId") ||
      user?.id ||
      user?.user_id ||
      null
    );
  } catch {
    return localStorage.getItem("userId") || null;
  }
};

export default function FloatingChatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openChat, setOpenChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! I can help find a doctor and prepare an appointment for you.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [speechLang, setSpeechLang] = useState("ne-NP");

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputValueRef = useRef("");

  const hidden =
    hiddenRoutes.includes(location.pathname) ||
    hiddenPrefixes.some((prefix) => location.pathname.startsWith(prefix));

  useEffect(() => {
    inputValueRef.current = input;
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, openChat]);

  useEffect(() => {
    return () => {
      clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.stop();
      speechSynthesis.cancel();
    };
  }, []);

  if (hidden) return null;

  const stopSpeaking = () => speechSynthesis.cancel();

  const speak = (text, isNepali = false) => {
    if (!isSpeakingEnabled || !text) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isNepali ? "ne-NP" : "en-US";
    utterance.rate = 0.95;
    const voices = speechSynthesis.getVoices();
    const targetLang = isNepali ? "ne" : "en";
    const match = voices.find((voice) => voice.lang.startsWith(targetLang));
    if (match) utterance.voice = match;
    speechSynthesis.speak(utterance);
  };

  const stopListening = () => {
    clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    stopListening();
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    inputValueRef.current = "";
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          userId: getUserId(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Chatbot request failed.");
      }

      const botMessage = {
        sender: "bot",
        text: data.data?.reply || "I am here to help.",
        isNepali: data.data?.isNepali,
        action: data.data?.action || null,
      };
      setMessages((prev) => [...prev, botMessage]);
      speak(botMessage.text, botMessage.isNepali);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: err.message || "Server error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Voice input is not supported in this browser. You can still type here.",
        },
      ]);
      return;
    }

    stopListening();

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setInput(transcript);
      inputValueRef.current = transcript;

      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (inputValueRef.current.trim()) {
          sendMessage(inputValueRef.current);
        }
      }, 900);
    };

    recognition.onerror = (event) => {
      if (event.error === "language-not-supported") {
        setSpeechLang("en-US");
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current && isListening) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleAction = (action) => {
    if (action?.type !== "prefill_booking") return;
    navigate("/book-appointment", {
      state: {
        doctor: action.doctor,
        bookingDraft: action.bookingDraft,
      },
    });
    setOpenChat(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {openChat && (
        <div className="flex h-[560px] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-teal-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Appointment Assistant</p>
              <p className="text-xs text-teal-100">Nepal healthcare help</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSpeechLang((lang) => (lang === "ne-NP" ? "en-US" : "ne-NP"))
                }
                className="rounded-full bg-teal-500 px-2 py-1 text-xs font-semibold hover:bg-teal-400"
              >
                {speechLang === "ne-NP" ? "NE" : "EN"}
              </button>
              <button
                type="button"
                onClick={() => setOpenChat(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-teal-500"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex flex-col ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "rounded-tr-sm bg-teal-600 text-white"
                      : "rounded-tl-sm border border-gray-100 bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
                {message.action && (
                  <button
                    type="button"
                    onClick={() => handleAction(message.action)}
                    className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-600"
                  >
                    Continue booking
                  </button>
                )}
                {message.sender === "bot" && (
                  <div className="mt-1 flex items-center gap-1 text-gray-400">
                    <button
                      type="button"
                      onClick={() => speak(message.text, message.isNepali)}
                      className="rounded px-1 hover:text-teal-600"
                      aria-label="Replay response"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      className="rounded px-1 hover:text-red-500"
                      aria-label="Stop voice"
                    >
                      <Square className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSpeakingEnabled((value) => !value)}
                      className="rounded px-1 hover:text-gray-600"
                      aria-label="Toggle voice"
                    >
                      {isSpeakingEnabled ? (
                        <Volume2 className="h-3.5 w-3.5" />
                      ) : (
                        <VolumeX className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-2 shadow-sm">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
            <input
              type="text"
              placeholder={speechLang === "ne-NP" ? "Sodhnuhos..." : "Ask something..."}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-400 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                isListening
                  ? "animate-pulse border-red-400 bg-red-100 text-red-600"
                  : "border-gray-300 bg-gray-100 text-gray-600 hover:border-teal-400"
              }`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpenChat((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700"
        aria-label="Open appointment assistant"
      >
        {openChat ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
