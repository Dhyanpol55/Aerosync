import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { AuditLogSidebar } from './AuditLogSidebar';
import { AuditLogEntry } from '../types/operations';
import { 
  Cpu, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  ChevronDown,
  History,
  RotateCcw,
  X
} from 'lucide-react';

export const AiDecisionEngine: React.FC = () => {
  const { 
    currentPlan, 
    previousPlan, 
    aircraft, 
    crew, 
    sectors, 
    needsReoptimization, 
    isOptimizing, 
    recalculatePlan, 
    simulateOperationalChange,
    setActiveScreen,
    auditLogs,
    selectedAuditLog,
    restoreHistoricalPlan
  } = useOperations();

  const [activeTab, setActiveTab] = useState<'plan' | 'explanation' | 'reallocations'>('plan');
  const [showAiTacticalBrief, setShowAiTacticalBrief] = useState(false);
  const [isGeneratingAiBrief, setIsGeneratingAiBrief] = useState(false);
  const [aiBriefContent, setAiBriefContent] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [comparedHistoricalEntry, setComparedHistoricalEntry] = useState<AuditLogEntry | null>(selectedAuditLog || null);

  const availableCount = aircraft.filter(a => a.status === 'available').length;

  const handleGenerateCommanderBrief = async () => {
    setIsGeneratingAiBrief(true);
    // Instant military formatted commander's strategic directive
    await new Promise(resolve => setTimeout(resolve, 800));
    setAiBriefContent(
      `STRATEGIC AIR TASKING ORDER (ATO) DIRECTIVE // RESTRICTED\n` +
      `ISSUING AUTHORITY: AEROSYNC OPTIMISATION KERNEL\n` +
      `MISSION POSTURE: ${currentPlan.priority} DEFENSIVE INGRESS\n\n` +
      `1. SITUATION APPRAISAL: Multi-source sensor telemetry indicates convective weather in Sector B accompanied by increased radar threat density along southern approach axes. Total frontline airframe availability stands at ${currentPlan.availableAircraft} with ${currentPlan.readyCrew} mission-qualified crew.\n\n` +
      `2. FORCE RE-DISTRIBUTION: In accordance with algorithmic constraint solving, 3 Multi-Role Superiority platforms are diverted to Northern Sector Green-04 corridor, establishing an orbit ceiling above FL280 to bypass cloud turbulence. PEGASUS-01 tanker orbit is established at Anchor Alpha with 65-ton offload capability.\n\n` +
      `3. RESOURCE OPTIMISATION RATIONALE: Risk-weighted analysis confirms 94% target coverage while eliminating aircrew fatigue violations. Base-A quick-turn turnaround teams are positioned on 15-minute standby.\n\n` +
      `RECOMMENDED COMMANDER ACTION: Authorize immediate scramble release.`
    );
    setIsGeneratingAiBrief(false);
    setShowAiTacticalBrief(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative">
      {/* Main AI Engine Content Area (Flex 1) */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
              <span>AI Decision Engine & Dynamic Re-Planning</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700/60 rounded">
                HEURISTIC CONSTRAINT SOLVER
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-source data fusion · Predictive resource allocation · Transparent explainable AI reasoning
            </p>
          </div>

          {/* Demo Action Buttons & Sidebar Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSidebarOpen 
                  ? 'bg-slate-800 text-cyan-400 border-slate-700' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title="Toggle Audit Log Sidebar"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log ({auditLogs.length})</span>
            </button>

            <button
              onClick={simulateOperationalChange}
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 rounded-md transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Simulate Operational Change</span>
            </button>

            <button
              onClick={() => recalculatePlan()}
              disabled={isOptimizing}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-2 ${
                needsReoptimization
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimising Plan...' : 'Recalculate Plan'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Status Alert Banner */}
        {needsReoptimization && (
          <div className="p-4 bg-amber-950/60 border border-amber-500/80 rounded-lg text-amber-200 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-amber-300 font-bold uppercase block">
                  PLAN RE-OPTIMISATION REQUIRED
                </strong>
                <span>Operational changes detected: Aircraft pool decreased (18 → 15), Sector B weather degraded to RESTRICTED.</span>
              </div>
            </div>
            <button
              onClick={() => recalculatePlan()}
              disabled={isOptimizing}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-sans rounded transition-colors cursor-pointer whitespace-nowrap self-start md:self-center"
            >
              {isOptimizing ? 'Solving Constraints...' : 'EXECUTE RE-OPTIMISATION'}
            </button>
          </div>
        )}

        {/* Historical State Outcome Comparison Banner if Selected from Sidebar */}
        {comparedHistoricalEntry && (
          <div className="p-4 bg-slate-900 border border-cyan-500/60 rounded-lg font-mono text-xs shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200">
                  Historical State Comparison: <strong className="text-cyan-300">{comparedHistoricalEntry.title}</strong>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{comparedHistoricalEntry.timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                {comparedHistoricalEntry.planSnapshot && (
                  <button
                    onClick={() => restoreHistoricalPlan(comparedHistoricalEntry)}
                    className="px-2.5 py-1 text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 rounded font-sans cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Snapshot</span>
                  </button>
                )}
                <button
                  onClick={() => setComparedHistoricalEntry(null)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                  title="Dismiss comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Comparison Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
              <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Available Aircraft</span>
                <div className="mt-1 flex items-center justify-center gap-1.5 font-bold">
                  <span className="text-slate-400">{comparedHistoricalEntry.stateSnapshot.availableAircraft}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-100">{currentPlan.availableAircraft}</span>
                  <span className={`text-[10px] ${
                    currentPlan.availableAircraft - comparedHistoricalEntry.stateSnapshot.availableAircraft >= 0 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    ({currentPlan.availableAircraft - comparedHistoricalEntry.stateSnapshot.availableAircraft >= 0 ? '+' : ''}
                    {currentPlan.availableAircraft - comparedHistoricalEntry.stateSnapshot.availableAircraft})
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ready Aircrew</span>
                <div className="mt-1 flex items-center justify-center gap-1.5 font-bold">
                  <span className="text-slate-400">{comparedHistoricalEntry.stateSnapshot.readyCrew}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-100">{currentPlan.readyCrew}</span>
                  <span className={`text-[10px] ${
                    currentPlan.readyCrew - comparedHistoricalEntry.stateSnapshot.readyCrew >= 0 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    ({currentPlan.readyCrew - comparedHistoricalEntry.stateSnapshot.readyCrew >= 0 ? '+' : ''}
                    {currentPlan.readyCrew - comparedHistoricalEntry.stateSnapshot.readyCrew})
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Resource Pool</span>
                <div className="mt-1 flex items-center justify-center gap-1.5 font-bold">
                  <span className="text-slate-400">{comparedHistoricalEntry.stateSnapshot.resourceCapacityPct}%</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-100">{currentPlan.resourceCapacityPct}%</span>
                  <span className={`text-[10px] ${
                    currentPlan.resourceCapacityPct - comparedHistoricalEntry.stateSnapshot.resourceCapacityPct >= 0 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    ({currentPlan.resourceCapacityPct - comparedHistoricalEntry.stateSnapshot.resourceCapacityPct >= 0 ? '+' : ''}
                    {currentPlan.resourceCapacityPct - comparedHistoricalEntry.stateSnapshot.resourceCapacityPct}%)
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Sortie Coverage</span>
                <div className="mt-1 flex items-center justify-center gap-1.5 font-bold">
                  <span className="text-slate-400">{comparedHistoricalEntry.stateSnapshot.sortieCoveragePct}%</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-cyan-400">{currentPlan.sortieCoveragePct}%</span>
                  <span className={`text-[10px] ${
                    currentPlan.sortieCoveragePct - comparedHistoricalEntry.stateSnapshot.sortieCoveragePct >= 0 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    ({currentPlan.sortieCoveragePct - comparedHistoricalEntry.stateSnapshot.sortieCoveragePct >= 0 ? '+' : ''}
                    {currentPlan.sortieCoveragePct - comparedHistoricalEntry.stateSnapshot.sortieCoveragePct}%)
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">AI Confidence</span>
                <div className="mt-1 flex items-center justify-center gap-1.5 font-bold">
                  <span className="text-slate-400">{comparedHistoricalEntry.stateSnapshot.confidencePct}%</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-emerald-400">{currentPlan.confidencePct}%</span>
                  <span className={`text-[10px] ${
                    currentPlan.confidencePct - comparedHistoricalEntry.stateSnapshot.confidencePct >= 0 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    ({currentPlan.confidencePct - comparedHistoricalEntry.stateSnapshot.confidencePct >= 0 ? '+' : ''}
                    {currentPlan.confidencePct - comparedHistoricalEntry.stateSnapshot.confidencePct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side-by-side BEFORE vs AFTER Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                DYNAMIC OPERATIONAL STATE SHIFT // BEFORE vs AFTER
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Multi-Source Telemetry Delta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* BEFORE / BASELINE */}
            <div className="p-4 bg-slate-950/80 rounded border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  BEFORE (BASELINE STATE)
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">PLAN v4.1</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Aircraft Available:</span>
                  <span className="text-slate-200 font-bold">18 Platforms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Crew Ready:</span>
                  <span className="text-slate-200 font-bold">104 Ready</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Weather:</span>
                  <span className="text-emerald-400 font-bold">NORMAL (Clear)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Airspace:</span>
                  <span className="text-emerald-400 font-bold">NORMAL (Unrestricted)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Priority:</span>
                  <span className="text-slate-200 font-bold">MEDIUM / ROUTINE</span>
                </div>
              </div>
            </div>

            {/* AFTER / CURRENT SIMULATED */}
            <div className={`p-4 rounded border font-mono ${
              needsReoptimization 
                ? 'bg-amber-950/20 border-amber-600/70' 
                : 'bg-cyan-950/20 border-cyan-800/70'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                <span className="text-xs font-bold text-cyan-300 uppercase">
                  {needsReoptimization ? 'AFTER (CHANGED CONDITIONS)' : 'OPTIMISED STATE (CURRENT)'}
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold">{currentPlan.version}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Aircraft Available:</span>
                  <span className={`font-bold ${currentPlan.availableAircraft < 18 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currentPlan.availableAircraft} Platforms {currentPlan.availableAircraft < 18 ? '↓' : ''}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Crew Ready:</span>
                  <span className="text-emerald-400 font-bold">
                    {currentPlan.readyCrew} Ready ✓
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Weather:</span>
                  <span className="text-amber-400 font-bold">
                    DEGRADED (Squall Front) ↓
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-400">Airspace:</span>
                  <span className="text-amber-400 font-bold">
                    LIMITED (Sector B Restricted) ↓
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Priority:</span>
                  <span className="text-amber-300 font-bold">
                    HIGH / DEFENSIVE POSTURE ↑
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Decision Support Framework: Current Situation & AI Analysis Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Situation & AI Analysis Pipeline (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Current Situation Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  Current Situation
                </span>
                <span className="text-[10px] font-mono text-cyan-400">FUSED TELEMETRY</span>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-mono">
                Operational conditions have changed across tactical zones:
              </p>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-300">Aircraft availability</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>↓</span> <span>Reduced (15 Ready)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-300">Crew readiness</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> <span>Optimal (101 Ready)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-300">Resource availability</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>↓</span> <span>Constrained (69%)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-300">Weather condition</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>↓</span> <span>Restricted in Sector B</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-300">Priority level</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <span>↑</span> <span>Elevated to HIGH</span>
                  </span>
                </div>
              </div>
            </div>

            {/* AI Analysis Multi-Constraint Engine Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  AI Constraint Analysis
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {isOptimizing ? 'ANALYSING...' : 'OPTIMISATION COMPLETE'}
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aircraft availability evaluated</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Crew readiness & fatigue verified</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Resource & turnaround constraints solved</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Weather conditions & turbulence mapped</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Airspace corridor availability factored</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mission priorities weighted</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Confidence Score:</span>
                <span className="text-emerald-400 font-bold text-base tabular-nums">
                  {currentPlan.confidencePct}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Recommended Resource Plan & Tabular Rationale (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-5">
              {/* RECOMMENDED RESOURCE PLAN Box */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    RECOMMENDED RESOURCE PLAN
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-amber-950 border border-amber-600/50 text-amber-300 rounded">
                    PRIORITY: {currentPlan.priority}
                  </span>
                </div>

                {/* Resource capacity overview */}
                <div className="p-3 bg-slate-950/80 rounded border border-slate-800 grid grid-cols-3 gap-3 text-xs font-mono text-center mb-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Available</span>
                    <span className="text-base font-bold text-slate-100">{currentPlan.availableAircraft} Aircraft</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ready Crew</span>
                    <span className="text-base font-bold text-emerald-400">{currentPlan.readyCrew} Ready</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Resource Capacity</span>
                    <span className="text-base font-bold text-indigo-400">{currentPlan.resourceCapacityPct}% Pool</span>
                  </div>
                </div>

                {/* Constraints Detected */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">
                    Constraints Detected:
                  </span>
                  {currentPlan.constraintsDetected.map((cons, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-mono text-amber-300/90 bg-amber-950/20 p-2 rounded border border-amber-800/40">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{cons}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Action */}
                <div className="p-3 bg-cyan-950/30 rounded border border-cyan-700/50 text-xs font-mono">
                  <span className="text-cyan-400 font-bold block mb-1 uppercase text-[11px]">
                    Recommended Action:
                  </span>
                  <p className="text-slate-200 font-medium">
                    {currentPlan.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Inner View Tabs: Reallocation Matrix vs Explainable AI Steps */}
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                  <button
                    onClick={() => setActiveTab('plan')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'plan' 
                        ? 'bg-slate-800 text-cyan-400 font-semibold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Dynamic Reallocations ({currentPlan.reallocations.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('explanation')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'explanation' 
                        ? 'bg-slate-800 text-cyan-400 font-semibold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Why This Recommendation? (XAI)
                  </button>
                </div>

                {activeTab === 'plan' ? (
                  /* Reallocation Items Table */
                  <div className="space-y-3 font-mono text-xs">
                    {currentPlan.reallocations.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 bg-slate-950/70 rounded border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">{item.resource}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-700">
                            {item.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                          <span>From: <strong className="text-slate-300">{item.from}</strong></span>
                          <span>→</span>
                          <span>To: <strong className="text-emerald-400">{item.to}</strong></span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans">
                          {item.justification}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Explainable AI Reasoning Chain */
                  <div className="space-y-4">
                    {/* Step by step chain of reasoning */}
                    <div className="space-y-3">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase block">
                        CHAIN OF OPERATIONAL REASONING
                      </span>
                      <div className="space-y-2">
                        {currentPlan.reasoningSteps.map((step) => (
                          <div 
                            key={step.stepNumber}
                            className="flex items-start gap-3 p-2.5 bg-slate-950/70 rounded border border-slate-800/80 font-mono text-xs"
                          >
                            <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/50 rounded font-bold">
                              {step.stepNumber}
                            </span>
                            <div className="flex-1">
                              <span className="font-semibold text-slate-200 block">{step.title}</span>
                              <p className="text-[11px] text-slate-400 font-sans mt-0.5">{step.description}</p>
                              <span className="text-[10px] text-cyan-400/90 block mt-1">
                                Telemetry: {step.highlight}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decision Factors Influence Table */}
                    <div className="pt-2">
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase block mb-2">
                        DECISION FACTOR INFLUENCE WEIGHTS
                      </span>
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                            <th className="pb-2">Factor</th>
                            <th className="pb-2">Influence</th>
                            <th className="pb-2">Impact Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {currentPlan.decisionFactors.map((df) => (
                            <tr key={df.factor}>
                              <td className="py-2 font-medium text-slate-200">{df.factor}</td>
                              <td className="py-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                                  df.influence === 'Very High' 
                                    ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                                    : df.influence === 'High'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {df.influence}
                                </span>
                              </td>
                              <td className="py-2 text-slate-400 text-[11px] font-sans">
                                {df.impactDescription}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Commander Directive Generator Action */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                AEROSYNC does not replace the human commander; it provides transparent decision support.
              </span>
              <button
                onClick={handleGenerateCommanderBrief}
                className="px-3.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/50 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Generate ATO Directive Brief</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Sidebar (Docked to right, togglable) */}
      <AuditLogSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectForComparison={(entry) => setComparedHistoricalEntry(entry)}
      />

      {/* Commander ATO Directive Modal */}
      {showAiTacticalBrief && aiBriefContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-sm font-bold text-cyan-400">
                COMMANDER'S STRATEGIC AIR TASKING ORDER
              </span>
              <button
                onClick={() => setShowAiTacticalBrief(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 cursor-pointer font-sans"
              >
                Close
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded border border-slate-800 text-slate-300 whitespace-pre-wrap font-mono leading-relaxed text-[11px]">
              {aiBriefContent}
            </pre>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-3 font-sans">
              <button
                onClick={() => setShowAiTacticalBrief(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded cursor-pointer text-xs"
              >
                Authorize & Distribute to Squadrons
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
