import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const { user, signOut } = useAuth();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                    <Text style={styles.avatarText}>{user?.username?.charAt(0) || 'U'}</Text>
                </View>
                <Text style={styles.profileName}>{user?.username || 'User'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="person" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Edit Profile</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="notifications" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="shield" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Privacy</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="color-palette" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Appearance</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="language" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Language</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="help-circle" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Help & FAQ</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="document-text" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Terms of Service</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuContent}>
                        <Ionicons name="lock-closed" size={24} color="#E6B36D" />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                <Ionicons name="log-out" size={24} color="#FFF" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>MealShare v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#48426D',
    },
    header: {
        padding: 16,
        paddingTop: 0, // Remove top padding to eliminate space
        backgroundColor: '#312C51',
        borderBottomWidth: 0, // Remove bottom border
    },
    headerTitle: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 24,
        color: '#FFF',
        textAlign: 'center',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#312C51',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E6B36D',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#312C51',
    },
    profileName: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 4,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 18,
        color: '#E6B36D',
        marginBottom: 8,
        marginLeft: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#312C51',
        borderRadius: 10,
        marginBottom: 10,
    },
    menuContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        fontFamily: 'Ubuntu',
        fontSize: 16,
        color: '#FFF',
        marginLeft: 16,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: '#FF6B6B',
        paddingVertical: 16,
        borderRadius: 10,
    },
    signOutText: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 16,
        color: '#FFF',
        marginLeft: 8,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        paddingBottom: 24,
    },
    footerText: {
        fontFamily: 'Ubuntu',
        fontSize: 14,
        color: '#AAA',
    },
});
