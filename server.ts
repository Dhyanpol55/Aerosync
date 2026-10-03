import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory demo state for AirSync backend
let operationalState = {
  aircraftAvailability: { available: 18, total: 24, percentage: 75 },
  crewReadiness: { ready: 104, total: 120, percentage: 87 },
  resources: { capacityPct: 76, status: 'NOMINAL' },
  weather: 'CLEAR',
  airspace: 'AVAILABLE',
  threatLevel: 'LOW',
  priority: 'HIGH',
  overallStatus: 'OPERATIONAL',
  confidence: 94,
  timestamps: {
    lastFused: new Date().toISOString(),
    latencyMs: 14
  }
};

let dataSources = [
  { id: 'src-aircraft', name: '1. Aircraft Availability', category: 'Aircraft', connectionStatus: 'Connected', lastUpdated: '3s ago', dataFreshness: 'Fresh', dataQuality: 'High (A+)', confidenceScore: 98, sampleValue: '18 Available / 24 Airframes' },
  { id: 'src-crew', name: '2. Crew Status', category: 'Crew', connectionStatus: 'Connected', lastUpdated: '12s ago', dataFreshness: 'Fresh', dataQuality: 'High (A+)', confidenceScore: 95, sampleValue: '87% Rested / 14 On Standby' },
  { id: 'src-resources', name: '3. Resource / Load Status', category: 'Resource', connectionStatus: 'Connected', lastUpdated: '8s ago', dataFreshness: 'Fresh', dataQuality: 'Nominal (B)', confidenceScore: 92, sampleValue: '76% Fuel & Munition Buffer' },
  { id: 'src-airspace', name: '4. Airspace', category: 'Airspace', connectionStatus: 'Connected', lastUpdated: '18s ago', dataFreshness: 'Fresh', dataQuality: 'High (A+)', confidenceScore: 94, sampleValue: 'Corridors Alpha & Bravo Open' },
  { id: 'src-weather', name: '5. Weather', category: 'Weather', connectionStatus: 'Connected', lastUpdated: '25s ago', dataFreshness: 'Fresh', dataQuality: 'High (A+)', confidenceScore: 96, sampleValue: 'VMC Normal Ceilings' },
  { id: 'src-threats', name: '6. Threat Indicators', category: 'Threats', connectionStatus: 'Connected', lastUpdated: '5s ago', dataFreshness: 'Fresh', dataQuality: 'High (A+)', confidenceScore: 97, sampleValue: 'S-400 Standoff Envelopes Logged' },
  { id: 'src-priorities', name: '7. Mission Priorities', category: 'Priorities', connectionStatus: 'Connected', lastUpdated: '30s ago', dataFreshness: 'Fresh', dataQuality: 'High (A+)', confidenceScore: 99, sampleValue: 'Air Defense QRA & Escort Priority' }
];

