import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  CloudLightning,
  Volume2,
  VolumeX,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Bell,
  Info
} from "lucide-react";

interface HighPriorityAlertBannerProps {
  farmName?: string;
  crop?: string;
  location?: string;
  onNavigate?: (tabId: string) => void;
  onOpenVoiceAssistant?: () => void;
}

export const HighPriorityAlertBanner: React.FC<HighPriorityAlertBannerProps> = ({
  farmName = "Sri Lakshmi Paddy Farm",
  crop = "Paddy (Rice)",
  location = "Guntur, AP",
  onNavigate,
  onOpenVoiceAssistant,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"hi" | "te" | "en">("hi");
  const [activeAlertTab, setActiveAlertTab] = useState<"disease" | "weather">("disease");

  // Audio Scripts for local languages
  const audioScripts = {
    disease: {
      hi: "चेतावनी! आपके धान के खेत में उच्च आर्द्रता के कारण फंगल ब्लास्ट रोग का भारी खतरा है। कृपया सुबह के समय नीम तेल या कॉपर ऑक्सीक्लोराइड का छिड़काव करें और खेत से अतिरिक्त पानी निकालें।",
      te: "హెచ్చరిక! మీ వరి పొలంలో అధిక తేమ కారణముగా శిలీంధ్ర బ్లాస్ట్ తెగులు వచ్చే తీవ్ర ప్రమాదం ఉంది. దయచేసి ఉదయమే వేప నూనె లేదా కాపర్ ఆక్సిక్లోరైడ్ పిచికారీ చేయండి.",
      en: "Alert! High disease risk detected for Paddy Leaf Blast due to 88% humidity. Inspect field immediately and apply Copper Oxychloride fungicide within 24 hours.",
    },
    weather: {
      hi: "मौसम चेतावनी! अगले 12 से 18 घंटों में भारी बारिश और तेज हवाओं की संभावना है। कीटनाशक छिड़काव रोक दें और खेत की नालियों को साफ रखें।",
      te: "వాతావరణ హెచ్చరిక! రాబోయే 12 నుండి 18 గంటల్లో భారీ వర్షం మరియు ఈదురుగాలులు వీచే అవకాశం ఉంది. పురుగుమందుల పిచికారీని వాయిదా వేయండి.",
      en: "Weather Alert! Heavy unseasonal rain and strong wind gusts expected in 12 to 18 hours. Drain field bunds and delay fertilizer spraying.",
    },
  };

  const handleToggleSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const script = audioScripts[activeAlertTab][selectedLanguage];
    const utterance = new SpeechSynthesisUtterance(script);

    // Set voice language if possible
    if (selectedLanguage === "hi") utterance.lang = "hi-IN";
    else if (selectedLanguage === "te") utterance.lang = "te-IN";
    else utterance.lang = "en-US";

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isDismissed) {
    return (
      <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-red-300">1 Active High-Priority Hazard Alert</span>
          <span className="text-red-200/80 hidden sm:inline">• High Disease & Weather Risk Detected for {farmName}</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 font-bold text-xs hover:bg-red-500/30 transition-all flex items-center gap-1"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Expand Alert Banner</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-2 border-red-500/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Background Subtle Pulsing Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-500/30 border border-red-400/60 flex items-center justify-center text-red-300 animate-pulse shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                HIGH PRIORITY ALERT
              </span>
              <span className="text-xs font-bold text-red-200">
                {farmName} ({crop})
              </span>
            </div>
            <p className="text-[11px] text-red-200/90 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>Location: {location}</span>
              <span className="text-red-400/60">• Updated 15 mins ago</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher & Dismiss */}
        <div className="flex items-center gap-2">
          <div className="bg-red-950/80 border border-red-800/80 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveAlertTab("disease")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeAlertTab === "disease"
                  ? "bg-red-500 text-slate-950 shadow"
                  : "text-red-300 hover:text-white"
              }`}
            >
              Fungal Disease
            </button>
            <button
              onClick={() => setActiveAlertTab("weather")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeAlertTab === "weather"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-red-300 hover:text-white"
              }`}
            >
              Severe Weather
            </button>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-xl bg-red-900/60 text-red-300 hover:text-white hover:bg-red-800 transition-colors"
            title="Minimize Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Alert Content Body */}
      {activeAlertTab === "disease" ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-red-200 font-extrabold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>CRITICAL DISEASE RISK: Paddy Leaf Blast (Pyricularia oryzae)</span>
            </div>
            <p className="text-xs text-red-100/90 leading-relaxed">
              <strong>Risk Drivers:</strong> Relative atmospheric humidity has reached <strong>88%</strong> with nighttime temperatures dropping to 22.5°C. High spore germination probability over the next 24-48 hours.
            </p>
            
            <div className="bg-red-900/50 border border-red-700/80 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-extrabold text-amber-300 block uppercase tracking-wide text-[10px]">
                Immediate Action Required (Next 24 Hours):
              </span>
              <ul className="text-red-100/90 space-y-1 list-disc list-inside">
                <li>Inspect eastern & shaded field plots for diamond-shaped leaf blast spots.</li>
                <li>Apply Neem Oil spray (5ml/L) or Copper Oxychloride 50% WP (2.5g/L) during dry morning hours.</li>
                <li>Avoid excessive nitrogenous fertilizer application during high humidity.</li>
              </ul>
            </div>
          </div>

          {/* Audio & Action Buttons Column */}
          <div className="md:col-span-4 bg-red-950/60 border border-red-800 p-4 rounded-2xl space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-red-200">
                <span>Audio Advisory:</span>
                <div className="flex items-center gap-1">
                  {(["hi", "te", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        selectedLanguage === lang
                          ? "bg-amber-400 text-slate-950"
                          : "text-red-300 bg-red-900/60"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleToggleSpeech}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 fill-slate-950" />
                    <span>Stop Playing</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 fill-slate-950" />
                    <span>Listen Aloud ({selectedLanguage.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate("recommendations")}
                className="w-full py-2.5 rounded-xl bg-red-500 text-slate-950 font-extrabold text-xs shadow-lg hover:bg-red-400 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full Recommendations</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-amber-200 font-extrabold text-sm sm:text-base">
              <CloudLightning className="w-5 h-5 text-amber-400 shrink-0" />
              <span>HIGH-RISK WEATHER: Unseasonal Heavy Rainfall & Squall Winds</span>
            </div>
            <p className="text-xs text-red-100/90 leading-relaxed">
              <strong>IMD Weather Warning:</strong> Sudden thunderstorm cell approaching Guntur zone in 12-18 hours. Predicted precipitation: <strong>45-60mm</strong> with wind speeds up to 35 km/h.
            </p>

            <div className="bg-amber-950/60 border border-amber-700/80 p-3 rounded-2xl text-xs space-y-1">
              <span className="font-extrabold text-amber-300 block uppercase tracking-wide text-[10px]">
                Pre-Rain Precautions:
              </span>
              <ul className="text-amber-100/90 space-y-1 list-disc list-inside">
                <li>Clear field drainage bunds and outlets to prevent root waterlogging.</li>
                <li>Postpone all planned foliar chemical sprays until rain cell clears.</li>
                <li>Secure harvested crop heaps or move them to covered elevated storage.</li>
              </ul>
            </div>
          </div>

          {/* Audio & Action Buttons Column */}
          <div className="md:col-span-4 bg-red-950/60 border border-red-800 p-4 rounded-2xl space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-red-200">
                <span>Audio Advisory:</span>
                <div className="flex items-center gap-1">
                  {(["hi", "te", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        selectedLanguage === lang
                          ? "bg-amber-400 text-slate-950"
                          : "text-red-300 bg-red-900/60"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleToggleSpeech}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 fill-slate-950" />
                    <span>Stop Playing</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 fill-slate-950" />
                    <span>Listen Aloud ({selectedLanguage.toUpperCase()})</span>
                  </>
                )}
              </button>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate("recommendations")}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full Recommendations</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
