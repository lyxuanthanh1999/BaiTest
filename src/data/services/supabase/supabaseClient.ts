import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

import { appConfig } from '@/shared/config/app-config';

const supabaseUrl = appConfig.SUPABASE_URL || Config.SUPABASE_URL || '';
const supabaseAnonKey = appConfig.SUPABASE_ANON_KEY || Config.SUPABASE_ANON_KEY || '';

if (__DEV__) {
    console.log('[Supabase] URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING');
    console.log('[Supabase] Anon Key:', supabaseAnonKey ? 'SET' : 'MISSING');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

