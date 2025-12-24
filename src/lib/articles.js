import { parseMarkdown } from '../utils/markdown';

const articlesContext = require.context('../articles', true, /\.md$/);

const normalizeSlug = (value) => {
  if (!value) {
    return '';
  }
  return value
    .toString()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
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

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
};

const loadMarkdownFile = async (key) => {
  const moduleValue = articlesContext(key);
  const url = moduleValue.default || moduleValue;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load article ${key}`);
  }
  if (typeof TextDecoder !== 'undefined') {
    const buffer = await response.arrayBuffer();
    return new TextDecoder('utf-8').decode(buffer);
  }
  return response.text();
};

const createArticleFromMarkdown = (markdown, key, index) => {
  const parsed = parseMarkdown(markdown);
  const frontmatter = parsed.frontmatter || {};
  const fileSlug = normalizeSlug(
    key
      .replace(/^\.\//, '')
      .replace(/\.md$/, '')
      .split(/[\\/]/)
      .pop()
  );
  const slug = normalizeSlug(frontmatter.slug || fileSlug);
  const title = frontmatter.title || slug.replace(/-/g, ' ');
  const summary = frontmatter.summary || frontmatter.excerpt || '';
  const tags = toArray(frontmatter.tags);
  const keywords = toArray(frontmatter.keywords);
  const category = frontmatter.category || tags[0] || 'Artigos';
  const publishedAt = frontmatter.publishedAt || frontmatter.publishedDate || '';
  const readTimeValue = Number(frontmatter.readTime);
  const readTime = Number.isFinite(readTimeValue) ? readTimeValue : parsed.readingTime;

  return {
    id: frontmatter.id ? Number(frontmatter.id) : index + 1,
    slug,
    title,
    excerpt: summary,
    category,
    publishedAt,
    readTime,
    tags,
    keywords,
    html: parsed.html,
    frontmatter,
    readingTime: parsed.readingTime
  };
};

let articlesCache = null;

export const loadAllArticles = async () => {
  if (articlesCache) {
    return articlesCache;
  }

  articlesCache = Promise.all(
    articlesContext.keys().map(async (key, index) => {
      try {
        const markdown = await loadMarkdownFile(key);
        return createArticleFromMarkdown(markdown, key, index);
      } catch {
        return null;
      }
    })
  ).then((items) => {
    const visible = items.filter(Boolean);
    const seen = new Set();
    const unique = [];
    for (const item of visible) {
      if (seen.has(item.slug)) {
        continue;
      }
      seen.add(item.slug);
      unique.push(item);
    }
    return unique.sort((a, b) => parseDateValue(b.publishedAt) - parseDateValue(a.publishedAt));
  });

  return articlesCache;
};

export const getAllArticles = () => loadAllArticles();

export const getArticleBySlug = async (slug) => {
  const normalized = normalizeSlug(slug);
  const articles = await loadAllArticles();
  return articles.find((item) => item.slug === normalized) || null;
};
