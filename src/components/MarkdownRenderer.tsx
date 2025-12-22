import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "./MarkdownRenderer.css";

// Code block component with copy button
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="code-block-container">
      {/* Header with language and copy button */}
      <div className="code-block-header">
        <span className="code-block-language">{language}</span>
        <button
          onClick={copyToClipboard}
          className={`copy-button ${copied ? "copied" : "not-copied"}`}
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

      {/* Code content */}
      <div className="code-content-wrapper">
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          customStyle={{
            fontSize: "0.75rem",
            margin: 0,
            padding: "1rem",
            backgroundColor: "transparent",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          h4: ({ children }) => <h4>{children}</h4>,
          h5: ({ children }) => <h5>{children}</h5>,
          h6: ({ children }) => <h6>{children}</h6>,

          // Paragraphs
          p: ({ children }) => <p>{children}</p>,

          // Bold and Italic
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,

          // Code blocks and inline code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && match) {
              // Code block with copy button
              return <CodeBlock code={codeString} language={match[1]} />;
            }

            // Inline code
            return <code {...props}>{children}</code>;
          },

          // Lists
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,

          // Tables
          table: ({ children }) => (
            <div style={{ overflowX: "auto" }}>
              <table>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,

          // Blockquotes
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,

          // Links
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => <hr />,

          // Pre blocks
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                overflowX: "auto",
                fontSize: "0.75rem",
                margin: "0.5rem 0",
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
