/**
 * @fileoverview API monolitica per la gestione di acquari e pesci.
 * @module modAquariumApi
 * @description Espone endpoint RESTful per CRUD acquari e pesci. In-memory DB temporaneo.
 * Esempio di utilizzo: vedi README.md
 */

const express = require('express');
const cors = require('cors');

/**
 * Istanza principale Express
 * @type {import('express').Express}
 */
const app = express();
const varPort = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory DB temporaneo (da sostituire con DB reale)
let aquariums = [];
let fish = [];
let aquariumIdCounter = 1;
let fishIdCounter = 1;

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @section Parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno)
 * Ogni acquario ha un array di misurazioni parametri: { tipo, valore, data }.
 * Supporta CRUD parametri per ogni acquario.
 *
 * Esempio di struttura:
 * {
 *   id: 1,
 *   name: 'Acquario 1',
 *   volume: 100,
 *   parametri: [
 *     { tipo: 'temperatura', valore: 25.5, data: '2025-04-28T10:00:00Z' },
 *     { tipo: 'ph', valore: 7.2, data: '2025-04-28T10:00:00Z' },
 *     ...
 *   ]
 * }
 */

// Aggiorna struttura acquari per includere parametri
let aquariums = [];

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @section Parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno)
 * Ogni acquario ha un array di misurazioni parametri: { tipo, valore, data }.
 * Supporta CRUD parametri per ogni acquario.
 *
 * Esempio di struttura:
 * {
 *   id: 1,
 *   name: 'Acquario 1',
 *   volume: 100,
 *   parametri: [
 *     { tipo: 'temperatura', valore: 25.5, data: '2025-04-28T10:00:00Z' },
 *     { tipo: 'ph', valore: 7.2, data: '2025-04-28T10:00:00Z' },
 *     ...
 *   ]
 * }
 */

// Aggiorna struttura acquari per includere parametri
let aquariums = [];

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @section Parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno)
 * Ogni acquario ha un array di misurazioni parametri: { tipo, valore, data }.
 * Supporta CRUD parametri per ogni acquario.
 *
 * Esempio di struttura:
 * {
 *   id: 1,
 *   name: 'Acquario 1',
 *   volume: 100,
 *   parametri: [
 *     { tipo: 'temperatura', valore: 25.5, data: '2025-04-28T10:00:00Z' },
 *     { tipo: 'ph', valore: 7.2, data: '2025-04-28T10:00:00Z' },
 *     ...
 *   ]
 * }
 */

// Aggiorna struttura acquari per includere parametri
let aquariums = [];

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @section Parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno)
 * Ogni acquario ha un array di misurazioni parametri: { tipo, valore, data }.
 * Supporta CRUD parametri per ogni acquario.
 *
 * Esempio di struttura:
 * {
 *   id: 1,
 *   name: 'Acquario 1',
 *   volume: 100,
 *   parametri: [
 *     { tipo: 'temperatura', valore: 25.5, data: '2025-04-28T10:00:00Z' },
 *     { tipo: 'ph', valore: 7.2, data: '2025-04-28T10:00:00Z' },
 *     ...
 *   ]
 * }
 */

// Aggiorna struttura acquari per includere parametri
let aquariums = [];

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @section Parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno)
 * Ogni acquario ha un array di misurazioni parametri: { tipo, valore, data }.
 * Supporta CRUD parametri per ogni acquario.
 *
 * Esempio di struttura:
 * {
 *   id: 1,
 *   name: 'Acquario 1',
 *   volume: 100,
 *   parametri: [
 *     { tipo: 'temperatura', valore: 25.5, data: '2025-04-28T10:00:00Z' },
 *     { tipo: 'ph', valore: 7.2, data: '2025-04-28T10:00:00Z' },
 *     ...
 *   ]
 * }
 */

// Aggiorna struttura acquari per includere parametri
let aquariums = [];

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @section Parametri acquario (temperatura, pH, GH, KH, NO2, NO3, ammoniaca, ossigeno)
 * Ogni acquario ha un array di misurazioni parametri: { tipo, valore, data }.
 * Supporta CRUD parametri per ogni acquario.
 *
 * Esempio di struttura:
 * {
 *   id: 1,
 *   name: 'Acquario 1',
 *   volume: 100,
 *   parametri: [
 *     { tipo: 'temperatura', valore: 25.5, data: '2025-04-28T10:00:00Z' },
 *     { tipo: 'ph', valore: 7.2, data: '2025-04-28T10:00:00Z' },
 *     ...
 *   ]
 * }
 */

