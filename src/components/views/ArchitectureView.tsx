import React from "react";
import { Cpu, Sparkles, Database, Layers, ShieldCheck, MapPin, Compass, Bot, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              System Architecture & ML Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Farm Decision Support System Architecture
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl">
            Clear separation of AI Language Reasoning (Gemini), Agriculture ML Models, Spatial GIS Processing, and Data Source Synchronization.
          </p>
        </div>
        <Cpu className="w-12 h-12 text-emerald-400 shrink-0 hidden sm:block" />
      </div>

      {/* Architecture Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: Gemini Conversational AI */}
        <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">1. Gemini Language & NLU</h3>
              <span className="text-[10px] text-purple-300 font-semibold">Gemini 2.5 Flash / Pro</span>
            </div>
          </div>

          <ul className="text-xs text-emerald-200/90 space-y-2 border-t border-emerald-800/60 pt-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Natural language voice understanding in Indian regional languages (Hindi, Telugu, Tamil, Marathi, Punjabi, etc.).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Generating farmer-friendly explanations ("WHAT", "WHY", "WHEN").</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Interactive voice assistant & multi-turn agricultural chat advisory.</span>
            </li>
          </ul>
        </div>

        {/* Module 2: Agricultural ML Risk Engines */}
        <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">2. Dedicated Agricultural ML</h3>
              <span className="text-[10px] text-emerald-300 font-semibold">XGBoost / CNNs / Random Forests</span>
            </div>
          </div>

          <ul className="text-xs text-emerald-200/90 space-y-2 border-t border-emerald-800/60 pt-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Yield Prediction Range Engine</strong>: XGBoost regression trained on historical soil NPK, rainfall, and regional benchmarks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Disease Vision Classifier</strong>: CNN leaf pathogen classification model.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Crop Stress Engine</strong>: Multi-variable risk scoring combining weather humidity and soil moisture.</span>
            </li>
          </ul>
        </div>

        {/* Module 3: GIS & Satellite Spatial Engine */}
        <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">3. GIS & Spatial Engine</h3>
              <span className="text-[10px] text-cyan-300 font-semibold">Sentinel-2 L2A / Leaflet</span>
            </div>
          </div>

          <ul className="text-xs text-emerald-200/90 space-y-2 border-t border-emerald-800/60 pt-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>GPS Location Capture</strong>: High-precision perimeter tracking as farmer walks field.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>GIS Polygon Mapping</strong>: Converting GPS points to closed field boundaries and calculating area in Acres.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Spatial Clipping</strong>: Extracting NDVI vegetation heatmaps strictly inside the GIS polygon.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Prototype vs Production Integration Note */}
      <div className="bg-emerald-950/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Prototype Data & Model Integration Statement</span>
        </div>
        <p className="text-xs text-emerald-100/90 leading-relaxed">
          In this decision-support prototype, live weather, soil health cards, and satellite vegetation indices are simulated using calibrated regional datasets (e.g. Guntur, AP region). All predictions are explicitly tagged as <strong>Prototype AI/ML Estimates</strong>. The modular backend architecture in <code className="text-amber-300">server.ts</code> provides drop-in hooks to connect production-grade ML inference endpoints, live IMD weather APIs, and ICAR Soil Health Card databases.
        </p>
      </div>

    </div>
  );
};
