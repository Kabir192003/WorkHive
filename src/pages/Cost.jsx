import React, { useState, useMemo } from 'react';
import { CITY_COST_DATA, CURRENCY_FX, costCompare } from '../lib/costData';

const AMBER = '#F9AD16';
const CITY_NAMES = Object.keys(CITY_COST_DATA);
const CURRENCY_CODES = Object.keys(CURRENCY_FX);

// Currency comes first and every figure below is shown in it immediately —
// no submit button, no hidden USD step. Changing any control recomputes
// the comparison instantly.
const Cost = () => {
    const [currency, setCurrency] = useState('AED');
    const [fromCity, setFromCity] = useState('Bengaluru, India');
    const [toCity, setToCity] = useState('Dubai, United Arab Emirates');

    const result = useMemo(() => costCompare(fromCity, toCity, currency), [fromCity, toCity, currency]);
    const fromShort = fromCity.split(',')[0];
    const toShort = toCity.split(',')[0];

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>COST OF LIVING</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>See what a move actually costs, in the currency you think in.</div>
            </div>

            <div style={{ padding: '26px 28px 0', maxWidth: 900 }}>
                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: 22 }}>
                    <label style={{ display: 'block', marginBottom: 18 }}>
                        <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#4B4E55', marginBottom: 6 }}>1. Show amounts in</span>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', maxWidth: 280, border: `2px solid ${AMBER}`, borderRadius: 3, padding: '12px 12px', fontSize: 14, fontWeight: 700, outline: 'none', background: '#FFFBEF' }}>
                            {CURRENCY_CODES.map((c) => {
                                const sym = CURRENCY_FX[c].symbol.trim();
                                return <option key={c} value={c}>{sym === c ? c : `${c} — ${sym}`}</option>;
                            })}
                        </select>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <label>
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>2. Comparing from</span>
                            <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }}>
                                {CITY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </label>
                        <label>
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>3. Comparing to</span>
                            <select value={toCity} onChange={(e) => setToCity(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }}>
                                {CITY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </label>
                    </div>
                </section>
            </div>

            <div style={{ padding: '20px 28px 44px', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    <div style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px' }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>MONTHLY TOTAL — {fromShort.toUpperCase()}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>{result.fromTotal}</div>
                    </div>
                    <div style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px' }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>MONTHLY TOTAL — {toShort.toUpperCase()}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>{result.toTotal}</div>
                    </div>
                    <div style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFBEF', padding: '18px 20px' }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#9A6A00' }}>CHANGE</div>
                        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: result.deltaUp ? '#B4483A' : '#2E7D53' }}>{result.deltaPct}</div>
                    </div>
                </div>

                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) 1fr 1fr 90px', background: '#F6F6F7', borderBottom: '1px solid #E7E7EA' }}>
                        <div style={{ padding: '11px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.1em', color: '#6B6E75' }}>LINE ITEM</div>
                        <div style={{ padding: '11px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.1em', color: '#6B6E75' }}>{fromShort.toUpperCase()}</div>
                        <div style={{ padding: '11px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.1em', color: '#6B6E75' }}>{toShort.toUpperCase()}</div>
                        <div style={{ padding: '11px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.1em', color: '#6B6E75', textAlign: 'right' }}>Δ</div>
                    </div>
                    {result.rows.map((r) => (
                        <div key={r.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) 1fr 1fr 90px', borderBottom: '1px solid #F4F4F5', alignItems: 'center' }}>
                            <div style={{ padding: '11px 16px', fontSize: 12.5 }}>{r.label}</div>
                            <div style={{ padding: '11px 16px', fontSize: 12.5, color: '#4B4E55' }}>{r.a}</div>
                            <div style={{ padding: '11px 16px', fontSize: 12.5, color: '#4B4E55' }}>{r.b}</div>
                            <div style={{ padding: '11px 16px', fontSize: 12.5, fontWeight: 600, textAlign: 'right', color: r.deltaUp ? '#B4483A' : '#2E7D53' }}>{r.delta}</div>
                        </div>
                    ))}
                </section>

                <div style={{ fontSize: 12, color: '#8C8F96' }}>To match your current lifestyle in {toShort}, you'd want a salary of roughly <strong style={{ color: '#2C2F35' }}>{result.salaryToMatch}/year</strong>. Figures are illustrative monthly estimates for a household of three.</div>
            </div>
        </div>
    );
};

export default Cost;
