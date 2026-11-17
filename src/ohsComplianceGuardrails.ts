/**
 * Service Station OHS Compliance Platform - Statutory Guardrails & Deterministic Parameter Controller
 *
 * Statutory References Enforced (Last Verified: 2026-03-01):
 * 1. South African Occupational Health and Safety (OHS) Act 85 of 1993 (Sections 8, 16.1, 16.2, 24).
 * 2. SANS 10089 (Parts 1 & 3): Storage and Distribution of Petroleum Products in Above-ground and Underground Installations.
 * 3. POPIA Act 4 of 2013 (Condition 3 Section 10 Minimality & Condition 7 Section 19 Security Safeguards).
 */

export interface OHSGuardrailConfig {
  temperature: number;
  ohsActEnforced: boolean;
  sans10089Enforced: boolean;
  section24EscalationEnforced: boolean;
  esdEmergencyIsolationEnforced: boolean;
}

export const OHS_STATUTORY_CONSTANTS = {
  ACT_NAME: 'Occupational Health and Safety Act (Act 85 of 1993)',
  SANS_STANDARD: 'SANS 10089-3:2010 (Forecourt Bulk Fuel Handling & Petroleum Storage)',
  SECTION_24_NOTICE:
    'Section 24 Incident Report to Department of Employment and Labour (Form WCL 1 / WCL 2 within 7 days; immediate call for fatalities/major fires)',
  ESD_REQUIREMENT:
    'Emergency Stop Device (ESD) mandatory cutoff on forecourt within 2 seconds of fuel release or fire detection',
  LOCKED_TEMPERATURE: 0.0,
};

export const STATUTORY_MODEL_ID = 'claude-sonnet-5-5';

export const DEFAULT_OHS_GUARDRAILS: OHSGuardrailConfig = {
  temperature: OHS_STATUTORY_CONSTANTS.LOCKED_TEMPERATURE,
  ohsActEnforced: true,
  sans10089Enforced: true,
  section24EscalationEnforced: true,
  esdEmergencyIsolationEnforced: true,
};

export function lockAITemperature(requestedTemperature?: number): number {
  if (requestedTemperature !== undefined && requestedTemperature !== 0.0) {
    console.warn(
      `[OHS Guardrail Warning] Requested temperature ${requestedTemperature} adjusted to 0.0.`
    );
  }
  return OHS_STATUTORY_CONSTANTS.LOCKED_TEMPERATURE;
}

export function getOHSSystemInstruction(customTenantName?: string): string {
  const tenant = customTenantName || 'Service Station Forecourt';
  return `Statutory Guardrail Policy Summary for ${tenant}:
- Temperature Parameter: Set to 0.0 (Deterministic Statutory Retrieval Mode).
- Primary Statutes: South African OHS Act 85 of 1993 (Sections 8, 16.1, 16.2, 24) and SANS 10089-3:2010.
- Privacy Standard: POPIA Act 4 of 2013 (Section 10 Minimality & Section 19 Security Safeguards).`;
}
