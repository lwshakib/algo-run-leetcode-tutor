import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import './MarkdownRenderer.css';

// Code block component with copy button
/**
 * Helper component to render code blocks with syntax highlighting and a "Copy" button.
 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  // State to track if the code has been recently copied (used for UI feedback)
  const [copied, setCopied] = useState(false);

  /**
   * Copies the code string to the user's clipboard and updates the 'copied' state.
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      // Reset the "Copied!" text back to "Copy" after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-block-container">
      {/* Header bar for the code block, containing the language name and copy button */}
      <div className="code-block-header">
        <span className="code-block-language">{language}</span>
        <button
          onClick={copyToClipboard}
          className={`copy-button ${copied ? 'copied' : 'not-copied'}`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax-highlighted code area */}
      <div className="code-content-wrapper">
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          customStyle={{
            fontSize: '0.75rem',
            margin: 0,
            padding: '1rem',
            backgroundColor: 'transparent',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/**
 * Main component for rendering AI-generated Markdown content.
 * It uses 'react-markdown' to parse the content and provides custom styled components
 * for headings, lists, tables, and specifically, enhanced code blocks.
 */
export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        // Enable GitHub Flavored Markdown (tables, task lists, etc.)
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom mapping of Markdown elements to styled React elements
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          h4: ({ children }) => <h4>{children}</h4>,
          h5: ({ children }) => <h5>{children}</h5>,
          h6: ({ children }) => <h6>{children}</h6>,

          p: ({ children }) => <p>{children}</p>,

          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,

          // Enhanced 'code' component to handle both inline snippets and full code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            // Check if this is a language-specific code block by looking for the 'language-' class
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              // If it's a multiline block with a language, use our custom CodeBlock component
              return <CodeBlock code={codeString} language={match[1]} />;
            }

            // Otherwise, render as a standard inline 'code' element
            return <code {...props}>{children}</code>;
          },

          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,

          // Responsive table wrapper
          table: ({ children }) => (
            <div style={{ overflowX: 'auto' }}>
              <table>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,

          blockquote: ({ children }) => <blockquote>{children}</blockquote>,

          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),

          hr: () => <hr />,

          // Custom styling for '<pre>' blocks that aren't caught by the 'code' matcher
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                overflowX: 'auto',
                fontSize: '0.75rem',
                margin: '0.5rem 0',
              }}
            >
              {children}
            </pre>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
