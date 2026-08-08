import React, { useState } from 'react';
import { HiringCard, StageConfig, BoardFilter } from '../types';
import { Plus, ChevronDown } from 'lucide-react';
import { formatDateLabel } from '../utils';

interface HiringTableProps {
  hiring: HiringCard[];
  stages: StageConfig[];
  filter: BoardFilter;
  onUpdateCard: (updatedCard: HiringCard) => void;
  onAddCard: (card: Partial<HiringCard>) => void;
  onRowClick: (id: string) => void;
}

export const HiringTable: React.FC<HiringTableProps> = ({
  hiring,
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
  const [newCandidateName, setNewCandidateName] = useState('');

  const filteredHiring = hiring.filter(h => {
    const q = (localSearch || filter.searchQuery).toLowerCase();
    if (!q) return true;
    return (h.clientName || '').toLowerCase().includes(q) || (h.roleAppliedFor || '').toLowerCase().includes(q);
  });

  const handleEditStart = (e: React.MouseEvent, id: string, field: string, initialValue: string) => {
    e.stopPropagation();
    setEditingCell({ id, field });
    setEditValue(initialValue || '');
  };

  const handleEditCommit = (card: HiringCard) => {
    if (editingCell) {
      if ((card as any)[editingCell.field] !== editValue) {
        onUpdateCard({ ...card, [editingCell.field]: editValue });
      }
      setEditingCell(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, card: HiringCard) => {
    if (e.key === 'Enter') handleEditCommit(card);
    if (e.key === 'Escape') setEditingCell(null);
  };

  const handleStageChange = (e: React.MouseEvent, card: HiringCard, newStageId: string) => {
    e.stopPropagation();
    onUpdateCard({ ...card, stageId: newStageId });
    setShowStageDropdown(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCandidateName.trim()) {
      onAddCard({
        clientName: newCandidateName.trim(),
        roleAppliedFor: 'New Role',
        stageId: stages[0].id,
      });
      setNewCandidateName('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Filter candidates..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-64 px-3 py-1.5 text-sm bg-white border border-[oklch(90%_0.01_95)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)]"
        />
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl border border-[oklch(90%_0.01_95)] shadow-xs">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[oklch(98%_0.005_95)] sticky top-0 z-10 text-[oklch(48%_0.01_95)] font-medium">
            <tr>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Candidate Name</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Role</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Contact</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Next Step</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {filteredHiring.map((card) => {
              const stage = stages.find(s => s.id === card.stageId);
              return (
                <tr
                  key={card.id}
                  onClick={() => onRowClick(card.id)}
                  className="group hover:bg-[oklch(98%_0.005_95)] transition-colors border-b border-[oklch(95%_0.01_95)] last:border-0 cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-medium text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === card.id && editingCell?.field === 'clientName' ? (
                      <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleEditCommit(card)} onKeyDown={(e) => handleEditKeyDown(e, card)} onClick={(e) => e.stopPropagation()} className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none" />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, card.id, 'clientName', card.clientName)} className="hover:bg-white/50 px-1 -mx-1 rounded truncate max-w-[200px]">
                        {card.clientName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === card.id && editingCell?.field === 'roleAppliedFor' ? (
                      <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleEditCommit(card)} onKeyDown={(e) => handleEditKeyDown(e, card)} onClick={(e) => e.stopPropagation()} className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none" />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, card.id, 'roleAppliedFor', card.roleAppliedFor)} className="hover:bg-white/50 px-1 -mx-1 rounded">
                        {card.roleAppliedFor || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === card.id && editingCell?.field === 'contact' ? (
                      <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleEditCommit(card)} onKeyDown={(e) => handleEditKeyDown(e, card)} onClick={(e) => e.stopPropagation()} className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none" />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, card.id, 'contact', card.contact)} className="hover:bg-white/50 px-1 -mx-1 rounded">
                        {card.contact || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[oklch(48%_0.01_95)]">
                    {formatDateLabel(card.nextStepDate)}
                  </td>
                  <td className="px-4 py-2.5 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowStageDropdown(showStageDropdown === card.id ? null : card.id); }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: stage?.chipColor || '#ccc' }}
                    >
                      {stage?.name}
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>
                    {showStageDropdown === card.id && (
                      <div className="absolute top-full left-4 mt-1 bg-white border border-[oklch(90%_0.01_95)] shadow-md rounded-lg py-1 z-20 min-w-[140px]">
                        {stages.map(s => (
                          <button key={s.id} onClick={(e) => handleStageChange(e, card, s.id)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-[oklch(98%_0.005_95)] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.chipColor }} />
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-[oklch(99%_0.005_95)] sticky bottom-0 border-t border-[oklch(90%_0.01_95)]">
            <tr>
              <td colSpan={5} className="p-0">
                <form onSubmit={handleAddSubmit} className="flex items-center px-4 py-2 hover:bg-[oklch(98%_0.005_95)]">
                  <Plus className="w-4 h-4 text-[oklch(48%_0.01_95)] mr-2" />
                  <input type="text" value={newCandidateName} onChange={(e) => setNewCandidateName(e.target.value)} placeholder="New candidate..." className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-[oklch(28%_0.01_95)] placeholder:text-[oklch(68%_0.01_95)] placeholder:font-normal" />
                </form>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
