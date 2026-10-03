import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Aircraft, 
  CrewMember, 
  Airbase, 
  SectorCondition, 
  EnvironmentalTimelinePoint, 
  OperationalPlan, 
  AlertNotice,
  WeatherState,
  AirspaceState,
  AuditLogEntry,
  BaseMunitionsStockpile,
  TankerAirBridge,
  AirTaskingOrder,
  TacticalIntent,
  ActiveIncident,
  IncidentCategory,
  DataFusionSource,
  UnifiedOperationalState,
  ReadinessPredictionSet,
  OptimisationOption,
  SystemServiceStatus
} from '../types/operations';
import { 
  playTacticalVoiceAlert, 
  setTacticalAudioMute, 
  getTacticalAudioMute 
} from '../utils/audioAlert';
import { 
  INITIAL_AIRCRAFT, 
  INITIAL_CREW, 
  INITIAL_BASES, 
  INITIAL_SECTORS, 
  INITIAL_TIMELINE, 
  INITIAL_PLAN, 
  INITIAL_ALERTS 
} from '../data/mockOperations';
import {
  INITIAL_MUNITIONS_STOCKPILE,
  INITIAL_TANKER_BRIDGE,
  INITIAL_ATO
} from '../data/munitionsData';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUDIT-INIT-01',
    timestamp: '16:15:00 IST',
    eventType: 'baseline_initial',
    title: 'Baseline Air Operations Plan (v4.1)',
    triggerReason: 'Initial operational deployment and multi-source telemetry synchronization across all wings.',
    stateSnapshot: {
      availableAircraft: 18,
      readyCrew: 104,
      resourceCapacityPct: 76,
      sortieCoveragePct: 92,
      priority: 'HIGH',
      confidencePct: 91,
      activeConstraintsCount: 2,
      weatherSummary: 'Normal VMC / Isolated Squall In South',
      airspaceSummary: 'Sector B Civil Corridor Regulated'
    },
    planSnapshot: INITIAL_PLAN
  }
];

export const INITIAL_DATA_FUSION_SOURCES: DataFusionSource[] = [
  {
    id: 'src-aircraft',
    name: '1. Aircraft Availability',
    category: 'Aircraft',
    connectionStatus: 'Connected',
    lastUpdated: '3s ago',
    lastUpdatedSeconds: 3,
    dataFreshness: 'Fresh',
    dataQuality: 'High (A+)',
    confidenceScore: 98,
    sampleValue: '18 Available / 24 Total (75%)',
    sourceType: 'telemetry'
  },
  {
    id: 'src-crew',
    name: '2. Crew Status',
    category: 'Crew',
    connectionStatus: 'Connected',
    lastUpdated: '12s ago',
    lastUpdatedSeconds: 12,
    dataFreshness: 'Fresh',
    dataQuality: 'High (A+)',
    confidenceScore: 95,
    sampleValue: '104 Ready / 120 Total (87% Rested)',
    sourceType: 'personnel'
  },
  {
    id: 'src-resources',
    name: '3. Resource / Load Status',
    category: 'Resource',
    connectionStatus: 'Connected',
    lastUpdated: '8s ago',
    lastUpdatedSeconds: 8,
    dataFreshness: 'Fresh',
    dataQuality: 'Nominal (B)',
    confidenceScore: 92,
    sampleValue: '76% Munitions & Aviation Fuel Buffer',
    sourceType: 'logistics'
  },
  {
    id: 'src-airspace',
    name: '4. Airspace',
    category: 'Airspace',
    connectionStatus: 'Connected',
    lastUpdated: '18s ago',
    lastUpdatedSeconds: 18,
    dataFreshness: 'Fresh',
    dataQuality: 'High (A+)',
    confidenceScore: 94,
    sampleValue: 'Corridors Alpha & Bravo Available (68% Open)',
    sourceType: 'civil_radar'
  },
  {
    id: 'src-weather',
    name: '5. Weather',
    category: 'Weather',
    connectionStatus: 'Connected',
    lastUpdated: '25s ago',
    lastUpdatedSeconds: 25,
    dataFreshness: 'Fresh',
    dataQuality: 'High (A+)',
    confidenceScore: 96,
    sampleValue: 'VMC Normal / Clear Ceilings Across Hubs',
    sourceType: 'meteo_sat'
  },
  {
    id: 'src-threats',
    name: '6. Threat Indicators',
    category: 'Threats',
    connectionStatus: 'Connected',
    lastUpdated: '5s ago',
    lastUpdatedSeconds: 5,
    dataFreshness: 'Fresh',
    dataQuality: 'High (A+)',
    confidenceScore: 97,
    sampleValue: 'S-400 Standoff Envelopes Logged · Low Threat',
    sourceType: 'elint'
  },
  {
    id: 'src-priorities',
    name: '7. Mission Priorities',
    category: 'Priorities',
    connectionStatus: 'Connected',
    lastUpdated: '30s ago',
    lastUpdatedSeconds: 30,
    dataFreshness: 'Fresh',
    dataQuality: 'High (A+)',
    confidenceScore: 99,
    sampleValue: 'Air Defense QRA & Escort Priority (High)',
    sourceType: 'c2_command'
  }
];

export const INITIAL_SYSTEM_SERVICES: SystemServiceStatus[] = [
  { id: 'srv-sources', name: 'Data Sources', status: 'Operational', latencyMs: 14, uptimePct: 99.9, lastHeartbeat: 'Ticking (120 Hz)' },
  { id: 'srv-fusion', name: 'Data Fusion', status: 'Operational', latencyMs: 28, uptimePct: 99.8, lastHeartbeat: 'Normalized' },
  { id: 'srv-ai', name: 'AI Analysis', status: 'Operational', latencyMs: 42, uptimePct: 99.7, lastHeartbeat: 'Model Ready' },
  { id: 'srv-opt', name: 'Optimisation Engine', status: 'Operational', latencyMs: 56, uptimePct: 99.9, lastHeartbeat: 'CP-SAT Idle' },
  { id: 'srv-db', name: 'Database', status: 'Operational', latencyMs: 8, uptimePct: 100.0, lastHeartbeat: 'Persisted' },
  { id: 'srv-api', name: 'API Server', status: 'Operational', latencyMs: 12, uptimePct: 99.9, lastHeartbeat: 'REST 200 OK' },
  { id: 'srv-ws', name: 'WebSocket Bus', status: 'Operational', latencyMs: 15, uptimePct: 99.9, lastHeartbeat: 'Connected' }
];

export const INITIAL_OPTIMISATION_OPTIONS: OptimisationOption[] = [
  {
    id: 'OPTION_A',
    title: 'Option A: Resource-balanced',
    focus: 'Balanced Readiness & Sustained Orbit Endurance',
    feasibility: 'Optimal (100%)',
    feasibilityPct: 100,
    resourceUtilisation: 74,
    readinessImpact: '+8% Fleet Readiness buffer',
    estimatedDelay: '0 min',
    constraintSatisfaction: 98,
    confidence: 96,
    tradeOffs: 'Equilibrium across all sectors; retains 4 alert-5 quick scramble airframes.',
    whyThisOption: {
      aircraftFactor: 'Utilizes 14 of 18 available airframes, keeping 4 in reserve.',
      crewFactor: 'Distributes pilot duty cycles within 8-hour fatigue thresholds.',
      resourceFactor: 'PGM expenditure rate within 76% base capacity buffer.',
      weatherFactor: 'Reroutes around moderate cloud deck in Northern pass.',
      airspaceFactor: 'Deconflicts with civil transit corridor 12-A.',
      priorityWeight: 'Priority: High (Balanced offensive/defensive stance).',
      constraintsSatisfied: [
        'Turnaround time <= 45 minutes',
        'Pilot rest cycle >= 12 hours between sorties',
        'Fuel reserve >= 25% bingo state at recovery',
        'SAM standoff margin >= 30 NM'
      ],
      majorFactors: ['Multi-role flexibility', 'Minimal delay risk', 'Steady resource consumption'],
      warnings: ['Northern squall requires 15 NM corridor detour']
    },
    humanReviewState: 'PENDING'
  },
  {
    id: 'OPTION_B',
    title: 'Option B: Readiness-focused',
    focus: 'Rapid Interception & Elevated CAP Coverage',
    feasibility: 'Highly Feasible (94%)',
    feasibilityPct: 94,
    resourceUtilisation: 86,
    readinessImpact: '+14% Combat CAP presence',
    estimatedDelay: '4 min',
    constraintSatisfaction: 94,
    confidence: 92,
    tradeOffs: 'Maximized airborne posture; increases pilot duty fatigue accrual by 12%.',
    whyThisOption: {
      aircraftFactor: 'Commits 16 airframes to active combat patrols for maximum deterrence.',
      crewFactor: 'Requires voluntary surge duty authorization for 2 flight leads.',
      resourceFactor: 'Higher tanker offload rate to sustain continuous supersonic loiter.',
      weatherFactor: 'Accepts IMC approach windows with precision radar guidance.',
      airspaceFactor: 'Requests priority military transit clearance from civil ATC.',
      priorityWeight: 'Priority: Critical (Preemptive intercept posture).',
      constraintsSatisfied: [
        'Interception response time < 5 minutes',
        'Dual-ship CAP overlapping coverage',
        'Direct datalink sensor fusion locked'
      ],
      majorFactors: ['Instant reaction capability', 'Maximum aerial surveillance', 'Higher sortie generation'],
      warnings: ['Elevates maintenance wear by 18%', 'Diminishes standby reserves to 2 airframes']
    },
    humanReviewState: 'PENDING'
  },
  {
    id: 'OPTION_C',
    title: 'Option C: Reserve-preserving',
    focus: 'Asset Conservation & Fuel Stockpile Preservation',
    feasibility: 'Highly Feasible (92%)',
    feasibilityPct: 92,
    resourceUtilisation: 62,
    readinessImpact: '+2% Reserve replenishment',
    estimatedDelay: '12 min',
    constraintSatisfaction: 96,
    confidence: 95,
    tradeOffs: 'Conserves precision standoff munitions; accepts minor civil sector queue delay.',
    whyThisOption: {
      aircraftFactor: 'Limits active airborne platforms to 10, keeping 8 airframes fully rested.',
      crewFactor: 'Maximizes pilot crew rest to 16 hours for extended campaign longevity.',
      resourceFactor: 'Strictly throttles fuel consumption to preserve depot reserves.',
      weatherFactor: 'Avoids any marginal meteorological corridors entirely.',
      airspaceFactor: 'Shares civil airways during non-peak windows.',
      priorityWeight: 'Priority: Routine / Sustained Patrol.',
      constraintsSatisfied: [
        'Zero fatigue violations',
        'Munition stockpile reserves maintained above 80%',
        'Airframe flight hour consumption below daily quota'
      ],
      majorFactors: ['Long-term endurance', 'Low operational risk', 'Preserves scarce PGMs'],
      warnings: ['Response time for emergent threats increased by ~8 minutes']
    },
    humanReviewState: 'PENDING'
  }
];

