import React, { useState, useEffect } from 'react';
import { Question, RemediationInfo } from '../types';
import { assessmentQuestions } from '../data/assessmentData';
import { VideoRemediationModal } from './VideoRemediationModal';
import { CheckCircle2, XCircle, Clock, Award, RotateCcw, AlertTriangle, Play, HelpCircle } from 'lucide-react';

export const AssessmentQuiz: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answersState, setAnswersState] = useState<{ [key: number]: { selected: string; correct: boolean } }>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Remediation Modal State
  const [isRemediationOpen, setIsRemediationOpen] = useState<boolean>(false);
  const [activeRemediation, setActiveRemediation] = useState<RemediationInfo | null>(null);
  const [modalQuestionText, setModalQuestionText] = useState<string>('');
  const [modalIncorrectChoice, setModalIncorrectChoice] = useState<string>('');
  const [modalCorrectChoice, setModalCorrectChoice] = useState<string>('');

  useEffect(() => {
    if (selectedTopic === 'All') {
      setFilteredQuestions(assessmentQuestions);
    } else {
      setFilteredQuestions(assessmentQuestions.filter(q => q.topic === selectedTopic));
    }
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswersState({});
    setScore(0);
    setTimerSeconds(60);
  }, [selectedTopic]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const currentQuestion = filteredQuestions[currentIndex];

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
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimerSeconds(60);
      setIsTimerRunning(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const prevAnswer = answersState[currentIndex - 1];
      setSelectedAnswer(prevAnswer ? prevAnswer.selected : null);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswersState({});
    setTimerSeconds(60);
    setIsTimerRunning(true);
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pos-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Award className="w-3.5 h-3.5" />
            60-Second Micro-Assessment Loop
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Forecourt OHS Competency Test</h2>
          <p className="text-slate-300 text-sm mt-1">Ingested from <code className="text-amber-300 font-mono">assessment_bank.json</code> with instant local video remediation.</p>
        </div>

        {/* Quiz Controls & Timer */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Clock className={`w-5 h-5 ${timerSeconds < 15 ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
            <span className="font-mono text-lg font-black text-white">{timerSeconds}s</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-extrabold">
            Score: {score} / {filteredQuestions.length}
          </div>

          <button
            onClick={resetQuiz}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset Quiz"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        {['All', 'Customer Service', 'Emergency Spill Response', 'Fire Safety', 'Evacuation'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              selectedTopic === t
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t} {t === 'All' ? '(40 Qs)' : '(10 Qs)'}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span className="px-3 py-1 rounded-md bg-slate-800 text-amber-300 border border-slate-700">
            {currentQuestion.topic}
          </span>
          <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
        </div>

        <h3 className="text-lg md:text-xl font-extrabold text-white leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-1 gap-3">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const optText = currentQuestion.options[optKey];
            const isSelected = selectedAnswer === optKey;
            const isCorrectAnswer = currentQuestion.correct_answer === optKey;
            const hasAnswered = selectedAnswer !== null;

            let btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800';
            if (hasAnswered) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-bold ring-1 ring-red-500';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={optKey}
                onClick={() => handleSelectAnswer(optKey)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 ${btnStyle}`}
              >
                <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 border ${
                  hasAnswered && isCorrectAnswer
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : hasAnswered && isSelected && !isCorrectAnswer
                    ? 'bg-red-500 text-white border-red-400'
                    : 'bg-slate-900 text-amber-400 border-slate-700'
                }`}>
                  {optKey}
                </span>

                <span className="text-sm pt-1 leading-relaxed flex-1">{optText}</span>

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
            <div className={`p-4 rounded-xl border text-xs space-y-1 ${
              selectedAnswer === currentQuestion.correct_answer
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-red-950/30 border-red-500/30 text-red-200'
            }`}>
              <strong className="block text-sm font-bold">
                {selectedAnswer === currentQuestion.correct_answer ? '✓ Excellent! Correct Answer.' : '❌ Incorrect.'}
              </strong>
              <p>{currentQuestion.explanation}</p>
            </div>

            {selectedAnswer !== currentQuestion.correct_answer && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-4">
                <div className="text-xs text-amber-200">
                  <strong className="text-amber-400 font-bold block mb-0.5">Video Remediation Available</strong>
                  <span>Watch the video clip at cue <strong>{currentQuestion.remediation.timestamp_start}</strong> to review this topic.</span>
                </div>

                <button
                  onClick={() => {
                    setActiveRemediation(currentQuestion.remediation);
                    setModalQuestionText(currentQuestion.question);
                    setModalIncorrectChoice(`${selectedAnswer}: ${currentQuestion.options[selectedAnswer as 'A'|'B'|'C'|'D']}`);
                    setModalCorrectChoice(`${currentQuestion.correct_answer}: ${currentQuestion.options[currentQuestion.correct_answer]}`);
                    setIsRemediationOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 flex-shrink-0 transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> Launch Video Clip
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
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition"
          >
            ← Previous Question
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-950/40 transition"
          >
            Next Question →
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
    </div>
  );
};
