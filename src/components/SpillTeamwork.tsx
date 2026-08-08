import React, { useState } from 'react';
import { spillRoles } from '../data/assessmentData';
import { AlertTriangle, ShieldCheck, Wrench, Sparkles, CheckSquare, Maximize2, Image as ImageIcon } from 'lucide-react';
import { PosterLightboxModal } from './PosterLightboxModal';

export const SpillTeamwork: React.FC = () => {
  const [activeRoles, setActiveRoles] = useState<{ [key: string]: boolean }>({
    SP_01: false,
    SP_02: false,
    SP_03: false,
    SP_04: false,
  });

  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const toggleRole = (id: string) => {
    setActiveRoles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(activeRoles).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="pos-card pos-card-amber p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Compulsory Teamwork SOP
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Emergency Spill Response Teamwork Protocol</h2>
          <p className="text-slate-300 text-sm mt-1">Four synchronized forecourt attendant role cards for containing fuel spills and preventing drain contamination.</p>
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
