import React, { useState, useEffect, useRef } from 'react';
import { EvacuationFlow } from './components/EvacuationFlow';
import { SpillTeamwork } from './components/SpillTeamwork';
import { PASSFirefighting } from './components/PASSFirefighting';
import { CustomerServiceModule } from './components/CustomerServiceModule';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { DemoVideoTab } from './components/DemoVideoTab';
import { DemoVideoModal } from './components/DemoVideoModal';
import { NightshiftFirstResponder } from './components/NightshiftFirstResponder';
import { MonthlyRefresherHub } from './components/MonthlyRefresherHub';
import { RetailerNotificationCenter } from './components/RetailerNotificationCenter';
import { CorporateStewardshipExporter } from './components/CorporateStewardshipExporter';
import { StatutoryRightsModule } from './components/StatutoryRightsModule';
import { AIStudioDrawer } from './components/AIStudioDrawer';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { ExecutiveBriefingDashboard } from './components/ExecutiveBriefingDashboard';
import { StatutoryDocGeneratorModal } from './components/StatutoryDocGeneratorModal';
import { NellyAIAgentWindow } from './components/NellyAIAgentWindow';
import { StatutoryTrainingModule } from './components/StatutoryTrainingModule';
import { WetstockManagementModule } from './components/WetstockManagementModule';
import { WetstockOffloadBridge } from './components/WetstockOffloadBridge';
import { JurisdictionCode, EAST_AFRICA_PRESETS } from './data/eastAfricaConfig';
import { EnterpriseFooter } from './components/EnterpriseFooter';
import { GearPillarSettingsModal } from './components/GearPillarSettingsModal';
import { RSDChecklistModule } from './components/RSDChecklistModule';
import { Language, translations } from './data/translations';
import { assessmentQuestions } from './data/assessmentData';
import {
  LANGUAGE_LABELS,
  REGIONAL_DEFAULTS,
  resolveDefaultLanguage,
  toAppLanguage,
  toSupportedLanguageCode,
} from './nelly-localization-engine';
import { getActiveTenant, subscribeTenantChange, switchTenantBrand } from './multiTenantConfig';
import { verifyPOPIAEncryption } from './popiActCompliance';
import {
  AlertOctagon,
  Shield,
  Flame,
  Award,
  Bot,
  HardDrive,
  Zap,
  Globe,
  FileCheck,
  Building2,
  Lock,
  Video,
  HeartPulse,
  RotateCcw,
  BellRing,
  FileSpreadsheet,
  Scale,
  Sliders,
  LayoutDashboard,
  GraduationCap,
  Gauge,
  Truck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type ModuleTabId =
  | 'executiveDashboard'
  | 'training'
  | 'wetstock'
  | 'wetstockBridge'
  | 'evacuation'
  | 'spill'
  | 'customer'
  | 'fire'
  | 'quiz'
  | 'demo'
  | 'firstResponder'
  | 'refresher'
  | 'rights'
  | 'rsdChecklists';

const EXTRA_NAV_TRANSLATIONS: Record<
  Language,
  {
    exec: string;
    training: string;
    wetstockBridge: string;
    wetstock: string;
    refresher: string;
    rights: string;
    rsd: string;
    statutoryDocBtn: string;
  }
> = {
  EN: {
    exec: '0. Executive Briefing',
    training: '1. Statutory Training',
    wetstockBridge: '6. Wetstock & Offload',
    wetstock: '8. Wetstock & Reconciliation',
    refresher: '11. Refresher Hub',
    rights: '12. Employee Rights',
    rsd: '13. RSD 26 Checklists',
    statutoryDocBtn: 'Statutory Doc',
  },
  SW: {
    exec: '0. Muhtasari wa Utendaji',
    training: '1. Mafunzo ya Kisheria (Training)',
    wetstockBridge: '6. Upakuaji wa Mafuta (Wetstock & Offload)',
    wetstock: '8. Usawazishaji wa Wetstock',
    refresher: '11. Kituo cha Kurudia Mafunzo',
    rights: '12. Haki za Wafanyakazi (Employee Rights)',
    rsd: '13. Orodha za Ukaguzi za RSD 26',
    statutoryDocBtn: 'Nyaraka za Sheria',
  },
  ZU: {
    exec: '0. Umbiko Omkhulu (Executive)',
    training: '1. Ukuqeqeshwa Kwemithetho (Training)',
    wetstockBridge: '6. Ukuthululwa Kwamafutha (Wetstock & Offload)',
    wetstock: '8. Ukubalwa Kwamafutha (Wetstock)',
    refresher: '11. Ukubukeza Kwanyanga Zonke',
    rights: '12. Amalungelo Abasebenzi (Employee Rights)',
    rsd: '13. Uhlu Lokuhlola RSD 26',
    statutoryDocBtn: 'Idokhumenti Ye-OHS',
  },
  AF: {
    exec: '0. Uitvoerende Oorsig',
    training: '1. Statutêre Opleiding (Training)',
    wetstockBridge: '6. Brandstof Aflaai (Wetstock & Offload)',
    wetstock: '8. Voorraad Rekonsiliasie (Wetstock)',
    refresher: '11. Maandelikse Opknapping',
    rights: '12. Werknemerregte (Employee Rights)',
    rsd: '13. RSD 26 Kontrolelyste',
    statutoryDocBtn: 'Statutêre Dok',
  },
  ST: {
    exec: '0. Kakaretso ea Tsamaiso',
    training: '1. Koetliso ea Molao (Training)',
    wetstockBridge: '6. Ho Laolla Mafura (Wetstock & Offload)',
    wetstock: '8. Tlhahlobo ea Mafura (Wetstock)',
    refresher: '11. Thuto ea Khoeli le Khoeli',
    rights: '12. Litokelo tsa Basebetsi (Employee Rights)',
    rsd: '13. Manane a Tlhahlobo a RSD 26',
    statutoryDocBtn: 'Tokomane ea OHS',
  },
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModuleTabId>('executiveDashboard');
  const [lang, setLang] = useState<Language>('EN');
  const [hasManualLanguageOverride, setHasManualLanguageOverride] = useState<boolean>(false);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>('ZA');
  const [spillLitres, setSpillLitres] = useState<number>(0);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isNellyOpen, setIsNellyOpen] = useState<boolean>(false);
  const [isGearModalOpen, setIsGearModalOpen] = useState<boolean>(false);
  const [isStatutoryModalOpen, setIsStatutoryModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeTenant, setActiveTenantState] = useState(getActiveTenant());

  const tabStripRef = useRef<HTMLDivElement>(null);

  const isAdminRoute =
    typeof window !== 'undefined' &&
    (window.location.search.includes('admin=1') || window.location.hash.includes('admin'));

  const t = translations[lang];
  const extraT = EXTRA_NAV_TRANSLATIONS[lang];
  const popiaStatus = verifyPOPIAEncryption();
  const totalQuizCount = assessmentQuestions.length;

  useEffect(() => {
    const unsubTenant = subscribeTenantChange((ten) => setActiveTenantState(ten));
    return () => unsubTenant();
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

  const handleSelectModuleTab = (tabId: ModuleTabId) => {
    setActiveTab(tabId);
    // Fix 10: Close sidebar drawer when a module is chosen on tablet and mobile widths
    setIsSidebarOpen(false);
  };

  const scrollTabStrip = (direction: 'left' | 'right') => {
    if (!tabStripRef.current) return;
    const delta = direction === 'left' ? -220 : 220;
    tabStripRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const moduleTabs: Array<{ id: ModuleTabId; label: string; icon: any }> = [
    { id: 'executiveDashboard', label: extraT.exec, icon: LayoutDashboard },
    { id: 'training', label: extraT.training, icon: GraduationCap },
    { id: 'evacuation', label: t.tabEvacuation, icon: AlertOctagon },
    { id: 'spill', label: t.tabSpill, icon: Shield },
    { id: 'customer', label: t.tabCustomer, icon: Building2 },
    { id: 'fire', label: t.tabFire, icon: Flame },
    { id: 'wetstockBridge', label: extraT.wetstockBridge, icon: Truck },
    {
      id: 'quiz',
      label:
        lang === 'EN'
          ? `7. 60s Assessment (${totalQuizCount} Qs)`
          : t.tabQuiz.replace(/\(\d+/, `(${totalQuizCount}`),
      icon: Award,
    },
    { id: 'wetstock', label: extraT.wetstock, icon: Gauge },
    { id: 'demo', label: t.tabDemoVideo, icon: Video },
    { id: 'firstResponder', label: t.tabFirstResponder, icon: HeartPulse },
    { id: 'refresher', label: extraT.refresher, icon: RotateCcw },
    { id: 'rights', label: extraT.rights, icon: Scale },
    { id: 'rsdChecklists', label: extraT.rsd, icon: FileCheck },
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
          <aside className="w-[270px] max-w-[82vw] h-full bg-[#0b1329] border-r border-slate-800 flex flex-col z-50">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-sky-400 tracking-wider">
                  FORECOURT SENTINEL
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
              aria-label="Mobile Module Navigation"
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5"
            >
              {moduleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectModuleTab(tab.id)}
                    aria-label={tab.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-slate-950' : 'text-slate-300'
                      }`}
                    />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
          <div
            className="flex-1"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* DESKTOP PERSISTENT LEFT SIDEBAR (>= 1280px xl so it never covers or crowds 800-1024px tablets) */}
      <aside
        aria-label="Desktop Module Navigation Sidebar"
        className="hidden xl:flex flex-col flex-shrink-0 w-[250px] min-w-[250px] h-full bg-[#0b1329] border-r border-slate-800 z-30"
      >
        {/* System Brand Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="text-xs font-bold text-sky-400 tracking-wider">FORECOURT SENTINEL</div>
          <div className="text-sm font-bold text-white mt-0.5">{t.headerTitle}</div>
          <div className="text-xs text-slate-300 mt-0.5">
            {activeJurisdiction.statutoryReference} • {activeJurisdiction.siteCode}
          </div>
        </div>

        {/* Vertical Module Navigation */}
        <nav
          aria-label="Primary Compliance Modules"
          className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5"
        >
          {moduleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectModuleTab(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-slate-950' : 'text-slate-300'
                  }`}
                />
                <span className="truncate">{tab.label}</span>
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
        {/* Compact Top Header Bar: Telemetry, Status Ticker & Region/Language Controls */}
        <header className="flex-shrink-0 border-b border-slate-800 bg-[#070d1e] w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 md:px-4 md:py-2 w-full">
            {/* LEFT: Menu Drawer Trigger + Brand & Telemetry Status Ticker */}
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
                    Forecourt Sentinel
                  </h1>
                  <span className="hidden md:inline text-xs text-slate-300 truncate">
                    — {t.headerTitle}
                  </span>
                </div>
              </div>

              {/* Desktop Telemetry Badges */}
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

            {/* RIGHT: Region Switcher, Language Switcher & Action Controls */}
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

              {/* Language Switcher (EN | SW | ZU | AF | ST) */}
              <div
                className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-950 border border-slate-800"
                role="group"
                aria-label="Language Selector"
                title={`Regional Default (${regionalLangConfig.regionName}): ${
                  LANGUAGE_LABELS[regionalLangConfig.defaultLanguage].native
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 flex-shrink-0" />
                {(['EN', 'SW', 'ZU', 'AF', 'ST'] as const).map((l) => {
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
                  <span className="hidden sm:inline">{extraT.statutoryDocBtn}</span>
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

                {/* Fix 6: Admin Guardrails Drawer only shown on ?admin=1 or #admin route */}
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

        {/* Horizontal Module Navigation Strip with Visible Left/Right Scroll Cues (< 1280px) */}
        <div className="flex xl:hidden items-center bg-slate-900/95 border-b border-slate-800 w-full relative">
          <button
            type="button"
            onClick={() => scrollTabStrip('left')}
            aria-label="Scroll modules left"
            data-testid="tab-strip-scroll-left"
            className="flex-shrink-0 h-9 px-2 bg-slate-950/90 hover:bg-slate-800 text-amber-400 border-r border-slate-800 flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={tabStripRef}
            data-testid="horizontal-tab-strip"
            className="flex-1 flex overflow-x-auto whitespace-nowrap scrollbar-none flex-nowrap gap-1.5 px-2 py-1.5 text-xs"
          >
            {moduleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectModuleTab(tab.id)}
                  aria-label={tab.label}
                  className={`h-8 px-2.5 rounded-lg font-extrabold flex items-center gap-1.5 flex-shrink-0 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800/90 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-300'}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollTabStrip('right')}
            aria-label="Scroll modules right"
            data-testid="tab-strip-scroll-right"
            className="flex-shrink-0 h-9 px-2 bg-slate-950/90 hover:bg-slate-800 text-amber-400 border-l border-slate-800 flex items-center justify-center z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Active Screen */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          {activeTab === 'executiveDashboard' && (
            <ExecutiveBriefingDashboard
              lang={lang}
              onOpenNelly={() => setIsNellyOpen(true)}
              onOpenGearModal={() => setIsGearModalOpen(true)}
              onNavigateTab={(target) => handleSelectModuleTab(target as ModuleTabId)}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
            />
          )}
          {activeTab === 'training' && (
            <StatutoryTrainingModule
              lang={lang}
              onNavigateTab={(target) => handleSelectModuleTab(target as ModuleTabId)}
              onOpenCertModal={() => setIsCertModalOpen(true)}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
            />
          )}
          {activeTab === 'wetstock' && (
            <WetstockManagementModule
              lang={lang}
              onNavigateTab={(target) => handleSelectModuleTab(target as ModuleTabId)}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
              onOpenCertModal={() => setIsCertModalOpen(true)}
            />
          )}
          {activeTab === 'wetstockBridge' && (
            <WetstockOffloadBridge
              lang={lang}
              jurisdiction={jurisdiction}
              spillLitres={spillLitres}
              onNavigateTab={(target) => handleSelectModuleTab(target as ModuleTabId)}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
            />
          )}
          {activeTab === 'evacuation' && <EvacuationFlow lang={lang} />}
          {activeTab === 'spill' && (
            <SpillTeamwork
              spillLitres={spillLitres}
              onSpillLitresChange={setSpillLitres}
              lang={lang}
              onNavigateTab={(target) => handleSelectModuleTab(target as ModuleTabId)}
            />
          )}
          {activeTab === 'customer' && <CustomerServiceModule />}
          {activeTab === 'fire' && <PASSFirefighting lang={lang} />}
          {activeTab === 'quiz' && <AssessmentQuiz lang={lang} />}
          {activeTab === 'demo' && (
            <DemoVideoTab
              lang={lang}
              onNavigateTab={(target) => handleSelectModuleTab(target as ModuleTabId)}
              onOpenCertModal={() => setIsCertModalOpen(true)}
            />
          )}
          {activeTab === 'firstResponder' && <NightshiftFirstResponder lang={lang} />}
          {activeTab === 'refresher' && (
            <MonthlyRefresherHub lang={lang} onOpenDossier={() => setIsDossierOpen(true)} />
          )}
          {activeTab === 'rights' && <StatutoryRightsModule />}
          {activeTab === 'rsdChecklists' && <RSDChecklistModule lang={lang} />}
        </main>

        {/* ENTERPRISE FOOTER */}
        <EnterpriseFooter appName={activeTenant.brandName} />
      </div>

      {/* Statutory OHS Document Generator Modal */}
      <StatutoryDocGeneratorModal
        isOpen={isStatutoryModalOpen}
        onClose={() => setIsStatutoryModalOpen(false)}
      />

      {/* Persistent Dockable Nelly AI Agent Window */}
      <NellyAIAgentWindow
        isOpen={isNellyOpen}
        onClose={() => setIsNellyOpen(false)}
        lang={lang}
        onTriggerBrandSwitch={(b) => switchTenantBrand(b as any)}
        onOpenGearModal={() => setIsGearModalOpen(true)}
      />

      {/* G.E.A.R. Pillar Settings Overlay Modal */}
      <GearPillarSettingsModal
        isOpen={isGearModalOpen}
        onClose={() => setIsGearModalOpen(false)}
      />

      {/* Admin Statutory Guardrails Drawer */}
      <AIStudioDrawer isOpen={isAIStudioOpen} onClose={() => setIsAIStudioOpen(false)} />

      {/* HITL Audit Certificate Modal */}
      <AuditCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        lang={lang}
      />

      {/* Multilingual Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        lang={lang}
      />

      {/* Retailer Notification Center Modal */}
      <RetailerNotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        lang={lang}
      />

      {/* Oil Company Corporate Stewardship Exporter Modal */}
      <CorporateStewardshipExporter
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        lang={lang}
      />
    </div>
  );
};
