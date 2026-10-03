import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useOperations } from '../context/OperationsContext';
import { Aircraft, Airbase } from '../types/operations';
import { 
  Plane, 
  MapPin, 
  CloudRain, 
  ShieldAlert, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Radio, 
  Eye, 
  Crosshair, 
  ArrowUpRight, 
  Info, 
  Fuel, 
  Layers, 
  Globe, 
  HelpCircle,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  Wind,
  ShieldCheck
} from 'lucide-react';

type TileProvider = 'satellite' | 'voyager' | 'dark' | 'topo';

interface TheaterPreset {
  id: string;
  label: string;
  shortLabel: string;
  coords: [number, number];
  zoom: number;
  badge: string;
  desc: string;
}

const THEATER_PRESETS: TheaterPreset[] = [
  {
    id: 'theater',
    label: 'Full Theater Overview',
    shortLabel: 'Theater',
    coords: [30.8, 75.6],
    zoom: 7,
    badge: 'HQ OVERVIEW',
    desc: 'Northern & Western Operational Airspace'
  },
  {
    id: 'ambala',
    label: 'AFS Ambala (7 Wing)',
    shortLabel: 'AFS Ambala',
    coords: [30.3752, 76.7725],
    zoom: 11,
    badge: 'RAFALE HUB',
    desc: 'Central Command · No. 17 Golden Arrows'
  },
  {
    id: 'pathankot',
    label: 'AFS Pathankot (18 Wing)',
    shortLabel: 'AFS Pathankot',
    coords: [32.2333, 75.6343],
    zoom: 11,
    badge: 'NORTH FORWARD',
    desc: 'Northern Forward Interceptor Airbase'
  },
  {
    id: 'jodhpur',
    label: 'AFS Jodhpur (32 Wing)',
    shortLabel: 'AFS Jodhpur',
    coords: [26.2518, 73.0489],
    zoom: 11,
    badge: 'SU-30MKI BASTION',
    desc: 'South-Western Command & FRA Tanker Fleet'
  },
  {
    id: 'cap_north',
    label: 'CAP Station (Corridor Alpha)',
    shortLabel: 'CAP North',
    coords: [33.85, 75.12],
    zoom: 9,
    badge: 'ACTIVE PATROL',
    desc: 'High-Altitude Air Superiority Orbit'
  },
  {
    id: 'tanker_bridge',
    label: 'Tanker Track (Corridor Charlie)',
    shortLabel: 'Tanker Orbit',
    coords: [28.85, 74.5],
    zoom: 9,
    badge: 'REFUELING ORBIT',
    desc: 'IL-78 Midas Air Refueling Anchor'
  }
];

// Additional recognized Indian Air Force airfields for authentic spatial awareness
const ADDITIONAL_STAGING_AIRFIELDS = [
  {
    id: 'AFS-HLW',
    name: 'AFS Halwara',
    code: 'HLW',
    wing: '9 Wing IAF',
    squadron: 'Su-30MKI Staging Wing',
    lat: 30.7500,
    lng: 75.6300,
    runway: 'RWY 13/31 — 2,740m'
  },
  {
    id: 'AFS-SRS',
    name: 'AFS Sirsa',
    code: 'SRS',
    wing: '21 Wing IAF',
    squadron: 'Forward Fighter Base',
    lat: 29.5300,
    lng: 75.0100,
    runway: 'RWY 05/23 — 2,740m'
  },
  {
    id: 'AFS-ADP',
    name: 'AFS Adampur',
    code: 'ADP',
    wing: '8 Wing IAF',
    squadron: 'No. 47 Sqn (Black Archers / MiG-29)',
    lat: 31.4300,
    lng: 75.7600,
    runway: 'RWY 13/31 — 2,743m'
  }
];

