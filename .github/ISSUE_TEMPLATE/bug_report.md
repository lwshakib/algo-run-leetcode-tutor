name: Bug report
description: Create a report to help us improve.
labels: [bug]
body:

- type: markdown
  attributes:
  value: |
  Thanks for taking the time to fill out this bug report!
- type: textarea
  id: bug-description
  attributes:
  label: Bug Description
  description: A clear and concise description of what the bug is.
  placeholder: Describe the issue you're facing...
  validations:
  required: true
- type: textarea
  id: reproduction-steps
  attributes:
  label: Steps to Reproduce
  description: Steps to reproduce the behavior.
  placeholder: | 1. Go to '...' 2. Click on '....' 3. Scroll down to '....' 4. See error
  validations:
  required: true
- type: textarea
  id: expected-behavior
  attributes:
  label: Expected Behavior
  description: A clear and concise description of what you expected to happen.
  validations:
  required: true
- type: textarea
  id: environment
  attributes:
  label: Environment
  description: | - OS: [e.g. Windows 11, macOS] - Browser: [e.g. Chrome 120] - Extension Version: [e.g. 1.0.0]
  validations:
  required: true
- type: textarea
  id: logs
  attributes:
  label: Console Logs
  description: Please paste any relevant console logs from the Chrome DevTools.
- type: checkboxes
  id: checkboxes
  attributes:
  label: Checklist
  options: - label: I have searched the [existing issues](https://github.com/lwshakib/algo-run-leetcode-tutor/issues).
  required: true - label: I am using the latest version of the extension.
  required: true
