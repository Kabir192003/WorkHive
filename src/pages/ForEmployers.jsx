import React from 'react';
import { useToast } from '../context/ToastContext';

const POINTS = [
    { title: 'See past the resume', body: 'Every candidate arrives with named, attributed endorsements from people who worked with them — not just a list of past titles.' },
    { title: 'Faster first interviews', body: 'Endorsed applications reach a first interview 61% of the time, against a market average closer to 18%.' },
    { title: 'Transparent by design', body: "Your company's ratings and salary data are visible to candidates whether you engage with them or not — most employers choose to." },
];

const ForEmployers = () => {
    const showToast = useToast();
    return (
        <div style={{ padding: '48px 28px', maxWidth: 880 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#8C8F96' }}>FOR EMPLOYERS</div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1.2 }}>Hire on evidence your own people already gave you.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 28 }}>
                {POINTS.map((ep) => (
                    <div key={ep.title} style={{ border: '1px solid #E7E7EA', borderRadius: 5, padding: '18px 20px', background: '#FFFFFF' }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{ep.title}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6, color: '#5C5F66', marginTop: 8 }}>{ep.body}</div>
                    </div>
                ))}
            </div>
            <button onClick={() => showToast('Thanks — a member of our sales team will reach out within one business day.')} style={{ marginTop: 24, border: 0, background: '#F9AD16', color: '#241A00', padding: '13px 24px', borderRadius: 3, fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>Talk to sales</button>
        </div>
    );
};

export default ForEmployers;
