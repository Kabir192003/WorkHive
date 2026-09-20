// Ported from the original prototype's cost-of-living model. Figures are
// monthly USD estimates for a household of three; currency conversion and
// city comparison are computed live, never behind a submit button.
export const CITY_COST_DATA = {
    'Dubai, United Arab Emirates': { country: 'United Arab Emirates', currency: 'AED', rent: 2000, utilities: 210, groceries: 550, transport: 230, schooling: 1200, healthcare: 190, dining: 420, help: 140 },
    'Abu Dhabi, United Arab Emirates': { country: 'United Arab Emirates', currency: 'AED', rent: 1800, utilities: 200, groceries: 520, transport: 220, schooling: 1100, healthcare: 180, dining: 400, help: 130 },
    'Riyadh, Saudi Arabia': { country: 'Saudi Arabia', currency: 'SAR', rent: 1400, utilities: 180, groceries: 480, transport: 190, schooling: 900, healthcare: 150, dining: 350, help: 110 },
    'Doha, Qatar': { country: 'Qatar', currency: 'QAR', rent: 1900, utilities: 190, groceries: 500, transport: 200, schooling: 1050, healthcare: 170, dining: 380, help: 120 },
    'Kuwait City, Kuwait': { country: 'Kuwait', currency: 'USD', rent: 1300, utilities: 170, groceries: 460, transport: 180, schooling: 850, healthcare: 140, dining: 340, help: 100 },
    'Manama, Bahrain': { country: 'Bahrain', currency: 'USD', rent: 1100, utilities: 150, groceries: 430, transport: 160, schooling: 800, healthcare: 130, dining: 320, help: 90 },
    'Singapore, Singapore': { country: 'Singapore', currency: 'SGD', rent: 2600, utilities: 180, groceries: 600, transport: 150, schooling: 1400, healthcare: 220, dining: 450, help: 90 },
    'Bengaluru, India': { country: 'India', currency: 'INR', rent: 500, utilities: 60, groceries: 250, transport: 70, schooling: 400, healthcare: 80, dining: 150, help: 120 },
    'Mumbai, India': { country: 'India', currency: 'INR', rent: 700, utilities: 70, groceries: 280, transport: 90, schooling: 500, healthcare: 90, dining: 180, help: 130 },
    'Delhi, India': { country: 'India', currency: 'INR', rent: 600, utilities: 65, groceries: 260, transport: 80, schooling: 450, healthcare: 85, dining: 160, help: 125 },
    'Hyderabad, India': { country: 'India', currency: 'INR', rent: 450, utilities: 55, groceries: 230, transport: 65, schooling: 380, healthcare: 75, dining: 140, help: 110 },
    'London, United Kingdom': { country: 'United Kingdom', currency: 'GBP', rent: 2800, utilities: 240, groceries: 600, transport: 220, schooling: 1600, healthcare: 60, dining: 480, help: 100 },
    'New York, United States': { country: 'United States', currency: 'USD', rent: 3800, utilities: 260, groceries: 700, transport: 180, schooling: 1800, healthcare: 250, dining: 600, help: 80 },
    'Toronto, Canada': { country: 'Canada', currency: 'CAD', rent: 2100, utilities: 190, groceries: 520, transport: 150, schooling: 1200, healthcare: 50, dining: 420, help: 70 },
    'Sydney, Australia': { country: 'Australia', currency: 'AUD', rent: 2400, utilities: 220, groceries: 560, transport: 170, schooling: 1300, healthcare: 120, dining: 440, help: 75 },
};

export const CURRENCY_FX = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    AED: { symbol: 'AED ', rate: 3.67 },
    SAR: { symbol: 'SAR ', rate: 3.75 },
    QAR: { symbol: 'QAR ', rate: 3.64 },
    INR: { symbol: '₹', rate: 83 },
    SGD: { symbol: 'S$', rate: 1.34 },
    AUD: { symbol: 'A$', rate: 1.53 },
    CAD: { symbol: 'C$', rate: 1.36 },
};

export const ROW_DEFS = [
    { key: 'rent', label: 'Rent, two bedrooms' },
    { key: 'utilities', label: 'Utilities and internet' },
    { key: 'groceries', label: 'Groceries' },
    { key: 'transport', label: 'Transport' },
    { key: 'schooling', label: 'Schooling, one child' },
    { key: 'healthcare', label: 'Healthcare premiums' },
    { key: 'dining', label: 'Dining and leisure' },
    { key: 'help', label: 'Household help' },
];

export const fmtMoney = (usdValue, currencyCode) => {
    const fx = CURRENCY_FX[currencyCode] || CURRENCY_FX.USD;
    const v = Math.round(usdValue * fx.rate);
    return fx.symbol + v.toLocaleString('en-US');
};

const pct = (a, b) => (a === 0 ? '—' : (((b - a) / a) * 100 >= 0 ? '+' : '') + Math.round(((b - a) / a) * 100) + '%');

export function costCompare(fromCity, toCity, currencyCode) {
    const from = CITY_COST_DATA[fromCity] || CITY_COST_DATA['Bengaluru, India'];
    const to = CITY_COST_DATA[toCity] || CITY_COST_DATA['Dubai, United Arab Emirates'];
    const rows = ROW_DEFS.map((rd) => ({
        label: rd.label,
        a: fmtMoney(from[rd.key], currencyCode),
        b: fmtMoney(to[rd.key], currencyCode),
        delta: pct(from[rd.key], to[rd.key]),
        deltaUp: to[rd.key] >= from[rd.key],
    }));
    const fromTotal = ROW_DEFS.reduce((s, rd) => s + from[rd.key], 0);
    const toTotal = ROW_DEFS.reduce((s, rd) => s + to[rd.key], 0);
    return {
        rows,
        fromTotal: fmtMoney(fromTotal, currencyCode),
        toTotal: fmtMoney(toTotal, currencyCode),
        deltaPct: pct(fromTotal, toTotal),
        deltaUp: toTotal >= fromTotal,
        salaryToMatch: fmtMoney(toTotal * 12 * 1.15, currencyCode),
    };
}
