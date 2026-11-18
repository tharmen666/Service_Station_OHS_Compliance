import React, { useState } from 'react';
import { RemediationInfo } from '../types';
import { X, Play, Pause, Film, Clock, FileText, Copy, Check, ExternalLink, ShieldAlert } from 'lucide-react';

interface VideoRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  remediation: RemediationInfo | null;
  questionText: string;
  incorrectChoice: string;
  correctChoice: string;
}

export const VideoRemediationModal: React.FC<VideoRemediationModalProps> = ({
  isOpen,
  onClose,
  remediation,
  questionText,
  incorrectChoice,
  correctChoice,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen || !remediation) return null;

  const copyPath = () => {
    navigator.clipboard.writeText(remediation.video_path);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-red-500/50 rounded-3xl shadow-2xl shadow-red-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-extrabold uppercase tracking-wider border border-red-500/30">
                  Incorrect Answer - Remediation Required
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white">Video Remediation Module</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Question Summary */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Question Review</div>
            <p className="text-white font-bold">{questionText}</p>
            <div className="flex flex-wrap gap-4 pt-1">
              <span className="text-red-400 font-semibold">❌ Your Selection: {incorrectChoice}</span>
              <span className="text-emerald-400 font-semibold">✓ Correct Answer: {correctChoice}</span>
            </div>
          </div>

          {/* Realistic Forecourt Video Player with Timestamp Scrubber */}
          <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-xl aspect-video flex flex-col justify-between p-4 group">
            <video
              src="/Service_Station_OHS_Compliance_Demo.mp4"
              poster="/assets/forecourt_realistic_scene1.jpg"
              autoPlay
              muted
              loop
              playsInline
              data-testid="remediation-realistic-video"
              className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none"
            />
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/60 to-transparent flex items-center justify-center pointer-events-none">
              <div className="text-center p-6 space-y-2">
                <Film className="w-14 h-14 text-amber-500/70 mx-auto animate-pulse" />
                <div className="text-xs text-amber-300 font-mono font-bold">HD FORECOURT REMEDIATION PLAYBACK</div>
                <div className="text-sm font-bold text-white max-w-md mx-auto">{remediation.video_reference}</div>
              </div>
            </div>

            {/* Video Overlay Top Badge */}
            <div className="relative z-10 flex justify-between items-center">
              <div className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-400 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Segment Cue: {remediation.timestamp_start} - {remediation.timestamp_end}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-red-500/80 text-white text-[10px] font-bold uppercase">
                Compliance Clip
              </span>
            </div>

            {/* Video Controls Bottom Bar */}
            <div className="relative z-10 space-y-2 pt-8">
              {/* Timestamp Scrubber Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex relative">
                <div className="w-1/4 bg-slate-700"></div>
                <div className="w-1/2 bg-amber-500 animate-pulse relative">
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md"></span>
                </div>
                <div className="w-1/4 bg-slate-700"></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                  </button>
                  <span className="font-mono text-amber-300">{remediation.timestamp_start} / {remediation.timestamp_end}</span>
                </div>

                <span className="text-[11px] text-slate-400 italic">Looping remediation section</span>
              </div>
            </div>
          </div>

          {/* Local Video Path Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Local Media File Path (Scanned Drive D:)
              </span>
              <button
                onClick={copyPath}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Copied Path!' : 'Copy Path'}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300 select-all overflow-x-auto">
              {remediation.video_path}
            </div>
          </div>

          {/* Remediation Concept Guidance */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Targeted Concept Review</h4>
            <p className="text-xs text-amber-100 leading-relaxed">{remediation.remediation_guidance}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-500">Review complete? Click below to resume assessment.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-emerald-950/40"
          >
            I Understand & Resume Assessment ✓
          </button>
        </div>
      </div>
    </div>
  );
};
