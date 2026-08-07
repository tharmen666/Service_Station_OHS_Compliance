import React from 'react';
import { Shield, Sparkles, Fuel, Smartphone, Cigarette, AlertCircle } from 'lucide-react';

export const CustomerServiceModule: React.FC = () => {
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

        <div className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
          High-Visibility Service Protocol
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
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-bold border border-blue-500/30">
                    {item.policy}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 mb-3">
                  🗣️ <strong>Mandatory Staff Script:</strong> <em className="text-blue-300">"{item.action}"</em>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span><strong>Safety Rationale:</strong> {item.reason}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
