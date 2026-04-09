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
import { loginSchema } from '@/shared/validation/schemas';

type LoginFormData = z.infer<typeof loginSchema>;

const AppLogo = React.memo(() => (
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
                    fontSize={36}
                    style={{
                        includeFontPadding: false,
                        lineHeight: 42,
                    }}>
                    🔐
                </Text>
            </Box>
        </Box>
    </Box>
));

AppLogo.displayName = 'AppLogo';

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
            username: '',
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
                    username: values.username,
                    password: values.password,
                });
                RootNavigator.replaceName(RouteName.AccountManagement);
            } catch {
                // Error is handled by the mutation's onError callback
            }
        })();
    }, [handleSubmit, signInMutation]);

    const errorMessage = signInMutation.error?.message;

    return (
        <Box flex={1} safeArea backgroundColor="white">
            <ScrollView>
                <Box flex={1} paddingHorizontal={24} paddingTop={60}>
                    <VStack alignItems="center" marginBottom={40} space="md">
                        <AppLogo />
                        <Text size="3xl" fontWeight="bold" color="#0f172a">
                            Account Manager
                        </Text>
                        <Text size="md" color="#64748b">
                            Please sign in to continue
                        </Text>
                    </VStack>

                    <VStack space="xl">
                        <ErrorMessage message={errorMessage} />

                        <ControlledInput
                            control={control}
                            name="username"
                            placeholder="Username"
                            shouldUseFieldError={true}
                            testID="username-input"
                        />

                        <ControlledInput
                            control={control}
                            name="password"
                            placeholder="Password"
                            isPassword
                            shouldUseFieldError={true}
                            testID="password-input"
                        />

                        <SignInButton onPress={handleLogin} isLoading={signInMutation.isPending} />
                    </VStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default React.memo(Login);
