import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * formatResult(rawText)
 * Recibe texto del modelo y devuelve JSX formateado
 */
export function formatResult(rawText) {
  if (!rawText) return null;

  const highlightConcepts = (text) => {
    const regex = /\[\[([^\]]+?)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      const before = text.slice(lastIndex, start);
      if (before) parts.push(<span key={`t-${key++}`}>{before}</span>);

      const concept = match[1].trim();
      parts.push(
        <span
          key={`c-${key++}`}
          className="px-1 py-0.5 bg-yellow-100 rounded text-sm font-medium"
        >
          {concept}
        </span>
      );

      lastIndex = end;
    }

    const rest = text.slice(lastIndex);
    if (rest) parts.push(<span key={`t-${key++}`}>{rest}</span>);
    return parts;
  };

  const extractParagraph = (raw) => {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const main = lines.find(
      (l) => !/^(fuentes|sources|temas|related)/i.test(l) && l.length > 40
    );
    return main || lines.join(" ");
  };

  const extractSources = (raw) => {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const idx = lines.findIndex((l) => /^(fuentes|sources)[:\-]/i.test(l));
    if (idx >= 0)
      return lines[idx].replace(/^(fuentes|sources)[:\-]\s*/i, "");
    return null;
  };

  const extractRelated = (raw) => {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const idx = lines.findIndex((l) => /^(temas|related)/i.test(l));
    if (idx >= 0) {
      const text = lines[idx].replace(/^(temas|related)[:\-]\s*/i, "");
      return text
        .split(/[,;]+/)
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return [];
  };

  const paragraph = extractParagraph(rawText);
  const sourcesText = extractSources(rawText);
  const related = extractRelated(rawText);

  return (
    <div className="max-w-2xl p-4 rounded-xl bg-white shadow-sm">
      {paragraph && (
        <p className="text-sm leading-relaxed mb-3">
          {highlightConcepts(paragraph)}
        </p>
      )}

      {sourcesText && (
        <div className="text-xs text-gray-700 mt-2">
          <strong>Fuentes:</strong>
          <div className="prose prose-sm mt-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sourcesText}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="text-xs text-gray-600 mt-3">
          <strong>Temas relacionados:</strong>{" "}
          {related.map((t, i) => (
            <span key={i}>{(i ? ", " : "") + t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
