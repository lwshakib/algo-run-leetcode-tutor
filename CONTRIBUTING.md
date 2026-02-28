# Contributing to Algorun

First off, thank you for considering contributing to Algorun! It's people like you that make Algorun such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Algorun. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check this list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible. Fill out the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md); the information it asks for helps us resolve issues faster.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Algorun, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and find related suggestions.

When you are creating an enhancement suggestion, please include as many details as possible. Fill out the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

### Your First Code Contribution

Unsure where to begin contributing to Algorun? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/lwshakib/algo-run-leetcode-tutor/issues?q=is%3Aopen+is%3Aissue+label%3Abeginner) - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues](https://github.com/lwshakib/algo-run-leetcode-tutor/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) - issues which should be a bit more involved than `beginner` issues.

#### Local Development

1. Fork the repo and clone it locally.
2. Install dependencies with `bun install`.
3. Create a branch for your changes: `git checkout -b my-awesome-feature`.
4. Make your changes and ensure they follow the project's coding style (run `bun run format`).
5. Add tests for your changes in the `__tests__` directory.
6. Commit your changes: `git commit -m 'feat: add some awesome feature'`.
7. Push to your fork and submit a pull request.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Coding Style

- We use **Prettier** for code formatting. Run `bun run format` before committing.
- Use **TypeScript** for all new logic.
- Follow the existing project structure.
- Ensure all new components are responsive and accessible.

## Questions?

If you have any questions, feel free to open a [Question issue](.github/ISSUE_TEMPLATE/question.md).
