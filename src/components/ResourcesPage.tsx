import React from 'react';
import { 
  Plane, 
  Users, 
  Layers, 
  Compass, 
  Crosshair, 
  Fuel, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useOperations } from '../context/OperationsContext';

export const ResourcesPage: React.FC = () => {
  const { 
    setShowMunitionsModal, 
    setShowTankerModal, 
    munitionsBottleneckWarning,
    theme
  } = useOperations();

  // Last 6 simulated planning cycles data for clean Recharts trend
  const cycleTrendData = [
    { cycle: 'Cycle -5', aircraft: 88, crew: 90, support: 84, airspace: 74 },
    { cycle: 'Cycle -4', aircraft: 86, crew: 88, support: 82, airspace: 70 },
    { cycle: 'Cycle -3', aircraft: 84, crew: 87, support: 80, airspace: 68 },
    { cycle: 'Cycle -2', aircraft: 85, crew: 89, support: 83, airspace: 72 },
    { cycle: 'Cycle -1', aircraft: 83, crew: 86, support: 82, airspace: 69 },
    { cycle: 'Current',   aircraft: 82, crew: 87, support: 81, airspace: 68 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Resource Availability
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            &ldquo;Current simulated resource readiness.&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowMunitionsModal(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              munitionsBottleneckWarning
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Munitions Stockpile</span>
          </button>

          <button
            onClick={() => setShowTankerModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Fuel className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Tanker Air Bridge</span>
          </button>
        </div>
      </div>

      {/* 4 Large Resource Cards with Elegant Horizontal Progress Bars (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Aircraft */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-500">
            <span>AIRCRAFT</span>
            <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              82%
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Operational
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700" 
              style={{ width: '82%' }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">18 / 24 airframes mission-capable</p>
        </div>

        {/* Card 2: Crew */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-500">
            <span>CREW</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              87%
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              High Readiness
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-700" 
              style={{ width: '87%' }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">104 / 120 pilots &amp; controllers ready</p>
        </div>

        {/* Card 3: Support */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-500">
            <span>SUPPORT</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              81%
            </span>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
              Sufficient
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-700" 
              style={{ width: '81%' }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Turnaround, fuel &amp; PGM load crews</p>
        </div>

        {/* Card 4: Airspace */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-500">
            <span>AIRSPACE</span>
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              68%
            </span>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
              Regulated
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-700" 
              style={{ width: '68%' }} 
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Corridors cleared across sectors</p>
        </div>
      </div>

      {/* RESOURCE TREND (Section 14 clean Recharts line chart) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              RESOURCE TREND
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Readiness index progression across the last 6 simulated planning cycles.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last synchronized 2 minutes ago
          </span>
        </div>

        {/* Clean Line Chart */}
        <div className="h-64 sm:h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cycleTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme === 'dark' ? '#1E293B' : '#F1F5F9'} 
              />
              <XAxis 
                dataKey="cycle" 
                tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                axisLine={{ stroke: theme === 'dark' ? '#334155' : '#E2E8F0' }}
              />
              <YAxis 
                domain={[50, 100]}
                tick={{ fontSize: 11, fill: theme === 'dark' ? '#94A3B8' : '#64748B' }}
                axisLine={{ stroke: theme === 'dark' ? '#334155' : '#E2E8F0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="aircraft" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} name="Aircraft %" />
              <Line type="monotone" dataKey="crew" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4 }} name="Crew %" />
              <Line type="monotone" dataKey="support" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} name="Support %" />
              <Line type="monotone" dataKey="airspace" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Airspace %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-center text-xs text-slate-400 font-mono">
          Last synchronized 2 minutes ago
        </div>
      </div>

      {/* RESOURCE PRESSURE (Section 15 status badges) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Resource Pressure
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Real-time constraint pressure assessment for operational allocation.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
            <span className="text-xs font-mono uppercase text-slate-500">Aircraft</span>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              LOW
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Buffer available</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
            <span className="text-xs font-mono uppercase text-slate-500">Crew</span>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              LOW
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Rest rotation normal</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
            <span className="text-xs font-mono uppercase text-slate-500">Airspace</span>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              MEDIUM
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Sector B reroutes</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
            <span className="text-xs font-mono uppercase text-slate-500">Support</span>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              MEDIUM
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Turnaround capacity</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-mono uppercase text-blue-700 dark:text-blue-300 font-bold">Overall</span>
            <div className="mt-2 inline-block px-3.5 py-1 rounded-full text-xs font-bold font-mono bg-blue-600 text-white shadow-xs">
              MEDIUM
            </div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-2 font-mono">Balanced posture</p>
          </div>
        </div>
      </div>
    </div>
  );
};
