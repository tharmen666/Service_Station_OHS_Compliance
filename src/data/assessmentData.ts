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
    title: 'Role 1: Emergency Stop & 6-to-7-Person Team PPE Deployment',
    primary_tool: 'Emergency Stop Button, Full PPE Gloves, Goggles & Spill Kit',
    step_action: 'Immediately hits the emergency stop button and deploys the coordinated 6-to-7-person spill response team wearing full PPE gloves and protective gear to block stormwater drains.',
    safety_rule: 'Contain all fuel spills immediately before any product reaches stormwater drains.',
    badge_color: 'border-amber-500 bg-amber-500/10 text-amber-400'
  },
  {
    role_id: 'SP_02',
    title: 'Role 2: Dual Absorption (Sponge/Pads & Specialized Cloths)',
    primary_tool: 'Absorbent Sponge/Pads & Specialized Fuel Cloths',
    step_action: 'One team member covers the spill with absorbent sponge/pads to soak it up; simultaneously, another team member covers the fuel with specialized absorbent cloths.',
    safety_rule: 'Use only certified spill kit pads and cloths; never wash fuel into drains with water.',
    badge_color: 'border-amber-400 bg-amber-400/10 text-amber-300'
  },
  {
    role_id: 'SP_03',
    title: 'Role 3: Hazardous Waste Disposal (Old-Oil Drums)',
    primary_tool: 'Heavy-Duty PPE Gloves & Designated Old-Oil Drums / Waste Containers',
    step_action: 'Staff wearing chemical PPE gloves pick up all fuel-saturated sponges, pads, and cloths and place them directly into proper old-oil drums / hazardous waste containers.',
    safety_rule: 'Never dispose of fuel-soaked pads or cloths in general shop bins.',
    badge_color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
  },
  {
    role_id: 'SP_04',
    title: 'Role 4: Sand Casting, Broom Sweep & Single-Use Kit Replenishment',
    primary_tool: 'Forecourt Sand, Non-Sparking Broom & Fresh Single-Use Spill Kit Stock',
    step_action: 'One team member casts sand over the remaining residue while another sweeps it thoroughly. Immediately restock the spill kit afterward—all spill kit contents are strictly single-use only.',
    safety_rule: 'Spill kit materials are single-use only and must be 100% replenished immediately after use.',
    badge_color: 'border-orange-500 bg-orange-500/10 text-orange-400'
  }
];

