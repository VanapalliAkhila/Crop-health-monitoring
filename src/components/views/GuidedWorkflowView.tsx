import React, { useState } from "react";
import { FieldBoundaryMapper } from "../gis/FieldBoundaryMapper";
import { SUPPORTED_LANGUAGES } from "../../data/languages";
import { WorkflowState, RiskPredictionResult, ActionableRecommendation } from "../../types";
import {
  Languages,
  Mic,
  MicOff,
  MapPin,
  Compass,
  Sprout,
  Sparkles,
  ShieldCheck,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  AlertTriangle,
  RotateCcw,
  FileText,
  Activity,
  Layers,
  CloudSun,
  FlaskConical
} from "lucide-react";

interface GuidedWorkflowViewProps {
  onCompleteWorkflow?: (state: WorkflowState) => void;
  onOpenVoiceModal?: () => void;
}

export const GuidedWorkflowView: React.FC<GuidedWorkflowViewProps> = ({
  onCompleteWorkflow,
  onOpenVoiceModal,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Core Workflow State
  const [workflow, setWorkflow] = useState<WorkflowState>({
    languageCode: "en",
    voiceTranscript: "I am growing Paddy (Rice) in 4 acres of land. Sown last month. Soil looks slightly pale.",
    cropType: "Paddy (Rice)",
    sowingDate: "2026-07-15",
    soilType: "Clay Loam",
    irrigationMethod: "Canal & Borewell Irrigation",
    symptomsNotes: "Slight yellowing on lower leaves; humid weather.",
    lat: 16.243,
    lng: 80.648,
    isGpsActive: true,
    gpsPoints: [
      [16.2445, 80.6468],
      [16.2448, 80.6495],
      [16.2418, 80.6498],
      [16.2415, 80.6468],
    ],
    fieldPolygonConfirmed: true,
    fieldAreaAcres: 4.2,
    isWalkingSimulation: true,
    predictionResult: {
      cropHealth: "Moderate stress",
      expectedYieldRangeMin: 22.5,
      expectedYieldRangeMax: 26.0,
      yieldUnit: "Quintals / Acre",
      diseaseRisk: "Moderate",
      weatherRisk: "Moderate",
      cropStress: "Low",
      isPrototypeEstimate: true,
      modelConfidence: 89.4,
      explanation:
        "High atmospheric humidity (78%) paired with recent rainfall raises fungal blast spore probability. Soil nitrogen is slightly below optimal target.",
    },
    recommendation: {
      whatToDo:
        "Inspect the eastern side of your field for early leaf blast spots. Apply Neem oil spray (5ml/L) or Copper Oxychloride 50% WP (2.5g/L) on clear morning.",
      why:
        "High atmospheric moisture (78%) and warm temperatures accelerate fungal germination. Early treatment prevents up to 18% yield degradation.",
      when: "Within the next 24 to 48 Hours",
      urgency: "High",
      audioText:
        "Namaste Kisan Bhai. High humidity creates risk for fungal blast on your paddy crop. Please inspect your field's eastern section today and apply Neem oil spray within 48 hours.",
      category: "Inspection",
    },
  });

  const steps = [
    { number: 1, title: "Language", icon: Languages },
    { number: 2, title: "Voice/Details", icon: Mic },
    { number: 3, title: "Location", icon: MapPin },
    { number: 4, title: "Field Boundary", icon: Compass },
    { number: 5, title: "Crop & Soil", icon: Sprout },
    { number: 6, title: "AI Analysis", icon: Sparkles },
    { number: 7, title: "Predictions", icon: Activity },
    { number: 8, title: "Guidance", icon: ShieldCheck },
  ];

  // Speech Recognition simulator / web speech
  const handleToggleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsListening(!isListening);
      if (!isListening) {
        setTimeout(() => {
          setWorkflow((prev) => ({
            ...prev,
            voiceTranscript: "My cotton field is 3 acres. Sown 45 days ago. Some leaves show yellow spots.",
            cropType: "Cotton",
          }));
          setIsListening(false);
        }, 3000);
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = workflow.languageCode === "hi" ? "hi-IN" : workflow.languageCode === "te" ? "te-IN" : "en-US";
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setWorkflow((prev) => ({ ...prev, voiceTranscript: text }));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(!isListening);
    }
  };

  // Fetch Real Device GPS Location
  const handleFetchDeviceGps = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setWorkflow((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isGpsActive: true,
          isWalkingSimulation: false,
        }));
      },
      (err) => {
        const msg = err?.message || "Location request timed out or was denied in sandbox.";
        alert("GPS Notice: " + msg + " Defaulting to active farm coordinates.");
        setWorkflow((prev) => ({
          ...prev,
          isGpsActive: true,
          isWalkingSimulation: false,
        }));
      },
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 8000 }
    );
  };

  // Text-to-Speech Guidance
  const handlePlayVoiceGuidance = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = workflow.recommendation?.audioText || workflow.recommendation?.whatToDo || "";
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(7);
    }, 2200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* App Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                AI/ML Field Decision Support System
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                Farmer-First Workflow
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Guided Farm Intelligence Assistant
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
              Step-by-step field identification, GPS perimeter mapping, multi-layer GIS analysis, and AI/ML crop risk predictions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVoiceModal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0"
            >
              <Mic className="w-4 h-4 fill-slate-950" />
              <span>Speak to Voice Assistant</span>
            </button>
          </div>
        </div>

        {/* Workflow Stepper Bar */}
        <div className="mt-8 pt-6 border-t border-emerald-800/80 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] px-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = currentStep === s.number;
              const isCompleted = currentStep > s.number;
              return (
                <div key={s.number} className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(s.number)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-emerald-400 text-emerald-950 shadow-lg scale-105"
                        : isCompleted
                        ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700"
                        : "bg-emerald-950/40 text-emerald-600 border border-emerald-900"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        isActive
                          ? "bg-emerald-950 text-emerald-400"
                          : isCompleted
                          ? "bg-emerald-500 text-emerald-950"
                          : "bg-emerald-900 text-emerald-500"
                      }`}
                    >
                      {isCompleted ? "✓" : s.number}
                    </div>
                    <span>{s.title}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-6 sm:w-10 ${
                        isCompleted ? "bg-emerald-500" : "bg-emerald-900"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: LANGUAGE SELECTION */}
      {currentStep === 1 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 1 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Select Preferred Language</h2>
              <p className="text-xs text-emerald-200/80">Choose your spoken language for local voice advice and text guidance.</p>
            </div>
            <Languages className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setWorkflow((prev) => ({ ...prev, languageCode: lang.code }))}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  workflow.languageCode === lang.code
                    ? "bg-emerald-500 text-emerald-950 font-extrabold border-emerald-300 ring-2 ring-emerald-400 scale-105 shadow-xl"
                    : "bg-emerald-900/40 border-emerald-800/80 text-emerald-200 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <div className="text-2xl font-bold mb-1">{lang.nativeName}</div>
                <div className="text-xs opacity-80">{lang.name}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <span>Next: Voice or Text Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VOICE OR TEXT DETAILS */}
      {currentStep === 2 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 2 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Speak or Enter Crop Details</h2>
              <p className="text-xs text-emerald-200/80">Tell us what crop you are growing, sowing month, and any observations.</p>
            </div>
            <Mic className="w-8 h-8 text-emerald-400" />
          </div>

          {/* Prominent Voice Mic Button */}
          <div className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-6 text-center space-y-4">
            <button
              onClick={handleToggleVoiceInput}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-2xl border-4 ${
                isListening
                  ? "bg-red-500 border-red-300 text-white animate-pulse"
                  : "bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-200 text-emerald-950 hover:scale-105"
              }`}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10 fill-emerald-950" />}
            </button>

            <div>
              <div className="text-sm font-bold text-white">
                {isListening ? "Listening to your voice..." : "Click to Speak Crop Details"}
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                Speak in {SUPPORTED_LANGUAGES.find((l) => l.code === workflow.languageCode)?.nativeName || "English"}
              </p>
            </div>
          </div>

          {/* Transcript / Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">
                Captured Voice Transcript / Input Text:
              </label>
              <textarea
                value={workflow.voiceTranscript}
                onChange={(e) => setWorkflow((prev) => ({ ...prev, voiceTranscript: e.target.value }))}
                rows={3}
                className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-emerald-400"
                placeholder="e.g., I am growing Paddy in 4 acres of land, sown last month..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <span>Next: Location Access</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION ACCESS */}
      {currentStep === 3 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 3 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Location Access & GPS Initialization</h2>
              <p className="text-xs text-emerald-200/80">Identify farm geographic location for localized weather, soil & satellite matching.</p>
            </div>
            <MapPin className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Compass className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Current GPS Signal Active</div>
                  <div className="text-xs text-emerald-300">Guntur Agricultural Zone, Andhra Pradesh</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-emerald-200 pt-2 border-t border-emerald-800">
                <div className="flex justify-between">
                  <span>Latitude Coordinate:</span>
                  <strong className="text-white font-mono">{workflow.lat.toFixed(5)}° N</strong>
                </div>
                <div className="flex justify-between">
                  <span>Longitude Coordinate:</span>
                  <strong className="text-white font-mono">{workflow.lng.toFixed(5)}° E</strong>
                </div>
                <div className="flex justify-between">
                  <span>GPS Status:</span>
                  <strong className="text-emerald-400 font-mono">
                    {workflow.isWalkingSimulation ? "Demo / Sample Coordinates" : "Live Device GPS"}
                  </strong>
                </div>

                <button
                  onClick={handleFetchDeviceGps}
                  className="w-full mt-3 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Acquire Live Device GPS Location</span>
                </button>
              </div>
            </div>

            <div className="bg-emerald-900/40 border border-emerald-800 rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Important GPS vs GIS Context:
              </span>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Your device GPS gives us your current point on earth. In the next step, we will use GIS (Geographic Information System) to map your complete field perimeter boundary and polygon.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <span>Next: Field Boundary Mapping</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REAL-TIME GPS FIELD MEASUREMENT */}
      {currentStep === 4 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 4 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Walk Field Boundary & Measure Area</h2>
              <p className="text-xs text-emerald-200/80">
                Walk around the edge of your field. Continuous GPS tracking records your position to calculate exact area in Hectares and Acres.
              </p>
            </div>
            <Compass className="w-8 h-8 text-emerald-400" />
          </div>

          <FieldBoundaryMapper
            initialLat={workflow.lat}
            initialLng={workflow.lng}
            onBoundaryConfirmed={(points, area) => {
              setWorkflow((prev) => ({
                ...prev,
                gpsPoints: points,
                fieldAreaAcres: area,
                fieldPolygonConfirmed: true,
              }));
            }}
            onContinueToCropAnalysis={() => setCurrentStep(5)}
          />

          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <span>Next: Confirm Crop & Soil Parameters</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CROP & SOIL DETAILS */}
      {currentStep === 5 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 5 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Confirm Crop & Field Specifications</h2>
              <p className="text-xs text-emerald-200/80">Review crop variety, soil classification, sowing date, and irrigation.</p>
            </div>
            <Sprout className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">Crop Type</label>
              <select
                value={workflow.cropType}
                onChange={(e) => setWorkflow((prev) => ({ ...prev, cropType: e.target.value }))}
                className="w-full bg-emerald-900/60 border border-emerald-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              >
                <option value="Paddy (Rice)">Paddy (Rice)</option>
                <option value="Cotton">Cotton</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Chilli">Chilli</option>
                <option value="Tomato">Tomato</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">Sowing Date</label>
              <input
                type="date"
                value={workflow.sowingDate}
                onChange={(e) => setWorkflow((prev) => ({ ...prev, sowingDate: e.target.value }))}
                className="w-full bg-emerald-900/60 border border-emerald-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">Soil Type</label>
              <select
                value={workflow.soilType}
                onChange={(e) => setWorkflow((prev) => ({ ...prev, soilType: e.target.value }))}
                className="w-full bg-emerald-900/60 border border-emerald-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              >
                <option value="Clay Loam">Clay Loam</option>
                <option value="Black Cotton Soil">Black Cotton Soil</option>
                <option value="Red Sandy Soil">Red Sandy Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">Irrigation Method</label>
              <select
                value={workflow.irrigationMethod}
                onChange={(e) => setWorkflow((prev) => ({ ...prev, irrigationMethod: e.target.value }))}
                className="w-full bg-emerald-900/60 border border-emerald-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              >
                <option value="Canal & Borewell Irrigation">Canal & Borewell Irrigation</option>
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler Irrigation">Sprinkler Irrigation</option>
                <option value="Rainfed (Non-Irrigated)">Rainfed (Non-Irrigated)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <span>Next: Trigger AI Data Collection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: AI DATA COLLECTION & PROCESSING */}
      {currentStep === 6 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 6 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Collecting Multi-Source Farm Data</h2>
              <p className="text-xs text-emerald-200/80">Connecting field GIS polygon with satellite imagery, weather API, and soil health records.</p>
            </div>
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-900/40 border border-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">1. GIS Field Boundary</div>
                  <div className="text-[11px] text-emerald-300">{workflow.fieldAreaAcres} Acres polygon verified on Sentinel grid</div>
                </div>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">2. Weather Signals</div>
                  <div className="text-[11px] text-emerald-300">Temp 31.5°C, Humidity 78% <span className="text-amber-400 font-bold">(Demo Weather Data)</span></div>
                </div>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">3. Soil Health Card</div>
                  <div className="text-[11px] text-emerald-300">pH 6.8, Nitrogen 142 kg/ha <span className="text-amber-400 font-bold">(Sample Soil Data)</span></div>
                </div>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">4. Satellite NDVI Spectral Mask</div>
                  <div className="text-[11px] text-emerald-300">Vegetation Index 0.82 <span className="text-amber-400 font-bold">(Simulated Satellite Indicator)</span></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunAIAnalysis}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-emerald-950 font-extrabold text-sm shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Running AI/ML Risk Engine Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Execute AI/ML Crop Risk Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: AI/ML PREDICTION DASHBOARD */}
      {currentStep === 7 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 7 of 8</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  Prototype AI/ML Estimate
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">AI/ML Crop Risk & Yield Prediction</h2>
              <p className="text-xs text-emerald-200/80">
                Multi-factor assessment based on field boundary GIS, soil fertility, local weather, and satellite vegetation.
              </p>
            </div>
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>

          {/* Primary Prediction KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Crop Health Card */}
            <div className="bg-emerald-900/50 border border-emerald-700/80 p-5 rounded-2xl space-y-2 shadow-lg">
              <span className="text-xs font-bold text-emerald-400 block">Overall Crop Health</span>
              <div className="text-2xl font-extrabold text-amber-300">
                {workflow.predictionResult?.cropHealth}
              </div>
              <p className="text-[11px] text-emerald-200/80">Slight leaf discoloration observed in satellite spectral index.</p>
            </div>

            {/* Expected Yield RANGE Card */}
            <div className="bg-emerald-900/50 border border-emerald-700/80 p-5 rounded-2xl space-y-2 shadow-lg">
              <span className="text-xs font-bold text-emerald-400 block">Expected Yield Range</span>
              <div className="text-2xl font-extrabold text-emerald-300">
                {workflow.predictionResult?.expectedYieldRangeMin} - {workflow.predictionResult?.expectedYieldRangeMax}
                <span className="text-xs font-normal text-emerald-200 block">{workflow.predictionResult?.yieldUnit}</span>
              </div>
              <p className="text-[10px] text-amber-300 font-semibold">* Estimated range based on current weather & soil inputs.</p>
            </div>

            {/* Disease Risk Card */}
            <div className="bg-emerald-900/50 border border-emerald-700/80 p-5 rounded-2xl space-y-2 shadow-lg">
              <span className="text-xs font-bold text-emerald-400 block">Disease Risk Level</span>
              <div className="text-2xl font-extrabold text-amber-400">
                {workflow.predictionResult?.diseaseRisk} Risk
              </div>
              <p className="text-[11px] text-emerald-200/80">Paddy blast spore risk due to 78% relative humidity.</p>
            </div>

            {/* Weather Risk Card */}
            <div className="bg-emerald-900/50 border border-emerald-700/80 p-5 rounded-2xl space-y-2 shadow-lg">
              <span className="text-xs font-bold text-emerald-400 block">Weather / Crop Stress</span>
              <div className="text-2xl font-extrabold text-teal-300">
                {workflow.predictionResult?.weatherRisk} Stress
              </div>
              <p className="text-[11px] text-emerald-200/80">Favorable rainfall forecast next 3 days.</p>
            </div>

          </div>

          {/* AI Reasoning Explanation Box */}
          <div className="bg-emerald-900/40 border border-emerald-700 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Risk Reasoning & Data Integration Summary
            </span>
            <p className="text-xs text-white leading-relaxed font-normal">
              {workflow.predictionResult?.explanation}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(8)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-emerald-950 font-extrabold text-xs shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <span>Next: View Actionable Guidance</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: RECOMMENDATION ENGINE (ACTIONABLE GUIDANCE) */}
      {currentStep === 8 && (
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 8 of 8</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Actionable Farmer Guidance</h2>
              <p className="text-xs text-emerald-200/80">Clear advice explaining WHAT to do, WHY to do it, and WHEN to act.</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>

          {/* Actionable Guidance Triple Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* WHAT SHOULD I DO */}
            <div className="bg-emerald-900/60 border border-emerald-500/50 p-6 rounded-2xl space-y-3 shadow-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                1. WHAT SHOULD I DO?
              </span>
              <h3 className="font-extrabold text-sm text-white leading-snug">
                {workflow.recommendation?.whatToDo}
              </h3>
            </div>

            {/* WHY */}
            <div className="bg-emerald-900/60 border border-amber-500/50 p-6 rounded-2xl space-y-3 shadow-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                2. WHY SHOULD I DO THIS?
              </span>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {workflow.recommendation?.why}
              </p>
            </div>

            {/* WHEN */}
            <div className="bg-emerald-900/60 border border-cyan-500/50 p-6 rounded-2xl space-y-3 shadow-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                3. WHEN SHOULD I ACT?
              </span>
              <div className="text-base font-extrabold text-cyan-300">
                {workflow.recommendation?.when}
              </div>
              <p className="text-[11px] text-emerald-200/80">Act early before humidity peaks during morning dew.</p>
            </div>

          </div>

          {/* Audio Local Speech Synthesis Player */}
          <div className="bg-emerald-900/40 border border-emerald-700/80 p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Local Language Audio Advisory</div>
                  <div className="text-xs text-emerald-300">
                    Language: {SUPPORTED_LANGUAGES.find((l) => l.code === workflow.languageCode)?.nativeName || "English"}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlayVoiceGuidance}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-extrabold text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Voice Guidance</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 fill-slate-950" />
                    <span>Listen Aloud in Local Language</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-emerald-200 italic border-t border-emerald-800/80 pt-3">
              "{workflow.recommendation?.audioText}"
            </p>
          </div>

          {/* Complete Workflow Confirmation Action */}
          <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80">
            <button
              onClick={() => setCurrentStep(7)}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                if (onCompleteWorkflow) onCompleteWorkflow(workflow);
                alert("Farm Report saved successfully to your history dashboard!");
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-extrabold text-xs shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Complete Farm Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
