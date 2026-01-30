import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const BASE_URL = 'https://rickandmortyapi.com/api';
const WIKI_BASE_URL = 'https://rickandmorty.fandom.com';
const WIKI_API_URL = `${WIKI_BASE_URL}/api.php`;
const DEFAULT_TRANSLATE_URL = 'https://libretranslate.de/translate';
const MYMEMORY_TRANSLATE_URL = 'https://api.mymemory.translated.net/get';
const MAX_TRANSLATE_LENGTH = 2200;
const MYMEMORY_MAX_CHUNK = 400;

const WIKI_SECTION_CONFIG = [
  {
    label: 'Biografia',
    matches: ['biography', 'history', 'background', 'overview'],
    maxParagraphs: 2
  },
  {
    label: 'Personalidade',
    matches: ['personality'],
    maxParagraphs: 1
  },
  {
    label: 'Aparencia',
    matches: ['appearance'],
    maxParagraphs: 1
  },
  {
    label: 'Habilidades',
    matches: ['abilities', 'powers'],
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

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Nao informado';
  }
  const normalized = String(value).toLowerCase();
  if (normalized === 'unknown' || normalized === 'n/a') {
    return 'Nao informado';
  }
  return value;
};

const getIdsFromUrls = (urls) => {
  if (!Array.isArray(urls)) {
    return [];
  }
  return urls
    .map((url) => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    })
    .filter(Boolean);
};

const fetchEpisodesByIds = async (ids, signal) => {
  if (!ids.length) {
    return [];
  }

  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }

  const results = [];
  for (const chunk of chunks) {
    const response = await fetch(`${BASE_URL}/episode/${chunk.join(',')}`, { signal });
    if (!response.ok) {
      throw new Error('Rick and Morty API request failed.');
    }
    const payload = await response.json();
    if (Array.isArray(payload)) {
      results.push(...payload);
    } else if (payload) {
      results.push(payload);
    }
  }

  return results;
};

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

