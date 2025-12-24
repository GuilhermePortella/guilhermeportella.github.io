import { useEffect, useMemo, useState } from 'react';
import { loadAllArticles } from '../lib/articles';

const useArticles = (limit) => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus('loading');
      setError('');
      try {
        const data = await loadAllArticles();
        if (!active) {
          return;
        }
        setArticles(Array.isArray(data) ? data : []);
        setStatus('success');
      } catch (err) {
        if (!active) {
          return;
        }
        setArticles([]);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Erro ao carregar artigos.');
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const limited = useMemo(() => {
    if (typeof limit !== 'number') {
      return articles;
    }
    return articles.slice(0, limit);
  }, [articles, limit]);

  return {
    articles: limited,
    status,
    error
  };
};

export default useArticles;
