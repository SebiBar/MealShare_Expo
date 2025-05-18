import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface RecipeFormFieldProps {
    label: string;
    value?: string | number;
    placeholder?: string;
    isEditing: boolean;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    suffix?: string;
}

export const RecipeFormField: React.FC<RecipeFormFieldProps> = ({
    label,
    value,
    placeholder,
    isEditing,
    onChangeText,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    maxLength,
    suffix,
}) => {
    const stringValue = value !== undefined ? value.toString() : '';
    const displayValue = suffix ? `${value}${suffix}` : stringValue;

    return (
        <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}</Text>
            {isEditing ? (
                <TextInput
                    style={multiline ? styles.editTextArea : styles.inputNumber}
                    value={stringValue}
                    onChangeText={onChangeText}
                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#aaa"
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                />
            ) : (
                <Text style={styles.detailValue}>
                    {value !== undefined ? displayValue : '-'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    detailItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    detailLabel: {
        fontFamily: 'Ubuntu',
        fontSize: 14,
        color: '#CCC',
        marginBottom: 4,
    },
    detailValue: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
        color: '#FFF',
    },
    inputNumber: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(230, 179, 109, 0.5)',
        borderRadius: 4,
        padding: 8,
        width: '100%',
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
        width: '100%',
    },
});