// Aggiorna struttura acquari per includere parametri
let aquariums = [];

// --- AQUARIUMS CRUD ---
// Rotte per la gestione degli acquari

/**
 * @route   GET /api/aquariums
 * @desc    Ottieni la lista di tutti gli acquari
 */
app.get('/api/aquariums', (req, res) => {
  res.json(aquariums);
});

/**
 * @route   POST /api/aquariums
 * @desc    Crea un nuovo acquario
 * @body    { name: string, volume: number }
 */
app.post('/api/aquariums', (req, res) => {
  try {
    const { name, volume } = req.body;
    if (!name || !volume) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400 con messaggio esplicativo
      // CONTEXT: Richiesta POST senza tutti i parametri obbligatori
      return res.status(400).json({ error: 'Nome e volume sono obbligatori' });
    }
    const newAquarium = { id: aquariumIdCounter++, name, volume };
    aquariums.push(newAquarium);
    res.status(201).json(newAquarium);
  } catch (err) {
    // ERROR: Errore generico nella creazione acquario
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/aquariums
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/aquariums/:id
 * @desc    Elimina un acquario per id
 */
app.delete('/api/aquariums/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = aquariums.findIndex(a => a.id === id);
  if (idx === -1) {
    // ERROR: Acquario non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Acquario non trovato' });
  }
  aquariums.splice(idx, 1);
  res.status(204).end();
});

// --- FISH CRUD ---
// Rotte per la gestione dei pesci

/**
 * @route   GET /api/fish
 * @desc    Ottieni la lista di tutti i pesci
 */
app.get('/api/fish', (req, res) => {
  res.json(fish);
});

/**
 * @route   POST /api/fish
 * @desc    Aggiungi un nuovo pesce
 * @body    { name: string, species: string, aquariumId: number }
 */
app.post('/api/fish', (req, res) => {
  try {
    const { name, species, aquariumId } = req.body;
    if (!name || !species || !aquariumId) {
      // ERROR: Parametri mancanti
      // SOLUTION: Restituisci errore 400
      // CONTEXT: POST /api/fish senza tutti i parametri
      return res.status(400).json({ error: 'Nome, specie e aquariumId sono obbligatori' });
    }
    if (!aquariums.find(a => a.id === aquariumId)) {
      // ERROR: Acquario di destinazione non esistente
      // SOLUTION: Restituisci errore 404
      // CONTEXT: POST /api/fish con aquariumId non valido
      return res.status(404).json({ error: 'Acquario di destinazione non trovato' });
    }
    const newFish = { id: fishIdCounter++, name, species, aquariumId };
    fish.push(newFish);
    res.status(201).json(newFish);
  } catch (err) {
    // ERROR: Errore generico nella creazione pesce
    // SOLUTION: Log e risposta 500
    // CONTEXT: Eccezione inattesa in POST /api/fish
    res.status(500).json({ error: 'Errore interno server' });
  }
});

/**
 * @route   DELETE /api/fish/:id
 * @desc    Elimina un pesce per id
 */
app.delete('/api/fish/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = fish.findIndex(f => f.id === id);
  if (idx === -1) {
    // ERROR: Pesce non trovato
    // SOLUTION: Restituisci errore 404
    // CONTEXT: DELETE con id non presente
    return res.status(404).json({ error: 'Pesce non trovato' });
  }
  fish.splice(idx, 1);
  res.status(204).end();
});

/**
 * @route   POST /api/aquariums/:id/params
 * @desc    Aggiungi una misurazione parametro all'acquario
 * @body    { tipo: string, valore: number, data: string (ISO) }
 * @returns { parametri: array }
 *
 * ERROR: Parametri mancanti o id non valido
 * SOLUTION: Restituisci errore 400/404
 * CONTEXT: POST con dati incompleti o id errato
 */
