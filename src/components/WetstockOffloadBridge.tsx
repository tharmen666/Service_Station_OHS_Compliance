import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  Gauge, 
  FileCheck, 
  FileText, 
  Truck, 
  RefreshCw, 
  Flame, 
  ArrowRight, 
  CheckSquare, 
  Download, 
  AlertOctagon,
  Clock,
  Building2,
  Sliders
} from 'lucide-react';
import { Language } from '../data/translations';
import { 
  JurisdictionCode, 
  EAST_AFRICA_PRESETS, 
  KISWAHILI_REGIONAL_TRANSLATIONS 
} from '../data/eastAfricaConfig';

export interface WetstockOffloadBridgeProps {
  lang?: Language;
  jurisdiction?: JurisdictionCode;
  spillLitres?: number;
  onNavigateTab?: (tab: string) => void;
  onOpenStatutoryModal?: () => void;
}

interface CommittedOffloadAudit {
  id: string;
  timestamp: string;
  tankId: string;
  fuelGrade: string;
  waybillRef: string;
  sealRef: string;
  openingDip: number;
  waybillLitres: number;
  pumpSalesDuringDrop: number;
  spillDeductionLitres: number;
  closingDip: number;
  calculatedExpectedClosing: number;
  varianceLitres: number;
  variancePct: number;
  isShrinkageCritical: boolean;
  jurisdiction: JurisdictionCode;
  fiscalSystem: string;
  interlockSignedOff: boolean;
}

