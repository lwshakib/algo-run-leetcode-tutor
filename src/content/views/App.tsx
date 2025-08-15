import { BotMessageSquare } from "lucide-react";
import { useState } from "react";
import "./App.css";
import FloatingChatBox from "@/components/FloatingChatBox";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const metaDescriptionEl = document.querySelector("meta[name=description]");
  const problemStatement = metaDescriptionEl?.getAttribute("content") as string;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-md  transition-colors focus:outline-none border-none"
        aria-label="Chat with Tutor"
        onClick={() => setIsChatOpen((open) => !open)}
      >
        <BotMessageSquare size={28} />
      </button>

      {isChatOpen && (
          <FloatingChatBox
            onClose={() => setIsChatOpen(false)}
            context={problemStatement}
          />
      )}
    </div>
  );
}

export default App;
