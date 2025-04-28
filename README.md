# Quarioma - Gestione Acquari

## Panoramica
Quarioma è un'applicazione monolitica fullstack (Node.js + React) per la gestione di acquari, pesci e parametri ambientali. Include autenticazione locale, dashboard, filtri avanzati e grafici. Segue policy di progetto e convenzioni definite nei file markdown allegati.

## Convenzioni di progetto
- Prefissi: `par` (parametri), `var` (variabili), `res` (risorse), `mod` (moduli)
- Stringhe JavaScript: sempre single quotes
- Funzioni pubbliche: commento JSDoc obbligatorio
- Commit: formato Conventional Commits
- Issue e task: gestiti su Jira
- Errori: documentati in ERRORS.md
- Stato e milestone: STATUS.md

## Esempi pratici
```js
// Esempio di funzione pubblica
/**
 * Restituisce la lista degli acquari filtrati per nome.
 * @param {string} parNome
 * @returns {Array}
 */
function modFiltraAcquari(parNome) {
	return varAquariums.filter(a => a.name.includes(parNome));
}

// Esempio di commit
// feat(ui): aggiunta dashboard con grafico temperatura
```

## Policy UI/UX
- Stile minimal, responsive, accessibile
- Logo fornito come favicon e header
- Font: Inter, Arial, sans-serif
- Colori: palette blu/azzurro/turchese/neutri

## Policy sicurezza
- Nessun dato sensibile in chiaro
- Autenticazione locale demo (admin/admin)
- Protezione API con token in memoria

## Dipendenze principali
- express, cors (backend)
- react, vite, concurrently (frontend)

## Dipendenze aggiuntive
- react-chartjs-2, chart.js: per la visualizzazione di grafici storici dei parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno).

## Dashboard avanzata
- Elenco acquari cliccabili.
- Sezione dettagliata SPA per ogni acquario con:
  - Form dedicato per inserimento parametri (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno).
  - Grafici storici separati per ogni parametro (aggiornati in tempo reale, ordine cronologico).
  - Storico delle misurazioni.
- Navigazione semplice tra dashboard e dettaglio.

## Esempio di utilizzo
1. Avvia tutto con `npm start`
2. Login: admin/admin
3. Gestisci acquari e pesci dalla dashboard

---

Per dettagli su errori, milestone e policy temporanee, consulta ERRORS.md, STATUS.md e ./docs/.

## Repository e badge

[![GitHub repo](https://img.shields.io/badge/GitHub-quariroma-blue?logo=github)](https://github.com/pietrondo/quariroma)

Repository ufficiale: [https://github.com/pietrondo/quariroma](https://github.com/pietrondo/quariroma)

## Contribuire

- Forka il repository e crea una branch descrittiva per ogni feature/bugfix.
- Segui le convenzioni di commit (Conventional Commits) e aggiorna STATUS.md, ERRORS.md e README.md dove necessario.
- Apri una pull request: sarà revisionata da almeno un membro del team.
- Usa Jira per tracciare issue/task e aggiorna lo stato delle attività.
- Consulta STATUS.md per priorità e milestone.

## CI/CD

Il progetto può essere automatizzato con GitHub Actions. Esempio di workflow (file `.github/workflows/ci.yml`):

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

Aggiungi test e step di deploy secondo le policy del team.
