import { User } from '@/models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, usePathname } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of auth context
interface AuthContextType {
    isLoading: boolean;
    userToken: string | null;
    user: User | null;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
    isSignedIn: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
    isLoading: true,
    userToken: null,
    user: null,
    signIn: async () => { },
    signOut: async () => { },
    isSignedIn: false,
});

// Storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Provider component that wraps the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();

    // Check for stored token and user on startup
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem(TOKEN_KEY);
                const userJson = await AsyncStorage.getItem(USER_KEY);

                if (token && userJson) {
                    setUserToken(token);
                    setUser(JSON.parse(userJson));
                }
            } catch (e) {
                console.error('Failed to load auth data', e);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAsync();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            // If not loading and no token, redirect to login
            if (!userToken) {
                // Don't redirect if already on login or register page
                if (pathname !== '/login' && pathname !== '/register') {
                    console.log('No auth token found, redirecting to login');
                    router.replace('/login');
                }
            } else {
                // If user is authenticated but on login/register page, redirect to home
                if (pathname === '/login' || pathname === '/register') {
                    console.log('User already authenticated, redirecting to home');
                    router.replace('/');
                }
            }
        }
    }, [isLoading, userToken, pathname]);

    // Sign in function
    const signIn = async (token: string, userData: User) => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

            setUserToken(token);
            setUser(userData);

            // Navigate to the home screen
            router.replace('/');
        } catch (e) {
            console.error('Failed to save auth data', e);
        }
    };

    // Sign out function
    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(USER_KEY);

            setUserToken(null);
            setUser(null);

            // Navigate to the login screen
            router.replace('/login');
        } catch (e) {
            console.error('Failed to remove auth data', e);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                user,
                signIn,
                signOut,
                isSignedIn: !!userToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};