import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { encrypt, decrypt } from '@/lib/encryption';
import './App.css';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load existing key from storage
    const loadKey = async () => {
      const result = await chrome.storage.local.get(['gemini_api_key']);
      if (result.gemini_api_key) {
        const decryptedKey = await decrypt(String(result.gemini_api_key));
        setApiKey(decryptedKey);
      }
    };
    loadKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const encryptedKey = await encrypt(apiKey.trim());

      chrome.storage.local.set({ gemini_api_key: encryptedKey }, () => {
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      });
    } catch (err) {
      setError('Failed to encrypt and save API key.');
      setIsSaving(false);
    }
  };

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="logo-section">
          <div className="icon-wrapper">
            <ShieldCheck size={24} className="header-icon" />
          </div>
          <h1>Gemini Configuration</h1>
        </div>
        <p className="subtitle">Securely manage your Gemini API key for Algorun</p>
      </header>

      <main className="popup-content">
        <div className="input-group">
          <label htmlFor="api-key">
            <Key size={14} /> Gemini API Key
          </label>
          <div className="input-wrapper">
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
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? 'Hide API Key' : 'Show API Key'}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <span className="error-message">{error}</span>}
        </div>

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
