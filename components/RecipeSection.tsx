import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RecipeSectionProps {
    title: string;
    children: React.ReactNode;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({ title, children }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
        backgroundColor: '#312C51',
        borderRadius: 10,
        padding: 14,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        color: '#FFF',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 8,
    },
});
