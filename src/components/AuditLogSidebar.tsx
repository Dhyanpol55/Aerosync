import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { AuditLogEntry } from '../types/operations';
import { 
  History, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  RotateCcw, 
  SlidersHorizontal, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  X
} from 'lucide-react';

interface AuditLogSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectForComparison: (entry: AuditLogEntry) => void;
}

export const AuditLogSidebar: React.FC<AuditLogSidebarProps> = ({
  isOpen,
  onToggle,
  onSelectForComparison
}) => {
  const { 
    auditLogs, 
    selectedAuditLog, 
    setSelectedAuditLog, 
    restoreHistoricalPlan,
    currentPlan
  } = useOperations();

  const [compareModalEntry, setCompareModalEntry] = useState<AuditLogEntry | null>(null);

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        className={`transition-all duration-300 flex flex-col border-l border-slate-800 bg-slate-950/95 backdrop-blur-md ${
          isOpen ? 'w-80 sm:w-96' : 'w-12'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Audit Log & History
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {auditLogs.length} State Transitions Logged
                </span>
              </div>
            </div>
          ) : (
            <History className="w-4 h-4 text-cyan-400 mx-auto" />
          )}

          <button
            onClick={onToggle}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Audit Log'}
          >
            {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* When collapsed */}
        {!isOpen && (
          <div className="py-6 flex flex-col items-center gap-6 text-slate-400 font-mono text-[11px]">
            <button
              onClick={onToggle}
              className="[writing-mode:vertical-rl] rotate-180 hover:text-cyan-400 tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <span>AUDIT LOG ({auditLogs.length})</span>
            </button>
          </div>
        )}

        {/* When expanded: Timeline of events */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-slate-400 px-1 flex items-center justify-between">
              <span>Timeline of Simulated Changes</span>
              <span className="text-[10px] text-cyan-400">Click to Compare</span>
            </div>

            {auditLogs.map((entry, index) => {
              const isSelected = selectedAuditLog?.id === entry.id;
              const isSim = entry.eventType === 'simulation_change';
              const isReopt = entry.eventType === 'reoptimization';
              const isWhatIf = entry.eventType === 'whatif_commit';
              const isInit = entry.eventType === 'baseline_initial';

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedAuditLog(entry);
                    onSelectForComparison(entry);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30' 
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Event Type & Timestamp */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60 mb-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isSim 
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50' 
                        : isReopt 
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50' 
                        : isWhatIf 
                        ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-600/50' 
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-600/50'
                    }`}>
                      {isSim && 'Disruption'}
                      {isReopt && 'AI Re-Optimised'}
                      {isWhatIf && 'What-If Plan'}
                      {isInit && 'Initial Baseline'}
                    </span>

                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {entry.timestamp}
                    </span>
                  </div>

                  {/* Title & Trigger */}
                  <div className="font-semibold text-slate-200 text-xs line-clamp-1">
                    {entry.title}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2 leading-tight">
                    {entry.triggerReason}
                  </p>

                  {/* State Snapshot Metrics Chips */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 grid grid-cols-3 gap-1.5 text-[10px] text-center">
                    <div className="bg-slate-950/80 p-1 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">Aircraft</span>
                      <span className="font-bold text-slate-200">{entry.stateSnapshot.availableAircraft}</span>
                    </div>
                    <div className="bg-slate-950/80 p-1 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">Coverage</span>
                      <span className="font-bold text-cyan-400">{entry.stateSnapshot.sortieCoveragePct}%</span>
                    </div>
                    <div className="bg-slate-950/80 p-1 rounded border border-slate-800/80">
                      <span className="text-slate-500 block">Confidence</span>
                      <span className="font-bold text-emerald-400">{entry.stateSnapshot.confidencePct}%</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompareModalEntry(entry);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans cursor-pointer underline"
                    >
                      <span>Compare Outcomes</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {entry.planSnapshot && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreHistoricalPlan(entry);
                        }}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-sans text-[10px] cursor-pointer"
                        title="Restore this plan into active operational state"
                      >
                        Restore Plan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>

      {/* State Comparison Modal */}
      {compareModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setCompareModalEntry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs text-cyan-400 uppercase tracking-wider block font-bold">
                AUDIT STATE COMPARISON MATRIX
              </span>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                {compareModalEntry.title} vs Current Active State
              </h2>
              <span className="text-[11px] text-slate-400">
                Logged at {compareModalEntry.timestamp} · Multi-vector delta analysis
              </span>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2">Metric Vector</th>
                    <th className="pb-2">Historical State ({compareModalEntry.timestamp})</th>
                    <th className="pb-2">Current Active State</th>
                    <th className="pb-2 text-right">Delta / Net Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2.5 font-medium text-slate-300">Available Aircraft</td>
                    <td className="py-2.5 text-slate-200">{compareModalEntry.stateSnapshot.availableAircraft} Platforms</td>
                    <td className="py-2.5 text-slate-200">{currentPlan.availableAircraft} Platforms</td>
                    <td className="py-2.5 text-right font-bold">
                      {currentPlan.availableAircraft - compareModalEntry.stateSnapshot.availableAircraft > 0 ? (
                        <span className="text-emerald-400">+{currentPlan.availableAircraft - compareModalEntry.stateSnapshot.availableAircraft}</span>
                      ) : currentPlan.availableAircraft - compareModalEntry.stateSnapshot.availableAircraft < 0 ? (
                        <span className="text-rose-400">{currentPlan.availableAircraft - compareModalEntry.stateSnapshot.availableAircraft}</span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-medium text-slate-300">Ready Aircrew</td>
                    <td className="py-2.5 text-slate-200">{compareModalEntry.stateSnapshot.readyCrew} Ready</td>
                    <td className="py-2.5 text-slate-200">{currentPlan.readyCrew} Ready</td>
                    <td className="py-2.5 text-right font-bold">
                      {currentPlan.readyCrew - compareModalEntry.stateSnapshot.readyCrew > 0 ? (
                        <span className="text-emerald-400">+{currentPlan.readyCrew - compareModalEntry.stateSnapshot.readyCrew}</span>
                      ) : currentPlan.readyCrew - compareModalEntry.stateSnapshot.readyCrew < 0 ? (
                        <span className="text-rose-400">{currentPlan.readyCrew - compareModalEntry.stateSnapshot.readyCrew}</span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-medium text-slate-300">Resource Capacity</td>
                    <td className="py-2.5 text-slate-200">{compareModalEntry.stateSnapshot.resourceCapacityPct}%</td>
                    <td className="py-2.5 text-slate-200">{currentPlan.resourceCapacityPct}%</td>
                    <td className="py-2.5 text-right font-bold">
                      {currentPlan.resourceCapacityPct - compareModalEntry.stateSnapshot.resourceCapacityPct > 0 ? (
                        <span className="text-emerald-400">+{currentPlan.resourceCapacityPct - compareModalEntry.stateSnapshot.resourceCapacityPct}%</span>
                      ) : currentPlan.resourceCapacityPct - compareModalEntry.stateSnapshot.resourceCapacityPct < 0 ? (
                        <span className="text-rose-400">{currentPlan.resourceCapacityPct - compareModalEntry.stateSnapshot.resourceCapacityPct}%</span>
                      ) : (
                        <span className="text-slate-500">0%</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-medium text-slate-300">Sortie Coverage</td>
                    <td className="py-2.5 text-slate-200">{compareModalEntry.stateSnapshot.sortieCoveragePct}%</td>
                    <td className="py-2.5 text-slate-200">{currentPlan.sortieCoveragePct}%</td>
                    <td className="py-2.5 text-right font-bold">
                      {currentPlan.sortieCoveragePct - compareModalEntry.stateSnapshot.sortieCoveragePct > 0 ? (
                        <span className="text-emerald-400">+{currentPlan.sortieCoveragePct - compareModalEntry.stateSnapshot.sortieCoveragePct}%</span>
                      ) : currentPlan.sortieCoveragePct - compareModalEntry.stateSnapshot.sortieCoveragePct < 0 ? (
                        <span className="text-rose-400">{currentPlan.sortieCoveragePct - compareModalEntry.stateSnapshot.sortieCoveragePct}%</span>
                      ) : (
                        <span className="text-slate-500">0%</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-medium text-slate-300">Algorithm Confidence</td>
                    <td className="py-2.5 text-slate-200">{compareModalEntry.stateSnapshot.confidencePct}%</td>
                    <td className="py-2.5 text-slate-200">{currentPlan.confidencePct}%</td>
                    <td className="py-2.5 text-right font-bold">
                      {currentPlan.confidencePct - compareModalEntry.stateSnapshot.confidencePct > 0 ? (
                        <span className="text-emerald-400">+{currentPlan.confidencePct - compareModalEntry.stateSnapshot.confidencePct}%</span>
                      ) : currentPlan.confidencePct - compareModalEntry.stateSnapshot.confidencePct < 0 ? (
                        <span className="text-rose-400">{currentPlan.confidencePct - compareModalEntry.stateSnapshot.confidencePct}%</span>
                      ) : (
                        <span className="text-slate-500">0%</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 font-medium text-slate-300">Active Constraints</td>
                    <td className="py-2.5 text-slate-200">{compareModalEntry.stateSnapshot.activeConstraintsCount} active</td>
                    <td className="py-2.5 text-slate-200">{currentPlan.constraintsDetected.length} active</td>
                    <td className="py-2.5 text-right font-bold text-amber-400">
                      {currentPlan.constraintsDetected.length - compareModalEntry.stateSnapshot.activeConstraintsCount >= 0 ? '+' : ''}
                      {currentPlan.constraintsDetected.length - compareModalEntry.stateSnapshot.activeConstraintsCount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Context rationale */}
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] mb-4">
              <span className="text-slate-400 block font-semibold mb-1 uppercase">Historical Trigger Reason:</span>
              <p className="text-slate-300 font-sans leading-relaxed">
                {compareModalEntry.triggerReason}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-sans">
              <button
                onClick={() => setCompareModalEntry(null)}
                className="px-3.5 py-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Close Comparison
              </button>

              {compareModalEntry.planSnapshot && (
                <button
                  onClick={() => {
                    restoreHistoricalPlan(compareModalEntry);
                    setCompareModalEntry(null);
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore this Historical Plan Outcome</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
