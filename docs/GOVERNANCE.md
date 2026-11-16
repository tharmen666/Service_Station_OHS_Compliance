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
| C13 | Automated tests | `e2e/governance.spec.ts`, `e2e/ohsCompliance.spec.ts`, `e2e/reviewerGate.spec.ts` | Redaction, validation, output checks, no raw PII in responses, UI wording, tab navigation, tenant rendering, and the reviewer gate in a real browser. |
| C14 | Cross-origin refusal | `server/handler.ts` | Browser requests whose Origin differs from the host get 403. **This is not authentication.** Requests with no Origin header still pass. |
| C15 | Engine disclosure | `StatutoryDocGeneratorModal.tsx` | The draft banner states whether a live model or the template produced the text, and how many governance issues were flagged. The banner says "not approved". |
| C16 | Bundled server handler | `scripts/build-api.mjs` | The handler is bundled into one file at build time, so the deployed function has no fragile relative imports. |

## 3. Regulators and bodies this engine touches

| Body | Relevance | Control coverage |
|---|---|---|
| Department of Employment and Labour (DEL) | OHS Act 85 of 1993, incident reporting, inspections | Drafts cite OHS Act sections. **Section 24 reporting wording is unverified.** |
| Compensation Fund (COIDA) | Employer injury reporting | Drafts reference COIDA. Form and timing need legal confirmation. |
| Information Regulator | POPIA Act 4 of 2013, operator agreements, cross-border transfers | C4 redaction. **Operator agreement and transfer assessment are not done (see section 5).** |
| SABS / SANS | SANS 10089, 10263, 20345 | Citations are template or model text and are unverified. |
| Fuel regulator (EWURA or the applicable regime per site) | Wetstock and fuel accounting | Out of scope for the statutory engine. Confirm before any claim is made. |

## 4. Verification status (honest)

- Build passes (`npm run build`). The `api/` handler is bundled and type-checks.
- Full Playwright matrix passes on Chromium, Firefox and Mobile Chrome for the UI tests. Governance and reviewer-gate tests run on Chromium.
- Production API verified: a rejected request returns 400 with issues; a valid request returns a governance record.
- **Not verified in production:** the live model path. Production drafts currently use the template, which means the live call failed. The cause is not visible from here (the key value and runtime logs are not accessible to this environment).
- **Not verified:** that any citation in any generated document is correct. Only a competent person can confirm that.

## 5. Open items (status)

| # | Item | Status | What is needed |
|---|---|---|---|
| 1 | Persistent, append-only audit log | **Open** | A storage choice (Vercel KV, Blob, Postgres or similar) and an approval to add it. |
| 2 | Shared rate limiter | **Open** | The same storage decision as item 1. Current limit is per instance. |
| 3 | Operator agreement (POPIA s20–21) and s72 transfer assessment | **Draft written** (`docs/OPERATOR_AGREEMENT_TEMPLATE.md`) | Lawyer and POPIA specialist review. Confirm the model provider's processing location. |
| 4 | Legal review of statutory wording (Section 24, COIDA, SANS) | **Open** | A South African OHS lawyer. |
| 5 | Evaluation set and accuracy rate | **Starter written** (`docs/EVALUATION_SET.md`) | Competent person to write the expected answers and score at least 30 cases per task type. |
| 6 | Authentication and tenant scoping | **Open, partly mitigated** | Cross-origin refusal (C14) is in place. Real authentication needs a decision on the identity provider. |
| 7 | Model change control | **Partly done** | Model pinned in one constant. Re-run the evaluation set on any model change. |
| 8 | Secrets server-side only | **Done** | `ANTHROPIC_API_KEY` is read from `process.env` only. |
| 9 | Live model not producing drafts in production | **Open** | Check `ANTHROPIC_API_KEY` in Vercel and the model ID. Needs access to logs or the key. |

## 6. Change log

- **2026.11-1:** Added input validation, PII redaction, output checks, governance records, reviewer sign-off gate, rate limit, body limit. Removed false compliance attestation from the template. Removed wildcard CORS. Unified model constant.
- **2026.11-1 (follow-up):** Engine disclosure in the UI; "not approved" banner; cross-origin refusal; browser test for the reviewer gate; operator agreement and evaluation set drafts; overclaim wording removed from the demo showcase.
