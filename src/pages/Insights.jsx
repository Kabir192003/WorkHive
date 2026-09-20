import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TOOLS = [
    { title: 'Company Ratings', body: 'Verified reviews from current and former employees, by category.', to: '/ratings' },
    { title: 'Salaries', body: 'Compare total cash by company, role and seniority.', to: '/salaries' },
    { title: 'Cost of Living', body: 'See what a move actually costs, city to city.', to: '/cost' },
    { title: 'Relocation', body: 'One-off relocation costs and what employers typically cover.', to: '/relocation' },
];

const Insights = () => {
    const navigate = useNavigate();
    const [bestPlaces, setBestPlaces] = useState([]);

    useEffect(() => {
        supabase.from('companies').select('name, sector, rating').order('rating', { ascending: false }).limit(5).then(({ data }) => setBestPlaces(data || []));
    }, []);

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ position: 'relative', height: 240, background: '#2A2C31', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=60" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,22,28,0.80) 0%, rgba(20,22,28,0.44) 55%, rgba(20,22,28,0.10) 100%)' }} />
                <div style={{ position: 'absolute', left: 28, bottom: 30 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>WORK HIVE INSIGHTS</div>
                    <div style={{ fontSize: 34, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8 }}>What a job is actually worth</div>
                    <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>Ratings, pay and living costs, all in one place.</div>
                </div>
            </div>

            <div style={{ padding: '26px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
                    {TOOLS.map((t) => (
                        <div key={t.to} onClick={() => navigate(t.to)} style={{ border: '1px solid #E7E7EA', borderRadius: 5, padding: 18, cursor: 'pointer', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ width: 26, height: 30, background: '#FFF3D6', clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }} />
                            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{t.title}</div>
                            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5C5F66' }}>{t.body}</div>
                        </div>
                    ))}
                </div>

                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 10px' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Best places to work</div>
                    <div style={{ fontSize: 12.5, color: '#5C5F66', marginTop: 6 }}>Ranked by rating across every company on Work Hive.</div>
                    {bestPlaces.map((b, i) => (
                        <div key={b.name} onClick={() => navigate('/ratings')} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderTop: '1px solid #F4F4F5', cursor: 'pointer' }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#C07C05', width: 24, flex: 'none' }}>{String(i + 1).padStart(2, '0')}</div>
                            <div style={{ width: 34, height: 34, borderRadius: 3, background: '#EDEDEF', flex: 'none' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#8C8F96', letterSpacing: '0.1em', marginTop: 3 }}>{b.sector}</div>
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, width: 54, textAlign: 'right', flex: 'none' }}>{b.rating}</div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Insights;
