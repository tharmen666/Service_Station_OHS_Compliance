import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  UserCheck, 
  Sparkles, 
  HelpCircle,
  Activity,
  Stethoscope,
  Radio,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface NightshiftFirstResponderProps {
  lang?: Language;
}

export const NightshiftFirstResponder: React.FC<NightshiftFirstResponderProps> = ({ lang = 'EN' }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const t = translations[lang];

  const firstResponderSteps = [
    {
      stepNumber: 1,
      title: 'Step 1: Scene Safety & PPE Protocol',
      subtitle: 'Gloves Mandatory & Crowd Clearance',
      icon: ShieldAlert,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      borderHighlight: 'border-red-500',
      accentColor: 'text-red-400',
      actionTitle: '1. Put On Nitrile Gloves & Ensure Forecourt Safety',
      details: [
        'MANDATORY PPE: Don medical nitrile gloves from the forecourt emergency kit before touching any victim, wound, or fluid.',
        'TRAFFIC & CROWD CLEARANCE: Direct forecourt attendants to cone off the lane and clear bystanders at least 5 meters back.',
        'IGNITION HAZARD: Verify no idling vehicles, smoking, or spilled fuel exists near the incident zone.'
      ],
      warning: 'NEVER render assistance without PPE gloves. Protect against bloodborne pathogens and forecourt chemical hazards.'
    },
    {
      stepNumber: 2,
      title: 'Step 2: Primary Check & Recovery Position',
      subtitle: 'Pulse/Airway Check & Spinal Caution',
      icon: Activity,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      borderHighlight: 'border-amber-500',
      accentColor: 'text-amber-400',
      actionTitle: '2. Check Responsiveness, Airway & Spinal Precautions',
      details: [
        'RESPONSIVENESS & AIRWAY: Tap shoulders gently and shout "Are you okay?". Check for normal chest rise and pulse.',
        'SPINAL CAUTION: DO NOT move or turn patient if head, neck, or spinal trauma is suspected from a vehicle impact.',
        'RECOVERY POSITION: If unconscious but breathing normally and no spinal injury is suspected, roll carefully onto their side.'
      ],
      warning: 'If patient is non-responsive and not breathing normally, immediately signal cashier to dispatch 10177 and initiate CPR.'
    },
    {
      stepNumber: 3,
      title: 'Step 3: Conscious Patient Diagnostics',
      subtitle: 'Orientation, Pain & Medical History',
      icon: Stethoscope,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      borderHighlight: 'border-blue-500',
      accentColor: 'text-blue-400',
      actionTitle: '3. Ask the 4 Diagnostic Questions',
      details: [
        'ORIENTATION: "What is your full name? Do you know where you are right now?"',
        'PAIN LEVEL: "Where are you hurting most? Can you rate pain from 1 to 10?"',
        'CHRONIC MEDS / DIABETES: "Do you take any daily medication (insulin, blood pressure, asthma)?"',
        'EMERGENCY CONTACT: "What is your next of kin or family phone number to call?"'
      ],
      warning: 'Keep patient calm. Do not give water or food if abdominal injury, severe burns, or surgery may be required.'
    },
    {
      stepNumber: 4,
      title: 'Step 4: Cashier Bridge & EMS Dispatch',
      subtitle: 'Relay Wound Details & Emergency Call',
      icon: PhoneCall,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      borderHighlight: 'border-emerald-500',
      accentColor: 'text-emerald-400',
      actionTitle: '4. Transmit Exact Status to Shop Cashier',
      details: [
        'CASHIER INTERCOM BRIDGE: Use forecourt intercom or radio: "Cashier, call 10177 / 112 immediately!"',
        'TRANSMIT EXACT DETAILS: State age, sex, conscious state, bleeding location, burns %, or suspected fracture.',
        'EMERGENCY VEHICLE ESCORT: Station an attendant at the driveway entrance with a flashlight to guide ambulance in.'
      ],
      warning: 'Maintain log of patient vitals and time of incident for handover to EMS paramedics.'
    }
  ];

  const currentStep = firstResponderSteps[activeStepIndex];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card p-6 rounded-3xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black uppercase tracking-wider mb-2 border border-red-500/30">
            <HeartPulse className="w-4 h-4 text-red-400 animate-pulse" />
            Forecourt First Responder Protocol • Nightshift Module
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            First Responder & Emergency Medical Procedure
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            OHS Haven accredited 4-step emergency triage protocol for nightshift attendants, cashiers, and supervisors.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-extrabold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-400" />
          <span>OHSA 85-1993 / SANS 10089 Compliant</span>
        </div>
      </div>

      {/* 4 Interactive Step Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {firstResponderSteps.map((step, idx) => {
          const IconComp = step.icon;
          const isActive = activeStepIndex === idx;

          return (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[140px] ${
                isActive
                  ? `bg-slate-900 ${step.borderHighlight} ring-2 ring-red-500/30 shadow-xl`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${step.badgeColor}`}>
                    Step {step.stepNumber}
                  </span>
                  {isActive && <CheckCircle2 className={`w-5 h-5 ${step.accentColor}`} />}
                </div>

                <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">{step.subtitle}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-extrabold text-slate-300">
                <span className={isActive ? step.accentColor : 'text-slate-400'}>Inspect Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Step Action Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block">
              Active First Responder Protocol Card
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mt-0.5">{currentStep.actionTitle}</h3>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
            <Clock className="w-4 h-4 text-red-400" />
            <span>Target Response: &lt; 30 Seconds</span>
          </div>
        </div>

        {/* Detailed Guidelines List */}
        <div className="space-y-3">
          {currentStep.details.map((detail, dIdx) => (
            <div key={dIdx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-black text-xs flex-shrink-0 border border-red-500/30 mt-0.5">
                {dIdx + 1}
              </div>
              <p className="text-sm font-semibold text-slate-200 leading-relaxed pt-0.5">{detail}</p>
            </div>
          ))}
        </div>

        {/* Critical Warning Callout */}
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-xs text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <strong className="text-red-400 font-extrabold block mb-0.5">CRITICAL SAFETY WARNING:</strong>
            <p className="leading-relaxed">{currentStep.warning}</p>
          </div>
        </div>

        {/* Navigation Step Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
            disabled={activeStepIndex === 0}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition min-h-[48px]"
          >
            ← Previous Step
          </button>

          <button
            onClick={() => setActiveStepIndex(prev => Math.min(firstResponderSteps.length - 1, prev + 1))}
            disabled={activeStepIndex === firstResponderSteps.length - 1}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-950/40 transition min-h-[48px]"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
};
