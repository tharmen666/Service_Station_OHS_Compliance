import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../data/translations';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Thermometer, 
  FileText, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Lock, 
  RotateCcw,
  Flame,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { getActiveTenant, switchTenantBrand, TenantBrandConfig, subscribeTenantChange } from '../multiTenantConfig';
import { getGearState, subscribeGearChange, GearState } from '../gearStore';

interface HQDemoVideoShowcaseProps {
  lang: Language;
  onOpenNelly?: () => void;
  onOpenGearModal?: () => void;
}

export interface DemoStep {
  id: number;
  timeRange: string;
  startSec: number;
  endSec: number;
  title: string;
  subtitle: string;
  script: string;
  frameworks: string[];
}

export const demoSteps: DemoStep[] = [
  {
    id: 1,
    timeRange: '0:00 - 0:12',
    startSec: 0,
    endSec: 12,
    title: 'Multi-Tenant White-Labeling & Brand Switching',
    subtitle: 'Dynamic branding engine for forecourt majors with client-side POPIA data protection safeguards',
    script: 'Welcome to forecourt and retail compliance. Our multi-tenant engine adapts in real time to petroleum and food retail brands while protecting sensitive data with client-side AES-256-GCM encryption as technical safeguards under POPIA Condition 7 / Section 19.',
    frameworks: ['POPIA AES-256', 'Multi-Tenant Engine', 'White-Label Branding']
  },
  {
    id: 2,
    timeRange: '0:12 - 0:28',
    startSec: 12,
    endSec: 28,
    title: 'Statutory Guardrails & T=0.0 Determinism',
    subtitle: 'Nelly AI deterministic response engine enforcing regulatory standards & thermal checks',
    script: 'At the core is Nelly—configured for deterministic statutory response generation at temperature: 0.0. Every recommendation strictly maps across regulatory frameworks including OHS Act 85 of 1993, R638, ISO 22000, and FDA standards with direct citations.',
    frameworks: ['OHS Act 85', 'R638 Food Hygiene', 'ISO 22000', 'FDA Food Code 2022', 'Nevada SNHD']
  },
  {
    id: 3,
    timeRange: '0:28 - 0:42',
    startSec: 28,
    endSec: 42,
    title: 'Dynamic Hazard Risk Matrix & SLA Action Plan',
    subtitle: 'Auto-populating Baseline Risk Assessment with live supervisor SLA escalation timers',
    script: 'Hazards are instantly quantified on a live risk matrix, automatically generating structured Action Plans with mandatory supervisor owners, target dates, and audit-ready tracking.',
    frameworks: ['Baseline Risk Matrix', 'SLA Escalation Protocol', 'OHSA Section 16.1']
  },
  {
    id: 4,
    timeRange: '0:42 - 0:60',
    startSec: 42,
    endSec: 60,
    title: 'One-Click PDF Generation & GEAR Calibration',
    subtitle: 'Instant ReportLab PDF compliance manual export and G.E.A.R. Pillar threshold recalibration',
    script: 'Calibrate your site parameters via G.E.A.R. meters and generate full, physically signable compliance manuals in a single click. 100% audit-ready, anytime, anywhere.',
    frameworks: ['G.E.A.R. Pillar System', 'Python ReportLab PDF', 'Audit Sign-off']
  }
];

