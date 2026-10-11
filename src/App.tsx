import React, { useState } from "react";
import { SAMPLE_FARMS } from "./data/mockData";
import { Farm } from "./types";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { VoiceAssistantModal } from "./components/VoiceAssistantModal";

// Views
import { LandingView } from "./components/views/LandingView";
import { GuidedWorkflowView } from "./components/views/GuidedWorkflowView";
import { FarmerDashboardView } from "./components/views/FarmerDashboardView";
import { FarmRegistrationView } from "./components/views/FarmRegistrationView";
import { YieldPredictionView } from "./components/views/YieldPredictionView";
import { PredictionDashboardView } from "./components/views/PredictionDashboardView";
import { RecommendationView } from "./components/views/RecommendationView";
import { DiseaseDetectionView } from "./components/views/DiseaseDetectionView";
import { SatelliteMonitoringView } from "./components/views/SatelliteMonitoringView";
import { WeatherDashboardView } from "./components/views/WeatherDashboardView";
import { SoilAnalysisView } from "./components/views/SoilAnalysisView";
import { MarketPricesView } from "./components/views/MarketPricesView";
import { GovernmentSchemesView } from "./components/views/GovernmentSchemesView";
import { ChatbotView } from "./components/views/ChatbotView";
import { AdminDashboardView } from "./components/views/AdminDashboardView";
import { InnovationLabView } from "./components/views/InnovationLabView";
import { ArchitectureView } from "./components/views/ArchitectureView";
import { FieldBoundaryMapper } from "./components/gis/FieldBoundaryMapper";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("workflow");
  const [farms, setFarms] = useState<Farm[]>(SAMPLE_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(SAMPLE_FARMS[0]);
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [userRole, setUserRole] = useState<any>("farmer");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);

  const handleNewFarmRegistered = (newFarm: Farm) => {
    setFarms((prev) => [newFarm, ...prev]);
    setSelectedFarm(newFarm);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-mesh-frosted text-emerald-50 font-sans selection:bg-emerald-400 selection:text-emerald-950 flex flex-col relative overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
        onQuickRegister={() => setActiveTab("registration")}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === "workflow" && (
          <GuidedWorkflowView
            onOpenVoiceModal={() => setIsVoiceOpen(true)}
            onCompleteWorkflow={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "landing" && (
          <LandingView
            onGetStarted={() => setActiveTab("workflow")}
            onExploreDemo={() => setActiveTab("dashboard")}
            onSelectFeature={(featureId) => setActiveTab(featureId)}
          />
        )}

        {activeTab === "dashboard" && (
          <FarmerDashboardView
            onNavigate={(tabId) => setActiveTab(tabId)}
            selectedFarm={selectedFarm}
            setSelectedFarm={setSelectedFarm}
          />
        )}

        {activeTab === "mapping" && (
          <div className="bg-emerald-950/80 border border-emerald-800 p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="border-b border-emerald-800 pb-3">
              <h2 className="text-xl font-extrabold text-white">GPS Field Boundary Mapper</h2>
              <p className="text-xs text-emerald-300">
                Walk around the edge of your field. Real-time GPS tracking continuously records your position to calculate exact field area.
              </p>
            </div>
            <FieldBoundaryMapper
              onBoundaryConfirmed={(pts, area) => {
                alert(`Field perimeter confirmed with ${pts.length} points across ${area} Acres!`);
              }}
              onContinueToCropAnalysis={() => setActiveTab("predictions")}
            />
          </div>
        )}

        {activeTab === "predictions" && <PredictionDashboardView />}

        {activeTab === "recommendations" && <RecommendationView />}

        {activeTab === "registration" && (
          <FarmRegistrationView
            onFarmRegistered={handleNewFarmRegistered}
            onCancel={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "yield" && <YieldPredictionView />}

        {activeTab === "disease" && <DiseaseDetectionView />}

        {activeTab === "satellite" && <SatelliteMonitoringView />}

        {activeTab === "weather" && <WeatherDashboardView />}

        {activeTab === "soil" && <SoilAnalysisView />}

        {activeTab === "market" && <MarketPricesView />}

        {activeTab === "schemes" && <GovernmentSchemesView />}

        {activeTab === "chatbot" && <ChatbotView />}

        {activeTab === "architecture" && <ArchitectureView />}

        {activeTab === "admin" && <AdminDashboardView />}

        {activeTab === "innovation" && <InnovationLabView />}
      </main>

      {/* Voice Assistant Modal Overlay */}
      {isVoiceOpen && (
        <VoiceAssistantModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          currentLang={currentLang}
        />
      )}

      {/* Footer Component */}
      <Footer onSelectTab={(tabId) => setActiveTab(tabId)} />
    </div>
  );
}

export default App;
