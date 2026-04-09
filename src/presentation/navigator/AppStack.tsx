import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { RootNavigator } from '@/data/services';
import { useAuthStore } from '@/app/store/authStore';
import httpClient from '@/data/services/httpClient/httpClient';

import { KeyboardViewSpacer } from '../components/keyboardSpace';
import { LoginPage, AccountManagementPage } from '../screens';

import { RouteName } from '@/shared/constants';
import { screenOptions } from '@/shared/helper';

const Stack = createStackNavigator<RootStackParamList>();

const AppStack = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);

    // Restore JWT token to httpClient when app starts with persisted auth
    React.useEffect(() => {
        if (token) {
            httpClient.setAccessToken(token);
        }
    }, [token]);

    const initialRoute = isAuthenticated ? RouteName.AccountManagement : RouteName.Login;

    return (
        <KeyboardViewSpacer>
            <NavigationContainer ref={RootNavigator.navigationRef}>
                <Stack.Navigator screenOptions={screenOptions} initialRouteName={initialRoute}>
                    <Stack.Screen name={RouteName.Login} component={LoginPage} />
                    <Stack.Screen name={RouteName.AccountManagement} component={AccountManagementPage} />
                </Stack.Navigator>
            </NavigationContainer>
        </KeyboardViewSpacer>
    );
};

export default AppStack;
