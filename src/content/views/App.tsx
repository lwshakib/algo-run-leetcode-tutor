import FloatingChatBox from '@/components/FloatingChatBox';
import { BotMessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import './App.css';

/**
 * Main App component for the content script.
 * It manages the floating chat toggle button and the visibility of the FloatingChatBox.
 * It also extracts the problem statement from the page's meta description for context.
 */
function App() {
  // Toggle state to open or close the chat interface
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Extract the problem statement from the LeetCode page's meta tags
  // This provides initial context to the AI about the current coding problem.
  const metaDescriptionEl = document.querySelector('meta[name=description]');
  const problemStatement = metaDescriptionEl?.getAttribute('content') as string;

  return (
    <div className="app-container">
      {/* Floating Action Button (FAB) to toggle the chat visibility */}
      <button
        className={`chat-toggle-button ${isChatOpen ? 'open' : ''}`}
        aria-label={isChatOpen ? 'Close Chat' : 'Chat with Tutor'}
        onClick={() => setIsChatOpen((open) => !open)}
      >
        {/* Visual effects: background glow and icon transition logic */}
        <div className="button-glow" />

        <div className="icon-wrapper">
          {isChatOpen ? <X size={28} /> : <BotMessageSquare size={28} />}
        </div>

        {/* Pulse animation to draw attention when the tutor is available but the chat is closed */}
        {!isChatOpen && <div className="pulse-ring" />}
      </button>

      {/* Conditionally render the chat box when toggled open */}
      {isChatOpen && (
        <div className="chat-box-wrapper">
          {/* Inject the problem context into the chatbot's system prompt */}
          <FloatingChatBox onClose={() => setIsChatOpen(false)} context={problemStatement} />
        </div>
      )}
    </div>
  );
}

export default App;
