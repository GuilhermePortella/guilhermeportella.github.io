---
title: "Observabilidade simples com Node"
summary: "Notas sobre metricas essenciais, traces e alertas sem exageros."
author: "Guilherme Portella"
publishedAt: "2025-11-18"
tags: ["Infra", "Observabilidade"]
---

## O minimo necessario
Comeco sempre com logs, metricas de erro e latencia por endpoint.

## Alertas que importam
- Taxa de erro acima do normal
- Aumento de latencia
- Falha em job critico

## Exemplo de log estruturado
```json
{ "level": "info", "event": "health_check", "status": "ok" }
```
