/**
 * Native Wetstock, Dipping, Cleaning & Shift Cash-Up Engine
 * Self-contained wetstock & shift reconciliation engine with zero external bureau dependencies:
 * - Underground Tank Strapping Tables (mm-to-litre interpolation)
 * - Water-Paste / Water-Level Interface Alerts
 * - 15°C Thermal Expansion Compensation (ASTM D1250 / SANS 10089)
 * - Pre-Offload Safety Gate & Tanker Delivery BOL Verification
 * - Shift Cash-Up & Nozzle Totalizer Reconciliation
 * - Statistical Inventory Reconciliation (SIR) Trend Detection & Automated NCR generation
 * - Forecourt, Tank & Oil/Water Interceptor Cleaning Logs
 */

import {
  CanonicalFuelGrade,
  ShiftReconciliationPayload,
} from './pos-ingestion-adapter';
import { NonConformanceReport } from './ncrStore';

export interface StrappingPoint {
  mm: number;
  litres: number;
}

/**
 * Standard horizontal cylindrical underground storage tank strapping curves
 * mapped by nominal tank capacity in litres.
 */
export const TANK_STRAPPING_TABLES: Record<number, StrappingPoint[]> = {
  23000: [
    { mm: 0, litres: 0 },
    { mm: 250, litres: 1250 },
    { mm: 500, litres: 3650 },
    { mm: 750, litres: 6750 },
    { mm: 1000, litres: 10200 },
    { mm: 1250, litres: 13700 },
    { mm: 1500, litres: 17050 },
    { mm: 1750, litres: 19950 },
    { mm: 2000, litres: 22100 },
    { mm: 2200, litres: 23000 },
  ],
  30000: [
    { mm: 0, litres: 0 },
    { mm: 300, litres: 1850 },
    { mm: 600, litres: 5200 },
    { mm: 900, litres: 9600 },
    { mm: 1200, litres: 14600 },
    { mm: 1500, litres: 19650 },
    { mm: 1800, litres: 24300 },
    { mm: 2100, litres: 27950 },
    { mm: 2400, litres: 30000 },
  ],
  35000: [
    { mm: 0, litres: 0 },
    { mm: 300, litres: 2100 },
    { mm: 600, litres: 6100 },
    { mm: 900, litres: 11200 },
    { mm: 1200, litres: 17050 },
    { mm: 1500, litres: 22950 },
    { mm: 1800, litres: 28350 },
    { mm: 2100, litres: 32600 },
    { mm: 2400, litres: 35000 },
  ],
  45000: [
    { mm: 0, litres: 0 },
    { mm: 350, litres: 2950 },
    { mm: 700, litres: 8300 },
    { mm: 1050, litres: 15250 },
    { mm: 1400, litres: 22800 },
    { mm: 1750, litres: 30350 },
    { mm: 2100, litres: 37200 },
    { mm: 2450, litres: 42400 },
    { mm: 2700, litres: 45000 },
  ],
};

export function convertDipMmToLitres(
  dipMm: number,
  tankCapacityLitres = 30000,
  customTable?: StrappingPoint[]
): number {
  if (dipMm <= 0) return 0;

  const availableCaps = Object.keys(TANK_STRAPPING_TABLES).map(Number);
  const nearestCap = availableCaps.reduce((prev, curr) =>
    Math.abs(curr - tankCapacityLitres) < Math.abs(prev - tankCapacityLitres) ? curr : prev
  );
  const table = customTable && customTable.length >= 2 ? customTable : TANK_STRAPPING_TABLES[nearestCap];
  const scale = customTable ? 1 : tankCapacityLitres / nearestCap;

  const maxPoint = table[table.length - 1];
  if (dipMm >= maxPoint.mm) {
    return Math.round(maxPoint.litres * scale * 10) / 10;
  }

  for (let i = 0; i < table.length - 1; i++) {
    const p1 = table[i];
    const p2 = table[i + 1];
    if (dipMm >= p1.mm && dipMm <= p2.mm) {
      const ratio = (dipMm - p1.mm) / Math.max(p2.mm - p1.mm, 1);
      const interpolated = p1.litres + ratio * (p2.litres - p1.litres);
      return Math.round(interpolated * scale * 10) / 10;
    }
  }
  return 0;
}

export interface WaterInterfaceStatus {
  status: 'OK' | 'WARNING' | 'CRITICAL';
  waterMm: number;
  warnThresholdMm: number;
  maxAllowedMm: number;
  alertMessage: string;
}

