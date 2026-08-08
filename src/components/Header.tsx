import React from 'react';
import { BoardType, BoardFilter } from '../types';
import { Search, AlertCircle, Plus, RefreshCw, Download, Upload, Layers, Briefcase } from 'lucide-react';

interface HeaderProps {
  activeBoard: BoardType;
  onBoardChange: (board: BoardType) => void;
  leadsCount: number;
  projectsCount: number;
  urgentCount: number;
  filter: BoardFilter;
  onFilterChange: (filter: BoardFilter) => void;
  onQuickAdd: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBoard,
  onBoardChange,
  leadsCount,
  projectsCount,
  urgentCount,
  filter,
  onFilterChange,
  onQuickAdd,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="border-b border-[#e6e4df] bg-[oklch(98%_0.005_95)] sticky top-0 z-20 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand Title & Board Nav */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="title-page text-[oklch(20%_0.01_95)] tracking-tight">
              Intent Studios OS
            </h1>
          </div>

          {/* Board Navigation Pills */}
          <nav className="flex items-center p-1 bg-white rounded border border-[oklch(90%_0.006_95)]" aria-label="Pipeline switch">
            <button
              onClick={() => onBoardChange('leads')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded chip-stage transition-all cursor-pointer ${
                activeBoard === 'leads'
                  ? 'bg-[oklch(20%_0.01_95)] text-white'
                  : 'text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Leads</span>
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                activeBoard === 'leads' ? 'bg-white/20 text-white' : 'bg-[oklch(95%_0.005_95)] text-[oklch(45%_0.01_95)]'
              }`}>
                {leadsCount}
              </span>
            </button>

            <button
              onClick={() => onBoardChange('projects')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded chip-stage transition-all cursor-pointer ${
                activeBoard === 'projects'
                  ? 'bg-[oklch(20%_0.01_95)] text-white'
                  : 'text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Projects</span>
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                activeBoard === 'projects' ? 'bg-white/20 text-white' : 'bg-[oklch(95%_0.005_95)] text-[oklch(45%_0.01_95)]'
              }`}>
                {projectsCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Filters & Actions Bar */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Search Box */}
          <div className="relative flex-1 md:w-52">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[oklch(45%_0.01_95)]" />
            <input
              type="text"
              placeholder={`Search ${activeBoard}...`}
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-8 pr-2.5 py-1 text-[13px] font-medium bg-white border border-[oklch(90%_0.006_95)] rounded focus:outline-none focus:border-[oklch(20%_0.01_95)] text-[oklch(20%_0.01_95)] placeholder:text-[oklch(45%_0.01_95)]"
            />
          </div>

          {/* Attention / Urgency Filter Toggle */}
          <button
            onClick={() => onFilterChange({ ...filter, urgencyOnly: !filter.urgencyOnly })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] font-medium border transition-colors cursor-pointer ${
              filter.urgencyOnly
                ? 'bg-[oklch(95%_0.04_25)] border-[oklch(80%_0.1_25)] text-[oklch(50%_0.15_25)]'
                : 'bg-white border-[oklch(90%_0.006_95)] text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)]'
            }`}
            title="Filter cards needing urgent attention today"
          >
            <AlertCircle className={`w-3.5 h-3.5 ${urgentCount > 0 ? 'text-[oklch(50%_0.15_25)]' : ''}`} />
            <span>Attention</span>
            {urgentCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[oklch(55%_0.15_25)] text-white text-[10px] font-mono font-semibold flex items-center justify-center">
                {urgentCount}
              </span>
            )}
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onQuickAdd}
            className="flex items-center gap-1.5 px-3 py-1 bg-[oklch(20%_0.01_95)] text-white rounded text-[13px] font-medium hover:bg-[oklch(30%_0.01_95)] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add +</span>
          </button>

          {/* Settings & Portability Tools */}
          <div className="flex items-center border-l border-[oklch(90%_0.006_95)] pl-1.5 gap-0.5">
            <button
              onClick={onResetData}
              title="Reset sample data"
              className="p-1 rounded text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)] hover:bg-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onExportData}
              title="Export board data as JSON"
              className="p-1 rounded text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)] hover:bg-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import board data from JSON"
              className="p-1 rounded text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)] hover:bg-white transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              accept=".json"
              className="hidden"
            />
          </div>

        </div>

      </div>
    </header>
  );
};