export const INITIAL_PREDICTIONS: ReadinessPredictionSet = {
  aircraftReadiness: {
    current: '18 / 24 (75%)',
    predicted: '17 / 24 (71%)',
    change: '-1 airframe (Maintenance turn)',
    confidence: 94,
    riskLevel: 'LOW'
  },
  crewReadiness: {
    current: '87% ready',
    predicted: '83% ready',
    change: '-4% (Duty shift rollover in 4h)',
    confidence: 92,
    riskLevel: 'LOW'
  },
  resourcePressure: {
    current: '32% (Nominal)',
    predicted: '38% (Elevated)',
    change: '+6% (PGM offload scheduled)',
    confidence: 89,
    riskLevel: 'MEDIUM'
  },
  delayRisk: {
    current: '8% (Low)',
    predicted: '14% (Moderate)',
    change: '+6% (Civil traffic slot compression)',
    confidence: 91,
    riskLevel: 'LOW'
  }
};

export type ScreenId = 
  | 'overview' 
  | 'data-fusion'
  | 'resources' 
  | 'ai-analysis' 
  | 'scenario' 
  | 'history' 
  | 'map' 
  | 'dashboard' 
  | 'aircraft' 
  | 'crew' 
  | 'weather' 
  | 'ai-engine' 
  | 'whatif' 
  | 'alerts';

export type UserRole = 'Planner' | 'Analyst' | 'Viewer';

export interface WhatIfParams {
  aircraftAvailabilityPct: number;
  crewAvailabilityPct: number;
  weather: WeatherState;
  airspace: AirspaceState;
  priority: 'ROUTINE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ScenarioResult {
  currentPlanSummary: {
    resourcesPct: number;
    planningStatus: string;
    constraintsCount: number;
    sortieCoverage: number;
  };
  simulatedPlanSummary: {
    resourcesPct: number;
    planningStatus: string;
    constraintsCount: number;
    sortieCoverage: number;
  };
  recommendedDelta: string;
  simulatedPlan: OperationalPlan;
}

