import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { CURRENCY_FX } from '../lib/costData';
import { salaryEstimate, SENIORITY_BANDS } from '../lib/salaryData';

const AMBER = '#F9AD16';
const CURRENCY_CODES = Object.keys(CURRENCY_FX);

const Salaries = () => {
    const [companies, setCompanies] = useState([]);
    const [currency, setCurrency] = useState('AED');
    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('Product Designer');
    const [seniority, setSeniority] = useState('Senior (8–12 yrs)');

    useEffect(() => {
        supabase.from('companies').select('id, name').order('name').then(({ data }) => {
            setCompanies(data || []);
            if (data?.length) setCompany(data[0].name);
        });
    }, []);

    const result = useMemo(() => salaryEstimate(company, title, seniority, currency), [company, title, seniority, currency]);

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>SALARIES</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>Review & compare salaries, in your currency.</div>
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
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Company</span>
                            <select value={company} onChange={(e) => setCompany(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: 11, fontSize: 13, outline: 'none' }}>
                                {companies.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </label>
                        <label>
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Job title</span>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: 11, fontSize: 13, outline: 'none' }} />
                        </label>
                        <label>
                            <span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Seniority</span>
                            <select value={seniority} onChange={(e) => setSeniority(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: 11, fontSize: 13, outline: 'none' }}>
                                {SENIORITY_BANDS.map((b) => <option key={b.label} value={b.label}>{b.label}</option>)}
                            </select>
                        </label>
                    </div>
                </section>

                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 24px' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Salaries for <span style={{ color: '#C07C05' }}>{title || 'this role'}</span> at <span style={{ color: '#C07C05' }}>{company}</span></div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.65, color: '#5C5F66', marginTop: 8, maxWidth: 780 }}>Estimated from role, seniority and company profile — shown live as you change any field above.</div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, flexWrap: 'wrap', marginTop: 22, paddingBottom: 20, borderBottom: '1px solid #F0F0F2' }}>
                        <div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>MEDIAN TOTAL CASH</div>
                            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>{result.medianLabel}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #EDEDEF', paddingLeft: 22 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>RANGE</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{result.rangeLabel}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #EDEDEF', paddingLeft: 22 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>SAMPLE</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{result.sample} reports</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #EDEDEF', paddingLeft: 22 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>YEAR ON YEAR</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6, color: result.yoyUp ? '#2E7D53' : '#B4483A' }}>{result.yoy}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 22 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Range by seniority</div>
                        {result.bands.map((b) => (
                            <div key={b.label} style={{ display: 'grid', gridTemplateColumns: '170px minmax(0, 1fr) 140px', alignItems: 'center', gap: 14, padding: '9px 0', borderTop: '1px solid #F4F4F5' }}>
                                <div style={{ fontSize: 12.5, color: b.current ? '#16181D' : '#2C2F35', fontWeight: b.current ? 700 : 400 }}>{b.label}</div>
                                <div style={{ position: 'relative', height: 12, background: '#F4F4F5', borderRadius: 999 }}>
                                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${Math.max(0, b.pct - 10)}%`, width: `${Math.min(100, 20)}%`, background: b.current ? 'linear-gradient(90deg, #FFD782, #F9AD16)' : '#E3E3E6', borderRadius: 999 }} />
                                </div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#55585F', textAlign: 'right' }}>{b.medianLabel}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Salaries;
