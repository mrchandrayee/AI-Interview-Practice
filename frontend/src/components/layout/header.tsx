import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  VideoCameraIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Avatar, Button } from '@/components/ui';
import { useAuth } from '@/lib/store/hooks';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMobileMenuClick?: () => void;
  type?: 'app' | 'marketing';
  showMobileMenu?: boolean;
}

export function Header({
  onMobileMenuClick,
  type = 'marketing',
  showMobileMenu,
}: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const isActive = (href: string) => router.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-x-4">
          {type === 'app' && (
            <button
              type="button"
              className="lg:hidden"
              onClick={onMobileMenuClick}
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <VideoCameraIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Interview AI</span>
          </Link>
        </div>

        {type === 'app' ? (
          <div className="flex items-center gap-x-4">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
            </button>
            <div className="relative">
              <Link href="/profile">
                <Avatar
                  src={user?.image}
                  alt={user?.name || ''}
                  fallback={user?.name || ''}
                  size="sm"
                  status="online"
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/profile">
                  <Avatar
                    src={user?.image}
                    alt={user?.name || ''}
                    fallback={user?.name || ''}
                    size="sm"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

interface MobileNavProps {
  show: boolean;
  onClose: () => void;
  items: Array<{
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function MobileNav({ show, onClose, items }: MobileNavProps) {
  const router = useRouter();

  if (!show) return null;

  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                router.pathname === item.href && 'bg-accent'
              )}
              onClick={onClose}
            >
              {item.icon && (
                <item.icon className="mr-2 h-4 w-4" />
              )}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}