let alerts = [
  { id: 'alt-01', timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST', severity: 'SYSTEM', title: 'Data Fusion Engine Synchronized', message: 'All 7 multi-source telemetry feeds active and time-aligned.', acknowledged: true },
  { id: 'alt-02', timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST', severity: 'PLANNING', title: 'Constraint Solver Initialized', message: 'Deterministic CP-SAT solver running on baseline dataset.', acknowledged: true }
];

let decisionHistory: Array<{
  id: string;
  timestamp: string;
  category: 'DATA' | 'AI' | 'OPTIMISATION' | 'SIMULATION' | 'REVIEW';
  title: string;
  detail: string;
  status: string;
}> = [
  { id: 'hist-01', timestamp: '14:30:15 IST', category: 'DATA', title: 'Multi-Source Data Fusion Synchronized', detail: '7 primary telemetry streams normalized and time-aligned.', status: 'SUCCESS' },
  { id: 'hist-02', timestamp: '14:30:28 IST', category: 'AI', title: 'Baseline Readiness Predictions Computed', detail: 'Fleet readiness pressure 28%, delay risk 14% (Low).', status: 'COMPLETED' },
  { id: 'hist-03', timestamp: '14:30:42 IST', category: 'OPTIMISATION', title: '3 Feasible Options Generated', detail: 'Option A (Balanced), Option B (Readiness), Option C (Reserve).', status: 'FEASIBLE' }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // CORS configuration to allow Vercel frontend and any origin
  app.use(cors({
    origin: true, // Allow all origins or specify process.env.FRONTEND_URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  // Healthcheck endpoint for Railway / Render / monitoring
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'AirSync C2 Backend Engine',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  // API 1: GET /api/dashboard
  app.get('/api/dashboard', (_req: Request, res: Response) => {
    res.json({
      operationalState,
      dataSourcesCount: dataSources.length,
      alertsCount: alerts.length,
      systemStatus: operationalState.overallStatus,
      lastUpdated: new Date().toISOString()
    });
  });

  // API 2: GET /api/data-sources
  app.get('/api/data-sources', (_req: Request, res: Response) => {
    res.json({
      sources: dataSources,
      fusionPipeline: {
        stages: ['SOURCE INPUTS', 'VALIDATION', 'NORMALISATION', 'TIME ALIGNMENT', 'CONFIDENCE CHECK', 'UNIFIED OPERATIONAL STATE'],
        status: 'ACTIVE',
        latencyMs: 14,
        confidencePct: operationalState.confidence
      }
    });
  });

  // API 3: GET /api/aircraft
  app.get('/api/aircraft', (_req: Request, res: Response) => {
    res.json({
      availableCount: operationalState.aircraftAvailability.available,
      totalCount: operationalState.aircraftAvailability.total,
      percentage: operationalState.aircraftAvailability.percentage
    });
  });

  // API 4: GET /api/crew
  app.get('/api/crew', (_req: Request, res: Response) => {
    res.json({
      readyCount: operationalState.crewReadiness.ready,
      totalCount: operationalState.crewReadiness.total,
      percentage: operationalState.crewReadiness.percentage
    });
  });

  // API 5: GET /api/resources
  app.get('/api/resources', (_req: Request, res: Response) => {
    res.json({
      capacityPct: operationalState.resources.capacityPct,
      status: operationalState.resources.status
    });
  });

  // API 6: GET /api/environment
  app.get('/api/environment', (_req: Request, res: Response) => {
    res.json({
      weather: operationalState.weather,
      airspace: operationalState.airspace,
      threatLevel: operationalState.threatLevel
    });
  });

  // API 7: GET /api/alerts
  app.get('/api/alerts', (_req: Request, res: Response) => {
    res.json({ alerts });
  });

  // API 8: GET /api/history
  app.get('/api/history', (_req: Request, res: Response) => {
    res.json({ history: decisionHistory });
  });

  // API 9: POST /api/analyse
  app.post('/api/analyse', (_req: Request, res: Response) => {
    const analysis = {
      readinessPressure: operationalState.aircraftAvailability.percentage < 70 ? 68 : 28,
      resourcePressure: operationalState.resources.capacityPct < 75 ? 58 : 32,
      delayRisk: operationalState.airspace === 'RESTRICTED' ? 72 : operationalState.airspace === 'LIMITED' ? 42 : 14,
      environmentalImpact: operationalState.weather === 'RESTRICTED' ? 84 : operationalState.weather === 'DEGRADED' ? 52 : 18,
      confidence: operationalState.confidence,
      currentState: { ...operationalState },
      predictedState: {
        aircraftAvailability: operationalState.aircraftAvailability.available - 1,
        crewReadinessPct: operationalState.crewReadiness.percentage - 4,
        resourceBufferPct: operationalState.resources.capacityPct - 5
      },
      detectedChanges: [
        'Multi-source temporal delta calculated across 7 active telemetry feeds',
        'Constraint boundary verification confirmed within nominal safety envelope'
      ]
    };

    decisionHistory.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      category: 'AI',
      title: 'Real-time AI State Analysis Triggered',
      detail: `Readiness pressure: ${analysis.readinessPressure}%, Delay risk: ${analysis.delayRisk}%`,
      status: 'COMPLETED'
    });

    res.json(analysis);
  });

  // API 10: POST /api/optimise
  app.post('/api/optimise', (_req: Request, res: Response) => {
    const isDegraded = operationalState.aircraftAvailability.available <= 15 || operationalState.weather === 'DEGRADED' || operationalState.airspace === 'LIMITED';

    const options = [
      {
        id: 'OPTION_A',
        title: 'Option A: Resource-balanced',
        focus: 'Balanced Readiness & Sustained Orbit Endurance',
        feasibility: isDegraded ? 'Highly Feasible (94%)' : 'Optimal (100%)',
        resourceUtilisation: isDegraded ? 84 : 74,
        readinessImpact: isDegraded ? '+6% Fleet Readiness buffer' : '+8% Fleet Readiness buffer',
        estimatedDelay: isDegraded ? '6 min' : '0 min',
        constraintSatisfaction: isDegraded ? 95 : 98,
        confidence: 96,
        tradeOffs: 'Equilibrium across all sectors; retains 4 alert-5 quick scramble airframes.'
      },
      {
        id: 'OPTION_B',
        title: 'Option B: Readiness-focused',
        focus: 'Rapid Interception & Elevated CAP Coverage',
        feasibility: isDegraded ? 'Constrained (88%)' : 'Highly Feasible (94%)',
        resourceUtilisation: isDegraded ? 92 : 86,
        readinessImpact: isDegraded ? '+10% Combat CAP presence' : '+14% Combat CAP presence',
        estimatedDelay: isDegraded ? '12 min' : '4 min',
        constraintSatisfaction: isDegraded ? 90 : 94,
        confidence: 92,
        tradeOffs: 'Maximized airborne posture; increases pilot duty fatigue accrual by 12%.'
      },
      {
        id: 'OPTION_C',
        title: 'Option C: Reserve-preserving',
        focus: 'Asset Conservation & Fuel Stockpile Preservation',
        feasibility: isDegraded ? 'Highly Feasible (96%)' : 'Highly Feasible (92%)',
        resourceUtilisation: isDegraded ? 68 : 62,
        readinessImpact: isDegraded ? '+2% Reserve replenishment' : '+2% Reserve replenishment',
        estimatedDelay: isDegraded ? '18 min' : '12 min',
        constraintSatisfaction: isDegraded ? 97 : 96,
        confidence: 95,
        tradeOffs: 'Conserves precision standoff munitions; accepts minor civil sector queue delay.'
      }
    ];

    res.json({ options });
  });

  // API 11: POST /api/simulation/change
  app.post('/api/simulation/change', (req: Request, res: Response) => {
    const { aircraft, crew, resources, weather, airspace, priority } = req.body;

    if (aircraft !== undefined) operationalState.aircraftAvailability.available = Number(aircraft);
    if (crew !== undefined) operationalState.crewReadiness.percentage = Number(crew);
    if (resources !== undefined) operationalState.resources.capacityPct = Number(resources);
    if (weather !== undefined) operationalState.weather = String(weather);
    if (airspace !== undefined) operationalState.airspace = String(airspace);
    if (priority !== undefined) operationalState.priority = String(priority);

    operationalState.timestamps.lastFused = new Date().toISOString();

    const requiresReplan = 
      operationalState.aircraftAvailability.available <= 15 || 
      operationalState.crewReadiness.percentage <= 82 ||
      operationalState.weather === 'DEGRADED' ||
      operationalState.airspace === 'LIMITED';

    if (requiresReplan) {
      alerts.unshift({
        id: `alt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
        severity: 'critical',
        title: 'Re-planning Required: Significant Threshold Breach',
        message: `Aircraft reduced to ${operationalState.aircraftAvailability.available}, Weather ${operationalState.weather}. Impact analysis triggered.`,
        acknowledged: false
      });

      decisionHistory.unshift({
        id: `hist-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
        category: 'SIMULATION',
        title: 'What-If Simulation Applied: Disruption Event',
        detail: `Aircraft: ${operationalState.aircraftAvailability.available}, Weather: ${operationalState.weather}, Airspace: ${operationalState.airspace}. Re-planning required.`,
        status: 'REPLAN_TRIGGERED'
      });
    }

    res.json({
      success: true,
      updatedState: operationalState,
      requiresReplan
    });
  });

  // API 12: POST /api/reoptimise
  app.post('/api/reoptimise', (_req: Request, res: Response) => {
    decisionHistory.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      category: 'OPTIMISATION',
      title: 'Dynamic Re-Planning Completed',
      detail: 'Re-checked constraints, generated updated ranked options A/B/C with explainable deltas.',
      status: 'RE_OPTIMISED'
    });

    res.json({
      success: true,
      message: 'Dynamic Re-Planning pipeline executed successfully.'
    });
  });

  // API 13: POST /api/approve-demo
  app.post('/api/approve-demo', (req: Request, res: Response) => {
    const { optionId, decision, notes } = req.body;

    decisionHistory.unshift({
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      category: 'REVIEW',
      title: `Human Review Recorded: ${decision || 'APPROVED'}`,
      detail: `Commander reviewed ${optionId || 'Option A'}: ${notes || 'Plan confirmed and authorized for execution.'}`,
      status: decision || 'APPROVED'
    });

    res.json({
      success: true,
      optionId,
      decision: decision || 'APPROVED',
      message: 'Human-in-the-loop decision recorded to permanent audit trail.'
    });
  });

  // In development, mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const indexPath = path.resolve(distPath, 'index.html');

    if (fs.existsSync(indexPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(indexPath);
      });
    } else {
      // Standalone backend mode (e.g. Railway backend-only deployment)
      app.get('/', (_req: Request, res: Response) => {
        res.json({
          service: 'AirSync C2 Backend Engine (SIH26250)',
          status: 'ONLINE',
          health: '/health',
          environment: process.env.NODE_ENV || 'production',
          documentation: 'AirSync Real-Time Data Fusion & Optimization Engine',
          endpoints: [
            '/api/dashboard',
            '/api/data-sources',
            '/api/aircraft',
            '/api/crew',
            '/api/resources',
            '/api/airspace',
            '/api/weather',
            '/api/alerts',
            '/api/history',
            '/api/system-status',
            '/api/analyse (POST)',
            '/api/reoptimise (POST)',
            '/api/approve-demo (POST)'
          ]
        });
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AirSync C2 server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
