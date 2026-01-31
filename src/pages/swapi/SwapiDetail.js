import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const BASE_URL = 'https://swapi.dev/api';
const WIKI_BASE_URL = 'https://starwars.fandom.com';
const WIKI_API_URL = `${WIKI_BASE_URL}/api.php`;
const DEFAULT_TRANSLATE_URL = 'https://libretranslate.de/translate';
const MYMEMORY_TRANSLATE_URL = 'https://api.mymemory.translated.net/get';
const MAX_TRANSLATE_LENGTH = 1200;
const MYMEMORY_MAX_CHUNK = 400;

const WIKI_SECTION_CONFIG = [
  {
    label: 'Resumo',
    matches: ['plot summary', 'story', 'summary', 'synopsis', 'overview'],
    maxParagraphs: 2
  },
  {
    label: 'Biografia',
    matches: ['biography', 'history', 'background'],
    maxParagraphs: 2
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

const RESOURCE_CONFIG = {
  people: {
    label: 'Pessoa',
    details: [
      { key: 'birth_year', label: 'Ano de nascimento', format: 'birth_year' },
      { key: 'gender', label: 'Genero', format: 'gender' },
      { key: 'height', label: 'Altura' },
      { key: 'mass', label: 'Peso' },
      { key: 'hair_color', label: 'Cor do cabelo' },
      { key: 'skin_color', label: 'Cor da pele' },
      { key: 'eye_color', label: 'Cor dos olhos' }
    ],
    relations: {
      homeworld: 'Planeta natal',
      species: 'Especies',
      films: 'Filmes',
      starships: 'Naves',
      vehicles: 'Veiculos'
    }
  },
  films: {
    label: 'Filme',
    details: [
      { key: 'episode_id', label: 'Episodio' },
      { key: 'director', label: 'Direcao' },
      { key: 'producer', label: 'Producao' },
      { key: 'release_date', label: 'Lancamento', format: 'date' },
      { key: 'opening_crawl', label: 'Abertura' }
    ],
    relations: {
      characters: 'Personagens',
      planets: 'Planetas',
      starships: 'Naves',
      vehicles: 'Veiculos',
      species: 'Especies'
    }
  },
  planets: {
    label: 'Planeta',
    details: [
      { key: 'climate', label: 'Clima' },
      { key: 'terrain', label: 'Terreno' },
      { key: 'surface_water', label: 'Superficie com agua' },
      { key: 'population', label: 'Populacao' },
      { key: 'diameter', label: 'Diametro' },
      { key: 'gravity', label: 'Gravidade' },
      { key: 'rotation_period', label: 'Periodo de rotacao' },
      { key: 'orbital_period', label: 'Periodo orbital' }
    ],
    relations: {
      residents: 'Residentes',
      films: 'Filmes'
    }
  },
  starships: {
    label: 'Nave',
    details: [
      { key: 'model', label: 'Modelo' },
      { key: 'manufacturer', label: 'Fabricante' },
      { key: 'cost_in_credits', label: 'Custo (creditos)' },
      { key: 'length', label: 'Comprimento' },
      { key: 'crew', label: 'Tripulacao' },
      { key: 'passengers', label: 'Passageiros' },
      { key: 'max_atmosphering_speed', label: 'Velocidade maxima' },
      { key: 'hyperdrive_rating', label: 'Hyperdrive' },
      { key: 'MGLT', label: 'MGLT' },
      { key: 'cargo_capacity', label: 'Capacidade de carga' },
      { key: 'consumables', label: 'Consumiveis' },
      { key: 'starship_class', label: 'Classe' }
    ],
    relations: {
      pilots: 'Pilotos',
      films: 'Filmes'
    }
  },
  species: {
    label: 'Especie',
    details: [
      { key: 'classification', label: 'Classificacao' },
      { key: 'designation', label: 'Designacao' },
      { key: 'average_height', label: 'Altura media' },
      { key: 'skin_colors', label: 'Cores de pele' },
      { key: 'hair_colors', label: 'Cores de cabelo' },
      { key: 'eye_colors', label: 'Cores de olhos' },
      { key: 'average_lifespan', label: 'Longevidade media' },
      { key: 'language', label: 'Idioma' }
    ],
    relations: {
      homeworld: 'Planeta natal',
      people: 'Pessoas',
      films: 'Filmes'
    }
  },
  vehicles: {
    label: 'Veiculo',
    details: [
      { key: 'model', label: 'Modelo' },
      { key: 'manufacturer', label: 'Fabricante' },
      { key: 'cost_in_credits', label: 'Custo (creditos)' },
      { key: 'length', label: 'Comprimento' },
      { key: 'crew', label: 'Tripulacao' },
      { key: 'passengers', label: 'Passageiros' },
      { key: 'max_atmosphering_speed', label: 'Velocidade maxima' },
      { key: 'cargo_capacity', label: 'Capacidade de carga' },
      { key: 'consumables', label: 'Consumiveis' },
      { key: 'vehicle_class', label: 'Classe' }
    ],
    relations: {
      pilots: 'Pilotos',
      films: 'Filmes'
    }
  }
};

const formatValue = (value) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'Nao informado';
    }
    return value.join(', ');
  }
  if (value === null || value === undefined || value === '') {
    return 'Nao informado';
  }
  const normalized = String(value).toLowerCase();
  if (normalized === 'unknown' || normalized === 'n/a') {
    return 'Nao informado';
  }
  return value;
};