export function evaluateWaterInterface(
  waterMm: number,
  fuelGrade: CanonicalFuelGrade
): WaterInterfaceStatus {
  const isPetrol = fuelGrade === 'ULP_93' || fuelGrade === 'ULP_95';
  const warnThresholdMm = isPetrol ? 10 : 15;
  const maxAllowedMm = isPetrol ? 15 : 25;

  if (waterMm > maxAllowedMm) {
    return {
      status: 'CRITICAL',
      waterMm,
      warnThresholdMm,
      maxAllowedMm,
      alertMessage: `CRITICAL WATER INGRESS: ${waterMm}mm exceeds ${maxAllowedMm}mm limit for ${fuelGrade}. Lock dispenser & drain water bottom immediately.`,
    };
  }
  if (waterMm >= warnThresholdMm) {
    return {
      status: 'WARNING',
      waterMm,
      warnThresholdMm,
      maxAllowedMm,
      alertMessage: `Water interface rising (${waterMm}mm). Schedule suction pump water purge before ${maxAllowedMm}mm cutoff.`,
    };
  }
  return {
    status: 'OK',
    waterMm,
    warnThresholdMm,
    maxAllowedMm,
    alertMessage: `Water-paste check clear (${waterMm}mm ≤ ${maxAllowedMm}mm limit).`,
  };
}

export function getThermalAlpha(fuelGrade: CanonicalFuelGrade): number {
  return fuelGrade === 'ULP_93' || fuelGrade === 'ULP_95' ? 0.0012 : 0.00085;
}

export function compensateVolumeTo15C(
  observedLitres: number,
  temperatureC: number,
  fuelGrade: CanonicalFuelGrade
): { alpha: number; vcf: number; compensated15CLitres: number; thermalDeltaLitres: number } {
  const alpha = getThermalAlpha(fuelGrade);
  const vcf = Math.round((1 - alpha * (temperatureC - 15)) * 100000) / 100000;
  const compensated15CLitres = Math.round(observedLitres * vcf * 10) / 10;
  const thermalDeltaLitres = Math.round((compensated15CLitres - observedLitres) * 10) / 10;
  return { alpha, vcf, compensated15CLitres, thermalDeltaLitres };
}

export interface PreOffloadSafetyGateInput {
  tankId: string;
  tankGrade: CanonicalFuelGrade;
  bolGrade: CanonicalFuelGrade;
  tankCapacityLitres: number;
  preDropLitres: number;
  bolLitres: number;
  earthingGrounded: boolean;
  spillKitStaged: boolean;
  fireExtinguishersPositioned: boolean;
  drainIsolationClosed: boolean;
}

export interface PreOffloadSafetyGateResult {
  passed: boolean;
  availableUllageLitres: number;
  requiredSafeUllageLitres: number;
  blockingReasons: string[];
}

export function evaluatePreOffloadSafetyGate(
  input: PreOffloadSafetyGateInput
): PreOffloadSafetyGateResult {
  const blockingReasons: string[] = [];
  const availableUllageLitres = Math.max(0, input.tankCapacityLitres - input.preDropLitres);
  const requiredSafeUllageLitres = Math.round(input.bolLitres * 1.05);

  if (input.tankGrade !== input.bolGrade) {
    blockingReasons.push(
      `GRADE MISMATCH: Tank ${input.tankId} holds ${input.tankGrade} but BOL specifies ${input.bolGrade}.`
    );
  }
  if (availableUllageLitres < requiredSafeUllageLitres) {
    blockingReasons.push(
      `INSUFFICIENT ULLAGE: Available ${availableUllageLitres.toLocaleString()}L is below required 5% safety headspace (${requiredSafeUllageLitres.toLocaleString()}L for ${input.bolLitres.toLocaleString()}L drop).`
    );
  }
  if (!input.earthingGrounded) {
    blockingReasons.push('Static earthing/grounding clamp not verified on tanker.');
  }
  if (!input.spillKitStaged) {
    blockingReasons.push('Single-use spill kit not staged upwind of fill point.');
  }
  if (!input.fireExtinguishersPositioned) {
    blockingReasons.push('2x 9kg DCP fire extinguishers not positioned upwind.');
  }
  if (!input.drainIsolationClosed) {
    blockingReasons.push('Stormwater drain isolation valve not confirmed closed.');
  }

  return {
    passed: blockingReasons.length === 0,
    availableUllageLitres,
    requiredSafeUllageLitres,
    blockingReasons,
  };
}

