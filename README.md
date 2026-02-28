# <img src="public/logo.svg" alt="Algorun Logo" width="40" height="40" valign="middle" /> Algorun – LeetCode Tutor (Chrome Extension)

AI-powered tutoring overlay for LeetCode. Get step-by-step solutions, explanations, and learning insights while you solve problems on `leetcode.com`. Built with React 19, TypeScript, Vite, and CRXJS.

<div align="center">
  <img src="public/demo.png" alt="Demo" width="100%" />
</div>

---

Algorun is your personal AI coding tutor that lives inside LeetCode. It doesn't just give you the answer; it helps you understand the **why** and **how** behind every algorithmic challenge. Whether you're stuck on a tricky edge case or need a hint to get started, Algorun provides contextualized guidance based on your current code and the problem description.

### 🌟 Key Features

- **🚀 Real-time In-page Tutor**: A floating chat interface that opens directly on LeetCode problem pages (`https://leetcode.com/problems/*`).
- **🧠 Context-Aware Hints**: Reads the problem description and your current editor code (scraped from the Monaco/CodeMirror editor) to provide personalized help.
- **✨ Gemini-Powered Insights**: Uses Google's state-of-the-art Gemini 2.0 Flash models via `@ai-sdk/google` for blazing-fast, high-quality responses.
- **📝 Reasoning Trace**: See the AI's step-by-step thinking process with a collapsible "reasoning" block before getting the final guidance.
- **💾 Session Persistence**: Your conversation history is saved in `sessionStorage` per tab, so you don't lose your progress if you refresh.
- **🎨 Premium UI**: A sleek, modern design using vanilla CSS, featuring glassmorphism effects and smooth animations.
- **🛠️ Developer First**: Built with the latest tech stack (React 19, Vite, TypeScript) for a smooth development experience.

---

### 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/) + [CRXJS](https://crxjs.dev/) (Modern Chrome Extension development)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) + [Google Gemini API](https://ai.google.dev/)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown) + [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting & Formatting**: [Prettier](https://prettier.io/)

---

### 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **Bun**: (Optional but recommended for faster dependency management)
- **Gemini API Key**: Get one from the [Google AI Studio](https://aistudio.google.com/)

---

### 🚀 Getting Started

#### 1. Clone & Install

```bash
git clone https://github.com/lwshakib/algo-run-leetcode-tutor.git
cd algo-run-leetcode-tutor
bun install # or npm install
```

#### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Required for securing user API keys in local storage
VITE_ENCRYPTION_SECRET=your-random-secure-secret-key-here
```

#### 3. Development

Run the development server:

```bash
bun run dev # or npm run dev
```

#### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist` folder generated in your project directory.
5. Navigate to any [LeetCode problem](https://leetcode.com/problems/two-sum/) and you'll see the Algorun icon in the bottom right!

---

### 📂 Project Structure

```text
├── .github/          # GitHub Actions workflows and Issue Templates
├── src/
│   ├── components/   # Reusable UI components (ChatBox, MarkdownRenderer)
│   ├── content/      # Content script (Injected into LeetCode pages)
│   ├── hooks/        # Custom React hooks (useSessionStorage)
│   ├── lib/          # Core logic (AI model setup, prompt engineering, utils)
│   ├── popup/        # Extension popup UI (for settings)
│   └── sidepanel/    # Optional Chrome side panel
├── public/           # Static assets (icons, logo)
├── manifest.config.ts # Manifest V3 configuration
└── vite.config.ts    # Vite configuration
```

---

### 🎯 Roadmap

- [ ] **Multi-Model Support**: Choice between Gemini Flash, Pro, and potentially other providers.
- [ ] **Code Analysis**: Deeper static analysis of user code before sending to AI.
- [ ] **Problem Syncing**: Syncing progress and hints across multiple sessions.
- [ ] **Edge Cases**: Dedicated "Edge Case" generator for the current problem.
- [ ] **Voice Support**: Talk to the tutor instead of typing.

---

### 🤝 Contributing

We welcome contributions! Whether it's fixing a bug, adding a feature, or improving documentation, we'd love your help.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

### 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

### 🙏 Acknowledgments

- [Vite Plugin CRX](https://crxjs.dev/) for making extension development easy.
- [Vercel AI SDK](https://sdk.vercel.ai/) for the excellent streaming abstractions.
- All the contributors who helped make Algorun better!

<p align="right">(<a href="#top">back to top</a>)</p>
