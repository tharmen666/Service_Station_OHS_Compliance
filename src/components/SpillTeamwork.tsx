import React, { useState } from 'react';
import { spillRoles } from '../data/assessmentData';
import { emergencyProtocols } from '../data/emergencyProtocols';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  CheckSquare, 
  Maximize2, 
  Image as ImageIcon,
  CheckCircle2,
  Droplet,
  Fuel,
  ArrowRight
} from 'lucide-react';
import { PosterLightboxModal } from './PosterLightboxModal';
import { Language } from '../data/translations';
import { KISWAHILI_REGIONAL_TRANSLATIONS } from '../data/eastAfricaConfig';

interface SpillTeamworkProps {
  spillLitres?: number;
  onSpillLitresChange?: (litres: number) => void;
  lang?: Language;
  onNavigateTab?: (tab: string) => void;
}

export const SpillTeamwork: React.FC<SpillTeamworkProps> = ({
  spillLitres = 0,
  onSpillLitresChange,
  lang = 'EN',
  onNavigateTab
}) => {
  const [activeRoles, setActiveRoles] = useState<{ [key: string]: boolean }>({
    SP_01: false,
    SP_02: false,
    SP_03: false,
    SP_04: false,
  });

  const [completedSpillSteps, setCompletedSpillSteps] = useState<number[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const toggleRole = (id: string) => {
    setActiveRoles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSpillStep = (stepNum: number) => {
    if (completedSpillSteps.includes(stepNum)) {
      setCompletedSpillSteps(completedSpillSteps.filter(s => s !== stepNum));
    } else {
      setCompletedSpillSteps([...completedSpillSteps, stepNum]);
    }
  };

  const completedCount = Object.values(activeRoles).filter(Boolean).length;
  const spillProtocol = emergencyProtocols.spillResponse;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <div className="pos-card pos-card-amber p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            {lang === 'SW' ? KISWAHILI_REGIONAL_TRANSLATIONS.spillContainment.badge : spillProtocol.motto}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {lang === 'SW' ? KISWAHILI_REGIONAL_TRANSLATIONS.spillContainment.title : spillProtocol.title}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {lang === 'SW' ? KISWAHILI_REGIONAL_TRANSLATIONS.spillContainment.subtitle : 'Comprehensive 8-step response process and 4 synchronized forecourt attendant role cards for fuel spill containment.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition min-h-[44px]"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Spill Poster Lightbox</span>
          </button>

          <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center font-bold text-amber-400">
              {completedCount}/4
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Team Readiness</div>
              <div className="text-sm font-extrabold text-amber-300">
                {completedCount === 4 ? 'Spill Team Fully Deployed ✓' : 'Assigning Active Roles...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Fuel Spill Incident Volume Logger (Linked to Tab 6 Wetstock Bridge) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Active Spill Incident Volume Logger</span>
              </h3>
              <p className="text-xs text-slate-400">
                Log spilled litres below to automatically deduct from <strong>Tab 6 Wetstock Offload &amp; Reconciliation</strong> variance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Logged Loss:</span>
            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-amber-500/50 text-amber-400 font-mono font-black text-sm">
              {spillLitres} Litres
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-300 font-bold">Quick Presets:</span>
            {[0, 5, 15, 25, 50, 100].map((litres) => (
              <button
                key={litres}
                onClick={() => onSpillLitresChange?.(litres)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black transition border ${
                  spillLitres === litres
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-950/50'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {litres} L
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-mono">Custom Litres:</label>
            <input
              type="number"
              min="0"
              max="5000"
              value={spillLitres || ''}
              onChange={(e) => onSpillLitresChange?.(Math.max(0, Number(e.target.value) || 0))}
              placeholder="0"
              className="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
            />
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('wetstockBridge')}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center gap-1 transition shadow"
                title="View in Wetstock Offload Bridge"
              >
                <span>Check in Tab 6</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8-Step Emergency Spill Response Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-white">8-Step Sequential Spill Clean-Up Workflow</h3>
            <p className="text-xs text-slate-400">Step-by-step spill containment, drain protection, and statutory hazardous waste handling.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
            {completedSpillSteps.length}/8 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {spillProtocol.steps.map((item) => {
            const isDone = completedSpillSteps.includes(item.step);

            return (
              <div
                key={item.step}
                onClick={() => toggleSpillStep(item.step)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isDone
                    ? 'bg-slate-950 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs ${
                      isDone ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      #{item.step}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSpillStep(item.step);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isDone ? 'Done' : 'Mark'}
                    </button>
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-normal">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bound Poster Infographic Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" /> 4-Step STOP - CONTAIN - PROTECT - REPORT Infographic
          </span>
          <span className="text-xs font-mono text-slate-400">Tap poster to expand</span>
        </div>

        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border border-amber-500/40 bg-slate-950 p-2 shadow-inner"
        >
          <img
            src="/assets/posters/spill_response_poster.png"
            alt="Fuel Spill Response Infographic"
            className="w-full max-h-[320px] object-contain rounded-xl transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-2xl">
              <Maximize2 className="w-4 h-4" /> Single-Tap for High-Res Lightbox
            </span>
          </div>
        </div>
      </div>

      {/* Critical Non-Sparking Safety Notice */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <strong className="text-amber-400 font-bold text-sm block mb-0.5">CRITICAL SAFETY MANDATE: NON-SPARKING PLASTIC TOOLS ONLY</strong>
          Metal shovels or steel brooms striking forecourt concrete generate friction sparks that will instantly ignite volatile gasoline vapors. Only certified plastic spades, soft brooms, and peat moss granules are permitted on the forecourt.
        </div>
      </div>

      {/* 4 Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {spillRoles.map((role) => {
          const isAssigned = activeRoles[role.role_id];

          return (
            <div
              key={role.role_id}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isAssigned
                  ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 ${role.badge_color}`}>
                    {role.role_id}
                  </span>

                  <button
                    onClick={() => toggleRole(role.role_id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      isAssigned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    {isAssigned ? 'Assigned' : 'Assign Attendant'}
                  </button>
                </div>

                <h3 className="text-lg font-extrabold text-white">{role.title}</h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-amber-300 font-semibold">
                    <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Primary Tool: <strong>{role.primary_tool}</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300">
                    <strong className="text-slate-100 font-bold block">Action Protocol:</strong>
                    <p>{role.step_action}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400/90 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Safety Rule: {role.safety_rule}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PosterLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc="/assets/posters/spill_response_poster.png"
        title="STOP - CONTAIN - PROTECT - REPORT Fuel Spill Response Infographic"
        subtitle="SANS 10263 Emergency Spill Response & Drain Isolation SOP."
      />
    </div>
  );
};

