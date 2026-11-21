import React from 'react';
import { getOHSSystemInstruction } from '../ohsComplianceGuardrails';
import { VERIFIED_STATUTORY_CITATIONS } from '../data/statutoryCitations';
import { X, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

interface AIStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudioDrawer: React.FC<AIStudioDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const guardrailSummary = getOHSSystemInstruction();

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-guardrails-heading"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                Admin Guardrail Configuration
              </span>
              <h3 id="admin-guardrails-heading" className="text-xl font-extrabold text-white mt-0.5">
                Statutory Retrieval Guardrails (Admin View)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Drawer"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-extrabold text-emerald-300">Temperature Requested: 0.0</span>
                <span className="block text-[11px] text-emerald-400/80">Requested for repeatability only. AI-drafted output requires human review (OHS Act 85 / SANS 10089)</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ENFORCED
            </span>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="guardrail-summary-textarea"
              className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block"
            >
              Active Guardrail Policy Summary
            </label>
            <textarea
              id="guardrail-summary-textarea"
              readOnly
              value={guardrailSummary}
              className="w-full h-36 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              Approved South African Statutory Corpus (Last Verified: 2026-03-01)
            </h4>
            <div className="space-y-2">
              {VERIFIED_STATUTORY_CITATIONS.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400">{c.code}</span>
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline inline-flex items-center gap-1"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-slate-300">{c.keyClauses}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end items-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
