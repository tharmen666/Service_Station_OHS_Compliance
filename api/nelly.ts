export interface ApprovedRegulationPassage {
  id: string;
  topic: string;
  statute: string;
  clause: string;
  lastVerified: string;
  sourceUrl: string;
  keywords: string[];
  guidance: string;
}

export const APPROVED_REGULATION_CORPUS: ApprovedRegulationPassage[] = [
  {
    id: 'ppe-gsr-reg2',
    topic: 'Personal Protective Equipment (PPE)',
    statute: 'Occupational Health and Safety Act 85 of 1993 & General Safety Regulations (GSR)',
    clause: 'OHS Act Section 8(2)(d) & General Safety Regulations (GNR 1031) Regulation 2; SANS 20345',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.labour.gov.za/DocumentCenter/Pages/Legislation.aspx',
    keywords: [
      'ppe', 'protective equipment', 'boots', 'shoes', 'footwear', 'gloves', 'goggles',
      'eye protection', 'vest', 'high-vis', 'hi-vis', 'reflective', 'overall', 'clothing',
      'anti-static', 'nitrile', 'uniform', 'attendant gear', 'safety gear'
    ],
    guidance:
      'Employers must provide free of charge and maintain necessary Personal Protective Equipment (PPE) where hazards cannot be eliminated by engineering controls. Forecourt attendants and spill responders require SANS 20345 anti-static, slip- and fuel-resistant safety boots, flame-retardant high-visibility vests, chemical-resistant nitrile gauntlets for fuel/oil handling, and EN 166 splash goggles during hazmat containment.',
  },
  {
    id: 'food-temp-r638',
    topic: 'Food Hygiene & Thermal Critical Control Points (CCP)',
    statute: 'Regulations Governing General Hygiene Requirements for Food Premises (R638 of 2018 under Act 54 of 1972)',
    clause: 'Regulation R638 of 2018, Regulation 8 (Time & Temperature Control) & Annexure B; SANS 10049',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/foodstuffs-cosmetics-and-disinfectants-act-regulations-general-hygiene-requirements-food',
    keywords: [
      'food', 'temperature', 'thermal', 'ccp', 'poultry', 'chicken', 'pie', 'hot holding',
      'fridge', 'chilled', 'freezer', 'cooking', 'probe', 'r638', 'hygiene', 'kitchen', 'deli', 'bakery'
    ],
    guidance:
      'Under South African Regulation R638 of 2018 (Regulation 8 & Annexure B) and SANS 10049, convenience store food premises must maintain core temperatures: chilled perishable foods at ≤ 5°C, frozen products at ≤ -12°C (or ≤ -18°C per SANS 10049), heated display / hot holding at ≥ 60°C, and core cooking/reheating of poultry and meat products to at least 74°C.',
  },
  {
    id: 'esd-evacuation-sans10089',
    topic: 'Emergency Shut-Off (ESD) & Forecourt Evacuation',
    statute: 'SANS 10089-3:2010 & OHS Act 85 of 1993',
    clause: 'SANS 10089-3:2010 Clause 7.4 (Emergency Switching) & OHS Act Section 8(2)(e)',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://store.sabs.co.za/',
    keywords: [
      'esd', 'emergency stop', 'shut-off', 'shutoff', 'cut-off', 'evacuate', 'evacuation',
      'assembly point', 'alarm', 'siren', 'panic', 'marshal', 'isolation'
    ],
    guidance:
      'In a forecourt fire, major fuel release, or tanker incident, immediately press the red Emergency Stop Device (ESD) mushroom button to isolate electrical power to all submersible turbine pumps and dispensers. Direct all motorists and staff to leave vehicles, prohibit engine ignition, and evacuate upwind to the designated Assembly Point for roll call.',
  },
  {
    id: 'spill-containment-sans10263',
    topic: 'Fuel Spill Containment & Hazardous Waste',
    statute: 'SANS 10263:2016, Hazardous Chemical Agents Regulations 2021 & NEMA Act 107 of 1998',
    clause: 'SANS 10263 Clause 8, HCA Regulations 2021 Reg 11 & 15, and NEMA Section 28 (Duty of Care)',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/occupational-health-and-safety-act',
    keywords: [
      'spill', 'absorb', 'absorbent', 'peat', 'sand', 'drain', 'stormwater', 'separator',
      'shovel', 'non-sparking', 'brass', 'hazmat', 'drum', 'manifest', 'leak', 'petrol spill', 'diesel spill'
    ],
    guidance:
      'Isolate the affected pump lane with hazard cones, eliminate ignition sources, and deploy hydrophobic booms around stormwater drains and oil/water separator inlets first. Apply dry sand or encapsulating absorbent from the outer perimeter inward, sweep using non-sparking polypropylene or brass tools only (never steel), and seal contaminated waste in labelled hazardous waste drums for licensed disposal.',
  },
  {
    id: 'firefighting-pass-gsr4',
    topic: 'P.A.S.S. Firefighting & Flammable Liquids',
    statute: 'General Safety Regulations (GSR) & SANS 1910 / SANS 10105-1',
    clause: 'General Safety Regulations (GNR 1031) Regulation 4 & SANS 10105-1',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.labour.gov.za/DocumentCenter/Pages/Legislation.aspx',
    keywords: [
      'fire', 'extinguisher', 'pass', 'dcp', 'dry chemical powder', 'co2', 'flame',
      'pull', 'aim', 'squeeze', 'sweep', '9kg', 'blaze', 'ignite', 'ignition', 'smoking', 'cellphone'
    ],
    guidance:
      'For incipient Class B (flammable liquid) or Class C/E forecourt fires, stand 3.0m to 4.5m upwind with a serviced 9kg Dry Chemical Powder (DCP) extinguisher and apply P.A.S.S.: Pull the safety pin, Aim the nozzle at the base of the flames, Squeeze the lever smoothly, and Sweep from side to side. Never use water on hydrocarbon fires.',
  },
  {
    id: 'wetstock-offload-sans10089',
    topic: 'Bulk Tanker Offloading (RSD 26) & Wetstock Reconciliation',
    statute: 'SANS 10089-1 & SANS 10089-3:2010; General Machinery Regulations (GMR)',
    clause: 'SANS 10089-3:2010 Clause 6 & General Machinery Regulations (GNR 1521) Regulation 3',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://store.sabs.co.za/',
    keywords: [
      'tanker', 'offload', 'offloading', 'wetstock', 'atg', 'bonding', 'static', 'earthing',
      'grounding', 'vapour recovery', 'vapor recovery', 'ullage', 'dip', 'reconciliation', 'rsd', 'waybill', 'seal'
    ],
    guidance:
      'Before bulk tanker discharge: verify tank ullage capacity via ATG/dip to prevent overfill, cordon off a 15m ignition exclusion zone, position two 9kg DCP extinguishers, and attach the static earthing/bonding clamp to the tanker chassis BEFORE connecting Stage 1B vapour recovery and product delivery hoses. Reconcile meter, dip, and waybill volumes post-delivery.',
  },
  {
    id: 'employee-rights-bcea-ohsa',
    topic: 'Employee Rights, Shifts, Fatigue & Refusal of Dangerous Work',
    statute: 'Basic Conditions of Employment Act 75 of 1997 (BCEA) & OHS Act 85 of 1993',
    clause: 'BCEA Sections 9, 14, 15, 17 & OHS Act 85 of 1993 Section 14 & Section 26 (Prohibition of Victimization)',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/basic-conditions-employment-act',
    keywords: [
      'shift', 'hours', 'overtime', 'rest', 'meal', 'lunch', 'break', 'fatigue',
      'nightshift', 'night work', 'rights', 'refuse', 'dangerous work', 'bcea', 'leave', 'ergonomic'
    ],
    guidance:
      'Under BCEA Section 9, ordinary working hours may not exceed 45 hours per week. Section 14 mandates a meal interval after 5 continuous hours, Section 15 mandates at least 12 consecutive hours daily rest, and Section 17 requires nightshift allowance/shift reduction and transport availability between 18:00 and 06:00. Under OHS Act Section 14 and Section 26, employees must report unsafe conditions and are protected against victimization when raising legitimate safety concerns.',
  },
  {
    id: 'incident-first-aid-coida',
    topic: 'Incident Reporting, First Aid & COIDA',
    statute: 'OHS Act 85 of 1993, General Safety Regulations (GSR) & COIDA Act 130 of 1993',
    clause: 'OHS Act Section 24, GSR Regulation 3 (First Aid), and COIDA Section 39 (W.Cl.2 Notice)',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/compensation-occupational-injuries-and-diseases-act',
    keywords: [
      'incident', 'accident', 'injury', 'first aid', 'coida', 'section 24', 'wcl',
      'hospital', 'unconscious', 'inhalation', 'ingestion', 'eye splash', 'triage', 'medical', 'bleeding'
    ],
    guidance:
      'Under GSR Regulation 3, workplaces with more than 5 employees must maintain a stocked First Aid box, and with more than 10 employees must appoint a certified First Aider. For hydrocarbon eye splashes, flush with clean water for at least 15 minutes; for ingestion, never induce vomiting. Under OHS Act Section 24 and COIDA Section 39, reportable workplace injuries or major spills must be reported to the Department of Employment and Labour and Compensation Commissioner within 7 days (immediately for fatalities).',
  },
  {
    id: 'popia-data-privacy',
    topic: 'POPIA Data Protection & Minimality',
    statute: 'Protection of Personal Information Act 4 of 2013 (POPIA)',
    clause: 'POPIA Condition 3 (Section 10 — Minimality), Condition 4 (Section 14 — Retention) & Condition 7 (Section 19 — Security Safeguards)',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/protection-personal-information-act',
    keywords: [
      'popia', 'privacy', 'personal data', 'id number', 'encryption', 'retention', 'minimisation', 'minimization', 'pdp'
    ],
    guidance:
      'Under POPIA Section 10 (Minimality), only personal information strictly required for statutory OHS training or incident registers may be collected. Under Section 14, records must not be retained longer than required by law, and under Section 19, appropriate technical and organizational security safeguards must protect against unauthorized access.',
  },
];

