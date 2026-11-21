import React, { useState, useEffect } from 'react';
import { Language } from '../data/translations';
import {
  Play,
  Pause,
  Thermometer,
  FileText,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  getActiveTenant,
  switchTenantBrand,
  TenantBrandConfig,
  subscribeTenantChange,
} from '../multiTenantConfig';
import { getGearState, subscribeGearChange, GearState } from '../gearStore';
import { downloadStatutoryPdf } from '../lib/pdfGenerator';

interface HQDemoVideoShowcaseProps {
  lang: Language;
  onOpenNelly?: () => void;
  onOpenGearModal?: () => void;
}

export interface DemoStep {
  id: number;
  timeRange: string;
  startSec: number;
  endSec: number;
  title: string;
  subtitle: string;
  checkpoints: string[];
  frameworks: string[];
}

export const demoSteps: DemoStep[] = [
  {
    id: 1,
    timeRange: '0:00 - 0:15',
    startSec: 0,
    endSec: 15,
    title: 'Multi-Site Station Configuration & POPIA Safeguards',
    subtitle: 'Site switching with client-side POPIA Condition 7 (Section 19) encryption safeguards',
    checkpoints: [
      'Switch between regional forecourt sites (Alpha through Echo)',
      'Verify POPIA Condition 3 (Minimality) & Condition 7 (Security Safeguards)',
      'Maintain role-based placeholders across fleet and shift logs',
    ],
    frameworks: ['POPIA Act 4 of 2013', 'OHS Act 85 of 1993', 'SANS 10089-3'],
  },
  {
    id: 2,
    timeRange: '0:15 - 0:30',
    startSec: 15,
    endSec: 30,
    title: 'Source-Grounded OHS Guidance & R638 Thermal Control',
    subtitle: 'Nelly OHS Guide cites South African regulatory clauses and checks entered R638 temperatures',
    checkpoints: [
      'Nelly cites a South African statutory clause for each answer. Verify before use.',
      'R638 of 2018 Regulation 8 thermal thresholds: Chilled ≤ 5°C, Hot Holding ≥ 60°C, Poultry Core ≥ 74°C',
      'Evaluates CCP status only when an actual thermometer reading is entered',
    ],
    frameworks: ['OHS Act 85 of 1993', 'Regulation R638 of 2018', 'SANS 10049', 'GSR Reg 2'],
  },
  {
    id: 3,
    timeRange: '0:30 - 0:45',
    startSec: 30,
    endSec: 45,
    title: 'Baseline Risk Matrix & Supervisor SLA Escalation',
    subtitle: 'Hazard quantification mapped to Section 16(2) supervisor action plans',
    checkpoints: [
      'Track critical forecourt fuel spills and equipment hazards',
      'Assign mandatory supervisor role owners with SLA resolution targets',
      'Log spilled fuel volume directly to the Wetstock Reconciliation ledger',
    ],
    frameworks: ['OHS Act Sec 8 & 16(2)', 'SANS 10263:2016', 'HCA Regs 2021'],
  },
  {
    id: 4,
    timeRange: '0:45 - 1:00',
    startSec: 45,
    endSec: 60,
    title: 'One-Click Statutory PDF Export & G.E.A.R. Calibration',
    subtitle: 'Download statutory OHS summary PDFs and calibrate G.E.A.R. target thresholds',
    checkpoints: [
      'Export a PDF summary of site OHS controls and citations (draft, for review)',
      'Compare actual site G.E.A.R. scores against configurable target thresholds',
      'Persist audit records with POPIA data-minimisation notices',
    ],
    frameworks: ['G.E.A.R. Compliance Suite', 'SANS 10089-3', 'COIDA Act 130 of 1993'],
  },
];

