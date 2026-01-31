import React, { useEffect, useMemo, useState } from 'react';

const WIKI_BASE_URL = 'https://backtothefuture.fandom.com';
const WIKI_API_URL = `${WIKI_BASE_URL}/api.php`;
const ALLORIGINS_URL = 'https://api.allorigins.win/raw?url=';
const JINA_PROXY_URL = 'https://r.jina.ai/http://';
const OFFICIAL_SITE_URL = 'https://www.backtothefuture.com/';
const DEFAULT_SEARCH = 'Marty McFly';

const DEFAULT_TRANSLATE_URL = 'https://libretranslate.de/translate';
const MYMEMORY_TRANSLATE_URL = 'https://api.mymemory.translated.net/get';
const MAX_TRANSLATE_LENGTH = 1200;
const MYMEMORY_MAX_CHUNK = 400;

const WIKI_SECTION_CONFIG = [
  {
    label: 'Resumo',
    matches: ['plot summary', 'story', 'summary', 'synopsis', 'overview', 'premise'],
    maxParagraphs: 2
  },
  {
    label: 'Biografia',
    matches: ['biography', 'history', 'background'],
    maxParagraphs: 2
  },
  {
    label: 'Aparicoes',
    matches: ['appearances', 'appearances and sources', 'sources', 'media appearances'],
    maxParagraphs: 1
  },
  {
    label: 'Poderes e habilidades',
    matches: ['powers and abilities', 'powers', 'abilities'],
    maxParagraphs: 1
  },
  {
    label: 'Personalidade',
    matches: ['personality', 'traits'],
    maxParagraphs: 1
  },
  {
    label: 'Aparencia',
    matches: ['appearance', 'physical appearance'],
    maxParagraphs: 1
  },
  {
    label: 'Relacionamentos',
    matches: ['relationships'],
    maxParagraphs: 1
  },
  {
    label: 'Curiosidades',
    matches: ['trivia'],
    maxParagraphs: 1
  }
];

const extractSummaryFromHtml = (html, maxParagraphs = 2) => {
  if (!html) {
    return '';
  }
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paragraphs = Array.from(doc.querySelectorAll('p'))
    .map((paragraph) => paragraph.textContent?.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) {
    return (doc.body?.textContent || '').trim();
  }
  return paragraphs.slice(0, maxParagraphs).join('\n\n');
};

const extractJsonFromJinaResponse = (text) => {
  if (!text) {
    return null;
  }
  const marker = 'Markdown Content:';
  const index = text.indexOf(marker);
  if (index === -1) {
    return null;
  }
  const jsonText = text.slice(index + marker.length).trim();
  if (!jsonText) {
    return null;
  }
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    return null;
  }
};

const fetchJsonWithFallback = async (url, signal) => {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error('Wiki request failed.');
    }
    return await response.json();
  } catch (err) {
    const normalized = url.replace(/^https?:\/\//, '');
    const jinaUrl = `${JINA_PROXY_URL}${normalized}`;
    const proxyUrl = `${ALLORIGINS_URL}${encodeURIComponent(jinaUrl)}`;
    const response = await fetch(proxyUrl, { signal });
    if (!response.ok) {
      throw new Error('Wiki request failed.');
    }
    const text = await response.text();
    const json = extractJsonFromJinaResponse(text);
    if (!json) {
      throw new Error('Wiki request failed.');
    }
    return json;
  }
};

const fetchWikiSections = async (title, signal) => {
  const params = new URLSearchParams({
    action: 'parse',
    format: 'json',
    origin: '*',
    page: title,
    prop: 'sections'
  });
  return fetchJsonWithFallback(`${WIKI_API_URL}?${params.toString()}`, signal);
};

const fetchWikiSectionHtml = async (title, section, signal) => {
  const params = new URLSearchParams({
    action: 'parse',
    format: 'json',
    origin: '*',
    page: title,
    prop: 'text'
  });
  if (section !== undefined && section !== null) {
    params.set('section', String(section));
  }
  return fetchJsonWithFallback(`${WIKI_API_URL}?${params.toString()}`, signal);
};

