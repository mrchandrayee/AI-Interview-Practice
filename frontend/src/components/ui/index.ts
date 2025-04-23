export { AudioRecorder } from './audio-recorder';
export { Badge, StatusBadge, ProgressBadge, TierBadge } from './badge';
export { Button } from './button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';
export { FileUpload } from './file-upload';
export { Input } from './input';
export {
  LoadingSpinner,
  LoadingOverlay,
  LoadingContainer,
} from './loading-spinner';
export { Modal, ConfirmModal } from './modal';
export { Select, type SelectOption } from './select';
export {
  Skeleton,
  CardSkeleton,
  InterviewCardSkeleton,
  ProfileSkeleton,
  ProgressSkeleton,
  TableRowSkeleton,
  FormSkeleton,
} from './skeleton';
export { Tabs } from './tabs';
export { TextArea } from './textarea';
export { Avatar, AvatarGroup } from './avatar';

// Animation variants for page transitions and other animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Common transition settings
export const defaultTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

// Example usage of components and animations:
/*
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  Input,
  LoadingSpinner,
  fadeIn,
  defaultTransition,
} from '@/components/ui';

function MyComponent() {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={defaultTransition}
    >
      <Card>
        <Input label="Name" placeholder="Enter your name" />
        <Button>Submit</Button>
      </Card>
    </motion.div>
  );
}
*/