import React, { useState, useEffect } from 'react';
import {
  Truck,
  Gauge,
  Sparkles,
  AlertOctagon,
  ShieldCheck,
  Droplet,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Users,
  Flame,
  HeartPulse,
  FileCheck,
} from 'lucide-react';
import { Language } from '../../data/translations';
import { JurisdictionCode } from '../../data/eastAfricaConfig';
import { WetstockOffloadBridge } from '../WetstockOffloadBridge';
import { EvacuationFlow } from '../EvacuationFlow';
import { SpillTeamwork } from '../SpillTeamwork';
import { PASSFirefighting } from '../PASSFirefighting';
import { NightshiftFirstResponder } from '../NightshiftFirstResponder';
import { RSDChecklistModule } from '../RSDChecklistModule';
import { getActiveTenant } from '../../multiTenantConfig';
import { CanonicalFuelGrade } from '../../lib/pos-ingestion-adapter';
import {
  convertDipMmToLitres,
  evaluateWaterInterface,
  verifyTankerDeliveryBol,
  CLEANING_CHECKLIST_TEMPLATES,
  CleaningTaskArea,
  CleaningLogEntry,
  loadCleaningLogs,
  saveCleaningLogEntry,
} from '../../lib/wetstock-engine';
import { addNcrs } from '../../lib/ncrStore';
import { hashAuditSignature } from '../../popiActCompliance';

export type ForecourtSubTab = 'offload' | 'dipping' | 'cleaning' | 'emergency';

interface ForecourtFuelOpsWorkspaceProps {
  lang: Language;
  jurisdiction: JurisdictionCode;
  spillLitres: number;
  onSpillLitresChange: (litres: number) => void;
  activeSubTab: ForecourtSubTab;
  onSubTabChange: (sub: ForecourtSubTab) => void;
  onNavigateTarget: (target: string) => void;
  onOpenStatutoryModal: () => void;
}

