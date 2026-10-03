import React, { useState } from 'react';
import { useOperations, WhatIfParams } from '../context/OperationsContext';
import { WeatherState, AirspaceState } from '../types/operations';
import { 
  Sliders, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { 
    currentPlan, 
    runWhatIfScenario, 
    whatIfResult, 
    applyWhatIfPlan,
    setActiveScreen
  } = useOperations();

  const [aircraftPct, setAircraftPct] = useState<number>(80);
  const [crewPct, setCrewPct] = useState<number>(90);
  const [weather, setWeather] = useState<WeatherState>('MODERATE');
  const [airspace, setAirspace] = useState<AirspaceState>('LIMITED');
  const [priority, setPriority] = useState<'ROUTINE' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleRun = async () => {
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    runWhatIfScenario({
      aircraftAvailabilityPct: aircraftPct,
      crewAvailabilityPct: crewPct,
      weather,
      airspace,
      priority
    });
    setIsSimulating(false);
  };

  const applyPreset = (preset: {
    aircraft: number;
    crew: number;
    weather: WeatherState;
    airspace: AirspaceState;
    priority: 'ROUTINE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }) => {
    setAircraftPct(preset.aircraft);
    setCrewPct(preset.crew);
    setWeather(preset.weather);
    setAirspace(preset.airspace);
    setPriority(preset.priority);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <span>What-If Scenario Simulator</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700/60 rounded">
              STRESS TESTING & TRADE-OFFS
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate operational variables · Stress-test resource constraints · Assess plan resilience
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('ai-engine')}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer self-start"
        >
          View Active AI Engine
        </button>
      </div>

      {/* Preset Inject Chips */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4">
        <span className="text-xs font-mono text-slate-400 font-semibold uppercase block mb-2.5">
          Tactical Contingency Presets (Quick Inject):
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset({ aircraft: 75, crew: 90, weather: 'RESTRICTED', airspace: 'LIMITED', priority: 'HIGH' })}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded font-mono transition-colors cursor-pointer hover:border-cyan-500/50"
          >
            ⚡ Severe Storm in Sector B + Contested Corridors
          </button>
          <button
            onClick={() => applyPreset({ aircraft: 60, crew: 75, weather: 'MODERATE', airspace: 'LIMITED', priority: 'CRITICAL' })}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded font-mono transition-colors cursor-pointer hover:border-cyan-500/50"
          >
            ⚡ Base-B Runway Interdiction (High Attrition)
          </button>
          <button
            onClick={() => applyPreset({ aircraft: 95, crew: 95, weather: 'CLEAR', airspace: 'AVAILABLE', priority: 'CRITICAL' })}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded font-mono transition-colors cursor-pointer hover:border-cyan-500/50"
          >
            ⚡ Maximum Force Surge: 100% Defense Perimeter
          </button>
          <button
            onClick={() => applyPreset({ aircraft: 70, crew: 65, weather: 'CLEAR', airspace: 'AVAILABLE', priority: 'MEDIUM' })}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded font-mono transition-colors cursor-pointer hover:border-cyan-500/50"
          >
            ⚡ Fuel Depot Disruption & Severe Crew Fatigue
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Scenario Parameters
            </h2>
            <Sliders className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Aircraft Availability Slider */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Aircraft Availability</span>
              <span className="text-cyan-400 font-bold tabular-nums text-sm">{aircraftPct}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={aircraftPct}
              onChange={(e) => setAircraftPct(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>40% (Degraded)</span>
              <span>100% (Full Readiness)</span>
            </div>
          </div>

          {/* Crew Availability Slider */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Crew Availability</span>
              <span className="text-emerald-400 font-bold tabular-nums text-sm">{crewPct}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={crewPct}
              onChange={(e) => setCrewPct(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>40% (Fatigued)</span>
              <span>100% (Full Roster)</span>
            </div>
          </div>

          {/* Weather Dropdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-300 font-medium block">
              Weather Condition
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value as WeatherState)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="CLEAR">Clear (Nominal VMC)</option>
              <option value="MODERATE">Moderate (Isolated Clouds & Crosswinds)</option>
              <option value="RESTRICTED">Restricted (Convective Storm Front)</option>
            </select>
          </div>

          {/* Airspace Dropdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-300 font-medium block">
              Airspace Contestation
            </label>
            <select
              value={airspace}
              onChange={(e) => setAirspace(e.target.value as AirspaceState)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="AVAILABLE">Available (Unrestricted Tactical Corridors)</option>
              <option value="LIMITED">Limited (Congested / Partial Standoff)</option>
              <option value="RESTRICTED">Restricted (Hostile SAM Radar Envelopes Active)</option>
            </select>
          </div>

          {/* Mission Priority Dropdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-300 font-medium block">
              Mission Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
            >
              <option value="ROUTINE">Routine Surveillance</option>
              <option value="MEDIUM">Medium Defensive Alert</option>
              <option value="HIGH">High Priority Standoff</option>
              <option value="CRITICAL">Critical Scramble Force Projection</option>
            </select>
          </div>

          {/* RUN SCENARIO BUTTON (Exact specification from user prompt) */}
          <div className="pt-2">
            <button
              onClick={handleRun}
              disabled={isSimulating}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
            >
              <Play className={`w-4 h-4 fill-white ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Computing Allocation Model...' : 'RUN SCENARIO'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Scenario Result Comparison (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                  Scenario Result & Comparative Analysis
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Side-by-side trade-off analysis between current baseline and simulated contingency
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">OPTIMISATION ENGINE</span>
            </div>

            {whatIfResult ? (
              <div className="space-y-5">
                {/* Side-by-side Cards: CURRENT PLAN vs SIMULATED PLAN (Exact format from user prompt) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {/* CURRENT PLAN */}
                  <div className="p-4 bg-slate-950/80 rounded border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 font-bold uppercase">
                      <span>CURRENT PLAN</span>
                      <span className="text-[10px] text-slate-500">BASELINE</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Resources:</span>
                        <span className="font-bold text-slate-200">
                          {whatIfResult.currentPlanSummary.resourcesPct}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Planning Status:</span>
                        <span className="text-emerald-400 font-bold">
                          {whatIfResult.currentPlanSummary.planningStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Constraints:</span>
                        <span className="font-bold text-slate-200">
                          {whatIfResult.currentPlanSummary.constraintsCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sortie Coverage:</span>
                        <span className="font-bold text-cyan-400">
                          {whatIfResult.currentPlanSummary.sortieCoverage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SIMULATED PLAN */}
                  <div className="p-4 bg-cyan-950/20 rounded border border-cyan-800/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-800/60 text-cyan-300 font-bold uppercase">
                      <span>SIMULATED PLAN</span>
                      <span className="text-[10px] text-cyan-400 font-semibold">RE-OPTIMISED</span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Resources:</span>
                        <span className="font-bold text-indigo-300">
                          {whatIfResult.simulatedPlanSummary.resourcesPct}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Planning Status:</span>
                        <span className="text-cyan-400 font-bold">
                          {whatIfResult.simulatedPlanSummary.planningStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Constraints:</span>
                        <span className="font-bold text-amber-400">
                          {whatIfResult.simulatedPlanSummary.constraintsCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sortie Coverage:</span>
                        <span className="font-bold text-emerald-400">
                          {whatIfResult.simulatedPlanSummary.sortieCoverage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytical Delta Callout */}
                <div className="p-3.5 bg-slate-950/70 rounded border border-slate-800 font-mono text-xs">
                  <span className="text-cyan-400 font-bold block mb-1 uppercase text-[11px]">
                    SIMULATION ANALYSIS & DELTA:
                  </span>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    {whatIfResult.recommendedDelta}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Algorithm Confidence: <strong className="text-emerald-400">{whatIfResult.simulatedPlan.confidencePct}%</strong></span>
                    <span>Action: Scramble redistribution pre-calculated</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state before running */
              <div className="py-16 text-center text-slate-400 space-y-3 font-mono text-xs">
                <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-300 font-medium">
                  Adjust sliders on the left or select a rapid contingency preset.
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Click [RUN SCENARIO] to compute an alternative resource allocation and observe trade-offs.
                </p>
              </div>
            )}
          </div>

          {/* Accept / Commit Simulated Plan Action */}
          {whatIfResult && (
            <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between font-sans">
              <span className="text-xs text-slate-400 font-mono">
                Commit simulated plan into operational live state:
              </span>
              <button
                onClick={applyWhatIfPlan}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACCEPT & COMMIT PLAN</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
