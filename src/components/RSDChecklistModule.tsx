import React, { useState } from 'react';
import { 
  dailyChecklists, 
  weeklyChecklists, 
  monthlyChecklists, 
  allRsdChecklists, 
  ChecklistItem 
} from '../data/rsdChecklistData';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface RSDChecklistModuleProps {
  lang?: Language;
}

export const RSDChecklistModule: React.FC<RSDChecklistModuleProps> = ({ lang = 'EN' }) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Interactive state for audit statuses
  const [itemStatuses, setItemStatuses] = useState<Record<string, 'PASSED' | 'FAILED' | 'PENDING'>>({});

  const getActiveItems = (): ChecklistItem[] => {
    switch (activeTab) {
      case 'daily': return dailyChecklists;
      case 'weekly': return weeklyChecklists;
      case 'monthly': return monthlyChecklists;
      case 'all': return allRsdChecklists;
    }
  };

  const currentItems = getActiveItems();

  const categories = ['ALL', ...Array.from(new Set(currentItems.map(i => i.category)))];

  const filteredItems = currentItems.filter(item => {
    const matchesSearch = 
      item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleStatus = (id: string) => {
    setItemStatuses(prev => {
      const current = prev[id] || 'PENDING';
      let next: 'PASSED' | 'FAILED' | 'PENDING' = 'PASSED';
      if (current === 'PASSED') next = 'FAILED';
      else if (current === 'FAILED') next = 'PENDING';
      return { ...prev, [id]: next };
    });
  };

  const passedCount = currentItems.filter(i => itemStatuses[i.id] === 'PASSED').length;
  const failedCount = currentItems.filter(i => itemStatuses[i.id] === 'FAILED').length;
  const pendingCount = currentItems.length - passedCount - failedCount;

  const totalScorePossible = currentItems.reduce((acc, curr) => acc + curr.weighting, 0);
  const currentScoreAchieved = currentItems
    .filter(i => itemStatuses[i.id] === 'PASSED')
    .reduce((acc, curr) => acc + curr.weighting, 0);

  const compliancePercentage = totalScorePossible > 0 
    ? Math.round((currentScoreAchieved / totalScorePossible) * 100)
    : 100;

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0 box-border space-y-6">
      
      {/* Header Banner */}
      <div className="w-full max-w-full overflow-x-hidden min-w-0 box-border pos-card p-6 md:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-500/30">
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            Forecourt & Convenience Store RSD 26 Compliance Audit Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Daily, Weekly & Monthly Risk Assessments
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
            SANS 10089 & RSD 26 cross-referenced operational checklists extracted from official station risk audit ledgers.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Audit Score</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{compliancePercentage}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 font-bold text-xs">
            RSD
          </div>
        </div>
      </div>

      {/* Stat Cards Stack (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-full overflow-x-hidden min-w-0 box-border">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" /> Total Audit Items
          </span>
          <p className="text-2xl font-black text-white font-mono">{currentItems.length}</p>
          <span className="text-[10px] text-slate-500">Frequency: {activeTab.toUpperCase()}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Passed Items
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{passedCount}</p>
          <span className="text-[10px] text-emerald-500/80">Conforms to standard</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-red-400" /> Non-Conformances
          </span>
          <p className="text-2xl font-black text-red-400 font-mono">{failedCount}</p>
          <span className="text-[10px] text-red-400/80">Action required</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Pending Verification
          </span>
          <p className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</p>
          <span className="text-[10px] text-amber-500/80">Awaiting auditor check</span>
        </div>
      </div>

      {/* Core Forecourt Operational Protocols Summary Matrix */}
      <div
        data-testid="rsd-core-operational-protocols"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-full overflow-x-hidden min-w-0 box-border"
      >
        <div className="p-5 rounded-2xl bg-slate-900/95 border border-red-500/40 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-red-400 block">
            1. Emergency Evacuation &amp; Fire Drills
          </span>
          <h3 className="text-sm font-black text-white">
            8-Step Crisis Response &amp; Shift Sheet Roll Call
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Cashier hits emergency stop; 2 staff block entrance/exit traffic; 2–3 trained staff attack fire with DCP/CO2 extinguishers; customers switch off engines &amp; move to assembly point; internal store notification; kiosk &amp; restroom sweep; Manager conducts formal roll call with <strong>daily shift sheet names &amp; signatures</strong>. Verified fire drills mandated <strong>twice a year</strong>.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/95 border border-amber-500/40 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
            2. Spill Response &amp; 6-to-7-Person Teamwork
          </span>
          <h3 className="text-sm font-black text-white">
            Sponge/Pads, Cloths, Old-Oil Drums &amp; Single-Use Kit
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hit emergency stop immediately; deploy <strong>6-to-7-person spill team</strong> in full PPE gloves to protect stormwater drains; cover spill simultaneously with absorbent sponge/pads and specialized cloths; dispose of saturated items into <strong>old-oil drums</strong>; cast sand &amp; sweep with non-sparking broom; immediately restock <strong>single-use only</strong> spill kit.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/95 border border-blue-500/40 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-400 block">
            3. Customer Service &amp; 4+1 Spare Wheel SOP
          </span>
          <h3 className="text-sm font-black text-white">
            5-Step Attendant Sequence &amp; Store Promos
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct motorist to open pump; greet with a smile &amp; confirm order/zero meter; remind no smoking or cellphone use; offer <strong>store promos</strong>, oil, water, windscreen &amp; <strong>4+1 tyre pressure check including the spare wheel</strong> (only ever checked during a puncture); confirm card/cash payment &amp; farewell with a smile.
          </p>
        </div>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl w-full max-w-full overflow-x-hidden min-w-0 box-border">
        
        {/* Frequency Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap gap-2">
            {(['daily', 'weekly', 'monthly', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedCategory('ALL');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black capitalize transition-all min-h-[40px] ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab === 'daily' && `Daily Checklists (${dailyChecklists.length})`}
                {tab === 'weekly' && `Weekly Inspections (${weeklyChecklists.length})`}
                {tab === 'monthly' && `Monthly RSD 26 Audits (${monthlyChecklists.length})`}
                {tab === 'all' && `All Items (${allRsdChecklists.length})`}
              </button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 max-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat.length > 28 ? cat.substring(0, 28) + '...' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search risk assessment item, ref code (e.g. 1.1., RSD26), or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Horizontally Scrollable Table Container Lockdown */}
        {/* w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 */}
        <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 max-w-full box-border">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/60">
                <th className="py-3 px-3">Ref Code</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Audit Item / Standard Requirement</th>
                <th className="py-3 px-3 text-center">Weight</th>
                <th className="py-3 px-3">SOP Guidance</th>
                <th className="py-3 px-3 text-center">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = itemStatuses[item.id] || 'PENDING';
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-amber-400 whitespace-nowrap">
                        {item.referenceCode}
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-[180px] truncate">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-white leading-relaxed max-w-[320px]">
                        {item.item}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">
                        {item.weighting} pts
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-[240px]">
                        {item.guidance}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase transition min-h-[32px] min-w-[90px] border ${
                            status === 'PASSED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : status === 'FAILED'
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {status === 'PASSED' && '✓ PASSED'}
                          {status === 'FAILED' && '✗ FAILED'}
                          {status === 'PENDING' && 'PENDING'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    No risk assessment items match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
