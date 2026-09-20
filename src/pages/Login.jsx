import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AMBER = '#F9AD16';

const Login = () => {
    const { signIn, signUp, signInDemo } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('signin'); // signin | signup
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        const { error: err } = mode === 'signin'
            ? await signIn(email, password)
            : await signUp(email, password, name);
        setBusy(false);
        if (err) { setError(err.message); return; }
        navigate('/dashboard');
    };

    const demo = async () => {
        setBusy(true);
        setError('');
        const { error: err } = await signInDemo();
        setBusy(false);
        if (err) { setError('Demo login failed: ' + err.message); return; }
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8E8EA', fontFamily: 'Figtree, system-ui, sans-serif' }}>
            <div style={{ width: 380, background: '#FFFFFF', borderRadius: 8, boxShadow: '0 18px 50px rgba(20,22,28,0.16)', padding: '32px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                    <div style={{ width: 34, padding: '6px 4px', background: 'linear-gradient(160deg, #FFC02E 0%, #F79E1B 55%, #EE7D0E 100%)', display: 'flex', justifyContent: 'center' }}>
                        <svg viewBox="0 0 48 34" width="22" height="16"><polygon points="4,2 16,2 10,13" fill="#FFF" /><polygon points="18,2 30,2 24,13" fill="#FFF" /><polygon points="32,2 44,2 38,13" fill="#FFF" /><polygon points="11,15 23,15 17,26" fill="#FFF" /><polygon points="25,15 37,15 31,26" fill="#FFF" /></svg>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#16181D' }}>Work Hive</span>
                </div>

                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16181D', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
                <p style={{ fontSize: 13, color: '#6B6E75', margin: '0 0 20px' }}>Endorsement-based hiring. Real accounts, real applications.</p>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {mode === 'signup' && (
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
                            style={{ padding: '10px 12px', border: '1px solid #DDDDE1', borderRadius: 4, fontSize: 13.5 }} />
                    )}
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
                        style={{ padding: '10px 12px', border: '1px solid #DDDDE1', borderRadius: 4, fontSize: 13.5 }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6}
                        style={{ padding: '10px 12px', border: '1px solid #DDDDE1', borderRadius: 4, fontSize: 13.5 }} />
                    {error && <div style={{ fontSize: 12.5, color: '#B4483A', background: '#FBEDEB', padding: '8px 10px', borderRadius: 4 }}>{error}</div>}
                    <button disabled={busy} type="submit" style={{ marginTop: 4, border: 0, background: AMBER, color: '#241A00', fontWeight: 700, fontSize: 13.5, padding: '11px', borderRadius: 6, cursor: 'pointer' }}>
                        {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
                    </button>
                </form>

                <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={{ border: 0, background: 'none', color: '#B26A00', fontSize: 12.5, marginTop: 14, cursor: 'pointer', width: '100%' }}>
                    {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
                    <div style={{ flex: 1, height: 1, background: '#EDEDEF' }} /><span style={{ fontSize: 11, color: '#9A9CA1' }}>OR</span><div style={{ flex: 1, height: 1, background: '#EDEDEF' }} />
                </div>

                <button onClick={demo} disabled={busy} style={{ width: '100%', border: '1px solid #DDDDE1', background: '#FAFAFB', color: '#2C2F35', fontWeight: 600, fontSize: 13, padding: '11px', borderRadius: 6, cursor: 'pointer' }}>
                    Continue as demo candidate →
                </button>
            </div>
        </div>
    );
};

export default Login;