export const HQDemoVideoShowcase: React.FC<HQDemoVideoShowcaseProps> = ({
  onOpenNelly,
  onOpenGearModal,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [activeTenant, setActiveTenant] = useState<TenantBrandConfig>(getActiveTenant());
  const [gearState, setGearState] = useState<GearState>(getGearState());
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string>('');

  useEffect(() => {
    const unsubTenant = subscribeTenantChange((t) => setActiveTenant(t));
    const unsubGear = subscribeGearChange((g) => setGearState(g));
    return () => {
      unsubTenant();
      unsubGear();
    };
  }, []);

  const activeStep = demoSteps[activeStepIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgressSec((prev) => {
        if (prev >= 60) {
          setIsPlaying(false);
          return 0;
        }
        const next = prev + 1;
        if (next >= 45) setActiveStepIndex(3);
        else if (next >= 30) setActiveStepIndex(2);
        else if (next >= 15) setActiveStepIndex(1);
        else setActiveStepIndex(0);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepSelect = (index: number) => {
    setActiveStepIndex(index);
    setProgressSec(demoSteps[index].startSec);
  };

  const handleGeneratePDF = () => {
    const summaryBody = [
      `Site: ${activeTenant.stationName} (${activeTenant.siteCode})`,
      `Composite Site Health Score: ${gearState.overallHealthScore}%`,
      `Governance Score: ${gearState.pillars.governance}% (Target: ${gearState.thresholds.governanceThreshold}%)`,
      `Ergonomic & Fatigue Score: ${gearState.pillars.ergonomic}% (Shift Cutoff: ${gearState.thresholds.fatigueMaxShiftHours}h)`,
      `Audit & SLA Readiness: ${gearState.pillars.auditReadiness}% (SLA Target: ${gearState.thresholds.slaEscalationMaxHours}h)`,
      `Risk Mitigation Score: ${gearState.pillars.riskReduction}% (Target: ${gearState.thresholds.hazardMitigationCutoff}%)`,
      '',
      'Key Statutory Frameworks Verified (Last Verified: 2026-03-01):',
      '- OHS Act 85 of 1993 (Sections 8, 9, 14, 16.1, 16.2, 24)',
      '- SANS 10089-3:2010 (Underground tanks, dispensers & ESD isolation)',
      '- SANS 10263:2016 (Dangerous goods warehousing & spill response)',
      '- Regulation R638 of 2018 (Food premises hygiene & temperature control)',
      '- General Safety Regulations (GSR) & General Machinery Regulations (GMR)',
      '- COIDA Act 130 of 1993 & BCEA Act 75 of 1997',
    ].join('\n');

    downloadStatutoryPdf(
      `Forecourt_Sentinel_${activeTenant.siteCode}_Summary.pdf`,
      `${activeTenant.stationName} (${activeTenant.siteCode}) Statutory Summary`,
      summaryBody
    );
    setPdfSuccessMessage(
      `Downloaded Forecourt_Sentinel_${activeTenant.siteCode}_Summary.pdf`
    );
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="pos-card p-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              Interactive System Walkthrough
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Forecourt &amp; Retail Compliance Walkthrough
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            Multi-site configuration, source-grounded South African regulatory citations, baseline risk matrix, and one-click PDF export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause Walkthrough' : 'Play Walkthrough'}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition min-h-[48px] w-full sm:w-auto ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause Walkthrough
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" /> Play 60s Walkthrough
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Visual Stage Display */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl bg-slate-950 border-2 border-purple-500/50 overflow-hidden shadow-2xl flex flex-col justify-between p-6 min-h-[320px]">
            {/* Realistic Commercial African Service Station Forecourt Background Video (Silent 10s Loop) */}
            <video
              src="/Service_Station_OHS_Compliance_Demo.mp4"
              poster="/assets/forecourt_realistic_scene1.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              data-testid="hq-showcase-realistic-video"
              className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/80 pointer-events-none" />

            {/* Top Stage Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>STEP PROGRESS: {progressSec}s / 60s</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/40 text-xs font-bold text-purple-200">
                <span>
                  {activeStep.timeRange} • STEP {activeStep.id} OF 4
                </span>
              </div>
            </div>

            {/* Stage Center Visual Preview Content */}
            <div className="relative z-10 my-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-4">
              {activeStepIndex === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Multi-Site Forecourt Configuration
                    </span>
                    <span className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-400" /> POPIA Section 19 Safeguards
                    </span>
                  </div>

                  <div
                    className="p-4 rounded-xl border border-slate-800 flex items-center justify-between"
                    style={{
                      backgroundColor: `${activeTenant.primaryColor}20`,
                      borderColor: activeTenant.primaryColor,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activeTenant.badgeSymbol}</span>
                      <div>
                        <h4 className="text-base font-black text-white">{activeTenant.brandName}</h4>
                        <span className="text-xs text-slate-300 font-mono">
                          {activeTenant.siteCode} • {activeTenant.stationName}
                        </span>
                      </div>
                    </div>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950"
                      style={{ backgroundColor: activeTenant.accentColor }}
                    >
                      {activeTenant.fuelBrand}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="text-xs text-slate-300 font-bold">Switch Station:</span>
                    {(['alpha', 'bravo', 'charlie', 'delta', 'echo'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => switchTenantBrand(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition border ${
                          activeTenant.siteCode.toLowerCase().includes(b)
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                            : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        Site {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeStepIndex === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-purple-300 tracking-wider">
                      Nelly OHS Guide • Source-Grounded Retrieval
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                      SA R638 &amp; SANS 10049
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <Thermometer className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-300 font-bold block">
                          Regulation R638 (2018) Reg 8 Core Cooking Threshold
                        </span>
                        <h4 className="text-base font-black text-amber-400 font-mono">
                          Poultry Core ≥ 74.0°C | Hot Holding ≥ 60.0°C
                        </h4>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-200 text-xs font-bold border border-slate-700">
                      Requires Probe Entry
                    </span>
                  </div>
                </div>
              )}

              {activeStepIndex === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Baseline Risk Matrix &amp; Supervisor SLA Escalation
                    </span>
                    <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> SLA Target: {gearState.thresholds.slaEscalationMaxHours}h
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-red-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-red-400">Forecourt Pump 3 Spill</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-black">
                          CRITICAL
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 block font-mono">
                        Owner: Shift Supervisor A (Placeholder)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400">Deep Fryer Thermostat Check</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black">
                          HIGH
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 block font-mono">
                        Owner: Food Safety Supervisor B (Placeholder)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeStepIndex === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      One-Click Statutory PDF Export &amp; G.E.A.R. Meters
                    </span>
                    <span className="text-xs font-mono text-emerald-300">
                      Overall Health: {gearState.overallHealthScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        Statutory Compliance Summary PDF
                      </h4>
                      <span className="text-xs text-slate-300 font-mono">
                        Exports site metrics, verified SA statutory citations &amp; POPIA notice
                      </span>
                    </div>

                    <button
                      onClick={handleGeneratePDF}
                      data-testid="showcase-download-pdf-btn"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition min-h-[40px] whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Statutory PDF</span>
                    </button>
                  </div>

                  {pdfSuccessMessage && (
                    <div
                      data-testid="showcase-pdf-status"
                      className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center"
                    >
                      ✓ {pdfSuccessMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => onOpenNelly?.()}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-extrabold flex items-center gap-2 border border-purple-500/40 transition min-h-[40px]"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Ask Nelly OHS Guide</span>
              </button>

              <button
                onClick={() => onOpenGearModal?.()}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-extrabold flex items-center gap-2 border border-amber-500/40 transition min-h-[40px]"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Open G.E.A.R. Calibration</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Operational Checkpoints (Replaces Dev Teleprompter Script) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between min-h-[320px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                Operational Compliance Checkpoints
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 text-xs font-mono font-bold border border-slate-800">
                Step {activeStep.id} / 4
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black text-white leading-snug">{activeStep.title}</h4>
              <p className="text-xs text-slate-300">{activeStep.subtitle}</p>
            </div>

            <ul className="space-y-2 text-xs text-slate-200">
              {activeStep.checkpoints.map((cp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{cp}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-mono block">
                Referenced South African Standards:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeStep.frameworks.map((f, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-xs font-mono border border-slate-800"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoSteps.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => handleStepSelect(idx)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
              activeStepIndex === idx
                ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500 ring-2 ring-purple-500/30 shadow-xl'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 font-mono font-bold border border-slate-800">
                  {step.timeRange}
                </span>
                {activeStepIndex === idx && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <h4 className="text-xs font-black text-white">{step.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-2">{step.subtitle}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-extrabold text-amber-400">
              <span>Select Step {step.id}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
