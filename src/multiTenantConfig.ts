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
  fuelBrand: 'Shell' | 'Engen' | 'TotalEnergies' | 'Sasol' | 'BP' | 'Caltex' | 'Custom';
  customPoliciesEnabled: boolean;
  sans10089Compliant: boolean;
  popiaEncryptionActive: boolean;
}

export const defaultTenants: Record<string, TenantBrandConfig> = {
  default: {
    tenantId: 'ENG-JHB-042',
    brandName: 'Engen Retail Service Station',
    companyLegalName: 'Engen Petroleum Limited (Gauteng South)',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'ENG-JHB-042',
    stationName: 'Gauteng South Forecourt Network',
    address: 'Lenasia, Gauteng',
    emergencyContactNumber: '+27 11 852 1000 / 10177',
    fuelBrand: 'Engen',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
  },
  engen: {
    tenantId: 'ENG-JHB-042',
    brandName: 'Engen Retail Service Station',
    companyLegalName: 'Engen Petroleum Limited',
    logoUrl: '/assets/posters/statutory_rights_poster.png',
    primaryColor: '#005A9C',
    accentColor: '#ED1C24',
    siteCode: 'ENG-JHB-042',
    stationName: 'Gauteng South Forecourt Network',
    address: 'Lenasia, Gauteng',
    emergencyContactNumber: '+27 11 852 1000 / 112',
    fuelBrand: 'Engen',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
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
