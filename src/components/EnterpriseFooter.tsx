import React, { useState, useEffect } from 'react';
import { getActiveTenant, subscribeTenantChange } from '../multiTenantConfig';

export interface EnterpriseFooterProps {
  appName?: string;
  subtitle?: string;
  creatorName?: string;
  creatorEmail?: string;
  creatorPhone?: string;
  className?: string;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({
  appName,
  subtitle = 'STATUTORY OHS COMPLIANCE MANAGEMENT SYSTEM',
  creatorName = 'Desigan Tharmen',
  creatorEmail = 'tharmendesigan36@gmail.com',
  creatorPhone = '+27 622 655 708',
  className = '',
}) => {
  const [activeTenant, setActiveTenant] = useState(getActiveTenant());

  useEffect(() => {
    const unsub = subscribeTenantChange((t) => setActiveTenant(t));
    return () => unsub();
  }, []);

  const displayAppName = appName || activeTenant.brandName || 'Service Station OHS Compliance System';

  return (
    <footer className={`w-full bg-[#070d1e] border-t border-slate-800/80 px-6 py-3.5 text-slate-400 text-xs flex flex-col md:flex-row items-center justify-between gap-4 flex-shrink-0 ${className}`}>
      {/* Left Section: Logo, App Name, Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-xs text-slate-950 shadow-md shadow-amber-500/20 flex-shrink-0">
          OHS
        </div>
        <div className="flex flex-col">
          <div className="text-sm md:text-base font-black text-white tracking-tight leading-snug">
            {displayAppName}
          </div>
          <div className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
            {subtitle}
          </div>
        </div>
      </div>

      {/* Right Section: Created by Badge & Contact Info */}
      <div className="flex flex-col items-start md:items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Created by</span>
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded font-black text-xs shadow-sm">
            {creatorName}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            {creatorEmail}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500 font-bold">•</span>
            {creatorPhone}
          </span>
        </div>
      </div>
    </footer>
  );
};

