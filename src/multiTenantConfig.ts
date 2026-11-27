/// <reference types="vite/client" />

/**
 * Service Station OHS Compliance Platform - White-Label Multi-Tenant Engine
 * Pure White-Label Topology: Central Depot
 * 1 Central Logistics Depot -> 6 Heavy Tanker Trucks (32,000L full loads) -> 5 Regional Retail Service Stations
 */

export interface HeavyTankerTruck {
  truckId: string;
  registrationNumber: string;
  capacityLitres: number; // 32,000L
  compartmentBreakdown: string; // "8,000L x 4 compartments"
  assignedStationId: string;
  assignedStationName: string;
  sealSerialPrefix: string;
  driverName: string;
  dailyStatus: 'DISPATCHED' | 'IN_TRANSIT' | 'OFFLOADING' | 'RECONCILED' | 'STANDBY';
  scheduledDepartureTime: string;
}

export interface CentralDepotConfig {
  depotId: string;
  depotName: string;
  location: string;
  gantryBays: number;
  totalDailyThroughputLitres: number; // 160,000L (5 stations x 32,000L)
  activeFleetSize: number; // 6 Heavy Tankers
  vaporRecoverySystem: string;
  sans10089BondingVerified: boolean;
}

export type PosVendorPreset =
  | 'WINBRANCH'
  | 'ISIS'
  | 'NAMOS'
  | 'SYMPHONY'
  | 'SMARTFUEL'
  | 'GILBARCO'
  | 'TOKHEIM'
  | 'GENERIC_CSV';

export interface TenantBrandConfig {
  tenantId: string;
  brandName: string;
  companyLegalName: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  siteCode: string;
  stationName: string;
  address: string;
  emergencyContactNumber: string;
  fuelBrand: string;
  platformBrand?: 'ErgoSafe' | 'LogiGuard';
  recommendedPosVendor?: PosVendorPreset;
  dualPosSetup?: {
    forecourtVendor: 'NAMOS';
    shopVendor: 'SYMPHONY';
    shopBrandLabel: string;
    description: string;
  };
  customPoliciesEnabled: boolean;
  sans10089Compliant: boolean;
  popiaEncryptionActive: boolean;
  badgeSymbol: string;
  dailyDeliveryVolumeLitres: number;
  assignedTruckId: string;
  depotOriginId: string;
}

// 1 Central Logistics Depot
export const CENTRAL_DEPOT_CONFIG: CentralDepotConfig = {
  depotId: 'DEPOT-CD-01',
  depotName: 'Central Logistics Depot',
  location: 'Inland Bulk Fuel Terminal & Logistics Hub, Bay 1-6',
  gantryBays: 6,
  totalDailyThroughputLitres: 160000, // 5 x 32,000L daily
  activeFleetSize: 6,
  vaporRecoverySystem: 'VRU-SANS-10089-Stage1B-Certified',
  sans10089BondingVerified: true,
};

