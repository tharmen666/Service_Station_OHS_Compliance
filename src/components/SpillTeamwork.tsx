import React, { useState } from 'react';
import { spillRoles } from '../data/assessmentData';
import { AlertTriangle, ShieldCheck, Wrench, Sparkles, CheckSquare, Trash2 } from 'lucide-react';

export const SpillTeamwork: React.FC = () => {
  const [activeRoles, setActiveRoles] = useState<{ [key: string]: boolean }>({
    SP_01: false,
    SP_02: false,
    SP_03: false,
    SP_04: false,
  });

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
              onClick={() => toggleRole(role.role_id)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isAssigned
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${role.badge_color}`}>
                    {role.role_id}
                  </span>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                    isAssigned ? 'bg-amber-500 text-slate-950 border-amber-400' : 'border-slate-700 bg-slate-800'
                  }`}>
                    {isAssigned && <CheckSquare className="w-4 h-4" />}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>

                {/* Primary Tool */}
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>Primary Equipment:</strong> {role.primary_tool}</span>
                </div>

                {/* Action */}
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {role.step_action}
                </p>
              </div>

              {/* Safety Rule Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-amber-300/80 font-medium">
                  <strong>Mandate:</strong> {role.safety_rule}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRole(role.role_id);
                  }}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                    isAssigned
                      ? 'bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isAssigned ? 'Role Active ✓' : 'Assign Attendant'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
