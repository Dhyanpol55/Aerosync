import React from 'react';
import { useOperations, ScreenId } from '../context/OperationsContext';
import { Zap, Bell, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    unreadAlertsCount, 
    simulateOperationalChange, 
    needsReoptimization,
    zuluTime,
    systemStatus
  } = useOperations();

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'map', label: 'Tactical Map' },
    { id: 'aircraft', label: 'Aircraft & Resources' },
    { id: 'crew', label: 'Crew Readiness' },
    { id: 'weather', label: 'Weather & Airspace' },
    { id: 'ai-engine', label: 'AI Decision Engine' },
    { id: 'whatif', label: 'What-If Simulator' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveScreen('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-extrabold tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors uppercase font-mono">
              AEROSYNC
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`whitespace-nowrap transition-colors relative py-1 focus:outline-none cursor-pointer ${
                  isActive 
                    ? 'text-cyan-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
                {item.id === 'ai-engine' && needsReoptimization && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          {/* Simulate Operational Change button (the key judge demo trigger) */}
          <button
            onClick={simulateOperationalChange}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/50 rounded-md transition-colors cursor-pointer shadow-sm shadow-amber-950/50 whitespace-nowrap"
            title="Simulate sudden operational change (aircraft attrition, storm, restricted airspace)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Simulate Change</span>
          </button>

          {/* Alert Center Trigger */}
          <button
            onClick={() => setActiveScreen('alerts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              unreadAlertsCount > 0
                ? 'bg-rose-950/60 border-rose-600/60 text-rose-300 hover:bg-rose-900/60'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            <span>Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded-full tabular-nums">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-strip with simulation notice & Zulu telemetry */}
      <div className="border-t border-slate-900/80 bg-slate-950 px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">
            SIMULATION MODE — Demonstration Dataset
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">MoD SIH26250</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            System: <span className={needsReoptimization ? "text-amber-400 font-bold" : "text-emerald-400"}>
              ● {needsReoptimization ? 'RE-OPTIMISATION REQUIRED' : 'OPERATIONAL'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {needsReoptimization && (
            <button
              onClick={() => setActiveScreen('ai-engine')}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 underline font-sans text-xs cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Priority & Resource Change Detected — Review Plan</span>
            </button>
          )}
          <span className="text-slate-400 tabular-nums">
            ZULU: <strong className="text-slate-200">{zuluTime}</strong>
          </span>
        </div>
      </div>

      {/* Mobile nav bar for smaller displays */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-3 px-4 py-2 border-t border-slate-900 bg-slate-900/50 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
              activeScreen === item.id 
                ? 'bg-cyan-950 text-cyan-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
