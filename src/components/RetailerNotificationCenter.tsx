import React, { useState } from 'react';
import { 
  BellRing, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send, 
  Mail, 
  PhoneCall, 
  Users, 
  ShieldCheck, 
  BadgeCheck,
  Building2
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface RetailerNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  lastRefresher: string;
  status: 'COMPLIANT' | 'PENDING' | 'OVERDUE';
  scorePercent: number;
}

export const RetailerNotificationCenter: React.FC<RetailerNotificationCenterProps> = ({
  isOpen,
  onClose,
  lang = 'EN'
}) => {
  const t = translations[lang];

  const [alertSent, setAlertSent] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: 'STF-01', name: 'Melly Tharmen', role: 'Forecourt Supervisor & Fire Warden', lastRefresher: '2026-08-01', status: 'COMPLIANT', scorePercent: 100 },
    { id: 'STF-02', name: 'Sipho Ndlovu', role: 'Cashier Lead', lastRefresher: '2026-08-03', status: 'COMPLIANT', scorePercent: 95 },
    { id: 'STF-03', name: 'Pieter van Zyl', role: 'Nightshift Attendant', lastRefresher: '2026-08-05', status: 'COMPLIANT', scorePercent: 90 },
    { id: 'STF-04', name: 'Zanele Khumalo', role: 'Forecourt Attendant', lastRefresher: '2026-06-15', status: 'PENDING', scorePercent: 75 },
    { id: 'STF-05', name: 'Kabo Mokoena', role: 'Assistant Cashier', lastRefresher: '2026-05-10', status: 'OVERDUE', scorePercent: 60 }
  ]);

  if (!isOpen) return null;

  const compliantCount = staffList.filter(s => s.status === 'COMPLIANT').length;
  const pendingCount = staffList.filter(s => s.status === 'PENDING').length;
  const overdueCount = staffList.filter(s => s.status === 'OVERDUE').length;
  const overallReadiness = Math.round((compliantCount / staffList.length) * 100);

  const handleSendManagerAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/60 overflow-hidden flex flex-col my-6 max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
              <BellRing className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-500/30">
                  Stage 3: Retailer Notification Center
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold uppercase border border-emerald-500/30">
                  Site Readiness: {overallReadiness}%
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">Retailer Compliance & Manager Alert Hub</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition min-h-[40px] min-w-[40px]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[78vh]">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Compliant Staff</span>
              <span className="text-3xl font-black text-emerald-300">{compliantCount} / {staffList.length}</span>
              <span className="text-[10px] text-emerald-200 block font-semibold">Active HITL Certs</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-1">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">Pending Refresher</span>
              <span className="text-3xl font-black text-amber-300">{pendingCount}</span>
              <span className="text-[10px] text-amber-200 block font-semibold">Due within 14 days</span>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-1">
              <span className="text-xs font-black text-red-400 uppercase tracking-wider block">Overdue Action</span>
              <span className="text-3xl font-black text-red-300">{overdueCount}</span>
              <span className="text-[10px] text-red-200 block font-semibold">Immediate Audit Risk</span>
            </div>
          </div>

          {/* Staff Member Compliance Table */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Station Staff Readiness Roster
              </span>
              <span className="text-[11px] font-mono text-slate-400">Engen Site #904</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Staff ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Last Refresher</th>
                    <th className="py-2.5 px-3">Score %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {staffList.map((stf) => (
                    <tr key={stf.id} className="hover:bg-slate-900/60">
                      <td className="py-2.5 px-3 font-mono text-amber-400">{stf.id}</td>
                      <td className="py-2.5 px-3 text-white font-black">{stf.name}</td>
                      <td className="py-2.5 px-3 text-slate-300">{stf.role}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{stf.lastRefresher}</td>
                      <td className="py-2.5 px-3 font-mono">{stf.scorePercent}%</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${
                          stf.status === 'COMPLIANT'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : stf.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                        }`}>
                          {stf.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instant Manager Alert Trigger */}
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <strong className="text-amber-300 font-extrabold text-sm block flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-400" /> Instant Manager SMS / Email Escalation
              </strong>
              <p className="text-xs text-slate-300">
                Trigger automated compliance alerts to general station manager for staff pending or overdue refreshers.
              </p>
            </div>

            <button
              onClick={handleSendManagerAlert}
              disabled={alertSent}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition flex-shrink-0 min-h-[44px]"
            >
              {alertSent ? (
                <><CheckCircle2 className="w-4 h-4 text-slate-950" /> Alert Sent to Manager!</>
              ) : (
                <><Mail className="w-4 h-4" /> Trigger Manager Alert</>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
