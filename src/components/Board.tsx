import React, { useState } from 'react';
import { BoardCard, BoardType, StageConfig, BoardFilter, LeadCard, ProjectCard } from '../types';
import { calculateUrgency, formatCurrency } from '../utils';
import { CardItem } from './CardItem';
import { InlineAddCard } from './InlineAddCard';
import { Plus, FilterX } from 'lucide-react';

interface BoardProps {
  boardType: BoardType;
  stages: StageConfig[];
  cards: BoardCard[];
  selectedCardId: string | null;
  filter: BoardFilter;
  onSelectCard: (id: string) => void;
  onMoveCard: (cardId: string, newStageId: string) => void;
  onAddCard: (stageId: string, clientName: string, extraField?: string) => void;
  onClearFilters?: () => void;
}

export const Board: React.FC<BoardProps> = ({
  boardType,
  stages,
  cards,
  selectedCardId,
  filter,
  onSelectCard,
  onMoveCard,
  onAddCard,
  onClearFilters,
}) => {
  const isLead = boardType === 'leads';
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // Filter cards based on search query and attention toggle
  const filteredCards = cards.filter(card => {
    // 1. Search Query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchName = card.clientName.toLowerCase().includes(q);
      const matchNotes = card.shortNotes.toLowerCase().includes(q);
      const matchContact = isLead ? (card as LeadCard).contact?.toLowerCase().includes(q) : false;
      const matchDeliverable = !isLead ? (card as ProjectCard).nextDeliverable?.toLowerCase().includes(q) : false;

      if (!matchName && !matchNotes && !matchContact && !matchDeliverable) {
        return false;
      }
    }

    // 2. Attention / Urgency Filter
    if (filter.urgencyOnly) {
      const urgency = calculateUrgency(card, isLead);
      if (urgency !== 'overdue' && urgency !== 'today') {
        return false;
      }
    }

    return true;
  });

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (dragOverStageId === stageId) {
      setDragOverStageId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStageId(null);
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;

    if (cardId) {
      onMoveCard(cardId, stageId);
      setDraggedCardId(null);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 min-h-[calc(100vh-80px)]">
      
      {/* Board Column Container with 24px gap between 300px fixed columns */}
      <div className="flex items-start gap-6 min-w-max pb-8">
        {stages.map((stage) => {
          const stageCards = filteredCards.filter(c => c.stageId === stage.id);
          const totalCardsInStage = cards.filter(c => c.stageId === stage.id).length;

          // Calculate stage sum for Leads
          const stageDealValueSum = isLead
            ? stageCards.reduce((acc, c) => acc + ((c as LeadCard).dealValue || 0), 0)
            : 0;

          const isDropTarget = dragOverStageId === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-[300px] flex-shrink-0 flex flex-col rounded-lg bg-[oklch(98%_0.005_95)] border border-[oklch(90%_0.006_95)] transition-all duration-150 ${
                isDropTarget
                  ? 'ring-2 ring-[oklch(20%_0.01_95)] bg-white'
                  : ''
              }`}
            >
              
              {/* Column Header */}
              <div className="p-4 border-b border-[oklch(90%_0.006_95)] bg-white rounded-t-lg sticky top-0 z-10 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="title-column text-[oklch(20%_0.01_95)]">
                      {stage.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Stage Label Chip - Stage color used ONLY here as small label chip */}
                    <span
                      className="chip-stage px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: stage.chipColor }}
                    >
                      {stage.name}
                    </span>
                    <span className="text-[12px] font-mono font-medium text-[oklch(45%_0.01_95)] px-1.5 py-0.5 rounded bg-[oklch(95%_0.005_95)] border border-[oklch(90%_0.006_95)]">
                      {totalCardsInStage}
                    </span>
                  </div>
                </div>

                {/* Stage Sum / Meta for LEADS */}
                {isLead && (
                  <div className="text-metadata font-mono font-medium text-[oklch(45%_0.01_95)] pt-0.5">
                    {stageDealValueSum > 0 ? `${formatCurrency(stageDealValueSum)} in stage` : '₹0 in stage'}
                  </div>
                )}
              </div>

              {/* Cards Scroll Region with 8px gap between cards */}
              <div className="p-4 space-y-2 overflow-y-auto flex-1 min-h-[160px]">
                {stageCards.length === 0 ? (
                  <div className="py-12 text-center text-metadata text-[oklch(45%_0.01_95)] select-none">
                    {filter.searchQuery || filter.urgencyOnly
                      ? 'No matching items'
                      : isLead ? 'No leads here yet' : 'No projects here yet'}
                  </div>
                ) : (
                  stageCards.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      boardType={boardType}
                      stages={stages}
                      isSelected={selectedCardId === card.id}
                      onSelectCard={onSelectCard}
                      onMoveStage={onMoveCard}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>

              {/* Column Footer: Inline Quick Add */}
              <div className="p-3 border-t border-[oklch(90%_0.006_95)] bg-white rounded-b-lg">
                <InlineAddCard
                  stageId={stage.id}
                  stageName={stage.name}
                  isLead={isLead}
                  onAdd={onAddCard}
                />
              </div>

            </div>
          );
        })}
      </div>

      {/* Filtered Empty State Notice */}
      {filteredCards.length === 0 && (filter.searchQuery || filter.urgencyOnly) && (
        <div className="max-w-md mx-auto my-12 p-6 bg-white border border-[oklch(90%_0.006_95)] rounded-lg text-center space-y-3">
          <p className="title-card text-[oklch(20%_0.01_95)]">
            No {boardType} match your current filter settings.
          </p>
          <p className="text-metadata">
            Try clearing search term or toggling off the Attention filter.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[oklch(20%_0.01_95)] text-white rounded text-[13px] font-medium hover:bg-[oklch(30%_0.01_95)] cursor-pointer transition-colors"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
