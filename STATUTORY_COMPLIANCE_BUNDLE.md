# 📦 STATUTORY COMPLIANCE CORE CODE BUNDLE

**Source Repository**: `c:\Users\Desigan Tharmen\Desktop\ErgoSafe_Reborn_V3`  
**Bundle Target**: 5 High-Impact Core Statutory & Security Files  

---

## File: `api/_lib/security.js`
> **Scope**: Serverless endpoint security guard, token authentication (requireToken), IP rate limiting, and CORS configuration.

```javascript
// Shared request guards for the serverless API (files under api/_lib are not routed by Vercel).
//
// IMPORTANT (TODO(auth)): the bearer token is a shared secret. The browser app has to send it,
// so a token baked into the client bundle (VITE_ERGOSAFE_API_TOKEN) is visible to anyone who
// opens DevTools. It keeps casual bots out and, together with the rate limit, caps spend on the
// paid AI endpoint - it is NOT user authentication. Replace with per-user session auth before
// production use.

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173'
];

/** CORS from an allow-list. Never combines a wildcard origin with credentials. */
export function applyCors(req, res, allowHeaders = 'Authorization, Content-Type, X-Requested-With, Accept') {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_DEV_ORIGINS;

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', allowHeaders);
}

/**
 * Bearer-token check that FAILS CLOSED: if ERGOSAFE_API_TOKEN is not configured on the server
 * the request is refused with 500 instead of falling back to a well-known default.
 * Returns true when the request may continue; otherwise it has already sent the response.
 */
export function requireToken(req, res) {
  const expectedToken = process.env.ERGOSAFE_API_TOKEN;
  if (!expectedToken) {
    res.status(500).json({ error: 'Server not configured: ERGOSAFE_API_TOKEN is not set' });
    return false;
  }
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;
  if (!token || token !== expectedToken) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid Bearer token' });
    return false;
  }
  return true;
}

const buckets = new Map();

/**
 * Simple in-memory fixed-window rate limit per client IP.
 * Per serverless instance only (instances don't share memory) - a cost guard, not a hard quota.
 */
export function rateLimit(req, res, { limit = 10, windowMs = 10 * 60 * 1000, now = Date.now() } = {}) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' && forwarded.split(',')[0].trim())
    || (req.socket && req.socket.remoteAddress)
    || 'unknown';
  const entry = buckets.get(ip);
  if (!entry || now - entry.start >= windowMs) {
    buckets.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count += 1;
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too Many Requests: rate limit exceeded', retryAfterSeconds: retryAfter });
    return false;
  }
  return true;
}

/** Test helper: clear rate-limit state. */
export function __resetRateLimit() {
  buckets.clear();
}

```

## File: `api/compliance.js`
> **Scope**: Vercel serverless HTTP route handler, payload validation (siteContext, hazards, taskType), method gating, and error handling.

```javascript
import { generateStatutoryDocument } from '../src/api/compliance.js';
import { applyCors, requireToken, rateLimit } from './_lib/security.js';

const VALID_TASK_TYPES = ['HIRA', 'SWP', 'Incident Root Cause', 'Toolbox Talk'];

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Fails closed when ERGOSAFE_API_TOKEN is unset (no default token). See api/_lib/security.js.
  if (!requireToken(req, res)) return;

  if (req.method === 'GET') {
    res.status(200).json({
      service: 'ErgoSafe Statutory OHS Compliance Engine',
      endpoint: '/api/compliance',
      status: 'OPERATIONAL',
      framework: 'South African OHS Act 85 of 1993 & Ergonomics Regs 2019',
      version: 'v3.0.0',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    // Each POST calls the paid AI model: cap it per client IP (10 per 10 minutes)
    if (!rateLimit(req, res, { limit: 10, windowMs: 10 * 60 * 1000 })) return;
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { taskType, siteContext, hazards } = body;

      // Input validation
      if (!taskType || !VALID_TASK_TYPES.includes(taskType)) {
        res.status(400).json({
          error: `Bad Request: taskType must be one of [${VALID_TASK_TYPES.join(', ')}]`
        });
        return;
      }

      if (siteContext && typeof siteContext === 'string' && siteContext.length > 200) {
        res.status(400).json({
          error: 'Bad Request: siteContext exceeds maximum allowed length of 200 characters'
        });
        return;
      }

      if (hazards && typeof hazards === 'string' && hazards.length > 2000) {
        res.status(400).json({
          error: 'Bad Request: hazards exceeds maximum allowed length of 2000 characters'
        });
        return;
      }

      const result = await generateStatutoryDocument(body);
      if (!result.success && result.error && result.error.includes('Service Unavailable')) {
        res.status(503).json({
          success: false,
          error: 'Service Unavailable: upstream AI compliance model is currently unavailable',
          details: result.error
        });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.error('[API /api/compliance] Error processing request:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to generate statutory compliance document',
        details: err.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

```

## File: `src/api/compliance.ts`
> **Scope**: Core document generation logic and system prompt interfacing.

```typescript
/**
 * ErgoSafe Reborn V3 - Statutory OHS Compliance API Engine
 * Server-side handler for generating statutory OHS documents grounded in South African legislation.
 */

declare const process: { env: Record<string, string | undefined> };

export interface ComplianceRequestPayload {
  taskType: string; // e.g., "HIRA", "SWP", "Incident Root Cause", "Toolbox Talk"
  siteContext: string; // e.g., "Logistics Warehouse - Durban Port"
  hazards: string; // e.g., "Repetitive lumbar strain from lifting 25kg boxes, monitor height mismatch"
}

export interface ComplianceResponseData {
  success: boolean;
  document: string;
  fallback?: boolean;
  metadata: {
    taskType: string;
    siteContext: string;
    hazards: string;
    timestamp: string;
    grounding: string;
    model: string;
  };
  error?: string;
}

export const OHS_SYSTEM_PROMPT = `You are the embedded statutory engine for ErgoSafe, acting as an expert South African Occupational Health and Safety (OHS) Compliance & Risk Management Specialist.

Core Directives:
1. Standards Taxonomy Separation:
   - Mandatory South African Statutory Frameworks:
     * Occupational Health and Safety Act 85 of 1993 (Sections 8, 14, 16, 17, 24, 37, 38).
     * Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019). Do NOT cite draft GNR 1009.
     * Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) for thermal stress (cold/heat) and illumination (replacing repealed Environmental Regulations 1987).
     * General Safety Regulations (GSR): GSR 13H (Housekeeping & Floor Maintenance) and GSR 13J (Fire precaution & means of egress with outward-opening doors).
     * COIDA Act 130 of 1993.
   - Voluntary Best-Practice Frameworks: ISO 45001:2018 (Occupational Health & Safety Management Systems) and ISO 45003:2021 (Psychosocial Risk). Always label ISO standards as voluntary, never statutory in South Africa.
2. Statutory Record Retention:
   - 40 YEARS for Regulation 6 Ergonomic Risk Assessments and Regulation 8 Medical Surveillance records (Ergonomics Regulations, 2019 Regulation 10(1)).
   - 3 YEARS for equipment inspection logs, lifting tackle, and control measure maintenance (Regulations 7 & 9).
