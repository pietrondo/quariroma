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
