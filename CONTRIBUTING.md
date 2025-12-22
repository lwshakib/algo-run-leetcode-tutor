# Contributing to Algorun

First off, thank you for considering contributing to Algorun! It's people like you that make this tool better for the entire developer community.

Whether you're fixing a bug, improving the documentation, or adding a new feature, your help is welcome and appreciated. This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

To get the project running locally on your machine, follow these steps:

### Prerequisites

- **Node.js**: Version 18 or higher is required.
- **Package Manager**: We recommend `npm` (came with Node.js) or `bun`.
- **API Key**: You'll need a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lwshakib/algo-run-leetcode-tutor.git
   cd algo-run-leetcode-tutor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   # Or create manually
   echo VITE_ENCRYPTION_SECRET=your_secret_here > .env
   ```

## 🛠 Development Workflow

This project uses **Vite** and **CRXJS** for a modern Chrome Extension development experience.

### Running in Development Mode

1. Start the development server:

   ```bash
   npm run dev
   ```

   This will watch for file changes and rebuild the extension automatically.

2. **Load into Chrome**:

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top right).
   - Click **Load unpacked**.
   - Select the `dist` folder generated in your project root.

3. **Testing**:
   - Go to any [LeetCode Problem](https://leetcode.com/problems/two-sum/) page.
   - The Algorun chat button should appear in the bottom-right corner.
   - Any changes you make to the code will trigger a hot reload (HMR) or extension reload.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This generates optimized assets in `dist/` and a zip file in `release/`.

## 📂 Project Structure

Understanding the codebase will help you navigate and contribute effectively:

- **`manifest.config.ts`**: The source of truth for the extension manifest (V3).
- **`src/content/`**: Scripts injected into the LeetCode page.
  - `views/`: React components injected into the DOM (e.g., the specific Chat UI).
- **`src/components/`**: Reusable UI components (Buttons, ChatBox, Markdown renderers).
- **`src/lib/`**: Core logic and utilities.
  - `model.ts`: AI model configuration (Gemini).
  - `prompt.ts`: The system prompt engineering.
  - `utils.ts`: DOM scraping and helpers.
- **`src/popup/`**: The code for the extension popup (accessed via toolbar icon).

## 📝 Pull Request Guidelines

When you're ready to submit your changes:

1. **Fork** the repository and create your branch from `main`.
2. **Branch Naming**: Use descriptive names like `feature/add-dark-mode` or `fix/chat-scrolling`.
3. **Commit Messages**: Write clear, concise commit messages.
   - Good: "Fix markdown rendering issue in chat bubbles"
   - Bad: "Fix bug"
4. **Push** to your fork and submit a Pull Request.
5. **Description**: Provide a clear description of your changes in the PR. Include screenshots/GIFs for UI changes.

## 🎨 Code Style

- **TypeScript**: We use strict TypeScript. Please define interfaces for props and data structures.
- **Styling**: We use **Tailwind CSS** (v4) for styling. Avoid inline styles where possible.
- **Components**: Use Functional Components with Hooks.
- **Linting**: Ensure your code passes linting (no red squiggles!).

## 🐞 Reporting Issues

If you find a bug or have a feature request, please open an issue! Include:

- A clear title and description.
- Steps to reproduce (for bugs).
- Screenshot or video evidence (if applicable).
- Your browser version.

## 🤝 Community

Join the discussion! If you have questions, feel free to ask in the [Discussions](https://github.com/lwshakib/algo-run-leetcode-tutor/discussions) tab.

Thank you for contributing! Happy Coding! 🚀
