import React from 'react';
import { OperationsProvider, useOperations } from './context/OperationsContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OperationalMap } from './components/OperationalMap';
import { AircraftManagement } from './components/AircraftManagement';
import { CrewManagement } from './components/CrewManagement';
import { WeatherAirspace } from './components/WeatherAirspace';
import { AiDecisionEngine } from './components/AiDecisionEngine';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AlertsCenter } from './components/AlertsCenter';
import { PlayCircle, ChevronRight, Zap, Cpu, Map, Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeScreen, setActiveScreen, simulateOperationalChange, recalculatePlan, needsReoptimization } = useOperations();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Contract */}
      <Header />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'dashboard' && <Dashboard />}
        {activeScreen === 'map' && <OperationalMap />}
        {activeScreen === 'aircraft' && <AircraftManagement />}
        {activeScreen === 'crew' && <CrewManagement />}
        {activeScreen === 'weather' && <WeatherAirspace />}
        {activeScreen === 'ai-engine' && <AiDecisionEngine />}
        {activeScreen === 'whatif' && <WhatIfSimulator />}
        {activeScreen === 'alerts' && <AlertsCenter />}
      </main>

      {/* Interactive Demo Presentation Guide for Evaluators & Judges */}
      <aside className="border-t border-slate-900 bg-slate-950/90 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <PlayCircle className="w-3.5 h-3.5" />
              Demo Walkthrough:
            </span>
            <span className="hidden sm:inline text-slate-500">
              Step 1 (Overview) → Step 2 (Tactical Map) → Step 3 (Simulate Change) → Step 4 (AI Re-Optimise) → Step 5 (Why This Recommendation?)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeScreen === 'dashboard' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60' : 'hover:text-slate-200'}`}
            >
              1. Overview
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => setActiveScreen('map')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeScreen === 'map' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60' : 'hover:text-slate-200'}`}
            >
              2. Map
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => {
                simulateOperationalChange();
                setActiveScreen('ai-engine');
              }}
              className="px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900 transition-colors cursor-pointer font-bold"
            >
              3. Simulate Change
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => {
                setActiveScreen('ai-engine');
                recalculatePlan();
              }}
              className="px-2 py-1 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-500/60 hover:bg-cyan-800 transition-colors cursor-pointer font-bold"
            >
              4. Re-Optimise
            </button>
            <span className="text-slate-600">→</span>
            <button
              onClick={() => setActiveScreen('ai-engine')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeScreen === 'ai-engine' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60' : 'hover:text-slate-200'}`}
            >
              5. Explainable AI
            </button>
          </div>
        </div>
      </aside>

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-mono">
        <p>
          AEROSYNC · Smart India Hackathon Prototype · Problem Statement ID: SIH26250 · Ministry of Defence (MoD)
        </p>
      </footer>
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
