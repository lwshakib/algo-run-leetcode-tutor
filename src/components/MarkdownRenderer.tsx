import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <div
      className="markdown-content"
      style={{ fontSize: "0.875rem", lineHeight: "1.5" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "1rem 0 0.5rem 0",
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                margin: "0.875rem 0 0.5rem 0",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                margin: "0.75rem 0 0.5rem 0",
              }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                margin: "0.625rem 0 0.5rem 0",
              }}
            >
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5
              style={{
                fontSize: "0.875rem",
                fontWeight: "bold",
                margin: "0.5rem 0 0.5rem 0",
              }}
            >
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6
              style={{
                fontSize: "0.75rem",
                fontWeight: "bold",
                margin: "0.375rem 0 0.5rem 0",
              }}
            >
              {children}
            </h6>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p style={{ margin: "0.5rem 0", fontSize: "0.875rem" }}>
              {children}
            </p>
          ),

          // Bold and Italic
          strong: ({ children }) => (
            <strong style={{ fontWeight: "bold" }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: "italic" }}>{children}</em>
          ),

          // Code blocks and inline code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                customStyle={{ fontSize: "0.75rem", margin: "0.5rem 0" }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #e1e5e9",
                  padding: "0.125rem 0.25rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                }}
                {...props}
              >
                {children}
              </code>
            );
          },

          // Lists
          ul: ({ children }) => (
            <ul
              style={{
                margin: "0.5rem 0",
                paddingLeft: "1.5rem",
                fontSize: "0.875rem",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                margin: "0.5rem 0",
                paddingLeft: "1.5rem",
                fontSize: "0.875rem",
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: "0.25rem 0", fontSize: "0.875rem" }}>
              {children}
            </li>
          ),

          // Tables
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "0.5rem 0" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  fontSize: "0.75rem",
                  border: "1px solid #e1e5e9",
                }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead
              style={{
                backgroundColor: "transparent",
                borderBottom: "2px solid #e1e5e9",
              }}
            >
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th
              style={{
                border: "1px solid #e1e5e9",
                padding: "0.5rem",
                textAlign: "left",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                border: "1px solid #e1e5e9",
                padding: "0.5rem",
                fontSize: "0.75rem",
              }}
            >
              {children}
            </td>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "4px solid #e1e5e9",
                margin: "0.5rem 0",
                paddingLeft: "1rem",
                fontStyle: "italic",
                color: "#6c757d",
                fontSize: "0.875rem",
              }}
            >
              {children}
            </blockquote>
          ),

          // Links
          a: ({ children, href }) => (
            <a
              href={href}
              style={{
                color: "#007bff",
                textDecoration: "underline",
                fontSize: "0.875rem",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #e1e5e9",
                margin: "1rem 0",
              }}
            />
          ),

          // Pre blocks
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: "transparent",
                border: "1px solid #e1e5e9",
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
