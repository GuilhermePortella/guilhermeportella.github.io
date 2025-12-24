import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ARTICLES from '../data/articles';
import { formatShortDate, parseArticleDate } from '../utils/articleUtils';

const Articles = () => {
  const articlesWithDates = useMemo(() => {
    return ARTICLES.map((article) => {
      const parsed = parseArticleDate(article.publishedAt);
      return {
        ...article,
        parsedDate: parsed ? parsed.date : null,
        isDateOnly: parsed ? parsed.isDateOnly : false
      };
    });
  }, []);

  const years = useMemo(() => {
    const yearSet = new Set();
    articlesWithDates.forEach((article) => {
      if (article.parsedDate) {
        const year = article.isDateOnly ? article.parsedDate.getUTCFullYear() : article.parsedDate.getFullYear();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [articlesWithDates]);

  const [selectedYear, setSelectedYear] = useState(() => years[0] ?? null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (!selectedYear && years.length > 0) {
      setSelectedYear(years[0]);
    }
  }, [selectedYear, years]);

  useEffect(() => {
    setSelectedMonth(null);
  }, [selectedYear]);

  const months = useMemo(() => {
    if (!selectedYear) {
      return [];
    }
    const monthSet = new Map();
    articlesWithDates.forEach((article) => {
      if (!article.parsedDate) {
        return;
      }
      const year = article.isDateOnly ? article.parsedDate.getUTCFullYear() : article.parsedDate.getFullYear();
      if (year !== selectedYear) {
        return;
      }
      const monthIndex = article.isDateOnly ? article.parsedDate.getUTCMonth() : article.parsedDate.getMonth();
      if (!monthSet.has(monthIndex)) {
        const label = article.parsedDate.toLocaleDateString('pt-BR', {
          month: 'long',
          ...(article.isDateOnly ? { timeZone: 'UTC' } : {})
        });
        const formatted = label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
        monthSet.set(monthIndex, { value: monthIndex, label: formatted });
      }
    });
    return Array.from(monthSet.values()).sort((a, b) => b.value - a.value);
  }, [articlesWithDates, selectedYear]);

  const filteredArticles = useMemo(() => {
    const list = articlesWithDates.filter((article) => {
      if (!article.parsedDate) {
        return !selectedYear;
      }
      if (selectedYear) {
        const year = article.isDateOnly ? article.parsedDate.getUTCFullYear() : article.parsedDate.getFullYear();
        if (year !== selectedYear) {
          return false;
        }
      }
      if (selectedMonth !== null) {
        const month = article.isDateOnly ? article.parsedDate.getUTCMonth() : article.parsedDate.getMonth();
        if (month !== selectedMonth) {
          return false;
        }
      }
      return true;
    });

    return list.sort((a, b) => {
      const aTime = a.parsedDate ? a.parsedDate.getTime() : 0;
      const bTime = b.parsedDate ? b.parsedDate.getTime() : 0;
      return bTime - aTime;
    });
  }, [articlesWithDates, selectedMonth, selectedYear]);

  return (
    <>
      <section aria-labelledby="articles-title" className="bg-white text-center py-16 px-6">
        <h1 id="articles-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Artigos</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Lista completa de anotacoes, rascunhos e aprendizados recentes.
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="articles-list-title">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="articles-list-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Todos os artigos
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Estou organizando estes temas agora. Em breve entram os textos completos.
              </p>
            </div>
            {years.length > 0 && (
              <div className="mt-12 bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <label htmlFor="articles-year" className="text-sm font-semibold text-gray-700">
                      Ano
                    </label>
                    <select
                      id="articles-year"
                      value={selectedYear ?? ''}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setSelectedYear(Number.isNaN(value) ? null : value);
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  {months.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMonth(null)}
                        className={`rounded-md border px-3 py-1 text-sm font-semibold transition ${
                          selectedMonth === null
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                        }`}
                        aria-pressed={selectedMonth === null}
                      >
                        Todos
                      </button>
                      {months.map((month) => (
                        <button
                          key={month.value}
                          type="button"
                          onClick={() => setSelectedMonth(month.value)}
                          className={`rounded-md border px-3 py-1 text-sm font-semibold transition ${
                            selectedMonth === month.value
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                          }`}
                          aria-pressed={selectedMonth === month.value}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.length === 0 && (
                <div className="col-span-full text-center text-gray-600">
                  Nenhum artigo encontrado para este filtro.
                </div>
              )}
              {filteredArticles.map((article) => {
                const dateLabel = formatShortDate(article.publishedAt) || 'Sem data';

                return (
                  <Link
                    key={article.id}
                    to={`/blog/artigos/${article.slug}`}
                    className="group block"
                    aria-label={`Ler artigo ${article.title}`}
                  >
                    <article className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col h-full transition-shadow duration-300 group-hover:shadow-xl">
                      <div className="p-6 flex-grow">
                        <p className="text-sm text-gray-500 mb-2">{article.category}</p>
                        <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                        <p className="mt-4 text-gray-600">{article.excerpt}</p>
                      </div>
                      <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                        <span>{dateLabel}</span>
                        <span>{article.readTime} min</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="articles-cta-title" className="mt-20">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
              <h2 id="articles-cta-title" className="text-3xl font-bold text-gray-900">Quer sugerir um tema?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Posso incluir assuntos que voce gostaria de ler por aqui.
              </p>
              <div className="mt-8">
                <Link
                  to="/contato"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Falar comigo
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Articles;
