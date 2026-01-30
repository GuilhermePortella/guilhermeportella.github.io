import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BASE_URL = 'https://rickandmortyapi.com/api';
const PAGE_SIZE = 12;
const API_PAGE_SIZE = 20;

const RESOURCE_CONFIG = {
  character: {
    label: 'Personagens',
    description: 'Personagens principais e secundarios da serie.',
    fields: [
      { key: 'status', label: 'Status' },
      { key: 'species', label: 'Especie' },
      { key: 'gender', label: 'Genero' },
      { key: 'originName', label: 'Origem' },
      { key: 'locationName', label: 'Localizacao' },
      { key: 'episodeCount', label: 'Episodios' }
    ]
  },
  location: {
    label: 'Locais',
    description: 'Planetas, dimensoes e lugares visitados.',
    fields: [
      { key: 'type', label: 'Tipo' },
      { key: 'dimension', label: 'Dimensao' },
      { key: 'residentsCount', label: 'Residentes' }
    ]
  },
  episode: {
    label: 'Episodios',
    description: 'Lista de episodios com data e codigo.',
    fields: [
      { key: 'episode', label: 'Codigo' },
      { key: 'air_date', label: 'Exibicao' },
      { key: 'charactersCount', label: 'Personagens' }
    ]
  }
};

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

const normalizeResults = (resource, results) => {
  if (!Array.isArray(results)) {
    return [];
  }

  if (resource === 'character') {
    return results.map((item) => ({
      ...item,
      originName: item.origin?.name || '',
      locationName: item.location?.name || '',
      episodeCount: Array.isArray(item.episode) ? item.episode.length : 0
    }));
  }

  if (resource === 'location') {
    return results.map((item) => ({
      ...item,
      residentsCount: Array.isArray(item.residents) ? item.residents.length : 0
    }));
  }

  if (resource === 'episode') {
    return results.map((item) => ({
      ...item,
      charactersCount: Array.isArray(item.characters) ? item.characters.length : 0
    }));
  }

  return results;
};

const RickMorty = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/rick-morty' : '/jogos/rick-morty';
  const [resource, setResource] = useState('character');
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
        baseParams.set('name', searchTerm);
      }

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
          throw new Error('Rick and Morty API request failed.');
        }

        const payload = await response.json();
        return {
          count: payload.info?.count ?? 0,
          results: Array.isArray(payload.results) ? payload.results : []
        };
      };

      try {
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE - 1;
        const apiStart = Math.floor(startIndex / API_PAGE_SIZE) + 1;
        const apiEnd = Math.floor(endIndex / API_PAGE_SIZE) + 1;

        const firstPayload = await fetchPage(apiStart);
        let combinedResults = firstPayload.results;

        if (apiEnd !== apiStart) {
          const secondPayload = await fetchPage(apiEnd);
          combinedResults = combinedResults.concat(secondPayload.results);
        }

        const offset = startIndex - (apiStart - 1) * API_PAGE_SIZE;
        const results = normalizeResults(resource, combinedResults.slice(offset, offset + PAGE_SIZE));

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
        setError('Nao foi possivel carregar a API do Rick and Morty agora.');
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
      <section aria-labelledby="rickmorty-title" className="bg-white text-center py-16 px-6">
        <h1 id="rickmorty-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Explorador Rick and Morty
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Implementacao simples para explorar dados publicos da API Rick and Morty.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Fonte: <a href="https://rickandmortyapi.com" target="_blank" rel="noopener noreferrer" className="underline">rickandmortyapi.com</a>
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="rickmorty-resources-title" className="mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="rickmorty-resources-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Recursos disponiveis
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Selecione um recurso, use a busca por nome e navegue pelos resultados.
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
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    resource === key
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
                  }`}
                  aria-pressed={resource === key}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="rickmorty-search-title" className="mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg max-w-3xl mx-auto">
              <h3 id="rickmorty-search-title" className="text-lg font-semibold text-gray-900">
                Busca por nome
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
                  placeholder="Digite um nome"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
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
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-green-500 hover:text-green-600"
                  >
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section aria-labelledby="rickmorty-results-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 id="rickmorty-results-title" className="text-2xl font-semibold text-gray-900">
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
                  <article key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-lg p-5">
                    {resource === 'character' && item.image && (
                      <div
                        className="w-full rounded-md bg-gray-100 overflow-hidden"
                        style={{ aspectRatio: '1 / 1' }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h4 className={`text-xl font-semibold text-gray-900 ${resource === 'character' && item.image ? 'mt-4' : ''}`}>
                      {resource === 'character' && (
                        <Link to={`${basePath}/personagem/${item.id}`} className="hover:text-green-600">
                          {item.name || 'Sem titulo'}
                        </Link>
                      )}
                      {resource === 'location' && (
                        <Link to={`${basePath}/local/${item.id}`} className="hover:text-green-600">
                          {item.name || 'Sem titulo'}
                        </Link>
                      )}
                      {resource === 'episode' && (
                        <Link to={`${basePath}/episodio/${item.id}`} className="hover:text-green-600">
                          {item.name || 'Sem titulo'}
                        </Link>
                      )}
                      {resource !== 'character' && resource !== 'location' && resource !== 'episode' && (item.name || 'Sem titulo')}
                    </h4>
                    <dl className="mt-4 space-y-2 text-sm text-gray-600">
                      {config.fields.map((field) => (
                        <div key={`${item.id}-${field.key}`} className="flex items-start justify-between gap-3">
                          <dt className="font-semibold text-gray-700">{field.label}</dt>
                          <dd className="text-right">{formatValue(item[field.key])}</dd>
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

export default RickMorty;
