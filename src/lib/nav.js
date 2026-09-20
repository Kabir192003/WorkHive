// Route-driven equivalent of the prototype's `screen`-based topSection/subNav
// derivation — same logic, just keyed off the current pathname instead of
// in-memory state, since routes replace the DC prototype's single `screen`.

export const INSIGHTS_PATHS = ['/insights', '/ratings', '/salaries', '/cost', '/relocation', '/company'];
export const DIRECT_SECTIONS = { '/mentorship': 'MENTORSHIP', '/alumni': 'ALUMNI', '/internships': 'INTERNSHIPS', '/events': 'EVENTS', '/about': 'ABOUT US' };
export const MORE_LABELS = ['MENTORSHIP', 'ALUMNI', 'INTERNSHIPS', 'EVENTS', 'ABOUT US'];
export const PRIMARY_TARGETS = { HOME: '/', INSIGHTS: '/insights', CAREERS: '/dashboard' };
const MORE_TARGETS = { MENTORSHIP: '/mentorship', ALUMNI: '/alumni', INTERNSHIPS: '/internships', EVENTS: '/events', 'ABOUT US': '/about' };

export function topSectionFor(pathname) {
    if (pathname === '/' || pathname.startsWith('/home') || pathname === '/why-work-hive' || pathname === '/for-employers' || pathname === '/pricing') return 'HOME';
    for (const [p, label] of Object.entries(DIRECT_SECTIONS)) {
        if (pathname.startsWith(p)) return label;
    }
    if (INSIGHTS_PATHS.some((p) => pathname.startsWith(p)) || pathname.startsWith('/job/')) {
        // job detail/company live under Careers visually, but ratings/salaries/etc under Insights
        if (pathname.startsWith('/company') || INSIGHTS_PATHS.filter((p) => p !== '/company').some((p) => pathname.startsWith(p))) return 'INSIGHTS';
    }
    return 'CAREERS';
}

export function moreTarget(label) {
    return MORE_TARGETS[label];
}

const SUB_NAV_MAP = {
    HOME: [['Overview', '/'], ['Why Work Hive', '/why-work-hive'], ['For Employers', '/for-employers'], ['Pricing', '/pricing']],
    CAREERS: [['Dashboard', '/dashboard'], ['Profile Page', '/profile'], ['Search Jobs', '/search'], ['Connections', '/connections'], ['Messages', '/messages']],
    INSIGHTS: [['Home', '/insights'], ['Ratings', '/ratings'], ['Salaries', '/salaries'], ['Cost of Living', '/cost'], ['Relocation', '/relocation']],
};
const DIRECT_LABELS = { MENTORSHIP: ['Mentorship', '/mentorship'], ALUMNI: ['Alumni', '/alumni'], INTERNSHIPS: ['Internships', '/internships'], EVENTS: ['Events', '/events'], 'ABOUT US': ['About Us', '/about'] };

export function subNavFor(topSection) {
    if (SUB_NAV_MAP[topSection]) return SUB_NAV_MAP[topSection];
    if (DIRECT_LABELS[topSection]) return [DIRECT_LABELS[topSection]];
    return [];
}
