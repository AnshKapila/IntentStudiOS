import React, { useState } from 'react';
import { BoardCard, BoardType, LeadCard, ProjectCard, StageConfig, ChecklistItem } from '../types';
import { formatCurrency, getInitials } from '../utils';
import { X, Trash2, Calendar, DollarSign, User, CheckSquare, Plus, AlertCircle, Users, Check } from 'lucide-react';

interface InlineCardDetailProps {
  card: BoardCard | null;
  boardType: BoardType;
  stages: StageConfig[];
  onClose: () => void;
  onUpdate: (updatedCard: BoardCard) => void;
  onDelete: (cardId: string) => void;
}

export const InlineCardDetail: React.FC<InlineCardDetailProps> = ({
  card,
  boardType,
  stages,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!card) return null;

  const isLead = boardType === 'leads';
  const lead = isLead ? (card as LeadCard) : null;
  const project = !isLead ? (card as ProjectCard) : null;

  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCollaboratorName, setNewCollaboratorName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Field change handlers with immediate parent update
  const handleFieldChange = (field: string, value: any) => {
    onUpdate({
      ...card,
      [field]: value,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  // Checklist handlers
  const handleToggleChecklist = (itemId: string) => {
    const updated = (card.checklist || []).map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    handleFieldChange('checklist', updated);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem: ChecklistItem = {
      id: 'chk-' + Date.now(),
      text: newChecklistText.trim(),
      completed: false,
    };

    handleFieldChange('checklist', [...(card.checklist || []), newItem]);
    setNewChecklistText('');
  };

  const handleDeleteChecklist = (itemId: string) => {
    const updated = (card.checklist || []).filter(item => item.id !== itemId);
    handleFieldChange('checklist', updated);
  };

  // Collaborator handlers (for Projects)
  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollaboratorName.trim() || !project) return;
    const updatedCollabs = [...(project.collaborators || []), newCollaboratorName.trim()];
    handleFieldChange('collaborators', updatedCollabs);
    setNewCollaboratorName('');
  };

  const handleRemoveCollaborator = (nameToRemove: string) => {
    if (!project) return;
    const updatedCollabs = (project.collaborators || []).filter(name => name !== nameToRemove);
    handleFieldChange('collaborators', updatedCollabs);
  };

  const currentStage = stages.find(s => s.id === card.stageId);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white border-l border-[#E8E6E1] shadow-2xl z-30 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
      
      {/* Header Section */}
      <div>
        <div className="p-4 border-b border-[#E8E6E1] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentStage?.color || '#2D2C2A' }}
            />
            <select
              value={card.stageId}
              onChange={(e) => handleFieldChange('stageId', e.target.value)}
              className="text-[11px] font-mono font-medium text-[#2D2C2A] bg-[#FAF9F6] border border-[#E8E6E1] rounded px-2 py-1 focus:outline-none focus:border-[#2D2C2A]"
            >
              {stages.map(s => (
                <option key={s.id} value={s.id}>
                  Stage: {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#706F6C] hover:text-[#1A1A18] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-line-ch">
          
          {/* Client Name Input */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#706F6C] block mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={card.clientName}
              onChange={(e) => handleFieldChange('clientName', e.target.value)}
              className="w-full text-[18px] font-bold text-[#1A1A18] border-b border-[#E8E6E1] focus:border-[#2D2C2A] focus:outline-none pb-1 bg-transparent"
              placeholder="Enter client name"
            />
          </div>

          {/* LEADS BOARD SPECIFIC FIELDS */}
          {isLead && lead && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[oklch(98%_0.005_95)] p-3 rounded-lg border border-[oklch(90%_0.006_95)]">
              {/* Deal Value */}
              <div>
                <label className="chip-stage text-[oklch(45%_0.01_95)] flex items-center gap-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-[oklch(45%_0.01_95)]" />
                  Deal Value (₹ / $)
                </label>
                <input
                  type="number"
                  value={lead.dealValue || ''}
                  onChange={(e) => handleFieldChange('dealValue', Number(e.target.value))}
                  className="w-full text-[13px] font-mono font-semibold text-[oklch(20%_0.01_95)] bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                  placeholder="0"
                />
              </div>

              {/* Next Follow-up Date */}
              <div>
                <label className="chip-stage text-[oklch(45%_0.01_95)] flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[oklch(45%_0.01_95)]" />
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={lead.nextFollowUpDate || ''}
                  onChange={(e) => handleFieldChange('nextFollowUpDate', e.target.value)}
                  className="w-full text-[13px] font-medium text-[oklch(20%_0.01_95)] bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                />
              </div>

              {/* Reschedule Counter & Escalation Preview */}
              <div className="sm:col-span-2">
                <label className="chip-stage text-[oklch(45%_0.01_95)] flex items-center gap-1 mb-1">
                  Reschedule Count (Delay Escalation)
                </label>
                <div className="flex items-center gap-3 bg-white p-2 rounded border border-[oklch(90%_0.006_95)]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('rescheduleCount', Math.max(0, (lead.rescheduleCount || 0) - 1))}
                      className="w-7 h-7 rounded border border-[oklch(90%_0.006_95)] bg-[oklch(98%_0.005_95)] font-semibold text-[14px] hover:bg-[oklch(92%_0.005_95)] cursor-pointer flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-[13px] font-mono font-semibold">
                      {lead.rescheduleCount || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('rescheduleCount', (lead.rescheduleCount || 0) + 1)}
                      className="w-7 h-7 rounded border border-[oklch(90%_0.006_95)] bg-[oklch(98%_0.005_95)] font-semibold text-[14px] hover:bg-[oklch(92%_0.005_95)] cursor-pointer flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-[12px] font-medium text-[oklch(45%_0.01_95)]">
                    {lead.rescheduleCount === 0 && <span className="text-[oklch(45%_0.01_95)]">No delays logged</span>}
                    {lead.rescheduleCount === 1 && <span className="text-[oklch(45%_0.01_95)]">1 reschedule (Neutral)</span>}
                    {lead.rescheduleCount === 2 && <span className="text-[oklch(45%_0.14_80)] font-semibold">2 reschedules (Amber Badge)</span>}
                    {lead.rescheduleCount === 3 && <span className="text-[oklch(45%_0.15_50)] font-semibold">3 reschedules (Orange Badge)</span>}
                    {(lead.rescheduleCount || 0) >= 4 && <span className="text-[oklch(45%_0.16_25)] font-semibold">{lead.rescheduleCount || 4}th delay - close or hold (Red Badge)</span>}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="sm:col-span-2">
                <label className="chip-stage text-[oklch(45%_0.01_95)] flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-[oklch(45%_0.01_95)]" />
                  Contact Info / Channel
                </label>
                <input
                  type="text"
                  value={lead.contact || ''}
                  onChange={(e) => handleFieldChange('contact', e.target.value)}
                  className="w-full text-[13px] font-medium text-[oklch(20%_0.01_95)] bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                  placeholder="e.g. alex@client.com | +1 (555) 019-2831"
                />
              </div>
            </div>
          )}

          {/* PROJECTS BOARD SPECIFIC FIELDS */}
          {!isLead && project && (
            <div className="space-y-3 bg-[oklch(98%_0.005_95)] p-3 rounded-lg border border-[oklch(90%_0.006_95)]">
              {/* Service Type Tag */}
              <div>
                <label className="chip-stage text-[oklch(45%_0.01_95)] block mb-1">
                  Service Type Tag
                </label>
                <select
                  value={project.serviceType || 'web'}
                  onChange={(e) => handleFieldChange('serviceType', e.target.value)}
                  className="w-full text-[13px] font-medium text-[oklch(20%_0.01_95)] bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                >
                  <option value="web">web</option>
                  <option value="video">video</option>
                  <option value="branding+UIUX">branding+UIUX</option>
                  <option value="app">app</option>
                </select>
              </div>

              {/* Next Deliverable */}
              <div>
                <label className="chip-stage text-[oklch(45%_0.01_95)] block mb-1">
                  Next Deliverable Description
                </label>
                <input
                  type="text"
                  value={project.nextDeliverable || ''}
                  onChange={(e) => handleFieldChange('nextDeliverable', e.target.value)}
                  className="w-full text-[13px] font-medium text-[oklch(20%_0.01_95)] bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                  placeholder="e.g. Design System Tokens & Specs"
                />
              </div>

              {/* Deliverable Due Date */}
              <div>
                <label className="chip-stage text-[oklch(45%_0.01_95)] flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[oklch(45%_0.01_95)]" />
                  Next Deliverable Due Date
                </label>
                <input
                  type="date"
                  value={project.deliverableDueDate || ''}
                  onChange={(e) => handleFieldChange('deliverableDueDate', e.target.value)}
                  className="w-full text-[13px] font-medium text-[oklch(20%_0.01_95)] bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                />
              </div>

              {/* Collaborators */}
              <div>
                <label className="chip-stage text-[oklch(45%_0.01_95)] flex items-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-[oklch(45%_0.01_95)]" />
                  Collaborator(s)
                </label>
                
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {(project.collaborators || []).map((collab, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[oklch(90%_0.006_95)] rounded text-[12px] font-medium text-[oklch(20%_0.01_95)]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[oklch(20%_0.01_95)] text-white text-[9px] font-semibold flex items-center justify-center">
                        {getInitials(collab)}
                      </span>
                      {collab}
                      <button
                        onClick={() => handleRemoveCollaborator(collab)}
                        className="text-[oklch(45%_0.01_95)] hover:text-rose-600 ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddCollaborator} className="flex gap-1.5">
                  <input
                    type="text"
                    value={newCollaboratorName}
                    onChange={(e) => setNewCollaboratorName(e.target.value)}
                    placeholder="Add collaborator..."
                    className="flex-1 text-[13px] font-medium bg-white border border-[oklch(90%_0.006_95)] rounded px-2.5 py-1 focus:outline-none focus:border-[oklch(20%_0.01_95)]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[oklch(20%_0.01_95)] text-white rounded text-[12px] font-medium hover:bg-[oklch(30%_0.01_95)] cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Short Notes */}
          <div>
            <label className="chip-stage text-[oklch(45%_0.01_95)] block mb-1">
              Short Notes
            </label>
            <textarea
              rows={4}
              value={card.shortNotes || ''}
              onChange={(e) => handleFieldChange('shortNotes', e.target.value)}
              placeholder="Add key context, budget notes, or call summaries..."
              className="w-full text-body-notes text-[oklch(20%_0.01_95)] bg-[oklch(98%_0.005_95)] border border-[oklch(90%_0.006_95)] rounded-lg p-3 focus:outline-none focus:border-[oklch(20%_0.01_95)] focus:bg-white resize-none"
            />
          </div>

          {/* Checklist / Action Items Sub-Module */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-[oklch(90%_0.006_95)] pb-1.5">
              <h4 className="chip-stage text-[oklch(20%_0.01_95)] flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[oklch(20%_0.01_95)]" />
                <span>Action Checklist</span>
              </h4>
              <span className="text-metadata font-mono">
                {(card.checklist || []).filter(c => c.completed).length} / {(card.checklist || []).length} done
              </span>
            </div>

            {/* List */}
            <div className="space-y-1.5">
              {(card.checklist || []).map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[oklch(98%_0.005_95)] border border-[oklch(90%_0.006_95)] hover:bg-white transition-colors"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 text-[13px] font-medium">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="w-4 h-4 rounded text-[oklch(20%_0.01_95)] focus:ring-0 accent-[oklch(20%_0.01_95)]"
                    />
                    <span className={item.completed ? 'line-through text-[oklch(60%_0.01_95)]' : 'text-[oklch(20%_0.01_95)]'}>
                      {item.text}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteChecklist(item.id)}
                    className="text-[oklch(60%_0.01_95)] hover:text-rose-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Checklist Item */}
            <form onSubmit={handleAddChecklist} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add actionable checklist item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 text-[13px] font-medium bg-[oklch(98%_0.005_95)] border border-[oklch(90%_0.006_95)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[oklch(20%_0.01_95)] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!newChecklistText.trim()}
                className="px-3 py-1.5 bg-[oklch(20%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(30%_0.01_95)] disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Footer / Delete Bar */}
      <div className="p-4 border-t border-[oklch(90%_0.006_95)] bg-[oklch(98%_0.005_95)] flex items-center justify-between">
        <span className="text-metadata">
          Updated: {card.updatedAt || 'Recently'}
        </span>

        {showConfirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="chip-stage text-rose-600">Delete Card?</span>
            <button
              onClick={() => onDelete(card.id)}
              className="px-2.5 py-1 bg-rose-600 text-white rounded text-[12px] font-medium hover:bg-rose-700 cursor-pointer"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 bg-[oklch(90%_0.006_95)] text-[oklch(20%_0.01_95)] rounded text-[12px] font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="flex items-center gap-1.5 px-2 py-1 text-metadata text-[oklch(45%_0.01_95)] hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Card</span>
          </button>
        )}
      </div>

    </div>
  );
};
