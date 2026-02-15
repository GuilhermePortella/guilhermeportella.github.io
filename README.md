# Guilherme Portella - Portfolio (React)

Portfolio pessoal construido com React e React Router. O foco e apresentar projetos, hobbies e canais de contato em uma SPA simples, responsiva e com integracoes externas (GitHub e Spotify).

## Visao geral
- SPA com rotas: Home, Projetos, Hobbies e Contato.
- Projetos carregados diretamente da API do GitHub.
- Hobbies com embeds do Spotify (faixas e playlists).
- Deploy automatico para GitHub Pages via GitHub Actions.

## Funcionalidades
- **Home**
  - Hero, sobre mim, projetos em destaque (3 repositorios mais recentes do GitHub), blog em construcao e contato rapido.
- **Projetos**
  - Lista dinamica de repositorios do GitHub (ate 100).
  - Ordenacao por recencia, estrelas, nome e data de criacao.
  - Filtro por linguagem.
  - Paginacao.
- **Hobbies**
  - Cards com faixas do Spotify embutidas.
  - Playlists embutidas ao final da secao.
- **Contato**
  - Email e redes sociais principais.

## Stack e dependencias
- React 19
- React Router DOM 7
- Create React App (`react-scripts`)
- Testing Library (dom, react, user-event)
- PostCSS + configuracao de Tailwind (ver `postcss.config.js` e `tailwind.config.js`)

## Estrutura do projeto
```
.
├─ .github/
│  └─ workflows/              # GitHub Actions (pages, code scanning, stale)
├─ antigo/                    # Conteúdo antigo / arquivos estáticos anteriores
│  ├─ assets/
│  │  ├─ images/
│  │  ├─ scripts/
│  │  │  └─ scripts.js
│  │  └─ styles/
│  │     ├─ styleBlogPages.css
│  │     ├─ styleHome.css
│  │     └─ styleProjects.css
│  └─ games/                  # Versões antigas dos jogos
├─ public/                    # Arquivos estáticos servidos no build
│  ├─ index.html
│  ├─ manifest.json
│  ├─ robots.txt
│  ├─ articles/
│  ├─ assets/
│  │  └─ styles/
│  └─ games/                   # Jogos prontos para deploy (HTML/JS/CSS)
├─ scripts/                    # scripts utilitários (build, deploy, manutenção)
├─ src/                        # Aplicação React (SPA)
│  ├─ pages/
│  │  ├─ Home.js
│  │  ├─ Projects.js
│  │  ├─ Hobbies.js
│  │  ├─ Contato.js
│  │  └─ (subfolders: rick-morty, swapi, back-to-the-future, ...)
│  ├─ articles/                # Posts / markdown usados na seção de artigos
+│  ├─ lib/
│  ├─ pages/
│  ├─ utils/
│  ├─ App.js
│  ├─ App.css
│  └─ index.js
├─ package.json
├─ package-lock.json
├─ postcss.config.js
└─ tailwind.config.js
```

## Rotas (React Router)
- `/` -> `src/pages/Home.js`
- `/projects` -> `src/pages/Projects.js`
- `/hobbies` -> `src/pages/Hobbies.js`
- `/contato` -> `src/pages/Contato.js`

As rotas principais estão definidas em `src/App.js` com `Routes`/`Route`.
Observação: há páginas e componentes adicionais em `src/pages/` (ex.: `rick-morty`, `swapi`, `back-to-the-future`) e conteúdo estático em `public/games/`.

## Integracoes externas

### GitHub API
Usada para carregar os repositorios do usuario:
- Home (3 mais recentes):
  - `https://api.github.com/users/guilhermeportella/repos?sort=pushed&per_page=3`
- Projetos (ate 100):
  - `https://api.github.com/users/guilhermeportella/repos?sort=pushed&per_page=100`

Observacoes:
- As requicoes sao **publicas** (sem token) e sujeitas ao limite de taxa da API do GitHub.
- Em caso de falha, a UI mostra mensagens de erro no lugar dos cards.

### Spotify Embed
Os embeds sao iframes do Spotify, usados em:
- `src/pages/Hobbies.js` (faixas e playlists).

## Fluxo de dados (Home/Projetos)
1. `useEffect` dispara o fetch para a API do GitHub.
2. O JSON e mapeado para o modelo usado pelos cards.
3. O estado controla loading/error/sucesso.
4. Em `Projects.js`, `useMemo` aplica filtros, ordenacao e paginacao.

## Execucao local
Requisitos: Node.js 18+ (recomendado 20).

```bash
npm install
npm start
```

A aplicacao sobe em `http://localhost:3000`.

## Scripts
- `npm start`: dev server
- `npm run build`: build de producao
- `npm test`: testes
- `npm run eject`: expor configuracoes do CRA (irreversivel)

## Build e deploy (GitHub Pages)
Workflow: `.github/workflows/pages.yml`

Resumo do fluxo:
1. Checkout
2. Setup do Node
3. `npm install`
4. `npm run build` (gera `./build`)
5. Upload do artefato `./build`
6. Deploy no GitHub Pages

> Importante: o Pages deve estar configurado com Source = "GitHub Actions".

## Lint/CI
O CRA trata warnings como erro quando `CI=true`. Isso pode falhar o build caso:
- exista BOM (Byte Order Mark) nos arquivos JS
- haja variaveis nao usadas

## Customizacao rapida
- Alterar usuario do GitHub:
  - `src/pages/Home.js` (`FEATURED_PROJECTS_URL`)
  - `src/pages/Projects.js` (`GITHUB_REPOS_URL`)
- Ajustar page size:
  - `src/pages/Projects.js` (`PAGE_SIZE`)
- Substituir embeds do Spotify:
  - `src/pages/Hobbies.js`

## Troubleshooting
- **Home exibindo README no Pages**
  - Garanta que o workflow esta gerando `./build` e publicando esse artefato.
- **Erro "Cannot find any run with github.run_id"**
  - Confirme que o Pages esta habilitado e o deploy usa GitHub Actions.
- **Rate limit da API do GitHub**
  - Evite refresh constante; se necessario, use um token e proxy/back-end.

