# Service Station OHS White-Label Refactor & Statutory Audit Documentation

## Executive Overview
This document details the architecture, statutory compliance guardrails, client-side POPIA encryption layer, multi-tenant branding engine, and PDF generator suite for the **South African Service Station OHS Compliance Platform**.

---

## 1. Multi-Tenant White-Label Engine (`src/multiTenantConfig.ts`)
The multi-tenant engine decouples station branding, colors, logos, and site metadata from core logic:
- **Tenant Profiles**: Supports major petroleum franchises (Shell, Engen, TotalEnergies, Sasol, BP, Caltex/Astron, and Custom Franchises).
- **Environment Overrides**: Reads dynamic environment variables (`VITE_TENANT_ID`, `VITE_WHITE_LABEL_BRAND_NAME`, `VITE_STATION_SITE_CODE`, etc.) or falls back to pre-configured defaults.
- **Runtime Switching**: Provides `getTenantConfig()`, `setTenantState()`, and `getActiveTenant()` for dynamic tenant switching.

---

## 2. Statutory Guardrails & Temperature Locking (`src/ohsComplianceGuardrails.ts`)
To prevent hallucinations on legal safety mandates, all AI endpoint calls are strictly locked to **`temperature = 0.0`**.

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

## 3. Client-Side POPIA Privacy & Encryption (`src/popiActCompliance.ts`)
Under Section 19 of the **Protection of Personal Information Act (Act 4 of 2013)**, sensitive employee data (SA ID numbers, phone numbers, audit log signatures) must be protected:
- **AES-256-GCM Encryption**: Client-side encryption/decryption using Web Crypto API.
- **PII Masking**: Automatic masking of 13-digit SA ID numbers (`880101****082`) and phone numbers (`+2782***4567`).
- **Verification Routine**: `verifyPOPIAEncryption()` executes runtime integrity checks.

---

## 4. Multi-Tenant Python PDF Generator Suite

### A. Integrated Health & Safety Manual (`generate_ihs_pdf.py`)
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

## 5. Build Verification & Deployment Instructions

### Prerequisites
- Node.js v18+ & npm
- Python 3.9+ with ReportLab 5.0.1+ (`pip install reportlab`)

### Step 1: Production Build Verification
```bash
npm run build
```
Confirms 0 TypeScript compilation errors (`tsc`) and generates optimized production bundle via `vite build`.

### Step 2: PDF Generator Execution
```bash
python generate_ihs_pdf.py
python generate_policies_pdf.py
```
Generates `Service_Station_IHS_Manual.pdf` and `Service_Station_OHS_Policies.pdf`.

### Step 3: Git Commit & Tagging
```bash
git add .
git commit -m "refactor(core): sync multi-tenant white-label engine, SANS 10089 guardrails, and POPIA privacy layer"
```
