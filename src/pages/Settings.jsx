import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AMBER = '#F9AD16';

const TABS = ['Account', 'Privacy', 'Notifications'];

const Toggle = ({ on, onClick }) => (
    <span onClick={onClick} style={{ width: 38, height: 20, borderRadius: 999, background: on ? AMBER : '#D5D5D9', position: 'relative', cursor: 'pointer', flex: 'none' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 160ms' }} />
    </span>
);

const Settings = () => {
    const { user, profile, updateProfile } = useAuth();
    const showToast = useToast();
    const [tab, setTab] = useState('Account');
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (profile) setName(profile.name || ''); }, [profile]);

    const saveAccount = async () => {
        setSaving(true);
        await updateProfile({ name });
        setSaving(false);
        showToast('Account details saved');
    };

    const setFlag = async (field, value) => {
        await updateProfile({ [field]: value });
        showToast('Preference updated');
    };

    if (!profile) return <div style={{ padding: 60, textAlign: 'center', color: '#8C8F96' }}>Loading…</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', alignItems: 'start', background: '#FAFAFB', minHeight: 640 }}>
            <aside style={{ borderRight: '1px solid #E7E7EA', padding: '20px 0' }}>
                {TABS.map((t) => (
                    <button key={t} onClick={() => setTab(t)} style={{ width: '100%', border: 0, textAlign: 'left', background: t === tab ? '#FFF3D6' : 'transparent', color: t === tab ? '#8A5200' : '#4B4E55', fontSize: 13, fontWeight: t === tab ? 700 : 500, padding: '12px 22px', cursor: 'pointer' }}>{t}</button>
                ))}
            </aside>
            <div style={{ padding: '24px 28px 40px', maxWidth: 640 }}>
                {tab === 'Account' && (
                    <>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Account</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Full name</span><input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Email</span><input value={user?.email || ''} disabled style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none', background: '#F6F6F7', color: '#8C8F96' }} /></label>
                            <button disabled={saving} onClick={saveAccount} style={{ alignSelf: 'flex-start', border: 0, background: '#33363C', color: '#FFFFFF', padding: '11px 22px', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save changes'}</button>
                        </div>
                    </>
                )}
                {tab === 'Privacy' && (
                    <>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Privacy</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
                            {[
                                { field: 'profile_public', label: 'Public profile', body: 'Anyone with the link can view your profile page.' },
                                { field: 'searchable', label: 'Searchable by recruiters', body: 'Show up when recruiters search Work Hive by skill or role.' },
                                { field: 'show_salary', label: 'Show salary expectations', body: 'Let matched recruiters see your stated salary range.' },
                            ].map((row) => (
                                <div key={row.field} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #EDEDEF', borderRadius: 4, padding: '14px 16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{row.label}</div>
                                        <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 3 }}>{row.body}</div>
                                    </div>
                                    <Toggle on={!!profile[row.field]} onClick={() => setFlag(row.field, !profile[row.field])} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {tab === 'Notifications' && (
                    <>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>Notifications</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
                            {[
                                { field: 'notif_email', label: 'Email digest', body: 'A weekly summary of activity on your profile.' },
                                { field: 'notif_endorsement', label: 'Endorsement requests', body: 'Notify me when someone asks me to endorse them, or responds to my request.' },
                                { field: 'notif_jobs', label: 'New matching roles', body: 'Notify me when a new role matches your saved search.' },
                            ].map((row) => (
                                <div key={row.field} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #EDEDEF', borderRadius: 4, padding: '14px 16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{row.label}</div>
                                        <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 3 }}>{row.body}</div>
                                    </div>
                                    <Toggle on={!!profile[row.field]} onClick={() => setFlag(row.field, !profile[row.field])} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Settings;