export interface TankerDeliveryBolInput {
  siteCode: string;
  tankId: string;
  bolReference: string;
  fuelGrade: CanonicalFuelGrade;
  tankCapacityLitres: number;
  preDropLitres: number;
  postDropLitres: number;
  salesDuringDropLitres: number;
  bolLitres: number;
  bolTemperatureC: number;
  tankTemperatureC: number;
  safetyGate: Omit<PreOffloadSafetyGateInput, 'tankId' | 'tankGrade' | 'tankCapacityLitres' | 'preDropLitres' | 'bolLitres'>;
}

export interface TankerDeliveryBolResult {
  bolReference: string;
  safetyGate: PreOffloadSafetyGateResult;
  bolCompensated15CLitres: number;
  receivedObservedLitres: number;
  receivedCompensated15CLitres: number;
  deliveryVarianceLitres: number;
  deliveryVariancePercent: number;
  status: 'BLOCKED_SAFETY_GATE' | 'SHORTAGE_NCR' | 'VERIFIED';
  ncr?: NonConformanceReport;
}

export function verifyTankerDeliveryBol(
  input: TankerDeliveryBolInput
): TankerDeliveryBolResult {
  const safetyGate = evaluatePreOffloadSafetyGate({
    tankId: input.tankId,
    tankGrade: input.fuelGrade,
    bolGrade: input.safetyGate.bolGrade,
    tankCapacityLitres: input.tankCapacityLitres,
    preDropLitres: input.preDropLitres,
    bolLitres: input.bolLitres,
    earthingGrounded: input.safetyGate.earthingGrounded,
    spillKitStaged: input.safetyGate.spillKitStaged,
    fireExtinguishersPositioned: input.safetyGate.fireExtinguishersPositioned,
    drainIsolationClosed: input.safetyGate.drainIsolationClosed,
  });

  const bol15 = compensateVolumeTo15C(input.bolLitres, input.bolTemperatureC, input.fuelGrade);
  const receivedObservedLitres =
    Math.round((input.postDropLitres - input.preDropLitres + input.salesDuringDropLitres) * 10) / 10;
  const recv15 = compensateVolumeTo15C(receivedObservedLitres, input.tankTemperatureC, input.fuelGrade);

  const deliveryVarianceLitres =
    Math.round((recv15.compensated15CLitres - bol15.compensated15CLitres) * 10) / 10;
  const deliveryVariancePercent =
    bol15.compensated15CLitres > 0
      ? Math.round((deliveryVarianceLitres / bol15.compensated15CLitres) * 10000) / 100
      : 0;

  if (!safetyGate.passed) {
    return {
      bolReference: input.bolReference,
      safetyGate,
      bolCompensated15CLitres: bol15.compensated15CLitres,
      receivedObservedLitres,
      receivedCompensated15CLitres: recv15.compensated15CLitres,
      deliveryVarianceLitres,
      deliveryVariancePercent,
      status: 'BLOCKED_SAFETY_GATE',
    };
  }

  const shortageThresholdLitres = Math.max(50, bol15.compensated15CLitres * 0.002);
  const isShortage = deliveryVarianceLitres < -shortageThresholdLitres;

  let ncr: NonConformanceReport | undefined;
  if (isShortage) {
    ncr = {
      id: `NCR-BOL-${input.bolReference.replace(/[^A-Z0-9]/gi, '').slice(-8)}`,
      siteCode: input.siteCode,
      category: 'BOL_SHORTAGE',
      severity: 'CRITICAL',
      title: `Tanker Delivery BOL Shortage on ${input.tankId} (${input.bolReference})`,
      description: `15°C compensated tank gain (${recv15.compensated15CLitres}L) fell short of BOL (${bol15.compensated15CLitres}L) by ${Math.abs(deliveryVarianceLitres)}L (${Math.abs(deliveryVariancePercent)}%).`,
      statutoryReference: 'SANS 10089-3 / Legal Metrology Act',
      measuredValue: `${deliveryVarianceLitres} L (${deliveryVariancePercent}%)`,
      thresholdValue: `-0.20% / -${Math.round(shortageThresholdLitres)} L`,
      status: 'OPEN',
      createdAtIso: new Date().toISOString(),
      slaHours: 4,
    };
  }

  return {
    bolReference: input.bolReference,
    safetyGate,
    bolCompensated15CLitres: bol15.compensated15CLitres,
    receivedObservedLitres,
    receivedCompensated15CLitres: recv15.compensated15CLitres,
    deliveryVarianceLitres,
    deliveryVariancePercent,
    status: isShortage ? 'SHORTAGE_NCR' : 'VERIFIED',
    ncr,
  };
}

