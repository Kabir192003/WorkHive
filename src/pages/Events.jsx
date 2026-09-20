import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Events = () => {
    const { user } = useAuth();
    const showToast = useToast();
    const [events, setEvents] = useState([]);
    const [going, setGoing] = useState(new Set());

    useEffect(() => {
        supabase.from('events').select('*').then(({ data }) => setEvents(data || []));
        if (user) supabase.from('event_rsvps').select('event_id').eq('profile_id', user.id).then(({ data }) => setGoing(new Set((data || []).map((r) => r.event_id))));
    }, [user]);

    const toggleRsvp = async (ev) => {
        if (!user) return;
        if (going.has(ev.id)) {
            await supabase.from('event_rsvps').delete().eq('profile_id', user.id).eq('event_id', ev.id);
            setGoing((g) => { const n = new Set(g); n.delete(ev.id); return n; });
            showToast('RSVP cancelled');
        } else {
            await supabase.from('event_rsvps').insert({ profile_id: user.id, event_id: ev.id });
            setGoing((g) => new Set(g).add(ev.id));
            showToast(`You're going to ${ev.title}`);
        }
    };

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>EVENTS</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>Talks and working sessions, in person and online.</div>
            </div>
            <div style={{ padding: '30px 28px 44px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {events.map((ev) => (
                        <div key={ev.id} style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#C07C05', letterSpacing: '0.08em', flex: 'none', width: 100 }}>{ev.event_date}</div>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>{ev.title}</div>
                                <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 3 }}>{ev.format}</div>
                                <div style={{ fontSize: 12.5, color: '#4B4E55', marginTop: 8, lineHeight: 1.5 }}>{ev.body}</div>
                            </div>
                            <button onClick={() => toggleRsvp(ev)} style={{ border: '1px solid #D8D9DD', background: going.has(ev.id) ? '#EAF6EF' : '#FFFFFF', color: going.has(ev.id) ? '#1E5E3B' : '#16181D', padding: '9px 16px', borderRadius: 3, fontSize: 12.5, cursor: 'pointer', alignSelf: 'flex-start' }}>{going.has(ev.id) ? 'Going ✓' : 'RSVP'}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
