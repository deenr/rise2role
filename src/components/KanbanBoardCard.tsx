import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplication, KanbanCategory, KanbanDecisionStatus } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobApplicationDialog } from './JobApplicationDialog';

export function KanbanBoardCard({ job, color = 'red', onJobEdit }: { job: JobApplication; color: 'gray' | 'blue' | 'fuchsia' | 'red' | 'green' | 'amber'; onJobEdit?: (job: JobApplication) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });

  const textColors = {
    gray: 'text-gray-800',
    blue: 'text-blue-600',
    fuchsia: 'text-fuchsia-600',
    red: 'text-red-600',
    green: 'text-green-600',
    amber: 'text-amber-600'
  };

  const backgroundColors = {
    gray: 'bg-gray-500 hover:bg-gray-500',
    blue: 'bg-blue-500 hover:bg-blue-500',
    fuchsia: 'bg-fuchsia-500 hover:bg-fuchsia-500',
    red: 'bg-red-500 hover:bg-red-500',
    green: 'bg-green-500 hover:bg-green-500',
    amber: 'bg-amber-500 hover:bg-amber-500'
  };

  const getHeaderBadgeColor = (): string => {
    switch (job.status) {
      case KanbanDecisionStatus.ACCEPTED:
        return backgroundColors['green'];
      case KanbanDecisionStatus.DENIED:
        return backgroundColors['red'];
      case KanbanDecisionStatus.OFFER:
        return backgroundColors['amber'];
      default:
        return backgroundColors['gray'];
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const statusText =
    job.category === KanbanCategory.INTERVIEW && 'status' in job && typeof job.status === 'object'
      ? `Round ${job.status.round} ${job.status.description ? `(${job.status.description})` : ''}`
      : job.category === KanbanCategory.DECISION && 'status' in job && typeof job.status === 'string'
        ? job.status
        : '';

  return (
    <JobApplicationDialog
      category={job.category}
      job={job}
      onClose={(job: JobApplication) => {
        if (onJobEdit) onJobEdit(job);
      }}
    >
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className={`w-full rounded-md ${isDragging ? 'border-dashed opacity-80' : ''}`}>
          <div className={`${isDragging ? 'invisible' : 'visible'}`}>
            <CardHeader>
              {statusText && <Badge className={`w-fit ${getHeaderBadgeColor()}`}>{statusText}</Badge>}
              <CardTitle>{job.role}</CardTitle>
              <CardDescription>{`${job.company.name}${job.company.size ? ` / ${job.company.size}` : ''}${job.company.industry ? ` / ${job.company.industry}` : ''}`}</CardDescription>
            </CardHeader>
            {(job?.onSite || job?.hybrid || job?.remote || (job?.skills && job?.skills?.length > 0)) && (
              <CardContent>
                <CardDescription>{[job?.onSite && 'On-site', job?.hybrid && 'Hybrid', job?.remote && 'Remote'].filter(Boolean).join(' / ')}</CardDescription>
                {job?.skills && job?.skills?.length > 0 && (
                  <CardDescription>
                    <span className={`${textColors[color]} font-medium`}>{job.skills[0]}</span>
                    {job.skills.slice(1, 3).length > 0 && <> &#x2022; {job.skills.slice(1, 3).join(' \u2022 ')}</>}
                  </CardDescription>
                )}
              </CardContent>
            )}
          </div>
        </Card>
      </div>
    </JobApplicationDialog>
  );
}