const findSectionMatch = (sections, matches) => {
  if (!Array.isArray(sections)) {
    return null;
  }
  return sections.find((section) => {
    const line = (section.line || '').toLowerCase();
    return matches.some((match) => line.includes(match));
  });
};

const buildWikiUrl = (title) => {
  if (!title) {
    return '';
  }
  const slug = title.trim().replace(/\s+/g, '_');
  return `${WIKI_BASE_URL}/wiki/${encodeURIComponent(slug)}`;
};

const splitTextIntoChunks = (text, maxLength) => {
  if (!text) {
    return [];
  }

  const chunks = [];
  const paragraphs = text.split(/\n{2,}/);

  const pushChunk = (chunk) => {
    const trimmed = chunk.trim();
    if (trimmed) {
      chunks.push(trimmed);
    }
  };

  const splitParagraph = (paragraph) => {
    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    let current = '';

    sentences.forEach((sentence) => {
      const trimmed = sentence.trim();
      if (!trimmed) {
        return;
      }

      const next = current ? `${current} ${trimmed}` : trimmed;
      if (next.length > maxLength) {
        if (current) {
          pushChunk(current);
        }
        if (trimmed.length > maxLength) {
          let remaining = trimmed;
          while (remaining.length > maxLength) {
            pushChunk(remaining.slice(0, maxLength));
            remaining = remaining.slice(maxLength);
          }
          current = remaining.trim();
        } else {
          current = trimmed;
        }
      } else {
        current = next;
      }
    });

    if (current) {
      pushChunk(current);
    }
  };

  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      return;
    }
    if (trimmed.length <= maxLength) {
      pushChunk(trimmed);
    } else {
      splitParagraph(trimmed);
    }
  });

  return chunks;
};

const translateWithLibreTranslate = async (text, apiUrl, apiKey, signal) => {
  const body = {
    q: text,
    source: 'auto',
    target: 'pt',
    format: 'text'
  };
  if (apiKey) {
    body.api_key = apiKey;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok) {
    throw new Error('Translate request failed.');
  }

  const payload = await response.json();
  return payload.translatedText || '';
};

const translateWithMyMemory = async (text, signal) => {
  const chunks = splitTextIntoChunks(text, MYMEMORY_MAX_CHUNK);
  if (chunks.length === 0) {
    return '';
  }

  const translatedChunks = [];
  for (const chunk of chunks) {
    const params = new URLSearchParams({
      q: chunk,
      langpair: 'en|pt'
    });
    const response = await fetch(`${MYMEMORY_TRANSLATE_URL}?${params.toString()}`, { signal });
    if (!response.ok) {
      throw new Error('Translate request failed.');
    }
    const payload = await response.json();
    const responseDetails = (payload.responseDetails || '').toLowerCase();
    const responseStatus = payload.responseStatus;
    const translatedText = payload.responseData?.translatedText || '';
    if (responseStatus && responseStatus !== 200) {
      throw new Error(payload.responseDetails || 'Translate request failed.');
    }
    if (!translatedText || responseDetails.includes('query length limit') || /query length limit/i.test(translatedText)) {
      throw new Error('Translate request failed.');
    }
    translatedChunks.push(translatedText.trim());
  }

  return translatedChunks.join('\n\n');
};