export interface Rolling30DayTankHistory {
  tankId: string;
  cumulative30DayVarianceLitres: number;
  cumulative30DayThroughputLitres: number;
}

export interface TankShiftReconciliationItem {
  tankId: string;
  fuelGrade: CanonicalFuelGrade;
  openingLitres: number;
  deliveryLitres: number;
  netDispensedLitres: number;
  bookStockLitres: number;
  actualClosingLitres: number;
  varianceLitres: number;
  variancePercent: number;
  rolling30DayDriftPercent: number;
  waterStatus: WaterInterfaceStatus;
  dailyThresholdBreached: boolean;
  rolling30DayBreached: boolean;
  status: 'COMPLIANT' | 'WARNING' | 'CRITICAL_BREACH';
}

export interface NozzleReconciliationItem {
  nozzleId: string;
  pumpNumber: number;
  tankId: string;
  fuelGrade: CanonicalFuelGrade;
  grossDeltaLitres: number;
  pumpTestReturnLitres: number;
  netDispensedLitres: number;
  expectedSalesValueLocal: number;
}

export interface GradeMeterVsPosResult {
  fuelGrade: CanonicalFuelGrade;
  nozzleNetDispensedLitres: number;
  posSoldLitres: number;
  meterDriftLitres: number;
  meterDriftPercent: number;
  driftFlagged: boolean;
}

export interface ShiftCashUpSummary {
  expectedFuelRevenueLocal: number;
  expectedShopRevenueLocal: number;
  driveOffDeductionLocal: number;
  expectedTotalLocal: number;
  totalTenderedLocal: number;
  cashVarianceLocal: number;
  withinTolerance: boolean;
}

export interface SirAlert {
  code: 'DAILY_VARIANCE' | 'SIR_30DAY_DRIFT' | 'NOZZLE_METER_DRIFT' | 'WATER_INGRESS' | 'CASH_UP_VARIANCE';
  severity: 'WARNING' | 'CRITICAL';
  targetId: string;
  message: string;
}

export interface ShiftReconciliationReport {
  ingestionId: string;
  siteCode: string;
  shiftId: string;
  sourceVendors: string[];
  tankResults: TankShiftReconciliationItem[];
  nozzleResults: NozzleReconciliationItem[];
  gradeMeterComparison: GradeMeterVsPosResult[];
  cashUpSummary: ShiftCashUpSummary;
  sirAlerts: SirAlert[];
  generatedNcrs: NonConformanceReport[];
  overallStatus: 'COMPLIANT' | 'WARNING' | 'CRITICAL_BREACH';
}

