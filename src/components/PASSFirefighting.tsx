import React, { useState } from 'react';
import { Flame, ShieldCheck, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../data/translations';
import { KISWAHILI_REGIONAL_TRANSLATIONS } from '../data/eastAfricaConfig';

interface PASSFirefightingProps {
  lang?: Language;
}

export const PASSFirefighting: React.FC<PASSFirefightingProps> = ({ lang = 'EN' }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const swTranslations = KISWAHILI_REGIONAL_TRANSLATIONS.firefighting;

  const passSteps = [
    {
      letter: 'P',
      title: lang === 'SW' ? 'VUTA PINI YA USALAMA (PULL)' : 'PULL THE PIN',
      action: lang === 'SW' ? swTranslations.passSteps.pull : 'Pull the safety pin located at the top of the extinguisher handle to break the tamper seal.',
      tip: 'Do not squeeze the handle while pulling the pin, as pressure locks it in place.'
    },
    {
      letter: 'A',
      title: lang === 'SW' ? 'LENGA KWENYE MZIZI (AIM)' : 'AIM LOW AT BASE',
      action: lang === 'SW' ? swTranslations.passSteps.aim : 'Aim the extinguisher nozzle or hose directly at the base of the fuel fire, NOT at the flames.',
      tip: 'Fuel fires burn on liquid surface vapors. Hitting the base starves fuel source.'
    },
    {
      letter: 'S',
      title: lang === 'SW' ? 'FINYA KISHIKIO (SQUEEZE)' : 'SQUEEZE THE HANDLE',
      action: lang === 'SW' ? swTranslations.passSteps.squeeze : 'Squeeze the operating lever firmly to discharge the 9kg Dry Chemical Powder (DCP) agent.',
      tip: 'Releasing the lever stops the chemical discharge instantly.'
    },
    {
      letter: 'S',
      title: lang === 'SW' ? 'TIKISA KUSHOTO NA KULIA (SWEEP)' : 'SWEEP SIDE TO SIDE',
      action: lang === 'SW' ? swTranslations.passSteps.sweep : 'Sweep the nozzle from side to side across the base of the fire until completely extinguished.',
      tip: 'Keep 2-3 meters back and advance slowly as flames recede.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card pos-card-green p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'SW' ? swTranslations.badge : 'Fire & First Aid Module'}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {lang === 'SW' ? swTranslations.title : 'PASS Firefighting Technique & First Aid'}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {lang === 'SW' ? swTranslations.subtitle : 'Standard Operating Procedure for operating 9kg Dry Chemical Powder (DCP) extinguishers on Class B fuel fires.'}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          SABS SANS 1910 Compliant
        </div>
      </div>

      {/* PASS Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {passSteps.map((step, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
              activeStep === idx
                ? 'bg-gradient-to-b from-emerald-950/50 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-2xl flex items-center justify-center border border-emerald-500/40">
                  {step.letter}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">Step 0{idx + 1}</span>
              </div>

              <h3 className="text-base font-extrabold text-white mb-2">{step.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-3">{step.action}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-emerald-300">
              💡 <strong>Pro Tip:</strong> {step.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Eyewash & Chemical Skin Flush First Aid Protocol */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Forecourt First Aid: Gasoline & Solvent Splash Protocol</h3>
            <p className="text-slate-400 text-xs">Immediate medical countermeasures for customer or staff fuel contact.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <strong className="text-emerald-400 font-bold text-sm block mb-1">1. Skin Contact</strong>
            Remove fuel-soaked clothing immediately. Flush skin at the emergency wash station with clean water for 15 minutes. Do NOT apply heavy oils or hand sanitizers.
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <strong className="text-emerald-400 font-bold text-sm block mb-1">2. Eye Contact</strong>
            Hold eyelids open and flush eyes with eyewash bottle solution or running water for 15 continuous minutes. Seek emergency medical evaluation immediately.
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <strong className="text-emerald-400 font-bold text-sm block mb-1">3. Inhalation / Dizziness</strong>
            Move affected person upwind to fresh air immediately. Keep person warm and quiet. Call Emergency Services if breathing difficulty persists.
          </div>
        </div>
      </div>
    </div>
  );
};
