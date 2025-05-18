import { Ingredient } from '@/models/Ingredient';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface IngredientSectionProps {
    ingredients: Ingredient[];
    isEditing: boolean;
    onIngredientChange: (ingredients: Ingredient[]) => void;
}

export const IngredientSection: React.FC<IngredientSectionProps> = ({
    ingredients,
    isEditing,
    onIngredientChange,
}) => {
    const handleAddIngredient = () => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.push({ id: 0, name: '', quantity: '', unit: '' });
        onIngredientChange(updatedIngredients);
    };

    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        onIngredientChange(updatedIngredients);
    };

    const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: value
        };
        onIngredientChange(updatedIngredients);
    };

    return (
        <>
            {isEditing ? (
                <View>
                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientEditRow}>
                            <View style={styles.ingredientInputsContainer}>
                                <TextInput
                                    style={styles.quantityInput}
                                    value={ingredient.quantity || ''}
                                    onChangeText={(text) => handleUpdateIngredient(index, 'quantity', text)}
                                    placeholder="#"
                                    placeholderTextColor="#aaa"
                                    maxLength={4}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.unitInput}
                                    value={ingredient.unit || ''}
                                    onChangeText={(text) => handleUpdateIngredient(index, 'unit', text)}
                                    placeholder="unit"
                                    placeholderTextColor="#aaa"
                                    maxLength={5}
                                />
                                <TextInput
                                    style={styles.nameInput}
                                    value={ingredient.name}
                                    onChangeText={(text) => handleUpdateIngredient(index, 'name', text)}
                                    placeholder="ingredient"
                                    placeholderTextColor="#aaa"
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoveIngredient(index)}
                            >
                                <Ionicons name="remove-circle" size={18} color="#FF6B6B" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddIngredient}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#E6B36D" />
                        <Text style={styles.addButtonText}>Add Ingredient</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                ingredients.map((ingredient, index) => (
                    <Text key={index} style={styles.ingredientText}>
                        • {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </Text>
                ))
            )}
        </>
    );
};

const styles = StyleSheet.create({
    ingredientText: {
        fontFamily: 'Ubuntu',
        color: '#FFF',
        fontSize: 16,
        marginBottom: 8,
    },
    ingredientEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '100%',
    },
    ingredientInputsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0, // Allow child elements to shrink below their content size if needed
    },
    quantityInput: {
        fontFamily: 'Ubuntu',
        fontSize: 14,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(230, 179, 109, 0.5)',
        borderRadius: 4,
        padding: 6,
        paddingHorizontal: 4,
        width: 40,
        marginRight: 4,
    },
    unitInput: {
        fontFamily: 'Ubuntu',
        fontSize: 14,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(230, 179, 109, 0.5)',
        borderRadius: 4,
        padding: 6,
        paddingHorizontal: 4,
        width: 50,
        marginRight: 4,
    },
    nameInput: {
        fontFamily: 'Ubuntu',
        fontSize: 14,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(230, 179, 109, 0.5)',
        borderRadius: 4,
        padding: 6,
        flex: 1,
        minWidth: 10, // Ensure it doesn't collapse completely
    },
    removeButton: {
        padding: 4,
        marginLeft: 2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    addButtonText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
        color: '#E6B36D',
        marginLeft: 4,
    },
});
