import React, { useState } from 'react';
import {
  Shield,
  Fuel,
  Smartphone,
  Cigarette,
  AlertCircle,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
  Smile,
  CreditCard,
  Gauge,
  Wrench,
  Navigation,
} from 'lucide-react';
import { PosterLightboxModal } from './PosterLightboxModal';
import { evaluate4Plus1SpareWheelCheck } from '../lib/forecourtTrainingEngine';

interface ServiceStep {
  stepNumber: number;
  title: string;
  badge: string;
  dialogue: string;
  whyItMatters: string;
  icon: any;
}

export const SA_CUSTOMER_SERVICE_STEPS: ServiceStep[] = [
  {
    stepNumber: 1,
    title: 'Direct the Customer to the Correct Pump',
    badge: 'Step 1 • Lane Marshalling',
    dialogue:
      '"Good day! Please pull forward to Pump 3 on your left for Unleaded 95 / Diesel 50ppm, switch off your engine, and engage your handbrake."',
    whyItMatters:
      'Prevents forecourt congestion, aligns the vehicle filler cap with the hose reach, and ensures engine ignition is off before fueling.',
    icon: Navigation,
  },
  {
    stepNumber: 2,
    title: 'Greet with a Smile, Confirm Fuel Order & Zero Meter',
    badge: 'Step 2 • Warm Welcome & Order Check',
    dialogue:
      '"Welcome! How are you today? Just confirming: R500 Unleaded 95, and please note the pump meter is reset to zero (0.00)."',
    whyItMatters:
      'Builds immediate customer trust, prevents misfuelling (petrol in diesel or vice versa), and eliminates meter disputes.',
    icon: Smile,
  },
  {
    stepNumber: 3,
    title: 'Safety Reminder: No Smoking & No Cellphone Usage',
    badge: 'Step 3 • SANS 10089-3 Ignition Control',
    dialogue:
      '"For your safety and ours while dispensing fuel, please refrain from smoking or using your cellphone near the pump island."',
    whyItMatters:
      'Petrol vapours are heavier than air and ignitable by naked flames, hot ash, or battery spark discharge.',
    icon: Smartphone,
  },
  {
    stepNumber: 4,
    title: 'Ask for Additional Services: Oil, Water & 4+1 Spare Wheel Check',
    badge: 'Step 4 • The Spare Wheel Rule',
    dialogue:
      '"While your fuel is dispensing, may I check your oil, water, windscreen, and the pressure in all 4 tyres PLUS your spare wheel?"',
    whyItMatters:
      'When does a motorist check their spare wheel? Only when they already have a puncture! Even an unused spare loses ~1.5–2.0 PSI/month via rubber permeation—checking all 4+1 wheels prevents roadside strandings.',
    icon: Wrench,
  },
  {
    stepNumber: 5,
    title: 'Confirm Card or Cash Payment & Departure Greeting with a Smile',
    badge: 'Step 5 • Payment & Smiling Farewell',
    dialogue:
      '"Your fuelcap is locked and your spare wheel is at target pressure. Will you be paying by card or cash today? Thank you—drive safely and have a wonderful day!"',
    whyItMatters:
      'Ensures accurate POS speedpoint/cash handling, confirms filler cap closure, and leaves a lasting positive impression.',
    icon: CreditCard,
  },
];

