import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, ShieldCheck, ShieldAlert, X, Lock, UserCheck } from 'lucide-react';
import { Language } from '../data/translations';
import {
  PASS_MARK,
  IssuedCertificateRecord,
  issueAndStoreCertificate,
  markCertificateVerified,
  getLatestQuizAttempt,
  getIssuedCertificates,
} from '../lib/certificateStore';
import { assessmentQuestions } from '../data/assessmentData';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  siteName?: string;
  score?: number;
  totalQuestions?: number;
  answeredCount?: number;
  moduleName?: string;
  certifierRole?: string;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  isOpen,
  onClose,
  siteName = 'Authorized Retail Service Station',
  score,
  totalQuestions,
  answeredCount,
  moduleName,
  certifierRole = 'Appointed Section 16(2) OHS Supervisor',
}) => {
  const latestAttempt = getLatestQuizAttempt();
  const actualScore = typeof score === 'number' ? score : latestAttempt.score;
  const actualTotal =
    typeof totalQuestions === 'number' && totalQuestions > 0
      ? totalQuestions
      : latestAttempt.totalQuestions || assessmentQuestions.length;
  const actualAnswered =
    typeof answeredCount === 'number' ? answeredCount : latestAttempt.answeredCount;
  const actualModule =
    moduleName || latestAttempt.moduleName || 'Forecourt Safety, Fire, Spill & Hazmat';

  // Compute percentage from the actual question count (or answered count if more questions were answered)
  const denominator = Math.max(actualTotal, actualAnswered, 1);
  const percentage = Math.round((actualScore / denominator) * 100);
  const isPassed = percentage >= PASS_MARK && actualScore > 0;

  const [candidateName, setCandidateName] = useState<string>('Forecourt Attendant A');
  const [issuedCert, setIssuedCert] = useState<IssuedCertificateRecord | null>(null);
  const [supervisorName, setSupervisorName] = useState<string>('');
  const [supervisorReg, setSupervisorReg] = useState<string>('');
  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string>('');
  const [allCerts, setAllCerts] = useState<IssuedCertificateRecord[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setVerificationError('');
    setConfirmCheck(false);
    setAllCerts(getIssuedCertificates());

    if (isPassed) {
      const record = issueAndStoreCertificate({
        candidateName,
        moduleName: actualModule,
        score: actualScore,
        totalQuestions: denominator,
        answeredCount: actualAnswered,
        siteName,
      });
      setIssuedCert(record);
      setAllCerts(getIssuedCertificates());
    } else {
      setIssuedCert(null);
    }
  }, [isOpen, actualScore, denominator, isPassed]);

  if (!isOpen) return null;

  const handleReissueForCandidate = () => {
    if (!isPassed) return;
    const record = issueAndStoreCertificate({
      candidateName,
      moduleName: actualModule,
      score: actualScore,
      totalQuestions: denominator,
      answeredCount: actualAnswered,
      siteName,
    });
    setIssuedCert(record);
    setAllCerts(getIssuedCertificates());
  };

  const handleVerifySignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuedCert) return;
    if (!supervisorName.trim() || !supervisorReg.trim() || !confirmCheck) {
      setVerificationError(
        'Supervisor name, registration/appointment reference, and confirmation check are required to verify.'
      );
      return;
    }
    const updated = markCertificateVerified(
      issuedCert.certificateId,
      supervisorName,
      supervisorReg
    );
    if (updated) {
      setIssuedCert(updated);
      setAllCerts(getIssuedCertificates());
      setVerificationError('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-heading"
    >
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl text-slate-100 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close Certificate Modal"
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPassed ? (
          /* GATED STATE: Below Pass Mark -> Show clear notice and NO certificate */
          <div className="space-y-5 py-2" data-testid="cert-gated-notice">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                  ASSESSMENT THRESHOLD NOT MET
                </span>
                <h2 id="cert-modal-heading" className="text-xl font-bold text-slate-100 mt-1">
                  Not yet certified: score {actualScore}/{denominator}, pass mark {PASS_MARK}%
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-red-500/30 space-y-2 text-sm text-slate-200">
              <p>
                Current Score: <strong>{actualScore} / {denominator} ({percentage}%)</strong> • Answered: <strong>{actualAnswered} of {denominator}</strong>
              </p>
              <p className="text-slate-300">
                A minimum score of <strong>{PASS_MARK}%</strong> ({Math.ceil((PASS_MARK / 100) * denominator)}/{denominator} correct answers) is required before an OHS Compliance Certificate can be issued.
              </p>
              <p className="text-xs text-amber-300">
                Note: Pass mark is configured at {PASS_MARK}% (PASS_MARK constant) subject to client training policy confirmation.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
              >
                Return to Assessment
              </button>
            </div>
          </div>
        ) : (
          /* PASSED STATE: >= PASS_MARK (80%) -> Issue unique certificate */
          <div className="space-y-6" data-testid="cert-issued-view">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    SANS 10089 / OHSA 85-1993
                  </span>
                  {issuedCert?.verifiedBySupervisor ? (
                    <span
                      data-testid="badge-audited-verified"
                      className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1 border border-emerald-500/30"
                    >
                      <CheckCircle2 className="w-3 h-3" /> AUDITED &amp; VERIFIED
                    </span>
                  ) : (
                    <span
                      data-testid="badge-pending-verification"
                      className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold flex items-center gap-1 border border-slate-700"
                    >
                      <Lock className="w-3 h-3 text-amber-400" /> PENDING SUPERVISOR VERIFICATION
                    </span>
                  )}
                </div>
                <h2 id="cert-modal-heading" className="text-xl font-bold text-slate-100 mt-1">
                  OHS Compliance Certificate
                </h2>
              </div>
            </div>

            {/* Candidate Input */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label htmlFor="cert-candidate-input" className="text-xs text-slate-300 font-bold block mb-1">
                  Candidate Name (Role / Placeholder per POPIA Minimality):
                </label>
                <input
                  id="cert-candidate-input"
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={handleReissueForCandidate}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
              >
                Issue New Unique ID
              </button>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-300 uppercase tracking-wider block">Assessment Score</span>
                <span className="text-2xl font-black text-emerald-400" data-testid="cert-score-summary">
                  {actualScore} / {denominator} ({percentage}% Passed)
                </span>
                <span className="text-xs text-slate-300 block mt-0.5">
                  Pass Mark: {PASS_MARK}% • Candidate: {issuedCert?.candidateName}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-300 uppercase tracking-wider block">Module &amp; Timestamp</span>
                <span className="text-sm font-medium text-slate-200 block">{issuedCert?.moduleName}</span>
                <span className="text-xs text-slate-300 font-mono block mt-1">
                  Issued: {issuedCert?.issueDate} ({issuedCert?.timestamp})
                </span>
              </div>
            </div>

            {/* White-Label Sign-off Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 block mb-1">Site Identification:</span>
                <span className="text-sm font-semibold text-slate-200 block">{siteName}</span>
                <span
                  className="text-xs text-amber-400 font-mono mt-1 block font-bold"
                  data-testid="cert-unique-id"
                >
                  Certificate Ref: {issuedCert?.certificateId}
                </span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 block mb-1">Sign-Off Authority:</span>
                <span className="text-sm font-semibold text-emerald-400 block">
                  {issuedCert?.verifiedBySupervisor
                    ? `${issuedCert.supervisorName} (${issuedCert.supervisorRegNo})`
                    : certifierRole}
                </span>
                {issuedCert?.verifiedBySupervisor ? (
                  <span
                    data-testid="badge-digitally-verified"
                    className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-bold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Digitally Verified ({issuedCert.verifiedAt})
                  </span>
                ) : (
                  <span className="text-xs text-amber-300 flex items-center gap-1 mt-1">
                    Awaiting supervisor HITL sign-off below
                  </span>
                )}
              </div>
            </div>

            {/* Real Supervisor Verification Step */}
            {!issuedCert?.verifiedBySupervisor && (
              <form
                onSubmit={handleVerifySignOff}
                className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase">
                  <UserCheck className="w-4 h-4" />
                  <span>Supervisor Human-in-the-Loop (HITL) Verification Step</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Supervisor Name (e.g. Appointed 16.2 Officer)"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    aria-label="Supervisor Name"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Appointment / Registration Ref (e.g. 16.2-REF-01)"
                    value={supervisorReg}
                    onChange={(e) => setSupervisorReg(e.target.value)}
                    aria-label="Supervisor Registration Reference"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmCheck}
                    onChange={(e) => setConfirmCheck(e.target.checked)}
                  />
                  <span>
                    I confirm that {issuedCert?.candidateName} achieved {actualScore}/{denominator} ({percentage}%) and demonstrated practical competency.
                  </span>
                </label>
                {verificationError && (
                  <p className="text-xs text-red-400 font-semibold" role="alert">
                    {verificationError}
                  </p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  Complete Supervisor Verification
                </button>
              </form>
            )}

            {/* Stored Certificates Log Preview */}
            {allCerts.length > 0 && (
              <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  Persisted Certificate Registry ({allCerts.length} issued):
                </span>
                <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[11px]">
                  {allCerts.slice(0, 5).map((c) => (
                    <div key={c.certificateId} className="flex justify-between gap-2">
                      <span className="text-amber-300">{c.certificateId}</span>
                      <span>{c.candidateName}</span>
                      <span>
                        {c.score}/{c.totalQuestions} ({c.percentage}%)
                      </span>
                      <span>{c.issueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-300 gap-2">
              <span>Statutory Compliance Matrix • SANS 10089</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold text-xs">
                Forecourt Sentinel Compliance Record
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
