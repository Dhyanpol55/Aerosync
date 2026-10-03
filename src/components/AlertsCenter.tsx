import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  Layers, 
  Network, 
  ShieldCheck, 
  Cpu, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AlertsCenter: React.FC = () => {
  const { alerts, acknowledgeAlert, recalculatePlan, setActiveScreen } = useOperations();
  const [activeTab, setActiveTab] = useState<'alerts' | 'architecture' | 'audit'>('alerts');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'planning' | 'system'>('all');

  const filteredAlerts = alerts.filter(a => severityFilter === 'all' || a.severity === severityFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <span>Alert Center & Decision History</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-700 rounded">
              SIH26250 · MoD
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time tactical notifications · Multi-source telemetry audit trail · System architecture
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'alerts' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Alerts ({alerts.filter(a => !a.acknowledged).length} unread)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'architecture' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Platform Architecture
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SIH Problem Spec
          </button>
        </div>
      </div>

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Severity Filters */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 mr-2">Severity:</span>
            {(['all', 'critical', 'warning', 'planning', 'system'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded border capitalize transition-colors cursor-pointer ${
                  severityFilter === sev 
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500 font-semibold' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {sev === 'all' ? 'All Alerts' : sev}
              </button>
            ))}
          </div>

          {/* Alert List (Matching prompt: High priority, attention, planning, system) */}
          <div className="space-y-3 font-mono">
            {filteredAlerts.map(alert => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';
              const isPlan = alert.severity === 'planning';
              const isSys = alert.severity === 'system';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-all ${
                    alert.acknowledged
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      : isCrit
                      ? 'bg-rose-950/40 border-rose-600/70 text-slate-200 shadow-md shadow-rose-950/20'
                      : isWarn
                      ? 'bg-amber-950/40 border-amber-600/70 text-slate-200'
                      : isPlan
                      ? 'bg-cyan-950/40 border-cyan-700/70 text-slate-200'
                      : 'bg-emerald-950/30 border-emerald-700/60 text-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isCrit ? 'bg-rose-500 ring-4 ring-rose-500/20' :
                        isWarn ? 'bg-amber-400 ring-4 ring-amber-500/20' :
                        isPlan ? 'bg-cyan-400 ring-4 ring-cyan-500/20' :
                        'bg-emerald-400 ring-4 ring-emerald-500/20'
                      }`} />
                      <span className="font-bold text-xs uppercase tracking-wide">
                        {isCrit && '🔴 HIGH PRIORITY'}
                        {isWarn && '🟠 ATTENTION'}
                        {isPlan && '🟡 PLANNING'}
                        {isSys && '🟢 SYSTEM'}
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {alert.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{alert.timestamp}</span>
                      {alert.sector && (
                        <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-[10px]">
                          {alert.sector}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between font-sans text-xs">
                    {alert.actionRequired ? (
                      <span className="text-amber-400 text-[11px] font-mono">
                        Action Required: <strong>{alert.actionRequired}</strong>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">
                        Informational status notice
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {isCrit && !alert.acknowledged && (
                        <button
                          onClick={() => {
                            acknowledgeAlert(alert.id);
                            setActiveScreen('ai-engine');
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded cursor-pointer text-xs"
                        >
                          Resolve in AI Engine
                        </button>
                      )}
                      {!alert.acknowledged ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer border border-slate-700 text-xs"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-mono">
                          ✓ Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              ARCHITECTURE BEHIND PROTOTYPE
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end data pipeline from multi-source military feeds to explainable human review
            </p>
          </div>

          {/* ASCII / Flow Pipeline Diagram from User Prompt */}
          <div className="p-5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto">
            <pre className="text-cyan-400 leading-relaxed font-mono">
{`                        AEROSYNC PLATFORM
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
   DATA SOURCES                                     USER INPUT
(Radar, AWACS, ERP,                                (What-If, Sliders,
 Weather, NOTAM, Rest)                             Commander Constraints)
        │                                               │
        └───────────────────────┬───────────────────────┘
                                ↓
                         DATA INGESTION
                                ↓
                        DATA VALIDATION
                                ↓
                          DATA FUSION
                                ↓
                ┌───────────────┴───────────────┐
                ↓                               ↓
          AI ANALYTICS                     RULE ENGINE
        (Pattern Detection,              (STANAG Rest Cycles,
        Threat Corridors)                Weapon Clearances)
                │                               │
                └───────────────┬───────────────┘
                                ↓
                           OPTIMISATION
                (Mixed-Integer Linear Solver &
                Heuristic Multi-Constraint Allocator)
                                ↓
                          WHAT-IF ENGINE
                                ↓
                         DECISION SUPPORT
                (Transparent Reasoning, Confidence,
                Trade-off Matrix)
                                ↓
                           HUMAN REVIEW
                (Commander in the Loop — Approval)
                                ↓
                           FINAL OUTPUT
                (Dynamic Air Tasking Order / Scramble)`}
            </pre>
          </div>

          {/* Key Architectural Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-950/60 rounded border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block text-sm">
                01. Multi-Source Fusion
              </span>
              <p className="text-slate-400 font-sans text-xs">
                Integrates previously siloed systems: maintenance ERP, radar telemetry, crew rest manifests, and meteorological radar grids into a unified spatial state.
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">
                02. Dynamic Re-Planning
              </span>
              <p className="text-slate-400 font-sans text-xs">
                Sub-second recalculation upon attrition, runway interdiction, or sudden weather squalls, preventing command latency and sub-optimal asset deployment.
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold block text-sm">
                03. Explainable AI (XAI)
              </span>
              <p className="text-slate-400 font-sans text-xs">
                Human-in-the-loop assurance: The system never hides reasons behind black-box scores; it exposes the exact constraints and trade-off weights to the Air Commander.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-cyan-400 font-bold text-sm block">
                SMART INDIA HACKATHON 2026 // PROBLEM STATEMENT
              </span>
              <span className="text-slate-400 text-xs">
                SIH26250 · Air Power - Dynamic Air Operations & Resource Optimisation
              </span>
            </div>
            <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-700/60 rounded">
              DEFENCE INNOVATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] block">Problem Creator</span>
              <span className="text-slate-200 font-bold text-sm">Sarim Moin</span>
              <span className="text-slate-400 block text-xs">Ministry of Defence (MoD) / Innovation Cell (MIC)</span>
            </div>

            <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase text-[10px] block">Technology Opportunity</span>
              <span className="text-emerald-400 font-bold text-sm">AI-Enabled Decision Support & Data Fusion</span>
              <span className="text-slate-400 block text-xs">Multi-source data fusion, predictive analytics, and optimisation algorithms</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 font-sans text-xs text-slate-300 leading-relaxed">
            <span className="text-cyan-400 font-mono font-bold block uppercase text-[11px]">
              Official Problem Statement:
            </span>
            <p>
              "Complexity in planning and dynamically retasking air operations in a contested and rapidly changing operational environment. Information on aircraft availability, crew status, weapon loads, airspace, weather, threats and mission priorities is generated across multiple systems but is not always available through a common, real-time decision-support framework, leading to increased planning timelines and sub-optimal allocation of scarce airpower resources."
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 font-sans text-xs text-slate-300">
            <span className="text-emerald-400 font-mono font-bold block uppercase text-[11px]">
              AEROSYNC Solution Delivery:
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Unified C2 Dashboard linking 5 core operational vectors (Aircraft, Crew, Resources, Weather, Airspace).</li>
              <li>Live interactive Tactical Airspace Vector Map with range rings and dynamic threat zones.</li>
              <li>Single-click operational condition shift simulation with real-time heuristic re-optimisation.</li>
              <li>Transparent XAI decision reasoning chain with factor influence weighting.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
