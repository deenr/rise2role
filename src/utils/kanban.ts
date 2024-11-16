import { JobApplication, KanbanBoardSections, KanbanCategory } from '@/types';

export const initializeBoard = (jobs: JobApplication[]): KanbanBoardSections => {
  const boardSections: KanbanBoardSections = {
    [KanbanCategory.INTERESTED]: [],
    [KanbanCategory.APPLIED]: [],
    [KanbanCategory.INTERVIEW]: [],
    [KanbanCategory.DECISION]: []
  };

  jobs.forEach((job) => boardSections[job.category]?.push(job));

  return boardSections;
};
