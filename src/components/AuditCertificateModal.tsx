import React from 'react';
import { Award, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Language } from '../data/translations';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  siteName?: string;
  score?: number;
  totalQuestions?: number;
  certifierRole?: string;
  certificateNumber?: string;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  isOpen,
  onClose,
  lang,
  siteName = "Authorized Retail Service Station",
  score = 100,
  totalQuestions = 100,
  certifierRole = "Appointed OHS Compliance Specialist",
  certificateNumber = "CERT-OHS-2026-V1"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl text-slate-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                SANS 10089 / OHSA 85-1993
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> AUDITED & VERIFIED
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">OHS Compliance Certificate</h2>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 mb-6">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Assessment Score</span>
            <span className="text-2xl font-black text-emerald-400">{score}% Passed</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Scope</span>
            <span className="text-sm font-medium text-slate-200">Forecourt Safety, Fire, Spill & Hazmat</span>
          </div>
        </div>

        {/* White-Label Sign-off Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Site Identification:</span>
            <span className="text-sm font-semibold text-slate-200 block">{siteName}</span>
            <span className="text-xs text-slate-500 mt-1 block">Certificate Ref: {certificateNumber}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Sign-Off Authority:</span>
            <span className="text-sm font-semibold text-emerald-400 block">{certifierRole}</span>
            <span className="text-xs text-emerald-500/90 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Digitally Verified
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <span>Statutory Compliance Matrix • SANS 10089</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Created by</span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-black text-xs">
              Desigan Tharmen
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
