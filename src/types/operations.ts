export type AircraftStatus = 'available' | 'maintenance' | 'standby' | 'airborne';
export type PlatformType = 'Multi-Role Superiority' | 'Deep Penetration Strike' | 'AEW&C Sentry' | 'Tanker Transport' | 'Tactical Recon';

export interface Aircraft {
  id: string; // e.g. A-01
  callsign: string; // e.g. FALCON-11
  type: PlatformType;
  status: AircraftStatus;
  readiness: number; // 0-100%
  baseId: string;
  baseName: string;
  nextAvailability: string; // e.g. 'Ready' or '04:30 Z'
  weaponLoad: string;
  fuelState: number; // %
  pilotAssigned: string | null;
  lastUpdated: string;
  sector: string;
  x: number; // 0-100 coordinates on tactical map
  y: number;
  heading: number; // degrees
  altitudeFt: number;
  airSpeedKnots: number;
  missionAssigned?: string;
}

export type CrewRole = 'Fighter Pilot' | 'Weapons Systems Officer' | 'Airborne Controller' | 'Mission Commander';
export type CrewReadinessStatus = 'Ready' | 'Standby' | 'Unavailable';
export type CrewAvailabilityState = 'Available' | 'Assigned' | 'Rest Fatigue' | 'Training';

export interface CrewMember {
  id: string; // e.g. C-021
  name: string;
  rank: string;
  role: CrewRole;
  status: CrewReadinessStatus;
  availability: CrewAvailabilityState;
  assignment: string;
  flightHours30D: number;
  restHoursRemaining: number;
  qualifications: string[];
  baseLocation: string;
}

export interface Airbase {
  id: string;
  name: string;
  code: string;
  sector: string;
  x: number;
  y: number;
  runwayStatus: 'Operational' | 'Limited' | 'Damaged' | 'Weather Divert';
  aircraftCount: number;
  fuelCapacityPct: number;
  munitionsCapacityPct: number;
  turnaroundTeamsReady: number;
  alertLevel: 'DEFCON 3' | 'DEFCON 2' | 'DEFCON 1' | 'SCRAMBLE';
}

export type WeatherState = 'CLEAR' | 'MODERATE' | 'RESTRICTED';
export type AirspaceState = 'AVAILABLE' | 'LIMITED' | 'RESTRICTED';
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SectorCondition {
  id: string;
  name: string;
  weather: WeatherState;
  airspace: AirspaceState;
  threatLevel: ThreatLevel;
  windSpeed: number; // knots
  visibilityKm: number;
  activeThreat: string;
  corridorNote: string;
}

export interface EnvironmentalTimelinePoint {
  timeLabel: string; // 'NOW', '+1 HR', '+2 HR', '+3 HR'
  weather: WeatherState;
  airspace: AirspaceState;
  riskScore: number; // 0-100
  notes: string;
}

export interface DecisionFactor {
  factor: string;
  influence: 'Low' | 'Medium' | 'High' | 'Very High';
  impactDescription: string;
}

export interface ReallocationItem {
  id: string;
  resource: string;
  from: string;
  to: string;
  action: string;
  justification: string;
}

export interface ReasoningStep {
  stepNumber: string; // '01', '02', etc.
  title: string;
  description: string;
  highlight: string;
}

export interface OperationalPlan {
  id: string;
  version: string;
  generatedAt: string;
  priority: 'ROUTINE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  availableAircraft: number;
  readyCrew: number;
  resourceCapacityPct: number;
  sortieCoveragePct: number;
  constraintsDetected: string[];
  recommendedAction: string;
  confidencePct: number;
  decisionFactors: DecisionFactor[];
  reallocations: ReallocationItem[];
  reasoningSteps: ReasoningStep[];
}

export type AlertSeverity = 'critical' | 'warning' | 'planning' | 'system';

export interface AlertNotice {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  sector?: string;
  acknowledged: boolean;
  actionRequired?: string;
}

export type AuditEventType = 'baseline_initial' | 'simulation_change' | 'reoptimization' | 'whatif_commit';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  title: string;
  triggerReason: string;
  stateSnapshot: {
    availableAircraft: number;
    readyCrew: number;
    resourceCapacityPct: number;
    sortieCoveragePct: number;
    priority: 'ROUTINE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidencePct: number;
    activeConstraintsCount: number;
    weatherSummary: string;
    airspaceSummary: string;
  };
  planSnapshot?: OperationalPlan;
}
