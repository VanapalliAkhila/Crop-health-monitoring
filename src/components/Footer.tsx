import React from "react";
import { Sprout, Phone, Mail, Award, Globe, Heart, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="bg-emerald-950 border-t border-emerald-900 text-emerald-100/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Overview */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Smart Farm<span className="text-emerald-400"> Assistant</span>
            </span>
          </div>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            AI/ML-based farm decision-support system for Indian farmers. Field perimeter boundary identification, multi-layer GIS spatial analytics, crop yield & disease risk prediction, and local-language voice guidance.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <Award className="w-4 h-4" />
            <span>Ministry of Agriculture & Farmers Welfare</span>
          </div>
        </div>

        {/* Core Capabilities */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 border-b border-emerald-800/80 pb-1.5">
            Key Solutions
          </h4>
          <ul className="space-y-2 text-xs text-emerald-200/70">
            <li className="hover:text-emerald-300 cursor-pointer">Satellite NDVI & Moisture Layers</li>
            <li className="hover:text-emerald-300 cursor-pointer">CNN Leaf Disease Scanner</li>
            <li className="hover:text-emerald-300 cursor-pointer">XGBoost & Gemini Yield Predictor</li>
            <li className="hover:text-emerald-300 cursor-pointer">Multilingual Voice Chatbot</li>
            <li className="hover:text-emerald-300 cursor-pointer">IoT Sensor Telemetry</li>
            <li className="hover:text-emerald-300 cursor-pointer">Smart Mandi Price Predictor</li>
          </ul>
        </div>

        {/* Kisan Helpline & Support */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 border-b border-emerald-800/80 pb-1.5">
            Kisan Support Helplines
          </h4>
          <ul className="space-y-2 text-xs text-emerald-200/70">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kisan Call Centre: <strong>1800-180-1551</strong> (Toll Free)</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>support@agrivision.ai</span>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>PM-KISAN Portal & PMFBY Direct Integration</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Encrypted & ICAR Verified</span>
            </li>
          </ul>
        </div>

        {/* Hackathon Specs & Languages */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3 border-b border-emerald-800/80 pb-1.5">
            Supported Languages
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {["Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "English"].map((lang) => (
              <span key={lang} className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-800 text-emerald-200">
                {lang}
              </span>
            ))}
          </div>
          <div className="mt-4 text-[11px] text-emerald-300/80">
            Designed with Google Gemini & Sentinel-2 Open Data API.
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60">
        <p>© 2026 AgriVision AI. All rights reserved. Built for Smart India Hackathon.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Crafted with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for Indian Farmers.
        </p>
      </div>
    </footer>
  );
};
