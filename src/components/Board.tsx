import React, { useState } from 'react';
import { BoardCard, BoardType, StageConfig, BoardFilter, LeadCard, ProjectCard, EarningsCard } from '../types';
import { calculateUrgency, formatCurrency } from '../utils';
import { CardItem } from './CardItem';
import { InlineAddCard } from './InlineAddCard';
import { InlineCardDetail } from './InlineCardDetail';
import { ProjectsTable } from './ProjectsTable';
import { LeadsTable } from './LeadsTable';
import { EarningsTable } from './EarningsTable';
import { Drawer } from './Drawer';
import { FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardProps {
  boardType: BoardType;
  stages: StageConfig[];
  cards: BoardCard[];
  filter: BoardFilter;
  onUpdateCard: (updatedCard: BoardCard) => void;
  onDeleteCard: (cardId: string) => void;
  onAddCard: (card: Omit<BoardCard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClearFilters?: () => void;
  view?: 'table' | 'kanban';
}

export const Board: React.FC<BoardProps> = ({
  boardType,
  stages,
  cards,
  filter,
  onUpdateCard,
  onDeleteCard,
  onAddCard,
  onClearFilters,
  view = 'kanban',
}) => {
  const isLead = boardType === 'leads';
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCard = selectedCardId ? cards.find(c => c.id === selectedCardId) : null;
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  const handleSelectCard = (id: string) => {
    setSelectedCardId(prev => prev === id ? null : id);
  };

  const handleMoveCard = (cardId: string, newStageId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      onUpdateCard({ ...card, stageId: newStageId });
    }
  };

  const filteredCards = cards.filter(card => {
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchName = card.clientName?.toLowerCase().includes(q) ?? false;
      const matchNotes = card.shortNotes?.toLowerCase().includes(q) ?? false;
      const matchContact = isLead ? (card as LeadCard).contact?.toLowerCase().includes(q) : false;
      const matchDeliverable = boardType === 'projects' ? (card as ProjectCard).nextDeliverable?.toLowerCase().includes(q) : false;
      const matchRole = boardType === 'hiring' ? (card as any).roleAppliedFor?.toLowerCase().includes(q) : false;
      const matchCandidateContact = boardType === 'hiring' ? (card as any).contact?.toLowerCase().includes(q) : false;
      const matchProject = boardType === 'earnings' ? (card as any).linkedProjectName?.toLowerCase().includes(q) : false;
      const matchMethod = boardType === 'earnings' ? (card as any).paymentMethod?.toLowerCase().includes(q) : false;

      if (!matchName && !matchNotes && !matchContact && !matchDeliverable && !matchRole && !matchCandidateContact && !matchProject && !matchMethod) {
        return false;
      }
    }

    if (filter.urgencyOnly) {
      const urgency = calculateUrgency(card, boardType);
      if (urgency !== 'overdue' && urgency !== 'today') {
        return false;
      }
    }

    return true;
  });

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
      handleMoveCard(cardId, stageId);
      setDraggedCardId(null);
    }
  };

  const renderTableView = () => {
    if (boardType === 'projects') {
      return (
        <div className="flex flex-col h-full overflow-hidden bg-[oklch(99%_0.005_95)] relative">
          <UrgencyBanner boardType={boardType} cards={cards} onSelectCard={setSelectedCardId} />
          <ProjectsTable
            projects={filteredCards as ProjectCard[]}
            stages={stages}
            filter={filter}
            onUpdateCard={(card) => onUpdateCard(card)}
            onAddCard={onAddCard}
            onRowClick={(id) => setSelectedCardId(id)}
          />
        </div>
      );
    }
    if (boardType === 'leads') {
      return (
        <div className="flex flex-col h-full overflow-hidden bg-[oklch(99%_0.005_95)] relative">
          <UrgencyBanner boardType={boardType} cards={cards} onSelectCard={setSelectedCardId} />
          <LeadsTable
            leads={filteredCards as LeadCard[]}
            stages={stages}
            filter={filter}
            onUpdateCard={(card) => onUpdateCard(card)}
            onAddCard={onAddCard}
            onRowClick={(id) => setSelectedCardId(id)}
          />
        </div>
      );
    }
    if (boardType === 'earnings') {
      return (
        <div className="flex flex-col h-full overflow-hidden bg-[oklch(99%_0.005_95)] relative">
          <UrgencyBanner boardType={boardType} cards={cards} onSelectCard={setSelectedCardId} />
          <EarningsTable
            earnings={filteredCards as EarningsCard[]}
            stages={stages}
            filter={filter}
            onUpdateCard={(card) => onUpdateCard(card)}
            onAddCard={onAddCard}
            onRowClick={(id) => setSelectedCardId(id)}
          />
        </div>
      );
    }
    return null;
  };

  const renderKanbanView = () => (
    <div className="flex-1 overflow-x-auto p-6 min-h-[calc(100vh-80px)]">
      <div className="flex items-start gap-6 min-w-max pb-8">
        {stages.map((stage) => {
          const stageCards = filteredCards.filter(c => c.stageId === stage.id);
          const totalCardsInStage = cards.filter(c => c.stageId === stage.id).length;

          const stageDealValueSum = isLead
            ? stageCards.reduce((acc, c) => acc + ((c as LeadCard).dealValue || 0), 0)
            : 0;

          const stageEarningsSum = boardType === 'earnings'
            ? stageCards.reduce((acc, c) => acc + ((c as any).amount || 0), 0)
            : 0;

          const isDropTarget = dragOverStageId === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-[300px] flex-shrink-0 flex flex-col rounded-2xl bg-[oklch(98%_0.005_95)] transition-all duration-150 border-0 ${
                isDropTarget ? 'ring-2 ring-[oklch(28%_0.01_95)] bg-white' : ''
              }`}
            >
              
              <div className="p-4 bg-[oklch(98%_0.005_95)] rounded-t-2xl sticky top-0 z-10 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="title-column text-[oklch(28%_0.01_95)]">
                      {stage.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="chip-stage px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: stage.chipColor }}
                    >
                      {stage.name}
                    </span>
                    <span className="text-[12px] font-mono font-medium text-[oklch(48%_0.01_95)] px-1.5 py-0.5 rounded bg-white elevation-base">
                      {totalCardsInStage}
                    </span>
                  </div>
                </div>

                {isLead && (
                  <div className="text-metadata font-mono font-medium text-[oklch(48%_0.01_95)] pt-0.5">
                    {stageDealValueSum > 0 ? `${formatCurrency(stageDealValueSum)} in stage` : '₹0 in stage'}
                  </div>
                )}
                
                {boardType === 'earnings' && (
                  <div className="text-metadata font-mono font-medium text-[oklch(48%_0.01_95)] pt-0.5">
                    {stageEarningsSum > 0 ? `${formatCurrency(stageEarningsSum)} total` : '₹0 total'}
                  </div>
                )}
              </div>

              <div className="p-4 pt-0 space-y-3 overflow-y-auto flex-1 min-h-[160px]">
                {stageCards.length === 0 ? (
                  <div className="py-12 text-center text-metadata text-[oklch(48%_0.01_95)] select-none">
                    {filter.searchQuery || filter.urgencyOnly
                      ? 'No matching items'
                      : isLead ? 'No leads here yet' : 'No projects here yet'}
                  </div>
                ) : (
                  stageCards.map((card) => (
                    <div key={card.id} className="flex flex-col gap-2">
                      <CardItem
                        card={card}
                        boardType={boardType}
                        stages={stages}
                        isSelected={selectedCardId === card.id}
                        onSelectCard={handleSelectCard}
                        onMoveStage={handleMoveCard}
                        onDragStart={handleDragStart}
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-[oklch(98%_0.005_95)] rounded-b-2xl">
                <InlineAddCard
                  stageId={stage.id}
                  stageName={stage.name}
                  boardType={boardType}
                  onAdd={(stageId, clientName, extraField, currency) => {
                    if (isLead) {
                      onAddCard({ stageId, clientName, dealValue: extraField ? Number(extraField) : 10000, currency } as any);
                    } else if (boardType === 'projects') {
                      onAddCard({ stageId, clientName, nextDeliverable: extraField } as any);
                    } else if (boardType === 'hiring') {
                      onAddCard({ stageId, clientName, roleAppliedFor: extraField } as any);
                    } else {
                      onAddCard({ stageId, clientName, amount: extraField ? Number(extraField) : 0, currency } as any);
                    }
                  }}
                />
              </div>

            </div>
          );
        })}
      </div>

      {filteredCards.length === 0 && (filter.searchQuery || filter.urgencyOnly) && (
        <div className="max-w-md mx-auto my-12 p-6 bg-white elevation-base rounded-2xl text-center space-y-3">
          <p className="title-card text-[oklch(28%_0.01_95)]">
            No {boardType} match your current filter settings.
          </p>
          <p className="text-metadata">
            Try clearing search term or toggling off the Attention filter.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[oklch(28%_0.01_95)] text-white rounded-lg text-[13px] font-medium hover:bg-[oklch(38%_0.01_95)] cursor-pointer transition-colors elevation-base"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {view === 'table' ? renderTableView() : renderKanbanView()}
      <Drawer
        isOpen={!!selectedCard}
        onClose={() => setSelectedCardId(null)}
        title={selectedCard?.clientName || 'Details'}
      >
        {selectedCard && (
          <InlineCardDetail
            card={selectedCard}
            boardType={boardType}
            stages={stages}
            onClose={() => setSelectedCardId(null)}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        )}
      </Drawer>
    </>
  );
};
