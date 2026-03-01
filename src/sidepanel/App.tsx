import crxLogo from '@/assets/crx.svg';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';
import HelloWorld from '@/components/HelloWorld';
import './App.css';

/**
 * App component for the Chrome extension side panel.
 * This panel is typically used for persistent tools and status displays.
 * Currently, it serves as a placeholder with standard library logos.
 */
export default function App() {
  return (
    <div>
      {/* Vite Logo Link */}
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      {/* React Logo Link */}
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      {/* CRXJS Logo Link */}
      <a href="https://crxjs.dev/vite-plugin" target="_blank" rel="noreferrer">
        <img src={crxLogo} className="logo crx" alt="crx logo" />
      </a>
      {/* A simple HelloWorld component to showcase basic functionality */}
      <HelloWorld msg="Vite + React + CRXJS" />
    </div>
  );
}
