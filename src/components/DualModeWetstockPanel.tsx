import React, { useState, useEffect, useMemo } from 'react';
import {
  Radio,
  Sliders,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Thermometer,
  Gauge,
  Fuel,
  RotateCcw,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { hashAuditSignature } from '../popiActCompliance';

export const WETSTOCK_ROLLOVER_STORAGE_KEY = 'forecourt_wetstock_rollover_v1';

export type WetstockMode = 'ATG' | 'MANUAL';
export type DualModeTankId = 'TK-ULP95-01' | 'TK-AGO50-02';

export interface TankShiftState {
  tankId: DualModeTankId;
  tankLabel: string;
  productType: 'PETROL' | 'DIESEL';
  alphaCoeff: number; // thermal expansion coefficient per °C
  shiftNumber: number;
  openingDipLitres: number;
  morningVerifyDipLitres: number;
  deliveryEbolLitres: number;
  deliveryTempC: number;
  openingMeterTotalizer: number;
  closingMeterTotalizer: number;
  pumpTestReturnLitres: number;
  closingDipLitres: number;
  tankTempC: number;
}

export interface ShiftRolloverAuditEntry {
  id: string;
  tankId: DualModeTankId;
  tankLabel: string;
  shiftNumber: number;
  mode: WetstockMode;
  lockedClosingDipLitres: number;
  lockedClosingMeterTotalizer: number;
  varianceLitres: number;
  variancePercent: number;
  sha256Hash: string;
  timestamp: string;
}

const DEFAULT_TANKS: Record<DualModeTankId, TankShiftState> = {
  'TK-ULP95-01': {
    tankId: 'TK-ULP95-01',
    tankLabel: 'ULP 95 Unleaded Petrol — Tank 1 (30,000L)',
    productType: 'PETROL',
    alphaCoeff: 0.0012,
    shiftNumber: 1,
    openingDipLitres: 14200,
    morningVerifyDipLitres: 14200,
    deliveryEbolLitres: 12000,
    deliveryTempC: 15,
    openingMeterTotalizer: 150000,
    closingMeterTotalizer: 157850,
    pumpTestReturnLitres: 0,
    closingDipLitres: 18340,
    tankTempC: 15,
  },
  'TK-AGO50-02': {
    tankId: 'TK-AGO50-02',
    tankLabel: 'AGO 50ppm Diesel — Tank 2 (35,000L)',
    productType: 'DIESEL',
    alphaCoeff: 0.00085,
    shiftNumber: 1,
    openingDipLitres: 19800,
    morningVerifyDipLitres: 19800,
    deliveryEbolLitres: 16000,
    deliveryTempC: 15,
    openingMeterTotalizer: 280000,
    closingMeterTotalizer: 291400,
    pumpTestReturnLitres: 0,
    closingDipLitres: 24385,
    tankTempC: 15,
  },
};

interface PersistedRolloverPayload {
  tanks: Record<DualModeTankId, TankShiftState>;
  history: ShiftRolloverAuditEntry[];
}

function loadRolloverState(): PersistedRolloverPayload {
  try {
    const raw = localStorage.getItem(WETSTOCK_ROLLOVER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.tanks && parsed.history) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return {
    tanks: {
      'TK-ULP95-01': { ...DEFAULT_TANKS['TK-ULP95-01'] },
      'TK-AGO50-02': { ...DEFAULT_TANKS['TK-AGO50-02'] },
    },
    history: [],
  };
}

export const DualModeWetstockPanel: React.FC = () => {
  const [mode, setMode] = useState<WetstockMode>('MANUAL');
  const [activeTankId, setActiveTankId] = useState<DualModeTankId>('TK-ULP95-01');
  const [tanksState, setTanksState] = useState<Record<DualModeTankId, TankShiftState>>(
    () => loadRolloverState().tanks
  );
  const [rolloverHistory, setRolloverHistory] = useState<ShiftRolloverAuditEntry[]>(
    () => loadRolloverState().history
  );
  const [rolloverBanner, setRolloverBanner] = useState<string>('');

  const tank = tanksState[activeTankId];

  useEffect(() => {
    const loaded = loadRolloverState();
    setTanksState(loaded.tanks);
    setRolloverHistory(loaded.history);
  }, []);

  const updateTankField = (field: keyof TankShiftState, value: number) => {
    setTanksState((prev) => ({
      ...prev,
      [activeTankId]: {
        ...prev[activeTankId],
        [field]: Number.isNaN(value) ? 0 : value,
      },
    }));
  };

  // Mass-Balance & 15°C Thermal VCF Calculations
  const metrics = useMemo(() => {
    // Overnight static check (Morning Physical Verification Dip vs Previous Night Locked Closing Dip)
    const overnightStaticDiff = Math.round(tank.morningVerifyDipLitres - tank.openingDipLitres);
    const hasOvernightStaticLoss = Math.abs(overnightStaticDiff) > 15;

    // 15°C Volume Correction Factor (VCF = 1 - alpha * (T - 15))
    const deliveryVcf = 1 - tank.alphaCoeff * (tank.deliveryTempC - 15);
    const netDelivery15C = Math.round(tank.deliveryEbolLitres * deliveryVcf * 10) / 10;

    // Pump Totalizer Metered Sales
    const rawMeterDiff = Math.max(0, tank.closingMeterTotalizer - tank.openingMeterTotalizer);
    const netMeteredSales = Math.max(0, Math.round((rawMeterDiff - tank.pumpTestReturnLitres) * 10) / 10);

    // Book Closing Stock
    const bookClosingStock = Math.round((tank.openingDipLitres + netDelivery15C - netMeteredSales) * 10) / 10;

    // 15°C Normalized Physical Closing Dip
    const closingVcf = 1 - tank.alphaCoeff * (tank.tankTempC - 15);
    const physicalClosing15C = Math.round(tank.closingDipLitres * closingVcf * 10) / 10;

    // Daily Variance
    const varianceLitres = Math.round((physicalClosing15C - bookClosingStock) * 10) / 10;
    const denominator = Math.max(netMeteredSales, bookClosingStock, 1);
    const variancePercent = Math.round((varianceLitres / denominator) * 10000) / 100;
    const isOutOfTolerance = Math.abs(variancePercent) > 0.25;

    return {
      overnightStaticDiff,
      hasOvernightStaticLoss,
      netDelivery15C,
      netMeteredSales,
      bookClosingStock,
      physicalClosing15C,
      varianceLitres,
      variancePercent,
      isOutOfTolerance,
    };
  }, [tank]);

  const handleLockShiftAndRollOver = async () => {
    const nowIso = new Date().toISOString();
    const lockedDip = tank.closingDipLitres;
    const lockedMeter = tank.closingMeterTotalizer;
    const nextShiftNum = tank.shiftNumber + 1;

    let sha256Hash = `ROLLOVER-${activeTankId}-S${tank.shiftNumber}-${Date.now()}`;
    try {
      sha256Hash = await hashAuditSignature(
        `${activeTankId}|S${tank.shiftNumber}|DIP:${lockedDip}|METER:${lockedMeter}|VAR:${metrics.varianceLitres}|${nowIso}`
      );
    } catch {
      // keep fallback hash if subtle crypto unavailable
    }

    const auditEntry: ShiftRolloverAuditEntry = {
      id: `SHF-${activeTankId}-S${tank.shiftNumber}-${Date.now().toString(36).toUpperCase()}`,
      tankId: activeTankId,
      tankLabel: tank.tankLabel,
      shiftNumber: tank.shiftNumber,
      mode,
      lockedClosingDipLitres: lockedDip,
      lockedClosingMeterTotalizer: lockedMeter,
      varianceLitres: metrics.varianceLitres,
      variancePercent: metrics.variancePercent,
      sha256Hash,
      timestamp: nowIso,
    };

    // Roll closing figures into next shift's opening figures
    const rolledTank: TankShiftState = {
      ...tank,
      shiftNumber: nextShiftNum,
      openingDipLitres: lockedDip,
      morningVerifyDipLitres: lockedDip,
      deliveryEbolLitres: 0,
      deliveryTempC: 15,
      openingMeterTotalizer: lockedMeter,
      closingMeterTotalizer: lockedMeter,
      pumpTestReturnLitres: 0,
      closingDipLitres: lockedDip,
      tankTempC: 15,
    };

    const nextTanks = {
      ...tanksState,
      [activeTankId]: rolledTank,
    };
    const nextHistory = [auditEntry, ...rolloverHistory];

    setTanksState(nextTanks);
    setRolloverHistory(nextHistory);
    setRolloverBanner(
      `Shift #${tank.shiftNumber} locked! Closing Dip (${lockedDip} L) and Closing Meter (${lockedMeter} L) rolled over as Shift #${nextShiftNum} Opening Dip & Opening Meter.`
    );

    try {
      localStorage.setItem(
        WETSTOCK_ROLLOVER_STORAGE_KEY,
        JSON.stringify({ tanks: nextTanks, history: nextHistory })
      );
    } catch {
      // ignore
    }
  };

  const handleResetDemo = () => {
    const fresh = {
      tanks: {
        'TK-ULP95-01': { ...DEFAULT_TANKS['TK-ULP95-01'] },
        'TK-AGO50-02': { ...DEFAULT_TANKS['TK-AGO50-02'] },
      },
      history: [],
    };
    setTanksState(fresh.tanks);
    setRolloverHistory([]);
    setRolloverBanner('');
    try {
      localStorage.removeItem(WETSTOCK_ROLLOVER_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <section
      data-testid="dual-mode-wetstock-panel"
      className="p-6 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 shadow-2xl space-y-6"
    >
      {/* Top Bar: Mode Switcher (ATG Telemetry vs Manual Dip & Pump Totalizer) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-500/30">
              Dual-Mode Wetstock Architecture
            </span>
            <span
              data-testid="wetstock-active-shift-badge"
              className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black font-mono border border-amber-500/40"
            >
              Active Shift #{tank.shiftNumber}
            </span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            ATG Telemetry &amp; Manual Dip / Pump Totalizer Shift Reconciliation
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Supports both automated ATG probe stations and non-ATG sites using manual dipsticks, pump totalizer meters, and next-morning shift rollover.
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800"
          role="group"
          aria-label="Wetstock Operating Mode"
        >
          <button
            type="button"
            data-testid="wetstock-mode-manual-btn"
            onClick={() => setMode('MANUAL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              mode === 'MANUAL'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manual Dip &amp; Pump Totalizer Mode</span>
          </button>

          <button
            type="button"
            data-testid="wetstock-mode-atg-btn"
            onClick={() => setMode('ATG')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              mode === 'ATG'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>ATG Automated Telemetry Mode</span>
          </button>
        </div>
      </div>

      {/* Mode Callout / Upsell Banner */}
      {mode === 'MANUAL' ? (
        <div
          data-testid="wetstock-manual-upsell-banner"
          className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div className="space-y-0.5">
            <div className="font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>MANUAL DIP &amp; PUMP TOTALIZER MODE ACTIVE (NO ATG HARDWARE REQUIRED)</span>
            </div>
            <p className="text-slate-200">
              Enter physical dipstick readings, tanker eBOL deliveries, and mechanical/electronic pump meter totalizers below. Upgrade to an approved ATG probe (Veeder-Root TLS-450+ / Franklin EVO) anytime for automated 15°C telemetry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode('ATG')}
            className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-500/40 whitespace-nowrap transition"
          >
            Preview ATG Mode →
          </button>
        </div>
      ) : (
        <div
          data-testid="wetstock-atg-active-banner"
          className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div className="space-y-0.5">
            <div className="font-black text-cyan-300 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>ATG AUTOMATED TELEMETRY MODE ACTIVE (LIVE PROBE + PTS CONTROLLER SYNC)</span>
            </div>
            <p className="text-slate-200">
              Tank levels, 15°C density compensation, water-paste detection, and dispenser pump totalizers are streamed from the forecourt controller. Manual override remains available for dip verification.
            </p>
          </div>
        </div>
      )}

      {/* Tank Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['TK-ULP95-01', 'TK-AGO50-02'] as const).map((id) => {
            const tItem = tanksState[id];
            const isSelected = activeTankId === id;
            return (
              <button
                key={id}
                type="button"
                data-testid={`select-tank-${id}`}
                onClick={() => setActiveTankId(id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 border transition ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                    : 'bg-slate-950 text-slate-200 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Fuel className="w-4 h-4" />
                <span>{tItem.tankLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleResetDemo}
          aria-label="Reset Shift Rollover Ledger"
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Shift Demo</span>
        </button>
      </div>

      {/* Rollover Confirmation Banner */}
      {rolloverBanner && (
        <div
          role="status"
          data-testid="wetstock-rollover-status-banner"
          className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{rolloverBanner}</span>
        </div>
      )}

      {/* 4-Column Reconciliation Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Opening Stock & Morning Verification Dip */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-black uppercase text-amber-400 flex items-center justify-between">
            <span>1. Opening Stock (Rollover)</span>
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div>
            <label
              htmlFor="wetstock-opening-dip-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Opening Dip (Litres — Locked from Prev Close):
            </label>
            <input
              id="wetstock-opening-dip-input"
              data-testid="wetstock-opening-dip-input"
              type="number"
              value={tank.openingDipLitres}
              onChange={(e) => updateTankField('openingDipLitres', parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-black text-amber-300"
            />
          </div>

          <div>
            <label
              htmlFor="wetstock-morning-verify-dip-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Morning Physical Verification Dip (L):
            </label>
            <input
              id="wetstock-morning-verify-dip-input"
              data-testid="wetstock-morning-verify-dip-input"
              type="number"
              value={tank.morningVerifyDipLitres}
              onChange={(e) => updateTankField('morningVerifyDipLitres', parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white"
            />
          </div>

          {metrics.hasOvernightStaticLoss ? (
            <div
              data-testid="overnight-static-loss-alert"
              className="p-2 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-bold"
            >
              ⚠️ Overnight Static Discrepancy: {metrics.overnightStaticDiff} L (Check for night siphoning or tank leak!)
            </div>
          ) : (
            <div className="text-xs text-emerald-400 font-mono">
              ✓ Overnight Static Check Verified ({metrics.overnightStaticDiff} L diff)
            </div>
          )}
        </div>

        {/* Card 2: Tanker Deliveries Received (15°C VCF) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-black uppercase text-cyan-400 flex items-center justify-between">
            <span>2. Tanker Deliveries (eBOL)</span>
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div>
            <label
              htmlFor="wetstock-delivery-litres-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Delivery eBOL Volume (Litres):
            </label>
            <input
              id="wetstock-delivery-litres-input"
              data-testid="wetstock-delivery-litres-input"
              type="number"
              value={tank.deliveryEbolLitres}
              onChange={(e) => updateTankField('deliveryEbolLitres', parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white"
            />
          </div>

          <div>
            <label
              htmlFor="wetstock-delivery-temp-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Delivery Temperature (°C):
            </label>
            <input
              id="wetstock-delivery-temp-input"
              data-testid="wetstock-delivery-temp-input"
              type="number"
              step="0.5"
              value={tank.deliveryTempC}
              onChange={(e) => updateTankField('deliveryTempC', parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white"
            />
          </div>

          <div className="text-xs text-cyan-300 font-mono">
            15°C Net Delivery: <strong>{metrics.netDelivery15C.toLocaleString()} L</strong>
          </div>
        </div>

        {/* Card 3: Pump Meter Totalizer Readings */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-black uppercase text-purple-300 flex items-center justify-between">
            <span>3. Pump Meter Totalizers</span>
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="wetstock-opening-meter-input"
                className="text-xs text-slate-300 font-bold block mb-1"
              >
                Opening Meter:
              </label>
              <input
                id="wetstock-opening-meter-input"
                data-testid="wetstock-opening-meter-input"
                type="number"
                value={tank.openingMeterTotalizer}
                onChange={(e) =>
                  updateTankField('openingMeterTotalizer', parseFloat(e.target.value))
                }
                className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300"
              />
            </div>

            <div>
              <label
                htmlFor="wetstock-closing-meter-input"
                className="text-xs text-slate-300 font-bold block mb-1"
              >
                Closing Meter:
              </label>
              <input
                id="wetstock-closing-meter-input"
                data-testid="wetstock-closing-meter-input"
                type="number"
                value={tank.closingMeterTotalizer}
                onChange={(e) =>
                  updateTankField('closingMeterTotalizer', parseFloat(e.target.value))
                }
                className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="wetstock-pump-test-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Pump Calibration Return (L):
            </label>
            <input
              id="wetstock-pump-test-input"
              data-testid="wetstock-pump-test-input"
              type="number"
              value={tank.pumpTestReturnLitres}
              onChange={(e) => updateTankField('pumpTestReturnLitres', parseFloat(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
            />
          </div>

          <div
            data-testid="wetstock-net-sales-value"
            className="text-xs text-purple-300 font-mono"
          >
            Net Metered Sales: <strong>{metrics.netMeteredSales.toLocaleString()} L</strong>
          </div>
        </div>

        {/* Card 4: Physical Closing Dip & Next-Morning Rollover */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-black uppercase text-emerald-400 flex items-center justify-between">
            <span>4. Closing Dip &amp; Rollover</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div>
            <label
              htmlFor="wetstock-closing-dip-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              {mode === 'ATG' ? 'ATG Probe Closing Volume (L):' : 'Physical Closing Dipstick (L):'}
            </label>
            <input
              id="wetstock-closing-dip-input"
              data-testid="wetstock-closing-dip-input"
              type="number"
              value={tank.closingDipLitres}
              onChange={(e) => updateTankField('closingDipLitres', parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-sm font-mono font-black text-emerald-300"
            />
          </div>

          <div>
            <label
              htmlFor="wetstock-tank-temp-input"
              className="text-xs text-slate-300 font-bold block mb-1"
            >
              Tank Fuel Temp (°C):
            </label>
            <input
              id="wetstock-tank-temp-input"
              data-testid="wetstock-tank-temp-input"
              type="number"
              step="0.5"
              value={tank.tankTempC}
              onChange={(e) => updateTankField('tankTempC', parseFloat(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
            />
          </div>

          <div className="text-xs text-emerald-300 font-mono">
            15°C Closing Stock: <strong>{metrics.physicalClosing15C.toLocaleString()} L</strong>
          </div>
        </div>
      </div>

      {/* Mass-Balance Summary & Next-Morning Shift Rollover Action Bar */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-300 block">Expected Book Closing Stock:</span>
            <strong
              data-testid="wetstock-book-closing-value"
              className="text-base font-mono font-black text-white"
            >
              {metrics.bookClosingStock.toLocaleString()} L
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-300 block">Daily Wetstock Variance:</span>
            <strong
              data-testid="wetstock-variance-value"
              className={`text-base font-mono font-black ${
                metrics.isOutOfTolerance ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {metrics.varianceLitres > 0
                ? `+${metrics.varianceLitres}`
                : metrics.varianceLitres}{' '}
              L ({metrics.variancePercent}%)
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            {metrics.isOutOfTolerance ? (
              <div
                data-testid="wetstock-loss-alert"
                className="text-red-400 font-bold flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>WETSTOCK LOSS / LEAK INVESTIGATION REQUIRED (&gt; ±0.25%)</span>
              </div>
            ) : (
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>WITHIN ±0.25% STATUTORY TOLERANCE</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          data-testid="wetstock-lock-rollover-btn"
          onClick={handleLockShiftAndRollOver}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 whitespace-nowrap transition"
        >
          <Lock className="w-4 h-4" />
          <span>Lock Shift &amp; Roll Over to Tomorrow&apos;s Opening</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Persisted Shift Rollover Audit Trail */}
      {rolloverHistory.length > 0 && (
        <div
          data-testid="wetstock-rollover-history"
          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
        >
          <div className="font-black text-slate-200 uppercase flex items-center gap-1.5">
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
            <span>Locked Shift Rollover Ledger ({rolloverHistory.length} shifts recorded)</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono">
            {rolloverHistory.map((item) => (
              <div
                key={item.id}
                data-testid="wetstock-rollover-history-row"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-200"
              >
                <span>
                  <strong className="text-amber-300">Shift #{item.shiftNumber}</strong> ({item.mode}) —{' '}
                  {item.tankId}
                </span>
                <span>
                  Closing Dip → Next Open: <strong>{item.lockedClosingDipLitres} L</strong> | Meter → Next Open:{' '}
                  <strong>{item.lockedClosingMeterTotalizer} L</strong>
                </span>
                <span className="text-slate-300">
                  Var: {item.varianceLitres} L ({item.variancePercent}%) • SHA-256: {item.sha256Hash.slice(0, 12)}...
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