3. Medical Surveillance (Regulation 8(1)):
   - Physical hazards trigger an OMP referral recommendation under Regulation 8(1) where the Regulation 6 risk assessment indicates the need or an occupational health practitioner recommends it. Do NOT state that medical surveillance is legally mandatory.
4. Hierarchy of Controls: Strictly sequence controls: Elimination -> Substitution -> Engineering -> Administrative -> PPE.
5. Citations: Cite specific statutory sections and regulations correctly.
6. Format & Disclaimers: Deliver clean, structured Markdown ready for on-screen review and PDF compilation. Always include the Statutory Compliance Notice disclaimer banner and Competent Person verification sign-off section.`;

/**
 * Executes statutory compliance generation via Anthropic API (or structured statutory fallback).
 */
export async function generateStatutoryDocument(
  payload: ComplianceRequestPayload
): Promise<ComplianceResponseData> {
  const { taskType = 'HIRA', siteContext = 'General Facility', hazards = 'Unspecified postural & physical hazards' } = payload;
  const timestamp = new Date().toISOString();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const modelName = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';

  const userPrompt = `Generate a statutory OHS compliance document for South African workplace safety:
Document Type: ${taskType}
Site / Workplace Context: ${siteContext}
Identified Hazards & Risk Factors: ${hazards}

Provide a comprehensive, professional ${taskType} document strictly grounded in South African OHS legislation.
Ensure clear headers, statutory reference citations, an initial risk rating section to be completed by the assessor, a strict Hierarchy of Controls matrix, and formal approval fields for the designated statutory Competent Person (Appointed Sec 16.2 / Risk Assessor).`;

  if (apiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelName,
          max_tokens: 3000,
          temperature: 0.0,
          system: OHS_SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const contentBlock = data.content?.[0];
        if (contentBlock && contentBlock.type === 'text' && contentBlock.text) {
          return {
            success: true,
            document: contentBlock.text,
            metadata: {
              taskType,
              siteContext,
              hazards,
              timestamp,
              grounding: 'OHS Act 85 of 1993, Ergonomics Regs 2019 (Mandatory Statutory) & ISO 45001:2018 (Voluntary Framework)',
              model: `${modelName} (Deterministic Temp 0.0 with Human Sign-Off Gate)`
            }
          };
        }
      } else {
        console.warn('[ErgoSafe Compliance API] Anthropic API returned HTTP error:', response.status);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('[ErgoSafe Compliance API] Failed to invoke Anthropic API:', err);
    }
  }

  // If upstream model fails or API key is unconfigured, return clean 503 Service Unavailable
  return {
    success: false,
    fallback: false,
    document: '',
    error: 'Service Unavailable: Upstream AI compliance model is unavailable. Please verify API key configuration.',
    metadata: {
      taskType,
      siteContext,
      hazards,
      timestamp,
      grounding: 'South African OHS Act 85 of 1993 & Ergonomics Regulations, 2019',
      model: 'None (Upstream 503)'
    }
  };
}

/**
 * Fallback generator for South African statutory documentation
 */
function generateSouthAfricanStatutoryFallback(
  taskType: string,
  siteContext: string,
  hazards: string,
  timestamp: string
): string {
  const dateStr = new Date(timestamp).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `> **STATUTORY COMPLIANCE NOTICE**: *AI-assisted draft compiled for operational guidance. In terms of the Occupational Health and Safety Act (Act 85 of 1993), this document is not a certified legal record until reviewed, adjusted for site-specific conditions, and signed off by a designated Competent Person.*

# REPUBLIC OF SOUTH AFRICA - STATUTORY OHS COMPLIANCE DOSSIER
**Document Type:** ${taskType.toUpperCase()}
**Statutory Framework:** Occupational Health and Safety Act 85 of 1993 & Ergonomics Regulations, 2019
**Site / Workplace Context:** ${siteContext}
**Date of Assessment:** ${dateStr}
**Document Ref:** RSA-OHS-${Math.floor(100000 + Math.random() * 900000)}

---

## 1. STANDARDS TAXONOMY & MANDATE

### A. Mandatory South African Statutory Frameworks:
- **OHS Act 85 of 1993 Section 8(1) & 8(2)(b):** Legal duty to provide a safe workspace and eliminate or mitigate hazards.
- **Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019):** Regulation 6 Ergonomic Risk Assessment, Regulation 8(1) Medical Surveillance (surveillance is required where the Regulation 6 risk assessment indicates the need or an occupational health practitioner recommends it, with referral to an Occupational Medicine Practitioner), and Regulation 10 (40-year statutory record retention for assessments/surveillance; 3-year retention for equipment logs under Regs 7 & 9).
- **Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025):** Mandatory thermal stress management and illumination standards.
- **General Safety Regulations:** GSR 13H (Housekeeping & floor maintenance) and GSR 13J (Fire precaution and means of egress with unobstructed outward-opening doors).
- **Compensation for Occupational Injuries & Diseases Act (COIDA Act 130 of 1993):** Disease prevention and statutory injury reporting.

### B. Voluntary Best-Practice Frameworks:
- **ISO 45001:2018 Clause 6.1.2:** Voluntary international standard for Occupational Health & Safety Management Systems.

---

## 2. HAZARD IDENTIFICATION & EVALUATION
**Target Workplace Environment:** ${siteContext}  
**Identified Hazard Scope:** ${hazards}

### Risk Score Evaluation:
- **Risk Rating:** *Risk rating must be completed by the competent assessor based on site inspection and severity/likelihood evaluation.*
- **Assessment Scope:** Ergonomic and physical agents risk assessment under Regulation 6.

---

## 3. HIERARCHY OF CONTROLS (RSA OHS ACT SECTION 8)

| Priority Level | Hierarchy Tier | Statutory Mitigation Strategy | Framework Reference |
| :--- | :--- | :--- | :--- |
| **1. Primary** | **Elimination** | Redesign workflow to eliminate manual handling of loads >25kg and awkward static postures. | OHS Act Sec 8(2)(a) |
| **2. Secondary** | **Substitution** | Replace rigid equipment with height-adjustable and ergonomic mechanical aids. | Ergonomics Reg 6(3) |
| **3. Tertiary** | **Engineering Controls** | Install adjustable workstations, anti-fatigue flooring, and mechanical pallet lifters. | GSR 2 / Voluntary ISO 45001 |
| **4. Quaternary** | **Administrative Controls** | Implement scheduled rest breaks, task rotation, and ergonomic awareness training. | Ergonomics Reg 7 |
| **5. Quinary** | **Personal Protective Equipment (PPE)** | Issue slip-resistant safety footwear, anti-vibration gloves, and job-appropriate gear. | GSR 2(1) |

---

## 4. SAFE WORK PROCEDURE (SWP) & OPERATIONAL CONTROLS

1. **Pre-Shift Verification:** Supervisors must confirm all mechanical aids are inspected prior to shift commencement.
2. **Workplace Ergonomic Review:** Periodic task evaluation conducted to detect posture fatigue indicators.
3. **Escalation Protocol:** Posture strain or ergonomic risks identified must be documented and addressed under Section 8(1) general duties and routed to designated Section 16(2) assignees for remediation.

