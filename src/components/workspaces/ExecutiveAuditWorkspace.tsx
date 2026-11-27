import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  AlertOctagon,
  Award,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  Scale,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { Language } from '../../data/translations';
import { ExecutiveBriefingDashboard } from '../ExecutiveBriefingDashboard';
import {
  FUEL_BRAND_PRESETS,
  REGIONAL_STATIONS,
  getActiveTenant,
  subscribeTenantChange,
  switchTenantBrand,
  setCustomDealerBranding,
  TenantBrandConfig,
} from '../../multiTenantConfig';
import {
  getNcrs,
  updateNcrStatus,
  subscribeNcrChange,
  NonConformanceReport,
} from '../../lib/ncrStore';
import { getIssuedCertificates, IssuedCertificateRecord } from '../../lib/certificateStore';
import { hashAuditSignature } from '../../popiActCompliance';

export type ExecutiveAuditSubTab = 'overview' | 'ncrTracker' | 'certificates';

interface ExecutiveAuditWorkspaceProps {
  lang: Language;
  activeSubTab: ExecutiveAuditSubTab;
  onSubTabChange: (sub: ExecutiveAuditSubTab) => void;
  onOpenNelly: () => void;
  onOpenGearModal: () => void;
  onNavigateTarget: (target: string) => void;
  onOpenStatutoryModal: () => void;
  onOpenCertModal: () => void;
  onOpenDossier: () => void;
  onLaunch3DTour?: () => void;
}

