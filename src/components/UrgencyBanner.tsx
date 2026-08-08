import React from 'react';
import { BoardCard, BoardType, LeadCard, ProjectCard } from '../types';
import { calculateUrgency, formatDateLabel } from '../utils';
import { AlertCircle, Clock, ChevronRight } from 'lucide-react';

interface UrgencyBannerProps {
  cards: BoardCard[];
  boardType: BoardType;
  onSelectCard: (id: string) => void;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({
  cards,
  boardType,
  onSelectCard,
}) => {
  const isLead = boardType === 'leads';

  // Filter urgent cards (overdue or today)
  const urgentCards = cards
    .map(card => ({ card, urgency: calculateUrgency(card, boardType) }))
    .filter(item => item.urgency === 'overdue' || item.urgency === 'today');

  if (urgentCards.length === 0) return null;

  return (
    <div className="bg-[#FFFDF9] border-b border-amber-200/80 px-4 lg:px-8 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] text-amber-900 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-800">
            {urgentCards.length} {urgentCards.length === 1 ? 'item requires' : 'items require'} attention
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {urgentCards.slice(0, 4).map(({ card, urgency }) => {
            const dateStr = isLead
              ? (card as LeadCard).nextFollowUpDate
              : (card as ProjectCard).deliverableDueDate;

            return (
              <button
                key={card.id}
                onClick={() => onSelectCard(card.id)}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-amber-200 hover:border-amber-400 text-[11px] font-medium text-[#2D2C2A] shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${urgency === 'overdue' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className="font-bold text-[12px]">{card.clientName}</span>
                <span className="text-[#706F6C] font-mono text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#706F6C]" />
                  {formatDateLabel(dateStr)}
                </span>
                <ChevronRight className="w-3 h-3 text-[#706F6C]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
