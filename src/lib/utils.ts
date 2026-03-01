/**
 * Utility function to extract code from LeetCode's editor.
 * It iterates through the DOM elements representing lines of code in the editor
 * and concatenates their text content into a single string.
 */
export function extractCode(codeContainer: NodeListOf<Element>): string {
  let code = '';
  // Loop through each line element found in the editor container
  codeContainer.forEach((line) => {
    if (line.textContent) {
      // Append the text of each line plus a newline character
      code += line.textContent + '\n';
    }
  });
  // Clean up any trailing whitespace and return the full code block
  return code.trim();
}
