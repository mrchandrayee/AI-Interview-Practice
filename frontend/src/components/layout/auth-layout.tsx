import Link from 'next/link';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { fadeIn, defaultTransition } from '@/components/ui';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  showLogo?: boolean;
}

export function AuthLayout({
  children,
  title,
  description,
  footer,
  showLogo = true,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[600px]">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={defaultTransition}
          className="mx-auto w-full max-w-sm lg:max-w-md"
        >
          {showLogo && (
            <Link href="/" className="flex items-center space-x-2">
              <VideoCameraIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Interview AI</span>
            </Link>
          )}

          <div className="mt-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            <div className="mt-10">{children}</div>

            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </motion.div>
      </div>

      {/* Right side - Image/Pattern */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary to-secondary opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl px-8 text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Elevate Your Interview Skills with AI
            </h1>
            <p className="mt-6 text-lg leading-relaxed">
              Practice with our AI-powered interview simulator, get real-time
              feedback, and improve your chances of landing your dream job.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  stat: '10,000+',
                  label: 'Practice Interviews',
                },
                {
                  stat: '95%',
                  label: 'Success Rate',
                },
                {
                  stat: '24/7',
                  label: 'Available',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-white/10 px-4 py-6 backdrop-blur-sm"
                >
                  <p className="text-3xl font-bold">{item.stat}</p>
                  <p className="mt-1 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 bg-repeat opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  );
}

// Example usage:
/*
<AuthLayout
  title="Welcome back"
  description="Sign in to your account to continue"
  footer={
    <p className="text-center text-sm text-muted-foreground">
      Don't have an account?{' '}
      <Link href="/register" className="text-primary hover:underline">
        Sign up
      </Link>
    </p>
  }
>
  <LoginForm />
</AuthLayout>
*/