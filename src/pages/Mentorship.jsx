import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Mentorship = () => {
    const { user } = useAuth();
    const showToast = useToast();
    const [mentors, setMentors] = useState([]);
    const [requested, setRequested] = useState(new Set());

    useEffect(() => {
        supabase.from('mentors').select('*').then(({ data }) => setMentors(data || []));
        if (user) supabase.from('mentor_requests').select('mentor_id').eq('profile_id', user.id).then(({ data }) => setRequested(new Set((data || []).map((r) => r.mentor_id))));
    }, [user]);

    const request = async (m) => {
        if (!user || requested.has(m.id)) return;
        await supabase.from('mentor_requests').insert({ profile_id: user.id, mentor_id: m.id });
        setRequested((r) => new Set(r).add(m.id));
        showToast(`Session request sent to ${m.name}`);
    };

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>MENTORSHIP</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>Learn from people who have already made the move you're planning.</div>
            </div>
            <div style={{ padding: '30px 28px 44px' }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Mentors available this month</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 16 }}>
                    {mentors.map((m) => (
                        <div key={m.id} style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EDEDEF', backgroundImage: `url(${m.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{m.name}</div>
                            <div style={{ fontSize: 11.5, color: '#6B6E75' }}>{m.role}</div>
                            <div style={{ fontSize: 12, color: '#4B4E55', marginTop: 6, lineHeight: 1.5 }}>{m.focus}</div>
                            <button onClick={() => request(m)} disabled={requested.has(m.id)} style={{ marginTop: 10, width: '100%', border: '1px solid #D8D9DD', background: requested.has(m.id) ? '#F6F6F7' : '#FFFFFF', padding: 9, borderRadius: 3, fontSize: 12.5, cursor: requested.has(m.id) ? 'default' : 'pointer', color: requested.has(m.id) ? '#8C8F96' : '#16181D' }}>{requested.has(m.id) ? 'Requested' : 'Request a session'}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mentorship;
