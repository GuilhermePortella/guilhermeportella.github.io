import React from 'react';

// Placeholder data for favorite artists/albums
const favoriteMusic = [
  {
    artist: 'Elvis Presley - Can´t Help Falling in Love',
    album: 'Blue Hawaii',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/44AyOl4qVkzS48vBsbNXaC?utm_source=generator&theme=0',
    description: 'Nessa música, Elvis, de forma primorosa fala sobre amor e paixão e entrega ao amor, onde a pessoa se rende completamente, mesmo que a razão mostre o contrário, descrevendo o amor profundo e compromisso total.'
  },
  {
    artist: 'Guns N´Roses - November Rain',
    album: 'Use Your Illusion I',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/3YRCqOhFifThpSRFJ1VWFM?utm_source=generator&theme=0',
    description: 'Além de ter um dos solos de guitarra mais bonitos e icônicos da história do rock, essa música fala sobre amor, perda, dor emocional e a luta para ter e manter a esperança em meio a tantas dificuldades, a dor de qualquer emocionado por aí haha.'
  },
  {
    artist: 'Heart - Alone',
    album: 'Bad Animals',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/54b8qPFqYqIndfdxiLApea?utm_source=generator&theme=0',
    description: 'Essa música fala sobre um amor não correspondido, desejo intenso de se aproximar de alguém que é especial mas sem saber como, por medo de rejeição ou pela certeza que nunca daria certo, mas o amor é real e existe no eu lírico da canção.'
  }
];

const Hobbies = () => {
  return (
    <>
      <section aria-labelledby="hobbies-title" className="bg-white text-center py-16 px-6">
        <h1 id="hobbies-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Curiosidades e Música
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">Um pouco sobre meus interesses fora da programação.</p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          {/* Curiosities Section */}
          <section id="curiosities" aria-labelledby="curiosities-title" className="mb-20">
            <div className="max-w-3xl mx-auto">
              <h2 id="curiosities-title" className="text-3xl font-bold text-gray-900 mb-6">Quem sou eu ?</h2>
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg space-y-4 text-gray-700">
                <p>
                  Um pouquinho de quem sou fora do trabalho e estudos
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Ultimamente, tenho investido bastante tempo na leitura; estou em uma fase focada em romancistas russos e, claro, nas obras de Kafka.</li>
                  <li>Adoro cozinhar e testar algumas 'teorias culinárias'. Atualmente, estou lendo Le Cordon Bleu: Técnicas Culinárias Essenciais, não estou testando tudo ainda, mas quem sabe um dia, né? haha</li>
                  <li>Sou apaixonado por carros, especialmente pela engenharia alemã e pela história de Le Mans.</li>
                  <li>No tempo livre, também faço experimentos de segurança e projetos de hardware hacking.</li>
                </ul>
                <p>
                  No geral, prefiro programas mais tranquilos em casa, longe de barulho ou aglomerações. Se me convidar para algo muito agitado, é bem provável que eu invente uma desculpa para não ir haha.
                </p>
              </div>
            </div>
          </section>

          {/* Music Section */}
          <section id="music" aria-labelledby="music-title">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="music-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Música que eu gosto
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                A música é uma parte importante da minha vida (da de quem não é ?).
                <br />
                Essas são algumas das músicas que tenho ouvido bastante ultimamente, não são necessariamente as músicas da minha vida mas tem significados
                profundos e com relação ao meu momento, e são muito boas, então curte essas pedradas triste aí comigo.

              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteMusic.map((music, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden text-center">
                  {music.spotifyEmbedUrl ? (
                    <iframe
                      title={`${music.artist} - Spotify`}
                      src={music.spotifyEmbedUrl}
                      className="w-full"
                      style={{ borderRadius: '12px', minHeight: '352px' }}
                      height="352"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <img src={music.imageUrl} alt={`${music.artist} - ${music.album}`} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{music.artist}</h3>
                    <p className="text-md text-gray-500 mb-2">{music.album}</p>
                    <p className="text-gray-600 text-sm">{music.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-600">
                Agora algumas das minhas playlists do Spotify:
              </p>
              <div className="mt-6 space-y-4 max-w-3xl mx-auto">
                <iframe
                  title="Spotify playlist 1"
                  src="https://open.spotify.com/embed/playlist/3xVvS12mAHUqkEjkZFGXrr?utm_source=generator&theme=0"
                  className="w-full"
                  style={{ borderRadius: '12px' }}
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
                <iframe
                  title="Spotify playlist 2"
                  src="https://open.spotify.com/embed/playlist/3LuwLZF9DuqtT5n92wCmcU?utm_source=generator&theme=0"
                  className="w-full"
                  style={{ borderRadius: '12px' }}
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
                <iframe
                  title="Spotify playlist 3"
                  src="https://open.spotify.com/embed/playlist/25cIH9UZsoIYdLxLu3F2jw?utm_source=generator&theme=0"
                  className="w-full"
                  style={{ borderRadius: '12px' }}
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Hobbies;