const formatDate = (value) => {
  if (!value) {
    return 'Nao informado';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatBirthYear = (value) => {
  if (!value) {
    return 'Nao informado';
  }
  const normalized = String(value).trim();
  const lowered = normalized.toLowerCase();
  if (lowered === 'unknown' || lowered === 'n/a') {
    return 'Nao informado';
  }
  const match = /^(\d+(?:\.\d+)?)(bby|aby)$/i.exec(normalized);
  if (match) {
    return `${match[1]} ${match[2].toUpperCase()}`;
  }
  return value;
};

const formatGender = (value) => {
  if (!value) {
    return 'Nao informado';
  }
  const normalized = String(value).toLowerCase();
  if (normalized === 'male') {
    return 'Masculino';
  }
  if (normalized === 'female') {
    return 'Feminino';
  }
  if (normalized === 'hermaphrodite') {
    return 'Hermafrodita';
  }
  if (normalized === 'none') {
    return 'Nenhum';
  }
  if (normalized === 'unknown' || normalized === 'n/a') {
    return 'Nao informado';
  }
  return value;
};

const getIdFromUrl = (url) => {
  if (!url) {
    return '';
  }
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
};

const fetchResourceLabel = async (url, signal) => {
  if (!url) {
    return '';
  }
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('SWAPI request failed.');
  }
  const payload = await response.json();
  return payload.name || payload.title || '';
};

const fetchResourceLabels = async (urls, signal) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return [];
  }
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        return await fetchResourceLabel(url, signal);
      } catch (err) {
        if (err.name === 'AbortError') {
          throw err;
        }
        return '';
      }
    })
  );
  return results.filter(Boolean);
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

