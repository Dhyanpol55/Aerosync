# AEROSYNC — AI-Driven Dynamic Air Operations & Resource Optimisation

> **Smart India Hackathon 2026** · Problem Statement ID: **SIH26250**  
> **Problem Creator:** Ministry of Defence (MoD) / Ministry of Education's Innovation Cell (MIC)  
> *"Unified intelligence for dynamic resource planning."*  
> *"From fragmented information to adaptive decision support. Analyse. Optimise. Adapt."*

---

## 1. Executive Summary

**AEROSYNC** is a simulated decision-support prototype developed for Smart India Hackathon 2026. It addresses the operational complexity of planning and dynamically retasking air operations in contested, rapidly shifting environments.

In legacy workflows, data regarding aircraft readiness, pilot fatigue, precision munition stockpiles, weather corridors, airspace constraints, and mission priorities reside in siloed systems. AEROSYNC demonstrates how multi-source data fusion, deterministic constraint satisfaction, and explainable AI algorithms provide human commanders with rapid, adaptive re-planning capabilities in under 3 seconds.

> **Simulation Disclaimer:**  
> AEROSYNC is a simulated decision-support prototype. All airframe identifiers, coordinates, weather fronts, stockpiles, and orders are fictional demonstration data. The application does not implement real-world targeting, weapons deployment, or classified military tactics.

---

## 2. Problem Statement (SIH26250)

- **Title:** Air Power - Dynamic Air Operations & Resource Optimisation
- **Category:** Software
- **Technology Bucket:** Transportation & Logistics
- **Description:** Complexity in planning and dynamically retasking air operations in a contested and rapidly changing operational environment. Information on aircraft availability, crew status, weapon loads, airspace, weather, threats, and mission priorities is generated across multiple systems but is not always available through a common, real-time decision-support framework, leading to increased planning timelines and sub-optimal allocation of scarce airpower resources.
- **Technology Opportunity:** AI-enabled decision-support, multi-source data fusion, predictive analytics, and optimisation algorithms.

---

## 3. End-to-End Decision Architecture

The platform operates via a structured 7-stage workflow:

```
MULTI-SOURCE DATA
  (Airframes, Crew, Stockpiles, Weather, Airspace)
        ↓
   DATA FUSION
  (Normalized state ingestion & latency < 250ms)
        ↓
   AI ANALYSIS
  (Combinatorial constraint identification)
        ↓
CONSTRAINT SOLVER
  (Deterministic rule scoring & bottleneck flagging)
        ↓
DYNAMIC RE-PLANNING
  (Adaptive asset reallocation upon condition changes)
        ↓
EXPLAINABLE SUPPORT
  (Factor influence weights: Weather, Crew, Airspace)
        ↓
   HUMAN REVIEW
  (1-Click STANAG 4015 / IAF Air Tasking Order export)
```

---

## 4. Key Prototype Features

### 4.1. Operational Overview
- **Real-time KPI metrics:** Fleet status (18 available / 24 total), crew readiness (87% ready / 120 total), resource capacity (76%), and airspace clearance (68%).
- **Multi-Source Data Fusion Pipeline:** Live visual diagram synthesizing aircraft, crew, weather, airspace, and munition streams into the AEROSYNC AI kernel.
- **AI Insight & Dynamic Re-Planning Card:** Immediate visual feedback with confidence scores and one-click shock simulation.

### 4.2. Resource Availability & Trend Analytics
- **4 Large Resource Cards:** Horizontal progress bars for Aircraft (82%), Crew (87%), Support (81%), and Airspace (68%).
- **Interactive Recharts Trend:** Tracking readiness indices across the last 6 simulated planning cycles.
- **Resource Pressure Badges:** Instant status indicators (Low, Medium, High).
- **Base-Level Munitions Stockpile Manager:** Tracks Precision-Guided Munitions (Astra Mk-1/2 BVRAAM, R-77, Meteor, SCALP EG, SPICE 2000, Hammer, RUDRAM Anti-Radiation Missiles) across Base Alpha, Base Bravo, and Base Charlie, alerting commanders on logistics bottlenecks.
- **Aerial Refueling & Tanker "Air Bridge" Calculator:** Dynamic orbit allocation for PEGASUS-01 (A330 MRTT / IL-78) with tactical unrefueled vs. refueled combat radius overlays.

### 4.3. AI Decision Engine (Primary Demo Screen)
- **Input Conditions Telemetry:** Live fleet readiness, weather ceilings, corridor regulations, and operational posture.
- **5-Step Analysis Animation:** 
  1. *Reading simulated data...*
  2. *Validating conditions...*
  3. *Checking constraints...*
  4. *Optimising resources...*
  5. *Generating recommendation...*
