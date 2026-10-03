import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  Activity, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Compass,
  CheckCircle2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

interface LandingPageProps {
  onEnterDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDemo }) => {
  const { userRole, setUserRole, theme, toggleTheme } = useOperations();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Planner' | 'Analyst' | 'Viewer'>(userRole);

  const handleRoleLogin = () => {
    setUserRole(selectedRole);
    setShowLoginModal(false);
    onEnterDemo();
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#F7F9FC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-300">
      {/* Subtle abstract aerospace/AI background grid */}
      <div className="absolute inset-0 tactical-grid pointer-events-none opacity-40 dark:opacity-20" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-mono font-black text-lg shadow-sm shadow-blue-500/20">
            A
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider font-mono uppercase dark:text-white text-slate-900">
              AEROSYNC
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              SIH26250
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium cursor-pointer transition-colors shadow-sm"
          >
            {theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            SYSTEM LOGIN
          </button>
        </div>
      </header>

      {/* Hero Center Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          Smart India Hackathon 2026 Prototype
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight dark:text-white text-slate-950 max-w-3xl">
          AEROSYNC
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-blue-600 dark:text-cyan-400 mt-2 font-mono">
          AI-Driven Dynamic Air Operations &amp; Resource Optimisation
        </p>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl leading-relaxed">
          &ldquo;Unified intelligence for dynamic resource planning.&rdquo;
        </p>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mt-1 font-mono">
          From fragmented information to adaptive decision support · Analyse. Optimise. Adapt.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <button
            onClick={onEnterDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:gap-3 group"
          >
            <span>ENTER DEMO</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>SYSTEM LOGIN</span>
          </button>
        </div>

        {/* 3 Small Feature Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm hover:border-blue-400 dark:hover:border-blue-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
              DATA FUSION
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              &ldquo;Bring fragmented operational information together.&rdquo;
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
              Fuses aircraft status, crew readiness, weapons stockpiles, weather and airspace.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
              AI ANALYSIS
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              &ldquo;Identify constraints and generate explainable recommendations.&rdquo;
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
              Transparent constraint satisfaction model with factor weighting and human review.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono">
              DYNAMIC PLANNING
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              &ldquo;Adapt when operational conditions change.&rdquo;
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
              Sub-second re-planning responding to weather diversions, maintenance, or threat shifts.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer Contract */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300">
            SIMULATION ENVIRONMENT
          </span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span>Fictional Demonstration Data Only</span>
        </div>
        <p className="text-[11px]">
          Problem Statement ID: <strong className="text-slate-700 dark:text-slate-300">SIH26250</strong> · Ministry of Defence (MoD)
        </p>
      </footer>

      {/* Role / System Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm dark:text-white text-slate-900 uppercase font-mono">
                  Operational Access Control
                </h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
              Select demonstration operational role for this session. Production deployment uses certified identity federation.
            </p>

            <div className="space-y-2 mt-4">
              {(['Planner', 'Analyst', 'Viewer'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold font-mono uppercase">{role} Role</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {role === 'Planner' && 'Full simulation control, re-optimisation & ATO export rights.'}
                      {role === 'Analyst' && 'Tactical analysis, scenario modeling & constraint auditing.'}
                      {role === 'Viewer' && 'Read-only operational status & resource dashboard view.'}
                    </div>
                  </div>
                  {selectedRole === role && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleLogin}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Authenticate &amp; Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
