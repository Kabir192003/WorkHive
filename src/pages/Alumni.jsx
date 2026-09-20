import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Alumni = () => {
    const [moves, setMoves] = useState([]);

    useEffect(() => {
        supabase.from('alumni_moves').select('*').order('when_year', { ascending: false }).then(({ data }) => setMoves(data || []));
    }, []);

    return (
        <div style={{ background: '#FAFAFB' }}>
            <div style={{ padding: '40px 28px', background: '#23262C' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.16em', color: '#FFC94D' }}>ALUMNI</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 8, maxWidth: 640 }}>Where the network has moved recently.</div>
            </div>
            <div style={{ padding: '30px 28px 44px' }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Recent moves</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                    {moves.map((am) => (
                        <div key={am.id} style={{ border: '1px solid #E7E7EA', borderRadius: 4, background: '#FFFFFF', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EDEDEF', flex: 'none' }} />
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{am.name}</div>
                                <div style={{ fontSize: 12, color: '#6B6E75', marginTop: 3 }}>{am.from_role} → {am.to_role}</div>
                            </div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8C8F96', letterSpacing: '0.08em' }}>{am.when_year}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Alumni;
