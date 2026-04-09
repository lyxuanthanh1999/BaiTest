import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/app/store/authStore';
import { Logger } from '@/shared/helper';
import httpClient from '@/data/services/httpClient/httpClient';

import { authApi, type AuthCredentials } from '../api/authApi';

const authQueries = {
    useSignIn: () => {
        const setAuth = useAuthStore((state) => state.setAuth);

        return useMutation({
            mutationFn: (credentials: AuthCredentials) => authApi.signIn(credentials),
            onSuccess: (data) => {
                // Set JWT token on httpClient for subsequent requests
                httpClient.setAccessToken(data.access_token);
                setAuth(data.access_token, data.user);
            },
            onError: (error) => {
                Logger.error('AuthQueries', 'Sign in failed', error.message);
            },
        });
    },

    useSignOut: () => {
        const queryClient = useQueryClient();
        const clearAuth = useAuthStore((state) => state.clearAuth);

        return useMutation({
            mutationFn: authApi.signOut,
            onSuccess: () => {
                httpClient.clearSession();
                queryClient.clear();
                clearAuth();
            },
            onError: (error) => {
                Logger.error('AuthQueries', 'Sign out failed', error.message);
            },
        });
    },
};

export default authQueries;
