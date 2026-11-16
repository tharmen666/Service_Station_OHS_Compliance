import { Question, EvacuationStep, SpillRole } from '../types';
import assessmentBankJson from '../../assessment_bank.json';

export const assessmentQuestions: Question[] = assessmentBankJson.questions as Question[];

export const evacuationSteps: EvacuationStep[] = [
  {
    step_number: 1,
    title: 'ESD Alert Activation',
    role: 'Forecourt Supervisor / Attendant',
    action: 'Immediately hit the red Emergency Stop (ESD) button located on the nearest forecourt island or cashier counter to immediately cut all fuel pumping power.',
    critical_warning: 'DO NOT attempt to hang up nozzles before hitting the ESD button!',
    icon_name: 'AlertOctagon'
  },
  {
    step_number: 2,
    title: 'Traffic Control & Entrance Blockade',
    role: 'Senior Forecourt Attendant',
    action: 'Deploy high-visibility traffic cones across all forecourt entrance driveways. Direct incoming motorists to exit safely without stopping.',
    critical_warning: 'Stop tanker trucks from discharging or entering the site immediately.',
    icon_name: 'ShieldAlert'
  },
  {
    step_number: 3,
    title: 'Cashier Emergency Call (10177 / 112)',
    role: 'Main Shop Cashier',
    action: 'Dial Emergency Services (10177 / 112) from the landline. State: Station Name, Physical Address, Incident Type (Fire/Spill), and expected casualties.',
    critical_warning: 'Bring daily staff attendance register and visitor log to assembly point.',
    icon_name: 'PhoneCall'
  },
  {
    step_number: 4,
    title: 'Fire Team Initial Containment',
    role: 'Certified Fire Warden',
    action: 'If safe, deploy 9kg DCP Fire Extinguishers to attack base of flames using PASS method, or position containment booms to protect storm drains.',
    critical_warning: 'NEVER position yourself downwind or put your back to an uncontained flame.',
    icon_name: 'Flame'
  },
  {
    step_number: 5,
    title: 'Kiosk, Restroom & Shop Sweep',
    role: 'Assistant Store Manager',
    action: 'Conduct a thorough sweep of the Quick Shop, restrooms, customer lounge, and oil storage rooms. Shout clearly: "EVACUATE IMMEDIATELY!"',
    critical_warning: 'Ensure no customer remains locked inside restrooms or behind aisles.',
    icon_name: 'SearchCheck'
  },
  {
    step_number: 6,
    title: 'Manager Roll Call at Assembly Point',
    role: 'General Station Manager',
    action: 'Gather all evacuated staff and customers at the designated upwind Emergency Assembly Point. Conduct head count against the attendance register.',
    critical_warning: 'Do NOT allow anyone to re-enter until formal "All Clear" from Fire Chief.',
    icon_name: 'Users'
  }
];

export const spillRoles: SpillRole[] = [
  {
    role_id: 'SP_01',
    title: 'Role 1: The Fetcher (Equipment & Isolation)',
    primary_tool: 'Yellow Heavy-Duty Spill Kit & Containment Booms',
    step_action: 'Rushes to the main storage bay, grabs the mobile Spill Kit container, equips nitrile gloves + safety goggles, and lays flexible booms around storm drain grates.',
    safety_rule: 'Never approach liquid fuel spills without full chemical PPE.',
    badge_color: 'border-amber-500 bg-amber-500/10 text-amber-400'
  },
  {
    role_id: 'SP_02',
    title: 'Role 2: Plastic Spade Applicator (Granule Absorber)',
    primary_tool: 'Non-Sparking Heavy Plastic Spade & Peat Moss Granules',
    step_action: 'Spreads absorbent peat moss / synthetic granules generously around the outer perimeter of the spill, working inwards to absorb fuel and suppress vapors.',
    safety_rule: 'Use ONLY non-sparking plastic tools. Metal shovels can trigger explosive sparks!',
    badge_color: 'border-amber-400 bg-amber-400/10 text-amber-300'
  },
  {
    role_id: 'SP_03',
    title: 'Role 3: Broom Sweeper (Encapsulation)',
    primary_tool: 'Non-Static Soft Bristle Broom',
    step_action: 'Gently sweeps the fuel-saturated granules into a centralized pile, ensuring all liquid fuel is encapsulated by the absorbent material.',
    safety_rule: 'Sweep with slow, controlled strokes to prevent dust clouds and static electricity build-up.',
    badge_color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
  },
  {
    role_id: 'SP_04',
    title: 'Role 4: Oil Drum Disposal & Hazardous Tagging',
    primary_tool: 'Heavy Plastic Hazardous Waste Bags & Labeled Steel Drum',
    step_action: 'Spades saturated waste into hazardous waste bags, seals bags securely, deposits inside marked steel waste drums, and completes the Spill Incident Log.',
    safety_rule: 'Never mix fuel-soaked waste with general municipal shop trash bins.',
    badge_color: 'border-orange-500 bg-orange-500/10 text-orange-400'
  }
];

