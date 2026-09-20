import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import EndorsementModal from '../components/EndorsementModal';

const AMBER = '#F9AD16';

const JobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [sameCompanyJobs, setSameCompanyJobs] = useState([]);
    const [endorsers, setEndorsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            const { data: j } = await supabase.from('jobs').select('*, companies(*)').eq('id', jobId).single();
            if (!j) return;
            setJob({ ...j, company: j.companies?.name });

            const { data: others } = await supabase.from('jobs').select('id, title, location').eq('company_id', j.company_id).neq('id', jobId).limit(3);
            setSameCompanyJobs(others || []);

            if (user) {
                const { data: conns } = await supabase.from('connections').select('*').eq('profile_id', user.id).eq('org', j.companies?.name).limit(3);
                if (conns && conns.length) setEndorsers(conns);
                else {
                    const { data: pool } = await supabase.from('connections_pool').select('*').eq('org', j.companies?.name).limit(3);
                    setEndorsers(pool || []);
                }
            }
        })();
    }, [jobId, user]);

    if (!job) return <div style={{ padding: 60, textAlign: 'center', color: '#8C8F96' }}>Loading…</div>;

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ position: 'relative', height: 210, background: '#2A2C31', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=60" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,22,28,0.82) 0%, rgba(20,22,28,0.5) 50%, rgba(20,22,28,0.12) 100%)' }} />
                <div style={{ position: 'absolute', left: 28, bottom: 24 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: '#FFC94D' }}>{job.posted_label}</div>
                    <div style={{ fontSize: 30, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 6 }}>{job.title}</div>
                    <div onClick={() => navigate(`/company/${job.company_id}`)} style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, cursor: 'pointer' }}>{job.company} · {job.location}</div>
                </div>
            </div>

            <div style={{ padding: '26px 28px 40px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {(job.skills || []).map((sk) => <span key={sk} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.04em', color: '#55585F', background: '#F4F4F5', border: '1px solid #E7E7EA', padding: '5px 9px', borderRadius: 2 }}>{sk}</span>)}
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.75, color: '#4B4E55', marginTop: 16 }}>{job.blurb}</div>
                        <div style={{ borderTop: '1px solid #F0F0F2', marginTop: 18, paddingTop: 16 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>What you'll do</div>
                            <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {(job.responsibilities || []).map((r) => <li key={r} style={{ fontSize: 12.5, lineHeight: 1.6, color: '#4B4E55' }}>{r}</li>)}
                            </ul>
                        </div>
                        <div style={{ borderTop: '1px solid #F0F0F2', marginTop: 18, paddingTop: 16 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>What you'll bring</div>
                            <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {(job.requirements || []).map((r) => <li key={r} style={{ fontSize: 12.5, lineHeight: 1.6, color: '#4B4E55' }}>{r}</li>)}
                            </ul>
                        </div>
                    </section>

                    {endorsers.length > 0 && (
                        <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '20px 22px 22px' }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>People who can speak to this team's work</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 14 }}>
                                {endorsers.map((p) => (
                                    <div key={p.id} style={{ border: '1px solid #EDEDEF', borderRadius: 4, padding: '14px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EDEDEF' }} />
                                        <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>{p.role}</div>
                                        <div style={{ fontSize: 11, color: '#6B6E75' }}>{p.org}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px' }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#2E7D53', letterSpacing: '0.04em' }}>{job.match_label}</div>
                        <div style={{ fontSize: 12, color: '#8C8F96', marginTop: 4 }}>{job.endorsers_label}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                            <button onClick={() => setShowModal(true)} style={{ border: 0, background: AMBER, color: '#241A00', padding: 12, borderRadius: 3, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Get Endorsed</button>
                            <button onClick={() => navigate(`/apply/${job.id}`)} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: 12, borderRadius: 3, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Apply Direct</button>
                            <button onClick={() => navigate('/connections')} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: 12, borderRadius: 3, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Refer Someone</button>
                        </div>
                    </section>
                    <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>About {job.company}</div>
                        <div style={{ fontSize: 12, lineHeight: 1.6, color: '#5C5F66', marginTop: 10 }}>{job.companies?.about}</div>
                        <a href="#0" onClick={(e) => { e.preventDefault(); navigate(`/company/${job.company_id}`); }} style={{ display: 'inline-block', marginTop: 10, fontSize: 12 }}>View company profile →</a>
                    </section>
                    {sameCompanyJobs.length > 0 && (
                        <section style={{ border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF', padding: '18px 20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>More roles at {job.company}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                                {sameCompanyJobs.map((oj) => (
                                    <div key={oj.id} onClick={() => navigate(`/job/${oj.id}`)} style={{ cursor: 'pointer', padding: '10px 0', borderTop: '1px solid #F4F4F5' }}>
                                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{oj.title}</div>
                                        <div style={{ fontSize: 11, color: '#8C8F96', marginTop: 2 }}>{oj.location}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>
            </div>

            {showModal && <EndorsementModal job={job} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default JobDetail;
