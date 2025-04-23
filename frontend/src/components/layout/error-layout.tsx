import Link from 'next/link';
import { useRouter } from 'next/router';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface ErrorLayoutProps {
  title?: string;
  message?: string;
  error?: Error;
  code?: '404' | '500' | string;
  showReset?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function ErrorLayout({
  title,
  message,
  error,
  code,
  showReset = true,
  showHome = true,
  showBack = true,
  children,
  className,
}: ErrorLayoutProps) {
  const router = useRouter();

  const defaultMessages: Record<string, { title: string; message: string }> = {
    '404': {
      title: 'Page not found',
      message: `Sorry, we couldn't find the page you're looking for.`,
    },
    '500': {
      title: 'Server error',
      message: `Sorry, something went wrong on our end.`,
    },
  };

  const errorTitle = title || (code && defaultMessages[code]?.title) || 'Error';
  const errorMessage =
    message || (code && defaultMessages[code]?.message) || 'An error occurred';

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className="flex min-h-full flex-col pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <Link href="/" className="inline-flex">
              <span className="sr-only">Interview AI</span>
              <VideoCameraIcon className="h-12 w-12 text-primary" />
            </Link>
          </div>
          <div className="py-16">
            <div className="text-center">
              {code && (
                <p className="text-base font-semibold text-primary">{code}</p>
              )}
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                {errorTitle}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                {errorMessage}
              </p>
              {error && process.env.NODE_ENV === 'development' && (
                <pre className="mt-4 rounded-lg bg-muted p-4 text-left text-sm">
                  {error.stack}
                </pre>
              )}
              {children}
              <div className="mt-6 flex items-center justify-center gap-4">
                {showBack && (
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Go back
                  </Button>
                )}
                {showHome && (
                  <Link href="/">
                    <Button>Go home</Button>
                  </Link>
                )}
                {showReset && (
                  <Button
                    variant="outline"
                    onClick={() => router.reload()}
                  >
                    Try again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
        <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-6 lg:px-8">
          <nav className="flex justify-center space-x-4">
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Contact Support
            </Link>
            <span
              className="inline-block border-l border-muted-foreground/20"
              aria-hidden="true"
            />
            <Link
              href="/status"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              System Status
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}

// Example usage:
/*
// 404 page
export default function NotFound() {
  return <ErrorLayout code="404" />;
}

// 500 page
export default function ServerError() {
  return <ErrorLayout code="500" />;
}

// Custom error
export default function CustomError() {
  return (
    <ErrorLayout
      title="Access Denied"
      message="You don't have permission to view this page."
      showReset={false}
    />
  );
}
*/