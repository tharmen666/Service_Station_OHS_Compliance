import React, { useState, useEffect } from 'react';
import { EvacuationFlow } from './components/EvacuationFlow';
import { SpillTeamwork } from './components/SpillTeamwork';
import { PASSFirefighting } from './components/PASSFirefighting';
import { CustomerServiceModule } from './components/CustomerServiceModule';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { CurriculumBrowser } from './components/CurriculumBrowser';
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

import { EnterpriseFooter } from './components/EnterpriseFooter';
import { GearPillarSettingsModal } from './components/GearPillarSettingsModal';
import { RSDChecklistModule } from './components/RSDChecklistModule';
import { Language, translations } from './data/translations';
import { getActiveTenant, subscribeTenantChange, switchTenantBrand } from './multiTenantConfig';
import { verifyPOPIAEncryption } from './popiActCompliance';
import { 
  AlertOctagon, 
  Shield, 
  Flame, 
  Award, 
  BookOpen, 
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
  LayoutDashboard
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'executiveDashboard' | 'evacuation' | 'spill' | 'customer' | 'fire' | 'quiz' | 'curriculum' | 'demo' | 'firstResponder' | 'refresher' | 'rights' | 'rsdChecklists'
  >('executiveDashboard');
  
  const [lang, setLang] = useState<Language>('EN');
  const [isAIStudioOpen, setIsAIStudioOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isNellyOpen, setIsNellyOpen] = useState<boolean>(false);
  const [isGearModalOpen, setIsGearModalOpen] = useState<boolean>(false);
  const [isStatutoryModalOpen, setIsStatutoryModalOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeTenant, setActiveTenantState] = useState(getActiveTenant());

  const t = translations[lang];
  const popiaStatus = verifyPOPIAEncryption();

  useEffect(() => {
    const unsubTenant = subscribeTenantChange((t) => setActiveTenantState(t));
    return () => unsubTenant();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const moduleTabs = [
    { id: 'executiveDashboard', label: '0. Executive Briefing', icon: LayoutDashboard },
    { id: 'evacuation', label: '1. ESD & Evacuation', icon: AlertOctagon },
    { id: 'spill', label: '2. Fuel Spill Containment', icon: Shield },
    { id: 'customer', label: '3. Customer Hazmat', icon: Building2 },
    { id: 'fire', label: '4. PASS Firefighting', icon: Flame },
    { id: 'quiz', label: '5. 60s Assessment (40 Qs)', icon: Award },
    { id: 'curriculum', label: '6. Curriculum Bank', icon: BookOpen },
    { id: 'demo', label: '7. Video Showcase', icon: Video },
    { id: 'firstResponder', label: '8. First Responder', icon: HeartPulse },
    { id: 'refresher', label: '9. Refresher Hub', icon: RotateCcw },
    { id: 'rights', label: '10. Employee Rights', icon: Scale },
    { id: 'rsdChecklists', label: '11. RSD 26 Checklists', icon: FileCheck },
  ];

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden bg-[#070d1e] font-sans">
      
      {/* PERSISTENT LEFT SIDEBAR (Hidden on mobile, visible on tablet/desktop) */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-[260px] min-w-[260px] h-full bg-[#0b1329] border-r border-slate-800 z-40">
        
        {/* System Brand Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.05em' }}>FORECOURT POS OHS</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>Service Station Compliance Tablet</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>SANS 10089 • Act 85 of 1993</div>
        </div>

        {/* Vertical Module Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {moduleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: isActive ? '900' : '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: isActive ? '#f59e0b' : 'transparent',
                  color: isActive ? '#020617' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Anonymous Footer in Sidebar */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', fontSize: '10px', color: '#64748b' }}>
          System Status: <span style={{ color: '#34d399', fontWeight: 'bold' }}>Active</span> • AES-256
        </div>
      </aside>

      {/* RIGHT MAIN VIEWPORT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, overflow: 'hidden', backgroundColor: '#070d1e' }}>
        
        {/* Top Header Bar */}
        <header className="flex-shrink-0 border-b border-slate-800 bg-[#070d1e] w-full overflow-x-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 w-full max-w-full overflow-x-hidden">
            
            {/* ROW 1 / LEFT: Brand & Essential Telemetry Status */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                    {t.headerBadge} • {activeTenant.siteCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                  </span>
                  {popiaStatus.compliant && (
                    <span className="hidden sm:flex px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30 items-center gap-1 whitespace-nowrap">
                      <Lock className="w-3 h-3 text-cyan-400" /> POPIA AES-256
                    </span>
                  )}
                </div>
                <h1 className="text-base md:text-lg font-black text-white leading-none mt-0.5 truncate max-w-[220px] sm:max-w-none">
                  {activeTenant.brandName}
                </h1>
              </div>

              {/* Mobile Quick Action Badges (Row 1 right) */}
              <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setIsGearModalOpen(true)}
                  className="h-9 w-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-300 transition flex items-center justify-center flex-shrink-0 shadow-sm"
                  title="GEAR Pillars"
                >
                  <Sliders className="w-4 h-4 text-slate-950" />
                </button>
                <button
                  onClick={() => setIsNellyOpen(!isNellyOpen)}
                  className="h-9 w-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black border border-purple-300 transition flex items-center justify-center flex-shrink-0 shadow-sm"
                  title="AI Advisor"
                >
                  <Bot className="w-4 h-4 text-purple-100" />
                </button>
              </div>
            </div>

            {/* CENTER: Telemetry Chips (Desktop / Tablet wrapped row) */}
            <div className="hidden md:flex items-center gap-2 flex-wrap text-xs">
              <div className="hidden lg:flex px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 items-center gap-2 text-xs text-slate-300 whitespace-nowrap">
                <HardDrive className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{t.usbStatus}</span>
              </div>

              <div className="hidden lg:flex px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 items-center gap-2 text-xs text-slate-300 whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{t.esdStatus}</span>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs whitespace-nowrap">
                🕒 {currentTime}
              </div>
            </div>

            {/* RIGHT: Language Switcher & Action Buttons Wrapper */}
            <div className="flex-shrink-0 flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 max-w-full">
              
              {/* Desktop Language Switcher */}
              <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0">
                <Globe className="w-4 h-4 text-amber-400 ml-1 flex-shrink-0" />
                {(['EN', 'ZU', 'AF', 'ST'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`h-8 px-2.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                      lang === l
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Dedicated Flex Action Buttons Wrapper */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="h-9 md:h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
                  title="Multilingual Video Showcase"
                >
                  <Video className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="hidden sm:inline">Live Demo</span>
                </button>

                <button
                  onClick={() => setIsStatutoryModalOpen(true)}
                  className="h-9 md:h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
                  title="Autonomous Statutory OHS Doc Generator"
                >
                  <Scale className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="hidden sm:inline">Statutory Doc</span>
                </button>

                <button
                  onClick={() => setIsNotificationCenterOpen(true)}
                  className="h-9 md:h-10 w-9 md:w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center justify-center flex-shrink-0"
                  title="Retailer Notification Center"
                >
                  <BellRing className="w-4 h-4 text-amber-400 flex-shrink-0" />
                </button>

                <button
                  onClick={() => setIsDossierOpen(true)}
                  className="h-9 md:h-10 w-9 md:w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition flex items-center justify-center flex-shrink-0"
                  title="Corporate Stewardship Dossier"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                </button>

                <button
                  onClick={() => setIsAIStudioOpen(true)}
                  className="h-9 md:h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"
                  title="Google AI Studio Integration & Guardrails"
                >
                  <Bot className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="hidden sm:inline">AI Studio</span>
                </button>

                <button
                  onClick={() => setIsGearModalOpen(true)}
                  className="hidden md:flex h-9 md:h-10 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black border border-amber-300 transition items-center gap-1.5 text-xs whitespace-nowrap shadow-sm"
                  title="Open G.E.A.R. Pillar Settings Suite"
                >
                  <Sliders className="w-4 h-4 text-slate-950 flex-shrink-0" />
                  <span className="hidden lg:inline uppercase">GEAR Pillars</span>
                </button>

                <button
                  onClick={() => setIsNellyOpen(!isNellyOpen)}
                  className="hidden md:flex h-9 md:h-10 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black border border-purple-300 transition items-center gap-1.5 text-xs whitespace-nowrap shadow-sm"
                  title="Toggle AI Avatar Guide"
                >
                  <Bot className="w-4 h-4 text-purple-100 flex-shrink-0" />
                  <span className="hidden lg:inline uppercase">AI Advisor</span>
                </button>
              </div>

            </div>

            {/* ROW 2 (MOBILE ONLY): Language switcher + compact telemetry badges */}
            <div className="flex md:hidden items-center justify-between gap-2 pt-2 border-t border-slate-800/60 w-full">
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 flex-shrink-0" />
                {(['EN', 'ZU', 'AF', 'ST'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`h-7 px-2 rounded-md text-[11px] font-extrabold transition-all whitespace-nowrap ${
                      lang === l
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Mobile Telemetry Status Badges */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1 text-slate-300 whitespace-nowrap">
                  <HardDrive className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">{t.usbStatus}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 text-[11px] whitespace-nowrap">
                  🕒 {currentTime}
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Mobile Secondary Swipeable Tab Bar */}
        <div className="flex md:hidden overflow-x-auto whitespace-nowrap scrollbar-none flex-nowrap gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/90 w-full text-xs">
          {moduleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`h-9 px-3 rounded-lg font-extrabold flex items-center gap-1.5 flex-shrink-0 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>


        {/* Main Active Screen */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'executiveDashboard' && (
            <ExecutiveBriefingDashboard
              lang={lang}
              onOpenNelly={() => setIsNellyOpen(true)}
              onOpenGearModal={() => setIsGearModalOpen(true)}
              onNavigateTab={(target) => setActiveTab(target)}
              onOpenStatutoryModal={() => setIsStatutoryModalOpen(true)}
            />
          )}
          {activeTab === 'evacuation' && <EvacuationFlow />}
          {activeTab === 'spill' && <SpillTeamwork />}
          {activeTab === 'customer' && <CustomerServiceModule />}
          {activeTab === 'fire' && <PASSFirefighting />}
          {activeTab === 'quiz' && <AssessmentQuiz lang={lang} />}
          {activeTab === 'curriculum' && <CurriculumBrowser />}
          {activeTab === 'demo' && (
            <DemoVideoTab 
              lang={lang} 
              onNavigateTab={(target) => setActiveTab(target)} 
              onOpenCertModal={() => setIsCertModalOpen(true)}
            />
          )}
          {activeTab === 'firstResponder' && <NightshiftFirstResponder lang={lang} />}
          {activeTab === 'refresher' && (
            <MonthlyRefresherHub 
              lang={lang} 
              onOpenDossier={() => setIsDossierOpen(true)}
            />
          )}
          {activeTab === 'rights' && <StatutoryRightsModule />}
          {activeTab === 'rsdChecklists' && <RSDChecklistModule lang={lang} />}
        </main>

        {/* CREATED BY ENTERPRISE FOOTER */}
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

      {/* Google AI Studio Drawer */}
      <AIStudioDrawer
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
      />

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

