import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plane, 
  Users, 
  CloudRain, 
  Compass, 
  Layers, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Target,
  Clock,
  Activity,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Database,
  Wifi
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

interface DataFusionVisualProps {
  className?: string;
  compact?: boolean;
}

export const DataFusionVisual: React.FC<DataFusionVisualProps> = ({ className = '', compact = false }) => {
  const { 
    dataFusionSources, 
    unifiedState, 
    setActiveScreen, 
    needsReoptimization,
    zuluTime
  } = useOperations();

  const [activeStage, setActiveStage] = useState<number>(5); // 0 to 5
  const [staleSimulated, setStaleSimulated] = useState<boolean>(false);

  const stages = [
    { name: 'SOURCE INPUTS', desc: '7 Fragmented Telemetry Feeds', latency: '4ms' },
    { name: 'VALIDATION', desc: 'Checksum & Schema Sanitisation', latency: '2ms' },
    { name: 'NORMALISATION', desc: 'Multi-Protocol Data Alignment', latency: '3ms' },
    { name: 'TIME ALIGNMENT', desc: 'WGS-84 & Temporal Interpolation', latency: '2ms' },
    { name: 'CONFIDENCE CHECK', desc: 'Kalman Filter & Outlier Rejection', latency: '3ms' },
    { name: 'UNIFIED OPERATIONAL STATE', desc: 'Fused Single Source of Truth', latency: '< 14ms Total' }
  ];

  const getSourceIcon = (category: string) => {
    switch (category) {
      case 'Aircraft': return Plane;
      case 'Crew': return Users;
      case 'Resource': return Layers;
      case 'Airspace': return Compass;
      case 'Weather': return CloudRain;
      case 'Threats': return ShieldAlert;
      case 'Priorities': return Target;
      default: return Activity;
    }
  };

  const getSourceColor = (category: string) => {
    switch (category) {
      case 'Aircraft': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Crew': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'Resource': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30';
      case 'Airspace': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Weather': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30';
      case 'Threats': return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      case 'Priorities': return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className={`p-6 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-white shadow-sm font-sans space-y-6 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-800 border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight dark:text-slate-100 text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
              Multi-Source Data Fusion Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border dark:border-cyan-700/60 border-cyan-300 dark:bg-cyan-950/80 bg-cyan-100 dark:text-cyan-300 text-cyan-800 font-bold">
              7/7 STREAMS TIME-ALIGNED
            </span>
          </div>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
            Real-time ingestion, normalisation, and time alignment across 7 critical air operational sources into a unified state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStaleSimulated(!staleSimulated)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              staleSimulated
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
            title="Simulate Stale Feed to test reliability & confidence gating"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>{staleSimulated ? 'Simulating Stale Feed: Active' : 'Test Stale Feed Alert'}</span>
          </button>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 dark:text-cyan-400 text-cyan-700 font-bold">
            LATENCY: 14ms
          </span>
        </div>
      </div>

      {/* Stale Feed Warning Banner (Requirement 2 & 17) */}
      {staleSimulated && (
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong className="font-bold uppercase tracking-wider block">DATA STALENESS WARNING: WEATHER RADAR FEED DELAYED (3 MIN AGO)</strong>
              <span>Confidence score throttled by 12% to prevent unreliable data from silently influencing decision outputs.</span>
            </div>
          </div>
          <button
            onClick={() => setStaleSimulated(false)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs rounded-lg font-semibold cursor-pointer shrink-0"
          >
            Restore Feed
          </button>
        </div>
      )}

      {/* Real Data-Fusion Workflow Pipeline (Requirement 2) */}
      <div className="p-4 sm:p-5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-950/70 bg-slate-50">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 pb-2 border-b dark:border-slate-800 border-slate-200">
          <span>DATA FUSION PIPELINE STAGES (14ms END-TO-END)</span>
          <span className="text-emerald-600 dark:text-emerald-400">● REAL-TIME SYNCHRONIZED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stages.map((stg, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                idx === activeStage 
                  ? 'dark:border-cyan-500/80 border-cyan-400 dark:bg-cyan-950/50 bg-cyan-50 shadow-sm' 
                  : 'dark:border-slate-800 border-slate-200 dark:bg-slate-900/40 bg-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-[10px] font-mono font-bold dark:text-slate-400 text-slate-500">STAGE 0{idx + 1}</span>
              </div>
              <h4 className="text-[11px] font-bold font-mono dark:text-slate-100 text-slate-900 leading-tight">
                {stg.name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {stg.desc}
              </p>
              <span className="inline-block mt-2 text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded border dark:border-cyan-800 border-cyan-200">
                {stg.latency}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Multi-Source Telemetry Inputs Grid (Requirement 2 & 17) */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-3">
          <span>7 HETEROGENEOUS SOURCE INPUTS</span>
          <span>STATUS &amp; CONFIDENCE METRICS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {dataFusionSources.map((src) => {
            const Icon = getSourceIcon(src.category);
            const colorClass = getSourceColor(src.category);
            const isStale = staleSimulated && src.category === 'Weather';

            return (
              <div 
                key={src.id}
                className="p-4 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-950/80 bg-white shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="font-bold text-xs dark:text-slate-200 text-slate-900 font-mono">
                        {src.name}
                      </span>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      isStale 
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
                        : src.connectionStatus === 'Connected' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}>
                      {isStale ? 'DEGRADED' : src.connectionStatus}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-2 font-semibold">
                    {src.sampleValue}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t dark:border-slate-800/80 border-slate-100 space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Last Updated:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {isStale ? '3 min ago (STALE)' : src.lastUpdated}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Data Freshness:</span>
                    <span className={`font-semibold ${isStale ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {isStale ? 'Stale' : src.dataFreshness}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Data Quality:</span>
                    <span className="font-semibold text-blue-600 dark:text-cyan-400">{src.dataQuality}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 pt-1 border-t dark:border-slate-800/50 border-slate-100">
                    <span>Confidence Score:</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {isStale ? '82%' : `${src.confidenceScore}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Unified Operational Picture Output Box (Requirement 3) */}
          <div className="p-4 rounded-xl border-2 dark:border-cyan-500/70 border-cyan-400 dark:bg-cyan-950/30 bg-cyan-50/50 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  UNIFIED STATE OUTPUT
                </span>
                <span className="text-[10px] font-mono font-bold bg-cyan-600 text-white px-1.5 py-0.2 rounded">
                  {unifiedState.confidence}% CONF.
                </span>
              </div>

              <h4 className="text-xs font-bold font-mono dark:text-white text-slate-900 mt-1">
                Unified Operational Picture
              </h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Fused baseline feeding AI Analysis and Constraint Optimisation engines.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-mono">
                <div className="p-2 rounded bg-white dark:bg-slate-950/80 border dark:border-slate-800 border-slate-200">
                  <span className="text-slate-400 block text-[9px]">AIRCRAFT</span>
                  <strong className="text-slate-900 dark:text-white">{unifiedState.aircraftAvailability.count} Available</strong>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950/80 border dark:border-slate-800 border-slate-200">
                  <span className="text-slate-400 block text-[9px]">CREW</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{unifiedState.crewReadiness.percentage}% Ready</strong>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950/80 border dark:border-slate-800 border-slate-200">
                  <span className="text-slate-400 block text-[9px]">WEATHER</span>
                  <strong className="text-blue-600 dark:text-cyan-400">{unifiedState.weather}</strong>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950/80 border dark:border-slate-800 border-slate-200">
                  <span className="text-slate-400 block text-[9px]">PRIORITY</span>
                  <strong className="text-purple-600 dark:text-purple-400">{unifiedState.priorities}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('ai-analysis')}
              className="mt-3.5 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Feed into AI Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
