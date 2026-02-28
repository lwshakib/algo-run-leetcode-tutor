name: Documentation Issue
description: Improvements to documentation or examples.
labels: [documentation]
body:

- type: textarea
  id: docs-location
  attributes:
  label: Documentation Location
  description: Which part of the documentation is outdated or missing?
  validations:
  required: true
- type: textarea
  id: docs-problem
  attributes:
  label: Description of the Problem
  description: What is wrong or missing in the current documentation?
  validations:
  required: true
- type: textarea
  id: docs-suggestion
  attributes:
  label: Suggested Improvements
  description: What should the documentation say instead?
