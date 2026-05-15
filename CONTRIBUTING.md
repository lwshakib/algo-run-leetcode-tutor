# Contributing to Algorun

First off, thank you for considering contributing to Algorun! It's people like you that make Algorun such a great tool for the LeetCode community.

## 🚀 Development Workflow

### 1. Fork and Clone
- Fork the repository on GitHub.
- Clone your fork locally:
  ```bash
  git clone https://github.com/YOUR_USERNAME/algo-run-leetcode-tutor.git
  cd algo-run-leetcode-tutor
  ```

### 2. Setup
- Ensure you have [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/) installed.
- Install dependencies:
  ```bash
  pnpm install
  ```

### 3. Environment Variables
To use the AI features during development, you'll need a Google Gemini API Key.
- Create a `.env` file in `apps/chrome-extension/`.
- Add your key: `VITE_GEMINI_API_KEY=your_key_here`.

### 4. Branching
- Create a new branch for your feature or bugfix:
  ```bash
  git checkout -b feature/your-feature-name
  ```

### 5. Development
- Start the development server:
  ```bash
  pnpm dev
  ```
- **Monorepo Structure**:
    - `apps/web`: Next.js landing page.
    - `apps/chrome-extension`: The core extension logic (Vite + CRXJS).
    - `packages/ui`: Shared Tailwind-styled React components.

### 6. Verification
Before submitting a PR, ensure your changes pass our quality checks:
```bash
pnpm format      # Fix code style
pnpm format:check # Verify code style (required for CI)
pnpm lint        # Run ESLint
pnpm typecheck   # Run TypeScript compiler checks
pnpm build       # Ensure the project builds successfully
```

## 📬 Pull Request Process
1.  **Update Documentation**: If you've added a feature, please update the README or relevant docs.
2.  **Commit Messages**: Use clear, descriptive commit messages (e.g., `feat: add context awareness to chat`).
3.  **PR Description**: Explain the *why* behind your changes. Include screenshots for UI updates.
4.  **Review**: Once submitted, a maintainer will review your code. Please be open to feedback!

## 🐛 Reporting Bugs
Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- A clear description of the issue.
- Steps to reproduce.
- Your OS and Browser version.

## 💡 Suggesting Features
Got a great idea? Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md). We love hearing how we can make Algorun better.

## 💬 Community
- Be respectful and constructive.
- Adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

Happy coding! 🚀
