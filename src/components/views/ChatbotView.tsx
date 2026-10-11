import React, { useState } from "react";
import { ChatMessage } from "../../types";
import { SUPPORTED_LANGUAGES } from "../../data/languages";
import { Bot, Send, User, Volume2, Sparkles, RefreshCw } from "lucide-react";

export const ChatbotView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState("hi");
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "bot",
      text: "नमस्ते! मैं एग्रीविज़न एआई सहायक हूँ। अपनी फसल या मिट्टी से संबंधित कोई भी प्रश्न पूछें।",
      timestamp: "Just now",
      language: "Hindi",
    },
  ]);

  const quickPrompts = [
    "धान की फसल में खरपतवार नियंत्रण कैसे करें?",
    "How to manage yellow vein mosaic virus in cotton?",
    "What is the best fertilizer dose for 5 acres wheat?",
    "पीएम-किसान सम्मान निधि की स्थिति कैसे चेक करें?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg("");
    setLoading(true);

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);

    try {
      const res = await fetch("/api/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          language: langObj?.name || "Hindi",
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Recommendation: Ensure soil NPK balance and irrigate every 4-5 days.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        language: langObj?.name,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: `In ${langObj?.name}: For optimal crop development, apply recommended nitrogen dosage at root zone during morning hours.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang === "hi" ? "hi-IN" : selectedLang === "te" ? "te-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Multilingual Gemini 3.6 Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Multilingual AI Agriculture Assistant
          </h1>
          <p className="text-xs text-emerald-200/80">
            Ask questions regarding crops, diseases, weather, or schemes in 10 Indian languages.
          </p>
        </div>

        {/* Language Selector */}
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-emerald-900 border border-emerald-700 text-white text-xs rounded-xl px-3 py-2 cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName} ({l.name})
            </option>
          ))}
        </select>
      </div>

      {/* Chat Conversation Card */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[500px]">
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                m.sender === "user" ? "bg-emerald-500 text-emerald-950" : "bg-emerald-900 text-emerald-400 border border-emerald-700"
              }`}>
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-xs space-y-1 ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none"
                  : "bg-emerald-900/60 border border-emerald-800 text-emerald-100 rounded-tl-none"
              }`}>
                <div className="flex items-center justify-between gap-4 text-[10px] text-emerald-300/80 mb-0.5">
                  <span>{m.sender === "user" ? "You" : "AgriVision AI"}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="leading-relaxed text-sm font-normal">{m.text}</p>

                {m.sender === "bot" && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="text-[10px] text-emerald-400 hover:text-white flex items-center gap-1 pt-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 italic">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini AI is crafting response in {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name}...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Chips */}
        <div className="py-2 flex items-center gap-2 overflow-x-auto border-t border-emerald-800/60 my-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-800 text-[11px] shrink-0 truncate max-w-xs transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask a farming question..."
            className="flex-1 bg-emerald-900/60 border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>

      </div>

    </div>
  );
};
