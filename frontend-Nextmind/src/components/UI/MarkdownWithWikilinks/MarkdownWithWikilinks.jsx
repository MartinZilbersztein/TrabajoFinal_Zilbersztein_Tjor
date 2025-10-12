import ReactMarkdown from "react-markdown";
import "./MarkdownWithWikilinks.css";

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
export default function MarkdownWithWikilinks({
  source,
  resolveLink = (ref) => ({ to: `/notes/${encodeURIComponent(ref)}`, status: "ok" }),
  onNavigate,
  className,
}) {
  return (
    <ReactMarkdown
      children={source}
      remarkPlugins={[[remarkWikilinkPlugin]]}
      components={{
        a: ({node, href, children, ...props}) => (
          <WikiLink
            href={href}
            resolveLink={resolveLink}
            onNavigate={onNavigate}
            className={className}
            {...props}
          >
            {children}
          </WikiLink>
        ),
      }}
    />
  );
}