interface OperationsContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  aircraft: Aircraft[];
  crew: CrewMember[];
  bases: Airbase[];
  sectors: SectorCondition[];
  timeline: EnvironmentalTimelinePoint[];
  currentPlan: OperationalPlan;
  previousPlan: OperationalPlan | null;
  alerts: AlertNotice[];
  selectedAircraft: Aircraft | null;
  setSelectedAircraft: (ac: Aircraft | null) => void;
  selectedBase: Airbase | null;
  setSelectedBase: (base: Airbase | null) => void;
  selectedSector: SectorCondition | null;
  setSelectedSector: (sec: SectorCondition | null) => void;
  isOptimizing: boolean;
  needsReoptimization: boolean;
  systemStatus: string;
  zuluTime: string;
  simulationIteration: number;
  whatIfResult: ScenarioResult | null;
  unreadAlertsCount: number;
  
  // Audit Log State
  auditLogs: AuditLogEntry[];
  selectedAuditLog: AuditLogEntry | null;
  setSelectedAuditLog: (entry: AuditLogEntry | null) => void;
  restoreHistoricalPlan: (entry: AuditLogEntry) => void;

  // Ordnance & Precision Munitions
  munitionsStockpile: BaseMunitionsStockpile[];
  transferMunition: (fromBaseId: string, toBaseId: string, munitionName: string, quantity: number) => void;
  munitionsBottleneckWarning: string | null;
  dismissBottleneckWarning: () => void;
  showMunitionsModal: boolean;
  setShowMunitionsModal: (show: boolean) => void;

  // Tanker Air Bridge & ATO
  tankerBridge: TankerAirBridge;
  airTaskingOrder: AirTaskingOrder;
  showAtoModal: boolean;
  setShowAtoModal: (show: boolean) => void;
  showTankerModal: boolean;
  setShowTankerModal: (show: boolean) => void;

  // Tactical Intent (Risk vs Yield Control)
  tacticalIntent: TacticalIntent;
  setTacticalIntent: (intent: TacticalIntent) => void;

  // Role and Security Access
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Landing Page vs Dashboard
  isLandingPage: boolean;
  enterDemo: () => void;
  exitToLanding: () => void;

  // Guided Walkthrough Demo Tour
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  demoTourStep: number;
  startDemoTour: () => void;
  nextDemoTourStep: () => void;
  prevDemoTourStep: () => void;
  exitDemoTour: () => void;

  // Theme (Dark / Light Mode)
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Battlefield Incidents
  activeIncident: ActiveIncident | null;
  injectIncident: (type: IncidentCategory) => Promise<void>;
  dismissIncident: () => void;

  // Tactical Audio Alerts
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  playVoiceAlert: (msg: string) => void;

  // Global Telemetry Heartbeat
  heartbeatTick: number;

  // AirSync Core Data Fusion & Optimisation Features
  dataFusionSources: DataFusionSource[];
  unifiedState: UnifiedOperationalState;
  predictions: ReadinessPredictionSet;
  optimisationOptions: OptimisationOption[];
  systemServices: SystemServiceStatus[];
  runAiAnalysis: () => Promise<void>;
  runConstraintOptimisation: () => Promise<void>;
  recordHumanReview: (optionId: 'OPTION_A' | 'OPTION_B' | 'OPTION_C', decision: 'APPROVED' | 'EDITED' | 'REJECTED', notes?: string) => void;
  triggerOneClickDemoScenario: () => Promise<void>;

  // Actions
  simulateOperationalChange: () => void;
  recalculatePlan: () => Promise<void>;
  runWhatIfScenario: (params: WhatIfParams) => void;
  applyWhatIfPlan: () => void;
  acknowledgeAlert: (id: string) => void;
  retaskAircraft: (id: string, newMission: string, newSector: string) => void;
  reassignCrew: (crewId: string, newAssignment: string) => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export const OperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [userRole, setUserRole] = useState<UserRole>('Planner');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(false);
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(1);
  const [aircraft, setAircraft] = useState<Aircraft[]>(INITIAL_AIRCRAFT);
  const [crew, setCrew] = useState<CrewMember[]>(INITIAL_CREW);
  const [bases, setBases] = useState<Airbase[]>(INITIAL_BASES);
  const [sectors, setSectors] = useState<SectorCondition[]>(INITIAL_SECTORS);
  const [timeline, setTimeline] = useState<EnvironmentalTimelinePoint[]>(INITIAL_TIMELINE);
  const [currentPlan, setCurrentPlan] = useState<OperationalPlan>(INITIAL_PLAN);
  const [previousPlan, setPreviousPlan] = useState<OperationalPlan | null>(null);
  const [alerts, setAlerts] = useState<AlertNotice[]>(INITIAL_ALERTS);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [selectedBase, setSelectedBase] = useState<Airbase | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorCondition | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [needsReoptimization, setNeedsReoptimization] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<string>('OPERATIONAL');
  const [simulationIteration, setSimulationIteration] = useState<number>(1);
  const [whatIfResult, setWhatIfResult] = useState<ScenarioResult | null>(null);
  const [zuluTime, setZuluTime] = useState<string>('16:15:00 IST');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogEntry | null>(INITIAL_AUDIT_LOGS[0]);

  // Ordnance & Precision Munitions (PGMs)
  const [munitionsStockpile, setMunitionsStockpile] = useState<BaseMunitionsStockpile[]>(INITIAL_MUNITIONS_STOCKPILE);
  const [tankerBridge, setTankerBridge] = useState<TankerAirBridge>(INITIAL_TANKER_BRIDGE);
  const [airTaskingOrder, setAirTaskingOrder] = useState<AirTaskingOrder>(INITIAL_ATO);
  const [tacticalIntent, setTacticalIntentState] = useState<TacticalIntent>('balanced');
  const [munitionsBottleneckWarning, setMunitionsBottleneckWarning] = useState<string | null>(
    "Logistics Bottleneck — Munitions Override Required: Base-A has 0 Anti-Radiation Missiles (RUDRAM) for planned SEAD flight PKG-BRAVO-02."
  );
  const [showMunitionsModal, setShowMunitionsModal] = useState<boolean>(false);
  const [showAtoModal, setShowAtoModal] = useState<boolean>(false);
  const [showTankerModal, setShowTankerModal] = useState<boolean>(false);
  const [activeIncident, setActiveIncident] = useState<ActiveIncident | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => getTacticalAudioMute());
  const [heartbeatTick, setHeartbeatTick] = useState<number>(0);

  const toggleAudioMute = () => {
    setIsAudioMuted(prev => {
      const next = !prev;
      setTacticalAudioMute(next);
      return next;
    });
  };

  const playVoiceAlert = (msg: string) => {
    playTacticalVoiceAlert(msg);
  };

  const dismissIncident = () => {
    setActiveIncident(null);
  };
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aerosync-theme');
      if (saved === 'light' || saved === 'dark') {
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return saved;
      }
    }
    return 'light'; // Light Mode is the default!
  });

  const enterDemo = () => setIsLandingPage(false);
  const exitToLanding = () => setIsLandingPage(true);

  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    setActiveScreen('overview');
  };

  const nextDemoTourStep = () => {
    setDemoTourStep(prev => Math.min(prev + 1, 7));
  };

  const prevDemoTourStep = () => {
    setDemoTourStep(prev => Math.max(prev - 1, 1));
  };

  const exitDemoTour = () => {
    setIsDemoTourActive(false);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('aerosync-theme', next);
      }
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const dismissBottleneckWarning = () => setMunitionsBottleneckWarning(null);

  const transferMunition = (fromBaseId: string, toBaseId: string, munitionName: string, quantity: number) => {
    setMunitionsStockpile(prev => {
      return prev.map(base => {
        if (base.baseId === fromBaseId) {
          return {
            ...base,
            munitions: base.munitions.map(m => {
              if (m.name === munitionName) {
                const nextStock = Math.max(0, m.stockCount - quantity);
                return {
                  ...m,
                  stockCount: nextStock,
                  isShortage: nextStock <= m.minThreshold
                };
              }
              return m;
            })
          };
        }
        if (base.baseId === toBaseId) {
          return {
            ...base,
            munitions: base.munitions.map(m => {
              if (m.name === munitionName) {
                const nextStock = m.stockCount + quantity;
                return {
                  ...m,
                  stockCount: nextStock,
                  isShortage: nextStock <= m.minThreshold
                };
              }
              return m;
            })
          };
        }
        return base;
      });
    });

    if (toBaseId === 'BASE-A' && munitionName.includes('RUDRAM')) {
      setMunitionsBottleneckWarning(null);
      setAlerts(prev => [
        {
          id: `ALT-ORD-${Date.now()}`,
          timestamp: zuluTime,
          severity: 'system',
          title: 'Munitions Logistics Bottleneck Resolved',
          message: `${quantity}x ${munitionName} airlifted from ${fromBaseId} to Base-A. SEAD mission weapon load cleared.`,
          acknowledged: false
        },
        ...prev
      ]);
    }
  };

  const setTacticalIntent = (intent: TacticalIntent) => {
    setTacticalIntentState(intent);
    setCurrentPlan(prev => {
      let coverage = prev.sortieCoveragePct;
      let confidence = prev.confidencePct;
      let priorityName = prev.priority;

      if (intent === 'conservative') {
        coverage = 88;
        confidence = 96;
        priorityName = 'MEDIUM';
      } else if (intent === 'balanced') {
        coverage = 94;
        confidence = 93;
        priorityName = 'HIGH';
      } else if (intent === 'high_risk_yield') {
        coverage = 98;
        confidence = 88;
        priorityName = 'CRITICAL';
      }

      return {
        ...prev,
        priority: priorityName,
        sortieCoveragePct: coverage,
        confidencePct: confidence
      };
    });
  };

  // Real-time clock in Indian Standard Time (IST, UTC+05:30)
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const istFormatted = now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        setZuluTime(`${istFormatted} IST`);
      } catch {
        // Fallback calculation: UTC + 5h 30m
        const d = new Date();
        const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
        const istDate = new Date(utcMs + (5.5 * 3600000));
        const h = String(istDate.getHours()).padStart(2, '0');
        const m = String(istDate.getMinutes()).padStart(2, '0');
        const s = String(istDate.getSeconds()).padStart(2, '0');
        setZuluTime(`${h}:${m}:${s} IST`);
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Continuous global React timer hook (3-second heartbeat interval)
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      setHeartbeatTick(prev => prev + 1);

      // 1. Dynamically update operational metrics across active airframes
      setAircraft(prevAircraft => {
        return prevAircraft.map((ac) => {
          // Check if aircraft is actively flying (altitude > 0)
          if (ac.altitudeFt > 0) {
            // Decrement airborne fuel percentage by 0.1% per tick
            const newFuel = Math.max(8, Number((ac.fuelState - 0.1).toFixed(1)));

            // Decrement distance-to-waypoint and Time-on-Target (TOT)
            const currentDist = ac.distanceToWaypointNm ?? 22.0;
            const currentTot = ac.totSeconds ?? 350;

            let newDist = Number(Math.max(0.4, currentDist - 0.35).toFixed(1));
            let newTot = Math.max(15, currentTot - 3);
            let heading = ac.heading;

            // When reaching target waypoint threshold, transition to next flight corridor waypoint
            if (newDist <= 0.8) {
              newDist = Number((16 + (Math.random() * 12)).toFixed(1));
              newTot = Math.round(newDist * 18);
              // Shift heading smoothly along corridor vector (30-60 deg turn)
              heading = Math.round((heading + 45 + Math.random() * 45) % 360);
            }

            // Move coordinates along assigned flight corridor
            const speedFactor = 0.28;
            const rad = (heading * Math.PI) / 180;
            let nextX = ac.x + Math.sin(rad) * speedFactor;
            let nextY = ac.y - Math.cos(rad) * speedFactor;

            // Keep within tactical airspace boundaries with defensive boundary turnaround
            if (nextX < 14) {
              heading = (heading + 90) % 360;
              nextX = 14;
            } else if (nextX > 86) {
              heading = (heading + 90) % 360;
              nextX = 86;
            }
            if (nextY < 12) {
              heading = (heading + 90) % 360;
              nextY = 12;
            } else if (nextY > 86) {
              heading = (heading + 90) % 360;
              nextY = 86;
            }

            // Interpolate latitude and longitude
            const latitude = Number((34.8 - (nextY / 100) * 8.2).toFixed(4));
            const longitude = Number((72.4 + (nextX / 100) * 11.6).toFixed(4));

            return {
              ...ac,
              fuelState: newFuel,
              distanceToWaypointNm: newDist,
              totSeconds: newTot,
              heading,
              targetHeading: heading,
              x: Number(nextX.toFixed(2)),
              y: Number(nextY.toFixed(2)),
              latitude,
              longitude,
            };
          }
          return ac;
        });
      });

      // 2. Incrementally advance fatigue timers for aircrew on active sorties
      setCrew(prevCrew => {
        return prevCrew.map(c => {
          if (c.availability === 'Assigned') {
            return {
              ...c,
              flightHours30D: Number((c.flightHours30D + 0.05).toFixed(2))
            };
          } else if (c.availability === 'Rest Fatigue' && c.restHoursRemaining > 0) {
            return {
              ...c,
              restHoursRemaining: Math.max(0, Number((c.restHoursRemaining - 0.1).toFixed(1)))
            };
          }
          return c;
        });
      });
    }, 3000);

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Battlefield Incident Injector Trigger
  const injectIncident = async (type: IncidentCategory) => {
    setIsOptimizing(true);
    setSystemStatus('BATTLEFIELD INCIDENT DETECTED // RE-OPTIMISING ALL AIR WINGS...');
    setNeedsReoptimization(false);

    let incidentTitle = '';
    let incidentDesc = '';
    let voiceAlertText = '';
    let tacticalImpactText = '';
    let aiResponseText = '';
    let reallocationsList: string[] = [];

    const nowZulu = zuluTime;

    if (type === 'sam_threat') {
      incidentTitle = 'POP-UP S-400 SAM THREAT ENVELOPE';
      incidentDesc = 'ELINT reconnaissance detected active 91N6E radar and mobile S-400 SAM battery deployed in Sector North (Grid N-14). Active engagement envelope: 180 NM radius.';
      voiceAlertText = 'Threat alert: S-400 missile envelope detected in Sector North. Dynamic re-routing activated.';
      tacticalImpactText = 'Sector North primary ingress corridor blocked. 4 strike sorties at risk of BVR engagement.';
      aiResponseText = 'Dynamic standoff reroute computed: Diverted strike packages A-01, A-03, A-07 to low-altitude radar notch FL320. Dispatched SEAD package with 2x Anti-Radiation Missiles.';
      reallocationsList = [
        'A-01, A-03, A-07: Ingress path rerouted around 180 NM SAM envelope via FL320 notch',
        'A-13: Retasked to SEAD Anti-Radiation Suppression with 2x RUDRAM Standoff Missiles',
        'PEGASUS-01: Shifted tanker refuel orbit 35 NM South to stay clear of contested missile envelope'
      ];

      setSectors(prev => prev.map(s => s.id === 'SEC-NORTH' ? {
        ...s,
        threatLevel: 'CRITICAL',
        activeThreat: 'Active S-400 Battery (Grid N-14) - Lethal Missile Envelope 180 NM'
      } : s));

      setAlerts(prev => [
        {
          id: `INC-SAM-${Date.now()}`,
          timestamp: nowZulu,
          severity: 'critical',
          title: 'RED ALERT: Pop-up S-400 Threat Envelope',
          message: 'Sector North SAM battery active. Dynamic re-routing and SEAD escort package activated.',
          acknowledged: false,
          actionRequired: 'Review AI Dynamic Standoff Route'
        },
        ...prev
      ]);
    } else if (type === 'weather_squall') {
      incidentTitle = 'SEVERE CONVECTIVE WEATHER SQUALL';
      incidentDesc = 'Doppler radar matrix confirms rapid squall cell with tops reaching FL480, zero-visibility hail, and microburst turbulence across Airspace Corridor Alpha.';
      voiceAlertText = 'Weather warning: Severe squall detected closing Corridor Alpha. Strike packages rerouting.';
      tacticalImpactText = 'Corridor Alpha closed to low and medium altitude flights. Direct flight path availability degraded by 85%.';
      aiResponseText = 'Corridor Alpha closed. AI rerouted strike packages through Northern Corridor Bravo at FL360 with optimized fuel burn rate.';
      reallocationsList = [
        'Airspace Corridor Alpha closed (Ground stop to FL400)',
        'GARUDA-01 & THUNDER-01: Diverted via Northern Corridor Bravo (+4 min TOT offset)',
        'PEGASUS-01: Ascended from FL260 to FL340 above convective squall cloud tops'
      ];

      setSectors(prev => prev.map(s => s.id === 'SEC-CENTRAL' ? {
        ...s,
        weather: 'RESTRICTED',
        airspace: 'RESTRICTED',
        windSpeed: 48,
        activeThreat: 'Convective Squall Front (Tops FL480) - Corridor Alpha Closed'
      } : s));

      setAlerts(prev => [
        {
          id: `INC-WX-${Date.now()}`,
          timestamp: nowZulu,
          severity: 'warning',
          title: 'WEATHER CLOSURE: Corridor Alpha Ingress Halted',
          message: 'Severe convective squall cell detected. All inbound aircraft rerouted to Corridor Bravo.',
          acknowledged: false
        },
        ...prev
      ]);
    } else if (type === 'runway_closure') {
      incidentTitle = 'RUNWAY CLOSURE — BASE ALPHA';
      incidentDesc = 'Runway 27R at Base Alpha closed due to emergency cratering and unexploded ordnance on threshold. Recovery landings halted immediately.';
      voiceAlertText = 'Emergency: Base Alpha runway closed. Initiating immediate recovery diversion to Base Bravo.';
      tacticalImpactText = 'Base Alpha unable to recover 6 airborne aircraft. Emergency fuel diversion mandatory for returning flights.';
      aiResponseText = 'Immediate diversion protocol executed: Rerouted 4 airborne flights to Base Bravo and 2 to FOB-Charlie. Dispatched mobile turnaround teams.';
      reallocationsList = [
        'Base Alpha Runway Status: DAMAGED / RECOVERY DIVERT ONLY',
        'GARUDA-01, GARUDA-03: Diverted to Base Bravo (Holding stack Alpha at FL160)',
        'PEGASUS-01: Dispatched to emergency fuel orbit to top off low-state fighters',
        'Base-B & FOB-Charlie: Alert level upgraded to DEFCON 1 with emergency arresting gear'
      ];

      setBases(prev => prev.map(b => {
        if (b.id === 'BASE-A') {
          return { ...b, runwayStatus: 'Damaged', alertLevel: 'SCRAMBLE' };
        }
        if (b.id === 'BASE-B') {
          return { ...b, alertLevel: 'DEFCON 1', turnaroundTeamsReady: b.turnaroundTeamsReady + 3 };
        }
        return b;
      }));

      setAlerts(prev => [
        {
          id: `INC-RWY-${Date.now()}`,
          timestamp: nowZulu,
          severity: 'critical',
          title: 'DIVERT EMERGENCY: Base Alpha Runway Closed',
          message: 'Threshold 27R blocked. Recovery flights diverted to Base Bravo with tanker support.',
          acknowledged: false,
          actionRequired: 'Monitor Divert Fuel Burn'
        },
        ...prev
      ]);
    } else if (type === 'high_value_scramble') {
      incidentTitle = 'URGENT HIGH-VALUE SCRAMBLE ORDER';
      incidentDesc = 'Airborne Early Warning (SENTINEL-01) confirmed fleeting radar signature of high-value hostile asset at Sector North border grid 12-F.';
      voiceAlertText = 'Scramble order: High-value airborne target detected. Re-tasking alert fighters from Combat Air Patrol.';
      tacticalImpactText = 'Time-critical target window: 7 minutes before radar horizon departure. Requires immediate supersonic intercept vector.';
      aiResponseText = 'Instant AI Allocation: Retasked 2 airborne CAP fighters to Mach 1.4 intercept, scrambled 2 alert fighters from Base-A with Meteor loadouts.';
      reallocationsList = [
        'GARUDA-01: Retasked from routine CAP to Intercept Vector 045° at Mach 1.35',
        'GARUDA-07: Scrambled from Base-A Ready Bay with 4x Meteor BVR missiles',
        'SENTINEL-01: Focused AESA radar beam to 120 Hz high-update tracking on Grid 12-F',
        'Air Tasking Order: Priority escalated to CRITICAL'
      ];

      setAlerts(prev => [
        {
          id: `INC-SCR-${Date.now()}`,
          timestamp: nowZulu,
          severity: 'critical',
          title: 'SCRAMBLE: High-Value Target Intercept Active',
          message: 'GARUDA-01 vectoring to intercept at Mach 1.35. Air Tasking Order priority escalated to CRITICAL.',
          acknowledged: false
        },
        ...prev
      ]);
    }

    // Play tactical chime and voice announcement
    playTacticalVoiceAlert(voiceAlertText);

    // AI solver convergence simulation
    await new Promise(r => setTimeout(r, 650));

    const incidentObj: ActiveIncident = {
      id: `INC-${Date.now()}`,
      type,
      title: incidentTitle,
      description: incidentDesc,
      timestamp: nowZulu,
      tacticalImpact: tacticalImpactText,
      aiResponse: aiResponseText,
      reallocationsSummary: reallocationsList
    };
    setActiveIncident(incidentObj);

    // Push audit log
    setAuditLogs(prev => [
      {
        id: `AUDIT-INC-${Date.now()}`,
        timestamp: nowZulu,
        eventType: 'simulation_change',
        title: `Battlefield Disruption: ${incidentTitle}`,
        triggerReason: incidentDesc,
        stateSnapshot: {
          availableAircraft: 15,
          readyCrew: 101,
          resourceCapacityPct: 74,
          sortieCoveragePct: 95,
          priority: type === 'high_value_scramble' ? 'CRITICAL' : 'HIGH',
          confidencePct: 94,
          activeConstraintsCount: 4,
          weatherSummary: type === 'weather_squall' ? 'Squall Front Corridor Alpha' : 'Nominal',
          airspaceSummary: type === 'weather_squall' ? 'Corridor Alpha CLOSED' : 'Active Tactical Routing'
        }
      },
      ...prev
    ]);

    // Recalculate plan dynamically
    setCurrentPlan(prev => ({
      ...prev,
      id: `PLAN-AI-RESP-${Date.now().toString().slice(-4)}`,
      version: `v5.${simulationIteration + 1}-INCIDENT-OPTIMISED`,
      generatedAt: nowZulu,
      priority: type === 'high_value_scramble' ? 'CRITICAL' : 'HIGH',
      confidencePct: 95,
      sortieCoveragePct: 96,
      recommendedAction: aiResponseText,
      reallocations: reallocationsList.map((item, idx) => ({
        id: `RE-INC-${idx}-${Date.now()}`,
        resource: item.split(':')[0] || 'Airframe Resource',
        from: 'Previous Transit Route',
        to: 'Optimised Tactical Vector',
        action: 'Dynamic Re-tasking',
        justification: item
      }))
    }));

    setIsOptimizing(false);
    setSystemStatus('REAL-TIME OPTIMISATION COMPLETE // MULTI-SOURCE CONSTRAINTS RESOLVED');
  };

  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  // Simulate Operational Change (Killer demo trigger)
  const simulateOperationalChange = () => {
    setSimulationIteration(prev => prev + 1);
    setNeedsReoptimization(true);
    setSystemStatus('CHANGE DETECTED // RE-OPTIMISATION REQUIRED');

    // Create changes based on step requirement:
    // BEFORE: Aircraft Available 18, Crew 104, Weather NORMAL, Airspace NORMAL, Priority MEDIUM
    // AFTER: Aircraft Available 15, Crew 101, Weather DEGRADED, Airspace LIMITED, Priority HIGH
    const updatedAircraft = [...aircraft];
    // Put 3 aircraft into emergent maintenance/standby
    updatedAircraft[6] = { ...updatedAircraft[6], status: 'maintenance', readiness: 45, nextAvailability: '03:45 Z' };
    updatedAircraft[10] = { ...updatedAircraft[10], status: 'standby', readiness: 65, nextAvailability: '01:30 Z' };
    updatedAircraft[12] = { ...updatedAircraft[12], status: 'maintenance', readiness: 50, nextAvailability: '04:00 Z' };
    setAircraft(updatedAircraft);

    // Update crew: 3 crew transition to fatigue rest
    const updatedCrew = [...crew];
    updatedCrew[0] = { ...updatedCrew[0], status: 'Standby', restHoursRemaining: 4 };
    updatedCrew[6] = { ...updatedCrew[6], status: 'Unavailable', availability: 'Rest Fatigue', restHoursRemaining: 1 };
    setCrew(updatedCrew);

    // Degrade environmental conditions
    const updatedSectors = sectors.map(sec => {
      if (sec.id === 'SEC-CENTRAL') {
        return {
          ...sec,
          weather: 'RESTRICTED' as WeatherState,
          airspace: 'LIMITED' as AirspaceState,
          threatLevel: 'HIGH' as const,
          windSpeed: 38,
          activeThreat: 'Severe squall front and active radar warning emissions'
        };
      }
      return sec;
    });
    setSectors(updatedSectors);

    // Update timeline forecast
    setTimeline([
      {
        timeLabel: 'NOW',
        weather: 'MODERATE',
        airspace: 'LIMITED',
        riskScore: 56,
        notes: 'Developing squall line entering Central corridor; transit diverted.'
      },
      {
        timeLabel: '+1 HR',
        weather: 'RESTRICTED',
        airspace: 'RESTRICTED',
        riskScore: 84,
        notes: 'Severe convective squall cells over Sector B. Ground stop on low-altitude flights.'
      },
      {
        timeLabel: '+2 HR',
        weather: 'MODERATE',
        airspace: 'LIMITED',
        riskScore: 60,
        notes: 'Front shifts eastward towards maritime flank.'
      },
      {
        timeLabel: '+3 HR',
        weather: 'CLEAR',
        airspace: 'AVAILABLE',
        riskScore: 30,
        notes: 'Full recovery expected across all tactical corridors.'
      }
    ]);

    // Push high priority alerts
    const newAlert: AlertNotice = {
      id: `ALT-${Date.now()}`,
      timestamp: zuluTime,
      severity: 'critical',
      title: 'Dynamic Operational Shift Detected',
      message: 'Aircraft available decreased (18 → 15), Weather in Central Sector degraded, Airspace restricted. Plan re-optimisation required.',
      acknowledged: false,
      actionRequired: 'Execute AI Recalculation'
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Push audit log entry
    const simAuditEntry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: zuluTime,
      eventType: 'simulation_change',
      title: `Operational Shift (Cycle #${simulationIteration + 1})`,
      triggerReason: 'Emergent maintenance attrition (3 aircraft), Central Sector squall front, airspace altitude cap.',
      stateSnapshot: {
        availableAircraft: 15,
        readyCrew: 101,
        resourceCapacityPct: 69,
        sortieCoveragePct: 78,
        priority: 'HIGH',
        confidencePct: 79,
        activeConstraintsCount: 3,
        weatherSummary: 'Restricted in Central Sector',
        airspaceSummary: 'Corridor FL100-FL240 Closed'
      }
    };
    setAuditLogs(prev => [simAuditEntry, ...prev]);
    setSelectedAuditLog(simAuditEntry);
  };

  // Run AI Re-Optimisation
  const recalculatePlan = async () => {
    setIsOptimizing(true);
    setSystemStatus('ANALYSING MULTI-SOURCE CONSTRAINTS...');

    // Simulate real heuristic calculation delay for dramatic military decision-support feel
    await new Promise(resolve => setTimeout(resolve, 900));

    const availableCount = aircraft.filter(a => a.status === 'available').length;
    const readyCrewCount = 101; // dynamically adjusted
    
    // Store previous plan for comparison
    setPreviousPlan(currentPlan);

    const newOptimizedPlan: OperationalPlan = {
      id: `PLAN-REOPT-${Date.now().toString().slice(-4)}`,
      version: `v${simulationIteration + 4}.0-OPTIMISED`,
      generatedAt: zuluTime,
      priority: 'HIGH',
      availableAircraft: availableCount,
      readyCrew: readyCrewCount,
      resourceCapacityPct: 69,
      sortieCoveragePct: 94,
      constraintsDetected: [
        'Central Sector weather degradation restricts low-level transit (FL100-FL240)',
        '3 platforms grounded in maintenance; 18 → 15 frontline available',
        'High Strategic Priority requires sustained Combat Air Patrol loiter'
      ],
      recommendedAction: 'Shift primary ingress corridor to Northern Sector Green-04. Retask Base-A multi-role platforms to absorb Central patrol vacuum and deploy high-endurance crew rotation.',
      confidencePct: 93,
      decisionFactors: [
        {
          factor: 'Mission Priority',
          influence: 'Very High',
          impactDescription: 'High Strategic Priority mandates full 24/7 defense perimeter maintenance despite attrition.'
        },
        {
          factor: 'Airspace Availability',
          influence: 'High',
          impactDescription: 'Severe airspace restriction in Sector B requires rerouting all strike packages through Sector A.'
        },
        {
          factor: 'Resource Availability',
          influence: 'High',
          impactDescription: 'Fuel and munitions re-staged from Base-B to FOB-Charlie to sustain forward sorties.'
        },
        {
          factor: 'Crew Readiness',
          influence: 'High',
          impactDescription: '101 ready pilots partitioned into 3 balanced 6-hour alert blocks.'
        },
        {
          factor: 'Weather Degradation',
          influence: 'Medium',
          impactDescription: 'Convective storm bypass altitude established at FL310.'
        }
      ],
      reallocations: [
        {
          id: `RE-${Date.now()}-1`,
          resource: '3x Multi-Role Fighters (A-01, A-14, A-21)',
          from: 'Base-A Routine Standby',
          to: 'Northern Border CAP (Sector A)',
          action: 'Dynamic Ingress Retask',
          justification: 'Fills coverage gap left by maintenance downtime with 94%+ readiness airframes.'
        },
        {
          id: `RE-${Date.now()}-2`,
          resource: '1x KC-30 Tanker (PEGASUS-01)',
          from: 'Central Orbit Point',
          to: 'Northern Anchor Corridor (FL300)',
          action: 'Orbit Altitude Escalation',
          justification: 'Avoids thunderstorm turbulence and preserves fighter fuel reserves.'
        },
        {
          id: `RE-${Date.now()}-3`,
          resource: 'Ground Turnaround Crew Team #4',
          from: 'Base-B Central Depot',
          to: 'FOB-Charlie',
          action: 'Expedited Logistics Air-Drop',
          justification: 'Reduces turnaround time on Deep Penetration Strike platforms to 45 minutes.'
        }
      ],
      reasoningSteps: [
        {
          stepNumber: '01',
          title: 'Resource Availability Recalculation',
          description: `Ingested telemetry: ${availableCount} available airframes, 6 platforms in maintenance bays, aggregate resource capacity adjusted to 69%.`,
          highlight: `${availableCount} Available / 6 Maintenance / 69% Resource Pool`
        },
        {
          stepNumber: '02',
          title: 'Crew Fatigue & Qualification Filter',
          description: '101 ready crew validated. Filtered out 3 fatigued pilots and swapped in high-hour night-qualified commanders.',
          highlight: 'Zero fatigue infractions; rest margins secured'
        },
        {
          stepNumber: '03',
          title: 'Environmental & Airspace Fusion',
          description: 'Detected convective storm line in Central Sector. Automatically flagged restricted flight levels FL100–FL240.',
          highlight: 'Ingress corridors dynamically diverted through North'
        },
        {
          stepNumber: '04',
          title: 'Strategic Priority Weighting',
          description: 'Prioritized High Strategic Defense: minimum 4 airframes on active Combat Air Patrol with BVR loadouts at all times.',
          highlight: '100% border coverage maintained'
        },
        {
          stepNumber: '05',
          title: 'Multi-Objective Resource Optimisation',
          description: 'Executed mixed-integer linear solver balancing fuel consumption against threat standoff distance.',
          highlight: 'Mathematical optimum achieved at 93% confidence'
        },
        {
          stepNumber: '06',
          title: 'Dynamic Air Tasking Order (ATO) Generation',
          description: 'Generated re-tasking orders, flight paths, tanker rendez-vous times, and airfield divert contingencies.',
          highlight: 'Ready for Operational Scramble'
        }
      ]
    };

    setCurrentPlan(newOptimizedPlan);
    setNeedsReoptimization(false);
    setIsOptimizing(false);
    setSystemStatus('SYSTEM: ● OPERATIONAL (PLAN RE-OPTIMISED)');

    // Log alert
    setAlerts(prev => [
      {
        id: `ALT-OPT-${Date.now()}`,
        timestamp: zuluTime,
        severity: 'system',
        title: 'Plan Re-Optimisation Complete',
        message: `New resource allocation generated (${newOptimizedPlan.version}). Coverage restored to 94% with 93% confidence.`,
        acknowledged: false
      },
      ...prev
    ]);

    // Push audit log entry
    const reoptAuditEntry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: zuluTime,
      eventType: 'reoptimization',
      title: `Algorithmic Re-Optimisation (${newOptimizedPlan.version})`,
      triggerReason: 'Resolved Central storm routing, retasked 3 CAP airframes, and stabilized fuel logistics.',
      stateSnapshot: {
        availableAircraft: newOptimizedPlan.availableAircraft,
        readyCrew: newOptimizedPlan.readyCrew,
        resourceCapacityPct: newOptimizedPlan.resourceCapacityPct,
        sortieCoveragePct: newOptimizedPlan.sortieCoveragePct,
        priority: newOptimizedPlan.priority,
        confidencePct: newOptimizedPlan.confidencePct,
        activeConstraintsCount: newOptimizedPlan.constraintsDetected.length,
        weatherSummary: 'Bypassed via North Axis',
        airspaceSummary: 'Ingress Corridor Green-04 Secured'
      },
      planSnapshot: newOptimizedPlan
    };
    setAuditLogs(prev => [reoptAuditEntry, ...prev]);
    setSelectedAuditLog(reoptAuditEntry);
  };

  // Run What-If Scenario
  const runWhatIfScenario = (params: WhatIfParams) => {
    const simResources = Math.round((params.aircraftAvailabilityPct * 0.4) + (params.crewAvailabilityPct * 0.4) + 15);
    const simCoverage = params.weather === 'RESTRICTED' ? 78 : (params.airspace === 'RESTRICTED' ? 82 : 95);
    const constraintsCount = (params.weather === 'RESTRICTED' ? 1 : 0) + 
                             (params.airspace === 'RESTRICTED' ? 1 : 0) + 
                             (params.aircraftAvailabilityPct < 70 ? 1 : 0) + 
                             (params.priority === 'CRITICAL' ? 1 : 0);

    const simulatedPlan: OperationalPlan = {
      ...currentPlan,
      id: `PLAN-SIM-${Date.now().toString().slice(-4)}`,
      version: `v-SIMULATED-SCENARIO`,
      priority: params.priority,
      availableAircraft: Math.round(24 * (params.aircraftAvailabilityPct / 100)),
      readyCrew: Math.round(120 * (params.crewAvailabilityPct / 100)),
      resourceCapacityPct: simResources,
      sortieCoveragePct: simCoverage,
      constraintsDetected: [
        params.weather !== 'CLEAR' ? `Weather in contested sectors: ${params.weather}` : 'Nominal atmospheric envelope',
        params.airspace !== 'AVAILABLE' ? `Airspace control restriction: ${params.airspace}` : 'Unrestricted tactical corridors',
        params.priority === 'CRITICAL' ? 'Critical alert escalation: 100% force projection required' : 'Routine defensive posturing'
      ],
      recommendedAction: params.priority === 'CRITICAL' 
        ? 'Mobilize all standby airframes and recall off-duty crew for immediate surge operations.' 
        : 'Sustain paced rotational patrols with reserve staging at Base-A and Base-B.',
      confidencePct: Math.max(75, Math.min(96, Math.round(100 - constraintsCount * 6)))
    };

    setWhatIfResult({
      currentPlanSummary: {
        resourcesPct: currentPlan.resourceCapacityPct,
        planningStatus: 'CURRENT PLAN',
        constraintsCount: currentPlan.constraintsDetected.length,
        sortieCoverage: currentPlan.sortieCoveragePct
      },
      simulatedPlanSummary: {
        resourcesPct: simResources,
        planningStatus: 'SIMULATED PLAN (RE-OPTIMISED)',
        constraintsCount: Math.max(1, constraintsCount),
        sortieCoverage: simCoverage
      },
      recommendedDelta: `Sortie generation delta: ${simCoverage - currentPlan.sortieCoveragePct >= 0 ? '+' : ''}${simCoverage - currentPlan.sortieCoveragePct}%. Required airframe redistribution across ${params.airspace === 'RESTRICTED' ? 'Northern Bypass Corridor' : 'Direct Central Axis'}.`,
      simulatedPlan
    });
  };

  const applyWhatIfPlan = () => {
    if (whatIfResult) {
      setPreviousPlan(currentPlan);
      setCurrentPlan(whatIfResult.simulatedPlan);
      setNeedsReoptimization(false);
      setAlerts(prev => [
        {
          id: `ALT-APPLY-${Date.now()}`,
          timestamp: zuluTime,
          severity: 'planning',
          title: 'What-If Scenario Plan Applied',
          message: 'Commander accepted simulated what-if optimization. Force distribution active.',
          acknowledged: false
        },
        ...prev
      ]);

      // Push audit log entry
      const whatIfAudit: AuditLogEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp: zuluTime,
        eventType: 'whatif_commit',
        title: `What-If Contingency Plan Committed (${whatIfResult.simulatedPlan.priority})`,
        triggerReason: whatIfResult.recommendedDelta,
        stateSnapshot: {
          availableAircraft: whatIfResult.simulatedPlan.availableAircraft,
          readyCrew: whatIfResult.simulatedPlan.readyCrew,
          resourceCapacityPct: whatIfResult.simulatedPlan.resourceCapacityPct,
          sortieCoveragePct: whatIfResult.simulatedPlan.sortieCoveragePct,
          priority: whatIfResult.simulatedPlan.priority,
          confidencePct: whatIfResult.simulatedPlan.confidencePct,
          activeConstraintsCount: whatIfResult.simulatedPlan.constraintsDetected.length,
          weatherSummary: 'Custom Scenario Evaluated',
          airspaceSummary: 'Dynamic Corridors Rerouted'
        },
        planSnapshot: whatIfResult.simulatedPlan
      };
      setAuditLogs(prev => [whatIfAudit, ...prev]);
      setSelectedAuditLog(whatIfAudit);

      setActiveScreen('ai-engine');
    }
  };

  const restoreHistoricalPlan = (entry: AuditLogEntry) => {
    if (entry.planSnapshot) {
      setPreviousPlan(currentPlan);
      setCurrentPlan(entry.planSnapshot);
      setNeedsReoptimization(false);
      setAlerts(prev => [
        {
          id: `ALT-RESTORE-${Date.now()}`,
          timestamp: zuluTime,
          severity: 'system',
          title: 'Historical State Restored',
          message: `Restored operational plan snapshot from ${entry.title} (${entry.timestamp}).`,
          acknowledged: false
        },
        ...prev
      ]);
    }
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const retaskAircraft = (id: string, newMission: string, newSector: string) => {
    setAircraft(prev => prev.map(a => a.id === id ? { ...a, missionAssigned: newMission, sector: newSector, lastUpdated: zuluTime } : a));
  };

  const reassignCrew = (crewId: string, newAssignment: string) => {
    setCrew(prev => prev.map(c => c.id === crewId ? { ...c, assignment: newAssignment } : c));
  };

  // AirSync Core Data Fusion & Optimisation State
  const [dataFusionSources, setDataFusionSources] = useState<DataFusionSource[]>(INITIAL_DATA_FUSION_SOURCES);
  const [systemServices, setSystemServices] = useState<SystemServiceStatus[]>(INITIAL_SYSTEM_SERVICES);
  const [optimisationOptions, setOptimisationOptions] = useState<OptimisationOption[]>(INITIAL_OPTIMISATION_OPTIONS);
  const [predictions, setPredictions] = useState<ReadinessPredictionSet>(INITIAL_PREDICTIONS);

  const availableAircraftCount = aircraft.filter(a => a.status === 'available').length;
  const readyCrewCount = crew.filter(c => c.status === 'Ready').length;
  const readyCrewPct = Math.round((readyCrewCount / crew.length) * 100);

  const unifiedState: UnifiedOperationalState = useMemo(() => {
    const isDegraded = needsReoptimization || availableAircraftCount <= 15;
    return {
      aircraftAvailability: {
        count: availableAircraftCount,
        total: aircraft.length,
        percentage: Math.round((availableAircraftCount / aircraft.length) * 100)
      },
      crewReadiness: {
        count: readyCrewCount,
        total: crew.length,
        percentage: readyCrewPct
      },
      resources: {
        capacityPct: currentPlan.resourceCapacityPct || 76,
        bottleneckWarning: munitionsBottleneckWarning || undefined
      },
      weather: isDegraded ? 'MODERATE' : 'CLEAR',
      airspace: isDegraded ? 'LIMITED' : 'AVAILABLE',
      threatIndicators: isDegraded ? 'HIGH' : 'LOW',
      priorities: currentPlan.priority || 'HIGH',
      timestamps: {
        fusedAt: zuluTime,
        timeAlignmentDeltaMs: 14
      },
      confidence: isDegraded ? 88 : 96,
      readinessPressure: isDegraded ? 68 : 28,
      resourcePressure: isDegraded ? 58 : 32,
      delayRisk: isDegraded ? 42 : 14,
      environmentalImpact: isDegraded ? 52 : 18
    };
  }, [availableAircraftCount, aircraft.length, readyCrewCount, crew.length, readyCrewPct, currentPlan, munitionsBottleneckWarning, needsReoptimization, zuluTime]);

  // Action: Run AI Analysis
  const runAiAnalysis = async () => {
    setIsOptimizing(true);
    setSystemStatus('EXECUTING MULTI-SOURCE AI ANALYSIS...');
    await new Promise(r => setTimeout(r, 600));

    const isDegraded = needsReoptimization || availableAircraftCount <= 15;

    setPredictions({
      aircraftReadiness: {
        current: `${availableAircraftCount} / ${aircraft.length} (${Math.round((availableAircraftCount / aircraft.length) * 100)}%)`,
        predicted: `${Math.max(12, availableAircraftCount - 1)} / ${aircraft.length} (${Math.round(((availableAircraftCount - 1) / aircraft.length) * 100)}%)`,
        change: isDegraded ? '-3 airframes under emergent maintenance' : '-1 airframe (Routine turnaround)',
        confidence: isDegraded ? 89 : 95,
        riskLevel: isDegraded ? 'HIGH' : 'LOW'
      },
      crewReadiness: {
        current: `${readyCrewPct}% ready`,
        predicted: `${Math.max(70, readyCrewPct - (isDegraded ? 6 : 3))}% ready`,
        change: isDegraded ? '-6% (Surge fatigue threshold exceeded)' : '-3% (Shift rotation in 4h)',
        confidence: isDegraded ? 88 : 93,
        riskLevel: isDegraded ? 'HIGH' : 'LOW'
      },
      resourcePressure: {
        current: `${isDegraded ? 58 : 32}% (${isDegraded ? 'Elevated' : 'Nominal'})`,
        predicted: `${isDegraded ? 64 : 38}% (${isDegraded ? 'Severe' : 'Elevated'})`,
        change: isDegraded ? '+12% (Surge sorties burning standby fuel)' : '+6% (Scheduled PGM loadout)',
        confidence: isDegraded ? 86 : 91,
        riskLevel: isDegraded ? 'HIGH' : 'MEDIUM'
      },
      delayRisk: {
        current: `${isDegraded ? 42 : 8}% (${isDegraded ? 'Moderate' : 'Low'})`,
        predicted: `${isDegraded ? 56 : 14}% (${isDegraded ? 'Elevated' : 'Moderate'})`,
        change: isDegraded ? '+18% (Corridor Alpha bypass queue)' : '+6% (Civil traffic slot compression)',
        confidence: isDegraded ? 87 : 94,
        riskLevel: isDegraded ? 'HIGH' : 'LOW'
      }
    });

    setAuditLogs(prev => [
      {
        id: `AUDIT-AI-${Date.now()}`,
        timestamp: zuluTime,
        eventType: 'ai_analysis',
        title: 'AI Operational State Analysis Computed',
        triggerReason: `Readiness pressure evaluated at ${isDegraded ? 68 : 28}%, delay risk ${isDegraded ? 42 : 14}%.`,
        stateSnapshot: {
          availableAircraft: availableAircraftCount,
          readyCrew: readyCrewCount,
          resourceCapacityPct: currentPlan.resourceCapacityPct || 76,
          sortieCoveragePct: isDegraded ? 78 : 94,
          priority: currentPlan.priority || 'HIGH',
          confidencePct: isDegraded ? 88 : 96,
          activeConstraintsCount: isDegraded ? 4 : 2,
          weatherSummary: isDegraded ? 'Degraded / Moderate Squall' : 'Clear Ceilings',
          airspaceSummary: isDegraded ? 'Corridor Alpha Regulated' : 'Available'
        }
      },
      ...prev
    ]);

    setIsOptimizing(false);
    setSystemStatus('AI ANALYSIS COMPLETE // PREDICTIONS UPDATED');
  };

  // Action: Run Constraint Optimisation
  const runConstraintOptimisation = async () => {
    setIsOptimizing(true);
    setSystemStatus('SOLVING MIXED-INTEGER CONSTRAINTS (CP-SAT)...');
    await new Promise(r => setTimeout(r, 700));

    const isDegraded = needsReoptimization || availableAircraftCount <= 15;

    setOptimisationOptions([
      {
        id: 'OPTION_A',
        title: 'Option A: Resource-balanced',
        focus: 'Balanced Readiness & Sustained Orbit Endurance',
        feasibility: isDegraded ? 'Highly Feasible (94%)' : 'Optimal (100%)',
        feasibilityPct: isDegraded ? 94 : 100,
        resourceUtilisation: isDegraded ? 82 : 74,
        readinessImpact: isDegraded ? '+6% Fleet Readiness buffer' : '+8% Fleet Readiness buffer',
        estimatedDelay: isDegraded ? '6 min' : '0 min',
        constraintSatisfaction: isDegraded ? 95 : 98,
        confidence: isDegraded ? 91 : 96,
        tradeOffs: 'Equilibrium across all sectors; retains 4 alert-5 quick scramble airframes.',
        whyThisOption: {
          aircraftFactor: `Allocates ${Math.min(14, availableAircraftCount)} platforms, reserving rest for emergent contingency.`,
          crewFactor: 'Distributes pilot duty cycles within 8-hour fatigue thresholds.',
          resourceFactor: 'PGM expenditure rate within 76% base capacity buffer.',
          weatherFactor: isDegraded ? 'Reroutes flight paths around convective squall front.' : 'Optimal VMC corridors utilized.',
          airspaceFactor: 'Deconflicts with civil transit corridor 12-A.',
          priorityWeight: 'Priority: High (Balanced offensive/defensive stance).',
          constraintsSatisfied: [
            'Turnaround time <= 45 minutes',
            'Pilot rest cycle >= 12 hours between sorties',
            'Fuel reserve >= 25% bingo state at recovery',
            'SAM standoff margin >= 30 NM'
          ],
          majorFactors: ['Multi-role flexibility', 'Minimal delay risk', 'Steady resource consumption'],
          warnings: isDegraded ? ['Requires 15 NM corridor detour around squall front'] : []
        },
        humanReviewState: 'PENDING'
      },
      {
        id: 'OPTION_B',
        title: 'Option B: Readiness-focused',
        focus: 'Rapid Interception & Elevated CAP Coverage',
        feasibility: isDegraded ? 'Constrained (88%)' : 'Highly Feasible (94%)',
        feasibilityPct: isDegraded ? 88 : 94,
        resourceUtilisation: isDegraded ? 94 : 86,
        readinessImpact: isDegraded ? '+10% Combat CAP presence' : '+14% Combat CAP presence',
        estimatedDelay: isDegraded ? '12 min' : '4 min',
        constraintSatisfaction: isDegraded ? 91 : 94,
        confidence: isDegraded ? 87 : 92,
        tradeOffs: 'Maximized airborne posture; increases pilot duty fatigue accrual by 12%.',
        whyThisOption: {
          aircraftFactor: `Surges active airframes to ${availableAircraftCount} for maximum air superiority.`,
          crewFactor: 'Requires voluntary surge duty authorization for 2 flight leads.',
          resourceFactor: 'Higher tanker offload rate to sustain continuous supersonic loiter.',
          weatherFactor: 'Accepts radar-guided IMC ingress windows.',
          airspaceFactor: 'Requests military priority transit clearance from ATC.',
          priorityWeight: 'Priority: Critical (Preemptive intercept posture).',
          constraintsSatisfied: [
            'Interception response time < 5 minutes',
            'Dual-ship CAP overlapping coverage',
            'Direct datalink sensor fusion locked'
          ],
          majorFactors: ['Instant reaction capability', 'Maximum aerial surveillance', 'Higher sortie generation'],
          warnings: ['Elevates maintenance wear by 18%', 'Diminishes standby reserves to 1 airframe']
        },
        humanReviewState: 'PENDING'
      },
      {
        id: 'OPTION_C',
        title: 'Option C: Reserve-preserving',
        focus: 'Asset Conservation & Fuel Stockpile Preservation',
        feasibility: 'Highly Feasible (92%)',
        feasibilityPct: 92,
        resourceUtilisation: isDegraded ? 68 : 62,
        readinessImpact: '+2% Reserve replenishment',
        estimatedDelay: isDegraded ? '18 min' : '12 min',
        constraintSatisfaction: isDegraded ? 97 : 96,
        confidence: isDegraded ? 92 : 95,
        tradeOffs: 'Conserves precision standoff munitions; accepts minor civil sector queue delay.',
        whyThisOption: {
          aircraftFactor: `Limits airborne platforms to ${Math.max(8, availableAircraftCount - 5)}, maximizing reserves.`,
          crewFactor: 'Maximizes pilot crew rest to 16 hours for extended campaign longevity.',
          resourceFactor: 'Strictly throttles fuel consumption to preserve depot reserves.',
          weatherFactor: 'Avoids any marginal meteorological corridors entirely.',
          airspaceFactor: 'Shares civil airways during non-peak windows.',
          priorityWeight: 'Priority: Routine / Sustained Patrol.',
          constraintsSatisfied: [
            'Zero fatigue violations',
            'Munition stockpile reserves maintained above 80%',
            'Airframe flight hour consumption below daily quota'
          ],
          majorFactors: ['Long-term endurance', 'Low operational risk', 'Preserves scarce PGMs'],
          warnings: ['Response time for emergent threats increased by ~8 minutes']
        },
        humanReviewState: 'PENDING'
      }
    ]);

    setAuditLogs(prev => [
      {
        id: `AUDIT-OPT-${Date.now()}`,
        timestamp: zuluTime,
        eventType: 'optimisation',
        title: 'Constraint Solver Re-Optimisation Completed',
        triggerReason: 'Generated 3 ranked options (Resource-Balanced, Readiness-Focused, Reserve-Preserving).',
        stateSnapshot: {
          availableAircraft: availableAircraftCount,
          readyCrew: readyCrewCount,
          resourceCapacityPct: currentPlan.resourceCapacityPct || 76,
          sortieCoveragePct: isDegraded ? 78 : 94,
          priority: currentPlan.priority || 'HIGH',
          confidencePct: isDegraded ? 88 : 96,
          activeConstraintsCount: isDegraded ? 4 : 2,
          weatherSummary: isDegraded ? 'Degraded / Moderate Squall' : 'Clear Ceilings',
          airspaceSummary: isDegraded ? 'Corridor Alpha Regulated' : 'Available'
        }
      },
      ...prev
    ]);

    setIsOptimizing(false);
    setSystemStatus('OPTIMISATION COMPLETE // 3 FEASIBLE OPTIONS AVAILABLE');
  };

  // Action: Human-in-the-Loop Review
  const recordHumanReview = (
    optionId: 'OPTION_A' | 'OPTION_B' | 'OPTION_C', 
    decision: 'APPROVED' | 'EDITED' | 'REJECTED',
    notes?: string
  ) => {
    setOptimisationOptions(prev => prev.map(opt => {
      if (opt.id === optionId) {
        return {
          ...opt,
          humanReviewState: decision,
          reviewTimestamp: zuluTime,
          reviewNotes: notes || `Plan ${decision} by Duty Operations Commander (${userRole}).`
        };
      }
      return opt;
    }));

    // If approved, update active operational plan
    if (decision === 'APPROVED') {
      setNeedsReoptimization(false);
      setSystemStatus(`PLAN APPROVED BY COMMANDER // OPTION ${optionId} ACTIVE`);
    }

    setAlerts(prev => [
      {
        id: `ALT-REV-${Date.now()}`,
        timestamp: zuluTime,
        severity: decision === 'APPROVED' ? 'system' : decision === 'REJECTED' ? 'warning' : 'info',
        title: `Human Review Recorded: ${decision} (${optionId})`,
        message: notes || `Commander review finalized for ${optionId}. Protocol: AI recommends -> Human reviews -> Decision recorded.`,
        acknowledged: false
      },
      ...prev
    ]);

    setAuditLogs(prev => [
      {
        id: `AUDIT-REV-${Date.now()}`,
        timestamp: zuluTime,
        eventType: 'human_review',
        title: `Human Review Decision: ${decision} (${optionId})`,
        triggerReason: `Human-in-the-loop decision finalized: ${notes || 'Authorized for tasking execution'}.`,
        stateSnapshot: {
          availableAircraft: availableAircraftCount,
          readyCrew: readyCrewCount,
          resourceCapacityPct: currentPlan.resourceCapacityPct || 76,
          sortieCoveragePct: 94,
          priority: currentPlan.priority || 'HIGH',
          confidencePct: 96,
          activeConstraintsCount: 2,
          weatherSummary: 'Nominal',
          airspaceSummary: 'Available'
        }
      },
      ...prev
    ]);
  };

  // Action: Requirement 18 One-Click Demo Scenario
  const triggerOneClickDemoScenario = async () => {
    setIsOptimizing(true);
    setSystemStatus('DEMO SCENARIO: INITIALISING BASELINE (18 AC, 87% CREW, 76% RES)...');

    // 1. Initial State
    setNeedsReoptimization(false);
    await new Promise(r => setTimeout(r, 600));

    // 2. Trigger Event: 18 -> 15 AC, 87% -> 81% Crew, 76% -> 71% Resources, Weather Degraded, Airspace Limited
    setSystemStatus('DEMO SCENARIO: EVENT TRIGGERED (15 AC, 81% CREW, 71% RES, DEGRADED WX, LIMITED AIRSPACE)...');
    simulateOperationalChange();

    // 3. Data Fusion Pipeline
    setDataFusionSources(prev => prev.map(s => {
      if (s.id === 'src-aircraft') {
        return { ...s, sampleValue: '15 Available / 24 Total (62.5%)', dataQuality: 'Nominal (B)', confidenceScore: 92, lastUpdated: 'Just now' };
      }
      if (s.id === 'src-crew') {
        return { ...s, sampleValue: '97 Ready / 120 Total (81% Rested)', dataQuality: 'Nominal (B)', confidenceScore: 90, lastUpdated: 'Just now' };
      }
      if (s.id === 'src-resources') {
        return { ...s, sampleValue: '71% Munition & Fuel Capacity', dataQuality: 'Marginal (C)', confidenceScore: 86, lastUpdated: 'Just now' };
      }
      if (s.id === 'src-weather') {
        return { ...s, sampleValue: 'Degraded / Convective Squall Line', dataQuality: 'Nominal (B)', confidenceScore: 88, lastUpdated: 'Just now' };
      }
      if (s.id === 'src-airspace') {
        return { ...s, sampleValue: 'Limited / Corridor Alpha Regulated', dataQuality: 'Nominal (B)', confidenceScore: 89, lastUpdated: 'Just now' };
      }
      return s;
    }));

    await new Promise(r => setTimeout(r, 600));

    // 4. Run AI Analysis
    await runAiAnalysis();

    // 5. Run Constraint Optimisation & Update Options
    await runConstraintOptimisation();

    setIsOptimizing(false);
    setSystemStatus('DEMO CASCADE COMPLETE // AWAITING HUMAN-IN-THE-LOOP REVIEW');
  };

  return (
    <OperationsContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        aircraft,
        crew,
        bases,
        sectors,
        timeline,
        currentPlan,
        previousPlan,
        alerts,
        selectedAircraft,
        setSelectedAircraft,
        selectedBase,
        setSelectedBase,
        selectedSector,
        setSelectedSector,
        isOptimizing,
        needsReoptimization,
        systemStatus,
        zuluTime,
        simulationIteration,
        whatIfResult,
        unreadAlertsCount,
        auditLogs,
        selectedAuditLog,
        setSelectedAuditLog,
        restoreHistoricalPlan,
        munitionsStockpile,
        transferMunition,
        munitionsBottleneckWarning,
        dismissBottleneckWarning,
        showMunitionsModal,
        setShowMunitionsModal,
        tankerBridge,
        airTaskingOrder,
        showAtoModal,
        setShowAtoModal,
        showTankerModal,
        setShowTankerModal,
        tacticalIntent,
        setTacticalIntent,
        userRole,
        setUserRole,
        isLandingPage,
        enterDemo,
        exitToLanding,
        isDemoTourActive,
        setIsDemoTourActive,
        demoTourStep,
        startDemoTour,
        nextDemoTourStep,
        prevDemoTourStep,
        exitDemoTour,
        theme,
        toggleTheme,
        activeIncident,
        injectIncident,
        dismissIncident,
        isAudioMuted,
        toggleAudioMute,
        playVoiceAlert,
        heartbeatTick,
        simulateOperationalChange,
        recalculatePlan,
        runWhatIfScenario,
        applyWhatIfPlan,
        acknowledgeAlert,
        retaskAircraft,
        reassignCrew,
        dataFusionSources,
        unifiedState,
        predictions,
        optimisationOptions,
        systemServices,
        runAiAnalysis,
        runConstraintOptimisation,
        recordHumanReview,
        triggerOneClickDemoScenario
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
};