// 6 Heavy Tanker Trucks (32,000L full loads each)
export const DEPOT_FLEET: HeavyTankerTruck[] = [
  {
    truckId: 'TRK-01',
    registrationNumber: 'CD-01-GP',
    capacityLitres: 32000,
    compartmentBreakdown: '8,000L x 4 (ULP 95, ULP 93, Diesel 50ppm, Diesel 10ppm)',
    assignedStationId: 'STN-ALPHA',
    assignedStationName: 'Retail Service Station Alpha',
    sealSerialPrefix: 'CD-SEAL-01',
    driverName: 'Driver A (PDP #0001 - Placeholder)',
    dailyStatus: 'RECONCILED',
    scheduledDepartureTime: '05:30',
  },
  {
    truckId: 'TRK-02',
    registrationNumber: 'CD-02-GP',
    capacityLitres: 32000,
    compartmentBreakdown: '8,000L x 4 (Diesel 50ppm x 2, ULP 95 x 2)',
    assignedStationId: 'STN-BRAVO',
    assignedStationName: 'Retail Service Station Bravo',
    sealSerialPrefix: 'CD-SEAL-02',
    driverName: 'Driver B (PDP #0002 - Placeholder)',
    dailyStatus: 'OFFLOADING',
    scheduledDepartureTime: '06:00',
  },
  {
    truckId: 'TRK-03',
    registrationNumber: 'CD-03-GP',
    capacityLitres: 32000,
    compartmentBreakdown: '8,000L x 4 (ULP 95 x 2, Diesel 50ppm, Paraffin)',
    assignedStationId: 'STN-CHARLIE',
    assignedStationName: 'Retail Service Station Charlie',
    sealSerialPrefix: 'CD-SEAL-03',
    driverName: 'Driver C (PDP #0003 - Placeholder)',
    dailyStatus: 'IN_TRANSIT',
    scheduledDepartureTime: '06:30',
  },
  {
    truckId: 'TRK-04',
    registrationNumber: 'CD-04-GP',
    capacityLitres: 32000,
    compartmentBreakdown: '8,000L x 4 (Diesel 50ppm x 2, ULP 93 x 2)',
    assignedStationId: 'STN-DELTA',
    assignedStationName: 'Retail Service Station Delta',
    sealSerialPrefix: 'CD-SEAL-04',
    driverName: 'Driver D (PDP #0004 - Placeholder)',
    dailyStatus: 'DISPATCHED',
    scheduledDepartureTime: '07:00',
  },
  {
    truckId: 'TRK-05',
    registrationNumber: 'CD-05-GP',
    capacityLitres: 32000,
    compartmentBreakdown: '8,000L x 4 (ULP 95, Diesel 50ppm x 2, Paraffin)',
    assignedStationId: 'STN-ECHO',
    assignedStationName: 'Retail Service Station Echo',
    sealSerialPrefix: 'CD-SEAL-05',
    driverName: 'Driver E (PDP #0005 - Placeholder)',
    dailyStatus: 'DISPATCHED',
    scheduledDepartureTime: '07:30',
  },
  {
    truckId: 'TRK-06',
    registrationNumber: 'CD-06-GP',
    capacityLitres: 32000,
    compartmentBreakdown: '8,000L x 4 (Multi-Product High-Throughput Buffer)',
    assignedStationId: 'DEPOT-STANDBY',
    assignedStationName: 'Central Depot Reserve / Rapid Response Buffer',
    sealSerialPrefix: 'CD-SEAL-06',
    driverName: 'Driver F (PDP #0006 - Placeholder)',
    dailyStatus: 'STANDBY',
    scheduledDepartureTime: '09:00',
  },
];

