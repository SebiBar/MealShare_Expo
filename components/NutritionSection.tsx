import { Recipe } from '@/models/Recipe';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RecipeFormField } from './RecipeFormField';

interface NutritionSectionProps {
    recipe: Recipe | null;
    isEditing: boolean;
    onFieldChange: (field: keyof Recipe, value: any) => void;
}

export const NutritionSection: React.FC<NutritionSectionProps> = ({
    recipe,
    isEditing,
    onFieldChange,
}) => {
    return (
        <View style={styles.detailsGrid}>
            <RecipeFormField
                label="Calories"
                value={recipe?.calories}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('calories', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Calories (kcal)"
                suffix=" kcal"
            />

            <RecipeFormField
                label="Protein"
                value={recipe?.protein}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('protein', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Protein (g)"
                suffix="g"
            />

            <RecipeFormField
                label="Carbs"
                value={recipe?.carbs}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('carbs', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Carbs (g)"
                suffix="g"
            />

            <RecipeFormField
                label="Fat"
                value={recipe?.fat}
                isEditing={isEditing}
                onChangeText={(text) => onFieldChange('fat', text ? parseInt(text) : undefined)}
                keyboardType="numeric"
                placeholder="Fat (g)"
                suffix="g"
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
