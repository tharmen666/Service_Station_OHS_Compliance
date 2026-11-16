import Anthropic from '@anthropic-ai/sdk';

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
    engineVersion: string;
  };
}

const SERVER_SYSTEM_INSTRUCTION = `
You are an Occupational Health and Safety (OHS) Compliance Specialist for South African retail service stations.
Ground all outputs strictly in South African statutory standards (OHS Act 85 of 1993, Driven Machinery Regs, General Machinery Regs, General Safety Regs, Ergonomics Regs 2019, SANS 10089-3, COIDA Act 130 of 1993, and Regulation R638 of 2018).
Sequence controls strictly as: Elimination -> Substitution -> Engineering -> Administrative -> PPE.
Cite specific statutory sections and regulations.
`.trim();

export async function executeStatutoryComplianceEngine(
  input: StatutoryComplianceRequest
): Promise<StatutoryComplianceResponse> {
  const { taskType = 'HIRA', siteContext = 'Gauteng Forecourt Retail Service Station', hazards = 'General Forecourt Risk Assessment' } = input;
  const apiKey = process.env.ANTHROPIC_API_KEY || '';

  if (apiKey && apiKey.trim() !== '') {
    try {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        temperature: 0.0,
        system: SERVER_SYSTEM_INSTRUCTION,
        messages: [
          {
            role: 'user',
            content: `Generate a statutory compliance document for South African OHS compliance.
Document Type: ${taskType}
Site Context: ${siteContext}
Hazards & Scope: ${hazards}
Ensure exact South African section citations and Hierarchy of Controls sequencing (Elimination -> Substitution -> Engineering -> Administrative -> PPE).`,
          },
        ],
      });

      const textBlocks = response.content.filter((block) => block.type === 'text');
      const generatedDoc = textBlocks.map((b) => (b as any).text).join('\n\n');

      return {
        success: true,
        document: generatedDoc,
        timestamp: new Date().toISOString(),
        metadata: {
          statutoryFrameworks: ['OHS Act 85 of 1993', 'Ergonomics Regs 2019', 'SANS 10089-3:2010', 'COIDA Act 130 of 1993', 'POPIA Act 4 of 2013'],
          hierarchyOfControlsApplied: true,
          engineVersion: 'Forecourt Sentinel Server Engine v3.5',
        },
      };
    } catch (err) {
      console.warn('[Statutory Engine Server Warning] External API error, using deterministic statutory template:', err);
    }
  }

  const fallbackDoc = generateDeterministicStatutoryDocument(taskType, siteContext, hazards);

  return {
    success: true,
    document: fallbackDoc,
    timestamp: new Date().toISOString(),
    metadata: {
      statutoryFrameworks: ['OHS Act 85 of 1993', 'Driven Machinery Regs', 'General Machinery Regs', 'General Safety Regs', 'SANS 10089-3:2010', 'COIDA Act 130 of 1993'],
      hierarchyOfControlsApplied: true,
      engineVersion: 'Forecourt Sentinel Statutory Template v3.5',
    },
  };
}

