import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Sprout, Send, RefreshCw } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../data/languages";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(currentLang);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API SpeechRecognition if supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage === "hi" ? "hi-IN" : selectedLanguage === "te" ? "te-IN" : selectedLanguage === "ta" ? "ta-IN" : "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript.trim()) {
            handleSendQuery(transcript);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedLanguage]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setAiResponse("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition error:", err);
        setIsListening(true);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === "hi" ? "hi-IN" : selectedLanguage === "te" ? "te-IN" : "en-US";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          language: SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name || "English",
        }),
      });
      const data = await res.json();
      const reply = data.reply || `Recommendation: Apply balanced nitrogen fertilizer and check leaf surface for pest activity.`;
      setAiResponse(reply);
      speakText(reply);
    } catch (e) {
      const fallbackReply = `In your region, ensure proper irrigation interval of 4-5 days and spray neem oil solution for insect prevention.`;
      setAiResponse(fallbackReply);
      speakText(fallbackReply);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "How much fertilizer should I apply for 5 acres of rice?",
    "What is today's mandi price for tomato?",
    "How to cure yellow spots on cotton leaves?",
    "PM-KISAN scheme eligibility status",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-emerald-950 border border-emerald-700/80 w-full max-w-lg rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Voice Assistant</h3>
              <p className="text-[11px] text-emerald-300">Speak in your preferred Indian language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language selector inside modal */}
        <div className="mb-4 flex items-center justify-between bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/60">
          <span className="text-xs text-emerald-200">Speaking Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-emerald-950 border border-emerald-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Listening / Microphone Central Visualizer */}
        <div className="flex flex-col items-center justify-center my-6 space-y-4">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl relative ${
              isListening
                ? "bg-red-500 text-white ring-8 ring-red-500/30 scale-105"
                : "bg-gradient-to-tr from-emerald-500 to-teal-400 text-emerald-950 hover:scale-105"
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping" />
            )}
          </button>

          <p className="text-xs font-medium text-emerald-300">
            {isListening
              ? "Listening... Speak your query clearly"
              : "Tap microphone to start speaking"}
          </p>

          {/* Audio Wave Visualizer Animation */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center gap-1.5 h-6">
              {[40, 70, 100, 60, 90, 50, 80, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Input Transcript Box */}
        <div className="bg-emerald-900/60 border border-emerald-800 rounded-xl p-3 mb-3 min-h-[60px] text-xs">
          <div className="text-[10px] text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
            Your Voice Query:
          </div>
          <p className="text-white italic">
            {transcript || "No voice input detected yet. Try asking a question below or speak."}
          </p>
        </div>

        {/* AI Answer Response */}
        {(loading || aiResponse) && (
          <div className="bg-emerald-900/90 border border-emerald-500/40 rounded-xl p-3.5 mb-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-400" /> AI Farm Recommendation:
              </span>
              {aiResponse && (
                <button
                  onClick={() => speakText(aiResponse)}
                  className="text-emerald-400 hover:text-white p-1"
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-emerald-300">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Processing Gemini AI analysis...</span>
              </div>
            ) : (
              <p className="text-white leading-relaxed font-normal">{aiResponse}</p>
            )}
          </div>
        )}

        {/* Preset Sample Prompts */}
        <div className="mt-4">
          <div className="text-[10px] text-emerald-300/80 mb-2 font-medium">
            Quick Voice Query Prompts:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(q);
                  handleSendQuery(q);
                }}
                className="text-left bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-800/80 rounded-lg p-2 text-[11px] text-emerald-200 truncate transition-colors"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
