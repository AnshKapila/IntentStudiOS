import { BoardCard, LeadCard, ProjectCard, UrgencyLevel } from './types';

// Get today's YYYY-MM-DD string
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateUrgency(card: BoardCard, boardType: string): UrgencyLevel {
  const todayStr = getTodayDateString();
  let targetDateStr: string | undefined;

  if (boardType === 'leads') {
    targetDateStr = (card as LeadCard).nextFollowUpDate;
  } else if (boardType === 'projects') {
    targetDateStr = (card as ProjectCard).deliverableDueDate;
  } else if (boardType === 'hiring') {
    targetDateStr = (card as any).nextStepDate;
  } else if (boardType === 'earnings') {
    targetDateStr = (card as any).dueDate;
  }

  if (!targetDateStr) return 'normal';

  // Compare YYYY-MM-DD strings directly or convert to timestamps
  if (targetDateStr < todayStr) {
    return 'overdue';
  } else if (targetDateStr === todayStr) {
    return 'today';
  } else {
    // Check if within next 3 days
    const today = new Date(todayStr);
    const target = new Date(targetDateStr);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 0 && diffDays <= 3) {
      return 'upcoming';
    }
    return 'normal';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateLabel(dateStr?: string): string {
  if (!dateStr) return 'No date';
  const todayStr = getTodayDateString();
  if (dateStr === todayStr) return 'Today';
  
  const today = new Date(todayStr);
  const target = new Date(dateStr);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;

  const dateObj = new Date(dateStr + 'T00:00:00');
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
