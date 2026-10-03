import React, { useState, useEffect, useRef } from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Pause, 
  Play, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Radio, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export interface DatalinkLogEntry {
  id: string;
  timestamp: string;
  source: 'IACCS_FEED' | 'TELEMETRY' | 'AI_OPTIMIZER' | 'LINK-16' | 'ALERT_WARN';
  message: string;
  severity: 'cyan' | 'amber' | 'emerald' | 'purple';
}

const SAMPLE_LOG_TEMPLATES = [
  {
    source: 'IACCS_FEED' as const,
    severity: 'cyan' as const,
    template: (ac: any, z: string) => `Ingesting Doppler Radar Matrix (Grid ${Math.floor(10 + Math.random() * 80)}-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}) · 120 Hz scan nominal`
  },
  {
    source: 'TELEMETRY' as const,
    severity: 'cyan' as const,
    template: (ac: any, z: string) => `${ac.callsign} alt ${ac.altitudeFt > 0 ? ac.altitudeFt.toLocaleString() : 'GROUND'}ft | Speed Mach ${(Math.max(0.6, ac.airSpeedKnots / 660)).toFixed(2)} | Fuel ${ac.fuelState}% | Hdg ${ac.heading}°`
  },
  {
    source: 'AI_OPTIMIZER' as const,
    severity: 'emerald' as const,
    template: (ac: any, z: string) => `Dynamic constraint check pass across all wings: Mixed-Integer solver converged in ${(9 + Math.random() * 8).toFixed(1)}ms`
  },
  {
    source: 'LINK-16' as const,
    severity: 'purple' as const,
    template: (ac: any, z: string) => `J-Series message sync (J3.2 Air Track / J12.0 Mission Assignment) verified across 18 airborne nodes`
  },
  {
    source: 'IACCS_FEED' as const,
    severity: 'cyan' as const,
    template: (ac: any, z: string) => `Target Correlation Engine: Track ID correlation confidence 99.4% · Zero false track bifurcations`
  },
  {
    source: 'AI_OPTIMIZER' as const,
    severity: 'emerald' as const,
    template: (ac: any, z: string) => `Fuel endurance & standoff distance ratio optimal: Re-allocation check complete in ${(11 + Math.random() * 5).toFixed(1)}ms`
  },
  {
    source: 'ALERT_WARN' as const,
    severity: 'amber' as const,
    template: (ac: any, z: string) => `ELINT Sensor Array: Passive electronic scan on 8.4-10.5 GHz frequency band · Sector perimeter surveillance active`
  }
];

