import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AMBER = '#F9AD16';

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}M AGO`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}H AGO`;
    return `${Math.floor(hrs / 24)}D AGO`;
};

const Messages = () => {
    const { user } = useAuth();
    const showToast = useToast();
    const [tab, setTab] = useState('Endorsement Requests');
    const [threads, setThreads] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [compose, setCompose] = useState('');

    const loadThreads = async () => {
        if (!user) return;
        const type = tab === 'Endorsement Requests' ? 'endorsement' : 'message';
        const { data } = await supabase.from('message_threads').select('*, messages(body, created_at)').eq('profile_id', user.id).eq('type', type).order('created_at', { ascending: false });
        const list = data || [];
        setThreads(list);
        setActiveId((cur) => (list.find((t) => t.id === cur) ? cur : list[0]?.id || null));
    };

    useEffect(() => { loadThreads(); }, [user, tab]);

    useEffect(() => {
        if (!activeId) { setMessages([]); return; }
        supabase.from('messages').select('*').eq('thread_id', activeId).order('created_at').then(({ data }) => setMessages(data || []));
    }, [activeId]);

    const active = threads.find((t) => t.id === activeId);

    const respond = async (status) => {
        await supabase.from('message_threads').update({ status }).eq('id', activeId);
        setThreads((ts) => ts.map((t) => (t.id === activeId ? { ...t, status } : t)));

        // Accepting a request is a real endorsement, not just a status flip —
        // it lands on the profile and moves the score, same as it would if
        // someone else on the other end of this thread had accepted it.
        if (status === 'accepted' && user && active) {
            const [byName, byRole] = active.counterpart_name.split(/,(.+)/).map((s) => s?.trim());
            await supabase.from('endorsements_received').insert({
                profile_id: user.id,
                quote: `Happy to vouch for this — we worked closely on ${active.counterpart_subtitle}.`,
                by_name: byName,
                by_role: byRole,
                basis: active.counterpart_subtitle,
            });
            const { data: prof } = await supabase.from('profiles').select('endorsement_score').eq('id', user.id).single();
            if (prof) await supabase.from('profiles').update({ endorsement_score: prof.endorsement_score + 15 }).eq('id', user.id);
            showToast('Endorsement accepted — your score just went up');
        } else if (status === 'declined') {
            showToast('Request declined');
        }
    };

    const send = async () => {
        const text = compose.trim();
        if (!text || !activeId) return;
        const { data } = await supabase.from('messages').insert({ thread_id: activeId, sender: 'me', body: text }).select().single();
        if (data) setMessages((m) => [...m, data]);
        setCompose('');
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', alignItems: 'start', minHeight: 640 }}>
            <aside style={{ borderRight: '1px solid #E7E7EA' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #E7E7EA' }}>
                    {['Endorsement Requests', 'Messages'].map((label) => (
                        <button key={label} onClick={() => setTab(label)} style={{ flex: 1, border: 0, background: label === tab ? AMBER : 'transparent', color: label === tab ? '#241A00' : '#6B6E75', fontSize: 12.5, fontWeight: label === tab ? 700 : 500, padding: '14px 10px', cursor: 'pointer' }}>{label}</button>
                    ))}
                </div>
                {threads.map((th) => (
                    <div key={th.id} onClick={() => setActiveId(th.id)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', borderBottom: '1px solid #F4F4F5', cursor: 'pointer', background: th.id === activeId ? '#FCFAF3' : '#FFFFFF' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EDEDEF', flex: 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{th.counterpart_name}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#9A9CA1' }}>{timeAgo(th.created_at)}</div>
                            </div>
                            <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 3, lineHeight: 1.4 }}>{th.messages?.[0]?.body || th.counterpart_subtitle}</div>
                        </div>
                        {th.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: AMBER, flex: 'none', marginTop: 5 }} />}
                    </div>
                ))}
                {threads.length === 0 && <div style={{ padding: 20, fontSize: 12.5, color: '#8C8F96' }}>No threads here yet.</div>}
            </aside>

            <div style={{ padding: '0 0 30px', minWidth: 0 }}>
                {active ? (
                    <>
                        <div style={{ padding: '20px 26px', borderBottom: '1px solid #E7E7EA', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EDEDEF' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>{active.counterpart_name}</div>
                                <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 2 }}>{active.counterpart_subtitle}</div>
                            </div>
                        </div>
                        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {messages.map((m) => (
                                <div key={m.id} style={{ maxWidth: 520, alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{ background: m.sender === 'me' ? AMBER : '#F2F2F4', color: m.sender === 'me' ? '#241A00' : '#16181D', padding: '12px 14px', borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}>{m.body}</div>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#9A9CA1', marginTop: 4, letterSpacing: '0.06em', textAlign: m.sender === 'me' ? 'right' : 'left' }}>{timeAgo(m.created_at)}</div>
                                </div>
                            ))}
                        </div>

                        {active.type === 'endorsement' && active.status === 'pending' && (
                            <div style={{ margin: '0 26px', border: '1px solid #F0DFB0', background: '#FFFBEF', borderRadius: 5, padding: '16px 18px' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#9A6A00' }}>Endorsement request — {active.counterpart_subtitle}</div>
                                <div style={{ fontSize: 12.5, color: '#5C5F66', marginTop: 6, lineHeight: 1.6 }}>Confirm you worked together and how, and it goes straight to the recruiter with your name on it.</div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                    <button onClick={() => respond('accepted')} style={{ border: 0, background: AMBER, color: '#241A00', padding: '10px 20px', borderRadius: 3, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Accept & endorse</button>
                                    <button onClick={() => respond('declined')} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '10px 20px', borderRadius: 3, fontSize: 12.5, cursor: 'pointer' }}>Decline</button>
                                </div>
                            </div>
                        )}
                        {active.type === 'endorsement' && active.status === 'accepted' && (
                            <div style={{ margin: '0 26px', padding: '12px 16px', background: '#EAF6EF', border: '1px solid #CDEAD9', borderRadius: 4, fontSize: 12.5, color: '#1E5E3B' }}>Endorsement accepted — sent to the recruiter.</div>
                        )}
                        {active.type === 'endorsement' && active.status === 'declined' && (
                            <div style={{ margin: '0 26px', padding: '12px 16px', background: '#FBEDEB', border: '1px solid #F0CFC8', borderRadius: 4, fontSize: 12.5, color: '#8A3527' }}>You declined this request.</div>
                        )}

                        <div style={{ padding: '16px 26px 0', marginTop: 16, borderTop: '1px solid #F0F0F2' }}>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <input placeholder="Write a reply" value={compose} onChange={(e) => setCompose(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} style={{ flex: 1, border: '1px solid #DDDDE1', borderRadius: 20, padding: '11px 16px', fontSize: 13, outline: 'none' }} />
                                <button onClick={send} style={{ border: 0, background: '#23262C', color: '#FFFFFF', padding: '11px 20px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Send</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: 40, textAlign: 'center', color: '#8C8F96', fontSize: 13 }}>No conversation selected.</div>
                )}
            </div>
        </div>
    );
};

export default Messages;
