import React, { useState, useEffect } from 'react';
import { Language, translations, DemoChapter } from '../data/translations';
import { 
  Play, 
  Pause, 
  Tv, 
  Mic, 
  Video, 
  Volume2, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Monitor, 
  ShieldCheck,
  Zap,
  ExternalLink,
  Award,
  Download,
  FileVideo,
  HeartPulse,
  RotateCcw
} from 'lucide-react';

interface DemoVideoTabProps {
  lang: Language;
  onNavigateTab?: (tab: 'evacuation' | 'spill' | 'customer' | 'fire' | 'quiz' | 'firstResponder' | 'refresher') => void;
  onOpenCertModal?: () => void;
}

export const DemoVideoTab: React.FC<DemoVideoTabProps> = ({ 
  lang,
  onNavigateTab,
  onOpenCertModal
}) => {
  const t = translations[lang];
  const chapters = t.chaptersList;

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<Language>(lang);

  useEffect(() => {
    setVoiceLang(lang);
  }, [lang]);

  const activeChapter: DemoChapter = translations[voiceLang].chaptersList[activeChapterIndex] || chapters[0];

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (activeChapterIndex < chapters.length - 1) {
          setActiveChapterIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeChapterIndex, chapters.length]);

  const handleExecuteVisualAction = () => {
    if (!onNavigateTab) return;
    if (activeChapterIndex === 0) {
      onNavigateTab('evacuation');
    } else if (activeChapterIndex === 1) {
      onNavigateTab('customer');
    } else if (activeChapterIndex === 2) {
      onNavigateTab('fire');
    } else if (activeChapterIndex === 3) {
      onNavigateTab('firstResponder');
    } else if (activeChapterIndex === 4) {
      onNavigateTab('refresher');
    } else if (activeChapterIndex === 5) {
      if (onOpenCertModal) onOpenCertModal();
      else onNavigateTab('quiz');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card p-6 rounded-3xl border border-purple-500/40 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider mb-2 border border-purple-500/40">
            <Video className="w-4 h-4 text-purple-400" />
            Operational Demo Video Studio (6 Chapters • 2-Minute Suite)
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{t.demoVideoTitle}</h2>
          <p className="text-slate-300 text-sm mt-1">{t.demoVideoSubtitle}</p>
        </div>

        {/* Download MP4 Button & Shortcut */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <a
            href="/Service_Station_OHS_Compliance_Demo.mp4"
            download="Service_Station_OHS_Compliance_Demo.mp4"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition transform hover:-translate-y-0.5 min-h-[48px]"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>💾 Download MP4 Demo Suite</span>
          </a>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-[11px]">
              <FileVideo className="w-3.5 h-3.5 text-emerald-400" />
              <span>Desktop Copy Ready</span>
            </div>
            <p className="text-slate-400 text-[10px] font-mono">Service_Station_OHS_Compliance_Demo.mp4</p>
          </div>
        </div>
      </div>

      {/* Multilingual Voice Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-purple-400" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">{t.voiceLanguageLabel}</span>
            <span className="text-xs font-bold text-amber-300">{translations[voiceLang].accentNoteLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {(['EN', 'ZU', 'AF', 'ST'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setVoiceLang(l)}
              className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 min-h-[38px] ${
                voiceLang === l
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/60 border border-purple-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{l === 'EN' ? 'English' : l === 'ZU' ? 'isiZulu' : l === 'AF' ? 'Afrikaans' : 'Sesotho'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Presentation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-3xl bg-slate-950 border-2 border-purple-500/50 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
            {/* High-Tech Slate Compliance Preview Frame */}
            <div className="absolute inset-0 bg-[#070d1e] border-2 border-purple-500/50 rounded-3xl flex flex-col justify-between p-6">
              {/* Subtle Grid Overlay & High-Tech Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              {/* Center Animated Compliance Engine Icon & Waveform */}
              <div className="relative z-10 my-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border-2 border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto shadow-2xl shadow-purple-950/50">
                  <ShieldCheck className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-purple-400">
                    Interactive Forecourt Compliance Engine
                  </div>
                  <div className="text-sm font-extrabold text-slate-200">
                    Simulation Feed Active • Chapter {activeChapter.id} Visual Guide
                  </div>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {[40, 70, 30, 90, 50, 80, 40, 60, 100, 45, 75, 35].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-amber-400 animate-pulse"
                      style={{ height: `${isPlaying ? h * 0.4 : 12}px`, animationDelay: `${idx * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur border border-purple-500/40 text-purple-300 text-xs font-black">
                <Tv className="w-4 h-4 text-purple-400" />
                <span>CHAPTER {activeChapter.id} OF 6</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-amber-400">{activeChapter.timeRange}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur border border-slate-800 text-xs font-extrabold text-emerald-400">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
                <span>{isPlaying ? 'PLAYING DEMO' : 'READY TO PLAY'}</span>
              </div>
            </div>

            <div className="relative z-10 my-auto text-center space-y-3 py-2 px-2 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto shadow-inner">
                {activeChapter.id === 1 && <ShieldCheck className="w-8 h-8 text-amber-400 animate-pulse" />}
                {activeChapter.id === 2 && <Globe className="w-8 h-8 text-blue-400 animate-bounce" />}
                {activeChapter.id === 3 && <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />}
                {activeChapter.id === 4 && <HeartPulse className="w-8 h-8 text-red-400 animate-pulse" />}
                {activeChapter.id === 5 && <RotateCcw className="w-8 h-8 text-amber-400 animate-spin" />}
                {activeChapter.id === 6 && <Award className="w-8 h-8 text-emerald-400 animate-pulse" />}
              </div>

              <h3 className="text-lg md:text-xl font-black text-white tracking-tight drop-shadow-md">
                {activeChapter.title}
              </h3>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-lg ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50'
                } min-h-[44px]`}
              >
                {isPlaying ? (
                  <><Pause className="w-4 h-4 fill-white" /> {t.pauseDemoBtn}</>
                ) : (
                  <><Play className="w-4 h-4 fill-white" /> {t.playDemoBtn}</>
                )}
              </button>

              <button
                onClick={handleExecuteVisualAction}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-extrabold flex items-center gap-2 border border-slate-700 transition min-h-[44px]"
              >
                <span>Jump To Live Module Screen</span>
                <ExternalLink className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
              disabled={activeChapterIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 transition flex items-center gap-2 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" /> {t.prevChapterBtn}
            </button>

            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-slate-400">
              {chapters.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                    activeChapterIndex === idx ? 'bg-purple-400 ring-2 ring-purple-500/50 scale-125' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
              disabled={activeChapterIndex === chapters.length - 1}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-950/50 transition flex items-center gap-2 min-h-[44px]"
            >
              {t.nextChapterBtn} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teleprompter Script */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-purple-300 uppercase tracking-wider">
                <Mic className="w-4 h-4 text-purple-400" />
                <span>Teleprompter Script ({voiceLang})</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px] font-mono font-extrabold border border-slate-800">
                {activeChapter.timeRange}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-extrabold block">{t.whatToClickLabel}</span>
              <p className="text-slate-300 font-semibold">{activeChapter.visualCue}</p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
              <span className="text-purple-300 font-extrabold text-xs block">{t.scriptToReadLabel}</span>
              <p className="text-white text-sm md:text-base font-extrabold leading-relaxed tracking-wide italic">
                {activeChapter.script}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span><strong>Accent Tone:</strong> {activeChapter.accentGuidance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Chapter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chap, idx) => (
          <div
            key={chap.id}
            onClick={() => setActiveChapterIndex(idx)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
              activeChapterIndex === idx
                ? 'bg-gradient-to-b from-purple-950/50 to-slate-900 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 font-mono font-bold border border-slate-800">
                  {chap.timeRange}
                </span>
                {activeChapterIndex === idx && (
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <h4 className="text-sm font-extrabold text-white">{chap.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{chap.visualCue}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-extrabold text-purple-400">
              <span>View Chapter {chap.id}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
