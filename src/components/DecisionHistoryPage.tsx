import React, { useState } from 'react';
import { 
  History, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Clock, 
  Layers, 
  Cpu, 
  Sliders, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

interface HistoryItem {
  id: string;
  time: string;
  title: string;
  type: 'baseline' | 'change' | 'reoptimization' | 'scenario';
  status: 'Completed' | 'Re-optimised';
  confidence: number;
  summary: string;
  inputs: {
    aircraft: string;
    crew: string;
    weather: string;
    airspace: string;
    priority: string;
  };
  constraints: string[];
  recommendation: string;
}

export const DecisionHistoryPage: React.FC = () => {
  const { setActiveScreen } = useOperations();
  const [expandedId, setExpandedId] = useState<string | null>('hist-1');

  const historyItems: HistoryItem[] = [
    {
      id: 'hist-3',
      time: '10:51 AM',
      title: 'Scenario Simulation',
      type: 'scenario',
      status: 'Completed',
      confidence: 84,
      summary: 'What-if contingency stress test conducted on Sector Central ingress corridor.',
      inputs: {
        aircraft: '70% Availability (17 Airframes)',
        crew: '85% Readiness',
        weather: 'Degraded (Squalls)',
        airspace: 'Limited Regulation',
        priority: 'High'
      },
      constraints: [
        'Airspace transit ceiling restricted above FL260',
        'Turnaround surge limitation at Base-B'
      ],
      recommendation: 'Re-vector ingress route via Northern Green corridor to bypass turbulent cells while maintaining 88% sortie coverage.'
    },
    {
      id: 'hist-2',
      time: '10:46 AM',
      title: 'Conditions Changed',
      type: 'change',
      status: 'Re-optimised',
      confidence: 88,
      summary: 'Weather degraded in Central Sector; Airspace limited; 3 airframes transitioned to maintenance.',
      inputs: {
        aircraft: '15 Available (down from 18)',
        crew: '82% Ready',
        weather: 'Degraded Frontal Line',
        airspace: 'Limited / Diverted',
        priority: 'High'
      },
      constraints: [
        'Severe convective squalls over Central Sector approach',
        'Base-A munitions inventory alert for Anti-Radiation Missiles'
      ],
      recommendation: 'Re-route strike sorties to high-altitude corridors and reposition PEGASUS-01 tanker to establish mid-route air bridge.'
    },
    {
      id: 'hist-1',
      time: '10:42 AM',
      title: 'Baseline Analysis',
      type: 'baseline',
      status: 'Completed',
      confidence: 91,
      summary: 'Initial multi-source synchronization across all 3 bases and operational sectors.',
      inputs: {
        aircraft: '18 Available / 24 Total',
        crew: '87% Ready (104/120)',
        weather: 'Normal VMC / Clear',
        airspace: 'Available (Open)',
        priority: 'Medium'
      },
      constraints: [
        'Civil corridor regulation in Sector South',
        'Routine inspection schedule on 4 reserve fighters'
      ],
      recommendation: 'Rebalance simulated resources toward the highest-priority planning requirement while preserving required availability reserves.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Decision History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            &ldquo;Transparent record of simulated analyses and planning changes.&rdquo;
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('ai-analysis')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>New AI Analysis</span>
        </button>
      </div>

      {/* Timeline Container (Section 26) */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {historyItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="relative group">
              {/* Timeline Dot */}
              <div className={`absolute -left-6 sm:-left-8 top-5 w-5 h-5 rounded-full border-2 bg-white dark:bg-[#111827] flex items-center justify-center ${
                item.status === 'Re-optimised' 
                  ? 'border-amber-500 text-amber-500' 
                  : 'border-blue-600 text-blue-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'Re-optimised' ? 'bg-amber-500' : 'bg-blue-600'
                }`} />
              </div>

              {/* Card */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm transition-all hover:border-blue-400 dark:hover:border-blue-500/50">
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      {item.time}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                      Confidence: <strong className="text-blue-600 dark:text-cyan-400">{item.confidence}%</strong>
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                      item.status === 'Re-optimised'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {item.status}
                    </span>

                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
                  {item.summary}
                </p>

                {/* Expanded Details View (Section 26) */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs font-sans">
                    {/* Inputs */}
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                        Telemetry &amp; Condition Inputs
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Aircraft:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.inputs.aircraft}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Crew:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.inputs.crew}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Weather:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{item.inputs.weather}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Airspace:</span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">{item.inputs.airspace}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Priority:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.inputs.priority}</span>
                        </div>
                      </div>
                    </div>

                    {/* Constraints */}
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5">
                        Constraints Identified
                      </span>
                      <ul className="space-y-1">
                        {item.constraints.map((c, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300 block mb-1">
                        Selected Recommendation
                      </span>
                      <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                        &ldquo;{item.recommendation}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                      <span>Evaluated by deterministic constraint solver</span>
                      <span>Execution ID: {item.id.toUpperCase()}-2026</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
