import fs from 'node:fs';

const jobs = JSON.parse(fs.readFileSync('scripts/jobs.json', 'utf8'));
const companies = JSON.parse(fs.readFileSync('scripts/companies.json', 'utf8'));

const esc = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => `ARRAY[${(a || []).map(esc).join(', ')}]::text[]`;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ── File 1: companies + company_facts ──
let out1 = `-- Seed part 1/3: companies + facts. Run after schema.sql.\nbegin;\n\n`;
out1 += `-- Companies (${Object.keys(companies).length})\n`;
for (const [name, c] of Object.entries(companies)) {
    const slug = slugify(name);
    out1 += `insert into companies (slug, name, sector, industry, company_type, location, size, rating, rating_bucket, about) values (${esc(slug)}, ${esc(c.name)}, ${esc(c.sector)}, ${esc(c.industry)}, ${esc(c.companyType)}, ${esc(c.location)}, ${esc(c.size)}, ${c.rating}, ${esc(c.ratingBucket)}, ${esc(c.about)});\n`;
}
out1 += '\n-- Company facts\n';
for (const [name, c] of Object.entries(companies)) {
    const slug = slugify(name);
    for (const f of c.facts || []) {
        out1 += `insert into company_facts (company_id, label, value) select id, ${esc(f.label)}, ${esc(f.value)} from companies where slug = ${esc(slug)};\n`;
    }
}
out1 += '\ncommit;\n';
fs.writeFileSync('supabase/seed-1-companies.sql', out1);

// ── File 2: jobs ──
let out2 = `-- Seed part 2/3: jobs. Run after seed-1-companies.sql.\nbegin;\n\n`;
out2 += `-- Jobs (${jobs.length})\n`;
for (const j of jobs) {
    const companySlug = slugify(j.company);
    out2 += `insert into jobs (company_id, title, location, posted_label, blurb, skills, match_label, endorsers_label, job_type, seniority, experience, relocation, company_type, company_size, date_bucket, job_function, industry, company_rating_bucket) select id, ${esc(j.title)}, ${esc(j.location)}, ${esc(j.posted)}, ${esc(j.blurb)}, ${arr(j.skills)}, ${esc(j.match)}, ${esc(j.endorsers)}, ${esc(j.jobType)}, ${esc(j.seniority)}, ${esc(j.experience)}, ${esc(j.relocation)}, ${esc(j.companyType)}, ${esc(j.companySize)}, ${esc(j.dateBucket)}, ${esc(j.jobFunction)}, ${esc(j.industry)}, ${esc(j.companyRatingBucket)} from companies where slug = ${esc(companySlug)};\n`;
}
out2 += '\ncommit;\n';
fs.writeFileSync('supabase/seed-2-jobs.sql', out2);

// ── File 3: mentors, alumni, internships, events, connections pool ──
let out3 = `-- Seed part 3/3: mentors, alumni, internships, events, connections pool.\nbegin;\n\n`;

