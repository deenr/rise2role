import { JobApplication, KanbanCategory } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { JobApplicationDialog } from './JobApplicationDialog';
import { KanbanBoardCard } from './KanbanBoardCard';
import { Badge } from './ui/badge';

export function KanbanBoardColumn({
  id,
  title,
  category,
  jobs,
  color = 'gray',
  className,
  onJobAdd
}: {
  id: string;
  title: string;
  category: KanbanCategory;
  jobs: JobApplication[];
  color: 'gray' | 'blue' | 'fuchsia' | 'amber';
  className?: string;
  onJobAdd: (job: JobApplication) => void;
}) {
  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <header className="relative flex min-h-10 flex-row items-center rounded-lg border bg-card px-3">
        <span className="text-card-foreground">{title}</span>
        {jobs.length > 0 && <Badge className="ml-2 bg-indigo-500 px-1.5 hover:bg-indigo-500">{jobs.length}</Badge>}
        <JobApplicationDialog category={category} onClose={onJobAdd}>
          <Plus className="absolute right-0 top-1/2 aspect-square h-10 w-10 -translate-y-1/2 cursor-pointer p-2.5 text-muted-foreground hover:text-card-foreground" />
        </JobApplicationDialog>
      </header>
      <SortableContext id={id} items={jobs} strategy={verticalListSortingStrategy}>
        <section className="flex h-full flex-col gap-2 rounded-lg border bg-muted p-2" ref={setNodeRef}>
          {jobs.map((job) => (
            <KanbanBoardCard
              key={job.id}
              {...job}
              companyInformation={`${job.company.name} / ${job.company.size} / ${job.company.industry}`}
              locationInformation={[job?.onSite && 'On-site', job?.hybrid && 'Hybrid', job?.remote && 'Remote'].filter(Boolean).join(' / ')}
              status={
                category === KanbanCategory.INTERVIEW && 'status' in job && typeof job.status === 'object'
                  ? `Round ${job.status.round} ${job.status.description ? `(${job.status.description})` : ''}`
                  : category === KanbanCategory.DECISION && 'status' in job && typeof job.status === 'string'
                    ? job.status
                    : ''
              }
              color={color}
            />
          ))}
        </section>
      </SortableContext>
    </div>
  );
}
