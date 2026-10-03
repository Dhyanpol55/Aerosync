import React from 'react';
import { useOperations, ScreenId } from '../context/OperationsContext';
import { 
  Zap, 
  Bell, 
  AlertTriangle, 
  Sun, 
  Moon, 
  Crosshair, 
  FileText, 
  Fuel 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    unreadAlertsCount, 
    simulateOperationalChange, 
    needsReoptimization,
    zuluTime,
    systemStatus,
    theme,
    toggleTheme,
    setShowMunitionsModal,
    setShowAtoModal,
    setShowTankerModal,
    munitionsBottleneckWarning
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
    <header className="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950/95 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveScreen('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-extrabold tracking-wider dark:text-slate-100 text-slate-900 group-hover:text-cyan-500 transition-colors uppercase font-mono">
              AEROSYNC
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium dark:text-slate-400 text-slate-600">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`whitespace-nowrap transition-colors relative py-1 focus:outline-none cursor-pointer ${
                  isActive 
                    ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                    : 'dark:text-slate-400 text-slate-600 dark:hover:text-slate-200 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
                )}
                {item.id === 'ai-engine' && needsReoptimization && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Munitions Stockpile Manager button */}
          <button
            onClick={() => setShowMunitionsModal(true)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
              munitionsBottleneckWarning 
                ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse' 
                : 'dark:bg-slate-900 bg-slate-100 dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-cyan-950/40 hover:text-cyan-400'
            }`}
            title="Base-Level Munitions Stockpile Manager"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-500" />
            <span>Munitions Stock</span>
          </button>

          {/* Simulate Operational Change button (the key judge demo trigger) */}
          <button
            onClick={simulateOperationalChange}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-400 dark:border-amber-500/50 rounded-md transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            title="Simulate sudden operational change (aircraft attrition, storm, restricted airspace)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Simulate Change</span>
            <span className="sm:hidden">Change</span>
          </button>

          {/* Theme Toggle (Light / Dark Mode) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border dark:border-slate-800 border-slate-300 dark:bg-slate-900 bg-white dark:text-slate-200 text-slate-800 hover:border-cyan-500 transition-colors cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-medium hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Alert Center Trigger */}
          <button
            onClick={() => setActiveScreen('alerts')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              unreadAlertsCount > 0
                ? 'dark:bg-rose-950/60 bg-rose-50 dark:border-rose-600/60 border-rose-300 dark:text-rose-300 text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                : 'dark:bg-slate-900 bg-slate-100 dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded-full tabular-nums">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-strip with simulation notice & Zulu telemetry */}
      <div className="border-t dark:border-slate-900/80 border-slate-200 dark:bg-slate-950 bg-slate-100 px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-mono dark:text-slate-400 text-slate-600 flex flex-wrap items-center justify-between gap-2 transition-colors">
        <div className="flex items-center gap-3">
          {/* Glowing Green Datalink Status Indicator Badge */}
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-emerald-500/50 bg-emerald-950/40 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400 tracking-wide uppercase text-[11px]">
              IACCS / LINK-16 DATALINK: ACTIVE [120 Hz]
            </span>
          </div>
          <span className="text-slate-400 dark:text-slate-600 hidden md:inline">|</span>
          <span className="dark:text-slate-400 text-slate-600 hidden md:inline">MoD SIH26250</span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span className="dark:text-slate-300 text-slate-700">
            System: <span className={needsReoptimization ? "text-amber-500 font-bold" : "text-emerald-500"}>
              ● {needsReoptimization ? 'RE-OPTIMISATION REQUIRED' : 'OPERATIONAL'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {needsReoptimization && (
            <button
              onClick={() => setActiveScreen('ai-engine')}
              className="flex items-center gap-1.5 text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 underline font-sans text-xs cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>Priority & Resource Change Detected — Review Plan</span>
            </button>
          )}
          <span className="dark:text-slate-400 text-slate-600 tabular-nums">
            IST: <strong className="dark:text-slate-200 text-slate-900">{zuluTime}</strong>
          </span>
        </div>
      </div>

      {/* Mobile nav bar for smaller displays */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-3 px-4 py-2 border-t dark:border-slate-900 border-slate-200 dark:bg-slate-900/50 bg-slate-100 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer ${
              activeScreen === item.id 
                ? 'dark:bg-cyan-950 bg-cyan-100 text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
