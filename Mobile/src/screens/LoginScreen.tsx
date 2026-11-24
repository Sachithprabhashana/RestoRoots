import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ActivityIndicator,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';

interface LoginScreenProps {
    apiBaseUrl: string;
    onAuthSuccess: (token: string, isAdmin: boolean) => void;
    onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
    apiBaseUrl,
    onAuthSuccess,
    onBack,
}) => {
    const insets = useSafeAreaInsets();
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleSubmit = async () => {
        const cleanEmail = email.trim();
        if (!cleanEmail || !password.trim() || (isRegister && !name.trim())) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        try {
            const endpoint = isRegister ? '/api/user/register' : '/api/user/login';
            const payload = isRegister
                ? { name: name.trim(), email: cleanEmail, password }
                : { email: cleanEmail, password };

            const res = await axios.post(`${apiBaseUrl}${endpoint}`, payload);

            if (res.data?.success && res.data?.token) {
                const adminFlag = Boolean(res.data.isAdmin ?? res.data.user?.isAdmin);
                await AsyncStorage.setItem('token', res.data.token);
                await AsyncStorage.setItem('isAdmin', String(adminFlag));
                onAuthSuccess(res.data.token, adminFlag);
            } else {
                Alert.alert(
                    'Authentication Failed',
                    res.data?.message || 'Please check your credentials and try again.'
                );
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                'Could not connect to the backend. Check your server and network.';
            Alert.alert('Error', msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={22} color="#262626" />
                </Pressable>
                <Text style={styles.headerTitle}>
                    {isRegister ? 'Create Account' : 'Sign In'}
                </Text>
                <View style={{ width: 34 }} />
            </View>

            <View style={styles.formBox}>
                <Text style={styles.brand}>RestoRoots.</Text>
                <Text style={styles.subtitle}>
                    {isRegister
                        ? 'Sign up to save your cart and track orders.'
                        : 'Welcome back! Sign in to continue.'}
                </Text>

                {isRegister && (
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#9ca3af"
                            style={styles.input}
                        />
                    </View>
                )}

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@example.com"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <Pressable
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={[styles.submitBtn, submitting && styles.disabledBtn]}
                >
                    {submitting ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.submitBtnText}>
                            {isRegister ? 'Register' : 'Sign In'}
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    onPress={() => setIsRegister((prev) => !prev)}
                    style={styles.switchBtn}
                >
                    <Text style={styles.switchText}>
                        {isRegister
                            ? 'Already have an account? Sign In'
                            : "Don't have an account? Create one"}
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backBtn: { padding: 6 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#262626' },
    formBox: {
        margin: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
    },
    brand: { fontSize: 26, fontWeight: '700', color: '#FF4C24' },
    subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 20 },
    fieldGroup: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1f2937',
        backgroundColor: '#f9fafb',
    },
    submitBtn: {
        marginTop: 8,
        backgroundColor: '#FF4C24',
        paddingVertical: 14,
        borderRadius: 999,
        alignItems: 'center',
    },
    disabledBtn: { opacity: 0.7 },
    submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
    switchBtn: { marginTop: 16, alignItems: 'center' },
    switchText: { fontSize: 13, fontWeight: '600', color: '#49557e' },
});