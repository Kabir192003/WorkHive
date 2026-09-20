import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, DEMO_EMAIL, DEMO_PASSWORD } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
    const [profile, setProfile] = useState(null);

    const loadProfile = useCallback(async (userId) => {
        if (!userId) { setProfile(null); return; }
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
        setProfile(data || null);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            loadProfile(data.session?.user?.id);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
            setSession(sess);
            loadProfile(sess?.user?.id);
        });
        return () => sub.subscription.unsubscribe();
    }, [loadProfile]);

    const signUp = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email, password, options: { data: { name } },
        });
        return { data, error };
    };

    const signIn = async (email, password) => supabase.auth.signInWithPassword({ email, password });

    const signInDemo = async () => supabase.auth.signInWithPassword({ email: DEMO_EMAIL, password: DEMO_PASSWORD });

    const signOut = async () => supabase.auth.signOut();

    const refreshProfile = () => loadProfile(session?.user?.id);

    const updateProfile = async (patch) => {
        if (!session?.user?.id) return { error: new Error('Not signed in') };
        const { data, error } = await supabase
            .from('profiles')
            .update(patch)
            .eq('id', session.user.id)
            .select()
            .single();
        if (data) setProfile(data);
        return { data, error };
    };

    const value = {
        session,
        user: session?.user || null,
        profile,
        loading: session === undefined,
        isDemo: session?.user?.email === DEMO_EMAIL,
        signUp,
        signIn,
        signInDemo,
        signOut,
        refreshProfile,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
