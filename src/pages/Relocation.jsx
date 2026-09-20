import React, { useState, useMemo } from 'react';
import { CITY_COST_DATA, CURRENCY_FX } from '../lib/costData';
import { relocationEstimate } from '../lib/relocationData';

const AMBER = '#F9AD16';
const CITY_NAMES = Object.keys(CITY_COST_DATA);
const CURRENCY_CODES = Object.keys(CURRENCY_FX);

const STEPS = [
    { n: '01', title: 'Confirm the offer terms', body: 'Get relocation support, visa sponsorship and any allowances in writing before you commit to a date.' },
    { n: '02', title: 'Start the visa process early', body: 'Work permits typically take 4–8 weeks — start the moment you have a signed offer.' },
    { n: '03', title: 'Book freight before flights', body: 'Shipping quotes vary widely by season; lock in freight first since it has the longest lead time.' },
    { n: '04', title: 'Arrange temporary housing', body: 'Budget one month of temporary housing while you search for a longer-term place in person.' },
];

const Relocation = () => {
    const [currency, setCurrency] = useState('AED');
    const [fromCity, setFromCity] = useState('Bengaluru, India');
    const [toCity, setToCity] = useState('Dubai, United Arab Emirates');

    const result = useMemo(() => relocationEstimate(fromCity, toCity, currency), [fromCity, toCity, currency]);

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>RELOCATION</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>Estimate your relocation costs, in your currency.</div>
            </div>

            <div style={{ padding: '26px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: 22 }}>
                    <label style={{ display: 'block', marginBottom: 18 }}>
                        <span style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#4B4E55', marginBottom: 6 }}>1. Show amounts in</span>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', maxWidth: 280, border: `2px solid ${AMBER}`, borderRadius: 3, padding: 12, fontSize: 14, fontWeight: 700, outline: 'none', background: '#FFFBEF' }}>
                            {CURRENCY_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <label>
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Relocating from</span>
                            <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: 11, fontSize: 13, outline: 'none' }}>
                                {CITY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </label>
                        <label>
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Relocating to</span>
                            <select value={toCity} onChange={(e) => setToCity(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: 11, fontSize: 13, outline: 'none' }}>
                                {CITY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </label>
                    </div>
                </section>

                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 24px' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>One-off costs, <span style={{ color: '#C07C05' }}>{fromCity.split(',')[0]}</span> to <span style={{ color: '#C07C05' }}>{toCity.split(',')[0]}</span></div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.65, color: '#5C5F66', marginTop: 8, maxWidth: 800 }}>A household of three, moving on an employer-sponsored permit. What's typically employer-paid is noted per line.</div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, flexWrap: 'wrap', margin: '20px 0 4px', paddingBottom: 18, borderBottom: '1px solid #F0F0F2' }}>
                        <div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>TOTAL ONE-OFF COST</div>
                            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>{result.totalLabel}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #EDEDEF', paddingLeft: 22 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>TYPICALLY EMPLOYER-PAID</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6, color: '#2E7D53' }}>{result.employerCoveredLabel}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #EDEDEF', paddingLeft: 22 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>LEFT WITH YOU</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{result.leftWithYouLabel}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 20, border: '1px solid #EDEDEF', borderRadius: 4, overflow: 'hidden' }}>
                        {result.rows.map((r) => (
                            <div key={r.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 130px 150px', alignItems: 'center', borderBottom: '1px solid #F4F4F5' }}>
                                <div style={{ padding: '12px 14px' }}>
                                    <div style={{ fontSize: 12.5, color: '#2C2F35' }}>{r.label}</div>
                                    <div style={{ fontSize: 11, color: '#8C8F96', marginTop: 3 }}>{r.employerNote}</div>
                                </div>
                                <div style={{ padding: '12px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, textAlign: 'right' }}>{r.a}</div>
                                <div style={{ padding: '12px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: r.employerPaid ? '#2E7D53' : '#9A9CA1', letterSpacing: '0.1em', textAlign: 'right' }}>{r.employerPaid ? 'EMPLOYER-PAID' : 'YOUR COST'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Sequence that works</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 16 }}>
                        {STEPS.map((s) => (
                            <div key={s.n} style={{ borderTop: '2px solid #23262C', paddingTop: 12 }}>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#C07C05', letterSpacing: '0.12em' }}>{s.n}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 7 }}>{s.title}</div>
                                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5C5F66', marginTop: 7 }}>{s.body}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Relocation;