export function reconcileShift(
  payload: ShiftReconciliationPayload,
  options?: {
    rolling30DayHistory?: Rolling30DayTankHistory[];
    dailyVarianceTolerancePct?: number;
    rolling30DayTolerancePct?: number;
    cashToleranceLocal?: number;
  }
): ShiftReconciliationReport {
  const dailyTolPct = options?.dailyVarianceTolerancePct ?? 0.5;
  const rolling30TolPct = options?.rolling30DayTolerancePct ?? 1.0;
  const cashTolLocal = options?.cashToleranceLocal ?? 50;

  const sirAlerts: SirAlert[] = [];
  const generatedNcrs: NonConformanceReport[] = [];
  const nowIso = new Date().toISOString();

  // 1. Reconcile Nozzles
  const nozzleResults: NozzleReconciliationItem[] = payload.nozzleTotalizers.map((nz) => {
    const grossDeltaLitres = Math.max(0, Math.round((nz.closingTotalizerLitres - nz.openingTotalizerLitres) * 10) / 10);
    const netDispensedLitres = Math.max(0, Math.round((grossDeltaLitres - nz.pumpTestReturnLitres) * 10) / 10);
    const expectedSalesValueLocal = Math.round(netDispensedLitres * nz.unitPriceLocal * 100) / 100;
    return {
      nozzleId: nz.nozzleId,
      pumpNumber: nz.pumpNumber,
      tankId: nz.tankId,
      fuelGrade: nz.fuelGrade,
      grossDeltaLitres,
      pumpTestReturnLitres: nz.pumpTestReturnLitres,
      netDispensedLitres,
      expectedSalesValueLocal,
    };
  });

  // 2. Compare Nozzle Totalizers vs POS Fuel Sales by Grade
  const gradeSet = new Set<CanonicalFuelGrade>([
    ...nozzleResults.map((n) => n.fuelGrade),
    ...payload.fuelSalesByGrade.map((f) => f.fuelGrade),
  ]);

  const gradeMeterComparison: GradeMeterVsPosResult[] = Array.from(gradeSet).map((grade) => {
    const nozzleNetDispensedLitres =
      Math.round(
        nozzleResults.filter((n) => n.fuelGrade === grade).reduce((s, n) => s + n.netDispensedLitres, 0) * 10
      ) / 10;
    const posEntry = payload.fuelSalesByGrade.find((f) => f.fuelGrade === grade);
    const posSoldLitres = posEntry ? posEntry.posLitresSold : nozzleNetDispensedLitres;
    const meterDriftLitres = Math.round((posSoldLitres - nozzleNetDispensedLitres) * 10) / 10;
    const meterDriftPercent =
      nozzleNetDispensedLitres > 0
        ? Math.round((meterDriftLitres / nozzleNetDispensedLitres) * 10000) / 100
        : 0;
    const driftFlagged = Math.abs(meterDriftPercent) > 0.3 && Math.abs(meterDriftLitres) > 15;

    if (driftFlagged) {
      sirAlerts.push({
        code: 'NOZZLE_METER_DRIFT',
        severity: Math.abs(meterDriftPercent) > 0.75 ? 'CRITICAL' : 'WARNING',
        targetId: grade,
        message: `Nozzle totalizers (${nozzleNetDispensedLitres}L) vs POS sales (${posSoldLitres}L) drifted by ${meterDriftLitres}L (${meterDriftPercent}%).`,
      });
      generatedNcrs.push({
        id: `NCR-NOZ-${payload.shiftId}-${grade}`.replace(/[^A-Z0-9-]/gi, ''),
        siteCode: payload.siteCode,
        category: 'NOZZLE_METER_DRIFT',
        severity: Math.abs(meterDriftPercent) > 0.75 ? 'CRITICAL' : 'WARNING',
        title: `Nozzle Meter vs POS Drift on ${grade}`,
        description: `Discrepancy of ${meterDriftLitres}L (${meterDriftPercent}%) between electronic/mechanical nozzle totalizers and POS fuel sales.`,
        statutoryReference: 'SANS 10089-3 / Legal Metrology Calibration',
        measuredValue: `${meterDriftLitres} L (${meterDriftPercent}%)`,
        thresholdValue: '±0.30%',
        status: 'OPEN',
        createdAtIso: nowIso,
        slaHours: 12,
      });
    }

    return {
      fuelGrade: grade,
      nozzleNetDispensedLitres,
      posSoldLitres,
      meterDriftLitres,
      meterDriftPercent,
      driftFlagged,
    };
  });

  // 3. Reconcile Underground Tanks (Book Stock vs Physical Dip/ATG + 30-Day SIR)
  const tankResults: TankShiftReconciliationItem[] = payload.tankReadings.map((tk) => {
    const linkedNozzles = nozzleResults.filter((n) => n.tankId === tk.tankId);
    const netDispensedLitres =
      linkedNozzles.length > 0
        ? Math.round(linkedNozzles.reduce((s, n) => s + n.netDispensedLitres, 0) * 10) / 10
        : payload.fuelSalesByGrade
            .filter((f) => f.fuelGrade === tk.fuelGrade)
            .reduce((s, f) => s + f.posLitresSold, 0);

    const bookStockLitres =
      Math.round((tk.openingLitres + tk.deliveryLitres - netDispensedLitres) * 10) / 10;

    const actualClosingLitres =
      typeof tk.closingAtgLitres === 'number'
        ? tk.closingAtgLitres
        : typeof tk.closingManualDipLitres === 'number'
          ? tk.closingManualDipLitres
          : typeof tk.closingManualDipMm === 'number'
            ? convertDipMmToLitres(tk.closingManualDipMm, tk.tankCapacityLitres)
            : bookStockLitres;

    const varianceLitres = Math.round((actualClosingLitres - bookStockLitres) * 10) / 10;
    const throughputBase = Math.max(netDispensedLitres, 1);
    const variancePercent = Math.round((varianceLitres / throughputBase) * 10000) / 100;

    const hist = options?.rolling30DayHistory?.find((h) => h.tankId === tk.tankId);
    const rollingVar = (hist?.cumulative30DayVarianceLitres ?? 0) + varianceLitres;
    const rollingThroughput = Math.max(
      (hist?.cumulative30DayThroughputLitres ?? 0) + netDispensedLitres,
      1
    );
    const rolling30DayDriftPercent = Math.round((rollingVar / rollingThroughput) * 10000) / 100;

    const dailyThresholdBreached = Math.abs(variancePercent) > dailyTolPct;
    const rolling30DayBreached = Math.abs(rolling30DayDriftPercent) > rolling30TolPct;
    const waterStatus = evaluateWaterInterface(tk.waterLevelMm, tk.fuelGrade);

    if (dailyThresholdBreached) {
      sirAlerts.push({
        code: 'DAILY_VARIANCE',
        severity: 'CRITICAL',
        targetId: tk.tankId,
        message: `Tank ${tk.tankId} daily variance ${varianceLitres}L (${variancePercent}%) exceeds ±${dailyTolPct}% limit.`,
      });
      generatedNcrs.push({
        id: `NCR-WET-${payload.shiftId}-${tk.tankId}`.replace(/[^A-Z0-9-]/gi, ''),
        siteCode: payload.siteCode,
        category: 'WETSTOCK_VARIANCE',
        severity: 'CRITICAL',
        title: `Daily Wetstock Variance Breach on ${tk.tankId} (${tk.fuelGrade})`,
        description: `Book Stock (${bookStockLitres}L) vs Physical Closing (${actualClosingLitres}L) variance of ${varianceLitres}L (${variancePercent}%) breached ±${dailyTolPct}%.`,
        statutoryReference: 'SANS 10089-3 / NEMA Section 30',
        measuredValue: `${varianceLitres} L (${variancePercent}%)`,
        thresholdValue: `±${dailyTolPct}%`,
        status: 'OPEN',
        createdAtIso: nowIso,
        slaHours: 4,
      });
    }

    if (rolling30DayBreached) {
      sirAlerts.push({
        code: 'SIR_30DAY_DRIFT',
        severity: 'CRITICAL',
        targetId: tk.tankId,
        message: `Tank ${tk.tankId} 30-day rolling cumulative SIR drift ${rolling30DayDriftPercent}% exceeds ±${rolling30TolPct}% leak threshold.`,
      });
      generatedNcrs.push({
        id: `NCR-SIR-${payload.shiftId}-${tk.tankId}`.replace(/[^A-Z0-9-]/gi, ''),
        siteCode: payload.siteCode,
        category: 'SIR_30DAY_DRIFT',
        severity: 'CRITICAL',
        title: `30-Day Rolling SIR Leak Drift on ${tk.tankId}`,
        description: `Cumulative 30-day SIR variance reached ${rolling30DayDriftPercent}% (${Math.round(rollingVar)}L across ${Math.round(rollingThroughput)}L throughput). Initiate line tightness & sump inspection.`,
        statutoryReference: 'SANS 10089-3 SIR Trend Governance',
        measuredValue: `${rolling30DayDriftPercent}%`,
        thresholdValue: `±${rolling30TolPct}%`,
        status: 'OPEN',
        createdAtIso: nowIso,
        slaHours: 4,
      });
    }

    if (waterStatus.status === 'CRITICAL') {
      sirAlerts.push({
        code: 'WATER_INGRESS',
        severity: 'CRITICAL',
        targetId: tk.tankId,
        message: waterStatus.alertMessage,
      });
      generatedNcrs.push({
        id: `NCR-H2O-${payload.shiftId}-${tk.tankId}`.replace(/[^A-Z0-9-]/gi, ''),
        siteCode: payload.siteCode,
        category: 'WATER_INGRESS',
        severity: 'CRITICAL',
        title: `Water Interface Ingress on ${tk.tankId} (${tk.fuelGrade})`,
        description: waterStatus.alertMessage,
        statutoryReference: 'SANS 10089-3 Tank Integrity',
        measuredValue: `${tk.waterLevelMm} mm`,
        thresholdValue: `${waterStatus.maxAllowedMm} mm`,
        status: 'OPEN',
        createdAtIso: nowIso,
        slaHours: 2,
      });
    }

    const status: TankShiftReconciliationItem['status'] =
      dailyThresholdBreached || rolling30DayBreached || waterStatus.status === 'CRITICAL'
        ? 'CRITICAL_BREACH'
        : waterStatus.status === 'WARNING'
          ? 'WARNING'
          : 'COMPLIANT';

    return {
      tankId: tk.tankId,
      fuelGrade: tk.fuelGrade,
      openingLitres: tk.openingLitres,
      deliveryLitres: tk.deliveryLitres,
      netDispensedLitres,
      bookStockLitres,
      actualClosingLitres,
      varianceLitres,
      variancePercent,
      rolling30DayDriftPercent,
      waterStatus,
      dailyThresholdBreached,
      rolling30DayBreached,
      status,
    };
  });

  // 4. Shift Cash-Up Summary
  const grossFuel = payload.fuelSalesByGrade.reduce((s, f) => s + f.posSalesValueLocal, 0);
  const driveOffDeductionLocal =
    Math.round(payload.fuelSalesByGrade.reduce((s, f) => s + f.driveOffValueLocal, 0) * 100) / 100;
  const expectedFuelRevenueLocal = Math.round((grossFuel - driveOffDeductionLocal) * 100) / 100;
  const expectedShopRevenueLocal = Math.round(payload.shopSales.totalShopSalesLocal * 100) / 100;
  const expectedTotalLocal =
    Math.round((expectedFuelRevenueLocal + expectedShopRevenueLocal) * 100) / 100;

  const td = payload.tenders;
  const totalTenderedLocal =
    Math.round(
      (td.cashDropsLocal +
        td.cashOnHandLocal +
        td.speedpointCardLocal +
        td.fleetCardLocal +
        td.eftLocal +
        td.vouchersLocal) *
        100
    ) / 100;

  const cashVarianceLocal = Math.round((totalTenderedLocal - expectedTotalLocal) * 100) / 100;
  const withinTolerance = Math.abs(cashVarianceLocal) <= cashTolLocal;

  if (!withinTolerance) {
    const severity = Math.abs(cashVarianceLocal) > cashTolLocal * 4 ? 'CRITICAL' : 'WARNING';
    sirAlerts.push({
      code: 'CASH_UP_VARIANCE',
      severity,
      targetId: payload.shiftId,
      message: `Shift cash-up ${cashVarianceLocal < 0 ? 'SHORT' : 'OVER'} of ${payload.currency} ${cashVarianceLocal} exceeds ±${cashTolLocal}.`,
    });
    generatedNcrs.push({
      id: `NCR-CSH-${payload.shiftId}`.replace(/[^A-Z0-9-]/gi, ''),
      siteCode: payload.siteCode,
      category: 'CASH_UP_VARIANCE',
      severity,
      title: `Shift Cash-Up ${cashVarianceLocal < 0 ? 'Shortage' : 'Overage'} (${payload.shiftId})`,
      description: `Expected ${payload.currency} ${expectedTotalLocal.toLocaleString()} vs Tendered ${payload.currency} ${totalTenderedLocal.toLocaleString()} (Variance: ${cashVarianceLocal}).`,
      statutoryReference: 'Forecourt Cash Control & Till Audit SOP',
      measuredValue: `${payload.currency} ${cashVarianceLocal}`,
      thresholdValue: `±${payload.currency} ${cashTolLocal}`,
      status: 'OPEN',
      createdAtIso: nowIso,
      slaHours: 8,
    });
  }

  const hasCritical =
    tankResults.some((t) => t.status === 'CRITICAL_BREACH') ||
    sirAlerts.some((a) => a.severity === 'CRITICAL');
  const hasWarning =
    tankResults.some((t) => t.status === 'WARNING') || sirAlerts.length > 0;

  return {
    ingestionId: payload.ingestionId,
    siteCode: payload.siteCode,
    shiftId: payload.shiftId,
    sourceVendors: payload.sourceVendors,
    tankResults,
    nozzleResults,
    gradeMeterComparison,
    cashUpSummary: {
      expectedFuelRevenueLocal,
      expectedShopRevenueLocal,
      driveOffDeductionLocal,
      expectedTotalLocal,
      totalTenderedLocal,
      cashVarianceLocal,
      withinTolerance,
    },
    sirAlerts,
    generatedNcrs,
    overallStatus: hasCritical ? 'CRITICAL_BREACH' : hasWarning ? 'WARNING' : 'COMPLIANT',
  };
}

