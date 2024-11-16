import { INITIAL_JOBS } from '@/data';
import { JobApplication, KanbanBoardSections, KanbanCategory } from '@/types';
import { initializeBoard } from '@/utils/kanban';
import { closestCorners, defaultDropAnimation, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, DropAnimation, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { KanbanBoardCard } from './KanbanBoardCard';
import { KanbanBoardColumn } from './KanbanBoardColumn';

export function KanbanBoard({ className, isPreview }: { className?: string; isPreview: boolean }) {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [kanbanBoardSections, setKanbanBoardSections] = useState<KanbanBoardSections>(initializeBoard(jobs));

  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  useEffect(() => {
    if (isPreview) {
      setJobs(INITIAL_JOBS);
    } else {
      const storedJobs = JSON.parse(localStorage.getItem('rise2role.jobs')!) ?? [];
      setJobs(storedJobs);
    }
  }, [isPreview]);

  useEffect(() => {
    setKanbanBoardSections(initializeBoard(jobs));
  }, [jobs]);

  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 20 } }));

  function findBoardSectionContainer(boardSections: KanbanBoardSections, id: string): KanbanCategory {
    if (id in boardSections) {
      return id as KanbanCategory;
    }

    return Object.keys(boardSections).find((category) => boardSections[category as KanbanCategory].find((item) => item.id === id)) as KanbanCategory;
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveJobId(active.id as string);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    // Find the containers
    const activeContainer = findBoardSectionContainer(kanbanBoardSections, active.id as string);
    const overContainer = findBoardSectionContainer(kanbanBoardSections, over?.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setKanbanBoardSections((prevBoardSections) => {
      const activeItems = prevBoardSections[activeContainer];
      const overItems = prevBoardSections[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === active.id);
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...prevBoardSections,
        [activeContainer]: [...prevBoardSections[activeContainer].filter((item) => item.id !== active.id)],
        [overContainer]: [
          ...prevBoardSections[overContainer].slice(0, overIndex),
          kanbanBoardSections[activeContainer][activeIndex],
          ...prevBoardSections[overContainer].slice(overIndex, prevBoardSections[overContainer].length)
        ]
      };
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const activeContainer = findBoardSectionContainer(kanbanBoardSections, active.id as string);
    const overContainer = findBoardSectionContainer(kanbanBoardSections, over?.id as string);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      return;
    }

    const activeIndex = kanbanBoardSections[activeContainer].findIndex((task) => task.id === active.id);
    const overIndex = kanbanBoardSections[overContainer].findIndex((task) => task.id === over?.id);

    setJobs((prevJobs) => prevJobs.map((task) => (task.id === active.id ? { ...task, category: overContainer } : task)));

    if (activeIndex !== overIndex) {
      setKanbanBoardSections((prevBoardSections) => ({
        ...prevBoardSections,
        [overContainer]: arrayMove(prevBoardSections[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveJobId(null);
  }

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation
  };

  const activeJob = jobs.find(({ id }) => id === activeJobId);

  const KANBAN_CATEGORIES = {
    [KanbanCategory.INTERESTED]: 'gray',
    [KanbanCategory.APPLIED]: 'blue',
    [KanbanCategory.INTERVIEW]: 'fuchsia',
    [KanbanCategory.DECISION]: 'amber'
  } as const;

  return (
    <div className={`grid grid-cols-[auto,auto,auto,auto] gap-4 ${className}`}>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        {Object.keys(kanbanBoardSections).map((category) => (
          <KanbanBoardColumn
            className="min-w-64"
            id={category as KanbanCategory}
            key={category}
            color={KANBAN_CATEGORIES[category as KanbanCategory]}
            jobs={kanbanBoardSections[category as KanbanCategory]}
            onJobAdd={(job) => setJobs((prevJobs) => [...prevJobs, job])}
            onJobEdit={(job) => setJobs((prevJobs) => prevJobs.map((prevJob) => (prevJob.id === job.id ? job : prevJob)))}
          ></KanbanBoardColumn>
        ))}
        <DragOverlay dropAnimation={dropAnimation}>{activeJob ? <KanbanBoardCard job={activeJob} color="gray" /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
