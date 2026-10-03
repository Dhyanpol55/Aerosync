import React, { createContext, useContext, useState, useEffect } from 'react';
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
  IncidentCategory
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
    timestamp: '10:44:00 Z',
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

export type ScreenId = 
  | 'overview' 
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
        reassignCrew
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
