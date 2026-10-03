import React from 'react';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Cpu, 
  Sliders, 
  History, 
  RefreshCw 
} from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({ isOpen, onClose }) => {
  const { 
    demoTourStep, 
    nextDemoTourStep, 
    prevDemoTourStep, 
    setActiveScreen,
    simulateOperationalChange,
    recalculatePlan
  } = useOperations();

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Step 1: Overview',
      subtitle: 'Unified operational data.',
      description: 'View fused operational intelligence across airframes, pilot crews, precision weapon stockpiles, weather and airspace in one common operating picture.',
      screen: 'overview',
      actionLabel: 'Go to AI Analysis',
      action: () => setActiveScreen('ai-analysis')
    },
    {
      step: 2,
      title: 'Step 2: AI Analysis',
      subtitle: 'Analyse simulated conditions.',
      description: 'Explore the input telemetry conditions (aircraft availability, crew readiness, capacity, weather, airspace) and run the transparent constraint-solver.',
      screen: 'ai-analysis',
      actionLabel: 'Inspect Constraints',
      action: () => {}
    },
    {
      step: 3,
      title: 'Step 3: Recommendation',
      subtitle: 'Explainable AI-assisted recommendation.',
      description: 'Inspect the generated decision recommendation, examine factor influence weights (weather, crew, airspace), and trace the 5-step decision reasoning process.',
      screen: 'ai-analysis',
      actionLabel: 'Simulate Shock',
      action: () => {}
    },
    {
      step: 4,
      title: 'Step 4: Simulate Change',
      subtitle: 'Conditions changed.',
      description: 'Trigger dynamic operational turbulence — simulated squalls in Sector B reduce airspace and maintenance delays ground 3 fighters.',
      screen: 'ai-analysis',
      actionLabel: 'Trigger Shift',
      action: () => simulateOperationalChange()
    },
    {
      step: 5,
      title: 'Step 5: Re-optimise',
      subtitle: 'Generate updated plan.',
      description: 'Execute the sub-second re-planning algorithm to dynamically re-vector strike corridors and establish tanker refueling tracks.',
      screen: 'ai-analysis',
      actionLabel: 'Execute Re-Optimisation',
      action: () => recalculatePlan()
    },
    {
      step: 6,
      title: 'Step 6: Scenario',
      subtitle: 'Test a different situation.',
      description: 'Use the What-If stress-tester to manipulate sliders and test custom contingencies, reviewing live trade-offs against baseline posture.',
      screen: 'scenario',
      actionLabel: 'Open What-If',
      action: () => setActiveScreen('scenario')
    },
    {
      step: 7,
      title: 'Step 7: History',
      subtitle: 'View decision record.',
      description: 'Audit every simulated iteration and decision rationale in an immutable timeline format designed for commander review.',
      screen: 'history',
      actionLabel: 'View Audit Record',
      action: () => setActiveScreen('history')
    },
  ];

  const current = steps[demoTourStep - 1] || steps[0];

  const handleNext = () => {
    current.action();
    if (demoTourStep < steps.length) {
      nextDemoTourStep();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4">
      <div className="bg-white dark:bg-[#111827] border border-blue-200 dark:border-blue-900/80 rounded-2xl shadow-2xl p-5 relative font-sans text-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              SIH Guided Walkthrough
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              {demoTourStep} of {steps.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Exit Demo Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${(demoTourStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mt-3.5 space-y-1.5">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {current.title}
          </h4>
          <p className="text-xs font-mono font-semibold text-blue-600 dark:text-cyan-400">
            &ldquo;{current.subtitle}&rdquo;
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
            {current.description}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium text-xs cursor-pointer"
          >
            EXIT DEMO
          </button>

          <div className="flex items-center gap-2">
            {demoTourStep > 1 && (
              <button
                onClick={prevDemoTourStep}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Previous Step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{demoTourStep === steps.length ? 'FINISH TOUR' : 'NEXT'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
