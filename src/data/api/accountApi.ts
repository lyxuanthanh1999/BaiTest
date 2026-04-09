import httpClient from '../services/httpClient/httpClient';
import ApiMethod from '../services/httpClient/apiMethod';

export interface AccountData {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAccountPayload {
    username: string;
    password: string;
    email?: string;
    fullName?: string;
    phone?: string;
    role?: string;
}

export interface UpdateAccountPayload {
    username?: string;
    password?: string;
    email?: string;
    fullName?: string;
    phone?: string;
    role?: string;
}

export const accountApi = {
    getAll: async (): Promise<AccountData[]> => {
        const response = await httpClient.request<AccountData[]>({
            endpoint: '/api/accounts',
            method: ApiMethod.GET,
        });

        if (!response?.ok || !response.data) {
            throw new Error('Failed to fetch accounts');
        }

        return response.data;
    },

    create: async (payload: CreateAccountPayload): Promise<AccountData> => {
        const response = await httpClient.request<AccountData>({
            endpoint: '/api/accounts',
            method: ApiMethod.POST,
            body: payload,
        });

        if (!response?.ok || !response.data) {
            throw new Error('Failed to create account');
        }

        return response.data;
    },

    update: async (id: number, payload: UpdateAccountPayload): Promise<AccountData> => {
        const response = await httpClient.request<AccountData>({
            endpoint: `/api/accounts/${id}`,
            method: ApiMethod.PATCH,
            body: payload,
        });

        if (!response?.ok || !response.data) {
            throw new Error('Failed to update account');
        }

        return response.data;
    },

    remove: async (id: number): Promise<void> => {
        const response = await httpClient.request({
            endpoint: `/api/accounts/${id}`,
            method: ApiMethod.DELETE,
        });

        if (!response?.ok) {
            throw new Error('Failed to delete account');
        }
    },
};
