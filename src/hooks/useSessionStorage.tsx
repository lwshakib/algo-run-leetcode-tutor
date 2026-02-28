import { Message } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

export default function useSessionStorage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const saveTimeoutRef = useRef<number | null>(null);

  function saveToSessionStorage() {
    sessionStorage.setItem('leetcode-tutor-messages', JSON.stringify(messages, null, 2));
  }

  // Debounced save - only save after 1 second of no changes
  useEffect(() => {
    if (messages.length > 0) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        saveToSessionStorage();
      }, 1000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [messages]);

  useEffect(() => {
    const stored = sessionStorage.getItem('leetcode-tutor-messages');
    if (stored) {
      try {
        const parsedMessages = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        sessionStorage.removeItem('leetcode-tutor-messages');
      }
    }
  }, []);

  return { messages, setMessages, saveToSessionStorage };
}