---

## 5. STATUTORY VERIFICATION & COMPETENT PERSON SIGN-OFF

- **Designated Competent Person:** \`______________________\`  **Date:** \`${dateStr}\`
- **Statutory Role / Designation:** \`______________________\`  **Appointee ID:** \`RSA-OHS-SEC162\`
- **ErgoSafe System Verification:** \`OFFLINE TEMPLATE - REQUIRES SITE VALIDATION\`
`;
}

```

## File: `src/store/complianceStore.ts`
> **Scope**: Deterministic statutory risk engine, weight parsing (parseMaxWeightKg), the > 25 kg guidance boundary check, Regulation 8(1) OMP surveillance referral logic, and 40-year retention tags.

```typescript
import { create } from 'zustand';
import { useTenantStore } from './tenantStore';
import { 
    StatutoryComplianceMetadata, 
    StatutoryRetentionPeriod, 
    StatutoryRecordCategory,
    StatutoryComplianceClassification
} from '../types/statutory';
import { OMP_REFERRAL_STATUTORY_STRING } from '../data/industryPresets';

export type ComplianceStatus = 'COMPLIANT' | 'RISK_ALERT' | 'BREACH' | 'ESCALATED_UNRESOLVED' | 'OVERDUE_HIGH_RISK';
export type EscalationState = 'triggered' | 'routed_to_manager' | 'escalated_level_2' | 'resolved';

export interface EmployeeCase {
    id: string;
    companyId: string;
    employeeName: string;
    dept: string;
    score: number;
    status: ComplianceStatus;
    managerName: string;
    hazardTrigger: string;
    createdAt: string; // ISO string
    timeframeHours: number;
    escalationState: EscalationState;
    statutoryMetadata?: StatutoryComplianceMetadata;
}

export interface ComplianceLog {
    timestamp: string;
    score: number;
    threshold: number;
    reason?: string;
    retentionPeriod?: StatutoryRetentionPeriod;
    retentionCategory?: StatutoryRecordCategory;
    requiresOMPReferral?: boolean;
    ompReferralStatus?: string;
    isStatutoryBreach?: boolean;
}

export interface ComplianceState {
    status: ComplianceStatus;
    requiresEscalation: boolean;
    logs: ComplianceLog[];
    exceptions: string[];
    cases: EmployeeCase[];
    gear: {
        governance: number;
        efficiency: number;
        accountability: number;
        resilience: number;
    };
    demoMode: boolean;
    setDemoMode: (enabled: boolean) => void;
    addWorkspaceException: (exception: string) => void;
    logHazardEvent: (
        type: 'posture' | 'neck_strain' | 'break_interval' | 'physical_hazard' | 'statutory_compliance' | string, 
        description: string, 
        severity?: 'RISK_ALERT' | 'BREACH'
    ) => void;
    evaluateStatutoryPhysicalHazard: (
        hazardType: 'bulk_lift_25kg' | 'carcass_handling' | 'knife_boning' | 'cold_room_stress' | string,
        contextDetails: string,
        employeeName?: string,
        dept?: string
    ) => { triggered: boolean; caseRecord: EmployeeCase };
    logStatutoryLegalBreach: (
        breachType: 'missing_sec16_2' | 'missing_sec17_she_rep' | 'missing_reg6_assessment' | 'refusal_reg10_retention' | 'uncertified_machinery_dmr18',
        details: string,
        responsiblePerson?: string
    ) => EmployeeCase;
    logVerifiedBBSIntervention: (type: string, hazardResolved: string, durationSeconds: number) => void;
    logEmployeeTrainingRecord: (moduleName: string, employeeName: string, competencyVerified: boolean) => void;
    exportStatutoryDocToAuditLog: (docType: string, siteContext: string, previewText: string, reviewerName?: string, reviewerRole?: string) => void;
    resetCompliance: () => void;
    resolveCase: (id: string) => void;
    updateCaseEscalation: (id: string, state: EscalationState) => void;
    tickSimulatedTime: () => void;
    processTelemetry: (data: {
        pelvicSpineAngle: number;
        cervicalSpineTilt: number;
        shoulderElbowAngle: number;
        shoulderElevation: number;
        setupName: string;
    }) => { triggered: boolean; reason: string };
}

/** SLA (hours) for a physical HIGH RISK finding before it escalates. Shown in labels so the two never disagree. */
export const HIGH_RISK_SLA_HOURS = 72;
export const HIGH_RISK_TAG = `HIGH RISK (Priority Action Required within ${HIGH_RISK_SLA_HOURS} hours)`;

/**
 * Parse every weight mentioned in free text and return the largest single value in kg.
 * Handles SA comma decimals ("25,5 kg"), space/non-breaking-space thousands ("1 000 kg"),
 * and "2 x 15 kg" (per-lift weight is 15, never multiplied). Returns 0 when no weight is found.
 */
export const parseMaxWeightKg = (text: string): number => {
    const re = /(\d{1,3}(?:[ \u00a0]\d{3})+|\d+)(?:[.,](\d+))?\s*(?:kg|kgs|kilos?|kilograms?)\b/gi;
    let max = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const whole = m[1].replace(/[ \u00a0]/g, '');
        const value = parseFloat(m[2] ? `${whole}.${m[2]}` : whole);
        if (Number.isFinite(value) && value > max) max = value;
    }
    return max;
};

/**
 * Deterministic Physical Hazard Evaluation Engine
 * 1. Physical Ergonomic & Thermal Hazard Risks -> HIGH RISK (priority action), never a legal BREACH.
 *    OMP referral is a *recommendation* under Regulation 8(1) of the Ergonomics Regulations, 2019.
 * 2. Statutory Legal Breaches are created ONLY through the explicit logStatutoryLegalBreach API.
 *    Free text can at most raise `suggestedStatutoryReview` for a human to confirm.
 */
