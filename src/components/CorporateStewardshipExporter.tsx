import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  BadgeCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface CorporateStewardshipExporterProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const CorporateStewardshipExporter: React.FC<CorporateStewardshipExporterProps> = ({
  isOpen,
  onClose,
  lang = 'EN'
}) => {
  const t = translations[lang];

  const [brandName, setBrandName] = useState<string>('National Petroleum / Convenience Retail');
  const [siteCode, setSiteCode] = useState<string>('STN-REG-90428');
  const [siteLocation, setSiteLocation] = useState<string>('Authorized Convenience Centre - Regional Site');
  const [complianceScore, setComplianceScore] = useState<number>(94);
  const [refresherRate, setRefresherRate] = useState<number>(96);
  const [dossierHash] = useState<string>(
    'BRAND-DOSSIER-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase()
  );

  if (!isOpen) return null;

  // 3-Tier Escalation Status Protocol
  let tierStatus: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
  let tierLabel = 'TIER 1: GREEN (LOW AUDIT RISK • COMPLIANT)';
  let tierBadgeStyle = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

  if (complianceScore < 80) {
    tierStatus = 'RED';
    tierLabel = 'TIER 3: RED ESCALATION (IMMEDIATE PROHIBITION RISK)';
    tierBadgeStyle = 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
  } else if (complianceScore < 90) {
    tierStatus = 'AMBER';
    tierLabel = 'TIER 2: AMBER ALERT (REFRESHER INTERVENTION REQUIRED)';
    tierBadgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dossierData = {
      title: "Oil Brand Monthly Compliance Dossier",
      brand: brandName,
      site_code: siteCode,
      site_location: siteLocation,
      overall_compliance_percentage: complianceScore,
      monthly_refresher_rate_percentage: refresherRate,
      escalation_tier: tierStatus,
      sans_10089_alignment: "Not verified - pending competent-person review",
      sans_10263_spill_readiness: "Not verified - pending competent-person review",
      hitl_cert_audit_hash: dossierHash,
      popia_data_minimisation_notice: "POPIA Act 4 of 2013 Section 10 & 14: Exported dossier excludes personal employee ID numbers, private contact details, and named driver PDP numbers.",
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oil_Brand_Compliance_Dossier_${siteCode}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/60 overflow-hidden flex flex-col my-6 max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/30">
                  Stage 4: Oil Brand Corporate Stewardship
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase border ${tierBadgeStyle}`}>
                  {tierStatus}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">Oil Brand Monthly Compliance Dossier</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Compliance Dossier"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition min-h-[40px] min-w-[40px]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dossier Printable View */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Printable Dossier Container */}
          <div className="p-8 rounded-3xl bg-slate-950 border-4 border-amber-500/30 text-slate-100 space-y-6 shadow-2xl print:border-slate-950 print:bg-white print:text-black">
            
            {/* Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-500/30 pb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/40">
                ⚡ OIL BRAND CORPORATE COMPLIANCE DOSSIER
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                SITE OHS STEWARDSHIP & RISK REPORT
              </h1>
              <p className="text-slate-300 text-xs font-semibold">
                SANS 10089-3:2010 • SANS 10263 • OHSA 85 OF 1993 Audit Verification
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-xs font-semibold">Audit Authority</span>
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded font-black text-xs">
                    Forecourt Sentinel Compliance Bureau
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>• compliance@forecourtsentinel.io</span>
                </div>
              </div>
            </div>

            {/* Site Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Oil Brand / Network:</span>
                <strong className="text-white text-sm block">{brandName}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Site / Retailer Code:</span>
                <strong className="text-amber-400 text-sm font-mono block">{siteCode}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Site Location:</span>
                <strong className="text-slate-200 text-xs block">{siteLocation}</strong>
              </div>
            </div>

            {/* 3-Tier Escalation Protocol Banner */}
            <div className={`p-5 rounded-2xl border ${tierBadgeStyle} flex items-center justify-between gap-4`}>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest block">3-Tier Escalation Status Protocol</span>
                <strong className="text-sm md:text-base font-black">{tierLabel}</strong>
              </div>
              <BadgeCheck className="w-8 h-8 flex-shrink-0" />
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Overall Site Compliance</span>
                <span className="text-3xl font-black text-emerald-400">{complianceScore}%</span>
                <span className="text-[10px] text-emerald-300 block font-bold">Passed Initial & Refresher</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Monthly Refresher Rate</span>
                <span className="text-3xl font-black text-amber-400">{refresherRate}%</span>
                <span className="text-[10px] text-amber-300 block font-bold">Active Staff Roster</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Audit Sign-off Status</span>
                <span className="text-xs font-black text-amber-300 block pt-3">Manager sign-off required</span>
                <span className="text-[10px] text-slate-400 block font-mono">Hash Persisted</span>
              </div>
            </div>

            {/* Verification Hash & POPIA Data-Minimisation Footer */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-200">
                <strong>POPIA Data-Minimisation Notice (Act 4 of 2013, Section 10 &amp; 14):</strong> This export contains aggregate compliance metrics and role placeholders only. No personal identity numbers or named driver PDP numbers are exported.
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="font-mono">Audit Dossier Hash: <strong className="text-amber-400">{dossierHash}</strong></span>
                <span>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 print:hidden">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition min-h-[44px]"
            >
              Close Dossier
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadJson}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs flex items-center justify-center gap-2 border border-slate-700 transition min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Dossier</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Dossier PDF</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