export const WetstockOffloadBridge: React.FC<WetstockOffloadBridgeProps> = ({
  lang = 'EN',
  jurisdiction = 'ZA',
  spillLitres = 0,
  onNavigateTab,
  onOpenStatutoryModal
}) => {
  const currentJurisdiction = EAST_AFRICA_PRESETS[jurisdiction] || EAST_AFRICA_PRESETS.ZA;
  const swTranslations = KISWAHILI_REGIONAL_TRANSLATIONS.wetstockOffload;

  // Step 1: RSD 26 Safety Interlock Gate (5 Mandatory Checks)
  const [interlockChecks, setInterlockChecks] = useState<{
    staticEarthing: boolean;
    extinguishersUpwind: boolean;
    drainIsolation: boolean;
    ullageVerified: boolean;
    esdAndChocks: boolean;
  }>({
    staticEarthing: false,
    extinguishersUpwind: false,
    drainIsolation: false,
    ullageVerified: false,
    esdAndChocks: false,
  });

  const toggleInterlock = (key: keyof typeof interlockChecks) => {
    setInterlockChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isInterlockComplete = useMemo(() => {
    return Object.values(interlockChecks).every(Boolean);
  }, [interlockChecks]);

  // Step 2: LogiGuard Wetstock & Fiscal Reconciliation Inputs
  const [selectedTank, setSelectedTank] = useState<'TK-01' | 'TK-02' | 'TK-03' | 'TK-04' | 'TK-05'>('TK-03');
  const [waybillRef, setWaybillRef] = useState<string>('WB-2026-99042');
  const [sealRef, setSealRef] = useState<string>('SEAL-BGO-8841');
  const [openingDip, setOpeningDip] = useState<number>(4500);
  const [waybillLitres, setWaybillLitres] = useState<number>(32000); // 32k full load standard
  const [pumpSalesDuringDrop, setPumpSalesDuringDrop] = useState<number>(380);
  const [closingDip, setClosingDip] = useState<number>(36060);
  
  // Committed Audits Ledger (HITL)
  const [committedAudits, setCommittedAudits] = useState<CommittedOffloadAudit[]>([
    {
      id: 'AUD-BGO-881',
      timestamp: 'Today, 06:45:10',
      tankId: 'TK-01',
      fuelGrade: 'ULP 95 (Premium)',
      waybillRef: 'WB-2026-98910',
      sealRef: 'SEAL-BGO-7730',
      openingDip: 3200,
      waybillLitres: 32000,
      pumpSalesDuringDrop: 420,
      spillDeductionLitres: 0,
      closingDip: 34760,
      calculatedExpectedClosing: 34780,
      varianceLitres: -20,
      variancePct: -0.06,
      isShrinkageCritical: false,
      jurisdiction: 'ZA',
      fiscalSystem: 'SARS eFiling / eBOL Verified',
      interlockSignedOff: true
    }
  ]);

  const [auditSuccessBanner, setAuditSuccessBanner] = useState<string | null>(null);

  // Tank metadata
  const tanks = {
    'TK-01': { name: 'Tank 01 - ULP 95 Premium', capacity: 40000, grade: 'Unleaded Petrol 95' },
    'TK-02': { name: 'Tank 02 - ULP 93 Regular', capacity: 40000, grade: 'Unleaded Petrol 93' },
    'TK-03': { name: 'Tank 03 - Diesel 50ppm High-Spec', capacity: 45000, grade: 'Diesel 50ppm' },
    'TK-04': { name: 'Tank 04 - Diesel 10ppm Ultra-Low Sulfur', capacity: 35000, grade: 'Diesel 10ppm' },
    'TK-05': { name: 'Tank 05 - Illuminating Paraffin (IP)', capacity: 20000, grade: 'Illuminating Paraffin' },
  };

  // Reconciliation Formula:
  // Expected Closing = Opening Dip + Waybill Litres - Pump Sales During Drop - Spill Litres
  // Variance Litres = Closing Dip - Expected Closing
  // Variance Pct = (Variance Litres / Waybill Litres) * 100
  const calculations = useMemo(() => {
    const expectedClosing = openingDip + waybillLitres - pumpSalesDuringDrop - spillLitres;
    const varianceLitres = closingDip - expectedClosing;
    const variancePct = waybillLitres > 0 ? (varianceLitres / waybillLitres) * 100 : 0;
    
    // Critical Shrinkage: Loss exceeds 0.35% OR absolute loss exceeds 50 Litres
    const isLoss = varianceLitres < 0;
    const absoluteLossLitres = Math.abs(varianceLitres);
    const absoluteLossPct = Math.abs(variancePct);
    const isShrinkageCritical = isLoss && (absoluteLossPct > currentJurisdiction.maxLossTolerancePct || absoluteLossLitres > currentJurisdiction.maxLossToleranceLitres);

    return {
      expectedClosing,
      varianceLitres,
      variancePct,
      isShrinkageCritical,
      absoluteLossLitres,
      absoluteLossPct
    };
  }, [openingDip, waybillLitres, pumpSalesDuringDrop, spillLitres, closingDip, currentJurisdiction]);

  const handleCommitAudit = () => {
    if (!isInterlockComplete) {
      alert('SAFETY GATE LOCKED: You must verify all 5 RSD 26 safety interlocks before committing offload audit to the ledger.');
      return;
    }

    const newAudit: CommittedOffloadAudit = {
      id: `AUD-${jurisdiction}-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      tankId: selectedTank,
      fuelGrade: tanks[selectedTank].name,
      waybillRef,
      sealRef,
      openingDip,
      waybillLitres,
      pumpSalesDuringDrop,
      spillDeductionLitres: spillLitres,
      closingDip,
      calculatedExpectedClosing: calculations.expectedClosing,
      varianceLitres: calculations.varianceLitres,
      variancePct: calculations.variancePct,
      isShrinkageCritical: calculations.isShrinkageCritical,
      jurisdiction,
      fiscalSystem: currentJurisdiction.fiscalSystem,
      interlockSignedOff: true
    };

    setCommittedAudits([newAudit, ...committedAudits]);
    setAuditSuccessBanner(`Reconciliation audit #${newAudit.id} successfully locked to Human-In-The-Loop ledger with ${currentJurisdiction.fiscalSystem} verification.`);
    setTimeout(() => setAuditSuccessBanner(null), 6000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Jurisdictional Regulatory Alignment */}
      <div className="pos-card p-6 md:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-500/40 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'SW' ? swTranslations.badge : 'LogiGuard Sentinel Bridge'}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1.5">
                <span>{currentJurisdiction.flag}</span>
                <span>{currentJurisdiction.country} ({currentJurisdiction.code})</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-extrabold border border-emerald-500/30">
                {currentJurisdiction.regulators} • {currentJurisdiction.fiscalSystem}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'SW' ? swTranslations.title : 'Wetstock Offload & Fiscal Reconciliation Bridge'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {lang === 'SW' 
                ? swTranslations.subtitle 
                : `Harmonized forecourt offloading protocol enforcing RSD 26 safety interlocks, pump sales offsets during discharge, automatic fuel spill deductions, and statutory shrinkage forensics aligned with ${currentJurisdiction.statutoryReference}.`
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {spillLitres > 0 && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-left">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-amber-400" />
                  Tab 2 Spill Sync Active
                </div>
                <div className="text-sm font-mono font-black text-amber-400">
                  -{spillLitres} L Auto-Deducted
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigateTab?.('spill')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Droplet className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Tab 2 Spill</span>
            </button>

            {onOpenStatutoryModal && (
              <button
                onClick={onOpenStatutoryModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Statutory Doc</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {auditSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{auditSuccessBanner}</span>
        </div>
      )}

      {/* Grid: Step 1 (Safety Interlock) & Step 2 (Fiscal Reconciliation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* STEP 1: RSD 26 Forecourt Safety Interlock Gate (5 Columns) */}
        <div className="lg:col-span-5 pos-card p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Step 1: Forecourt RSD 26 Safety Interlock Gate
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  {lang === 'SW' ? swTranslations.interlockTitle : 'RSD 26 Safety Verification'}
                </h3>
              </div>
              
              <div className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono border flex items-center gap-1.5 ${
                isInterlockComplete 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}>
                {isInterlockComplete ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isInterlockComplete ? 'GATE UNLOCKED' : 'INTERLOCK ACTIVE'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              All <strong>5 statutory safety controls</strong> must be physically checked before discharging bulk petroleum into underground storage tanks:
            </p>

            {/* 5 Checklist Items */}
            <div className="space-y-2.5 pt-1">
              {[
                {
                  key: 'staticEarthing',
                  title: '1. Static Bonding Earth Clamp Attached',
                  desc: 'Bonding cable attached to tanker earthing point; resistance verified < 10 ohms (SANS 10089-3 / OSHA).'
                },
                {
                  key: 'extinguishersUpwind',
                  title: '2. 2x 9kg DCP Extinguishers Positioned',
                  desc: 'Positioned upwind within 3 meters of offloading manifold; pressure gauge in green zone.'
                },
                {
                  key: 'drainIsolation',
                  title: '3. Stormwater Interceptor Sealed',
                  desc: 'Forecourt drainage shut-off valve locked closed; hazardous absorbent booms deployed around dip box.'
                },
                {
                  key: 'ullageVerified',
                  title: '4. Tank Ullage Physically Verified',
                  desc: 'Manual dipstick ullage confirmed greater than waybill delivery volume to prevent catastrophic overfill.'
                },
                {
                  key: 'esdAndChocks',
                  title: '5. ESD Ready & Wheel Chocks Locked',
                  desc: 'Forecourt Emergency Stop Device tested; heavy-duty rubber wheel chocks positioned on dual drive axles.'
                }
              ].map((item) => {
                const isChecked = interlockChecks[item.key as keyof typeof interlockChecks];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleInterlock(item.key as keyof typeof interlockChecks)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                      isChecked
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}>
                      ✓
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400 leading-normal">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Interlock Status: <strong className="text-white">{Object.values(interlockChecks).filter(Boolean).length}/5 Verified</strong>
            </span>
            <span className={`font-mono font-bold ${isInterlockComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isInterlockComplete ? 'Ready for Fuel Drop ✓' : 'Offload Commit Locked 🔒'}
            </span>
          </div>
        </div>

        {/* STEP 2: LogiGuard Wetstock & Fiscal Reconciliation Form (7 Columns) */}
        <div className="lg:col-span-7 pos-card p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Step 2: LogiGuard Fiscal Reconciliation
              </span>
              <h3 className="text-lg font-black text-white">
                {lang === 'SW' ? swTranslations.reconciliationTitle : 'Tank Dipping & Discharge Calculation'}
              </h3>
            </div>

            <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
              Site: <strong>{currentJurisdiction.siteCode}</strong>
            </span>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Tank Selector */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-extrabold text-slate-300">Underground Storage Tank (UST):</label>
              <select
                value={selectedTank}
                onChange={(e) => setSelectedTank(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
              >
                {Object.entries(tanks).map(([id, info]) => (
                  <option key={id} value={id}>
                    {info.name} (Max: {info.capacity.toLocaleString()} L)
                  </option>
                ))}
              </select>
            </div>

            {/* Waybill / Terminal Ticket */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Waybill / BOL Number:</label>
              <input
                type="text"
                value={waybillRef}
                onChange={(e) => setWaybillRef(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Electronic Seal Serial */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Electronic Seal Reference:</label>
              <input
                type="text"
                value={sealRef}
                onChange={(e) => setSealRef(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Opening Dip Litres */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Opening Physical Dip (L):</label>
              <input
                type="number"
                value={openingDip || ''}
                onChange={(e) => setOpeningDip(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Waybill Invoiced Litres */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Waybill Invoiced Volume (L):</label>
              <input
                type="number"
                value={waybillLitres || ''}
                onChange={(e) => setWaybillLitres(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Pump Sales During Offload */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Pump Meter Sales During Drop (L):</label>
              <input
                type="number"
                value={pumpSalesDuringDrop || ''}
                onChange={(e) => setPumpSalesDuringDrop(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Closing Physical Dip */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Closing Physical Dip (L):</label>
              <input
                type="number"
                value={closingDip || ''}
                onChange={(e) => setClosingDip(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono font-bold text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

          </div>

          {/* Real-time Calculation Breakdown Box */}
          <div className={`p-4 rounded-2xl border transition-all ${
            calculations.isShrinkageCritical
              ? 'bg-rose-950/40 border-rose-500/60 ring-1 ring-rose-500/40'
              : 'bg-slate-950/90 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
              <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Forecourt Mathematical Reconciliation Result</span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${
                calculations.isShrinkageCritical ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {calculations.isShrinkageCritical ? 'CRITICAL SHRINKAGE BREACH' : 'WITHIN STATUTORY TOLERANCE'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Expected Closing:</span>
                <span className="text-white font-bold">{calculations.expectedClosing.toLocaleString()} L</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Spill Deducted:</span>
                <span className="text-amber-400 font-bold">-{spillLitres} L</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Net Variance (L):</span>
                <span className={`font-black ${calculations.varianceLitres < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {calculations.varianceLitres > 0 ? `+${calculations.varianceLitres}` : calculations.varianceLitres} L
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Variance (%):</span>
                <span className={`font-black ${calculations.isShrinkageCritical ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {calculations.variancePct.toFixed(2)}%
                </span>
              </div>
            </div>

            {calculations.isShrinkageCritical && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  <strong>CRITICAL LOSS LIMIT BREACH:</strong> Unexplained loss exceeds statutory limit (&gt;0.35% or &gt;50L). 
                  Mandatory Section 24 investigation &amp; {currentJurisdiction.fiscalSystem} audit flag generated.
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Regulatory Standard: <strong>{currentJurisdiction.statutoryReference}</strong></span>
            </div>

            <button
              onClick={handleCommitAudit}
              disabled={!isInterlockComplete}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl transition transform ${
                isInterlockComplete
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {isInterlockComplete ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Lock className="w-4 h-4 text-slate-500" />}
              <span>{lang === 'SW' ? swTranslations.commitAuditBtn : 'Commit Reconciled Offload to Audit Ledger'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Committed HITL Audit Ledger */}
      <div className="pos-card p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              HITL Committed Offload Audit Ledger
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Permanently locked offload records with verified static earthing interlock, fiscal system token, and pump sales offsets.
            </p>
          </div>

          <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            {committedAudits.length} Audits Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Tank &amp; Grade</th>
                <th className="py-2.5 px-3">Waybill / Seal</th>
                <th className="py-2.5 px-3 text-right">Waybill (L)</th>
                <th className="py-2.5 px-3 text-right">Sales Drop (L)</th>
                <th className="py-2.5 px-3 text-right">Spill Loss (L)</th>
                <th className="py-2.5 px-3 text-right">Net Variance</th>
                <th className="py-2.5 px-3 text-center">Interlock</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {committedAudits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-300">{item.id}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{item.timestamp}</td>
                  <td className="py-3 px-3 text-white font-bold">{item.fuelGrade}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    <div>{item.waybillRef}</div>
                    <div className="text-[10px] text-slate-500">{item.sealRef}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200">{item.waybillLitres.toLocaleString()} L</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-400">-{item.pumpSalesDuringDrop} L</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-500">
                    {item.spillDeductionLitres > 0 ? `-${item.spillDeductionLitres} L` : '0 L'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span className={`font-black ${item.varianceLitres < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.varianceLitres > 0 ? `+${item.varianceLitres}` : item.varianceLitres} L ({item.variancePct.toFixed(2)}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                      RSD 26 ✓
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${
                      item.isShrinkageCritical 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {item.isShrinkageCritical ? 'CRITICAL AUDIT' : 'RECONCILED ✓'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

