import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StatusBar,
    TextInput,
    StyleSheet,
    useColorScheme,
} from 'react-native';

import { RootNavigator } from '@/data/services';
import authQueries from '@/data/queries/authQueries';
import accountQueries from '@/data/queries/accountQueries';
import type { AccountData } from '@/data/api/accountApi';

import { MyTouchable } from '@/presentation/components/touchable';
import { Box, ScrollView, Text, VStack } from '@/presentation/components/ui';
import { Colors, RouteName } from '@/shared/constants';
import { useAuthStore } from '@/app/store/authStore';

// ─── Account Form Modal ─────────────────────────────────────────────────────
interface AccountFormState {
    username: string;
    password: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
}

const emptyForm: AccountFormState = {
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'user',
};

const AccountFormModal = React.memo<{
    visible: boolean;
    editAccount: AccountData | null;
    onClose: () => void;
    onSubmit: (form: AccountFormState) => void;
    isLoading: boolean;
}>(({ visible, editAccount, onClose, onSubmit, isLoading }) => {
    const [form, setForm] = React.useState<AccountFormState>(emptyForm);

    React.useEffect(() => {
        if (editAccount) {
            setForm({
                username: editAccount.username || '',
                password: '',
                email: editAccount.email || '',
                fullName: editAccount.fullName || '',
                phone: editAccount.phone || '',
                role: editAccount.role || 'user',
            });
        } else {
            setForm(emptyForm);
        }
    }, [editAccount, visible]);

    const isEditing = !!editAccount;
    const title = isEditing ? 'Edit Account' : 'Add Account';

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <Box flex={1} backgroundColor="rgba(0,0,0,0.5)" justifyContent="center" paddingHorizontal={20}>
                <Box backgroundColor="white" borderRadius={24} padding={24}>
                    <Text size="2xl" fontWeight="bold" color="#0f172a" marginBottom={20}>
                        {title}
                    </Text>

                    <VStack space="md">
                        <Box>
                            <Text size="sm" color="#64748b" marginBottom={4}>Username *</Text>
                            <TextInput
                                style={styles.input}
                                value={form.username}
                                onChangeText={(v) => setForm((p) => ({ ...p, username: v }))}
                                placeholder="Enter username"
                                autoCapitalize="none"
                            />
                        </Box>

                        <Box>
                            <Text size="sm" color="#64748b" marginBottom={4}>
                                Password {isEditing ? '(leave empty to keep)' : '*'}
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={form.password}
                                onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
                                placeholder={isEditing ? 'Leave empty to keep current' : 'Enter password'}
                                secureTextEntry
                            />
                        </Box>

                        <Box>
                            <Text size="sm" color="#64748b" marginBottom={4}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={form.email}
                                onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                                placeholder="Enter email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </Box>

                        <Box>
                            <Text size="sm" color="#64748b" marginBottom={4}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={form.fullName}
                                onChangeText={(v) => setForm((p) => ({ ...p, fullName: v }))}
                                placeholder="Enter full name"
                            />
                        </Box>

                        <Box>
                            <Text size="sm" color="#64748b" marginBottom={4}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={form.phone}
                                onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />
                        </Box>

                        <Box>
                            <Text size="sm" color="#64748b" marginBottom={4}>Role</Text>
                            <Box flexDirection="row" gap={8}>
                                <MyTouchable onPress={() => setForm((p) => ({ ...p, role: 'user' }))}>
                                    <Box
                                        paddingHorizontal={16}
                                        paddingVertical={8}
                                        borderRadius={12}
                                        backgroundColor={form.role === 'user' ? Colors.primaryColor : '#f1f5f9'}
                                    >
                                        <Text
                                            size="sm"
                                            fontWeight="bold"
                                            color={form.role === 'user' ? 'white' : '#64748b'}
                                        >
                                            User
                                        </Text>
                                    </Box>
                                </MyTouchable>
                                <MyTouchable onPress={() => setForm((p) => ({ ...p, role: 'admin' }))}>
                                    <Box
                                        paddingHorizontal={16}
                                        paddingVertical={8}
                                        borderRadius={12}
                                        backgroundColor={form.role === 'admin' ? '#f59e0b' : '#f1f5f9'}
                                    >
                                        <Text
                                            size="sm"
                                            fontWeight="bold"
                                            color={form.role === 'admin' ? 'white' : '#64748b'}
                                        >
                                            Admin
                                        </Text>
                                    </Box>
                                </MyTouchable>
                            </Box>
                        </Box>
                    </VStack>

                    <Box flexDirection="row" gap={12} marginTop={24}>
                        <Box flex={1}>
                            <MyTouchable onPress={onClose}>
                                <Box
                                    padding={14}
                                    borderRadius={14}
                                    backgroundColor="#f1f5f9"
                                    alignItems="center"
                                >
                                    <Text size="md" fontWeight="bold" color="#64748b">
                                        Cancel
                                    </Text>
                                </Box>
                            </MyTouchable>
                        </Box>
                        <Box flex={1}>
                            <MyTouchable
                                onPress={() => onSubmit(form)}
                                disabled={isLoading || !form.username || (!isEditing && !form.password)}
                            >
                                <Box
                                    padding={14}
                                    borderRadius={14}
                                    backgroundColor={
                                        isLoading || !form.username || (!isEditing && !form.password)
                                            ? '#94a3b8'
                                            : Colors.primaryColor
                                    }
                                    alignItems="center"
                                    flexDirection="row"
                                    justifyContent="center"
                                >
                                    {isLoading && <ActivityIndicator color="white" size="small" />}
                                    <Text
                                        size="md"
                                        fontWeight="bold"
                                        color="white"
                                        marginLeft={isLoading ? 8 : 0}
                                    >
                                        {isEditing ? 'Update' : 'Create'}
                                    </Text>
                                </Box>
                            </MyTouchable>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
});

