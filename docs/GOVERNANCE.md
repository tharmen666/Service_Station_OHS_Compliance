# AI Governance & Regulatory Guardrails

Policy version: **2026.11-1** (see `src/governance/policy.ts`). Change the version whenever a rule changes.

This document describes what the statutory engine enforces, where each control lives, what it does **not** yet do, and which regulators the controls relate to. It is a technical control description, not legal advice. A South African OHS lawyer and a POPIA specialist must review it before it is relied on.

## 1. Principles

1. **Draft, never decision.** The engine produces AI-assisted drafts. A named competent person (OHS Act s16.2 / SHE Representative) must review and accept responsibility before use.
2. **Fail closed.** Invalid input is rejected. Forbidden claims are removed. Crypto failures throw. Nothing is silently replaced by something that looks compliant.
3. **Minimise personal information.** Personal information is redacted before any text leaves the server for a third-party model.
4. **Traceable.** Each output has a governance record: policy version, model or template, and SHA-256 hashes of prompt and output. The record holds no personal information.

## 2. Controls

| # | Control | Where | What it does |
|---|---|---|---|
| C1 | Input allowlist and length limits | `src/governance/inputGuard.ts`, `policy.ts` | Task type must be one of four values. Hazards 10–2000 chars. Site context max 200 chars. Control characters stripped. Non-object bodies rejected. |
| C2 | Body size limit | `api/compliance.ts` | Rejects bodies over 8 KB with HTTP 413. |
| C3 | Rate limit | `api/compliance.ts` | 10 requests per client per 10 minutes, HTTP 429. **In-memory: each serverless instance counts separately.** |
| C4 | PII redaction before model call | `inputGuard.ts` `redactPII` | Replaces 13-digit ID numbers, SA/international phone numbers and emails with placeholders. Counts are recorded. |
| C5 | Forbidden-claim removal | `outputGuard.ts`, `policy.ts` | Removes "zero hallucination", "guaranteed compliant", "100% compliant/verified", "legally certified", "APPROVED & AUDIT-LOCKED", "STATUTORY-VERIFIED", "all measures comply". The notice records the reason, not the removed text. |
| C6 | Required markers | `outputGuard.ts` | Output must contain DRAFT, a reviewer requirement and a statutory citation. Missing items are flagged in a governance notice at the top of the document. |
| C7 | Governance record | `src/governance/audit.ts` | Policy version, engine, model ID, prompt and output SHA-256, redaction counts, issues, `reviewStatus: PENDING_REVIEW`. |
| C8 | Reviewer sign-off gate | `StatutoryDocGeneratorModal.tsx` | Export to Audit Log is disabled until a reviewer name is entered and the review checkbox is ticked. The export records the reviewer name and time. |
| C9 | Prompt rules for the model | `STATUTORY_SYSTEM_PROMPT` | Model must label output DRAFT, never claim approval or compliance, mark uncertain citations `[verify]`, and refer to people by role. |
| C10 | Single model setting | `ohsComplianceGuardrails.ts` `STATUTORY_MODEL_ID` | One constant for the model used everywhere. |
| C11 | Template integrity | `src/api/compliance.ts` template | The template no longer contains an attestation that measures comply or a fabricated verification signature. The reviewer declaration is blank until the reviewer completes it. |
| C12 | Browser bundle hygiene | `src/api/compliance.ts` | The model SDK is loaded by dynamic import, only when a server-side key exists. |
| C13 | Automated tests | `e2e/governance.spec.ts`, `e2e/ohsCompliance.spec.ts` | 15 Chromium tests: redaction, validation, output checks, no raw PII in responses, UI wording, tab navigation, tenant rendering. |

## 3. Regulators and bodies this engine touches

| Body | Relevance | Control coverage |
|---|---|---|
| Department of Employment and Labour (DEL) | OHS Act 85 of 1993, incident reporting, inspections | Drafts cite OHS Act sections. **Section 24 reporting wording is unverified.** |
| Compensation Fund (COIDA) | Employer injury reporting | Drafts reference COIDA. Form and timing need legal confirmation. |
| Information Regulator | POPIA Act 4 of 2013, operator agreements, cross-border transfers | C4 redaction. **Operator agreement and transfer assessment are not done (see section 5).** |
| SABS / SANS | SANS 10089, 10263, 20345 | Citations are template or model text and are unverified. |
| Fuel regulator (EWURA or the applicable regime per site) | Wetstock and fuel accounting | Out of scope for the statutory engine. Confirm before any claim is made. |

## 4. Verification status (honest)

- Build passes (`npm run build`). The `api/` handler type-checks.
- 15 Chromium Playwright tests pass.
- **Not tested:** Firefox and Mobile Chrome profiles in this revision; the reviewer gate in a real browser session; the live model path (no API key in the test environment).
- **Not verified:** that any citation in any generated document is correct. Only a competent person can confirm that.

## 5. Open items before production or a paid pilot

1. **Persistent audit log.** Governance records are returned to the client, not stored. Add a server-side store (append-only) before relying on them as an audit trail.
2. **Shared rate limiter.** Replace the in-memory limit with a shared store.
3. **Operator agreement (POPIA s20–21)** with each client station owner, and a transfer assessment for the model provider (POPIA s72). Confirm where the provider processes data.
4. **Legal review** of statutory wording (Section 24, COIDA reporting, SANS references) by a South African OHS lawyer.
5. **Evaluation set.** A set of test requests with answers checked by a competent person, plus a recorded accuracy rate per task type, before any accuracy claim is made.
6. **Authentication.** The handler is public. Add authentication and tenant scoping before client data flows through it.
7. **Model change control.** Pin the model version in one place (done) and re-run the evaluation set when it changes.
8. **Secrets.** Any API key lives server-side only. None is embedded in the client bundle.

## 6. Change log

- **2026.11-1:** Added input validation, PII redaction, output checks, governance records, reviewer sign-off gate, rate limit, body limit. Removed false compliance attestation from the template. Removed wildcard CORS. Unified model constant.
