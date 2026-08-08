import React from 'react';
import { X, ZoomIn, Download, Maximize2, ShieldCheck, Sparkles } from 'lucide-react';

interface PosterLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
  subtitle?: string;
}

export const PosterLightboxModal: React.FC<PosterLightboxModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  title,
  subtitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/70 overflow-hidden flex flex-col my-4 max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <ZoomIn className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                Interactive Training Poster Lightbox
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">{title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={imageSrc}
              download={`${title.replace(/\s+/g, '_')}_Poster.png`}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs flex items-center gap-2 border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Save Image</span>
            </a>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Image Body */}
        <div className="p-4 md:p-6 flex flex-col items-center justify-center overflow-y-auto max-h-[82vh] space-y-3">
          <div className="relative w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-2 shadow-inner">
            <img
              src={imageSrc}
              alt={title}
              className="max-h-[68vh] w-auto object-contain rounded-xl shadow-2xl transition hover:scale-105 duration-300"
            />
          </div>

          {subtitle && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 text-center max-w-2xl">
              <strong className="text-amber-400 font-bold block mb-0.5">SANS Statutory Training Cue:</strong>
              <span>{subtitle}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
