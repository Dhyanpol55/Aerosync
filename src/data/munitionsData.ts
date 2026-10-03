import { BaseMunitionsStockpile, TankerAirBridge, AirTaskingOrder } from '../types/operations';

export const INITIAL_MUNITIONS_STOCKPILE: BaseMunitionsStockpile[] = [
  {
    baseId: 'BASE-A',
    baseName: 'Base-A (Northern Forward Hub)',
    munitions: [
      // Air-to-Air
      {
        id: 'MUN-ASTRA-A',
        name: 'Astra Mk-1/2 BVRAAM',
        category: 'Air-to-Air',
        stockCount: 28,
        maxCapacity: 40,
        minThreshold: 12,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Indigenous dual-pulse solid motor active radar BVR missile (110-160 km)'
      },
      {
        id: 'MUN-METEOR-A',
        name: 'Meteor BVRAAM',
        category: 'Air-to-Air',
        stockCount: 16,
        maxCapacity: 24,
        minThreshold: 8,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Ramjet-powered BVRAAM with 60km+ no-escape zone'
      },
      {
        id: 'MUN-R77-A',
        name: 'R-77 (RVV-AE)',
        category: 'Air-to-Air',
        stockCount: 22,
        maxCapacity: 35,
        minThreshold: 10,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Active radar homing medium-range missile with lattice control fins'
      },
      // Air-to-Ground
      {
        id: 'MUN-SCALP-A',
        name: 'SCALP EG Standoff Cruise Missile',
        category: 'Air-to-Ground',
        stockCount: 6,
        maxCapacity: 12,
        minThreshold: 4,
        isShortage: false,
        compatiblePlatforms: ['Deep Penetration Strike', 'Multi-Role Superiority'],
        unitDescription: 'Long-range low-observable deep bunker penetrator (500 km)'
      },
      {
        id: 'MUN-SPICE-A',
        name: 'SPICE 2000 Guidance Kit',
        category: 'Air-to-Ground',
        stockCount: 14,
        maxCapacity: 20,
        minThreshold: 6,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Autonomous electro-optical scene-matching glide bomb (60 km)'
      },
      {
        id: 'MUN-HAMMER-A',
        name: 'Hammer PGMs (AASM)',
        category: 'Air-to-Ground',
        stockCount: 18,
        maxCapacity: 25,
        minThreshold: 6,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Modular rocket-boosted precision-guided munition (70 km)'
      },
      {
        id: 'MUN-RUDRAM-A',
        name: 'RUDRAM Anti-Radiation Missile (NGARM)',
        category: 'Air-to-Ground',
        stockCount: 0, // CRITICAL: 0 Stock triggers the SEAD Logistics Bottleneck!
        maxCapacity: 16,
        minThreshold: 6,
        isShortage: true,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Millimetric passive radar seeker anti-radiation missile for SEAD operations'
      }
    ]
  },
  {
    baseId: 'BASE-B',
    baseName: 'Base-B (Central Strategic Command)',
    munitions: [
      {
        id: 'MUN-ASTRA-B',
        name: 'Astra Mk-1/2 BVRAAM',
        category: 'Air-to-Air',
        stockCount: 34,
        maxCapacity: 45,
        minThreshold: 12,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Indigenous dual-pulse solid motor active radar BVR missile'
      },
      {
        id: 'MUN-METEOR-B',
        name: 'Meteor BVRAAM',
        category: 'Air-to-Air',
        stockCount: 20,
        maxCapacity: 25,
        minThreshold: 8,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Ramjet-powered BVRAAM with 60km+ no-escape zone'
      },
      {
        id: 'MUN-R77-B',
        name: 'R-77 (RVV-AE)',
        category: 'Air-to-Air',
        stockCount: 26,
        maxCapacity: 35,
        minThreshold: 10,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Active radar homing medium-range missile'
      },
      {
        id: 'MUN-SCALP-B',
        name: 'SCALP EG Standoff Cruise Missile',
        category: 'Air-to-Ground',
        stockCount: 11,
        maxCapacity: 15,
        minThreshold: 4,
        isShortage: false,
        compatiblePlatforms: ['Deep Penetration Strike', 'Multi-Role Superiority'],
        unitDescription: 'Long-range low-observable deep bunker penetrator'
      },
      {
        id: 'MUN-SPICE-B',
        name: 'SPICE 2000 Guidance Kit',
        category: 'Air-to-Ground',
        stockCount: 18,
        maxCapacity: 22,
        minThreshold: 6,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Autonomous electro-optical scene-matching glide bomb'
      },
      {
        id: 'MUN-HAMMER-B',
        name: 'Hammer PGMs (AASM)',
        category: 'Air-to-Ground',
        stockCount: 22,
        maxCapacity: 30,
        minThreshold: 6,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Modular rocket-boosted precision-guided munition'
      },
      {
        id: 'MUN-RUDRAM-B',
        name: 'RUDRAM Anti-Radiation Missile (NGARM)',
        category: 'Air-to-Ground',
        stockCount: 14, // Base B has surplus available for airlift transfer
        maxCapacity: 18,
        minThreshold: 6,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Millimetric passive radar seeker anti-radiation missile'
      }
    ]
  },
  {
    baseId: 'BASE-C',
    baseName: 'FOB-Charlie (Southern Bastion)',
    munitions: [
      {
        id: 'MUN-ASTRA-C',
        name: 'Astra Mk-1/2 BVRAAM',
        category: 'Air-to-Air',
        stockCount: 18,
        maxCapacity: 30,
        minThreshold: 10,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Indigenous dual-pulse solid motor active radar BVR missile'
      },
      {
        id: 'MUN-METEOR-C',
        name: 'Meteor BVRAAM',
        category: 'Air-to-Air',
        stockCount: 8,
        maxCapacity: 15,
        minThreshold: 6,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Ramjet-powered BVRAAM with 60km+ no-escape zone'
      },
      {
        id: 'MUN-R77-C',
        name: 'R-77 (RVV-AE)',
        category: 'Air-to-Air',
        stockCount: 15,
        maxCapacity: 25,
        minThreshold: 8,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Active radar homing medium-range missile'
      },
      {
        id: 'MUN-SCALP-C',
        name: 'SCALP EG Standoff Cruise Missile',
        category: 'Air-to-Ground',
        stockCount: 4,
        maxCapacity: 8,
        minThreshold: 2,
        isShortage: false,
        compatiblePlatforms: ['Deep Penetration Strike'],
        unitDescription: 'Long-range low-observable deep bunker penetrator'
      },
      {
        id: 'MUN-SPICE-C',
        name: 'SPICE 2000 Guidance Kit',
        category: 'Air-to-Ground',
        stockCount: 9,
        maxCapacity: 15,
        minThreshold: 4,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Autonomous electro-optical scene-matching glide bomb'
      },
      {
        id: 'MUN-HAMMER-C',
        name: 'Hammer PGMs (AASM)',
        category: 'Air-to-Ground',
        stockCount: 10,
        maxCapacity: 20,
        minThreshold: 5,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority'],
        unitDescription: 'Modular rocket-boosted precision-guided munition'
      },
      {
        id: 'MUN-RUDRAM-C',
        name: 'RUDRAM Anti-Radiation Missile (NGARM)',
        category: 'Air-to-Ground',
        stockCount: 6,
        maxCapacity: 12,
        minThreshold: 4,
        isShortage: false,
        compatiblePlatforms: ['Multi-Role Superiority', 'Deep Penetration Strike'],
        unitDescription: 'Millimetric passive radar seeker anti-radiation missile'
      }
    ]
  }
];

