import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { RATING_TABS, ratingsBreakdown } from '../lib/ratingsData';

const Ratings = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);
    const [facts, setFacts] = useState([]);
    const [tab, setTab] = useState('Overall');

    useEffect(() => {
        supabase.from('companies').select('*').order('name').then(({ data }) => {
            setCompanies(data || []);
            if (data?.length) setSelected(data[0]);
        });
    }, []);

    useEffect(() => {
        if (!selected) return;
        supabase.from('company_facts').select('*').eq('company_id', selected.id).then(({ data }) => setFacts(data || []));
    }, [selected]);

    const suggestions = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return companies.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
    }, [query, companies]);

    const breakdown = useMemo(() => (selected ? ratingsBreakdown(selected, tab) : null), [selected, tab]);

    if (!selected) return <div style={{ padding: 60, textAlign: 'center', color: '#8C8F96' }}>Loading…</div>;

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ position: 'relative', height: 200, background: '#2A2C31' }}>
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=60" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,22,28,0.72) 0%, rgba(20,22,28,0.46) 42%, rgba(20,22,28,0.08) 100%)' }} />
                <div style={{ position: 'absolute', left: 28, top: 26 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.14em', color: '#FFC94D' }}>WORK HIVE</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 6 }}>Company Ratings</div>
                </div>
                <div style={{ position: 'absolute', left: 28, right: 28, bottom: 20, maxWidth: 420 }}>
                    <input placeholder="Search a company" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%', border: 0, outline: 'none', padding: '13px 16px', fontSize: 13, borderRadius: 4, background: 'rgba(255,255,255,0.96)' }} />
                    {suggestions.length > 0 && (
                        <div style={{ background: '#FFFFFF', borderRadius: 4, marginTop: 4, boxShadow: '0 10px 24px rgba(20,22,28,0.18)', overflow: 'hidden' }}>
                            {suggestions.map((c) => (
                                <div key={c.id} onClick={() => { setSelected(c); setQuery(''); }} style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', borderTop: '1px solid #F0F0F2' }}>{c.name}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '26px 28px 40px' }}>
                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 24px', maxWidth: 900 }}>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>Company Ratings for <span style={{ color: '#C07C05' }}>{selected.name}</span></div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.65, color: '#5C5F66', marginTop: 8 }}>Ratings are submitted by verified current and former employees.</div>

                    <div style={{ display: 'flex', gap: 2, marginTop: 18, overflowX: 'auto', borderBottom: '1px solid #E7E7EA' }}>
                        {RATING_TABS.map((t) => (
                            <button key={t} onClick={() => setTab(t)} style={{ border: 0, background: t === tab ? '#FFF3D6' : 'transparent', color: t === tab ? '#8A5200' : '#6B6E75', fontSize: 12.5, fontWeight: t === tab ? 700 : 500, padding: '11px 18px', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: '3px 3px 0 0' }}>{t}</button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 26, paddingTop: 20 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{tab} Rating</div>
                                <div style={{ fontSize: 22, fontWeight: 800 }}>{breakdown.score.toFixed(2)}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
                                {[1, 2, 3, 4, 5].map((i) => <span key={i} style={{ width: 22, height: 22, borderRadius: 2, background: i <= Math.round(breakdown.score) ? '#F9AD16' : '#EDEDEF' }} />)}
                            </div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8C8F96', marginTop: 7, letterSpacing: '0.06em' }}>{breakdown.reviewCount} REVIEWS</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Distribution of ratings</div>
                            {breakdown.dist.map((d) => (
                                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#6B6E75', width: 34 }}>{d.label}</span>
                                    <span style={{ flex: 1, height: 8, background: '#F1F1F3', borderRadius: 999, overflow: 'hidden' }}>
                                        <span style={{ display: 'block', height: '100%', width: `${d.pct}%`, background: d.color }} />
                                    </span>
                                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#6B6E75', width: 36, textAlign: 'right' }}>{d.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #F0F0F2', marginTop: 22, paddingTop: 18 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>About</div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.7, color: '#5C5F66', marginTop: 8, maxWidth: 800 }}>{selected.about}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18, marginTop: 20 }}>
                            {facts.map((f) => (
                                <div key={f.id}>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>{f.label}</div>
                                    <div style={{ fontSize: 13, marginTop: 5, color: '#2C2F35' }}>{f.value}</div>
                                </div>
                            ))}
                        </div>
                        <a href="#0" onClick={(e) => { e.preventDefault(); navigate(`/company/${selected.id}`); }} style={{ display: 'inline-block', marginTop: 18, fontSize: 12.5 }}>View full company profile →</a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Ratings;
