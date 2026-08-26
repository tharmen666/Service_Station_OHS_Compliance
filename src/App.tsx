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
import { Language, translations } from './data/translations';
import { getActiveTenant } from './multiTenantConfig';
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
  Menu,
  X,
  Globe,
  FileCheck,
  Building2,
  Lock,
  Video,
  HeartPulse,
  RotateCcw,
  BellRing,
  FileSpreadsheet,
  Scale
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'evacuation' | 'spill' | 'customer' | 'fire' | 'quiz' | 'curriculum' | 'demo' | 'firstResponder' | 'refresher' | 'rights'
  >('evacuation');
  
  const [lang, setLang] = useState<Language>('EN');
  const [isAIStudioOpen, setIsAIStudioOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const t = translations[lang];
  const activeTenant = getActiveTenant();
  const popiaStatus = verifyPOPIAEncryption();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top POS Header Bar */}
      <header className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-lg shadow-amber-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl">
                ⛽
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                  {t.headerBadge} • {activeTenant.siteCode}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
                {popiaStatus.compliant && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" /> POPIA AES-256
                  </span>
                )}
              </div>
              <h1 className="text-base md:text-lg font-black text-white leading-none mt-0.5">{t.headerTitle}</h1>
            </div>
          </div>

          {/* POS Status & Multilingual Selector */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-300">
            {/* Multilingual Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <Globe className="w-4 h-4 text-amber-400 ml-1" />
              {(['EN', 'ZU', 'AF', 'ST'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all min-h-[32px] ${
                    lang === l
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px]">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.usbStatus}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.esdStatus}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-200 text-xs">
              🕒 {currentTime}
            </div>
          </div>

          {/* Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs flex items-center gap-2 border border-slate-700 transition min-h-[40px]"
              title="Retailer Notification Center"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">Alerts</span>
            </button>

            <button
              onClick={() => setIsDossierOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-extrabold text-xs flex items-center gap-2 border border-slate-700 transition min-h-[40px]"
              title="Oil Company Corporate Stewardship Dossier"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">Dossier</span>
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition min-h-[40px]"
            >
              <Video className="w-4 h-4 fill-slate-950" />
              <span className="hidden sm:inline">🎬 Live Demo</span>
            </button>

            <button
              onClick={() => setIsAIStudioOpen(true)}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50 transition border border-purple-400/30 min-h-[40px]"
              title="Google AI Studio OHS Prompt Drawer"
            >
              <Bot className="w-4 h-4 text-purple-300" />
              <span className="hidden sm:inline">AI Studio</span>
            </button>

            <button
              onClick={() => setIsCertModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition border border-emerald-400/30 min-h-[40px]"
            >
              <FileCheck className="w-4 h-4" />
              <span className="hidden sm:inline">HITL Audit</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 min-h-[40px] min-w-[40px]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Multilingual Selector for Mobile Screens */}
        <div className="lg:hidden px-4 pb-2 pt-1 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-400" /> Language:
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {(['EN', 'ZU', 'AF', 'ST'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  lang === l
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Hazard Module Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-2 border-t border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('evacuation')}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'evacuation'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              {t.tabEvacuation}
            </button>

            <button
              onClick={() => setActiveTab('spill')}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'spill'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/60 border border-amber-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              {t.tabSpill}
            </button>

            <button
              onClick={() => setActiveTab('customer')}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'customer'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/60 border border-blue-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              {t.tabCustomer}
            </button>

            <button
              onClick={() => setActiveTab('fire')}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'fire'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Flame className="w-4 h-4" />
              {t.tabFire}
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'quiz'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/60 border border-purple-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              {t.tabQuiz}
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'curriculum'
                  ? 'bg-slate-800 text-amber-400 shadow-lg border border-amber-500/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.tabCurriculum}
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'demo'
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 shadow-xl border border-amber-400'
                  : 'bg-emerald-950/60 text-emerald-300 hover:text-white hover:bg-emerald-900 border border-emerald-500/40'
              }`}
            >
              <Video className="w-4 h-4 fill-current" />
              {t.tabDemoVideo}
            </button>

            <button
              onClick={() => setActiveTab('firstResponder')}
              className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'firstResponder'
                  ? 'bg-red-600 text-white shadow-xl border border-red-400'
                  : 'bg-red-950/40 text-red-300 hover:text-white hover:bg-red-900 border border-red-500/40'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-red-400 animate-pulse" />
              {t.tabFirstResponder}
            </button>

            <button
              onClick={() => setActiveTab('refresher')}
              className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'refresher'
                  ? 'bg-amber-500 text-slate-950 shadow-xl border border-amber-300'
                  : 'bg-amber-950/40 text-amber-300 hover:text-white hover:bg-amber-900 border border-amber-500/40'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Refresher
            </button>

            {/* Employee Statutory Rights (BCEA & OHSA) */}
            <button
              onClick={() => setActiveTab('rights')}
              className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all min-h-[44px] ${
                activeTab === 'rights'
                  ? 'bg-blue-600 text-white shadow-xl border border-blue-400'
                  : 'bg-blue-950/40 text-blue-300 hover:text-white hover:bg-blue-900 border border-blue-500/40'
              }`}
            >
              <Scale className="w-4 h-4 text-blue-400" />
              9. ⚖️ Employee Rights (BCEA)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
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
      </main>

      {/* Statutory Footer & Regulatory Standards */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">OHSA 85 OF 1993 • SANS 10089-3:2010 • SANS 10263 • BCEA ACT 75 OF 1997</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Department of Employment & Labour Approved</span>
            <span className="text-slate-600">•</span>
            <span>Local USB Storage: <code className="text-amber-400">D:\ Active</code></span>
          </div>
        </div>
      </footer>

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
