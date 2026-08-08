export type BoardType = 'leads' | 'projects';

export type ServiceType = 'web' | 'video' | 'branding+UIUX' | 'app';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StageConfig {
  id: string;
  name: string;
  chipColor: string; // CSS OKLCH or hex stage chip color
  bgTint?: string;
}

export interface BaseCard {
  id: string;
  clientName: string;
  shortNotes: string;
  stageId: string;
  owner: string; // Owner initials (e.g., "AK")
  createdAt: string;
  updatedAt: string;
  checklist?: ChecklistItem[];
}

export interface LeadCard extends BaseCard {
  contact: string;
  dealValue: number;
  nextFollowUpDate: string; // YYYY-MM-DD
  rescheduleCount: number; // 0, 1, 2, 3, 4+
}

export interface ProjectCard extends BaseCard {
  serviceType: ServiceType;
  collaborators: string[]; // List of names/initials
  nextDeliverable: string;
  deliverableDueDate?: string; // YYYY-MM-DD
}

export type BoardCard = LeadCard | ProjectCard;

export interface BoardFilter {
  searchQuery: string;
  urgencyOnly: boolean;
  sortBy: 'date' | 'value' | 'name';
}

export type UrgencyLevel = 'overdue' | 'today' | 'upcoming' | 'normal';
