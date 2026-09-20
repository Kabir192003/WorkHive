import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AMBER = '#F9AD16';

const Profile = () => {
    const { user, profile, updateProfile, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const showToast = useToast();
    const [editing, setEditing] = useState(false);
    const [header, setHeader] = useState({ name: '', headline: '', location: '', about: '' });
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [experience, setExperience] = useState([]);
    const [stats, setStats] = useState({ endorsements: 0, connections: 0 });
    const [saving, setSaving] = useState(false);

    const load = async () => {
        if (!profile || !user) return;
        setHeader({ name: profile.name || '', headline: profile.headline || '', location: profile.location || '', about: profile.about || '' });
        const [{ data: sk }, { data: exp }, { data: endorsed }, { data: conns }] = await Promise.all([
            supabase.from('profile_skills').select('*').eq('profile_id', user.id).order('position'),
            supabase.from('profile_experience').select('*').eq('profile_id', user.id).order('position'),
            supabase.from('endorsements_received').select('*').eq('profile_id', user.id),
            supabase.from('connections').select('id').eq('profile_id', user.id),
        ]);
        setSkills(sk || []);
        setExperience(exp || []);
        setStats({ endorsements: (endorsed || []).length, connections: (conns || []).length, list: endorsed || [] });
    };

    useEffect(() => { load(); }, [profile, user]);

    const saveAll = async () => {
        setSaving(true);
        await updateProfile(header);
        setSaving(false);
        setEditing(false);
        showToast('Profile saved');
    };

    const addSkill = async () => {
        const label = newSkill.trim();
        if (!label || !user) return;
        const { data } = await supabase.from('profile_skills').insert({ profile_id: user.id, label, position: skills.length }).select().single();
        if (data) setSkills((s) => [...s, data]);
        setNewSkill('');
    };
    const removeSkill = async (id) => {
        await supabase.from('profile_skills').delete().eq('id', id);
        setSkills((s) => s.filter((x) => x.id !== id));
    };

    const updateExpField = (id, field, value) => setExperience((exp) => exp.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    const saveExpRow = async (row) => {
        await supabase.from('profile_experience').update({ role: row.role, org: row.org, when_text: row.when_text, body: row.body }).eq('id', row.id);
    };
    const addExp = async () => {
        if (!user) return;
        const { data } = await supabase.from('profile_experience').insert({ profile_id: user.id, role: 'New role', org: 'Company name', when_text: 'PRESENT', body: 'Describe what you owned in this role.', position: experience.length }).select().single();
        if (data) setExperience((e) => [...e, data]);
    };
    const removeExp = async (id) => {
        await supabase.from('profile_experience').delete().eq('id', id);
        setExperience((e) => e.filter((x) => x.id !== id));
    };

    if (!profile) return <div style={{ padding: 60, textAlign: 'center', color: '#8C8F96' }}>Loading…</div>;

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ position: 'relative', height: 150, background: 'linear-gradient(100deg, #F58A0B 0%, #FDB515 46%, #FFCB3D 100%)' }} />
            <div style={{ padding: '0 28px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
                <aside style={{ marginTop: -62 }}>
                    <div style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 20px 22px' }}>
                        <div style={{ width: 96, height: 96, borderRadius: '50%', background: AMBER, color: '#241A00', fontSize: 32, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{(header.name || '?').charAt(0)}</div>

                        {editing ? (
                            <>
                                <input value={header.name} onChange={(e) => setHeader((h) => ({ ...h, name: e.target.value }))} style={{ display: 'block', width: '100%', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 14, border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', outline: 'none' }} />
                                <input value={header.headline} onChange={(e) => setHeader((h) => ({ ...h, headline: e.target.value }))} style={{ display: 'block', width: '100%', fontSize: 12.5, color: '#4B4E55', marginTop: 8, border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', outline: 'none' }} />
                                <input value={header.location} onChange={(e) => setHeader((h) => ({ ...h, location: e.target.value }))} style={{ display: 'block', width: '100%', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#4B4E55', marginTop: 8, border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', outline: 'none' }} />
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 14 }}>{header.name}</div>
                                <div style={{ fontSize: 13, color: '#5C5F66', marginTop: 4 }}>{header.headline}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#8C8F96', letterSpacing: '0.1em', marginTop: 8 }}>{header.location}</div>
                            </>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 18, borderTop: '1px solid #F0F0F2', paddingTop: 16 }}>
                            <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.endorsement_score}</div><div style={{ fontSize: 11, color: '#6B6E75', marginTop: 2 }}>Endorsement score</div></div>
                            <div><div style={{ fontSize: 20, fontWeight: 800 }}>{stats.endorsements}</div><div style={{ fontSize: 11, color: '#6B6E75', marginTop: 2 }}>Endorsements</div></div>
                            <div><div style={{ fontSize: 20, fontWeight: 800 }}>{stats.connections}</div><div style={{ fontSize: 11, color: '#6B6E75', marginTop: 2 }}>Connections</div></div>
                        </div>

                        {editing ? (
                            <button disabled={saving} onClick={saveAll} style={{ width: '100%', marginTop: 18, border: 0, background: AMBER, color: '#241A00', padding: 11, borderRadius: 3, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save profile'}</button>
                        ) : (
                            <button onClick={() => setEditing(true)} style={{ width: '100%', marginTop: 18, border: '1px solid #D8D9DD', background: '#FFFFFF', padding: 11, borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Edit profile</button>
                        )}
                        <button onClick={() => navigate('/connections')} style={{ width: '100%', marginTop: 8, border: 0, background: AMBER, color: '#241A00', padding: 11, borderRadius: 3, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Request an endorsement</button>
                    </div>

                    <div style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px 20px', marginTop: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                            {skills.map((sk) => (
                                <span key={sk.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.04em', color: '#55585F', background: '#F4F4F5', border: '1px solid #E7E7EA', padding: '5px 9px', borderRadius: 2 }}>
                                    {sk.label}
                                    {editing && <span onClick={() => removeSkill(sk.id)} style={{ cursor: 'pointer', color: '#B4483A', fontWeight: 700 }}>×</span>}
                                </span>
                            ))}
                        </div>
                        {editing && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                <input placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} style={{ flex: 1, minWidth: 0, border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', fontSize: 12, outline: 'none' }} />
                                <button onClick={addSkill} style={{ border: 0, background: '#33363C', color: '#FFFFFF', padding: '7px 12px', borderRadius: 3, fontSize: 12, cursor: 'pointer' }}>Add</button>
                            </div>
                        )}
                    </div>
                </aside>

                <div style={{ gridColumn: 'span 2', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>About</div>
                        {editing ? (
                            <textarea value={header.about} onChange={(e) => setHeader((h) => ({ ...h, about: e.target.value }))} style={{ width: '100%', minHeight: 100, marginTop: 10, border: '1px solid #DDDDE1', borderRadius: 3, padding: '10px 12px', fontSize: 13, lineHeight: 1.7, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
                        ) : (
                            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#5C5F66', marginTop: 10 }}>{header.about}</div>
                        )}
                    </section>

                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 8px' }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>Experience</div>
                        {experience.map((e) => (
                            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0, 1fr)', gap: 14, padding: '16px 0', borderTop: '1px solid #F4F4F5' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ width: 11, height: 12, background: AMBER, clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)', flex: 'none' }} />
                                </div>
                                {editing ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                                            <input value={e.role} onChange={(ev) => updateExpField(e.id, 'role', ev.target.value)} onBlur={() => saveExpRow(e)} placeholder="Role" style={{ border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', fontSize: 13, outline: 'none' }} />
                                            <input value={e.org} onChange={(ev) => updateExpField(e.id, 'org', ev.target.value)} onBlur={() => saveExpRow(e)} placeholder="Company" style={{ border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', fontSize: 13, outline: 'none' }} />
                                        </div>
                                        <input value={e.when_text} onChange={(ev) => updateExpField(e.id, 'when_text', ev.target.value)} onBlur={() => saveExpRow(e)} placeholder="e.g. 2022 — PRESENT · DUBAI" style={{ border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, outline: 'none' }} />
                                        <textarea value={e.body} onChange={(ev) => updateExpField(e.id, 'body', ev.target.value)} onBlur={() => saveExpRow(e)} placeholder="What did you own in this role?" style={{ border: '1px solid #DDDDE1', borderRadius: 3, padding: '7px 9px', fontSize: 12.5, outline: 'none', minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }} />
                                        <a href="#0" onClick={(ev) => { ev.preventDefault(); removeExp(e.id); }} style={{ fontSize: 11.5, color: '#B4483A', alignSelf: 'flex-start' }}>Remove this role</a>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: 14.5, fontWeight: 700 }}>{e.role}</div>
                                        <div style={{ fontSize: 12.5, color: '#5C5F66', marginTop: 2 }}>{e.org}</div>
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#8C8F96', letterSpacing: '0.1em', marginTop: 5 }}>{e.when_text}</div>
                                        <div style={{ fontSize: 12.5, lineHeight: 1.65, color: '#5C5F66', marginTop: 8 }}>{e.body}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {editing && <button onClick={addExp} style={{ width: '100%', margin: '4px 0 16px', border: '1px dashed #D8D9DD', background: '#FFFFFF', padding: 12, borderRadius: 4, fontSize: 12.5, color: '#6B6E75', cursor: 'pointer' }}>+ Add another role</button>}
                    </section>

                    {stats.list?.length > 0 && (
                        <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>Endorsements received</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                                {stats.list.map((e) => (
                                    <div key={e.id} style={{ borderTop: '1px solid #F4F4F5', paddingTop: 14 }}>
                                        <div style={{ fontSize: 13, lineHeight: 1.65, color: '#2C2F35', fontStyle: 'italic' }}>&ldquo;{e.quote}&rdquo;</div>
                                        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{e.by_name}</div>
                                        <div style={{ fontSize: 11.5, color: '#6B6E75' }}>{e.by_role}</div>
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#8C8F96', letterSpacing: '0.08em', marginTop: 4 }}>{e.basis}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
