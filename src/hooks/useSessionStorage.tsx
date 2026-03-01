import { Message } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for managing message persistence using sessionStorage.
 * This hook handles saving and loading chat messages to/from the browser's session storage.
 * It includes a debounced save mechanism to optimize performance.
 */
export default function useSessionStorage() {
  // State to store the array of chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // Reference to store the timeout ID for debounced saving
  const saveTimeoutRef = useRef<number | null>(null);

  /**
   * Helper function to serialize and save the current messages to sessionStorage.
   */
  function saveToSessionStorage() {
    sessionStorage.setItem('leetcode-tutor-messages', JSON.stringify(messages, null, 2));
  }

  /**
   * Effect hook to automatically save messages whenever the 'messages' state changes.
   * Employs a debounce strategy to avoid excessive writes to storage.
   * The save occurs after a 1-second delay of no further changes.
   */
  useEffect(() => {
    if (messages.length > 0) {
      // Clear any existing save timeout to restart the debounce timer
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Schedule a new save operation
      saveTimeoutRef.current = setTimeout(() => {
        saveToSessionStorage();
      }, 1000);
    }

    // Cleanup: Clear the timeout if the component unmounts or messages change again
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [messages]);

  /**
   * Effect hook to load saved messages from sessionStorage when the hook is first used.
   * It also handles parsing the JSON and converting timestamp strings back into Date objects.
   */
  useEffect(() => {
    const stored = sessionStorage.getItem('leetcode-tutor-messages');
    if (stored) {
      try {
        const parsedMessages = JSON.parse(stored);
        // Correctly restore Date objects for each message's timestamp
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        // If parsing fails (e.g., due to corrupted data), clear the invalid entry
        sessionStorage.removeItem('leetcode-tutor-messages');
      }
    }
  }, []);

  // Return the state and functions for components to use
  return { messages, setMessages, saveToSessionStorage };
}