export const detectPhysicalStatutoryHazard = (text: string): { 
    isPhysicalHighRisk: boolean; 
    isStatutoryBreach: false;
    suggestedStatutoryReview: boolean;
    hazardLabel: string;
    statutoryMetadata: StatutoryComplianceMetadata 
} => {
    const lower = text.toLowerCase();

    // Free text never creates a legal breach. It can only suggest a human review
    // (e.g. a note saying "no SHE rep appointed on night shift").
    const suggestedStatutoryReview = /\b(?:no|missing|absent|without|lack of|failed to appoint)\s+(?:a\s+)?(?:section\s*17|she|health\s*(?:&|and)\s*safety)\s*(?:rep|representative|designation|appointment)\b/i.test(lower);

    // Manual handling: HIGH RISK only for a parsed weight strictly greater than 25 kg.
    const parsedWeight = parseMaxWeightKg(lower);
    const isOver25kgManualHandling = parsedWeight > 25;

    const isCarcassHandling = lower.includes('carcass') || lower.includes('beef quarter') || lower.includes('hanging rail');
    const isKnifeDeboning = lower.includes('deboning') || lower.includes('knife boning') || lower.includes('meat cutting') || lower.includes('band saw');
    const isColdRoomStress = lower.includes('cold room') || lower.includes('cold-room') || lower.includes('freezer') || lower.includes('chiller') || lower.includes('thermal stress') || lower.includes('sub-zero') || lower.includes('cold stress');

    const isPhysicalHighRisk = isOver25kgManualHandling || isCarcassHandling || isKnifeDeboning || isColdRoomStress;

    let hazardLabel = 'Physical Ergonomic Risk Factor';
    let citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6 & Reg 10(1)';
    let controls = 'Elimination -> Engineering -> Administrative -> PPE';

    if (isOver25kgManualHandling) {
        hazardLabel = `${HIGH_RISK_TAG}: Manual Handling > 25 kg`;
        citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); OHS Act Sec 8(2)(b)';
        controls = 'Elimination (pallet automation) -> Engineering (scissor lift / vacuum lifter; inspection logs retained 3 years under Regs 7 & 9) -> Administrative (2-person team lift > 25kg; employee training retained for tenure under Reg 3) -> PPE (steel-toe footwear)';
    } else if (isCarcassHandling) {
        hazardLabel = `${HIGH_RISK_TAG}: Heavy Carcass Handling`;
        citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1); GSR 13H (Housekeeping & Non-Slip Drainage)';
        controls = 'Engineering (motorized monorail hoists; logs retained 3 years under Regs 7 & 9) -> Administrative (2-butcher team unhooking; training retained for tenure under Reg 3) -> PPE (waterproof boots, chainmail & butcher aprons)';
    } else if (isKnifeDeboning) {
        hazardLabel = `${HIGH_RISK_TAG}: Knife Deboning Force & Tendon Strain`;
        // TODO(legal-verify): confirm the applicable COIDA Schedule 3 disease item before citing it here.
        citation = 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6, Reg 8(1), Reg 8(2) & Reg 10(1)';
        controls = 'Engineering (ergonomic non-slip knife handles, motorized hollow grinders) -> Administrative (task rotation per the Reg 6 assessment) -> PPE (chainmail cut-resistant gloves)';
    } else if (isColdRoomStress) {
        hazardLabel = `${HIGH_RISK_TAG}: Cold Room Thermal Stress`;
        citation = 'Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025) Regulation 9 (Cold Stress) (Repealing ERW 1987); Ergonomics Regulations, 2019 (GN R1589) Reg 8(1), Reg 8(2) & Reg 10(1); GSR 13J';
        // TODO(legal-verify): removed "max 45 min cold exposure under Reg 9" - no such limit found in GN 5952 Reg 9.
        controls = 'Engineering (heated door gaskets, emergency door push-bars complying with GSR 13J) -> Administrative (work-warming regime set by the physical agent exposure risk assessment; hot drink warm-up breaks) -> PPE (thermal freezer suits, insulated balaclavas)';
    }

    return {
        isPhysicalHighRisk,
        isStatutoryBreach: false,
        suggestedStatutoryReview,
        hazardLabel,
        statutoryMetadata: {
            retentionPeriod: 40,
            retentionCategory: isPhysicalHighRisk ? 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR' : 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
            retentionDescription: isPhysicalHighRisk
                ? 'Medical surveillance records retained 40 years under Ergonomics Regulations, 2019 Regulation 10(1)'
                : 'Ergonomic risk assessment records retained 40 years under Ergonomics Regulations, 2019 Regulation 10(1)',
            isStatutoryBreach: false,
            requiresOMPReferral: isPhysicalHighRisk,
            ompReferralStatus: isPhysicalHighRisk ? OMP_REFERRAL_STATUTORY_STRING : undefined,
            statutoryCitation: citation,
            hierarchyOfControlsMandate: controls,
            competentPersonRequirement: 'Appointed Risk Assessor & Registered Occupational Medicine Practitioner (OMP)',
            riskClassification: isPhysicalHighRisk ? 'HIGH_RISK_PRIORITY_ACTION' : 'RISK_ALERT',
            statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) & Physical Agents Regulations, 2024 (GN 5952, GG 52226 of 6 March 2025)'
        }
    };
};

