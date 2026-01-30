import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BASE_URL = 'https://swapi.dev/api';
const PAGE_SIZE = 12;
const SWAPI_PAGE_SIZE = 10;

const RESOURCE_CONFIG = {
  people: {
    label: 'Pessoas',
    description: 'Personagens e pilotos do universo Star Wars.',
    fields: [
      { key: 'birth_year', label: 'Ano de nascimento', format: 'birth_year' },
      { key: 'gender', label: 'Genero', format: 'gender' },
      { key: 'height', label: 'Altura' },
      { key: 'mass', label: 'Peso' },
      { key: 'homeworldName', label: 'Planeta natal' },
      { key: 'filmsNames', label: 'Filmes' },
      { key: 'starshipsNames', label: 'Naves' }
    ]
  },
  films: {
    label: 'Filmes',
    description: 'Longas e episodios da saga.',
    fields: [
      { key: 'episode_id', label: 'Episodio' },
      { key: 'director', label: 'Direcao' },
      { key: 'producer', label: 'Producao' },
      { key: 'release_date', label: 'Lancamento', format: 'date' }
    ]
  },
  planets: {
    label: 'Planetas',
    description: 'Mundos, climas e dados ambientais.',
    fields: [
      { key: 'climate', label: 'Clima' },
      { key: 'terrain', label: 'Terreno' },
      { key: 'population', label: 'Populacao' },
      { key: 'diameter', label: 'Diametro' }
    ]
  },
  starships: {
    label: 'Naves',
    description: 'Naves, modelos e capacidades.',
    fields: [
      { key: 'model', label: 'Modelo' },
      { key: 'manufacturer', label: 'Fabricante' },
      { key: 'crew', label: 'Tripulacao' },
      { key: 'hyperdrive_rating', label: 'Hyperdrive' }
    ]
  },
  species: {
    label: 'Especies',
    description: 'Especies e classificacoes registradas.',
    fields: [
      { key: 'classification', label: 'Classificacao' },
      { key: 'designation', label: 'Designacao' },
      { key: 'language', label: 'Idioma' },
      { key: 'average_lifespan', label: 'Longevidade media' }
    ]
  },
  vehicles: {
    label: 'Veiculos',
    description: 'Veiculos terrestres e de combate.',
    fields: [
      { key: 'model', label: 'Modelo' },
      { key: 'manufacturer', label: 'Fabricante' },
      { key: 'crew', label: 'Tripulacao' },
      { key: 'vehicle_class', label: 'Classe' }
    ]
  }
};

const resourceLabelCache = new Map();

const fetchResourceLabel = async (url, signal) => {
  if (!url) {
    return '';
  }
  if (resourceLabelCache.has(url)) {
    return resourceLabelCache.get(url);
  }
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('SWAPI request failed.');
  }
  const payload = await response.json();
  const label = payload.name || payload.title || '';
  resourceLabelCache.set(url, label);
  return label;
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

const enrichPeople = async (results, signal) => {
  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }
  return Promise.all(
    results.map(async (person) => {
      try {
        const [homeworldName, filmsNames, starshipsNames] = await Promise.all([
          person.homeworld ? fetchResourceLabel(person.homeworld, signal) : '',
          fetchResourceLabels(person.films, signal),
          fetchResourceLabels(person.starships, signal)
        ]);

        return {
          ...person,
          homeworldName,
          filmsNames,
          starshipsNames
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          throw err;
        }
        return {
          ...person,
          homeworldName: '',
          filmsNames: [],
          starshipsNames: []
        };
      }
    })
  );
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