- **Explainable AI Reasoning:** Factor influence weights (Resource Availability, Crew Readiness, Airspace, Weather, Priority) and transparent 5-stage decision process.
- **Dynamic Change Simulation:** Simulates unexpected operational turbulence (18 → 15 available aircraft, degraded frontal weather, restricted corridors) prompting instant re-optimisation.
- **Side-by-Side Before vs. After Plan Comparison:** Displays resource capacity, condition delta, and planning status shifts.
- **Interactive Risk vs. Yield Optimization Slider:**
  - *Conservative / Force Protection:* Prioritizes aircraft survival and low threat exposure.
  - *Balanced:* Standard operational stance.
  - *High-Risk / High-Yield:* Prioritizes rapid target neutralization during surge operations.
- **1-Click STANAG 4015 / IAF ATO Export:** Formatted Air Tasking Order with Package IDs, callsigns, TOT windows, recovery bases, datalink frequencies, and IFF codes.
- **Audit Log Sidebar:** Historic timeline tracking every simulated iteration for state comparison and rollbacks.

### 4.4. What-If Scenario Stress Tester
- Interactive sliders for Aircraft Availability (0–100%), Crew Readiness (0–100%), and Resource Capacity (0–100%).
- Condition dropdowns for Weather (Clear, Moderate, Degraded), Airspace (Available, Limited, Restricted), and Priority (Low, Medium, High).
- Dual-column comparison (Baseline vs. What-If) with comparative bar charts.

### 4.5. Decision History
- Immutable timeline format with chronological logs (10:42 AM Baseline, 10:46 AM Change, 10:51 AM Scenario).
- Expandable cards showing inputs, constraints identified, selected recommendation, confidence score, and timestamp.

### 4.6. Light Mode (Default) & Dark Mode
- Built according to the exact SIH palette specifications with smooth 250–300ms transitions.
- Light mode: `#F7F9FC` background, `#FFFFFF` cards, `#0F172A` text, `#2563EB` primary accent.
- Dark mode: `#0B1120` background, `#111827` cards, `#F8FAFC` text, `#3B82F6` primary accent.
- State persists in `localStorage ('aerosync-theme')`.

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide React, Recharts.
- **Architecture:** Local deterministic constraint satisfaction kernel with client-side fallback ensuring 100% demo reliability without external paid APIs.
- **Data Layer:** High-fidelity simulated military datasets across bases, sectors, airframes, crews, and precision munitions.

---

## 6. Installation & Quickstart

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/example/aerosync.git
cd aerosync

# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build production bundle
npm run build
```

---

## 7. SIH Demonstration Workflow (2–3 Minutes)

1. **Landing Page:** Review the product tagline, core pillars (Data Fusion, AI Analysis, Dynamic Planning), and click **[ ENTER DEMO ]**.
2. **Overview:** Note the 4 KPI cards and the animated **Multi-Source Data Fusion Pipeline**.
3. **Simulate Operational Change:** Click **[ SIMULATE CHANGE ]** to trigger an operational shift (weather degrades, aircraft drop from 18 to 15).
4. **AI Decision Engine:** Click **[ RE-OPTIMISE ]**; watch the 5-step constraint-solving progress bar complete in ~2.5 seconds.
5. **Explainable AI:** Click **[ VIEW WHY ]** to explain how weather, crew fatigue, and priority influenced the decision.
6. **Risk vs. Yield Slider:** Slide from *Balanced* to *Force Protection* to demonstrate dynamic algorithmic stance adjustment.
7. **Generate ATO:** Click **[ 1-Click ATO Export ]** to view the NATO/STANAG formatted operational tasking order.
8. **Scenario Simulator:** Navigate to **Scenario** and run custom what-if stress tests.
9. **Decision History:** Navigate to **History** to review the auditable trail.

---

## 8. Security & Ethical Considerations

- **Human-in-the-Loop:** AEROSYNC is an advisory decision-support platform; human commanders retain ultimate authority.
- **Fictional Data Only:** Does not employ classified information, actual targeting data, or sensitive sovereign defense coordinates.
- **Role-Based Demonstration:** Simulates *Planner*, *Analyst*, and *Viewer* roles with mock access control.

---

## 9. Future Scope

- Integration with standard military data links (Link 16, OTH radar feeds).
- High-performance linear programming solvers (OR-Tools, Gurobi) for joint air-land coordination.
- Edge deployment for mobile tactical command containers and airborne command posts.
