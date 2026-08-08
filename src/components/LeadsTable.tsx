import React, { useState } from 'react';
import { LeadCard, StageConfig, BoardFilter, ChecklistItem } from '../types';
import { formatCurrency, getInitials } from '../utils';
import { Settings, Plus, ChevronDown } from 'lucide-react';

interface LeadsTableProps {
  leads: LeadCard[];
  stages: StageConfig[];
  filter: BoardFilter;
  onUpdateCard: (updatedCard: LeadCard) => void;
  onAddCard: (card: Partial<LeadCard>) => void;
  onRowClick: (leadId: string) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
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
  
  const [newLeadName, setNewLeadName] = useState('');

  const filteredLeads = leads.filter(l => {
    const q = (localSearch || filter.searchQuery).toLowerCase();
    if (!q) return true;
    return l.clientName.toLowerCase().includes(q) || l.contact.toLowerCase().includes(q);
  });

  const handleEditStart = (e: React.MouseEvent, id: string, field: string, initialValue: string) => {
    e.stopPropagation();
    setEditingCell({ id, field });
    setEditValue(initialValue);
  };

  const handleEditCommit = (lead: LeadCard) => {
    if (editingCell) {
      if ((lead as any)[editingCell.field] !== editValue) {
        onUpdateCard({ ...lead, [editingCell.field]: editValue });
      }
      setEditingCell(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, lead: LeadCard) => {
    if (e.key === 'Enter') handleEditCommit(lead);
    if (e.key === 'Escape') setEditingCell(null);
  };

  const handleStageChange = (e: React.MouseEvent, lead: LeadCard, newStageId: string) => {
    e.stopPropagation();
    onUpdateCard({ ...lead, stageId: newStageId });
    setShowStageDropdown(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLeadName.trim()) {
      onAddCard({
        clientName: newLeadName.trim(),
        stageId: stages[0].id,
        dealValue: 10000,
      });
      setNewLeadName('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Filter leads by client or contact..."
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
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Client</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Contact</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Stage</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Deal Value</th>
              <th className="px-4 py-3 border-b border-[oklch(90%_0.01_95)] font-medium">Next Follow-Up</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => {
              const stage = stages.find(s => s.id === lead.stageId);
              return (
                <tr
                  key={lead.id}
                  onClick={() => onRowClick(lead.id)}
                  className="group hover:bg-[oklch(98%_0.005_95)] transition-colors border-b border-[oklch(95%_0.01_95)] last:border-0 cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-medium text-[oklch(28%_0.01_95)]">
                    {editingCell?.id === lead.id && editingCell?.field === 'clientName' ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditCommit(lead)}
                        onKeyDown={(e) => handleEditKeyDown(e, lead)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, lead.id, 'clientName', lead.clientName)} className="hover:bg-white/50 px-1 -mx-1 rounded">
                        {lead.clientName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[oklch(48%_0.01_95)]">
                    {editingCell?.id === lead.id && editingCell?.field === 'contact' ? (
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditCommit(lead)}
                        onKeyDown={(e) => handleEditKeyDown(e, lead)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white border border-[oklch(80%_0.01_95)] rounded px-2 py-0.5 focus:outline-none"
                      />
                    ) : (
                      <div onClick={(e) => handleEditStart(e, lead.id, 'contact', lead.contact || '')} className="hover:bg-white/50 px-1 -mx-1 rounded truncate max-w-[200px]">
                        {lead.contact || <span className="opacity-50 italic">Add contact...</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowStageDropdown(showStageDropdown === lead.id ? null : lead.id); }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: stage?.chipColor || '#ccc' }}
                    >
                      {stage?.name}
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>
                    {showStageDropdown === lead.id && (
                      <div className="absolute top-full left-4 mt-1 bg-white border border-[oklch(90%_0.01_95)] shadow-md rounded-lg py-1 z-20 min-w-[140px]">
                        {stages.map(s => (
                          <button
                            key={s.id}
                            onClick={(e) => handleStageChange(e, lead, s.id)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-[oklch(98%_0.005_95)] flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.chipColor }} />
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[oklch(48%_0.01_95)] text-xs">
                    {formatCurrency(lead.dealValue, lead.currency)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[oklch(48%_0.01_95)] text-xs">
                    {lead.nextFollowUpDate}
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
                  <input
                    type="text"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="New lead..."
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
