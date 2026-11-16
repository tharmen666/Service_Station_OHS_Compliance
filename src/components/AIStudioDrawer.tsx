import React, { useState } from 'react';
import { aiStudioPromptTemplate } from '../data/assessmentData';
import { getOHSSystemInstruction, DEFAULT_OHS_GUARDRAILS } from '../ohsComplianceGuardrails';
import { X, Sparkles, Copy, Check, ExternalLink, Code2, Bot, ShieldCheck, Lock } from 'lucide-react';

interface AIStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudioDrawer: React.FC<AIStudioDrawerProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSystemInstructionCopied, setIsSystemInstructionCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const systemPromptText = getOHSSystemInstruction();

  const copySystemInstruction = () => {
    navigator.clipboard.writeText(systemPromptText);
    setIsSystemInstructionCopied(true);
    setTimeout(() => setIsSystemInstructionCopied(false), 2000);
  };

  const copyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Vibe Coding Integration
              </div>
              <h3 className="text-xl font-extrabold text-white">Google AI Studio Prompt Templates</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Temperature Lock Badge */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-extrabold text-emerald-300">Temperature Parameter Locked: 0.0</span>
                <span className="block text-[11px] text-emerald-400/80">Strict-temperature drafting mode (OHS Act 85 / SANS 10089)</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[10px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STRICT
            </span>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
            <Code2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-300 font-bold block mb-0.5">Google AI Studio Quick Copy</strong>
              Copy system instructions and pre-tuned prompt parameters directly into Google AI Studio (Gemini 1.5 Pro / Flash) for custom OHS vibe coding.
            </div>
          </div>

          {/* System Instruction Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                System Instructions (Nelly OHS Advisor persona)
              </label>
              <button
                onClick={copySystemInstruction}
                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/40 flex items-center gap-1.5 transition"
              >
                {isSystemInstructionCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {isSystemInstructionCopied ? 'System Prompt Copied!' : 'Copy System Instruction'}
              </button>
            </div>

            <textarea
              readOnly
              value={systemPromptText}
              className="w-full h-44 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-200 focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>

          {/* Sample Prompts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              Pre-Configured Scenario Prompt Templates
            </h4>

            <div className="space-y-3">
              {aiStudioPromptTemplate.sample_prompts.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <button
                      onClick={() => copyPrompt(item.prompt, idx)}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === idx ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {item.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1.5 transition"
          >
            Open Google AI Studio Website <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
