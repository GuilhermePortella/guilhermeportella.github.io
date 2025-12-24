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

const parseKeyValue = (line) => {
  const quotedDouble = /^"([^"]+)"\s*:\s*(.*)$/.exec(line);
  if (quotedDouble) {
    return { key: quotedDouble[1], rawValue: quotedDouble[2] };
  }
  const quotedSingle = /^'([^']+)'\s*:\s*(.*)$/.exec(line);
  if (quotedSingle) {
    return { key: quotedSingle[1], rawValue: quotedSingle[2] };
  }
  const plain = /^([A-Za-z0-9_@.-]+)\s*:\s*(.*)$/.exec(line);
  if (plain) {
    return { key: plain[1], rawValue: plain[2] };
  }
  return null;
};

const findNextContentLine = (lines, startIndex) => {
  for (let i = startIndex; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed === '---') {
      return null;
    }
    return { line: lines[i], indent: lines[i].match(/^(\s*)/)[1].length };
  }
  return null;
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
  const stack = [{ indent: -1, value: frontmatter }];
  let i = 1;

  for (; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '---') {
      i += 1;
      break;
    }
    if (!trimmed) {
      continue;
    }

    const indent = line.match(/^(\s*)/)[1].length;
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const current = stack[stack.length - 1].value;

    if (trimmed.startsWith('- ')) {
      if (!Array.isArray(current)) {
        continue;
      }
      current.push(stripQuotes(trimmed.slice(2)));
      continue;
    }

    const parsedKey = parseKeyValue(trimmed);
    if (!parsedKey) {
      continue;
    }

    const { key, rawValue } = parsedKey;
    if (!rawValue) {
      const nextLine = findNextContentLine(lines, i + 1);
      const shouldBeArray = nextLine && nextLine.indent > indent && nextLine.line.trim().startsWith('- ');
      const nestedValue = shouldBeArray ? [] : {};
      current[key] = nestedValue;
      stack.push({ indent, value: nestedValue });
      continue;
    }

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      const inner = rawValue.slice(1, -1).trim();
      current[key] = inner
        ? inner.split(',').map((item) => stripQuotes(item.trim())).filter(Boolean)
        : [];
      continue;
    }

    if ((key === 'tags' || key === 'keywords') && rawValue.includes(',')) {
      current[key] = rawValue
        .split(',')
        .map((item) => stripQuotes(item))
        .map((item) => item.trim())
        .filter(Boolean);
      continue;
    }

    current[key] = stripQuotes(rawValue);
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
    .replace(/[#>*_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
};

const VOID_HTML_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

const getHtmlTagName = (value) => {
  const trimmed = value.trim();
  if (!trimmed.startsWith('<') || trimmed.startsWith('</') || trimmed.startsWith('<!') || trimmed.startsWith('<?')) {
    return null;
  }
  const match = /^<([A-Za-z][A-Za-z0-9-]*)\b/.exec(trimmed);
  return match ? match[1].toLowerCase() : null;
};

const countHtmlTag = (line, tagName) => {
  const open = new RegExp(`<${tagName}(\\s|>|/|$)`, 'gi');
  const close = new RegExp(`</${tagName}\\s*>`, 'gi');
  const openCount = line.match(open)?.length ?? 0;
  const closeCount = line.match(close)?.length ?? 0;
  return openCount - closeCount;
};

const splitTableRow = (line) => {
  const trimmed = line.trim();
  const stripped = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return stripped.split('|').map((cell) => cell.trim());
};

const isTableSeparator = (line) => {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) {
    return false;
  }
  const cells = splitTableRow(trimmed);
  if (!cells.length) {
    return false;
  }
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};

const parseTableAlignments = (line) => {
  return splitTableRow(line).map((cell) => {
    if (cell.startsWith(':') && cell.endsWith(':')) {
      return 'center';
    }
    if (cell.startsWith(':')) {
      return 'left';
    }
    if (cell.endsWith(':')) {
      return 'right';
    }
    return null;
  });
};

const normalizeTableCells = (cells, count) => {
  const normalized = cells.slice(0, count);
  while (normalized.length < count) {
    normalized.push('');
  }
  return normalized;
};

const normalizeAlignments = (alignments, count) => {
  const normalized = alignments.slice(0, count);
  while (normalized.length < count) {
    normalized.push(null);
  }
  return normalized;
};

const buildTableRow = (cells, tag, alignments) => {
  return cells
    .map((cell, index) => {
      const alignment = alignments[index];
      const alignAttr = alignment ? ` style="text-align:${alignment};"` : '';
      return `<${tag}${alignAttr}>${parseInline(cell)}</${tag}>`;
    })
    .join('');
};

