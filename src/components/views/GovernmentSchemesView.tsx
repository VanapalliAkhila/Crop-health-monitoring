import React, { useState } from "react";
import { SAMPLE_SCHEMES } from "../../data/mockData";
import { Building2, ExternalLink, CheckCircle2, ShieldCheck, Search } from "lucide-react";

export const GovernmentSchemesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedScheme, setAppliedScheme] = useState<string | null>(null);

  const filtered = SAMPLE_SCHEMES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Government Portals Direct Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Government Schemes & Subsidies
          </h1>
          <p className="text-xs text-emerald-200/80">
            Check eligibility and directly apply for PM-KISAN, PMFBY crop insurance, and drip irrigation subsidies.
          </p>
        </div>
        <Building2 className="w-10 h-10 text-emerald-400 hidden sm:block" />
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search schemes by name or category..."
          className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/60 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {scheme.category}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">{scheme.subsidyPercentage}</span>
              </div>

              <h3 className="font-bold text-base text-white">{scheme.title}</h3>

              <p className="text-xs text-emerald-200/80 leading-relaxed">{scheme.benefits}</p>

              <div className="bg-emerald-900/40 border border-emerald-800 p-3 rounded-xl text-[11px] space-y-1">
                <span className="font-semibold text-emerald-300 block">Eligibility:</span>
                <p className="text-emerald-200/90">{scheme.eligibility}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-emerald-800/60 flex items-center justify-between">
              <a
                href={scheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:text-white font-semibold flex items-center gap-1"
              >
                <span>Portal Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setAppliedScheme(scheme.title);
                  setTimeout(() => setAppliedScheme(null), 3000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-emerald-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
              >
                {appliedScheme === scheme.title ? "Application Submitted!" : "Apply Now"}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