// 5 Regional Retail Service Stations
export const defaultTenants: Record<string, TenantBrandConfig> = {
  default: {
    tenantId: 'STN-ALPHA',
    brandName: 'Central Depot Fleet',
    companyLegalName: 'Central Depot Logistics (Pty) Ltd',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'STN-ALPHA',
    stationName: 'Retail Service Station Alpha',
    address: 'Regional Logistics Corridor 1, Gauteng',
    emergencyContactNumber: '+27 11 800 1000 / 10177',
    fuelBrand: 'Central Depot',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '⛽',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-01',
    depotOriginId: 'DEPOT-CD-01',
  },
  alpha: {
    tenantId: 'STN-ALPHA',
    brandName: 'Central Depot Fleet',
    companyLegalName: 'Central Depot Logistics (Pty) Ltd',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'STN-ALPHA',
    stationName: 'Retail Service Station Alpha',
    address: 'Regional Logistics Corridor 1, Gauteng',
    emergencyContactNumber: '+27 11 800 1000 / 10177',
    fuelBrand: 'Central Depot',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🅰️',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-01',
    depotOriginId: 'DEPOT-CD-01',
  },
  bravo: {
    tenantId: 'STN-BRAVO',
    brandName: 'Central Depot Fleet',
    companyLegalName: 'Central Depot Logistics (Pty) Ltd',
    logoUrl: '/assets/posters/evacuation_poster.png',
    primaryColor: '#DD1D21',
    accentColor: '#FFD500',
    siteCode: 'STN-BRAVO',
    stationName: 'Retail Service Station Bravo',
    address: 'North Highway Corridor 2, Gauteng',
    emergencyContactNumber: '+27 12 400 2000 / 10177',
    fuelBrand: 'Central Depot',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🅱️',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-02',
    depotOriginId: 'DEPOT-CD-01',
  },
  charlie: {
    tenantId: 'STN-CHARLIE',
    brandName: 'Central Depot Fleet',
    companyLegalName: 'Central Depot Logistics (Pty) Ltd',
    logoUrl: '/assets/posters/spill_response_poster.png',
    primaryColor: '#002B49',
    accentColor: '#00A3E0',
    siteCode: 'STN-CHARLIE',
    stationName: 'Retail Service Station Charlie',
    address: 'East Transit Highway Plaza, Gauteng',
    emergencyContactNumber: '+27 11 300 4000 / 10177',
    fuelBrand: 'Central Depot',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '©️',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-03',
    depotOriginId: 'DEPOT-CD-01',
  },
  delta: {
    tenantId: 'STN-DELTA',
    brandName: 'Central Depot Fleet',
    companyLegalName: 'Central Depot Logistics (Pty) Ltd',
    logoUrl: '/assets/posters/customer_service_poster.png',
    primaryColor: '#006837',
    accentColor: '#8DC63F',
    siteCode: 'STN-DELTA',
    stationName: 'Retail Service Station Delta',
    address: 'South Metro Commercial Hub, Gauteng',
    emergencyContactNumber: '+27 11 400 9000 / 10177',
    fuelBrand: 'Central Depot',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🅳',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-04',
    depotOriginId: 'DEPOT-CD-01',
  },
  echo: {
    tenantId: 'STN-ECHO',
    brandName: 'Central Depot Fleet',
    companyLegalName: 'Central Depot Logistics (Pty) Ltd',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#7C3AED',
    accentColor: '#C084FC',
    siteCode: 'STN-ECHO',
    stationName: 'Retail Service Station Echo',
    address: 'West Freight Rail Gateway, Gauteng',
    emergencyContactNumber: '+27 11 500 8000 / 10177',
    fuelBrand: 'Central Depot',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🅴',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-05',
    depotOriginId: 'DEPOT-CD-01',
  },
  bp: {
    tenantId: 'BP-ZA-001',
    brandName: 'ErgoSafe • BP Forecourt',
    companyLegalName: 'BP Retail Forecourt Network',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#007A33',
    accentColor: '#FFCC00',
    siteCode: 'BP-ZA-001',
    stationName: 'BP Express Forecourt Hub',
    address: 'Sandton Corridor, Gauteng, South Africa',
    emergencyContactNumber: '+27 11 800 1000 / 10177',
    fuelBrand: 'BP',
    platformBrand: 'ErgoSafe',
    recommendedPosVendor: 'WINBRANCH',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🟢',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-01',
    depotOriginId: 'DEPOT-CD-01',
  },
  shell: {
    tenantId: 'SHL-ZA-002',
    brandName: 'ErgoSafe • Shell Select',
    companyLegalName: 'Shell Retail Service Station Network',
    logoUrl: '/assets/posters/evacuation_poster.png',
    primaryColor: '#DD1D21',
    accentColor: '#FBCE07',
    siteCode: 'SHL-ZA-002',
    stationName: 'Shell Select Highway Forecourt',
    address: 'Midrand N1 Corridor, Gauteng, South Africa',
    emergencyContactNumber: '+27 11 800 2000 / 10177',
    fuelBrand: 'Shell',
    platformBrand: 'ErgoSafe',
    recommendedPosVendor: 'SMARTFUEL',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🔴',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-02',
    depotOriginId: 'DEPOT-CD-01',
  },
  engen: {
    tenantId: 'ENG-ZA-003',
    brandName: 'LogiGuard • Engen QuickShop',
    companyLegalName: 'Engen Retail Forecourt Operations',
    logoUrl: '/assets/posters/spill_response_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'ENG-ZA-003',
    stationName: 'Engen QuickShop Flagship',
    address: 'Rosebank Avenue, Gauteng, South Africa',
    emergencyContactNumber: '+27 11 800 3000 / 10177',
    fuelBrand: 'Engen',
    platformBrand: 'LogiGuard',
    recommendedPosVendor: 'WINBRANCH',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🔵',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-03',
    depotOriginId: 'DEPOT-CD-01',
  },
  astron: {
    tenantId: 'AST-ZA-004',
    brandName: 'LogiGuard • Astron Energy & FreshStop',
    companyLegalName: 'Astron Energy Forecourt & FreshStop Retail',
    logoUrl: '/assets/posters/customer_service_poster.png',
    primaryColor: '#F36F21',
    accentColor: '#1E3A8A',
    siteCode: 'AST-ZA-004',
    stationName: 'Astron Energy / FreshStop Plaza',
    address: 'Van Wyk Arterial Hub, Gauteng, South Africa',
    emergencyContactNumber: '+27 11 800 4000 / 10177',
    fuelBrand: 'Astron Energy',
    platformBrand: 'LogiGuard',
    recommendedPosVendor: 'NAMOS',
    dualPosSetup: {
      forecourtVendor: 'NAMOS',
      shopVendor: 'SYMPHONY',
      shopBrandLabel: 'FreshStop',
      description:
        'Dual-BOS architecture: NAMOS forecourt wetstock & dispenser controller merged with Symphony FreshStop convenience store & QSR POS.',
    },
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🟠',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-04',
    depotOriginId: 'DEPOT-CD-01',
  },
  totalenergies: {
    tenantId: 'TOT-ZA-005',
    brandName: 'ErgoSafe • TotalEnergies Bonjour',
    companyLegalName: 'TotalEnergies Retail Station Network',
    logoUrl: '/assets/posters/pass_firefighting_poster.png',
    primaryColor: '#E10028',
    accentColor: '#00A3E0',
    siteCode: 'TOT-ZA-005',
    stationName: 'TotalEnergies Bonjour Hub',
    address: 'La Rochelle Transit Plaza, Gauteng, South Africa',
    emergencyContactNumber: '+27 11 800 5000 / 10177',
    fuelBrand: 'TotalEnergies',
    platformBrand: 'ErgoSafe',
    recommendedPosVendor: 'ISIS',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🔷',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-05',
    depotOriginId: 'DEPOT-CD-01',
  },
  ergosafe: {
    tenantId: 'ERG-DLR-01',
    brandName: 'ErgoSafe Enterprise',
    companyLegalName: 'ErgoSafe Independent Dealer Platform',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#059669',
    accentColor: '#F59E0B',
    siteCode: 'ERG-DLR-01',
    stationName: 'ErgoSafe Independent Forecourt',
    address: 'Regional Retail Network',
    emergencyContactNumber: '+27 11 800 6000 / 10177',
    fuelBrand: 'ErgoSafe',
    platformBrand: 'ErgoSafe',
    recommendedPosVendor: 'GENERIC_CSV',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🛡️',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-01',
    depotOriginId: 'DEPOT-CD-01',
  },
  logiguard: {
    tenantId: 'LGD-DLR-02',
    brandName: 'LogiGuard Sentinel',
    companyLegalName: 'LogiGuard Fleet & Forecourt Platform',
    logoUrl: '/assets/posters/evacuation_poster.png',
    primaryColor: '#0284C7',
    accentColor: '#10B981',
    siteCode: 'LGD-DLR-02',
    stationName: 'LogiGuard Fleet Forecourt',
    address: 'Logistics Corridor Hub',
    emergencyContactNumber: '+27 11 800 7000 / 10177',
    fuelBrand: 'LogiGuard',
    platformBrand: 'LogiGuard',
    recommendedPosVendor: 'GILBARCO',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '⚡',
    dailyDeliveryVolumeLitres: 32000,
    assignedTruckId: 'TRK-02',
    depotOriginId: 'DEPOT-CD-01',
  },
};

