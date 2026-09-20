import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
    // eslint-disable-next-line no-console
    console.warn('Supabase env vars are missing — set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(url, anonKey);

// Fixed demo account credentials — "Continue as demo candidate" signs in
// with this real Supabase Auth user rather than faking a session.
export const DEMO_EMAIL = 'demo@workhive.app';
export const DEMO_PASSWORD = 'workhive-demo-2026';
