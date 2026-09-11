import React, { useState, useRef, useEffect } from 'react';
import { Language, translations, DemoChapter } from '../data/translations';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Globe, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Film, 
  Tv, 
  Mic, 
  Maximize, 
  RotateCcw,
  BadgeCheck,
  Download,
  FileVideo,
  ShieldCheck
} from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({
  isOpen,
  onClose,
  lang: initialLang
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(initialLang);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setSelectedLang(initialLang);
  }, [initialLang]);

  if (!isOpen) return null;

  const t = translations[selectedLang];
  const chapters = t.chaptersList;
  const activeChapter: DemoChapter = chapters[activeChapterIndex] || chapters[0];

  const handleJumpToTimestamp = (index: number) => {
    setActiveChapterIndex(index);
    setIsPlaying(true);
    if (videoRef.current) {
      const times = [0, 20, 45, 70];
      videoRef.current.currentTime = times[index] || 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl shadow-emerald-950/60 overflow-hidden flex flex-col my-6 max-h-[92vh]">
        
        {/* Modal Header Bar with Multilingual Switcher & Download MP4 */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-purple-950 border-b border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-xl">
                🎬
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> LIVE CLIENT DEMO
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                  90s Operational Pitch
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">{t.demoVideoTitle}</h3>
            </div>
          </div>

          {/* Top Bar Controls, Download Button & Language Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            <a
              href="/Service_Station_OHS_Compliance_Demo.mp4"
              download="Service_Station_OHS_Compliance_Demo.mp4"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>💾 Download MP4</span>
            </a>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <Globe className="w-4 h-4 text-emerald-400 ml-1" />
              {(['EN', 'ZU', 'AF', 'ST'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedLang === l
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition min-h-[40px] min-w-[40px]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Main Video & Audio Player Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* HTML5 Video / Canvas Player (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
                
                {/* High-Tech Slate Compliance Preview Frame */}
                <div className="absolute inset-0 bg-[#070d1e] border-2 border-slate-800 rounded-3xl flex flex-col justify-between p-6">
                  {/* Subtle Grid Overlay & High-Tech Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  
                  {/* Center Animated Compliance Engine Icon & Waveform */}
                  <div className="relative z-10 my-auto text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl shadow-amber-950/50">
                      <ShieldCheck className="w-8 h-8 animate-pulse" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs font-black uppercase tracking-widest text-amber-400">
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
                          className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-emerald-400 animate-pulse"
                          style={{ height: `${isPlaying ? h * 0.4 : 12}px`, animationDelay: `${idx * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />

                {/* Top Player HUD */}
                <div className="relative z-10 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur border border-slate-800 text-xs font-black text-amber-400 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-emerald-400" />
                    <span>CHAPTER {activeChapter.id}: {activeChapter.timeRange}</span>
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-10 space-y-1 pointer-events-none">
                  <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                    {t.whatToClickLabel}
                  </span>
                  <p className="text-white text-xs font-extrabold leading-tight">
                    {activeChapter.visualCue}
                  </p>
                </div>
              </div>

              {/* Timestamp Quick-Jump Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => handleJumpToTimestamp(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      activeChapterIndex === idx
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-extrabold ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-black text-amber-400 block">{chap.timeRange}</span>
                    <span className="text-xs font-bold truncate block">{chap.title.split(':')[1] || chap.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Script Visualizer Teleprompter (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between min-h-[340px]">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>Multilingual Voiceover Script ({selectedLang})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                    SA Accent Ready
                  </span>
                </div>

                {/* Voice Script Text */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-400 block">{t.scriptToReadLabel}</span>
                  <blockquote className="text-white text-sm md:text-base font-extrabold leading-relaxed italic border-l-4 border-emerald-500 pl-3">
                    {activeChapter.script}
                  </blockquote>
                </div>

                {/* Accent Guidance */}
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-300 space-y-1">
                  <strong className="block text-amber-300 font-extrabold">South African Voice Accent Tone:</strong>
                  <p className="text-[11px] text-slate-300">{activeChapter.accentGuidance}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={togglePlay}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition min-h-[44px]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                    <span>{isPlaying ? 'Pause Presentation' : 'Play Script Voiceover'}</span>
                  </button>

                  <a
                    href="/Service_Station_OHS_Compliance_Demo.mp4"
                    download="Service_Station_OHS_Compliance_Demo.mp4"
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 transition min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