export const INITIAL_TANKER_BRIDGE: TankerAirBridge = {
  tankerId: 'A-06',
  callsign: 'PEGASUS-01',
  platform: 'A330 MRTT (Dual Drogue & Fly-by-wire Boom)',
  trackName: 'ANCHOR ALPHA (ART-NORTH-01)',
  altitudeBlock: 'FL280 - FL310',
  offloadFuelTons: 42.5,
  totalFuelRemainingTons: 64.0,
  offloadRateKgMin: 2800,
  receiverCallsigns: ['GARUDA-01', 'GARUDA-07', 'THUNDER-01', 'THUNDER-03'],
  loiterExtensionMinutes: 115,
  rendezvousTime: '11:15:00 Z',
  anchorCoordinates: { x: 38, y: 36 },
  status: 'ACTIVE_ORBIT'
};

export const INITIAL_ATO: AirTaskingOrder = {
  atoNumber: 'ATO-2026-10-03-AERO-01',
  taskingPeriod: '10:00:00 Z TO 22:00:00 Z',
  commandAuthority: 'AIR HQ / TACTICAL AIR COMMAND (WESTERN SECTOR)',
  securityClassification: 'SECRET // TACTICAL AIR OPERATIONS',
  overallPriority: 'HIGH DEFENSIVE & STRATEGIC STANDOFF',
  packages: [
    {
      packageId: 'PKG-ALPHA-04',
      missionType: 'Offensive Counter Air (OCA) & High Barrier CAP',
      priority: 'CRITICAL',
      callsigns: ['GARUDA-01', 'GARUDA-07'],
      aircraftIds: ['A-01', 'A-07'],
      aircraftType: 'Multi-Role Superiority',
      timeOnTarget: '11:20:00 Z - 12:45:00 Z',
      escortWindow: '11:00:00 Z - 13:15:00 Z',
      primaryBase: 'Base-A (Northern Hub)',
      alternateBase: 'Base-B (Central)',
      datalinkFrequency: 'UHF 342.150 MHz // LINK-16 NET 41',
      iffMode5Code: 'M5: 4271 / S-XPNDR 6104',
      tankerAnchor: 'PEGASUS-01 (Anchor Alpha, FL290)',
      ordnanceLoadout: '4x Astra Mk-1/2 BVRAAM, 2x Meteor, 1x ECM Pod',
      targetObjective: 'Maintain air supremacy along Northern Axis Green-04; interdict hostile incursions.'
    },
    {
      packageId: 'PKG-BRAVO-02',
      missionType: 'SEAD (Suppression of Enemy Air Defenses)',
      priority: 'HIGH',
      callsigns: ['GARUDA-11', 'THUNDER-04'],
      aircraftIds: ['A-22', 'A-13'],
      aircraftType: 'Multi-Role & Deep Strike SEAD',
      timeOnTarget: '11:45:00 Z',
      escortWindow: '11:30:00 Z - 12:15:00 Z',
      primaryBase: 'Base-B (Central Command)',
      alternateBase: 'Base-A',
      datalinkFrequency: 'UHF 358.400 MHz // LINK-16 NET 44',
      iffMode5Code: 'M5: 5312 / S-XPNDR 7022',
      tankerAnchor: 'PEGASUS-01 (Pre-strike Top-off)',
      ordnanceLoadout: '2x RUDRAM Anti-Radiation, 2x Hammer PGM, 2x BVR',
      targetObjective: 'Neutralize contested radar emitters in Zone S-9 corridor prior to strike package ingress.'
    },
    {
      packageId: 'PKG-CHARLIE-01',
      missionType: 'Deep Penetration Precision Standoff Strike',
      priority: 'HIGH',
      callsigns: ['THUNDER-01', 'THUNDER-05'],
      aircraftIds: ['A-03', 'A-17'],
      aircraftType: 'Deep Penetration Strike',
      timeOnTarget: '12:10:00 Z',
      escortWindow: '11:50:00 Z - 12:35:00 Z',
      primaryBase: 'Base-B',
      alternateBase: 'FOB-Charlie',
      datalinkFrequency: 'UHF 361.225 MHz // LINK-16 NET 52',
      iffMode5Code: 'M5: 6140 / S-XPNDR 7450',
      tankerAnchor: 'PEGASUS-01 (Post-strike Egress Fuel)',
      ordnanceLoadout: '2x SCALP EG Standoff, 2x BVR Astra',
      targetObjective: 'Pinpoint standoff strike on hardened C2 logistics depot; ingress via FL320 bypass.'
    }
  ],
  tankerAirBridgeNote: 'PEGASUS-01 established on ART-NORTH-01 at FL290. Total available offload: 42.5 Tons. Pre-briefed fuel transfer margin 6,000 lbs per receiver.',
  specialInstructions: [
    'STANAG 4015 compliant encrypted datalink mandatory for all package leads.',
    'Weather divert airfield designated as Base-B runway 09/27.',
    'ROE Alpha-Strict in contested Central Sector until SEAD clearance confirmed by AWACS Sentinel-01.'
  ]
};
