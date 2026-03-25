import { supabase } from '../services/supabase';

export interface AuthCredentials {
    email: string;
    password: string;
}

export const authApi = {
    signIn: async ({ email, password }: AuthCredentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return data;
    },

    signUp: async ({ email, password }: AuthCredentials) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return data;
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }
    },

    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        return data.session;
    },
};
