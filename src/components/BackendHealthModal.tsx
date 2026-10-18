import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Clock, 
  ShieldCheck, 
  X, 
  ExternalLink, 
  Cpu, 
  Terminal,
  Check
} from 'lucide-react';
import { api, getApiUrl } from '../utils/api';

interface BackendHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PingResult {
  endpoint: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  statusCode?: number;
  latencyMs?: number;
  data?: any;
  error?: string;
}

export const BackendHealthModal: React.FC<BackendHealthModalProps> = ({ isOpen, onClose }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const [healthResult, setHealthResult] = useState<PingResult | null>(null);
  const [dashboardResult, setDashboardResult] = useState<PingResult | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const backendBaseUrl = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/$/, '');

  const runDiagnostics = async () => {
    setIsTesting(true);

    // 1. Test /health
    const t0 = performance.now();
    try {
      const res = await fetch(getApiUrl('/health'));
      const latency = Math.round(performance.now() - t0);
      const data = await res.json();
      setHealthResult({
        endpoint: '/health',
        status: res.ok ? 'SUCCESS' : 'ERROR',
        statusCode: res.status,
        latencyMs: latency,
        data
      });
    } catch (err: any) {
      setHealthResult({
        endpoint: '/health',
        status: 'ERROR',
        error: err.message || 'Connection refused / offline'
      });
    }

    // 2. Test /api/dashboard
    const t1 = performance.now();
    try {
      const res = await fetch(getApiUrl('/api/dashboard'));
      const latency = Math.round(performance.now() - t1);
      const data = await res.json();
      setDashboardResult({
        endpoint: '/api/dashboard',
        status: res.ok ? 'SUCCESS' : 'ERROR',
        statusCode: res.status,
        latencyMs: latency,
        data
      });
    } catch (err: any) {
      setDashboardResult({
        endpoint: '/api/dashboard',
        status: 'ERROR',
        error: err.message || 'Connection refused / offline'
      });
    }

    setLastTestedAt(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    setIsTesting(false);
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!isOpen) return null;

  const isHealthy = healthResult?.status === 'SUCCESS';

  return (
    <div className="fixed inset-0 z-500 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isHealthy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                <span>Backend C2 Health &amp; Diagnostics</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isHealthy 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                    : 'bg-rose-950 text-rose-300 border border-rose-700'
                }`}>
                  {isTesting ? 'TESTING...' : isHealthy ? 'ONLINE (200 OK)' : 'OFFLINE / UNREACHABLE'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time API ping, response latency, and endpoint telemetry verification
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Target URL Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Active Backend Target Base URL
            </span>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-900 dark:text-slate-100 font-semibold text-xs break-all">
                {backendBaseUrl}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard(backendBaseUrl)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy URL"
            >
              {copiedUrl === backendBaseUrl ? <Check className="w-3 h-3 text-emerald-400" /> : null}
              <span>{copiedUrl === backendBaseUrl ? 'Copied' : 'Copy URL'}</span>
            </button>

            <a
              href={`${backendBaseUrl}/health`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Open /health</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Diagnostic Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {/* Health Endpoint Test */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                GET /health
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                healthResult?.status === 'SUCCESS' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {healthResult?.status || 'PENDING'} {healthResult?.statusCode ? `(${healthResult.statusCode})` : ''}
              </span>
            </div>
            
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div>Latency: <strong className="text-cyan-400">{healthResult?.latencyMs ? `${healthResult.latencyMs} ms` : '—'}</strong></div>
              <div>Service: <strong className="text-slate-200">{healthResult?.data?.service || '—'}</strong></div>
              <div>Server Uptime: <strong className="text-amber-400">{healthResult?.data?.uptimeSeconds ? `${healthResult.data.uptimeSeconds}s` : '—'}</strong></div>
            </div>
          </div>

          {/* Dashboard API Test */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                GET /api/dashboard
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                dashboardResult?.status === 'SUCCESS' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {dashboardResult?.status || 'PENDING'} {dashboardResult?.statusCode ? `(${dashboardResult.statusCode})` : ''}
              </span>
            </div>
            
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div>Latency: <strong className="text-indigo-400">{dashboardResult?.latencyMs ? `${dashboardResult.latencyMs} ms` : '—'}</strong></div>
              <div>Fleet Ready: <strong className="text-slate-200">{dashboardResult?.data?.operationalState?.aircraftAvailability?.percentage ? `${dashboardResult.data.operationalState.aircraftAvailability.percentage}%` : '—'}</strong></div>
              <div>System Status: <strong className="text-emerald-400">{dashboardResult?.data?.systemStatus || '—'}</strong></div>
            </div>
          </div>
        </div>

        {/* Deploy to Render / Railway Quick Guidance */}
        <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>How to Check on Render (`render.com`):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
            <li>Open Render Dashboard ➜ Your Service ➜ Check the green <strong>Live</strong> status badge.</li>
            <li>In Render Logs, confirm: <code className="text-blue-600 dark:text-cyan-300 font-mono text-[10px]">AirSync C2 server running at http://0.0.0.0:10000</code>.</li>
            <li>Render spins down free tier apps after 15 min idle; visiting <code className="text-blue-600 dark:text-cyan-300 font-mono text-[10px]">/health</code> wakes it up in ~35 seconds.</li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">
            {lastTestedAt ? `Last ping: ${lastTestedAt}` : 'Ready to test'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={runDiagnostics}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Pinging...' : 'Re-Test Backend Now'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
