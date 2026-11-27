import React, { useState, useEffect } from 'react';
import { DemoVideoModal } from './components/DemoVideoModal';
import { ExecutiveDemoModal } from './components/ExecutiveDemoModal';
import { RetailerNotificationCenter } from './components/RetailerNotificationCenter';
import { CorporateStewardshipExporter } from './components/CorporateStewardshipExporter';
import { AIStudioDrawer } from './components/AIStudioDrawer';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { StatutoryDocGeneratorModal } from './components/StatutoryDocGeneratorModal';
import { NellyAIAgentWindow } from './components/NellyAIAgentWindow';
import { JurisdictionCode, EAST_AFRICA_PRESETS } from './data/eastAfricaConfig';
import { EnterpriseFooter } from './components/EnterpriseFooter';
import { GearPillarSettingsModal } from './components/GearPillarSettingsModal';
import { Language, translations } from './data/translations';
import {
  LANGUAGE_LABELS,
  REGIONAL_DEFAULTS,
  resolveDefaultLanguage,
  toAppLanguage,
  toSupportedLanguageCode,
} from './nelly-localization-engine';
import { getActiveTenant, subscribeTenantChange, switchTenantBrand } from './multiTenantConfig';
import { verifyPOPIAEncryption } from './popiActCompliance';
import { getNcrs, subscribeNcrChange } from './lib/ncrStore';
import {
  ForecourtFuelOpsWorkspace,
  ForecourtSubTab,
} from './components/workspaces/ForecourtFuelOpsWorkspace';
import {
  ShiftWetstockWorkspace,
  ShiftWetstockSubTab,
} from './components/workspaces/ShiftWetstockWorkspace';
import {
  ShopTrainingWorkspace,
  ShopTrainingSubTab,
} from './components/workspaces/ShopTrainingWorkspace';
import {
  ExecutiveAuditWorkspace,
  ExecutiveAuditSubTab,
} from './components/workspaces/ExecutiveAuditWorkspace';
import {
  Bot,
  HardDrive,
  Zap,
  Globe,
  Lock,
  FileSpreadsheet,
  Scale,
  Sliders,
  LayoutDashboard,
  GraduationCap,
  Gauge,
  Fuel,
  Menu,
  X,
  BellRing,
} from 'lucide-react';

export type PillarId = 'forecourtOps' | 'shiftWetstock' | 'shopTraining' | 'executiveAudit';

const PILLAR_NAV_LABELS: Record<
  Language,
  {
    forecourtOps: string;
    shiftWetstock: string;
    shopTraining: string;
    executiveAudit: string;
    statutoryDocBtn: string;
  }
> = {
  EN: {
    forecourtOps: '1. Forecourt & Fuel Ops',
    shiftWetstock: '2. Shift Cash-Up & Wetstock',
    shopTraining: '3. Shop, Food Service & Training',
    executiveAudit: '4. Executive Audit & NCRs',
    statutoryDocBtn: 'Statutory Doc',
  },
  SW: {
    forecourtOps: '1. Forecourt & Mafuta',
    shiftWetstock: '2. Zamu & Wetstock',
    shopTraining: '3. Duka, Chakula & Mafunzo',
    executiveAudit: '4. Ukaguzi & NCR',
    statutoryDocBtn: 'Nyaraka za Sheria',
  },
  ZU: {
    forecourtOps: '1. I-Forecourt Namafutha',
    shiftWetstock: '2. Ukubalwa Kweshefti',
    shopTraining: '3. Isitolo, Ukudla & Uqeqesho',
    executiveAudit: '4. Uhlolo & Ama-NCR',
    statutoryDocBtn: 'Idokhumenti Ye-OHS',
  },
  AF: {
    forecourtOps: '1. Voorhof & Brandstof',
    shiftWetstock: '2. Skof Kontant & Voorraad',
    shopTraining: '3. Winkel, Kos & Opleiding',
    executiveAudit: '4. Oudit & NCRs',
    statutoryDocBtn: 'Statutêre Dok',
  },
  ST: {
    forecourtOps: '1. Seteishene & Mafura',
    shiftWetstock: '2. Tlhahlobo ea Shefte',
    shopTraining: '3. Lebenkele, Lijo & Thupelo',
    executiveAudit: '4. Hlahlobo & Li-NCR',
    statutoryDocBtn: 'Tokomane ea OHS',
  },
  XH: {
    forecourtOps: '1. I-Forecourt naMafutha',
    shiftWetstock: '2. Ubalo lweShefti neWetstock',
    shopTraining: '3. Ivenkile, Ukutya noQeqesho',
    executiveAudit: '4. UPhicotho nee-NCR',
    statutoryDocBtn: 'Uxwebhu lwe-OHS',
  },
};