export interface FuelBrandPresetOption {
  key: string;
  label: string;
  platformBrand: 'ErgoSafe' | 'LogiGuard';
  posSummary: string;
}

export const FUEL_BRAND_PRESETS: FuelBrandPresetOption[] = [
  { key: 'alpha', label: 'Standard (STN-ALPHA)', platformBrand: 'ErgoSafe', posSummary: 'Universal POS' },
  { key: 'bp', label: 'BP', platformBrand: 'ErgoSafe', posSummary: 'WinBranch' },
  { key: 'shell', label: 'Shell', platformBrand: 'ErgoSafe', posSummary: 'SmartFuel' },
  { key: 'engen', label: 'Engen', platformBrand: 'LogiGuard', posSummary: 'WinBranch' },
  { key: 'astron', label: 'Astron Energy / FreshStop', platformBrand: 'LogiGuard', posSummary: 'NAMOS + Symphony' },
  { key: 'totalenergies', label: 'TotalEnergies', platformBrand: 'ErgoSafe', posSummary: 'ISIS' },
  { key: 'ergosafe', label: 'ErgoSafe White-Label', platformBrand: 'ErgoSafe', posSummary: 'Generic CSV/XML' },
  { key: 'logiguard', label: 'LogiGuard White-Label', platformBrand: 'LogiGuard', posSummary: 'Gilbarco / Tokheim' },
];

