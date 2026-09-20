import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { topSectionFor, subNavFor, MORE_LABELS, moreTarget } from '../lib/nav';

const AMBER = '#F9AD16';

const Chrome = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const [moreOpen, setMoreOpen] = useState(false);

    const topSection = topSectionFor(pathname);
    const subNav = subNavFor(topSection);
    const moreActive = MORE_LABELS.includes(topSection);
    const moreLabel = moreActive ? topSection.charAt(0) + topSection.slice(1).toLowerCase() : 'More';

    const initial = (profile?.name || user?.email || '?').charAt(0).toUpperCase();

    return (
        <div style={{ minHeight: '100vh', padding: '22px 22px 60px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 1480, background: '#FFFFFF', borderRadius: 6, overflow: 'visible', boxShadow: '0 18px 50px rgba(20,22,28,0.16)', display: 'flex', flexDirection: 'column' }}>

                {/* utility bar */}
                <div style={{ display: 'flex', alignItems: 'stretch', background: '#F2F2F3', borderBottom: '1px solid #E3E3E6', minHeight: 46 }}>
                    <div style={{ width: 128, flex: 'none' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 'none' }}>
                        {['HOME', 'CAREERS', 'INSIGHTS'].map((label) => {
                            const active = label === topSection;
                            return (
                                <button
                                    key={label}
                                    onClick={() => navigate(label === 'HOME' ? '/' : label === 'INSIGHTS' ? '/insights' : '/dashboard')}
                                    style={{ border: 0, background: active ? AMBER : 'transparent', color: active ? '#241A00' : '#6B6E75', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', fontWeight: 500, padding: '15px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >{label}</button>
                            );
                        })}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setMoreOpen((v) => !v)}
                                style={{ border: 0, background: moreActive ? AMBER : 'transparent', color: moreActive ? '#241A00' : '#6B6E75', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.1em', fontWeight: 500, padding: '15px 14px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}
                            >{moreLabel} <span style={{ fontSize: 8, opacity: 0.75 }}>▾</span></button>
                            {moreOpen && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 2, background: '#FFFFFF', border: '1px solid #E3E3E6', borderRadius: 4, boxShadow: '0 12px 28px rgba(20,22,28,0.16)', minWidth: 168, zIndex: 20, overflow: 'hidden' }}>
                                    {MORE_LABELS.map((label) => (
                                        <div
                                            key={label}
                                            onClick={() => { setMoreOpen(false); navigate(moreTarget(label)); }}
                                            style={{ padding: '11px 16px', fontSize: 12.5, fontWeight: 500, color: '#2C2F35', cursor: 'pointer', borderTop: '1px solid #F0F0F2' }}
                                        >{label.charAt(0) + label.slice(1).toLowerCase()}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', flex: 'none', marginLeft: 'auto' }}>
                        <button onClick={() => navigate('/search')} title="Search open roles" style={{ border: 0, background: AMBER, color: '#241A00', fontSize: 11.5, fontWeight: 700, padding: '8px 16px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap' }}>Search Jobs</button>
                        <div style={{ width: 1, height: 20, background: '#DCDCDF', flex: 'none' }} />
                        <div onClick={() => navigate('/profile')} title="Your profile" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 5px', borderRadius: 999, cursor: 'pointer' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', background: AMBER, color: '#241A00', fontSize: 10.5, fontWeight: 700, display: 'grid', placeItems: 'center', flex: 'none' }}>{initial}</span>
                            <span style={{ fontSize: 11, color: '#4B4E55', fontWeight: 500, whiteSpace: 'nowrap' }}>Profile</span>
                        </div>
                        <div onClick={() => navigate('/messages')} title="Messages" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 5px', borderRadius: 999, cursor: 'pointer' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #D5D5D9', background: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 10, color: '#6B7280', flex: 'none' }}>✦</span>
                            <span style={{ fontSize: 11, color: '#4B4E55', fontWeight: 500, whiteSpace: 'nowrap' }}>Messages</span>
                        </div>
                        <div onClick={() => navigate('/onboarding')} title="Set up your profile" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 5px', borderRadius: 999, cursor: 'pointer' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #D5D5D9', background: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 10, color: '#6B7280', flex: 'none' }}>◉</span>
                            <span style={{ fontSize: 11, color: '#4B4E55', fontWeight: 500, whiteSpace: 'nowrap' }}>Onboarding</span>
                        </div>
                        <div onClick={() => navigate('/settings')} title="Settings" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 5px', borderRadius: 999, cursor: 'pointer' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid #D5D5D9', background: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 10, color: '#6B7280', flex: 'none' }}>⚙</span>
                            <span style={{ fontSize: 11, color: '#4B4E55', fontWeight: 500, whiteSpace: 'nowrap' }}>Settings</span>
                        </div>
                        {user && (
                            <button onClick={() => { signOut(); navigate('/'); }} title="Sign out" style={{ border: 0, background: 'transparent', color: '#8C8F96', fontSize: 10.5, fontWeight: 500, padding: '5px 8px', cursor: 'pointer' }}>Sign out</button>
                        )}
                    </div>
                </div>

                {/* logo + section nav */}
                <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #E3E3E6', position: 'relative', zIndex: 3 }}>
                    <div style={{ width: 128, flex: 'none', position: 'relative' }}>
                        <Link to="/" style={{ position: 'absolute', top: -46, left: 22, width: 84, padding: '12px 8px 10px', background: 'linear-gradient(160deg, #FFC02E 0%, #F79E1B 55%, #EE7D0E 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 8px 18px rgba(214,132,10,0.28)', cursor: 'pointer', textDecoration: 'none' }}>
                            <svg viewBox="0 0 48 34" width="42" height="30" aria-label="Work Hive">
                                <polygon points="4,2 16,2 10,13" fill="#FFFFFF" />
                                <polygon points="18,2 30,2 24,13" fill="#FFFFFF" />
                                <polygon points="32,2 44,2 38,13" fill="#FFFFFF" />
                                <polygon points="11,15 23,15 17,26" fill="#FFFFFF" />
                                <polygon points="25,15 37,15 31,26" fill="#FFFFFF" />
                                <polygon points="18,28 30,28 24,39" fill="#FFFFFF" opacity="0.55" />
                            </svg>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.01em' }}>Work Hive</div>
                        </Link>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 26, padding: '0 24px', overflowX: 'auto' }}>
                        {subNav.map(([label, target]) => {
                            const isActive = pathname === target;
                            return (
                                <button
                                    key={label}
                                    onClick={() => navigate(target)}
                                    style={{ border: 0, background: 'none', padding: '16px 0', cursor: 'pointer', fontSize: 13.5, fontWeight: isActive ? 700 : 500, color: isActive ? '#16181D' : '#6B6E75', borderBottom: `3px solid ${isActive ? '#16181D' : 'transparent'}`, whiteSpace: 'nowrap' }}
                                >{label}</button>
                            );
                        })}
                    </div>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default Chrome;
