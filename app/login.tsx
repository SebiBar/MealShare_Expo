import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/models/Auth';
import ApiClient from '@/services/ApiClient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Reset error state
        setError('');

        // Validate inputs
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            setIsLoading(true);

            // Create login request object
            const loginRequest: LoginRequest = {
                username,
                password
            };
            // Make login API call
            const response = await ApiClient.login(loginRequest);

            // Use the auth context to sign in
            await signIn(response.data.token, response.data.user);

            // No need to manually navigate, AuthContext will handle it
        } catch (error: any) {
            // Handle login errors
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = () => {
        // Navigate to register screen
        router.push('/register' as any);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MealShare</Text>
            <Text style={styles.subtitle}>Sign In</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6B6B',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 24,
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 16,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    registerText: {
        color: '#666',
        fontSize: 16,
    },
    registerLink: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
