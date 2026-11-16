export interface StatutoryCitationRecord {
  id: string;
  code: string;
  title: string;
  keyClauses: string;
  applicability: string;
  lastVerified: string;
  sourceUrl: string;
  jurisdiction: 'South Africa' | 'International Reference';
}

export const VERIFIED_STATUTORY_CITATIONS: StatutoryCitationRecord[] = [
  {
    id: 'ohsa-85-1993',
    code: 'OHS Act 85 of 1993',
    title: 'Occupational Health and Safety Act, 1993 (Act No. 85 of 1993)',
    keyClauses: 'Section 8 (General duties of employers), Section 9 (General duties to persons other than employees), Section 14 (General duties of employees), Section 16(1) & 16(2) (CEO & delegated accountability), Section 24 (Reportable incidents)',
    applicability: 'Forecourt hazard control, supervision, training, right to refuse dangerous work, and statutory incident reporting.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/occupational-health-and-safety-act',
    jurisdiction: 'South Africa',
  },
  {
    id: 'sans-10089-3',
    code: 'SANS 10089-3:2010',
    title: 'The petroleum industry — Part 3: The installation, modification, and decommissioning of underground storage tanks, pumps/dispensers and pipework at service stations and consumer installations',
    keyClauses: 'Clause 6 (Bulk fuel offloading & static earthing), Clause 7.4 (Emergency Shut-Off Devices / ESD isolation & forecourt electrical cut-off)',
    applicability: 'Underground storage tanks, dispenser island safety zones, static bonding, and 2-second ESD emergency isolation.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://store.sabs.co.za/',
    jurisdiction: 'South Africa',
  },
  {
    id: 'sans-10263',
    code: 'SANS 10263:2016',
    title: 'The warehousing and handling of dangerous goods',
    keyClauses: 'Spill containment, hydrophobic absorbent deployment, stormwater drain protection, and hazardous waste manifest disposal',
    applicability: 'Forecourt hydrocarbon spill containment, non-sparking cleanup equipment, and hazmat drum sealing.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://store.sabs.co.za/',
    jurisdiction: 'South Africa',
  },
  {
    id: 'r638-2018',
    code: 'Regulation R638 of 2018',
    title: 'Regulations Governing General Hygiene Requirements for Food Premises, the Transport of Food and Related Matters (under Foodstuffs, Cosmetics and Disinfectants Act 54 of 1972)',
    keyClauses: 'Regulation 8 (Time and temperature control), Regulation 10 (Handling of food), Annexure B (Chilled storage ≤ 5°C, hot holding ≥ 60°C, core cooking ≥ 74°C)',
    applicability: 'Service station convenience store kitchens, hot food delis, bakeries, and cold-chain thermal monitoring (replaces US FDA / SNHD references).',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/foodstuffs-cosmetics-and-disinfectants-act-regulations-general-hygiene-requirements-food',
    jurisdiction: 'South Africa',
  },
  {
    id: 'gsr-gmr-ohsa',
    code: 'GSR & GMR (OHS Act Regulations)',
    title: 'General Safety Regulations (GNR 1031) & General Machinery Regulations (GNR 1521)',
    keyClauses: 'GSR Reg 2 (Personal Safety Equipment / PPE), GSR Reg 3 (First Aid, Emergency Equipment & Boxes), GSR Reg 4 (Use and storage of flammable liquids); GMR Reg 2 (Supervision of machinery), GMR Reg 3 (Safeguarding & isolation)',
    applicability: 'Mandatory provision of anti-static boots, flame-retardant vests, nitrile gloves, certified First Aiders, 9kg DCP fire extinguishers, and machinery lock-out.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.labour.gov.za/DocumentCenter/Pages/Legislation.aspx',
    jurisdiction: 'South Africa',
  },
  {
    id: 'coida-130-1993',
    code: 'COIDA Act 130 of 1993',
    title: 'Compensation for Occupational Injuries and Diseases Act, 1993 (Act No. 130 of 1993)',
    keyClauses: 'Section 39 (Notice of accident by employer within 7 days via W.Cl.2), Section 47 (Compensation for temporary/permanent disablement)',
    applicability: 'Mandatory reporting of workplace injuries, hydrocarbon exposure, or armed robbery trauma to the Compensation Commissioner.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/compensation-occupational-injuries-and-diseases-act',
    jurisdiction: 'South Africa',
  },
  {
    id: 'bcea-75-1997',
    code: 'BCEA Act 75 of 1997',
    title: 'Basic Conditions of Employment Act, 1997 (Act No. 75 of 1997)',
    keyClauses: 'Section 9 (Ordinary hours of work max 45h/week), Section 14 (Meal intervals after 5h), Section 15 (Daily 12h & weekly 36h rest), Section 17 (Night work between 18:00 and 06:00)',
    applicability: 'Forecourt attendant shift scheduling, fatigue management, nightshift transport/allowances, and rest periods.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/basic-conditions-employment-act',
    jurisdiction: 'South Africa',
  },
  {
    id: 'popia-4-2013',
    code: 'POPIA Act 4 of 2013',
    title: 'Protection of Personal Information Act, 2013 (Act No. 4 of 2013)',
    keyClauses: 'Condition 3 / Section 10 (Minimality — collect only necessary data), Condition 4 / Section 14 (Retention & restriction of records), Condition 7 / Section 19 (Security safeguards)',
    applicability: 'Data minimisation on training registers, anonymisation of fleet examples, and encryption of statutory records.',
    lastVerified: '2026-03-01',
    sourceUrl: 'https://www.gov.za/documents/protection-personal-information-act',
    jurisdiction: 'South Africa',
  },
];

