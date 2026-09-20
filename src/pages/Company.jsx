import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Company = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [facts, setFacts] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [tab, setTab] = useState('Overview');

    useEffect(() => {
        (async () => {
            const { data: c } = await supabase.from('companies').select('*').eq('id', slug).single();
            if (!c) return;
            setCompany(c);
            const [{ data: f }, { data: j }] = await Promise.all([
                supabase.from('company_facts').select('*').eq('company_id', c.id),
                supabase.from('jobs').select('id, title, location, match_label').eq('company_id', c.id),
            ]);
            setFacts(f || []);
            setJobs(j || []);
        })();
    }, [slug]);

    if (!company) return <div style={{ padding: 60, textAlign: 'center', color: '#8C8F96' }}>Loading…</div>;

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ position: 'relative', height: 230, background: '#2A2C31', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=60" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,22,28,0.8) 0%, rgba(20,22,28,0.42) 55%, rgba(20,22,28,0.1) 100%)' }} />
                <div style={{ position: 'absolute', left: 28, bottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 58, height: 58, borderRadius: 6, background: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 800, color: '#23262C' }}>{company.name.charAt(0)}</div>
                    <div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>{company.name}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em', marginTop: 6 }}>{company.sector}</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 28px' }}>
                <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E7E7EA', alignItems: 'center' }}>
                    {['Overview', 'Open Roles'].map((t) => (
                        <button key={t} onClick={() => setTab(t)} style={{ border: 0, background: t === tab ? '#FFF3D6' : 'transparent', color: t === tab ? '#8A5200' : '#4B4E55', fontSize: 13, fontWeight: t === tab ? 700 : 500, padding: '14px 18px', cursor: 'pointer' }}>{t}{t === 'Open Roles' ? ` (${jobs.length})` : ''}</button>
                    ))}
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>{company.rating}</div>
                        <a href="#0" onClick={(e) => { e.preventDefault(); navigate('/ratings'); }} style={{ fontSize: 12 }}>Full ratings →</a>
                    </div>
                </div>
            </div>

            <div style={{ padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {tab === 'Overview' && (
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>About</div>
                        <div style={{ fontSize: 13, lineHeight: 1.7, color: '#5C5F66', marginTop: 10, maxWidth: 820 }}>{company.about}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 18, marginTop: 20 }}>
                            {facts.map((f) => (
                                <div key={f.id}>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#8C8F96' }}>{f.label}</div>
                                    <div style={{ fontSize: 13, marginTop: 5, color: '#2C2F35' }}>{f.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {tab === 'Open Roles' && (
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Open roles at {company.name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                            {jobs.map((j) => (
                                <div key={j.id} onClick={() => navigate(`/job/${j.id}`)} style={{ border: '1px solid #EDEDEF', borderRadius: 4, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{j.title}</div>
                                        <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 3 }}>{j.location}</div>
                                    </div>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#2E7D53' }}>{j.match_label}</div>
                                </div>
                            ))}
                            {jobs.length === 0 && <div style={{ fontSize: 12.5, color: '#8C8F96', padding: '8px 0' }}>No open roles listed right now.</div>}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Company;
