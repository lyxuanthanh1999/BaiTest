import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserInfo {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
}

interface AuthStateData {
    token: string | null;
    user: UserInfo | null;
    isAuthenticated: boolean;
}

interface AuthState extends AuthStateData {
    setAuth: (token: string, user: UserInfo) => void;
    clearAuth: () => void;
}

const initialState: AuthStateData = {
    token: null,
    user: null,
    isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...initialState,

            setAuth: (token: string, user: UserInfo) =>
                set({
                    token,
                    user,
                    isAuthenticated: true,
                }),

            clearAuth: () => set(initialState),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