const mentors = [
    { name: 'Aisha Rahman', role: 'Head of Sales, Northwind Stores', focus: 'Career transitions into commercial leadership', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=60' },
    { name: 'Karan Bhatia', role: 'HR Director, Halcyon Group', focus: 'Building a design career in retail', photo: 'https://images.unsplash.com/photo-1580489944071-1ff2e46a4ee5?auto=format&fit=crop&w=300&q=60' },
    { name: 'Rahul Menon', role: 'Category Director, Vellum Sports', focus: 'Moving from IC to people management', photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=60' },
];
out3 += '-- Mentors\n';
for (const m of mentors) {
    out3 += `insert into mentors (name, role, focus, photo) values (${esc(m.name)}, ${esc(m.role)}, ${esc(m.focus)}, ${esc(m.photo)});\n`;
}

const alumniMoves = [
    { name: 'Priya Nair', from_role: 'UX Researcher, Studio Kite', to_role: 'Senior Researcher, Halcyon Group', when_year: '2025' },
    { name: 'Daniel Okoye', from_role: 'Design Lead, Etisalat', to_role: 'Design Lead, Platform, Northwind Telecom', when_year: '2024' },
    { name: 'Lena Fischer', from_role: 'Talent Partner, Virgin Mobile', to_role: 'Head of Talent, Meridian Pay', when_year: '2024' },
    { name: 'James Whitaker', from_role: 'Programme Lead, RTA Dubai', to_role: 'Director of Operations, Kestrel Retail', when_year: '2023' },
];
out3 += '\n-- Alumni moves\n';
for (const a of alumniMoves) {
    out3 += `insert into alumni_moves (name, from_role, to_role, when_year) values (${esc(a.name)}, ${esc(a.from_role)}, ${esc(a.to_role)}, ${esc(a.when_year)});\n`;
}

const internships = [
    { title: 'Product Design Intern', company: 'Halcyon Group', location: 'Dubai, UAE', term: '6 months · Paid', note: 'Works directly on the checkout rebuild squad.' },
    { title: 'Research Intern', company: 'Aster Retail', location: 'Dubai, UAE', term: '3 months · Paid', note: 'Supports the quarterly shopper diary study.' },
    { title: 'Data Analyst Intern', company: 'Meridian Pay', location: 'Riyadh, KSA', term: '6 months · Paid', note: 'Embedded with the growth and experimentation team.' },
];
out3 += '\n-- Internship listings\n';
for (const i of internships) {
    out3 += `insert into internship_listings (title, company, location, term, note) values (${esc(i.title)}, ${esc(i.company)}, ${esc(i.location)}, ${esc(i.term)}, ${esc(i.note)});\n`;
}

const events = [
    { title: 'Endorsement Networks in Practice', event_date: 'SEP 24, 2026', format: 'In person · Dubai', body: 'A panel on how attributed references are changing Gulf hiring, with talent leads from three retailers.' },
    { title: 'Design Systems at Scale', event_date: 'OCT 08, 2026', format: 'Virtual', body: "Kestrel Retail's design systems team walks through their token pipeline." },
    { title: 'Relocating for a Role: What It Actually Costs', event_date: 'OCT 21, 2026', format: 'Virtual', body: 'A working session using live Work Hive relocation data.' },
];
out3 += '\n-- Events\n';
for (const e of events) {
    out3 += `insert into events (title, event_date, format, body) values (${esc(e.title)}, ${esc(e.event_date)}, ${esc(e.format)}, ${esc(e.body)});\n`;
}

const connectionsPool = [
    { role: 'Category Director', org: 'Vellum Sports', location: 'Bengaluru, India', industry: 'Retail & Apparel', degree: 1 },
    { role: 'Merchandising Director', org: 'Aster Retail', location: 'Dubai, United Arab Emirates', industry: 'Retail & Apparel', degree: 1 },
    { role: 'Category Head', org: 'Apparel Group', location: 'Dubai, United Arab Emirates', industry: 'Retail & Apparel', degree: 1 },
    { role: 'Brand Director', org: 'Northwind Stores', location: 'Dubai, United Arab Emirates', industry: 'Retail & Apparel', degree: 1 },
    { role: 'Regional Sales Lead', org: 'Kestrel Retail', location: 'Abu Dhabi, United Arab Emirates', industry: 'Retail & Apparel', degree: 2 },
    { role: 'Head of Sales', org: 'Halcyon Group', location: 'Dubai, United Arab Emirates', industry: 'Retail & Apparel', degree: 1 },
    { role: 'Commercial Director', org: 'Meridian Pay', location: 'Riyadh, Saudi Arabia', industry: 'Financial Services', degree: 2 },
    { role: 'VP Product', org: 'Northwind Telecom', location: 'Dubai, United Arab Emirates', industry: 'Telecommunications', degree: 1 },
    { role: 'Talent Partner', org: 'Kestrel Retail', location: 'Abu Dhabi, United Arab Emirates', industry: 'Retail & Apparel', degree: 2 },
    { role: 'Design Director', org: 'Halcyon Group', location: 'Dubai, United Arab Emirates', industry: 'Retail & Apparel', degree: 1 },
    { role: 'Finance Manager', org: 'Meridian Pay', location: 'Riyadh, Saudi Arabia', industry: 'Financial Services', degree: 2 },
    { role: 'Engineering Manager', org: 'Northwind Telecom', location: 'Dubai, United Arab Emirates', industry: 'Telecommunications', degree: 1 },
];
out3 += '\n-- Public connections pool (browsable network; per-profile connections are seeded from this on signup)\n';
for (const c of connectionsPool) {
    out3 += `insert into connections_pool (role, org, location, industry, degree) values (${esc(c.role)}, ${esc(c.org)}, ${esc(c.location)}, ${esc(c.industry)}, ${c.degree});\n`;
}
out3 += '\ncommit;\n';
fs.writeFileSync('supabase/seed-3-extras.sql', out3);

console.log('seed-1-companies.sql:', out1.length, 'bytes');
console.log('seed-2-jobs.sql:', out2.length, 'bytes');
console.log('seed-3-extras.sql:', out3.length, 'bytes');
