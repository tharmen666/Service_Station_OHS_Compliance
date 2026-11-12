# Service Station OHS White-Label Refactor & Statutory Audit Documentation

## Executive Overview
This document details the architecture, statutory compliance guardrails, client-side data protection safeguards supporting POPIA Condition 7 / Section 19, multi-tenant branding engine, and PDF generator suite for the **South African Service Station OHS Compliance Management System**.

---

## 1. Multi-Tenant White-Label Engine (`src/multiTenantConfig.ts`)
The multi-tenant engine decouples station branding, colors, logos, and site metadata from core logic:
- **Pure White-Label Topology (Brilliant Group One)**: 1 Central Logistics Depot (`DEPOT-BGO-01`), 6 Heavy Tanker Trucks (`TRK-01` to `TRK-06`) with 32,000L full loads, supplying 5 Regional Retail Service Stations (Site Alpha, Site Bravo, Site Charlie, Site Delta, Site Echo). Commercial brand names purged 100%.
- **Environment Overrides**: Reads dynamic environment variables (`VITE_TENANT_ID`, `VITE_WHITE_LABEL_BRAND_NAME`, `VITE_STATION_SITE_CODE`, etc.) or falls back to pre-configured defaults.
- **Runtime Switching**: Provides `getTenantConfig()`, `setTenantState()`, and `getActiveTenant()` for dynamic tenant switching.

---

## 2. Deterministic Statutory Responses & Parameter Control (`src/ohsComplianceGuardrails.ts`)
**Deterministic Statutory Responses**: All statutory query and compliance-reasoning endpoints run at `temperature: 0.0` to ensure repeatable, consistent output for a given input. This is paired with structured prompt templates grounded directly in source legislation (OHS Act 85 of 1993, SANS 10089). Every statutory response includes citations back to the specific Act section, statutory regulation, or SANS standard clause, allowing the appointed Section 16.2 or SHE Representative to verify drafts against the primary legal text prior to formal sign-off.

### Statutory References Enforced:
1. **Occupational Health and Safety Act 85 of 1993**:
   - **Section 8**: Employer's legal duty to provide and maintain a safe working environment.
   - **Section 16.1 & 16.2**: CEO statutory liability and formal delegation of safety responsibility.
   - **Section 24 Incident Escalation**: Mandatory notification to the Provincial Director (Department of Employment and Labour) via Form WCL 1 / WCL 2 within 7 days for incapacitating injuries/chemical releases, and immediate notification for fatalities or major fire/explosion events.
2. **SANS 10089 (Parts 1 & 3 - Petroleum Bulk Handling)**:
   - Mandatory Emergency Stop Device (ESD) isolation triggers (2-second pump shutoff).
   - Static electricity bonding during tanker fuel discharge.
   - Strict 15-meter buffer zone for naked flames, cellphones, and non-certified electrical tools.
3. **4-Stage Emergency Forecourt Procedures**:
   - Spills: Fetcher (PPE & Booms) -> Plastic Spade Applicator (Peat Moss) -> Sweeper -> Hazardous Waste Disposer.
   - Evacuation: ESD Alert -> Traffic Blockade -> Cashier Emergency Call (10177/112) -> Fire Team Containment -> Shop Sweep -> Manager Roll Call at Upwind Assembly Point.

---

## 3. Client-Side Data Protection Safeguards (Supporting POPIA Condition 7 / Section 19) (`src/popiActCompliance.ts`)
Under Section 19 of the **Protection of Personal Information Act (Act 4 of 2013)**, sensitive employee data (SA ID numbers, phone numbers, audit log signatures) must be protected:
- **Client-Side Data Protection Safeguards (Supporting POPIA Condition 7 / Section 19)**: Implements client-side AES-256-GCM encryption (via the browser Web Crypto API) for employee South African ID numbers and inspection signature payloads at rest and in transit, accompanied by automated PII masking in UI displays and PDF exports. These technical measures serve as digital safeguards supporting the facility’s broader POPIA Section 19 information security program, functioning alongside appointed Information Officer governance and ongoing organizational risk controls.
- **PII Masking**: Automatic masking of 13-digit SA ID numbers (`880101****082`) and phone numbers (`+2782***4567`).
- **Verification Routine**: `verifyPOPIAEncryption()` executes runtime integrity checks.

---

## 4. Multi-Tenant Python PDF Generator Suite

### A. Occupational Health & Safety (OHS) Manual (`generate_ohs_pdf.py`)
Generates an audit-ready, 5-page PDF document using ReportLab:
- Dynamic multi-tenant header & footer with tenant brand name, site code, and page numbers.
- Statutory OHS Act 85 & SANS 10089 compliance tables.
- Section 24 incident escalation workflow matrix.
- POPIA privacy compliance notice & ESD emergency isolation steps.

### B. OHS Policy Documents (`generate_policies_pdf.py`)
Generates formal statutory policy documents:
- Emergency Evacuation Procedure Policy.
- Forecourt Bulk Fuel Spill Response Policy.
- PASS Firefighting Protocol Policy.
- Statutory Employee Rights & Health/Safety Representative Policy.
- Executive & Health & Safety Representative Audit Sign-Off Table.

---

## 5. Statutory OHS Training & Certification Module (`src/components/StatutoryTrainingModule.tsx`)
Provides mandatory occupational training tracking compliant with OHS Act 85 and SETA guidelines:
- **Core Statutory Courses**: Basic First Aid Level 1 (GSR 3), Basic Firefighting & Equipment Handling (SANS 10105), Hazard Identification & Risk Assessment (HIRA / SANS 10089), and Health & Safety Representative Duties (Section 17/18).
- **Compliance & Expiry Monitoring**: Automatic 24-month recertification tracking, days-until-expiry alerts, and visual Red/Amber/Green statutory status flags.
- **Auditor Verification**: Direct linking to formal certificate generation and printable training packs for DoEL inspection audits.

