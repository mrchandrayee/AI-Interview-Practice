import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Animation variant to use for the page transition
   * - fade: Simple fade in/out
   * - slide-up: Slide up and fade in
   * - slide-left: Slide in from the left
   * - scale: Scale and fade in
   */
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export function PageTransition({
  children,
  className,
  variant = 'fade',
}: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Layout transition component for consistent transitions between layout changes
interface LayoutTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function LayoutTransition({ children, className }: LayoutTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Example usage:
/*
// In a page component
export default function HomePage() {
  return (
    <PageTransition variant="slide-up">
      <div>
        <h1>Welcome</h1>
        <p>This page will slide up and fade in.</p>
      </div>
    </PageTransition>
  );
}

// In a layout component
export function AppLayout({ children }) {
  return (
    <LayoutTransition>
      <div>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </LayoutTransition>
  );
}
*/