import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './views/App.tsx';

console.log('[CRXJS] Hello world from content script!');

/**
 * Main entry point for the content script.
 * This script runs within the context of the LeetCode web page.
 * It injects the Algorun AI Tutor component into the site to provide tutoring assistance.
 */

// Create a host element for the React application to live in
const container = document.createElement('div');
container.id = '__leetcode_ai_tutor_container';
// Inject the container into the bottom of the page's body
document.body.appendChild(container);

// Initialize the React application within the newly created container
createRoot(container).render(
  <StrictMode>
    {/* The main App component for the content script manages the tutoring overlay */}
    <App />
  </StrictMode>,
);
