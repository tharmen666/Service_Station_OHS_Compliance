import React, { useState, useEffect } from 'react';
import { Language, translations, DemoChapter } from '../data/translations';
import {
  Play,
  Pause,
  Tv,
  Video,
  Globe,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  ExternalLink,
  Award,
  Download,
  HeartPulse,
  RotateCcw,
} from 'lucide-react';
import { downloadStatutoryPdf } from '../lib/pdfGenerator';

interface DemoVideoTabProps {
  lang: Language;
  onNavigateTab?: (
    tab: 'evacuation' | 'spill' | 'customer' | 'fire' | 'quiz' | 'firstResponder' | 'refresher'
  ) => void;
  onOpenCertModal?: () => void;
}

export const DemoVideoTab: React.FC<DemoVideoTabProps> = ({
  lang,
  onNavigateTab,
  onOpenCertModal,
}) => {
  const t = translations[lang];
  const chapters = t.chaptersList;

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<Language>(lang);

  useEffect(() => {
    setVoiceLang(lang);
  }, [lang]);

  const activeChapter: DemoChapter =
    translations[voiceLang].chaptersList[activeChapterIndex] || chapters[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (activeChapterIndex < chapters.length - 1) {
        setActiveChapterIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [isPlaying, activeChapterIndex, chapters.length]);

  const handleExecuteVisualAction = () => {
    if (!onNavigateTab) return;
    if (activeChapterIndex === 0) onNavigateTab('evacuation');
    else if (activeChapterIndex === 1) onNavigateTab('customer');
    else if (activeChapterIndex === 2) onNavigateTab('fire');
    else if (activeChapterIndex === 3) onNavigateTab('firstResponder');
    else if (activeChapterIndex === 4) onNavigateTab('refresher');
    else if (activeChapterIndex === 5) {
      if (onOpenCertModal) onOpenCertModal();
      else onNavigateTab('quiz');
    }
  };

  const handleDownloadChapterPdf = () => {
    downloadStatutoryPdf(
      `Forecourt_Training_Chapter_${activeChapter.id}.pdf`,
      activeChapter.title,
      activeChapter.script.replace(/^"|"$/g, '')
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card p-6 rounded-3xl border border-purple-500/40 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-black uppercase tracking-wider mb-2 border border-purple-500/40">
            <Video className="w-4 h-4 text-purple-400" />
            Operational Training Walkthrough (6 Modules)
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t.demoVideoTitle}
          </h2>
          <p className="text-slate-300 text-sm mt-1">{t.demoVideoSubtitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleDownloadChapterPdf}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl transition min-h-[48px]"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>Download Chapter Summary PDF</span>
          </button>
        </div>
      </div>

      {/* Multilingual Language Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-purple-400" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              {t.voiceLanguageLabel}
            </span>
            <span className="text-xs font-bold text-amber-300">
              Select language for chapter summary
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {(['EN', 'SW', 'ZU', 'AF', 'ST'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setVoiceLang(l)}
              className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 min-h-[38px] ${
                voiceLang === l
                  ? 'bg-purple-600 text-white shadow-lg border border-purple-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>
                {l === 'EN'
                  ? 'English'
                  : l === 'SW'
                  ? 'Kiswahili'
                  : l === 'ZU'
                  ? 'isiZulu'
                  : l === 'AF'
                  ? 'Afrikaans'
                  : 'Sesotho'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Presentation Canvas & Key Takeaways (No internal teleprompter cues) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl bg-slate-950 border-2 border-purple-500/50 overflow-hidden shadow-2xl flex flex-col justify-between p-6 min-h-[320px]">
            {/* Realistic Commercial Service Station Video Footage */}
            <video
              src="/Service_Station_OHS_Compliance_Demo.mp4"
              poster={
                activeChapterIndex % 3 === 0
                  ? '/assets/forecourt_realistic_scene1.jpg'
                  : activeChapterIndex % 3 === 1
                  ? '/assets/forecourt_realistic_scene2.jpg'
                  : '/assets/forecourt_realistic_scene3.jpg'
              }
              autoPlay
              muted
              loop
              playsInline
              data-testid="demo-video-tab-player"
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/70 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-purple-500/40 text-purple-200 text-xs font-black">
                <Tv className="w-4 h-4 text-purple-400" />
                <span>CHAPTER {activeChapter.id} OF 6 • HD FORECOURT FOOTAGE</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-extrabold text-emerald-400">
                <span>{isPlaying ? 'AUTO-ADVANCING' : 'READY'}</span>
              </div>
            </div>

            <div className="relative z-10 my-auto text-center space-y-3 py-4 px-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto">
                {activeChapter.id === 1 && <ShieldCheck className="w-8 h-8 text-amber-400" />}
                {activeChapter.id === 2 && <Globe className="w-8 h-8 text-blue-400" />}
                {activeChapter.id === 3 && <Zap className="w-8 h-8 text-emerald-400" />}
                {activeChapter.id === 4 && <HeartPulse className="w-8 h-8 text-red-400" />}
                {activeChapter.id === 5 && <RotateCcw className="w-8 h-8 text-amber-400" />}
                {activeChapter.id === 6 && <Award className="w-8 h-8 text-emerald-400" />}
              </div>

              <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
                {activeChapter.title}
              </h3>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-lg ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                } min-h-[44px]`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> {t.pauseDemoBtn}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> {t.playDemoBtn}
                  </>
                )}
              </button>

              <button
                onClick={handleExecuteVisualAction}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-extrabold flex items-center gap-2 border border-slate-700 transition min-h-[44px]"
              >
                <span>Open Related Training Module</span>
                <ExternalLink className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeChapterIndex === 0}
              aria-label={t.prevChapterBtn}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 transition flex items-center gap-2 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" /> {t.prevChapterBtn}
            </button>

            <button
              onClick={() =>
                setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1))
              }
              disabled={activeChapterIndex === chapters.length - 1}
              aria-label={t.nextChapterBtn}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition flex items-center gap-2 min-h-[44px]"
            >
              {t.nextChapterBtn} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chapter Training Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between min-h-[280px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-purple-300 uppercase tracking-wider">
                Module Summary ({voiceLang})
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-950 text-amber-300 text-xs font-mono font-extrabold border border-slate-800">
                Chapter {activeChapter.id}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-slate-100 text-sm md:text-base font-semibold leading-relaxed">
                {activeChapter.script.replace(/^"|"$/g, '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Chapter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chap, idx) => (
          <button
            key={chap.id}
            type="button"
            onClick={() => setActiveChapterIndex(idx)}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
              activeChapterIndex === idx
                ? 'bg-gradient-to-b from-purple-950/50 to-slate-900 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-purple-300 font-mono font-bold border border-slate-800">
                  Module {chap.id}
                </span>
                {activeChapterIndex === idx && (
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                )}
              </div>
              <h4 className="text-sm font-extrabold text-white">{chap.title}</h4>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-extrabold text-purple-300">
              <span>Select Module {chap.id}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
