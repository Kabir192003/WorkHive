import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const AMBER = '#F9AD16';

const Apply = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [job, setJob] = useState(null);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: '', email: '', phone: '', portfolio: '', cover: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [wantEndorsement, setWantEndorsement] = useState(true);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        supabase.from('jobs').select('*, companies(name)').eq('id', jobId).single().then(({ data }) => {
            if (data) setJob({ ...data, company: data.companies?.name });
        });
    }, [jobId]);

    useEffect(() => {
        if (profile && user) setForm((f) => ({ ...f, name: profile.name || '', email: user.email || '' }));
    }, [profile, user]);

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const submit = async () => {
        const errs = {};
        if (!form.name.trim()) errs.name = true;
        if (!form.email.trim()) errs.email = true;
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setBusy(true);
        let resumeUrl = null;
        let resumeName = resumeFile?.name || null;
        if (resumeFile && user) {
            const path = `${user.id}/${Date.now()}-${resumeFile.name}`;
            const { error: upErr } = await supabase.storage.from('resumes').upload(path, resumeFile);
            if (!upErr) {
                const { data: signed } = await supabase.storage.from('resumes').createSignedUrl(path, 60 * 60 * 24 * 365);
                resumeUrl = signed?.signedUrl || null;
            }
        }

        await supabase.from('applications').insert({
            profile_id: user.id,
            job_id: job.id,
            status: 'applied',
            route: wantEndorsement ? 'endorsed' : 'direct',
            progress_pct: 10,
            cover_note: form.cover,
            phone: form.phone,
            portfolio_url: form.portfolio,
            resume_url: resumeUrl,
            resume_name: resumeName,
            wants_endorsement: wantEndorsement,
        });

        if (wantEndorsement) {
            const { data: conns } = await supabase.from('connections').select('*').eq('profile_id', user.id).eq('org', job.company).limit(1);
            const endorser = conns?.[0];
            if (endorser) {
                const { data: thread } = await supabase.from('message_threads').insert({
                    profile_id: user.id,
                    type: 'endorsement',
                    counterpart_name: `${endorser.role}, ${endorser.org}`,
                    counterpart_subtitle: `${job.title} · ${job.company}`,
                    job_id: job.id,
                    status: 'pending',
                    unread: false,
                }).select().single();
                if (thread) {
                    await supabase.from('messages').insert({ thread_id: thread.id, sender: 'me', body: `Applied to ${job.title} at ${job.company} — could you back this one up with an endorsement?` });
                }
            }
        }

        setBusy(false);
        setStep(2);
    };

    if (!job) return <div style={{ padding: 60, textAlign: 'center', color: '#8C8F96' }}>Loading…</div>;

    return (
        <div style={{ background: '#FAFAFB', minHeight: 640 }}>
            <div style={{ padding: '30px 28px 10px', maxWidth: 720, margin: '0 auto' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: '#8C8F96' }}>APPLY DIRECT</div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: '#5C5F66', marginTop: 4 }}>{job.company} · {job.location}</div>
            </div>

            {step === 1 && (
                <div style={{ padding: '20px 28px 50px', maxWidth: 720, margin: '0 auto' }}>
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: 22 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>Your details</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Full name *</span><input value={form.name} onChange={set('name')} style={{ width: '100%', border: `1px solid ${errors.name ? '#B4483A' : '#DDDDE1'}`, borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Email *</span><input value={form.email} onChange={set('email')} style={{ width: '100%', border: `1px solid ${errors.email ? '#B4483A' : '#DDDDE1'}`, borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Phone</span><input value={form.phone} onChange={set('phone')} placeholder="+971 5X XXX XXXX" style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                            <label><span style={{ display: 'block', fontSize: 11.5, color: '#6B6E75', marginBottom: 6 }}>Portfolio / LinkedIn URL</span><input value={form.portfolio} onChange={set('portfolio')} placeholder="https://" style={{ width: '100%', border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none' }} /></label>
                        </div>

                        <div style={{ borderTop: '1px solid #F0F0F2', marginTop: 18, paddingTop: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Resume</div>
                            <label style={{ display: 'block', border: '1px dashed #D8D9DD', borderRadius: 4, padding: 20, textAlign: 'center', color: '#6B6E75', fontSize: 12.5, cursor: 'pointer', position: 'relative' }}>
                                {resumeFile ? resumeFile.name : 'Click to upload your resume (PDF, DOC)'}
                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                            </label>
                        </div>

                        <div style={{ borderTop: '1px solid #F0F0F2', marginTop: 18, paddingTop: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Cover note</div>
                            <textarea value={form.cover} onChange={set('cover')} placeholder="Why this role, in a few sentences" style={{ width: '100%', minHeight: 90, border: '1px solid #DDDDE1', borderRadius: 3, padding: '11px 12px', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                        </div>

                        <div onClick={() => setWantEndorsement((v) => !v)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 18, cursor: 'pointer' }}>
                            <span style={{ marginTop: 2, width: 34, height: 18, borderRadius: 999, background: wantEndorsement ? AMBER : '#D5D5D9', position: 'relative', flex: 'none', transition: 'background 160ms' }}>
                                <span style={{ position: 'absolute', top: 2, left: wantEndorsement ? 18 : 2, width: 14, height: 14, borderRadius: '50%', background: '#FFFFFF', transition: 'left 160ms' }} />
                            </span>
                            <span style={{ fontSize: 12.5, color: '#4B4E55', lineHeight: 1.5 }}>Also request an endorsement from my network for this role — recommended, endorsed applications reach a first interview far more often.</span>
                        </div>

                        <button disabled={busy} onClick={submit} style={{ width: '100%', marginTop: 22, border: 0, background: AMBER, color: '#241A00', padding: 13, borderRadius: 3, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>{busy ? 'Submitting…' : 'Submit application'}</button>
                    </section>
                </div>
            )}

            {step === 2 && (
                <div style={{ padding: '20px 28px 60px', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>Application sent</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: '#5C5F66', marginTop: 10 }}>{job.company} will review your application for {job.title}. You can track its status from your dashboard.</div>
                    {wantEndorsement && (
                        <div style={{ marginTop: 14, padding: '12px 16px', background: '#EAF6EF', border: '1px solid #CDEAD9', borderRadius: 4, fontSize: 12.5, color: '#1E5E3B', textAlign: 'left' }}>An endorsement request for this role was also sent to your network — you'll see responses in Messages.</div>
                    )}
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                        <button onClick={() => navigate('/dashboard')} style={{ border: 0, background: AMBER, color: '#241A00', padding: '12px 24px', borderRadius: 3, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Go to dashboard</button>
                        <button onClick={() => navigate('/search')} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '12px 24px', borderRadius: 3, fontSize: 13, cursor: 'pointer' }}>Keep browsing roles</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Apply;
