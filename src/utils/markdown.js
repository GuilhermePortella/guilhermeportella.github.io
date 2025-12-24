const escapeHtml = (value) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const stripQuotes = (value) => {
  if (!value) {
    return value;
  }
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const parseInline = (value) => {
  let rendered = escapeHtml(value);

  rendered = rendered.replace(/`([^`]+)`/g, '<code>$1</code>');
  rendered = rendered.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return rendered;
};

const parseFrontMatter = (markdown) => {
  const normalized = markdown.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---')) {
    return { frontmatter: {}, body: markdown };
  }

  const lines = normalized.split(/\r?\n/);
  if (lines[0].trim() !== '---') {
    return { frontmatter: {}, body: markdown };
  }

  const frontmatter = {};
  let currentKey = null;
  let i = 1;

  for (; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') {
      i += 1;
      break;
    }

    const keyMatch = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (keyMatch) {
      const key = keyMatch[1];
      const rawValue = keyMatch[2].trim();
      currentKey = key;

      if (!rawValue) {
        frontmatter[key] = [];
        continue;
      }

      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        const inner = rawValue.slice(1, -1).trim();
        frontmatter[key] = inner
          ? inner.split(',').map((item) => stripQuotes(item.trim())).filter(Boolean)
          : [];
        continue;
      }

      if ((key === 'tags' || key === 'keywords') && rawValue.includes(',')) {
        frontmatter[key] = rawValue
          .split(',')
          .map((item) => stripQuotes(item))
          .map((item) => item.trim())
          .filter(Boolean);
        continue;
      }

      frontmatter[key] = stripQuotes(rawValue);
      continue;
    }

    const listMatch = /^\s*-\s+(.*)$/.exec(line);
    if (listMatch && currentKey && Array.isArray(frontmatter[currentKey])) {
      frontmatter[currentKey].push(stripQuotes(listMatch[1]));
    }
  }

  if (i >= lines.length) {
    return { frontmatter: {}, body: markdown };
  }

  const body = lines.slice(i).join('\n');
  return { frontmatter, body };
};

const estimateReadingTime = (markdown) => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[#>*_\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
};

const markdownToHtml = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const htmlParts = [];
  let paragraph = [];
  let inCodeBlock = false;
  let codeLines = [];
  let inUl = false;
  let inOl = false;
  let inBlockquote = false;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    htmlParts.push(`<p>${parseInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeLists = () => {
    if (inUl) {
      htmlParts.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      htmlParts.push('</ol>');
      inOl = false;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      htmlParts.push('</blockquote>');
      inBlockquote = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        htmlParts.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCodeBlock = false;
        codeLines = [];
      } else {
        flushParagraph();
        closeLists();
        closeBlockquote();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      return;
    }

    if (trimmed === '---' || trimmed === '***') {
      flushParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push('<hr />');
      return;
    }

    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
      return;
    }

    const blockquoteMatch = /^>\s?(.*)$/.exec(trimmed);
    if (blockquoteMatch) {
      flushParagraph();
      closeLists();
      if (!inBlockquote) {
        htmlParts.push('<blockquote>');
        inBlockquote = true;
      }
      htmlParts.push(`<p>${parseInline(blockquoteMatch[1])}</p>`);
      return;
    }

    const olMatch = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (olMatch) {
      flushParagraph();
      closeBlockquote();
      if (!inOl) {
        closeLists();
        htmlParts.push('<ol>');
        inOl = true;
      }
      htmlParts.push(`<li>${parseInline(olMatch[1])}</li>`);
      return;
    }

    const ulMatch = /^[-*+]\s+(.*)$/.exec(trimmed);
    if (ulMatch) {
      flushParagraph();
      closeBlockquote();
      if (!inUl) {
        closeLists();
        htmlParts.push('<ul>');
        inUl = true;
      }
      htmlParts.push(`<li>${parseInline(ulMatch[1])}</li>`);
      return;
    }

    if (inUl || inOl) {
      closeLists();
    }
    if (inBlockquote) {
      closeBlockquote();
    }

    paragraph.push(trimmed);
  });

  if (inCodeBlock) {
    htmlParts.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  }

  flushParagraph();
  closeLists();
  closeBlockquote();

  return htmlParts.join('\n');
};

export const parseMarkdown = (markdown) => {
  const { frontmatter, body } = parseFrontMatter(markdown);
  const html = markdownToHtml(body);
  const readingTime = estimateReadingTime(body);

  return {
    frontmatter,
    html,
    readingTime
  };
};
