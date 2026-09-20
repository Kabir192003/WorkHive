import React from 'react';

const VALUES = [
    { title: 'Evidence over assertion', body: 'A claim on a profile is only as good as who is willing to put their name behind it.' },
    { title: 'Attribution, always', body: 'Every rating, salary figure and endorsement carries who gave it and when.' },
    { title: 'Built for the region', body: 'Relocation, cost of living and visa mechanics are modelled for the Gulf and South Asia specifically, not bolted on from a US product.' },
];

const WhyWorkHive = () => (
    <div style={{ padding: '48px 28px', maxWidth: 880 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#8C8F96' }}>WHY WORK HIVE</div>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1.2 }}>A resume tells you where someone worked. An endorsement tells you what they were like to work with.</div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: '#4B4E55', marginTop: 16 }}>Most hiring still runs on self-reported history and a handful of reference calls at the very end. Work Hive moves attribution to the front: every claim on a candidate's profile is traceable to a named colleague and a shared project, visible before a recruiter ever picks up the phone.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 30 }}>
            {VALUES.map((v) => (
                <div key={v.title} style={{ borderTop: '2px solid #23262C', paddingTop: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{v.title}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5C5F66', marginTop: 8 }}>{v.body}</div>
                </div>
            ))}
        </div>
    </div>
);

export default WhyWorkHive;
