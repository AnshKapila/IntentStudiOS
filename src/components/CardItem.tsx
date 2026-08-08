import React from 'react';
import { BoardCard, BoardType, LeadCard, ProjectCard, HiringCard, EarningsCard, StageConfig } from '../types';
import { formatCurrency, formatDateLabel } from '../utils';

interface CardItemProps {
  card: BoardCard;
  boardType: BoardType;
  stages: StageConfig[];
  isSelected: boolean;
  onSelectCard: (id: string) => void;
  onMoveStage: (cardId: string, newStageId: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  boardType,
  isSelected,
  onSelectCard,
  onDragStart,
}) => {
  const isLead = boardType === 'leads';
  const isProject = boardType === 'projects';
  const isHiring = boardType === 'hiring';
  const isEarnings = boardType === 'earnings';

  const lead = isLead ? (card as LeadCard) : null;
  const project = isProject ? (card as ProjectCard) : null;
  const hiring = isHiring ? (card as HiringCard) : null;
  const earnings = isEarnings ? (card as EarningsCard) : null;

  // Format Plain-text Metadata Row (Row 2) - No icon pills allowed
  // For Leads, we also append the reschedule badge as plain text if count > 0
  let rescheduleText = '';
  if (isLead && lead && lead.rescheduleCount > 0) {
    if (lead.rescheduleCount === 1) rescheduleText = ' · 1 reschedule';
    else if (lead.rescheduleCount === 2) rescheduleText = ' · 2 reschedules';
    else if (lead.rescheduleCount === 3) rescheduleText = ' · 3 reschedules';
    else rescheduleText = ` · ${lead.rescheduleCount}th delay - close or hold`;
  }

  let metadataText = '';
  if (isLead && lead) {
    metadataText = [
      lead.dealValue ? formatCurrency(lead.dealValue) : null,
      lead.nextFollowUpDate ? `Follow up ${formatDateLabel(lead.nextFollowUpDate)}` : null,
    ].filter(Boolean).join(' · ') + rescheduleText;
  } else if (isProject && project) {
    metadataText = [
      project.serviceType ? project.serviceType : null,
      project.nextDeliverable ? project.nextDeliverable : (project.deliverableDueDate ? `Due ${formatDateLabel(project.deliverableDueDate)}` : null),
    ].filter(Boolean).join(' · ');
  } else if (isHiring && hiring) {
    metadataText = [
      hiring.roleAppliedFor ? hiring.roleAppliedFor : null,
      hiring.nextStepDate ? `Next step ${formatDateLabel(hiring.nextStepDate)}` : null,
    ].filter(Boolean).join(' · ');
  } else if (isEarnings && earnings) {
    metadataText = [
      earnings.amount ? formatCurrency(earnings.amount) : null,
      earnings.linkedProjectName ? earnings.linkedProjectName : null,
      earnings.dueDate ? `Due ${formatDateLabel(earnings.dueDate)}` : null,
    ].filter(Boolean).join(' · ');
  }

  // Calculate if dragging (we apply elevation-drag via class active:elevation-drag)
  // Actually, we can use Tailwind classes or just simple elevation classes.

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Add a class temporarily or just let native drag handle it
        e.currentTarget.classList.add('opacity-50');
        onDragStart(e, card.id);
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('opacity-50');
      }}
      onClick={() => onSelectCard(card.id)}
      className={`relative bg-white rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all duration-150 ease-out-expo hover:elevation-hover active:elevation-drag ${
        isSelected ? 'ring-2 ring-[oklch(28%_0.01_95)] elevation-hover' : 'elevation-base'
      }`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="title-card text-[oklch(28%_0.01_95)] truncate">
          {card.clientName}
        </h3>

        {metadataText && (
          <div className="text-metadata truncate">
            {metadataText}
          </div>
        )}
      </div>
    </div>
  );
};
