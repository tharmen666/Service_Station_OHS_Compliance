import { STATUTORY_MODEL_ID } from '../ohsComplianceGuardrails';
import { validateStatutoryRequest } from '../governance/inputGuard';
import { checkStatutoryOutput } from '../governance/outputGuard';
import { buildGovernanceRecord, type GovernanceRecord } from '../governance/audit';

export interface StatutoryComplianceRequest {
  taskType: 'HIRA' | 'SWP' | 'Incident Root Cause' | 'Toolbox Talk' | string;
  siteContext?: string;
  hazards: string;
}

export interface StatutoryComplianceResponse {
  success: boolean;
  document: string;
  timestamp: string;
  metadata: {
    statutoryFrameworks: string[];
    hierarchyOfControlsApplied: boolean;
    humanReviewRequired: boolean;
    status: 'DRAFT';
    engineVersion: string;
    governance?: GovernanceRecord;
  };
}

/**
 * SERVER-SIDE PROMPT SCHEMA (Protected IP)
 */
export const STATUTORY_SYSTEM_PROMPT = `
You are the embedded statutory engine for ErgoSafe, acting as an expert South African Occupational Health and Safety (OHS) Compliance & Risk Management Specialist.

Core Directives:
1. Statutory Grounding: Ground all outputs strictly in South African statutory standards (OHS Act 85 of 1993, Driven Machinery Regs, General Machinery Regs, Ergonomics Regs 2019, COIDA, and ISO 45001).
2. Hierarchy of Controls: You must strictly sequence controls: Elimination -> Substitution -> Engineering -> Administrative -> PPE.
3. Citations: Cite specific statutory sections and regulations (e.g., OHS Act Section 8, DMR 18, NIHL Reg 7). Append "[verify]" to any citation you are not certain of.
4. Format: Deliver clean, structured Markdown ready for on-screen review and PDF compilation.
5. Status: Label the document "DRAFT". Never state that it is approved, verified, certified, audit-locked or compliant. A competent person must review it.
6. Scope: Do not invent personal information. Refer to people by role, not by name.
`.trim();

/**
 * Execute Statutory Compliance Engine (Server-Side Execution Handler)
 * Every request is validated and redacted first, and every output is checked before it is returned.
 * Throws GovernanceValidationError for requests that break policy.
 */
export async function executeStatutoryComplianceEngine(
  input: StatutoryComplianceRequest
): Promise<StatutoryComplianceResponse> {
  // Governance gate: nothing is built or sent until validation and PII redaction pass.
  const { taskType, siteContext, hazards, redactions } = validateStatutoryRequest(input);

  const userPrompt = `Generate a statutory compliance document for South African OHS audit compliance.
Document Type: ${taskType}
Site Context: ${siteContext}
Hazards & Scope: ${hazards}

Ensure full statutory grounding, exact South African section citations, and strict Hierarchy of Controls sequencing (Elimination -> Substitution -> Engineering -> Administrative -> PPE).`;

  const apiKey = process.env.ANTHROPIC_API_KEY || (import.meta as any).env?.ANTHROPIC_API_KEY || '';

  if (apiKey && apiKey.trim() !== '') {
    try {
      // Dynamic import: the SDK is only loaded when a server-side key exists, keeping it out of the browser bundle.
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: STATUTORY_MODEL_ID,
        max_tokens: 2500,
        temperature: 0.0, // Requested for repeatability only; does NOT guarantee accuracy. Output requires human review.
        system: STATUTORY_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const textBlocks = response.content.filter((block) => block.type === 'text');
      const generatedDoc = textBlocks.map((b) => (b as any).text).join('\n\n');
      const checked = checkStatutoryOutput(generatedDoc);
      const governance = await buildGovernanceRecord({
        taskType,
        engine: 'live-model',
        modelId: STATUTORY_MODEL_ID,
        prompt: userPrompt,
        output: checked.document,
        redactions,
        issues: checked.issues,
      });

      return {
        success: true,
        document: checked.document,
        timestamp: new Date().toISOString(),
        metadata: {
          statutoryFrameworks: ['OHS Act 85 of 1993', 'Ergonomics Regs 2019', 'SANS 10089-3', 'COIDA Act 130 of 1993', 'ISO 45001:2018'],
          hierarchyOfControlsApplied: true,
          humanReviewRequired: true,
          status: 'DRAFT',
          engineVersion: 'ErgoSafe Statutory AI v3.4 (Live model, AI-drafted)',
          governance,
        },
      };
    } catch (err) {
      console.warn('[Statutory Engine Server Warning] Model call error, engaging template engine:', err);
    }
  }

  // Template engine: used when no model is available. Same governance checks apply.
  const checked = checkStatutoryOutput(generateFallbackStatutoryDocument(taskType, siteContext, hazards));
  const governance = await buildGovernanceRecord({
    taskType,
    engine: 'template',
    modelId: null,
    prompt: userPrompt,
    output: checked.document,
    redactions,
    issues: checked.issues,
  });

  return {
    success: true,
    document: checked.document,
    timestamp: new Date().toISOString(),
    metadata: {
      statutoryFrameworks: ['OHS Act 85 of 1993', 'Driven Machinery Regs', 'General Machinery Regs', 'Ergonomics Regs 2019', 'COIDA Act 130 of 1993', 'ISO 45001:2018'],
      hierarchyOfControlsApplied: true,
      humanReviewRequired: true,
      status: 'DRAFT',
      engineVersion: 'ErgoSafe Statutory Engine v3.4 (Template, human review required)',
      governance,
    },
  };
}

