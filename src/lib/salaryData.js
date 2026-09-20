import { CURRENCY_FX, fmtMoney } from './costData';

const hashStr = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); };

export const SENIORITY_BANDS = [
    { label: 'Entry (0–3 yrs)', base: 90000 },
    { label: 'Mid (4–7 yrs)', base: 160000 },
    { label: 'Senior (8–12 yrs)', base: 260000 },
    { label: 'Lead (12–16 yrs)', base: 360000 },
    { label: 'Principal (16+ yrs)', base: 480000 },
];

// Deterministic (same inputs always give the same numbers) but genuinely
// live — every field change recomputes instantly, unlike the source
// prototype's static decorative figures.
export function salaryEstimate(companyName, title, seniorityLabel, currencyCode) {
    const band = SENIORITY_BANDS.find((b) => b.label === seniorityLabel) || SENIORITY_BANDS[1];
    const seed = hashStr((companyName || '') + '|' + (title || '') + '|' + seniorityLabel);
    const spreadPct = 8 + (seed % 10); // ±8-17%
    const medianUsd = Math.round((band.base * (0.92 + (seed % 17) / 100)) / 1000) * 1000;
    const lowUsd = Math.round((medianUsd * (1 - spreadPct / 100)) / 1000) * 1000;
    const highUsd = Math.round((medianUsd * (1 + spreadPct / 100)) / 1000) * 1000;
    const sample = 20 + (seed % 380);
    const yoy = -4 + (seed % 15);
    return {
        medianLabel: fmtMoney(medianUsd, currencyCode),
        rangeLabel: `${fmtMoney(lowUsd, currencyCode)} – ${fmtMoney(highUsd, currencyCode)}`,
        sample,
        yoy: (yoy >= 0 ? '+' : '') + yoy + '%',
        yoyUp: yoy >= 0,
        bands: SENIORITY_BANDS.map((b, i) => {
            const m = hashStr((companyName || '') + b.label);
            const bMedian = Math.round((b.base * (0.9 + (m % 20) / 100)));
            return {
                label: b.label,
                current: b.label === seniorityLabel,
                medianLabel: fmtMoney(bMedian, currencyCode),
                pct: 8 + i * 18 + (m % 8),
            };
        }),
    };
}
