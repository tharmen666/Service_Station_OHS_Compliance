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
  
  // Targets change only the status labels. Pillar readings are NOT recalculated from targets:
  // a reading must come from recorded data. Here the readings stay at their current values.
  const newPillars: GearPillars = { ...currentGearState.pillars };

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
