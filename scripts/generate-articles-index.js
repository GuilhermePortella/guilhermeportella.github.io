const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'articles');
const OUTPUT_PATH = path.join(ARTICLES_DIR, 'index.json');

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

const parseInlineArray = (rawValue) => {
  const inner = rawValue.slice(1, -1).trim();
  return inner
    ? inner.split(',').map((item) => stripQuotes(item.trim())).filter(Boolean)
    : [];
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
      current[key] = parseInlineArray(rawValue);
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

const parseDateValue = (isoDate) => {
  if (!isoDate) {
    return 0;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return Date.UTC(year, month, day);
  }
  const parsed = Date.parse(isoDate);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const readArticles = () => {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }
  const files = fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith('.md'));

  return files.map((file, index) => {
    const slug = path.basename(file, '.md');
    const markdown = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const { frontmatter, body } = parseFrontMatter(markdown);
    const title = frontmatter.title || slug.replace(/-/g, ' ');
    const summary = frontmatter.summary || frontmatter.excerpt || '';
    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : typeof frontmatter.tags === 'string'
        ? [frontmatter.tags]
        : [];
    const keywords = Array.isArray(frontmatter.keywords)
      ? frontmatter.keywords
      : typeof frontmatter.keywords === 'string'
        ? [frontmatter.keywords]
        : [];
    const category = frontmatter.category || tags[0] || 'Artigos';
    const publishedAt = frontmatter.publishedAt || frontmatter.publishedDate || '';
    const readTime = frontmatter.readTime
      ? Number(frontmatter.readTime)
      : estimateReadingTime(body);

    return {
      id: index + 1,
      slug,
      title,
      excerpt: summary,
      category,
      publishedAt,
      readTime,
      tags,
      keywords
    };
  });
};

const writeIndex = (items) => {
  const sorted = [...items].sort((a, b) => parseDateValue(b.publishedAt) - parseDateValue(a.publishedAt));
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sorted, null, 2));
};

const articles = readArticles();
writeIndex(articles);
console.log(`Generated ${articles.length} articles in ${OUTPUT_PATH}`);
