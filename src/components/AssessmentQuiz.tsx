import React, { useState, useEffect } from 'react';
import { Question, RemediationInfo } from '../types';
import { assessmentQuestions } from '../data/assessmentData';
import { VideoRemediationModal } from './VideoRemediationModal';
import { AuditCertificateModal } from './AuditCertificateModal';
import { PASS_MARK, saveLatestQuizAttempt } from '../lib/certificateStore';
import { Language, translations } from '../data/translations';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  Play,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
} from 'lucide-react';

export const PER_QUESTION_SECONDS = 60;

interface AnswerRecord {
  selected: 'A' | 'B' | 'C' | 'D' | 'TIMEOUT';
  correct: boolean;
  timedOut?: boolean;
}

interface AssessmentQuizProps {
  lang: Language;
  initialTimeSeconds?: number;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  lang,
  initialTimeSeconds,
}) => {
  const resolvedInitialSeconds =
    initialTimeSeconds ??
    (typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('quizTimer')
      ? Math.max(1, Number(new URLSearchParams(window.location.search).get('quizTimer')))
      : PER_QUESTION_SECONDS);
  const t = translations[lang];

  const initialMockScore =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mockScore')
      ? Math.max(0, Number(new URLSearchParams(window.location.search).get('mockScore')))
      : 0;

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(assessmentQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(initialMockScore);
  const [answersState, setAnswersState] = useState<{ [key: number]: AnswerRecord }>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(resolvedInitialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Remediation Modal State
  const [isRemediationOpen, setIsRemediationOpen] = useState<boolean>(false);
  const [activeRemediation, setActiveRemediation] = useState<RemediationInfo | null>(null);
  const [modalQuestionText, setModalQuestionText] = useState<string>('');
  const [modalIncorrectChoice, setModalIncorrectChoice] = useState<string>('');
  const [modalCorrectChoice, setModalCorrectChoice] = useState<string>('');

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  // Single source of truth for topic counts
  const getTopicQuestionCount = (topicName: string): number => {
    if (topicName === 'All') return assessmentQuestions.length;
    return assessmentQuestions.filter((q) => q.topic === topicName).length;
  };

  useEffect(() => {
    const nextList =
      selectedTopic === 'All'
        ? assessmentQuestions
        : assessmentQuestions.filter((q) => q.topic === selectedTopic);
    setFilteredQuestions(nextList);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswersState({});
    setScore(initialMockScore);
    setTimerSeconds(resolvedInitialSeconds);
    setIsTimerRunning(true);
    setIsQuizFinished(false);
  }, [selectedTopic, resolvedInitialSeconds, initialMockScore]);

  const answeredCount = Object.keys(answersState).length;

  // Persist latest quiz attempt snapshot for certificate modal
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      saveLatestQuizAttempt({
        score,
        totalQuestions: filteredQuestions.length,
        answeredCount,
        moduleName: `Forecourt OHS Competency (${selectedTopic})`,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [score, filteredQuestions.length, answeredCount, selectedTopic]);

  // Stop timer if all questions are answered/locked
  useEffect(() => {
    if (filteredQuestions.length > 0 && answeredCount >= filteredQuestions.length) {
      setIsQuizFinished(true);
      setIsTimerRunning(false);
    }
  }, [answeredCount, filteredQuestions.length]);

  // Per-question timer countdown & lock enforcement at 0s
  useEffect(() => {
    if (!isTimerRunning || isQuizFinished) return;

    if (timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    } else if (timerSeconds === 0) {
      // Enforce timeout rule: lock current question and record as unanswered
      setIsTimerRunning(false);
      if (selectedAnswer === null && !answersState[currentIndex]) {
        setSelectedAnswer('TIMEOUT');
        setAnswersState((prev) => ({
          ...prev,
          [currentIndex]: {
            selected: 'TIMEOUT',
            correct: false,
            timedOut: true,
          },
        }));
      }
    }
  }, [isTimerRunning, timerSeconds, isQuizFinished, selectedAnswer, currentIndex, answersState]);

  const currentQuestion = filteredQuestions[currentIndex];
  const currentRecord = answersState[currentIndex];
  const isCurrentTimedOut = Boolean(currentRecord?.timedOut || selectedAnswer === 'TIMEOUT');
  const isCurrentLocked = selectedAnswer !== null || Boolean(currentRecord);

  const handleSelectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isCurrentLocked || isQuizFinished) return;

    // Stop per-question timer immediately once answered
    setIsTimerRunning(false);
    setSelectedAnswer(optionKey);
    const isCorrect = optionKey === currentQuestion.correct_answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersState((prev) => ({
      ...prev,
      [currentIndex]: { selected: optionKey, correct: isCorrect, timedOut: false },
    }));

    // If incorrect, trigger remediation modal
    if (!isCorrect) {
      setActiveRemediation(currentQuestion.remediation);
      setModalQuestionText(currentQuestion.question);
      setModalIncorrectChoice(`${optionKey}: ${currentQuestion.options[optionKey]}`);
      setModalCorrectChoice(
        `${currentQuestion.correct_answer}: ${currentQuestion.options[currentQuestion.correct_answer]}`
      );
      setIsRemediationOpen(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const existingNext = answersState[nextIdx];
      if (existingNext) {
        setSelectedAnswer(existingNext.selected);
        setIsTimerRunning(false);
      } else {
        setSelectedAnswer(null);
        setTimerSeconds(resolvedInitialSeconds);
        setIsTimerRunning(true);
      }
    } else {
      setIsQuizFinished(true);
      setIsTimerRunning(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      const prevAnswer = answersState[prevIdx];
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.selected);
        setIsTimerRunning(false);
      } else {
        setSelectedAnswer(null);
        setTimerSeconds(resolvedInitialSeconds);
        setIsTimerRunning(true);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswersState({});
    setTimerSeconds(resolvedInitialSeconds);
    setIsTimerRunning(true);
    setIsQuizFinished(false);
  };

  if (!currentQuestion) return null;

  const percentage =
    filteredQuestions.length > 0 ? Math.round((score / filteredQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pos-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/90 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-500/30">
            <Award className="w-4 h-4" />
            {resolvedInitialSeconds}s Per-Question Assessment • SANS 10089 ({assessmentQuestions.length} Total Questions)
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t.quizTitle.replace(/\(\d+\s*[^)]*\)/, `(${filteredQuestions.length} Questions)`)}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {t.quizSubtitle} • Pass Mark: {PASS_MARK}%
          </p>
        </div>

        {/* Quiz Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div
            data-testid="quiz-timer-box"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 border ${
              timerSeconds === 0
                ? 'border-red-500 text-red-400'
                : timerSeconds < 15
                ? 'border-amber-500 text-amber-300'
                : 'border-slate-800 text-white'
            }`}
          >
            <Clock className={`w-5 h-5 ${timerSeconds < 15 && timerSeconds > 0 ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black leading-none" data-testid="quiz-timer-value">
                {timerSeconds}s
              </span>
              <span className="text-[10px] text-slate-300 font-semibold">
                {isQuizFinished ? 'Finished' : isCurrentTimedOut ? 'Locked (Timeout)' : 'Per Question'}
              </span>
            </div>
          </div>

          <div
            data-testid="quiz-score-counter"
            className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-black"
          >
            Score: {score} / {filteredQuestions.length} ({percentage}%)
          </div>

          <button
            onClick={() => setIsCertModalOpen(true)}
            aria-label={t.hitlSignoffBtn}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition border border-emerald-400/30 min-h-[44px]"
          >
            <FileCheck className="w-4 h-4" /> {t.hitlSignoffBtn}
          </button>

          <button
            onClick={resetQuiz}
            aria-label={t.resetQuiz}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition min-h-[44px] min-w-[44px]"
            title={t.resetQuiz}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Topic Filter Tabs (Single source of truth for counts) */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800" role="tablist" aria-label="Quiz Topic Filters">
        {['All', 'Customer Service', 'Emergency Spill Response', 'Fire Safety', 'Evacuation'].map((topicName) => {
          const count = getTopicQuestionCount(topicName);
          return (
            <button
              key={topicName}
              role="tab"
              aria-selected={selectedTopic === topicName}
              onClick={() => setSelectedTopic(topicName)}
              className={`px-4 py-3 rounded-xl text-xs font-black transition-all min-h-[44px] ${
                selectedTopic === topicName
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {topicName} ({count} Qs)
            </button>
          );
        })}
      </div>

      {/* Quiz Finished Summary Banner */}
      {isQuizFinished && (
        <div
          data-testid="quiz-finished-banner"
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            percentage >= PASS_MARK
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/50 border-red-500/50 text-red-200'
          }`}
        >
          <div>
            <h3 className="text-base font-black text-white">
              Assessment Attempt Complete — Score: {score} / {filteredQuestions.length} ({percentage}%)
            </h3>
            <p className="text-xs text-slate-200 mt-1">
              {percentage >= PASS_MARK
                ? `Passed (meets ${PASS_MARK}% threshold). You may now generate your OHS Compliance Certificate.`
                : `Not yet certified: score ${score}/${filteredQuestions.length}, pass mark ${PASS_MARK}%. Review remediation clips and retry.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
            >
              View Certification Status
            </button>
            <button
              onClick={resetQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Retry Quiz
            </button>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center text-xs font-extrabold text-slate-300">
          <span className="px-3 py-1 rounded-lg bg-slate-950 text-amber-400 border border-slate-800 uppercase tracking-wider">
            {currentQuestion.topic}
          </span>
          <span className="font-mono text-slate-200" data-testid="quiz-question-counter">
            Question {currentIndex + 1} of {filteredQuestions.length}
          </span>
        </div>

        {/* Timeout Lock Alert Banner */}
        {isCurrentTimedOut && (
          <div
            role="alert"
            data-testid="quiz-timeout-alert"
            className="p-4 rounded-2xl bg-red-950/60 border border-red-500 text-red-200 text-sm font-bold flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>
                Time Expired (0s): Question locked and recorded as unanswered. Proceed to the next question or reset the assessment.
              </span>
            </div>
            {currentIndex < filteredQuestions.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-black whitespace-nowrap"
              >
                Next Question →
              </button>
            )}
          </div>
        )}

        <h3 className="text-lg md:text-xl font-extrabold text-white leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-1 gap-3.5">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const optText = currentQuestion.options[optKey];
            const isSelected = selectedAnswer === optKey;
            const isCorrectAnswer = currentQuestion.correct_answer === optKey;
            const hasAnswered = isCurrentLocked;

            let btnStyle =
              'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-amber-500/60 hover:bg-slate-800/80';
            if (hasAnswered) {
              if (isCorrectAnswer) {
                btnStyle =
                  'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle =
                  'bg-red-950/70 border-red-500 text-red-200 font-bold ring-2 ring-red-500/40';
              } else {
                btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={optKey}
                onClick={() => handleSelectAnswer(optKey)}
                disabled={hasAnswered}
                data-testid={`quiz-option-${optKey}`}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-4 min-h-[56px] ${btnStyle}`}
              >
                <span
                  className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 border ${
                    hasAnswered && isCorrectAnswer
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : hasAnswered && isSelected && !isCorrectAnswer
                      ? 'bg-red-500 text-white border-red-400'
                      : 'bg-slate-900 text-amber-400 border-slate-700'
                  }`}
                >
                  {optKey}
                </span>

                <span className="text-sm pt-1 leading-relaxed flex-1 font-semibold">{optText}</span>

                {hasAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                {hasAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Remediation Callout when Answered */}
        {isCurrentLocked && (
          <div className="space-y-3 pt-4 border-t border-slate-800 animate-fadeIn">
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                selectedAnswer === currentQuestion.correct_answer
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}
            >
              <strong className="block text-sm font-extrabold flex items-center gap-2">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.correctAnswer}
                  </>
                ) : isCurrentTimedOut ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400" /> Time Expired — Recorded as Unanswered
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400" /> {t.incorrectAnswer}
                  </>
                )}
              </strong>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            {selectedAnswer !== currentQuestion.correct_answer && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-amber-200">
                  <strong className="text-amber-400 font-extrabold block mb-0.5">
                    {t.remediationAvailable}
                  </strong>
                  <span>
                    Watch the video clip at cue <strong>{currentQuestion.remediation.timestamp_start}</strong> to review this topic.
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActiveRemediation(currentQuestion.remediation);
                    setModalQuestionText(currentQuestion.question);
                    setModalIncorrectChoice(
                      isCurrentTimedOut
                        ? 'Unanswered (Timed out at 0s)'
                        : `${selectedAnswer}: ${currentQuestion.options[selectedAnswer as 'A' | 'B' | 'C' | 'D']}`
                    );
                    setModalCorrectChoice(
                      `${currentQuestion.correct_answer}: ${currentQuestion.options[currentQuestion.correct_answer]}`
                    );
                    setIsRemediationOpen(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 flex-shrink-0 transition shadow-lg shadow-amber-950/50 min-h-[44px]"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> {t.launchVideo}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label={t.prevQuestion}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition flex items-center gap-2 min-h-[48px]"
          >
            <ChevronLeft className="w-4 h-4" /> {t.prevQuestion}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredQuestions.length - 1 && isQuizFinished}
            aria-label={t.nextQuestion}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-950/40 transition flex items-center gap-2 min-h-[48px]"
          >
            {currentIndex === filteredQuestions.length - 1 ? 'Finish Assessment' : t.nextQuestion}{' '}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Remediation Modal */}
      <VideoRemediationModal
        isOpen={isRemediationOpen}
        onClose={() => setIsRemediationOpen(false)}
        remediation={activeRemediation}
        questionText={modalQuestionText}
        incorrectChoice={modalIncorrectChoice}
        correctChoice={modalCorrectChoice}
      />

      {/* HITL Audit Certificate Modal */}
      <AuditCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        lang={lang}
        score={score}
        totalQuestions={filteredQuestions.length}
        answeredCount={answeredCount}
        moduleName={`Forecourt OHS Competency (${selectedTopic})`}
      />
    </div>
  );
};
