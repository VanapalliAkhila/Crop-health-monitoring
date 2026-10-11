import React, { useState } from "react";
import { 
  Sprout, 
  TrendingUp, 
  Scan, 
  Map, 
  CloudSun, 
  FlaskConical, 
  Coins, 
  Download, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  FileText,
  ChevronRight,
  Sparkles,
  Droplets
} from "lucide-react";
import { Farm, YieldPredictionResult, DiseaseResult } from "../../types";
import { SAMPLE_FARMS, SAMPLE_SOIL, SAMPLE_WEATHER } from "../../data/mockData";
import { generateFarmPDFReport } from "../../utils/pdfGenerator";
import { HighPriorityAlertBanner } from "../HighPriorityAlertBanner";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface FarmerDashboardViewProps {
  onNavigate: (tabId: string) => void;
  selectedFarm: Farm;
  setSelectedFarm: (farm: Farm) => void;
}

export const FarmerDashboardView: React.FC<FarmerDashboardViewProps> = ({
  onNavigate,
  selectedFarm,
  setSelectedFarm,
}) => {
  const [downloading, setDownloading] = useState(false);

  // Sample historical charts data
  const yieldTrendData = [
    { year: "2022", yield: 18.2, benchmark: 17.5 },
    { year: "2023", yield: 19.8, benchmark: 18.0 },
    { year: "2024", yield: 21.4, benchmark: 18.5 },
    { year: "2025", yield: 23.1, benchmark: 19.0 },
    { year: "2026 (AI Est)", yield: selectedFarm.expectedYield, benchmark: 19.5 },
  ];

  const moistureData = [
    { month: "Jan", rainfall: 15, moisture: 22 },
    { month: "Feb", rainfall: 25, moisture: 24 },
    { month: "Mar", rainfall: 40, moisture: 28 },
    { month: "Apr", rainfall: 65, moisture: 34 },
    { month: "May", rainfall: 90, moisture: 38 },
    { month: "Jun", rainfall: 160, moisture: 45 },
    { month: "Jul", rainfall: 210, moisture: 52 },
    { month: "Aug", rainfall: 185, moisture: 48 },
  ];

  const notifications = [
    {
      id: "n1",
      title: "Scattered Showers Expected Today",
      msg: "Rainfall (~12.4mm) predicted in Guntur. Postpone foliar pesticide spray until Thursday.",
      type: "weather",
      time: "2 hours ago",
    },
    {
      id: "n2",
      title: "PM-KISAN 17th Installment Credited",
      msg: "₹2,000 direct benefit transfer processed into registered Aadhaar bank account.",
      type: "scheme",
      time: "1 day ago",
    },
    {
      id: "n3",
      title: "Satellite Scanned - High Vegetation Density",
      msg: "NDVI Index at 0.82 indicating healthy crop canopy across 4.5 acres.",
      type: "satellite",
      time: "2 days ago",
    },
  ];

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      generateFarmPDFReport(selectedFarm, null, null, SAMPLE_SOIL, SAMPLE_WEATHER);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* High-Priority Emergency Hazard Alert Banner */}
      <HighPriorityAlertBanner
        farmName={selectedFarm.farmName}
        crop={selectedFarm.crop}
        location={`${selectedFarm.village}, ${selectedFarm.district}`}
        onNavigate={onNavigate}
      />

      {/* Smart Farm Intelligence Hero Banner CTA */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-2 border-emerald-500/60 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI/ML Farm Decision-Support System
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
              Indian Farmer Assistant
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Smart Farm Intelligence Assistant
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Map your field perimeter via GPS & GIS, analyze satellite imagery, predict crop yield ranges & disease risks, and receive voice guidance in your local language.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <button
            onClick={() => onNavigate("workflow")}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 font-extrabold text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-emerald-200"
          >
            <Sparkles className="w-5 h-5 fill-emerald-950" />
            <span>Start Field Workflow</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Banner & Farm Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Active Farm Dashboard
            </span>
            <span className="text-xs text-emerald-300">ID: {selectedFarm.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {selectedFarm.farmName}
          </h1>
          <p className="text-xs text-emerald-200/80">
            {selectedFarm.farmerName} • {selectedFarm.crop} • {selectedFarm.village}, {selectedFarm.district} ({selectedFarm.areaAcres} Acres)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Farm Selector Dropdown */}
          <select
            value={selectedFarm.id}
            onChange={(e) => {
              const farm = SAMPLE_FARMS.find((f) => f.id === e.target.value);
              if (farm) setSelectedFarm(farm);
            }}
            className="bg-emerald-900 border border-emerald-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            {SAMPLE_FARMS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farmName} ({f.crop})
              </option>
            ))}
          </select>

          <button
            onClick={() => onNavigate("registration")}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Farm</span>
          </button>

          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl bg-emerald-900 border border-emerald-700 text-emerald-200 text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
          >
            <Download className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
            <span>{downloading ? "Generating PDF..." : "Export PDF Report"}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Crop Health Index */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span>Crop Health Score</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {selectedFarm.healthScore}<span className="text-sm font-normal text-emerald-300">/100</span>
          </div>
          <div className="w-full bg-emerald-900/80 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full"
              style={{ width: `${selectedFarm.healthScore}%` }}
            />
          </div>
          <span className="text-[11px] text-emerald-300 font-medium">Excellent Canopy Density</span>
        </div>

        {/* Expected Yield */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span>Expected Yield</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {selectedFarm.expectedYield} <span className="text-xs font-normal text-emerald-300">Q/Acre</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            Total: <strong>{(selectedFarm.expectedYield * selectedFarm.areaAcres).toFixed(1)} Quintals</strong>
          </p>
        </div>

        {/* Disease Risk */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span>Disease Risk</span>
            <Scan className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              selectedFarm.diseaseRisk === "Low"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}>
              {selectedFarm.diseaseRisk} Risk
            </span>
          </div>
          <p className="text-[11px] text-emerald-300">Last Scanned: {selectedFarm.lastScanned}</p>
        </div>

        {/* Weather Status */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span>Weather Forecast</span>
            <CloudSun className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {SAMPLE_WEATHER.current.temp}°C
          </div>
          <p className="text-[11px] text-emerald-300">
            {SAMPLE_WEATHER.current.condition} • {SAMPLE_WEATHER.current.humidity}% Hum.
          </p>
        </div>

        {/* Soil Score */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
            <span>Soil Score</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {SAMPLE_SOIL.fertilityScore}<span className="text-xs font-normal text-emerald-300">/100</span>
          </div>
          <p className="text-[11px] text-emerald-300">pH: {SAMPLE_SOIL.ph} ({SAMPLE_SOIL.soilTexture})</p>
        </div>

      </div>

      {/* Quick Action Buttons Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Quick Farm Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: "yield", title: "Predict Yield", icon: TrendingUp, color: "hover:border-emerald-500" },
            { id: "disease", title: "Scan Leaf", icon: Scan, color: "hover:border-teal-500" },
            { id: "satellite", title: "Satellite GIS", icon: Map, color: "hover:border-cyan-500" },
            { id: "soil", title: "Soil Report", icon: FlaskConical, color: "hover:border-purple-500" },
            { id: "weather", title: "7-Day Weather", icon: CloudSun, color: "hover:border-blue-500" },
            { id: "market", title: "Mandi Prices", icon: Coins, color: "hover:border-amber-500" },
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => onNavigate(act.id)}
                className={`bg-emerald-950/80 border border-emerald-800/80 p-3.5 rounded-xl text-left transition-all hover:-translate-y-1 ${act.color} group shadow-md`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-900/80 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-white group-hover:text-emerald-300">{act.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yield Trend Recharts */}
        <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <div>
              <h3 className="font-bold text-sm text-white">Historical & AI Predicted Yield Trend</h3>
              <p className="text-[11px] text-emerald-300">Quintals / Acre comparison against regional benchmark</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldTrendData}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
                <XAxis dataKey="year" stroke="#a7f3d0" fontSize={11} />
                <YAxis stroke="#a7f3d0" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#022c22", borderColor: "#059669", color: "#fff", fontSize: "12px" }} />
                <Area type="monotone" dataKey="yield" stroke="#10b981" fillOpacity={1} fill="url(#yieldGrad)" name="Farm Yield (Q/Acre)" />
                <Area type="monotone" dataKey="benchmark" stroke="#38bdf8" fillOpacity={0} name="Regional Benchmark" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rainfall & Soil Moisture Recharts */}
        <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <div>
              <h3 className="font-bold text-sm text-white">Rainfall vs Soil Moisture Telemetry</h3>
              <p className="text-[11px] text-emerald-300">Monthly cumulative precipitation (mm) & moisture %</p>
            </div>
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moistureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
                <XAxis dataKey="month" stroke="#a7f3d0" fontSize={11} />
                <YAxis stroke="#a7f3d0" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#022c22", borderColor: "#059669", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="rainfall" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                <Bar dataKey="moisture" fill="#10b981" radius={[4, 4, 0, 0]} name="Soil Moisture %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Notifications & AI Advisory Feed */}
      <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Realtime Farm Alerts & Notifications</h3>
          </div>
          <span className="text-[11px] text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
            3 Unread
          </span>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-emerald-900/40 border border-emerald-800/60 rounded-xl p-3.5 flex items-start gap-3 hover:bg-emerald-900/70 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{n.title}</h4>
                  <span className="text-[10px] text-emerald-400/80">{n.time}</span>
                </div>
                <p className="text-xs text-emerald-200/80 leading-relaxed">{n.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
