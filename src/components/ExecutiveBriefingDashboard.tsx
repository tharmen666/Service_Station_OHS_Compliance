import React, { useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { HQDemoVideoShowcase } from './HQDemoVideoShowcase';
import { 
  getGearState, 
  subscribeGearChange, 
  GearState 
} from '../gearStore';
import { 
  getActiveTenant, 
  subscribeTenantChange, 
  TenantBrandConfig, 
  switchTenantBrand 
} from '../multiTenantConfig';
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
  CheckCircle2, 
  FileText, 
  Thermometer, 
  ArrowUpRight,
  ChevronRight,
  Flame,
  Award,
  Scale
} from 'lucide-react';


interface ExecutiveBriefingDashboardProps {
  lang: Language;
  onOpenNelly: () => void;
  onOpenGearModal: () => void;
  onNavigateTab: (tab: 'evacuation' | 'spill' | 'customer' | 'fire' | 'quiz' | 'curriculum' | 'demo' | 'firstResponder' | 'refresher' | 'rights') => void;
  onOpenStatutoryModal?: () => void;
}

export const ExecutiveBriefingDashboard: React.FC<ExecutiveBriefingDashboardProps> = ({
  lang,
  onOpenNelly,
  onOpenGearModal,
  onNavigateTab,
  onOpenStatutoryModal
}) => {
  const t = translations[lang];
  const [gearState, setGearState] = useState<GearState>(getGearState());
  const [activeTenant, setActiveTenant] = useState<TenantBrandConfig>(getActiveTenant());

  useEffect(() => {
    const unsubGear = subscribeGearChange((g) => setGearState(g));
    const unsubTenant = subscribeTenantChange((t) => setActiveTenant(t));
    return () => {
      unsubGear();
      unsubTenant();
    };
  }, []);

  const { pillars, thresholds, overallHealthScore } = gearState;

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0 space-y-8 font-sans">
      
      {/* 1. Executive Briefing Header & Brand Banner */}
      <div className="pos-card p-6 md:p-8 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/70 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/40">
                Executive Compliance Briefing
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" /> POPIA AES-256 Ledger Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeTenant.badgeSymbol}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {activeTenant.brandName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {activeTenant.stationName} • Site Code: <code className="text-amber-400 font-mono">{activeTenant.siteCode}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {onOpenStatutoryModal && (
              <button
                onClick={onOpenStatutoryModal}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition transform hover:-translate-y-0.5 min-h-[48px] flex-1 sm:flex-none border border-emerald-300/40"
              >
                <Scale className="w-4 h-4 text-slate-950" />
                <span>Generate Statutory Doc</span>
              </button>
            )}

            <button
              onClick={onOpenGearModal}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition transform hover:-translate-y-0.5 min-h-[48px] flex-1 sm:flex-none"
            >
              <Sliders className="w-4 h-4 text-slate-950" />
              <span>G.E.A.R. Calibration Overlay</span>
            </button>

            <button
              onClick={onOpenNelly}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-950/50 transition border border-purple-400/40 transform hover:-translate-y-0.5 min-h-[48px] flex-1 sm:flex-none"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>Nelly AI Guide</span>
            </button>
          </div>
        </div>


        {/* Brand Theme Quick Selector */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            Multi-Tenant Brand Switcher:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {(['standard', 'express', 'highway', 'urban'] as const).map((brandKey) => (
              <button
                key={brandKey}
                onClick={() => switchTenantBrand(brandKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition border min-h-[36px] ${
                  activeTenant.fuelBrand.toLowerCase() === brandKey
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {brandKey} Profile
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. 60-Second HQ Interactive Demo Video Showcase Component */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            60-Second HQ Interactive Demo Video & System Showcase
          </h2>
          <span className="text-xs text-slate-400 font-mono">Avatar Guide: Nelly</span>
        </div>
        <HQDemoVideoShowcase 
          lang={lang} 
          onOpenNelly={onOpenNelly} 
          onOpenGearModal={onOpenGearModal} 
        />
      </section>

      {/* 3. Real-Time G.E.A.R. Pillar System Meters Grid (Responsive: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Core G.E.A.R. Pillar System Meters & Site Health
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
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Governance & POPIA
              </span>
              <span className="font-mono text-base font-black text-cyan-400">{pillars.governance}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.governance}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Target: {thresholds.governanceThreshold}%</span>
              <span className="text-emerald-400 font-bold">✓ Compliant</span>
            </div>
          </div>

          {/* Pillar 2: Ergonomic */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Ergonomic & Fatigue
              </span>
              <span className="font-mono text-base font-black text-emerald-400">{pillars.ergonomic}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.ergonomic}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Shift Cutoff: {thresholds.fatigueMaxShiftHours}h</span>
              <span className="text-emerald-400 font-bold">✓ Rested</span>
            </div>
          </div>

          {/* Pillar 3: Audit Readiness */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Audit & SLA Readiness
              </span>
              <span className="font-mono text-base font-black text-purple-400">{pillars.auditReadiness}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.auditReadiness}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Target Resolution: {thresholds.slaEscalationMaxHours}h</span>
              <span className="text-emerald-400 font-bold">✓ Audit-Proof</span>
            </div>
          </div>

          {/* Pillar 4: Risk Reduction */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Risk & Hazard Mitigation
              </span>
              <span className="font-mono text-base font-black text-amber-400">{pillars.riskReduction}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${pillars.riskReduction}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Risk Target: {thresholds.hazardMitigationCutoff}%</span>
              <span className="text-emerald-400 font-bold">✓ Low Risk</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Live Baseline Risk Assessment Matrix & SLA Action Plan */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Dynamic Baseline Risk Matrix & SLA Escalation Action Plan
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live hazard quantification mapped strictly to mandatory supervisor resolution targets
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono border border-amber-500/40">
            Active SLA Timers Running
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-400 uppercase">Forecourt Pump 3 Fuel Release</span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-black border border-red-500/40">
                CRITICAL (Score: 24/25)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Spill team assigned. Drain protection shutoff verified.</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Supervisor: J. Naidoo</span>
              <span className="text-red-400 font-bold">SLA: 01h 15m remaining</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase">Food Prep Deep Fryer Probe</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/40">
                HIGH (Score: 18/25)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">R638 thermal calibration check required on fryer thermostat.</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Supervisor: P. Botha</span>
              <span className="text-amber-400 font-bold">SLA: 03h 40m remaining</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase">ESD Intercom Battery Test</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                MEDIUM (Score: 10/25)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Nightshift cashier intercom backup power fully operational.</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Supervisor: M. Khumalo</span>
              <span className="text-emerald-400 font-bold">SLA: Resolved ✓</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Navigation Hub to Detailed Modules */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          Interactive Forecourt & Safety Module Suite
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => onNavigateTab('evacuation')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/60 hover:bg-slate-800 transition text-left space-y-2 group shadow-lg min-h-[120px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <Flame className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">1. ESD & Evacuation</h3>
              <p className="text-xs text-slate-400 mt-0.5">SANS 10089-3 Emergency Protocol</p>
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
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">2. Fuel Spill Response</h3>
              <p className="text-xs text-slate-400 mt-0.5">SANS 10263 4-Role Teamwork</p>
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
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">8. Nightshift First Responder</h3>
              <p className="text-xs text-slate-400 mt-0.5">Emergency Medical Triage Protocol</p>
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
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">5. 60s Assessment & Quiz</h3>
              <p className="text-xs text-slate-400 mt-0.5">40 Questions & Video Remediation</p>
            </div>
          </button>

        </div>
      </section>

    </div>
  );
};
