import { NavLink } from 'react-router-dom';
import { Home, Grid, PlusCircle, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/memories', icon: Grid, label: 'Memories' },
    { to: '/upload', icon: PlusCircle, label: 'Add', special: true },
    { to: '/reminders', icon: Bell, label: 'Reminders' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 px-4 backdrop-blur-lg md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              item.special && '-mt-5'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'flex items-center justify-center rounded-full transition-all',
                  item.special
                    ? 'h-12 w-12 bg-primary text-primary-foreground shadow-lg'
                    : 'h-8 w-8'
                )}
              >
                <item.icon
                  className={cn(
                    item.special ? 'h-6 w-6' : 'h-5 w-5',
                    isActive && !item.special && 'fill-current'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              {!item.special && <span className="font-medium">{item.label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
