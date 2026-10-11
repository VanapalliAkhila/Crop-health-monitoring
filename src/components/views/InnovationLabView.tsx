import React, { useState, useEffect } from "react";
import { Cpu, Plane, Radio, Leaf, Zap, Shield, Play, Pause, RefreshCw } from "lucide-react";

export const InnovationLabView: React.FC = () => {
  const [droneFlying, setDroneFlying] = useState(false);
  const [droneBattery, setDroneBattery] = useState(88);
  const [sprayedCoverage, setSprayedCoverage] = useState(42);

  // IoT Live Feeds
  const [iotSensors, setIotSensors] = useState({
    moistureNode1: 28.4,
    tempNode2: 27.8,
    phNode3: 6.8,
    solarRad: 840,
  });

  // Carbon Calculator
  const [acres, setAcres] = useState(5);
  const [carbonSavedKg, setCarbonSavedKg] = useState(1250);

  useEffect(() => {
    let interval: any;
    if (droneFlying) {
      interval = setInterval(() => {
        setSprayedCoverage((prev) => (prev >= 100 ? 100 : prev + 2));
        setDroneBattery((prev) => (prev <= 10 ? 10 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [droneFlying]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Next-Gen AgTech Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            AgriVision Innovation Lab
          </h1>
          <p className="text-xs text-emerald-200/80">
            Autonomous spraying drone route planner, IoT sensor feeds, carbon footprint calculator, and offline models.
          </p>
        </div>
        <Cpu className="w-10 h-10 text-cyan-400 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Drone Route Simulator */}
        <div className="lg:col-span-7 bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Autonomous Spraying Drone Route Simulation</h3>
            </div>
            <span className="text-xs text-cyan-300 font-semibold">Agrithreat-x4 Quadcopter</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-800 h-64 bg-emerald-950/90 flex items-center justify-center">
            {/* Field Grid Canvas Simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

            {/* Drone Icon Moving */}
            <div
              className="absolute w-10 h-10 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_#22d3ee] transition-all duration-1000"
              style={{
                top: `${30 + (sprayedCoverage % 50)}%`,
                left: `${10 + sprayedCoverage * 0.8}%`,
              }}
            >
              <Plane className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>

            <div className="absolute bottom-3 left-3 bg-emerald-950/90 text-emerald-300 text-[10px] px-3 py-1.5 rounded-xl border border-emerald-700 font-mono space-y-0.5">
              <div>Battery: {droneBattery}%</div>
              <div>Field Spray Coverage: {sprayedCoverage}%</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setDroneFlying(!droneFlying)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-emerald-950 font-bold text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              {droneFlying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{droneFlying ? "Pause Mission" : "Launch Autonomous Flight"}</span>
            </button>

            <button
              onClick={() => {
                setSprayedCoverage(0);
                setDroneBattery(100);
                setDroneFlying(false);
              }}
              className="text-xs text-emerald-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Drone Route
            </button>
          </div>
        </div>

        {/* IoT Live Sensor Feeds & Carbon Calculator */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* IoT Node Live Telemetry */}
          <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="font-bold text-sm text-white">IoT Sensor Network Feeds</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700">
                LoRaWAN Online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-900/40 border border-emerald-800 p-3 rounded-xl">
                <span className="text-[10px] text-emerald-400 block">Soil Moisture Node #1</span>
                <span className="text-base font-bold text-white">{iotSensors.moistureNode1}%</span>
              </div>
              <div className="bg-emerald-900/40 border border-emerald-800 p-3 rounded-xl">
                <span className="text-[10px] text-emerald-400 block">Root Temp Node #2</span>
                <span className="text-base font-bold text-white">{iotSensors.tempNode2}°C</span>
              </div>
              <div className="bg-emerald-900/40 border border-emerald-800 p-3 rounded-xl">
                <span className="text-[10px] text-emerald-400 block">pH Sensor Node #3</span>
                <span className="text-base font-bold text-white">{iotSensors.phNode3}</span>
              </div>
              <div className="bg-emerald-900/40 border border-emerald-800 p-3 rounded-xl">
                <span className="text-[10px] text-emerald-400 block">Solar Flux</span>
                <span className="text-base font-bold text-white">{iotSensors.solarRad} W/m²</span>
              </div>
            </div>
          </div>

          {/* Carbon Footprint Calculator */}
          <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Carbon Credit Estimator</h3>
            </div>

            <p className="text-xs text-emerald-200/80">
              Precise NPK split application and AWD rice water management reduces methane & nitrous oxide emissions.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-emerald-300 block">
                Sustainable Land Managed (Acres): {acres}
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={acres}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setAcres(val);
                  setCarbonSavedKg(val * 250);
                }}
                className="w-full h-2 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="bg-emerald-900/60 border border-emerald-500/40 p-4 rounded-xl text-center">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
                Estimated CO2 Abatement
              </span>
              <div className="text-2xl font-extrabold text-white mt-1">
                {carbonSavedKg.toLocaleString()} <span className="text-xs font-normal text-emerald-300">kg CO2e / Year</span>
              </div>
              <span className="text-[10px] text-emerald-300 block mt-1">
                Equivalent to planting ~{(carbonSavedKg / 20).toFixed(0)} trees
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
