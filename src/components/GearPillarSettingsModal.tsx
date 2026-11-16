import React, { useState, useEffect } from 'react';
import {
  getGearState,
  updateGearThresholds,
  subscribeGearChange,
  evaluateGearCompliance,
  DEFAULT_GEAR_THRESHOLDS,
  GearState,
} from '../gearStore';
import {
  Settings,
  X,
  ShieldCheck,
  Activity,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Lock,
  Sliders,
} from 'lucide-react';

interface GearPillarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GearPillarSettingsModal: React.FC<GearPillarSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [gearState, setGearState] = useState<GearState>(getGearState());

  useEffect(() => {
    setGearState(getGearState());
    const unsubscribe = subscribeGearChange((newState) => {
      setGearState(newState);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const { pillars, thresholds, lastRecalibrated, overallHealthScore } = gearState;
  const compliance = evaluateGearCompliance(gearState);

  const handleSliderChange = (key: keyof typeof thresholds, value: number) => {
    updateGearThresholds({ [key]: value });
  };

  const handleResetDefaults = () => {
    updateGearThresholds({ ...DEFAULT_GEAR_THRESHOLDS });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gear-modal-heading"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-y-auto flex flex-col font-sans">
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  G.E.A.R. Pillar System Suite
                </span>
                <span className="text-slate-300 text-xs font-mono">
                  Recalibrated: {lastRecalibrated}
                </span>
              </div>
              <h2 id="gear-modal-heading" className="text-xl font-black text-white tracking-tight">
                System Meters &amp; Threshold Calibration
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close GEAR Modal"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 flex-1">
          {/* Top Overall Health Index Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400 stroke-current transition-all duration-500"
                    strokeDasharray={`${overallHealthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-black text-lg text-white font-mono">
                  {overallHealthScore}%
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Composite Site Health Index</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Derived from actual site metrics across Governance, Fatigue, SLA Readiness, and Risk Mitigation.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Telemetry
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> POPIA AES-256
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetDefaults}
              data-testid="gear-reset-defaults-btn"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-extrabold flex items-center gap-2 border border-slate-700 transition min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Reset Threshold Defaults
            </button>
          </div>

          {/* Core 4 G.E.A.R. Pillar System Meters */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              4 Core G.E.A.R. Pillar System Meters (Actual Site Data vs Targets)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Meter 1: Governance */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Governance &amp; POPIA
                  </span>
                  <span
                    data-testid="gear-modal-gov-score"
                    className="font-mono text-sm font-black text-cyan-400"
                  >
                    {pillars.governance}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pillars.governance}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-300">Target: {thresholds.governanceThreshold}%</span>
                  <span
                    data-testid="gear-modal-gov-status"
                    className={`font-bold ${
                      compliance.governanceCompliant ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {compliance.governanceCompliant ? '✓ Compliant' : '✗ Not compliant'}
                  </span>
                </div>
              </div>

              {/* Meter 2: Ergonomic */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Ergonomic &amp; Fatigue
                  </span>
                  <span
                    data-testid="gear-modal-erg-score"
                    className="font-mono text-sm font-black text-emerald-400"
                  >
                    {pillars.ergonomic}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pillars.ergonomic}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-300">Cutoff: {thresholds.fatigueMaxShiftHours}h</span>
                  <span
                    data-testid="gear-modal-erg-status"
                    className={`font-bold ${
                      compliance.ergonomicCompliant ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {compliance.ergonomicCompliant ? '✓ Compliant' : '✗ Not compliant'}
                  </span>
                </div>
              </div>

              {/* Meter 3: Audit Readiness */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Audit &amp; SLA Readiness
                  </span>
                  <span
                    data-testid="gear-modal-audit-score"
                    className="font-mono text-sm font-black text-purple-400"
                  >
                    {pillars.auditReadiness}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pillars.auditReadiness}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-300">Target: {thresholds.slaEscalationMaxHours}h</span>
                  <span
                    data-testid="gear-modal-audit-status"
                    className={`font-bold ${
                      compliance.auditCompliant ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {compliance.auditCompliant ? '✓ Compliant' : '✗ Not compliant'}
                  </span>
                </div>
              </div>

              {/* Meter 4: Risk Reduction */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Risk &amp; Hazard Reduction
                  </span>
                  <span
                    data-testid="gear-modal-risk-score"
                    className="font-mono text-sm font-black text-amber-400"
                  >
                    {pillars.riskReduction}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pillars.riskReduction}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-300">Target: {thresholds.hazardMitigationCutoff}%</span>
                  <span
                    data-testid="gear-modal-risk-status"
                    className={`font-bold ${
                      compliance.riskCompliant ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {compliance.riskCompliant ? '✓ Compliant' : '✗ Not compliant'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Recalibration Sliders */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Live Threshold Recalibration Controls
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Adjusting targets updates compliance status against actual site data without altering underlying scores.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Control 1: Governance Target */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <label htmlFor="gov-slider">Governance &amp; POPIA Ledger Target</label>
                  <span className="font-mono text-cyan-400">{thresholds.governanceThreshold}%</span>
                </div>
                <input
                  id="gov-slider"
                  data-testid="gov-slider"
                  type="range"
                  min="50"
                  max="100"
                  value={thresholds.governanceThreshold}
                  onChange={(e) =>
                    handleSliderChange('governanceThreshold', Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-xs text-slate-300 block">
                  Actual Governance Score: {pillars.governance}% (Requires ≥ {thresholds.governanceThreshold}% for Compliant status)
                </span>
              </div>

              {/* Control 2: Fatigue Shift Cutoff */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <label htmlFor="fatigue-slider">Max Consecutive Shift Hours (Fatigue Cutoff)</label>
                  <span className="font-mono text-emerald-400">
                    {thresholds.fatigueMaxShiftHours} Hours
                  </span>
                </div>
                <input
                  id="fatigue-slider"
                  data-testid="fatigue-slider"
                  type="range"
                  min="6"
                  max="14"
                  value={thresholds.fatigueMaxShiftHours}
                  onChange={(e) =>
                    handleSliderChange('fatigueMaxShiftHours', Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="text-xs text-slate-300 block">
                  Actual Max Shift Logged: {gearState.actualMaxShiftHours}h (Requires ≤ {thresholds.fatigueMaxShiftHours}h)
                </span>
              </div>

              {/* Control 3: SLA Target Hours */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <label htmlFor="sla-slider">SLA Hazard Resolution Target</label>
                  <span className="font-mono text-purple-400">
                    {thresholds.slaEscalationMaxHours} Hours
                  </span>
                </div>
                <input
                  id="sla-slider"
                  data-testid="sla-slider"
                  type="range"
                  min="1"
                  max="24"
                  value={thresholds.slaEscalationMaxHours}
                  onChange={(e) =>
                    handleSliderChange('slaEscalationMaxHours', Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <span className="text-xs text-slate-300 block">
                  Actual Mean Resolution Time: {gearState.actualSlaResolutionHours}h (Requires ≤ {thresholds.slaEscalationMaxHours}h)
                </span>
              </div>

              {/* Control 4: Hazard Cutoff */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <label htmlFor="hazard-slider">Hazard Mitigation Cutoff Target</label>
                  <span className="font-mono text-amber-400">
                    {thresholds.hazardMitigationCutoff}%
                  </span>
                </div>
                <input
                  id="hazard-slider"
                  data-testid="hazard-slider"
                  type="range"
                  min="50"
                  max="99"
                  value={thresholds.hazardMitigationCutoff}
                  onChange={(e) =>
                    handleSliderChange('hazardMitigationCutoff', Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="text-xs text-slate-300 block">
                  Actual Risk Mitigation Score: {pillars.riskReduction}% (Requires ≥ {thresholds.hazardMitigationCutoff}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Changes synchronize with Executive Briefing Dashboard</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 transition min-h-[44px]"
          >
            Save &amp; Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
