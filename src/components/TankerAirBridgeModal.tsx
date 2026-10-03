import React from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  Fuel, 
  X, 
  Plane, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const TankerAirBridgeModal: React.FC = () => {
  const { 
    showTankerModal, 
    setShowTankerModal, 
    tankerBridge, 
    aircraft,
    setActiveScreen
  } = useOperations();

  if (!showTankerModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200 rounded-xl max-w-3xl w-full p-6 shadow-2xl relative font-mono text-xs flex flex-col max-h-[90vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg dark:bg-teal-950 bg-teal-100 dark:border-teal-500/40 border-teal-300 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold dark:text-slate-100 text-slate-900 uppercase tracking-tight">
                  Aerial Refueling & Tanker "Air Bridge" Calculator
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold dark:bg-teal-950 bg-teal-100 dark:text-teal-300 text-teal-800 dark:border-teal-700/60 border-teal-300 rounded">
                  AAR ALLOCATION MODULE
                </span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 font-sans mt-0.5">
                Dynamic air bridge orbit generation · Deep-strike endurance multiplier · Fuel transfer telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTankerModal(false)}
            className="dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tanker Status Telemetry Card */}
        <div className="mt-4 p-4 dark:bg-slate-950 bg-slate-50 rounded-lg border dark:border-slate-800 border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b dark:border-slate-800/80 border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                  {tankerBridge.callsign} ({tankerBridge.tankerId})
                </span>
                <span className="px-2 py-0.5 text-[10px] dark:bg-emerald-950 bg-emerald-100 dark:text-emerald-300 text-emerald-800 dark:border-emerald-700/60 border-emerald-300 rounded font-bold">
                  ● {tankerBridge.status}
                </span>
              </div>
              <span className="text-[11px] dark:text-slate-400 text-slate-600 font-sans">{tankerBridge.platform}</span>
            </div>

            <div className="text-right font-mono">
              <span className="dark:text-slate-400 text-slate-500 text-[10px] block">AIR REFUELING TRACK (ART):</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-300 text-xs">{tankerBridge.trackName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="dark:bg-slate-900/80 bg-white p-2.5 rounded border dark:border-slate-800 border-slate-200 shadow-sm">
              <span className="dark:text-slate-500 text-slate-500 text-[10px] block">Available Offload</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {tankerBridge.offloadFuelTons} Tons
              </span>
            </div>
            <div className="dark:bg-slate-900/80 bg-white p-2.5 rounded border dark:border-slate-800 border-slate-200 shadow-sm">
              <span className="dark:text-slate-500 text-slate-500 text-[10px] block">Offload Rate</span>
              <span className="text-base font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                {tankerBridge.offloadRateKgMin} kg/min
              </span>
            </div>
            <div className="dark:bg-slate-900/80 bg-white p-2.5 rounded border dark:border-slate-800 border-slate-200 shadow-sm">
              <span className="dark:text-slate-500 text-slate-500 text-[10px] block">Loiter Extension</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-300 tabular-nums">
                +{tankerBridge.loiterExtensionMinutes} mins
              </span>
            </div>
            <div className="dark:bg-slate-900/80 bg-white p-2.5 rounded border dark:border-slate-800 border-slate-200 shadow-sm">
              <span className="dark:text-slate-500 text-slate-500 text-[10px] block">Altitude Block</span>
              <span className="text-xs font-bold dark:text-slate-200 text-slate-800 mt-1 block">
                {tankerBridge.altitudeBlock}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Strike Assets / Receivers */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-3">
          <div className="text-xs font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Synchronized Fuel Receiver Queue (Deep Strike Assets)</span>
            <span className="dark:text-slate-500 text-slate-500 font-normal">STANAG 3759 Boom & Drogue Compatible</span>
          </div>

          <div className="space-y-2">
            {tankerBridge.receiverCallsigns.map((rcv, i) => {
              const matchedAc = aircraft.find(a => a.callsign === rcv);
              return (
                <div 
                  key={rcv}
                  className="p-3 dark:bg-slate-950/70 bg-slate-50 rounded-lg border dark:border-slate-800 border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded dark:bg-slate-900 bg-teal-100 dark:border-slate-700 border-teal-300 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold dark:text-slate-100 text-slate-900">{rcv}</span>
                        {matchedAc && (
                          <span className="text-[10px] dark:text-slate-400 text-slate-500">({matchedAc.id} · {matchedAc.type})</span>
                        )}
                      </div>
                      <span className="text-[10px] dark:text-slate-500 text-slate-500 block">
                        Rendezvous Time: 11:20:00 Z + {i * 12} mins · Planned Fuel Transfer: 6,200 lbs
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 text-[10px] font-bold dark:bg-teal-950 bg-teal-100 dark:text-teal-300 text-teal-800 dark:border-teal-800/60 border-teal-300 rounded">
                      SCHEDULED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Range Impact Notice */}
          <div className="p-3.5 dark:bg-teal-950/20 bg-teal-50/70 border dark:border-teal-700/40 border-teal-200 rounded-lg dark:text-slate-300 text-slate-800 text-[11px] font-sans leading-relaxed">
            <span className="font-mono font-bold text-teal-700 dark:text-teal-300 uppercase block mb-1">
              Combat Radius Multiplier Breakdown:
            </span>
            <p>
              Without aerial refueling, frontline multi-role aircraft operate with an <strong>Unrefueled Tactical Radius of ~450 NM</strong> (red dashed envelope). By staging PEGASUS-01 at Anchor Alpha, the <strong>Refueled Combat Radius extends to 850+ NM</strong> (green solid envelope), enabling deep penetration strikes beyond contested radar horizons with 115 minutes of reserve loiter time.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-3 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0 font-sans">
          <button
            onClick={() => {
              setShowTankerModal(false);
              setActiveScreen('map');
            }}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            Inspect Range Envelopes on Tactical Map →
          </button>

          <button
            onClick={() => setShowTankerModal(false)}
            className="px-4 py-1.5 dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-800 rounded text-xs font-semibold cursor-pointer border dark:border-slate-700 border-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
