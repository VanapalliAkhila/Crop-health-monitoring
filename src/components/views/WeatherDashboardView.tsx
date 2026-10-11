import React, { useState } from "react";
import { SAMPLE_WEATHER } from "../../data/mockData";
import { CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer, Sparkles, RefreshCw } from "lucide-react";

export const WeatherDashboardView: React.FC = () => {
  const [aiAdvice, setAiAdvice] = useState(SAMPLE_WEATHER.aiAdvice);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const generateNewAdvice = async () => {
    setLoadingAdvice(true);
    setTimeout(() => {
      setAiAdvice(
        "Current high humidity (78%) paired with scattered showers on Monday creates optimal conditions for fungal spores. Postpone pesticide application until Thursday when clear skies return."
      );
      setLoadingAdvice(false);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30">
              IMD & OpenWeather Synchronized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Weather Forecast & AI Advisory
          </h1>
          <p className="text-xs text-emerald-200/80">
            Realtime farm weather monitoring, 7-day precipitation forecasts, and actionable agricultural advice.
          </p>
        </div>
        <CloudSun className="w-10 h-10 text-blue-400 hidden sm:block" />
      </div>

      {/* Current Weather Primary Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <CloudRain className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white">
                {SAMPLE_WEATHER.current.temp}°C
              </div>
              <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                {SAMPLE_WEATHER.current.condition} • Guntur Region
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto">
            <div className="bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl text-center">
              <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-400 block">Humidity</span>
              <span className="text-sm font-bold text-white">{SAMPLE_WEATHER.current.humidity}%</span>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl text-center">
              <CloudRain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-400 block">Rainfall</span>
              <span className="text-sm font-bold text-white">{SAMPLE_WEATHER.current.rainfallMm} mm</span>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl text-center">
              <Wind className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-400 block">Wind Speed</span>
              <span className="text-sm font-bold text-white">{SAMPLE_WEATHER.current.windSpeedKm} km/h</span>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl text-center">
              <Sun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-400 block">UV Index</span>
              <span className="text-sm font-bold text-white">{SAMPLE_WEATHER.current.uvIndex} / 10</span>
            </div>
          </div>
        </div>

        {/* AI Weather Advisory Box */}
        <div className="bg-emerald-900/60 border border-emerald-500/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Weather Agricultural Advisory</span>
            </div>
            <button
              onClick={generateNewAdvice}
              disabled={loadingAdvice}
              className="text-xs text-emerald-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAdvice ? "animate-spin" : ""}`} /> Refresh AI Advice
            </button>
          </div>
          <p className="text-xs text-white leading-relaxed font-normal">{aiAdvice}</p>
        </div>

      </div>

      {/* 7-Day Forecast Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">7-Day Weather Forecast</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {SAMPLE_WEATHER.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`bg-emerald-950/80 border p-4 rounded-2xl text-center space-y-2 transition-transform hover:-translate-y-1 ${
                idx === 0 ? "border-emerald-500 bg-emerald-900/40" : "border-emerald-800/80"
              }`}
            >
              <div className="text-xs font-bold text-emerald-300">{day.day}</div>
              <div className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-blue-400 mx-auto">
                {day.rainProb > 50 ? <CloudRain className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="text-sm font-bold text-white">
                {day.tempHigh}° <span className="text-xs text-emerald-400 font-normal">/ {day.tempLow}°</span>
              </div>
              <div className="text-[10px] text-blue-300 font-medium">{day.rainProb}% Rain</div>
              <div className="text-[10px] text-emerald-300/80 truncate">{day.condition}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
