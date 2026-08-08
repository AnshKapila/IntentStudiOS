import React, { useState } from 'react';
import { BoardCard, BoardType, LeadCard, ProjectCard, HiringCard, EarningsCard, StageConfig, ChecklistItem, CustomField } from '../types';
import { formatCurrency, getInitials } from '../utils';
import { X, Trash2, Calendar, DollarSign, User, CheckSquare, Plus, Users, ShieldAlert, FileText, Link, Database } from 'lucide-react';

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
  const isProject = boardType === 'projects';
  const isHiring = boardType === 'hiring';
  const isEarnings = boardType === 'earnings';

  const lead = isLead ? (card as LeadCard) : null;
  const project = isProject ? (card as ProjectCard) : null;
  const hiring = isHiring ? (card as HiringCard) : null;
  const earnings = isEarnings ? (card as EarningsCard) : null;

  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCollaboratorName, setNewCollaboratorName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Custom field states
  const [showAddCustomField, setShowAddCustomField] = useState(false);
  const [newCustomFieldLabel, setNewCustomFieldLabel] = useState('');
  const [newCustomFieldValue, setNewCustomFieldValue] = useState('');
  const [newCustomFieldDesc, setNewCustomFieldDesc] = useState('');

  const handleFieldChange = (field: string, value: any) => {
    onUpdate({
      ...card,
      [field]: value,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

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

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomFieldLabel.trim() || !newCustomFieldValue.trim()) return;
    
    const newField: CustomField = {
      id: 'cf-' + Date.now(),
      label: newCustomFieldLabel.trim(),
      value: newCustomFieldValue.trim(),
      description: newCustomFieldDesc.trim() || undefined,
    };
    
    handleFieldChange('customFields', [...(card.customFields || []), newField]);
    setNewCustomFieldLabel('');
    setNewCustomFieldValue('');
    setNewCustomFieldDesc('');
    setShowAddCustomField(false);
  };

  const renderRescheduleHelper = (count: number) => {
    if (count === 0) return 'No delays logged';
    if (count === 1) return '1 reschedule (Neutral)';
    if (count === 2) return '2 reschedules (Soft Amber)';
    if (count === 3) return '3 reschedules (Soft Orange)';
    return `${count}th delay - close or hold (Soft Red)`;
  };

  const renderValueWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const currentStage = stages.find(s => s.id === card.stageId);

  return (
    <div className="bg-white rounded-xl elevation-base overflow-hidden animate-in fade-in zoom-in-95 duration-150 ease-out-expo">
      
      {/* Header Section */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: currentStage?.chipColor || '#2D2C2A' }}
          />
          <select
            value={card.stageId}
            onChange={(e) => handleFieldChange('stageId', e.target.value)}
            className="text-[11px] font-mono font-medium text-[oklch(28%_0.01_95)] bg-[oklch(98%_0.005_95)] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)]"
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
          className="p-1 rounded-md text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] hover:bg-[oklch(98%_0.005_95)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-4 pt-0">
        
        {/* Client Name Input */}
        <div>
          <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
            Client Name
          </label>
          <input
            type="text"
            value={card.clientName}
            onChange={(e) => handleFieldChange('clientName', e.target.value)}
            className="w-full text-card-title text-[oklch(28%_0.01_95)] bg-[oklch(98%_0.005_95)] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] focus:bg-white transition-all"
            placeholder="Enter client name"
          />
        </div>

        {/* LEADS BOARD SPECIFIC FIELDS */}
        {isLead && lead && (
          <div className="grid grid-cols-1 gap-3 bg-[oklch(98%_0.005_95)] p-3 rounded-lg">
            {/* Deal Value */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                Deal Value
              </label>
              <input
                type="number"
                value={lead.dealValue || ''}
                onChange={(e) => handleFieldChange('dealValue', Number(e.target.value))}
                className="w-full text-[14px] font-mono font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="0"
              />
            </div>

            {/* Next Follow-up Date */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Next Follow-up
              </label>
              <input
                type="date"
                value={lead.nextFollowUpDate || ''}
                onChange={(e) => handleFieldChange('nextFollowUpDate', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
              />
            </div>

            {/* Reschedule Counter */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Reschedule Delay
              </label>
              <div className="flex flex-col gap-2 bg-white p-2 rounded-lg elevation-base">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('rescheduleCount', Math.max(0, (lead.rescheduleCount || 0) - 1))}
                    className="w-7 h-7 rounded-md bg-[oklch(98%_0.005_95)] font-semibold text-[14px] hover:bg-[oklch(95%_0.005_95)] cursor-pointer flex items-center justify-center transition-colors text-[oklch(28%_0.01_95)]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-[14px] font-mono font-semibold text-[oklch(28%_0.01_95)]">
                    {lead.rescheduleCount || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('rescheduleCount', (lead.rescheduleCount || 0) + 1)}
                    className="w-7 h-7 rounded-md bg-[oklch(98%_0.005_95)] font-semibold text-[14px] hover:bg-[oklch(95%_0.005_95)] cursor-pointer flex items-center justify-center transition-colors text-[oklch(28%_0.01_95)]"
                  >
                    +
                  </button>
                </div>
                <div className="text-[13px] font-medium text-[oklch(48%_0.01_95)]">
                  {renderRescheduleHelper(lead.rescheduleCount || 0)}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5" />
                Contact Info
              </label>
              <input
                type="text"
                value={lead.contact || ''}
                onChange={(e) => handleFieldChange('contact', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="e.g. alex@client.com"
              />
            </div>
          </div>
        )}

        {/* PROJECTS BOARD SPECIFIC FIELDS */}
        {!isLead && project && (
          <div className="space-y-3 bg-[oklch(98%_0.005_95)] p-3 rounded-lg">
            {/* Service Type Tag */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
                Service Type
              </label>
              <select
                value={project.serviceType || 'web'}
                onChange={(e) => handleFieldChange('serviceType', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
              >
                <option value="web">web</option>
                <option value="video">video</option>
                <option value="branding+UIUX">branding+UIUX</option>
                <option value="app">app</option>
              </select>
            </div>

            {/* Next Deliverable */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
                Next Deliverable
              </label>
              <input
                type="text"
                value={project.nextDeliverable || ''}
                onChange={(e) => handleFieldChange('nextDeliverable', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="e.g. Design Specs"
              />
            </div>

            {/* Deliverable Due Date */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Due Date
              </label>
              <input
                type="date"
                value={project.deliverableDueDate || ''}
                onChange={(e) => handleFieldChange('deliverableDueDate', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
              />
            </div>

            {/* Collaborators */}
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5" />
                Collaborators
              </label>
              
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {(project.collaborators || []).map((collab, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white elevation-base rounded-md text-[13px] font-medium text-[oklch(28%_0.01_95)]"
                  >
                    <span className="w-4 h-4 rounded-full bg-[oklch(28%_0.01_95)] text-white text-[9px] font-semibold flex items-center justify-center">
                      {getInitials(collab)}
                    </span>
                    {collab}
                    <button
                      onClick={() => handleRemoveCollaborator(collab)}
                      className="text-[oklch(48%_0.01_95)] hover:text-rose-600 ml-0.5 cursor-pointer"
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
                  placeholder="Add collab..."
                  className="flex-1 text-[14px] font-medium bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[oklch(28%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(38%_0.01_95)] cursor-pointer elevation-base transition-colors"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HIRING BOARD SPECIFIC FIELDS */}
        {isHiring && hiring && (
          <div className="grid grid-cols-1 gap-3 bg-[oklch(98%_0.005_95)] p-3 rounded-lg">
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
                Role Applied For
              </label>
              <input
                type="text"
                value={hiring.roleAppliedFor || ''}
                onChange={(e) => handleFieldChange('roleAppliedFor', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="e.g. Senior Designer"
              />
            </div>
            
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Next Step Date
              </label>
              <input
                type="date"
                value={hiring.nextStepDate || ''}
                onChange={(e) => handleFieldChange('nextStepDate', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
              />
            </div>

            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5" />
                Contact Info
              </label>
              <input
                type="text"
                value={hiring.contact || ''}
                onChange={(e) => handleFieldChange('contact', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="e.g. Portfolio link, email..."
              />
            </div>
          </div>
        )}

        {/* EARNINGS BOARD SPECIFIC FIELDS */}
        {isEarnings && earnings && (
          <div className="grid grid-cols-1 gap-3 bg-[oklch(98%_0.005_95)] p-3 rounded-lg">
            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
                Linked Project Name
              </label>
              <input
                type="text"
                value={earnings.linkedProjectName || ''}
                onChange={(e) => handleFieldChange('linkedProjectName', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="e.g. Website Redesign"
              />
            </div>

            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                Amount
              </label>
              <input
                type="number"
                value={earnings.amount || ''}
                onChange={(e) => handleFieldChange('amount', Number(e.target.value))}
                className="w-full text-[14px] font-mono font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="0"
              />
            </div>

            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
                Payment Method
              </label>
              <input
                type="text"
                value={earnings.paymentMethod || ''}
                onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                placeholder="e.g. Razorpay, Bank Transfer"
              />
            </div>

            <div>
              <label className="chip-stage text-[oklch(48%_0.01_95)] flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Due Date
              </label>
              <input
                type="date"
                value={earnings.dueDate || ''}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                className="w-full text-[14px] font-medium text-[oklch(28%_0.01_95)] bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
              />
            </div>
          </div>
        )}

        {/* Custom Fields Component (Leads & Projects only) */}
        {(isLead || isProject) && (
          <div className="space-y-2 pt-1 pb-1">
            <h4 className="chip-stage text-[oklch(28%_0.01_95)] flex items-center gap-1.5 pb-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Custom Fields</span>
            </h4>
            
            <div className="flex flex-col gap-2">
              {(card.customFields || []).map(field => (
                <div key={field.id} className="flex flex-col gap-0.5">
                  <div className="text-[13px] font-semibold text-[oklch(28%_0.01_95)]">
                    {field.label}
                  </div>
                  <div className="text-[14px] text-[oklch(28%_0.01_95)] leading-relaxed">
                    {renderValueWithLinks(field.value)}
                  </div>
                  {field.description && (
                    <div className="text-[13px] text-[oklch(48%_0.01_95)] mt-0.5">
                      {field.description}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAddCustomField ? (
              <form onSubmit={handleAddCustomField} className="flex flex-col gap-2 mt-2 bg-[oklch(98%_0.005_95)] p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Field Label (e.g. Budget Range)"
                  value={newCustomFieldLabel}
                  onChange={(e) => setNewCustomFieldLabel(e.target.value)}
                  className="w-full text-[13px] font-semibold bg-white rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                />
                <input
                  type="text"
                  placeholder="Value (URLs become links)"
                  value={newCustomFieldValue}
                  onChange={(e) => setNewCustomFieldValue(e.target.value)}
                  className="w-full text-[14px] font-medium bg-white rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newCustomFieldDesc}
                  onChange={(e) => setNewCustomFieldDesc(e.target.value)}
                  className="w-full text-[13px] font-medium bg-white rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] elevation-base"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCustomField(false);
                      setNewCustomFieldLabel('');
                      setNewCustomFieldValue('');
                      setNewCustomFieldDesc('');
                    }}
                    className="px-2.5 py-1.5 text-[13px] font-medium text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newCustomFieldLabel.trim() || !newCustomFieldValue.trim()}
                    className="px-3 py-1.5 bg-[oklch(28%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(38%_0.01_95)] disabled:opacity-50 cursor-pointer elevation-base transition-colors"
                  >
                    Save Field
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddCustomField(true)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-[oklch(48%_0.01_95)] hover:text-[oklch(28%_0.01_95)] mt-1 transition-colors cursor-pointer w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add field</span>
              </button>
            )}
          </div>
        )}

        {/* Short Notes */}
        <div>
          <label className="chip-stage text-[oklch(48%_0.01_95)] block mb-1">
            Short Notes
          </label>
          <textarea
            rows={3}
            value={card.shortNotes || ''}
            onChange={(e) => handleFieldChange('shortNotes', e.target.value)}
            placeholder="Add key context, budget notes, or call summaries..."
            className="w-full text-body-notes text-[oklch(28%_0.01_95)] bg-[oklch(98%_0.005_95)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] focus:bg-white resize-none transition-all"
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between pb-1.5">
            <h4 className="chip-stage text-[oklch(28%_0.01_95)] flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Action Checklist</span>
            </h4>
            <span className="text-metadata font-mono">
              {(card.checklist || []).filter(c => c.completed).length} / {(card.checklist || []).length} done
            </span>
          </div>

          <div className="space-y-1.5">
            {(card.checklist || []).map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[oklch(98%_0.005_95)] hover:bg-white hover:elevation-base transition-all"
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1 text-[14px] font-medium">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="w-4 h-4 rounded text-[oklch(28%_0.01_95)] focus:ring-0 accent-[oklch(28%_0.01_95)]"
                  />
                  <span className={item.completed ? 'line-through text-[oklch(60%_0.01_95)]' : 'text-[oklch(28%_0.01_95)]'}>
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

          <form onSubmit={handleAddChecklist} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add actionable item..."
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              className="flex-1 text-[14px] font-medium bg-[oklch(98%_0.005_95)] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[oklch(28%_0.01_95)] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!newChecklistText.trim()}
              className="px-3 py-1.5 bg-[oklch(28%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(38%_0.01_95)] disabled:opacity-50 cursor-pointer elevation-base transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer / Delete Bar */}
      <div className="p-4 bg-[oklch(98%_0.005_95)] flex items-center justify-between">
        <span className="text-metadata">
          Updated: {card.updatedAt || 'Recently'}
        </span>

        {showConfirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="chip-stage text-rose-600">Delete?</span>
            <button
              onClick={() => onDelete(card.id)}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-[13px] font-medium hover:bg-rose-700 cursor-pointer elevation-base transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 bg-white text-[oklch(28%_0.01_95)] rounded-md text-[13px] font-medium cursor-pointer elevation-base hover:bg-[oklch(98%_0.005_95)] transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="flex items-center gap-1.5 px-2 py-1 text-metadata hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
