export interface GearPillars {
  governance: number;      // 0 - 100%
  ergonomic: number;       // 0 - 100%
  auditReadiness: number;  // 0 - 100%
  riskReduction: number;   // 0 - 100%
}

export interface GearThresholds {
  governanceThreshold: number;   // 50 - 100%
  fatigueMaxShiftHours: number;  // 6 - 14 hours
  slaEscalationMaxHours: number; // 1 - 24 hours
  hazardMitigationCutoff: number; // 50 - 99%
}

export interface GearState {
  pillars: GearPillars;
  thresholds: GearThresholds;
  lastRecalibrated: string;
  overallHealthScore: number;
}

const defaultState: GearState = {
  pillars: {
    governance: 96,
    ergonomic: 92,
    auditReadiness: 98,
    riskReduction: 95,
  },
  thresholds: {
    governanceThreshold: 85,
    fatigueMaxShiftHours: 10,
    slaEscalationMaxHours: 4,
    hazardMitigationCutoff: 75,
  },
  lastRecalibrated: new Date().toLocaleTimeString(),
  overallHealthScore: 95,
};

let currentGearState: GearState = { ...defaultState };
const gearListeners: Set<(state: GearState) => void> = new Set();

function computeOverallScore(pillars: GearPillars): number {
  const sum = pillars.governance + pillars.ergonomic + pillars.auditReadiness + pillars.riskReduction;
  return Math.round(sum / 4);
}

export function getGearState(): GearState {
  return currentGearState;
}

export function updateGearThresholds(updates: Partial<GearThresholds>): GearState {
  const newThresholds = { ...currentGearState.thresholds, ...updates };
  
  // Recalculate pillars based on live recalibration thresholds
  const govDelta = (newThresholds.governanceThreshold - 85) * 0.2;
  const ergDelta = (10 - newThresholds.fatigueMaxShiftHours) * 1.5;
  const slaDelta = (4 - newThresholds.slaEscalationMaxHours) * 1.2;
  const riskDelta = (newThresholds.hazardMitigationCutoff - 75) * 0.3;

  const newPillars: GearPillars = {
    governance: Math.min(100, Math.max(40, Math.round(96 + govDelta))),
    ergonomic: Math.min(100, Math.max(40, Math.round(92 + ergDelta))),
    auditReadiness: Math.min(100, Math.max(40, Math.round(98 + slaDelta))),
    riskReduction: Math.min(100, Math.max(40, Math.round(95 + riskDelta))),
  };

  currentGearState = {
    pillars: newPillars,
    thresholds: newThresholds,
    lastRecalibrated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    overallHealthScore: computeOverallScore(newPillars),
  };

  gearListeners.forEach((listener) => listener(currentGearState));
  return currentGearState;
}

export function subscribeGearChange(listener: (state: GearState) => void): () => void {
  gearListeners.add(listener);
  return () => gearListeners.delete(listener);
}
