import React from 'react';
import { useOperations } from '../context/OperationsContext';
import { TacticalIntent } from '../types/operations';
import { 
  ShieldCheck, 
  Scale, 
  Flame, 
  Activity, 
  Sliders, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const RiskVsYieldSlider: React.FC = () => {
  const { tacticalIntent, setTacticalIntent, currentPlan } = useOperations();

  const intents: {
    id: TacticalIntent;
    title: string;
    description: string;
    coverage: string;
    survivalRate: string;
    exposureIndex: string;
    color: string;
  }[] = [
    {
      id: 'conservative',
      title: 'Conservative / Force Protection',
      description: 'Prioritizes aircraft survival, long-range standoff munitions, and maximum electronic countermeasures.',
      coverage: '88% Coverage',
      survivalRate: '99.4% Survival Est.',
      exposureIndex: 'Low Threat Exposure (-35%)',
      color: 'border-emerald-500/60 text-emerald-400 bg-emerald-950/40'
    },
    {
      id: 'balanced',
      title: 'Balanced Tactical Stance',
      description: 'Standard doctrine: balances high sortie generation rate with coordinated AWACS radar coverage and tanker fuel buffers.',
      coverage: '94% Coverage',
      survivalRate: '97.2% Survival Est.',
      exposureIndex: 'Moderate Managed Exposure',
      color: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/40'
    },
    {
      id: 'high_risk_yield',
      title: 'High-Risk / High-Yield',
      description: 'Accepts elevated threat exposure to maximize target destruction speed and border breach denial during surge.',
      coverage: '98% Coverage',
      survivalRate: '92.8% Survival Est.',
      exposureIndex: 'High Threat Exposure (+25%)',
      color: 'border-rose-500/60 text-rose-300 bg-rose-950/40'
    }
  ];

  return (
    <div className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200 shadow-sm rounded-lg p-5 space-y-4 font-mono text-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b dark:border-slate-800 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-bold dark:text-slate-100 text-slate-900 uppercase tracking-tight">
              Tactical Intent Control: "Risk vs Yield" Optimization Slider
            </span>
          </div>
          <p className="text-[11px] dark:text-slate-400 text-slate-600 font-sans mt-0.5">
            Transparent commander intent slider: Dynamically alters heuristic constraint weights and force package recommendations
          </p>
        </div>

        <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold px-2.5 py-1 dark:bg-amber-950/80 bg-amber-100 border dark:border-amber-600/50 border-amber-300 rounded self-start sm:self-auto">
          ACTIVE INTENT: {tacticalIntent.toUpperCase()}
        </span>
      </div>

      {/* 3-Position Interactive Segmented Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {intents.map((item) => {
          const isActive = tacticalIntent === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setTacticalIntent(item.id)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                isActive 
                  ? `${item.color} shadow-lg ring-1 ring-cyan-500/50` 
                  : 'dark:bg-slate-950/70 bg-slate-50 dark:border-slate-800/80 border-slate-200 dark:hover:border-slate-700 hover:border-slate-300 dark:text-slate-400 text-slate-600 dark:hover:text-slate-200 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b dark:border-slate-800/60 border-slate-200 mb-2">
                <span className="font-bold text-xs">{item.title}</span>
                {isActive && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                )}
              </div>

              <p className="text-[11px] font-sans leading-relaxed dark:text-slate-300 text-slate-700">
                {item.description}
              </p>

              <div className="mt-3 pt-2 border-t dark:border-slate-800/60 border-slate-200 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="dark:text-slate-500 text-slate-500">Target Coverage:</span>
                  <span className="font-bold dark:text-slate-200 text-slate-800">{item.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-slate-500 text-slate-500">Asset Survivability:</span>
                  <span className="font-bold dark:text-slate-200 text-slate-800">{item.survivalRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-slate-500 text-slate-500">Threat Envelope:</span>
                  <span className="font-bold dark:text-slate-300 text-slate-700">{item.exposureIndex}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Impact Indicator */}
      <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded border dark:border-slate-800/80 border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-2 dark:text-slate-400 text-slate-600 font-sans">
          <Activity className="w-4 h-4 text-cyan-500 shrink-0" />
          <span>
            Current dynamic package adapted to <strong>{tacticalIntent}</strong> mode: Sortie coverage currently evaluated at <strong>{currentPlan.sortieCoveragePct}%</strong> with <strong>{currentPlan.confidencePct}%</strong> confidence.
          </span>
        </div>

        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
          ✓ REAL-TIME RECALCULATION ACTIVE
        </span>
      </div>
    </div>
  );
};
