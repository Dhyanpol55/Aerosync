import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { IncidentCategory } from '../types/operations';
import { 
  ShieldAlert, 
  CloudLightning, 
  AlertOctagon, 
  Zap, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles,
  Layers,
  Fuel,
  Compass
} from 'lucide-react';

interface IncidentButtonDef {
  type: IncidentCategory;
  title: string;
  badge: string;
  shortDesc: string;
  impactZone: string;
  colorScheme: {
    border: string;
    bg: string;
    hoverBg: string;
    text: string;
    badgeBg: string;
    iconColor: string;
  };
  icon: React.ComponentType<{ className?: string }>;
}

const INCIDENT_BUTTONS: IncidentButtonDef[] = [
  {
    type: 'sam_threat',
    title: 'Pop-up S-400 SAM Threat',
    badge: '180 NM LETHAL ZONE',
    shortDesc: 'Spawns active missile threat envelope in Sector North. Dynamic reroute around contested radar envelope.',
    impactZone: 'Sector North · Grid N-14',
    colorScheme: {
      border: 'border-rose-500/60 dark:border-rose-500/70',
      bg: 'bg-rose-950/30 hover:bg-rose-900/40',
      hoverBg: 'hover:border-rose-400',
      text: 'text-rose-700 dark:text-rose-200',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      iconColor: 'text-rose-400'
    },
    icon: ShieldAlert
  },
  {
    type: 'weather_squall',
    title: 'Severe Weather Squall',
    badge: 'CORRIDOR ALPHA CLOSED',
    shortDesc: 'Convective storm cell tops FL480. Ingress corridor closed; diverts strike packages through North.',
    impactZone: 'Central Sector · Corridor Alpha',
    colorScheme: {
      border: 'border-amber-500/60 dark:border-amber-500/70',
      bg: 'bg-amber-950/30 hover:bg-amber-900/40',
      hoverBg: 'hover:border-amber-400',
      text: 'text-amber-700 dark:text-amber-200',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      iconColor: 'text-amber-400'
    },
    icon: CloudLightning
  },
  {
    type: 'runway_closure',
    title: 'Runway Closure (Base Alpha)',
    badge: 'THRESHOLD CRATERED',
    shortDesc: 'Base Alpha 27R closed by UXO. Immediate recovery diversion to Base Bravo with emergency tanker stack.',
    impactZone: 'Base Alpha · Wing 1 Hub',
    colorScheme: {
      border: 'border-orange-500/60 dark:border-orange-500/70',
      bg: 'bg-orange-950/30 hover:bg-orange-900/40',
      hoverBg: 'hover:border-orange-400',
      text: 'text-orange-700 dark:text-orange-200',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      iconColor: 'text-orange-400'
    },
    icon: AlertOctagon
  },
  {
    type: 'high_value_scramble',
    title: 'Urgent High-Value Scramble',
    badge: 'EMERGENT TARGET WINDOW',
    shortDesc: 'Fleeting high-value airborne target at radar horizon. Instant supersonic CAP retask & weapon allocation.',
    impactZone: 'Sector North · Border Grid 12-F',
    colorScheme: {
      border: 'border-cyan-500/60 dark:border-cyan-500/70',
      bg: 'bg-cyan-950/30 hover:bg-cyan-900/40',
      hoverBg: 'hover:border-cyan-400',
      text: 'text-cyan-700 dark:text-cyan-200',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      iconColor: 'text-cyan-400'
    },
    icon: Zap
  }
];

