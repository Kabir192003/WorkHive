import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Internships = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);

    useEffect(() => {
        supabase.from('internship_listings').select('*').then(({ data }) => setListings(data || []));
    }, []);

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>INTERNSHIPS</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>Paid internships with named teams, not busywork.</div>
            </div>
            <div style={{ padding: '30px 28px 44px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {listings.map((il) => (
                        <div key={il.id} style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                                <div style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>{il.title}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8C8F96', letterSpacing: '0.06em' }}>{il.term}</div>
                            </div>
                            <div style={{ fontSize: 12.5, color: '#5C5F66', marginTop: 4 }}>{il.company} · {il.location}</div>
                            <div style={{ fontSize: 12.5, color: '#4B4E55', marginTop: 8, lineHeight: 1.5 }}>{il.note}</div>
                            <button onClick={() => navigate('/search')} style={{ marginTop: 12, border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '9px 16px', borderRadius: 3, fontSize: 12.5, cursor: 'pointer' }}>Search roles</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Internships;
