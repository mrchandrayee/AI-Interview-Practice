'use client';

import { useState } from 'react';
import { supportService } from '@/services/api';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';

interface CSATRatingProps {
  ticketId?: string;
  chatInteractionId?: string;
  onComplete?: () => void;
}

export function CSATRating({
  ticketId,
  chatInteractionId,
  onComplete
}: CSATRatingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = async (rating: number) => {
    try {
      setIsSubmitting(true);

      const result = await Swal.fire({
        title: 'Additional Feedback',
        input: 'textarea',
        inputPlaceholder: 'Let us know how we can improve (optional)',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Skip',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      });

      const feedback = result.isConfirmed ? result.value : '';

      await supportService.submitCsatRating({
        rating,
        feedback,
        ticket: ticketId,
        chat_interaction: chatInteractionId
      });

      Swal.fire({
        title: 'Thank You',
        text: 'Your feedback helps us improve our service.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit rating. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-gray-600">
        How was your experience?
      </p>
      <div className="flex gap-4">
        <Button
          variant="ghost"
          onClick={() => handleRating(1)}
          disabled={isSubmitting}
          className="text-3xl"
        >
          👎
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleRating(5)}
          disabled={isSubmitting}
          className="text-3xl"
        >
          👍
        </Button>
      </div>
    </div>
  );
}