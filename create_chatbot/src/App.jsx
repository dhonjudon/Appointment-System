import { useState, useRef, useEffect } from "react";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [openChat, setOpenChat] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [speechLang, setSpeechLang] = useState("ne-NP"); // default Nepali

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputValueRef = useRef(""); // track input for closure-safe access

  // Keep ref in sync with state
  useEffect(() => {
    inputValueRef.current = input;
  }, [input]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ────────────────────────────────────────────────
  // 🎤 Speech Recognition — supports ne-NP + en-US
  // ────────────────────────────────────────────────
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Try Chrome.");
      return;
    }

    stopListening(); // reset any existing instance

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang; // ne-NP or en-US
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
      inputValueRef.current = transcript;

      // Reset silence timer on every result
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (inputValueRef.current.trim()) {
          sendMessage(inputValueRef.current);
        }
      }, 900); // 0.9s silence → auto-send
    };

    recognition.onerror = (e) => {
      console.warn("Speech error:", e.error);
      if (e.error === "language-not-supported") {
        // Fallback to English if Nepali not supported
        setSpeechLang("en-US");
        alert(
          "Nepali speech not supported on this device. Switching to English.",
        );
      }
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (recognitionRef.current && isListening) {
        try {
          recognition.start();
        } catch (_) {}
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  // ────────────────────────────────────────────────
  // 🔊 Text-to-Speech — auto Nepali or English voice
  // ────────────────────────────────────────────────
  const speak = (text, isNepali = false) => {
    if (!isSpeakingEnabled) return;
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isNepali ? "ne-NP" : "en-US";
    utterance.rate = 0.95;

    // Try to find a matching voice
    const voices = speechSynthesis.getVoices();
    const targetLang = isNepali ? "ne" : "en";
    const match = voices.find((v) => v.lang.startsWith(targetLang));
    if (match) utterance.voice = match;

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => speechSynthesis.cancel();

  // ────────────────────────────────────────────────
  // 💬 Send Message
  // ────────────────────────────────────────────────
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    stopListening();

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    inputValueRef.current = "";
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const botMessage = {
        sender: "bot",
        text: data.reply,
        isNepali: data.isNepali,
      };
      setMessages((prev) => [...prev, botMessage]);
      speak(data.reply, data.isNepali);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Server error. Please try again.",
          isNepali: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-end justify-end p-4">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setOpenChat((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-teal-600 text-white text-2xl shadow-lg hover:bg-teal-700 transition-all flex items-center justify-center z-10"
        title="Toggle Chat"
      >
        {openChat ? "X" : "think"}
      </button>

      {/* Chat Window */}
      {openChat && (
        <div
          className="absolute bottom-20 right-4 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          style={{ height: "560px" }}
        >
          {/* Header */}
          <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">
                Doctor Appointment Assistant
              </p>
              <p className="text-xs text-teal-100">Nepal Healthcare Help</p>
            </div>
            {/* Language Toggle */}
            <button
              onClick={() =>
                setSpeechLang((l) => (l === "ne-NP" ? "en-US" : "ne-NP"))
              }
              className="text-xs bg-teal-500 hover:bg-teal-400 px-2 py-1 rounded-full"
              title="Toggle speech language"
            >
              {speechLang === "ne-NP" ? "🇳🇵 NE" : "🇺🇸 EN"}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-xs mt-8 px-4">
                <p className="text-3xl mb-2"></p>
                <p>Namaste! How can I help you today?</p>
                <p className="mt-1">
                  नमस्ते! म तपाईंलाई कसरी सहयोग गर्न सक्छु?
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-teal-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Bot controls */}
                {msg.sender === "bot" && (
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => speak(msg.text, msg.isNepali)}
                      className="text-xs text-gray-400 hover:text-teal-600 px-1"
                      title="Replay"
                    >
                      replay
                    </button>
                    <button
                      onClick={stopSpeaking}
                      className="text-xs text-gray-400 hover:text-red-500 px-1"
                      title="Stop speaking"
                    >
                      stop
                    </button>
                    <button
                      onClick={() => setIsSpeakingEnabled((p) => !p)}
                      className="text-xs text-gray-400 hover:text-gray-600 px-1"
                      title="Toggle voice"
                    >
                      {isSpeakingEnabled ? "🔊" : "🔇"}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-2">
                  <span className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder={
                speechLang === "ne-NP" ? "सोध्नुहोस्..." : "Ask something..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-400 disabled:opacity-50"
            />

            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-40 transition-all text-sm"
              title="Send"
            >
              ➤
            </button>

            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-sm border-2 ${
                isListening
                  ? "bg-red-100 border-red-400 animate-pulse"
                  : "bg-gray-100 border-gray-300 hover:border-teal-400"
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? "🛑" : "🎤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
