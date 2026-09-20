import React from 'react';

const STATS = [
    { value: '2021', label: 'Founded, in Dubai' },
    { value: '128k', label: 'Verified professionals' },
    { value: '4,200', label: 'Companies rated' },
    { value: '6', label: 'Markets across the Gulf and South Asia' },
];
const VALUES = [
    { title: 'Evidence over assertion', body: 'A claim on a profile is only as good as who is willing to put their name behind it.' },
    { title: 'Attribution, always', body: 'Every rating, salary figure and endorsement carries who gave it and when.' },
    { title: 'Built for the region', body: 'Relocation, cost of living and visa mechanics are modelled for the Gulf and South Asia specifically, not bolted on from a US product.' },
];

const About = () => (
    <div style={{ background: '#FAFAFB' }}>
        <div style={{ padding: '40px 28px', background: '#23262C' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>ABOUT US</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>We think hiring works better when people endorse with their name attached.</div>
        </div>
        <div style={{ padding: '30px 28px 44px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', border: '1px solid #E7E7EA', borderRadius: 5, background: '#FFFFFF' }}>
                {STATS.map((s) => (
                    <div key={s.label} style={{ padding: 20, borderRight: '1px solid #F0F0F2' }}>
                        <div style={{ fontSize: 26, fontWeight: 800 }}>{s.value}</div>
                        <div style={{ fontSize: 11.5, color: '#5C5F66', marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 30 }}>What we believe</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 16 }}>
                {VALUES.map((v) => (
                    <div key={v.title} style={{ borderTop: '2px solid #23262C', paddingTop: 12 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{v.title}</div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5C5F66', marginTop: 8 }}>{v.body}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default About;