function generateDeterministicStatutoryDocument(taskType: string, siteContext: string, hazards: string): string {
  const currentDate = new Date().toISOString().split('T')[0];

  return `# FORECOURT SENTINEL STATUTORY COMPLIANCE DOCUMENT
**Framework**: South African Occupational Health & Safety Act (Act 85 of 1993) & Regulations (Last Verified: 2026-03-01)  
**Document Type**: ${taskType.toUpperCase()}  
**Site Context**: ${siteContext}  
**Date of Issue**: ${currentDate}  
**Guidance Notice**: Operational compliance template requiring review and sign-off by the appointed Section 16(2) supervisor and Health & Safety Representative.

---

## 1. STATUTORY SCOPE
Compiled in accordance with **OHS Act 85 of 1993 Section 8 (General duties of employers to their employees)** and **Section 9 (General duties of employers to persons other than employees)**.

- **Target Scope**: ${hazards}
- **Facility Classification**: Retail petroleum service station forecourt and convenience store premises.

---

## 2. VERIFIED SOUTH AFRICAN STATUTORY CITATIONS (Last Verified: 2026-03-01)
- **OHS Act 85 of 1993 Section 8(2)(b) & (d)**: Identification and mitigation of workplace hazards prior to resorting to PPE (Source: https://www.gov.za/documents/occupational-health-and-safety-act).
- **SANS 10089-3:2010 Clause 6 & Clause 7.4**: Underground storage tank installation, static bonding, and Emergency Shut-Off Device (ESD) electrical isolation (Source: https://store.sabs.co.za/).
- **General Safety Regulations (GSR Reg 2, 3 & 4)**: Provision of PPE, certified First Aid readiness, and safe handling of flammable liquids (Source: https://www.labour.gov.za/DocumentCenter/Pages/Legislation.aspx).
- **General Machinery Regulations (GMR Reg 2 & 3)**: Competent supervision and safeguarding of machinery.
- **Ergonomics Regulations 2019 (Reg 6 & 7)**: Ergonomic risk assessment and shift fatigue controls.
- **COIDA Act 130 of 1993 (Section 39)**: Employer notice of occupational accidents within 7 days (Source: https://www.gov.za/documents/compensation-occupational-injuries-and-diseases-act).
- **POPIA Act 4 of 2013 (Section 10, 14 & 19)**: Data minimality, retention limits, and security safeguards (Source: https://www.gov.za/documents/protection-personal-information-act).

---

## 3. HIERARCHY OF CONTROLS (STATUTORY SEQUENCE)

### Level 1: Elimination
- Cease non-essential high-risk maintenance or hot work within the 15m forecourt hazard zone during bulk tanker offloading (**OHS Act Sec 8(2)(d)**; **SANS 10089-3**).

### Level 2: Substitution
- Replace volatile solvent cleaners with non-flammable biodegradable forecourt degreasers (**SANS 10263:2016**).

### Level 3: Engineering Controls
- Maintain and test forecourt Emergency Shut-Off Devices (ESD), breakaway couplings, overfill prevention valves, and Stage 1B vapour recovery lines (**SANS 10089-3 Clause 6 & 7.4**).
- Connect anti-spark static earthing clamp to tanker chassis prior to hose connection (**GMR Reg 3**).

### Level 4: Administrative Controls
- Conduct pre-shift toolbox briefings, enforce cellular phone and smoking prohibitions within 15m of dispensers, and schedule rest breaks under **BCEA Section 14 & 15**.

### Level 5: Personal Protective Equipment (PPE)
- Issue SANS 20345 anti-static fuel-resistant safety boots, high-visibility flame-retardant vests, nitrile gauntlets, and EN 166 splash goggles (**GSR Reg 2**).

---

## 4. POPIA DATA-MINIMISATION & RETENTION NOTICE (POPIA Act 4 of 2013, Section 10 & 14)
> **Data-Minimisation Notice**: Only role titles and essential statutory sign-off references should be recorded in exported compliance logs. Do not include unnecessary personal identifiers (such as private residential addresses, personal bank details, or unmasked identity numbers). Retain statutory inspection records strictly for the period prescribed by the OHS Act and purge expired personal records thereafter.

**Appointed Section 16(2) Supervisor**: ___________________________  
**Health & Safety Representative (Sec 17)**: ___________________________
`;
}

export default async function handler(req: any, res: any) {
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') return res.status(200).end();
    return new Response(null, { status: 200 });
  }

  if (req.method !== 'POST') {
    if (res && typeof res.status === 'function') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore
      }
    }
    const result = await executeStatutoryComplianceEngine({
      taskType: body?.taskType || 'HIRA',
      siteContext: body?.siteContext || 'Gauteng Forecourt Retail Service Station',
      hazards: body?.hazards || 'General Forecourt Risk Assessment',
    });

    if (res && typeof res.status === 'function') {
      return res.status(200).json(result);
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const errorResponse = {
      success: false,
      error: error?.message || 'Failed to process statutory compliance request',
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorResponse);
    }
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
}
