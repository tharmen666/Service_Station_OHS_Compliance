// nelly-localization-engine.ts
/**
 * Nelly OHS Copilot - Regional Multilingual & Subtitle Routing Engine
 * Automatically defaults subtitles based on regional IP / geolocation 
 * with a manual user override picker for East & Southern African markets.
 */

import type { Language } from './data/translations';

export type SupportedLanguageCode = 'en' | 'sw' | 'zu' | 'st' | 'af' | 'xh';

export interface RegionalDefault {
  countryCode: string;
  defaultLanguage: SupportedLanguageCode;
  supportedFallbacks: SupportedLanguageCode[];
  regionName: string;
}

export const REGIONAL_DEFAULTS: Record<string, RegionalDefault> = {
  KE: {
    countryCode: 'KE',
    defaultLanguage: 'sw', // Swahili standard for East Africa
    supportedFallbacks: ['en', 'sw'],
    regionName: 'East Africa (Kenya)'
  },
  TZ: {
    countryCode: 'TZ',
    defaultLanguage: 'sw',
    supportedFallbacks: ['en', 'sw'],
    regionName: 'East Africa (Tanzania)'
  },
  UG: {
    countryCode: 'UG',
    defaultLanguage: 'sw',
    supportedFallbacks: ['en', 'sw'],
    regionName: 'East Africa (Uganda)'
  },
  ZA: {
    countryCode: 'ZA',
    defaultLanguage: 'zu', // isiZulu as dominant home language in South Africa
    supportedFallbacks: ['en', 'zu', 'xh', 'st', 'af'],
    regionName: 'Southern Africa (South Africa)'
  },
  DEFAULT: {
    countryCode: 'GLOBAL',
    defaultLanguage: 'en',
    supportedFallbacks: ['en', 'sw', 'zu', 'xh', 'st', 'af'],
    regionName: 'Global / International'
  }
};

export const LANGUAGE_LABELS: Record<SupportedLanguageCode, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  sw: { native: 'Kiswahili', english: 'Swahili (East Africa Lingua Franca)' },
  zu: { native: 'isiZulu', english: 'Zulu (South Africa)' },
  xh: { native: 'isiXhosa', english: 'Xhosa (South Africa)' },
  st: { native: 'Sesotho', english: 'Southern Sotho' },
  af: { native: 'Afrikaans', english: 'Afrikaans' }
};

/**
 * Resolves the default subtitle language based on user geolocation or tenant preset
 */
export function resolveDefaultLanguage(geoCountryCode?: string): SupportedLanguageCode {
  if (!geoCountryCode) return REGIONAL_DEFAULTS.DEFAULT.defaultLanguage;
  const config = REGIONAL_DEFAULTS[geoCountryCode.toUpperCase()] || REGIONAL_DEFAULTS.DEFAULT;
  return config.defaultLanguage;
}

export function toAppLanguage(code: SupportedLanguageCode): Language {
  return code.toUpperCase() as Language;
}

export function toSupportedLanguageCode(lang: Language): SupportedLanguageCode {
  return lang.toLowerCase() as SupportedLanguageCode;
}

