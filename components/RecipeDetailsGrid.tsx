import { Recipe } from '@/models/Recipe';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RecipeFormField } from './RecipeFormField';

interface RecipeDetailsGridProps {
    recipe: Recipe | null;
    isEditing: boolean;
    onFieldChange: (field: keyof Recipe, value: any) => void;
}

export const RecipeDetailsGrid: React.FC<RecipeDetailsGridProps> = ({
    recipe,
    isEditing,
    onFieldChange,
}) => {
    return (
        <View style={styles.detailsGrid}>
            <RecipeFormField
                label="Prep Time"
                value={recipe?.prepTime}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('prepTime', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Prep time in minutes"
                suffix=" mins"
            />

            <RecipeFormField
                label="Cook Time"
                value={recipe?.cookTime}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('cookTime', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Cook time in minutes"
                suffix=" mins"
            />

            <RecipeFormField
                label="Servings"
                value={recipe?.servingSize}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('servingSize', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Number of servings"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
});
