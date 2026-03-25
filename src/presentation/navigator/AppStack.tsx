import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import { RootNavigator } from '@/data/services';
import authQueries from '@/data/queries/authQueries';

import { KeyboardViewSpacer } from '../components/keyboardSpace';
import { Counter, LoginPage, MainPage, SignUpPage } from '../screens';
import { Box } from '../components/ui';

import { RouteName } from '@/shared/constants';
import { screenOptions } from '@/shared/helper';

const Stack = createStackNavigator<RootStackParamList>();

const AppStack = () => {
    const { data: session, isLoading } = authQueries.useSession();

    if (isLoading) {
        return (
            <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="white">
                <ActivityIndicator size="large" color="#6366f1" />
            </Box>
        );
    }

    const initialRoute = session ? RouteName.Main : RouteName.Login;

    return (
        <KeyboardViewSpacer>
            <NavigationContainer ref={RootNavigator.navigationRef}>
                <Stack.Navigator screenOptions={screenOptions} initialRouteName={initialRoute}>
                    <Stack.Screen name={RouteName.Login} component={LoginPage} />
                    <Stack.Screen name={RouteName.SignUp} component={SignUpPage} />
                    <Stack.Screen name={RouteName.Main} component={MainPage} />
                    <Stack.Screen name={RouteName.Counter} component={Counter} />
                </Stack.Navigator>
            </NavigationContainer>
        </KeyboardViewSpacer>
    );
};

export default AppStack;

