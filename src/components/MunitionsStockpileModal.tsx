import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  Crosshair, 
  X, 
  AlertTriangle, 
  ArrowRightLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Package, 
  Layers,
  Fuel,
  Info
} from 'lucide-react';

export const MunitionsStockpileModal: React.FC = () => {
  const { 
    showMunitionsModal, 
    setShowMunitionsModal, 
    munitionsStockpile, 
    transferMunition,
    munitionsBottleneckWarning,
    dismissBottleneckWarning
  } = useOperations();

  const [selectedBaseId, setSelectedBaseId] = useState<string>('BASE-A');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Air-to-Air' | 'Air-to-Ground'>('All');

  if (!showMunitionsModal) return null;

  const currentBaseStock = munitionsStockpile.find(b => b.baseId === selectedBaseId) || munitionsStockpile[0];

  const filteredMunitions = currentBaseStock.munitions.filter(m => {
    if (activeCategory === 'All') return true;
    return m.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200 rounded-xl max-w-4xl w-full p-6 shadow-2xl relative font-mono text-xs flex flex-col max-h-[90vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg dark:bg-cyan-950 bg-cyan-100 dark:border-cyan-500/40 border-cyan-300 flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold dark:text-slate-100 text-slate-900 uppercase tracking-tight">
                  Base-Level Precision Munitions Stockpile Manager
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold dark:bg-cyan-950 bg-cyan-100 dark:text-cyan-300 text-cyan-800 dark:border-cyan-700/60 border-cyan-300 rounded">
                  PGM LIVE INVENTORY
                </span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 font-sans mt-0.5">
                Multi-base tracking of scarce airpower ordinance: BVRAAMs, Standoff Cruise Missiles, Glide Bombs, & Anti-Radiation Missiles
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMunitionsModal(false)}
            className="dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Out-of-Stock Alerting Banner (Key prompt requirement) */}
        {munitionsBottleneckWarning && (
          <div className="mt-4 p-3.5 dark:bg-rose-950/70 bg-rose-50 dark:border-rose-600/80 border-rose-300 rounded-lg dark:text-rose-200 text-rose-800 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-300 uppercase block tracking-wide">
                  LOGISTICS BOTTLENECK — MUNITIONS OVERRIDE REQUIRED
                </span>
                <p className="text-[11px] font-sans text-rose-800 dark:text-rose-200 mt-0.5 leading-relaxed">
                  {munitionsBottleneckWarning} Base-A has <strong>0 Anti-Radiation Missiles (RUDRAM)</strong>. Planned SEAD sortie cannot launch without neutralizing contested SAM radars.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                transferMunition('BASE-B', 'BASE-A', 'RUDRAM Anti-Radiation Missile (NGARM)', 6);
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded font-sans cursor-pointer whitespace-nowrap self-start sm:self-center transition-colors shadow flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Airlift 6x RUDRAM from Base-B to Base-A</span>
            </button>
          </div>
        )}

        {/* Filter Controls: Airbase Selector & Category Tabs */}
        <div className="mt-4 pb-3 border-b dark:border-slate-800 border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Base Tabs */}
          <div className="flex items-center gap-1 p-1 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200 rounded-lg">
            {munitionsStockpile.map(base => {
              const hasShortage = base.munitions.some(m => m.isShortage);
              const isActive = base.baseId === selectedBaseId;
              return (
                <button
                  key={base.baseId}
                  onClick={() => setSelectedBaseId(base.baseId)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                      : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{base.baseName.split(' ')[0]}</span>
                  {hasShortage && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200 rounded-lg">
            {(['All', 'Air-to-Air', 'Air-to-Ground'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activeCategory === cat 
                    ? 'dark:bg-slate-800 bg-white text-cyan-600 dark:text-cyan-300 font-semibold shadow-sm' 
                    : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Munitions Table / List */}
        <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMunitions.map(item => {
              const stockPct = Math.round((item.stockCount / item.maxCapacity) * 100);
              const isCrit = item.stockCount === 0;
              const isWarning = item.stockCount <= item.minThreshold && !isCrit;

              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isCrit 
                      ? 'dark:bg-rose-950/30 bg-rose-50/70 border-rose-400 dark:border-rose-600/70 shadow-sm' 
                      : isWarning
                      ? 'dark:bg-amber-950/20 bg-amber-50/70 border-amber-400 dark:border-amber-600/60'
                      : 'dark:bg-slate-950/70 bg-slate-50 dark:border-slate-800/80 border-slate-200 dark:hover:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b dark:border-slate-800/60 border-slate-200 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold dark:text-slate-100 text-slate-900 text-xs">
                          {item.name}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase ${
                          item.category === 'Air-to-Air' 
                            ? 'dark:bg-cyan-950 bg-cyan-100 dark:text-cyan-300 text-cyan-800 dark:border-cyan-800/60 border-cyan-300' 
                            : 'dark:bg-indigo-950 bg-indigo-100 dark:text-indigo-300 text-indigo-800 dark:border-indigo-800/60 border-indigo-300'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-bold tabular-nums ${
                        isCrit ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {item.stockCount} / {item.maxCapacity}
                      </span>
                      <span className="text-[10px] dark:text-slate-500 text-slate-500 block">Units in Bunker</span>
                    </div>
                  </div>

                  {/* Stock progress meter */}
                  <div className="my-2">
                    <div className="w-full dark:bg-slate-900 bg-slate-200 rounded-full h-1.5 overflow-hidden border dark:border-slate-800 border-slate-300">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isCrit ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(4, stockPct)}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] dark:text-slate-400 text-slate-600 font-sans leading-tight">
                    {item.unitDescription}
                  </p>

                  <div className="mt-2 pt-2 border-t dark:border-slate-800/50 border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="dark:text-slate-500 text-slate-500">
                      Cleared on: <strong className="dark:text-slate-300 text-slate-800">{item.compatiblePlatforms.join(', ')}</strong>
                    </span>

                    {/* Stock transfer action if low */}
                    {isCrit && selectedBaseId === 'BASE-A' && (
                      <button
                        onClick={() => transferMunition('BASE-B', 'BASE-A', item.name, 4)}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-sans rounded cursor-pointer shadow-sm"
                      >
                        Airlift Transfer (+4)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2 dark:text-slate-400 text-slate-600 font-mono text-[11px]">
            <Info className="w-3.5 h-3.5 text-cyan-500" />
            <span>Automated replenishment link synced with Air Force Central Ordnance Depot (COD).</span>
          </div>

          <button
            onClick={() => setShowMunitionsModal(false)}
            className="px-4 py-1.5 dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-800 rounded text-xs font-semibold cursor-pointer border dark:border-slate-700 border-slate-300 transition-colors"
          >
            Close Stockpile Manager
          </button>
        </div>
      </div>
    </div>
  );
};
