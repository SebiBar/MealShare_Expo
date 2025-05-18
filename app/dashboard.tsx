import { useAuth } from '@/contexts/AuthContext';
import { Recipe } from '@/models/Recipe';
import { User } from '@/models/User';
import ApiClient from '@/services/ApiClient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
    const { userId, username } = useLocalSearchParams<{ userId: string, username: string }>();
    const { user: loggedInUser } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');    // Check if current user is viewing their own dashboard
    const isCurrentUserDashboard = loggedInUser && userId && loggedInUser.id === parseInt(userId);

    useEffect(() => {
        // Log the variables to troubleshoot the FAB visibility condition
        console.log('loggedInUser:', loggedInUser);
        console.log('userId:', userId);
        console.log('isCurrentUserDashboard:', isCurrentUserDashboard);
        if (!userId) {
            setError('User ID is missing');
            setLoading(false);
            return;
        }

        // Set the user data from URL parameters
        if (userId && username) {
            setUser({
                id: parseInt(userId),
                username: username
            });
        }

        const fetchUserRecipes = async () => {
            try {
                const response = await ApiClient.getUserRecipes(parseInt(userId));
                console.log('API response:', response.data);
                setRecipes(response.data);
            } catch (err) {
                console.error('Error fetching user recipes:', err);
                setError('Failed to load user recipes');
            } finally {
                setLoading(false);
            }
        };

        fetchUserRecipes();
    }, [userId, username]);

    const handleRecipePress = (recipeId: number) => {
        router.push({
            pathname: '/recipeDetails',
            params: { recipeId }
        });
    };

    const renderRecipeItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => item.id && handleRecipePress(item.id)}
        >
            <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                {item.description && (
                    <Text style={styles.recipeDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#E6B36D" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#48426D' }}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#E6B36D" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#48426D' }}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{user?.username || 'User'}'s Recipes</Text>
                </View>

                {recipes.length === 0 ? (
                    <View style={styles.noRecipes}>
                        <Text style={styles.noRecipesText}>No recipes found</Text>
                    </View>
                ) : (
                    <FlatList
                        data={recipes}
                        renderItem={renderRecipeItem}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        contentContainerStyle={styles.recipesList}
                    />
                )}
                {isCurrentUserDashboard && (
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => router.push({
                            pathname: '/recipeDetails',
                            params: { isCreating: 'true' }
                        })}
                    >
                        <Ionicons name="add" size={30} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#48426D',
    }, container: {
        flex: 1,
        backgroundColor: '#48426D',
        paddingTop: 0, // Remove top padding
        position: 'relative', // To make sure the FAB positioning works correctly
    }, header: {
        padding: 16,
        paddingTop: 0, // Remove top padding to eliminate space
        backgroundColor: '#312C51',
        borderBottomWidth: 0, // Remove bottom border
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 24,
        color: '#FFF',
        textAlign: 'center',
    },
    recipesList: {
        padding: 16,
    },
    recipeItem: {
        backgroundColor: '#312C51',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    recipeContent: {
        flex: 1,
        paddingRight: 10,
    },
    recipeTitle: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        color: '#FFF',
        marginBottom: 4,
    },
    recipeDescription: {
        fontFamily: 'Ubuntu',
        color: '#CCC',
        fontSize: 14,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#48426D',
        paddingTop: 70,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontFamily: 'Ubuntu',
        textAlign: 'center',
    }, noRecipes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noRecipesText: {
        fontFamily: 'Ubuntu',
        fontSize: 18,
        color: '#CCC',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#E6B36D',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        zIndex: 999,
    },
});