export interface NellyQueryRequest {
  query: string;
  ccpReadingCelsius?: number | null;
}

export interface NellyQueryResponse {
  reply: string;
  citation: {
    statute: string;
    clause: string;
    lastVerified: string;
    sourceUrl: string;
  } | null;
  matchedSourceId: string | null;
  ccpStatus: {
    readingCelsius: number;
    thresholdCelsius: number;
    compliant: boolean;
  } | null;
  temperature: number;
  disclaimer: string;
}

const NO_SOURCE_FALLBACK =
  "I don't have an approved source for this. Please check with your OHS officer";

const GUIDANCE_DISCLAIMER =
  'Guidance Notice: Responses provide operational OHS guidance based on cited South African regulations and do not constitute formal legal advice.';

/**
 * Retrieves the best matching approved regulation passage for a user query.
 * Returns null if no approved source supports the question.
 */
export function retrieveApprovedPassage(query: string): ApprovedRegulationPassage | null {
  const normalized = (query || '').toLowerCase().trim();
  if (!normalized) return null;

  let bestMatch: ApprovedRegulationPassage | null = null;
  let bestScore = 0;

  for (const passage of APPROVED_REGULATION_CORPUS) {
    let score = 0;
    for (const kw of passage.keywords) {
      // Match whole word or multi-word phrase
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}`, 'i');
      if (regex.test(normalized)) {
        score += kw.includes(' ') ? 3 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = passage;
    }
  }

  if (bestScore < 2) {
    return null;
  }
  return bestMatch;
}

/**
 * Extracts an explicit temperature reading from the request if provided.
 */
function parseTemperatureReading(
  query: string,
  explicitReading?: number | null
): number | null {
  if (typeof explicitReading === 'number' && !Number.isNaN(explicitReading)) {
    return explicitReading;
  }
  // Check if user typed an explicit reading in their query, e.g. "probe is 75°C" or "reading: 62 C" or "at 74.5 degrees"
  const match = query.match(/(-?\d+(?:\.\d+)?)\s*(?:°\s*c|deg(?:rees)?(?:\s*c(?:elsius)?)?|\bc\b)/i);
  if (match) {
    const val = parseFloat(match[1]);
    if (!Number.isNaN(val)) return val;
  }
  return null;
}

export async function processNellyQuery(reqBody: NellyQueryRequest): Promise<NellyQueryResponse> {
  const query = (reqBody?.query || '').trim();
  const passage = retrieveApprovedPassage(query);

  if (!passage) {
    return {
      reply: NO_SOURCE_FALLBACK,
      citation: null,
      matchedSourceId: null,
      ccpStatus: null,
      temperature: 0.0,
      disclaimer: GUIDANCE_DISCLAIMER,
    };
  }

  // Special handling for food temperature / CCP queries:
  // Only report a CCP COMPLIANT / NON-COMPLIANT status if a real numeric reading was entered!
  let ccpStatus: NellyQueryResponse['ccpStatus'] = null;
  let ccpAddon = '';

  if (passage.id === 'food-temp-r638') {
    const enteredReading = parseTemperatureReading(query, reqBody.ccpReadingCelsius);
    const threshold = 74.0; // R638 Annexure B poultry / core cooking threshold
    if (enteredReading !== null) {
      const compliant = enteredReading >= threshold;
      ccpStatus = {
        readingCelsius: enteredReading,
        thresholdCelsius: threshold,
        compliant,
      };
      ccpAddon = compliant
        ? ` Recorded probe reading of ${enteredReading}°C meets the ≥ ${threshold}°C core cooking threshold (Status: COMPLIANT).`
        : ` Recorded probe reading of ${enteredReading}°C is BELOW the ≥ ${threshold}°C core cooking threshold (Status: NON-COMPLIANT — continue heating or quarantine batch).`;
    } else {
      ccpAddon =
        ' No thermometer probe reading was entered, so no CCP compliance status is reported. Enter an actual probe reading (°C) to evaluate a batch.';
    }
  }

  const reply = `${passage.guidance}${ccpAddon} [Source: ${passage.statute} — ${passage.clause} (Last verified: ${passage.lastVerified})]`;

  return {
    reply,
    citation: {
      statute: passage.statute,
      clause: passage.clause,
      lastVerified: passage.lastVerified,
      sourceUrl: passage.sourceUrl,
    },
    matchedSourceId: passage.id,
    ccpStatus,
    temperature: 0.0,
    disclaimer: GUIDANCE_DISCLAIMER,
  };
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
        body = { query: body };
      }
    }
    const result = await processNellyQuery(body || {});
    if (res && typeof res.status === 'function') {
      return res.status(200).json(result);
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const errPayload = { error: err?.message || 'Failed to process Nelly query' };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), { status: 500 });
  }
}

