import { Recipe } from '@/models/Recipe';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RecipeHeaderProps {
    recipe: Recipe | null;
    isEditing: boolean;
    isNewRecipe: boolean;
    isOwner: boolean | null | undefined;
    onEditPress: () => void;
    onDeletePress: () => void;
    onFieldChange: (field: keyof Recipe, value: any) => void;
    isSaving: boolean;
    onSavePress: () => void;
    onCancelPress: () => void;
    loggedInUser?: { id: number; username: string } | null;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
    recipe,
    isEditing,
    isNewRecipe,
    isOwner,
    onEditPress,
    onDeletePress,
    onFieldChange,
    isSaving,
    onSavePress,
    onCancelPress,
    loggedInUser,
}) => {
    return (<View style={styles.header}>
        {!isEditing && (<TouchableOpacity
            style={styles.backButton}
            onPress={() => {
                if (isNewRecipe && loggedInUser) {
                    router.replace({
                        pathname: '/dashboard',
                        params: {
                            userId: loggedInUser.id.toString(),
                            username: loggedInUser.username
                        }
                    });
                } else if (recipe?.user) {
                    router.replace({
                        pathname: '/dashboard',
                        params: {
                            userId: recipe.user.id.toString(),
                            username: recipe.user.username
                        }
                    });
                } else {
                    router.back();
                }
            }}
            accessibilityLabel="Go back to recipe owner's dashboard"
        >
            <View style={styles.backButtonContent}>
                <Ionicons name="arrow-back" size={24} color="#E6B36D" />
                <Text style={styles.backButtonText}>Back</Text>
            </View>
        </TouchableOpacity>
        )}

        <View style={styles.titleRow}>
            {isEditing ? (
                <TextInput
                    style={[styles.editInput, { flex: 1 }]}
                    value={recipe?.title || ''}
                    onChangeText={(text) => onFieldChange('title', text)}
                    placeholder="Recipe Title"
                    placeholderTextColor="#aaa"
                />
            ) : (
                <Text style={styles.title}>{recipe?.title || 'New Recipe'}</Text>
            )}

            {/* Owner Actions inline with title */}
            {isOwner && !isEditing && !isNewRecipe && (
                <View style={styles.inlineActions}>
                    <TouchableOpacity style={styles.inlineActionButton} onPress={onEditPress}>
                        <Ionicons name="create-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.inlineActionButton, styles.deleteButton]} onPress={onDeletePress}>
                        <Ionicons name="trash-outline" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            )}
        </View>

        {isEditing && (
            <View style={styles.editActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onSavePress}
                    disabled={isSaving}
                >
                    <Ionicons name="checkmark" size={24} color="#FFF" />
                    <Text style={styles.actionText}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={onCancelPress}
                    disabled={isSaving}
                >
                    <Ionicons name="close" size={24} color="#FFF" />
                    <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )}
        {recipe?.user && !isNewRecipe && (
            <Text style={styles.authorText}>by {recipe.user.username}</Text>
        )}
    </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 28,
        color: '#FFF',
        flex: 1,
    },
    backButton: {
        marginBottom: 8,
    },
    backButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        color: '#E6B36D',
        marginLeft: 5,
    },
    inlineActions: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    inlineActionButton: {
        backgroundColor: '#E6B36D',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        marginBottom: 8,
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#E6B36D',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#888',
    },
    actionText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 14,
        color: '#FFF',
        marginLeft: 4,
    },
    authorText: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        color: '#E6B36D',
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
});
