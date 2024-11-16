import { Logo } from '@/components/icons/Logo';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Link, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isPreview = location.pathname.includes('preview');

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <header className="absolute left-0 right-0 top-6 flex w-full flex-row items-center justify-between gap-4 px-6">
        <Link to={'/'} className="w-fit">
          <Logo className="min-h-6 w-fit" />
        </Link>
        {isPreview ? (
          <p className="text-sm text-muted-foreground">
            This is a preview kanban board, go{' '}
            <Link className="text-indigo-500 underline" to={'/'}>
              back
            </Link>{' '}
            here
          </p>
        ) : (
          <div></div>
        )}
      </header>
      <KanbanBoard className="flex-1 overflow-scroll px-6 pb-12 pt-[72px]" isPreview={isPreview} />
      <footer className="absolute bottom-3 left-0 right-0 px-6">
        <p className="text-sm text-muted-foreground">
          ©2024 &#8212; Click{' '}
          <Link className="text-indigo-500 underline" to={'/preview'}>
            here
          </Link>{' '}
          to view a preview
        </p>
      </footer>
    </div>
  );
}

export default App;