const translateTextToPortuguese = async (text, signal) => {
  if (!text) {
    return '';
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  const apiUrl = process.env.REACT_APP_TRANSLATE_URL || DEFAULT_TRANSLATE_URL;
  const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

  try {
    const translated = await translateWithLibreTranslate(trimmed, apiUrl, apiKey, signal);
    if (translated && translated.trim() && translated.trim().toLowerCase() !== trimmed.toLowerCase()) {
      return translated;
    }
  } catch (err) {
    // Fallback below.
  }

  const shortened = trimmed.length > MAX_TRANSLATE_LENGTH ? trimmed.slice(0, MAX_TRANSLATE_LENGTH) : trimmed;
  const fallback = await translateWithMyMemory(shortened, signal);
  if (fallback && fallback.trim()) {
    return fallback;
  }

  return '';
};

const fetchWikiPageByTitle = async (title, signal) => {
  const sectionsPayload = await fetchWikiSections(title, signal);
  if (!sectionsPayload || sectionsPayload.error || !sectionsPayload.parse) {
    return null;
  }
  const sections = sectionsPayload.parse?.sections ?? [];
  const pageTitle = sectionsPayload.parse?.title || title;
  const summarySections = [];

  for (const config of WIKI_SECTION_CONFIG) {
    const match = findSectionMatch(sections, config.matches);
    if (!match) {
      continue;
    }
    const sectionPayload = await fetchWikiSectionHtml(pageTitle, match.index, signal);
    if (!sectionPayload || sectionPayload.error || !sectionPayload.parse) {
      continue;
    }
    const sectionHtml = sectionPayload.parse?.text?.['*'] || '';
    const text = extractSummaryFromHtml(sectionHtml, config.maxParagraphs);
    if (text) {
      summarySections.push({
        title: config.label,
        text
      });
    }
  }

  if (summarySections.length === 0) {
    const leadPayload = await fetchWikiSectionHtml(pageTitle, '0', signal);
    if (leadPayload?.parse) {
      const summary = extractSummaryFromHtml(leadPayload.parse?.text?.['*'] || '', 2);
      if (summary) {
        summarySections.push({
          title: 'Resumo',
          text: summary
        });
      }
    }
  }

  return {
    title: pageTitle,
    sections: summarySections,
    url: buildWikiUrl(pageTitle)
  };
};

const fetchWikiPageBySearch = async (term, signal) => {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    list: 'search',
    srlimit: '1',
    srsearch: term
  });
  const payload = await fetchJsonWithFallback(`${WIKI_API_URL}?${params.toString()}`, signal);
  const result = payload.query?.search?.[0];
  if (!result?.title) {
    return null;
  }
  return fetchWikiPageByTitle(result.title, signal);
};

