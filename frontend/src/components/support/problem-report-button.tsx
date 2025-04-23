'use client';

import { useState } from 'react';
import { supportService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Swal from 'sweetalert2';

interface ProblemReportButtonProps {
  sessionId: string;
  currentTranscript?: string;
  className?: string;
  variant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function ProblemReportButton({
  sessionId,
  currentTranscript,
  className,
  variant = 'outline'
}: ProblemReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Collect browser console logs
      const logs = (console as any).logs || [];
      const consoleLog = logs.slice(-50).join('\n'); // Last 50 log entries

      // Submit problem report
      await supportService.reportProblem({
        session_id: sessionId,
        transcript_snippet: currentTranscript || '',
        console_log: consoleLog
      });

      Swal.fire({
        title: 'Problem Reported',
        text: 'Our team has been notified and will investigate the issue.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      setIsOpen(false);
      setDescription('');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit problem report. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        Report Problem
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Describe the issue you're experiencing..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}