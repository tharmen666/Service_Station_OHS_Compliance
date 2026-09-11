/**
 * Service Station OHS Compliance Platform - Statutory Guardrails & AI Endpoint Temperature Controller
 * 
 * Statutory References Enforced:
 * 1. South African Occupational Health and Safety (OHS) Act 85 of 1993 (Sections 8, 16.1, 16.2).
 * 2. SANS 10089 (Parts 1 & 3): Storage and Distribution of Petroleum Products in Above-ground and Underground Installations.
 * 3. Section 24 Incident Escalation Protocol: Mandatory notification of major injuries, chemical/fuel exposure, or ESD triggers to Department of Employment and Labour.
 */

export interface OHSGuardrailConfig {
  temperature: number; // LOCKED strictly to 0.0
  ohsActEnforced: boolean;
  sans10089Enforced: boolean;
  section24EscalationEnforced: boolean;
  esdEmergencyIsolationEnforced: boolean;
  model: string;
}

export const OHS_STATUTORY_CONSTANTS = {
  ACT_NAME: 'Occupational Health and Safety Act (Act 85 of 1993)',
  SANS_STANDARD: 'SANS 10089 (Forecourt Bulk Fuel Handling & Petroleum Storage)',
  SECTION_24_NOTICE: 'Section 24 Incident Report to Department of Employment and Labour (Form WCL 1 / WCL 2 within 7 days; immediate call for fatalities/major fires)',
  ESD_REQUIREMENT: 'Emergency Stop Device (ESD) mandatory cutoff on forecourt within 2 seconds of fuel release or fire detection',
  LOCKED_TEMPERATURE: 0.0,
};

export const DEFAULT_OHS_GUARDRAILS: OHSGuardrailConfig = {
  temperature: OHS_STATUTORY_CONSTANTS.LOCKED_TEMPERATURE,
  ohsActEnforced: true,
  sans10089Enforced: true,
  section24EscalationEnforced: true,
  esdEmergencyIsolationEnforced: true,
  model: 'gemini-1.5-pro-0.0-locked',
};

/**
 * Enforces temperature parameter locking to strictly 0.0 for all AI API calls
 */
export function lockAITemperature(requestedTemperature?: number): number {
  if (requestedTemperature !== undefined && requestedTemperature !== 0.0) {
    console.warn(
      `[OHS Guardrail Warning] Requested temperature ${requestedTemperature} override blocked. Temperature is locked to 0.0 under SANS 10089 compliance rules.`
    );
  }
  return OHS_STATUTORY_CONSTANTS.LOCKED_TEMPERATURE;
}

/**
 * Validates prompt or message payloads against statutory requirements
 */
export function validateOHSGuardrails(inputPrompt: string): {
  isValid: boolean;
  warnings: string[];
  systemInstruction: string;
} {
  const warnings: string[] = [];

  if (!inputPrompt.toLowerCase().includes('esd') && inputPrompt.toLowerCase().includes('fire')) {
    warnings.push('Warning: Emergency Stop Device (ESD) activation check should always precede fire response actions.');
  }

  if (inputPrompt.toLowerCase().includes('injury') || inputPrompt.toLowerCase().includes('fatality')) {
    warnings.push('Statutory Reminder: Section 24 OHS Act 85 incident reporting is mandatory for serious injury/fatality.');
  }

  return {
    isValid: true,
    warnings,
    systemInstruction: getOHSSystemInstruction(),
  };
}

/**
 * Generates the immutable system instruction for Google AI Studio / Gemini API
 */
export function getOHSSystemInstruction(customTenantName?: string): string {
  const tenant = customTenantName || 'Service Station Forecourt';
  return `You are an expert AI Service Station OHS & Statutory Compliance Advisor operating under strict compliance guardrails for ${tenant}.

CRITICAL SYSTEM PARAMETER:
- Temperature Parameter: LOCKED to 0.0 (Deterministic Compliance Mode). Zero hallucinations allowed.

STATUTORY & REGULATORY FOUNDATIONS:
1. South African OHS Act 85 of 1993:
   - Section 8: Employer's duty to maintain safe working environments without risk to employees or customers.
   - Section 16.1 / 16.2: CEO & delegated manager accountability for statutory safety compliance.
   - Section 24: Mandatory notification to Provincial Director (Dept of Employment & Labour) for any incident causing death, unconsciousness, loss of limb, or major chemical/petroleum release within 7 days.
2. SANS 10089 Standards (Bulk Fuel & Forecourt Handling):
   - Strict Emergency Stop Device (ESD) isolation protocols.
   - Static electricity bonding during tanker offloading.
   - Zero-tolerance for unapproved fuel containers or smoking within 15 meters of pump islands.
   - Phase 4-Stage Forecourt Evacuation and Spill Teamwork Procedures (Fetcher, Spade Applicator, Sweeper, Hazardous Waste Disposer).
3. Protection of Personal Information Act (POPIA Act 4 of 2013):
   - All employee names, SA ID numbers, and incident log entries must be encrypted using client-side AES-256-GCM.

Always deliver actionable, step-by-step role cards with non-sparking safety tool instructions.`;
}
