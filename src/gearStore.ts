export interface GearPillars {
  governance: number;      // 0 - 100% (actual site metric)
  ergonomic: number;       // 0 - 100% (actual site metric)
  auditReadiness: number;  // 0 - 100% (actual site metric)
  riskReduction: number;   // 0 - 100% (actual site metric)
}

export interface GearThresholds {
  governanceThreshold: number;    // 50 - 100%
  fatigueMaxShiftHours: number;   // 6 - 14 hours
  slaEscalationMaxHours: number;  // 1 - 24 hours
  hazardMitigationCutoff: number; // 50 - 99%
}

export interface GearState {
  pillars: GearPillars;
  actualMaxShiftHours: number;
  actualSlaResolutionHours: number;
  thresholds: GearThresholds;
  lastRecalibrated: string;
  overallHealthScore: number;
}

export const DEFAULT_GEAR_THRESHOLDS: GearThresholds = {
  governanceThreshold: 85,
  fatigueMaxShiftHours: 10,
  slaEscalationMaxHours: 4,
  hazardMitigationCutoff: 75,
};

// Actual site operational data (independent of target sliders)
const ACTUAL_SITE_PILLARS: GearPillars = {
  governance: 96,
  ergonomic: 92,
  auditReadiness: 98,
  riskReduction: 95,
};

function computeOverallScore(pillars: GearPillars): number {
  const sum =
    pillars.governance +
    pillars.ergonomic +
    pillars.auditReadiness +
    pillars.riskReduction;
  return Math.round(sum / 4);
}

const defaultState: GearState = {
  pillars: { ...ACTUAL_SITE_PILLARS },
  actualMaxShiftHours: 9,
  actualSlaResolutionHours: 3.5,
  thresholds: { ...DEFAULT_GEAR_THRESHOLDS },
  lastRecalibrated: new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
  overallHealthScore: computeOverallScore(ACTUAL_SITE_PILLARS),
};

let currentGearState: GearState = { ...defaultState };
const gearListeners: Set<(state: GearState) => void> = new Set();

export function getGearState(): GearState {
  return currentGearState;
}

export function evaluateGearCompliance(state: GearState = currentGearState) {
  return {
    governanceCompliant: state.pillars.governance >= state.thresholds.governanceThreshold,
    ergonomicCompliant: state.actualMaxShiftHours <= state.thresholds.fatigueMaxShiftHours,
    auditCompliant: state.actualSlaResolutionHours <= state.thresholds.slaEscalationMaxHours,
    riskCompliant: state.pillars.riskReduction >= state.thresholds.hazardMitigationCutoff,
  };
}

/**
 * Updates target thresholds ONLY.
 * Does NOT alter the actual site pillar scores or overallHealthScore.
 */
export function updateGearThresholds(updates: Partial<GearThresholds>): GearState {
  const newThresholds: GearThresholds = {
    ...currentGearState.thresholds,
    ...updates,
  };

  currentGearState = {
    ...currentGearState,
    // Keep actual data scores unchanged
    pillars: { ...currentGearState.pillars },
    thresholds: newThresholds,
    lastRecalibrated: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };

  gearListeners.forEach((listener) => listener(currentGearState));
  return currentGearState;
}

export function subscribeGearChange(listener: (state: GearState) => void): () => void {
  gearListeners.add(listener);
  return () => gearListeners.delete(listener);
}