AccountFormModal.displayName = 'AccountFormModal';

// ─── Account Card ────────────────────────────────────────────────────────────
const AccountCard = React.memo<{
    account: AccountData;
    onEdit: (account: AccountData) => void;
    onDelete: (account: AccountData) => void;
}>(({ account, onEdit, onDelete }) => {
    const roleColor = account.role === 'admin' ? '#f59e0b' : Colors.primaryColor;

    return (
        <Box
            backgroundColor="white"
            borderRadius={20}
            padding={16}
            marginBottom={12}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
        >
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center" flex={1}>
                    <Box
                        width={48}
                        height={48}
                        borderRadius={14}
                        backgroundColor={roleColor}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text size="lg" fontWeight="bold" color="white">
                            {account.username.charAt(0).toUpperCase()}
                        </Text>
                    </Box>
                    <Box marginLeft={12} flex={1}>
                        <Text size="md" fontWeight="bold" color="#0f172a" numberOfLines={1}>
                            {account.username}
                        </Text>
                        <Text size="sm" color="#64748b" numberOfLines={1}>
                            {account.email || 'No email'}
                        </Text>
                    </Box>
                    <Box
                        paddingHorizontal={10}
                        paddingVertical={4}
                        borderRadius={8}
                        backgroundColor={roleColor + '20'}
                    >
                        <Text size="xs" fontWeight="bold" color={roleColor}>
                            {account.role.toUpperCase()}
                        </Text>
                    </Box>
                </Box>
            </Box>

            {(account.fullName || account.phone) && (
                <Box marginTop={10} paddingTop={10} borderTopWidth={1} borderTopColor="#f1f5f9">
                    {account.fullName ? (
                        <Text size="sm" color="#475569">👤 {account.fullName}</Text>
                    ) : null}
                    {account.phone ? (
                        <Text size="sm" color="#475569" marginTop={2}>📞 {account.phone}</Text>
                    ) : null}
                </Box>
            )}

            <Box flexDirection="row" justifyContent="flex-end" gap={8} marginTop={12}>
                <MyTouchable onPress={() => onEdit(account)}>
                    <Box
                        paddingHorizontal={16}
                        paddingVertical={8}
                        borderRadius={10}
                        backgroundColor="#e0f2fe"
                    >
                        <Text size="sm" fontWeight="bold" color="#0284c7">
                            ✏️ Edit
                        </Text>
                    </Box>
                </MyTouchable>
                <MyTouchable onPress={() => onDelete(account)}>
                    <Box
                        paddingHorizontal={16}
                        paddingVertical={8}
                        borderRadius={10}
                        backgroundColor="#fee2e2"
                    >
                        <Text size="sm" fontWeight="bold" color="#dc2626">
                            🗑 Delete
                        </Text>
                    </Box>
                </MyTouchable>
            </Box>
        </Box>
    );
});

