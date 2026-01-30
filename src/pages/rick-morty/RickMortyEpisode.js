import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const BASE_URL = 'https://rickandmortyapi.com/api';
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

const formatDateTime = (value) => {
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

const parseEpisodeCode = (value) => {
  if (!value) {
    return { season: null, episode: null };
  }
  const match = /S(\d+)E(\d+)/i.exec(value);
  if (!match) {
    return { season: null, episode: null };
  }
  return {
    season: Number(match[1]),
    episode: Number(match[2])
  };
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

const RickMortyEpisode = () => {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/games') ? '/games/rick-morty' : '/jogos/rick-morty';
  const [episode, setEpisode] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [charactersStatus, setCharactersStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const loadEpisode = async () => {
      setStatus('loading');
      setError('');
      setCharacters([]);
      setCharactersStatus('loading');

      try {
        const response = await fetch(`${BASE_URL}/episode/${id}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Rick and Morty API request failed.');
        }

        const payload = await response.json();
        if (!active) {
          return;
        }
        setEpisode(payload);
        setStatus('success');

        const characterIds = getIdsFromUrls(payload.characters);
        if (!characterIds.length) {
          setCharactersStatus('success');
          return;
        }

        const charactersData = await fetchCharactersByIds(characterIds, controller.signal);
        if (!active) {
          return;
        }
        setCharacters(charactersData);
        setCharactersStatus('success');
      } catch (err) {
        if (!active || err.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setError('Nao foi possivel carregar este episodio.');
      }
    };

    loadEpisode();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  const charactersCount = useMemo(() => {
    if (!episode || !Array.isArray(episode.characters)) {
      return 0;
    }
    return episode.characters.length;
  }, [episode]);

  const seasonInfo = useMemo(() => {
    if (!episode) {
      return { season: null, episode: null };
    }
    return parseEpisodeCode(episode.episode);
  }, [episode]);

  return (
    <>
      <section aria-labelledby="rickmorty-episode-title" className="bg-white text-center py-16 px-6">
        <h1 id="rickmorty-episode-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Detalhes do episodio
        </h1>
        <p className="mt-4 text-gray-600">
          Informacoes completas sobre o episodio selecionado.
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
            <div className="text-center text-gray-600">Carregando episodio...</div>
          )}
          {status === 'error' && (
            <div className="text-center text-red-600">{error}</div>
          )}
          {status === 'success' && episode && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-gray-900">{episode.name}</h2>
                <p className="text-sm text-gray-500">
                  ID #{episode.id} • {formatValue(episode.episode)}
                </p>
              </div>
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <dt className="font-semibold text-gray-700">Indice</dt>
                  <dd>{episode.id}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Codigo</dt>
                  <dd>{formatValue(episode.episode)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Temporada</dt>
                  <dd>{seasonInfo.season ?? 'Nao informado'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Numero do episodio</dt>
                  <dd>{seasonInfo.episode ?? 'Nao informado'}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Exibicao</dt>
                  <dd>{formatValue(episode.air_date)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Exibicao (formatada)</dt>
                  <dd>{formatDateTime(episode.air_date)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Criado em</dt>
                  <dd>{formatDateTime(episode.created)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700">Total de personagens</dt>
                  <dd>{charactersCount}</dd>
                </div>
              </dl>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold text-gray-900">Personagens</h3>
                {charactersStatus === 'loading' && (
                  <p className="mt-4 text-sm text-gray-500">Carregando personagens...</p>
                )}
                {charactersStatus === 'success' && charactersCount === 0 && (
                  <p className="mt-4 text-sm text-gray-500">Nenhum personagem registrado.</p>
                )}
                {charactersStatus === 'success' && characters.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                      <Link
                        key={character.id}
                        to={`${basePath}/personagem/${character.id}`}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-green-500"
                      >
                        {character.image && (
                          <img
                            src={character.image}
                            alt={character.name}
                            className="h-40 w-full rounded-md object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="mt-3">
                          <p className="text-base font-semibold text-gray-900">{character.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatValue(character.status)} • {formatValue(character.species)}
                          </p>
                        </div>
                      </Link>
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

export default RickMortyEpisode;
