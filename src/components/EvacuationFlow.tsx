import React, { useState } from 'react';
import { evacuationSteps } from '../data/assessmentData';
import { AlertOctagon, ShieldAlert, PhoneCall, Flame, SearchCheck, Users, CheckCircle2, Volume2, ArrowRight, RefreshCw } from 'lucide-react';

export const EvacuationFlow: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAudioSimulating, setIsAudioSimulating] = useState<boolean>(false);

  const toggleStepComplete = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
      if (stepNum < 6) {
        setActiveStep(stepNum + 1);
      }
    }
  };

  const resetFlow = () => {
    setCompletedSteps([]);
    setActiveStep(1);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'AlertOctagon': return <AlertOctagon className="w-6 h-6 text-red-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-400" />;
      case 'PhoneCall': return <PhoneCall className="w-6 h-6 text-red-400" />;
      case 'Flame': return <Flame className="w-6 h-6 text-red-400" />;
      case 'SearchCheck': return <SearchCheck className="w-6 h-6 text-red-400" />;
      case 'Users': return <Users className="w-6 h-6 text-red-400" />;
      default: return <AlertOctagon className="w-6 h-6 text-red-400" />;
    }
  };

  const simulateAlarmSound = () => {
    setIsAudioSimulating(true);
    setTimeout(() => setIsAudioSimulating(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pos-card pos-card-red p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Mandatory Emergency Flow
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">6-Step Forecourt Evacuation Protocol</h2>
          <p className="text-slate-300 text-sm mt-1">Sequential role cards for forecourt emergency evacuation, pump shutoff, and assembly roll call.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={simulateAlarmSound}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition ${
              isAudioSimulating ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            {isAudioSimulating ? 'SIREN ACTIVE (00:03)' : 'Simulate Alarm Siren'}
          </button>

          <button
            onClick={resetFlow}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2 border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" /> Reset Drill
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evacuation Completion Progress</span>
          <span className="text-sm font-extrabold text-red-400">{completedSteps.length} of 6 Steps Completed ({Math.round((completedSteps.length / 6) * 100)}%)</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
          <div
            className="bg-gradient-to-r from-red-600 via-red-500 to-rose-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {evacuationSteps.map((step) => {
          const isDone = completedSteps.includes(step.step_number);
          const isActive = activeStep === step.step_number;

          return (
            <div
              key={step.step_number}
              onClick={() => setActiveStep(step.step_number)}
              className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : isActive
                  ? 'bg-gradient-to-b from-red-950/40 to-slate-900 border-red-500 ring-2 ring-red-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Step Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border ${
                      isDone ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {step.step_number}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step {step.step_number}</span>
                      <h3 className="text-base font-bold text-white leading-tight">{step.title}</h3>
                    </div>
                  </div>

                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    getIcon(step.icon_name)
                  )}
                </div>

                {/* Role Badge */}
                <div className="inline-block px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold mb-3 border border-slate-700">
                  👤 Role: <span className="text-red-300 font-bold">{step.role}</span>
                </div>

                {/* Action Details */}
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {step.action}
                </p>

                {/* Warning Callout */}
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2">
                  <span className="text-red-400 font-bold">⚠️</span>
                  <span><strong>Warning:</strong> {step.critical_warning}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-500">
                  {isDone ? 'Verified Step' : 'Click to Verify Action'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStepComplete(step.step_number);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-950/50'
                  }`}
                >
                  {isDone ? 'Completed ✓' : 'Mark Completed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
