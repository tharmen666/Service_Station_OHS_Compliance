import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  Droplet, 
  Fuel, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Filter, 
  FileText, 
  FileCheck, 
  Activity, 
  Clock, 
  Layers, 
  Lock, 
  Unlock, 
  RefreshCw, 
  ArrowUpRight, 
  Sliders, 
  ShieldCheck, 
  AlertOctagon, 
  Calendar, 
  Building2,
  ExternalLink,
  ChevronRight,
  Truck,
  Plus,
  Radio
} from 'lucide-react';
import { Language, translations } from '../data/translations';
import { getActiveTenant } from '../multiTenantConfig';
import { 
  reconcileTankDaily, 
  TankDailyInput, 
  TankReconciliationResult, 
  FuelGrade, 
  LineMaterial, 
  WetstockTriggerAlert,
  APPROVED_EWURA_ATG_MODELS
} from '../lib/wetstockEngine';

interface WetstockManagementModuleProps {
  lang?: Language;
  onNavigateTab?: (tab: string) => void;
  onOpenStatutoryModal?: () => void;
  onOpenCertModal?: () => void;
}

export const WetstockManagementModule: React.FC<WetstockManagementModuleProps> = ({
  lang = 'EN',
  onNavigateTab,
  onOpenStatutoryModal,
  onOpenCertModal,
}) => {
  const tenant = getActiveTenant();
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'INVESTIGATE' | 'CRITICAL_LOCKOUT'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabSubView, setActiveTabSubView] = useState<'ledger' | 'forensics' | 'ebol' | 'simulator'>('ledger');
  const [selectedTankForForensics, setSelectedTankForForensics] = useState<TankReconciliationResult | null>(null);

  // Baseline Tank Operational Data
  const initialTanksData: TankDailyInput[] = [
    {
      tankId: 'TK-01',
      siteId: tenant.siteCode,
      dateIso: new Date().toISOString().split('T')[0],
      fuelGrade: 'ULP_95',
      capacityLitres: 30000,
      lineMaterial: 'DOUBLE_WALL_HDPE',
      openingStockLitres: 14200,
      deliveriesNetLitres: 12000,
      bolVolumeLitres: 12015,
      meteredSalesLitres: 7850,
      atgClosingLitres: 18320,
      manualDipClosingLitres: 18310,
      waterPasteLevelMm: 4,
      currentTankLevelMm: 1650,
      priorConsecutiveNegativeDays: 0,
      rolling7DayVarianceLitres: -45,
      rolling7DaySalesLitres: 52000,
      vacuSonicCertificateValid: true,
    },
    {
      tankId: 'TK-02',
      siteId: tenant.siteCode,
      dateIso: new Date().toISOString().split('T')[0],
      fuelGrade: 'ULP_93',
      capacityLitres: 25000,
      lineMaterial: 'DOUBLE_WALL_HDPE',
      openingStockLitres: 10500,
      deliveriesNetLitres: 0,
      bolVolumeLitres: 0,
      meteredSalesLitres: 4200,
      atgClosingLitres: 6280,
      manualDipClosingLitres: 6275,
      waterPasteLevelMm: 6,
      currentTankLevelMm: 890,
      priorConsecutiveNegativeDays: 1,
      rolling7DayVarianceLitres: -30,
      rolling7DaySalesLitres: 31000,
      vacuSonicCertificateValid: true,
    },
    {
      tankId: 'TK-03',
      siteId: tenant.siteCode,
      dateIso: new Date().toISOString().split('T')[0],
      fuelGrade: 'DIESEL_50PPM',
      capacityLitres: 35000,
      lineMaterial: 'DOUBLE_WALL_HDPE',
      openingStockLitres: 19800,
      deliveriesNetLitres: 16000,
      bolVolumeLitres: 16030,
      meteredSalesLitres: 11400,
      atgClosingLitres: 24350,
      manualDipClosingLitres: 24340,
      waterPasteLevelMm: 8,
      currentTankLevelMm: 2100,
      priorConsecutiveNegativeDays: 0,
      rolling7DayVarianceLitres: 15,
      rolling7DaySalesLitres: 78000,
      vacuSonicCertificateValid: true,
    },
    {
      tankId: 'TK-04',
      siteId: tenant.siteCode,
      dateIso: new Date().toISOString().split('T')[0],
      fuelGrade: 'DIESEL_10PPM',
      capacityLitres: 20000,
      lineMaterial: 'LEGACY_STEEL',
      openingStockLitres: 8400,
      deliveriesNetLitres: 0,
      bolVolumeLitres: 0,
      meteredSalesLitres: 2900,
      atgClosingLitres: 5260,
      manualDipClosingLitres: 5240,
      waterPasteLevelMm: 12,
      currentTankLevelMm: 720,
      priorConsecutiveNegativeDays: 3, // Multi-day negative trend!
      rolling7DayVarianceLitres: -210, // Cumulative breach!
      rolling7DaySalesLitres: 22000,
      vacuSonicCertificateValid: false, // Legacy steel without NDT
    },
    {
      tankId: 'TK-05',
      siteId: tenant.siteCode,
      dateIso: new Date().toISOString().split('T')[0],
      fuelGrade: 'ILLUMINATING_PARAFFIN',
      capacityLitres: 15000,
      lineMaterial: 'DOUBLE_WALL_HDPE',
      openingStockLitres: 6100,
      deliveriesNetLitres: 0,
      bolVolumeLitres: 0,
      meteredSalesLitres: 1250,
      atgClosingLitres: 4845,
      manualDipClosingLitres: 4840,
      waterPasteLevelMm: 5,
      currentTankLevelMm: 620,
      priorConsecutiveNegativeDays: 0,
      rolling7DayVarianceLitres: -10,
      rolling7DaySalesLitres: 8900,
      vacuSonicCertificateValid: true,
    }
  ];

  // Simulator Form State
  const [simulatorTankId, setSimulatorTankId] = useState<string>('TK-01');
  const [simOpening, setSimOpening] = useState<number>(14200);
  const [simDeliveries, setSimDeliveries] = useState<number>(12000);
  const [simBol, setSimBol] = useState<number>(12015);
  const [simSales, setSimSales] = useState<number>(7850);
  const [simAtgClosing, setSimAtgClosing] = useState<number>(18320);
  const [simDipClosing, setSimDipClosing] = useState<number>(18310);
  const [simWaterMm, setSimWaterMm] = useState<number>(4);
  const [simGrade, setSimGrade] = useState<FuelGrade>('ULP_95');
  const [simLineMaterial, setSimLineMaterial] = useState<LineMaterial>('DOUBLE_WALL_HDPE');
  const [simPriorNegDays, setSimPriorNegDays] = useState<number>(0);
  const [simVacuSonicValid, setSimVacuSonicValid] = useState<boolean>(true);

  // Compute live reconciliation results for all tanks
  const reconciliationResults = useMemo(() => {
    return initialTanksData.map(tank => reconcileTankDaily(tank));
  }, [initialTanksData]);

  // Compute live simulator result
  const simulatorResult = useMemo(() => {
    const input: TankDailyInput = {
      tankId: simulatorTankId,
      siteId: tenant.siteCode,
      dateIso: new Date().toISOString().split('T')[0],
      fuelGrade: simGrade,
      capacityLitres: 30000,
      lineMaterial: simLineMaterial,
      openingStockLitres: simOpening,
      deliveriesNetLitres: simDeliveries,
      bolVolumeLitres: simBol,
      meteredSalesLitres: simSales,
      atgClosingLitres: simAtgClosing,
      manualDipClosingLitres: simDipClosing,
      waterPasteLevelMm: simWaterMm,
      priorConsecutiveNegativeDays: simPriorNegDays,
      rolling7DayVarianceLitres: -50,
      rolling7DaySalesLitres: 45000,
      vacuSonicCertificateValid: simVacuSonicValid,
    };
    return reconcileTankDaily(input);
  }, [
    simulatorTankId, simOpening, simDeliveries, simBol, simSales, 
    simAtgClosing, simDipClosing, simWaterMm, simGrade, simLineMaterial, 
    simPriorNegDays, simVacuSonicValid, tenant.siteCode
  ]);

  // Site Aggregate Totals
  const siteTotals = useMemo(() => {
    let totalOpening = 0;
    let totalDeliveries = 0;
    let totalSales = 0;
    let totalPhysical = 0;
    let totalVarianceLitres = 0;
    let criticalLockoutCount = 0;
    let investigateCount = 0;

    reconciliationResults.forEach(r => {
      const tankInput = initialTanksData.find(t => t.tankId === r.tankId);
      if (tankInput) {
        totalOpening += tankInput.openingStockLitres;
        totalDeliveries += tankInput.deliveriesNetLitres;
        totalSales += tankInput.meteredSalesLitres;
      }
      totalPhysical += r.physicalClosingLitres;
      totalVarianceLitres += r.dailyVarianceLitres;
      if (r.status === 'CRITICAL_LOCKOUT') criticalLockoutCount++;
      if (r.status === 'INVESTIGATE') investigateCount++;
    });

    const netVariancePercent = totalSales > 0 ? (totalVarianceLitres / totalSales) * 100 : 0;

    return {
      totalOpening,
      totalDeliveries,
      totalSales,
      totalPhysical,
      totalVarianceLitres: Math.round(totalVarianceLitres * 10) / 10,
      netVariancePercent: Math.round(netVariancePercent * 100) / 100,
      criticalLockoutCount,
      investigateCount,
      totalTanks: reconciliationResults.length,
      siteCompliant: criticalLockoutCount === 0 && Math.abs(netVariancePercent) <= 0.5
    };
  }, [reconciliationResults, initialTanksData]);

  // Product Filter
  const filteredResults = reconciliationResults.filter(r => {
    const tankInput = initialTanksData.find(t => t.tankId === r.tankId);
    if (!tankInput) return false;

    const matchesProduct = 
      selectedProduct === 'ALL' || 
      (selectedProduct === 'ULP_95' && tankInput.fuelGrade === 'ULP_95') ||
      (selectedProduct === 'ULP_93' && tankInput.fuelGrade === 'ULP_93') ||
      (selectedProduct === 'DIESEL_50' && tankInput.fuelGrade === 'DIESEL_50PPM') ||
      (selectedProduct === 'DIESEL_10' && tankInput.fuelGrade === 'DIESEL_10PPM') ||
      (selectedProduct === 'PARAFFIN' && tankInput.fuelGrade === 'ILLUMINATING_PARAFFIN');

    const matchesStatus = 
      selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;

    const matchesQuery = 
      searchQuery === '' ||
      r.tankId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tankInput.fuelGrade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tankInput.lineMaterial.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProduct && matchesStatus && matchesQuery;
  });

  const getGradeLabel = (grade: FuelGrade) => {
    switch (grade) {
      case 'ULP_95': return 'Unleaded Petrol 95 (ULP 95)';
      case 'ULP_93': return 'Unleaded Petrol 93 (ULP 93)';
      case 'DIESEL_50PPM': return 'Diesel 50ppm (Low Sulphur)';
      case 'DIESEL_10PPM': return 'Diesel 10ppm (Ultra-Low)';
      case 'ILLUMINATING_PARAFFIN': return 'Illuminating Paraffin (IP)';
    }
  };

  const getGradeColor = (grade: FuelGrade) => {
    switch (grade) {
      case 'ULP_95': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'ULP_93': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'DIESEL_50PPM': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'DIESEL_10PPM': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'ILLUMINATING_PARAFFIN': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      
      {/* 1. Header & High-Level Telemetry Banner */}
      <div className="pos-card p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-[#071329] via-[#091838] to-[#070d1e] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-500/40">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Wetstock Management &amp; Loss Forensics
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                SANS 10089-1/3 Compliant
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-black border border-purple-500/30 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                ATG TLS-450+ Online
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Wetstock Accounting &amp; Automatic Tank Gauge (ATG) Reconciliation
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Standardized daily reconciliation under South African SANS 10089, eBOL seal verification, 
              temperature-compensated density tracking (15°C), and 4-tier Etwatwa loss forensics with VacuSonic NDT hard-lock containment.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenStatutoryModal && (
              <button
                onClick={onOpenStatutoryModal}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center gap-2"
                title="Open Autonomous Section 24 COIDA / NEMA Incident Generator"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Doc Generator</span>
              </button>
            )}

            {onOpenCertModal && (
              <button
                onClick={onOpenCertModal}
                className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-950/40"
                title="Generate Daily Reconciliation Sign-off Certificate"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Reconciliation Cert</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary Telemetry Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Fuel Inventory</div>
              <div className="text-xl md:text-2xl font-black text-cyan-400 mt-0.5">{siteTotals.totalPhysical.toLocaleString()} L</div>
              <div className="text-[10px] text-slate-400">Across {siteTotals.totalTanks} Storage Tanks</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Day Metered Sales</div>
              <div className="text-xl md:text-2xl font-black text-white mt-0.5">{siteTotals.totalSales.toLocaleString()} L</div>
              <div className="text-[10px] text-slate-400">Total Forecourt Throughput</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Day Variance</div>
              <div className={`text-xl md:text-2xl font-black mt-0.5 flex items-center gap-1 ${
                siteTotals.totalVarianceLitres < 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {siteTotals.totalVarianceLitres > 0 ? `+${siteTotals.totalVarianceLitres}` : siteTotals.totalVarianceLitres} L
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {siteTotals.netVariancePercent}% of throughput (tol: ±0.5%)
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              siteTotals.totalVarianceLitres < 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {siteTotals.totalVarianceLitres < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Site Compliance</div>
              <div className={`text-xl md:text-2xl font-black mt-0.5 ${
                siteTotals.criticalLockoutCount > 0 ? 'text-rose-400' : siteTotals.investigateCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {siteTotals.criticalLockoutCount > 0 ? 'LOCKOUT' : siteTotals.investigateCount > 0 ? 'INVESTIGATE' : 'COMPLIANT'}
              </div>
              <div className="text-[10px] text-slate-400">
                {siteTotals.criticalLockoutCount > 0 ? 'Tier 4 Hard-Lock Active' : 'All Tanks in Tolerance'}
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              siteTotals.criticalLockoutCount > 0 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {siteTotals.criticalLockoutCount > 0 ? <AlertOctagon className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation View Switcher */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTabSubView('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
              activeTabSubView === 'ledger'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Daily Reconciliation Ledger</span>
          </button>

          <button
            onClick={() => setActiveTabSubView('forensics')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
              activeTabSubView === 'forensics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Loss/Gain Forensics (5 Triggers)</span>
          </button>

          <button
            onClick={() => setActiveTabSubView('ebol')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
              activeTabSubView === 'ebol'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>eBOL Tanker Seal Tracking</span>
          </button>

          <button
            onClick={() => setActiveTabSubView('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
              activeTabSubView === 'simulator'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Interactive Day Simulator</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
          <span>Site:</span>
          <strong className="text-amber-400">{tenant.siteCode}</strong>
          <span className="text-slate-600">•</span>
          <span>SANS 10089 Max Drift: <strong>±0.5%</strong></span>
        </div>
      </div>

      {/* 3. PRODUCT BREAKDOWN FILTER BAR (for Ledger and Forensics views) */}
      {(activeTabSubView === 'ledger' || activeTabSubView === 'forensics') && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          
          {/* Product Grade Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Product:
            </span>
            {[
              { id: 'ALL', label: 'All Products' },
              { id: 'ULP_95', label: 'ULP 95' },
              { id: 'ULP_93', label: 'ULP 93' },
              { id: 'DIESEL_50', label: 'Diesel 50ppm' },
              { id: 'DIESEL_10', label: 'Diesel 10ppm' },
              { id: 'PARAFFIN', label: 'Paraffin (IP)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedProduct(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedProduct === tab.id
                    ? 'bg-slate-200 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setSelectedStatusFilter('COMPLIANT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusFilter === 'COMPLIANT'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-emerald-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Compliant
            </button>
            <button
              onClick={() => setSelectedStatusFilter('INVESTIGATE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusFilter === 'INVESTIGATE'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-amber-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Investigate
            </button>
            <button
              onClick={() => setSelectedStatusFilter('CRITICAL_LOCKOUT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusFilter === 'CRITICAL_LOCKOUT'
                  ? 'bg-rose-500 text-white font-black'
                  : 'bg-slate-950 text-rose-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Lockout
            </button>
          </div>
        </div>
      )}

      {/* VIEW A: DAILY RECONCILIATION LEDGER */}
      {activeTabSubView === 'ledger' && (
        <div className="space-y-6">
          
          {/* Main Reconciliation Table */}
          <div className="pos-card p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-cyan-400" />
                  Daily Tank Wetstock Reconciliation Ledger
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Formula: Book Closing = Opening + Deliveries - Metered Sales | Variance = Physical ATG Closing - Book Closing
                </p>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                  Standard SANS Tolerance: <strong>±0.5% of throughput</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider bg-slate-950/70">
                    <th className="py-3 px-3">Tank &amp; Product</th>
                    <th className="py-3 px-3">Line Spec</th>
                    <th className="py-3 px-3 text-right">Opening (L)</th>
                    <th className="py-3 px-3 text-right">Deliveries (L)</th>
                    <th className="py-3 px-3 text-right">Sales (L)</th>
                    <th className="py-3 px-3 text-right">Book Close (L)</th>
                    <th className="py-3 px-3 text-right">Physical ATG (L)</th>
                    <th className="py-3 px-3 text-right">Dip Delta</th>
                    <th className="py-3 px-3 text-right">Water mm</th>
                    <th className="py-3 px-3 text-right">Variance (L / %)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredResults.map(result => {
                    const input = initialTanksData.find(t => t.tankId === result.tankId)!;
                    const isLockout = result.status === 'CRITICAL_LOCKOUT';
                    const isInvestigate = result.status === 'INVESTIGATE';
                    const isCompliant = result.status === 'COMPLIANT';

                    return (
                      <tr key={result.tankId} className="hover:bg-slate-800/40 transition">
                        
                        {/* Tank & Product */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-slate-800 text-cyan-300 border border-slate-700">
                              {result.tankId}
                            </span>
                            <span className="font-black">{input.fuelGrade}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 ml-8">
                            Cap: {input.capacityLitres.toLocaleString()} L
                          </div>
                        </td>

                        {/* Line Material */}
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            input.lineMaterial === 'LEGACY_STEEL' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {input.lineMaterial === 'LEGACY_STEEL' ? 'Legacy Steel (High Risk)' : 'Double-Wall HDPE'}
                          </span>
                        </td>

                        {/* Opening */}
                        <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                          {input.openingStockLitres.toLocaleString()}
                        </td>

                        {/* Deliveries */}
                        <td className="py-3.5 px-3 text-right font-mono text-cyan-300">
                          {input.deliveriesNetLitres > 0 ? `+${input.deliveriesNetLitres.toLocaleString()}` : '0'}
                        </td>

                        {/* Sales */}
                        <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                          {input.meteredSalesLitres.toLocaleString()}
                        </td>

                        {/* Book Close */}
                        <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                          {result.bookClosingLitres.toLocaleString()}
                        </td>

                        {/* Physical ATG */}
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                          {result.physicalClosingLitres.toLocaleString()}
                        </td>

                        {/* Dip Delta */}
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className={result.atgVsDipCompliant ? 'text-slate-400' : 'text-rose-400 font-bold'}>
                            {result.atgVsDipDeltaLitres} L
                          </span>
                        </td>

                        {/* Water Paste mm */}
                        <td className="py-3.5 px-3 text-right font-mono">
                          <span className={result.waterLevelCompliant ? 'text-emerald-400' : 'text-rose-400 font-black'}>
                            {input.waterPasteLevelMm} mm
                          </span>
                        </td>

                        {/* Daily Variance */}
                        <td className="py-3.5 px-3 text-right font-mono font-bold">
                          <div className={result.dailyVarianceLitres < 0 ? 'text-amber-400' : 'text-emerald-400'}>
                            {result.dailyVarianceLitres > 0 ? `+${result.dailyVarianceLitres}` : result.dailyVarianceLitres} L
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {result.dailyVariancePercent > 0 ? `+${result.dailyVariancePercent}` : result.dailyVariancePercent}%
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3 text-center">
                          {isCompliant && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> COMPLIANT
                            </span>
                          )}
                          {isInvestigate && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black inline-flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-amber-400" /> INVESTIGATE
                            </span>
                          )}
                          {isLockout && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10px] font-black inline-flex items-center gap-1">
                              <Lock className="w-3 h-3 text-rose-400" /> HARD LOCK
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedTankForForensics(result);
                              setActiveTabSubView('forensics');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-[11px] transition inline-flex items-center gap-1"
                          >
                            <span>Forensics</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Underground Tanks Visual Fill Capacity Cards */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-400" />
              Underground Storage Tanks (UST) Live Holding Volumes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {initialTanksData.map(tank => {
                const fillPct = Math.round((tank.atgClosingLitres / tank.capacityLitres) * 100);
                const rec = reconciliationResults.find(r => r.tankId === tank.tankId)!;
                const isLockout = rec.status === 'CRITICAL_LOCKOUT';

                return (
                  <div
                    key={tank.tankId}
                    className={`p-4 rounded-2xl bg-slate-950 border transition flex flex-col justify-between space-y-3 ${
                      isLockout ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-black text-white">{tank.tankId}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{tank.fuelGrade}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isLockout ? 'bg-rose-500 text-white' : 'bg-slate-800 text-cyan-300'
                      }`}>
                        {fillPct}% Full
                      </span>
                    </div>

                    {/* Progress Bar Gauge */}
                    <div className="space-y-1">
                      <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLockout 
                              ? 'bg-rose-500' 
                              : fillPct < 25 
                              ? 'bg-amber-400' 
                              : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{tank.atgClosingLitres.toLocaleString()} L</span>
                        <span>{tank.capacityLitres.toLocaleString()} L</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Var:</span>
                      <span className={`font-mono font-bold ${rec.dailyVarianceLitres < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {rec.dailyVarianceLitres > 0 ? `+${rec.dailyVarianceLitres}` : rec.dailyVarianceLitres} L ({rec.dailyVariancePercent}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW B: LOSS / GAIN FORENSICS (5 MANDATORY TRIGGERS & 4-TIER ETWATWA PROTOCOL) */}
      {activeTabSubView === 'forensics' && (
        <div className="space-y-6">
          
          {/* Forensics Header Banner */}
          <div className="pos-card p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-1 border border-amber-500/30">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Statutory Petroleum Forensics Protocol
                </div>
                <h3 className="text-xl font-black text-white">
                  The 5 Mandatory Wetstock Triggers &amp; 4-Tier Etwatwa Protocol
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 max-w-2xl">
                  Automated loss forensics detects subterranean pipeline weeping, tanker drop shortages, meter drift, and water ingress. 
                  Critical triggers enforce VacuSonic NDT hard-locks to prevent catastrophic environmental spill liabilities under NEMA Section 30.
                </p>
              </div>

              {onOpenStatutoryModal && (
                <button
                  onClick={onOpenStatutoryModal}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-rose-950/50"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Escalate to Section 24 Incident</span>
                </button>
              )}
            </div>

            {/* 5 Triggers Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {[
                { num: 1, title: 'Trigger 1', subtitle: 'Single-Day Spike', rule: '> 0.5% of sales or > 200 Litres loss' },
                { num: 2, title: 'Trigger 2', subtitle: '3-Day Trend', rule: '3 consecutive negative variance days' },
                { num: 3, title: 'Trigger 3', subtitle: 'Rolling 7-Day Breach', rule: '> 0.35% rolling sales loss' },
                { num: 4, title: 'Trigger 4', subtitle: 'Delivery Transit Deficit', rule: '> 0.2% shortage vs BOL manifest' },
                { num: 5, title: 'Trigger 5', subtitle: 'Water / ATG Drift', rule: '> 15mm ULP / 25mm Diesel or dip drift' }
              ].map(t => (
                <div key={t.num} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider">{t.title}</div>
                  <div className="text-xs font-bold text-white">{t.subtitle}</div>
                  <div className="text-[10px] text-slate-400">{t.rule}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Forensic Alerts by Tank */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Active Tank Forensic Diagnostics &amp; Escalation Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reconciliationResults.map(result => {
                const input = initialTanksData.find(t => t.tankId === result.tankId)!;
                const hasTriggers = result.triggers.length > 0;
                const protocol = result.forensicProtocol;
                const isLockout = result.status === 'CRITICAL_LOCKOUT';

                return (
                  <div
                    key={result.tankId}
                    className={`p-5 rounded-3xl bg-slate-900 border transition-all space-y-4 shadow-xl ${
                      isLockout 
                        ? 'border-rose-500/60 bg-rose-950/10' 
                        : hasTriggers 
                        ? 'border-amber-500/50 bg-amber-950/10' 
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg font-mono font-black text-xs bg-slate-800 text-cyan-300 border border-slate-700">
                          {result.tankId}
                        </span>
                        <div>
                          <div className="text-sm font-black text-white">{input.fuelGrade}</div>
                          <div className="text-[11px] text-slate-400">Spec: {input.lineMaterial}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1 ${
                        isLockout 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                          : hasTriggers 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {isLockout ? <Lock className="w-3 h-3" /> : hasTriggers ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {result.status}
                      </span>
                    </div>

                    {/* Variance Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400">Daily Var</div>
                        <div className={`font-mono text-xs font-black ${result.dailyVarianceLitres < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {result.dailyVarianceLitres} L
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Throughput %</div>
                        <div className={`font-mono text-xs font-black ${result.dailyVariancePercent < -0.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {result.dailyVariancePercent}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Water Paste</div>
                        <div className={`font-mono text-xs font-black ${result.waterLevelCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {input.waterPasteLevelMm} mm
                        </div>
                      </div>
                    </div>

                    {/* Trigger List */}
                    {hasTriggers ? (
                      <div className="space-y-2">
                        <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                          Active Violation Triggers ({result.triggers.length})
                        </div>
                        {result.triggers.map((trig, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1">
                            <div className="font-bold text-amber-300 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span>{trig.title}</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {trig.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>All 5 statutory wetstock triggers clear. Zero subterranean loss anomalies detected.</span>
                      </div>
                    )}

                    {/* Etwatwa Forensic Action Plan */}
                    {protocol && (
                      <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-2">
                        <div className="font-black text-rose-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>{protocol.tierName}</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {protocol.mandatorySteps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 border-t border-rose-500/20 text-[10px] text-rose-300/80 font-mono">
                          Clearance: {protocol.clearanceRequirement}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 flex items-center justify-between text-xs">
                      {isLockout && onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab('spill')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Deploy Spill Team</span>
                        </button>
                      )}
                      
                      {onOpenStatutoryModal && (
                        <button
                          onClick={onOpenStatutoryModal}
                          className="ml-auto text-xs font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                        >
                          <span>Generate Incident File</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW C: eBOL TANKER SEAL & BULK TRANSIT TRACKING */}
      {activeTabSubView === 'ebol' && (
        <div className="space-y-6">
          <div className="pos-card p-6 rounded-3xl border border-purple-500/40 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider mb-1 border border-purple-500/30">
                  <Truck className="w-3.5 h-3.5 text-purple-400" />
                  eBOL Seal &amp; Delivery Reconciliation
                </div>
                <h3 className="text-xl font-black text-white">
                  Bulk Tanker Offloading, Electronic Seal Verification &amp; Density (15°C)
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Reconciles bill-of-lading (BOL) terminal loading manifests against actual forecourt discharge. 
                  Enforces security seal inspection before driver connects offloading elbows to ullage pipes.
                </p>
              </div>

              <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-500/30">
                Transit Tolerance: Max ±0.20%
              </span>
            </div>

            {/* Delivery Drops Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider bg-slate-950/70">
                    <th className="py-3 px-3">eBOL Manifest #</th>
                    <th className="py-3 px-3">Target Tank</th>
                    <th className="py-3 px-3">Carrier / Truck Reg</th>
                    <th className="py-3 px-3">Terminal Temp &amp; Density</th>
                    <th className="py-3 px-3 text-right">BOL Volume (L)</th>
                    <th className="py-3 px-3 text-right">Discharge Recv (L)</th>
                    <th className="py-3 px-3 text-right">Transit Var (L / %)</th>
                    <th className="py-3 px-3 text-center">Seal Verification</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {[
                    {
                      bol: 'eBOL-BGO-01-ALPHA',
                      tank: 'Station Alpha (32k Delivery)',
                      carrier: 'Brilliant Tanker TRK-01 (BG-01-GP)',
                      tempDensity: '19.4°C • 0.742 kg/L',
                      bolLitres: 32000,
                      recvLitres: 31985,
                      varLitres: -15,
                      varPct: -0.05,
                      seal: 'BGO-SEAL-01-OK',
                      status: 'PASS'
                    },
                    {
                      bol: 'eBOL-BGO-02-BRAVO',
                      tank: 'Station Bravo (32k Delivery)',
                      carrier: 'Brilliant Tanker TRK-02 (BG-02-GP)',
                      tempDensity: '20.1°C • 0.835 kg/L',
                      bolLitres: 32000,
                      recvLitres: 31970,
                      varLitres: -30,
                      varPct: -0.09,
                      seal: 'BGO-SEAL-02-OK',
                      status: 'PASS'
                    },
                    {
                      bol: 'eBOL-BGO-03-CHARLIE',
                      tank: 'Station Charlie (32k Delivery)',
                      carrier: 'Brilliant Tanker TRK-03 (BG-03-GP)',
                      tempDensity: '21.5°C • 0.745 kg/L',
                      bolLitres: 32000,
                      recvLitres: 32010,
                      varLitres: 10,
                      varPct: 0.03,
                      seal: 'BGO-SEAL-03-OK',
                      status: 'PASS'
                    },
                    {
                      bol: 'eBOL-BGO-04-DELTA',
                      tank: 'Station Delta (32k Delivery)',
                      carrier: 'Brilliant Tanker TRK-04 (BG-04-GP)',
                      tempDensity: '22.0°C • 0.836 kg/L',
                      bolLitres: 32000,
                      recvLitres: 31980,
                      varLitres: -20,
                      varPct: -0.06,
                      seal: 'BGO-SEAL-04-OK',
                      status: 'PASS'
                    },
                    {
                      bol: 'eBOL-BGO-05-ECHO',
                      tank: 'Station Echo (32k Delivery)',
                      carrier: 'Brilliant Tanker TRK-05 (BG-05-GP)',
                      tempDensity: '20.8°C • 0.834 kg/L',
                      bolLitres: 32000,
                      recvLitres: 31990,
                      varLitres: -10,
                      varPct: -0.03,
                      seal: 'BGO-SEAL-05-OK',
                      status: 'PASS'
                    },
                    {
                      bol: 'eBOL-BGO-06-RESERVE',
                      tank: 'Central Depot Reserve (Buffer)',
                      carrier: 'Brilliant Tanker TRK-06 (BG-06-GP)',
                      tempDensity: '20.0°C • 0.835 kg/L',
                      bolLitres: 32000,
                      recvLitres: 32000,
                      varLitres: 0,
                      varPct: 0.00,
                      seal: 'BGO-SEAL-06-STANDBY',
                      status: 'STANDBY'
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-300">{row.bol}</td>
                      <td className="py-3 px-3 text-white font-bold">{row.tank}</td>
                      <td className="py-3 px-3 text-slate-300">{row.carrier}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{row.tempDensity}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">{row.bolLitres.toLocaleString()} L</td>
                      <td className="py-3 px-3 text-right font-mono text-white font-bold">{row.recvLitres.toLocaleString()} L</td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={row.varPct < -0.2 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {row.varLitres} L ({row.varPct}%)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          row.seal.includes('BROKEN') ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {row.seal}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          row.status === 'PASS' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW D: INTERACTIVE DAY SIMULATOR */}
      {activeTabSubView === 'simulator' && (
        <div className="space-y-6">
          <div className="pos-card p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1 border border-emerald-500/30">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Live Reconciliation Calculator
              </div>
              <h3 className="text-xl font-black text-white">
                Interactive Daily Wetstock &amp; Trigger Simulator
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Adjust figures below to simulate daily throughput, delivery receipts, manual dip readings, 
                and water ingress levels to see immediate mathematical reconciliation and trigger evaluations.
              </p>
            </div>

            {/* Input Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Target Tank</label>
                <input
                  type="text"
                  value={simulatorTankId}
                  onChange={e => setSimulatorTankId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Fuel Grade</label>
                <select
                  value={simGrade}
                  onChange={e => setSimGrade(e.target.value as FuelGrade)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                >
                  <option value="ULP_95">ULP 95</option>
                  <option value="ULP_93">ULP 93</option>
                  <option value="DIESEL_50PPM">Diesel 50ppm</option>
                  <option value="DIESEL_10PPM">Diesel 10ppm</option>
                  <option value="ILLUMINATING_PARAFFIN">Illuminating Paraffin</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Line Material</label>
                <select
                  value={simLineMaterial}
                  onChange={e => setSimLineMaterial(e.target.value as LineMaterial)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                >
                  <option value="DOUBLE_WALL_HDPE">Double-Wall HDPE</option>
                  <option value="LEGACY_STEEL">Legacy Steel (High Risk)</option>
                  <option value="FIBERGLASS_FRP">Fiberglass FRP</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Opening Stock (L)</label>
                <input
                  type="number"
                  value={simOpening}
                  onChange={e => setSimOpening(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-300 uppercase block mb-1">Deliveries Net (L)</label>
                <input
                  type="number"
                  value={simDeliveries}
                  onChange={e => setSimDeliveries(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-300 uppercase block mb-1">BOL Manifest (L)</label>
                <input
                  type="number"
                  value={simBol}
                  onChange={e => setSimBol(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-300 uppercase block mb-1">Metered Sales (L)</label>
                <input
                  type="number"
                  value={simSales}
                  onChange={e => setSimSales(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white uppercase block mb-1">Physical ATG Closing (L)</label>
                <input
                  type="number"
                  value={simAtgClosing}
                  onChange={e => setSimAtgClosing(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Manual Dip Closing (L)</label>
                <input
                  type="number"
                  value={simDipClosing}
                  onChange={e => setSimDipClosing(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Water Paste Level (mm)</label>
                <input
                  type="number"
                  value={simWaterMm}
                  onChange={e => setSimWaterMm(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Prior Negative Days</label>
                <input
                  type="number"
                  value={simPriorNegDays}
                  onChange={e => setSimPriorNegDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="vacusonic"
                  checked={simVacuSonicValid}
                  onChange={e => setSimVacuSonicValid(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="vacusonic" className="text-xs text-slate-300 font-bold cursor-pointer">
                  VacuSonic NDT Cert Valid
                </label>
              </div>
            </div>

            {/* Live Evaluation Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                  Real-Time Engine Reconciliation Output
                </h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                  simulatorResult.status === 'COMPLIANT' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : simulatorResult.status === 'INVESTIGATE'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {simulatorResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <div className="text-slate-400 text-[10px]">Calculated Book Close</div>
                  <div className="font-mono text-sm font-black text-white">{simulatorResult.bookClosingLitres} L</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <div className="text-slate-400 text-[10px]">Daily Net Variance</div>
                  <div className={`font-mono text-sm font-black ${simulatorResult.dailyVarianceLitres < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {simulatorResult.dailyVarianceLitres} L ({simulatorResult.dailyVariancePercent}%)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <div className="text-slate-400 text-[10px]">ATG vs Dip Divergence</div>
                  <div className="font-mono text-sm font-black text-slate-200">
                    {simulatorResult.atgVsDipDeltaLitres} L ({simulatorResult.atgVsDipCompliant ? 'PASS' : 'FAIL'})
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <div className="text-slate-400 text-[10px]">Water Finding Paste</div>
                  <div className="font-mono text-sm font-black text-slate-200">
                    {simWaterMm} mm ({simulatorResult.waterLevelCompliant ? 'PASS' : 'INGRESS SPIKE'})
                  </div>
                </div>
              </div>

              {/* Triggers in Simulator */}
              {simulatorResult.triggers.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-black uppercase text-amber-400">Triggered Alarms:</div>
                  {simulatorResult.triggers.map((t, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-slate-900 text-amber-300 border border-amber-500/30 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span><strong>{t.title}:</strong> {t.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
