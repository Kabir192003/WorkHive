-- WorkHive schema. Run this once in the Supabase SQL Editor, then run seed.sql.
-- Two halves: public reference tables (companies/jobs/mentors/events — same
-- for everyone, read-only) and per-user tables (profile, applications,
-- endorsements, messages, settings — private, protected by Row Level Security
-- so each signed-in account only ever sees/edits its own rows).

create extension if not exists pgcrypto;

-- ───────────────────────── Public reference data ─────────────────────────

create table companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sector text, industry text, company_type text, location text, size text,
  rating numeric, rating_bucket text, about text
);

create table company_facts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  label text, value text
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  title text not null, location text, posted_label text, blurb text,
  skills text[], match_label text, endorsers_label text,
  job_type text, seniority text, experience text, relocation text,
  company_type text, company_size text, date_bucket text, job_function text,
  industry text, company_rating_bucket text,
  responsibilities text[] default array[
    'Partner with research to define the problem before any screens get drawn.',
    'Ship in weekly increments and hold a design review with engineering each cycle.',
    'Own the metrics your work is judged against, and report on them monthly.',
    'Mentor at least one other designer on the team.'
  ],
  requirements text[] default array[
    '5+ years designing shipped consumer or commerce products.',
    'A portfolio that shows process, not just final screens.',
    'Comfortable working directly with engineers rather than through a handoff doc.',
    'Based in or willing to relocate to the Gulf.'
  ]
);

create table mentors (
  id uuid primary key default gen_random_uuid(),
  name text, role text, focus text, photo text
);

create table alumni_moves (
  id uuid primary key default gen_random_uuid(),
  name text, from_role text, to_role text, when_year text
);

create table internship_listings (
  id uuid primary key default gen_random_uuid(),
  title text, company text, location text, term text, note text
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text, event_date text, format text, body text
);

create table connections_pool (
  id uuid primary key default gen_random_uuid(),
  role text, org text, location text, industry text, degree int
);

alter table companies enable row level security;
alter table company_facts enable row level security;
alter table jobs enable row level security;
alter table mentors enable row level security;
alter table alumni_moves enable row level security;
alter table internship_listings enable row level security;
alter table events enable row level security;
alter table connections_pool enable row level security;

create policy "public read" on companies for select using (true);
create policy "public read" on company_facts for select using (true);
create policy "public read" on jobs for select using (true);
create policy "public read" on mentors for select using (true);
create policy "public read" on alumni_moves for select using (true);
create policy "public read" on internship_listings for select using (true);
create policy "public read" on events for select using (true);
create policy "public read" on connections_pool for select using (true);

-- ───────────────────────── Per-user data ─────────────────────────

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text, headline text, location text, about text,
  avatar_url text, resume_url text, resume_name text,
  endorsement_score int default 500,
  profile_public boolean default true,
  show_salary boolean default true,
  searchable boolean default false,
  notif_email boolean default true,
  notif_endorsement boolean default true,
  notif_jobs boolean default false,
  onboard_step int default 1,
  onboard_complete boolean default false,
  created_at timestamptz default now()
);

create table profile_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  label text not null, position int default 0
);

create table profile_experience (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  role text, org text, when_text text, body text, position int default 0,
  overlap_label text
);

create table saved_jobs (
  profile_id uuid references profiles(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (profile_id, job_id)
);

create table dismissed_jobs (
  profile_id uuid references profiles(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (profile_id, job_id)
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  status text default 'applied',        -- applied | screening | interview | offer
  route text default 'direct',          -- direct | endorsed | referred
  progress_pct int default 10,
  cover_note text,
  phone text, portfolio_url text,
  resume_url text, resume_name text,
  wants_endorsement boolean default false,
  created_at timestamptz default now()
);

create table message_threads (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  type text not null,                   -- endorsement | message
  counterpart_name text, counterpart_subtitle text,
  job_id uuid references jobs(id),
  status text default 'pending',        -- pending | accepted | declined | (null for plain messages)
  unread boolean default true,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references message_threads(id) on delete cascade,
  sender text not null,                 -- 'me' | 'them'
  body text not null,
  created_at timestamptz default now()
);

create table connections (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  role text, org text, location text, industry text, degree int,
  created_at timestamptz default now()
);

create table endorsements_received (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  quote text, by_name text, by_role text, basis text,
  created_at timestamptz default now()
);

create table event_rsvps (
  profile_id uuid references profiles(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (profile_id, event_id)
);

create table mentor_requests (
  profile_id uuid references profiles(id) on delete cascade,
  mentor_id uuid references mentors(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (profile_id, mentor_id)
);

alter table profiles enable row level security;
alter table profile_skills enable row level security;
alter table profile_experience enable row level security;
alter table saved_jobs enable row level security;
alter table dismissed_jobs enable row level security;
alter table applications enable row level security;
alter table message_threads enable row level security;
alter table messages enable row level security;
alter table connections enable row level security;
alter table endorsements_received enable row level security;
alter table event_rsvps enable row level security;
alter table mentor_requests enable row level security;

create policy "own rows" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own rows" on profile_skills for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on profile_experience for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on saved_jobs for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on dismissed_jobs for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on applications for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on connections for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on endorsements_received for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on event_rsvps for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own rows" on mentor_requests for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "own threads" on message_threads for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "own thread messages" on messages for all
  using (exists (select 1 from message_threads t where t.id = thread_id and t.profile_id = auth.uid()))
  with check (exists (select 1 from message_threads t where t.id = thread_id and t.profile_id = auth.uid()));

-- Auto-create a profile row (with the same starter content the prototype
-- shipped) whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, headline, location, about)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New candidate'),
    'Add a headline',
    'Add your location',
    'Tell recruiters what you do.'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage buckets for resumes and avatars (private; access via signed URLs
-- or per-owner RLS on storage.objects).
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', false) on conflict do nothing;

create policy "own resume files" on storage.objects for all
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "own avatar files" on storage.objects for all
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
