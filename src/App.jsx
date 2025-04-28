import { useEffect, useState } from 'react'
import './App.css'
import logoAcquari from '../logo-acquari.png'

/**
 * @fileoverview Frontend React per la gestione acquari e pesci con autenticazione locale.
 * @module modApp
 * @description Mostra schermata di login e dashboard solo se autenticato.
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

	return (
		<div className='container'>
			<header className='header'>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
					<img src={logoAcquari} alt='Logo Quarioma' className='logo-app' style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f7f8fa' }} />
					<span>Benvenuto, {varUsername}</span>
				</div>
				<button className='logout-btn' onClick={modLogout}>Logout</button>
			</header>
			<h1>Gestione Acquari</h1>
			{varError && <div className='error'>Errore: {varError}</div>}
			<section>
				<h2>Acquari</h2>
				<form onSubmit={modAddAquarium} className='form-inline'>
					<input placeholder='Nome' value={parNewAquarium.name} onChange={e => setParNewAquarium(a => ({ ...a, name: e.target.value }))} required />
					<input placeholder='Volume (L)' type='number' value={parNewAquarium.volume} onChange={e => setParNewAquarium(a => ({ ...a, volume: e.target.value }))} required />
					<button type='submit'>Aggiungi Acquario</button>
				</form>
				<ul className='list'>
					{varAquariums.map(a => (
						<li key={a.id} className='list-item'>
							{a.name} ({a.volume}L)
							<button onClick={() => modDeleteAquarium(a.id)} className='delete-btn'>Elimina</button>
						</li>
					))}
				</ul>
			</section>
			<section>
				<h2>Pesci</h2>
				<form onSubmit={modAddFish} className='form-inline'>
					<input placeholder='Nome' value={parNewFish.name} onChange={e => setParNewFish(f => ({ ...f, name: e.target.value }))} required />
					<input placeholder='Specie' value={parNewFish.species} onChange={e => setParNewFish(f => ({ ...f, species: e.target.value }))} required />
					<select value={parNewFish.aquariumId} onChange={e => setParNewFish(f => ({ ...f, aquariumId: e.target.value }))} required>
						<option value=''>Seleziona acquario</option>
						{varAquariums.map(a => (
							<option key={a.id} value={a.id}>{a.name}</option>
						))}
					</select>
					<button type='submit'>Aggiungi Pesce</button>
				</form>
				<ul className='list'>
					{varFish.map(f => (
						<li key={f.id} className='list-item'>
							{f.name} ({f.species}) - Acquario: {varAquariums.find(a => a.id === f.aquariumId)?.name || 'N/A'}
							<button onClick={() => modDeleteFish(f.id)} className='delete-btn'>Elimina</button>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

export default App
