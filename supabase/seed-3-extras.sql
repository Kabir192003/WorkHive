-- Seed part 3/3: mentors, alumni, internships, events, connections pool.
begin;

-- Mentors
insert into mentors (name, role, focus, photo) values ('Aisha Rahman', 'Head of Sales, Northwind Stores', 'Career transitions into commercial leadership', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=60');
insert into mentors (name, role, focus, photo) values ('Karan Bhatia', 'HR Director, Halcyon Group', 'Building a design career in retail', 'https://images.unsplash.com/photo-1580489944071-1ff2e46a4ee5?auto=format&fit=crop&w=300&q=60');
insert into mentors (name, role, focus, photo) values ('Rahul Menon', 'Category Director, Vellum Sports', 'Moving from IC to people management', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=60');

-- Alumni moves
insert into alumni_moves (name, from_role, to_role, when_year) values ('Priya Nair', 'UX Researcher, Studio Kite', 'Senior Researcher, Halcyon Group', '2025');
insert into alumni_moves (name, from_role, to_role, when_year) values ('Daniel Okoye', 'Design Lead, Etisalat', 'Design Lead, Platform, Northwind Telecom', '2024');
insert into alumni_moves (name, from_role, to_role, when_year) values ('Lena Fischer', 'Talent Partner, Virgin Mobile', 'Head of Talent, Meridian Pay', '2024');
insert into alumni_moves (name, from_role, to_role, when_year) values ('James Whitaker', 'Programme Lead, RTA Dubai', 'Director of Operations, Kestrel Retail', '2023');

-- Internship listings
insert into internship_listings (title, company, location, term, note) values ('Product Design Intern', 'Halcyon Group', 'Dubai, UAE', '6 months · Paid', 'Works directly on the checkout rebuild squad.');
insert into internship_listings (title, company, location, term, note) values ('Research Intern', 'Aster Retail', 'Dubai, UAE', '3 months · Paid', 'Supports the quarterly shopper diary study.');
insert into internship_listings (title, company, location, term, note) values ('Data Analyst Intern', 'Meridian Pay', 'Riyadh, KSA', '6 months · Paid', 'Embedded with the growth and experimentation team.');

-- Events
insert into events (title, event_date, format, body) values ('Endorsement Networks in Practice', 'SEP 24, 2026', 'In person · Dubai', 'A panel on how attributed references are changing Gulf hiring, with talent leads from three retailers.');
insert into events (title, event_date, format, body) values ('Design Systems at Scale', 'OCT 08, 2026', 'Virtual', 'Kestrel Retail''s design systems team walks through their token pipeline.');
insert into events (title, event_date, format, body) values ('Relocating for a Role: What It Actually Costs', 'OCT 21, 2026', 'Virtual', 'A working session using live Work Hive relocation data.');

-- Public connections pool (browsable network; per-profile connections are seeded from this on signup)
insert into connections_pool (role, org, location, industry, degree) values ('Category Director', 'Vellum Sports', 'Bengaluru, India', 'Retail & Apparel', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Merchandising Director', 'Aster Retail', 'Dubai, United Arab Emirates', 'Retail & Apparel', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Category Head', 'Apparel Group', 'Dubai, United Arab Emirates', 'Retail & Apparel', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Brand Director', 'Northwind Stores', 'Dubai, United Arab Emirates', 'Retail & Apparel', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Regional Sales Lead', 'Kestrel Retail', 'Abu Dhabi, United Arab Emirates', 'Retail & Apparel', 2);
insert into connections_pool (role, org, location, industry, degree) values ('Head of Sales', 'Halcyon Group', 'Dubai, United Arab Emirates', 'Retail & Apparel', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Commercial Director', 'Meridian Pay', 'Riyadh, Saudi Arabia', 'Financial Services', 2);
insert into connections_pool (role, org, location, industry, degree) values ('VP Product', 'Northwind Telecom', 'Dubai, United Arab Emirates', 'Telecommunications', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Talent Partner', 'Kestrel Retail', 'Abu Dhabi, United Arab Emirates', 'Retail & Apparel', 2);
insert into connections_pool (role, org, location, industry, degree) values ('Design Director', 'Halcyon Group', 'Dubai, United Arab Emirates', 'Retail & Apparel', 1);
insert into connections_pool (role, org, location, industry, degree) values ('Finance Manager', 'Meridian Pay', 'Riyadh, Saudi Arabia', 'Financial Services', 2);
insert into connections_pool (role, org, location, industry, degree) values ('Engineering Manager', 'Northwind Telecom', 'Dubai, United Arab Emirates', 'Telecommunications', 1);

commit;
