import { KanbanCategory, KanbanDecisionStatus } from '@/types';

export const INITIAL_JOBS = [
  {
    id: 'a1b2c3d4',
    role: 'Backend Developer',
    company: ['TechCorp', 'Enterprise', 'Software'],
    location: ['Berlin', 'Hybrid'],
    skills: ['Node.js', 'Express', 'MongoDB'],
    category: KanbanCategory.INTERESTED,
    percentage: 50
  },
  {
    id: 'i9j0k1l2',
    role: 'Senior TypeScript developer',
    company: ['SaboIT', 'Startup', 'SaaS'],
    location: ['Prague 4', 'Remote'],
    skills: ['TypeScript', 'React', 'Firebase'],
    category: KanbanCategory.APPLIED,
    percentage: 75
  },
  {
    id: 'e5f6g7h8',
    role: 'Senior FE developer',
    company: ['Lolo.team', 'Startup', 'SaaS'],
    location: ['Prague 3', 'On-site', 'Remote'],
    skills: ['Next.js', 'React', 'Firebase'],
    status: 'Round 1',
    category: KanbanCategory.INTERVIEW,
    percentage: 99
  },
  {
    id: 'm3n4o5p6',
    role: 'Next.js FE developer',
    company: ['Seznam.cz', 'Agency', 'Media'],
    location: ['Prague 5', 'On-site'],
    skills: ['Next.js', 'React', 'Docker'],
    status: 'Round 2 (Technical)',
    category: KanbanCategory.INTERVIEW,
    percentage: 20
  },
  {
    id: 'q7r8s9t0',
    role: 'Full Stack Engineer',
    company: ['Stripe', 'Financial Tech', 'Payments'],
    location: ['New York', 'Hybrid', 'Remote'],
    skills: ['Node.js', 'Java', 'Ruby'],
    category: KanbanCategory.DECISION,
    status: KanbanDecisionStatus.DENIED
  },
  {
    id: 'u1v2w3x4',
    role: 'Full Stack Engineer',
    company: ['Stripe', 'Financial Tech', 'Payments'],
    location: ['New York', 'Hybrid', 'Remote'],
    skills: ['Node.js', 'Java', 'Ruby'],
    category: KanbanCategory.DECISION,
    status: KanbanDecisionStatus.ACCEPTED
  },
  {
    id: 'y5z6a7b8',
    role: 'Full Stack Engineer',
    company: ['Stripe', 'Financial Tech', 'Payments'],
    location: ['New York', 'Hybrid', 'Remote'],
    skills: ['Node.js', 'Java', 'Ruby'],
    category: KanbanCategory.DECISION,
    status: KanbanDecisionStatus.OFFER
  }
];
