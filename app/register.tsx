import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/models/Auth';
import ApiClient from '@/services/ApiClient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RegisterScreen() {
    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        // Reset error state
        setError('');

        // Form validation
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);

            // Create register request object
            const registerRequest: RegisterRequest = {
                username,
                email,
                password
            };

            // Make register API call
            const response = await ApiClient.register(registerRequest);

            // Use the auth context to sign in with the returned token and user
            await signIn(response.data.token, response.data.user);
            // AuthContext will handle navigation to home

        } catch (error: any) {
            // Handle registration errors
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        // Navigate to login screen
        router.push('/login');
    }; return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>MealShare</Text>
                <Text style={styles.subtitle}>Create Account</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />

                <TextInput
                    style={styles.input}
                    placeholder="email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />

                <TextInput
                    style={styles.input}
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />

                <TextInput
                    style={styles.input}
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" size="small" />
                    ) : (
                        <Text style={styles.registerButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#48426D',  // Dark purple background
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#312C51',  // Dark card background
        borderWidth: 1,
        borderColor: '#FAD1A1',
        borderRadius: 12,
        padding: 24,
        paddingBottom: 30,
        width: '90%',
        maxWidth: 300,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Ubuntu',
        fontSize: 18,
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
        fontFamily: 'Ubuntu',
        color: '#FF3B30',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#E8E8E8',
        borderRadius: 20,
        padding: 12,
        paddingLeft: 16,
        fontSize: 16,
        width: '100%',
        marginVertical: 8,
        fontFamily: 'Ubuntu',
    },
    registerButton: {
        backgroundColor: '#E6B36D',  // Amber button color
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
        width: '100%',
    },
    registerButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        marginTop: 16,
        padding: 8,
    },
    loginText: {
        fontFamily: 'Ubuntu',
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