// Initial seeded cases
const initialCases = (): EmployeeCase[] => {
    const now = new Date();
    const mikeCreated = new Date(now.getTime() - 22 * 1000).toISOString();
    const louisCreated = new Date(now.getTime() - 26 * 1000).toISOString();
    const sarahCreated = new Date(now.getTime() - 48 * 1000).toISOString();
    const harveyCreated = new Date(now.getTime() - 5 * 1000).toISOString();

    return [
        {
            id: 'case-1',
            companyId: 'COMP-001',
            employeeName: 'Sarah Jenkins',
            dept: 'Marketing',
            score: 98,
            status: 'COMPLIANT',
            managerName: 'Robert Zane',
            hazardTrigger: 'Ergonomic Desk Adjustment & Monitor Arm Calibration',
            createdAt: sarahCreated,
            timeframeHours: 72,
            escalationState: 'resolved',
            statutoryMetadata: {
                retentionPeriod: 3,
                retentionCategory: 'REG_7_9_EQUIPMENT_INSPECTION_LOG_3_YR',
                retentionDescription: 'Equipment maintenance and inspection log retained 3 years under Regulations 7 & 9',
                isStatutoryBreach: false,
                requiresOMPReferral: false,
                statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589) Reg 7 & 9',
                hierarchyOfControlsMandate: 'Engineering controls verified and signed off.',
                competentPersonRequirement: 'Internal Ergonomics Champion',
                riskClassification: 'COMPLIANT',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        },
        {
            id: 'case-2',
            companyId: 'COMP-001',
            employeeName: 'Mike Ross',
            dept: 'Engineering',
            score: 65,
            status: 'RISK_ALERT',
            managerName: 'Harvey Specter',
            hazardTrigger: 'Kitchen Counter Workspace (typing on high surface, shoulder shrugging)',
            createdAt: mikeCreated,
            timeframeHours: 24,
            escalationState: 'routed_to_manager',
            statutoryMetadata: {
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                retentionDescription: 'Ergonomic risk assessment retained 40 years under Regulation 10(1)',
                isStatutoryBreach: false,
                requiresOMPReferral: false,
                statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6 & Reg 10(1)',
                hierarchyOfControlsMandate: 'Administrative adjustment to seated desk with footrest.',
                competentPersonRequirement: 'Designated Health & Safety Representative',
                riskClassification: 'RISK_ALERT',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        },
        {
            id: 'case-3',
            companyId: 'COMP-002',
            employeeName: 'Louis Litt',
            dept: 'Finance',
            score: 30,
            status: 'RISK_ALERT', // Physical postural hazard: High Risk (Priority Action), NOT Statutory Breach
            managerName: 'Sheila Sazs',
            hazardTrigger: `[${HIGH_RISK_TAG}] Working from Bed (severe pelvic tilt >=120°, cervical forward tilt >=30°)`,
            createdAt: louisCreated,
            timeframeHours: 24,
            escalationState: 'escalated_level_2',
            statutoryMetadata: {
                retentionPeriod: 40,
                retentionCategory: 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR',
                retentionDescription: 'Medical surveillance records retained 40 years under Regulation 10(1)',
                isStatutoryBreach: false,
                requiresOMPReferral: true,
                ompReferralStatus: OMP_REFERRAL_STATUTORY_STRING,
                statutoryCitation: 'OHS Act 85 of 1993 Sec 8(2) & Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 8(1), Reg 8(2) & Reg 10(1)',
                hierarchyOfControlsMandate: 'Elimination of bed-working; OMP referral recommended under Regulation 8(1).',
                competentPersonRequirement: 'Registered Occupational Medicine Practitioner (OMP)',
                riskClassification: 'HIGH_RISK_PRIORITY_ACTION',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        },
        {
            id: 'case-4',
            companyId: 'COMP-001',
            employeeName: 'Harvey Specter',
            dept: 'Legal',
            score: 88,
            status: 'RISK_ALERT',
            managerName: 'Jessica Pearson',
            hazardTrigger: 'Monitor Height mismatch & continuous cervical extension',
            createdAt: harveyCreated,
            timeframeHours: 72,
            escalationState: 'routed_to_manager',
            statutoryMetadata: {
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                retentionDescription: 'Ergonomic assessment retained 40 years under Regulation 10(1)',
                isStatutoryBreach: false,
                requiresOMPReferral: false,
                statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6',
                hierarchyOfControlsMandate: 'Engineering: monitor arm elevation adjustment.',
                competentPersonRequirement: 'OHS Risk Assessor',
                riskClassification: 'RISK_ALERT',
                statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
            }
        }
    ];
};

export const useComplianceStore = create<ComplianceState>((set, get) => {
    
    const fireEvent = (name: string, detail: any) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(name, { detail }));
        }
    };

    // Global status: BREACH only when a case is a genuine statutory breach that is still open.
    const summariseStatus = (cases: EmployeeCase[]): { status: ComplianceStatus; requiresEscalation: boolean } => {
        const open = cases.filter(c => c.escalationState !== 'resolved');
        const hasBreach = open.some(c => c.status === 'BREACH');
        const hasRisk = open.some(c => c.status === 'RISK_ALERT' || c.status === 'OVERDUE_HIGH_RISK' || c.status === 'ESCALATED_UNRESOLVED');
        return {
            status: hasBreach ? 'BREACH' : (hasRisk ? 'RISK_ALERT' : 'COMPLIANT'),
            requiresEscalation: open.some(c => c.escalationState === 'routed_to_manager' || c.escalationState === 'escalated_level_2')
        };
    };

    const calculateGEARMetrics = (cases: EmployeeCase[]) => {
        const activeTrackingCases = cases.filter(c => c.escalationState === 'routed_to_manager' || c.escalationState === 'escalated_level_2');
        const level2Count = cases.filter(c => c.escalationState === 'escalated_level_2').length;

        const governance = Math.max(40, 100 - (activeTrackingCases.length * 10) - (level2Count * 15));
        const efficiency = Math.max(50, 100 - (level2Count * 20));
        const accountability = 98;
        const resolvedCount = cases.filter(c => c.escalationState === 'resolved').length;
        const resilience = Math.max(30, Math.min(100, 85 - (level2Count * 25) + (resolvedCount * 5)));

        return { governance, efficiency, accountability, resilience };
    };

    // NOTE: the store no longer listens to its own NON_COMPLIANCE_TRIGGER event.
    // Every action writes its own log entry; the event is only for other listeners.

    const initialCasesList = initialCases();

    return {
        status: 'RISK_ALERT',
        requiresEscalation: true,
        logs: [],
        exceptions: [],
        cases: initialCasesList,
        gear: calculateGEARMetrics(initialCasesList),
        demoMode: false,
        setDemoMode: (enabled) => set({ demoMode: enabled }),
        addWorkspaceException: (exception) => {
            useTenantStore.getState().recordUsage();
            set((state) => {
            const newExs = [...state.exceptions, exception];
            
            const newCase: EmployeeCase = {
                id: `case-${Date.now()}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: 'Self (Remote User)',
                dept: 'Engineering',
                score: 70,
                status: 'RISK_ALERT',
                managerName: 'Harvey Specter',
                hazardTrigger: `Workspace Exception: ${exception}`,
                createdAt: new Date().toISOString(),
                timeframeHours: 24,
                escalationState: 'routed_to_manager',
                statutoryMetadata: {
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Workspace exception risk record retained 40 years',
                    isStatutoryBreach: false,
                    requiresOMPReferral: false,
                    statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6 & 10(1)',
                    hierarchyOfControlsMandate: 'Employee exception self-audit log.',
                    competentPersonRequirement: 'OHS Coordinator',
                    riskClassification: 'RISK_ALERT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                exceptions: newExs,
                cases: newCases,
                gear: newGear,
                status: 'RISK_ALERT',
                requiresEscalation: true,
                logs: [
                    {
                        timestamp: new Date().toISOString(),
                        score: 18,
                        threshold: 15,
                        reason: `Workspace Exception Flagged: ${exception}`,
                        retentionPeriod: 40,
                        retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
                    },
                    ...state.logs
                ]
            };
            });
        },

        logHazardEvent: (type, description, severity = 'RISK_ALERT') => {
            const state = get();
            const evalResult = detectPhysicalStatutoryHazard(description + ' ' + type);
            
            const finalStatus: ComplianceStatus = evalResult.isStatutoryBreach 
                ? 'BREACH' 
                : 'RISK_ALERT';
            
            const finalScore = evalResult.isStatutoryBreach ? 15 : (evalResult.isPhysicalHighRisk ? 30 : 68);
            
            const formattedTrigger = evalResult.isStatutoryBreach
                ? `[STATUTORY BREACH] ${description}`
                : (evalResult.isPhysicalHighRisk 
                    ? `[${HIGH_RISK_TAG}] ${description}`
                    : `[Nelly Engine ${type.toUpperCase()}] ${description}`);

            const newCase: EmployeeCase = {
                id: `case-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: 'Self (ErgoSafe Telemetry)',
                dept: evalResult.isPhysicalHighRisk ? 'Operations & Processing' : 'Workstation Ergonomics',
                score: finalScore,
                status: finalStatus,
                managerName: 'Harvey Specter',
                hazardTrigger: formattedTrigger,
                createdAt: new Date().toISOString(),
                timeframeHours: evalResult.isStatutoryBreach ? 24 : 72,
                escalationState: 'routed_to_manager',
                statutoryMetadata: evalResult.statutoryMetadata
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);
            const newLog: ComplianceLog = {
                timestamp: new Date().toISOString(),
                score: finalScore,
                threshold: 80,
                reason: formattedTrigger,
                retentionPeriod: evalResult.statutoryMetadata.retentionPeriod,
                retentionCategory: evalResult.statutoryMetadata.retentionCategory,
                requiresOMPReferral: evalResult.statutoryMetadata.requiresOMPReferral,
                ompReferralStatus: evalResult.statutoryMetadata.ompReferralStatus,
                isStatutoryBreach: evalResult.isStatutoryBreach
            };

            // Pure state update without side-effects inside set
            set({
                cases: newCases,
                gear: newGear,
                status: evalResult.isStatutoryBreach ? 'BREACH' : state.status,
                requiresEscalation: true,
                logs: [newLog, ...state.logs]
            });

            // Side effects executed cleanly outside set updater
            useTenantStore.getState().recordUsage();
            fireEvent('NON_COMPLIANCE_TRIGGER', {
                score: newLog.score,
                threshold: newLog.threshold,
                timestamp: newLog.timestamp,
                reason: newLog.reason
            });
        },

        evaluateStatutoryPhysicalHazard: (hazardType, contextDetails, employeeName = 'Floor Operator', dept = 'Processing & Logistics') => {
            const evalResult = detectPhysicalStatutoryHazard(`${hazardType} ${contextDetails}`);
            
            // Physical risk thresholds are HIGH RISK (priority action), never a statutory BREACH
            const formattedTrigger = evalResult.isPhysicalHighRisk
                ? `[${evalResult.hazardLabel}] ${contextDetails}`
                : `[${HIGH_RISK_TAG}] ${evalResult.hazardLabel}: ${contextDetails}`;

            const caseRecord: EmployeeCase = {
                id: `statutory-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName,
                dept,
                score: 30, // High Risk score
                status: 'RISK_ALERT', // Physical hazard is classified as RISK_ALERT / High Risk, NOT statutory BREACH
                managerName: 'Harvey Specter (OHS Sec 16.2 Appointee)',
                hazardTrigger: formattedTrigger,
                createdAt: new Date().toISOString(),
                timeframeHours: HIGH_RISK_SLA_HOURS,
                escalationState: 'routed_to_manager',
                statutoryMetadata: evalResult.statutoryMetadata
            };

            const state = get();
            const newCases = [caseRecord, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);
            const newLog: ComplianceLog = {
                timestamp: new Date().toISOString(),
                score: 30,
                threshold: 80,
                reason: formattedTrigger,
                retentionPeriod: 40,
                retentionCategory: 'REG_8_2_MEDICAL_SURVEILLANCE_RECORD_40_YR',
                requiresOMPReferral: true,
                ompReferralStatus: OMP_REFERRAL_STATUTORY_STRING,
                isStatutoryBreach: false
            };

            set({
                cases: newCases,
                gear: newGear,
                requiresEscalation: true,
                logs: [newLog, ...state.logs]
            });

            fireEvent('NON_COMPLIANCE_TRIGGER', {
                score: 30,
                threshold: 80,
                timestamp: newLog.timestamp,
                reason: newLog.reason
            });

            return { triggered: true, caseRecord };
        },

        logStatutoryLegalBreach: (breachType, details, responsiblePerson = 'Appointed Section 16(2) Manager') => {
            let label = 'STATUTORY BREACH: ';
            let citation = 'OHS Act 85 of 1993';

            if (breachType === 'missing_sec16_2') {
                label += 'Absence of Section 16(2) Health & Safety Delegation of Authority';
                citation = 'OHS Act 85 of 1993 Section 16(2)';
            } else if (breachType === 'missing_sec17_she_rep') {
                label += 'Absence of Section 17 Health & Safety Representative Designation';
                citation = 'OHS Act 85 of 1993 Section 17';
            } else if (breachType === 'missing_reg6_assessment') {
                label += 'Failure to Conduct / Maintain Regulation 6 Ergonomic Risk Assessment';
                citation = 'Ergonomics Regulations, 2019 (GN R1589) Regulation 6';
            } else if (breachType === 'refusal_reg10_retention') {
                label += 'Refusal to Maintain Statutory Records per Regulation 10(1)';
                citation = 'Ergonomics Regulations, 2019 (GN R1589) Regulation 10(1)';
            } else if (breachType === 'uncertified_machinery_dmr18') {
                label += 'Operating Driven Machinery Without Certified Competency / Missing Guards';
                citation = 'Driven Machinery Regulations 18 & General Machinery Regulations 2';
            }

            const caseRecord: EmployeeCase = {
                id: `breach-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: responsiblePerson,
                dept: 'Executive Compliance & Legal',
                score: 15,
                status: 'BREACH', // Genuine Statutory Legal Non-Compliance
                managerName: 'Managing Director / CEO (Section 16.1)',
                hazardTrigger: `[STATUTORY BREACH] ${label}: ${details}`,
                createdAt: new Date().toISOString(),
                timeframeHours: 24,
                escalationState: 'routed_to_manager',
                statutoryMetadata: {
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Statutory non-compliance ledger retained 40 years under Regulation 10(1)',
                    isStatutoryBreach: true,
                    requiresOMPReferral: false,
                    statutoryCitation: citation,
                    hierarchyOfControlsMandate: 'Immediate legal remediation mandatory under Section 38 penalty liability.',
                    competentPersonRequirement: 'Appointed Sec 16.1 / 16.2 Executive',
                    riskClassification: 'STATUTORY_BREACH',
                    statutoryNotice: 'Statutory legal breach under South African OHS legislation'
                }
            };

            const state = get();
            const newCases = [caseRecord, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);
            const newLog: ComplianceLog = {
                timestamp: new Date().toISOString(),
                score: 15,
                threshold: 80,
                reason: `[STATUTORY BREACH] ${label}: ${details}`,
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                isStatutoryBreach: true
            };

            set({
                cases: newCases,
                gear: newGear,
                status: 'BREACH',
                requiresEscalation: true,
                logs: [newLog, ...state.logs]
            });

            fireEvent('NON_COMPLIANCE_TRIGGER', {
                score: 15,
                threshold: 80,
                timestamp: newLog.timestamp,
                reason: newLog.reason
            });

            return caseRecord;
        },

        logEmployeeTrainingRecord: (moduleName, employeeName, competencyVerified) => {
            useTenantStore.getState().recordUsage();
            set((state) => {
            const timestamp = new Date().toISOString();

            const newCase: EmployeeCase = {
                id: `train-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName,
                dept: 'Ergonomics Training & Competency',
                score: competencyVerified ? 100 : 75,
                status: 'COMPLIANT',
                managerName: 'Designated Ergonomics Trainer',
                hazardTrigger: `Regulation 3 Training Completed: [${moduleName}]. Competency verified: ${competencyVerified}. Retained for duration of employment.`,
                createdAt: timestamp,
                timeframeHours: 72,
                escalationState: 'resolved',
                statutoryMetadata: {
                    retentionPeriod: 'TENURE', // Duration of employment under Regulation 10(1)
                    retentionCategory: 'REG_3_EMPLOYEE_TRAINING_RECORD_TENURE',
                    retentionDescription: 'Employee training record retained for duration of employment under Regulation 10(1)',
                    isStatutoryBreach: false,
                    requiresOMPReferral: false,
                    statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589) Regulation 3 & Regulation 10(1)',
                    hierarchyOfControlsMandate: 'Administrative training & competency verification.',
                    competentPersonRequirement: 'Certified Ergonomics Training Facilitator',
                    riskClassification: 'COMPLIANT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newLog: ComplianceLog = {
                timestamp,
                score: 100,
                threshold: 80,
                reason: `Training Record Archived: ${moduleName} for ${employeeName} [Retained for Duration of Employment]`,
                retentionPeriod: 'TENURE',
                retentionCategory: 'REG_3_EMPLOYEE_TRAINING_RECORD_TENURE'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                cases: newCases,
                gear: newGear,
                logs: [newLog, ...state.logs]
            };
            });
        },

        logVerifiedBBSIntervention: (type, hazardResolved, durationSeconds) => {
            useTenantStore.getState().recordUsage();
            set((state) => {
            const timestamp = new Date().toISOString();
            const userId = useTenantStore.getState().userId || 'EMP-7749';

            const newCase: EmployeeCase = {
                id: `bbs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: `Self (${userId})`,
                dept: 'Behavior-Based Safety (BBS)',
                score: 98,
                status: 'COMPLIANT',
                managerName: 'Harvey Specter',
                hazardTrigger: `Verified BBS Micro-Intervention: Resolved [${hazardResolved}] via ${durationSeconds}s ${type}`,
                createdAt: timestamp,
                timeframeHours: 72,
                escalationState: 'resolved',
                statutoryMetadata: {
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Intervention log retained 40 years as ergonomic record',
                    isStatutoryBreach: false,
                    requiresOMPReferral: false,
                    statutoryCitation: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019) Reg 6',
                    hierarchyOfControlsMandate: 'Administrative behavioral micro-break corrective action verified.',
                    competentPersonRequirement: 'Internal Ergonomics Auditor',
                    riskClassification: 'COMPLIANT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newLog: ComplianceLog = {
                timestamp,
                score: 98,
                threshold: 80,
                reason: `Verified BBS Micro-Intervention: Completed ${type} (${durationSeconds}s) for [${hazardResolved}]`,
                retentionPeriod: 40,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                cases: newCases,
                gear: newGear,
                logs: [newLog, ...state.logs]
            };
            });
        },

        exportStatutoryDocToAuditLog: (docType, siteContext, previewText, reviewerName = 'Competent Person (Appointed Sec 16.2)', reviewerRole = 'Statutory Risk Assessor') => set((state) => {
            const timestamp = new Date().toISOString();
            const id = `statutory-doc-${Date.now()}`;
            
            // 40-year retention under Ergonomics Regulations Regulation 10(1)
            const retentionPeriod: StatutoryRetentionPeriod = 40;

            const newCase: EmployeeCase = {
                id,
                companyId: useTenantStore.getState().companyId || 'COMP-001',
                employeeName: `Document Compilation: ${docType}`,
                dept: 'Statutory OHS Assurance',
                score: 100,
                status: 'COMPLIANT',
                managerName: reviewerName,
                hazardTrigger: `Statutory Dossier Exported: ${docType} for [${siteContext}]. Signed off by ${reviewerRole}. Grounded in OHS Act 85/1993, Ergonomics Regulations, 2019 (GN R1589) & Physical Agents Regulations, 2024 (GN 5952). Mandatory 40-Year Retention locked.`,
                createdAt: timestamp,
                timeframeHours: 72,
                escalationState: 'resolved',
                statutoryMetadata: {
                    retentionPeriod,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR',
                    retentionDescription: 'Risk assessment records retained 40 years under Regulation 10(1)',
                    isStatutoryBreach: false,
                    requiresOMPReferral: docType.includes('HIRA') || docType.includes('Cold'),
                    ompReferralStatus: docType.includes('HIRA') ? OMP_REFERRAL_STATUTORY_STRING : undefined,
                    statutoryCitation: 'OHS Act 85 of 1993 Section 8, Ergonomics Regulations, 2019 (GN R1589) Reg 6 & 10(1), Physical Agents Regulations, 2024 (GN 5952)',
                    hierarchyOfControlsMandate: 'Elimination -> Substitution -> Engineering -> Administrative -> PPE',
                    competentPersonRequirement: reviewerRole,
                    riskClassification: 'COMPLIANT',
                    statutoryNotice: 'Ergonomics Regulations, 2019 (GN R1589, GG 42894 of 6 December 2019)'
                }
            };

            const newLog: ComplianceLog = {
                timestamp,
                score: 100,
                threshold: 80,
                reason: `Statutory Archive Created: ${docType} (${siteContext}) [40-Year Statutory Retention Enforced under Reg 10(1)]`,
                retentionPeriod,
                retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
            };

            const newCases = [newCase, ...state.cases];
            const newGear = calculateGEARMetrics(newCases);

            return {
                cases: newCases,
                gear: newGear,
                logs: [newLog, ...state.logs]
            };
        }),

        resetCompliance: () => set((state) => {
            const resolvedCases = state.cases.map(c => ({
                ...c,
                status: 'COMPLIANT' as const,
                score: 98,
                escalationState: 'resolved' as const
            }));
            return {
                status: 'COMPLIANT',
                requiresEscalation: false,
                cases: resolvedCases,
                exceptions: [],
                gear: calculateGEARMetrics(resolvedCases)
            };
        }),

        resolveCase: (id) => {
            const state = get();
            const updatedCases = state.cases.map(c => 
                c.id === id ? { ...c, status: 'COMPLIANT' as const, score: 98, escalationState: 'resolved' as const } : c
            );
            set({
                cases: updatedCases,
                ...summariseStatus(updatedCases),
                gear: calculateGEARMetrics(updatedCases)
            });
            fireEvent('OHS_TRACKING_UPDATE', { id, newStatus: 'resolved' });
        },

        updateCaseEscalation: (id, escalationState) => {
            const state = get();
            const updatedCases = state.cases.map(c => {
                if (c.id === id) {
                    const isLegalBreach = c.statutoryMetadata?.isStatutoryBreach === true;
                    let status = c.status;
                    if (escalationState === 'escalated_level_2') {
                        status = isLegalBreach ? ('BREACH' as const) : (c.status === 'RISK_ALERT' ? ('OVERDUE_HIGH_RISK' as const) : c.status);
                    } else if (escalationState === 'resolved') {
                        status = 'COMPLIANT' as const;
                    }
                    return { ...c, escalationState, status };
                }
                return c;
            });
            set({
                cases: updatedCases,
                ...summariseStatus(updatedCases),
                gear: calculateGEARMetrics(updatedCases)
            });

            fireEvent('OHS_TRACKING_UPDATE', { id, newStatus: escalationState });
        },

        tickSimulatedTime: () => {
            const state = get();
            const now = Date.now();
            const escalated: EmployeeCase[] = [];

            const updatedCases = state.cases.map((c) => {
                if (c.escalationState !== 'routed_to_manager') return c;
                const createdTime = new Date(c.createdAt).getTime();
                // Real elapsed hours; the accelerated clock (1 s = 1 h) runs ONLY when demoMode is explicitly on
                const elapsedHours = state.demoMode 
                    ? (now - createdTime) / 1000 
                    : (now - createdTime) / 3600000;
                if (elapsedHours <= c.timeframeHours) return c;

                const isLegalBreach = c.statutoryMetadata?.isStatutoryBreach === true;
                const next: EmployeeCase = {
                    ...c,
                    status: isLegalBreach ? 'BREACH' : (c.status === 'RISK_ALERT' ? 'OVERDUE_HIGH_RISK' : c.status),
                    escalationState: 'escalated_level_2'
                };
                escalated.push(next);
                return next;
            });

            if (escalated.length === 0) return;

            set({
                cases: updatedCases,
                ...summariseStatus(updatedCases),
                gear: calculateGEARMetrics(updatedCases)
            });

            for (const c of escalated) {
                fireEvent('OHS_TRACKING_UPDATE', { 
                    id: c.id, 
                    employeeName: c.employeeName, 
                    newStatus: 'escalated_level_2',
                    reason: `Timeframe Escalation: Manager ${c.managerName} did not resolve within ${c.timeframeHours} hours.` 
                });
            }
        },

        processTelemetry: (data) => {
            useTenantStore.getState().recordUsage();
            const { pelvicSpineAngle, cervicalSpineTilt, shoulderElbowAngle, shoulderElevation, setupName } = data;
            
            let triggered = false;
            let reason = '';

            if (setupName === 'Bed' && pelvicSpineAngle >= 120 && cervicalSpineTilt >= 30) {
                triggered = true;
                reason = `Unsafe Bed Workspace (MediaPipe 3D): Pelvic-to-Spine angle is ${pelvicSpineAngle}° (>=120°) with cervical spine forward tilt of ${cervicalSpineTilt}° (>=30°).`;
            } else if (setupName === 'Kitchen Counter' && shoulderElbowAngle < 90 && shoulderElevation >= 15) {
                triggered = true;
                reason = `Unsafe Kitchen Counter (MediaPipe 3D): Shoulder-to-Elbow acute angle is ${shoulderElbowAngle}° (<90°) with elevated shoulder shrugging of ${shoulderElevation}px (>=15px).`;
            } else if (setupName === 'Couch' && (pelvicSpineAngle >= 115 || cervicalSpineTilt >= 25)) {
                triggered = true;
                reason = `Unsafe Couch Workspace (MediaPipe 3D): Poor spinal alignment (Pelvic-to-Spine: ${pelvicSpineAngle}°, Cervical Tilt: ${cervicalSpineTilt}°).`;
            }

            if (triggered) {
                const evalResult = detectPhysicalStatutoryHazard(reason);
                const newCase: EmployeeCase = {
                    id: `case-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    companyId: useTenantStore.getState().companyId || 'COMP-001',
                    employeeName: 'Self (Remote User)',
                    dept: 'Engineering',
                    score: 30, // High Risk score
                    status: 'RISK_ALERT', // Physical postural hazard: High Risk (Priority Action), NOT statutory BREACH
                    managerName: setupName === 'Bed' ? 'Sheila Sazs' : 'Harvey Specter',
                    hazardTrigger: `[${HIGH_RISK_TAG}] ${reason}`,
                    createdAt: new Date().toISOString(),
                    timeframeHours: 72,
                    escalationState: 'routed_to_manager',
                    statutoryMetadata: evalResult.statutoryMetadata
                };

                const newLog: ComplianceLog = {
                    timestamp: new Date().toISOString(),
                    score: 20,
                    threshold: 15,
                    reason,
                    retentionPeriod: 40,
                    retentionCategory: 'REG_6_ERGONOMIC_RISK_ASSESSMENT_40_YR'
                };
                const state = get();
                const newCases = [newCase, ...state.cases];
                set({
                    cases: newCases,
                    gear: calculateGEARMetrics(newCases),
                    requiresEscalation: true,
                    logs: [newLog, ...state.logs]
                });

                fireEvent('NON_COMPLIANCE_TRIGGER', {
                    score: newLog.score,
                    threshold: newLog.threshold,
                    timestamp: newLog.timestamp,
                    reason
                });
            }

            return { triggered, reason };
        }
    };
});

/** Snapshot of the store as first created. Tests reset with setState(initialComplianceState, true). */
export const initialComplianceState: ComplianceState = useComplianceStore.getState();

```

## File: `src/components/nelly/NellyEmergencyUI.tsx`
> **Scope**: Emergency dialer UI, tel: link protocols (112 fallback vs tenant config), and escalation decoupling.

```tsx
import { motion } from 'framer-motion';
import { useTenantStore, SA_PUBLIC_EMERGENCY_CONTACTS } from '../../store/tenantStore';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';

interface NellyEmergencyUIProps {
    onDeescalate: () => void;
}

export const NellyEmergencyUI = ({ onDeescalate }: NellyEmergencyUIProps) => {
    const currentTenant = useTenantStore((state) => state.getCurrentTenant());
    const emergencyContacts = currentTenant?.emergencyContacts?.length 
        ? currentTenant.emergencyContacts 
        : SA_PUBLIC_EMERGENCY_CONTACTS;
    const statutoryEmergencyDialer = currentTenant?.emergencyContactNumber || '112';
    const assemblyPoint = currentTenant?.assemblyPoint || 'Follow your site evacuation plan';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-red-600/90 border-2 border-white rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] pointer-events-auto"
        >
            <h4 className="text-white font-black uppercase text-xs mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                Critical Escalation Active
            </h4>
            <p className="text-[10px] text-white font-bold mb-3 leading-tight">
                High-risk event detected. Immediate evacuation or emergency medical assistance required.
            </p>

            {/* Statutory Emergency Dispatcher Link */}
            <div className="mb-3">
                <a
                    href={`tel:${statutoryEmergencyDialer}`}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white text-red-700 rounded-lg font-black text-xs hover:bg-gray-100 transition-all shadow-md border-2 border-red-700"
                >
                    <span className="flex items-center gap-2">
                        <AlertTriangle size={15} className="text-red-600 animate-pulse" />
                        <span>DISPATCH STATUTORY EMS:</span>
                    </span>
                    <span className="font-mono text-sm tracking-wider">{statutoryEmergencyDialer}</span>
                </a>
            </div>

            <div className="bg-white/10 p-2.5 rounded-lg border border-white/20 mb-3">
                <p className="text-[9px] text-white opacity-80 uppercase font-black flex items-center gap-1">
                    <MapPin size={12} /> Assembly Point
                </p>
                <p className="text-[11px] text-white font-bold mt-0.5">{assemblyPoint}</p>
            </div>
            
            <div className="space-y-1.5 mb-2">
                {emergencyContacts.map((contact) => (
                    <a
                        key={contact.number}
                        href={`tel:${contact.number}`}
                        className="w-full flex items-center justify-between px-3 py-2 bg-white/90 text-red-600 rounded-lg font-bold text-xs hover:bg-white transition-all shadow-sm"
                    >
                        <span className="flex items-center gap-1.5">
                            <Phone size={13} />
                            <span>{contact.label}</span>
                        </span>
                        <span className="font-mono text-xs">{contact.number}</span>
                    </a>
                ))}
            </div>

            <button
                onClick={onDeescalate}
                className="w-full text-[9px] text-white/70 font-black uppercase mt-2 hover:text-white transition-colors cursor-pointer"
            >
                De-escalate
            </button>
        </motion.div>
    );
};

```

