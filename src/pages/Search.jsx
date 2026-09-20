import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FACET_FIELD_MAP, MATCH_TOGGLE_LABELS } from '../lib/facets';
import EndorsementModal from '../components/EndorsementModal';
import { useToast } from '../context/ToastContext';

const AMBER = '#F9AD16';

const Search = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const showToast = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState(new Set());
    const [dismissedIds, setDismissedIds] = useState(new Set());
    const [connectionOrgs, setConnectionOrgs] = useState(new Set());

    const [facetSelections, setFacetSelections] = useState({});
    const [facetOpen, setFacetOpen] = useState(null);
    const [assisted, setAssisted] = useState(false);
    const [matches, setMatches] = useState(() => Object.fromEntries(MATCH_TOGGLE_LABELS.map((l) => [l, true])));
    const [heroQuery, setHeroQuery] = useState({ title: 'Product Designer', location: '', industry: '' });
    const [appliedQuery, setAppliedQuery] = useState({ title: '', location: '', industry: '' });
    const [endorsementJob, setEndorsementJob] = useState(null);

    useEffect(() => {
        (async () => {
            const { data: jobRows } = await supabase
                .from('jobs')
                .select('*, companies(name)')
                .order('created_at' in {} ? 'id' : 'id');
            const flat = (jobRows || []).map((j) => ({ ...j, company: j.companies?.name }));
            setJobs(flat);

            if (user) {
                const [{ data: saved }, { data: dismissed }, { data: conns }] = await Promise.all([
                    supabase.from('saved_jobs').select('job_id').eq('profile_id', user.id),
                    supabase.from('dismissed_jobs').select('job_id').eq('profile_id', user.id),
                    supabase.from('connections').select('org').eq('profile_id', user.id),
                ]);
                setSavedIds(new Set((saved || []).map((r) => r.job_id)));
                setDismissedIds(new Set((dismissed || []).map((r) => r.job_id)));
                setConnectionOrgs(new Set((conns || []).map((r) => r.org)));
            }
            setLoading(false);
        })();
    }, [user]);

    const facets = useMemo(() => {
        return Object.entries(FACET_FIELD_MAP).map(([label, field]) => {
            const options = Array.from(new Set(jobs.map((j) => j[field]).filter(Boolean))).sort();
            return { label, field, options, open: facetOpen === label };
        });
    }, [jobs, facetOpen]);

    const toggleFacetOpen = (label) => setFacetOpen((cur) => (cur === label ? null : label));
    const toggleFacetOption = (field, value) => {
        setFacetSelections((sel) => {
            const cur = sel[field] || [];
            const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
            return { ...sel, [field]: next };
        });
    };
    const hasAnyFacet = Object.values(facetSelections).some((v) => (v || []).length > 0);
    const clearFacets = () => { setFacetSelections({}); setFacetOpen(null); };

    const filteredJobs = useMemo(() => {
        let list = jobs.filter((j) => !dismissedIds.has(j.id));
        for (const [field, values] of Object.entries(facetSelections)) {
            if (!values || values.length === 0) continue;
            list = list.filter((j) => values.includes(j[field]));
        }
        const q = (s) => (s || '').trim().toLowerCase();
        if (q(appliedQuery.title)) list = list.filter((j) => j.title.toLowerCase().includes(q(appliedQuery.title)));
        if (q(appliedQuery.location)) list = list.filter((j) => (j.location || '').toLowerCase().includes(q(appliedQuery.location)));
        if (q(appliedQuery.industry)) list = list.filter((j) => (j.industry || '').toLowerCase().includes(q(appliedQuery.industry)));
        if (assisted) {
            list = [...list].sort((a, b) => {
                const aHas = connectionOrgs.has(a.company) ? 1 : 0;
                const bHas = connectionOrgs.has(b.company) ? 1 : 0;
                return bHas - aHas;
            });
        }
        return list;
    }, [jobs, dismissedIds, facetSelections, appliedQuery, assisted, connectionOrgs]);

    const toggleSave = async (job, e) => {
        e?.stopPropagation();
        if (!user) return;
        if (savedIds.has(job.id)) {
            await supabase.from('saved_jobs').delete().eq('profile_id', user.id).eq('job_id', job.id);
            setSavedIds((s) => { const n = new Set(s); n.delete(job.id); return n; });
            showToast('Removed from saved jobs');
        } else {
            await supabase.from('saved_jobs').insert({ profile_id: user.id, job_id: job.id });
            setSavedIds((s) => new Set(s).add(job.id));
            showToast('Saved — find it anytime from your dashboard');
        }
    };
    const dismissJob = async (job, e) => {
        e?.stopPropagation();
        if (!user) return;
        await supabase.from('dismissed_jobs').insert({ profile_id: user.id, job_id: job.id });
        setDismissedIds((s) => new Set(s).add(job.id));
        showToast(`Dismissed — won't show "${job.title}" again`);
    };

    const submitHeroSearch = () => setAppliedQuery({ ...heroQuery });
    const resultsMeta = `${filteredJobs.length} RESULT${filteredJobs.length === 1 ? '' : 'S'} · UAE, KSA, QATAR`;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '228px minmax(0, 1fr)', alignItems: 'start' }}>
            {/* refine rail */}
            <aside style={{ background: '#33363C', minHeight: 940, padding: '18px 0 40px', position: 'sticky', top: 0 }}>
                <div style={{ padding: '0 18px 12px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#9EA1A8' }}>REFINE SEARCH</span>
                    {hasAnyFacet && <a href="#0" onClick={(e) => { e.preventDefault(); clearFacets(); }} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.08em', color: '#FFC94D' }}>CLEAR</a>}
                </div>
                {facets.map((f) => {
                    const sel = facetSelections[f.field] || [];
                    return (
                        <div key={f.label}>
                            <button onClick={() => toggleFacetOpen(f.label)} style={{ width: '100%', border: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', background: sel.length ? 'rgba(249,173,22,0.12)' : 'transparent', color: sel.length ? '#FFC94D' : '#D9DADD', fontSize: 12.5, cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ width: 7, height: 8, flex: 'none', background: sel.length ? AMBER : '#6B6E75', clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)' }} />
                                <span style={{ flex: 1 }}>{f.label}{sel.length ? ` (${sel.length})` : ''}</span>
                                <span style={{ fontSize: 9, opacity: 0.7, transform: f.open ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
                            </button>
                            {f.open && (
                                <div style={{ background: '#26282D', padding: '4px 18px 10px' }}>
                                    {f.options.map((o) => (
                                        <div key={o} onClick={() => toggleFacetOption(f.field, o)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', cursor: 'pointer' }}>
                                            <span style={{ width: 12, height: 12, border: '1px solid #6B6E75', borderRadius: 2, background: sel.includes(o) ? AMBER : 'transparent', flex: 'none' }} />
                                            <span style={{ fontSize: 11.5, color: '#D9DADD' }}>{o}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div style={{ padding: '22px 18px 10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#9EA1A8' }}>MATCH BY</div>
                {MATCH_TOGGLE_LABELS.map((label) => (
                    <div key={label} onClick={() => setMatches((m) => ({ ...m, [label]: !m[label] }))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                        <span style={{ flex: 1, fontSize: 12, color: '#E7E8EA' }}>{label}</span>
                        <span style={{ width: 30, height: 16, borderRadius: 999, background: matches[label] ? AMBER : '#5A5D64', position: 'relative', transition: 'background 160ms' }}>
                            <span style={{ position: 'absolute', top: 2, left: matches[label] ? 16 : 2, width: 12, height: 12, borderRadius: '50%', background: '#FFFFFF', transition: 'left 160ms' }} />
                        </span>
                    </div>
                ))}
            </aside>

            <div style={{ minWidth: 0 }}>
                {/* hero search band */}
                <div style={{ position: 'relative', padding: '26px 28px 30px', background: 'linear-gradient(100deg, #F58A0B 0%, #FDB515 46%, #FFCB3D 100%)', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', fontSize: 20, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em', marginBottom: 16, textShadow: '0 1px 2px rgba(120,70,0,0.18)' }}>Explore opportunities in the emerging talent hubs</div>
                    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 148px', background: '#FFFDF6', borderRadius: 4, boxShadow: '0 6px 18px rgba(140,84,0,0.18)', overflow: 'hidden' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 16px', borderRight: '1px solid #EFE7D4' }}>
                            <span style={{ color: '#B98A2E', fontSize: 12 }}>⌕</span>
                            <input value={heroQuery.title} onChange={(e) => setHeroQuery((q) => ({ ...q, title: e.target.value }))} style={{ border: 0, outline: 'none', background: 'none', width: '100%', fontSize: 13.5, fontWeight: 500 }} />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 16px', borderRight: '1px solid #EFE7D4' }}>
                            <span style={{ color: '#B98A2E', fontSize: 12 }}>⌕</span>
                            <input placeholder="State or Country" value={heroQuery.location} onChange={(e) => setHeroQuery((q) => ({ ...q, location: e.target.value }))} style={{ border: 0, outline: 'none', background: 'none', width: '100%', fontSize: 13.5 }} />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 16px', borderRight: '1px solid #EFE7D4' }}>
                            <span style={{ color: '#B98A2E', fontSize: 12 }}>⌕</span>
                            <input placeholder="Industry" value={heroQuery.industry} onChange={(e) => setHeroQuery((q) => ({ ...q, industry: e.target.value }))} style={{ border: 0, outline: 'none', background: 'none', width: '100%', fontSize: 13.5 }} />
                        </label>
                        <button onClick={submitHeroSearch} style={{ border: 0, background: '#23262C', color: '#FFFFFF', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>Search</button>
                    </div>
                </div>

                {/* results header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '20px 28px 4px' }}>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>{appliedQuery.title || 'All roles'}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#7A7D84', marginTop: 4, letterSpacing: '0.06em' }}>{loading ? 'LOADING…' : resultsMeta}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 12 }} />
                    <div onClick={() => setAssisted((a) => !a)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <span style={{ fontSize: 12.5, color: '#4B4E55' }}>Assisted Search</span>
                        <span style={{ width: 38, height: 20, borderRadius: 999, background: assisted ? AMBER : '#D5D5D9', position: 'relative', transition: 'background 160ms' }}>
                            <span style={{ position: 'absolute', top: 2, left: assisted ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 160ms' }} />
                        </span>
                    </div>
                </div>

                {assisted && (
                    <div style={{ margin: '14px 28px 0', padding: '14px 16px', background: '#FFF8E6', border: '1px solid #F3DFA9', borderLeft: '3px solid #F5A623', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: '#9A6A00', paddingTop: 2 }}>ASSIST</span>
                        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4B4E55' }}>Results are re-ordered by your endorsement network — roles at companies you're connected to are listed first.</div>
                    </div>
                )}

                {/* job cards */}
                <div style={{ padding: '16px 28px 34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
                    {filteredJobs.map((j) => (
                        <article key={j.id} style={{ border: '1px solid #E7E7EA', borderRadius: 5, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#FFFFFF', boxShadow: '0 1px 2px rgba(20,22,28,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div onClick={() => navigate(`/job/${j.id}`)} style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer' }}>{j.title}</div>
                                    <div style={{ fontSize: 12.5, color: '#5C5F66', marginTop: 3 }}>
                                        <span onClick={() => navigate(`/company/${j.company_id}`)} style={{ cursor: 'pointer' }}>{j.company}</span>{' '}<span style={{ color: '#C6C7CB' }}>|</span> {j.location}
                                    </div>
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8C8F96', marginTop: 5, letterSpacing: '0.06em' }}>{j.posted_label}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 6, flex: 'none' }}>
                                    <span onClick={() => navigate(`/job/${j.id}`)} title="Open" style={{ width: 26, height: 24, border: '1px solid #E7E7EA', borderRadius: 3, display: 'grid', placeItems: 'center', fontSize: 10, color: '#8C8F96', cursor: 'pointer' }}>‹›</span>
                                    <span onClick={(e) => toggleSave(j, e)} title="Save" style={{ width: 26, height: 24, border: '1px solid #E7E7EA', borderRadius: 3, display: 'grid', placeItems: 'center', fontSize: 11, cursor: 'pointer', background: savedIds.has(j.id) ? '#FFF3D6' : 'transparent', color: savedIds.has(j.id) ? '#B98A2E' : '#8C8F96' }}>⚑</span>
                                    <span onClick={(e) => dismissJob(j, e)} title="Dismiss" style={{ width: 26, height: 24, border: '1px solid #E7E7EA', borderRadius: 3, display: 'grid', placeItems: 'center', fontSize: 11, color: '#8C8F96', cursor: 'pointer' }}>✕</span>
                                </div>
                            </div>
                            <div style={{ fontSize: 12.5, lineHeight: 1.6, color: '#4B4E55' }}>{j.blurb}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {(j.skills || []).map((sk) => (
                                    <span key={sk} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.04em', color: '#55585F', background: '#F4F4F5', border: '1px solid #E7E7EA', padding: '4px 8px', borderRadius: 2 }}>{sk}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4, borderTop: '1px solid #F0F0F2' }}>
                                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#2E7D53', letterSpacing: '0.04em' }}>{j.match_label}</span>
                                <span style={{ fontSize: 11.5, color: '#8C8F96' }}>{j.endorsers_label}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                                <button onClick={() => navigate('/connections')} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '10px 4px', borderRadius: 3, fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>Refer Someone</button>
                                <button onClick={() => navigate(`/apply/${j.id}`)} style={{ border: '1px solid #D8D9DD', background: '#FFFFFF', padding: '10px 4px', borderRadius: 3, fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>Apply Direct</button>
                                <button onClick={() => setEndorsementJob(j)} style={{ border: 0, background: AMBER, color: '#241A00', padding: '10px 4px', borderRadius: 3, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Get Endorsed</button>
                            </div>
                        </article>
                    ))}
                    {!loading && filteredJobs.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#8C8F96' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#4B4E55' }}>No roles match your filters</div>
                            <div style={{ fontSize: 12.5, marginTop: 6 }}>Try clearing a facet in the refine panel.</div>
                            <a href="#0" onClick={(e) => { e.preventDefault(); clearFacets(); }} style={{ display: 'inline-block', marginTop: 12, fontSize: 12.5 }}>Clear filters</a>
                        </div>
                    )}
                </div>
            </div>

            {endorsementJob && <EndorsementModal job={endorsementJob} onClose={() => setEndorsementJob(null)} />}
        </div>
    );
};

export default Search;
