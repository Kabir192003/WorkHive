import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AMBER = '#F9AD16';

const Onboarding = () => {
    const { user, profile, updateProfile } = useAuth();
    const navigate = useNavigate();
    const showToast = useToast();
    const [step, setStep] = useState(1);
    const [basics, setBasics] = useState({ name: '', headline: '', location: '' });
    const [experience, setExperience] = useState([]);
    const [suggested, setSuggested] = useState([]);
    const [asked, setAsked] = useState(new Set());

    useEffect(() => {
        if (profile) setBasics({ name: profile.name || '', headline: profile.headline || '', location: profile.location || '' });
    }, [profile]);

    useEffect(() => {
        if (!user) return;
        supabase.from('profile_experience').select('*').eq('profile_id', user.id).order('position').then(({ data }) => setExperience(data || []));
        supabase.from('connections').select('*').eq('profile_id', user.id).limit(3).then(({ data }) => setSuggested(data || []));
    }, [user]);

    const next = async () => {
        if (step === 1) {
            await updateProfile({ name: basics.name, headline: basics.headline, location: basics.location, onboard_step: 2 });
        } else if (step === 2) {
            await updateProfile({ onboard_step: 3 });
        } else {
            await updateProfile({ onboard_step: 3, onboard_complete: true });
            showToast('Profile set up — you\'re ready to search');
            navigate('/dashboard');
            return;
        }
        setStep((s) => s + 1);
    };
    const back = () => setStep((s) => Math.max(1, s - 1));

    const addRole = async () => {
        if (!user) return;
        const { data } = await supabase.from('profile_experience').insert({ profile_id: user.id, role: 'New role', org: 'Add company', when_text: 'Present', body: '', position: experience.length }).select().single();
        if (data) setExperience((e) => [...e, data]);
    };

    const askToEndorse = async (person) => {
        if (!user) return;
        await supabase.from('message_threads').insert({
            profile_id: user.id, type: 'endorsement', counterpart_name: `${person.role}, ${person.org}`,
            counterpart_subtitle: 'Introductory endorsement', status: 'pending', unread: false,
        });
        setAsked((a) => new Set(a).add(person.id));
        showToast(`Endorsement request sent to ${person.role}`);
    };

    return (
        <div style={{ minHeight: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#FAFAFB' }}>
            <div style={{ width: '100%', maxWidth: 640 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                    {[1, 2, 3].map((n) => <div key={n} style={{ flex: 1, height: 3, background: n <= step ? AMBER : '#EDEDEF' }} />)}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: '#8C8F96' }}>STEP {step} OF 3</div>

                {step === 1 && (
                    <>
                        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 10 }}>Tell us who you are</div>
                        <div style={{ fontSize: 13, color: '#5C5F66', marginTop: 8, lineHeight: 1.6 }}>This becomes the profile your network endorses.</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Full name</span><input value={basics.name} onChange={(e) => setBasics((b) => ({ ...b, name: e.target.value }))} style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Current title</span><input value={basics.headline} onChange={(e) => setBasics((b) => ({ ...b, headline: e.target.value }))} placeholder="Senior Product Designer" style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label style={{ gridColumn: '1 / -1' }}><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Location</span><input value={basics.location} onChange={(e) => setBasics((b) => ({ ...b, location: e.target.value }))} placeholder="Dubai, UAE" style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 10 }}>Bring in your working history</div>
                        <div style={{ fontSize: 13, color: '#5C5F66', marginTop: 8, lineHeight: 1.6 }}>This is what your endorsers will be confirming.</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                            {experience.map((e) => (
                                <div key={e.id} style={{ border: '1px solid #E7E7EA', borderRadius: 4, padding: '14px 16px' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.role}</div>
                                    <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 2 }}>{e.org} · {e.when_text}</div>
                                </div>
                            ))}
                            <button onClick={addRole} style={{ border: '1px dashed #D8D9DD', background: '#FFFFFF', padding: 12, borderRadius: 4, fontSize: 12.5, color: '#6B6E75', cursor: 'pointer' }}>+ Add another role</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 10 }}>Ask your first endorsement</div>
                        <div style={{ fontSize: 13, color: '#5C5F66', marginTop: 8, lineHeight: 1.6 }}>Pick someone from your network to start.</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                            {suggested.map((p) => (
                                <div key={p.id} style={{ border: '1px solid #E7E7EA', borderRadius: 4, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDEDEF' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.role}</div>
                                        <div style={{ fontSize: 11.5, color: '#6B6E75' }}>{p.org}</div>
                                    </div>
                                    <button onClick={() => askToEndorse(p)} disabled={asked.has(p.id)} style={{ border: '1px solid #D8D9DD', background: asked.has(p.id) ? '#F6F6F7' : '#FFFFFF', padding: '8px 14px', borderRadius: 3, fontSize: 12, cursor: asked.has(p.id) ? 'default' : 'pointer', color: asked.has(p.id) ? '#8C8F96' : '#16181D' }}>{asked.has(p.id) ? 'Requested' : 'Ask to endorse'}</button>
                                </div>
                            ))}
                            {suggested.length === 0 && <div style={{ fontSize: 12.5, color: '#8C8F96' }}>Build your Connections list to see suggestions here.</div>}
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                    <button onClick={back} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '11px 22px', borderRadius: 3, fontSize: 13, cursor: 'pointer', visibility: step === 1 ? 'hidden' : 'visible' }}>Back</button>
                    <button onClick={next} style={{ border: 0, background: AMBER, color: '#241A00', padding: '11px 26px', borderRadius: 3, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{step === 3 ? 'Finish' : 'Continue'}</button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
