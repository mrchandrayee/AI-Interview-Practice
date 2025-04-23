import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  VideoCameraIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
];

interface MarketingLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function MarketingLayout({
  children,
  showNav = true,
}: MarketingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {showNav && (
        <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-sm">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex items-center gap-x-12">
              <Link href="/" className="flex items-center space-x-2">
                <VideoCameraIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Interview AI</span>
              </Link>
              <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-semibold leading-6',
                      router.asPath === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex">
              <Link href="/login">
                <Button variant="ghost" className="mr-4">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile menu */}
          <div
            className={cn(
              'fixed inset-0 z-50 lg:hidden',
              mobileMenuOpen ? 'block' : 'hidden'
            )}
          >
            {/* Background backdrop */}
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <VideoCameraIcon className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold">Interview AI</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7',
                        router.asPath === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2 py-6">
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-muted-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link href="/register">
                    <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={cn(showNav && 'pt-24')}>{children}</main>

      <footer className="mt-auto border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2">
                <VideoCameraIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Interview AI</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Elevate your interview skills with AI-powered practice sessions.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/#about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8">
            <p className="text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Interview AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}