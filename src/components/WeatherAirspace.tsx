import React from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  CloudSun, 
  Wind, 
  Eye, 
  Compass, 
  Clock, 
  Radio, 
  ShieldAlert, 
  Layers, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const WeatherAirspace: React.FC = () => {
  const { sectors, timeline, setActiveScreen, simulateOperationalChange } = useOperations();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Environmental & Airspace Conditions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic meteorological fusion · Air corridor restrictions · Electronic threat contours
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateOperationalChange}
            className="px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/60 rounded-md transition-colors cursor-pointer flex items-center gap-2"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Simulate Environmental Shift</span>
          </button>
          <button
            onClick={() => setActiveScreen('ai-engine')}
            className="px-3 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 rounded-md transition-colors cursor-pointer"
          >
            Review Plan Impact
          </button>
        </div>
      </div>

      {/* Region Status Cards (Exact format from user prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WEATHER CONDITIONS CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                WEATHER CONDITIONS BY REGION
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Doppler Radar Ingest</span>
          </div>

          <div className="space-y-3 font-mono">
            {sectors.map((sec, idx) => {
              const regionLetter = String.fromCharCode(65 + idx); // Region A, Region B, Region C
              const isClear = sec.weather === 'CLEAR';
              const isModerate = sec.weather === 'MODERATE';
              const isRestricted = sec.weather === 'RESTRICTED';

              return (
                <div 
                  key={sec.id}
                  className="p-3.5 bg-slate-950/70 rounded border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">
                        Region {regionLetter}
                      </span>
                      <span className="text-xs text-slate-400">({sec.name})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                      <span>Wind: {sec.windSpeed} kts</span>
                      <span>·</span>
                      <span>Vis: {sec.visibilityKm} km</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      isClear 
                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' 
                        : isModerate 
                        ? 'text-amber-400 border-amber-500/40 bg-amber-950/40' 
                        : 'text-rose-400 border-rose-500/40 bg-rose-950/40'
                    }`}>
                      {sec.weather}
                    </span>
                    <span className={`w-3 h-3 rounded-full ${
                      isClear 
                        ? 'bg-emerald-400 ring-4 ring-emerald-500/20' 
                        : isModerate 
                        ? 'bg-amber-400 ring-4 ring-amber-500/20' 
                        : 'bg-rose-500 ring-4 ring-rose-500/20'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AIRSPACE STATUS CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                AIRSPACE AVAILABILITY BY SECTOR
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">NOTAM & Corridor Feed</span>
          </div>

          <div className="space-y-3 font-mono">
            {sectors.map((sec, idx) => {
              const sectorLetter = String.fromCharCode(65 + idx); // Sector A, Sector B, Sector C
              const isAvailable = sec.airspace === 'AVAILABLE';
              const isLimited = sec.airspace === 'LIMITED';
              const isRestricted = sec.airspace === 'RESTRICTED';

              return (
                <div 
                  key={sec.id}
                  className="p-3.5 bg-slate-950/70 rounded border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-sm">
                        Sector {sectorLetter}
                      </span>
                      <span className="text-xs text-slate-400">({sec.name})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate max-w-xs">
                      {sec.corridorNote}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      isAvailable 
                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' 
                        : isLimited 
                        ? 'text-amber-400 border-amber-500/40 bg-amber-950/40' 
                        : 'text-rose-400 border-rose-500/40 bg-rose-950/40'
                    }`}>
                      {sec.airspace}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Environmental Timeline Forecast (Exact format required by user prompt) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
              PREDICTIVE ENVIRONMENTAL TIMELINE & RISK TRAJECTORY
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrates how dynamic atmospheric shifts continuously trigger air operations re-planning
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">4-Hour Prognosis</span>
        </div>

        {/* Timeline Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {timeline.map((point) => {
            const isClear = point.weather === 'CLEAR';
            const isModerate = point.weather === 'MODERATE';
            const isRestricted = point.weather === 'RESTRICTED';

            return (
              <div 
                key={point.timeLabel}
                className="bg-slate-950/70 p-4 rounded border border-slate-800 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-cyan-400">
                    {point.timeLabel}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isClear 
                      ? 'text-emerald-400 border-emerald-500/40' 
                      : isModerate 
                      ? 'text-amber-400 border-amber-500/40' 
                      : 'text-rose-400 border-rose-500/40'
                  }`}>
                    {point.weather}
                  </span>
                </div>

                {/* Visual Bar from User Prompt: Clear ████████ / Moderate ████████ / Restricted █████ */}
                <div className="my-3">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Flight Risk Index</span>
                    <span className="font-bold tabular-nums">{point.riskScore}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        point.riskScore < 35 
                          ? 'bg-emerald-500' 
                          : point.riskScore < 65 
                          ? 'bg-amber-500' 
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${point.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  Airspace: <span className={point.airspace === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'}>{point.airspace}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {point.notes}
                </p>
              </div>
            );
          })}
        </div>

        {/* Multi-source Telemetry Ingest Indicators */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <span className="text-slate-300 font-semibold block">Doppler Radar:</span>
              <span className="text-slate-500 text-[10px]">Sync Interval: 120s</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <span className="text-slate-300 font-semibold block">Civil Air Traffic:</span>
              <span className="text-slate-500 text-[10px]">Link-16 Air Picture</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <span className="text-slate-300 font-semibold block">METAR / TAF:</span>
              <span className="text-slate-500 text-[10px]">Base-A / Base-B Synced</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <span className="text-slate-300 font-semibold block">Threat Emitters:</span>
              <span className="text-slate-500 text-[10px]">ELINT Triangulation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
