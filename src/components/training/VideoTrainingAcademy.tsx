import React, { useState, useEffect, useCallback } from 'react';
import {
  Video,
  CheckCircle2,
  Lock,
  Award,
  Globe,
  Play,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../data/translations';
import {
  LANGUAGE_LABELS,
  SupportedLanguageCode,
  toAppLanguage,
  toSupportedLanguageCode,
} from '../../nelly-localization-engine';
import { AssessmentQuiz } from '../AssessmentQuiz';
import { AuditCertificateModal } from '../AuditCertificateModal';
import { PASS_MARK, getLatestQuizAttempt } from '../../lib/certificateStore';
import {
  TRAINING_3D_MODULES,
  EXECUTIVE_DEMO_TOUR_SEQUENCE,
  Training3DModuleId,
} from './training3DModulesData';
import { Forecourt3DPlayer } from './Forecourt3DPlayer';

const VIDEO_PROGRESS_STORAGE_KEY = 'forecourt_video_watch_progress_v1';

interface ModuleCompletionRecord {
  completedSteps: number[];
  percentComplete: number;
}

interface VideoTrainingAcademyProps {
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
  autoStartExecutiveTour?: boolean;
  onExecutiveTourConsumed?: () => void;
}

export const VideoTrainingAcademy: React.FC<VideoTrainingAcademyProps> = ({
  lang,
  onLanguageChange,
  autoStartExecutiveTour = false,
  onExecutiveTourConsumed,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<Training3DModuleId>(
    TRAINING_3D_MODULES[0].id
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [subtitleLang, setSubtitleLang] = useState<SupportedLanguageCode>(
    toSupportedLanguageCode(lang)
  );
  const [progressMap, setProgressMap] = useState<Record<string, ModuleCompletionRecord>>({});
  const [showQuizPanel, setShowQuizPanel] = useState<boolean>(false);
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);
  const [skipWarning, setSkipWarning] = useState<string>('');

  // Executive Demo 90-second Auto-Tour state
  const [isExecutiveTour, setIsExecutiveTour] = useState<boolean>(false);
  const [tourIndex, setTourIndex] = useState<number>(0);

  useEffect(() => {
    setSubtitleLang(toSupportedLanguageCode(lang));
  }, [lang]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VIDEO_PROGRESS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setProgressMap(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const launchExecutiveTour = useCallback(() => {
    setShowQuizPanel(false);
    setIsExecutiveTour(true);
    setTourIndex(0);
    const first = EXECUTIVE_DEMO_TOUR_SEQUENCE[0];
    setSelectedModuleId(first.moduleId);
    setStepIndex(first.stepIndex);
    setIsPlaying(true);
    setSkipWarning('');
  }, []);

  useEffect(() => {
    if (autoStartExecutiveTour) {
      launchExecutiveTour();
      onExecutiveTourConsumed?.();
    }
  }, [autoStartExecutiveTour, launchExecutiveTour, onExecutiveTourConsumed]);

  // Executive Tour 90s auto-sequencer
  useEffect(() => {
    if (!isExecutiveTour) return;
    const stop = EXECUTIVE_DEMO_TOUR_SEQUENCE[tourIndex];
    if (!stop) return;
    const timer = setTimeout(() => {
      if (tourIndex < EXECUTIVE_DEMO_TOUR_SEQUENCE.length - 1) {
        const nextIdx = tourIndex + 1;
        const nextStop = EXECUTIVE_DEMO_TOUR_SEQUENCE[nextIdx];
        setTourIndex(nextIdx);
        setSelectedModuleId(nextStop.moduleId);
        setStepIndex(nextStop.stepIndex);
      } else {
        setIsExecutiveTour(false);
        setIsPlaying(false);
      }
    }, stop.durationSeconds * 1000);
    return () => clearTimeout(timer);
  }, [isExecutiveTour, tourIndex]);

  const activeModule =
    TRAINING_3D_MODULES.find((m) => m.id === selectedModuleId) || TRAINING_3D_MODULES[0];

  const currentProgress: ModuleCompletionRecord = progressMap[activeModule.id] || {
    completedSteps: [],
    percentComplete: 0,
  };

  // Preserve ?mockVideoWatch=95 URL override for deterministic E2E audit verification
  const urlWatchOverride =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mockVideoWatch')
      ? Math.min(
          100,
          Math.max(0, Number(new URLSearchParams(window.location.search).get('mockVideoWatch')))
        )
      : null;

  const effectivePercent =
    urlWatchOverride !== null
      ? Math.max(urlWatchOverride, currentProgress.percentComplete)
      : currentProgress.percentComplete;

  const latestAttempt = getLatestQuizAttempt();
  const quizPercentage =
    latestAttempt.totalQuestions > 0
      ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100)
      : 0;
  const isVideoGateMet = effectivePercent >= 90;
  const isQuizGateMet = quizPercentage >= PASS_MARK && latestAttempt.score > 0;
  const canIssueCertificate = isVideoGateMet && isQuizGateMet;

  const persistProgress = useCallback((next: Record<string, ModuleCompletionRecord>) => {
    setProgressMap(next);
    try {
      localStorage.setItem(VIDEO_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const handleStepCompleted = useCallback(
    (stepNumber: number) => {
      const prev = progressMap[activeModule.id] || {
        completedSteps: [],
        percentComplete: 0,
      };
      if (!prev.completedSteps.includes(stepNumber)) {
        const nextSteps = [...prev.completedSteps, stepNumber];
        const pct = Math.min(100, Math.round((nextSteps.length / activeModule.steps.length) * 100));
        persistProgress({
          ...progressMap,
          [activeModule.id]: {
            completedSteps: nextSteps,
            percentComplete: pct,
          },
        });
      }
    },
    [activeModule.id, activeModule.steps.length, progressMap, persistProgress]
  );

  // Anti-skip step transition guard
  const handleStepChange = (nextIdx: number) => {
    const targetStepNum = activeModule.steps[nextIdx]?.stepNumber ?? 1;
    const prevRecord = progressMap[activeModule.id] || { completedSteps: [], percentComplete: 0 };
    if (
      !isExecutiveTour &&
      nextIdx > stepIndex + 1 &&
      !prevRecord.completedSteps.includes(targetStepNum)
    ) {
      setSkipWarning(
        'Anti-skip guard active: jumping ahead skips statutory steps and will not unlock the 90% completion gate.'
      );
    } else {
      setSkipWarning('');
    }
    setStepIndex(nextIdx);
  };

  const handleSubtitleLanguagePick = (code: SupportedLanguageCode) => {
    setSubtitleLang(code);
    onLanguageChange?.(toAppLanguage(code));
  };

  const tourTotalSeconds = EXECUTIVE_DEMO_TOUR_SEQUENCE.reduce((s, x) => s + x.durationSeconds, 0);
  const tourElapsedSeconds = EXECUTIVE_DEMO_TOUR_SEQUENCE.slice(0, tourIndex).reduce(
    (s, x) => s + x.durationSeconds,
    0
  );
  const tourProgressPercent = Math.round(((tourIndex + 1) / EXECUTIVE_DEMO_TOUR_SEQUENCE.length) * 100);
  const tourSecondsRemaining = Math.max(0, tourTotalSeconds - tourElapsedSeconds);
  const activeTourStop = EXECUTIVE_DEMO_TOUR_SEQUENCE[tourIndex];

  return (
    <div
      className="space-y-5 text-slate-100 w-full max-w-full overflow-x-hidden"
      data-testid="video-training-academy"
    >
      {/* Academy Banner */}
      <div className="p-5 sm:p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/50 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase border border-amber-500/40 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              Basic Forecourt Safety &amp; OHS Awareness Training
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              3D Interactive WebGL • OHS Act 85 of 1993 &amp; R638
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            3D Interactive Forecourt Training &amp; Executive Demo Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Complete <strong>≥ 90%</strong> of the interactive 3D module steps AND pass the timed statutory quiz (<strong>≥ {PASS_MARK}%</strong>) to unlock a SHA-256 stamped completion certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={launchExecutiveTour}
            data-testid="launch-executive-3d-tour-btn"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Full Executive Demo Tour</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsExecutiveTour(false);
              setShowQuizPanel(!showQuizPanel);
            }}
            data-testid="academy-toggle-quiz-btn"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>{showQuizPanel ? 'Back to 3D Training' : 'Open Timed Statutory Quiz'}</span>
          </button>

          <button
            type="button"
            disabled={!canIssueCertificate}
            onClick={() => setIsCertOpen(true)}
            data-testid="academy-issue-cert-btn"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-xs flex items-center gap-1.5 transition border border-emerald-400/30"
          >
            {canIssueCertificate ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>Issue SHA-256 Certificate</span>
          </button>
        </div>
      </div>

      {/* Compliance Gate Status Bar */}
      <div
        data-testid="video-gate-status"
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
      >
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex justify-between font-bold">
            <span className="text-slate-300">Gate 1: 3D Module Completion (≥ 90%)</span>
            <span
              data-testid="video-watch-percent"
              className={isVideoGateMet ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}
            >
              {effectivePercent}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all ${isVideoGateMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${effectivePercent}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex justify-between font-bold">
            <span className="text-slate-300">Gate 2: Timed Statutory Quiz (≥ {PASS_MARK}%)</span>
            <span className={isQuizGateMet ? 'text-emerald-400 font-mono' : 'text-slate-400 font-mono'}>
              {latestAttempt.score}/{latestAttempt.totalQuestions} ({quizPercentage}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {isQuizGateMet ? '✓ Quiz pass mark achieved' : 'Complete the timed assessment below'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-300">Certificate Issuance Gate</div>
            <div className={`text-[11px] font-black mt-0.5 ${canIssueCertificate ? 'text-emerald-400' : 'text-rose-400'}`}>
              {canIssueCertificate
                ? 'UNLOCKED — Ready for SHA-256 Sign-Off'
                : 'LOCKED — Complete ≥90% 3D Module + ≥80% Quiz'}
            </div>
          </div>
          {canIssueCertificate ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <Lock className="w-6 h-6 text-rose-400" />
          )}
        </div>
      </div>

      {!showQuizPanel ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 6-Module Playlist */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                6 Interactive 3D Modules
              </h3>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <Globe className="w-3.5 h-3.5 text-amber-400 ml-1" />
                {(['en', 'zu', 'xh', 'af', 'st', 'sw'] as SupportedLanguageCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSubtitleLanguagePick(code)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      subtitleLang === code
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title={LANGUAGE_LABELS[code].native}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {TRAINING_3D_MODULES.map((mod) => {
              const isSelected = mod.id === activeModule.id;
              const rec = progressMap[mod.id];
              const pct = rec?.percentComplete ?? 0;
              return (
                <button
                  key={mod.id}
                  type="button"
                  data-testid={`academy-module-btn-${mod.id}`}
                  onClick={() => {
                    setIsExecutiveTour(false);
                    setIsPlaying(false);
                    setSelectedModuleId(mod.id);
                    setStepIndex(0);
                    setSkipWarning('');
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start justify-between gap-2 min-h-[44px] ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-black text-white">{mod.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{mod.statutoryRef}</div>
                    <div className="text-[10px] font-mono text-cyan-300">
                      {mod.steps.length} Interactive Steps • Completed {pct}%
                    </div>
                  </div>
                  <Play
                    className={`w-4 h-4 flex-shrink-0 mt-1 ${
                      isSelected ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* 3D Interactive Player */}
          <div className="lg:col-span-8 space-y-3 min-w-0">
            <Forecourt3DPlayer
              moduleId={activeModule.id}
              stepIndex={stepIndex}
              onStepChange={handleStepChange}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              subtitleLang={subtitleLang}
              isExecutiveTour={isExecutiveTour}
              tourProgressPercent={tourProgressPercent}
              tourSecondsRemaining={tourSecondsRemaining}
              tourTelemetryHighlight={activeTourStop?.telemetryHighlight}
              onExitTour={() => {
                setIsExecutiveTour(false);
                setIsPlaying(false);
              }}
              onStepCompleted={handleStepCompleted}
            />

            {skipWarning && (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 font-bold">
                {skipWarning}
              </div>
            )}
          </div>
        </div>
      ) : (
        <AssessmentQuiz lang={lang} />
      )}

      <AuditCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        lang={lang}
        moduleName={`Basic Forecourt Safety & OHS Awareness Training (${activeModule.category})`}
      />
    </div>
  );
};
