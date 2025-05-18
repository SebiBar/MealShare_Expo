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
    }; const handleRegister = () => {
        // Navigate to register screen
        router.push('/register' as any);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>MealShare</Text>

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
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" size="small" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleRegister} style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? Register now!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#48426D',  // Dark purple background as shown in image
        justifyContent: 'center',
        alignItems: 'center',
    }, card: {
        backgroundColor: '#312C51',  // Same as background for seamless look
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
        marginBottom: 16,
        textAlign: 'center',
    },
    errorText: {
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
    },
    loginButton: {
        backgroundColor: '#E6B36D',  // Golden/amber button color
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
        width: '100%',
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        marginTop: 16,
        padding: 8,
    },
    registerText: {
        fontFamily: 'Ubuntu',
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
