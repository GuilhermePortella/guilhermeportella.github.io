---
title: "Notas sobre testes de integracao"
summary: "Como estruturo cenarios com banco e servicos externos."
author: "Guilherme Portella"
publishedAt: "2025-08-02"
tags: ["Qualidade", "Testes"]
---

## Foco nos fluxos
Tento cobrir os caminhos mais usados primeiro.

## Dicas rapidas
- Fixtures pequenas
- Reset de dados entre testes
- Mock de integracoes externas

## Exemplo de setup
```js
beforeEach(async () => {
  await resetDatabase();
});
```
