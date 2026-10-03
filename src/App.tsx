import React, { useState } from 'react';
import { OperationsProvider, useOperations } from './context/OperationsContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LandingPage } from './components/LandingPage';
import { OverviewPage } from './components/OverviewPage';
import { ResourcesPage } from './components/ResourcesPage';
import { AiDecisionEngine } from './components/AiDecisionEngine';
import { ScenarioPage } from './components/ScenarioPage';
import { DecisionHistoryPage } from './components/DecisionHistoryPage';
import { OperationalMap } from './components/OperationalMap';
import { AircraftManagement } from './components/AircraftManagement';
import { CrewManagement } from './components/CrewManagement';
import { WeatherAirspace } from './components/WeatherAirspace';
import { AlertsCenter } from './components/AlertsCenter';
import { MunitionsStockpileModal } from './components/MunitionsStockpileModal';
import { AtoExportModal } from './components/AtoExportModal';
import { TankerAirBridgeModal } from './components/TankerAirBridgeModal';
import { DemoTourModal } from './components/DemoTourModal';
import { DatalinkTerminal } from './components/DatalinkTerminal';
import { X, PlayCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    isLandingPage, 
    enterDemo, 
    isDemoTourActive, 
    startDemoTour, 
    exitDemoTour 
  } = useOperations();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is on landing page, show full Landing Screen
  if (isLandingPage) {
    return <LandingPage onEnterDemo={enterDemo} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] flex font-sans transition-colors duration-300">
      {/* Desktop Sidebar (Section 7) */}
      <Sidebar onOpenDemoTour={startDemoTour} />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm">
          <div className="w-72 bg-white dark:bg-[#111827] h-full p-4 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-extrabold text-base tracking-wider uppercase font-mono dark:text-white text-slate-900">
                  AEROSYNC
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5 mt-4">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'resources', label: 'Resources' },
                  { id: 'ai-analysis', label: 'AI Analysis' },
                  { id: 'scenario', label: 'Scenario' },
                  { id: 'history', label: 'History' },
                  { id: 'map', label: 'Tactical Map' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveScreen(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      activeScreen === item.id
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  startDemoTour();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Interactive Demo Tour</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Right Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Navigation (Section 7 & 9) */}
        <Topbar 
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onOpenDemoTour={startDemoTour}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          {(activeScreen === 'overview' || activeScreen === 'dashboard') && <OverviewPage />}
          {activeScreen === 'resources' && <ResourcesPage />}
          {(activeScreen === 'ai-analysis' || activeScreen === 'ai-engine') && <AiDecisionEngine />}
          {(activeScreen === 'scenario' || activeScreen === 'whatif') && <ScenarioPage />}
          {activeScreen === 'history' && <DecisionHistoryPage />}
          {activeScreen === 'map' && <OperationalMap />}
          {activeScreen === 'aircraft' && <AircraftManagement />}
          {activeScreen === 'crew' && <CrewManagement />}
          {activeScreen === 'weather' && <WeatherAirspace />}
          {activeScreen === 'alerts' && <AlertsCenter />}
        </main>

        {/* Live Datalink Log Stream Terminal */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 shrink-0">
          <DatalinkTerminal />
        </div>
      </div>

      {/* Global Modals */}
      <MunitionsStockpileModal />
      <AtoExportModal />
      <TankerAirBridgeModal />
      <DemoTourModal isOpen={isDemoTourActive} onClose={exitDemoTour} />
    </div>
  );
};

export default function App() {
  return (
    <OperationsProvider>
      <AppContent />
    </OperationsProvider>
  );
}
