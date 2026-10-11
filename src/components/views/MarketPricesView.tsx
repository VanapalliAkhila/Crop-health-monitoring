import React, { useState } from "react";
import { SAMPLE_MARKET_PRICES } from "../../data/mockData";
import { Coins, TrendingUp, TrendingDown, Calendar, Building2, Sparkles } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const MarketPricesView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(SAMPLE_MARKET_PRICES[0]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Agmarknet APMC Direct Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Mandi Market Price Prediction
          </h1>
          <p className="text-xs text-emerald-200/80">
            Realtime APMC Mandi commodity price tracking, historical trends, and AI-predicted best selling windows.
          </p>
        </div>
        <Coins className="w-10 h-10 text-amber-400 hidden sm:block" />
      </div>

      {/* Commodity Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAMPLE_MARKET_PRICES.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedItem(m)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all shadow-xl ${
              selectedItem.id === m.id
                ? "bg-emerald-900/80 border-emerald-500 ring-2 ring-emerald-500/40"
                : "bg-emerald-950/80 border-emerald-800 hover:border-emerald-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300">{m.commodity}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                m.trend === "up" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}>
                {m.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.trend === "up" ? "+5.6%" : "-2.0%"}
              </span>
            </div>

            <div className="text-2xl font-extrabold text-white mb-1">
              ₹{m.currentPrice.toLocaleString()} <span className="text-xs font-normal text-emerald-400">/ Quintal</span>
            </div>

            <div className="text-[11px] text-emerald-200/80 truncate">
              {m.mandiName} ({m.state})
            </div>
          </div>
        ))}
      </div>

      {/* Selected Commodity Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Line Chart */}
        <div className="lg:col-span-7 bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
            <div>
              <h3 className="font-bold text-sm text-white">5-Month Price Trend - {selectedItem.commodity}</h3>
              <p className="text-[11px] text-emerald-300">Rates in ₹ / Quintal in {selectedItem.mandiName}</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedItem.historical}>
                <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
                <XAxis dataKey="month" stroke="#a7f3d0" fontSize={11} />
                <YAxis stroke="#a7f3d0" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#022c22", borderColor: "#059669", color: "#fff", fontSize: "12px" }} />
                <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: "#f59e0b" }} name="Price (₹/Q)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Forecast & Selling Window Box */}
        <div className="lg:col-span-5 bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">AI Selling Window Recommendation</h3>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Recommended Action:
            </span>
            <p className="text-xs text-white font-bold">{selectedItem.bestSellingWindow}</p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Market Intelligence Insight:
            </span>
            <p className="text-xs text-emerald-100 leading-relaxed">{selectedItem.aiForecast}</p>
          </div>

          <div className="text-[11px] text-emerald-300/80 pt-2 border-t border-emerald-800/60">
            * Rates verified against direct Mandi arrivals and trade volumes.
          </div>
        </div>

      </div>

    </div>
  );
};
