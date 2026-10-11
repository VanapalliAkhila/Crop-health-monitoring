import React, { useState } from "react";
import { ShieldCheck, Users, AlertTriangle, CheckCircle2, XCircle, Activity, Building2, MapPin } from "lucide-react";
import { SAMPLE_FARMS } from "../../data/mockData";

export const AdminDashboardView: React.FC = () => {
  const [approvals, setApprovals] = useState([
    { id: "app-1", farmer: "Ramesh Patel", scheme: "PM Fasal Bima Yojana (PMFBY)", amount: "₹45,000", status: "Pending" },
    { id: "app-2", farmer: "Suresh Deshmukh", scheme: "Drip Irrigation Subsidy (55%)", amount: "₹28,500", status: "Pending" },
    { id: "app-3", farmer: "Gurpreet Singh", scheme: "Soil Health Improvement Grant", amount: "₹12,000", status: "Pending" },
  ]);

  const handleApprove = (id: string, newStatus: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Department of Agriculture & Farmers Welfare
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Agricultural Officer & Admin Console
          </h1>
          <p className="text-xs text-emerald-200/80">
            District-wide farm monitoring, disease outbreak heatmaps, subsidy approval queues, and AI model telemetry.
          </p>
        </div>
        <ShieldCheck className="w-10 h-10 text-emerald-400 hidden sm:block" />
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-emerald-300 font-semibold block mb-1">Total Registered Farms</span>
          <div className="text-3xl font-extrabold text-white">52,480</div>
          <span className="text-[11px] text-emerald-400">+1,240 this month</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-emerald-300 font-semibold block mb-1">Total Acreage Monitored</span>
          <div className="text-3xl font-extrabold text-white">184,200 <span className="text-xs font-normal text-emerald-400">Acres</span></div>
          <span className="text-[11px] text-emerald-400">10m Sentinel-2 Resolution</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-emerald-300 font-semibold block mb-1">Active Disease Alerts</span>
          <div className="text-3xl font-extrabold text-amber-400">14</div>
          <span className="text-[11px] text-amber-300">Tomato Late Blight in Kolar</span>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-emerald-300 font-semibold block mb-1">AI System Model Accuracy</span>
          <div className="text-3xl font-extrabold text-emerald-400">98.4%</div>
          <span className="text-[11px] text-emerald-300">Avg Latency: 140ms</span>
        </div>
      </div>

      {/* Subsidy Approvals Queue */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Pending Subsidy & Claim Approvals Queue</h3>
          </div>
          <span className="text-xs text-emerald-300 font-semibold">3 Action Required</span>
        </div>

        <div className="space-y-3">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{app.farmer}</span>
                  <span className="text-xs text-emerald-400 font-semibold">({app.amount})</span>
                </div>
                <p className="text-xs text-emerald-200/80 mt-0.5">{app.scheme}</p>
              </div>

              <div className="flex items-center gap-2">
                {app.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(app.id, "Approved")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleApprove(app.id, "Rejected")}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-500/40 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    app.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500" : "bg-red-500/20 text-red-300 border-red-500"
                  }`}>
                    {app.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