export const ForecourtFuelOpsWorkspace: React.FC<ForecourtFuelOpsWorkspaceProps> = ({
  lang,
  jurisdiction,
  spillLitres,
  onSpillLitresChange,
  activeSubTab,
  onSubTabChange,
  onNavigateTarget,
  onOpenStatutoryModal,
}) => {
  const tenant = getActiveTenant();

  // Emergency sub-view selector inside Pillar 1
  const [emergencyMode, setEmergencyMode] = useState<'evacuation' | 'spill' | 'fire' | 'firstResponder' | 'rsd'>('evacuation');

  // Tank Dipping & Water-Paste Calculator state
  const [dipTankCap, setDipTankCap] = useState<number>(30000);
  const [dipGrade, setDipGrade] = useState<CanonicalFuelGrade>('ULP_95');
  const [dipMm, setDipMm] = useState<number>(1350);
  const [waterMm, setWaterMm] = useState<number>(4);
  const [atgLitres, setAtgLitres] = useState<number>(17100);

  const strappedLitres = convertDipMmToLitres(dipMm, dipTankCap);
  const waterEval = evaluateWaterInterface(waterMm, dipGrade);
  const dipVsAtgDiff = Math.round((strappedLitres - atgLitres) * 10) / 10;

  // BOL Pre-Offload Safety Gate & 15°C Calculator state
  const [bolRef, setBolRef] = useState<string>('BOL-2026-4410');
  const [bolGrade, setBolGrade] = useState<CanonicalFuelGrade>('ULP_95');
  const [tankGrade, setTankGrade] = useState<CanonicalFuelGrade>('ULP_95');
  const [preDropL, setPreDropL] = useState<number>(6000);
  const [postDropL, setPostDropL] = useState<number>(21950);
  const [bolLitres, setBolLitres] = useState<number>(16000);
  const [bolTempC, setBolTempC] = useState<number>(20);
  const [tankTempC, setTankTempC] = useState<number>(18);
  const [earthingOk, setEarthingOk] = useState<boolean>(true);
  const [spillKitOk, setSpillKitOk] = useState<boolean>(true);
  const [extinguishersOk, setExtinguishersOk] = useState<boolean>(true);
  const [drainClosedOk, setDrainClosedOk] = useState<boolean>(true);
  const [bolResultMsg, setBolResultMsg] = useState<string>('');

  // Cleaning Logs state
  const [cleaningArea, setCleaningArea] = useState<CleaningTaskArea>('OIL_WATER_INTERCEPTOR');
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);
  const [photoName, setPhotoName] = useState<string>('interceptor-chamber-check.jpg');
  const [supervisorName, setSupervisorName] = useState<string>('Forecourt Supervisor A');
  const [cleaningNotes, setCleaningNotes] = useState<string>('');
  const [cleaningLogs, setCleaningLogs] = useState<CleaningLogEntry[]>([]);

  // Live Shift Roll-Call (Frontline Evacuation Muster)
  const [rollCallStaff, setRollCallStaff] = useState([
    { id: 'STF-1', role: 'Cashier 1 (Kiosk)', present: true },
    { id: 'STF-2', role: 'Forecourt Attendant A', present: true },
    { id: 'STF-3', role: 'Forecourt Attendant B', present: true },
    { id: 'STF-4', role: 'QSR / Kitchen Lead', present: false },
  ]);

  useEffect(() => {
    setCleaningLogs(loadCleaningLogs());
  }, []);

  const activeTemplate =
    CLEANING_CHECKLIST_TEMPLATES.find((c) => c.area === cleaningArea) ||
    CLEANING_CHECKLIST_TEMPLATES[0];

  const handleRunBolVerification = () => {
    const res = verifyTankerDeliveryBol({
      siteCode: tenant.siteCode,
      tankId: 'TK-01',
      bolReference: bolRef,
      fuelGrade: tankGrade,
      tankCapacityLitres: dipTankCap,
      preDropLitres: preDropL,
      postDropLitres: postDropL,
      salesDuringDropLitres: 0,
      bolLitres,
      bolTemperatureC: bolTempC,
      tankTemperatureC: tankTempC,
      safetyGate: {
        bolGrade,
        earthingGrounded: earthingOk,
        spillKitStaged: spillKitOk,
        fireExtinguishersPositioned: extinguishersOk,
        drainIsolationClosed: drainClosedOk,
      },
    });
    if (res.status === 'BLOCKED_SAFETY_GATE') {
      setBolResultMsg(`BLOCKED: ${res.safetyGate.blockingReasons.join(' | ')}`);
    } else if (res.status === 'SHORTAGE_NCR' && res.ncr) {
      addNcrs([res.ncr]);
      setBolResultMsg(
        `BOL SHORTAGE NCR OPENED (${res.deliveryVarianceLitres}L / ${res.deliveryVariancePercent}%). 15°C BOL=${res.bolCompensated15CLitres}L vs Recv=${res.receivedCompensated15CLitres}L.`
      );
    } else {
      setBolResultMsg(
        `VERIFIED: 15°C BOL=${res.bolCompensated15CLitres}L vs Recv=${res.receivedCompensated15CLitres}L (Var ${res.deliveryVarianceLitres}L / ${res.deliveryVariancePercent}%).`
      );
    }
  };

  const handleSaveCleaningLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const ts = new Date().toISOString();
    let sha = `CLN-${Date.now()}`;
    try {
      sha = await hashAuditSignature(`${cleaningArea}|${tenant.siteCode}|${supervisorName}|${ts}`);
    } catch {
      // ignore
    }
    const entry: CleaningLogEntry = {
      id: `CLN-${Date.now().toString(36).toUpperCase()}`,
      siteCode: tenant.siteCode,
      area: cleaningArea,
      title: activeTemplate.title,
      completedSteps: checkedSteps,
      photoFileName: photoName || 'photo-verified.jpg',
      supervisorName: supervisorName.trim() || 'Supervisor',
      notes: cleaningNotes,
      timestampIso: ts,
      sha256Hash: sha,
    };
    setCleaningLogs(saveCleaningLogEntry(entry));
    setCleaningNotes('');
  };

  return (
    <div className="space-y-6" data-testid="pillar-workspace-forecourt">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'offload' as const, label: 'Tanker Offload & BOL Gate', icon: Truck },
            { id: 'dipping' as const, label: 'Tank Dipping & Water-Paste', icon: Gauge },
            { id: 'cleaning' as const, label: 'Interceptor & Forecourt Cleaning', icon: Sparkles },
            { id: 'emergency' as const, label: 'Emergency SOPs & Roll-Call', icon: AlertOctagon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`forecourt-subtab-${tab.id}`}
                onClick={() => onSubTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <span className="text-xs font-mono text-cyan-300 px-3">
          Pillar 1 • Forecourt &amp; Fuel Ops ({tenant.siteCode})
        </span>
      </div>

      {activeSubTab === 'offload' && (
        <div className="space-y-6">
          {/* Native Pre-Offload Safety Gate & 15°C BOL Verification */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  15°C Thermal BOL Verification &amp; Pre-Offload Safety Gate
                </h3>
                <p className="text-xs text-slate-300">
                  Enforces 5% ullage headspace, fuel grade lock, static earthing, spill kit staging, and 15°C expansion compensation before drop sign-off.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">BOL Reference</label>
                <input
                  type="text"
                  value={bolRef}
                  onChange={(e) => setBolRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Tank Grade vs BOL Grade</label>
                <div className="grid grid-cols-2 gap-1">
                  <select
                    value={tankGrade}
                    onChange={(e) => setTankGrade(e.target.value as CanonicalFuelGrade)}
                    className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-[11px]"
                  >
                    <option value="ULP_95">Tank: ULP 95</option>
                    <option value="ULP_93">Tank: ULP 93</option>
                    <option value="DIESEL_50PPM">Tank: Diesel 50</option>
                    <option value="DIESEL_10PPM">Tank: Diesel 10</option>
                  </select>
                  <select
                    value={bolGrade}
                    onChange={(e) => setBolGrade(e.target.value as CanonicalFuelGrade)}
                    className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-[11px]"
                  >
                    <option value="ULP_95">BOL: ULP 95</option>
                    <option value="ULP_93">BOL: ULP 93</option>
                    <option value="DIESEL_50PPM">BOL: Diesel 50</option>
                    <option value="DIESEL_10PPM">BOL: Diesel 10</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">BOL Litres / Temp (°C)</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    value={bolLitres}
                    onChange={(e) => setBolLitres(Number(e.target.value))}
                    className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="number"
                    value={bolTempC}
                    onChange={(e) => setBolTempC(Number(e.target.value))}
                    className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Pre-Drop / Post-Drop (L)</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    value={preDropL}
                    onChange={(e) => setPreDropL(Number(e.target.value))}
                    className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="number"
                    value={postDropL}
                    onChange={(e) => setPostDropL(Number(e.target.value))}
                    className="px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              {[
                { label: 'Earthing / Grounding Clamp Verified', val: earthingOk, set: setEarthingOk },
                { label: 'Spill Kit Staged Upwind', val: spillKitOk, set: setSpillKitOk },
                { label: '2x 9kg DCP Extinguishers Positioned', val: extinguishersOk, set: setExtinguishersOk },
                { label: 'Stormwater Drain Isolation Closed', val: drainClosedOk, set: setDrainClosedOk },
              ].map((g, i) => (
                <label key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={g.val} onChange={(e) => g.set(e.target.checked)} />
                  <span className="text-slate-200">{g.label}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRunBolVerification}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition"
              >
                Run Pre-Offload Gate &amp; Verify 15°C BOL
              </button>
              {bolResultMsg && (
                <span className="text-xs font-bold text-amber-300">{bolResultMsg}</span>
              )}
            </div>
          </div>

          <WetstockOffloadBridge
            lang={lang}
            jurisdiction={jurisdiction}
            spillLitres={spillLitres}
            onNavigateTab={onNavigateTarget}
            onOpenStatutoryModal={onOpenStatutoryModal}
          />
        </div>
      )}

      {activeSubTab === 'dipping' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              Tank Strapping (mm → Litres) &amp; Water-Paste Interface Monitor
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Converts physical brass dipstick millimetre readings via underground tank strapping curves and checks water-finding paste limits against ATG readings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Tank Capacity</label>
              <select
                value={dipTankCap}
                onChange={(e) => setDipTankCap(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              >
                <option value={23000}>23,000 L Standard UST</option>
                <option value={30000}>30,000 L Standard UST</option>
                <option value={35000}>35,000 L High-Throughput UST</option>
                <option value={45000}>45,000 L Bulk UST</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Fuel Grade</label>
              <select
                value={dipGrade}
                onChange={(e) => setDipGrade(e.target.value as CanonicalFuelGrade)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              >
                <option value="ULP_95">ULP 95 (Water limit ≤ 15mm)</option>
                <option value="ULP_93">ULP 93 (Water limit ≤ 15mm)</option>
                <option value="DIESEL_50PPM">Diesel 50ppm (Water limit ≤ 25mm)</option>
                <option value="DIESEL_10PPM">Diesel 10ppm (Water limit ≤ 25mm)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Manual Dipstick Reading (mm)</label>
              <input
                type="number"
                value={dipMm}
                onChange={(e) => setDipMm(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-black"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Water-Paste Level (mm) &amp; ATG (L)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={waterMm}
                  onChange={(e) => setWaterMm(Number(e.target.value))}
                  className="px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
                <input
                  type="number"
                  value={atgLitres}
                  onChange={(e) => setAtgLitres(Number(e.target.value))}
                  className="px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40">
              <div className="text-slate-400">Strapped Manual Dip Volume</div>
              <div className="text-2xl font-mono font-black text-cyan-300 mt-1">
                {strappedLitres.toLocaleString()} L
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400">Manual Dip vs ATG Delta</div>
              <div className={`text-2xl font-mono font-black mt-1 ${Math.abs(dipVsAtgDiff) > 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {dipVsAtgDiff > 0 ? `+${dipVsAtgDiff}` : dipVsAtgDiff} L
              </div>
            </div>
            <div
              className={`p-4 rounded-2xl border ${
                waterEval.status === 'CRITICAL'
                  ? 'bg-rose-950/50 border-rose-500'
                  : waterEval.status === 'WARNING'
                    ? 'bg-amber-950/40 border-amber-500'
                    : 'bg-emerald-950/30 border-emerald-500/40'
              }`}
            >
              <div className="font-black text-white">Water Interface: {waterEval.status}</div>
              <div className="text-slate-200 mt-1">{waterEval.alertMessage}</div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'cleaning' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <form
            onSubmit={handleSaveCleaningLog}
            className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
          >
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Forecourt, Tank &amp; Interceptor Cleaning Log
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Scheduled Area</label>
              <select
                value={cleaningArea}
                onChange={(e) => {
                  setCleaningArea(e.target.value as CleaningTaskArea);
                  setCheckedSteps([]);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
              >
                {CLEANING_CHECKLIST_TEMPLATES.map((tpl) => (
                  <option key={tpl.area} value={tpl.area}>
                    {tpl.title} ({tpl.frequency})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-cyan-300 mt-1">
                Statutory Ref: {activeTemplate.statutoryRef}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {activeTemplate.steps.map((step) => {
                const isDone = checkedSteps.includes(step);
                return (
                  <label
                    key={step}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() =>
                        setCheckedSteps((prev) =>
                          prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
                        )
                      }
                    />
                    <span className="text-slate-200">{step}</span>
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Photo Evidence Filename</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                    className="w-full bg-transparent text-white outline-none font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Supervisor Sign-Off</label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition"
            >
              Sign &amp; Persist Cleaning Log (SHA-256)
            </button>
          </form>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-white">Persisted Cleaning &amp; Interceptor Audit Trail</h4>
            {cleaningLogs.length === 0 ? (
              <p className="text-xs text-slate-400">
                No cleaning logs recorded in this session yet. Complete a checklist on the left to create a SHA-256 stamped entry.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
                {cleaningLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-emerald-300">
                      <span>{log.title}</span>
                      <span className="font-mono text-[10px]">{log.id}</span>
                    </div>
                    <div className="text-slate-300">
                      Supervisor: {log.supervisorName} • Photo: <code className="text-amber-300">{log.photoFileName}</code>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {log.completedSteps.length} steps • SHA-256: {log.sha256Hash.slice(0, 16)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'emergency' && (
        <div className="space-y-5">
          {/* Sub-switcher for Frontline Emergency Checklists + Live Shift Roll-Call */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'evacuation' as const, label: '9-Step Evacuation & Roll-Call', icon: AlertOctagon },
              { id: 'spill' as const, label: '8-Step Spill Response', icon: ShieldCheck },
              { id: 'fire' as const, label: 'PASS Firefighting', icon: Flame },
              { id: 'firstResponder' as const, label: 'Nightshift First Responder', icon: HeartPulse },
              { id: 'rsd' as const, label: 'RSD 26 Checklists', icon: FileCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEmergencyMode(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                    emergencyMode === item.id
                      ? 'bg-red-600 text-white shadow'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {emergencyMode === 'evacuation' && (
            <div className="space-y-6">
              {/* Live Shift Roll-Call Panel */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    Live Shift Assembly Point Roll-Call ({rollCallStaff.filter((s) => s.present).length}/{rollCallStaff.length} Accounted)
                  </h3>
                  <span className="text-xs font-mono text-amber-300">Tap staff role to verify muster</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  {rollCallStaff.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setRollCallStaff((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, present: !x.present } : x))
                        )
                      }
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        s.present
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <span className="font-bold">{s.role}</span>
                      {s.present ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <EvacuationFlow lang={lang} />
            </div>
          )}
          {emergencyMode === 'spill' && (
            <SpillTeamwork
              spillLitres={spillLitres}
              onSpillLitresChange={onSpillLitresChange}
              lang={lang}
              onNavigateTab={onNavigateTarget}
            />
          )}
          {emergencyMode === 'fire' && <PASSFirefighting lang={lang} />}
          {emergencyMode === 'firstResponder' && <NightshiftFirstResponder lang={lang} />}
          {emergencyMode === 'rsd' && <RSDChecklistModule lang={lang} />}
        </div>
      )}
    </div>
  );
};

