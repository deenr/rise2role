import { KanbanBoardColumn } from '@/components/KanbanBoardColumn';
import { JobApplication, KanbanCategory, KanbanDecisionStatus } from '@/types';
import { render, screen } from '@testing-library/react';

describe('KanbanBoardColumn', () => {
  const mockJob: JobApplication = {
    id: '1',
    role: 'Test Job',
    category: KanbanCategory.INTERESTED,
    company: {
      name: 'Test Company',
      size: 'Test Size',
      industry: 'Test Industry'
    },
    location: 'Test Location',
    onSite: true,
    hybrid: false,
    remote: false,
    skills: ['Test Skill'],
    status: KanbanDecisionStatus.OFFER
  };

  it('renders job application', () => {
    render(<KanbanBoardColumn id={KanbanCategory.INTERESTED} jobs={[mockJob]} color="gray" onJobAdd={() => {}} onJobEdit={() => {}} />);

    expect(screen.getByText('Test Job')).toBeInTheDocument();
  });
});
