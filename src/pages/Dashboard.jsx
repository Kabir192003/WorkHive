import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLE = {
    applied: { label: 'Applied direct', color: '#6B6E75', bg: '#F2F2F4' },
    screening: { label: 'Screening', color: '#9A6A00', bg: '#FFF6E2' },
    interview: { label: 'First interview', color: '#2E7D53', bg: '#EAF6EF' },
    offer: { label: 'Offer discussion', color: '#2E7D53', bg: '#EAF6EF' },
};

const firstName = (name) => (name || 'there').split(' ')[0];

const Dashboard = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [activity, setActivity] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const [{ data: apps }, { data: endorsed }, { data: threads }, { data: skills }, { data: exp }] = await Promise.all([
                supabase.from('applications').select('*, jobs(title, companies(name))').eq('profile_id', user.id).order('created_at', { ascending: false }),
                supabase.from('endorsements_received').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(3),
                supabase.from('message_threads').select('*').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(5),
                supabase.from('profile_skills').select('id').eq('profile_id', user.id),
                supabase.from('profile_experience').select('id').eq('profile_id', user.id),
            ]);

            setApplications((apps || []).map((a) => ({
                ...a,
                role: a.jobs?.title,
                company: a.jobs?.companies?.name,
            })));

            const activityItems = [
                ...(endorsed || []).map((e) => ({ who: e.by_name, act: 'endorsed you', detail: e.by_role, when: e.created_at, state: 'Complete', color: '#2E7D53', bg: '#EAF6EF' })),
                ...(threads || []).map((t) => ({
                    who: t.counterpart_name,
                    act: t.type === 'endorsement' ? (t.status === 'accepted' ? 'accepted your request' : t.status === 'declined' ? 'declined your request' : 'was asked to endorse') : 'sent a message',
                    detail: t.counterpart_subtitle,
                    when: t.created_at,
                    state: t.status === 'accepted' ? 'Complete' : t.status === 'declined' ? 'Closed' : 'Waiting',
                    color: t.status === 'accepted' ? '#2E7D53' : t.status === 'declined' ? '#B4483A' : '#9A6A00',
                    bg: t.status === 'accepted' ? '#EAF6EF' : t.status === 'declined' ? '#FBEDEB' : '#FFF6E2',
                })),
            ].sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 6);
            setActivity(activityItems);

            const taskList = [];
            const pendingThread = (threads || []).find((t) => t.type === 'endorsement' && t.status === 'pending');
            if (pendingThread) taskList.push({ text: `Nudge ${pendingThread.counterpart_name.split(',')[0]} — endorsement still pending`, meta: 'OUTSTANDING REQUEST' });
            if ((skills || []).length < 3) taskList.push({ text: 'Add a few more skills to your profile', meta: 'RAISES PROFILE MATCH' });
            if ((exp || []).length === 0) taskList.push({ text: 'Add your work experience', meta: 'REQUIRED FOR STRONG MATCHES' });
            if (taskList.length === 0) taskList.push({ text: 'Browse open roles and apply direct', meta: 'KEEP THE MOMENTUM GOING' });
            setTasks(taskList.slice(0, 3));

            setLoading(false);
        })();
    }, [user]);

    const score = profile?.endorsement_score ?? 500;
    const scorePct = Math.min(100, Math.round((score / 1000) * 100));
    const pendingCount = activity.filter((a) => a.state === 'Waiting').length;

    return (
        <div style={{ padding: '26px 28px 40px', background: '#FAFAFB', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.14em', color: '#8C8F96' }}>CANDIDATE WORKSPACE</div>
                    <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>Good to see you, {firstName(profile?.name)}</div>
                    <div style={{ fontSize: 13, color: '#5C5F66', marginTop: 6 }}>
                        {pendingCount > 0 ? `${pendingCount} endorsement request${pendingCount === 1 ? ' is' : 's are'} still waiting on a response.` : 'No outstanding endorsement requests right now.'}
                    </div>
                </div>
                <button onClick={() => navigate('/search')} style={{ border: 0, background: '#F9AD16', color: '#241A00', padding: '12px 22px', borderRadius: 3, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Search jobs</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Your Endorsement Score</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 12 }}>
                        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{score}</div>
                    </div>
                    <div style={{ height: 10, background: '#F1F1F3', borderRadius: 999, marginTop: 16, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${scorePct}%`, background: 'linear-gradient(90deg, #FFD782, #F9AD16)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#8C8F96', marginTop: 8, letterSpacing: '0.08em' }}>
                        <span>0</span><span>NEXT TIER AT 800</span><span>1000</span>
                    </div>
                    <div style={{ borderTop: '1px solid #F0F0F2', marginTop: 18, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {tasks.map((t) => (
                            <div key={t.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <span style={{ width: 9, height: 10, flex: 'none', marginTop: 4, background: '#F9AD16', clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }} />
                                <div>
                                    <div style={{ fontSize: 12.5, color: '#2C2F35', lineHeight: 1.5 }}>{t.text}</div>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8C8F96', letterSpacing: '0.1em', marginTop: 3 }}>{t.meta}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 10px', gridColumn: 'span 2', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>Endorsement activity</div>
                    </div>
                    {activity.length === 0 && !loading && <div style={{ padding: '20px 0', fontSize: 12.5, color: '#8C8F96' }}>No activity yet — apply to a role or request an endorsement to get started.</div>}
                    {activity.map((a, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderTop: '1px solid #F4F4F5' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDEDEF', flex: 'none' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13 }}><span style={{ fontWeight: 600 }}>{a.who}</span> {a.act}</div>
                                <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 2 }}>{a.detail}</div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: a.color, background: a.bg, padding: '4px 10px', borderRadius: 999, flex: 'none' }}>{a.state}</span>
                        </div>
                    ))}
                </section>
            </div>

            <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Applications in flight</div>
                <div style={{ marginTop: 14, border: '1px solid #EDEDEF', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) 120px 130px', background: '#F6F6F7', borderBottom: '1px solid #E7E7EA' }}>
                        <div style={{ padding: '11px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#6B6E75' }}>ROLE</div>
                        <div style={{ padding: '11px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#6B6E75' }}>STAGE</div>
                        <div style={{ padding: '11px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#6B6E75' }}>ROUTE</div>
                        <div style={{ padding: '11px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: '#6B6E75', textAlign: 'right' }}>PROGRESS</div>
                    </div>
                    {applications.map((ap) => {
                        const s = STATUS_STYLE[ap.status] || STATUS_STYLE.applied;
                        return (
                            <div key={ap.id} onClick={() => navigate(`/job/${ap.job_id}`)} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) 120px 130px', borderBottom: '1px solid #F4F4F5', alignItems: 'center', cursor: 'pointer' }}>
                                <div style={{ padding: '12px 14px' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ap.role}</div>
                                    <div style={{ fontSize: 11.5, color: '#6B6E75', marginTop: 2 }}>{ap.company}</div>
                                </div>
                                <div style={{ padding: '12px 14px', fontSize: 12.5, color: '#2C2F35' }}>{s.label}</div>
                                <div style={{ padding: '12px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#6B6E75', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{ap.route}</div>
                                <div style={{ padding: '12px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: s.color }}>{ap.progress_pct}%</div>
                            </div>
                        );
                    })}
                    {applications.length === 0 && !loading && (
                        <div style={{ padding: '30px 14px', textAlign: 'center', fontSize: 12.5, color: '#8C8F96' }}>No applications yet — <a href="#0" onClick={(e) => { e.preventDefault(); navigate('/search'); }}>search open roles</a> to get started.</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
