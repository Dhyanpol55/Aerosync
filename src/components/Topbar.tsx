import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  Cpu, 
  Crosshair, 
  FileText, 
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { useOperations, ScreenId } from '../context/OperationsContext';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
  onOpenDemoTour?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu, onOpenDemoTour }) => {
  const { 
    theme, 
    toggleTheme, 
    alerts, 
    unreadAlertsCount, 
    acknowledgeAlert,
    systemStatus, 
    zuluTime,
    userRole,
    setUserRole,
    simulateOperationalChange,
    needsReoptimization,
    setActiveScreen,
    setShowMunitionsModal,
    setShowAtoModal,
    setShowTankerModal,
    munitionsBottleneckWarning
  } = useOperations();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b dark:border-slate-800 border-slate-200 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Simulation Status */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-wider uppercase font-mono dark:text-white text-slate-900 md:hidden">
              AEROSYNC
            </span>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Simulation Environment</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">● OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Center/Right quick tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Munitions PGM button */}
          <button
            onClick={() => setShowMunitionsModal(true)}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              munitionsBottleneckWarning
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
            title="Base-Level Munitions Stockpile Manager"
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Stockpiles</span>
          </button>

          {/* Quick ATO Export */}
          <button
            onClick={() => setShowAtoModal(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 cursor-pointer"
            title="Air Tasking Order Export"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>ATO Export</span>
          </button>

          {/* Tanker Bridge */}
          <button
            onClick={() => setShowTankerModal(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 cursor-pointer"
            title="Aerial Refueling Air Bridge"
          >
            <Fuel className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Tanker Bridge</span>
          </button>

          {/* Zulu Time badge */}
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[11px] font-mono dark:bg-slate-900 bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            {zuluTime}
          </span>

          {/* Theme Toggle Button (Light Mode / Dark Mode) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium cursor-pointer transition-colors shadow-xs"
            title="Toggle Light / Dark Mode (Persisted)"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 cursor-pointer transition-colors shadow-xs"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xl p-4 z-50 text-xs font-sans">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span className="font-bold text-slate-900 dark:text-white uppercase font-mono">
                      System Notifications
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{unreadAlertsCount} Unacknowledged</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2 pr-1">
                  {alerts.map((alt) => {
                    const isHigh = alt.severity === 'critical' || alt.severity === 'HIGH';
                    const isAttn = alt.severity === 'warning' || alt.severity === 'ATTENTION';
                    const isPlan = alt.severity === 'PLANNING';

                    return (
                      <div 
                        key={alt.id} 
                        className={`py-2.5 px-2 rounded-lg transition-colors ${
                          !alt.acknowledged ? 'bg-slate-50 dark:bg-slate-900/60' : 'opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded uppercase ${
                            isHigh ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                            isAttn ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                            isPlan ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                            'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {isHigh ? '🔴 HIGH PRIORITY' : isAttn ? '🟠 ATTENTION' : isPlan ? '🟡 PLANNING' : '🟢 SYSTEM'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{alt.timestamp}</span>
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">{alt.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{alt.message}</p>
                        {!alt.acknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(alt.id)}
                            className="mt-2 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            Mark as Acknowledged
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Role Selector */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 cursor-pointer shadow-xs text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                {userRole[0]}
              </div>
              <span className="hidden md:inline font-medium text-slate-800 dark:text-slate-200 font-mono">
                {userRole}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xl p-3 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Switch Operational Role
                </div>
                <div className="space-y-1 mt-1">
                  {(['Planner', 'Analyst', 'Viewer'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-mono text-left cursor-pointer ${
                        userRole === r 
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
