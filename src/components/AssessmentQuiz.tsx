import React, { useState, useEffect } from 'react';
import { Question, RemediationInfo } from '../types';
import { assessmentQuestions } from '../data/assessmentData';
import { VideoRemediationModal } from './VideoRemediationModal';
import { AuditCertificateModal } from './AuditCertificateModal';
import { Language, translations } from '../data/translations';
import { SECONDS_PER_QUESTION, TIMEOUT_REVEAL_SECONDS } from '../lib/assessmentRules';
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
  ChevronLeft
} from 'lucide-react';

interface AssessmentQuizProps {
  lang: Language;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ lang }) => {
  const t = translations[lang];

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answersState, setAnswersState] = useState<{ [key: number]: { selected: string; correct: boolean } }>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(SECONDS_PER_QUESTION);

  // Remediation Modal State
  const [isRemediationOpen, setIsRemediationOpen] = useState<boolean>(false);
  const [activeRemediation, setActiveRemediation] = useState<RemediationInfo | null>(null);
  const [modalQuestionText, setModalQuestionText] = useState<string>('');
  const [modalIncorrectChoice, setModalIncorrectChoice] = useState<string>('');
  const [modalCorrectChoice, setModalCorrectChoice] = useState<string>('');

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const list = selectedTopic === 'All'
      ? assessmentQuestions
      : assessmentQuestions.filter(q => q.topic === selectedTopic);
    setFilteredQuestions(list);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswersState({});
    setScore(0);
    setTimerSeconds(SECONDS_PER_QUESTION);
  }, [selectedTopic]);

  const currentQuestion = filteredQuestions[currentIndex];
  const totalQuestions = filteredQuestions.length;

  // Move to a question. Restores its earlier answer, or starts a fresh 60s timer.
  const goTo = (index: number) => {
    setCurrentIndex(index);
    const previous = answersState[index];
    setSelectedAnswer(previous ? previous.selected : null);
    setTimerSeconds(SECONDS_PER_QUESTION);
  };

  // Per-question countdown. It stops as soon as the question is answered.
  useEffect(() => {
    if (!currentQuestion || selectedAnswer !== null) return;
    if (timerSeconds <= 0) {
      // Time ran out: lock the question as incorrect.
      setSelectedAnswer('TIMEOUT');
      setAnswersState(prev => ({ ...prev, [currentIndex]: { selected: 'TIMEOUT', correct: false } }));
      return;
    }
    const id = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timerSeconds, selectedAnswer, currentIndex, currentQuestion]);

  // After a timeout, show the correct answer briefly, then move on (not after the last question).
  useEffect(() => {
    if (selectedAnswer !== 'TIMEOUT') return;
    if (currentIndex >= totalQuestions - 1) return;
    const id = setTimeout(() => goTo(currentIndex + 1), TIMEOUT_REVEAL_SECONDS * 1000);
    return () => clearTimeout(id);
  }, [selectedAnswer, currentIndex, totalQuestions]);

  const handleSelectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (selectedAnswer !== null) return; // prevent double clicks

    setSelectedAnswer(optionKey);
    const isCorrect = optionKey === currentQuestion.correct_answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswersState(prev => ({
      ...prev,
      [currentIndex]: { selected: optionKey, correct: isCorrect }
    }));

    // If incorrect, trigger remediation modal!
    if (!isCorrect) {
      setActiveRemediation(currentQuestion.remediation);
      setModalQuestionText(currentQuestion.question);
      setModalIncorrectChoice(`${optionKey}: ${currentQuestion.options[optionKey]}`);
      setModalCorrectChoice(`${currentQuestion.correct_answer}: ${currentQuestion.options[currentQuestion.correct_answer]}`);
      setIsRemediationOpen(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) goTo(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswersState({});
    setTimerSeconds(SECONDS_PER_QUESTION);
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pos-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/90 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider mb-2 border border-amber-500/30">
            <Award className="w-4 h-4" />
            60 seconds per question • SANS 10089
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{t.quizTitle}</h2>
          <p className="text-slate-300 text-sm mt-1">{t.quizSubtitle}</p>
        </div>

        {/* Quiz Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <Clock className={`w-5 h-5 ${timerSeconds < 15 ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
            <span className="font-mono text-xl font-black text-white">{timerSeconds}s</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black">
            Score: {score} / {filteredQuestions.length}
          </div>

          <button
            onClick={() => setIsCertModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition border border-emerald-400/30 min-h-[44px]"
          >
            <FileCheck className="w-4 h-4" /> {t.hitlSignoffBtn}
          </button>

          <button
            onClick={resetQuiz}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition min-h-[44px] min-w-[44px]"
            title={t.resetQuiz}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
        {['All', 'Customer Service', 'Emergency Spill Response', 'Fire Safety', 'Evacuation'].map((topicName) => (
          <button
            key={topicName}
            onClick={() => setSelectedTopic(topicName)}
            className={`px-4 py-3 rounded-xl text-xs font-black transition-all min-h-[44px] ${
              selectedTopic === topicName
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {topicName} ({topicName === 'All'
              ? assessmentQuestions.length
              : assessmentQuestions.filter(q => q.topic === topicName).length} Qs)
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center text-xs font-extrabold text-slate-400">
          <span className="px-3 py-1 rounded-lg bg-slate-950 text-amber-400 border border-slate-800 uppercase tracking-wider">
            {currentQuestion.topic}
          </span>
          <span className="font-mono text-slate-300">Question {currentIndex + 1} of {filteredQuestions.length}</span>
        </div>

        <h3 className="text-lg md:text-xl font-extrabold text-white leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* 4 Multiple Choice Options (Touch-First Minimum 48px Height) */}
        <div className="grid grid-cols-1 gap-3.5">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const optText = currentQuestion.options[optKey];
            const isSelected = selectedAnswer === optKey;
            const isCorrectAnswer = currentQuestion.correct_answer === optKey;
            const hasAnswered = selectedAnswer !== null;

            let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-amber-500/60 hover:bg-slate-800/80';
            if (hasAnswered) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/40';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-red-950/70 border-red-500 text-red-200 font-bold ring-2 ring-red-500/40';
              } else {
                btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-50';
              }
            }

            return (
              <button
                key={optKey}
                onClick={() => handleSelectAnswer(optKey)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-4 min-h-[56px] ${btnStyle}`}
              >
                <span className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 border ${
                  hasAnswered && isCorrectAnswer
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : hasAnswered && isSelected && !isCorrectAnswer
                    ? 'bg-red-500 text-white border-red-400'
                    : 'bg-slate-900 text-amber-400 border-slate-700'
                }`}>
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
        {selectedAnswer !== null && (
          <div className="space-y-3 pt-4 border-t border-slate-800 animate-fadeIn">
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              selectedAnswer === currentQuestion.correct_answer
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}>
              <strong className="block text-sm font-extrabold flex items-center gap-2">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.correctAnswer}</>
                ) : (
                  <><ShieldAlert className="w-4 h-4 text-red-400" /> {t.incorrectAnswer}</>
                )}
              </strong>
              {selectedAnswer === 'TIMEOUT' && (
                <p className="font-bold">Time ran out. This question counts as incorrect.</p>
              )}
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>

            {selectedAnswer !== currentQuestion.correct_answer && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-amber-200">
                  <strong className="text-amber-400 font-extrabold block mb-0.5">{t.remediationAvailable}</strong>
                  <span>Watch the video clip at cue <strong>{currentQuestion.remediation.timestamp_start}</strong> to review this topic.</span>
                </div>

                <button
                  onClick={() => {
                    setActiveRemediation(currentQuestion.remediation);
                    setModalQuestionText(currentQuestion.question);
                    setModalIncorrectChoice(
                      selectedAnswer === 'TIMEOUT'
                        ? 'No answer (time ran out)'
                        : `${selectedAnswer}: ${currentQuestion.options[selectedAnswer as 'A'|'B'|'C'|'D']}`
                    );
                    setModalCorrectChoice(`${currentQuestion.correct_answer}: ${currentQuestion.options[currentQuestion.correct_answer]}`);
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

        {/* Navigation Buttons (Touch-First min 48px Height) */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition flex items-center gap-2 min-h-[48px]"
          >
            <ChevronLeft className="w-4 h-4" /> {t.prevQuestion}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-950/40 transition flex items-center gap-2 min-h-[48px]"
          >
            {t.nextQuestion} <ChevronRight className="w-4 h-4" />
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
      />
    </div>
  );
};
