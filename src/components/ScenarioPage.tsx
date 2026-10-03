import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  CloudRain, 
  Compass, 
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useOperations } from '../context/OperationsContext';

export const ScenarioPage: React.FC = () => {
  const { theme, setActiveScreen } = useOperations();

  // Controls (Section 24)
  const [aircraftAvail, setAircraftAvail] = useState<number>(70);
  const [crewReadiness, setCrewReadiness] = useState<number>(85);
  const [resourceCapacity, setResourceCapacity] = useState<number>(65);
  const [weather, setWeather] = useState<'Clear' | 'Moderate' | 'Degraded'>('Degraded');
  const [airspace, setAirspace] = useState<'Available' | 'Limited' | 'Restricted'>('Limited');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('High');

  const [hasRun, setHasRun] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunScenario = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setHasRun(true);
    setIsRunning(false);
  };

  // Comparison metrics for chart
  const comparisonData = [
    { metric: 'Aircraft %', current: 82, scenario: aircraftAvail },
    { metric: 'Crew %', current: 87, scenario: crewReadiness },
    { metric: 'Resource %', current: 76, scenario: resourceCapacity },
    { metric: 'Confidence %', current: 91, scenario: 84 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            What-If Scenario
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            &ldquo;Explore how changing conditions affect resource planning.&rdquo;
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('ai-analysis')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start"
        >
          <span>Open AI Decision Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Scenario Panel (Section 24 Controls) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Simulation Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
          {/* Slider 1: Aircraft Availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Aircraft Availability</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{aircraftAvail}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={aircraftAvail}
              onChange={(e) => setAircraftAvail(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% Critical</span>
              <span>100% Full Wing</span>
            </div>
          </div>

          {/* Slider 2: Crew Readiness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Crew Readiness</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{crewReadiness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={crewReadiness}
              onChange={(e) => setCrewReadiness(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% Depleted</span>
              <span>100% Fully Rested</span>
            </div>
          </div>

          {/* Slider 3: Resource Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Resource Capacity</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{resourceCapacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={resourceCapacity}
              onChange={(e) => setResourceCapacity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% Shortage</span>
              <span>100% Stockpiled</span>
            </div>
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          {/* Dropdown 1: Weather */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
              Weather Conditions
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="Clear">Clear (VMC)</option>
              <option value="Moderate">Moderate (Scattered Ceilings)</option>
              <option value="Degraded">Degraded (Squall Fronts / Turbulence)</option>
            </select>
          </div>

          {/* Dropdown 2: Airspace */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
              Airspace Availability
            </label>
            <select
              value={airspace}
              onChange={(e) => setAirspace(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="Available">Available (Open Corridors)</option>
              <option value="Limited">Limited (Civil Regulation)</option>
              <option value="Restricted">Restricted (No-Fly / Jammed)</option>
            </select>
          </div>

          {/* Dropdown 3: Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
              Operational Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="Low">Low (Routine Training)</option>
              <option value="Medium">Medium (Standard CAP)</option>
              <option value="High">High (Critical Surge)</option>
            </select>
          </div>
        </div>

        {/* Run Scenario Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleRunScenario}
            disabled={isRunning}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Calculating Constraints...' : 'RUN SCENARIO'}</span>
          </button>
        </div>
      </div>

      {/* Scenario Result (Section 25) */}
      {hasRun && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CURRENT Column */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <span className="text-xs font-mono uppercase font-bold text-slate-500">
                  CURRENT BASELINE
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 text-xs">
                  <span className="text-slate-500">Resource Pressure</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    Medium
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 text-xs">
                  <span className="text-slate-500">Constraint Level</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    Medium (2 active)
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-slate-500">Planning Status</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Stable
                  </span>
                </div>
              </div>
            </div>

            {/* SCENARIO Column */}
            <div className="p-6 rounded-2xl border-2 border-amber-400 dark:border-amber-600/70 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-amber-800/80 mb-4">
                <span className="text-xs font-mono uppercase font-bold text-amber-700 dark:text-amber-400">
                  SIMULATED SCENARIO
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  WHAT-IF
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-amber-200/60 dark:border-amber-800/40 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Resource Pressure</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                    High
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-amber-200/60 dark:border-amber-800/40 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Constraint Level</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    High (4 bottlenecks)
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Planning Status</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Re-optimisation Required
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Small Comparison Chart (Section 25) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Resource Allocation Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Baseline vs Simulated scenario metrics.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1E293B' : '#F1F5F9'} />
                  <XAxis 
                    dataKey="metric" 
                    tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                    axisLine={{ stroke: theme === 'dark' ? '#334155' : '#E2E8F0' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                    axisLine={{ stroke: theme === 'dark' ? '#334155' : '#E2E8F0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="current" name="Current Baseline" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="scenario" name="What-If Scenario" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PRIMARY CHANGES Tag list (Section 25) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">
              PRIMARY CHANGES DRIVING DIVERGENCE:
            </span>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5" />
                Weather: {weather}
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Airspace: {airspace}
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Resource Capacity: {resourceCapacity}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
