export function extractCode(codeContainer: NodeListOf<Element>): string {
  let code = '';
  codeContainer.forEach((line) => {
    if (line.textContent) {
      code += line.textContent + '\n';
    }
  });
  return code.trim();
}
