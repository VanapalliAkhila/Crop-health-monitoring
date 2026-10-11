import React from "react";
import { SAMPLE_SOIL } from "../../data/mockData";
import { FlaskConical, Sparkles, CheckCircle2, AlertCircle, BarChart2 } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export const SoilAnalysisView: React.FC = () => {
  const npkRadarData = [
    { nutrient: "Nitrogen (N)", current: 142, optimal: 160 },
    { nutrient: "Phosphorus (P)", current: 48, optimal: 45 },
    { nutrient: "Potassium (K)", current: 195, optimal: 180 },
    { nutrient: "Org. Carbon", current: 62, optimal: 80 },
    { nutrient: "Moisture %", current: 28, optimal: 30 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Soil Health Card Digital Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Soil Health & N-P-K Nutrient Analysis
          </h1>
          <p className="text-xs text-emerald-200/80">
            Multi-element soil radar evaluation, pH index, organic carbon content, and fertilizer balance recommendations.
          </p>
        </div>
        <FlaskConical className="w-10 h-10 text-purple-400 hidden sm:block" />
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Fertility Score</span>
          <div className="text-3xl font-extrabold text-emerald-400">{SAMPLE_SOIL.fertilityScore}</div>
          <span className="text-[10px] text-emerald-300">Grade: Excellent</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Soil pH Meter</span>
          <div className="text-3xl font-extrabold text-white">{SAMPLE_SOIL.ph}</div>
          <span className="text-[10px] text-emerald-300">Neutral (Ideal)</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Nitrogen (N)</span>
          <div className="text-2xl font-bold text-white">{SAMPLE_SOIL.nitrogen} <span className="text-xs font-normal text-emerald-400">kg/ha</span></div>
          <span className="text-[10px] text-amber-300">Slightly Low</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Phosphorus (P)</span>
          <div className="text-2xl font-bold text-white">{SAMPLE_SOIL.phosphorus} <span className="text-xs font-normal text-emerald-400">kg/ha</span></div>
          <span className="text-[10px] text-emerald-300">Optimal</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Potassium (K)</span>
          <div className="text-2xl font-bold text-white">{SAMPLE_SOIL.potassium} <span className="text-xs font-normal text-emerald-400">kg/ha</span></div>
          <span className="text-[10px] text-emerald-300">High</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Organic Carbon</span>
          <div className="text-2xl font-bold text-white">{SAMPLE_SOIL.organicCarbon}%</div>
          <span className="text-[10px] text-emerald-300">Clay Loam</span>
        </div>

      </div>

      {/* Radar Chart & Bar Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <h3 className="font-bold text-sm text-white">Nutrient Balance Radar</h3>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={npkRadarData}>
                <PolarGrid stroke="#064e3b" />
                <PolarAngleAxis dataKey="nutrient" stroke="#a7f3d0" fontSize={11} />
                <PolarRadiusAxis stroke="#a7f3d0" fontSize={10} />
                <Radar name="Current Soil Level" dataKey="current" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                <Radar name="Target Optimal Level" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: "#022c22", borderColor: "#059669", color: "#fff", fontSize: "12px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NPK Bar Chart Comparison */}
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <h3 className="font-bold text-sm text-white">Current vs Optimal N-P-K Comparison</h3>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npkRadarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
                <XAxis dataKey="nutrient" stroke="#a7f3d0" fontSize={10} />
                <YAxis stroke="#a7f3d0" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#022c22", borderColor: "#059669", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="current" fill="#a855f7" radius={[4, 4, 0, 0]} name="Current Level" />
                <Bar dataKey="optimal" fill="#10b981" radius={[4, 4, 0, 0]} name="Target Optimal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Recommendations */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white border-b border-emerald-800/60 pb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Actionable Soil Fertility Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_SOIL.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-emerald-900/40 border border-emerald-800 p-3.5 rounded-xl text-xs text-emerald-100 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
