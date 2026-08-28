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
  fuelBrand: 'Shell' | 'Engen' | 'TotalEnergies' | 'Sasol' | 'BP' | 'Caltex' | 'FreshStop' | 'Custom';
  customPoliciesEnabled: boolean;
  sans10089Compliant: boolean;
  popiaEncryptionActive: boolean;
  badgeSymbol: string;
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
    badgeSymbol: '⛽',
  },
  engen: {
    tenantId: 'ENG-JHB-042',
    brandName: 'Engen QuickShop & Forecourt',
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
    badgeSymbol: '🔵',
  },
  shell: {
    tenantId: 'SHL-CPT-108',
    brandName: 'Shell Select Forecourt & Express',
    companyLegalName: 'Shell South Africa Marketing (Pty) Ltd',
    logoUrl: '/assets/posters/evacuation_poster.png',
    primaryColor: '#DD1D21',
    accentColor: '#FFD500',
    siteCode: 'SHL-CPT-108',
    stationName: 'Cape Peninsula Express Hub',
    address: 'V&A Waterfront, Cape Town',
    emergencyContactNumber: '+27 21 408 2000 / 10177',
    fuelBrand: 'Shell',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🐚',
  },
  caltex: {
    tenantId: 'CTX-DBN-305',
    brandName: 'Caltex Star Mart & Petroleum',
    companyLegalName: 'Astron Energy / Caltex SA',
    logoUrl: '/assets/posters/spill_response_poster.png',
    primaryColor: '#002B49',
    accentColor: '#00A3E0',
    siteCode: 'CTX-DBN-305',
    stationName: 'Durban Coastal Gateway Station',
    address: 'Umhlanga Rocks, KwaZulu-Natal',
    emergencyContactNumber: '+27 31 300 4000 / 10177',
    fuelBrand: 'Caltex',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '⭐',
  },
  freshstop: {
    tenantId: 'FSH-JHB-901',
    brandName: 'FreshStop Retail & Food Convenience',
    companyLegalName: 'FreshStop SA / Food Retail Network',
    logoUrl: '/assets/posters/customer_service_poster.png',
    primaryColor: '#006837',
    accentColor: '#8DC63F',
    siteCode: 'FSH-JHB-901',
    stationName: 'Rosebank FreshStop Experience',
    address: 'Rosebank, Johannesburg',
    emergencyContactNumber: '+27 11 447 9000 / 10177',
    fuelBrand: 'FreshStop',
    customPoliciesEnabled: true,
    sans10089Compliant: true,
    popiaEncryptionActive: true,
    badgeSymbol: '🍏',
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

export function switchTenantBrand(brandKey: 'engen' | 'shell' | 'caltex' | 'freshstop'): TenantBrandConfig {
  const selected = defaultTenants[brandKey] || defaultTenants.engen;
  return setTenantState(selected);
}

export function getActiveTenant(): TenantBrandConfig {
  return currentTenantState;
}

export function subscribeTenantChange(listener: (tenant: TenantBrandConfig) => void): () => void {
  tenantListeners.add(listener);
  return () => tenantListeners.delete(listener);
}

