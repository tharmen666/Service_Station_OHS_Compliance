import React, { useState } from 'react';
import { emergencyProtocols } from '../data/emergencyProtocols';
import { 
  AlertOctagon, 
  ShieldAlert, 
  PhoneCall, 
  Flame, 
  SearchCheck, 
  Users, 
  CheckCircle2, 
  Volume2, 
  Maximize2, 
  Image as ImageIcon,
  HeartPulse,
  Power,
  ClipboardCheck,
  Search
} from 'lucide-react';
import { PosterLightboxModal } from './PosterLightboxModal';
import { Language } from '../data/translations';
import { KISWAHILI_REGIONAL_TRANSLATIONS } from '../data/eastAfricaConfig';

interface EvacuationFlowProps {
  lang?: Language;
}

export const EvacuationFlow: React.FC<EvacuationFlowProps> = ({ lang = 'EN' }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAudioSimulating, setIsAudioSimulating] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const protocol = emergencyProtocols.evacuation;
  const swTranslations = KISWAHILI_REGIONAL_TRANSLATIONS.evacuation;

  const toggleStepComplete = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
      if (stepNum < protocol.steps.length) {
        setActiveStep(stepNum + 1);
      }
    }
  };

  const getIcon = (stepNum: number) => {
    switch (stepNum) {
      case 1: return <AlertOctagon className="w-6 h-6 text-red-400" />;
      case 2: return <HeartPulse className="w-6 h-6 text-red-400" />;
      case 3: return <Users className="w-6 h-6 text-red-400" />;
      case 4: return <ClipboardCheck className="w-6 h-6 text-red-400" />;
      case 5: return <Flame className="w-6 h-6 text-red-400" />;
      case 6: return <ShieldAlert className="w-6 h-6 text-red-400" />;
      case 7: return <Power className="w-6 h-6 text-red-400" />;
      case 8: return <Search className="w-6 h-6 text-red-400" />;
      case 9: return <PhoneCall className="w-6 h-6 text-red-400" />;
      default: return <AlertOctagon className="w-6 h-6 text-red-400" />;
    }
  };

  const simulateAlarmSound = () => {
    setIsAudioSimulating(true);
    setTimeout(() => setIsAudioSimulating(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="pos-card pos-card-red p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            {lang === 'SW' ? swTranslations.badge : protocol.motto}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {lang === 'SW' ? swTranslations.title : protocol.title}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {lang === 'SW' ? swTranslations.subtitle : 'Sequential 9-step forecourt emergency response, panic prevention, engine shut-off, sweeps, and roll call.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition min-h-[44px]"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Evacuation Poster Lightbox</span>
          </button>

          <button
            onClick={simulateAlarmSound}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition min-h-[44px] ${
              isAudioSimulating ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-xs">{isAudioSimulating ? 'ESD ALARM SOUNDING...' : 'Simulate ESD Siren'}</span>
          </button>
        </div>
      </div>

      {/* Bound Evacuation Poster Infographic Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-red-400" /> ESD Activation & Assembly Point Diagram Poster
          </span>
          <span className="text-xs font-mono text-slate-400">Tap poster to expand</span>
        </div>

        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border border-red-500/40 bg-slate-950 p-2 shadow-inner"
        >
          <img
            src="/assets/posters/evacuation_poster.png"
            alt="Evacuation Diagram Poster"
            className="w-full max-h-[320px] object-contain rounded-xl transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-red-600 text-white font-black text-xs flex items-center gap-2 shadow-2xl">
              <Maximize2 className="w-4 h-4" /> Single-Tap for Full-Screen View
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Step Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {protocol.steps.map((item) => {
          const isDone = completedSteps.includes(item.step);
          const isCurrent = activeStep === item.step;

          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-900/90 border-emerald-500/60 ring-1 ring-emerald-500/30'
                  : isCurrent
                  ? 'bg-gradient-to-b from-red-950/60 to-slate-900 border-red-500 ring-2 ring-red-500/40'
                  : 'bg-slate-900/40 border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                    isDone ? 'bg-emerald-500 text-slate-950' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    #{item.step}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepComplete(item.step);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isDone ? 'Executed' : 'Mark Done'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {getIcon(item.step)}
                  <h3 className="font-extrabold text-base text-white">{item.action}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-red-300/90 font-bold">
                ⚠️ Step #{item.step} Mandatory Protocol Standard
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PosterLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc="/assets/posters/evacuation_poster.png"
        title="ESD Activation & Assembly Point Evacuation Diagram"
        subtitle="SANS 10089-3 Emergency Evacuation Plan and Site Assembly Protocol."
      />
    </div>
  );
};

