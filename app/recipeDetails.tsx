import { IngredientSection } from '@/components/IngredientSection';
import { NutritionSection } from '@/components/NutritionSection';
import { RecipeDetailsGrid } from '@/components/RecipeDetailsGrid';
import { RecipeHeader } from '@/components/RecipeHeader';
import { RecipeSection } from '@/components/RecipeSection';
import { useAuth } from '@/contexts/AuthContext';
import { Recipe } from '@/models/Recipe';
import ApiClient from '@/services/ApiClient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RecipeDetailsScreen() {
    const { user } = useAuth();
    const { recipeId, isCreating } = useLocalSearchParams<{ recipeId: string, isCreating: string }>(); // url params
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(isCreating === 'true');
    const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const isNewRecipe = isCreating === 'true';
    const isOwner = isNewRecipe || (user && recipe?.user && user.id === recipe.user.id);

    useEffect(() => {
        if (isCreating === 'true') {
            // Creating a new recipe
            const newRecipe: Recipe = {
                title: '',
                description: '',
                ingredients: [],
                user: user || undefined
            };
            setRecipe(newRecipe);
            setEditedRecipe(newRecipe);
            setLoading(false);
            return;
        }

        if (!recipeId) {
            setError('Recipe ID is missing');
            setLoading(false);
            return;
        }

        const fetchRecipeDetails = async () => {
            try {
                const response = await ApiClient.getRecipeById(parseInt(recipeId));
                setRecipe(response.data);
                setEditedRecipe(response.data); // Initialize edited recipe with original data
            } catch (err) {
                console.error('Error fetching recipe details:', err);
                setError('Failed to load recipe details');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [recipeId, isCreating, user]);

    // Handle starting edit mode
    const handleEditPress = () => {
        setIsEditing(true);
    };

    // Handle canceling edit mode
    const handleCancelEdit = () => {
        if (isNewRecipe) {
            // If canceling a new recipe creation, go back to dashboard
            router.back();
        } else {
            setEditedRecipe(recipe); // Reset to original recipe data
            setIsEditing(false);
        }
    };

    // Handle saving edited recipe
    const handleSaveEdit = async () => {
        if (!editedRecipe) return;

        setIsSaving(true);
        try {
            let response; if (isCreating === 'true') {
                // Create new recipe
                response = await ApiClient.createRecipe(editedRecipe);

                // Show success message
                const successMessage = 'Recipe created successfully';
                if (Platform.OS === 'web') {
                    window.alert(successMessage);
                } else {
                    Alert.alert('Success', successMessage);
                }

                // Navigate to dashboard with the user's ID
                if (user) {
                    router.replace({
                        pathname: '/dashboard',
                        params: { userId: user.id.toString(), username: user.username }
                    });
                } else {
                    router.replace('/');
                }
            } else {
                // Update existing recipe
                response = await ApiClient.updateRecipe(parseInt(recipeId!), editedRecipe);
                setRecipe(response.data);
                setEditedRecipe(response.data);
                setIsEditing(false);

                if (user) {
                    router.replace({
                        pathname: '/dashboard',
                        params: { userId: user.id.toString(), username: user.username }
                    });
                } else {
                    router.replace('/');
                }
            }
        } catch (err) {
            console.error('Error saving recipe:', err);

            // Use platform-specific alert for the error message
            const errorMessage = 'Failed to save recipe. Please try again.';
            if (Platform.OS === 'web') {
                window.alert('Error: ' + errorMessage);
            } else {
                Alert.alert('Error', errorMessage);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Handle deleting recipe
    const handleDeletePress = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
                deleteRecipe();
            }
        } else {
            Alert.alert(
                'Delete Recipe',
                'Are you sure you want to delete this recipe? This action cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: deleteRecipe
                    }
                ]
            );
        }
    };

    // Delete recipe function
    const deleteRecipe = async () => {
        if (!recipeId) return;

        setLoading(true);
        try {
            await ApiClient.deleteRecipe(parseInt(recipeId));

            if (Platform.OS === 'web') {
                window.alert('Recipe deleted successfully');
                router.replace('/');
            } else {
                Alert.alert('Success', 'Recipe deleted successfully', [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/')
                    }
                ]);
            }
        } catch (err) {
            console.error('Error deleting recipe:', err);

            if (Platform.OS === 'web') {
                window.alert('Error: Failed to delete recipe. Please try again.');
            } else {
                Alert.alert('Error', 'Failed to delete recipe. Please try again.');
            }
            setLoading(false);
        }
    };

    // Handle editing a field in the recipe
    const handleEditField = (field: keyof Recipe, value: any) => {
        if (!editedRecipe) return;
        setEditedRecipe({
            ...editedRecipe,
            [field]: value
        });
    }; if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#48426D' }}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#E6B36D" />
                </View>
            </SafeAreaView>
        );
    }

    if (error || (!recipe && !isNewRecipe)) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || 'Recipe not found'}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <RecipeHeader
                recipe={isEditing ? editedRecipe : recipe}
                isEditing={isEditing}
                isNewRecipe={isNewRecipe}
                isOwner={isOwner}
                onEditPress={handleEditPress}
                onDeletePress={handleDeletePress}
                onFieldChange={handleEditField}
                isSaving={isSaving}
                onSavePress={handleSaveEdit}
                onCancelPress={handleCancelEdit}
                loggedInUser={user}
            />

            {(recipe?.description || isEditing) && (
                <RecipeSection title="Description">
                    {isEditing ? (
                        <TextInput
                            style={styles.editTextArea}
                            value={editedRecipe?.description || ''}
                            onChangeText={(text) => handleEditField('description', text)}
                            placeholder="Add a description"
                            placeholderTextColor="#aaa"
                            multiline
                            numberOfLines={4}
                        />
                    ) : (
                        <Text style={styles.descriptionText}>{recipe?.description || ''}</Text>
                    )}
                </RecipeSection>
            )}

            {(recipe?.ingredients && recipe.ingredients.length > 0) || isEditing ? (
                <RecipeSection title="Ingredients">
                    <IngredientSection
                        ingredients={isEditing ? (editedRecipe?.ingredients || []) : (recipe?.ingredients || [])}
                        isEditing={isEditing}
                        onIngredientChange={(ingredients) => handleEditField('ingredients', ingredients)}
                    />
                </RecipeSection>
            ) : null}

            <RecipeSection title="Details">
                <RecipeDetailsGrid
                    recipe={isEditing ? editedRecipe : recipe}
                    isEditing={isEditing}
                    onFieldChange={handleEditField}
                />
            </RecipeSection>

            {(recipe?.calories !== undefined || recipe?.protein !== undefined ||
                recipe?.carbs !== undefined || recipe?.fat !== undefined || isEditing) && (
                    <RecipeSection title="Nutrition (per serving)">
                        <NutritionSection
                            recipe={isEditing ? editedRecipe : recipe}
                            isEditing={isEditing}
                            onFieldChange={handleEditField}
                        />
                    </RecipeSection>
                )}

            {(recipe?.link || isEditing) && (
                <RecipeSection title="Original Recipe Link">
                    {isEditing ? (
                        <TextInput
                            style={styles.editInput}
                            value={editedRecipe?.link || ''}
                            onChangeText={(text) => handleEditField('link', text)}
                            placeholder="Add a link to the original recipe"
                            placeholderTextColor="#aaa"
                        />
                    ) : (
                        <Text style={styles.linkText}>{recipe?.link}</Text>
                    )}
                </RecipeSection>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#48426D',
        paddingTop: 0, // Remove top padding to eliminate space
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    descriptionText: {
        fontFamily: 'Ubuntu',
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
    },
    editInput: {
        fontFamily: 'Ubuntu',
        fontSize: 24,
        color: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E6B36D',
        paddingVertical: 4,
        marginBottom: 4,
    },
    editTextArea: {
        fontFamily: 'Ubuntu',
        color: '#FFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(230, 179, 109, 0.5)',
        borderRadius: 8,
        padding: 8,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    linkText: {
        fontFamily: 'Ubuntu',
        color: '#E6B36D',
        fontSize: 16,
        textDecorationLine: 'underline',
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
    },
});
