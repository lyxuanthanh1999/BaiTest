import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Logger } from '@/shared/helper';

import { authApi, type AuthCredentials } from '../api/authApi';

const authQueries = {
    useSignIn: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (credentials: AuthCredentials) => authApi.signIn(credentials),
            onSuccess: (data) => {
                queryClient.setQueryData(['auth', 'session'], data.session);
            },
            onError: (error) => {
                Logger.error('AuthQueries', 'Sign in failed', error.message);
            },
        });
    },

    useSignUp: () => {
        return useMutation({
            mutationFn: (credentials: AuthCredentials) => authApi.signUp(credentials),
            onError: (error) => {
                Logger.error('AuthQueries', 'Sign up failed', error.message);
            },
        });
    },

    useSignOut: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: authApi.signOut,
            onSuccess: () => {
                queryClient.setQueryData(['auth', 'session'], null);
                queryClient.clear();
            },
            onError: (error) => {
                Logger.error('AuthQueries', 'Sign out failed', error.message);
            },
        });
    },

    useSession: () => {
        return useQuery({
            queryKey: ['auth', 'session'],
            queryFn: authApi.getSession,
            staleTime: 5 * 60 * 1000,
            retry: false,
        });
    },
};

export default authQueries;
