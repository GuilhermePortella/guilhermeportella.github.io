import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const BASE_URL = 'https://rickandmortyapi.com/api';
const RESIDENTS_PREVIEW_LIMIT = 24;
const CHUNK_SIZE = 20;

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

const fetchCharactersByIds = async (ids, signal) => {
  if (!ids.length) {
    return [];
  }

  const chunks = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    chunks.push(ids.slice(i, i + CHUNK_SIZE));
  }

  const results = [];
  for (const chunk of chunks) {
    const response = await fetch(`${BASE_URL}/character/${chunk.join(',')}`, { signal });
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

const RickMortyLocation = () => {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/rick-morty' : '/jogos/rick-morty';
  const [place, setPlace] = useState(null);
  const [residents, setResidents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [residentsStatus, setResidentsStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadLocation = async () => {
      setStatus('loading');
      setError('');
      setResidents([]);
      setResidentsStatus('loading');

      try {
        const response = await fetch(`${BASE_URL}/location/${id}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Rick and Morty API request failed.');
        }

        const payload = await response.json();
        if (!active) {
          return;
        }
        setPlace(payload);
        setStatus('success');

        const residentIds = getIdsFromUrls(payload.residents);
        if (!residentIds.length) {
          setResidentsStatus('success');
          return;
        }

        const limitedIds = residentIds.slice(0, RESIDENTS_PREVIEW_LIMIT);
        const residentsData = await fetchCharactersByIds(limitedIds, controller.signal);
        if (!active) {
          return;
        }
        setResidents(residentsData);
        setResidentsStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError('Nao foi possivel carregar este local.');
      }
    };

    loadLocation();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  const residentsCount = useMemo(() => {
    if (!place || !Array.isArray(place.residents)) {
      return 0;
    }
    return place.residents.length;
  }, [place]);

  const showingResidents = Math.min(residentsCount, RESIDENTS_PREVIEW_LIMIT);

  return (
    <>
      <section aria-labelledby="rickmorty-location-title" className="bg-white text-center py-16 px-6">
        <h1 id="rickmorty-location-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Detalhes do local
        </h1>
        <p className="mt-4 text-gray-600">
          Informacoes completas sobre o local selecionado.
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
            <div className="text-center text-gray-600">Carregando local...</div>
          )}
          {status === 'error' && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {status === 'success' && place && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900">{place.name}</h2>
                <p className="text-sm text-gray-500">
                  ID #{place.id} • {formatValue(place.type)}
                </p>
              </div>
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <dt className="font-semibold text-gray-700">Tipo</dt>
                  <dd>{formatValue(place.type)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Dimensao</dt>
                  <dd>{formatValue(place.dimension)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Total de residentes</dt>
                  <dd>{residentsCount}</dd>
                </div>
              </dl>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-gray-900">Residentes</h3>
                {residentsStatus === 'loading' && (
                  <p className="mt-4 text-sm text-gray-500">Carregando residentes...</p>
                )}
                {residentsStatus === 'success' && residentsCount === 0 && (
                  <p className="mt-4 text-sm text-gray-500">Nenhum residente registrado.</p>
                )}
                {residentsStatus === 'success' && residents.length > 0 && (
                  <>
                    <p className="mt-2 text-sm text-gray-500">
                      Mostrando {showingResidents} de {residentsCount} residentes.
                    </p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {residents.map((resident) => (
                        <Link
                          key={resident.id}
                          to={`${basePath}/personagem/${resident.id}`}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-green-500"
                        >
                          {resident.image && (
                            <img
                              src={resident.image}
                              alt={resident.name}
                              className="h-40 w-full rounded-md object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="mt-3">
                            <p className="text-base font-semibold text-gray-900">{resident.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatValue(resident.status)} • {formatValue(resident.species)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RickMortyLocation;