export const ExecutiveAuditWorkspace: React.FC<ExecutiveAuditWorkspaceProps> = ({
  lang,
  activeSubTab,
  onSubTabChange,
  onOpenNelly,
  onOpenGearModal,
  onNavigateTarget,
  onOpenStatutoryModal,
  onOpenCertModal,
  onOpenDossier,
  onLaunch3DTour,
}) => {
  const [activeTenant, setActiveTenant] = useState<TenantBrandConfig>(getActiveTenant());
  const [ncrs, setNcrs] = useState<NonConformanceReport[]>(() => getNcrs());
  const [certs, setCerts] = useState<IssuedCertificateRecord[]>(() => getIssuedCertificates());
  const [customDealerName, setCustomDealerName] = useState<string>('');
  const [customSiteCode, setCustomSiteCode] = useState<string>('');
  const [customPlatform, setCustomPlatform] = useState<'ErgoSafe' | 'LogiGuard'>('ErgoSafe');
  const [ncrFilter, setNcrFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [closingNcrUser, setClosingNcrUser] = useState<string>('Section 16.2 OHS Manager');

  useEffect(() => {
    const u1 = subscribeTenantChange((t) => setActiveTenant(t));
    const u2 = subscribeNcrChange((list) => setNcrs(list));
    return () => {
      u1();
      u2();
    };
  }, []);

  useEffect(() => {
    if (activeSubTab === 'certificates') {
      setCerts(getIssuedCertificates());
    }
    if (activeSubTab === 'ncrTracker') {
      setNcrs(getNcrs());
    }
  }, [activeSubTab]);

  const openNcrCount = ncrs.filter((n) => n.status !== 'CLOSED').length;
  const filteredNcrs = ncrs.filter((n) => {
    if (ncrFilter === 'OPEN') return n.status !== 'CLOSED';
    if (ncrFilter === 'CLOSED') return n.status === 'CLOSED';
    return true;
  });

  const handleCloseNcr = async (ncr: NonConformanceReport) => {
    const ts = new Date().toISOString();
    let sig = `NCR-CLOSE-${ncr.id}`;
    try {
      sig = await hashAuditSignature(`${ncr.id}|${closingNcrUser}|${ts}`);
    } catch {
      // ignore
    }
    updateNcrStatus(ncr.id, 'CLOSED', {
      resolvedBy: closingNcrUser.trim() || 'OHS Manager',
      closureNotes: 'Verified and closed under Section 16.2 governance',
      sha256Signature: sig,
    });
  };

  return (
    <div className="space-y-6" data-testid="pillar-workspace-executive-audit">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview' as const, label: 'Multi-Site Roll-Up & Briefing', icon: LayoutDashboard },
            { id: 'ncrTracker' as const, label: `Automated NCRs (${openNcrCount} Open)`, icon: AlertOctagon },
            { id: 'certificates' as const, label: 'SHA-256 Certificates & Dossiers', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`exec-subtab-${tab.id}`}
                onClick={() => onSubTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  activeSubTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onLaunch3DTour && (
            <button
              type="button"
              data-testid="exec-header-3d-tour-btn"
              onClick={onLaunch3DTour}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Full Executive Demo Tour</span>
            </button>
          )}
          <span className="text-xs font-mono text-amber-300 px-2">
            Pillar 4 • Executive Audit &amp; NCRs ({activeTenant.siteCode})
          </span>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Global & Pan-African Statutory OHS & Food Safety File Download Card */}
          <div
            data-testid="global-ohs-pdf-card"
            className="p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeTenant.platformBrand || 'ErgoSafe'} Master Compliance Dossier</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                Download Site-Generic Global OHS &amp; Food Safety File (PDF)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ISO 45001 • HACCP • SA OHS Act 85 of 1993 • Kenya OSHA 2007 &amp; EPRA • Pan-African Forecourt &amp; QSR Master Dossier
              </p>
            </div>

            <a
              href="/docs/site_generic_service_station_ohs_file.pdf"
              download="site_generic_service_station_ohs_file.pdf"
              data-testid="download-global-ohs-pdf-btn"
              className="w-full md:w-auto min-h-[44px] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition flex-shrink-0 text-center"
            >
              <FileDown className="w-4 h-4 flex-shrink-0" />
              <span>Download Site-Generic Global OHS &amp; Food Safety File (PDF)</span>
            </a>
          </div>

          {/* White-Label Fuel Brand & Dealer Switcher */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  White-Label Tenant &amp; Fuel Brand Architecture (ErgoSafe / LogiGuard)
                </h3>
                <p className="text-xs text-slate-300">
                  Instant brand &amp; POS profile switching for BP, Shell, Engen, Astron Energy (NAMOS + FreshStop Symphony), TotalEnergies (ISIS), and Custom Dealers.
                </p>
              </div>
              {activeTenant.dualPosSetup && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                  Dual-BOS: {activeTenant.dualPosSetup.forecourtVendor} + {activeTenant.dualPosSetup.shopVendor} ({activeTenant.dualPosSetup.shopBrandLabel})
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {FUEL_BRAND_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  data-testid={`brand-preset-${preset.key}`}
                  onClick={() => switchTenantBrand(preset.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition ${
                    activeTenant.fuelBrand === preset.label ||
                    (preset.key === 'alpha' && activeTenant.siteCode === 'STN-ALPHA') ||
                    (preset.key === 'astron' && activeTenant.fuelBrand === 'Astron Energy')
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {preset.label} • <span className="opacity-75 font-mono">{preset.posSummary}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
              <select
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value as 'ErgoSafe' | 'LogiGuard')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
              >
                <option value="ErgoSafe">ErgoSafe</option>
                <option value="LogiGuard">LogiGuard</option>
              </select>
              <input
                type="text"
                placeholder="Custom Dealer Brand Name"
                value={customDealerName}
                onChange={(e) => setCustomDealerName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Site Code (e.g. DLR-09)"
                value={customSiteCode}
                onChange={(e) => setCustomSiteCode(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono w-36"
              />
              <button
                type="button"
                onClick={() => setCustomDealerBranding(customDealerName, customSiteCode, customPlatform)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black"
              >
                Apply Custom Dealer
              </button>
            </div>
          </div>

          {/* Multi-Site Roll-Up Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-white">Multi-Site Compliance &amp; NCR Roll-Up</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                    <th className="py-2 px-3">Site Code</th>
                    <th className="py-2 px-3">Station Name</th>
                    <th className="py-2 px-3">Assigned Tanker</th>
                    <th className="py-2 px-3 text-right">Daily Volume</th>
                    <th className="py-2 px-3 text-center">OHS / SANS Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {REGIONAL_STATIONS.map((st) => (
                    <tr key={st.siteCode} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-mono font-bold text-amber-300">{st.siteCode}</td>
                      <td className="py-2 px-3 text-white">{st.stationName}</td>
                      <td className="py-2 px-3 font-mono text-cyan-300">{st.assignedTruckId}</td>
                      <td className="py-2 px-3 text-right font-mono">{st.dailyDeliveryVolumeLitres.toLocaleString()} L</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                          SANS 10089 ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ExecutiveBriefingDashboard
            lang={lang}
            onOpenNelly={onOpenNelly}
            onOpenGearModal={onOpenGearModal}
            onNavigateTab={(t) => onNavigateTarget(t)}
            onOpenStatutoryModal={onOpenStatutoryModal}
          />
        </div>
      )}

      {activeSubTab === 'ncrTracker' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/40 space-y-4 shadow-xl" data-testid="executive-ncr-ledger">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                Automated Non-Conformance Reports (NCR) Ledger
              </h3>
              <p className="text-xs text-slate-300">
                Automatically populated from Wetstock SIR leaks, Nozzle drift, Water ingress, BOL shortages, Cash-Up variances, and R638 cold-chain breaches.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {(['ALL', 'OPEN', 'CLOSED'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setNcrFilter(f)}
                  className={`px-3 py-1.5 rounded-xl font-black ${
                    ncrFilter === f ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-300 font-bold">Closing Authority:</label>
            <input
              type="text"
              value={closingNcrUser}
              onChange={(e) => setClosingNcrUser(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="space-y-3">
            {filteredNcrs.map((ncr) => (
              <div
                key={ncr.id}
                data-testid="ncr-ledger-row"
                className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  ncr.status === 'CLOSED'
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : ncr.severity === 'CRITICAL'
                      ? 'bg-rose-950/30 border-rose-500/60'
                      : 'bg-amber-950/30 border-amber-500/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-300">{ncr.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[10px]">
                      {ncr.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px]">
                      {ncr.siteCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        ncr.status === 'CLOSED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {ncr.status}
                    </span>
                    {ncr.status !== 'CLOSED' && (
                      <button
                        type="button"
                        onClick={() => handleCloseNcr(ncr)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px]"
                      >
                        Close NCR (SHA-256)
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm font-black text-white">{ncr.title}</div>
                <p className="text-slate-300">{ncr.description}</p>
                <div className="text-[11px] font-mono text-slate-400 flex flex-wrap gap-4">
                  <span>Measured: <strong className="text-white">{ncr.measuredValue}</strong></span>
                  <span>Threshold: {ncr.thresholdValue}</span>
                  <span>Statute: {ncr.statutoryReference}</span>
                  {ncr.sha256Signature && (
                    <span className="text-emerald-400">SHA-256: {ncr.sha256Signature.slice(0, 14)}...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'certificates' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                SHA-256 Audit Certificates &amp; Statutory Dossiers
              </h3>
              <p className="text-xs text-slate-300">
                Basic Forecourt Safety &amp; OHS Awareness Training certificates (OHS Act 85 of 1993 Sec 8(2)(e) / Sec 13) and corporate audit dossiers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenCertModal}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Open Audit Certificate Modal</span>
              </button>
              <button
                type="button"
                onClick={onOpenStatutoryModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5"
              >
                <Scale className="w-4 h-4" />
                <span>Generate Statutory Doc</span>
              </button>
              <button
                type="button"
                onClick={onOpenDossier}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Corporate Stewardship Dossier</span>
              </button>
            </div>
          </div>

          {certs.length === 0 ? (
            <p className="text-xs text-slate-400">
              No completion certificates issued in this browser yet. Complete ≥90% video training + timed statutory quiz (≥80%) in Pillar 3 to issue a SHA-256 verified certificate.
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              {certs.map((c) => (
                <div
                  key={c.certificateId}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-mono font-black text-amber-300">{c.certificateId}</span>
                    <span className="mx-2 text-slate-500">•</span>
                    <span className="font-bold text-white">{c.candidateName}</span>
                    <span className="mx-2 text-slate-500">•</span>
                    <span className="text-slate-300">{c.moduleName}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>{c.score}/{c.totalQuestions} ({c.percentage}%)</span>
                    {c.verifiedBySupervisor && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

