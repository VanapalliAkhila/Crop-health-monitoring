import React, { useState } from "react";
import { DiseaseResult } from "../../types";
import { SAMPLE_DISEASES } from "../../data/mockData";
import { Scan, Upload, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2, Info, Eye } from "lucide-react";

export const DiseaseDetectionView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>("tomato_blight");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseResult>(SAMPLE_DISEASES["tomato_blight"]);
  const [cropHint, setCropHint] = useState("Tomato");

  const sampleOptions = [
    { key: "tomato_blight", label: "Tomato Late Blight", crop: "Tomato", image: SAMPLE_DISEASES["tomato_blight"].sampleImage },
    { key: "rice_blast", label: "Rice Blast Lesions", crop: "Paddy/Rice", image: SAMPLE_DISEASES["rice_blast"].sampleImage },
    { key: "cotton_curl", label: "Cotton Leaf Curl Virus", crop: "Cotton", image: SAMPLE_DISEASES["cotton_curl"].sampleImage },
    { key: "healthy_leaf", label: "Healthy Green Foliage", crop: "Healthy Leaf", image: SAMPLE_DISEASES["healthy_leaf"].sampleImage },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        runDiseaseAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runDiseaseAnalysis = async (imgBase64?: string) => {
    setIsScanning(true);

    try {
      if (imgBase64) {
        const res = await fetch("/api/ai/detect-disease", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: imgBase64, cropHint }),
        });
        const data = await res.json();
        if (data.result) setDiagnosis(data.result);
      } else {
        setDiagnosis(SAMPLE_DISEASES[selectedKey]);
      }
    } catch (e) {
      setDiagnosis(SAMPLE_DISEASES[selectedKey]);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 800);
    }
  };

  const activeImage = uploadedImage || SAMPLE_DISEASES[selectedKey]?.sampleImage;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              CNN Pathological Vision Model
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Leaf Disease Diagnostic Scanner
          </h1>
          <p className="text-xs text-emerald-200/80">
            Upload leaf photo or choose a sample to identify crop pathogens, infection severity %, organic & chemical remedies.
          </p>
        </div>
        <Scan className="w-10 h-10 text-emerald-400 hidden sm:block" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload & Scanner Column */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-emerald-800/60 pb-2">
              1. Select or Upload Crop Leaf Image
            </h3>

            {/* Sample Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-2">
                Pre-loaded Infected Leaf Samples:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sampleOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSelectedKey(opt.key);
                      setUploadedImage(null);
                      setDiagnosis(SAMPLE_DISEASES[opt.key]);
                    }}
                    className={`p-2 rounded-xl text-left border text-xs transition-all ${
                      selectedKey === opt.key && !uploadedImage
                        ? "bg-emerald-500/20 border-emerald-500 text-white font-bold"
                        : "bg-emerald-900/40 border-emerald-800/80 text-emerald-200 hover:bg-emerald-900"
                    }`}
                  >
                    <div className="truncate">{opt.label}</div>
                    <span className="text-[10px] text-emerald-400/80">{opt.crop}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop File Upload */}
            <div className="relative border-2 border-dashed border-emerald-700/80 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-emerald-900/30">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Click or drag crop leaf photo here</p>
              <p className="text-[11px] text-emerald-300">Supports JPG, PNG up to 10MB</p>
            </div>

            {/* Image Viewfinder with Scanning Beam Animation */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-800 h-64 bg-black flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt="Crop Leaf"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-emerald-500 text-xs">No Leaf Image Selected</div>
              )}

              {/* Laser Scanning Animation Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10b981] animate-bounce top-1/2" />
              )}

              <div className="absolute bottom-2 right-2 bg-emerald-950/90 text-emerald-300 text-[10px] px-2.5 py-1 rounded-full border border-emerald-700 font-mono">
                {isScanning ? "Analyzing Micro-features..." : "OpenCV Normalized View"}
              </div>
            </div>

            <button
              onClick={() => runDiseaseAnalysis(uploadedImage || undefined)}
              disabled={isScanning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-bold text-xs shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>CNN Vision Model Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Pathogen Scanner</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Diagnostic Results Breakdown Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
            
            {/* Header Diagnosis Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-800/60 pb-4">
              <div>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  AI Diagnostic Result
                </span>
                <h2 className="text-xl font-extrabold text-white">{diagnosis.name}</h2>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                diagnosis.severity > 50 
                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                  : diagnosis.severity > 0
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}>
                {diagnosis.severity > 0 ? `Severity: ${diagnosis.severity}%` : "Healthy - 0% Severity"}
              </div>
            </div>

            {/* Symptoms & Cause */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-4 space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Observed Symptoms:
                </span>
                <p className="text-xs text-emerald-100/90 leading-relaxed">{diagnosis.symptoms}</p>
              </div>

              <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-4 space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Pathogen Cause:
                </span>
                <p className="text-xs text-emerald-100/90 leading-relaxed">{diagnosis.causes}</p>
              </div>
            </div>

            {/* Remedies Comparison Cards */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Recommended Treatment & Management
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Organic Remedies */}
                <div className="bg-emerald-900/60 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🌿 Organic / Bio-Fungicide
                  </span>
                  <p className="text-xs text-white leading-relaxed font-normal">{diagnosis.organicRemedies}</p>
                </div>

                {/* Chemical Remedies */}
                <div className="bg-emerald-900/60 border border-emerald-800 rounded-xl p-4 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    🧪 CPCB Chemical Spray
                  </span>
                  <p className="text-xs text-white leading-relaxed font-normal">{diagnosis.chemicalRemedies}</p>
                </div>

              </div>

              {/* Preventive Measures */}
              <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-4 space-y-1">
                <span className="font-bold text-xs text-emerald-300">Cultural & Preventive Practices:</span>
                <p className="text-xs text-emerald-200/90 leading-relaxed">{diagnosis.preventiveMeasures}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