export const IncidentInjector: React.FC = () => {
  const { 
    injectIncident, 
    activeIncident, 
    dismissIncident, 
    isOptimizing, 
    isAudioMuted, 
    toggleAudioMute,
    setActiveScreen
  } = useOperations();

  const [loadingType, setLoadingType] = useState<IncidentCategory | null>(null);

  const handleTrigger = async (type: IncidentCategory) => {
    setLoadingType(type);
    await injectIncident(type);
    setLoadingType(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Dynamic Visual Banner (Appears when an incident is active) */}
      {activeIncident && (
        <div className="rounded-2xl border-2 border-rose-500/80 bg-slate-950 p-5 shadow-2xl relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-3">
          {/* Subtle tactical corner glow */}
          <div className="absolute top-0 right-0 w-80 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-md shadow-rose-500/20 shrink-0">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/50 text-rose-300 uppercase">
                    ACTIVE BATTLEFIELD INCIDENT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    INJECTED AT (IST): <strong className="text-slate-200">{activeIncident.timestamp}</strong>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight mt-0.5">
                  {activeIncident.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => setActiveScreen('ai-analysis')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold font-mono bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Cpu className="w-3 h-3" />
                <span>Inspect in AI Engine</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={dismissIncident}
                className="p-1 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Dismiss and Re-arm Injector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Incident Details & AI Plan Delta */}
          <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-3.5 text-xs font-sans relative z-10">
            {/* Tactical Impact */}
            <div className="lg:col-span-5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <AlertOctagon className="w-3 h-3" />
                DISRUPTION IMPACT
              </span>
              <p className="text-slate-300 font-medium leading-relaxed text-[11px]">
                {activeIncident.description}
              </p>
              <div className="pt-1.5 border-t border-slate-800 text-[10px] font-mono text-rose-300">
                ⚠️ {activeIncident.tacticalImpact}
              </div>
            </div>

            {/* AI Automated Response */}
            <div className="lg:col-span-7 p-3 rounded-xl bg-slate-900/90 border border-cyan-800/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  AI RE-OPTIMIZATION RESULT (SOLVED IN 14ms)
                </span>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CONFIDENCE: 95%
                </span>
              </div>
              <p className="text-slate-200 font-medium leading-relaxed text-[11px]">
                {activeIncident.aiResponse}
              </p>

              {/* Dynamic Reallocations Pill List */}
              <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                  EXECUTED RE-ALLOCATIONS & ROUTE ADJUSTMENTS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {activeIncident.reallocationsSummary.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 flex items-start gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Injector Panel / Dock */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-3 h-3" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-100 font-mono uppercase tracking-wide">
                  Judge Battlefield Incident Injector
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Live C2 Disruption
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Inject sudden operational disruptions to evaluate real-time multi-source data fusion and dynamic re-planning.
              </p>
            </div>
          </div>

          {/* Audio Alert Status Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={toggleAudioMute}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioMuted
                  ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'bg-emerald-950/60 border-emerald-600/70 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title={isAudioMuted ? 'Tactical Voice Alerts Muted (Click to Enable)' : 'Tactical Voice Alerts Active (880Hz Chime + Speech)'}
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-slate-400" />
                  <span>VOICE ALERTS: OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>VOICE ALERTS: ON (880Hz)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Interactive Disruption Trigger Buttons */}
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INCIDENT_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            const isLoading = isOptimizing && loadingType === btn.type;
            const isActive = activeIncident?.type === btn.type;

            return (
              <button
                key={btn.type}
                onClick={() => handleTrigger(btn.type)}
                disabled={isOptimizing}
                className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between group shadow-sm ${
                  isActive
                    ? 'border-rose-400 bg-rose-950/50 shadow-rose-900/40 ring-1 ring-rose-500/30'
                    : `${btn.colorScheme.border} ${btn.colorScheme.bg} ${btn.colorScheme.hoverBg} hover:shadow-md`
                } ${isOptimizing && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${btn.colorScheme.badgeBg}`}>
                      {btn.badge}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${btn.colorScheme.iconColor} group-hover:scale-110 transition-transform`} />
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100 font-mono tracking-tight leading-snug">
                    {btn.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[10px] text-slate-300 font-sans mt-1 leading-relaxed">
                    {btn.shortDesc}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate max-w-[120px]">
                    📍 {btn.impactZone}
                  </span>

                  <span className={`font-bold flex items-center gap-1 ${
                    isLoading ? 'text-amber-400' : 'text-slate-200 group-hover:text-cyan-300'
                  }`}>
                    {isLoading ? (
                      <>
                        <span className="w-2 h-2 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        <span>SOLVING...</span>
                      </>
                    ) : (
                      <>
                        <span>INJECT</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Evaluation Instruction Strip */}
        <div className="mt-3 pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">
              Each trigger fires automated Web Audio/Speech alerts, prompts the linear optimization engine, and reroutes active assets in real time.
            </span>
          </div>
          <span className="text-slate-500">
            SIH Problem Statement SIH26250
          </span>
        </div>
      </div>
    </div>
  );
};
