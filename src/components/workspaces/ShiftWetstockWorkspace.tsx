import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Upload,
  Webhook,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet,
  GitMerge,
  ShieldAlert,
} from 'lucide-react';
import { Language } from '../../data/translations';
import { DualModeWetstockPanel } from '../DualModeWetstockPanel';
import { WetstockManagementModule } from '../WetstockManagementModule';
import { getActiveTenant } from '../../multiTenantConfig';
import {
  PosVendorId,
  POS_VENDOR_METADATA,
  POS_COLUMN_PRESETS,
  ShiftReconciliationPayload,
  autoDetectVendorAndParse,
  parseCsvShiftExport,
  parseXmlShiftExport,
  mergeShiftReconciliationStreams,
  buildManualQuickEntryPayload,
  generateSamplePosExport,
} from '../../lib/pos-ingestion-adapter';
import { reconcileShift, ShiftReconciliationReport } from '../../lib/wetstock-engine';
import { addNcrs } from '../../lib/ncrStore';

export type ShiftWetstockSubTab = 'shiftCashUp' | 'posImport' | 'varianceEngine';

interface ShiftWetstockWorkspaceProps {
  lang: Language;
  activeSubTab: ShiftWetstockSubTab;
  onSubTabChange: (sub: ShiftWetstockSubTab) => void;
  onNavigateTarget: (target: string) => void;
  onOpenStatutoryModal: () => void;
  onOpenCertModal: () => void;
}