const SwapiDetail = () => {
  const { resource, id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/swapi' : '/jogos/swapi';
  const config = RESOURCE_CONFIG[resource];
  const [item, setItem] = useState(null);
  const [relations, setRelations] = useState({});
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [relationsStatus, setRelationsStatus] = useState('idle');
  const [wikiData, setWikiData] = useState(null);
  const [wikiStatus, setWikiStatus] = useState('idle');
  const [wikiError, setWikiError] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      if (!config) {
        setStatus('error');
        setError('Recurso nao encontrado.');
        return;
      }

      setStatus('loading');
      setError('');
      setRelations({});
      setRelationsStatus('idle');

      try {
        const response = await fetch(`${BASE_URL}/${resource}/${id}/`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('SWAPI request failed.');
        }

        const payload = await response.json();
        if (!active) {
          return;
        }
        setItem(payload);
        setStatus('success');

        const relationEntries = Object.entries(config.relations || {});
        if (relationEntries.length === 0) {
          setRelationsStatus('success');
          return;
        }

        setRelationsStatus('loading');
        const resolved = {};
        await Promise.all(
          relationEntries.map(async ([key]) => {
            const value = payload[key];
            if (Array.isArray(value)) {
              resolved[key] = await fetchResourceLabels(value, controller.signal);
            } else if (typeof value === 'string') {
              resolved[key] = await fetchResourceLabel(value, controller.signal);
            } else {
              resolved[key] = [];
            }
          })
        );

        if (!active) {
          return;
        }
        setRelations(resolved);
        setRelationsStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError('Nao foi possivel carregar este item.');
      }
    };

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [resource, id, config]);

  const title = useMemo(() => {
    if (!item) {
      return '';
    }
    return item.name || item.title || 'Sem titulo';
  }, [item]);

  useEffect(() => {
    if (!title) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    const loadWiki = async () => {
      setWikiStatus('loading');
      setWikiError('');
      setWikiData(null);

      try {
        let result = await fetchWikiPageByTitle(title, controller.signal);
        if (!result) {
          result = await fetchWikiPageBySearch(title, controller.signal);
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
  }, [title]);

  const wikiPageUrl = useMemo(() => {
    if (wikiData?.url) {
      return wikiData.url;
    }
    const wikiTitle = wikiData?.title || title;
    if (!wikiTitle) {
      return '';
    }
    const slug = wikiTitle.trim().replace(/\\s+/g, '_');
    return `${WIKI_BASE_URL}/wiki/${encodeURIComponent(slug)}`;
  }, [title, wikiData?.title, wikiData?.url]);

  const renderFieldValue = (field, value) => {
    if (field.format === 'date') {
      return formatDate(value);
    }
    if (field.format === 'birth_year') {
      return formatBirthYear(value);
    }
    if (field.format === 'gender') {
      return formatGender(value);
    }
    return formatValue(value);
  };

  return (
    <>
      <section aria-labelledby="swapi-detail-title" className="bg-white text-center py-16 px-6">
        <h1 id="swapi-detail-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Detalhes {config ? `de ${config.label}` : ''}
        </h1>
        <p className="mt-4 text-gray-600">
          Informacoes completas do item selecionado.
        </p>
        <div className="mt-6">
          <Link
            to={basePath}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            Voltar para a lista
          </Link>
        </div>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {status === 'loading' && (
            <div className="text-center text-gray-600">Carregando dados...</div>
          )}
          {status === 'error' && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {status === 'success' && item && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500">
                  {config?.label || 'Recurso'}
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                {item.url && (
                  <div>
                    <dt className="font-semibold text-gray-700">ID</dt>
                    <dd>{getIdFromUrl(item.url)}</dd>
                  </div>
                )}
                {config?.details.map((field) => (
                  <div key={field.key} className={field.key === 'opening_crawl' ? 'sm:col-span-2' : undefined}>
                    <dt className="font-semibold text-gray-700">{field.label}</dt>
                    <dd className="mt-1 whitespace-pre-line">{renderFieldValue(field, item[field.key])}</dd>
                  </div>
                ))}
                {'created' in item && (
                  <div>
                    <dt className="font-semibold text-gray-700">Criado em</dt>
                    <dd>{formatDate(item.created)}</dd>
                  </div>
                )}
                {'edited' in item && (
                  <div>
                    <dt className="font-semibold text-gray-700">Atualizado em</dt>
                    <dd>{formatDate(item.edited)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-gray-900">Relacionamentos</h3>
                {relationsStatus === 'loading' && (
                  <p className="mt-4 text-sm text-gray-500">Carregando relacionamentos...</p>
                )}
                {relationsStatus === 'success' && Object.keys(relations).length === 0 && (
                  <p className="mt-4 text-sm text-gray-500">Nenhuma relacao disponivel.</p>
                )}
                {relationsStatus === 'success' && Object.keys(relations).length > 0 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(config.relations || {}).map(([key, label]) => {
                      const value = relations[key];
                      const items = Array.isArray(value) ? value : value ? [value] : [];

                      return (
                        <div key={key} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <p className="text-sm font-semibold text-gray-700">
                            {label} ({items.length})
                          </p>
                          {items.length === 0 && (
                            <p className="mt-2 text-sm text-gray-500">Nao informado.</p>
                          )}
                          {items.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm text-gray-600">
                              {items.map((itemLabel) => (
                                <li key={`${key}-${itemLabel}`}>{itemLabel}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  )}
              </div>

              <div className="mt-10 border-t border-gray-200 pt-6">
                <h3 className="text-2xl font-semibold text-gray-900">Wiki (Fandom)</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Resumo da comunidade para complementar as informacoes deste item.
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
                          {wikiData?.title || 'Star Wars Wiki (Fandom)'}
                        </a>
                        . Conteudo sob CC BY-SA 3.0. Atribuicao e historico na pagina.
                      </p>
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

export default SwapiDetail;
