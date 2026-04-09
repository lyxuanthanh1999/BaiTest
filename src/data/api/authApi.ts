import httpClient from '../services/httpClient/httpClient';
import ApiMethod from '../services/httpClient/apiMethod';

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        username: string;
        email: string;
        fullName: string;
        role: string;
    };
}

export const authApi = {
    signIn: async ({ username, password }: AuthCredentials): Promise<LoginResponse> => {
        const response = await httpClient.request<LoginResponse>({
            endpoint: '/api/auth/login',
            method: ApiMethod.POST,
            body: { username, password },
        });

        if (!response?.ok || !response.data) {
            throw new Error('Login failed');
        }

        return response.data;
    },

    signOut: async () => {
        // JWT is stateless, just clear client-side token
        return;
    },
};