const formatFieldValue = (value, field) => {
  if (!field?.format) {
    return formatValue(value);
  }
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

const getIdFromUrl = (url) => {
  if (!url) {
    return '';
  }
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
};

const Swapi = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/swapi' : '/jogos/swapi';
  const [resource, setResource] = useState('people');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ count: 0, results: [] });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      setStatus('loading');
      setError('');

      const baseParams = new URLSearchParams();
      if (searchTerm) {
        baseParams.set('search', searchTerm);
      }

      try {
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE - 1;
        const swapiStart = Math.floor(startIndex / SWAPI_PAGE_SIZE) + 1;
        const swapiEnd = Math.floor(endIndex / SWAPI_PAGE_SIZE) + 1;

        const fetchPage = async (pageNumber) => {
          const params = new URLSearchParams(baseParams);
          params.set('page', String(pageNumber));
          const response = await fetch(`${BASE_URL}/${resource}/?${params.toString()}`, {
            signal: controller.signal
          });

          if (response.status === 404) {
            return { count: 0, results: [] };
          }

          if (!response.ok) {
            throw new Error('SWAPI request failed.');
          }

          const payload = await response.json();
          return {
            count: payload.count ?? 0,
            results: Array.isArray(payload.results) ? payload.results : []
          };
        };

        const firstPayload = await fetchPage(swapiStart);
        let combinedResults = firstPayload.results;

        if (swapiEnd !== swapiStart && endIndex < firstPayload.count) {
          const secondPayload = await fetchPage(swapiEnd);
          combinedResults = combinedResults.concat(secondPayload.results);
        }

        const offset = startIndex - (swapiStart - 1) * SWAPI_PAGE_SIZE;
        let results = combinedResults.slice(offset, offset + PAGE_SIZE);

        if (resource === 'people') {
          results = await enrichPeople(results, controller.signal);
        }

        if (!active) {
          return;
        }

        setData({
          count: firstPayload.count,
          results
        });
        setStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError('Nao foi possivel carregar a SWAPI agora.');
      }
    };

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [resource, searchTerm, page]);

  const totalPages = useMemo(() => {
    if (!data.count) {
      return 1;
    }
    return Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  }, [data.count]);

  const config = RESOURCE_CONFIG[resource];

  return (
    <>
      <section aria-labelledby="swapi-title" className="bg-white text-center py-16 px-6">
        <h1 id="swapi-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Explorador SWAPI
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Implementacao simples para explorar dados publicos da Star Wars API.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Fonte: <a href="https://swapi.dev" target="_blank" rel="noopener noreferrer" className="underline">swapi.dev</a>
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="swapi-resources-title" className="mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="swapi-resources-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Recursos disponiveis
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Selecione um recurso, use a busca por nome ou titulo e navegue pelos resultados.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {Object.entries(RESOURCE_CONFIG).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setResource(key);
                    setPage(1);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${resource === key
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  aria-pressed={resource === key}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="swapi-search-title" className="mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-3xl mx-auto">
              <h3 id="swapi-search-title" className="text-lg font-semibold text-gray-900">
                Busca por nome ou titulo
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Recurso atual: <span className="font-semibold text-gray-900">{config.label}</span> - {config.description}
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSearchTerm(searchInput.trim());
                  setPage(1);
                }}
              >
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Digite um nome ou titulo"
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
                      setSearchInput('');
                      setSearchTerm('');
                      setPage(1);
                    }}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600"
                  >
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section aria-labelledby="swapi-results-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 id="swapi-results-title" className="text-2xl font-semibold text-gray-900">
                  Resultados
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Total: {data.count} itens - Pagina {page} de {totalPages}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1 || status === 'loading'}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-600 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages || status === 'loading'}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-600 disabled:opacity-50"
                >
                  Proxima
                </button>
              </div>
            </div>

            {status === 'loading' && (
              <div className="mt-10 text-center text-gray-600">Carregando dados...</div>
            )}
            {status === 'error' && (
              <div className="mt-10 text-center text-red-600">{error}</div>
            )}
            {status === 'success' && data.results.length === 0 && (
              <div className="mt-10 text-center text-gray-600">Nenhum resultado encontrado.</div>
            )}
            {status === 'success' && data.results.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.results.map((item) => (
                  <article key={item.url} className="bg-white rounded-lg border border-gray-200 shadow-lg p-5">
                    <h4 className="text-xl font-semibold text-gray-900">
                      <Link
                        to={`${basePath}/${resource}/${getIdFromUrl(item.url)}`}
                        className="hover:text-blue-600"
                      >
                        {item.name || item.title || 'Sem titulo'}
                      </Link>
                    </h4>
                    <dl className="mt-4 space-y-2 text-sm text-gray-600">
                      {config.fields.map((field) => (
                        <div key={`${item.url}-${field.key}`} className="flex items-start justify-between gap-3">
                          <dt className="font-semibold text-gray-700">{field.label}</dt>
                          <dd className="text-right">{formatFieldValue(item[field.key], field)}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Swapi;
