import React from 'react';
import { Link } from 'react-router-dom';

const games = [
  {
    id: 'paciencia-klondike',
    title: 'Paciencia Klondike',
    status: 'Novo',
    description: 'Versao classica inspirada no Windows 7, com compras por clique, dicas e fundacoes.',
    details: ['Formato: Klondike 1 carta', 'Entrada: Clique/Toque', 'Foco: Estrategia e organizacao'],
    tags: ['Cartas', 'Classico', 'Klondike'],
    href: '/games/solitaire/index.html'
  },
  {
    id: 'pulso-farol',
    title: 'Pulso do Farol',
    status: 'Novo',
    description: 'Jogo de clique ritmico para sincronizar o pulso da luz e marcar pontos em 30 segundos.',
    details: ['Formato: Timing 1-toque', 'Entrada: Clique/Toque', 'Foco: Ritmo e precisao'],
    tags: ['One-click', 'Timing', 'Score'],
    href: '/games/pulso-farol/index.html'
  },
  {
    id: 'snake',
    title: 'Snake Classic',
    status: 'Arquivo',
    description: 'Releitura do classico Snake com ranking, ritmo progressivo e foco em controle preciso.',
    details: ['Formato: Arcade 2D', 'Entrada: Teclado', 'Foco: Reflexo e consistencia'],
    tags: ['Canvas', 'Ranking', 'Velocidade'],
    href: '/games/snake/index.html'
  },
  {
    id: 'retro-jump',
    title: 'Retro Jump',
    status: 'Arquivo',
    description: 'Runner lateral inspirado em jogos retro, com pontuacao progressiva e desafio continuo.',
    details: ['Formato: Side-scroller', 'Entrada: Teclado', 'Foco: Ritmo e timing'],
    tags: ['Canvas', 'Runner', 'Pontuacao'],
    href: '/games/retro-jump-game/src/indexgame.html'
  },
  {
    id: 'lane-switcher',
    title: 'Lane Switcher',
    status: 'Arquivo',
    description: 'Jogo one-button para alternar faixas, desviar de obstaculos e manter o fluxo.',
    details: ['Formato: Hyper-casual', 'Entrada: Clique ou tecla', 'Foco: Fluxo e precisao'],
    tags: ['One-button', 'Minimalista', 'Reflexo'],
    href: '/games/one-button/index.html'
  }
];

const principles = [
  {
    id: 'curadoria',
    title: 'Curadoria tecnica',
    description: 'Jogos escolhidos para exercitar mecanicas simples, feedback claro e boa leitura de estado.'
  },
  {
    id: 'qualidade',
    title: 'Qualidade e consistencia',
    description: 'Loop de jogo leve, regras transparentes e foco em uma experiencia confiavel.'
  },
  {
    id: 'aprendizado',
    title: 'Aprendizado continuo',
    description: 'Cada experimento gera notas sobre balanceamento, controles e usabilidade.'
  }
];

const notes = [
  'Os jogos abrem em uma nova aba para manter a navegacao do site intacta.',
  'A maioria roda direto no navegador, sem instalacao ou cadastro.',
  'Alguns rankings usam armazenamento local ou servicos externos para pontuacao.'
];

const Games = () => {
  return (
    <>
      <section aria-labelledby="games-hero-title" className="bg-white text-center py-16 px-6">
        <h1 id="games-hero-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Diversao</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Um espaco para prototipos e experiencias simples, mantendo o mesmo tom profissional do site.
        </p>
      </section>

      <div className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto">
          <section aria-labelledby="games-list-title" className="mb-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="games-list-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Colecao atual
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Jogos em HTML5 com foco em mecanicas diretas, desafios curtos e aprendizado pratico.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game) => (
                <article key={game.id} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold text-gray-900">{game.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {game.status}
                      </span>
                    </div>
                    <p className="mt-4 text-gray-600">{game.description}</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-500">
                      {game.details.map((detail) => (
                        <li key={`${game.id}-${detail}`}>{detail}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <span key={`${game.id}-${tag}`} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
                    <a
                      href={game.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Abrir jogo
                    </a>
                    <span className="text-xs text-gray-500">Nova aba</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="games-experiments-title" className="mb-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="games-experiments-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Exploracoes e APIs
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Um espaco para testes rapidos com APIs publicas e ideias de front-end.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600">SWAPI</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Explorador da API Star Wars</h3>
                  <p className="mt-3 text-gray-600">
                    Pagina dedicada para explorar Pessoas, Filmes, Planetas, Naves, Especies e Veiculos com busca e paginacao.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/jogos/swapi"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Abrir exploracao
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600">Rick and Morty</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Explorador da API Rick and Morty</h3>
                  <p className="mt-3 text-gray-600">
                    Explore Personagens, Locais e Episodios com busca e paginacao em uma interface simples.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/jogos/rick-morty"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Abrir exploracao
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden md:col-span-2">
                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600">Futurepedia</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">Back to the Future Wiki</h3>
                  <p className="mt-3 text-gray-600">
                    Pesquisa rapida na wiki oficial da saga com resumo, biografia e links para o site oficial.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/jogos/back-to-the-future"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Abrir exploracao
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="games-principles-title" className="mb-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 id="games-principles-title" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Como eu penso essa area
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Mesmo sendo um espaco de jogos, a proposta segue objetiva e organizada.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="games-notes-title" className="mb-20">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
              <h2 id="games-notes-title" className="text-3xl font-bold text-gray-900">Notas rapidas</h2>
              <p className="mt-4 text-lg text-gray-600">
                Informacoes importantes para uma experiencia tranquila.
              </p>
              <ul className="mt-6 space-y-3 text-gray-600 list-disc list-inside">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="games-cta-title">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
              <h2 id="games-cta-title" className="text-3xl font-bold text-gray-900">Quer sugerir um novo jogo?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Estou aberto a ideias e feedbacks sobre os prototipos.
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

export default Games;
