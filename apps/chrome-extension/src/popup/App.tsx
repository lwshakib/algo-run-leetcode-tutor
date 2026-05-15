import { useState, useEffect } from "react"
import {
  Key,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from "lucide-react"
import { encrypt, decrypt } from "@/lib/encryption"
import "./App.css"

/**
 * App component for the Chrome extension popup.
 * This component manages the AI configuration,
 * including encryption, decryption, and persistence of API keys and models in local storage.
 */
export default function App() {
  // State to hold the API key entered by the user
  const [apiKey, setApiKey] = useState("")
  // State to hold the selected model
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash")
  // State to toggle the visibility of the API key in the input field
  const [showKey, setShowKey] = useState(false)
  // State to track if the saving operation is in progress
  const [isSaving, setIsSaving] = useState(false)
  // State to indicate if the API key was successfully saved
  const [saved, setSaved] = useState(false)
  // State to store and display any error messages
  const [error, setError] = useState("")

  // Available Gemini models
  const models = [
    { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Preview)" },
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (Preview)" },
    { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash-Lite" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite" },
  ]

  /**
   * Effect hook to load the existing config from chrome.storage.local on component mount.
   */
  useEffect(() => {
    const loadConfig = async () => {
      // Retrieve the encrypted API key and model from local storage
      const result = await chrome.storage.local.get([
        "gemini_api_key",
        "gemini_model",
      ])

      if (result.gemini_api_key) {
        const decryptedKey = await decrypt(String(result.gemini_api_key))
        setApiKey(decryptedKey)
      }

      if (result.gemini_model) {
        setSelectedModel(String(result.gemini_model))
      }
    }
    loadConfig()
  }, [])

  /**
   * Handles the saving of the AI configuration.
   */
  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      // Encrypt the API key before storing it for security
      const encryptedKey = await encrypt(apiKey.trim())

      // Save the encrypted key and model to chrome's local storage
      chrome.storage.local.set(
        {
          gemini_api_key: encryptedKey,
          gemini_model: selectedModel,
        },
        () => {
          setIsSaving(false)
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        }
      )
    } catch (err) {
      setError("Failed to encrypt and save configuration.")
      setIsSaving(false)
    }
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="logo-section">
          <div className="icon-wrapper">
            <ShieldCheck size={24} className="header-icon" />
          </div>
          <h1>AI Configuration</h1>
        </div>
        <p className="subtitle">Securely manage your AI tutor settings</p>
      </header>

      <main className="popup-content">
        {/* Model Selection Dropdown */}
        <div className="input-group">
          <label htmlFor="model-select">
            <Cpu size={14} /> Select Model
          </label>
          <div className="select-wrapper">
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-select"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* API Key Input */}
        <div className="input-group">
          <label htmlFor="api-key">
            <Key size={14} /> Gemini API Key
          </label>
          <div className="input-wrapper">
            <input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setError("")
              }}
              placeholder="Enter your API key here..."
              className={error ? "input-error" : ""}
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? "Hide API Key" : "Show API Key"}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <span className="error-message">{error}</span>}
        </div>

        <button
          className={`save-button ${saved ? "saved" : ""}`}
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
          <p className="privacy-note">
            Your settings are stored locally in your browser.
          </p>
        </div>
      </main>
    </div>
  )
}