export const CustomerServiceModule: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5]);

  // Interactive 4+1 Spare Wheel Pressure Checker state
  const [roadPsi, setRoadPsi] = useState<number>(32);
  const [sparePsi, setSparePsi] = useState<number>(26);
  const [targetPsi, setTargetPsi] = useState<number>(32);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const spareEvaluation = evaluate4Plus1SpareWheelCheck({
    frontLeftPsi: roadPsi,
    frontRightPsi: roadPsi,
    rearLeftPsi: roadPsi,
    rearRightPsi: roadPsi,
    spareWheelPsi: sparePsi,
    targetRoadPsi: targetPsi,
    monthsSinceLastSpareCheck: 3,
  });

  const rules = [
    {
      title: 'No-Smoking Rule Enforcement',
      icon: Cigarette,
      policy: 'Strictly Prohibited on Forecourt',
      action:
        'Politely inform customer: "For your safety and ours, please extinguish your cigarette before we begin refueling."',
      reason: 'Open flames near fuel vapor clouds pose an immediate explosion hazard.',
    },
    {
      title: 'Mobile Phone Static Prevention',
      icon: Smartphone,
      policy: 'Redirection to Inside Vehicle/Shop',
      action:
        'Politely state: "Sir/Madam, kindly pause phone usage while near active fuel dispensers due to static electricity safety regulations."',
      reason: 'Dropped phone batteries or internal spark gaps can ignite gasoline fumes.',
    },
    {
      title: 'Approved Container Fuel Dispensing',
      icon: Fuel,
      policy: 'Certified Anti-Static Containers Only',
      action:
        'Refuse glass, milk jugs, or ungrounded plastic. Offer certified anti-static containers from the store.',
      reason: 'Non-grounded containers accumulate static charge during high-velocity fuel flow.',
    },
    {
      title: 'Ignition Shut-Off & Engine Off',
      icon: Shield,
      policy: 'Engine Off Before Refueling',
      action: 'Request motorist turn off engine and engage handbrake before inserting nozzle.',
      reason: 'Hot exhaust pipes and vehicle electrical systems can ignite vapor leaks.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card pos-card-blue p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Shield className="w-3.5 h-3.5" />
            South African Forecourt Customer Service &amp; Safety SOP
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            5-Step Forecourt Customer Service &amp; 4+1 Spare Wheel Protocol
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Step-by-step South African forecourt attendant sequence: pump marshalling, smiling greeting, smoking/cellphone safety reminder, oil/water &amp; spare wheel pressure check, and card/cash farewell.
          </p>
        </div>

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition min-h-[44px]"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Greeting &amp; Conduct Poster</span>
        </button>
      </div>

      {/* 5-Step South African Forecourt Customer Service Sequence */}
      <section
        data-testid="sa-customer-service-5steps"
        className="p-6 rounded-3xl bg-slate-900/95 border-2 border-amber-500/40 shadow-2xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
              Standard Operating Sequence (South African Service Stations)
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              5-Step Forecourt Attendant Customer Service Journey
            </h3>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
            {completedSteps.length} / {SA_CUSTOMER_SERVICE_STEPS.length} Steps Verified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {SA_CUSTOMER_SERVICE_STEPS.map((step) => {
            const StepIcon = step.icon;
            const isChecked = completedSteps.includes(step.stepNumber);
            return (
              <div
                key={step.stepNumber}
                data-testid={`customer-service-step-${step.stepNumber}`}
                onClick={() => toggleStep(step.stepNumber)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isChecked
                    ? 'bg-slate-950/90 border-emerald-500/50 shadow-lg'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base flex-shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                        : 'bg-slate-900 text-amber-400 border-slate-700'
                    }`}
                  >
                    {step.stepNumber}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                        {step.badge}
                      </span>
                      <h4 className="text-base font-black text-white flex items-center gap-1.5">
                        <StepIcon className="w-4 h-4 text-amber-400" />
                        <span>{step.title}</span>
                      </h4>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-200 font-semibold italic">
                      {step.dialogue}
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong className="text-slate-100">Why this step matters:</strong>{' '}
                      {step.whyItMatters}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isChecked ? 'Active in SOP' : 'Mark Complete'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive 4+1 Spare Wheel Permeation & Pressure Checker */}
      <section
        data-testid="spare-wheel-4plus1-checker"
        className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block">
              Step 4 Deep-Dive • The 4+1 Spare Wheel Rule
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <span>4+1 Spare Wheel Pressure Check Simulator</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Motorists rarely check their spare tyre until a puncture happens. Always ask to check the 5th wheel (+2 PSI buffer above target road pressure).
            </p>
          </div>
          <span
            data-testid="spare-wheel-status-badge"
            className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
              spareEvaluation.overall4Plus1Compliant
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {spareEvaluation.overall4Plus1Compliant
              ? '✓ 4+1 Tyres & Spare Compliant'
              : '⚠️ Spare Wheel Needs Inflation'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <label
              htmlFor="road-tyres-psi-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              4 Road Tyres Current Pressure (PSI):
            </label>
            <input
              id="road-tyres-psi-input"
              type="number"
              value={roadPsi}
              onChange={(e) => setRoadPsi(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-white"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <label
              htmlFor="spare-wheel-psi-input"
              className="text-xs text-amber-300 font-bold block mb-1"
            >
              +1 Spare Wheel Measured Pressure (PSI):
            </label>
            <input
              id="spare-wheel-psi-input"
              data-testid="spare-wheel-psi-input"
              type="number"
              value={sparePsi}
              onChange={(e) => setSparePsi(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-sm font-mono font-black text-amber-300"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <label
              htmlFor="target-psi-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Manufacturer Target Road Pressure (PSI):
            </label>
            <input
              id="target-psi-input"
              type="number"
              value={targetPsi}
              onChange={(e) => setTargetPsi(Number(e.target.value) || 32)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-cyan-300"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{spareEvaluation.remediationNote}</span>
          <button
            type="button"
            onClick={() => setSparePsi(spareEvaluation.targetSparePsi)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs whitespace-nowrap transition"
          >
            Inflate Spare to {spareEvaluation.targetSparePsi} PSI
          </button>
        </div>
      </section>

      {/* Bound Customer Service Poster Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-400" /> Forecourt Greeting &amp; Pump Service Illustration Poster
          </span>
          <span className="text-xs font-mono text-slate-300">Tap poster to expand</span>
        </div>

        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border border-blue-500/40 bg-slate-950 p-2 shadow-inner"
        >
          <img
            src="/assets/posters/customer_service_poster.png"
            alt="Customer Service Conduct Poster"
            className="w-full max-h-[320px] object-contain rounded-xl transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center gap-2 shadow-2xl">
              <Maximize2 className="w-4 h-4" /> Single-Tap for High-Res View
            </span>
          </div>
        </div>
      </div>

      {/* 4 Policy Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.policy}
                  </span>
                  <IconComp className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-lg font-extrabold text-white mb-2">{item.title}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 mb-3">
                  <strong className="text-blue-300 font-bold block">
                    Attendant Dialogue Action:
                  </strong>
                  <p className="text-slate-200 font-semibold">{item.action}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Technical Rationale:</strong> {item.reason}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PosterLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc="/assets/posters/customer_service_poster.png"
        title="Forecourt Greeting & Pump Service Conduct Poster"
        subtitle="Attendant customer engagement and static ignition de-escalation SOP."
      />
    </div>
  );
};
