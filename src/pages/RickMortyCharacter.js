import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const BASE_URL = 'https://rickandmortyapi.com/api';

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

const RickMortyCharacter = () => {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/rick-morty' : '/jogos/rick-morty';
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [episodesStatus, setEpisodesStatus] = useState('loading');

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

  const episodeCount = useMemo(() => {
    if (!character || !Array.isArray(character.episode)) {
      return 0;
    }
    return character.episode.length;
  }, [character]);

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

              <div className="mt-10">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RickMortyCharacter;
