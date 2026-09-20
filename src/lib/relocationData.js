import { fmtMoney } from './costData';

const hashStr = (str) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); };

const ROW_DEFS = [
    { key: 'flights', label: 'Flights, household of three', employerNote: 'Usually employer-paid' },
    { key: 'freight', label: 'Household freight / shipping', employerNote: 'Often employer-paid, capped' },
    { key: 'visa', label: 'Visa & work permit fees', employerNote: 'Usually employer-paid' },
    { key: 'deposit', label: 'Housing deposit & agency fee', employerNote: 'Rarely covered' },
    { key: 'schoolAdmission', label: 'School admission fees', employerNote: 'Sometimes covered' },
    { key: 'furnishing', label: 'Initial furnishing & setup', employerNote: 'Not typically covered' },
    { key: 'temporary', label: 'Temporary housing, first month', employerNote: 'Sometimes covered' },
];

export function relocationEstimate(fromCity, toCity, currencyCode) {
    const seed = hashStr(fromCity + '|' + toCity);
    const rows = ROW_DEFS.map((rd, i) => {
        const s = hashStr(fromCity + toCity + rd.key);
        const amountUsd = 800 + (s % 6) * 900 + i * 300;
        const employerPaid = rd.employerNote.startsWith('Usually') || (rd.employerNote.startsWith('Often') && s % 2 === 0);
        return { ...rd, amountUsd, a: fmtMoney(amountUsd, currencyCode), employerPaid };
    });
    const total = rows.reduce((s, r) => s + r.amountUsd, 0);
    const employerCovered = rows.filter((r) => r.employerPaid).reduce((s, r) => s + r.amountUsd, 0);
    return {
        rows,
        totalLabel: fmtMoney(total, currencyCode),
        employerCoveredLabel: fmtMoney(employerCovered, currencyCode),
        leftWithYouLabel: fmtMoney(total - employerCovered, currencyCode),
    };
}
