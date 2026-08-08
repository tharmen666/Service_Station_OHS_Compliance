import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Maximize2, 
  FileText, 
  BookOpen, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { PosterLightboxModal } from './PosterLightboxModal';

export const StatutoryRightsModule: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const statutoryRights = [
    {
      id: 1,
      title: '45-Hour Standard Work Week',
      code: 'BCEA Section 9',
      icon: Clock,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Maximum 45 normal working hours per week for forecourt attendants and shop cashiers (9 hrs/day for 5-day week, or 8 hrs/day for 6-day week).'
    },
    {
      id: 2,
      title: 'Overtime & Sunday Premium Pay',
      code: 'BCEA Section 10 & 16',
      icon: DollarSign,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Overtime paid at 1.5x normal rate. Sunday and public holiday work paid at 2x normal hourly rate for retail fuel staff.'
    },
    {
      id: 3,
      title: 'Right to a Safe Workplace & Refusal of Dangerous Work',
      code: 'OHSA Section 8 & 14',
      icon: ShieldCheck,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Every worker has the statutory right to free PPE (nitrile gloves, high-vis vests, anti-static safety boots) and the right to refuse unsafe fuel dispensing.'
    },
    {
      id: 4,
      title: 'Paid Sick & Annual Leave Rights',
      code: 'BCEA Section 20 & 22',
      icon: FileText,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: '21 consecutive days paid annual leave per year. 30 days paid sick leave over a 36-month cycle.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card p-6 rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider mb-2 border border-blue-500/30">
            <Scale className="w-4 h-4 text-blue-400" />
            Statutory Rights & BCEA Compliance Module
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Know Your Rights (BCEA & OHSA Statutory Rights)
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Department of Employment & Labour summary poster on working hours, overtime rates, safety rights, and leave.
          </p>
        </div>

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-950/50 transition min-h-[44px]"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Full-Screen Poster Lightbox</span>
        </button>
      </div>

      {/* Poster Display & Lightbox Trigger Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" /> Official BCEA & OHSA Summary Poster Infographic
          </h3>
          <span className="text-xs font-mono text-slate-400">Click image to enlarge</span>
        </div>

        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-blue-500/40 bg-slate-950 p-2 shadow-2xl"
        >
          <img
            src="/assets/posters/statutory_rights_poster.png"
            alt="Statutory Rights Poster"
            className="w-full max-h-[400px] object-contain rounded-xl transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-2xl">
              <Maximize2 className="w-4 h-4" /> Single-Tap for Full-Screen View
            </span>
          </div>
        </div>
      </div>

      {/* 4 Statutory Right Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statutoryRights.map((right) => {
          const IconComp = right.icon;
          return (
            <div key={right.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${right.badgeColor}`}>
                  {right.code}
                </span>
                <IconComp className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-base font-extrabold text-white">{right.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">{right.description}</p>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PosterLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc="/assets/posters/statutory_rights_poster.png"
        title="BCEA & OHSA Employee Statutory Rights Summary Poster"
        subtitle="Department of Employment & Labour mandatory workplace display notice."
      />
    </div>
  );
};