const BackToTheFuture = () => {
  const [searchInput, setSearchInput] = useState(DEFAULT_SEARCH);
  const [searchTerm, setSearchTerm] = useState(DEFAULT_SEARCH);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [wikiData, setWikiData] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    const loadWiki = async () => {
      setStatus('loading');
      setError('');
      setWikiData(null);

      try {
        let result = await fetchWikiPageByTitle(searchTerm, controller.signal);
        if (!result) {
          result = await fetchWikiPageBySearch(searchTerm, controller.signal);
        }

        if (!active) {
          return;
        }

        if (!result) {
          setStatus('empty');
          return;
        }

        let translationStatus = 'original';
        let translatedAny = false;
        let translatedAll = true;
        const translatedSections = [];

        for (const section of result.sections || []) {
          if (!section?.text) {
            translatedSections.push(section);
            continue;
          }
          try {
            const translatedText = await translateTextToPortuguese(section.text, controller.signal);
            if (translatedText && translatedText.trim()) {
              translatedAny = true;
              translatedSections.push({
                ...section,
                text: translatedText
              });
            } else {
              translatedAll = false;
              translatedSections.push(section);
            }
          } catch (translateError) {
            translatedAll = false;
            translatedSections.push(section);
          }
        }

        if (translatedAny) {
          translationStatus = translatedAll ? 'translated' : 'partial';
        } else if ((result.sections || []).some((section) => section?.text)) {
          translationStatus = 'failed';
        }

        setWikiData({
          ...result,
          sections: translatedSections,
          translationStatus
        });
        setStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError('Nao foi possivel carregar a wiki agora.');
      }
    };

    loadWiki();

    return () => {
      active = false;
      controller.abort();
    };
  }, [searchTerm]);

  const wikiPageUrl = useMemo(() => {
    if (wikiData?.url) {
      return wikiData.url;
    }
    const wikiTitle = wikiData?.title || searchTerm;
    if (!wikiTitle) {
      return '';
    }
    const slug = wikiTitle.trim().replace(/\s+/g, '_');
    return `${WIKI_BASE_URL}/wiki/${encodeURIComponent(slug)}`;
  }, [searchTerm, wikiData?.title, wikiData?.url]);

  return (
    <>
      <section aria-labelledby="bttf-title" className="bg-white text-center py-16 px-6">
        <h1 id="bttf-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Back to the Future Wiki
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Explore informacoes da Futurepedia (Fandom) com resumo traduzido e links oficiais.
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="bttf-official-title" className="mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-4xl mx-auto">
              <h2 id="bttf-official-title" className="text-2xl font-semibold text-gray-900">
                Site oficial
              </h2>
              <p className="mt-2 text-gray-600">
                Noticias, eventos e informacoes oficiais do universo Back to the Future.
              </p>
              <div className="mt-4">
                <a
                  href={OFFICIAL_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Visitar site oficial
                </a>
              </div>
            </div>
          </section>

          <section aria-labelledby="bttf-search-title" className="mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-4xl mx-auto">
              <h2 id="bttf-search-title" className="text-2xl font-semibold text-gray-900">
                Pesquisar na wiki
              </h2>
              <p className="mt-2 text-gray-600">
                Pesquise por personagens, lugares ou elementos da saga (ex.: Marty McFly, Doc Brown, DeLorean).
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSearchTerm(searchInput.trim() || DEFAULT_SEARCH);
                }}
              >
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Digite um termo para pesquisar"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    Buscar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput(DEFAULT_SEARCH);
                      setSearchTerm(DEFAULT_SEARCH);
                    }}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600"
                  >
                    Resetar
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section aria-labelledby="bttf-results-title">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 id="bttf-results-title" className="text-2xl font-semibold text-gray-900">
                    Resultado da wiki
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Termo atual: <span className="font-semibold text-gray-900">{searchTerm}</span>
                  </p>
                </div>
              </div>

              {status === 'loading' && (
                <div className="mt-6 text-center text-gray-600">Carregando wiki...</div>
              )}
              {status === 'error' && (
                <div className="mt-6 text-center text-red-600">{error}</div>
              )}
              {status === 'empty' && (
                <div className="mt-6 text-center text-gray-600">Nenhuma pagina encontrada.</div>
              )}
              {status === 'success' && (
                <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-lg p-6">
                  <div className="space-y-6 text-sm text-gray-600">
                    {(!wikiData?.sections || wikiData.sections.length === 0) && (
                      <p className="whitespace-pre-line">Resumo nao informado.</p>
                    )}
                    {(wikiData?.sections || []).map((section) => (
                      <div key={section.title || section.text?.slice(0, 20)}>
                        {section.title && (
                          <h4 className="text-base font-semibold text-gray-900">{section.title}</h4>
                        )}
                        <p className="mt-2 whitespace-pre-line">
                          {section.text || 'Resumo nao informado.'}
                        </p>
                      </div>
                    ))}
                    {wikiData?.sections?.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {wikiData?.translationStatus === 'translated' &&
                          'Resumo traduzido automaticamente para portugues.'}
                        {wikiData?.translationStatus === 'partial' &&
                          'Parte do resumo foi traduzida automaticamente.'}
                        {wikiData?.translationStatus === 'failed' &&
                          'Nao foi possivel traduzir agora. Exibindo o idioma original.'}
                        {(!wikiData?.translationStatus || wikiData?.translationStatus === 'original') &&
                          'Resumo exibido no idioma original.'}
                      </p>
                    )}
                    {wikiPageUrl && (
                      <p className="text-xs text-gray-500">
                        Fonte:{' '}
                        <a
                          href={wikiPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {wikiData?.title || 'Futurepedia (Fandom)'}
                        </a>
                        . Conteudo sob CC BY-SA 3.0. Atribuicao e historico na pagina.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BackToTheFuture;
