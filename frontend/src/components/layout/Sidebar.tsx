import { NavLink } from 'react-router-dom';
import { Home, Grid, PlusCircle, Bell, User, MessageSquare, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const { demoMode } = useAppStore();
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/memories', icon: Grid, label: 'Memories' },
    { to: '/chat', icon: MessageSquare, label: 'Chat Assistant' },
    { to: '/reminders', icon: Bell, label: 'Reminders' },
    { to: '/profile', icon: User, label: 'Settings' },
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Brain className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">Recall</span>
      </div>

      <div className="flex-1 overflow-auto py-6">
        <div className="mb-4 px-6">
          <NavLink
            to="/upload"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="h-5 w-5" />
            Add Memory
          </NavLink>
        </div>

        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn('h-5 w-5', isActive && 'fill-current opacity-20')}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {demoMode && (
        <div className="border-t p-4">
          <div className="rounded-xl border bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Demo Mode</span>
              <Badge variant="secondary" className="text-[10px]">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Exploring with sample data. Your privacy is protected.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