export const OperationalMap: React.FC = () => {
  const { 
    aircraft, 
    bases, 
    sectors, 
    selectedAircraft, 
    setSelectedAircraft,
    setSelectedBase,
    retaskAircraft
  } = useOperations();

  const [activeFilter, setActiveFilter] = useState<'all' | 'North Sector' | 'Central Sector' | 'South Sector'>('all');
  const [showWeather, setShowWeather] = useState(true);
  const [showThreats, setShowThreats] = useState(true);
  const [showFlightPaths, setShowFlightPaths] = useState(true);
  const [showAirbases, setShowAirbases] = useState(true);
  const [showCombatRadius, setShowCombatRadius] = useState(true);
  const [tileProvider, setTileProvider] = useState<TileProvider>('satellite');
  const [selectedEntity, setSelectedEntity] = useState<Aircraft | Airbase | null>(selectedAircraft || aircraft[0]);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>({ lat: 30.8245, lng: 75.6120 });
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Filter aircraft by active sector
  const filteredAircraft = activeFilter === 'all' 
    ? aircraft 
    : aircraft.filter(a => a.sector === activeFilter);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Theater center covering Northern & Western India
      const map = L.map(mapContainerRef.current, {
        center: [30.8, 75.6],
        zoom: 7,
        minZoom: 5,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Add scale control
      L.control.scale({ position: 'bottomright', metric: true, imperial: true }).addTo(map);

      // Track cursor coordinates
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords({
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4))
        });
      });

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
    }

    // Auto resize observer so map never renders partially when tabs switch or layout changes
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Staggered size invalidation checks for smooth initial render
    const t1 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150);
    const t2 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 400);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile layer and label overlays based on tileProvider
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (labelsTileLayerRef.current) {
      map.removeLayer(labelsTileLayerRef.current);
      labelsTileLayerRef.current = null;
    }

    if (tileProvider === 'satellite') {
      // 1. ESRI World Imagery Photorealistic Satellite Base
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
      baseTileLayerRef.current = satLayer;

      // 2. High-contrast Boundaries, State Lines, & City Labels Overlay
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, opacity: 0.95 }
      ).addTo(map);
      labelsTileLayerRef.current = labelsLayer;

    } else if (tileProvider === 'voyager') {
      // Carto Voyager: High-contrast Aeronautical Navigation Cartography with clear cities, roads, elevation
      const voyagerLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
      baseTileLayerRef.current = voyagerLayer;

    } else if (tileProvider === 'dark') {
      // Carto Dark: Tactical Stealth Night Operations C2 with clear geopolitical labels
      const darkLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
      baseTileLayerRef.current = darkLayer;

    } else if (tileProvider === 'topo') {
      // OpenStreetMap Topographic Cartography
      const topoLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      ).addTo(map);
      baseTileLayerRef.current = topoLayer;
    }
  }, [tileProvider]);

  // Update operational markers, flight corridors, SAM rings, and airbases
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Draw Flight Corridors (Real geographic polylines connecting tactical stations)
    if (showFlightPaths) {
      // Corridor Alpha: Base-A to Northern CAP Station (Srinagar/Jammu to Pir Panjal vector)
      const corridorAlpha = L.polyline([
        [32.2333, 75.6343],
        [32.7314, 74.8722],
        [33.4500, 75.1200],
        [34.1800, 74.8500],
        [34.6200, 75.6000]
      ], {
        color: '#06b6d4',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.9
      }).bindTooltip('CORRIDOR ALPHA — NORTHERN CAP VECTOR (VFR/IFR CLEARED)', { 
        permanent: false, 
        className: 'tactical-tooltip font-mono text-xs' 
      });
      group.addLayer(corridorAlpha);

      // Corridor Bravo: Ambala to Western Strike Route
      const corridorBravo = L.polyline([
        [30.3752, 76.7725],
        [31.2500, 75.9000],
        [31.9500, 75.2500],
        [32.4000, 74.6000]
      ], {
        color: '#6366f1',
        weight: 3,
        dashArray: '8, 6',
        opacity: 0.9
      }).bindTooltip('CORRIDOR BRAVO — STRATEGIC SEAD STRIKE ROUTE', { 
        permanent: false, 
        className: 'tactical-tooltip font-mono text-xs' 
      });
      group.addLayer(corridorBravo);

      // Corridor Charlie: Tanker Refueling Air Bridge from Jodhpur to Ambala
      const corridorCharlie = L.polyline([
        [26.2518, 73.0489],
        [27.4500, 73.8000],
        [28.8500, 74.5000],
        [29.8000, 75.6000],
        [30.3752, 76.7725]
      ], {
        color: '#10b981',
        weight: 2.5,
        dashArray: '4, 4',
        opacity: 0.85
      }).bindTooltip('CORRIDOR CHARLIE — IL-78 TANKER REFUELING AIR BRIDGE', { 
        permanent: false, 
        className: 'tactical-tooltip font-mono text-xs' 
      });
      group.addLayer(corridorCharlie);
    }

    // 2. Draw Combat Radii Rings around Airbases
    if (showCombatRadius && showAirbases) {
      bases.forEach(base => {
        const lat = base.latitude ?? (base.id === 'BASE-A' ? 32.2333 : base.id === 'BASE-B' ? 30.3752 : 26.2518);
        const lng = base.longitude ?? (base.id === 'BASE-A' ? 75.6343 : base.id === 'BASE-B' ? 76.7725 : 73.0489);

        // Unrefueled Combat Radius (~450 km / 240 NM)
        const unrefueledCircle = L.circle([lat, lng], {
          radius: 450000,
          color: '#0284c7',
          fillColor: '#0284c7',
          fillOpacity: 0.04,
          weight: 1.5,
          dashArray: '5, 5'
        }).bindTooltip(`${base.name}: UNREFUELED COMBAT RADIUS (450 KM / 240 NM)`, { permanent: false });
        group.addLayer(unrefueledCircle);

        // Extended Refueled Combat Radius (~850 km / 460 NM)
        const refueledCircle = L.circle([lat, lng], {
          radius: 850000,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.02,
          weight: 1.2,
          dashArray: '8, 8'
        }).bindTooltip(`${base.name}: AERIAL REFUELED RADIUS (850 KM / 460 NM)`, { permanent: false });
        group.addLayer(refueledCircle);
      });
    }

    // 3. Draw SAM Threat Rings & Lethality Envelopes
    if (showThreats) {
      // Long-range Contested Missile Envelope
      const samNorthCenter = [34.15, 74.35] as [number, number];
      
      const samOuter = L.circle(samNorthCenter, {
        radius: 220000, // 220 km detection zone
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.09,
        weight: 1.8,
        dashArray: '6, 6'
      }).bindTooltip('⚠️ S-400 / LONG-RANGE SAM DETECTION ENVELOPE (220 KM)', { permanent: false });
      group.addLayer(samOuter);

      const samInner = L.circle(samNorthCenter, {
        radius: 120000, // 120 km high-kill zone
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.20,
        weight: 2.2
      }).bindTooltip('⛔ HIGH-KILL LETHALITY ZONE (120 KM WEAPONS ENGAGEMENT)', { permanent: false });
      group.addLayer(samInner);

      // Central Sector Medium-Range Air Defense Battery
      const samCentral = L.circle([31.90, 74.45], {
        radius: 95000,
        color: '#ea580c',
        fillColor: '#ea580c',
        fillOpacity: 0.14,
        weight: 1.8,
        dashArray: '4, 4'
      }).bindTooltip('⚠️ MEDIUM-RANGE AIR DEFENSE BATTERY (95 KM)', { permanent: false });
      group.addLayer(samCentral);
    }

    // 4. Draw Convective Weather Storm Cells
    if (showWeather) {
      const weatherStorm = L.circle([33.85, 75.75], {
        radius: 75000,
        color: '#eab308',
        fillColor: '#eab308',
        fillOpacity: 0.22,
        weight: 2,
        dashArray: '4, 6'
      }).bindTooltip('⚡ SEVERE CONVECTIVE STORM CELL — TOPS FL480 (ZERO VMC / PASS CLOSED)', { permanent: false });
      group.addLayer(weatherStorm);
    }

    // 5. Draw Additional Staging IAF Airfields (Halwara, Sirsa, Adampur)
    if (showAirbases) {
      ADDITIONAL_STAGING_AIRFIELDS.forEach(field => {
        const markerHtml = `
          <div class="cursor-pointer group flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <div class="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-400 flex items-center justify-center shadow-md">
              <div class="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
            </div>
            <div class="mt-0.5 px-1 py-0.2 bg-slate-950/90 border border-slate-700 rounded text-[8px] font-mono text-indigo-300 shadow whitespace-nowrap">
              ${field.code}
            </div>
          </div>
        `;

        const stagingMarker = L.marker([field.lat, field.lng], {
          icon: L.divIcon({
            html: markerHtml,
            className: 'staging-airbase-marker',
            iconSize: [20, 20]
          })
        });

        stagingMarker.bindPopup(`
          <div class="p-2 font-mono text-xs text-slate-100 bg-slate-950 rounded border border-indigo-500/50 shadow-xl max-w-[240px]">
            <div class="font-bold text-indigo-400 text-sm">${field.name}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${field.wing} · ${field.squadron}</div>
            <div class="mt-2 space-y-1 text-[11px] text-slate-300">
              <div>Runway: <strong class="text-white">${field.runway}</strong></div>
              <div>Status: <strong class="text-emerald-400">Operational Staging Airfield</strong></div>
              <div>TACAN: <strong class="text-cyan-400">CH-62X</strong></div>
            </div>
          </div>
        `);

        group.addLayer(stagingMarker);
      });
    }

    // 6. Draw Primary Airbases (AFS Ambala, AFS Pathankot, AFS Jodhpur)
    if (showAirbases) {
      bases.forEach(base => {
        const isBaseA = base.id === 'BASE-A';
        const isBaseB = base.id === 'BASE-B';
        const isBaseC = base.id === 'BASE-C';

        const lat = base.latitude ?? (isBaseA ? 32.2333 : isBaseB ? 30.3752 : 26.2518);
        const lng = base.longitude ?? (isBaseA ? 75.6343 : isBaseB ? 76.7725 : 73.0489);

        const realBaseName = isBaseB 
          ? 'AFS Ambala (7 Wing IAF)' 
          : isBaseA 
          ? 'AFS Pathankot (18 Wing IAF)' 
          : 'AFS Jodhpur (32 Wing IAF)';

        const realIcao = isBaseB ? 'VIAM' : isBaseA ? 'VIPK' : 'VIJO';
        const squadrons = isBaseB 
          ? 'No. 17 "Golden Arrows" (Rafale) & No. 5 (Jaguar)' 
          : isBaseA 
          ? 'No. 26 "Warriors" & Forward QRA Interceptors' 
          : 'No. 222 "Tigersharks" (Su-30MKI) & FRA Tankers';

        const isBaseSelected = selectedEntity && 'id' in selectedEntity && selectedEntity.id === base.id;

        const baseIconHtml = `
          <div class="cursor-pointer group flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${
                base.runwayStatus === 'Operational' ? 'bg-cyan-400 opacity-60' : 'bg-rose-400 opacity-70'
              }"></span>
              <div class="w-5 h-5 rounded-full ${
                isBaseSelected 
                  ? 'bg-cyan-400 ring-4 ring-cyan-400/60 shadow-xl shadow-cyan-400/60' 
                  : 'bg-slate-900 border-2 border-cyan-400 ring-2 ring-cyan-500/40'
              } flex items-center justify-center">
                <div class="w-2 h-2 rounded-full ${isBaseSelected ? 'bg-white' : 'bg-cyan-300'}"></div>
              </div>
            </div>
            <div class="mt-1 px-2 py-0.5 bg-slate-950/95 border border-cyan-500/80 rounded-md text-[10px] font-mono font-bold text-cyan-300 shadow-lg whitespace-nowrap flex items-center gap-1">
              <span>● ${realIcao}</span>
              <span class="text-slate-400 font-normal">| ${base.id}</span>
            </div>
          </div>
        `;

        const baseMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: baseIconHtml,
            className: 'base-marker',
            iconSize: [28, 28]
          })
        });

        baseMarker.on('click', () => {
          setSelectedEntity(base);
          setSelectedBase(base);
        });

        baseMarker.bindPopup(`
          <div class="p-2.5 font-mono text-xs text-slate-100 bg-slate-950 rounded-lg border border-cyan-500/60 shadow-2xl min-w-[260px]">
            <div class="flex items-center justify-between">
              <span class="font-bold text-cyan-400 text-sm">${realBaseName}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">ICAO: ${realIcao}</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">${squadrons}</div>
            <div class="mt-2.5 space-y-1.5 text-[11px] border-t border-slate-800 pt-2">
              <div class="flex justify-between"><span>Runway Status:</span> <strong class="text-emerald-400">${base.runwayStatus}</strong></div>
              <div class="flex justify-between"><span>Stationed Aircraft:</span> <strong class="text-white">${base.aircraftCount} Fighter Sorties</strong></div>
              <div class="flex justify-between"><span>Aviation Fuel Reserve:</span> <strong class="text-cyan-400">${base.fuelCapacityPct}% (Jet A-1)</strong></div>
              <div class="flex justify-between"><span>Munitions Stockpile:</span> <strong class="text-indigo-400">${base.munitionsCapacityPct}% Ready</strong></div>
              <div class="flex justify-between"><span>QRA Defense Posture:</span> <strong class="text-amber-400 font-bold">${base.alertLevel}</strong></div>
            </div>
          </div>
        `);

        group.addLayer(baseMarker);
      });
    }

    // 7. Draw Aircraft with Accurate Heading and Realistic Jet Silhouette
    filteredAircraft.forEach(ac => {
      const lat = ac.latitude ?? Number((34.8 - (ac.y / 100) * 8.2).toFixed(4));
      const lng = ac.longitude ?? Number((72.4 + (ac.x / 100) * 11.6).toFixed(4));

      const isSelected = selectedEntity && 'id' in selectedEntity && selectedEntity.id === ac.id;
      const isAvailable = ac.status === 'available';
      const isMaintenance = ac.status === 'maintenance';
      const isAirborne = ac.altitudeFt > 0;

      const statusColor = isAvailable 
        ? 'border-emerald-400 bg-emerald-950/95 text-emerald-300' 
        : isMaintenance 
        ? 'border-amber-400 bg-amber-950/95 text-amber-300' 
        : 'border-cyan-400 bg-cyan-950/95 text-cyan-300';

      const aircraftIconHtml = `
        <div class="cursor-pointer group flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-115'
        }">
          <div 
            style="transform: rotate(${ac.heading}deg); transition: transform 0.6s ease-out;"
            class="w-5 h-5 rounded-full flex items-center justify-center border-2 ${statusColor} shadow-md ${
              isSelected ? 'ring-3 ring-cyan-400 shadow-cyan-400/70' : ''
            }"
          >
            <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div class="px-1.5 py-0.5 bg-slate-950/95 border border-slate-700/80 rounded text-[9px] font-mono text-slate-100 whitespace-nowrap shadow-md flex items-center gap-1">
            <span class="font-bold text-white">${ac.callsign}</span>
            ${isAirborne ? `<span class="text-cyan-400 font-semibold">FL${Math.round(ac.altitudeFt / 1000)}</span>` : '<span class="text-emerald-400">PAD</span>'}
          </div>
        </div>
      `;

      const acMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          html: aircraftIconHtml,
          className: 'aircraft-marker',
          iconSize: [24, 24]
        })
      });

      acMarker.on('click', () => {
        setSelectedEntity(ac);
        setSelectedAircraft(ac);
      });

      // Draw active flight trail for selected aircraft if airborne
      if (isSelected && isAirborne) {
        const headingRad = (ac.heading * Math.PI) / 180;
        const trailStart = [
          lat - Math.cos(headingRad) * 0.45,
          lng - Math.sin(headingRad) * 0.45
        ] as [number, number];
        const vectorTarget = [
          lat + Math.cos(headingRad) * 0.55,
          lng + Math.sin(headingRad) * 0.55
        ] as [number, number];

        const flightTrail = L.polyline([trailStart, [lat, lng]], {
          color: '#38bdf8',
          weight: 2,
          dashArray: '3, 5',
          opacity: 0.7
        });
        group.addLayer(flightTrail);

        const headingVector = L.polyline([[lat, lng], vectorTarget], {
          color: '#06b6d4',
          weight: 2.5,
          opacity: 0.95
        });
        group.addLayer(headingVector);
      }

      group.addLayer(acMarker);
    });

  }, [filteredAircraft, bases, showWeather, showThreats, showFlightPaths, showAirbases, showCombatRadius, selectedEntity]);

  // Jump camera to specific geographic target
  const jumpToLocation = (coords: [number, number], zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  };

  // Focus on currently selected entity
  const handleFocusSelected = () => {
    if (!mapInstanceRef.current || !selectedEntity) return;

    if ('latitude' in selectedEntity && selectedEntity.latitude && selectedEntity.longitude) {
      mapInstanceRef.current.flyTo([selectedEntity.latitude, selectedEntity.longitude], 10, { duration: 1.2 });
    } else if ('y' in selectedEntity && 'x' in selectedEntity) {
      const lat = Number((34.8 - (selectedEntity.y / 100) * 8.2).toFixed(4));
      const lng = Number((72.4 + (selectedEntity.x / 100) * 11.6).toFixed(4));
      mapInstanceRef.current.flyTo([lat, lng], 10, { duration: 1.2 });
    }
  };

  const zoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const zoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification Banner (Replaces window.alert) */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 max-w-md bg-slate-900 border border-cyan-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-xs font-mono font-medium">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Layer Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-100 font-mono uppercase">
              Actual Tactical Operational Airspace Map
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/70 rounded font-bold">
              REAL WGS-84 GIS TILES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700/70 rounded font-bold">
              IAF WESTERN & NORTHERN THEATER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real high-resolution satellite imagery, actual Air Force Stations (Ambala, Pathankot, Jodhpur), S-400 threat envelopes, and real-time aircraft vectors.
          </p>
        </div>

        {/* Action Controls & Legend Guide Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* How to Read This Map / Airspace Guide Button */}
          <button
            onClick={() => setShowGuideModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Airspace Guide &amp; Legend</span>
          </button>

          {/* Tile Layer Provider Switcher */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <button
              onClick={() => setTileProvider('satellite')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                tileProvider === 'satellite' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="ESRI Photorealistic Satellite Imagery with Places & Borders Overlay"
            >
              <Globe className="w-3 h-3" />
              <span>Satellite Recon</span>
            </button>
            <button
              onClick={() => setTileProvider('voyager')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                tileProvider === 'voyager' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="High-Contrast Tactical Aeronautical Chart"
            >
              <Navigation className="w-3 h-3" />
              <span>Aero Chart</span>
            </button>
            <button
              onClick={() => setTileProvider('dark')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                tileProvider === 'dark' ? 'bg-cyan-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="CartoDB Tactical Dark Map"
            >
              <Layers className="w-3 h-3" />
              <span>Tactical Dark</span>
            </button>
            <button
              onClick={() => setTileProvider('topo')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                tileProvider === 'topo' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="OpenStreetMap Topographic Terrain"
            >
              <Compass className="w-3 h-3" />
              <span>Terrain</span>
            </button>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => setShowWeather(!showWeather)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                showWeather ? 'bg-amber-950/70 border-amber-600/70 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Convective Weather Cells"
            >
              <CloudRain className="w-3 h-3" />
              <span>Weather</span>
            </button>
            <button
              onClick={() => setShowThreats(!showThreats)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                showThreats ? 'bg-rose-950/70 border-rose-600/70 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle S-400 and SAM Lethality Rings"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Threats</span>
            </button>
            <button
              onClick={() => setShowFlightPaths(!showFlightPaths)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                showFlightPaths ? 'bg-indigo-950/70 border-indigo-600/70 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Tactical Flight Corridors"
            >
              <Radio className="w-3 h-3" />
              <span>Corridors</span>
            </button>
            <button
              onClick={() => setShowCombatRadius(!showCombatRadius)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                showCombatRadius ? 'bg-teal-950/80 border-teal-600/70 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Combat Radii Rings"
            >
              <Fuel className="w-3 h-3" />
              <span>Ranges</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick-Jump Theater Locations Bar (Makes map super easy and fast to explore) */}
      <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 pl-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Jump:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {THEATER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => jumpToLocation(preset.coords, preset.zoom)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              title={`${preset.label} — ${preset.desc}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="font-semibold">{preset.shortLabel}</span>
              <span className="text-[10px] text-cyan-300/80 font-normal hidden sm:inline">({preset.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tactical Map Viewport + Real-Time Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Real Leaflet Map Container */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden h-[580px] sm:h-[650px] shadow-2xl flex flex-col">
          {/* Top In-Map HUD Strip */}
          <div className="absolute top-3 left-3 right-3 z-400 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 font-mono text-xs flex items-center gap-2 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold text-slate-100 uppercase text-[11px]">
                  THEATER: WESTERN &amp; NORTHERN COMMAND
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400 font-semibold text-[11px]">
                  {tileProvider === 'satellite' 
                    ? 'ESRI HIGH-RES SATELLITE + HYBRID PLACES' 
                    : tileProvider === 'voyager'
                    ? 'CARTO VOYAGER AERO-NAVIGATION'
                    : tileProvider === 'dark' 
                    ? 'CARTO TACTICAL DARK C2' 
                    : 'OSM TOPOGRAPHIC'}
                </span>
              </div>
            </div>

            {/* Quick Map Controls (Zoom, Reset, Focus) */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={handleFocusSelected}
                className="p-1.5 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow cursor-pointer"
                title="Focus on Selected Entity"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={() => jumpToLocation([30.8, 75.6], 7)}
                className="p-1.5 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow cursor-pointer"
                title="Reset Theater View"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <div className="flex items-center bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-0.5 shadow">
                <button
                  onClick={zoomIn}
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={zoomOut}
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Leaflet DOM Anchor */}
          <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

          {/* Bottom Live Cursor Coordinates & Telemetry Telemetry Bar */}
          <div className="absolute bottom-2 left-2 right-2 z-400 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded border border-slate-800 font-mono text-[10px] text-slate-300 flex items-center gap-3 shadow-md pointer-events-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">CURSOR:</span>
                <span className="text-white font-semibold">
                  {cursorCoords ? `${cursorCoords.lat.toFixed(4)}° N, ${cursorCoords.lng.toFixed(4)}° E` : 'SCANNING...'}
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">DATUM: WGS-84</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-semibold">AIRSPACE: SECURE</span>
            </div>

            <div className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 font-mono text-[10px] text-slate-400 shadow-md hidden sm:flex items-center gap-2 pointer-events-auto">
              <span>TRACKED CONTACTS: <strong className="text-slate-100">{filteredAircraft.length} SORTIES</strong></span>
              <span className="text-slate-600">|</span>
              <span>BASES: <strong className="text-cyan-400">{bases.length} HUBS + 3 FORWARD STAGING</strong></span>
            </div>
          </div>
        </div>

        {/* Right Tactical Inspector Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-4 overflow-y-auto max-h-[580px] sm:max-h-[650px] pr-1">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                TACTICAL INSPECTOR
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                LIVE TELEMETRY
              </span>
            </div>

            {selectedEntity && 'callsign' in selectedEntity ? (
              /* AIRCRAFT DETAILS */
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">CALLSIGN &amp; TYPE</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      (selectedEntity as Aircraft).status === 'available' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' 
                        : (selectedEntity as Aircraft).status === 'maintenance'
                        ? 'bg-amber-950 text-amber-400 border border-amber-700'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    }`}>
                      {(selectedEntity as Aircraft).status}
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-white mt-0.5">{(selectedEntity as Aircraft).callsign}</div>
                  <div className="text-xs text-cyan-300">{(selectedEntity as Aircraft).id} · {(selectedEntity as Aircraft).baseName}</div>
                </div>

                {/* Real Geographic Coordinates Card */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-900/60 font-mono text-xs space-y-1.5">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block tracking-wider">
                    REAL-TIME GEO-TELEMETRY
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px]">LATITUDE</span>
                      <span className="text-white font-bold">
                        {((selectedEntity as Aircraft).latitude ?? 32.7314).toFixed(4)}° N
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">LONGITUDE</span>
                      <span className="text-white font-bold">
                        {((selectedEntity as Aircraft).longitude ?? 74.8722).toFixed(4)}° E
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">WAYPOINT DIST</span>
                      <span className="text-cyan-300 font-bold">
                        {((selectedEntity as Aircraft).distanceToWaypointNm ?? 18.5).toFixed(1)} NM
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">TIME ON TARGET</span>
                      <span className="text-amber-300 font-bold tabular-nums">
                        {Math.floor(((selectedEntity as Aircraft).totSeconds ?? 240) / 60).toString().padStart(2, '0')}:
                        {(((selectedEntity as Aircraft).totSeconds ?? 240) % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">HEADING VECTOR</span>
                      <span className="text-slate-200 font-bold">
                        {(selectedEntity as Aircraft).heading}° MAG
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">FUEL STATE</span>
                      <span className="text-emerald-400 font-bold">
                        {(selectedEntity as Aircraft).fuelState}% (-0.1%/3s)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Platform Type:</span>
                    <span className="text-slate-200 font-semibold">{(selectedEntity as Aircraft).type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Readiness:</span>
                    <span className="text-emerald-400 font-bold">{(selectedEntity as Aircraft).readiness}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Assigned Crew:</span>
                    <span className="text-slate-200 font-semibold">{(selectedEntity as Aircraft).pilotAssigned || 'READY / STANDBY'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Altitude / Airspeed:</span>
                    <span className="text-slate-200">{(selectedEntity as Aircraft).altitudeFt} FT · {(selectedEntity as Aircraft).airSpeedKnots} KTS</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400 block text-[10px] mb-1 font-semibold uppercase">Ordnance Loadout:</span>
                  <p className="text-slate-200 text-[11px] font-medium leading-relaxed">
                    {(selectedEntity as Aircraft).weaponLoad}
                  </p>
                </div>
              </div>
            ) : selectedEntity && 'code' in selectedEntity ? (
              /* AIRBASE DETAILS */
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono">
                  <div className="text-[10px] text-slate-400">AIRBASE HUBS</div>
                  <div className="text-lg font-bold text-cyan-400">
                    {(selectedEntity as Airbase).id === 'BASE-B' ? 'AFS Ambala' : (selectedEntity as Airbase).id === 'BASE-A' ? 'AFS Pathankot' : 'AFS Jodhpur'}
                  </div>
                  <div className="text-xs text-slate-200 font-medium">{(selectedEntity as Airbase).name}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    COORDINATES: {((selectedEntity as Airbase).latitude ?? 30.3752).toFixed(4)}° N, {((selectedEntity as Airbase).longitude ?? 76.7725).toFixed(4)}° E
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Runway Status:</span>
                    <span className="text-emerald-400 font-bold">{(selectedEntity as Airbase).runwayStatus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Stationed Aircraft:</span>
                    <span className="text-slate-200 font-bold">{(selectedEntity as Airbase).aircraftCount} Platforms</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Fuel Reserve Pool:</span>
                    <span className="text-cyan-400 font-bold">{(selectedEntity as Airbase).fuelCapacityPct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Munitions Stockpile:</span>
                    <span className="text-indigo-400 font-bold">{(selectedEntity as Airbase).munitionsCapacityPct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Defense Posture:</span>
                    <span className="text-amber-400 font-bold">{(selectedEntity as Airbase).alertLevel}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Quick Retask Trigger */}
          <div className="pt-3 border-t border-slate-800 mt-3 space-y-2">
            {selectedEntity && 'callsign' in selectedEntity && (
              <button
                onClick={() => {
                  retaskAircraft((selectedEntity as Aircraft).id, 'Scramble Retask — Sector A Corridor', 'North Sector');
                  triggerToast(`Platform ${(selectedEntity as Aircraft).id} (${(selectedEntity as Aircraft).callsign}) re-tasked to Sector A CAP.`);
                }}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>DYNAMIC RE-TASK PLATFORM</span>
              </button>
            )}

            <p className="text-[10px] text-slate-500 text-center font-mono">
              Live link to Multi-Source Tactical Data Fusion Bus
            </p>
          </div>
        </div>
      </div>

      {/* Airspace Guide & Legend Modal (Directly answers 'by which user gets to know easily') */}
      {showGuideModal && (
        <div className="fixed inset-0 z-500 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase">
                  How to Read the Tactical Operational Map
                </h3>
              </div>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This tactical map fuses real GIS satellite coordinates with active air defense radar envelopes, combat ranges, and real-time fighter sorties across the Western and Northern Indian airspace.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {/* Airbase Radii */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <div className="w-3 h-3 rounded-full border-2 border-cyan-400"></div>
                  <span>Blue Rings (450 KM)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-normal font-sans">
                  <strong>Unrefueled Combat Radius</strong>: Normal operating range without tanker support. Sorties within this zone can engage and return safely.
                </p>
              </div>

              {/* Refueled Radii */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <div className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-400"></div>
                  <span>Green Rings (850 KM)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-normal font-sans">
                  <strong>Extended Refueled Radius</strong>: Multiplied combat reach made possible with IL-78 Midas tanker refueling along Corridor Charlie.
                </p>
              </div>

              {/* S-400 Threat */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500"></div>
                  <span>Red Threat Zones</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-normal font-sans">
                  <strong>S-400 SAM Lethality Envelope</strong>: 220 km radar detection zone (outer dashed ring) and 120 km weapon kill zone (inner solid red circle).
                </p>
              </div>

              {/* Weather Cells */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-dashed border-amber-500"></div>
                  <span>Yellow Cells (Weather)</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-normal font-sans">
                  <strong>Radar Storm Cell</strong>: Severe convective turbulence tops FL480. Mountain passes closed to low-altitude transit.
                </p>
              </div>
            </div>

            {/* Aircraft Icons Guide */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-cyan-400 font-bold block uppercase tracking-wider">
                Aircraft Status &amp; Vectors
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-sans">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span><strong>Green</strong>: Ready on Ground / Available</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span><strong>Cyan</strong>: Airborne Mission on Vector</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span><strong>Amber</strong>: Standby / Maintenance</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                GOT IT, RETURN TO MAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