export const App: React.FC = () => {
  const [activePillar, setActivePillar] = useState<PillarId>('executiveAudit');
  const [forecourtSubTab, setForecourtSubTab] = useState<ForecourtSubTab>('offload');
  const [wetstockSubTab, setWetstockSubTab] = useState<ShiftWetstockSubTab>('shiftCashUp');
  const [shopSubTab, setShopSubTab] = useState<ShopTrainingSubTab>('videoAcademy');
  const [execSubTab, setExecSubTab] = useState<ExecutiveAuditSubTab>('overview');

  const [lang, setLang] = useState<Language>('EN');
  const [hasManualLanguageOverride, setHasManualLanguageOverride] = useState<boolean>(false);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>('ZA');
  const [spillLitres, setSpillLitres] = useState<number>(0);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isExecDemoOpen, setIsExecDemoOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isNellyOpen, setIsNellyOpen] = useState<boolean>(false);
  const [isGearModalOpen, setIsGearModalOpen] = useState<boolean>(false);
  const [isStatutoryModalOpen, setIsStatutoryModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [autoStart3DTour, setAutoStart3DTour] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeTenant, setActiveTenantState] = useState(getActiveTenant());
  const [openNcrCount, setOpenNcrCount] = useState<number>(
    () => getNcrs().filter((n) => n.status !== 'CLOSED').length
  );

  const isAdminRoute =
    typeof window !== 'undefined' &&
    (window.location.search.includes('admin=1') || window.location.hash.includes('admin'));

  const t = translations[lang];
  const pillarLabels = PILLAR_NAV_LABELS[lang];
  const popiaStatus = verifyPOPIAEncryption();

  useEffect(() => {
    const unsubTenant = subscribeTenantChange((ten) => setActiveTenantState(ten));
    const unsubNcr = subscribeNcrChange((list) =>
      setOpenNcrCount(list.filter((n) => n.status !== 'CLOSED').length)
    );
    return () => {
      unsubTenant();
      unsubNcr();
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeJurisdiction = EAST_AFRICA_PRESETS[jurisdiction] || EAST_AFRICA_PRESETS.ZA;
  const regionalLangConfig = REGIONAL_DEFAULTS[jurisdiction] || REGIONAL_DEFAULTS.DEFAULT;

  const handleSelectJurisdiction = (code: JurisdictionCode) => {
    setJurisdiction(code);
    if (!hasManualLanguageOverride) {
      const resolved = resolveDefaultLanguage(code);
      setLang(toAppLanguage(resolved));
    }
  };

  const handleSelectLanguage = (selectedLang: Language) => {
    setHasManualLanguageOverride(true);
    setLang(selectedLang);
  };

  const handleSelectPillar = (pillarId: PillarId) => {
    setActivePillar(pillarId);
    setIsSidebarOpen(false);
  };

  // Unified route mapper from any legacy module target into the 4-Pillar architecture
  const navigateToTarget = (target: string) => {
    setIsSidebarOpen(false);
    switch (target) {
      case 'wetstockBridge':
      case 'offload':
        setActivePillar('forecourtOps');
        setForecourtSubTab('offload');
        break;
      case 'dipping':
        setActivePillar('forecourtOps');
        setForecourtSubTab('dipping');
        break;
      case 'cleaning':
        setActivePillar('forecourtOps');
        setForecourtSubTab('cleaning');
        break;
      case 'evacuation':
      case 'spill':
      case 'fire':
      case 'firstResponder':
      case 'rsdChecklists':
      case 'emergency':
        setActivePillar('forecourtOps');
        setForecourtSubTab('emergency');
        break;
      case 'wetstock':
      case 'shiftCashUp':
        setActivePillar('shiftWetstock');
        setWetstockSubTab('shiftCashUp');
        break;
      case 'posImport':
        setActivePillar('shiftWetstock');
        setWetstockSubTab('posImport');
        break;
      case 'varianceEngine':
        setActivePillar('shiftWetstock');
        setWetstockSubTab('varianceEngine');
        break;
      case 'r638Haccp':
        setActivePillar('shopTraining');
        setShopSubTab('r638Haccp');
        break;
      case 'customer':
      case 'customerService':
        setActivePillar('shopTraining');
        setShopSubTab('customerService');
        break;
      case 'quiz':
      case 'videoAcademy':
        setActivePillar('shopTraining');
        setShopSubTab('videoAcademy');
        break;
      case 'training':
      case 'demo':
      case 'refresher':
      case 'rights':
      case 'statutoryHub':
        setActivePillar('shopTraining');
        setShopSubTab('statutoryHub');
        break;
      case 'ncrTracker':
        setActivePillar('executiveAudit');
        setExecSubTab('ncrTracker');
        break;
      case 'certificates':
        setActivePillar('executiveAudit');
        setExecSubTab('certificates');
        break;
      default:
        setActivePillar('executiveAudit');
        setExecSubTab('overview');
        break;
    }
  };

  const pillars: Array<{
    id: PillarId;
    label: string;
    subLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    {
      id: 'forecourtOps',
      label: pillarLabels.forecourtOps,
      subLabel: 'Offload, Dipping, Cleaning & SOPs',
      icon: Fuel,
    },
    {
      id: 'shiftWetstock',
      label: pillarLabels.shiftWetstock,
      subLabel: 'POS Import, Cash-Up & SIR Engine',
      icon: Gauge,
    },
    {
      id: 'shopTraining',
      label: pillarLabels.shopTraining,
      subLabel: 'R638 HACCP, 7-Step & Video Gate',
      icon: GraduationCap,
    },
    {
      id: 'executiveAudit',
      label: pillarLabels.executiveAudit,
      subLabel: 'Multi-Site, NCRs & SHA-256 Audit',
      icon: LayoutDashboard,
      badge: openNcrCount,
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row w-full max-w-full h-screen overflow-hidden bg-[#070d1e] font-sans">
      {/* MOBILE / TABLET SLIDE-OVER SIDEBAR DRAWER (< 1280px) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex xl:hidden bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Module Navigation Drawer"
        >
          <aside className="w-[280px] max-w-[84vw] h-full bg-[#0b1329] border-r border-slate-800 flex flex-col z-50">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-sky-400 tracking-wider">
                  {activeTenant.platformBrand?.toUpperCase() || 'ERGOSAFE'} • FORECOURT
                </div>
                <div className="text-sm font-bold text-white">{t.headerTitle}</div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close Navigation Sidebar"
                className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav
              aria-label="Mobile Pillar Navigation"
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
            >
              {pillars.map((p) => {
                const Icon = p.icon;
                const isActive = activePillar === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPillar(p.id)}
                    data-testid={`mobile-pillar-nav-${p.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-start gap-3 transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                        : 'text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isActive ? 'text-slate-950' : 'text-amber-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{p.label}</span>
                        {typeof p.badge === 'number' && p.badge > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                        {p.subLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
        </div>
      )}

      {/* DESKTOP PERSISTENT LEFT SIDEBAR (>= 1280px) */}
      <aside
        aria-label="Desktop Pillar Navigation Sidebar"
        className="hidden xl:flex flex-col flex-shrink-0 w-[265px] min-w-[265px] h-full bg-[#0b1329] border-r border-slate-800 z-30"
      >
        <div className="p-4 border-b border-slate-800">
          <div className="text-xs font-bold text-sky-400 tracking-wider">
            {activeTenant.platformBrand?.toUpperCase() || 'ERGOSAFE'} / LOGIGUARD
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{t.headerTitle}</div>
          <div className="text-xs text-slate-300 mt-0.5">
            {activeJurisdiction.statutoryReference} • {activeJurisdiction.siteCode}
          </div>
        </div>

        <nav
          aria-label="Primary 4-Pillar Compliance Workspaces"
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
        >
          {pillars.map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPillar(p.id)}
                data-testid={`pillar-nav-${p.id}`}
                aria-label={p.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold flex items-start gap-3 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                    : 'text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    isActive ? 'text-slate-950' : 'text-amber-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{p.label}</span>
                    {typeof p.badge === 'number' && p.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {p.subLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 text-xs text-slate-300">
          System Status: <span className="text-emerald-400 font-bold">Active</span> • AES-256
        </div>
      </aside>

      {/* RIGHT MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full min-w-0 max-w-full overflow-hidden bg-[#070d1e]">
        <header className="flex-shrink-0 border-b border-slate-800 bg-[#070d1e] w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 md:px-4 md:py-2 w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle Navigation Sidebar"
                data-testid="sidebar-drawer-toggle"
                className="xl:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 flex-shrink-0"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-mono truncate">
                    {activeJurisdiction.statutoryReference} • {activeJurisdiction.siteCode} •{' '}
                    {activeTenant.siteCode}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
                  </span>
                  {popiaStatus.compliant && (
                    <span className="flex px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-black border border-cyan-500/30 items-center gap-1 whitespace-nowrap">
                      <Lock className="w-2.5 h-2.5 text-cyan-400" /> POPIA AES-256
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight truncate">
                    {activeTenant.brandName}
                  </h1>
                  <span className="hidden md:inline text-xs text-slate-300 truncate">
                    — {t.headerTitle}
                  </span>
                </div>
              </div>

              <div className="hidden 2xl:flex items-center gap-1.5 text-xs ml-2">
                <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1 text-slate-200 text-xs whitespace-nowrap font-mono">
                  <HardDrive className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{t.usbStatus}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1 text-slate-200 text-xs whitespace-nowrap font-mono">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{t.esdStatus}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs whitespace-nowrap">
                  🕒 {currentTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {/* Regional Jurisdiction Switcher (ZA | KE | TZ | UG) */}
              <div
                className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-950 border border-cyan-500/30"
                role="group"
                aria-label="Regional Jurisdiction Selector"
              >
                {(['ZA', 'KE', 'TZ', 'UG'] as const).map((code) => {
                  const preset = EAST_AFRICA_PRESETS[code];
                  const isSelected = jurisdiction === code;
                  return (
                    <button
                      key={code}
                      onClick={() => handleSelectJurisdiction(code)}
                      aria-label={`Select Jurisdiction ${preset.country}`}
                      className={`h-7 px-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap flex items-center gap-1 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                      title={`${preset.country} — ${preset.regulators}`}
                    >
                      <span className="text-xs">{preset.flag}</span>
                      <span>{code}</span>
                    </button>
                  );
                })}
              </div>

              {/* Language Switcher (EN | SW | ZU | AF | ST | XH) */}
              <div
                className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-950 border border-slate-800"
                role="group"
                aria-label="Language Selector"
                title={`Regional Default (${regionalLangConfig.regionName}): ${
                  LANGUAGE_LABELS[regionalLangConfig.defaultLanguage].native
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 flex-shrink-0" />
                {(['EN', 'SW', 'ZU', 'AF', 'ST', 'XH'] as const).map((l) => {
                  const labelMeta = LANGUAGE_LABELS[toSupportedLanguageCode(l)];
                  return (
                    <button
                      key={l}
                      onClick={() => handleSelectLanguage(l)}
                      aria-label={`Switch language to ${labelMeta.native}`}
                      data-testid={`lang-btn-${l}`}
                      className={`h-7 px-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                        lang === l
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                      title={`${labelMeta.native} — ${labelMeta.english}`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>

              {/* Utility & Tool Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsStatutoryModalOpen(true)}
                  aria-label="Open Statutory Document Generator"
                  data-testid="open-statutory-doc-btn"
                  className="h-7 md:h-8 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1 text-xs font-bold whitespace-nowrap"
                  title="Autonomous Statutory OHS Doc Generator"
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="hidden sm:inline">{pillarLabels.statutoryDocBtn}</span>
                </button>

                <button
                  onClick={() => setIsNotificationCenterOpen(true)}
                  aria-label="Open Retailer Notification Center"
                  className="h-7 md:h-8 w-7 md:w-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 transition flex items-center justify-center flex-shrink-0"
                  title="Retailer Notification Center"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                </button>

                <button
                  onClick={() => setIsDossierOpen(true)}
                  aria-label="Open Corporate Stewardship Dossier"
                  className="h-7 md:h-8 w-7 md:w-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 transition flex items-center justify-center flex-shrink-0"
                  title="Corporate Stewardship Dossier"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </button>

                {isAdminRoute && (
                  <button
                    onClick={() => setIsAIStudioOpen(true)}
                    aria-label="Open Admin Guardrails Drawer"
                    className="h-7 md:h-8 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 transition flex items-center gap-1 text-xs font-bold whitespace-nowrap"
                    title="Admin Statutory Guardrails"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>AI Studio</span>
                  </button>
                )}

                <button
                  onClick={() => setIsGearModalOpen(true)}
                  aria-label="Open GEAR Pillar Calibration"
                  data-testid="open-gear-modal-btn"
                  className="h-7 md:h-8 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-300 transition flex items-center gap-1 text-xs whitespace-nowrap shadow-sm"
                  title="Open G.E.A.R. Pillar Settings Suite"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />
                  <span className="hidden sm:inline uppercase">GEAR</span>
                </button>

                <button
                  onClick={() => setIsNellyOpen(!isNellyOpen)}
                  aria-label="Toggle Nelly OHS Guide"
                  data-testid="open-nelly-btn"
                  className="h-7 md:h-8 px-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black border border-purple-300 transition flex items-center gap-1 text-xs whitespace-nowrap shadow-sm"
                  title="Toggle Nelly OHS Guide"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-100 flex-shrink-0" />
                  <span>Nelly AI</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Executive Demo Button Row */}
        <div className="flex items-center justify-center bg-slate-950 border-b border-slate-800 px-3 py-2">
          <button
            type="button"
            onClick={() => setIsExecDemoOpen(true)}
            data-testid="open-executive-demo-btn"
            className="w-full sm:w-auto max-w-full px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#065F46] text-white font-extrabold text-sm border-2 border-[#D97706] shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Watch 2-Min Executive Demo
          </button>
        </div>

        {/* Tablet/Mobile 4-Pillar Quick Bar (< 1280px) */}
        <div
          data-testid="horizontal-tab-strip"
          className="grid xl:hidden grid-cols-2 md:grid-cols-4 gap-1.5 bg-slate-900/95 border-b border-slate-800 px-2.5 py-2"
        >
          {pillars.map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPillar(p.id)}
                data-testid={`strip-pillar-nav-${p.id}`}
                className={`px-2.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="truncate">{p.label}</span>
                {typeof p.badge === 'number' && p.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main 4-Pillar Workspace Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          {activePillar === 'forecourtOps' && (
            <ForecourtFuelOpsWorkspace
              lang={lang}
              jurisdiction={jurisdiction}
              spillLitres={spillLitres}
              onSpillLitresChange={setSpillLitres}
              activeSubTab={forecourtSubTab}
              onSubTabChange={setForecourtSubTab}
              onNavigateTarget={navigateToTarget}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
            />
          )}

          {activePillar === 'shiftWetstock' && (
            <ShiftWetstockWorkspace
              lang={lang}
              activeSubTab={wetstockSubTab}
              onSubTabChange={setWetstockSubTab}
              onNavigateTarget={navigateToTarget}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
              onOpenCertModal={() => setIsCertModalOpen(true)}
            />
          )}

          {activePillar === 'shopTraining' && (
            <ShopTrainingWorkspace
              lang={lang}
              onLanguageChange={handleSelectLanguage}
              activeSubTab={shopSubTab}
              onSubTabChange={setShopSubTab}
              onNavigateTarget={navigateToTarget}
              onOpenCertModal={() => setIsCertModalOpen(true)}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
              onOpenDossier={() => setIsDossierOpen(true)}
              autoStartExecutiveTour={autoStart3DTour}
              onExecutiveTourConsumed={() => setAutoStart3DTour(false)}
            />
          )}

          {activePillar === 'executiveAudit' && (
            <ExecutiveAuditWorkspace
              lang={lang}
              activeSubTab={execSubTab}
              onSubTabChange={setExecSubTab}
              onOpenNelly={() => setIsNellyOpen(true)}
              onOpenGearModal={() => setIsGearModalOpen(true)}
              onNavigateTarget={navigateToTarget}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
              onOpenCertModal={() => setIsCertModalOpen(true)}
              onOpenDossier={() => setIsDossierOpen(true)}
              onLaunch3DTour={() => {
                setAutoStart3DTour(true);
                setActivePillar('shopTraining');
                setShopSubTab('videoAcademy');
              }}
            />
          )}
        </main>

        <EnterpriseFooter appName={activeTenant.brandName} />
      </div>

      {/* Modals & Drawers */}
      <StatutoryDocGeneratorModal
        isOpen={isStatutoryModalOpen}
        onClose={() => setIsStatutoryModalOpen(false)}
      />

      <NellyAIAgentWindow
        isOpen={isNellyOpen}
        onClose={() => setIsNellyOpen(false)}
        lang={lang}
        onTriggerBrandSwitch={(b) => switchTenantBrand(b)}
        onOpenGearModal={() => setIsGearModalOpen(true)}
      />

      <GearPillarSettingsModal
        isOpen={isGearModalOpen}
        onClose={() => setIsGearModalOpen(false)}
      />

      <AIStudioDrawer isOpen={isAIStudioOpen} onClose={() => setIsAIStudioOpen(false)} />

      <AuditCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        lang={lang}
      />

      <ExecutiveDemoModal isOpen={isExecDemoOpen} onClose={() => setIsExecDemoOpen(false)} />

      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        lang={lang}
      />

      <RetailerNotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        lang={lang}
      />

      <CorporateStewardshipExporter
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        lang={lang}
      />
    </div>
  );
};