const normalizeCodeLanguage = (value) => {
  if (!value) {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
};

const markdownToHtml = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const htmlParts = [];
  let paragraph = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLanguage = '';
  let inHtmlBlock = false;
  let htmlBlockTag = '';
  let htmlBlockDepth = 0;
  let inHtmlVoidTag = false;
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

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (inHtmlBlock) {
      htmlParts.push(line);
      htmlBlockDepth += countHtmlTag(line, htmlBlockTag);
      if (htmlBlockDepth <= 0) {
        inHtmlBlock = false;
        htmlBlockTag = '';
        htmlBlockDepth = 0;
      }
      continue;
    }

    if (inHtmlVoidTag) {
      htmlParts.push(line);
      if (line.includes('>')) {
        inHtmlVoidTag = false;
      }
      continue;
    }

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        const normalizedLanguage = normalizeCodeLanguage(codeLanguage);
        const classAttr = normalizedLanguage ? ` class="language-${normalizedLanguage}"` : '';
        htmlParts.push(`<pre><code${classAttr}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCodeBlock = false;
        codeLines = [];
        codeLanguage = '';
      } else {
        flushParagraph();
        closeLists();
        closeBlockquote();
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      continue;
    }

    if (trimmed.startsWith('<')) {
      const tagName = getHtmlTagName(trimmed);
      flushParagraph();
      closeLists();
      closeBlockquote();

      if (!tagName) {
        htmlParts.push(line);
        continue;
      }

      if (VOID_HTML_TAGS.has(tagName)) {
        htmlParts.push(line);
        if (!trimmed.includes('>')) {
          inHtmlVoidTag = true;
        }
        continue;
      }

      inHtmlBlock = true;
      htmlBlockTag = tagName;
      htmlBlockDepth = 0;
      htmlParts.push(line);
      htmlBlockDepth += countHtmlTag(line, htmlBlockTag);
      if (htmlBlockDepth <= 0) {
        inHtmlBlock = false;
        htmlBlockTag = '';
        htmlBlockDepth = 0;
      }
      continue;
    }

    const nextLine = lines[i + 1];
    if (trimmed.includes('|') && nextLine && isTableSeparator(nextLine)) {
      flushParagraph();
      closeLists();
      closeBlockquote();

      const headerCells = splitTableRow(trimmed);
      const alignments = parseTableAlignments(nextLine);
      const rows = [];
      let rowIndex = i + 2;

      for (; rowIndex < lines.length; rowIndex += 1) {
        const rowLine = lines[rowIndex];
        const rowTrimmed = rowLine.trim();
        if (!rowTrimmed) {
          break;
        }
        if (!rowTrimmed.includes('|')) {
          break;
        }
        rows.push(splitTableRow(rowLine));
      }

      const columnCount = Math.max(
        headerCells.length,
        alignments.length,
        ...rows.map((row) => row.length)
      );
      const normalizedHeader = normalizeTableCells(headerCells, columnCount);
      const normalizedAlignments = normalizeAlignments(alignments, columnCount);

      htmlParts.push('<table>');
      htmlParts.push('<thead>');
      htmlParts.push(`<tr>${buildTableRow(normalizedHeader, 'th', normalizedAlignments)}</tr>`);
      htmlParts.push('</thead>');

      if (rows.length) {
        htmlParts.push('<tbody>');
        rows.forEach((row) => {
          const normalizedRow = normalizeTableCells(row, columnCount);
          htmlParts.push(`<tr>${buildTableRow(normalizedRow, 'td', normalizedAlignments)}</tr>`);
        });
        htmlParts.push('</tbody>');
      }

      htmlParts.push('</table>');
      i = rowIndex - 1;
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      flushParagraph();
      closeLists();
      closeBlockquote();
      htmlParts.push('<hr />');
      continue;
    }

    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      closeLists();
      closeBlockquote();
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
      continue;
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
      continue;
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
      continue;
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
      continue;
    }

    if (inUl || inOl) {
      closeLists();
    }
    if (inBlockquote) {
      closeBlockquote();
    }

    paragraph.push(trimmed);
  }

  if (inCodeBlock) {
    const normalizedLanguage = normalizeCodeLanguage(codeLanguage);
    const classAttr = normalizedLanguage ? ` class="language-${normalizedLanguage}"` : '';
    htmlParts.push(`<pre><code${classAttr}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
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
