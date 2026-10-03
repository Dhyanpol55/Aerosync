import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  Sliders, 
  History, 
  Map, 
  PlayCircle,
  HelpCircle,
  LogOut,
  Shield
} from 'lucide-react';
import { useOperations, ScreenId } from '../context/OperationsContext';

interface SidebarProps {
  onOpenDemoTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDemoTour }) => {
  const { 
    activeScreen, 
    setActiveScreen, 
    needsReoptimization,
    userRole,
    exitToLanding
  } = useOperations();

  const navLinks: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'resources', label: 'Resources', icon: Layers },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Cpu },
    { id: 'scenario', label: 'Scenario', icon: Sliders },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r dark:border-slate-800 border-slate-200 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 transition-colors">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center justify-between border-b dark:border-slate-800 border-slate-200">
          <button 
            onClick={() => setActiveScreen('overview')}
            className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
              A
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-base font-mono uppercase dark:text-white text-slate-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AEROSYNC
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                SIH26250 · MoD
              </span>
            </div>
          </button>
        </div>

        {/* Primary Nav Links (Exactly the 5 pages!) */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Navigation
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            // Map legacy aliases
            const isSelected = 
              activeScreen === item.id ||
              (item.id === 'overview' && activeScreen === 'dashboard') ||
              (item.id === 'ai-analysis' && activeScreen === 'ai-engine') ||
              (item.id === 'scenario' && activeScreen === 'whatif');

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-blue-200/60 dark:border-blue-900/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.id === 'ai-analysis' && needsReoptimization && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full bg-amber-500 text-white animate-pulse">
                    RE-OPT
                  </span>
                )}
              </button>
            );
          })}

          {/* Secondary Tactical Map entry */}
          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Operational View
          </div>
          <button
            onClick={() => setActiveScreen('map')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeScreen === 'map'
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-blue-200/60 dark:border-blue-900/60'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <Map className={`w-4 h-4 ${activeScreen === 'map' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>Tactical Map</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">3 SECTORS</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t dark:border-slate-800 border-slate-200">
        {/* Interactive Guided Demo Tour Trigger */}
        {onOpenDemoTour && (
          <button
            onClick={onOpenDemoTour}
            className="w-full py-2 px-3 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Demo Tour</span>
          </button>
        )}

        {/* User Role & Exit */}
        <div className="flex items-center justify-between px-2 py-1 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              Role: <strong className="text-slate-700 dark:text-slate-200">{userRole}</strong>
            </span>
          </div>
          <button
            onClick={exitToLanding}
            title="Return to Landing Page"
            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 7 / Section 29 required badge: Simulation Mode */}
        <div 
          className="p-2.5 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 flex items-center justify-between text-[11px] font-mono"
          title="All information displayed by this prototype is fictional demonstration data."
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SIMULATION MODE</span>
          </div>
          <span className="text-[10px] text-slate-400">v1.2</span>
        </div>
      </div>
    </aside>
  );
};
