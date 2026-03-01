import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { encrypt, decrypt } from '@/lib/encryption';
import './App.css';

/**
 * App component for the Chrome extension popup.
 * This component manages the Gemini API key configuration,
 * including encryption, decryption, and persistence in local storage.
 */
export default function App() {
  // State to hold the API key entered by the user
  const [apiKey, setApiKey] = useState('');
  // State to toggle the visibility of the API key in the input field
  const [showKey, setShowKey] = useState(false);
  // State to track if the saving operation is in progress
  const [isSaving, setIsSaving] = useState(false);
  // State to indicate if the API key was successfully saved
  const [saved, setSaved] = useState(false);
  // State to store and display any error messages
  const [error, setError] = useState('');

  /**
   * Effect hook to load the existing API key from chrome.storage.local on component mount.
   * If a key exists, it is decrypted before being set in the component state.
   */
  useEffect(() => {
    // Load existing key from storage
    const loadKey = async () => {
      // Retrieve the encrypted API key from local storage
      const result = await chrome.storage.local.get(['gemini_api_key']);
      if (result.gemini_api_key) {
        // Decrypt the stored key before updating the state
        const decryptedKey = await decrypt(String(result.gemini_api_key));
        setApiKey(decryptedKey);
      }
    };
    loadKey();
  }, []);

  /**
   * Handles the saving of the API key.
   * Validates the input, encrypts the key, and stores it in chrome.storage.local.
   */
  const handleSave = async () => {
    // Basic validation to ensure the API key is not empty
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Encrypt the API key before storing it for security
      const encryptedKey = await encrypt(apiKey.trim());

      // Save the encrypted key to chrome's local storage
      chrome.storage.local.set({ gemini_api_key: encryptedKey }, () => {
        setIsSaving(false);
        setSaved(true);
        // Reset the "Saved" status after 3 seconds to provide visual feedback
        setTimeout(() => setSaved(false), 3000);
      });
    } catch (err) {
      // Handle potential encryption errors
      setError('Failed to encrypt and save API key.');
      setIsSaving(false);
    }
  };

  return (
    <div className="popup-container">
      {/* Header section with logo and title */}
      <header className="popup-header">
        <div className="logo-section">
          <div className="icon-wrapper">
            <ShieldCheck size={24} className="header-icon" />
          </div>
          <h1>Gemini Configuration</h1>
        </div>
        <p className="subtitle">Securely manage your Gemini API key for Algorun</p>
      </header>

      {/* Main content area for API key input and saving */}
      <main className="popup-content">
        <div className="input-group">
          <label htmlFor="api-key">
            <Key size={14} /> Gemini API Key
          </label>
          <div className="input-wrapper">
            {/* Input field for the API key, toggles between text and password visibility */}
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="Enter your API key here..."
              className={error ? 'input-error' : ''}
            />
            {/* Visibility toggle button */}
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? 'Hide API Key' : 'Show API Key'}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Display validation or encryption errors */}
          {error && <span className="error-message">{error}</span>}
        </div>

        {/* Save button with dynamic states: default, saving, and saved */}
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loader"></span>
          ) : saved ? (
            <>
              <CheckCircle size={18} /> Saved Successfully
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>

        {/* Informational footer with links and privacy notes */}
        <div className="info-footer">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="get-key-link"
          >
            Get a free Gemini API key <ExternalLink size={12} />
          </a>
          <p className="privacy-note">Your key is encrypted and stored locally in your browser.</p>
        </div>
      </main>
    </div>
  );
}