/**
 * Resilient Statutory Document Template. Citations are template text and must be verified by the reviewer.
 */
function generateFallbackStatutoryDocument(taskType: string, siteContext: string, hazards: string): string {
  const currentDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  return `# ERGOSAFE STATUTORY COMPLIANCE DOSSIER
**Framework**: South African Occupational Health & Safety Act (Act 85 of 1993) & Statutory Regulations
**Document Type**: ${taskType.toUpperCase()}
**Site Context**: ${siteContext}
**Date of Audit & Issue**: ${currentDate}
**Status**: DRAFT - NOT APPROVED. Must be reviewed and signed off by a competent person (OHS Act s16.2 / SHE Representative) before use.
**Generation**: Template-drafted. Citations below are unverified until the reviewer checks them against the primary legislation.

---

## 1. STATUTORY EXECUTIVE SUMMARY & SCOPE
This statutory risk management draft is compiled from structured templates with reference to **OHS Act 85 of 1993 Section 8 (General duties of employers to their employees)** and **Section 9 (General duties of employers to persons other than employees)**.

### Target Hazard & Operational Scope:
> **Target Scope**: ${hazards}
> **Facility Specification**: High-risk petroleum forecourt, hazardous substance handling area, high-volume retail service station zone.

---

## 2. STATUTORY CITATIONS & REGULATORY LEGISLATION (TO BE VERIFIED)
- **OHS Act 85 of 1993 Section 8(2)(b)**: Duty to eliminate or mitigate hazards to safety or health.
- **Driven Machinery Regulations (DMR 18)**: Lifting machines, fuel dispenser mechanisms, and automated fuel pump drives.
- **General Machinery Regulations (GMR 2.1 & GMR 3)**: Competent supervision and emergency isolation systems.
- **Ergonomics Regulations 2019 (Regulation 6 & 7)**: Risk assessment and prevention of musculoskeletal strain during long shifts.
- **Hazardous Chemical Agents (HCA) Regulations 2021**: SDS management for fuel vapour constituents (benzene, toluene, xylene).
- **COIDA (Compensation for Occupational Injuries & Diseases Act 130 of 1993)**: Incident reporting protocols. The Section 24 reporting requirement under the OHS Act is separate and must be confirmed by the reviewer.
- **ISO 45001:2018 (Clause 6.1.2)**: Hazard identification and risk assessment.

---

## 3. HIERARCHY OF CONTROLS (STATUTORY SEQUENCE)

The risk controls below follow the sequence: **Elimination → Substitution → Engineering → Administrative → PPE**.

### Level 1: Elimination
- **Directive**: Stop non-essential high-risk activities during fuel tanker offloading (RSD 26 protocol).
- **Action**: De-energise auxiliary pumps before maintenance inspection (**OHS Act Sec 8(2)(d)**).

### Level 2: Substitution
- **Directive**: Replace volatile cleaning solvents with lower-hazard alternatives (**SANS 10263**).
- **Action**: Replace manual heavy drum lifting with mechanical lifters (**Ergonomics Regs 2019 Reg 6**).

### Level 3: Engineering Controls
- **Directive**: Install and test Emergency Shut-Off Devices (ESD) and flame arrestors (**SANS 10089-3**).
- **Action**:
  1. Automatic overfill prevention valves on underground storage tanks (UST).
  2. Vapour recovery lines (Stage 1 & Stage 2) to reduce fume exposure.
  3. Static electricity grounding reels with bonding clamps (**GMR 3.1**).

### Level 4: Administrative Controls
- **Directive**: Safe Work Procedures (SWP), pre-shift briefings, and shift rotation.
- **Action**:
  1. Display responsibility matrices for **OHS Act Section 16(1) & 16(2)**.
  2. Daily inspection logs for spill response kits and fire extinguisher pressures (**General Safety Regs Reg 4**).
  3. Scheduled fatigue rest intervals during long standing shifts (**Ergonomics Regs 2019**).

### Level 5: Personal Protective Equipment (PPE)
- **Directive**: Issue and enforce PPE where residual risk remains (**General Safety Regs Reg 2**).
- **Mandatory Gear**:
  - Anti-static, fuel-resistant safety footwear (**SANS 20345**).
  - High-visibility flame-retardant anti-static vests.
  - Nitrile gauntlets & splash-resistant eye protection during hazmat containment.

---

## 4. ACTION PLAN

| Step | Hazard Component | Control Class | Responsible Person (role) | Verification Frequency | Citation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | ESD Interlock Verification | Engineering | Appointed 16(2) Supervisor | Daily Pre-Shift | SANS 10089-3 |
| **02** | Fuel Spill Clean Up | Admin & PPE | Spill Response Team Lead | Shift Changeover | HCA Reg 11 |
| **03** | Ergonomic Rest Rotation | Administrative | OHS Representative | Every 4 Hours | Ergonomics Reg 7 |
| **04** | Fire Extinguisher Audit | Engineering | GMR 2.1 Competent Person | Monthly | GSR Reg 4 |

---

## 5. REVIEW & SIGN-OFF (TO BE COMPLETED BY A COMPETENT PERSON)
> **Reviewer declaration (only if you have reviewed this draft)**: I have reviewed this ${taskType} draft against the primary legislation, verified the citations, and accept responsibility for the controls I have approved.

**Competent Person / SHE Representative (name)**: ___________________________
**Review date**: ___________________________
**Signature**: ___________________________
**Digital audit signature**: generated at export, using the SHA-256 digest of the document
`;
}