AccountCard.displayName = 'AccountCard';

// ─── Main Screen ─────────────────────────────────────────────────────────────
const AccountManagement = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const user = useAuthStore((state) => state.user);
    const signOutMutation = authQueries.useSignOut();
    const { data: accounts, isLoading, error, refetch } = accountQueries.useAccounts();
    const createMutation = accountQueries.useCreateAccount();
    const updateMutation = accountQueries.useUpdateAccount();
    const deleteMutation = accountQueries.useDeleteAccount();

    const [modalVisible, setModalVisible] = React.useState(false);
    const [editAccount, setEditAccount] = React.useState<AccountData | null>(null);

    const handleSignOut = React.useCallback(async () => {
        try {
            await signOutMutation.mutateAsync();
            RootNavigator.replaceName(RouteName.Login);
        } catch {
            // Error handled by mutation
        }
    }, [signOutMutation]);

    const handleAdd = React.useCallback(() => {
        setEditAccount(null);
        setModalVisible(true);
    }, []);

    const handleEdit = React.useCallback((account: AccountData) => {
        setEditAccount(account);
        setModalVisible(true);
    }, []);

    const handleDelete = React.useCallback(
        (account: AccountData) => {
            Alert.alert(
                'Delete Account',
                `Are you sure you want to delete "${account.username}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await deleteMutation.mutateAsync(account.id);
                            } catch {
                                Alert.alert('Error', 'Failed to delete account');
                            }
                        },
                    },
                ],
            );
        },
        [deleteMutation],
    );

    const handleFormSubmit = React.useCallback(
        async (form: AccountFormState) => {
            try {
                if (editAccount) {
                    const payload: any = {
                        id: editAccount.id,
                        username: form.username,
                        email: form.email || undefined,
                        fullName: form.fullName || undefined,
                        phone: form.phone || undefined,
                        role: form.role || undefined,
                    };
                    if (form.password) {
                        payload.password = form.password;
                    }
                    await updateMutation.mutateAsync(payload);
                } else {
                    await createMutation.mutateAsync({
                        username: form.username,
                        password: form.password,
                        email: form.email || undefined,
                        fullName: form.fullName || undefined,
                        phone: form.phone || undefined,
                        role: form.role || undefined,
                    });
                }
                setModalVisible(false);
                setEditAccount(null);
            } catch {
                Alert.alert('Error', 'Failed to save account');
            }
        },
        [editAccount, createMutation, updateMutation],
    );

    return (
        <Box flex={1} safeArea backgroundColor="#f8fafc">
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <Box
                backgroundColor="white"
                paddingHorizontal={20}
                paddingVertical={16}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.06}
                shadowRadius={8}
                elevation={3}
            >
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Text size="2xl" fontWeight="bold" color="#0f172a">
                            Account Manager
                        </Text>
                        <Text size="sm" color="#64748b" marginTop={2}>
                            Hello, {user?.username || 'Admin'} 👋
                        </Text>
                    </Box>
                    <MyTouchable onPress={handleSignOut}>
                        <Box
                            paddingHorizontal={14}
                            paddingVertical={8}
                            borderRadius={12}
                            backgroundColor="#fee2e2"
                        >
                            <Text size="sm" fontWeight="bold" color="#dc2626">
                                Logout
                            </Text>
                        </Box>
                    </MyTouchable>
                </Box>
            </Box>

            {/* Stats Bar */}
            <Box
                flexDirection="row"
                paddingHorizontal={20}
                paddingVertical={12}
                gap={12}
                marginTop={8}
            >
                <Box
                    flex={1}
                    backgroundColor="white"
                    borderRadius={16}
                    padding={14}
                    alignItems="center"
                    shadowColor="#000"
                    shadowOffset={{ width: 0, height: 1 }}
                    shadowOpacity={0.04}
                    shadowRadius={4}
                    elevation={1}
                >
                    <Text size="2xl" fontWeight="bold" color={Colors.primaryColor}>
                        {accounts?.length || 0}
                    </Text>
                    <Text size="xs" color="#64748b" marginTop={2}>
                        Total Accounts
                    </Text>
                </Box>
                <MyTouchable onPress={handleAdd}>
                    <Box
                        flex={1}
                        backgroundColor={Colors.primaryColor}
                        borderRadius={16}
                        padding={14}
                        alignItems="center"
                        justifyContent="center"
                        shadowColor={Colors.primaryColor}
                        shadowOffset={{ width: 0, height: 4 }}
                        shadowOpacity={0.3}
                        shadowRadius={8}
                        elevation={5}
                    >
                        <Text size="xl" fontWeight="bold" color="white">
                            + Add
                        </Text>
                        <Text size="xs" color="rgba(255,255,255,0.8)" marginTop={2}>
                            New Account
                        </Text>
                    </Box>
                </MyTouchable>
            </Box>

            {/* Account List */}
            <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 8 }}>
                {isLoading ? (
                    <Box flex={1} alignItems="center" justifyContent="center" paddingVertical={40}>
                        <ActivityIndicator size="large" color={Colors.primaryColor} />
                        <Text size="md" color="#64748b" marginTop={12}>
                            Loading accounts...
                        </Text>
                    </Box>
                ) : error ? (
                    <Box alignItems="center" paddingVertical={40}>
                        <Text size="xl" marginBottom={8}>⚠️</Text>
                        <Text size="md" color="#dc2626" fontWeight="bold">
                            Error loading accounts
                        </Text>
                        <Text size="sm" color="#64748b" marginTop={4}>
                            {error.message}
                        </Text>
                        <MyTouchable onPress={() => refetch()}>
                            <Box
                                marginTop={12}
                                paddingHorizontal={20}
                                paddingVertical={10}
                                borderRadius={12}
                                backgroundColor={Colors.primaryColor}
                            >
                                <Text size="sm" fontWeight="bold" color="white">
                                    Retry
                                </Text>
                            </Box>
                        </MyTouchable>
                    </Box>
                ) : accounts && accounts.length > 0 ? (
                    accounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <Box alignItems="center" paddingVertical={40}>
                        <Text size="2xl" marginBottom={8}>📭</Text>
                        <Text size="lg" fontWeight="bold" color="#94a3b8">
                            No accounts yet
                        </Text>
                        <Text size="sm" color="#94a3b8" marginTop={4}>
                            Tap "+ Add" to create one
                        </Text>
                    </Box>
                )}
                <Box height={40} />
            </ScrollView>

            {/* Form Modal */}
            <AccountFormModal
                visible={modalVisible}
                editAccount={editAccount}
                onClose={() => {
                    setModalVisible(false);
                    setEditAccount(null);
                }}
                onSubmit={handleFormSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0f172a',
        backgroundColor: '#f8fafc',
    },
});

export default AccountManagement;
