import React, { useState } from "react";
import { Farm } from "../../types";
import { FarmMap } from "../gis/FarmMap";
import { Sprout, MapPin, CheckCircle2, Upload, Plus, Layers, ArrowLeft } from "lucide-react";

interface FarmRegistrationViewProps {
  onFarmRegistered: (newFarm: Farm) => void;
  onCancel: () => void;
}

export const FarmRegistrationView: React.FC<FarmRegistrationViewProps> = ({
  onFarmRegistered,
  onCancel,
}) => {
  const [farmerName, setFarmerName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [crop, setCrop] = useState("Paddy (Rice)");
  const [state, setState] = useState("Andhra Pradesh");
  const [district, setDistrict] = useState("Guntur");
  const [village, setVillage] = useState("Tenali");
  const [areaAcres, setAreaAcres] = useState<number>(3.5);
  const [soilType, setSoilType] = useState("Alluvial / Clay Loam");
  const [irrigationType, setIrrigationType] = useState("Canal & Borewell");
  const [lat, setLat] = useState<number>(16.243);
  const [lng, setLng] = useState<number>(80.648);
  const [submitted, setSubmitted] = useState(false);

  const cropsList = [
    "Paddy (Rice)",
    "Wheat",
    "Cotton",
    "Maize",
    "Sugarcane",
    "Tomato",
    "Potato",
    "Groundnut",
    "Pulses (Tur/Chana)",
    "Mustard",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm: Farm = {
      id: `farm-${Date.now().toString().slice(-4)}`,
      farmerName: farmerName || "Anil Verma",
      farmName: farmName || "New Sunrise Acre",
      crop,
      state,
      district,
      village,
      areaAcres: Number(areaAcres),
      soilType,
      irrigationType,
      lat,
      lng,
      boundaryPoints: [
        [lat + 0.001, lng - 0.001],
        [lat + 0.001, lng + 0.001],
        [lat - 0.001, lng + 0.001],
        [lat - 0.001, lng - 0.001],
      ],
      healthScore: 88,
      expectedYield: 22.0,
      diseaseRisk: "Low",
      lastScanned: new Date().toISOString().split("T")[0],
    };

    setSubmitted(true);
    setTimeout(() => {
      onFarmRegistered(newFarm);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 p-2 rounded-lg bg-emerald-950 border border-emerald-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-xs text-emerald-400 font-medium">Farm Registration Form</span>
      </div>

      <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="border-b border-emerald-800/80 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-400" />
            Register New Farm Plot
          </h2>
          <p className="text-xs text-emerald-200/80">
            Enter farm metadata and select GPS location on map for automated satellite imagery scanning.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-900/90 border border-emerald-500 p-8 rounded-2xl text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Farm Registered Successfully!</h3>
            <p className="text-xs text-emerald-200">
              Initializing Sentinel-2 satellite scan & AI baseline metrics...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Farmer & Farm Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Farm Identifier / Name
                </label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Green Valley Acre #2"
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Crop & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Primary Crop Variety
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {cropsList.map((c) => (
                    <option key={c} value={c} className="bg-emerald-950 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  District & Village
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    className="w-1/2 bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village"
                    className="w-1/2 bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Farm Size & Soil */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Farm Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(parseFloat(e.target.value))}
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  <option value="Alluvial / Clay Loam">Alluvial / Clay Loam</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red Sandy Soil">Red Sandy Soil</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                  <option value="Peaty / Marshy">Peaty / Marshy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Irrigation System
                </label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  <option value="Canal & Borewell">Canal & Borewell</option>
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Sprinkler System">Sprinkler System</option>
                  <option value="Rainfed Only">Rainfed Only</option>
                </select>
              </div>
            </div>

            {/* Interactive GPS Pin Picker Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Pinpoint Farm Location on Satellite Map:
                </label>
                <span className="text-[11px] text-emerald-400">
                  Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                </span>
              </div>
              
              <FarmMap
                selectableLocation={true}
                onLocationPicked={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-bold text-sm shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5 text-emerald-950" />
              <span>Register Farm & Run Satellite AI Scan</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
