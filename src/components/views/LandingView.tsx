import React from "react";
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
  Sparkles, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Zap, 
  Globe2, 
  Play,
  HelpCircle,
  Cpu
} from "lucide-react";
import { AIPipelineDiagram } from "../AIPipelineDiagram";

interface LandingViewProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  onSelectFeature: (featureId: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onGetStarted,
  onExploreDemo,
  onSelectFeature,
}) => {
  const stats = [
    { value: "50,000+", label: "Farms Scanned & Monitored" },
    { value: "98.4%", label: "Disease Detection Accuracy" },
    { value: "₹45,000+", label: "Avg Profit Boost / Acre" },
    { value: "10+", label: "Indian Languages Supported" },
  ];

  const features = [
    {
      id: "yield",
      title: "AI Crop Yield Prediction",
      desc: "XGBoost + Gemini powered yield estimation per acre using climate, NPK, and historical data.",
      icon: TrendingUp,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "disease",
      title: "Leaf Disease Scanner",
      desc: "Instant leaf image analysis detecting fungal & viral diseases with organic & chemical cure steps.",
      icon: Scan,
      color: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    },
    {
      id: "satellite",
      title: "Satellite GIS & NDVI Layers",
      desc: "10m Sentinel-2 optical imagery mapping crop canopy density, vegetation stress, and moisture.",
      icon: Map,
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      id: "soil",
      title: "Soil Health & NPK Analyzer",
      desc: "Interactive soil nutrient radar breakdown, pH estimation, and custom fertilizer balance plans.",
      icon: FlaskConical,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    {
      id: "weather",
      title: "Weather AI & 7-Day Advisory",
      desc: "Realtime rainfall and temperature forecasting paired with AI preventive farming guidance.",
      icon: CloudSun,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      id: "market",
      title: "Mandi Price Forecasting",
      desc: "Predict commodity price trends in nearby APMC Mandis to choose the best selling window.",
      icon: Coins,
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
  ];

  const testimonials = [
    {
      quote: "AgriVision AI predicted my Paddy crop yield within 96% accuracy and saved my crop from Rice Blast disease early!",
      name: "Ramesh Patel",
      role: "Farmer, Guntur (AP)",
      acres: "4.5 Acres",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      quote: "The voice assistant in Marathi makes it effortless for my father to check Mandi prices and PM-KISAN updates.",
      name: "Suresh Deshmukh",
      role: "Cotton Grower, Yavatmal (MH)",
      acres: "8.0 Acres",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const faqs = [
    {
      q: "How does AgriVision AI predict crop yield?",
      a: "Our machine learning engine combines satellite NDVI vegetation indices, soil NPK levels, rainfall records, and crop varieties to run multi-factor regression models, validated by Google Gemini AI reasoning.",
    },
    {
      q: "Does the app work in regional Indian languages?",
      a: "Yes! AgriVision AI supports 10 major Indian languages including Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, and English with full text-to-speech voice assistant capabilities.",
    },
    {
      q: "Can I download PDF reports for my bank or crop insurance?",
      a: "Absolutely. You can generate and download comprehensive PDF farm intelligence reports complete with satellite snapshots, disease diagnostic logs, and QR code verification.",
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl border border-emerald-800/80 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon Winner Solution</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Smarter Farming. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Better Harvests.</span> Powered by AI.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Individual farm-level crop yield prediction, satellite NDVI monitoring, leaf disease diagnosis, and multilingual AI advisory tailored for Indian agriculture.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sprout className="w-5 h-5 text-emerald-950" />
              <span>Launch Farmer Dashboard</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Try Live Interactive Demo</span>
            </button>
          </div>

          {/* Verified Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-emerald-300/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sentinel-2 Satellite GIS
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Gemini 3.6 AI
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Voice & 10 Indian Languages
            </span>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-6 text-center shadow-lg hover:border-emerald-500/50 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-1">
              {s.value}
            </div>
            <div className="text-xs text-emerald-200/80 font-medium">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Interactive Feature Highlights */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Comprehensive AI Agriculture Suite
          </h2>
          <p className="text-xs sm:text-sm text-emerald-300/80 max-w-xl mx-auto">
            Explore cutting-edge farm intelligence tools designed to boost productivity and reduce crop losses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => onSelectFeature(f.id)}
                className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-bold text-base text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture Showcase Component */}
      <section>
        <AIPipelineDiagram />
      </section>

      {/* Farmer Testimonials */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Farmer Testimonials & Impact</h2>
          <p className="text-xs text-emerald-300">Empowering smallholders across Indian states</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <p className="text-sm text-emerald-100 italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-emerald-800/60">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{t.name}</h4>
                  <p className="text-[11px] text-emerald-300">{t.role} • {t.acres}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-emerald-900/40 border border-emerald-800/60 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-emerald-300 mb-1">{faq.q}</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