// --- Forecourt, Tank & Oil/Water Interceptor Cleaning Logs ---

export type CleaningTaskArea =
  | 'OIL_WATER_INTERCEPTOR'
  | 'BUND_WALL_CONTAINMENT'
  | 'DISPENSER_SUMPS_UDC'
  | 'SPILL_KIT_AUDIT'
  | 'CANOPY_ISLAND_DEGREASE'
  | 'UST_TANK_CLEANING_INTEGRITY';

export interface CleaningChecklistTemplate {
  area: CleaningTaskArea;
  title: string;
  frequency: string;
  statutoryRef: string;
  steps: string[];
}

export const CLEANING_CHECKLIST_TEMPLATES: CleaningChecklistTemplate[] = [
  {
    area: 'OIL_WATER_INTERCEPTOR',
    title: 'Oil/Water Separator (Interceptor) Inspection & Skimming',
    frequency: 'Weekly / Post-Spill',
    statutoryRef: 'NEMA 107 of 1998 & Municipal Effluent Bylaw',
    steps: [
      'Measure hydrocarbon layer thickness in Chamber 1 & 2 (< 25mm)',
      'Verify outlet weir & coalescer plates clear of sludge',
      'Transfer skimmed waste oil to sealed hazardous waste drum',
    ],
  },
  {
    area: 'BUND_WALL_CONTAINMENT',
    title: 'Tank Farm & Generator Bund Wall Integrity Check',
    frequency: 'Weekly',
    statutoryRef: 'SANS 10089-1 Sec 4.4',
    steps: [
      'Confirm bund drain valve is locked closed',
      'Inspect bund floor and walls for cracks or hydrocarbon sheen',
      'Pump out uncontaminated rainwater only after sheen test passes',
    ],
  },
  {
    area: 'DISPENSER_SUMPS_UDC',
    title: 'Dispenser Sumps & Under-Dispenser Containment (UDC) Inspection',
    frequency: 'Weekly',
    statutoryRef: 'SANS 10089-3 Sec 6.2',
    steps: [
      'Lift dispenser panels and inspect UDC pans for dry state',
      'Verify shear valve fusible links and breakaway couplings intact',
      'Clean dust/debris using non-sparking antistatic brush',
    ],
  },
  {
    area: 'SPILL_KIT_AUDIT',
    title: 'Forecourt Spill Kit Seal & Single-Use Stock Audit',
    frequency: 'Every Shift / Post-Use',
    statutoryRef: 'SANS 10263 / OHS Act Sec 8',
    steps: [
      'Confirm tamper seal intact or replace single-use absorbents immediately',
      'Verify PPE nitrile gloves, goggles, non-sparking broom & dry sand stocked',
      'Check old-oil disposal drum capacity (< 75% full)',
    ],
  },
  {
    area: 'CANOPY_ISLAND_DEGREASE',
    title: 'Forecourt Apron, Canopy & Pump Island Degreasing',
    frequency: 'Daily / Shift Handover',
    statutoryRef: 'OHS Act GSR 2 / Slip-Trip Prevention',
    steps: [
      'Ensure interceptor valve closed before biodegradable degreaser wash',
      'Scrub pump island concrete apron to eliminate diesel slip hazards',
      'Verify bollard & nozzle boot cleanliness',
    ],
  },
  {
    area: 'UST_TANK_CLEANING_INTEGRITY',
    title: 'Underground Storage Tank (UST) Manhole & Sump Cleaning',
    frequency: 'Monthly',
    statutoryRef: 'SANS 10089-3 / MHI Regs',
    steps: [
      'Inspect fill-pipe spill containment buckets & drain back valves',
      'Verify tank grade colour-coding & lockable fill caps',
      'Clear water/sediment from STP turret sumps and log water-paste check',
    ],
  },
];

export interface CleaningLogEntry {
  id: string;
  siteCode: string;
  area: CleaningTaskArea;
  title: string;
  completedSteps: string[];
  photoFileName: string;
  supervisorName: string;
  notes: string;
  timestampIso: string;
  sha256Hash: string;
}

const CLEANING_LOGS_STORAGE_KEY = 'forecourt_cleaning_logs_v1';

export function loadCleaningLogs(): CleaningLogEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CLEANING_LOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveCleaningLogEntry(entry: CleaningLogEntry): CleaningLogEntry[] {
  const existing = loadCleaningLogs();
  const updated = [entry, ...existing];
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(CLEANING_LOGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

