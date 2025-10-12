const urlRegex = /([hH][tT][tT][pP][sS]?:\/\/[^\s]+)/g;
const suggestionRegex = /\[\[([^\]]+?)\]\]/g; // non-greedy / don't cross multiple [[...]] groups
const boldRegex = /\*\*([^*]+?)\*\*/g;
const italicRegex = /_([^_]+?)_/g;
const listItemRegex = /^(\s*[-*]|\d+\.)\s+(.+)$/gm;
const hiddenTagsRegex = /<(think|tools)[^>]*>.*?<\/\1>/gis;

// Remove content within specified tags like <think> and <tools>
const removeHiddenContent = (text) => {
  if (!text) return text;
  // Convert to string in case it's a number or other type
  return String(text).replace(hiddenTagsRegex, '');
};

const formatUrlsInString = (text) => {
  if (text == null) return text;
  text = removeHiddenContent(text);
  if (text == null) return text;
  return String(text).split(urlRegex).map((part, idx) => {
    // split with a capturing group puts the captured text at odd indices
    if (idx % 2 === 1) {
      return (
        <a
          key={`link-${idx}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Format a single string (no React nodes) into an array of strings and suggestion <span>s
const formatSuggestionsInString = (text, keyPrefix) => {
  if (text == null) return text;
  return String(text).split(suggestionRegex).map((part, idx) => {
    // split with a capturing group puts the captured text at odd indices
    if (idx % 2 === 1) {
      return (
        <span key={`${keyPrefix}-sugg-${idx}`} className="suggestion">
          {part}
        </span>
      );
    }
    return part;
  });
};

// Format text with bold and italic styles
const formatTextStyles = (text) => {
  if (!text) return text;
  
  // Generate a unique ID for this formatting operation
  const uniqueId = Math.random().toString(36).substr(2, 9);
  
  return text
    .split(boldRegex)
    .map((part, idx, arr) => {
      // Skip empty parts that might be created by the split
      if (!part && idx > 0 && idx < arr.length - 1) return null;
      
      if (idx % 2 === 1) {
        return <strong key={`bold-${uniqueId}-${idx}`}>{part}</strong>;
      }
      
      // Process italics within non-bold text
      if (typeof part === 'string') {
        return part.split(italicRegex).map((subPart, subIdx, subArr) => {
          // Skip empty parts that might be created by the split
          if (!subPart && subIdx > 0 && subIdx < subArr.length - 1) return null;
          
          if (subIdx % 2 === 1) {
            return <em key={`em-${uniqueId}-${idx}-${subIdx}`}>{subPart}</em>;
          }
          return subPart || '';
        });
      }
      
      return part || '';
    })
    .filter(part => part !== null && part !== '')
    .flat();
};

// Format lists with proper HTML structure
const formatLists = (text) => {
  if (!text) return text;
  
  // Split by double newline to handle paragraphs/lists separately
  return text.split(/\n\s*\n/).map((paragraph, pIdx) => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const lines = paragraph.split('\n').filter(Boolean);
    const isList = lines.some(line => listItemRegex.test(line));
    
    if (!isList) {
      return <p key={`p-${uniqueId}-${pIdx}`}>{formatTextStyles(paragraph)}</p>;
    }
    
    const listItems = lines.map((line, idx) => {
      const match = line.match(listItemRegex);
      if (!match) return null;
      const [, , content] = match;
      return <li key={`li-${uniqueId}-${idx}`}>{formatTextStyles(content)}</li>;
    });
    
    return <ul key={`list-${uniqueId}`} style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>{listItems}</ul>;
  });
};

// Main formatter: returns an array of strings and React elements with all formatting applied
const formatMessage = (text) => {
  console.log(text);
  if (text == null) return null;
  
  // First remove any hidden content
  text = removeHiddenContent(text);
  
  // Ensure we have an array to work with
  const parts = Array.isArray(text) ? text : [text];
  
  // Process each part
  const formattedParts = parts.flatMap(part => {
    if (part === null || part === undefined) return [];
    
    // First format URLs
    const withUrls = formatUrlsInString(String(part));
    
    // Process each URL-formatted part
    return withUrls.flatMap(urlPart => {
      if (typeof urlPart !== 'string') return urlPart;
      
      // Format lists first (as they handle their own text formatting)
      const withLists = formatLists(urlPart);
      
      // If it's an array (list was found), return it
      if (Array.isArray(withLists)) {
        return withLists;
      }
      
      // Otherwise, format as regular text with styles and suggestions
      return formatSuggestionsInString(urlPart, Math.random().toString(36).substr(2, 9))
        .map(subPart => {
          if (typeof subPart === 'string') {
            return formatTextStyles(subPart);
          }
          return subPart;
        });
    });
  });
  
  return formattedParts.flat();
};

export default formatMessage;
