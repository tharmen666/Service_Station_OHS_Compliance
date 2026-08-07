import React, { useState } from 'react';
import curriculumManifestJson from '../../curriculum_manifest.json';
import { Search, FileText, HardDrive, Filter, BookOpen } from 'lucide-react';

export const CurriculumBrowser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeModule, setActiveModule] = useState<string>('All');

  const modules = curriculumManifestJson.modules;
  const summary = curriculumManifestJson.summary;

  // Flatten items
  let allItems: any[] = [];
  modules.forEach(m => {
    allItems = allItems.concat(m.items.map(item => ({ ...item, module_title: m.title })));
  });

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.file_path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = activeModule === 'All' || item.module_title.includes(activeModule);
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pos-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2 border border-purple-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            Full Compliance Index (curriculum_manifest.json)
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">OHS Compliance File Browser</h2>
          <p className="text-slate-300 text-sm mt-1">Explorable database of 511 indexed training manuals, PowerPoints, and videos across USB Drive D: & Local C:.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            ⚡ {summary.usb_drive_files} USB Files (D:) | {summary.local_system_files} Local Files (C:)
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 511 indexed manuals, videos, or file paths..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Customer Service', 'Spill Response', 'Fire & Equipment', 'Evacuation', 'Risk'].map((mod) => (
            <button
              key={mod}
              onClick={() => setActiveModule(mod)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeModule === mod
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.slice(0, 40).map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition space-y-2">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300 border border-slate-700">
                {item.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                item.drive_source.includes('USB') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                <HardDrive className="w-3 h-3" /> {item.drive_source}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>

            <div className="text-xs text-slate-400 line-clamp-2">{item.description}</div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="truncate max-w-[240px] text-purple-300/70">{item.file_name}</span>
              <span>{item.file_size_human}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length > 40 && (
        <div className="text-center text-xs text-slate-500 pt-2">
          Showing top 40 of {filteredItems.length} matching compliance files. Refine search query for specific files.
        </div>
      )}
    </div>
  );
};
