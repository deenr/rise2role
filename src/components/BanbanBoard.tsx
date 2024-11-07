import { Loader, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

type BanbanCategory = 'interested' | 'applied' | 'interview' | 'decision' | 'accepted' | 'denied';

interface JobApplication {
  role: string;
  company: string[];
  location: string[];
  skills: string[];
  category: BanbanCategory;
  status?: string;
  percentage?: number;
}

export function BanbanBoard() {
  const jobs: JobApplication[] = DATA;

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      <BanbanColumn title="Interested">
        {jobs
          .filter((job) => job.category === 'interested')
          .map((job, index) => (
            <BanbanCard key={index} {...job} color="gray" />
          ))}
      </BanbanColumn>
      <BanbanColumn title="Applied">
        {jobs
          .filter((job) => job.category === 'applied')
          .map((job, index) => (
            <BanbanCard key={index} {...job} color="blue" />
          ))}
      </BanbanColumn>
      <BanbanColumn title="Interviews">
        {jobs
          .filter((job) => job.category === 'interview')
          .map((job, index) => (
            <BanbanCard key={index} {...job} color="fuchsia" />
          ))}
      </BanbanColumn>
      <BanbanColumn title="Decision">
        {jobs
          .filter((job) => job.category === 'decision' || job.category === 'denied' || job.category === 'accepted')
          .map((job, index) => (
            <BanbanCard key={index} {...job} color="amber" />
          ))}
      </BanbanColumn>
    </div>
  );
}

function BanbanColumn({ title, children }: { title: string; children: JSX.Element[] }) {
  return (
    <div className="flex flex-col gap-4">
      <header className="relative flex h-10 flex-row items-center rounded-lg border bg-card px-3">
        <span className="text-card-foreground">{title}</span>
        {children.length > 0 && <Badge className="ml-2 bg-indigo-500 px-1.5 hover:bg-indigo-500">{children.length}</Badge>}
        <Plus className="absolute right-0 top-1/2 aspect-square h-10 w-10 -translate-y-1/2 cursor-pointer p-2.5 text-muted-foreground hover:text-card-foreground" />
      </header>
      <section className="flex flex-col gap-2 rounded-lg border bg-muted p-2">{children}</section>
    </div>
  );
}

function BanbanCard({
  role,
  company,
  location,
  skills,
  color = 'red',
  category,
  status,
  percentage
}: {
  role: string;
  company: string[];
  location: string[];
  skills: string[];
  color: 'gray' | 'blue' | 'fuchsia' | 'red' | 'green' | 'amber';
  category?: BanbanCategory;
  status?: string;
  percentage?: number;
}) {
  const textColors = {
    gray: 'text-gray-600',
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

  const getPercentageBadgeColor = (): string => {
    if (!percentage) return backgroundColors['gray'];
    if (percentage >= 80) {
      return backgroundColors['green'];
    } else if (percentage >= 50 && percentage < 80) {
      return backgroundColors['amber'];
    } else {
      return backgroundColors['red'];
    }
  };
  const getHeaderBadgeColor = (): string => {
    switch (category) {
      case 'accepted':
        return backgroundColors['green'];
      case 'denied':
        return backgroundColors['red'];
      case 'decision':
        return backgroundColors['amber'];
      default:
        return backgroundColors['gray'];
    }
  };

  return (
    <Card className="w-full rounded-md">
      <CardHeader>
        {status && <Badge className={`w-fit ${getHeaderBadgeColor()}`}>{status}</Badge>}
        <CardTitle>{role}</CardTitle>
        <CardDescription>{company.join(' / ')}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{location.join(' / ')}</CardDescription>
        <CardDescription>
          <span className={textColors[color]}>{skills[0]}</span> &#x2022; {skills.slice(1, 3).join(' \u2022 ')}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-3">
        <Badge className={getPercentageBadgeColor()}>{percentage ? `${percentage}%` : <Loader className="h-4 animate-spin" />}</Badge>
      </CardFooter>
    </Card>
  );
}

const DATA = [
  {
    role: 'Backend Developer',
    company: ['TechCorp', 'Enterprise', 'Software'],
    location: ['Berlin', 'Hybrid'],
    skills: ['Node.js', 'Express', 'MongoDB'],
    category: 'interested' as BanbanCategory,
    percentage: 50
  },
  {
    role: 'Senior FE developer',
    company: ['Lolo.team', 'Startup', 'SaaS'],
    location: ['Prague 3', 'On-site', 'Remote'],
    skills: ['Next.js', 'React', 'Firebase'],
    status: 'Round 1',
    category: 'interview' as BanbanCategory,
    percentage: 99
  },
  {
    role: 'Senior TypeScript developer',
    company: ['SaboIT', 'Startup', 'SaaS'],
    location: ['Prague 4', 'Remote'],
    skills: ['TypeScript', 'React', 'Firebase'],
    category: 'applied' as BanbanCategory,
    percentage: 75
  },
  {
    role: 'Next.js FE developer',
    company: ['Seznam.cz', 'Agency', 'Media'],
    location: ['Prague 5', 'On-site'],
    skills: ['Next.js', 'React', 'Docker'],
    status: 'Round 2 (Technical)',
    category: 'interview' as BanbanCategory,
    percentage: 20
  },
  {
    role: 'Full Stack Engineer',
    company: ['Stripe', 'Financial Tech', 'Payments'],
    location: ['New York', 'Hybrid', 'Remote'],
    skills: ['Node.js', 'Java', 'Ruby'],
    category: 'denied' as BanbanCategory,
    status: 'Denied'
  },
  {
    role: 'Full Stack Engineer',
    company: ['Stripe', 'Financial Tech', 'Payments'],
    location: ['New York', 'Hybrid', 'Remote'],
    skills: ['Node.js', 'Java', 'Ruby'],
    category: 'accepted' as BanbanCategory,
    status: 'Accepted'
  },
  {
    role: 'Full Stack Engineer',
    company: ['Stripe', 'Financial Tech', 'Payments'],
    location: ['New York', 'Hybrid', 'Remote'],
    skills: ['Node.js', 'Java', 'Ruby'],
    category: 'decision' as BanbanCategory,
    status: 'Offer Received'
  }
];
