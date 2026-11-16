import React, { useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { HQDemoVideoShowcase } from './HQDemoVideoShowcase';
import {
  getGearState,
  subscribeGearChange,
  evaluateGearCompliance,
  GearState,
} from '../gearStore';
import {
  getActiveTenant,
  subscribeTenantChange,
  TenantBrandConfig,
  switchTenantBrand,
  CENTRAL_DEPOT_CONFIG,
  DEPOT_FLEET,
} from '../multiTenantConfig';
import { VERIFIED_STATUTORY_CITATIONS } from '../data/statutoryCitations';
import { assessmentQuestions } from '../data/assessmentData';
import {
  ShieldCheck,
  Activity,
  Clock,
  AlertTriangle,
  Lock,
  Sliders,
  Bot,
  Sparkles,
  Building2,
  ArrowUpRight,
  ChevronRight,
  Flame,
  Award,
  Scale,
  GraduationCap,
  Truck,
  ExternalLink,
  BookCheck,
} from 'lucide-react';

interface ExecutiveBriefingDashboardProps {
  lang: Language;
  onOpenNelly: () => void;
  onOpenGearModal: () => void;
  onNavigateTab: (
    tab:
      | 'training'
      | 'evacuation'
      | 'spill'
      | 'customer'
      | 'fire'
      | 'quiz'
      | 'demo'
      | 'firstResponder'
      | 'refresher'
      | 'rights'
  ) => void;
  onOpenStatutoryModal?: () => void;
}

export const ExecutiveBriefingDashboard: React.FC<ExecutiveBriefingDashboardProps> = ({
  lang,
  onOpenNelly,
  onOpenGearModal,
  onNavigateTab,
  onOpenStatutoryModal,
}) => {
  const t = translations[lang];
  const [gearState, setGearState] = useState<GearState>(getGearState());
  const [activeTenant, setActiveTenant] = useState<TenantBrandConfig>(getActiveTenant());

  useEffect(() => {
    const unsubGear = subscribeGearChange((g) => setGearState(g));
    const unsubTenant = subscribeTenantChange((ten) => setActiveTenant(ten));
    return () => {
      unsubGear();
      unsubTenant();
    };
  }, []);

  const { pillars, thresholds } = gearState;
  const compliance = evaluateGearCompliance(gearState);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0 space-y-8 font-sans">
      {/* 1. Executive Briefing Header & Brand Banner */}
      <div className="pos-card p-6 md:p-8 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/70 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/40">
                {t.headerBadge}
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" /> POPIA Section 19 Safeguards Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeTenant.badgeSymbol}</span>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {activeTenant.brandName} — {t.headerTitle}
                </h2>
                <p className="text-sm text-slate-300 mt-0.5">
                  {activeTenant.stationName} • Site Code:{' '}
                  <code className="text-amber-400 font-mono">{activeTenant.siteCode}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {onOpenStatutoryModal && (
              <button
                onClick={onOpenStatutoryModal}
                aria-label="Generate Statutory Document"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl transition min-h-[48px] flex-1 sm:flex-none border border-emerald-300/40"
              >
                <Scale className="w-4 h-4 text-slate-950" />
                <span>Generate Statutory Doc</span>
              </button>
            )}

            <button
              onClick={onOpenGearModal}
              aria-label="Open G.E.A.R. Calibration Overlay"
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl transition min-h-[48px] flex-1 sm:flex-none"
            >
              <Sliders className="w-4 h-4 text-slate-950" />
              <span>G.E.A.R. Calibration Overlay</span>
            </button>

            <button
              onClick={onOpenNelly}
              aria-label="Open Nelly OHS Guide"
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl transition border border-purple-400/40 min-h-[48px] flex-1 sm:flex-none"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>Nelly AI Guide</span>
            </button>
          </div>
        </div>

        {/* Regional Service Station Network Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="text-white font-extrabold">Active Retail Forecourt:</span>
            <span className="text-slate-300 font-medium">
              5 Regional Stations fed by Central Depot ({CENTRAL_DEPOT_CONFIG.depotId})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'alpha', label: 'Site Alpha', code: 'STN-ALPHA', truck: 'TRK-01' },
              { id: 'bravo', label: 'Site Bravo', code: 'STN-BRAVO', truck: 'TRK-02' },
              { id: 'charlie', label: 'Site Charlie', code: 'STN-CHARLIE', truck: 'TRK-03' },
              { id: 'delta', label: 'Site Delta', code: 'STN-DELTA', truck: 'TRK-04' },
              { id: 'echo', label: 'Site Echo', code: 'STN-ECHO', truck: 'TRK-05' },
            ].map((station) => (
              <button
                key={station.id}
                onClick={() => switchTenantBrand(station.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition border min-h-[36px] flex items-center gap-1.5 ${
                  activeTenant.siteCode === station.code
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-200 border-slate-800 hover:bg-slate-800'
                }`}
                title={`Switch active view to ${station.label} (${station.code}) — Fed by ${station.truck}`}
              >
                <span>{station.label}</span>
                <span className="text-[11px] opacity-80 font-mono">({station.code})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Real-Time G.E.A.R. Pillar System Meters Grid */}
      <section className="space-y-4" data-testid="dashboard-gear-section">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Core G.E.A.R. Pillar System Meters &amp; Site Health
          </h2>
          <button
            onClick={onOpenGearModal}
            className="text-xs font-extrabold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Recalibrate Thresholds <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Governance */}
          <div
            data-testid="gear-card-governance"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Governance &amp; POPIA
              </span>
              <span
                data-testid="gear-score-governance"
                className="font-mono text-base font-black text-cyan-400"
              >
                {pillars.governance}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.governance}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span data-testid="gear-target-governance">
                Target: {thresholds.governanceThreshold}%
              </span>
              <span
                data-testid="gear-status-governance"
                className={`font-bold ${
                  compliance.governanceCompliant ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {compliance.governanceCompliant ? '✓ Compliant' : '✗ Not compliant'}
              </span>
            </div>
          </div>

          {/* Pillar 2: Ergonomic */}
          <div
            data-testid="gear-card-ergonomic"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Ergonomic &amp; Fatigue
              </span>
              <span
                data-testid="gear-score-ergonomic"
                className="font-mono text-base font-black text-emerald-400"
              >
                {pillars.ergonomic}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.ergonomic}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Shift Cutoff: {thresholds.fatigueMaxShiftHours}h</span>
              <span
                data-testid="gear-status-ergonomic"
                className={`font-bold ${
                  compliance.ergonomicCompliant ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {compliance.ergonomicCompliant ? '✓ Compliant' : '✗ Not compliant'}
              </span>
            </div>
          </div>

          {/* Pillar 3: Audit Readiness */}
          <div
            data-testid="gear-card-audit"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Audit &amp; SLA Readiness
              </span>
              <span
                data-testid="gear-score-audit"
                className="font-mono text-base font-black text-purple-400"
              >
                {pillars.auditReadiness}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.auditReadiness}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Target Resolution: {thresholds.slaEscalationMaxHours}h</span>
              <span
                data-testid="gear-status-audit"
                className={`font-bold ${
                  compliance.auditCompliant ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {compliance.auditCompliant ? '✓ Compliant' : '✗ Not compliant'}
              </span>
            </div>
          </div>

          {/* Pillar 4: Risk Reduction */}
          <div
            data-testid="gear-card-risk"
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Risk &amp; Hazard Mitigation
              </span>
              <span
                data-testid="gear-score-risk"
                className="font-mono text-base font-black text-amber-400"
              >
                {pillars.riskReduction}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.riskReduction}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Risk Target: {thresholds.hazardMitigationCutoff}%</span>
              <span
                data-testid="gear-status-risk"
                className={`font-bold ${
                  compliance.riskCompliant ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {compliance.riskCompliant ? '✓ Compliant' : '✗ Not compliant'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Fleet & Depot Topology (Anonymized Driver Placeholders per POPIA Condition 3) */}
      <section className="p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-1 border border-cyan-500/40">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              Fleet &amp; Central Depot Supply Network (Anonymized Role Placeholders)
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>{CENTRAL_DEPOT_CONFIG.depotName}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-amber-400">
                {CENTRAL_DEPOT_CONFIG.depotId}
              </span>
            </h3>
            <p className="text-slate-300 text-xs mt-0.5">
              Operating 6 Heavy Tanker Trucks (32,000L loads). Driver identities and PDP numbers use anonymized placeholders in compliance with POPIA Section 10 (Minimality).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
              Daily Throughput:{' '}
              <strong className="text-cyan-300">
                {CENTRAL_DEPOT_CONFIG.totalDailyThroughputLitres.toLocaleString()} L
              </strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {DEPOT_FLEET.map((truck) => {
            const isAssignedToActiveStation = truck.assignedStationId === activeTenant.siteCode;
            return (
              <div
                key={truck.truckId}
                className={`p-3.5 rounded-2xl border transition flex flex-col justify-between space-y-2 ${
                  isAssignedToActiveStation
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-lg ring-1 ring-cyan-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Truck
                      className={`w-4 h-4 ${
                        isAssignedToActiveStation ? 'text-cyan-400' : 'text-slate-300'
                      }`}
                    />
                    <span className="font-mono font-black text-white text-xs">{truck.truckId}</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-800 text-slate-200">
                    {truck.registrationNumber}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-extrabold text-amber-400 truncate">
                    {truck.assignedStationName}
                  </div>
                  <div className="text-xs font-mono text-cyan-300 mt-0.5">32,000 L Full Load</div>
                  <div className="text-xs text-slate-300 truncate mt-0.5">{truck.driverName}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span
                    className={`font-mono font-bold ${
                      truck.dailyStatus === 'RECONCILED'
                        ? 'text-emerald-400'
                        : truck.dailyStatus === 'OFFLOADING'
                        ? 'text-amber-400'
                        : truck.dailyStatus === 'IN_TRANSIT'
                        ? 'text-cyan-300'
                        : 'text-purple-300'
                    }`}
                  >
                    ● {truck.dailyStatus}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {truck.scheduledDepartureTime}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Walkthrough Showcase */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            60-Second Interactive System Walkthrough
          </h2>
          <span className="text-xs text-slate-300 font-mono">Guide: Nelly</span>
        </div>
        <HQDemoVideoShowcase
          lang={lang}
          onOpenNelly={onOpenNelly}
          onOpenGearModal={onOpenGearModal}
        />
      </section>

      {/* 5. Live Baseline Risk Assessment Matrix & SLA Action Plan */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Dynamic Baseline Risk Matrix &amp; SLA Escalation Action Plan
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Live hazard quantification mapped to supervisor role owners
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono border border-amber-500/40">
            Active SLA Timers Running
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-400 uppercase">
                Forecourt Pump 3 Fuel Release
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-xs font-black border border-red-500/40">
                CRITICAL (24/25)
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Spill team assigned. Drain protection shutoff verified.
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300 font-mono">
              <span>Role: Shift Supervisor A</span>
              <span className="text-red-400 font-bold">SLA: 01h 15m remaining</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase">
                Food Prep Deep Fryer Probe
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                HIGH (18/25)
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              R638 thermal calibration check required on fryer thermostat.
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300 font-mono">
              <span>Role: Food Safety Supervisor B</span>
              <span className="text-amber-400 font-bold">SLA: 03h 40m remaining</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase">
                ESD Intercom Battery Test
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                MEDIUM (10/25)
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Nightshift cashier intercom backup power operational.
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300 font-mono">
              <span>Role: Nightshift Supervisor C</span>
              <span className="text-emerald-400 font-bold">SLA: Resolved ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Verified South African Statutory Citations Registry */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <BookCheck className="w-5 h-5 text-cyan-400" />
              Verified South African Statutory Citations &amp; Official Sources
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              All regulatory citations verified against current South African legislation
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
            Last Verified: 2026-03-01
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VERIFIED_STATUTORY_CITATIONS.map((cit) => (
            <div
              key={cit.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-amber-400">{cit.code}</span>
                  <span className="text-slate-300 font-mono">Verified: {cit.lastVerified}</span>
                </div>
                <div className="font-bold text-white">{cit.title}</div>
                <p className="text-slate-300 leading-relaxed">{cit.keyClauses}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">{cit.jurisdiction}</span>
                <a
                  href={cit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:underline font-bold inline-flex items-center gap-1"
                >
                  Official Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Navigation Hub to Detailed Modules */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          Interactive Forecourt &amp; Safety Module Suite
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => onNavigateTab('training')}
            className="p-5 rounded-2xl bg-slate-900 border border-amber-500/50 hover:border-amber-400 hover:bg-slate-800 transition text-left space-y-2 group shadow-lg min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <GraduationCap className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Statutory OHS Training</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                First Aid, Firefighting, HIRA &amp; SHE Rep
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('evacuation')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/60 hover:bg-slate-800 transition text-left space-y-2 group shadow-lg min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <Flame className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{t.tabEvacuation}</h3>
              <p className="text-xs text-slate-300 mt-0.5">SANS 10089-3 Emergency Protocol</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('spill')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800 transition text-left space-y-2 group shadow-lg min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{t.tabSpill}</h3>
              <p className="text-xs text-slate-300 mt-0.5">SANS 10263 4-Role Teamwork</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('firstResponder')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-800 transition text-left space-y-2 group shadow-lg min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Activity className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-rose-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{t.tabFirstResponder}</h3>
              <p className="text-xs text-slate-300 mt-0.5">Emergency Medical Triage Protocol</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('quiz')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-800 transition text-left space-y-2 group shadow-lg min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Award className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                60s Assessment ({assessmentQuestions.length} Qs)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {assessmentQuestions.length} Questions &amp; Video Remediation
              </p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
