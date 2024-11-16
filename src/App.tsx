import { Logo } from '@/components/icons/Logo';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Link, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isPreview = location.pathname.includes('preview');

  return (
    <div className="flex h-dvh min-h-dvh flex-col bg-background">
      <header className="fixed top-0 z-50 w-full border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:relative md:border-b-0">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to={'/'} className="w-fit">
            <Logo className="h-6 min-h-6 w-[170px]" />
          </Link>
          {isPreview ? (
            <p className="ml-4 text-sm text-muted-foreground">
              This is a preview kanban board, go{' '}
              <Link className="text-indigo-500 underline" to={'/'}>
                back
              </Link>{' '}
              here
            </p>
          ) : (
            <div></div>
          )}
        </div>
      </header>

      <KanbanBoard className="flex-1 px-4 pt-[80px] sm:px-6 md:pt-0" isPreview={isPreview} />

      <footer className="flex min-h-14 w-full items-center px-4 sm:px-6">
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
