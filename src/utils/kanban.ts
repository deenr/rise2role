import { JobApplication, KanbanBoardSections, KanbanCategory } from '@/types';

export const initializeBoard = (jobs: JobApplication[]): KanbanBoardSections => {
  const boardSections: KanbanBoardSections = {
    [KanbanCategory.INTERESTED]: [],
    [KanbanCategory.APPLIED]: [],
    [KanbanCategory.INTERVIEW]: [],
    [KanbanCategory.DECISION]: []
  };

  jobs.forEach((job) => boardSections[job.category].push(job));

  return boardSections;
};

// export const findBoardSectionContainer = (boardSections: BoardSections, id: string) => {
//   if (id in boardSections) {
//     return id;
//   }

//   const container = Object.keys(boardSections).find((key) => boardSections[key].find((item) => item.id === id));
//   return container;
// };
