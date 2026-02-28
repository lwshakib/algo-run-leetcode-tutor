name: Feature Request
description: Suggest an idea for this project.
labels: [enhancement]
body:

- type: markdown
  attributes:
  value: |
  We'd love to hear your ideas!
- type: textarea
  id: feature-description
  attributes:
  label: Feature Description
  description: Is your feature request related to a problem? Please describe.
  placeholder: |
  A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]
  validations:
  required: true
- type: textarea
  id: solution-description
  attributes:
  label: Proposed Solution
  description: A clear and concise description of what you want to happen.
  validations:
  required: true
- type: textarea
  id: alternatives
  attributes:
  label: Alternatives Considered
  description: A clear and concise description of any alternative solutions or features you've considered.
- type: textarea
  id: context
  attributes:
  label: Additional Context
  description: Add any other context or screenshots about the feature request here.
- type: checkboxes
  id: checkboxes
  attributes:
  label: Checklist
  options: - label: This feature would be useful for multiple people.
  required: true - label: I have searched for similar feature requests.
  required: true
