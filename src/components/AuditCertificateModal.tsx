import React, { useMemo } from 'react';
import { Award, CheckCircle2, XCircle, X } from 'lucide-react';
import { Language } from '../data/translations';
import { PASS_MARK, hasPassed, newCertificateId, scorePercent } from '../lib/assessmentRules';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  siteName?: string;
  /** Number of questions answered correctly. */
  score: number;
  /** Total number of questions in the attempt. */
  totalQuestions: number;
  certifierRole?: string;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  isOpen,
  onClose,
  siteName = 'Authorized Retail Service Station',
  score,
  totalQuestions,
  certifierRole = 'Site supervisor sign-off required',
}) => {
  // A new reference is generated each time the modal opens.
  // NOTE: this is not stored anywhere. A real issued certificate needs a server-side record.
  const certificateNumber = useMemo(() => newCertificateId(), [isOpen]);

  if (!isOpen) return null;

  const percent = scorePercent(score, totalQuestions);
  const passed = hasPassed(score, totalQuestions);
  const passMarkPercent = Math.round(PASS_MARK * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          aria-label="Close"
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
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              SANS 10089 / OHSA 85-1993
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">OHS Assessment Record</h2>
          </div>
        </div>

        {/* Result */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 mb-6">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Assessment Score</span>
            <span className={`text-2xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {score} / {totalQuestions} ({percent}%)
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Result</span>
            <span className={`flex items-center gap-2 text-sm font-bold ${passed ? 'text-emerald-300' : 'text-red-300'}`}>
              {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {passed ? `Passed (pass mark ${passMarkPercent}%)` : `Not yet certified (pass mark ${passMarkPercent}%)`}
            </span>
          </div>
        </div>

        {passed ? (
          <>
            {/* Record details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Site:</span>
                <span className="text-sm font-semibold text-slate-200 block">{siteName}</span>
                <span className="text-xs text-slate-500 mt-1 block">Reference: {certificateNumber}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Supervisor sign-off:</span>
                <span className="text-sm text-slate-300 block">{certifierRole}</span>
                <div className="mt-4 border-b border-slate-600 w-full h-6" aria-label="Signature line" />
                <span className="text-xs text-slate-500 mt-1 block">Name / signature / date</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              This record shows the assessment result only. It is not a regulator-issued certificate until a supervisor signs it.
            </p>
          </>
        ) : (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-sm text-red-200">
            {totalQuestions === 0
              ? 'No assessment has been taken yet. Complete the 60-second assessment (module 7) to receive a record.'
              : `You need at least ${passMarkPercent}% to receive this record. Review the topics you missed and try again.`}
          </div>
        )}
      </div>
    </div>
  );
};
