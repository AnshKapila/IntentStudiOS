import React, { useState } from 'react';
import { BoardCard, BoardType, LeadCard, ProjectCard, StageConfig } from '../types';
import { formatCurrency, formatDateLabel, getInitials } from '../utils';
import { MoreHorizontal, CheckSquare } from 'lucide-react';

interface CardItemProps {
  card: BoardCard;
  boardType: BoardType;
  stages: StageConfig[];
  isSelected: boolean;
  onSelectCard: (id: string) => void;
  onMoveStage: (cardId: string, newStageId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  boardType,
  stages,
  isSelected,
  onSelectCard,
  onMoveStage,
  onDragStart,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isLead = boardType === 'leads';
  const lead = isLead ? (card as LeadCard) : null;
  const project = !isLead ? (card as ProjectCard) : null;

  // Calculate completed checklist count
  const totalChecklist = card.checklist?.length || 0;
  const completedChecklist = card.checklist?.filter(c => c.completed).length || 0;

  // Format Plain-text Metadata Row (Row 2) - No icon pills allowed
  const metadataText = isLead && lead
    ? [
        lead.dealValue ? formatCurrency(lead.dealValue) : null,
        lead.nextFollowUpDate ? `Follow up ${formatDateLabel(lead.nextFollowUpDate)}` : null,
      ].filter(Boolean).join(' · ')
    : project
    ? [
        project.serviceType ? project.serviceType : null,
        project.nextDeliverable ? project.nextDeliverable : (project.deliverableDueDate ? `Due ${formatDateLabel(project.deliverableDueDate)}` : null),
      ].filter(Boolean).join(' · ')
    : '';

  // Reschedule badge escalation for Leads (Row 3)
  const renderRescheduleBadge = (count: number) => {
    if (!count || count <= 0) return null;
    if (count === 1) {
      return (
        <span className="text-[12px] font-medium text-[oklch(45%_0.01_95)]">
          1 reschedule
        </span>
      );
    }
    if (count === 2) {
      return (
        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[oklch(95%_0.08_80)] text-[oklch(45%_0.14_80)] border border-[oklch(85%_0.12_80)]">
          2 reschedules
        </span>
      );
    }
    if (count === 3) {
      return (
        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[oklch(93%_0.12_50)] text-[oklch(45%_0.15_50)] border border-[oklch(80%_0.14_50)]">
          3 reschedules
        </span>
      );
    }
    const delayLabel = count === 4 ? '4th' : count === 5 ? '5th' : `${count}th`;
    return (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[oklch(93%_0.12_25)] text-[oklch(45%_0.16_25)] border border-[oklch(80%_0.14_25)]">
        {delayLabel} delay - close or hold
      </span>
    );
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={() => onSelectCard(card.id)}
      className={`card-hairline bg-[oklch(99.5%_0.004_95)] rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-white transition-all space-y-2 ${
        isSelected ? 'ring-2 ring-[oklch(20%_0.01_95)]' : ''
      }`}
    >
      {/* Row 1: Title (15px/600) + Overflow Menu */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="title-card text-[oklch(20%_0.01_95)] truncate">
          {card.clientName}
        </h3>

        {/* Overflow Menu / Quick Stage shift */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded text-[oklch(45%_0.01_95)] hover:text-[oklch(20%_0.01_95)] hover:bg-[oklch(95%_0.005_95)] transition-colors cursor-pointer"
            title="Card actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 w-44 bg-white rounded-md shadow-md border border-[oklch(90%_0.006_95)] py-1 z-30 animate-in fade-in duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-[oklch(45%_0.01_95)] font-mono border-b border-[oklch(92%_0.005_95)]">
                Move Stage
              </div>
              {stages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onMoveStage(card.id, s.id);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[12px] font-medium flex items-center justify-between hover:bg-[oklch(96%_0.005_95)] ${
                    card.stageId === s.id ? 'text-[oklch(20%_0.01_95)] font-semibold bg-[oklch(97%_0.005_95)]' : 'text-[oklch(45%_0.01_95)]'
                  }`}
                >
                  <span>{s.name}</span>
                  {card.stageId === s.id && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Plain-text metadata (13px/500) - No icon pills */}
      {metadataText && (
        <div className="text-metadata truncate">
          {metadataText}
        </div>
      )}

      {/* Row 3: 20px Circular Owner Initials + Reschedule Badge or Project Tags */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="flex items-center gap-2">
          {/* 20px circular owner initials */}
          <span
            className="w-5 h-5 rounded-full bg-[oklch(20%_0.01_95)] text-white text-[10px] font-semibold flex items-center justify-center shrink-0"
            title={`Owner: ${card.owner || 'AK'}`}
          >
            {card.owner || 'AK'}
          </span>

          {/* Lead reschedule badge */}
          {isLead && lead && renderRescheduleBadge(lead.rescheduleCount)}

          {/* Project Service Type chip if applicable */}
          {!isLead && project && project.serviceType && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[oklch(45%_0.01_95)] px-1.5 py-0.5 rounded bg-[oklch(95%_0.005_95)]">
              {project.serviceType}
            </span>
          )}
        </div>

        {/* Optional checklist counter indicator if checklist items exist */}
        {totalChecklist > 0 && (
          <span className="text-[11px] font-medium text-[oklch(45%_0.01_95)] flex items-center gap-1 font-mono">
            <CheckSquare className="w-3 h-3 text-[oklch(45%_0.01_95)]" />
            <span>{completedChecklist}/{totalChecklist}</span>
          </span>
        )}
      </div>
    </div>
  );
};
