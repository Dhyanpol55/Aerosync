import React from 'react';
import { motion } from 'motion/react';
import { 
  Plane, 
  Users, 
  Layers, 
  Compass, 
  Cpu, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export const OverviewPage: React.FC = () => {
  const { 
    aircraft, 
    crew, 
    currentPlan, 
    needsReoptimization, 
    simulateOperationalChange, 
    setActiveScreen,
    recalculatePlan,
    isOptimizing
  } = useOperations();

  const availableAircraft = aircraft.filter(a => a.status === 'available').length;
  const totalAircraft = aircraft.length;
  const readyCrewPct = Math.round((crew.filter(c => c.status === 'Ready').length / crew.length) * 100);
  const resourceCapacity = currentPlan.resourceCapacityPct || 76;
  const airspacePct = 68;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operational Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            &ldquo;Unified view of simulated operational resources and conditions.&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={simulateOperationalChange}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Change</span>
          </button>

          <button
            onClick={() => setActiveScreen('ai-analysis')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Open AI Decision Engine</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Aircraft */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:border-blue-400 dark:hover:border-blue-500/60 transition-all">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>AIRCRAFT</span>
            <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {availableAircraft}
            </span>
            <span className="text-xs text-slate-500 font-medium">Available</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80 pt-2.5 font-mono">
            <span className="text-slate-500">{totalAircraft} Total</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              +4.2%
            </span>
          </div>
        </div>

        {/* Card 2: Crew */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>CREW</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {readyCrewPct}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Ready</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80 pt-2.5 font-mono">
            <span className="text-slate-500">120 Total</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              +2.1%
            </span>
          </div>
        </div>

        {/* Card 3: Resources */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>RESOURCES</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {resourceCapacity}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Capacity</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80 pt-2.5 font-mono">
            <span className="text-slate-500">Stockpile &amp; Fuel</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
              Stable
            </span>
          </div>
        </div>

        {/* Card 4: Airspace */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm hover:border-amber-400 dark:hover:border-amber-500/60 transition-all">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>AIRSPACE</span>
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {airspacePct}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Corridors</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80 pt-2.5 font-mono">
            <span className="text-slate-500">Sector Status</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Centerpiece: Section 11 & 12 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AEROSYNC Card (Section 11) - 2 cols */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  AI-Powered Operational Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  &ldquo;Fusing simulated operational data into a common decision view.&rdquo;
                </p>
              </div>

              <span className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                ACTIVE FUSION
              </span>
            </div>

            {/* Current Fusion Snapshot Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-mono uppercase text-slate-500">AIRCRAFT</span>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{availableAircraft}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-mono uppercase text-slate-500">CREW</span>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{readyCrewPct}%</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-mono uppercase text-slate-500">RESOURCES</span>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{resourceCapacity}%</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-mono uppercase text-slate-500">ENVIRONMENT</span>
                <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">Moderate</p>
              </div>
            </div>

            {/* Visual Flow diagram specified in Section 11 */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 font-mono text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Multi-Source Decision Synthesis Flow</span>
                <span className="text-blue-600 dark:text-cyan-400">● LIVE PIPELINE</span>
              </div>

              {/* Graphical Flow Representation */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
                {/* 5 Source Nodes */}
                <div className="space-y-1.5 w-full md:w-auto">
                  <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">AIRCRAFT</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{availableAircraft}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">CREW</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{readyCrewPct}%</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">WEATHER</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">VMC</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">AIRSPACE</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{airspacePct}%</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">RESOURCES</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{resourceCapacity}%</span>
                  </div>
                </div>

                {/* Animated Arrow / Fusion Node */}
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-pulse">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 uppercase">DATA FUSION</span>
                </div>

                {/* Engine Node */}
                <div className="p-4 rounded-xl border-2 border-blue-500/40 dark:border-cyan-500/40 bg-blue-50/50 dark:bg-cyan-950/30 text-center w-full md:w-44">
                  <Cpu className="w-6 h-6 text-blue-600 dark:text-cyan-400 mx-auto mb-1" />
                  <div className="font-bold text-xs text-slate-900 dark:text-white uppercase">AEROSYNC AI</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Constraint Solver</div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block" />

                {/* Recommendation Node */}
                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-center w-full md:w-48">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 uppercase">RECOMMENDATION</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">Feasible Plan v4.1</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Card (Section 12) - 1 col */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI INSIGHT
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                91% Confidence
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                &ldquo;Current simulated conditions indicate increased resource pressure. Re-analysis is recommended before the next planning cycle.&rdquo;
              </p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Engine Confidence</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">91%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-600 dark:bg-cyan-500 rounded-full transition-all duration-500" style={{ width: '91%' }} />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Agreement between simulated conditions and constraint evaluation rules.
                </p>
              </div>

              <div className="mt-6 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Active Constraints:</span>
                  <span className="text-amber-600 font-bold">2 Identified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Turnaround Rate:</span>
                  <span className="text-emerald-600 font-bold">94% Optimal</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveScreen('ai-analysis')}
            className="w-full mt-6 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>VIEW ANALYSIS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Re-Planning Card (Section 13) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Dynamic Re-Planning
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              &ldquo;What happens when conditions change?&rdquo;
            </p>
          </div>

          <button
            onClick={simulateOperationalChange}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm shadow-amber-500/25 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SIMULATE CHANGE</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs font-mono uppercase text-slate-500">Aircraft</span>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {availableAircraft}
            </p>
            <span className="text-[11px] text-slate-400">Airframes Ready</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs font-mono uppercase text-slate-500">Crew</span>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {readyCrewPct}%
            </p>
            <span className="text-[11px] text-slate-400">Readiness Status</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs font-mono uppercase text-slate-500">Weather</span>
            <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
              {needsReoptimization ? 'Degraded' : 'Normal'}
            </p>
            <span className="text-[11px] text-slate-400">Sector Corridors</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs font-mono uppercase text-slate-500">Airspace</span>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {needsReoptimization ? 'Limited' : 'Available'}
            </p>
            <span className="text-[11px] text-slate-400">Transit Clearance</span>
          </div>
        </div>

        {needsReoptimization && (
          <div className="mt-5 p-4 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                ⚠ CONDITIONS CHANGED: Telemetry indicates resource bottlenecks. Re-optimisation is recommended.
              </span>
            </div>
            <button
              onClick={() => setActiveScreen('ai-analysis')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer whitespace-nowrap shadow-xs"
            >
              Re-Optimise in Decision Engine →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
