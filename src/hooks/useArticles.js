import { useEffect, useMemo, useState } from 'react';

const getIndexUrl = () => {
  const baseUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${baseUrl}/articles/index.json`;
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

const normalizeArticle = (item, index) => {
  const tags = Array.isArray(item.tags)
    ? item.tags
    : typeof item.tags === 'string'
      ? [item.tags]
      : [];

  return {
    id: item.id ?? index + 1,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || item.summary || '',
    category: item.category || tags[0] || 'Artigos',
    publishedAt: item.publishedAt || item.publishedDate || '',
    readTime: typeof item.readTime === 'number' ? item.readTime : Number(item.readTime) || null,
    tags
  };
};

const sortArticles = (items) => {
  return [...items].sort((a, b) => parseDateValue(b.publishedAt) - parseDateValue(a.publishedAt));
};

const useArticles = (limit) => {
  const [status, setStatus] = useState('loading');
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      setStatus('loading');
      setError('');

      try {
        const response = await fetch(getIndexUrl(), { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Articles index not available.');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid articles index.');
        }

        const normalized = data.map((item, index) => normalizeArticle(item, index));
        const sorted = sortArticles(normalized);
        setArticles(sorted);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setArticles([]);
        setError('Nao foi possivel carregar os artigos agora.');
        setStatus('error');
      }
    };

    fetchArticles();

    return () => controller.abort();
  }, []);

  const limited = useMemo(() => {
    if (typeof limit !== 'number') {
      return articles;
    }
    return articles.slice(0, limit);
  }, [articles, limit]);

  return { articles: limited, status, error };
};

export default useArticles;
