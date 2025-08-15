import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function extractCode(codeContainer: NodeListOf<Element>): string {
  let code = "";
  codeContainer.forEach((line) => {
    if (line.textContent) {
      code += line.textContent + "\n";
    }
  });
  return code.trim();
}
