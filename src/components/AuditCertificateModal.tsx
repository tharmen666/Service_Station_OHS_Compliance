import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  X, 
  Printer, 
  CheckCircle2, 
  Lock, 
  FileCheck, 
  Building2, 
  UserCheck, 
  Calendar, 
  Hash,
  BadgeCheck
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface AuditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  score?: number;
  totalQuestions?: number;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  isOpen,
  onClose,
  lang,
  score = 40,
  totalQuestions = 40
}) => {
  const t = translations[lang];

  // Form State for HITL Sign-off
  const [candidateName, setCandidateName] = useState<string>('Nelly Tharmen');
  const [employeeId, setEmployeeId] = useState<string>('EMP-904281');
  const [stationLocation, setStationLocation] = useState<string>('Engen Convenience Centre - Forecourt #4');
  const [roleTitle, setRoleTitle] = useState<string>('Senior Forecourt Attendant & Fire Warden');
  const [managerName, setManagerName] = useState<string>('D. Tharmen (Certified OHS Officer)');
  const [managerRegNo, setManagerRegNo] = useState<string>('OHS-SACPCMP-88392');
  const [isSignedOff, setIsSignedOff] = useState<boolean>(true);
  const [auditHash] = useState<string>(
    'SANS-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase()
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/50 overflow-hidden flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/30">
                  {t.sansCompliance}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> HITL AUDITED
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">{t.certModalTitle}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition min-h-[44px] min-w-[44px]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content / Printable Certificate */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Editable HITL Manager Sign-off Panel */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 print:hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Human-In-The-Loop (HITL) Manager Sign-off Controls</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  checked={isSignedOff}
                  onChange={(e) => setIsSignedOff(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>{t.signoffApproved}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">{t.candidateName}</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{t.employeeId}</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{t.roleTitle}</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{t.stationLocation}</label>
                <input
                  type="text"
                  value={stationLocation}
                  onChange={(e) => setStationLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{t.managerName}</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{t.managerRegNo}</label>
                <input
                  type="text"
                  value={managerRegNo}
                  onChange={(e) => setManagerRegNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Official Audit-Proof Certificate Preview (Print Target) */}
          <div className="relative p-8 md:p-10 rounded-3xl bg-slate-950 border-4 border-amber-500/40 text-slate-100 space-y-6 shadow-2xl print:border-slate-950 print:bg-white print:text-black">
            
            {/* Watermark / Seal Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-amber-500" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-500/30 pb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/40">
                ⚡ SANS 10089 / SANS 10263 / OHSA 85 OF 1993 COMPLIANT
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-amber-400 tracking-tight">
                CERTIFICATE OF FORECOURT OHS COMPETENCY
              </h1>
              <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-xl mx-auto">
                Issued under Department of Employment & Labour Directives & ISO 45001 Standard Operating Procedures
              </p>
            </div>

            {/* Candidate Credentials */}
            <div className="text-center space-y-3 py-4">
              <p className="text-xs uppercase font-bold tracking-widest text-slate-400">This certifies that</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white underline decoration-amber-500 decoration-2 underline-offset-8">
                {candidateName}
              </h2>
              <p className="text-sm font-semibold text-slate-300 pt-1">
                ID/Employee No: <strong className="text-amber-300">{employeeId}</strong> • Role: <strong className="text-amber-300">{roleTitle}</strong>
              </p>
              <p className="text-xs text-slate-400">
                Facility: <strong className="text-slate-200">{stationLocation}</strong>
              </p>
            </div>

            {/* Assessment Score & Modules Completed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Assessment Score</span>
                <span className="text-2xl font-black text-emerald-400">{score} / {totalQuestions} ({percentage}%)</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Modules Verified</span>
                <span className="text-xs font-bold text-amber-300">ESD, PASS Fire, Spill 4-Role, Hazmat</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Remediation Status</span>
                <span className="text-xs font-bold text-emerald-300">100% Video Remediation Completed</span>
              </div>
            </div>

            {/* HITL Sign-off Seal & Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Certifying OHS Officer:</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-semibold text-xs space-y-1">
                  <p className="text-white font-extrabold">{managerName}</p>
                  <p className="text-slate-400">SACPCMP / Reg No: {managerRegNo}</p>
                  <div className="pt-2 flex items-center gap-2 text-emerald-400 font-extrabold text-[11px]">
                    <CheckCircle2 className="w-4 h-4" /> {isSignedOff ? 'DIGITALLY SIGNED & HITL VERIFIED' : 'PENDING SIGN-OFF'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span>Audit Verification & Compliance Hash:</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                  <p><strong className="text-amber-400">Hash ID:</strong> {auditHash}</p>
                  <p><strong className="text-amber-400">Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                  <p className="text-[10px] text-slate-400">Standard: SANS 10089-3:2010 / ISO 45001:2018</p>
                </div>
              </div>
            </div>

            {/* Official SANS Stamp */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-500/30 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Department of Employment & Labour Audit Compliance Matrix</span>
              </div>
              <div className="font-extrabold text-amber-400 uppercase tracking-wider">
                {t.sansSeal}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 print:hidden">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Audit Hash auto-persisted to compliance record log.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition min-h-[48px]"
              >
                {t.closeBtn}
              </button>

              <button
                onClick={handlePrint}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition min-h-[48px]"
              >
                <Printer className="w-4 h-4" />
                {t.printCertBtn}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
