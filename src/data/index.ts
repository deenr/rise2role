import { JobApplication, KanbanCategory, KanbanDecisionStatus } from '@/types';

export const INITIAL_JOBS: JobApplication[] = [
  {
    id: 'a1b2c3d4',
    role: 'Backend Developer',
    company: {
      name: 'TechCorp',
      size: 'Enterprise',
      industry: 'Software'
    },
    location: 'Berlin',
    onSite: false,
    hybrid: true,
    remote: false,
    skills: ['Node.js', 'Express', 'MongoDB'],
    category: KanbanCategory.INTERESTED,
    percentage: 50
  },
  {
    id: 'i9j0k1l2',
    role: 'Senior TypeScript Developer',
    company: {
      name: 'SaboIT',
      size: 'Startup',
      industry: 'SaaS'
    },
    location: 'Prague 4',
    onSite: false,
    hybrid: false,
    remote: true,
    skills: ['TypeScript', 'React', 'Firebase'],
    category: KanbanCategory.APPLIED,
    percentage: 75
  },
  {
    id: 'e5f6g7h8',
    role: 'Senior FE Developer',
    company: {
      name: 'Lolo.team',
      size: 'Startup',
      industry: 'SaaS'
    },
    location: 'Prague 3',
    onSite: true,
    hybrid: false,
    remote: true,
    skills: ['Next.js', 'React', 'Firebase'],
    category: KanbanCategory.INTERVIEW,
    status: {
      round: 1
    },
    percentage: 99
  },
  {
    id: 'm3n4o5p6',
    role: 'Next.js FE Developer',
    company: {
      name: 'Seznam.cz',
      size: 'Agency',
      industry: 'Media'
    },
    location: 'Prague 5',
    onSite: true,
    hybrid: false,
    remote: false,
    skills: ['Next.js', 'React', 'Docker'],
    category: KanbanCategory.INTERVIEW,
    status: {
      round: 2,
      description: 'Technical'
    },
    percentage: 20
  },
  {
    id: 'q7r8s9t0',
    role: 'Full Stack Engineer',
    company: {
      name: 'Stripe',
      size: 'Financial Tech',
      industry: 'Payments'
    },
    location: 'New York',
    onSite: true,
    hybrid: true,
    remote: true,
    skills: ['Node.js', 'Java', 'Ruby'],
    category: KanbanCategory.DECISION,
    status: KanbanDecisionStatus.DENIED
  },
  {
    id: 'u1v2w3x4',
    role: 'Full Stack Engineer',
    company: {
      name: 'Stripe',
      size: 'Financial Tech',
      industry: 'Payments'
    },
    location: 'New York',
    onSite: true,
    hybrid: true,
    remote: true,
    skills: ['Node.js', 'Java', 'Ruby'],
    category: KanbanCategory.DECISION,
    status: KanbanDecisionStatus.ACCEPTED
  },
  {
    id: 'y5z6a7b8',
    role: 'Full Stack Engineer',
    company: {
      name: 'Stripe',
      size: 'Financial Tech',
      industry: 'Payments'
    },
    location: 'New York',
    onSite: true,
    hybrid: true,
    remote: true,
    skills: ['Node.js', 'Java', 'Ruby'],
    category: KanbanCategory.DECISION,
    status: KanbanDecisionStatus.OFFER
  }
];
