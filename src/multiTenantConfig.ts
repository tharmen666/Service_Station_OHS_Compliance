/// <reference types="vite/client" />

/**
 * Service Station OHS Compliance Platform - Multi-Tenant White-Label Engine
 * Configures tenant branding, station site metadata, color themes, and custom policies.
 */

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
  fuelBrand: 'Standard' | 'Express' | 'Highway' | 'Urban' | 'Custom';
  customPoliciesEnabled: boolean;
  sans10089Compliant: boolean;
  popiaEncryptionActive: boolean;
  badgeSymbol: string;
}

export const defaultTenants: Record<string, TenantBrandConfig> = {
  default: {
    tenantId: 'STN-REG-042',
    brandName: 'Forecourt Compliance Facility',
    companyLegalName: 'National Service Station Operations',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'STN-REG-042',
    stationName: 'Regional Service Station Forecourt',
    address: 'Central Retail District, Metro Area',
    emergencyContactNumber: '+27 11 800 1000 / 10177',
    fuelBrand: 'Standard',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '⛽',
  },
  standard: {
    tenantId: 'STN-REG-042',
    brandName: 'Standard Forecourt & Convenience',
    companyLegalName: 'Standard Retail Operations Ltd',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'STN-REG-042',
    stationName: 'Regional Service Station Forecourt',
    address: 'Central Retail District, Metro Area',
    emergencyContactNumber: '+27 11 800 1000 / 112',
    fuelBrand: 'Standard',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🔵',
  },
  express: {
    tenantId: 'STN-EXP-108',
    brandName: 'Express Retail & Petroleum Station',
    companyLegalName: 'Express Petroleum Logistics',
    logoUrl: '/assets/posters/evacuation_poster.png',
    primaryColor: '#DD1D21',
    accentColor: '#FFD500',
    siteCode: 'STN-EXP-108',
    stationName: 'Express Transit Hub',
    address: 'Waterfront Transit Plaza',
    emergencyContactNumber: '+27 21 400 2000 / 10177',
    fuelBrand: 'Express',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '⚡',
  },
  highway: {
    tenantId: 'STN-HWY-305',
    brandName: 'Highway Service Plaza & Forecourt',
    companyLegalName: 'Highway Retail Operations',
    logoUrl: '/assets/posters/spill_response_poster.png',
    primaryColor: '#002B49',
    accentColor: '#00A3E0',
    siteCode: 'STN-HWY-305',
    stationName: 'Coastal Highway Service Plaza',
    address: 'Coastal Highway Corridor',
    emergencyContactNumber: '+27 31 300 4000 / 10177',
    fuelBrand: 'Highway',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '⭐',
  },
  urban: {
    tenantId: 'STN-URB-901',
    brandName: 'Urban Retail Convenience Hub',
    companyLegalName: 'Urban Petroleum Networks',
    logoUrl: '/assets/posters/customer_service_poster.png',
    primaryColor: '#006837',
    accentColor: '#8DC63F',
    siteCode: 'STN-URB-901',
    stationName: 'Metropolitan Convenience Station',
    address: 'Metropolitan Commercial Zone',
    emergencyContactNumber: '+27 11 400 9000 / 10177',
    fuelBrand: 'Urban',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🏬',
  }
};

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

export function switchTenantBrand(brandKey: 'standard' | 'express' | 'highway' | 'urban'): TenantBrandConfig {
  const selected = defaultTenants[brandKey] || defaultTenants.default;
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
