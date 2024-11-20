export enum KanbanCategory {
  INTERESTED = 'INTERESTED',
  APPLIED = 'APPLIED',
  INTERVIEW = 'INTERVIEW',
  DECISION = 'DECISION'
}

export enum KanbanDecisionStatus {
  DENIED = 'DENIED',
  ACCEPTED = 'ACCEPTED',
  OFFER = 'OFFER'
}

export type KanbanBoardSections = Record<KanbanCategory, JobApplication[]>;

export interface BaseJobApplication {
  id: string;
  role: string;
  category: KanbanCategory;
  company: {
    name: string;
    size: string;
    industry: string;
  };
  location: string;
  onSite: boolean;
  hybrid: boolean;
  remote: boolean;
  skills: string[];
  url?: string;
  percentage?: number;
}

export interface InterestedJobApplication extends BaseJobApplication {
  status?: never;
}

export interface AppliedJobApplication extends BaseJobApplication {
  status?: never;
}

export interface InterviewJobApplication extends BaseJobApplication {
  status: {
    round: number;
    description?: string;
  };
}

export interface DecisionJobApplication extends BaseJobApplication {
  status: KanbanDecisionStatus;
}

export type JobApplication = InterestedJobApplication | AppliedJobApplication | InterviewJobApplication | DecisionJobApplication;
