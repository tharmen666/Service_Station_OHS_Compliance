import React, { useState } from 'react';
import { Shield, Sparkles, Fuel, Smartphone, Cigarette, AlertCircle, Maximize2, Image as ImageIcon } from 'lucide-react';
import { PosterLightboxModal } from './PosterLightboxModal';

export const CustomerServiceModule: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const rules = [
    {
      title: 'No-Smoking Rule Enforcement',
      icon: Cigarette,
      policy: 'Strictly Prohibited on Forecourt',
      action: 'Politely inform customer: "For your safety and ours, please extinguish your cigarette before we begin refueling."',
      reason: 'Open flames near fuel vapor clouds pose an immediate explosion hazard.'
    },
    {
      title: 'Mobile Phone Static Prevention',
      icon: Smartphone,
      policy: 'Redirection to Inside Vehicle/Shop',
      action: 'Politely state: "Sir/Madam, kindly pause phone usage while near active fuel dispensers due to static electricity safety regulations."',
      reason: 'Dropped phone batteries or internal spark gaps can ignite gasoline fumes.'
    },
    {
      title: 'Approved Container Fuel Dispensing',
      icon: Fuel,
      policy: 'Certified Anti-Static Containers Only',
      action: 'Refuse glass, milk jugs, or ungrounded plastic. Offer certified anti-static containers from the store.',
      reason: 'Non-grounded containers accumulate static charge during high-velocity fuel flow.'
    },
    {
      title: 'Ignition Shut-Off & Engine Off',
      icon: Shield,
      policy: 'Engine Off Before Refueling',
      action: 'Request motorist turn off engine and engage handbrake before inserting nozzle.',
      reason: 'Hot exhaust pipes and vehicle electrical systems can ignite vapor leaks.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card pos-card-blue p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Shield className="w-3.5 h-3.5" />
            Customer Service & Safety Standards
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Forecourt Customer Interaction & Safety Rules</h2>
          <p className="text-slate-300 text-sm mt-1">Professional de-escalation, hazard enforcement, and hospitality standards for service station attendants.</p>
        </div>

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition min-h-[44px]"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Greeting & Conduct Poster</span>
        </button>
      </div>

      {/* Bound Customer Service Poster Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-400" /> Forecourt Greeting & Pump Service Illustration Poster
          </span>
          <span className="text-xs font-mono text-slate-400">Tap poster to expand</span>
        </div>

        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border border-blue-500/40 bg-slate-950 p-2 shadow-inner"
        >
          <img
            src="/assets/posters/customer_service_poster.png"
            alt="Customer Service Conduct Poster"
            className="w-full max-h-[320px] object-contain rounded-xl transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center gap-2 shadow-2xl">
              <Maximize2 className="w-4 h-4" /> Single-Tap for High-Res View
            </span>
          </div>
        </div>
      </div>

      {/* 4 Policy Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.policy}
                  </span>
                  <IconComp className="w-6 h-6 text-blue-400" />
                </div>

                <h3 className="text-lg font-extrabold text-white mb-2">{item.title}</h3>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 mb-3">
                  <strong className="text-blue-300 font-bold block">Attendant Dialogue Action:</strong>
                  <p className="text-slate-200 font-semibold">{item.action}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>Technical Rationale:</strong> {item.reason}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PosterLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc="/assets/posters/customer_service_poster.png"
        title="Forecourt Greeting & Pump Service Conduct Poster"
        subtitle="Attendant customer engagement and static ignition de-escalation SOP."
      />
    </div>
  );
};
