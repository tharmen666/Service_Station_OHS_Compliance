import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Flame,
  Zap,
  Activity,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface RefresherLog {
  id: string;
  candidateName: string;
  role: string;
  score: number;
  total: number;
  date: string;
  status: 'PASSED' | 'FAILED';
}

interface MonthlyRefresherHubProps {
  lang?: Language;
  onOpenDossier?: () => void;
}

export const MonthlyRefresherHub: React.FC<MonthlyRefresherHubProps> = ({ 
  lang = 'EN',
  onOpenDossier
}) => {
  const t = translations[lang];

  // Case Study Selector
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<number>(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [refresherLogs, setRefresherLogs] = useState<RefresherLog[]>([
    { id: 'LOG-101', candidateName: 'Melly Tharmen', role: 'Senior Attendant', score: 5, total: 5, date: '2026-08-01', status: 'PASSED' },
    { id: 'LOG-102', candidateName: 'Sipho Ndlovu', role: 'Cashier Supervisor', score: 4, total: 5, date: '2026-08-03', status: 'PASSED' },
    { id: 'LOG-103', candidateName: 'Pieter van Zyl', role: 'Nightshift Attendant', score: 5, total: 5, date: '2026-08-06', status: 'PASSED' }
  ]);

  const caseStudies = [
    {
      id: 1,
      title: 'Case Study 1: Forecourt Static Ignition Shock',
      scenario: 'A motorist re-entered their vehicle while dispensing fuel during dry, low-humidity conditions. Upon re-approaching the nozzle, a static spark ignited fuel vapors at the filler neck.',
      rootCause: 'Static electricity buildup on clothing transferred to nozzle metal tip.',
      prevention: 'Touch vehicle metal body far from nozzle before touching pump handle. Never re-enter vehicle while fuel flows.',
      icon: Zap,
      badge: 'HIGH RISK • STATIC HAZARD'
    },
    {
      id: 2,
      title: 'Case Study 2: Nightshift First Aid & Burn Triage',
      scenario: 'At 02:30 AM, an attendant suffered a hot radiator fluid splash while helping a stranded motorist check coolant levels.',
      rootCause: 'Opening pressurized radiator cap when engine was overheated.',
      prevention: 'Never open hot radiator caps. Don PPE gloves, apply cold clean water for 20 minutes, call 10177 immediately.',
      icon: Activity,
      badge: 'NIGHTSHIFT • MEDICAL PROTOCOL'
    },
    {
      id: 3,
      title: 'Case Study 3: Overfill Drain Spill Containment',
      scenario: 'A tanker delivery hose coupler leaked 50 Liters of diesel near the forecourt storm drain during peak rush hour.',
      rootCause: 'Failure to position drain seal mat prior to starting fuel discharge.',
      prevention: 'Deploy rubber drain cover BEFORE coupling delivery hose. Position 4-role spill response team immediately.',
      icon: Flame,
      badge: 'SANS 10263 • DRAIN HAZMAT'
    }
  ];

  const refresherQuestions = [
    {
      q: '1. How should a forecourt attendant prevent static ignition when a customer re-enters their vehicle during refueling?',
      options: {
        A: 'Instruct customer to touch the metal vehicle chassis away from nozzle before gripping pump handle.',
        B: 'Increase nozzle dispensing speed to maximum.',
        C: 'Spray water directly onto the vehicle tires.',
        D: 'Ignore it if fuel is diesel.'
      },
      ans: 'A',
      explanation: 'Touching metal dissipates static charge safely away from volatile fuel vapors.'
    },
    {
      q: '2. Under SANS 10089-3, what is the FIRST action when 50L of fuel spills near a storm drain?',
      options: {
        A: 'Hose the fuel directly down the storm drain with water.',
        B: 'Seal the storm drain immediately with a rubber drain mat or absorbent boom.',
        C: 'Wait for the tanker driver to complete offloading.',
        D: 'Evacuate only the cashier booth.'
      },
      ans: 'B',
      explanation: 'Protecting storm drains prevents severe municipal environmental contamination and explosive sewer vapor locks.'
    },
    {
      q: '3. What is the mandatory PPE requirement before providing first aid to a bleeding victim on the forecourt?',
      options: {
        A: 'Reflective high-visibility vest only.',
        B: 'Nitrile disposable medical gloves.',
        C: 'Safety boots only.',
        D: 'Face shield without gloves.'
      },
      ans: 'B',
      explanation: 'Disposable nitrile gloves protect staff against bloodborne pathogens and forecourt chemical hazards.'
    },
    {
      q: '4. If an uncontained fire breaks out near the pump island, what is the PASS firefighting sequence?',
      options: {
        A: 'Pull pin, Aim low at base, Squeeze lever, Sweep side to side.',
        B: 'Push handle, Aim high at flames, Sweep circle, Stop.',
        C: 'Pull pin, Aim at top flames, Squeeze, Stand downwind.',
        D: 'Pour water, Aim hose, Shake handle, Sweep.'
      },
      ans: 'A',
      explanation: 'PASS stands for Pull pin, Aim low at base, Squeeze handle, Sweep side to side.'
    },
    {
      q: '5. When should ESD (Emergency Stop Dispensing) buttons be activated during a forecourt emergency?',
      options: {
        A: 'Only after calling the general manager.',
        B: 'Immediately at the first sign of uncontained fire, major leak, or vehicle collision.',
        C: 'After hanging up all nozzles.',
        D: 'At the end of the shift.'
      },
      ans: 'B',
      explanation: 'Hitting the ESD button instantly cuts electrical power to all fuel pumps site-wide.'
    }
  ];

  const handleSelectAnswer = (optionKey: string) => {
    if (selectedChoice !== null) return;
    setSelectedChoice(optionKey);

    if (optionKey === refresherQuestions[currentQuizIndex].ans) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < refresherQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedChoice(null);
    } else {
      setQuizCompleted(true);
      const newLog: RefresherLog = {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        candidateName: 'Current Staff Attendant',
        role: 'Forecourt Attendant',
        score: quizScore + (selectedChoice === refresherQuestions[currentQuizIndex].ans ? 1 : 0),
        total: refresherQuestions.length,
        date: new Date().toISOString().split('T')[0],
        status: (quizScore + (selectedChoice === refresherQuestions[currentQuizIndex].ans ? 1 : 0)) >= 4 ? 'PASSED' : 'FAILED'
      };
      setRefresherLogs(prev => [newLog, ...prev]);
    }
  };

  const resetRefresher = () => {
    setCurrentQuizIndex(0);
    setSelectedChoice(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const activeCase = caseStudies[selectedCaseStudy];

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden min-w-0 box-border">
      {/* Header Banner */}
      <div className="pos-card p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl w-full max-w-full overflow-x-hidden min-w-0 box-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-500/30">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Stage 2: Monthly Continuous Refresher Engine
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Monthly Refresher & High-Risk Case Study Hub
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Rapid 3-minute operational case studies and 5-question micro-refresher assessments for forecourt staff.
          </p>
        </div>

        {onOpenDossier && (
          <button
            onClick={onOpenDossier}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition min-h-[44px]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Oil Brand Stewardship Dossier</span>
          </button>
        )}
      </div>

      {/* Case Studies Carousel Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full overflow-x-hidden min-w-0 box-border">
        {caseStudies.map((cs, idx) => {
          const IconComp = cs.icon;
          const isSelected = selectedCaseStudy === idx;

          return (
            <div
              key={cs.id}
              onClick={() => setSelectedCaseStudy(idx)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                  {cs.badge}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>

              <h4 className="text-sm font-extrabold text-white mt-1">{cs.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cs.scenario}</p>
            </div>
          );
        })}
      </div>

      {/* Case Study Details & Prevention Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl w-full max-w-full overflow-x-hidden min-w-0 box-border">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-lg font-black text-amber-400">{activeCase.title}</h3>
          <span className="text-xs font-mono text-slate-400">3-Minute Refresher Spec</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-red-400 font-extrabold block">Root Cause Analysis:</strong>
            <p className="text-slate-300 leading-relaxed">{activeCase.rootCause}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-emerald-400 font-extrabold block">Standard Operating Prevention:</strong>
            <p className="text-slate-300 leading-relaxed">{activeCase.prevention}</p>
          </div>
        </div>
      </div>

      {/* 5-Question Refresher Quiz Container */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl w-full max-w-full overflow-x-hidden min-w-0 box-border">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block">
              Monthly 5-Question High-Risk Micro-Quiz
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">Staff Monthly Refresher Assessment</h3>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs">
            Score: {quizScore} / {refresherQuestions.length}
          </div>
        </div>

        {!quizCompleted ? (
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-extrabold text-white">
              {refresherQuestions[currentQuizIndex].q}
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = refresherQuestions[currentQuizIndex].options[optKey];
                const isSelected = selectedChoice === optKey;
                const isCorrect = refresherQuestions[currentQuizIndex].ans === optKey;
                const hasAnswered = selectedChoice !== null;

                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800';
                if (hasAnswered) {
                  if (isCorrect) btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold';
                  else if (isSelected) btnStyle = 'bg-red-950/70 border-red-500 text-red-200 font-bold';
                  else btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectAnswer(optKey)}
                    disabled={hasAnswered}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 min-h-[50px] ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center border border-slate-700 flex-shrink-0">
                      {optKey}
                    </span>
                    <span className="text-xs pt-1 leading-relaxed">{optText}</span>
                  </button>
                );
              })}
            </div>

            {selectedChoice !== null && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1 animate-fadeIn">
                <strong className="text-amber-400 font-extrabold block">Refresher Guidance:</strong>
                <p>{refresherQuestions[currentQuizIndex].explanation}</p>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                onClick={handleNextQuestion}
                disabled={selectedChoice === null}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition min-h-[44px]"
              >
                {currentQuizIndex < refresherQuestions.length - 1 ? 'Next Question →' : 'Complete Refresher Test'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Award className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-white">Monthly Refresher Complete!</h3>
            <p className="text-sm font-bold text-emerald-400">
              Score: {quizScore} / {refresherQuestions.length} ({Math.round((quizScore/refresherQuestions.length)*100)}%) — TIMESTAMPpersisted to monthly audit log.
            </p>
            <button
              onClick={resetRefresher}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition"
            >
              Take Another Refresher
            </button>
          </div>
        )}
      </div>

      {/* Local Refresher Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl w-full max-w-full overflow-x-hidden min-w-0 box-border">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Persisted Monthly Staff Refresher Logs
          </h4>
          <span className="text-xs text-slate-400">Auto-Indexed for SANS Audits</span>
        </div>

        <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 max-w-full box-border">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Staff Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {refresherLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono text-amber-400">{log.id}</td>
                  <td className="py-2.5 px-3 text-white font-extrabold">{log.candidateName}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.role}</td>
                  <td className="py-2.5 px-3 font-mono">{log.score} / {log.total}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{log.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-[10px] border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
