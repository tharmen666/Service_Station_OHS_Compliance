import React, { useState, useEffect } from 'react';
import {
  Thermometer,
  Flame,
  CalendarCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  Utensils,
} from 'lucide-react';
import { addNcrs, NonConformanceReport } from '../lib/ncrStore';
import { getActiveTenant } from '../multiTenantConfig';
import { hashAuditSignature } from '../popiActCompliance';

interface ColdChainUnit {
  id: string;
  name: string;
  unitType: 'CHILLER' | 'FREEZER' | 'HOT_HOLD';
  targetRangeLabel: string;
  minC: number;
  maxC: number;
  lastTempC: number;
  lastCheckedAt: string;
  checkedBy: string;
  compliant: boolean;
}

interface FifoItem {
  id: string;
  productName: string;
  category: string;
  batchCode: string;
  expiryDate: string;
  fifoRotated: boolean;
}

interface KitchenCleaningEntry {
  id: string;
  area: string;
  suppressionGaugeGreen: boolean;
  hoodDegreased: boolean;
  supervisorName: string;
  timestamp: string;
  sha256Hash: string;
}

const STORAGE_KEY = 'forecourt_r638_haccp_v1';

const DEFAULT_UNITS: ColdChainUnit[] = [
  {
    id: 'UNIT-CHILL-01',
    name: 'Walk-In Cold Room (Dairy & Drinks)',
    unitType: 'CHILLER',
    targetRangeLabel: '0°C to +5°C',
    minC: 0,
    maxC: 5,
    lastTempC: 3.4,
    lastCheckedAt: '08:00',
    checkedBy: 'Cashier Supervisor B',
    compliant: true,
  },
  {
    id: 'UNIT-FRZ-01',
    name: 'Frozen Bakery & Pie Freezer',
    unitType: 'FREEZER',
    targetRangeLabel: '≤ -18°C',
    minC: -40,
    maxC: -18,
    lastTempC: -19.5,
    lastCheckedAt: '08:00',
    checkedBy: 'QSR Lead A',
    compliant: true,
  },
  {
    id: 'UNIT-HOT-01',
    name: 'Hot-Holding Pie & Chicken Cabinet',
    unitType: 'HOT_HOLD',
    targetRangeLabel: '≥ +65°C (Core ≥ +75°C)',
    minC: 65,
    maxC: 110,
    lastTempC: 68.5,
    lastCheckedAt: '08:00',
    checkedBy: 'QSR Lead A',
    compliant: true,
  },
];

const DEFAULT_FIFO: FifoItem[] = [
  {
    id: 'FIFO-01',
    productName: 'Fresh Dairy & Yoghurt Tray',
    category: 'Chilled Dairy',
    batchCode: 'B-2611-A',
    expiryDate: '2026-12-03',
    fifoRotated: true,
  },
  {
    id: 'FIFO-02',
    productName: 'Pre-Packed Sandwiches & Wraps',
    category: 'Grab-and-Go Deli',
    batchCode: 'B-2611-D',
    expiryDate: '2026-11-28',
    fifoRotated: true,
  },
];

