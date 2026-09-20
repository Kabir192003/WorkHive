import React from 'react';

const TIERS = [
    { name: 'Candidate', price: 'Free', body: 'Full access to search, ratings, salaries and your endorsement network.', features: ['Unlimited applications', 'Unlimited endorsement requests', 'Full insights access'] },
    { name: 'Recruiter Starter', price: '€19/mo', body: 'For a single hiring team getting started with endorsed candidates.', features: ['Up to 10 active roles', 'Candidate search', 'Standard support'] },
    { name: 'Recruiter Growth', price: '€29/mo', body: 'For talent teams hiring across multiple markets.', features: ['Unlimited active roles', 'Advanced candidate search', 'Dedicated account manager'] },
];

const Pricing = () => (
    <div style={{ padding: '48px 28px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#8C8F96' }}>PRICING</div>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 10 }}>Free for candidates. Simple for employers.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 28 }}>
            {TIERS.map((pr) => (
                <div key={pr.name} style={{ border: '1px solid #E7E7EA', borderRadius: 5, padding: '22px 20px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{pr.name}</div>
                    <div style={{ fontSize: 26, fontWeight: 800 }}>{pr.price}</div>
                    <div style={{ fontSize: 12.5, color: '#5C5F66', lineHeight: 1.6 }}>{pr.body}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6, borderTop: '1px solid #F0F0F2', paddingTop: 12 }}>
                        {pr.features.map((ft) => <div key={ft} style={{ fontSize: 12, color: '#4B4E55' }}>✓ {ft}</div>)}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Pricing;
