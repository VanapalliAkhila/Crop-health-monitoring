import React, { useState } from "react";
import { ShieldCheck, Volume2, VolumeX, Sparkles, AlertCircle, Clock, Info, CheckCircle2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../data/languages";

export const RecommendationView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState("hi");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recommendations = [
    {
      id: 1,
      category: "Pest & Disease Control",
      urgency: "High",
      what: "Inspect eastern section of field for Paddy Blast leaf spots. Apply Neem Oil spray (5ml/L) or Copper Oxychloride 50% WP (2.5g/L).",
      why: "Relative humidity above 78% combined with 31.5°C temperature creates optimal fungal spore germination environment.",
      when: "Today or within 24 Hours (Morning hours before dew evaporates)",
      audioHi: "किसान भाई, अपनी धान की फसल के पूर्वी हिस्से में पत्ती झुलसा के शुरुआती लक्षणों की जांच करें। अगले 24 घंटे के भीतर नीम के तेल या कॉपर ऑक्सीक्लोराइड का छिड़काव करें।",
      audioTe: "రైతు సోదరా, మీ వరి పొలం తూర్పు భాగంలో ఆకు మచ్చ తెగులు లక్షణాలను పరిశీలించండి. రాబోయే 24 గంటల్లో వేప నూనె లేదా కాపర్ ఆక్సిక్లోరైడ్ పిచికారీ చేయండి.",
      audioEn: "Farmer friend, inspect the eastern section of your paddy field for early blast spots. Apply Neem oil spray within 24 hours.",
    },
    {
      id: 2,
      category: "Soil Nutrient Management",
      urgency: "Medium",
      what: "Apply Neem-coated Urea top-dressing at 25 kg/acre during panicle initiation stage.",
      why: "Soil testing indicates Nitrogen level is 142 kg/ha (Slightly below optimal 160 kg/ha threshold for peak tillering).",
      when: "Within 3 to 5 Days (Post upcoming light rainfall event)",
      audioHi: "मृदा परीक्षण के अनुसार नाइट्रोजन का स्तर थोड़ा कम है। बारिश के बाद प्रति एकड़ 25 किलोग्राम नीम लेपित यूरिया का छिड़काव करें।",
      audioTe: "నేల పరీక్ష ప్రకారం నత్రజని పరిమాణం కొంత తక్కువగా ఉంది. వర్షం తర్వాత ఎకరానికి 25 కిలోల వేప పూత పూసిన యూరియా వేయండి.",
      audioEn: "Apply Neem-coated Urea top-dressing at 25 kg per acre after the light rain event.",
    },
    {
      id: 3,
      category: "Irrigation Schedule",
      urgency: "Normal",
      what: "Maintain shallow 2 to 3 cm water standing depth; do not allow field to dry completely during grain filling.",
      why: "Paddy grain filling stage requires uninterrupted moisture to prevent unfilled chaffy grains.",
      when: "Ongoing Daily Monitoring",
      audioHi: "धान में दाना भरते समय खेत में 2 से 3 सेमी पानी बनाकर रखें, खेत को सूखने न दें।",
      audioTe: "వరి గింజ తొడిగే సమయంలో పొలంలో 2 నుండి 3 సెంటీమీటర్ల నీరు నిల్వ ఉంచండి, పొలాన్ని ఆరనివ్వకండి.",
      audioEn: "Maintain shallow standing water depth of 2 to 3 cm during the grain filling phase.",
    },
  ];

  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Actionable Guidance Engine
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Prototype Recommendation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Farmer Actionable Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Direct, practical instructions detailing WHAT to do, WHY to do it, and WHEN to act. Listen in your local language.
          </p>
        </div>
        <ShieldCheck className="w-12 h-12 text-emerald-400 shrink-0 hidden sm:block" />
      </div>

      {/* Language Selector Bar */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-emerald-300">Audio Language:</span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { code: "hi", name: "हिन्दी (Hindi)" },
            { code: "te", name: "తెలుగు (Telugu)" },
            { code: "en", name: "English" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLang === lang.code
                  ? "bg-emerald-500 text-emerald-950 shadow"
                  : "bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-6">
        {recommendations.map((rec) => {
          const audioText =
            selectedLang === "hi"
              ? rec.audioHi
              : selectedLang === "te"
              ? rec.audioTe
              : rec.audioEn;

          return (
            <div
              key={rec.id}
              className="bg-emerald-950/80 border border-emerald-800/80 rounded-3xl p-6 shadow-2xl space-y-6"
            >
              {/* Category & Urgency Badge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                    {rec.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      rec.urgency === "High"
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : rec.urgency === "Medium"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    Urgency: {rec.urgency}
                  </span>

                  <button
                    onClick={() => handleSpeak(audioText)}
                    className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-1.5 shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Listen Aloud</span>
                  </button>
                </div>
              </div>

              {/* Core 3 Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* WHAT */}
                <div className="bg-emerald-900/50 border border-emerald-500/40 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block">
                    1. WHAT SHOULD I DO?
                  </span>
                  <p className="text-xs font-bold text-white leading-relaxed">{rec.what}</p>
                </div>

                {/* WHY */}
                <div className="bg-emerald-900/50 border border-amber-500/40 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                    2. WHY SHOULD I DO THIS?
                  </span>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">{rec.why}</p>
                </div>

                {/* WHEN */}
                <div className="bg-emerald-900/50 border border-cyan-500/40 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider block">
                    3. WHEN SHOULD I ACT?
                  </span>
                  <div className="text-xs font-extrabold text-cyan-300 leading-relaxed">{rec.when}</div>
                </div>

              </div>

              {/* Local Audio Script Display */}
              <div className="bg-emerald-900/30 border border-emerald-800 p-3.5 rounded-xl text-xs text-emerald-200 italic flex items-center justify-between">
                <span>"{audioText}"</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
