import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AMBER = '#F9AD16';

const emptyForm = { role: '', org: '', location: '', industry: '', degree: 1 };

const AddConnectionModal = ({ onClose, onAdded }) => {
    const { user } = useAuth();
    const showToast = useToast();
    const [tab, setTab] = useState('suggested'); // suggested | manual
    const [pool, setPool] = useState([]);
    const [existingOrgRoles, setExistingOrgRoles] = useState(new Set());
    const [form, setForm] = useState(emptyForm);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const [{ data: poolRows }, { data: mine }] = await Promise.all([
                supabase.from('connections_pool').select('*').order('role'),
                supabase.from('connections').select('role, org').eq('profile_id', user.id),
            ]);
            setPool(poolRows || []);
            setExistingOrgRoles(new Set((mine || []).map((c) => c.role + '|' + c.org)));
        })();
    }, [user]);

    const addFromPool = async (p) => {
        setBusy(true);
        await supabase.from('connections').insert({ profile_id: user.id, role: p.role, org: p.org, location: p.location, industry: p.industry, degree: p.degree });
        setExistingOrgRoles((s) => new Set(s).add(p.role + '|' + p.org));
        setBusy(false);
        showToast(`Added ${p.role}, ${p.org}`);
        onAdded();
    };

    const addManual = async () => {
        if (!form.role.trim() || !form.org.trim()) return;
        setBusy(true);
        await supabase.from('connections').insert({ profile_id: user.id, ...form });
        setBusy(false);
        showToast(`Added ${form.role}, ${form.org}`);
        setForm(emptyForm);
        onAdded();
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,22,28,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: 480, maxWidth: '92vw', maxHeight: '82vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRadius: 8, boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px 0' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Add a connection</div>
                    <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: 16, cursor: 'pointer', color: '#8C8F96' }}>✕</button>
                </div>
                <div style={{ display: 'flex', gap: 2, padding: '14px 22px 0', borderBottom: '1px solid #E7E7EA' }}>
                    {[['suggested', 'Suggested people'], ['manual', 'Add manually']].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{ border: 0, background: tab === key ? '#FFF3D6' : 'transparent', color: tab === key ? '#8A5200' : '#6B6E75', fontSize: 12.5, fontWeight: tab === key ? 700 : 500, padding: '10px 16px', cursor: 'pointer', borderRadius: '3px 3px 0 0' }}>{label}</button>
                    ))}
                </div>

                {tab === 'suggested' ? (
                    <div style={{ padding: '14px 22px 22px', overflowY: 'auto' }}>
                        <p style={{ fontSize: 12, color: '#8C8F96', marginTop: 0 }}>People on Work Hive you may know.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {pool.map((p) => {
                                const added = existingOrgRoles.has(p.role + '|' + p.org);
                                return (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #EDEDEF', borderRadius: 4, padding: '10px 12px' }}>
                                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EDEDEF', flex: 'none' }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.role}</div>
                                            <div style={{ fontSize: 11.5, color: '#6B6E75' }}>{p.org} · {p.location}</div>
                                        </div>
                                        <button disabled={added || busy} onClick={() => addFromPool(p)} style={{ border: '1px solid #D8D9DD', background: added ? '#F6F6F7' : '#FFFFFF', padding: '7px 12px', borderRadius: 3, fontSize: 12, cursor: added ? 'default' : 'pointer', color: added ? '#8C8F96' : '#16181D', flex: 'none' }}>{added ? 'Added' : 'Add'}</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '18px 22px 22px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Role / title *</span><input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '10px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Company *</span><input value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '10px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Location</span><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '10px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Industry</span><input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '10px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>How do you know them?</span>
                                <select value={form.degree} onChange={(e) => setForm((f) => ({ ...f, degree: Number(e.target.value) }))} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '10px 12px', fontSize: 13, outline: 'none' }}>
                                    <option value={1}>Worked together directly</option>
                                    <option value={2}>Know through someone else</option>
                                </select>
                            </label>
                            <button disabled={busy || !form.role.trim() || !form.org.trim()} onClick={addManual} style={{ border: 0, background: AMBER, color: '#241A00', fontWeight: 700, fontSize: 13, padding: 12, borderRadius: 6, cursor: 'pointer', marginTop: 6 }}>{busy ? 'Adding…' : 'Add connection'}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Simplified from the original mock's decorative radial network-graph into a
// searchable, real list — the graph looked good but couldn't actually be
// clicked through to anything; this can.
const Connections = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);
    const [query, setQuery] = useState({ role: '', location: '', industry: '' });
    const [showAdd, setShowAdd] = useState(false);

    const loadConnections = () => {
        if (!user) return;
        supabase.from('connections').select('*').eq('profile_id', user.id).order('degree').then(({ data }) => setConnections(data || []));
    };

    useEffect(loadConnections, [user]);

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

            <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{filtered.length} connection{filtered.length === 1 ? '' : 's'}</div>
                <button onClick={() => setShowAdd(true)} style={{ border: 0, background: AMBER, color: '#241A00', padding: '9px 16px', borderRadius: 3, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>+ Add connection</button>
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
                {filtered.length === 0 && connections.length > 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#8C8F96' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#4B4E55' }}>No connections match</div>
                        <div style={{ fontSize: 12.5, marginTop: 6 }}>Try clearing a filter.</div>
                    </div>
                )}
                {connections.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', border: '1px dashed #D8D9DD', borderRadius: 5 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#4B4E55' }}>No connections yet</div>
                        <div style={{ fontSize: 12.5, color: '#8C8F96', marginTop: 6, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>Add people you've worked with so they can endorse you and you can refer them to roles.</div>
                        <button onClick={() => setShowAdd(true)} style={{ marginTop: 14, border: 0, background: AMBER, color: '#241A00', padding: '10px 18px', borderRadius: 3, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>+ Add your first connection</button>
                    </div>
                )}
            </div>

            {showAdd && <AddConnectionModal onClose={() => setShowAdd(false)} onAdded={loadConnections} />}
        </div>
    );
};

export default Connections;