const fetchWikiSections = async (title, signal) => {
  const params = new URLSearchParams({
    action: 'parse',
    format: 'json',
    origin: '*',
    page: title,
    prop: 'sections'
  });
  const response = await fetch(`${WIKI_API_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Wiki request failed.');
  }
  return response.json();
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
  const response = await fetch(`${WIKI_API_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Wiki request failed.');
  }
  return response.json();
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
  const response = await fetch(`${WIKI_API_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Wiki request failed.');
  }
  const payload = await response.json();
  const result = payload.query?.search?.[0];
  if (!result?.title) {
    return null;
  }
  return fetchWikiPageByTitle(result.title, signal);
};

const RickMortyCharacter = () => {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/rick-morty' : '/jogos/rick-morty';
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [episodesStatus, setEpisodesStatus] = useState('loading');
  const [activeTab, setActiveTab] = useState('episodes');
  const [wikiData, setWikiData] = useState(null);
  const [wikiStatus, setWikiStatus] = useState('idle');
  const [wikiError, setWikiError] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadCharacter = async () => {
      setStatus('loading');
      setError('');
      setEpisodes([]);
      setEpisodesStatus('loading');

      try {
        const response = await fetch(`${BASE_URL}/character/${id}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Rick and Morty API request failed.');
        }

        const payload = await response.json();
        if (!active) {
          return;
        }
        setCharacter(payload);
        setStatus('success');
        setActiveTab('episodes');

        const ids = getIdsFromUrls(payload.episode);
        if (!ids.length) {
          setEpisodesStatus('success');
          return;
        }

        const episodesData = await fetchEpisodesByIds(ids, controller.signal);
        if (!active) {
          return;
        }
        setEpisodes(episodesData);
        setEpisodesStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError('Nao foi possivel carregar este personagem.');
      }
    };

    loadCharacter();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    if (!character?.name) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    const loadWiki = async () => {
      setWikiStatus('loading');
      setWikiError('');
      setWikiData(null);

      try {
        let result = await fetchWikiPageByTitle(character.name, controller.signal);
        if (!result) {
          result = await fetchWikiPageBySearch(character.name, controller.signal);
        }

        if (!active) {
          return;
        }

        if (!result) {
          setWikiStatus('empty');
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
        setWikiStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setWikiStatus('error');
        setWikiError('Nao foi possivel carregar a wiki agora.');
      }
    };

    loadWiki();

    return () => {
      active = false;
      controller.abort();
    };
  }, [character?.name]);

  const episodeCount = useMemo(() => {
    if (!character || !Array.isArray(character.episode)) {
      return 0;
    }
    return character.episode.length;
  }, [character]);

  const wikiPageUrl = useMemo(() => {
    if (wikiData?.url) {
      return wikiData.url;
    }
    const title = wikiData?.title || character?.name;
    if (!title) {
      return '';
    }
    const slug = title.trim().replace(/\s+/g, '_');
    return `https://rickandmorty.fandom.com/wiki/${encodeURIComponent(slug)}`;
  }, [character?.name, wikiData?.title, wikiData?.url]);

  return (
    <>
      <section aria-labelledby="rickmorty-character-title" className="bg-white text-center py-16 px-6">
        <h1 id="rickmorty-character-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Detalhes do personagem
        </h1>
        <p className="mt-4 text-gray-600">
          Informacoes completas sobre o personagem selecionado.
        </p>
        <div className="mt-6">
          <Link
            to={basePath}
            className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-500"
          >
            Voltar para a lista
          </Link>
        </div>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {status === 'loading' && (
            <div className="text-center text-gray-600">Carregando personagem...</div>
          )}
          {status === 'error' && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {status === 'success' && character && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
                <div className="w-full">
                  {character.image && (
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{character.name}</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    ID #{character.id} • {formatValue(character.status)}
                  </p>
                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <dt className="font-semibold text-gray-700">Especie</dt>
                      <dd>{formatValue(character.species)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700">Genero</dt>
                      <dd>{formatValue(character.gender)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700">Tipo</dt>
                      <dd>{formatValue(character.type)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700">Origem</dt>
                      <dd>{formatValue(character.origin?.name)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700">Localizacao atual</dt>
                      <dd>{formatValue(character.location?.name)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-700">Total de episodios</dt>
                      <dd>{episodeCount}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('episodes')}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeTab === 'episodes'
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
                      }`}
                    aria-pressed={activeTab === 'episodes'}
                  >
                    Episodios
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('wiki')}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeTab === 'wiki'
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
                      }`}
                    aria-pressed={activeTab === 'wiki'}
                  >
                    Wiki (Fandom)
                  </button>
                </div>

                {activeTab === 'episodes' && (
                  <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Episodios</h3>
                    {episodesStatus === 'loading' && (
                      <p className="mt-4 text-sm text-gray-500">Carregando episodios...</p>
                    )}
                    {episodesStatus === 'success' && episodes.length === 0 && (
                      <p className="mt-4 text-sm text-gray-500">Nenhum episodio encontrado.</p>
                    )}
                    {episodesStatus === 'success' && episodes.length > 0 && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {episodes.map((episode) => (
                          <div key={episode.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">{episode.episode}</p>
                            <p className="text-lg font-semibold text-gray-900">{episode.name}</p>
                            <p className="text-sm text-gray-500">{formatValue(episode.air_date)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wiki' && (
                  <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Wiki (Fandom)</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Resumo da comunidade para complementar as informacoes do personagem.
                    </p>
                    {wikiStatus === 'loading' && (
                      <p className="mt-4 text-sm text-gray-500">Carregando wiki...</p>
                    )}
                    {wikiStatus === 'error' && (
                      <p className="mt-4 text-sm text-red-600">{wikiError}</p>
                    )}
                    {wikiStatus === 'empty' && (
                      <p className="mt-4 text-sm text-gray-500">Nenhuma pagina encontrada.</p>
                    )}
                    {wikiStatus === 'success' && (
                      <div className="mt-4 space-y-6 text-sm text-gray-600">
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
                              {wikiData?.title || 'Rick and Morty Wiki (Fandom)'}
                            </a>
                            . Conteudo sob CC BY-SA 3.0. Atribuicao e historico na pagina.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RickMortyCharacter;
