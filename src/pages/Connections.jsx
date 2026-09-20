import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const AMBER = '#F9AD16';

// Simplified from the original mock's decorative radial network-graph into a
// searchable, real list — the graph looked good but couldn't actually be
// clicked through to anything; this can.
const Connections = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);
    const [query, setQuery] = useState({ role: '', location: '', industry: '' });

    useEffect(() => {
        if (!user) return;
        supabase.from('connections').select('*').eq('profile_id', user.id).order('degree').then(({ data }) => setConnections(data || []));
    }, [user]);

    const filtered = useMemo(() => {
        const q = (s) => (s || '').trim().toLowerCase();
        return connections.filter((c) =>
            (!q(query.role) || c.role.toLowerCase().includes(q(query.role))) &&
            (!q(query.location) || (c.location || '').toLowerCase().includes(q(query.location))) &&
            (!q(query.industry) || (c.industry || '').toLowerCase().includes(q(query.industry)))
        );
    }, [connections, query]);

    const messageConnection = async (c) => {
        const { data: existing } = await supabase.from('message_threads').select('id').eq('profile_id', user.id).eq('type', 'message').eq('counterpart_name', c.role + ', ' + c.org).maybeSingle();
        if (!existing) {
            await supabase.from('message_threads').insert({
                profile_id: user.id, type: 'message', counterpart_name: `${c.role}, ${c.org}`,
                counterpart_subtitle: c.location, unread: false,
            });
        }
        navigate('/messages');
    };

    return (
        <div style={{ minWidth: 0, padding: '0 0 34px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 148px', borderBottom: '1px solid #E7E7EA' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 18px', borderRight: '1px solid #EFEFF1' }}>
                    <span style={{ color: '#9A9CA1', fontSize: 12 }}>⌕</span>
                    <input placeholder="Role or title" value={query.role} onChange={(e) => setQuery((q) => ({ ...q, role: e.target.value }))} style={{ border: 0, outline: 'none', background: 'none', width: '100%', fontSize: 13.5, fontWeight: 500 }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 18px', borderRight: '1px solid #EFEFF1' }}>
                    <span style={{ color: '#9A9CA1', fontSize: 12 }}>⌕</span>
                    <input placeholder="Location" value={query.location} onChange={(e) => setQuery((q) => ({ ...q, location: e.target.value }))} style={{ border: 0, outline: 'none', background: 'none', width: '100%', fontSize: 13.5 }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 18px', borderRight: '1px solid #EFEFF1' }}>
                    <span style={{ color: '#9A9CA1', fontSize: 12 }}>⌕</span>
                    <input placeholder="Industry" value={query.industry} onChange={(e) => setQuery((q) => ({ ...q, industry: e.target.value }))} style={{ border: 0, outline: 'none', background: 'none', width: '100%', fontSize: 13.5 }} />
                </label>
                <div style={{ display: 'grid', placeItems: 'center', background: '#23262C', color: '#FFFFFF', fontSize: 13.5, fontWeight: 600 }}>{filtered.length} found</div>
            </div>

            <div style={{ padding: '20px 28px 0' }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{filtered.length} connection{filtered.length === 1 ? '' : 's'}</div>
            </div>

            <div style={{ padding: '16px 28px 34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {filtered.map((c) => (
                    <div key={c.id} style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#EDEDEF', flex: 'none' }} />
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.role}</div>
                                <div style={{ fontSize: 11.5, color: '#6B6E75' }}>{c.org}</div>
                            </div>
                        </div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8C8F96', letterSpacing: '0.06em' }}>{c.location} · {c.degree === 1 ? '1ST DEGREE' : '2ND DEGREE'}</div>
                        <button onClick={() => messageConnection(c)} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '9px', borderRadius: 3, fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>Message</button>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#8C8F96' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#4B4E55' }}>No connections match</div>
                        <div style={{ fontSize: 12.5, marginTop: 6 }}>Try clearing a filter.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connections;
