---
title: "Padroes de API para times pequenos"
summary: "Convencoes simples de rotas, erros e versionamento."
author: "Guilherme Portella"
publishedAt: "2025-09-14"
tags: ["Back-end", "API"]
---

## Rotas simples
- Use nomes no plural
- Nao misture actions com recursos

## Erros previsiveis
Defina um contrato basico para respostas de erro.

```json
{ "error": { "code": "not_found", "message": "Recurso nao encontrado" } }
```

## Versionamento leve
Comece com /v1 e evolua apenas quando necessario.
