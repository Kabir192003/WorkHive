const hashStr = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); };

export const RATING_TABS = ['Overall', 'Compensation', 'Benefits', 'Family Benefits', 'Work Culture', 'Career Progression'];

export function ratingsBreakdown(company, tab) {
    const seed = hashStr(company.name + '|' + tab);
    const base = parseFloat(company.rating);
    const deltas = { Overall: 0, Compensation: ((seed % 7) - 3) / 10, Benefits: ((seed % 5) - 2) / 10, 'Family Benefits': ((seed % 9) - 4) / 10, 'Work Culture': ((seed % 6) - 3) / 10, 'Career Progression': ((seed % 8) - 4) / 10 };
    let score = Math.min(4.9, Math.max(2.8, base + (deltas[tab] || 0)));
    score = Math.round(score * 100) / 100;
    const reviewCount = 60 + (seed % 900);
    const p5 = Math.max(6, Math.min(72, Math.round((score - 2.5) * 22 + (seed % 11))));
    const p4 = Math.max(8, Math.min(40, 46 - Math.round((4.6 - score) * 10) + (seed % 7)));
    const p3 = Math.max(4, 22 - Math.round(p5 / 8));
    const p2 = Math.max(2, 12 - Math.round(p4 / 10));
    const p1 = Math.max(1, 100 - p5 - p4 - p3 - p2);
    const total = p5 + p4 + p3 + p2 + p1;
    const norm = (v) => Math.round((v / total) * 100);
    const dist = [
        { label: '5 ★', pct: norm(p5), color: '#2E7D53' },
        { label: '4 ★', pct: norm(p4), color: '#7FCB9B' },
        { label: '3 ★', pct: norm(p3), color: '#F5C94D' },
        { label: '2 ★', pct: norm(p2), color: '#F2A65A' },
        { label: '1 ★', pct: norm(p1), color: '#B4483A' },
    ];
    return { score, reviewCount, dist };
}
