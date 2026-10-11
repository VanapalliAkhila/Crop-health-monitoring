import React, { useState } from "react";
import { FarmMap } from "../gis/FarmMap";
import { SAMPLE_FARMS } from "../../data/mockData";
import { Map, Layers, Calendar, Eye, Activity, Sparkles, Sliders } from "lucide-react";

export const SatelliteMonitoringView: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState(SAMPLE_FARMS[0]);
  const [activeLayer, setActiveLayer] = useState<"satellite" | "ndvi" | "moisture" | "vegetation">("ndvi");
  const [monthIndex, setMonthIndex] = useState(7); // August 2026

  const timelineMonths = [
    { month: "Jan 2026", ndvi: 0.28, moisture: 22, status: "Land Preparation" },
    { month: "Feb 2026", ndvi: 0.35, moisture: 28, status: "Germination" },
    { month: "Mar 2026", ndvi: 0.48, moisture: 34, status: "Vegetative Phase" },
    { month: "Apr 2026", ndvi: 0.62, moisture: 42, status: "Tillering Phase" },
    { month: "May 2026", ndvi: 0.75, moisture: 48, status: "Panicle Initiation" },
    { month: "Jun 2026", ndvi: 0.84, moisture: 55, status: "Flowering & Peak Canopy" },
    { month: "Jul 2026", ndvi: 0.88, moisture: 52, status: "Grain Filling" },
    { month: "Aug 2026", ndvi: 0.82, moisture: 46, status: "Ripening Phase (Active)" },
    { month: "Sep 2026", ndvi: 0.65, moisture: 38, status: "Harvest Ready" },
  ];

  const currentMonthData = timelineMonths[monthIndex];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Sentinel-2 L2A Optical Engine (10m)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Satellite GIS & NDVI Canopy Monitoring
          </h1>
          <p className="text-xs text-emerald-200/80">
            Realtime Sentinel-2 multi-spectral imagery analyzing crop vegetation vigor, moisture stress, and polygon boundaries.
          </p>
        </div>
        <Map className="w-10 h-10 text-emerald-400 hidden sm:block" />
      </div>

      {/* Main Map Component */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-950/80 border border-emerald-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Active GIS Farm Polygon:</span>
            <select
              value={selectedFarm.id}
              onChange={(e) => {
                const farm = SAMPLE_FARMS.find((f) => f.id === e.target.value);
                if (farm) setSelectedFarm(farm);
              }}
              className="bg-emerald-900 border border-emerald-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              {SAMPLE_FARMS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmName} ({f.village})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-300 font-medium">Spectral Layer:</span>
            {[
              { id: "satellite", label: "Optical RGB" },
              { id: "ndvi", label: "NDVI Heatmap" },
              { id: "moisture", label: "Moisture Index" },
              { id: "vegetation", label: "Density Mask" },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === layer.id
                    ? "bg-emerald-500 text-emerald-950 shadow"
                    : "bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaflet Map Renderer */}
        <FarmMap
          farms={SAMPLE_FARMS}
          selectedFarmId={selectedFarm.id}
          onSelectFarm={(f) => setSelectedFarm(f)}
          activeLayer={activeLayer}
        />
      </div>

      {/* Timeline Slider & Satellite Telemetry Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline Slider */}
        <div className="lg:col-span-7 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Historical Satellite Pass Timeline</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">{currentMonthData.month}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-emerald-300">
              <span>Jan 2026</span>
              <span className="font-bold text-white">Current View: {currentMonthData.month}</span>
              <span>Sep 2026</span>
            </div>
            <input
              type="range"
              min="0"
              max={timelineMonths.length - 1}
              value={monthIndex}
              onChange={(e) => setMonthIndex(parseInt(e.target.value))}
              className="w-full h-2 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-emerald-400 block font-semibold">NDVI Score</span>
              <span className="text-xl font-bold text-white">{currentMonthData.ndvi}</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-emerald-400 block font-semibold">Moisture Index</span>
              <span className="text-xl font-bold text-white">{currentMonthData.moisture}%</span>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-emerald-400 block font-semibold">Crop Stage</span>
              <span className="text-xs font-bold text-emerald-300 block truncate">{currentMonthData.status}</span>
            </div>
          </div>
        </div>

        {/* GIS Metadata Metrics */}
        <div className="lg:col-span-5 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-emerald-800/60 pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Spectral Band Indices (Sentinel-2)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-emerald-200 mb-1">
                <span>NDVI (Normalized Difference Veg. Index)</span>
                <span className="font-bold text-emerald-400">{currentMonthData.ndvi} / 1.0</span>
              </div>
              <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${currentMonthData.ndvi * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-emerald-200 mb-1">
                <span>NDWI (Water / Moisture Index)</span>
                <span className="font-bold text-cyan-400">0.42 / 1.0</span>
              </div>
              <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: "42%" }} />
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-800/60 space-y-1 text-emerald-300 text-[11px]">
              <div>• Spatial Resolution: <strong>10 meters per pixel</strong></div>
              <div>• Revisit Cycle: <strong>Every 5 Days</strong></div>
              <div>• Cloud Cover Loss: <strong>&lt; 3.2%</strong></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
