import { describe, it, expect } from 'vitest';
import { extractCode } from '../../src/lib/utils';

describe('extractCode', () => {
  it('should extract text content from elements and join them with newlines', () => {
    // Mock NodeListOf<Element> using happy-dom
    const container = document.createElement('div');
    const line1 = document.createElement('div');
    line1.textContent = 'const x = 1;';
    const line2 = document.createElement('div');
    line2.textContent = 'console.log(x);';
    container.appendChild(line1);
    container.appendChild(line2);

    const nodeList = container.querySelectorAll('div');
    const result = extractCode(nodeList);

    expect(result).toBe('const x = 1;\nconsole.log(x);');
  });

  it('should return an empty string if NoNodeList is provided', () => {
    const container = document.createElement('div');
    const nodeList = container.querySelectorAll('.non-existent');
    const result = extractCode(nodeList);

    expect(result).toBe('');
  });

  it('should handle elements with no text content', () => {
    const container = document.createElement('div');
    const line1 = document.createElement('div');
    // textContent is null/empty
    container.appendChild(line1);

    const nodeList = container.querySelectorAll('div');
    const result = extractCode(nodeList);

    expect(result).toBe('');
  });
});
