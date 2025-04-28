import { useEffect, useState } from 'react'
import './App.css'
import logoAcquari from '../logo-acquari.png'
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * @fileoverview Frontend React SPA per gestione acquari, parametri e grafici storici.
 * @module modApp
 * @description Dashboard con elenco acquari cliccabili, dettaglio SPA per ogni acquario con form parametri, grafici storici e storico misurazioni.
 * Prefissi: par (parametri), var (variabili), res (risorse), mod (moduli).
 */

function App() {
	const [varAquariums, setVarAquariums] = useState([])
	const [varFish, setVarFish] = useState([])
	const [parNewAquarium, setParNewAquarium] = useState({ name: '', volume: '' })
	const [parNewFish, setParNewFish] = useState({ name: '', species: '', aquariumId: '' })
	const [varError, setVarError] = useState('')
	const [varToken, setVarToken] = useState(localStorage.getItem('token') || '')
	const [varUsername, setVarUsername] = useState('')
	const [parLogin, setParLogin] = useState({ parUsername: '', parPassword: '' })
	const [varLoading, setVarLoading] = useState(false)
	const [varShowRegister, setVarShowRegister] = useState(false);
	const [parRegister, setParRegister] = useState({ parUsername: '', parPassword: '' });
	const [varRegisterMsg, setVarRegisterMsg] = useState('');
	const [varSelectedAquarium, setVarSelectedAquarium] = useState(null);
	const [varParams, setVarParams] = useState([]);
	const [parNewParam, setParNewParam] = useState({ tipo: "temperatura", valore: "", data: "" });
	const arrParamTypes = [
		"temperatura",
		"ph",
		"gh",
		"kh",
		"no2",
		"no3",
		"ammoniaca",
		"ossigeno"
	];

	// Carica dati utente se autenticato
	useEffect(() => {
		if (varToken) {
			fetch('/api/me', {
				headers: { 'Authorization': 'Bearer ' + varToken }
			})
				.then(res => res.ok ? res.json() : Promise.reject(res))
				.then(data => setVarUsername(data.parUsername))
				.catch(() => { setVarToken(''); localStorage.removeItem('token'); })
		}
	}, [varToken])

	// Carica dati acquari/pesci se autenticato
	useEffect(() => {
		if (varToken) {
			fetch('/api/aquariums').then(r => r.json()).then(setVarAquariums)
			fetch('/api/fish').then(r => r.json()).then(setVarFish)
		}
	}, [varToken])

	async function modLogin(e) {
		e.preventDefault()
		setVarError('')
		setVarLoading(true)
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parLogin)
			})
			if (!res.ok) throw new Error((await res.json()).error)
			const data = await res.json()
			setVarToken(data.token)
			localStorage.setItem('token', data.token)
			setParLogin({ parUsername: '', parPassword: '' })
		} catch (err) {
			setVarError(err.message)
		} finally {
			setVarLoading(false)
		}
	}

	async function modLogout() {
		try {
			await fetch('/api/logout', {
				method: 'POST',
				headers: { 'Authorization': 'Bearer ' + varToken }
			})
		} catch {}
		setVarToken('')
		setVarUsername('')
		localStorage.removeItem('token')
	}

	// CRUD acquari
	async function modAddAquarium(e) {
		e.preventDefault()
		setVarError('')
		try {
			const res = await fetch('/api/aquariums', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', ...(varToken && { 'Authorization': 'Bearer ' + varToken }) },
				body: JSON.stringify({ name: parNewAquarium.name, volume: Number(parNewAquarium.volume) })
			})
			if (!res.ok) throw new Error((await res.json()).error)
			setVarAquariums(await (await fetch('/api/aquariums')).json())
			setParNewAquarium({ name: '', volume: '' })
		} catch (err) {
			setVarError(err.message)
		}
	}

	async function modDeleteAquarium(parId) {
		setVarError('')
		await fetch(`/api/aquariums/${parId}`, { method: 'DELETE', headers: { ...(varToken && { 'Authorization': 'Bearer ' + varToken }) } })
		setVarAquariums(await (await fetch('/api/aquariums')).json())
		setVarFish(await (await fetch('/api/fish')).json())
	}

	// CRUD pesci
	async function modAddFish(e) {
		e.preventDefault()
		setVarError('')
		try {
			const res = await fetch('/api/fish', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', ...(varToken && { 'Authorization': 'Bearer ' + varToken }) },
				body: JSON.stringify({ name: parNewFish.name, species: parNewFish.species, aquariumId: Number(parNewFish.aquariumId) })
			})
			if (!res.ok) throw new Error((await res.json()).error)
			setVarFish(await (await fetch('/api/fish')).json())
			setParNewFish({ name: '', species: '', aquariumId: '' })
		} catch (err) {
			setVarError(err.message)
		}
	}

	async function modDeleteFish(parId) {
		setVarError('')
		await fetch(`/api/fish/${parId}`, { method: 'DELETE', headers: { ...(varToken && { 'Authorization': 'Bearer ' + varToken }) } })
		setVarFish(await (await fetch('/api/fish')).json())
	}

	async function modRegister(e) {
		e.preventDefault();
		setVarError('');
		setVarRegisterMsg('');
		setVarLoading(true);
		try {
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(parRegister)
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			setVarRegisterMsg('Registrazione avvenuta! Ora puoi accedere.');
			setParRegister({ parUsername: '', parPassword: '' });
		} catch (err) {
			setVarError(err.message);
		} finally {
			setVarLoading(false);
		}
	}

	async function modSelectAquarium(parId) {
		setVarSelectedAquarium(parId);
		setVarError("");
		try {
			const res = await fetch(`/api/aquariums/${parId}/params`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			setVarParams(data.parametri || []);
		} catch (err) {
			setVarError(err.message);
		}
	}

	async function modAddParam(e) {
		e.preventDefault();
		setVarError("");
		try {
			const res = await fetch(`/api/aquariums/${varSelectedAquarium}/params`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					tipo: parNewParam.tipo,
					valore: Number(parNewParam.valore),
					data: parNewParam.data || new Date().toISOString()
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			setVarParams(data.parametri);
			setParNewParam({ tipo: "temperatura", valore: "", data: "" });
		} catch (err) {
			setVarError(err.message);
		}
	}

	function modGetChartData(parTipo) {
		const arr = varParams.filter(p => p.tipo === parTipo).sort((a, b) => new Date(a.data) - new Date(b.data));
		return {
			labels: arr.map(p => new Date(p.data).toLocaleString()),
			datasets: [
				{
					label: parTipo,
					data: arr.map(p => p.valore),
					borderColor: "#2563eb",
					backgroundColor: "#4f8cff33",
					tension: 0.3
				}
			]
		};
	}

	if (!varToken) {
		return (
			<div className='login-container'>
				<img src={logoAcquari} alt='Logo Quarioma' className='logo-app' style={{ width: '90px', marginBottom: '1.5rem' }} />
				{varShowRegister ? (
					<>
						<h2>Registrazione</h2>
						<form onSubmit={modRegister} className='login-form'>
							<input placeholder='Username' value={parRegister.parUsername} onChange={e => setParRegister(r => ({ ...r, parUsername: e.target.value }))} required />
							<input placeholder='Password' type='password' value={parRegister.parPassword} onChange={e => setParRegister(r => ({ ...r, parPassword: e.target.value }))} required />
							<button type='submit' disabled={varLoading}>{varLoading ? 'Registrazione...' : 'Registrati'}</button>
						</form>
						{varRegisterMsg && <div className='success'>{varRegisterMsg}</div>}
						{varError && <div className='error'>{varError}</div>}
						<div style={{ marginTop: '1rem' }}>
							<button className='link-btn' type='button' onClick={() => { setVarShowRegister(false); setVarError(''); setVarRegisterMsg(''); }}>Hai già un account? Accedi</button>
						</div>
					</>
				) : (
					<>
						<h2>Login</h2>
						<form onSubmit={modLogin} className='login-form'>
							<input placeholder='Username' value={parLogin.parUsername} onChange={e => setParLogin(l => ({ ...l, parUsername: e.target.value }))} required />
							<input placeholder='Password' type='password' value={parLogin.parPassword} onChange={e => setParLogin(l => ({ ...l, parPassword: e.target.value }))} required />
							<button type='submit' disabled={varLoading}>{varLoading ? 'Accesso...' : 'Accedi'}</button>
						</form>
						{varError && <div className='error'>{varError}</div>}
						<div style={{ marginTop: '1rem' }}>
							<button className='link-btn' type='button' onClick={() => { setVarShowRegister(true); setVarError(''); setVarRegisterMsg(''); }}>Non hai un account? Registrati</button>
						</div>
					</>
				)}
			</div>
		);
	}

	if (varSelectedAquarium) {
		const varAq = varAquariums.find(a => a.id === varSelectedAquarium);
		return (
			<div className="container">
				<header className="header">
					<div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
						<img src={logoAcquari} alt="Logo Quarioma" className="logo-app" style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f7f8fa" }} />
						<span>Benvenuto, {varUsername}</span>
					</div>
					<button className="logout-btn" onClick={modLogout}>Logout</button>
				</header>
				<button className="link-btn" onClick={() => setVarSelectedAquarium(null)} style={{ marginBottom: "1.5rem" }}>&larr; Torna alla dashboard</button>
				<h2>Dettaglio Acquario: {varAq?.name} ({varAq?.volume}L)</h2>
				<section>
					<h3>Inserisci Parametro</h3>
					<form onSubmit={modAddParam} className="form-inline">
						<select value={parNewParam.tipo} onChange={e => setParNewParam(p => ({ ...p, tipo: e.target.value }))}>
							{arrParamTypes.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
						</select>
						<input type="number" step="any" placeholder="Valore" value={parNewParam.valore} onChange={e => setParNewParam(p => ({ ...p, valore: e.target.value }))} required />
						<input type="datetime-local" value={parNewParam.data} onChange={e => setParNewParam(p => ({ ...p, data: e.target.value }))} />
						<button type="submit">Aggiungi</button>
					</form>
				</section>
				<section>
					<h3>Grafici Parametri</h3>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
						{arrParamTypes.map(parTipo => (
							<div key={parTipo} style={{ minWidth: 280, flex: 1 }}></div>
								<Line data={modGetChartData(parTipo)} options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false, height: 200 }} />
								<div style={{ textAlign: "center", marginTop: 8 }}>{parTipo.toUpperCase()}</div>
							</div>
						))}
					</div>
				</section>
				<section>
					<h3>Storico Misurazioni</h3>
					<ul className="list">
						{[...varParams].sort((a, b) => new Date(b.data) - new Date(a.data)).map((p, i) => (
							<li key={i} className="list-item"></li>
								{p.tipo.toUpperCase()} - {p.valore} ({new Date(p.data).toLocaleString()})
							</li>
						))}
					</ul>
				</section>
				{varError && <div className="error">Errore: {varError}</div>}
			</div>
		);
	}

	return (
		<div className="container">
			<header className="header">
				<div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
					<img src={logoAcquari} alt="Logo Quarioma" className="logo-app" style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#f7f8fa" }} />
					<span>Benvenuto, {varUsername}</span>
				</div>
				<button className="logout-btn" onClick={modLogout}>Logout</button>
			</header>
			<h1>Gestione Acquari</h1>
			{varError && <div className="error">Errore: {varError}</div>}
			<section>
				<h2>Acquari</h2>
				<form onSubmit={modAddAquarium} className="form-inline">
					<input placeholder="Nome" value={parNewAquarium.name} onChange={e => setParNewAquarium(a => ({ ...a, name: e.target.value }))} required />
					<input placeholder="Volume (L)" type="number" value={parNewAquarium.volume} onChange={e => setParNewAquarium(a => ({ ...a, volume: e.target.value }))} required />
					<button type="submit">Aggiungi Acquario</button>
				</form>
				<ul className="list">
					{varAquariums.map(a => (
						<li key={a.id} className="list-item" style={{ cursor: "pointer" }} onClick={() => modSelectAquarium(a.id)}>
							{a.name} ({a.volume}L)
						</li>
					))}
				</ul>
			</section>
			<section>
				<h2>Pesci</h2>
				<form onSubmit={modAddFish} className="form-inline">
					<input placeholder="Nome" value={parNewFish.name} onChange={e => setParNewFish(f => ({ ...f, name: e.target.value }))} required />
					<input placeholder="Specie" value={parNewFish.species} onChange={e => setParNewFish(f => ({ ...f, species: e.target.value }))} required />
					<select value={parNewFish.aquariumId} onChange={e => setParNewFish(f => ({ ...f, aquariumId: e.target.value }))} required>
						<option value="">Seleziona acquario</option>
						{varAquariums.map(a => (
							<option key={a.id} value={a.id}>{a.name}</option>
						))}
					</select>
					<button type="submit">Aggiungi Pesce</button>
				</form>
				<ul className="list">
					{varFish.map(f => (
						<li key={f.id} className="list-item">
							{f.name} ({f.species}) - Acquario: {varAquariums.find(a => a.id === f.aquariumId)?.name || 'N/A'}
							<button onClick={() => modDeleteFish(f.id)} className="delete-btn">Elimina</button>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export default App;
