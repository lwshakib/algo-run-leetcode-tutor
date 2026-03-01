import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Entry point for the Chrome extension popup.
// This file initializes the React application within the 'root' element of popup/index.html.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Render the main App component which handles the UI and logic for the popup */}
    <App />
  </StrictMode>,
);
