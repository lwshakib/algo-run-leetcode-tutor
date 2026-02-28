import FloatingChatBox from '@/components/FloatingChatBox';
import { BotMessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import './App.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const metaDescriptionEl = document.querySelector('meta[name=description]');
  const problemStatement = metaDescriptionEl?.getAttribute('content') as string;

  return (
    <div className="app-container">
      <button
        className={`chat-toggle-button ${isChatOpen ? 'open' : ''}`}
        aria-label={isChatOpen ? 'Close Chat' : 'Chat with Tutor'}
        onClick={() => setIsChatOpen((open) => !open)}
      >
        {/* Animated background glow */}
        <div className="button-glow" />

        {/* Icon with smooth transition */}
        <div className="icon-wrapper">
          {isChatOpen ? <X size={28} /> : <BotMessageSquare size={28} />}
        </div>

        {/* Pulse animation when closed */}
        {!isChatOpen && <div className="pulse-ring" />}
      </button>

      {isChatOpen && (
        <div className="chat-box-wrapper">
          <FloatingChatBox onClose={() => setIsChatOpen(false)} context={problemStatement} />
        </div>
      )}
    </div>
  );
}

export default App;
