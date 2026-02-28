name: Question
description: Get help with using Algorun.
labels: [question]
body:

- type: markdown
  attributes:
  value: |
  Ask us anything! We're happy to help.
- type: textarea
  id: user-question
  attributes:
  label: Your Question
  description: What would you like to know or understand?
  placeholder: Ask about setup, features, or more...
  validations:
  required: true
- type: textarea
  id: context
  attributes:
  label: Additional Context
  description: Is there any specific issue or code you're trying to work with?