app.post('/api/aquariums/:id/params', (req, res) => {
	try {
		const parId = parseInt(req.params.id);
		const { tipo, valore, data } = req.body;
		if (!tipo || typeof valore !== 'number' || !data) {
			return res.status(400).json({ error: 'tipo, valore e data sono obbligatori' });
		}
		const varAquarium = aquariums.find(a => a.id === parId);
		if (!varAquarium) {
			return res.status(404).json({ error: 'Acquario non trovato' });
		}
		if (!varAquarium.parametri) varAquarium.parametri = [];
		varAquarium.parametri.push({ tipo, valore, data });
		res.json({ parametri: varAquarium.parametri });
	} catch (err) {
		// ERROR: Errore generico aggiunta parametro
		// SOLUTION: Log e risposta 500
		// CONTEXT: Eccezione inattesa in POST /api/aquariums/:id/params
		res.status(500).json({ error: 'Errore interno server' });
	}
});

/**
 * @route   GET /api/aquariums/:id/params
 * @desc    Ottieni tutte le misurazioni parametri di un acquario
 * @returns { parametri: array }
 *
 * ERROR: id non valido
 * SOLUTION: Restituisci errore 404
 * CONTEXT: GET con id errato
 */
app.get('/api/aquariums/:id/params', (req, res) => {
	const parId = parseInt(req.params.id);
	const varAquarium = aquariums.find(a => a.id === parId);
	if (!varAquarium) {
		return res.status(404).json({ error: 'Acquario non trovato' });
	}
	res.json({ parametri: varAquarium.parametri || [] });
});

/**
 * @section Autenticazione locale (demo)
 * Gestione login/logout con sessione in memoria. Utente demo: 'admin'/'admin'.
 *
 * @route POST /api/login
 * @body { parUsername: string, parPassword: string }
 * @returns { token: string }
 *
 * @route POST /api/logout
 * @header Authorization: Bearer <token>
 *
 * @route GET /api/me
 * @header Authorization: Bearer <token>
 * @returns { parUsername: string }
 *
 * ERROR: Nessun database utenti, solo demo in memoria.
 * SOLUTION: Utente hardcoded, token random in memoria.
 * CONTEXT: Demo, non produzione.
 */

const varUsers = [{ parUsername: 'admin', parPassword: 'admin' }];
const varSessions = {};
const modCrypto = require('crypto');

/**
 * Middleware di autenticazione
 */
function modAuthMiddleware(parReq, parRes, parNext) {
	const varAuth = parReq.headers['authorization'];
	if (!varAuth || !varAuth.startsWith('Bearer ')) {
		return parRes.status(401).json({ error: 'Token mancante' });
	}
	const varToken = varAuth.slice(7);
	if (!varSessions[varToken]) {
		return parRes.status(401).json({ error: 'Token non valido' });
	}
	parReq.parUsername = varSessions[varToken];
	parNext();
}

app.post('/api/login', (parReq, parRes) => {
	const { parUsername, parPassword } = parReq.body;
	const varUser = varUsers.find(u => u.parUsername === parUsername && u.parPassword === parPassword);
	if (!varUser) {
		return parRes.status(401).json({ error: 'Credenziali non valide' });
	}
	const varToken = modCrypto.randomBytes(16).toString('hex');
	varSessions[varToken] = parUsername;
	parRes.json({ token: varToken });
});

app.post('/api/logout', modAuthMiddleware, (parReq, parRes) => {
	const varAuth = parReq.headers['authorization'];
	const varToken = varAuth.slice(7);
	delete varSessions[varToken];
	parRes.json({ message: 'Logout effettuato' });
});

app.get('/api/me', modAuthMiddleware, (parReq, parRes) => {
	parRes.json({ parUsername: parReq.parUsername });
});

/**
 * @section Gestione utenti multipli
 * Permette la creazione di nuovi utenti tramite API.
 *
 * @route POST /api/register
 * @body { parUsername: string, parPassword: string }
 * @returns { message: string }
 *
 * ERROR: Username già esistente
 * SOLUTION: Restituisci errore 409
 * CONTEXT: POST con username già presente in varUsers
 */
app.post('/api/register', (parReq, parRes) => {
	const { parUsername, parPassword } = parReq.body;
	if (!parUsername || !parPassword) {
		return parRes.status(400).json({ error: 'Username e password obbligatori' });
	}
	if (varUsers.find(u => u.parUsername === parUsername)) {
		return parRes.status(409).json({ error: 'Username già esistente' });
	}
	varUsers.push({ parUsername, parPassword });
	parRes.json({ message: 'Utente creato con successo' });
});

// Avvio server
app.listen(varPort, () => {
	console.log(`API server avviato su http://localhost:${varPort}`);
});
