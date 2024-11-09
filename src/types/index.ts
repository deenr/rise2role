export const KanbanCategories = ['interested', 'applied', 'interview', 'decision', 'accepted', 'denied'] as const;

export enum KanbanCategory {
  INTERESTED = 'interested',
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  DECISION = 'decision'
}

export enum KanbanDecisionStatus {
  DENIED = 'denied',
  ACCEPTED = 'accepted',
  OFFER = 'offer'
}

export type KanbanBoardSections = Record<KanbanCategory, JobApplication[]>;

export interface JobApplication {
  id: string;
  role: string;
  company: string[];
  location: string[];
  skills: string[];
  category: KanbanCategory;
  status?: string | KanbanDecisionStatus;
  percentage?: number;
}
