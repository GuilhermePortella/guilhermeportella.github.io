import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ARTICLES from '../data/articles';
import { formatLongDate } from '../utils/articleUtils';
import { parseMarkdown } from '../utils/markdown';

const Article = () => {
  const { slug } = useParams();
  const [status, setStatus] = useState('loading');
  const [articleHtml, setArticleHtml] = useState('');
  const [frontmatter, setFrontmatter] = useState({});
  const [readingTime, setReadingTime] = useState(null);

  const articleMeta = useMemo(() => {
    return ARTICLES.find((item) => item.slug === slug) || null;
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setStatus('error');
      return;
    }

    const controller = new AbortController();
    const baseUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    const articleUrl = `${baseUrl}/articles/${slug}.md`;

    const fetchArticle = async () => {
      setStatus('loading');

      try {
        const response = await fetch(articleUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Article not found.');
        }

        const markdown = await response.text();
        const parsed = parseMarkdown(markdown);

        setArticleHtml(parsed.html);
        setFrontmatter(parsed.frontmatter || {});
        setReadingTime(parsed.readingTime || null);
        setStatus('success');
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        setStatus('error');
      }
    };

    fetchArticle();

    return () => controller.abort();
  }, [slug]);

  const title = frontmatter.title || articleMeta?.title || (status === 'error' ? 'Artigo nao encontrado' : 'Carregando artigo');
  const summary = frontmatter.summary || articleMeta?.excerpt;
  const author = frontmatter.author || 'Guilherme Portella';
  const publishedAt = frontmatter.publishedAt || articleMeta?.publishedAt;
  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags
    : typeof frontmatter.tags === 'string'
      ? [frontmatter.tags]
      : Array.isArray(articleMeta?.tags)
        ? articleMeta.tags
        : [];

  const minutes = readingTime || articleMeta?.readTime;
  const dateLabel = formatLongDate(publishedAt);

  return (
    <>
      <section aria-labelledby="article-title" className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <nav className="mb-4 text-sm text-gray-500">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog/artigos" className="hover:underline">Artigos</Link>
          </nav>

          <h1 id="article-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          {summary && (
            <p className="mt-4 text-lg text-gray-600">
              {summary}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>Por {author}</span>
            {dateLabel && publishedAt && (
              <>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={publishedAt}>{dateLabel}</time>
              </>
            )}
            {minutes && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{minutes} min de leitura</span>
              </>
            )}
          </div>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          {status === 'loading' && (
            <p className="text-center text-gray-600">Carregando artigo...</p>
          )}
          {status === 'error' && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
              <p className="text-lg text-gray-600">
                Nao foi possivel encontrar este artigo.
              </p>
              <div className="mt-6">
                <Link to="/blog/artigos" className="text-blue-600 font-semibold hover:underline">
                  Voltar para a lista de artigos
                </Link>
              </div>
            </div>
          )}
          {status === 'success' && (
            <div className="article-content">
              <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
            </div>
          )}
          {status === 'success' && (
            <div className="mt-12 border-t border-gray-200 pt-6 flex items-center justify-between text-sm text-gray-600">
              <Link to="/blog/artigos" className="text-blue-600 hover:underline">
                &larr; Voltar para os artigos
              </Link>
              <a
                href="https://github.com/GuilhermePortella"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Ver GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Article;