export const ShopFoodServiceR638: React.FC = () => {
  const tenant = getActiveTenant();
  const [units, setUnits] = useState<ColdChainUnit[]>(DEFAULT_UNITS);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(DEFAULT_UNITS[0].id);
  const [tempInput, setTempInput] = useState<string>('3.5');
  const [checkerInput, setCheckerInput] = useState<string>('QSR Food Handler A');
  const [tempFeedback, setTempFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const [fifoItems, setFifoItems] = useState<FifoItem[]>(DEFAULT_FIFO);
  const [newProduct, setNewProduct] = useState<string>('');
  const [newExpiry, setNewExpiry] = useState<string>('2026-12-10');

  const [hoodDegreased, setHoodDegreased] = useState<boolean>(true);
  const [suppressionGaugeGreen, setSuppressionGaugeGreen] = useState<boolean>(true);
  const [greaseTrapCleared, setGreaseTrapCleared] = useState<boolean>(true);
  const [foodHandlerHygieneOk, setFoodHandlerHygieneOk] = useState<boolean>(true);
  const [kitchenSupervisor, setKitchenSupervisor] = useState<string>('Section 16.2 Food Supervisor');
  const [kitchenLogs, setKitchenLogs] = useState<KitchenCleaningEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.units)) setUnits(parsed.units);
        if (Array.isArray(parsed.fifoItems)) setFifoItems(parsed.fifoItems);
        if (Array.isArray(parsed.kitchenLogs)) setKitchenLogs(parsed.kitchenLogs);
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (nextUnits: ColdChainUnit[], nextFifo: FifoItem[], nextLogs: KitchenCleaningEntry[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ units: nextUnits, fifoItems: nextFifo, kitchenLogs: nextLogs })
      );
    } catch {
      // ignore
    }
  };

  const handleLogTemperature = (e: React.FormEvent) => {
    e.preventDefault();
    const numericTemp = parseFloat(tempInput);
    if (Number.isNaN(numericTemp)) return;

    const target = units.find((u) => u.id === selectedUnitId);
    if (!target) return;

    const isCompliant = numericTemp >= target.minC && numericTemp <= target.maxC;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nextUnits = units.map((u) =>
      u.id === selectedUnitId
        ? {
            ...u,
            lastTempC: numericTemp,
            lastCheckedAt: nowTime,
            checkedBy: checkerInput.trim() || 'Food Handler',
            compliant: isCompliant,
          }
        : u
    );
    setUnits(nextUnits);
    persist(nextUnits, fifoItems, kitchenLogs);

    if (!isCompliant) {
      const ncr: NonConformanceReport = {
        id: `NCR-R638-${target.id}-${Date.now().toString(36).toUpperCase()}`,
        siteCode: tenant.siteCode,
        category: 'R638_HACCP',
        severity: 'CRITICAL',
        title: `R638 Cold-Chain / Hot-Hold Breach: ${target.name}`,
        description: `Measured ${numericTemp}°C outside mandatory Regulation R638 / SANS 10049 range (${target.targetRangeLabel}). Quarantine affected stock & recalibrate thermostat.`,
        statutoryReference: 'Regulation R638 of 2018 / SANS 10049 HACCP',
        measuredValue: `${numericTemp}°C`,
        thresholdValue: target.targetRangeLabel,
        status: 'OPEN',
        createdAtIso: new Date().toISOString(),
        slaHours: 2,
      };
      addNcrs([ncr]);
      setTempFeedback({
        ok: false,
        msg: `BREACH LOGGED (${numericTemp}°C): Out of range (${target.targetRangeLabel}). Automated R638 NCR opened in Pillar 4!`,
      });
    } else {
      setTempFeedback({
        ok: true,
        msg: `✓ ${target.name} verified at ${numericTemp}°C (Compliant with ${target.targetRangeLabel}).`,
      });
    }
  };

  const handleAddFifo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.trim()) return;
    const item: FifoItem = {
      id: `FIFO-${Date.now().toString(36).toUpperCase()}`,
      productName: newProduct.trim(),
      category: 'Convenience / QSR',
      batchCode: `B-${new Date().toISOString().slice(5, 10).replace('-', '')}`,
      expiryDate: newExpiry,
      fifoRotated: true,
    };
    const nextFifo = [item, ...fifoItems];
    setFifoItems(nextFifo);
    setNewProduct('');
    persist(units, nextFifo, kitchenLogs);
  };

  const handleSignKitchenChecklist = async () => {
    const ts = new Date().toISOString();
    let sha = `R638-${Date.now()}`;
    try {
      sha = await hashAuditSignature(
        `R638_KITCHEN|${tenant.siteCode}|HOOD:${hoodDegreased}|SUPP:${suppressionGaugeGreen}|GREASE:${greaseTrapCleared}|HYGIENE:${foodHandlerHygieneOk}|${ts}`
      );
    } catch {
      // ignore
    }

    if (!suppressionGaugeGreen || !foodHandlerHygieneOk) {
      addNcrs([
        {
          id: `NCR-R638-KIT-${Date.now().toString(36).toUpperCase()}`,
          siteCode: tenant.siteCode,
          category: 'R638_HACCP',
          severity: 'CRITICAL',
          title: 'Kitchen Fire Suppression / Food Handler Hygiene Non-Conformance',
          description: `Kitchen check flagged suppression gauge green=${suppressionGaugeGreen}, food handler hygiene=${foodHandlerHygieneOk}.`,
          statutoryReference: 'Regulation R638 & SANS 10049 / OHS Act',
          measuredValue: 'Non-Compliant Check',
          thresholdValue: '100% Pass Required',
          status: 'OPEN',
          createdAtIso: ts,
          slaHours: 2,
        },
      ]);
    }

    const entry: KitchenCleaningEntry = {
      id: `KIT-${Date.now().toString(36).toUpperCase()}`,
      area: 'QSR Kitchen Extraction, Fire Suppression & Food-Handler Hygiene',
      suppressionGaugeGreen,
      hoodDegreased,
      supervisorName: kitchenSupervisor.trim() || 'Food Safety Supervisor',
      timestamp: ts,
      sha256Hash: sha,
    };
    const nextLogs = [entry, ...kitchenLogs];
    setKitchenLogs(nextLogs);
    persist(units, fifoItems, nextLogs);
  };

  return (
    <div className="space-y-6 text-slate-100" data-testid="shop-food-service-r638">
      {/* Banner */}
      <div className="p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase border border-emerald-500/40 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            Regulation R638 &amp; SANS 10049 HACCP
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            {tenant.dualPosSetup?.shopBrandLabel || 'Convenience Store & QSR Food Service'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">
          Shop &amp; Food Service R638 Cold-Chain, FIFO &amp; Kitchen Hygiene Logs
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Digital HACCP cold-chain fridge/freezer monitoring, hot-holding checks, FIFO expiry rotation, kitchen extraction hood &amp; fire-suppression inspection, and food-handler hygiene sign-off. Temperature breaches automatically open a tracked NCR.
        </p>
      </div>

      {/* 1. Cold-Chain & Hot-Holding Temperature Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-cyan-400" />
            Live Cold-Chain &amp; Hot-Holding Units
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {units.map((u) => (
              <div
                key={u.id}
                data-testid={`r638-unit-card-${u.id}`}
                className={`p-4 rounded-2xl border space-y-2 ${
                  u.compliant
                    ? 'bg-slate-950 border-emerald-500/40'
                    : 'bg-rose-950/40 border-rose-500/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{u.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      u.compliant
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {u.compliant ? 'COMPLIANT' : 'BREACH'}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-white">{u.name}</div>
                <div
                  className={`text-2xl font-mono font-black ${
                    u.compliant ? 'text-cyan-300' : 'text-rose-400'
                  }`}
                >
                  {u.lastTempC}°C
                </div>
                <div className="text-[11px] text-slate-400">Target: {u.targetRangeLabel}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {u.lastCheckedAt} • {u.checkedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleLogTemperature}
          className="lg:col-span-5 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3"
        >
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-400" />
            Record Probe Temperature Check
          </h3>
          <div>
            <label htmlFor="r638-unit-select" className="text-xs font-bold text-slate-300 block mb-1">
              Select Refrigeration / Hot-Hold Unit
            </label>
            <select
              id="r638-unit-select"
              data-testid="r638-unit-select"
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.targetRangeLabel})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="r638-temp-input" className="text-xs font-bold text-slate-300 block mb-1">
                Probe Reading (°C)
              </label>
              <input
                id="r638-temp-input"
                data-testid="r638-temp-input"
                type="number"
                step="0.1"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono font-black text-white"
              />
            </div>
            <div>
              <label htmlFor="r638-checker-input" className="text-xs font-bold text-slate-300 block mb-1">
                Food Handler / Checker
              </label>
              <input
                id="r638-checker-input"
                type="text"
                value={checkerInput}
                onChange={(e) => setCheckerInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            data-testid="r638-log-temp-btn"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
          >
            Save Temperature Reading (Auto-NCR on Breach)
          </button>
          {tempFeedback && (
            <div
              role="status"
              data-testid="r638-temp-feedback"
              className={`p-3 rounded-xl text-xs font-bold border ${
                tempFeedback.ok
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
              }`}
            >
              {tempFeedback.msg}
            </div>
          )}
        </form>
      </div>

      {/* 2. FIFO Rotation & Kitchen Fire Suppression / Hygiene Sign-off */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FIFO Expiry Register */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
            Expiry &amp; FIFO Stock Rotation Register
          </h3>

          <form onSubmit={handleAddFifo} className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Product / Batch (e.g. Fresh Milk 2L)"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="flex-1 min-w-[160px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            <input
              type="date"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {fifoItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{item.productName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Batch {item.batchCode} • Exp: {item.expiryDate}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  FIFO VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kitchen Extraction Hood, Fire Suppression & Food-Handler Hygiene */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Kitchen Extraction, Fire Suppression &amp; Food-Handler Hygiene
          </h3>

          <div className="space-y-2 text-xs">
            {[
              {
                label: 'Extraction hood & baffle filters degreased (zero grease buildup)',
                checked: hoodDegreased,
                set: setHoodDegreased,
              },
              {
                label: 'Kitchen Ansul / wet-chemical fire-suppression pressure gauge in GREEN zone',
                checked: suppressionGaugeGreen,
                set: setSuppressionGaugeGreen,
              },
              {
                label: 'Fat / grease trap & non-slip kitchen floor mat sanitized',
                checked: greaseTrapCleared,
                set: setGreaseTrapCleared,
              },
              {
                label: 'Food-handler hygiene verified (hairnets, clean aprons, handwash soap & nail check)',
                checked: foodHandlerHygieneOk,
                set: setFoodHandlerHygieneOk,
              },
            ].map((chk, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={chk.checked}
                  onChange={(e) => chk.set(e.target.checked)}
                />
                <span className="text-slate-200">{chk.label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={kitchenSupervisor}
              onChange={(e) => setKitchenSupervisor(e.target.value)}
              placeholder="Supervising Officer Name"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            <button
              type="button"
              onClick={handleSignKitchenChecklist}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign Kitchen Hygiene Log (SHA-256)</span>
            </button>
          </div>

          {kitchenLogs.length > 0 && (
            <div className="space-y-1.5 max-h-28 overflow-y-auto text-[11px] font-mono">
              {kitchenLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-slate-950 border border-emerald-500/30 flex justify-between gap-2 text-emerald-300"
                >
                  <span>✓ {log.supervisorName}</span>
                  <span>SHA-256: {log.sha256Hash.slice(0, 12)}...</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

