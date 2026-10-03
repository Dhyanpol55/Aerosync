import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { CrewMember } from '../types/operations';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Clock, 
  Award, 
  HeartPulse, 
  RotateCw,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const CrewManagement: React.FC = () => {
  const { crew, reassignCrew } = useOperations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ready' | 'Standby' | 'Unavailable'>('all');
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);

  const totalCrew = 120;
  const readyCrew = 104;
  const standbyCrew = 10;
  const unavailableCrew = 6;

  const filteredCrew = crew.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.baseLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Crew Readiness & Aircrew Fatigue Tracking
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic crew qualification matching · Flight hour limits · Rest cycle compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded">
            FATIGUE REGULATION: STANAG / IAF MANDATORY COMPLIANT
          </span>
        </div>
      </div>

      {/* Top Metric Cards (Exact specifications from user prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL CREW */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span>TOTAL CREW</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 font-mono tabular-nums">
              {totalCrew}
            </span>
            <span className="text-xs text-slate-400">Aircrew Pool</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Fast-jet pilots, WSOs, and mission commanders
          </span>
        </div>

        {/* READY */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-medium uppercase tracking-wider">
            <span>READY</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
              {readyCrew}
            </span>
            <span className="text-xs text-emerald-400/80">87% Active</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Immediate scramble readiness (Rest &gt; 12h)
          </span>
        </div>

        {/* STANDBY */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-amber-400 font-medium uppercase tracking-wider">
            <span>STANDBY</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400 font-mono tabular-nums">
              {standbyCrew}
            </span>
            <span className="text-xs text-amber-400/80">Quick Reaction</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Reserve scramble line (Rest 6-12h)
          </span>
        </div>

        {/* UNAVAILABLE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span>UNAVAILABLE</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-300 font-mono tabular-nums">
              {unavailableCrew}
            </span>
            <span className="text-xs text-slate-400">Rest / Recert</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono">
            Fatigue duty pause & simulator check flights
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Crew ID, Name, Role, Base..."
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
          {(['all', 'Ready', 'Standby', 'Unavailable'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st 
                  ? 'bg-cyan-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Personnel' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Crew Table (Exact format required by user prompt) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Crew ID</th>
                <th className="py-3 px-4 font-semibold">Officer / Rank</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Availability</th>
                <th className="py-3 px-4 font-semibold">Assignment</th>
                <th className="py-3 px-4 font-semibold">30D Flight Hours</th>
                <th className="py-3 px-4 font-semibold">Base Location</th>
                <th className="py-3 px-4 font-semibold text-right">Roster Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCrew.map((c) => (
                <tr 
                  key={c.id}
                  onClick={() => setSelectedCrew(c)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-bold text-cyan-400 group-hover:text-cyan-300">
                    {c.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    <div>{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.rank}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {c.role}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded ${
                      c.status === 'Ready' 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' 
                        : c.status === 'Standby'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.status === 'Ready' ? 'bg-emerald-400' : c.status === 'Standby' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={c.availability === 'Available' ? 'text-emerald-400' : 'text-slate-400'}>
                      {c.availability}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {c.assignment}
                  </td>
                  <td className="py-3 px-4 tabular-nums">
                    <div className="flex items-center gap-2">
                      <span className={c.flightHours30D > 32 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {c.flightHours30D}h
                      </span>
                      <span className="text-[10px] text-slate-500">/ 35h cap</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {c.baseLocation}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reassignCrew(c.id, c.assignment.includes('CAP') ? 'QRA Reserve Standby' : 'A-01 (Combat Air Patrol)');
                        alert(`Crew ${c.id} assignment updated.`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-sans font-medium text-slate-300 bg-slate-800 hover:bg-cyan-900 hover:text-cyan-200 border border-slate-700 rounded transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {c.availability === 'Available' ? 'Assign Platform' : 'Rotate Roster'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crew Detail Drawer / Flyout */}
      {selectedCrew && (
        <div className="p-4 bg-slate-900 border border-cyan-500/50 rounded-lg text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold text-sm">{selectedCrew.id}</span>
              <span className="text-slate-300 font-semibold">{selectedCrew.name}</span>
              <span className="text-slate-500">({selectedCrew.rank})</span>
            </div>
            <div className="text-slate-400 flex flex-wrap items-center gap-3">
              <span>Qualifications: <strong className="text-slate-200">{selectedCrew.qualifications.join(' · ')}</strong></span>
              <span>·</span>
              <span>Rest Margin: <strong className="text-emerald-400">{selectedCrew.restHoursRemaining} hours</strong></span>
              <span>·</span>
              <span>Current Sortie: <strong className="text-cyan-300">{selectedCrew.assignment}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCrew(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-sans cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                reassignCrew(selectedCrew.id, 'Combat Air Patrol Sector A Lead');
                alert(`Aircrew ${selectedCrew.id} assigned to high priority sortie.`);
                setSelectedCrew(null);
              }}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-sans font-semibold cursor-pointer shadow"
            >
              Confirm Tasking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
