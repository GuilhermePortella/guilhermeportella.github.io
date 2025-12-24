---
title: "Guia completo: decisoes tecnicas e como publicar artigos aqui"
summary: "Explicacao detalhada da arquitetura dos artigos, estrutura do Markdown e passo a passo de publicacao."
author: "Guilherme Portella"
publishedAt: "2026-02-01"
keywords:
  - Docs
  - Blog
  - Markdown
  - SEO
  - Publicacao
seoTitle: "Guia completo de publicacao de artigos | Guilherme Portella"
seoDescription: "Guia detalhado sobre como publicar artigos em Markdown, organizar metadata e manter SEO basico no site."
canonicalUrl: "https://www.guilhermeportella.com.br/blog/artigos/guia-publicacao-artigos"
locale: "pt-BR"
tags: ["Docs", "Blog", "Markdown"]
---

## Por que esta arquitetura?
O objetivo aqui e simples: publicar conteudo com o menor custo de manutencao possivel.
Para isso, o site usa arquivos `.md` dentro de `public/articles` e um parser leve no
frontend para transformar o Markdown em HTML no momento do acesso.

Vantagens principais:
- Conteudo editavel sem mexer em componentes React.
- Publicacao rapida: so adicionar o arquivo e registrar o metadata.
- Sem dependencia de banco ou CMS externo.
- Baixo custo de processamento e memoria.

## Estrutura geral do projeto (somente o que importa para o blog)
Dentro do projeto, o fluxo de artigos depende destas pastas:

- `public/articles/` -> guarda os arquivos `.md` com o conteudo.
- `public/articles/index.json` -> index gerado automaticamente.
- `src/pages/Articles.js` -> lista completa com filtro por ano/mes.
- `src/pages/Article.js` -> pagina de artigo individual.
- `src/utils/markdown.js` -> parser de Markdown + front matter.
- `src/utils/articleUtils.js` -> helpers de data e formato.
- `scripts/generate-articles-index.js` -> gera o index automaticamente.

## Estrutura do arquivo Markdown
Cada artigo precisa ter:
1) Um bloco de **front matter** no topo.
2) O corpo do artigo em Markdown logo abaixo.

Exemplo minimo:
```md
---
title: "Titulo do artigo"
summary: "Resumo curto para cards e SEO basico."
author: "Guilherme Portella"
publishedAt: "2026-02-01"
tags: ["Back-end", "Docs"]
---

## Primeiro bloco
Conteudo aqui.
```

Campos do front matter:
- `title` (obrigatorio): titulo que aparece no artigo.
- `summary` (recomendado): aparece nos cards.
- `author` (opcional): por padrao usa "Guilherme Portella".
- `publishedAt` (recomendado): formato `YYYY-MM-DD`.
- `publishedDate` (alternativo): mesmo formato de `publishedAt`.
- `tags` (opcional): lista de tags.
- `keywords` (opcional): termos para SEO e busca.

## Campos extras para SEO
Para indexacao basica, este projeto aceita campos **planos** e tambem o bloco `seo:`.

- `seoTitle`: titulo pensado para buscadores.
- `seoDescription`: descricao curta para meta description.
- `canonicalUrl`: URL canonica absoluta.
- `ogImage`: imagem usada no Open Graph (opcional).
- `locale`: idioma, exemplo `pt-BR`.

Exemplo com SEO:
```md
---
title: "Titulo do artigo"
summary: "Resumo curto."
author: "Guilherme Portella"
publishedAt: "2026-02-01"
keywords:
  - Blog
  - SEO
seoTitle: "Titulo para SEO | Guilherme Portella"
seoDescription: "Descricao otimizada para buscadores."
canonicalUrl: "https://www.guilhermeportella.com.br/blog/artigos/meu-artigo"
ogImage: "/images/meu-artigo.jpg"
locale: "pt-BR"
tags: ["Docs"]
---
```

Ou, se preferir, use o bloco `seo:` com os mesmos campos:
```md
---
title: "Titulo do artigo"
summary: "Resumo curto."
seo:
  title: "Titulo para SEO | Guilherme Portella"
  description: "Descricao otimizada para buscadores."
  canonicalUrl: "https://www.guilhermeportella.com.br/blog/artigos/meu-artigo"
  image: "/images/meu-artigo.jpg"
  locale: "pt-BR"
---
```

Opcionalmente, voce pode informar um bloco `jsonLd:` para sobrescrever o schema:
```md
---
title: "Titulo do artigo"
jsonLd:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Titulo do artigo"
---
```

> Obs: o parser e leve e aceita apenas objetos simples (sem logicas YAML avancadas).

## Onde salvar o arquivo
O arquivo deve ficar em `public/articles/`.
O nome do arquivo precisa ser o **slug** do artigo:

```
public/articles/<slug>.md
```

Exemplo:
```
public/articles/guia-publicacao-artigos.md
```

## Como o index e gerado automaticamente
Nao e mais necessario editar `src/data/articles.js`. O index de artigos
e criado automaticamente a partir dos arquivos em `public/articles/`.

O script `scripts/generate-articles-index.js` gera `public/articles/index.json`
com os campos usados nos cards e nos filtros.

Regras importantes:
- `slug` deve bater com o nome do arquivo `.md`.
- `publishedAt` ou `publishedDate` deve estar no formato `YYYY-MM-DD`.
- Se `readTime` nao existir, ele e calculado automaticamente.

## Passo a passo para publicar
1. Crie o arquivo `.md` em `public/articles/`.
2. Escreva o front matter completo.
3. Escreva o conteudo em Markdown (titulos, listas, blocos de codigo).
4. Rode `npm start` ou `npm run build` (o index e gerado automaticamente).
5. Acesse `/blog/artigos/<slug>`.

## Como a pagina de artigo funciona
Quando o usuario acessa `/blog/artigos/:slug`:
1) A pagina `Article.js` busca o arquivo `.md`.
2) O parser em `src/utils/markdown.js` separa front matter e corpo.
3) O Markdown vira HTML simples e e renderizado.
4) As datas sao formatadas por `src/utils/articleUtils.js`.
5) Meta tags e JSON-LD sao montados a partir do front matter.

## Dicas e cuidados
- Evite caracteres especiais no nome do arquivo (use apenas letras, numeros e `-`).
- Prefira datas no formato `YYYY-MM-DD` para evitar erros de fuso.
- Mantenha o `summary` curto (1-2 linhas).
- Se o artigo nao aparecer, verifique se o `slug` bate com o nome do arquivo.

## Checklist final
- [ ] Arquivo em `public/articles/`
- [ ] `slug` correto no nome do arquivo
- [ ] `publishedAt` no formato certo
- [ ] Conteudo validado no navegador

Pronto. Com isso, a publicacao fica simples, leve e consistente com o resto do site.
