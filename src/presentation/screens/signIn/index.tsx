import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Keyboard } from 'react-native';
import { z } from 'zod';

import { RootNavigator } from '@/data/services';
import authQueries from '@/data/queries/authQueries';

import { ControlledInput } from '@/presentation/components/input';
import { MyTouchable } from '@/presentation/components/touchable';
import { Box, ScrollView, Text, VStack } from '@/presentation/components/ui';
import { Colors, RouteName } from '@/shared/constants';
import { appConfig } from '@/shared/config/app-config';
import { loginSchema } from '@/shared/validation/schemas';

type LoginFormData = z.infer<typeof loginSchema>;

const RNLogo = React.memo(() => (
    <Box
        width={120}
        height={120}
        backgroundColor={Colors.primaryColor}
        borderRadius={30}
        alignItems="center"
        justifyContent="center"
        shadowColor={Colors.primaryColor}
        shadowOffset={{ width: 0, height: 8 }}
        shadowOpacity={0.4}
        shadowRadius={12}
        elevation={10}
        marginBottom={20}
        overflow="visible">
        <Box
            width={100}
            height={100}
            borderRadius={25}
            borderWidth={3}
            borderColor="white"
            alignItems="center"
            justifyContent="center"
            overflow="visible">
            <Box height={50} alignItems="center" justifyContent="center" overflow="visible">
                <Text
                    color="white"
                    fontWeight="bold"
                    fontSize={42}
                    style={{
                        includeFontPadding: false,
                        lineHeight: 50,
                    }}>
                    RN
                </Text>
            </Box>
        </Box>
    </Box>
));

RNLogo.displayName = 'RNLogo';

const AppInfoBadge = React.memo(() => (
    <VStack space="xs" alignItems="center" marginTop={16}>
        <Text size="3xl" fontWeight="bold" color="#0f172a">
            Welcome Back
        </Text>
        <Box
            flexDirection="row"
            alignItems="center"
            paddingHorizontal={10}
            paddingVertical={4}
            backgroundColor="#e2e8f0"
            borderRadius={999}>
            <Text size="sm" color="#334155" fontWeight="bold">
                Flavor:
            </Text>
            <Text size="sm" color="#0f172a" marginLeft={6}>
                {appConfig.APP_FLAVOR}
            </Text>
        </Box>
        <VStack space="xs" marginTop={8}>
            <Box flexDirection="row" justifyContent="center">
                <Text size="sm" color="#64748b" marginRight={6}>
                    App Name:
                </Text>
                <Text size="sm" color="#0f172a" fontWeight="medium">
                    {appConfig.APP_NAME}
                </Text>
            </Box>
            <Box flexDirection="row" justifyContent="center">
                <Text size="sm" color="#64748b" marginRight={6}>
                    Version:
                </Text>
                <Text size="sm" color="#0f172a" fontWeight="medium">
                    {appConfig.VERSION_NAME}
                </Text>
            </Box>
            <Box flexDirection="row" justifyContent="center">
                <Text size="sm" color="#64748b" marginRight={6}>
                    Build:
                </Text>
                <Text size="sm" color="#0f172a" fontWeight="medium">
                    {appConfig.VERSION_CODE}
                </Text>
            </Box>
        </VStack>
    </VStack>
));

AppInfoBadge.displayName = 'AppInfoBadge';

const SignUpLink = React.memo(() => (
    <Box flexDirection="row" justifyContent="center" marginTop={16}>
        <Text color="#64748b" marginRight={4}>
            Don&apos;t have an account?
        </Text>
        <MyTouchable onPress={() => RootNavigator.navigate(RouteName.SignUp)}>
            <Text color={Colors.primaryColor} fontWeight="bold">
                Sign Up
            </Text>
        </MyTouchable>
    </Box>
));

SignUpLink.displayName = 'SignUpLink';

const SignInButton = React.memo<{ onPress: () => void; isLoading?: boolean }>(
    ({ onPress, isLoading }) => (
        <MyTouchable onPress={onPress} testID="login-button" disabled={isLoading}>
            <Box
                backgroundColor={isLoading ? '#94a3b8' : Colors.primaryColor}
                padding={16}
                borderRadius={16}
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
                shadowColor={Colors.primaryColor}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={5}
                marginTop={8}>
                {isLoading ? (
                    <>
                        <ActivityIndicator color="white" size="small" />
                        <Text size="xl" fontWeight="bold" color="white" marginLeft={8}>
                            Signing In...
                        </Text>
                    </>
                ) : (
                    <Text size="xl" fontWeight="bold" color="white">
                        Sign In
                    </Text>
                )}
            </Box>
        </MyTouchable>
    ),
);

SignInButton.displayName = 'SignInButton';

const ErrorMessage = React.memo<{ message?: string }>(({ message }) => {
    if (!message) return null;

    return (
        <Box
            backgroundColor="#fef2f2"
            borderColor="#fca5a5"
            borderWidth={1}
            borderRadius={12}
            padding={12}
            marginBottom={8}>
            <Text color="#dc2626" size="sm" textAlign="center">
                {message}
            </Text>
        </Box>
    );
});

ErrorMessage.displayName = 'ErrorMessage';

const Login = () => {
    const { control, handleSubmit } = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema),
    });

    const signInMutation = authQueries.useSignIn();

    const handleLogin = React.useCallback(() => {
        Keyboard.dismiss();
        handleSubmit(async (values: LoginFormData) => {
            try {
                await signInMutation.mutateAsync({
                    email: values.email,
                    password: values.password,
                });
                RootNavigator.replaceName(RouteName.Main);
            } catch {
                // Error is handled by the mutation's onError callback
            }
        })();
    }, [handleSubmit, signInMutation]);

    const handleForgotPassword = React.useCallback(() => {}, []);

    const errorMessage = signInMutation.error?.message;

    return (
        <Box flex={1} safeArea backgroundColor="white">
            <ScrollView>
                <Box flex={1} paddingHorizontal={24} paddingTop={40}>
                    <VStack alignItems="center" marginBottom={40} space="md">
                        <RNLogo />
                        <AppInfoBadge />
                        <Text size="md" color="#64748b">
                            Please sign in to your account
                        </Text>
                    </VStack>

                    <VStack space="xl">
                        <ErrorMessage message={errorMessage} />

                        <ControlledInput
                            control={control}
                            name="email"
                            placeholder="Email"
                            shouldUseFieldError={true}
                            testID="email-input"
                        />

                        <ControlledInput
                            control={control}
                            name="password"
                            placeholder="Password"
                            isPassword
                            shouldUseFieldError={true}
                            testID="password-input"
                        />

                        <Box alignItems="flex-end">
                            <MyTouchable onPress={handleForgotPassword}>
                                <Text color={Colors.primaryColor} fontWeight="bold">
                                    Forgot Password?
                                </Text>
                            </MyTouchable>
                        </Box>

                        <SignInButton onPress={handleLogin} isLoading={signInMutation.isPending} />
                        <SignUpLink />
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default React.memo(Login);