export const DatalinkTerminal: React.FC = () => {
  const { aircraft, zuluTime, activeIncident } = useOperations();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'TELEMETRY' | 'ALERTS' | 'OPTIMIZER'>('ALL');
  const [copied, setCopied] = useState<boolean>(false);

  const [logs, setLogs] = useState<DatalinkLogEntry[]>(() => {
    return [
      {
        id: 'log-0',
        timestamp: '16:15:28 IST',
        source: 'IACCS_FEED',
        message: 'IACCS High-Bandwidth Datalink synchronized. Frequency 120 Hz locked.',
        severity: 'cyan'
      },
      {
        id: 'log-1',
        timestamp: '16:15:30 IST',
        source: 'TELEMETRY',
        message: 'GARUDA-01 alt 28,000ft | Speed Mach 1.2 | Fuel 92% | Hdg 045°',
        severity: 'cyan'
      },
      {
        id: 'log-2',
        timestamp: '16:15:32 IST',
        source: 'AI_OPTIMIZER',
        message: 'Multi-objective mixed-integer solver initialized. 24 active airframes tracked in memory.',
        severity: 'emerald'
      },
      {
        id: 'log-3',
        timestamp: '16:15:35 IST',
        source: 'LINK-16',
        message: 'J-Series tactical picture synchronized with AWACS Sentry-01 and Ground Station Alpha.',
        severity: 'purple'
      }
    ];
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && isExpanded && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isExpanded]);

  // Push new log entry every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Pick random aircraft
      const airbornePlanes = aircraft.filter(a => a.altitudeFt > 0);
      const chosenAc = airbornePlanes[Math.floor(Math.random() * airbornePlanes.length)] || aircraft[0];

      // Pick template
      const template = SAMPLE_LOG_TEMPLATES[Math.floor(Math.random() * SAMPLE_LOG_TEMPLATES.length)];

      const newLog: DatalinkLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: zuluTime,
        source: template.source,
        message: template.template(chosenAc, zuluTime),
        severity: template.severity
      };

      setLogs(prev => {
        // Keep max 150 entries in rolling memory
        const next = [...prev, newLog];
        if (next.length > 150) {
          return next.slice(next.length - 150);
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [aircraft, zuluTime, isPaused]);

  // Insert alert when active incident changes
  useEffect(() => {
    if (activeIncident) {
      const incidentLog: DatalinkLogEntry = {
        id: `inc-log-${Date.now()}`,
        timestamp: zuluTime,
        source: 'ALERT_WARN',
        message: `BATTLEFIELD INCIDENT: ${activeIncident.title} · Dynamic AI solver retask triggered`,
        severity: 'amber'
      };
      const solverLog: DatalinkLogEntry = {
        id: `inc-solver-${Date.now()}`,
        timestamp: zuluTime,
        source: 'AI_OPTIMIZER',
        message: `Solver rerouted flight corridors: 100% border coverage maintained (Confidence 95%)`,
        severity: 'emerald'
      };
      setLogs(prev => [...prev, incidentLog, solverLog]);
    }
  }, [activeIncident, zuluTime]);

  const handleClear = () => {
    setLogs([]);
  };

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.source}: ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter(l => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'TELEMETRY') return l.source === 'TELEMETRY' || l.source === 'IACCS_FEED';
    if (filterSeverity === 'ALERTS') return l.source === 'ALERT_WARN';
    if (filterSeverity === 'OPTIMIZER') return l.source === 'AI_OPTIMIZER';
    return true;
  });

  return (
    <div className={`w-full rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300 font-mono text-xs overflow-hidden ${
      isMaximized ? 'fixed inset-x-4 bottom-4 z-50 max-h-[80vh]' : ''
    }`}>
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-100 uppercase tracking-wider text-xs">
              IACCS / LINK-16 Datalink Live Telemetry Stream
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              120 HZ SYNC
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Pause / Resume button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-2 py-1 rounded text-[10px] font-medium border flex items-center gap-1.5 cursor-pointer transition-colors ${
              isPaused 
                ? 'bg-amber-950/80 border-amber-600 text-amber-300 hover:bg-amber-900/80' 
                : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title={isPaused ? 'Resume live datalink stream' : 'Pause datalink stream'}
          >
            {isPaused ? <Play className="w-2.5 h-2.5 text-amber-400" /> : <Pause className="w-2.5 h-2.5 text-slate-400" />}
            <span>{isPaused ? 'PAUSED' : 'PAUSE'}</span>
          </button>

          {/* Copy Logs */}
          <button
            onClick={handleCopyLogs}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Copy all telemetry logs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {/* Clear Logs */}
          <button
            onClick={handleClear}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Clear terminal buffer"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Maximize / Minimize height */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer hidden sm:block"
            title={isMaximized ? 'Restore height' : 'Expand terminal view'}
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>

          {/* Collapse / Expand toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            title={isExpanded ? 'Collapse terminal' : 'Expand terminal'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {isExpanded && (
        <div className="flex flex-col">
          {/* Filter Bar & Settings */}
          <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold uppercase mr-1">FILTER:</span>
              {(['ALL', 'TELEMETRY', 'ALERTS', 'OPTIMIZER'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterSeverity(f)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    filterSeverity === f
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Auto-scroll toggle & log counter */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 w-3 h-3"
                />
                <span>Auto-Scroll</span>
              </label>

              <span className="text-slate-500">
                BUFFER: <strong className="text-slate-300">{filteredLogs.length}</strong> LOGS
              </span>
            </div>
          </div>

          {/* Streaming Log Lines Container */}
          <div 
            ref={scrollContainerRef}
            className={`p-4 overflow-y-auto space-y-1.5 font-mono text-xs leading-relaxed select-text tactical-grid ${
              isMaximized ? 'h-[500px]' : 'h-48 sm:h-56'
            }`}
          >
            {filteredLogs.length === 0 ? (
              <div className="text-slate-500 py-8 text-center">
                Terminal buffer empty. Streaming incoming military datalink packets...
              </div>
            ) : (
              filteredLogs.map((log) => {
                // Determine styling based on severity
                let colorClasses = 'text-cyan-400';
                let tagBg = 'bg-cyan-950/70 border-cyan-800 text-cyan-300';

                if (log.severity === 'amber' || log.source === 'ALERT_WARN') {
                  colorClasses = 'text-amber-300';
                  tagBg = 'bg-amber-950/80 border-amber-600 text-amber-200 animate-pulse';
                } else if (log.severity === 'emerald' || log.source === 'AI_OPTIMIZER') {
                  colorClasses = 'text-emerald-400';
                  tagBg = 'bg-emerald-950/70 border-emerald-700 text-emerald-300';
                } else if (log.severity === 'purple' || log.source === 'LINK-16') {
                  colorClasses = 'text-indigo-300';
                  tagBg = 'bg-indigo-950/70 border-indigo-700 text-indigo-300';
                }

                return (
                  <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/60 px-1 py-0.5 rounded transition-colors group">
                    <span className="text-slate-500 shrink-0 select-none">
                      [{log.timestamp}]
                    </span>

                    <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 uppercase ${tagBg}`}>
                      {log.source}
                    </span>

                    <span className={`flex-1 break-words font-medium ${colorClasses}`}>
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