---

## 6. Wetstock Management & ATG Reconciliation Module (`src/components/WetstockManagementModule.tsx` & `src/lib/wetstockEngine.ts`)
Comprehensive forecourt fuel accounting aligned with SANS 10089 environmental protection standards:
- **Daily Reconciliation Ledger**: Tracks Opening Stock, Deliveries (eBOL matched), Measured Physical Closing Stock (via ATG or dipstick), and Metered Sales to calculate variance in Litres and percentage.
- **5 Mandatory Loss/Gain Triggers**: Real-time surveillance of daily volume breaches, 5-day cumulative trends, sudden drop / line ruptures, ATG sensor / water ingress anomalies, and delivery density variances.
- **4-Tier Etwatwa Protocol**: Escalating statutory response from forecourt dip validation (Tier 1) through pump metering calibration (Tier 2) to VacuSonic NDT acoustic line testing and automatic submersible turbine pump hard-lock (Tier 4).
- **eBOL & Bulk Transit Delivery Tracking**: Bill-of-lading manifest verification against forecourt offload, electronic seal serial validation, and 15°C temperature-compensated density tracking.
- **Multi-Product Support**: Separate ledger tracking for Unleaded Petrol (ULP 95/93), Diesel (50ppm/10ppm), and Illuminating Paraffin (IP).

---

## 7. Forecourt Sentinel Safety Interlock Gate & Wetstock Offload Bridge (`src/components/WetstockOffloadBridge.tsx`)
Integrates the LogiGuard Sentinel offload safety gate and physical-to-fiscal reconciliation:
- **RSD 26 Safety Interlock Gate (5 Mandatory Physical Checks)**:
  1. Tanker Static Earthing Strap securely clamped to earth point (<10 ohms).
  2. Two certified 9kg Dry Chemical Powder (DCP) extinguishers placed upwind within 3m.
  3. Stormwater catchment and oil-water separator isolation valves shut/plugged.
  4. Underground tank ullage confirmed via physical dip/ATG (safe receipt capacity).
  5. Tanker Emergency Stop Device (ESD) primed and dual wheel chocks positioned.
  - *Hard-Lock Mechanism*: Offload submission and fiscal drop commit remain strictly disabled until all 5 interlock gates are verified.
- **LogiGuard Wetstock & Fiscal Reconciliation Engine**:
  - Formulas:
    $$\text{Actual Delivery (L)} = \text{Closing Dip} - \text{Opening Dip} + \text{Pump Sales During Drop} + \text{Spill Litres}$$
    $$\text{Variance (L)} = \text{Actual Delivery} - \text{Waybill Volume}$$
  - **Dynamic Spill Loss Deduction**: Automatically links to Tab 2 (Forecourt Spill Teamwork) to capture any active spill volume and deduct it as accounted loss.
  - **Critical Shrinkage Warning**: Triggers immediate statutory alerts when fuel shrinkage exceeds `> 0.35%` or `> 50 Litres`.
  - **HITL Audit Ledger**: Immutable Human-in-the-Loop audit record capturing station code, timestamp, seal reference, variance, and supervisor sign-off.

---

## 8. East Africa Multi-Country Statutory Architecture (`src/data/eastAfricaConfig.ts`)
Expands the compliance matrix across Southern and Eastern Africa with country-specific regulatory bodies, standards, and fiscal frameworks:
- **South Africa (ZA)**: DMRE / DoEL | SANS 10089-3 & OHSA 85 | Reference Site `ENG-JHB-042`.
- **Kenya (KE)**: EPRA | KRA eTIMS Live & OSHA 2007 | Reference Site `NBO-MSA-018`.
- **Tanzania (TZ)**: EWURA | TRA EFD / VFD & OSHA 2003 | Reference Site `DAR-KIG-009`.
- **Uganda (UG)**: PAU / MEMD | URA EFRIS Live & OSH Act 2006 | Reference Site `KLA-ENT-014`.
- **Swahili (SW) Regional Localization**:
  - Full translations for Evacuation flows, PASS Firefighting instructions, Spill containment roles, and Wetstock offload interlock checkpoints.
  - Seamless switching across `EN` (English), `SW` (Kiswahili), `ZU` (isiZulu), `AF` (Afrikaans), and `ST` (Sesotho).

---

## 9. Build Verification & Deployment Instructions

### Prerequisites
- Node.js v18+ & npm
- Python 3.9+ with ReportLab 5.0.1+ (`pip install reportlab`)

### Step 1: Production Build Verification
```bash
npm run build
```
Confirms 0 TypeScript compilation errors (`tsc`) and generates optimized production bundle via `vite build`.

### Step 2: Automated Playwright Test Verification
```bash
npx playwright test
```
Executes end-to-end tests across Chromium, Firefox, and Mobile Chrome profiles to confirm zero runtime regressions.

### Step 3: PDF Generator Execution
```bash
python generate_ohs_pdf.py
python generate_policies_pdf.py
```
Generates `Service_Station_OHS_Manual.pdf` and `Service_Station_OHS_Policies.pdf`.

### Step 4: Git Commit & Production Sync
```bash
git add .
git commit -m "feat: integrate Forecourt Sentinel safety gate, wetstock reconciliation, and East Africa presets"
git push origin main
```
