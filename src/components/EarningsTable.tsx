import React, { useState } from 'react';
import { EarningsCard, StageConfig, BoardFilter } from '../types';
import { formatCurrency } from '../utils';
import { Settings, Plus, ChevronDown, Upload } from 'lucide-react';

interface EarningsTableProps {
  earnings: EarningsCard[];
  stages: StageConfig[];
  filter: BoardFilter;
  onUpdateCard: (updatedCard: EarningsCard) => void;
  onAddCard: (card: Partial<EarningsCard>) => void;
  onRowClick: (earningsId: string) => void;
}

export const EarningsTable: React.FC<EarningsTableProps> = ({
  earnings,
  stages,
  filter,
  onUpdateCard,
  onAddCard,
  onRowClick,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const [showStageDropdown, setShowStageDropdown] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState<string | null>(null);
  
  const [newEarningName, setNewEarningName] = useState('');

  const filteredEarnings = earnings.filter(e => {
    const q = (localSearch || filter.searchQuery).toLowerCase();
    if (!q) return true;
    return e.clientName.toLowerCase().includes(q) || e.linkedProjectName.toLowerCase().includes(q);
  });

  const handleEditStart = (e: React.MouseEvent, id: string, field: string, initialValue: string) => {
    e.stopPropagation();
    setEditingCell({ id, field });
    setEditValue(initialValue);
  };

  const handleEditCommit = (earning: EarningsCard) => {
    if (editingCell) {
      if ((earning as any)[editingCell.field] !== editValue) {
        onUpdateCard({ ...earning, [editingCell.field]: editingCell.field === 'amount' ? Number(editValue) : editValue });
      }
      setEditingCell(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, earning: EarningsCard) => {
    if (e.key === 'Enter') handleEditCommit(earning);
    if (e.key === 'Escape') setEditingCell(null);
  };

  const handleStageChange = (e: React.MouseEvent, earning: EarningsCard, newStageId: string) => {
    e.stopPropagation();
    onUpdateCard({ ...earning, stageId: newStageId });
    setShowStageDropdown(null);
  };

  const handleTypeChange = (e: React.MouseEvent, earning: EarningsCard, type: 'audit' | 'project') => {
    e.stopPropagation();
    onUpdateCard({ ...earning, type });
    setShowTypeDropdown(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEarningName.trim()) {
      onAddCard({
        clientName: newEarningName.trim(),
        linkedProjectName: newEarningName.trim(), // Default to the same, user can edit
        stageId: stages[0].id,
        amount: 0,
        type: 'project',
      });
      setNewEarningName('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, earning: EarningsCard) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to a server. Here we just fake a URL or use ObjectURL
      const fileUrl = URL.createObjectURL(file);
      onUpdateCard({ ...earning, receiptFile: fileUrl });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Filter earnings..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-64 px-3 py-1.5 text-sm bg-white border border-[oklch(90%_0.01_95)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)]"
        />
        <button className="p-1.5 rounded-lg hover:bg-[oklch(95%_0.01_95)] text-[oklch(48%_0.01_95)] transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl border border-[oklch(90%_0.01_95)] shadow-xs">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[oklch(98%_0.005_95)] sticky top-0 z-10 text-[oklch(48%_0.01_95)] font-medium">
            <tr>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Project Name</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Amount</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Type</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Payment Date</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Stage</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredEarnings.map((earning) => {
              const stage = stages.find(s => s.id === earning.stageId);
              return (
                <tr
                  key={earning.id}
                  onClick={() => onRowClick(earning.id)}
                  className="group hover:bg-[oklch(98%_0.005_95)] transition-colors border-b border-[oklch(95%_0.01_95)] last:border-0 cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-medium text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === earning.id && editingCell?.field === 'linkedProjectName' ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditCommit(earning)}
                        onKeyDown={(e) => handleEditKeyDown(e, earning)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, earning.id, 'linkedProjectName', earning.linkedProjectName)} className="hover:bg-white/50 px-1 -mx-1 rounded truncate max-w-[200px]">
                        {earning.linkedProjectName || <span className="opacity-50 italic">Link a project...</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === earning.id && editingCell?.field === 'amount' ? (
                      <input
                        autoFocus
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditCommit(earning)}
                        onKeyDown={(e) => handleEditKeyDown(e, earning)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-24 bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, earning.id, 'amount', String(earning.amount))} className="hover:bg-white/50 px-1 -mx-1 rounded">
                        {formatCurrency(earning.amount, earning.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowTypeDropdown(showTypeDropdown === earning.id ? null : earning.id); }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)]"
                    >
                      <span className="capitalize px-2 py-1 bg-[oklch(95%_0.01_95)] rounded">{earning.type || 'Project'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {showTypeDropdown === earning.id && (
                      <div className="absolute top-full left-4 mt-1 bg-white border border-[oklch(90%_0.01_95)] shadow-md rounded-lg py-1 z-20 min-w-[120px]">
                        <button onClick={(e) => handleTypeChange(e, earning, 'project')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-[oklch(98%_0.005_95)]">Project</button>
                        <button onClick={(e) => handleTypeChange(e, earning, 'audit')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-[oklch(98%_0.005_95)]">Audit</button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[oklch(48%_0.01_95)] text-xs">
                    {earning.dueDate}
                  </td>
                  <td className="px-4 py-2.5 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowStageDropdown(showStageDropdown === earning.id ? null : earning.id); }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: stage?.chipColor || '#ccc' }}
                    >
                      {stage?.name}
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>
                    {showStageDropdown === earning.id && (
                      <div className="absolute top-full left-4 mt-1 bg-white border border-[oklch(90%_0.01_95)] shadow-md rounded-lg py-1 z-20 min-w-[140px]">
                        {stages.map(s => (
                          <button
                            key={s.id}
                            onClick={(e) => handleStageChange(e, earning, s.id)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-[oklch(98%_0.005_95)] flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.chipColor }} />
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    {earning.receiptFile ? (
                      <a href={earning.receiptFile} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[oklch(50%_0.15_250)] font-medium hover:underline">
                        View Receipt
                      </a>
                    ) : (
                      <label onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, earning)} />
                      </label>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-[oklch(99%_0.005_95)] sticky bottom-0 border-t border-[oklch(90%_0.01_95)]">
            <tr>
              <td colSpan={6} className="p-0">
                <form onSubmit={handleAddSubmit} className="flex items-center px-4 py-2 hover:bg-[oklch(98%_0.005_95)]">
                  <Plus className="w-4 h-4 text-[oklch(48%_0.01_95)] mr-2" />
                  <input
                    type="text"
                    value={newEarningName}
                    onChange={(e) => setNewEarningName(e.target.value)}
                    placeholder="New payment..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-[oklch(28%_0.01_95)] placeholder:text-[oklch(68%_0.01_95)] placeholder:font-normal"
                  />
                </form>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
