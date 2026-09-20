import React from 'react';
import { useNavigate } from 'react-router-dom';

const STATS = [
    { value: '128k', label: 'Verified professionals in the Gulf and South Asia' },
    { value: '4,200', label: 'Companies with employee-submitted ratings' },
    { value: '61%', label: 'Of endorsed applications reach a first interview' },
    { value: '2.3 days', label: 'Median time for an endorsement to come back' },
];
const STEPS = [
    { n: '01', title: 'Ask someone who knows the work', body: 'Pick a role, and Work Hive shows who in your network has worked with that team. You ask them, not a stranger.' },
    { n: '02', title: 'They answer three questions', body: 'An endorsement is short and specific: what you worked on together, over what period, and what they would trust you with next.' },
    { n: '03', title: 'The recruiter sees the source', body: 'Every claim on your profile is attributed to a named person and a shared project, so it can be weighed rather than assumed.' },
];
const HUBS = [
    { city: 'Dubai', meta: '3,140 OPEN ROLES', note: 'Retail, telecom and logistics hiring hardest.', photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=60' },
    { city: 'Riyadh', meta: '2,480 OPEN ROLES', note: 'Giga-project programme and delivery roles.', photo: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=60' },
    { city: 'Bengaluru', meta: '5,910 OPEN ROLES', note: 'Platform engineering and design systems.', photo: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=60' },
    { city: 'Singapore', meta: '1,760 OPEN ROLES', note: 'Regional commercial and finance leadership.', photo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=60' },
];
const TOOLS = [
    { title: 'Company Ratings', body: 'Scores from verified current and former employees, with tenure attached.', to: '/ratings' },
    { title: 'Salaries', body: 'Self-reported total cash by seniority, refreshed every quarter.', to: '/salaries' },
    { title: 'Cost of Living', body: 'What a move actually costs, category by category.', to: '/cost' },
    { title: 'Relocation', body: 'One-off costs and a checklist for the first ninety days.', to: '/relocation' },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div style={{ position: 'relative', minHeight: 460, background: '#23262C', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=60" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(75deg, rgba(20,22,28,0.90) 0%, rgba(20,22,28,0.62) 46%, rgba(20,22,28,0.10) 100%)' }} />
                <div style={{ position: 'relative', padding: '56px 28px 30px', width: '100%' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>HIRING ON EVIDENCE, NOT ASSERTION</div>
                    <div style={{ fontSize: 46, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 14, maxWidth: 720 }}>Someone you have worked with can say more in three questions than a CV says in two pages.</div>
                    <div style={{ fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.82)', marginTop: 16, maxWidth: 560 }}>Work Hive turns your working history into endorsements: short, attributed statements from named colleagues, attached to the roles you apply for.</div>
                    <div onClick={() => navigate('/search')} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 148px', background: '#FFFDF6', borderRadius: 4, overflow: 'hidden', marginTop: 28, maxWidth: 940, boxShadow: '0 12px 32px rgba(0,0,0,0.28)', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 16px', borderRight: '1px solid #EFE7D4' }}><span style={{ color: '#B98A2E', fontSize: 12 }}>⌕</span><span style={{ fontSize: 13.5, color: '#9A9CA1' }}>Job Title or Keyword</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 16px', borderRight: '1px solid #EFE7D4' }}><span style={{ color: '#B98A2E', fontSize: 12 }}>⌕</span><span style={{ fontSize: 13.5, color: '#9A9CA1' }}>State or Country</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '15px 16px', borderRight: '1px solid #EFE7D4' }}><span style={{ color: '#B98A2E', fontSize: 12 }}>⌕</span><span style={{ fontSize: 13.5, color: '#9A9CA1' }}>Industry</span></div>
                        <div style={{ border: 0, background: '#F9AD16', color: '#241A00', fontSize: 13.5, fontWeight: 700, display: 'grid', placeItems: 'center' }}>Search Jobs</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', borderBottom: '1px solid #E7E7EA', background: '#FAFAFB' }}>
                {STATS.map((s) => (
                    <div key={s.label} style={{ padding: '22px 24px', borderRight: '1px solid #EFEFF1' }}>
                        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>{s.value}</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5, color: '#5C5F66', marginTop: 6 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ padding: '40px 28px 10px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#8C8F96' }}>HOW AN ENDORSEMENT WORKS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22, marginTop: 18 }}>
                    {STEPS.map((h) => (
                        <div key={h.n} style={{ borderTop: '2px solid #23262C', paddingTop: 14 }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#C07C05', letterSpacing: '0.12em' }}>{h.n}</div>
                            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 8, letterSpacing: '-0.01em' }}>{h.title}</div>
                            <div style={{ fontSize: 13, lineHeight: 1.65, color: '#5C5F66', marginTop: 8 }}>{h.body}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '34px 28px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', flex: 1 }}>Emerging talent hubs</div>
                    <a href="#0" onClick={(e) => { e.preventDefault(); navigate('/search'); }} style={{ fontSize: 12.5 }}>See all open roles</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
                    {HUBS.map((hb) => (
                        <div key={hb.city} onClick={() => navigate('/search')} style={{ border: '1px solid #E7E7EA', borderRadius: 5, overflow: 'hidden', cursor: 'pointer', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                            <img src={hb.photo} alt={hb.city} style={{ width: '100%', height: 150, objectFit: 'cover', flex: 'none' }} />
                            <div style={{ padding: '14px 16px 16px', flex: 1 }}>
                                <div style={{ fontSize: 15.5, fontWeight: 700 }}>{hb.city}</div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#C07C05', letterSpacing: '0.1em', marginTop: 5 }}>{hb.meta}</div>
                                <div style={{ fontSize: 12.5, color: '#5C5F66', marginTop: 8, lineHeight: 1.5 }}>{hb.note}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '34px 28px 44px' }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>Decide with the numbers</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginTop: 16 }}>
                    {TOOLS.map((t) => (
                        <div key={t.to} onClick={() => navigate(t.to)} style={{ border: '1px solid #E7E7EA', borderRadius: 5, padding: 18, cursor: 'pointer', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ width: 26, height: 30, background: '#FFF3D6', clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }} />
                            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{t.title}</div>
                            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5C5F66' }}>{t.body}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: '#23262C', padding: '36px 28px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>Ask your first endorsement this week.</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>Setting up a profile takes about ten minutes. The network does the rest.</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/profile')} style={{ border: 0, background: '#F9AD16', color: '#241A00', padding: '13px 24px', borderRadius: 3, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>Build your profile</button>
                    <button onClick={() => navigate('/insights')} style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#FFFFFF', padding: '13px 24px', borderRadius: 3, fontSize: 13.5, cursor: 'pointer' }}>Browse insights</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
