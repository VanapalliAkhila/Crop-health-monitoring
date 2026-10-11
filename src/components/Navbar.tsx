import React, { useState } from "react";
import { 
  Sprout, 
  Map, 
  Scan, 
  TrendingUp, 
  CloudSun, 
  FlaskConical, 
  Coins, 
  Building2, 
  Bot, 
  Mic, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X,
  FileText,
  UserCheck,
  Cpu
} from "lucide-react";
import { UserRole } from "../types";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../data/languages";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  onOpenVoiceAssistant: () => void;
  onQuickRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  currentLang,
  setCurrentLang,
  isOffline,
  setIsOffline,
  onOpenVoiceAssistant,
  onQuickRegister,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS["en"];

  const navItems = [
    { id: "workflow", label: "Guided Assistant", icon: Sparkles },
    { id: "dashboard", label: t.dashboard, icon: Sprout },
    { id: "mapping", label: "Field Mapping", icon: Map },
    { id: "predictions", label: "Yield & Risk", icon: TrendingUp },
    { id: "recommendations", label: "Guidance", icon: ShieldCheck },
    { id: "disease", label: t.diseaseScanner, icon: Scan },
    { id: "satellite", label: t.satelliteGIS, icon: Map },
    { id: "weather", label: t.weatherForecast, icon: CloudSun },
    { id: "soil", label: t.soilHealth, icon: FlaskConical },
    { id: "market", label: t.marketPrices, icon: Coins },
    { id: "schemes", label: t.govSchemes, icon: Building2 },
    { id: "chatbot", label: t.aiAssistant, icon: Bot },
    { id: "architecture", label: "Architecture & ML", icon: Cpu },
    ...(userRole === "admin" || userRole === "officer" 
      ? [{ id: "admin", label: t.adminConsole, icon: ShieldCheck }] 
      : []),
  ];

  return (
    <header id="main-navbar" className="sticky top-0 z-50 bg-emerald-950/90 backdrop-blur-xl border-b border-white/15 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab("workflow")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Smart Farm<span className="text-emerald-400"> Assistant</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  AI/ML
                </span>
              </div>
              <p className="text-[10px] text-emerald-300/80 -mt-0.5 hidden sm:block">
                Farm Decision-Support System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500 text-emerald-950 font-semibold shadow-md"
                      : "text-emerald-100/80 hover:text-white hover:bg-emerald-900/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-950" : "text-emerald-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector */}
            <select
              id="language-selector"
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-emerald-900/80 border border-emerald-700/60 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-emerald-950 text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>

            {/* Offline Mode Toggle */}
            <button
              id="offline-toggle-btn"
              onClick={() => setIsOffline(!isOffline)}
              title={isOffline ? "Offline Simulation Mode Active" : "Online Realtime Sync"}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isOffline
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-900/60 text-emerald-300 border-emerald-700/40"
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isOffline ? "Offline Mode" : "Online"}</span>
            </button>

            {/* Voice Assistant Trigger */}
            <button
              id="voice-assistant-trigger-btn"
              onClick={onOpenVoiceAssistant}
              className="relative p-2 rounded-lg bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center"
              title="Voice Assistant (Multilingual Speech)"
            >
              <Mic className="w-4 h-4 animate-pulse text-emerald-950" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
              </span>
            </button>

            {/* Role Switcher */}
            <select
              id="role-selector"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-emerald-900/80 border border-emerald-700/60 text-white text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer hidden md:block"
            >
              <option value="farmer">Farmer View</option>
              <option value="officer">Agri Officer</option>
              <option value="admin">System Admin</option>
            </select>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800/80 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? "bg-emerald-500 text-emerald-950 font-semibold" : "text-emerald-100 hover:bg-emerald-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between">
            <span className="text-xs text-emerald-300">Active Role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-emerald-900 border border-emerald-700 text-white text-xs rounded px-2 py-1"
            >
              <option value="farmer">Farmer</option>
              <option value="officer">Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
