import React from 'react';

interface EnterpriseFooterProps {
  appName: string;
  subtitle: string;
  year?: number;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({
  appName,
  subtitle,
  year = 2026,
}) => {
  return (
    <footer className="w-full bg-[#070d1e] border-t border-slate-800 px-6 py-6 text-slate-400 text-xs">
      {/* Top Row: App Branding & Compliance Architecture */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        {/* Left: App Identity */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center font-black text-[10px] text-slate-950">
              OHS
            </div>
            <span className="text-base font-bold text-slate-100 tracking-tight">
              {appName}
            </span>
          </div>
          <p className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
            {subtitle}
          </p>
        </div>

        {/* Right: Anonymized Enterprise Core Badge */}
        <div className="flex flex-col md:items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Engineered by</span>
            <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-bold text-xs">
              Enterprise OHS Core
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
            <span>Autonomous Compliance Architecture</span>
            <span>•</span>
            <span>Forecourt Safety POS System</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Legal & Sub-links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
        <p>© {year} {appName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-300 transition">Privacy Protocol</a>
          <a href="#security" className="hover:text-slate-300 transition">Security Node</a>
          <a href="#compliance" className="hover:text-slate-300 transition">Compliance Core</a>
        </div>
      </div>
    </footer>
  );
};
