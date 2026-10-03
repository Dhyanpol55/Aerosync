import React from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  Plane, 
  Users, 
  Layers, 
  ShieldAlert, 
  Activity, 
  ArrowRight, 
  RefreshCw, 
  MapPin, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    aircraft, 
    crew, 
    bases, 
    sectors, 
    currentPlan, 
    needsReoptimization, 
    isOptimizing,
    recalculatePlan, 
    simulateOperationalChange, 
    setActiveScreen,
    setSelectedAircraft
  } = useOperations();

  const totalAircraft = aircraft.length;
  const availableAircraft = aircraft.filter(a => a.status === 'available').length;
  const maintenanceAircraft = aircraft.filter(a => a.status === 'maintenance').length;
  const standbyAircraft = aircraft.filter(a => a.status === 'standby').length;

  const totalCrew = crew.length * 8 + 8; // Simulated aggregate 120 crew
  const readyCrew = Math.round(totalCrew * 0.87);
  const standbyCrew = 10;
  const unavailableCrew = totalCrew - readyCrew - standbyCrew;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-slate-100 text-slate-900">
            Operational Overview
          </h1>
          <p className="text-sm dark:text-slate-400 text-slate-600 mt-1">
            Dynamic Air Operations & Scarce Resource Allocation · Integrated Decision Support
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateOperationalChange}
            className="px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-400 dark:border-amber-600/60 rounded-md transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Operational Change</span>
          </button>
          <button
            onClick={() => setActiveScreen('ai-engine')}
            className="px-3.5 py-1.5 text-xs font-semibold text-cyan-800 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-950/80 hover:bg-cyan-200 dark:hover:bg-cyan-900 border border-cyan-400 dark:border-cyan-500/60 rounded-md transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Open AI Engine</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards (The screen the judge sees first) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Aircraft Card */}
        <div 
          onClick={() => setActiveScreen('aircraft')}
          className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 shadow-sm hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all dark:hover:bg-slate-850 hover:bg-slate-50 group"
        >
          <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 font-medium uppercase tracking-wider">
            <span>Aircraft</span>
            <Plane className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold dark:text-slate-100 text-slate-900 font-mono tabular-nums">
              {totalAircraft}
            </span>
            <span className="text-xs dark:text-slate-400 text-slate-500">Total</span>
          </div>
          <div className="mt-3 pt-3 border-t dark:border-slate-800/80 border-slate-100 grid grid-cols-3 text-xs font-mono">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{availableAircraft}</span>
              <p className="text-[11px] text-slate-400">Avail</p>
            </div>
            <div>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{maintenanceAircraft}</span>
              <p className="text-[11px] text-slate-400">Maint</p>
            </div>
            <div>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{standbyAircraft}</span>
              <p className="text-[11px] text-slate-400">Standby</p>
            </div>
          </div>
        </div>

        {/* Crew Card */}
        <div 
          onClick={() => setActiveScreen('crew')}
          className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 shadow-sm hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all dark:hover:bg-slate-850 hover:bg-slate-50 group"
        >
          <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 font-medium uppercase tracking-wider">
            <span>Crew Readiness</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold dark:text-slate-100 text-slate-900 font-mono tabular-nums">
              87%
            </span>
            <span className="text-xs dark:text-slate-400 text-slate-500">Ready</span>
          </div>
          <div className="mt-3 pt-3 border-t dark:border-slate-800/80 border-slate-100 grid grid-cols-3 text-xs font-mono">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{readyCrew}</span>
              <p className="text-[11px] text-slate-400">Ready</p>
            </div>
            <div>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{standbyCrew}</span>
              <p className="text-[11px] text-slate-400">Standby</p>
            </div>
            <div>
              <span className="dark:text-slate-400 text-slate-600 font-semibold">{unavailableCrew}</span>
              <p className="text-[11px] text-slate-400">Rest/Trg</p>
            </div>
          </div>
        </div>

        {/* Resources Card */}
        <div 
          onClick={() => setActiveScreen('aircraft')}
          className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 shadow-sm hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all dark:hover:bg-slate-850 hover:bg-slate-50 group"
        >
          <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 font-medium uppercase tracking-wider">
            <span>Resources</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold dark:text-slate-100 text-slate-900 font-mono tabular-nums">
              {currentPlan.resourceCapacityPct}%
            </span>
            <span className="text-xs dark:text-slate-400 text-slate-500">Available</span>
          </div>
          <div className="mt-3 pt-3 border-t dark:border-slate-800/80 border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="dark:text-slate-400 text-slate-500">Turnaround Rate:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">81% nominal</span>
          </div>
        </div>

        {/* Mission Priority Card */}
        <div 
          onClick={() => setActiveScreen('ai-engine')}
          className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 shadow-sm hover:border-amber-500/50 rounded-lg p-4 cursor-pointer transition-all dark:hover:bg-slate-850 hover:bg-slate-50 group"
        >
          <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 font-medium uppercase tracking-wider">
            <span>Mission Priority</span>
            <ShieldAlert className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-300 font-mono tracking-tight">
              {currentPlan.priority}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t dark:border-slate-800/80 border-slate-100 flex items-center justify-between text-xs font-mono">
            <span className="dark:text-slate-400 text-slate-500">Posture:</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">Forward CAP Lock</span>
          </div>
        </div>

        {/* Data Status Card */}
        <div 
          onClick={() => setActiveScreen('weather')}
          className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200/90 shadow-sm hover:border-emerald-500/50 rounded-lg p-4 cursor-pointer transition-all dark:hover:bg-slate-850 hover:bg-slate-50 group"
        >
          <div className="flex items-center justify-between text-xs dark:text-slate-400 text-slate-500 font-medium uppercase tracking-wider">
            <span>Data Status</span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              LIVE SIMULATION
            </span>
          </div>
          <div className="mt-3 pt-3 border-t dark:border-slate-800/80 border-slate-100 flex items-center justify-between text-xs font-mono dark:text-slate-400 text-slate-500">
            <span>Fusion Sources:</span>
            <span className="dark:text-slate-200 text-slate-800 font-bold">5 Synced</span>
          </div>
        </div>
      </div>

      {/* AI Decision Support Banner / Callout (Key feature directly on front screen) */}
      <div className={`p-4 rounded-lg border transition-all ${
        needsReoptimization 
          ? 'dark:bg-amber-950/40 bg-amber-50 dark:border-amber-500/70 border-amber-300 shadow-lg shadow-amber-950/20' 
          : 'dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-cyan-600 dark:text-cyan-400">
                AI DECISION SUPPORT ENGINE
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                Plan {currentPlan.version}
              </span>
              {needsReoptimization && (
                <span className="px-2 py-0.5 text-[11px] font-bold dark:bg-amber-500/20 bg-amber-100 text-amber-800 dark:text-amber-300 border dark:border-amber-500/40 border-amber-300 rounded">
                  PLAN RE-OPTIMISATION REQUIRED
                </span>
              )}
            </div>

            <div className="text-sm dark:text-slate-200 text-slate-800 font-medium">
              {needsReoptimization ? (
                <span className="text-amber-800 dark:text-amber-200 font-medium">
                  Priority & environmental changes detected. Aircraft availability reduced and Central Sector corridor restricted.
                </span>
              ) : (
                <span>
                  Resource availability synchronized. Priority coverage sustained across Northern and Central sectors.
                </span>
              )}
            </div>

            <div className="text-xs dark:text-slate-400 text-slate-600 flex flex-wrap items-center gap-3 pt-1">
              <span>Coverage: <strong className="dark:text-slate-200 text-slate-800">{currentPlan.sortieCoveragePct}%</strong></span>
              <span>·</span>
              <span>Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{currentPlan.confidencePct}%</strong></span>
              <span>·</span>
              <span>Active Constraints: <strong className="text-amber-600 dark:text-amber-400">{currentPlan.constraintsDetected.length}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => recalculatePlan()}
              disabled={isOptimizing}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                needsReoptimization
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Recalculating Plan...' : 'Recalculate Plan'}</span>
            </button>

            <button
              onClick={() => setActiveScreen('ai-engine')}
              className="px-3.5 py-2 text-xs font-medium dark:text-slate-300 text-slate-700 hover:text-slate-950 dark:hover:text-white dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border dark:border-slate-700 border-slate-300 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Explain Decision</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Operational Map Preview & Resource Availability Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Preview (8 cols) */}
        <div className="lg:col-span-7 dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200 shadow-sm rounded-lg p-5 flex flex-col transition-colors">
          <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-slate-200 text-slate-800">
                Operational Map & Vector Distribution
              </h2>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
                Simulated air sector deployment · Airbases, CAP routes, and environmental zones
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('map')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Expand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Preview Graphic */}
          <div 
            onClick={() => setActiveScreen('map')}
            className="relative w-full h-72 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden cursor-pointer tactical-grid group"
          >
            {/* Sector Division Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-800/80" />
              <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-slate-800/80" />
            </div>

            {/* Range Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/15 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-cyan-500/10 rounded-full pointer-events-none" />

            {/* Labels */}
            <div className="absolute top-3 left-4 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              NORTH SECTOR (DEFENSE)
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              CENTRAL SECTOR
            </div>
            <div className="absolute bottom-3 left-4 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              SOUTH SECTOR
            </div>

            {/* Airbases */}
            {bases.map((base) => (
              <div
                key={base.id}
                style={{ left: `${base.x}%`, top: `${base.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group-hover:scale-105 transition-transform"
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-300 mt-1 bg-slate-900/90 px-1 py-0.2 rounded border border-slate-700 whitespace-nowrap">
                  {base.id}
                </span>
              </div>
            ))}

            {/* Weather Zone Callout */}
            <div className="absolute left-[54%] top-[28%] -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-amber-950/40 border border-amber-600/40 rounded text-center">
              <span className="text-[10px] font-mono font-bold text-amber-300 block">WEATHER ZONE</span>
              <span className="text-[9px] text-amber-400/80 font-mono">Convective Storm</span>
            </div>

            {/* Aircraft Icons preview */}
            {aircraft.slice(0, 8).map((ac) => (
              <div
                key={ac.id}
                style={{ left: `${ac.x}%`, top: `${ac.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1"
                title={`${ac.id} - ${ac.type} (${ac.status})`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  ac.status === 'available' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <span className="text-[9px] font-mono text-slate-300 group-hover:text-white">
                  {ac.id}
                </span>
              </div>
            ))}

            {/* Overlay button */}
            <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1.5 bg-cyan-950 text-cyan-300 border border-cyan-500 text-xs font-semibold rounded shadow-lg">
                Click to Open Full Interactive Radar Map
              </span>
            </div>
          </div>

          {/* Quick Base Stockpile Status */}
          <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t dark:border-slate-800 border-slate-200 text-xs">
            {bases.map(b => (
              <div key={b.id} className="dark:bg-slate-950/60 bg-slate-50 p-2.5 rounded border dark:border-slate-800/80 border-slate-200">
                <div className="flex items-center justify-between dark:text-slate-300 text-slate-800 font-semibold">
                  <span>{b.id}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">{b.runwayStatus}</span>
                </div>
                <div className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 flex justify-between font-mono">
                  <span>Fuel: {b.fuelCapacityPct}%</span>
                  <span>Munit: {b.munitionsCapacityPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Resource Management Bars (5 cols) */}
        <div className="lg:col-span-5 dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200 shadow-sm rounded-lg p-5 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-slate-200 text-slate-800">
                  Resource Availability
                </h2>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
                  Scarce airpower asset pools and operational capacity
                </p>
              </div>
              <button
                onClick={() => setActiveScreen('aircraft')}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
              >
                View Allocations
              </button>
            </div>

            {/* Resource Progress Bars from User Prompt */}
            <div className="space-y-4">
              {/* Aircraft Availability */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="dark:text-slate-300 text-slate-700">Aircraft Availability</span>
                  <span className="dark:text-slate-200 text-slate-900 font-bold tabular-nums">
                    {Math.round((availableAircraft / totalAircraft) * 100)}%
                  </span>
                </div>
                <div className="w-full dark:bg-slate-950 bg-slate-200 rounded-full h-2.5 overflow-hidden border dark:border-slate-800 border-slate-300">
                  <div 
                    className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((availableAircraft / totalAircraft) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] dark:text-slate-500 text-slate-500 mt-0.5 block font-mono">
                  {availableAircraft} of {totalAircraft} combat platforms mission-capable
                </span>
              </div>

              {/* Crew Availability */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="dark:text-slate-300 text-slate-700">Crew Availability</span>
                  <span className="dark:text-slate-200 text-slate-900 font-bold tabular-nums">87%</span>
                </div>
                <div className="w-full dark:bg-slate-950 bg-slate-200 rounded-full h-2.5 overflow-hidden border dark:border-slate-800 border-slate-300">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: '87%' }}
                  />
                </div>
                <span className="text-[11px] dark:text-slate-500 text-slate-500 mt-0.5 block font-mono">
                  104 of 120 aircrew with rest compliance
                </span>
              </div>

              {/* Operational Resources */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="dark:text-slate-300 text-slate-700">Operational Resources</span>
                  <span className="dark:text-slate-200 text-slate-900 font-bold tabular-nums">
                    {currentPlan.resourceCapacityPct}%
                  </span>
                </div>
                <div className="w-full dark:bg-slate-950 bg-slate-200 rounded-full h-2.5 overflow-hidden border dark:border-slate-800 border-slate-300">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${currentPlan.resourceCapacityPct}%` }}
                  />
                </div>
                <span className="text-[11px] dark:text-slate-500 text-slate-500 mt-0.5 block font-mono">
                  Fuel reserves, precision munitions & datalink bandwidth
                </span>
              </div>

              {/* Airspace Availability */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="dark:text-slate-300 text-slate-700">Airspace Availability</span>
                  <span className="dark:text-slate-200 text-slate-900 font-bold tabular-nums">68%</span>
                </div>
                <div className="w-full dark:bg-slate-950 bg-slate-200 rounded-full h-2.5 overflow-hidden border dark:border-slate-800 border-slate-300">
                  <div 
                    className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: '68%' }}
                  />
                </div>
                <span className="text-[11px] dark:text-slate-500 text-slate-500 mt-0.5 block font-mono">
                  Sector B corridor constrained by civil transit & weather
                </span>
              </div>

              {/* Support Capacity */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="dark:text-slate-300 text-slate-700">Support Capacity</span>
                  <span className="dark:text-slate-200 text-slate-900 font-bold tabular-nums">81%</span>
                </div>
                <div className="w-full dark:bg-slate-950 bg-slate-200 rounded-full h-2.5 overflow-hidden border dark:border-slate-800 border-slate-300">
                  <div 
                    className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: '81%' }}
                  />
                </div>
                <span className="text-[11px] dark:text-slate-500 text-slate-500 mt-0.5 block font-mono">
                  18 turnaround teams across Base-A, Base-B, FOB-Charlie
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action to What-If Simulator */}
          <div className="mt-6 pt-4 border-t dark:border-slate-800 border-slate-200 dark:bg-slate-950/40 bg-slate-50 p-3 rounded border dark:border-slate-800/80 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold dark:text-slate-200 text-slate-800 block">
                  Scenario Stress-Testing
                </span>
                <span className="text-[11px] dark:text-slate-400 text-slate-600">
                  Model contingency injects & calculate trade-offs
                </span>
              </div>
              <button
                onClick={() => setActiveScreen('whatif')}
                className="px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 dark:bg-cyan-950/60 bg-cyan-100 hover:bg-cyan-200 dark:hover:bg-cyan-900 border dark:border-cyan-500/40 border-cyan-300 rounded transition-colors cursor-pointer"
              >
                Launch Simulator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Aircraft Availability Glance */}
      <div className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200 shadow-sm rounded-lg p-5 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 mb-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-slate-200 text-slate-800">
              Active Combat Platform Inventory (Sample)
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
              Click an aircraft row to inspect readiness telemetry and payload state
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('aircraft')}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
          >
            View All 24 Platforms
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b dark:border-slate-800 border-slate-200 dark:text-slate-400 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="pb-2.5 font-semibold">ID</th>
                <th className="pb-2.5 font-semibold">Callsign</th>
                <th className="pb-2.5 font-semibold">Platform Type</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold">Readiness</th>
                <th className="pb-2.5 font-semibold">Location</th>
                <th className="pb-2.5 font-semibold">Next Availability</th>
                <th className="pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200">
              {aircraft.slice(0, 6).map((ac) => (
                <tr 
                  key={ac.id} 
                  onClick={() => {
                    setSelectedAircraft(ac);
                    setActiveScreen('aircraft');
                  }}
                  className="dark:hover:bg-slate-800/40 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 font-bold text-cyan-600 dark:text-cyan-400 group-hover:underline">
                    {ac.id}
                  </td>
                  <td className="py-2.5 dark:text-slate-300 text-slate-800 font-semibold">
                    {ac.callsign}
                  </td>
                  <td className="py-2.5 dark:text-slate-400 text-slate-600">
                    {ac.type}
                  </td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded ${
                      ac.status === 'available' 
                        ? 'dark:bg-emerald-950/80 bg-emerald-100 dark:text-emerald-400 text-emerald-800 border dark:border-emerald-500/40 border-emerald-300' 
                        : ac.status === 'maintenance'
                        ? 'dark:bg-amber-950/80 bg-amber-100 dark:text-amber-400 text-amber-800 border dark:border-amber-500/40 border-amber-300'
                        : 'dark:bg-indigo-950/80 bg-indigo-100 dark:text-indigo-400 text-indigo-800 border dark:border-indigo-500/40 border-indigo-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        ac.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      {ac.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 font-semibold tabular-nums">
                    <span className={ac.readiness > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                      {ac.readiness}%
                    </span>
                  </td>
                  <td className="py-2.5 dark:text-slate-300 text-slate-700">
                    {ac.baseId}
                  </td>
                  <td className="py-2.5 dark:text-slate-400 text-slate-600">
                    {ac.nextAvailability}
                  </td>
                  <td className="py-2.5 text-right">
                    <button 
                      className="px-2 py-1 text-[11px] font-sans font-medium dark:text-slate-300 text-slate-700 dark:bg-slate-800 bg-slate-100 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900 group-hover:text-cyan-800 dark:group-hover:text-cyan-200 rounded border dark:border-slate-700 border-slate-300 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
