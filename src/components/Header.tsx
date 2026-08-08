import React from 'react';
import { BoardType, BoardFilter } from '../types';
import { Search, AlertCircle, Plus, RefreshCw, Download, Upload, List, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  activeBoard: BoardType;
  leadsCount: number;
  projectsCount: number;
  urgentCount: number;
  filter: BoardFilter;
  onFilterChange: (filter: BoardFilter) => void;
  onQuickAdd: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  view?: 'table' | 'kanban';
  onToggleView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBoard,
  urgentCount,
  filter,
  onFilterChange,
  onQuickAdd,
  onResetData,
  onExportData,
  onImportData,
  view,
  onToggleView,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="bg-[oklch(98%_0.005_95)] sticky top-0 z-20 px-6 py-4" style={{ boxShadow: '0 1px 2px oklch(20% 0 0 / 4%)' }}>
      <div className="flex items-center justify-between gap-4">
        
        {/* Header Title */}
        <div className="flex items-center gap-4">
          <h1 className="title-page text-[oklch(28%_0.01_95)] capitalize">
            {activeBoard}
          </h1>
        </div>

        {/* Filters & Actions Bar */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Search Box */}
          <div className="relative w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(48%_0.01_95)]" />
            <input
              type="text"
              placeholder={`Search ${activeBoard}...`}
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 text-[14px] bg-white elevation-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] text-[oklch(28%_0.01_95)] placeholder:text-[oklch(48%_0.01_95)] transition-shadow"
            />
          </div>

          {/* Urgent Toggle */}
          <button
            onClick={() => onFilterChange({ ...filter, urgencyOnly: !filter.urgencyOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              filter.urgencyOnly
                ? 'bg-[oklch(95%_0.04_25)] text-[oklch(50%_0.15_25)]'
                : 'bg-white elevation-base text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)]'
            }`}
            title="Filter cards needing urgent attention today"
          >
            <AlertCircle className={`w-4 h-4 ${urgentCount > 0 ? 'text-[oklch(50%_0.15_25)]' : ''}`} />
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[oklch(28%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(38%_0.01_95)] transition-colors cursor-pointer elevation-base"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add</span>
          </button>

          {/* View Toggle (if supported) */}
          {view && onToggleView && (
            <div className="flex items-center bg-white elevation-base rounded-lg p-0.5 ml-2">
              <button
                onClick={() => view !== 'table' && onToggleView()}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  view === 'table' ? 'bg-[oklch(96%_0.01_95)] text-[oklch(28%_0.01_95)] shadow-xs' : 'text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(98%_0.005_95)]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => view !== 'kanban' && onToggleView()}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  view === 'kanban' ? 'bg-[oklch(96%_0.01_95)] text-[oklch(28%_0.01_95)] shadow-xs' : 'text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(98%_0.005_95)]'
                }`}
                title="Kanban View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Settings & Portability Tools */}
          <div className="flex items-center pl-2 gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <button
              onClick={onResetData}
              title="Reset sample data"
              className="p-1.5 rounded text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={onExportData}
              title="Export board data as JSON"
              className="p-1.5 rounded text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-white transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import board data from JSON"
              className="p-1.5 rounded text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-white transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={onImportData}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
