import React from "react";
import { Satellite, Database, Brain, Smartphone, ShieldCheck, ArrowRight, Layers, Cpu, Radio, Sparkles } from "lucide-react";

export const AIPipelineDiagram: React.FC = () => {
  const steps = [
    {
      title: "1. Data Acquisition",
      icon: Satellite,
      badge: "Sentinel-2 & Soil Data",
      description: "10m satellite NDVI spectral imagery, OpenWeather API, IMD historical rainfall, and IoT soil sensors.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "2. Preprocessing & Feature Eng.",
      icon: Layers,
      badge: "GIS & OpenCV",
      description: "Band ratio calculations (NDVI, NDWI, EVI), spatial polygon clipping, and leaf image normalization.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "3. ML & GenAI Models",
      icon: Brain,
      badge: "XGBoost + CNN + Gemini",
      description: "CNN for leaf disease classification; XGBoost for yield estimation; Google Gemini 3.6 for reasoning.",
      color: "from-emerald-500 to-teal-400",
    },
    {
      title: "4. Multilingual Delivery",
      icon: Smartphone,
      badge: "10 Indian Languages",
      description: "Voice Assistant (TTS/STT), WhatsApp/SMS push alerts, interactive GIS dashboard, and downloadable PDF reports.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-emerald-800/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">System Architecture & AI Pipeline</h3>
          </div>
          <p className="text-xs text-emerald-300">
            End-to-End Farm Level Intelligence Stack for Smart India Hackathon
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/60 px-3 py-1 rounded-full text-xs font-medium text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>Gemini 3.6 & FastAPI Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-emerald-900/40 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-xl p-4 transition-all hover:-translate-y-1 group relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {step.badge}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{step.title}</h4>
              <p className="text-xs text-emerald-200/80 leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ICAR Compliant Data Standards</span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Realtime Sentinel Satellite Stream Integration</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>PostgreSQL + PostGIS Geospatial Engine</span>
        </div>
      </div>
    </div>
  );
};
