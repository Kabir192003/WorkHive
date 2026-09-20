import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const AMBER = '#F9AD16';

// Scoped to whichever job/company triggered it. Requesting an endorsement
// creates a real message_threads row (type: endorsement) so it shows up
// under Messages → Endorsement Requests — the request and the conversation
// are the same object, not two disconnected features.
const EndorsementModal = ({ job, onClose }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [connections, setConnections] = useState([]);
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState(`Could you speak to my work on the ${job.title} team? I'm applying to ${job.company}.`);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!user) return;
        supabase.from('connections').select('*').eq('profile_id', user.id).limit(8).then(({ data }) => setConnections(data || []));
    }, [user]);

    const submit = async () => {
        if (!selected || !user) return;
        setBusy(true);
        const { data: thread } = await supabase.from('message_threads').insert({
            profile_id: user.id,
            type: 'endorsement',
            counterpart_name: selected.role + ', ' + selected.org,
            counterpart_subtitle: job.title + ' · ' + job.company,
            job_id: job.id,
            status: 'pending',
            unread: false,
        }).select().single();
        if (thread) {
            await supabase.from('messages').insert({ thread_id: thread.id, sender: 'me', body: note });
        }
        setBusy(false);
        setStep(3);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,22,28,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '92vw', background: '#FFFFFF', borderRadius: 8, padding: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: '#9A6A00' }}>GET ENDORSED</div>
                        <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{job.title} · {job.company}</div>
                    </div>
                    <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 16, cursor: 'pointer', color: '#8C8F96' }}>✕</button>
                </div>

                {step === 1 && (
                    <>
                        <p style={{ fontSize: 12.5, color: '#6B6E75', marginTop: 14 }}>Who worked with you closely enough to speak to this?</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                            {connections.map((c) => (
                                <div key={c.id} onClick={() => setSelected(c)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${selected?.id === c.id ? AMBER : '#E7E7EA'}`, background: selected?.id === c.id ? '#FFF8E6' : '#FFFFFF', borderRadius: 4, cursor: 'pointer' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.role}</div>
                                        <div style={{ fontSize: 11.5, color: '#8C8F96' }}>{c.org}</div>
                                    </div>
                                    {selected?.id === c.id && <span style={{ color: AMBER, fontWeight: 700 }}>✓</span>}
                                </div>
                            ))}
                            {connections.length === 0 && <div style={{ fontSize: 12.5, color: '#8C8F96', padding: '10px 0' }}>No connections yet — visit Connections to build your network.</div>}
                        </div>
                        <button disabled={!selected} onClick={() => setStep(2)} style={{ marginTop: 16, width: '100%', border: 0, background: selected ? AMBER : '#EDEDEF', color: selected ? '#241A00' : '#A7A9AE', fontWeight: 700, fontSize: 13, padding: '12px', borderRadius: 6, cursor: selected ? 'pointer' : 'default' }}>Continue</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p style={{ fontSize: 12.5, color: '#6B6E75', marginTop: 14 }}>Add a note for {selected.role}, {selected.org}:</p>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 4, padding: 10, fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }} />
                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <button onClick={() => setStep(1)} style={{ flex: 1, border: '1px solid #DDDDE1', background: '#FFFFFF', padding: '12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Back</button>
                            <button disabled={busy} onClick={submit} style={{ flex: 2, border: 0, background: AMBER, color: '#241A00', fontWeight: 700, fontSize: 13, padding: '12px', borderRadius: 6, cursor: 'pointer' }}>{busy ? 'Sending…' : 'Send request'}</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div style={{ marginTop: 18, textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: 30 }}>✓</div>
                            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 8 }}>Request sent to {selected.role}</div>
                            <p style={{ fontSize: 12.5, color: '#6B6E75', marginTop: 6 }}>You'll see their response under Messages → Endorsement Requests.</p>
                        </div>
                        <button onClick={onClose} style={{ width: '100%', border: 0, background: '#23262C', color: '#FFFFFF', fontWeight: 700, fontSize: 13, padding: '12px', borderRadius: 6, cursor: 'pointer' }}>Done</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EndorsementModal;
