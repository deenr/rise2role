import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplication, KanbanCategory, KanbanDecisionStatus } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobApplicationDialog } from './JobApplicationDialog';

export function KanbanBoardCard({
  id,
  role,
  companyInformation,
  locationInformation,
  skills,
  color = 'red',
  status
  // category,
  // percentage
}: {
  id: string;
  role: string;
  companyInformation: string;
  locationInformation: string;
  skills: string[];
  color: 'gray' | 'blue' | 'fuchsia' | 'red' | 'green' | 'amber';
  category?: KanbanCategory;
  status?: string;
  percentage?: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

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

  // const getPercentageBadgeColor = (): string => {
  //   if (!percentage) return backgroundColors['gray'];
  //   if (percentage >= 80) {
  //     return backgroundColors['green'];
  //   } else if (percentage >= 50 && percentage < 80) {
  //     return backgroundColors['amber'];
  //   } else {
  //     return backgroundColors['red'];
  //   }
  // };

  const getHeaderBadgeColor = (): string => {
    switch (status) {
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

  return (
    <JobApplicationDialog
      onClose={function (job: JobApplication): void {
        console.log(job);
      }}
    >
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className={`w-full rounded-md ${isDragging ? 'border-dashed opacity-80' : ''}`}>
          <div className={`${isDragging ? 'invisible' : 'visible'}`}>
            <CardHeader>
              {status && <Badge className={`w-fit ${getHeaderBadgeColor()}`}>{status}</Badge>}
              <CardTitle>{role}</CardTitle>
              <CardDescription>{companyInformation}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>{locationInformation}</CardDescription>
              <CardDescription>
                <span className={`${textColors[color]} font-medium`}>{skills[0]}</span> &#x2022; {skills.slice(1, 3).join(' \u2022 ')}
              </CardDescription>
            </CardContent>
            {/* <CardFooter className="flex justify-end border-t pt-3">
        <Badge className={getPercentageBadgeColor()}>{percentage ? `${percentage}%` : <Loader className="h-4 animate-spin" />}</Badge>
        </CardFooter> */}
          </div>
        </Card>
      </div>
    </JobApplicationDialog>
  );
}
