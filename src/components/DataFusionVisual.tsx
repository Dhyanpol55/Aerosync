import React from 'react';
import { motion } from 'motion/react';
import { Plane, Users, CloudRain, Compass, Layers, Cpu, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

interface DataFusionVisualProps {
  className?: string;
  compact?: boolean;
}

export const DataFusionVisual: React.FC<DataFusionVisualProps> = ({ className = '', compact = false }) => {
  const inputs = [
    { label: 'Aircraft Telemetry', icon: Plane, count: '18 Available', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
    { label: 'Crew Readiness', icon: Users, count: '87% Ready', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Weather Feed', icon: CloudRain, count: 'Moderate VMC', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Airspace Corridors', icon: Compass, count: '68% Open', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
    { label: 'Stockpiles & Load', icon: Layers, count: '76% Capacity', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' },
  ];

  return (
    <div className={`p-5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-white shadow-sm font-sans ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h3 className="text-sm font-bold tracking-tight dark:text-slate-100 text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Multi-Source Data Fusion Pipeline
          </h3>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
            Real-time telemetry ingestion, constraint synthesis, and adaptive allocation.
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 dark:text-cyan-400 text-cyan-700 font-semibold self-start sm:self-auto">
          LATENCY &lt; 250ms
        </span>
      </div>

      {/* Visual Diagram Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Step 1: Fragmented Inputs (5 items) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Fragmented Sources</span>
            <span className="text-[10px] text-slate-400 font-mono">5 STREAMS</span>
          </div>
          <div className="space-y-1.5">
            {inputs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/70 bg-slate-50 text-xs transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <span className={`p-1 rounded-md border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium dark:text-slate-200 text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold dark:text-slate-300 text-slate-600">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Fusion Core (Center) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl border dark:border-cyan-900/50 border-cyan-200/80 dark:bg-cyan-950/20 bg-cyan-50/50 relative overflow-hidden my-2 lg:my-0">
          <div className="absolute inset-0 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md mb-2 shadow-cyan-500/20">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-xs font-bold tracking-wide font-mono dark:text-cyan-300 text-cyan-800 uppercase">
              AEROSYNC AI CORE
            </h4>
            <p className="text-[11px] dark:text-slate-300 text-slate-600 mt-1 max-w-[200px]">
              Constraint Satisfaction & Resource Optimisation Engine
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full dark:bg-slate-900/90 bg-white border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Deterministic Rule Scoring
            </div>
          </div>
        </div>

        {/* Step 3: Decisions & Plan Outputs */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Adaptive Decision Support</span>
            <span className="text-[10px] text-emerald-500 font-mono">FEASIBLE</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-950/70 bg-slate-50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold dark:text-slate-200 text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  Dynamic Optimisation
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">94% Yield</span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 leading-relaxed">
                Prioritised allocation to critical sorties while reserving standby buffers for contingencies.
              </p>
            </div>

            <div className="p-3 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-950/70 bg-slate-50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold dark:text-slate-200 text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Explainable Decision
                </span>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">91% Conf.</span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 leading-relaxed">
                Transparent factor influence weights with full human-in-the-loop review governance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