export const HQDemoVideoShowcase: React.FC<HQDemoVideoShowcaseProps> = ({
  lang,
  onOpenNelly,
  onOpenGearModal
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [activeTenant, setActiveTenant] = useState<TenantBrandConfig>(getActiveTenant());
  const [gearState, setGearState] = useState<GearState>(getGearState());
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setAvailableVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const unsubTenant = subscribeTenantChange((t) => setActiveTenant(t));
    const unsubGear = subscribeGearChange((g) => setGearState(g));
    return () => {
      unsubTenant();
      unsubGear();
    };
  }, []);

  const activeStep = demoSteps[activeStepIndex];

  // Speech synthesis audio playback with Rachel Female Voiceover priority
  const speakStepScript = (scriptText: string, langCode: string = 'en-US') => {
    if (isMuted || !('speechSynthesis' in window)) return;

    // 1. Clear any stuck utterance queue in Chrome/Edge
    window.speechSynthesis.cancel();

    setTimeout(() => {
      try {
        if (!('speechSynthesis' in window) || isMuted) return;

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(scriptText);
        activeUtteranceRef.current = utterance;
        
        // 2. Select appropriate voice or fallback
        const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
        let matchedVoice = voices.find(v => v.name.toLowerCase().includes('rachel'))
                        || voices.find(v => v.name.toLowerCase().includes('natural') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('aria')))
                        || voices.find(v => v.name.toLowerCase().includes('zira'))
                        || voices.find(v => v.name.toLowerCase().includes('aria'))
                        || voices.find(v => v.name.toLowerCase().includes('jenny'))
                        || voices.find(v => v.name.toLowerCase().includes('samantha'))
                        || voices.find(v => v.name.toLowerCase().includes('victoria'))
                        || voices.find(v => v.name.toLowerCase().includes('karen'))
                        || voices.find(v => v.name.toLowerCase().includes('female'))
                        || voices.find(v => v.lang.startsWith(langCode.toLowerCase()))
                        || voices.find(v => v.lang.startsWith('en'))
                        || voices[0];

        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        } else {
          utterance.lang = 'en-US';
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.15; // Natural female voice timbre

        utterance.onend = () => {
          activeUtteranceRef.current = null;
        };
        utterance.onerror = () => {
          activeUtteranceRef.current = null;
        };

        // 3. Resume queue and trigger
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error in demo:', err);
      }
    }, 60);
  };

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          // Step transition checks
          if (next >= 42) setActiveStepIndex(3);
          else if (next >= 28) setActiveStepIndex(2);
          else if (next >= 12) setActiveStepIndex(1);
          else setActiveStepIndex(0);
          return next;
        });
      }, 1000);
    } else {
      window.speechSynthesis.cancel();
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepSelect = (index: number) => {
    setActiveStepIndex(index);
    const targetSec = demoSteps[index].startSec;
    setProgressSec(targetSec);
    speakStepScript(demoSteps[index].script);
  };

  const handleTogglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    if (newPlayState) {
      speakStepScript(activeStep.script);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const handleGeneratePDF = () => {
    setIsPdfGenerating(true);
    setPdfSuccessMessage('');
    setTimeout(() => {
      setIsPdfGenerating(false);
      setPdfSuccessMessage('Service_Station_OHS_Manual.pdf generated with full SACPCMP manager signature & SHA-256 audit hash!');
    }, 1200);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0 space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="pos-card p-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              🎬 60-Second HQ Interactive Showcase
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              🎙️ Guided by 'Rachel' Female Voiceover
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Forecourt & Retail Food Compliance Suite
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            Interactive multi-tenant white-labeling, T=0.0 statutory guardrails, live baseline risk matrix, and single-click G.E.A.R. PDF calibration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleTogglePlay}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition transform hover:-translate-y-0.5 min-h-[48px] w-full sm:w-auto ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-amber-950/60'
            }`}
          >
            {isPlaying ? (
              <><Pause className="w-4 h-4 fill-white" /> Pause Presentation</>
            ) : (
              <><Play className="w-4 h-4 fill-slate-950" /> Play 60s Video Showcase</>
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition min-h-[48px] min-w-[48px] flex items-center justify-center"
            title="Toggle Voiceover Audio"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Video Canvas & Stage Display */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative aspect-video rounded-3xl bg-slate-950 border-2 border-purple-500/50 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
            
            {/* Background Graphic Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            
            {/* Top Stage Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur text-xs font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>TIMELINE: {progressSec}s / 60s</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/40 text-xs font-bold text-purple-300">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                <span>{activeStep.timeRange} • CHAPTER {activeStep.id} OF 4</span>
              </div>
            </div>

            {/* Stage Center Visual Preview Content */}
            <div className="relative z-10 my-auto p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md space-y-4">
              
              {/* Stage 1: Brand Switcher Visual */}
              {activeStepIndex === 0 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Live Multi-Tenant White-Label Engine
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-400" /> POPIA Client-Side Encrypted
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-800 flex items-center justify-between"
                       style={{ backgroundColor: `${activeTenant.primaryColor}20`, borderColor: activeTenant.primaryColor }}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activeTenant.badgeSymbol}</span>
                      <div>
                        <h4 className="text-base font-black text-white">{activeTenant.brandName}</h4>
                        <span className="text-xs text-slate-300 font-mono">{activeTenant.siteCode} • {activeTenant.stationName}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950"
                          style={{ backgroundColor: activeTenant.accentColor }}>
                      {activeTenant.fuelBrand}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-xs text-slate-400 font-bold">Switch Station:</span>
                    {(['alpha', 'bravo', 'charlie', 'delta', 'echo'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => switchTenantBrand(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition border ${
                          activeTenant.siteCode.toLowerCase().includes(b)
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        Site {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage 2: Nelly AI Statutory Guardrails & Thermal Probe */}
              {activeStepIndex === 1 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-purple-300 tracking-wider">
                      Nelly AI Agent • T=0.0 Determinism Mode
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Zero Hallucinations
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <Thermometer className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">CCP Poultry Thermal Probe</span>
                        <h4 className="text-lg font-black text-amber-400 font-mono">73.9°C Internal Temp</h4>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
                      ✓ PASSED (R638 / FDA)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-300 pt-1">
                    {activeStep.frameworks.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage 3: Dynamic Risk Matrix */}
              {activeStepIndex === 2 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                      Baseline Risk Matrix & Supervisor SLA Escalation
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> SLA Escalation Timer: 03:42:15
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-red-500/30 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-red-400">Forecourt Pump 3 Spill</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-black">CRITICAL</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">Owner: Shift Manager J. Naidoo</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-amber-400">Deep Fryer Oil Temp</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black">HIGH</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">Owner: Food Supervisor P. Botha</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 4: PDF & GEAR Calibration */}
              {activeStepIndex === 3 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      One-Click PDF Generation & GEAR Pillar Meters
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">
                      Overall Health: {gearState.overallHealthScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        ReportLab Python PDF Engine
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Generates signable compliance manual with SACPCMP seal</span>
                    </div>

                    <button
                      onClick={handleGeneratePDF}
                      disabled={isPdfGenerating}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition min-h-[40px] whitespace-nowrap"
                    >
                      {isPdfGenerating ? 'Generating PDF...' : '📄 Generate Full Manual PDF'}
                    </button>
                  </div>

                  {pdfSuccessMessage && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fadeIn">
                      ✓ {pdfSuccessMessage}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-800/80">
              <button
                onClick={() => onOpenNelly?.()}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-extrabold flex items-center gap-2 border border-purple-500/40 transition min-h-[40px]"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Ask Nelly AI Guide</span>
              </button>

              <button
                onClick={() => onOpenGearModal?.()}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-extrabold flex items-center gap-2 border border-amber-500/40 transition min-h-[40px]"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Open G.E.A.R. Calibration</span>
              </button>
            </div>

          </div>

          {/* Scrubber Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 relative cursor-pointer"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const clickX = e.clientX - rect.left;
                 const ratio = clickX / rect.width;
                 const targetSec = Math.round(ratio * 60);
                 setProgressSec(targetSec);
               }}>
            <div 
              className="bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(progressSec / 60) * 100}%` }}
            />
          </div>

        </div>

        {/* Right Side: Timeline Teleprompter Script */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between min-h-[420px]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-purple-300 tracking-wider">
                Rachel HQ Female Voiceover Script
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px] font-mono font-bold border border-slate-800">
                {activeStep.timeRange}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black text-white leading-snug">{activeStep.title}</h4>
              <p className="text-xs text-slate-400">{activeStep.subtitle}</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-purple-300 tracking-wider block">
                🗣️ Speech Synthesis Script:
              </span>
              <p className="text-white text-xs sm:text-sm font-semibold leading-relaxed italic">
                "{activeStep.script}"
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">Enforced Compliance Frameworks:</span>
              <div className="flex flex-wrap gap-1">
                {activeStep.frameworks.map((f, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-[10px] font-mono border border-slate-800">
                    {f}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4 Timeline Chapter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoSteps.map((step, idx) => (
          <div
            key={step.id}
            onClick={() => handleStepSelect(idx)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
              activeStepIndex === idx
                ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500 ring-2 ring-purple-500/30 shadow-xl'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 font-mono font-bold border border-slate-800">
                  {step.timeRange}
                </span>
                {activeStepIndex === idx && (
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <h4 className="text-xs font-black text-white">{step.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{step.subtitle}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-extrabold text-amber-400">
              <span>View Chapter {step.id}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
