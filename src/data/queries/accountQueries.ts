import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Logger } from '@/shared/helper';

import {
    accountApi,
    type CreateAccountPayload,
    type UpdateAccountPayload,
} from '../api/accountApi';

const ACCOUNTS_QUERY_KEY = ['accounts'];

const accountQueries = {
    useAccounts: () => {
        return useQuery({
            queryKey: ACCOUNTS_QUERY_KEY,
            queryFn: accountApi.getAll,
            staleTime: 30 * 1000,
        });
    },

    useCreateAccount: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (payload: CreateAccountPayload) => accountApi.create(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
            },
            onError: (error) => {
                Logger.error('AccountQueries', 'Create account failed', error.message);
            },
        });
    },

    useUpdateAccount: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({ id, ...payload }: UpdateAccountPayload & { id: number }) =>
                accountApi.update(id, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
            },
            onError: (error) => {
                Logger.error('AccountQueries', 'Update account failed', error.message);
            },
        });
    },

    useDeleteAccount: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (id: number) => accountApi.remove(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
            },
            onError: (error) => {
                Logger.error('AccountQueries', 'Delete account failed', error.message);
            },
        });
    },
};

export default accountQueries;
