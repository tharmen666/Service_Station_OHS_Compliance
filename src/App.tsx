import React, { useState, useEffect } from 'react';
import { EvacuationFlow } from './components/EvacuationFlow';
import { SpillTeamwork } from './components/SpillTeamwork';
import { PASSFirefighting } from './components/PASSFirefighting';
import { CustomerServiceModule } from './components/CustomerServiceModule';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { CurriculumBrowser } from './components/CurriculumBrowser';
import { AIStudioDrawer } from './components/AIStudioDrawer';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Shield, 
  Flame, 
  Award, 
  BookOpen, 
  Bot, 
  HardDrive, 
  Zap, 
  Activity,
  Menu,
  X
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evacuation' | 'spill' | 'customer' | 'fire' | 'quiz' | 'curriculum'>('evacuation');
  const [isAIStudioOpen, setIsAIStudioOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 p-0.5 shadow-lg shadow-amber-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xl">
                ⛽
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">Forecourt POS OHS</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
              </div>
              <h1 className="text-base md:text-lg font-extrabold text-white leading-none">Service Station Compliance Tablet</h1>
            </div>
          </div>

          {/* Desktop Status Indicators */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>USB Drive: <strong className="text-amber-300">D:\ Active</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>ESD System: <strong className="text-emerald-300">READY</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-200">
              🕒 {currentTime}
            </div>
          </div>

          {/* Action Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIStudioOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50 transition border border-purple-400/30"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Google AI Studio</span> Prompt
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Hazard Module Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-2 border-t border-slate-800/80 overflow-x-auto">
          <nav className="flex space-x-2 min-w-max">
            {/* Red Tab: Evacuation */}
            <button
              onClick={() => { setActiveTab('evacuation'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'evacuation'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-950/50 ring-2 ring-red-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Evacuation Flow</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-red-950 text-red-200 text-[10px]">RED</span>
            </button>

            {/* Amber Tab: Spill Teamwork */}
            <button
              onClick={() => { setActiveTab('spill'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'spill'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50 ring-2 ring-amber-400/50 font-black'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Spill Teamwork</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">AMBER</span>
            </button>

            {/* Blue Tab: Customer Service */}
            <button
              onClick={() => { setActiveTab('customer'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'customer'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-950/50 ring-2 ring-blue-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Customer Service</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">BLUE</span>
            </button>

            {/* Green Tab: PASS Fire & First Aid */}
            <button
              onClick={() => { setActiveTab('fire'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'fire'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-400/50 font-black'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Fire & First Aid</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">GREEN</span>
            </button>

            {/* Gold Tab: Assessment Quiz */}
            <button
              onClick={() => { setActiveTab('quiz'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-950/50 ring-2 ring-amber-400/50 font-black'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>60s Quiz Loop</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px]">40 Qs</span>
            </button>

            {/* Purple Tab: Curriculum Library */}
            <button
              onClick={() => { setActiveTab('curriculum'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 ring-2 ring-purple-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum Library</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px]">511 Files</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'evacuation' && <EvacuationFlow />}
        {activeTab === 'spill' && <SpillTeamwork />}
        {activeTab === 'customer' && <CustomerServiceModule />}
        {activeTab === 'fire' && <PASSFirefighting />}
        {activeTab === 'quiz' && <AssessmentQuiz />}
        {activeTab === 'curriculum' && <CurriculumBrowser />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>Service Station OHS Compliance POS Micro-Training &copy; 2026</span>
          <span className="font-mono text-[11px] text-slate-400">SABS SANS 10089 | OHS Act 85 of 1993 | COIDA Compliant</span>
        </div>
      </footer>

      {/* AI Studio Drawer */}
      <AIStudioDrawer
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
      />
    </div>
  );
};