export function setCustomDealerBranding(
  dealerName: string,
  siteCode: string,
  platformBrand: 'ErgoSafe' | 'LogiGuard' = 'ErgoSafe'
): TenantBrandConfig {
  const cleanName = dealerName.trim() || `${platformBrand} Custom Dealer`;
  const cleanCode = siteCode.trim().toUpperCase() || 'DLR-CUST-01';
  return setTenantState({
    tenantId: cleanCode,
    siteCode: cleanCode,
    brandName: `${platformBrand} • ${cleanName}`,
    companyLegalName: cleanName,
    stationName: cleanName,
    fuelBrand: cleanName,
    platformBrand,
    dualPosSetup: undefined,
  });
}

// Aliases for backward compatibility with previous tabs
defaultTenants.standard = defaultTenants.alpha;
defaultTenants.express = defaultTenants.bravo;
defaultTenants.highway = defaultTenants.charlie;
defaultTenants.urban = defaultTenants.delta;

export const REGIONAL_STATIONS = [
  defaultTenants.alpha,
  defaultTenants.bravo,
  defaultTenants.charlie,
  defaultTenants.delta,
  defaultTenants.echo,
];

/**
 * Loads current tenant configuration dynamically from environment variables or default tenant
 */
export function getTenantConfig(): TenantBrandConfig {
  const envTenantId = import.meta.env.VITE_TENANT_ID;
  const envBrandName = import.meta.env.VITE_WHITE_LABEL_BRAND_NAME;
  const envSiteName = import.meta.env.VITE_TENANT_SITE_NAME;
  const envLocation = import.meta.env.VITE_TENANT_LOCATION;
  const envPrimaryColor = import.meta.env.VITE_TENANT_PRIMARY_COLOR;
  const envSecondaryColor = import.meta.env.VITE_TENANT_SECONDARY_COLOR;
  const envSiteCode = import.meta.env.VITE_STATION_SITE_CODE;

  const baseConfig = defaultTenants[envTenantId as string] || defaultTenants.default;

  return {
    ...baseConfig,
    tenantId: envTenantId || baseConfig.tenantId,
    brandName: envBrandName || baseConfig.brandName,
    stationName: envSiteName || baseConfig.stationName,
    address: envLocation || baseConfig.address,
    primaryColor: envPrimaryColor || baseConfig.primaryColor,
    accentColor: envSecondaryColor || baseConfig.accentColor,
    siteCode: envSiteCode || envTenantId || baseConfig.siteCode,
  };
}

/**
 * Global state and listener mechanism for active tenant
 */
let currentTenantState: TenantBrandConfig = getTenantConfig();
const tenantListeners: Set<(tenant: TenantBrandConfig) => void> = new Set();

export function setTenantState(config: Partial<TenantBrandConfig>): TenantBrandConfig {
  currentTenantState = {
    ...currentTenantState,
    ...config,
  };
  tenantListeners.forEach((listener) => listener(currentTenantState));
  return currentTenantState;
}

export function switchTenantBrand(brandKey: string): TenantBrandConfig {
  const selected = defaultTenants[brandKey.toLowerCase()] || defaultTenants.default;
  return setTenantState(selected);
}

export function getActiveTenant(): TenantBrandConfig {
  return currentTenantState;
}

export function subscribeTenantChange(listener: (tenant: TenantBrandConfig) => void): () => void {
  tenantListeners.add(listener);
  return () => {
    tenantListeners.delete(listener);
  };
}
