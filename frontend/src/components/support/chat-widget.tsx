'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { supportService } from '@/services/api';
import type { IntercomEvent } from '@/services/api/support';

// Extend the Session type to include custom fields
declare module "next-auth" {
  interface User {
    subscription_status?: string;
  }
}

export function ChatWidget() {
  const { data: session } = useSession();

  // Handle custom events from Intercom
  const handleIntercomEvent = useCallback(async (event: IntercomEvent) => {
    if (event.type === 'conversation_closed') {
      // Get the conversation data
      const conversation = event.conversation;
      if (!conversation) return;

      // Create a support ticket if needed
      if (conversation.open) {
        try {
          await supportService.reportProblem({
            session_id: conversation.id,
            transcript_snippet: conversation.messages
              .slice(-3)
              .map(m => m.text)
              .join('\n')
          });
        } catch (error) {
          console.error('Failed to create support ticket:', error);
        }
      }
    }
  }, []);

  // Handle custom attributes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Intercom) return;

    // Update user attributes when session changes
    if (session?.user) {
      window.Intercom('update', {
        name: session.user.name || 'Unknown User',
        email: session.user.email || undefined,
        user_id: session.user.id,
        // Add optional attributes only if they exist
        ...(session.user.subscription_status && {
          subscription_status: session.user.subscription_status
        }),
        last_login: new Date().toISOString()
      });
    }

    // Listen for Intercom events
    window.Intercom('onUnreadCountChange', function(unreadCount: number) {
      // Handle unread messages count
      console.log('Unread messages:', unreadCount);
    });

    window.Intercom('onHide', function() {
      // Handle messenger hidden
      console.log('Messenger hidden');
    });

    window.Intercom('onShow', function() {
      // Handle messenger shown
      console.log('Messenger shown');
    });

    // Custom event handler
    const handleCustomEvent = (event: IntercomEvent) => handleIntercomEvent(event);
    window.Intercom('onCustomEvent', handleCustomEvent);

    return () => {
      // Cleanup event listeners
      window.Intercom('shutdown');
    };
  }, [session, handleIntercomEvent]);

  // Custom messenger trigger button
  const openMessenger = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={openMessenger}
        className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open support chat"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" 
          />
        </svg>
      </button>
    </div>
  );
}