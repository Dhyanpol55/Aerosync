import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { AuditLogSidebar } from './AuditLogSidebar';
import { HumanVsAiComparison } from './HumanVsAiComparison';
import { RiskVsYieldSlider } from './RiskVsYieldSlider';
import { 
  Cpu, 
  CheckCircle2, 
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
  X,
  Crosshair,
  Plane,
  Users,
  Compass,
  CloudRain
} from 'lucide-react';

export const AiDecisionEngine: React.FC = () => {
  const { 
    currentPlan, 
    previousPlan, 
    aircraft, 
    crew, 
    needsReoptimization, 
    isOptimizing, 
    recalculatePlan, 
    simulateOperationalChange,
    auditLogs,
    selectedAuditLog,
    restoreHistoricalPlan,
    setShowAtoModal,
    setShowMunitionsModal
  } = useOperations();

  // Animation states for Section 17 & 22
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 1 to 5
  const [showResultCard, setShowResultCard] = useState(true);
  const [showExplainablePanel, setShowExplainablePanel] = useState(false);
  const [showComparisonCard, setShowComparisonCard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic conditions
  const availableAircraft = aircraft.filter(a => a.status === 'available').length;
  const readyCrewPct = Math.round((crew.filter(c => c.status === 'Ready').length / crew.length) * 100);

  // Section 17: 5-step analysis animation
  const handleAnalyzeConditions = async () => {
    setIsAnalyzing(true);
    setShowResultCard(false);
    setShowExplainablePanel(false);

    setAnalysisStep(1); // Reading simulated data...
    await new Promise(r => setTimeout(r, 500));
    setAnalysisStep(2); // Validating conditions...
    await new Promise(r => setTimeout(r, 500));
    setAnalysisStep(3); // Checking constraints...
    await new Promise(r => setTimeout(r, 600));
    setAnalysisStep(4); // Optimising resources...
    await new Promise(r => setTimeout(r, 500));
    setAnalysisStep(5); // Generating recommendation...
    await new Promise(r => setTimeout(r, 500));

    setIsAnalyzing(false);
    setShowResultCard(true);
  };

  const handleExecuteReoptimise = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    await new Promise(r => setTimeout(r, 400));
    setAnalysisStep(3);
    await new Promise(r => setTimeout(r, 400));
    setAnalysisStep(4);
    await new Promise(r => setTimeout(r, 400));
    setAnalysisStep(5);
    await new Promise(r => setTimeout(r, 400));
    setIsAnalyzing(false);
    await recalculatePlan();
    setShowResultCard(true);
    setShowComparisonCard(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start relative max-w-7xl mx-auto">
      {/* Main AI Engine Content */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span>AI Decision Engine</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                CONSTRAINT SOLVER
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              &ldquo;Analyse current conditions and generate an explainable recommendation.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowAtoModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1-Click ATO Export</span>
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isSidebarOpen
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Log ({auditLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Condition Alert if Changed (Section 21) */}
        {needsReoptimization && (
          <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <strong className="font-bold uppercase tracking-wider block">
                  ⚠ CONDITIONS CHANGED
                </strong>
                <span>Re-optimisation is recommended. Aircraft availability decreased, weather degraded, and corridors restricted.</span>
              </div>
            </div>

            <button
              onClick={handleExecuteReoptimise}
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer whitespace-nowrap shadow-sm shadow-amber-500/20 self-start sm:self-auto"
            >
              {isAnalyzing ? 'Optimising...' : 'RE-OPTIMISE'}
            </button>
          </div>
        )}

        {/* Section 16: INPUT CONDITIONS Large Clean Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              INPUT CONDITIONS
            </span>
            <span className="text-[11px] font-mono text-slate-400">TELEMETRY SYNCED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Aircraft Availability</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {availableAircraft} available
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">Active Fleet</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Crew Readiness</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {readyCrewPct}%
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">Rested</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Resource Capacity</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {currentPlan.resourceCapacityPct || 76}%
              </p>
              <span className="text-[10px] text-blue-600 font-semibold">Stable</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Weather</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {needsReoptimization ? 'Degraded' : 'Moderate'}
              </p>
              <span className="text-[10px] text-slate-500">Ceilings</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Airspace</span>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {needsReoptimization ? 'Restricted' : 'Limited'}
              </p>
              <span className="text-[10px] text-slate-500">Corridors</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Priority</span>
              <p className="text-base font-bold text-blue-600 dark:text-cyan-400 mt-1">
                {currentPlan.priority || 'High'}
              </p>
              <span className="text-[10px] text-slate-500">Posture</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluates combinatorial constraints across 3 bases, airframe maintenance cycles, and airspace slots.
            </p>

            <button
              onClick={handleAnalyzeConditions}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Cpu className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing Conditions...' : 'ANALYSE CONDITIONS'}</span>
            </button>
          </div>
        </div>

        {/* Section 17: AI ANALYSIS ANIMATION (2-3s step progress) */}
        {isAnalyzing && (
          <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/70 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm font-sans space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">
                  AI DECISION SOLVER IN PROGRESS
                </span>
              </div>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                Step {analysisStep} / 5
              </span>
            </div>

            {/* Step list */}
            <div className="space-y-2 text-xs font-mono">
              <div className={`p-2 rounded-lg flex items-center gap-2.5 ${analysisStep >= 1 ? 'text-blue-900 dark:text-blue-200 font-semibold' : 'text-slate-400 opacity-60'}`}>
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>Reading simulated data...</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center gap-2.5 ${analysisStep >= 2 ? 'text-blue-900 dark:text-blue-200 font-semibold' : 'text-slate-400 opacity-60'}`}>
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Validating conditions...</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center gap-2.5 ${analysisStep >= 3 ? 'text-blue-900 dark:text-blue-200 font-semibold' : 'text-slate-400 opacity-60'}`}>
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>Checking constraints...</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center gap-2.5 ${analysisStep >= 4 ? 'text-blue-900 dark:text-blue-200 font-semibold' : 'text-slate-400 opacity-60'}`}>
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">4</span>
                <span>Optimising resources...</span>
              </div>
              <div className={`p-2 rounded-lg flex items-center gap-2.5 ${analysisStep >= 5 ? 'text-blue-900 dark:text-blue-200 font-semibold' : 'text-slate-400 opacity-60'}`}>
                <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">5</span>
                <span>Generating recommendation...</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 18: AI RESULT CARD */}
        {showResultCard && !isAnalyzing && (
          <div className="p-6 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600/70 bg-white dark:bg-[#111827] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  RECOMMENDATION READY
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  ● Feasible
                </span>
              </div>

              {/* Section 20: Confidence Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Confidence:</span>
                <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  {currentPlan.confidencePct || 91}%
                </span>
              </div>
            </div>

            {/* Recommendation Text (Section 18 exact copy) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                &ldquo;Rebalance simulated resources toward the highest-priority planning requirement while preserving required availability reserves.&rdquo;
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                {currentPlan.recommendedAction}
              </p>
            </div>

            {/* Section 20 Explanation note */}
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              * Confidence reflects agreement between the simulated input conditions and the decision engine's rule and constraint evaluation. It is not a real-world operational confidence measure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowExplainablePanel(!showExplainablePanel)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{showExplainablePanel ? 'HIDE WHY' : 'VIEW WHY'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExplainablePanel ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => setShowComparisonCard(!showComparisonCard)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>VIEW BEFORE / AFTER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Section 19: EXPLAINABLE AI PANEL */}
        {showExplainablePanel && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  Why this recommendation?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Transparent factor influence weighting and decision process steps.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase">
                EXPLAINABLE AI
              </span>
            </div>

            {/* Horizontal Influence Bars (Section 19) */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-2">
                Factor Influence Weights
              </span>

              {/* Resource Availability: HIGH */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">RESOURCE AVAILABILITY</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">HIGH INFLUENCE</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Crew Readiness: HIGH */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">CREW READINESS</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">HIGH INFLUENCE</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Airspace: MEDIUM */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">AIRSPACE</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">MEDIUM INFLUENCE</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>

              {/* Weather: MEDIUM */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">WEATHER</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">MEDIUM INFLUENCE</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              {/* Priority: VERY HIGH */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">PRIORITY</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">VERY HIGH INFLUENCE</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
            </div>

            {/* Decision Process Steps 01 to 05 (Section 19) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-3">
                Decision Process
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-blue-600 font-bold text-sm block">01</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">Inputs validated</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-blue-600 font-bold text-sm block">02</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">Constraints identified</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-blue-600 font-bold text-sm block">03</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">Candidate plans generated</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-blue-600 font-bold text-sm block">04</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">Plans scored</p>
                </div>
                <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40">
                  <span className="text-emerald-600 font-bold text-sm block">05</span>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200 mt-1">Feasible plan selected</p>
                </div>
              </div>

              <div className="mt-4 text-center text-[11px] font-mono text-slate-400">
                &ldquo;Recommendation generated using a transparent constraint-based optimisation model.&rdquo;
              </div>
            </div>
          </div>
        )}

        {/* Section 23: BEFORE VS AFTER COMPARISON CARD */}
        {showComparisonCard && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                Before vs After Plan Comparison
              </h3>
              <button
                onClick={() => setShowComparisonCard(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* CURRENT PLAN */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-3">
                  CURRENT PLAN (BASELINE)
                </span>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Resource Capacity</span>
                    <span className="font-bold text-slate-900 dark:text-white">76%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Conditions</span>
                    <span className="font-bold text-emerald-600">Stable</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Planning Status</span>
                    <span className="font-bold text-blue-600">Normal</span>
                  </div>
                </div>
              </div>

              {/* NEW PLAN */}
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20">
                <span className="text-[11px] font-bold uppercase text-blue-700 dark:text-blue-300 block mb-3">
                  NEW PLAN (OPTIMISED)
                </span>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-blue-200/60 dark:border-blue-800/60">
                    <span className="text-slate-600 dark:text-slate-400">Resource Capacity</span>
                    <span className="font-bold text-amber-600">69%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-200/60 dark:border-blue-800/60">
                    <span className="text-slate-600 dark:text-slate-400">Conditions</span>
                    <span className="font-bold text-amber-600">Changed</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600 dark:text-slate-400">Planning Status</span>
                    <span className="font-bold text-emerald-600">Re-optimised</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Factors causing change */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-2">
                Primary factors causing change:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5" />
                  Weather
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Airspace
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Resource Availability
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tactical Intent Risk vs Yield Optimization Slider */}
        <RiskVsYieldSlider />

        {/* MoD Benchmark Evaluation: Human vs AI Decision Speed */}
        <HumanVsAiComparison />
      </div>

      {/* Audit Log Sidebar (Toggleable) */}
      <AuditLogSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectForComparison={(entry) => restoreHistoricalPlan(entry)}
      />
    </div>
  );
};
