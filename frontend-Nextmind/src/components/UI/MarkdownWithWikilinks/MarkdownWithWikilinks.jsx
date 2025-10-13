import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkWikiLink from "remark-wiki-link";
import "./MarkdownWithWikilinks.css";

// Component for <think> tags with dropdown
function ThinkDropdown({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="think-container">
      <button 
        className="think-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="think-toggle-icon">▶</span>
        <span className="think-toggle-text">Proceso de pensamiento</span>
      </button>
      {isOpen && (
        <div className="think-content">
          {children}
        </div>
      )}
    </div>
  );
}

// Split the markdown source into think content and answer content
function splitThinkSections(source) {
  if (!source || typeof source !== 'string') return { thinkSource: '', answerSource: source || '' };
  const thinkRegex = /<\s*Think\b[^>]*>([\s\S]*?)<\s*\/\s*Think\s*>/gi;
  const thinkParts = [];
  let answer = source;
  let match;
  while ((match = thinkRegex.exec(source)) !== null) {
    const inner = match[1] || '';
    thinkParts.push(inner.trim());
  }
  answer = answer.replace(thinkRegex, '').trim();
  const think = thinkParts.join("\n\n");
  return { thinkSource: think, answerSource: answer };
}

// WikiLink React component
function WikiLink({href, children, resolveLink, onNavigate, className, ...rest}) {
  // href like "wikilink:Page/Sub#Anchor" or normal url
  const isWikilink = href && href.startsWith("wikilink:");
  if (!isWikilink) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const ref = decodeURIComponent(href.slice("wikilink:".length));
  const {to, status} = resolveLink?.(ref) ?? {to: `/notes/${encodeURIComponent(ref)}`, status: "ok"};
  const handleClick = (e) => {
    if (onNavigate && !/^https?:\/\//.test(to)) {
      e.preventDefault();
      onNavigate(to);
    }
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`wikilink ${status || ""} ${className || ""}`}
      data-status={status}
      title={typeof children === "string" ? children : undefined}
      {...( /^https?:\/\//.test(to) ? {target: "_blank", rel: "noopener noreferrer"} : {})}
      {...rest}
    >
      <span className="wikilink-text">{children}</span>
      <span className="wikilink-icon" aria-hidden>{status === "missing" ? "➕" : "🔗"}</span>
    </a>
  );
}

// Main component
export default function MarkdownWithWikilinks({ source }) {
  const { thinkSource, answerSource } = splitThinkSections(source);
  return (
    <>
      {thinkSource && (
        <ThinkDropdown>
          <div className="think-content-inner">
            <ReactMarkdown
              children={thinkSource}
              remarkPlugins={[
                [remarkWikiLink, {
                  pageResolver: (pageName) => [pageName],
                  hrefTemplate: (href) => `?input=${encodeURIComponent(href)}`
                }]
              ]}
              components={{
                a: ({href, children, ...rest}) => {
                  const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
                  if (!isExternal) {
                    return <span {...rest}>{children}</span>;
                  }
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                      {children}
                    </a>
                  );
                }
              }}
              rehypePlugins={[ [rehypeRaw, { passThrough: [] }] ]}
            />
          </div>
        </ThinkDropdown>
      )}
      {answerSource && (
        <ReactMarkdown
          children={answerSource}
          remarkPlugins={[
            [remarkWikiLink, {
              pageResolver: (pageName) => [pageName],
              hrefTemplate: (href) => `?input=${encodeURIComponent(href)}`
            }]
          ]}
          components={{
            tools: ({ node }) => (<></>),
            a: ({href, children, ...rest}) => {
              const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
              if (!isExternal) {
                return <span {...rest}>{children}</span>;
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                  {children}
                </a>
              );
            }
          }}
          rehypePlugins={[ [rehypeRaw, { passThrough: [] }] ]}
        />
      )}
    </>
  );
}
