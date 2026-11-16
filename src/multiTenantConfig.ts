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
    driverName: "Driver A (PDP ####)",
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
    driverName: "Driver B (PDP ####)",
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
    driverName: "Driver C (PDP ####)",
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
    driverName: "Driver D (PDP ####)",
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
    driverName: "Driver E (PDP ####)",
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
    driverName: "Driver F (PDP ####)",
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
};

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
