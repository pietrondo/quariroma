# Quarioma - Documentazione Interna

## Panoramica del Progetto
Quarioma è un'applicazione fullstack per la gestione degli acquari, sviluppata con Node.js e React. Include funzionalità di autenticazione locale, dashboard interattiva, gestione dei parametri ambientali e visualizzazione di grafici storici.

## Convenzioni di Progetto
- **Prefissi:**
  - `par` per parametri
  - `var` per variabili
  - `res` per risorse
  - `mod` per moduli
- **Stringhe:** Usa sempre single quotes in JavaScript.
- **Gestione Asincrona:** Utilizza async/await con gestione esplicita degli errori.
- **Commit:** Segui il formato Conventional Commits.

## Dipendenze
- `react-chartjs-2` e `chart.js` per la visualizzazione dei grafici.
- Documenta ogni nuova dipendenza aggiunta.

## File di Riferimento
- **STATUS.md:** Traccia milestone, funzionalità completate e priorità.
- **ERRORS.md:** Documenta errori significativi con descrizione, soluzione e contesto.
- **copilot-instructions.md:** Linee guida per l'uso di Copilot.

## Policy di Contributo
- Usa Jira per tracciare issue e task.
- Ogni pull request deve essere revisionata da almeno un membro del team.
- Aggiorna STATUS.md e ERRORS.md per ogni modifica significativa.

## Automazione CI/CD
Esempio di workflow GitHub Actions:

```yaml
name: Node.js CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

## Contatti
Per domande o supporto, contatta il team di sviluppo.