export const ShiftWetstockWorkspace: React.FC<ShiftWetstockWorkspaceProps> = ({
  lang,
  activeSubTab,
  onSubTabChange,
  onNavigateTarget,
  onOpenStatutoryModal,
  onOpenCertModal,
}) => {
  const tenant = getActiveTenant();

  // POS Plug-In Adapter state
  const [selectedVendor, setSelectedVendor] = useState<PosVendorId>(
    (tenant.recommendedPosVendor as PosVendorId) || 'WINBRANCH'
  );
  const [dualAstronMode, setDualAstronMode] = useState<boolean>(
    Boolean(tenant.dualPosSetup)
  );
  const [primaryRaw, setPrimaryRaw] = useState<string>(() =>
    generateSamplePosExport(
      (tenant.recommendedPosVendor as PosVendorId) || 'WINBRANCH',
      tenant.recommendedPosVendor === 'ISIS' ? 'XML' : 'CSV'
    )
  );
  const [secondaryShopRaw, setSecondaryShopRaw] = useState<string>(() =>
    generateSamplePosExport('SYMPHONY', 'CSV')
  );
  const [colOpeningOverride, setColOpeningOverride] = useState<string>(
    POS_COLUMN_PRESETS.WINBRANCH.openingStockCol
  );
  const [colClosingAtgOverride, setColClosingAtgOverride] = useState<string>(
    POS_COLUMN_PRESETS.WINBRANCH.closingAtgCol
  );

  // Manual Quick-Entry fallback state
  const [manualOpenLitres, setManualOpenLitres] = useState<number>(14000);
  const [manualDeliveryLitres, setManualDeliveryLitres] = useState<number>(8000);
  const [manualCloseLitres, setManualCloseLitres] = useState<number>(17980);
  const [manualOpenMeter, setManualOpenMeter] = useState<number>(100000);
  const [manualCloseMeter, setManualCloseMeter] = useState<number>(104000);
  const [manualCashTendered, setManualCashTendered] = useState<number>(90000);

  // Parsed payload & reconciliation report
  const [parsedPayload, setParsedPayload] = useState<ShiftReconciliationPayload | null>(null);
  const [reconReport, setReconReport] = useState<ShiftReconciliationReport | null>(null);
  const [webhookApiKey, setWebhookApiKey] = useState<string>('DEMO-POS-KEY-STN-ALPHA');
  const [webhookResult, setWebhookResult] = useState<string>('');
  const [adapterError, setAdapterError] = useState<string>('');

  useEffect(() => {
    if (tenant.recommendedPosVendor) {
      const v = tenant.recommendedPosVendor as PosVendorId;
      setSelectedVendor(v);
      setColOpeningOverride(POS_COLUMN_PRESETS[v].openingStockCol);
      setColClosingAtgOverride(POS_COLUMN_PRESETS[v].closingAtgCol);
    }
    setDualAstronMode(Boolean(tenant.dualPosSetup));
  }, [tenant.siteCode, tenant.recommendedPosVendor, tenant.dualPosSetup]);

  const handleLoadVendorSample = (vendor: PosVendorId) => {
    setSelectedVendor(vendor);
    setAdapterError('');
    setColOpeningOverride(POS_COLUMN_PRESETS[vendor].openingStockCol);
    setColClosingAtgOverride(POS_COLUMN_PRESETS[vendor].closingAtgCol);
    const fmt = POS_VENDOR_METADATA[vendor].defaultFormat === 'XML' ? 'XML' : 'CSV';
    setPrimaryRaw(generateSamplePosExport(vendor, fmt));
    if (vendor === 'NAMOS') {
      setDualAstronMode(true);
      setSecondaryShopRaw(generateSamplePosExport('SYMPHONY', 'CSV'));
    }
  };

  const handleFileUpload = async (file: File | null, target: 'primary' | 'secondary') => {
    if (!file) return;
    const text = await file.text();
    if (target === 'primary') {
      setPrimaryRaw(text);
    } else {
      setSecondaryShopRaw(text);
    }
  };

  const handleParseAndReconcile = () => {
    setAdapterError('');
    try {
      let canonical: ShiftReconciliationPayload;
      if (selectedVendor === 'MANUAL_QUICK_ENTRY') {
        canonical = buildManualQuickEntryPayload({
          siteCode: tenant.siteCode,
          shiftId: `SHF-MAN-${Date.now().toString(36).toUpperCase()}`,
          cashierOrSupervisor: 'Standalone Site Supervisor',
          tankReadings: [
            {
              tankId: 'TK-01',
              fuelGrade: 'ULP_95',
              tankCapacityLitres: 30000,
              openingLitres: manualOpenLitres,
              deliveryLitres: manualDeliveryLitres,
              closingAtgLitres: manualCloseLitres,
              waterLevelMm: 3,
              temperatureC: 15,
            },
          ],
          nozzleTotalizers: [
            {
              nozzleId: 'NZ-01',
              pumpNumber: 1,
              tankId: 'TK-01',
              fuelGrade: 'ULP_95',
              openingTotalizerLitres: manualOpenMeter,
              closingTotalizerLitres: manualCloseMeter,
              pumpTestReturnLitres: 0,
              unitPriceLocal: 22.5,
            },
          ],
          shopSales: {
            convenienceSalesLocal: 0,
            qsrFoodSalesLocal: 0,
            lubricantsAndGasLocal: 0,
            totalShopSalesLocal: 0,
          },
          tenders: {
            cashDropsLocal: manualCashTendered,
            cashOnHandLocal: 0,
            speedpointCardLocal: 0,
            fleetCardLocal: 0,
            eftLocal: 0,
            vouchersLocal: 0,
          },
        });
      } else {
        const trimmed = primaryRaw.trim();
        const primary =
          selectedVendor === 'GENERIC_CSV' || selectedVendor === 'GENERIC_XML'
            ? autoDetectVendorAndParse(trimmed, '', {
                siteCode: tenant.siteCode,
                columnOverrides: {
                  openingStockCol: colOpeningOverride,
                  closingAtgCol: colClosingAtgOverride,
                },
              })
            : trimmed.startsWith('<')
              ? parseXmlShiftExport(trimmed, selectedVendor, { siteCode: tenant.siteCode })
              : parseCsvShiftExport(trimmed, selectedVendor, {
                  siteCode: tenant.siteCode,
                  columnOverrides: {
                    openingStockCol: colOpeningOverride,
                    closingAtgCol: colClosingAtgOverride,
                  },
                });

        if (dualAstronMode && secondaryShopRaw.trim()) {
          const shopStream = parseCsvShiftExport(secondaryShopRaw, 'SYMPHONY', {
            siteCode: tenant.siteCode,
          });
          canonical = mergeShiftReconciliationStreams(primary, shopStream);
        } else {
          canonical = primary;
        }
      }

      const report = reconcileShift(canonical);
      setParsedPayload(canonical);
      setReconReport(report);
      if (report.generatedNcrs.length > 0) {
        addNcrs(report.generatedNcrs);
      }
    } catch (err: any) {
      setAdapterError(err?.message || 'Failed to parse POS shift export.');
    }
  };

  const handleTestWebhook = async () => {
    setWebhookResult('Sending POST /api/v1/pos/shift-ingest...');
    try {
      const bodyPayload: Record<string, any> = {
        format: primaryRaw.trim().startsWith('<') ? 'XML' : 'CSV',
        vendor: selectedVendor,
        rawContent: primaryRaw,
        siteCode: tenant.siteCode,
      };
      if (dualAstronMode && secondaryShopRaw.trim()) {
        bodyPayload.secondaryShopStream = {
          format: 'CSV',
          vendor: 'SYMPHONY',
          rawContent: secondaryShopRaw,
        };
      }

      const res = await fetch('/api/v1/pos/shift-ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': webhookApiKey,
          'x-tenant-id': tenant.siteCode,
        },
        body: JSON.stringify(bodyPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        setWebhookResult(`HTTP ${res.status}: ${data.error || 'Rejected'}`);
        return;
      }
      setParsedPayload(data.payload);
      setReconReport(data.reconciliation);
      if (data.reconciliation?.generatedNcrs?.length > 0) {
        addNcrs(data.reconciliation.generatedNcrs);
      }
      setWebhookResult(
        `HTTP 200 OK • Ingestion ${data.ingestionId} • SHA-256: ${String(data.sha256Digest).slice(0, 16)}...`
      );
    } catch (err: any) {
      setWebhookResult(`Network error: ${err?.message || 'failed'}`);
    }
  };

  return (
    <div className="space-y-6" data-testid="pillar-workspace-shift-wetstock">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'shiftCashUp' as const, label: 'Shift Cash-Up & Nozzle Rollover', icon: Gauge },
            { id: 'posImport' as const, label: 'Universal POS / BOS Plug-In Adapter', icon: Upload },
            { id: 'varianceEngine' as const, label: 'Native Wetstock & SIR Forensics', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`wetstock-subtab-${tab.id}`}
                onClick={() => onSubTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  activeSubTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-amber-300 px-3">
          Pillar 2 • Shift Cash-Up &amp; Wetstock ({tenant.siteCode})
        </span>
      </div>

      {activeSubTab === 'shiftCashUp' && (
        <div className="space-y-6">
          <DualModeWetstockPanel />
        </div>
      )}

      {activeSubTab === 'posImport' && (
        <div className="space-y-6" data-testid="pos-ingestion-adapter-panel">
          {/* Connector Selector & Dual-Stream Astron Energy Note */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                  Universal POS &amp; BOS Ingestion Adapter
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Plug-and-play connectors for <strong>WinBranch</strong> (BP &amp; Engen), <strong>ISIS</strong> (TotalEnergies), <strong>NAMOS + Symphony</strong> dual-BOS (Astron Energy / FreshStop), <strong>SmartFuel</strong>, <strong>Gilbarco</strong>, <strong>Tokheim</strong>, Generic CSV/XML &amp; Manual Quick-Entry.
                </p>
              </div>
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="pos-dual-stream-toggle"
                  checked={dualAstronMode}
                  onChange={(e) => setDualAstronMode(e.target.checked)}
                />
                <GitMerge className="w-4 h-4 text-amber-400" />
                <span>Dual-BOS Merge (Astron NAMOS + FreshStop Symphony)</span>
              </label>
            </div>

            {/* Vendor Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {(Object.keys(POS_VENDOR_METADATA) as PosVendorId[]).map((vId) => {
                const meta = POS_VENDOR_METADATA[vId];
                const isSelected = selectedVendor === vId;
                return (
                  <button
                    key={vId}
                    type="button"
                    data-testid={`pos-vendor-btn-${vId}`}
                    onClick={() => handleLoadVendorSample(vId)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black">{meta.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-amber-300 truncate">{meta.brandAlignment}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{meta.defaultFormat}</div>
                  </button>
                );
              })}
            </div>

            {selectedVendor === 'MANUAL_QUICK_ENTRY' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Open Stock (L)</label>
                  <input type="number" value={manualOpenLitres} onChange={(e) => setManualOpenLitres(Number(e.target.value))} className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Delivery (L)</label>
                  <input type="number" value={manualDeliveryLitres} onChange={(e) => setManualDeliveryLitres(Number(e.target.value))} className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Close Dip (L)</label>
                  <input type="number" value={manualCloseLitres} onChange={(e) => setManualCloseLitres(Number(e.target.value))} className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Open Meter</label>
                  <input type="number" value={manualOpenMeter} onChange={(e) => setManualOpenMeter(Number(e.target.value))} className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Close Meter</label>
                  <input type="number" value={manualCloseMeter} onChange={(e) => setManualCloseMeter(Number(e.target.value))} className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Tendered</label>
                  <input type="number" value={manualCashTendered} onChange={(e) => setManualCashTendered(Number(e.target.value))} className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Column-Mapping Presets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">
                      Visual Column Map: Opening Stock Header ({selectedVendor})
                    </label>
                    <input
                      type="text"
                      value={colOpeningOverride}
                      onChange={(e) => setColOpeningOverride(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">
                      Visual Column Map: Closing ATG Header ({selectedVendor})
                    </label>
                    <input
                      type="text"
                      value={colClosingAtgOverride}
                      onChange={(e) => setColClosingAtgOverride(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono"
                    />
                  </div>
                </div>

                {/* Primary & Optional Dual-Stream Inputs */}
                <div className={`grid grid-cols-1 ${dualAstronMode ? 'lg:grid-cols-2' : ''} gap-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        Primary Stream ({POS_VENDOR_METADATA[selectedVendor].name})
                      </span>
                      <label className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer font-bold">
                        Drop / Browse CSV or XML
                        <input
                          type="file"
                          accept=".csv,.xml,.txt"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'primary')}
                        />
                      </label>
                    </div>
                    <textarea
                      rows={6}
                      data-testid="pos-primary-raw-textarea"
                      value={primaryRaw}
                      onChange={(e) => setPrimaryRaw(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200"
                    />
                  </div>

                  {dualAstronMode && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300">
                          Secondary Stream (Symphony — FreshStop Shop &amp; QSR)
                        </span>
                        <label className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer font-bold">
                          Browse Symphony CSV
                          <input
                            type="file"
                            accept=".csv,.txt"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'secondary')}
                          />
                        </label>
                      </div>
                      <textarea
                        rows={6}
                        data-testid="pos-secondary-raw-textarea"
                        value={secondaryShopRaw}
                        onChange={(e) => setSecondaryShopRaw(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-amber-500/40 font-mono text-[11px] text-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions: Parse Locally + Push via REST Webhook */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                data-testid="pos-parse-reconcile-btn"
                onClick={handleParseAndReconcile}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Normalize &amp; Run Wetstock / Cash-Up Reconciliation</span>
              </button>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <input
                  type="text"
                  value={webhookApiKey}
                  onChange={(e) => setWebhookApiKey(e.target.value)}
                  aria-label="POS Webhook API Key"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-200 w-52"
                />
                <button
                  type="button"
                  data-testid="pos-test-webhook-btn"
                  onClick={handleTestWebhook}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black flex items-center gap-1.5"
                >
                  <Webhook className="w-4 h-4" />
                  <span>POST /api/v1/pos/shift-ingest</span>
                </button>
              </div>
            </div>

            {adapterError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-xs text-rose-200 font-bold">
                {adapterError}
              </div>
            )}
            {webhookResult && (
              <div
                data-testid="pos-webhook-status"
                className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200"
              >
                {webhookResult}
              </div>
            )}
          </div>

          {/* Canonical Reconciliation Output */}
          {parsedPayload && reconReport && (
            <div
              data-testid="pos-reconciliation-output"
              className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-300">
                    Sources: {reconReport.sourceVendors.join(' + ')} • Shift {reconReport.shiftId}
                  </div>
                  <h4 className="text-lg font-black text-white">
                    Normalized Shift Reconciliation &amp; Cash-Up Result
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    reconReport.overallStatus === 'COMPLIANT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {reconReport.overallStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Fuel POS Revenue</div>
                  <div className="text-lg font-mono font-black text-white">
                    {parsedPayload.currency} {reconReport.cashUpSummary.expectedFuelRevenueLocal.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Shop / QSR Revenue</div>
                  <div className="text-lg font-mono font-black text-cyan-300">
                    {parsedPayload.currency} {reconReport.cashUpSummary.expectedShopRevenueLocal.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Total Tendered</div>
                  <div className="text-lg font-mono font-black text-emerald-300">
                    {parsedPayload.currency} {reconReport.cashUpSummary.totalTenderedLocal.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Cash-Up Variance</div>
                  <div
                    className={`text-lg font-mono font-black ${
                      reconReport.cashUpSummary.withinTolerance ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {parsedPayload.currency} {reconReport.cashUpSummary.cashVarianceLocal}
                  </div>
                </div>
              </div>

              {/* Tank Mass Balance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                      <th className="py-2 px-3">Tank</th>
                      <th className="py-2 px-3">Grade</th>
                      <th className="py-2 px-3 text-right">Book Stock (L)</th>
                      <th className="py-2 px-3 text-right">Actual Closing (L)</th>
                      <th className="py-2 px-3 text-right">Variance</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {reconReport.tankResults.map((tk) => (
                      <tr key={tk.tankId}>
                        <td className="py-2 px-3 font-mono font-bold text-cyan-300">{tk.tankId}</td>
                        <td className="py-2 px-3 text-white">{tk.fuelGrade}</td>
                        <td className="py-2 px-3 text-right font-mono">{tk.bookStockLitres.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono">{tk.actualClosingLitres.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          {tk.varianceLitres} L ({tk.variancePercent}%)
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              tk.status === 'COMPLIANT'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {tk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reconReport.generatedNcrs.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>
                    {reconReport.generatedNcrs.length} Non-Conformance Report(s) automatically created and routed to Pillar 4 (Executive Audit &amp; NCRs).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'varianceEngine' && (
        <WetstockManagementModule
          lang={lang}
          onNavigateTab={onNavigateTarget}
          onOpenStatutoryModal={onOpenStatutoryModal}
          onOpenCertModal={onOpenCertModal}
        />
      )}
    </div>
  );
};

