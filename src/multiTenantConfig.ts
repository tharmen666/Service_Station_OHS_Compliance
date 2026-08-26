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
  primaryColor: string; // Tailwind hex / class reference
  accentColor: string;
  siteCode: string;
  stationName: string;
  address: string;
  emergencyContactNumber: string;
  fuelBrand: 'Shell' | 'Engen' | 'TotalEnergies' | 'Sasol' | 'BP' | 'Caltex' | 'Custom';
  customPoliciesEnabled: boolean;
  sans10089Compliant: boolean;
  popiaEncryptionActive: boolean;
}

export const defaultTenants: Record<string, TenantBrandConfig> = {
  default: {
    tenantId: 'tenant_apex_fuel',
    brandName: 'Apex Energy Forecourt',
    companyLegalName: 'Apex Petroleum Retailers (Pty) Ltd',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#f59e0b', // Amber-500
    accentColor: '#ef4444',  // Red-500
    siteCode: 'ZA-OHS-40921',
    stationName: 'Apex Station Forecourt #104',
    address: 'Corner N1 Highway & Main Road, Midrand, Johannesburg, Gauteng',
    emergencyContactNumber: '+27 11 999 0100 / 10177',
    fuelBrand: 'Shell',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
  },
  engen: {
    tenantId: 'tenant_engen_01',
    brandName: 'Engen QuickShop & Forecourt',
    companyLegalName: 'Engen Petroleum Limited',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#0284c7', // Sky-600
    accentColor: '#f97316',  // Orange-500
    siteCode: 'ENG-ZA-8841',
    stationName: 'Engen 1-Stop Cape Highway',
    address: 'N2 Highway Km 42, Somerset West, Western Cape',
    emergencyContactNumber: '+27 21 850 1100 / 112',
    fuelBrand: 'Engen',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
  },
  totalenergies: {
    tenantId: 'tenant_total_01',
    brandName: 'TotalEnergies Station',
    companyLegalName: 'TotalEnergies Marketing South Africa (Pty) Ltd',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#dc2626', // Red-600
    accentColor: '#2563eb',  // Blue-600
    siteCode: 'TOT-ZA-5520',
    stationName: 'TotalEnergies Gateway Forecourt',
    address: 'Umhlanga Rocks Drive, Durban, KwaZulu-Natal',
    emergencyContactNumber: '+27 31 566 2000 / 10177',
    fuelBrand: 'TotalEnergies',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
  }
};

/**
 * Loads current tenant configuration from environment variables or active state
 */
export function getTenantConfig(): TenantBrandConfig {
  const envTenantId = import.meta.env.VITE_TENANT_ID;
  const envBrandName = import.meta.env.VITE_WHITE_LABEL_BRAND_NAME;
  const envSiteCode = import.meta.env.VITE_STATION_SITE_CODE;

  const baseConfig = defaultTenants[envTenantId as string] || defaultTenants.default;

  return {
    ...baseConfig,
    brandName: envBrandName || baseConfig.brandName,
    siteCode: envSiteCode || baseConfig.siteCode,
  };
}

/**
 * Switches active tenant at runtime
 */
let currentTenantState: TenantBrandConfig = getTenantConfig();

export function setTenantState(config: Partial<TenantBrandConfig>): TenantBrandConfig {
  currentTenantState = {
    ...currentTenantState,
    ...config,
  };
  return currentTenantState;
}

export function getActiveTenant(): TenantBrandConfig {
  return currentTenantState;
}
