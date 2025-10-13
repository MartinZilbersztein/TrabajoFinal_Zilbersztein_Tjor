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

// Simple plugin: convert [[ref|label]] and [[ref]] to md link nodes
function remarkWikilinkPlugin() {
  return (tree) => {
    const visit = (node, parent) => {
      if (!node || !node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.type === "text") {
          const text = child.value;
          const parts = [];
          const regex = /$$\[([^$$\|]+)(?:\|([^\]]+))?\]\]/g;
          let lastIndex = 0;
          let m;
          let any = false;

          while ((m = regex.exec(text)) !== null) {
            any = true;
            if (m.index > lastIndex) parts.push({type: "text", value: text.slice(lastIndex, m.index)});
            const ref = m[1].trim();
            const label = (m[2] || ref).trim();
            // create a link node: use a custom url scheme "wikilink:" so we can detect it later
            parts.push({
              type: "link",
              url: `wikilink:${ref}`,
              title: null,
              children: [{type: "text", value: label}],
            });
            lastIndex = regex.lastIndex;
          }

          if (any) {
            if (lastIndex < text.length) parts.push({type: "text", value: text.slice(lastIndex)});
            // replace the single text node with the parts
            node.children.splice(i, 1, ...parts);
            i += parts.length - 1;
          }
        } else {
          visit(child, node);
        }
      }
    };
    visit(tree, null);
  };
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
  console.log(source);
  return (
    <ReactMarkdown
      children={source}
      remarkPlugins={[[remarkWikilinkPlugin]]}
      components={{
        think: ({ node, ...props }) => (
          <ThinkDropdown>
            <div className="think-content-inner">
              {props.children}
            </div>
          </ThinkDropdown>
        ),
        tools: ({ node }) => (
          <></>
        ),
      }}
      rehypePlugins={[
        [rehypeRaw, { passThrough: ['think'] }],
        [remarkWikiLink, {
          pageResolver: (pageName) => pageName,
          hrefTemplate: (href) => `?input=${encodeURIComponent(href)}`
        }]
      ]}
    />
  );
}
