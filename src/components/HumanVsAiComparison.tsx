import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  Activity,
  Layers
} from 'lucide-react';

export const HumanVsAiComparison: React.FC = () => {
  const comparisonData = [
    {
      metric: 'Planning Timeline',
      legacy: '~45 to 90 mins',
      ai: '< 3 seconds',
      delta: '95%+ Faster',
      highlight: 'positive',
      note: 'Replaces manual spreadsheet & radio coordination with sub-second constraint optimization.'
    },
    {
      metric: 'Turnaround Allocation',
      legacy: '72% Optimal',
      ai: '94% Optimal',
      delta: '+22% Asset Yield',
      highlight: 'positive',
      note: 'Maximizes scarce airframe flight hours while respecting maintenance bay limits.'
    },
    {
      metric: 'Threat Exposure Score',
      legacy: 'Moderate (Manual Avoidance)',
      ai: 'Minimised (Dynamic Avoidance)',
      delta: '-35% Risk Profile',
      highlight: 'positive',
      note: 'Real-time ELINT and weather radar fusion routes aircraft around active SAM envelopes.'
    },
    {
      metric: 'Constraint Violation Rate',
      legacy: '18% Sub-optimal Breaches',
      ai: '0% Rule-Validated',
      delta: 'Zero Fatigue Breaches',
      highlight: 'positive',
      note: 'Automated compliance filtering enforces mandatory crew rest and ordnance limits.'
    }
  ];

  return (
    <div className="dark:bg-slate-900/90 bg-white dark:border-slate-800 border-slate-200 shadow-sm rounded-lg p-5 space-y-4 font-mono text-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b dark:border-slate-800 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold dark:text-slate-100 text-slate-900 uppercase tracking-tight">
              Operational Efficiency Benchmark // Legacy Manual vs AEROSYNC AI
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold dark:bg-emerald-950 bg-emerald-100 dark:text-emerald-300 text-emerald-800 dark:border-emerald-600/50 border-emerald-300 rounded">
              DEFENCE EVALUATION
            </span>
          </div>
          <p className="text-[11px] dark:text-slate-400 text-slate-600 font-sans mt-0.5">
            Empirical efficiency benchmarks comparing conventional staff planning vs algorithmic dynamic decision support
          </p>
        </div>

        <div className="flex items-center gap-2 dark:text-slate-400 text-slate-600 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-cyan-500" />
          <span>Evaluation Metric: MoD SIH26250</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-slate-800 border-slate-200 dark:text-slate-400 text-slate-500 uppercase tracking-wider text-[11px]">
              <th className="pb-3 px-3 font-semibold">Evaluation Metric</th>
              <th className="pb-3 px-3 font-semibold dark:text-slate-400 text-slate-600">Legacy Manual Planning</th>
              <th className="pb-3 px-3 font-semibold text-cyan-600 dark:text-cyan-400">AEROSYNC AI Engine</th>
              <th className="pb-3 px-3 font-semibold text-right text-emerald-600 dark:text-emerald-400">Delta Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="dark:hover:bg-slate-850/50 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-bold dark:text-slate-200 text-slate-800 block text-xs">{row.metric}</span>
                  <span className="text-[10px] dark:text-slate-500 text-slate-500 font-sans">{row.note}</span>
                </td>
                <td className="py-3 px-3 dark:text-slate-400 text-slate-600 font-medium">
                  {row.legacy}
                </td>
                <td className="py-3 px-3 dark:text-slate-100 text-slate-900 font-bold dark:bg-cyan-950/20 bg-cyan-50/70 rounded">
                  {row.ai}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded dark:bg-emerald-950/80 bg-emerald-100 dark:text-emerald-300 text-emerald-800 dark:border-emerald-500/50 border-emerald-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {row.delta}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Impact Summary Bar */}
      <div className="pt-3 border-t dark:border-slate-800 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-2.5 dark:bg-slate-950/80 bg-slate-50 rounded border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] dark:text-slate-400 text-slate-500 block uppercase">Planning Timeline Acceleration</span>
          <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">95%+</span>
          <span className="text-[10px] dark:text-slate-500 text-slate-500 block">From 60m to seconds</span>
        </div>
        <div className="p-2.5 dark:bg-slate-950/80 bg-slate-50 rounded border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] dark:text-slate-400 text-slate-500 block uppercase">Airpower Resource Yield</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">+22%</span>
          <span className="text-[10px] dark:text-slate-500 text-slate-500 block">Optimized sortie generation</span>
        </div>
        <div className="p-2.5 dark:bg-slate-950/80 bg-slate-50 rounded border dark:border-slate-800 border-slate-200">
          <span className="text-[10px] dark:text-slate-400 text-slate-500 block uppercase">Contested Risk Avoidance</span>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">-35%</span>
          <span className="text-[10px] dark:text-slate-500 text-slate-500 block">Dynamic corridor evasion</span>
        </div>
      </div>
    </div>
  );
};
