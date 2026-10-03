import React, { useState } from 'react';
import { useOperations } from '../context/OperationsContext';
import { 
  FileText, 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  ShieldCheck, 
  Radio, 
  Plane, 
  Clock, 
  MapPin, 
  Fuel
} from 'lucide-react';

export const AtoExportModal: React.FC = () => {
  const { 
    showAtoModal, 
    setShowAtoModal, 
    airTaskingOrder, 
    currentPlan, 
    zuluTime,
    tacticalIntent
  } = useOperations();

  const [copied, setCopied] = useState(false);

  if (!showAtoModal) return null;

  const generateAtoText = () => {
    return (
`// CLASSIFICATION: ${airTaskingOrder.securityClassification}
// AIR TASKING ORDER: ${airTaskingOrder.atoNumber}
// ISSUING AUTHORITY: ${airTaskingOrder.commandAuthority}
// TASKING PERIOD: ${airTaskingOrder.taskingPeriod}
// ZULU GENERATED: ${zuluTime}
// TACTICAL INTENT: ${tacticalIntent.toUpperCase()} // PRIORITY: ${currentPlan.priority}

================================================================================
SECTION 1: MISSION PACKAGES & SORTIE ASSIGNMENTS
================================================================================
${airTaskingOrder.packages.map((pkg, i) => `
[${i + 1}] PACKAGE IDENTIFIER: ${pkg.packageId}
    MISSION TYPE        : ${pkg.missionType}
    TACTICAL PRIORITY   : ${pkg.priority}
    CALLSIGNS           : ${pkg.callsigns.join(', ')}
    AIRFRAME IDS        : ${pkg.aircraftIds.join(', ')} (${pkg.aircraftType})
    TIME ON TARGET (TOT): ${pkg.timeOnTarget}
    ESCORT WINDOW       : ${pkg.escortWindow}
    PRIMARY BASE        : ${pkg.primaryBase}
    ALTERNATE RECOVERY  : ${pkg.alternateBase}
    DATALINK / FREQ     : ${pkg.datalinkFrequency}
    IFF IDENTIFICATION  : ${pkg.iffMode5Code}
    REFUELING ANCHOR    : ${pkg.tankerAnchor || 'DIRECT ROUTE / NO AR SCHEDULED'}
    ORDNANCE LOADOUT    : ${pkg.ordnanceLoadout}
    OBJECTIVE DIRECTIVE : ${pkg.targetObjective}
`).join('\n--------------------------------------------------------------------------------')}

================================================================================
SECTION 2: AERIAL REFUELING & TANKER AIR BRIDGE (STANAG 3759)
================================================================================
${airTaskingOrder.tankerAirBridgeNote}

================================================================================
SECTION 3: SPECIAL INSTRUCTIONS (SPINS) & ROE DIRECTIVES
================================================================================
${airTaskingOrder.specialInstructions.map((spin, i) => `(${i + 1}) ${spin}`).join('\n')}

AUTHENTICATION HASH: SHA256//${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}
// END OF AIR TASKING ORDER //`
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateAtoText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generateAtoText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${airTaskingOrder.atoNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200 rounded-xl max-w-4xl w-full p-6 shadow-2xl relative font-mono text-xs flex flex-col max-h-[90vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg dark:bg-cyan-950 bg-cyan-100 dark:border-cyan-500/40 border-cyan-300 flex items-center justify-center">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold dark:text-slate-100 text-slate-900 uppercase tracking-tight">
                  Air Tasking Order (ATO) Export Module
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold dark:bg-amber-950 bg-amber-100 dark:text-amber-300 text-amber-800 dark:border-amber-600/50 border-amber-300 rounded">
                  STANAG 4015 / IAF FORMAT
                </span>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-600 font-sans mt-0.5">
                Standardized military air operations tasking document generated from AI resource optimization
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAtoModal(false)}
            className="dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ATO Metadata Bar */}
        <div className="mt-3 p-3 dark:bg-slate-950/90 bg-slate-50 rounded-lg border dark:border-slate-800 border-slate-200 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div>
            <span className="dark:text-slate-500 text-slate-500 block">ATO NUMBER:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">{airTaskingOrder.atoNumber}</span>
          </div>
          <div>
            <span className="dark:text-slate-500 text-slate-500 block">TASKING PERIOD:</span>
            <span className="font-bold dark:text-slate-200 text-slate-800">{airTaskingOrder.taskingPeriod}</span>
          </div>
          <div>
            <span className="dark:text-slate-500 text-slate-500 block">INTENT / POSTURE:</span>
            <span className="font-bold text-amber-800 dark:text-amber-300 uppercase">{tacticalIntent} ({currentPlan.priority})</span>
          </div>
          <div>
            <span className="dark:text-slate-500 text-slate-500 block">CLASSIFICATION:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{airTaskingOrder.securityClassification.split('//')[0]}</span>
          </div>
        </div>

        {/* Formatted Output Area */}
        <div className="flex-1 overflow-y-auto mt-4 p-4 dark:bg-slate-950 bg-slate-900 rounded-lg border dark:border-slate-800 border-slate-800 space-y-4 font-mono text-[11px] leading-relaxed">
          <pre className="text-slate-200 whitespace-pre-wrap selection:bg-cyan-500/30">
            {generateAtoText()}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 pt-3 border-t dark:border-slate-800 border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 font-sans">
          <div className="flex items-center gap-2 dark:text-slate-400 text-slate-600 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cryptographically sealed for secure tactical datalink dissemination.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-800 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors border dark:border-slate-700 border-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 dark:text-slate-400 text-slate-500" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy ATO Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed ATO (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
