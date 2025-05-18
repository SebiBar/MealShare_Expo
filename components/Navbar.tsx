import { useAuth } from '@/contexts/AuthContext';
import { Recipe } from '@/models/Recipe';
import { Search } from '@/models/Search';
import { User } from '@/models/User';
import ApiClient from '@/services/ApiClient';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Keyboard,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface SearchResult {
    id: number;
    name: string;
    type: 'recipe' | 'user';
    username?: string;
}

export const Navbar: React.FC = () => {
    const { user } = useAuth();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchWidth = useRef(new Animated.Value(40)).current;
    const searchInputRef = useRef<TextInput>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Function to handle debounced search
    const debouncedSearch = (text: string) => {
        // Clear any existing timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Set the search query immediately for the input field
        setSearchQuery(text);

        // Only search if there's text
        if (text.trim()) {
            // Set a new timeout
            searchTimeout.current = setTimeout(() => {
                handleSearch(text);
            }, 500); // 500ms debounce
        } else {
            // Clear results if text is empty
            setSearchResults([]);
        }
    };

    // Clean up the timeout when component unmounts
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);
    const toggleSearch = () => {
        if (isSearchExpanded) {
            // Collapse the search bar
            Keyboard.dismiss();

            // Clear any pending search
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
                searchTimeout.current = null;
            }

            // First update the state so the UI knows we're collapsing
            setIsSearchExpanded(false);

            // Then animate the width
            Animated.timing(searchWidth, {
                toValue: 40,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setSearchResults([]);
            });
            setSearchQuery('');
        } else {
            // First update the state so the UI knows we're expanding
            setIsSearchExpanded(true);

            // Then animate the width
            Animated.timing(searchWidth, {
                toValue: 200, // Less width to avoid pushing out of screen
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                searchInputRef.current?.focus();
            });
        }
    }; const handleSearch = async (query: string = searchQuery) => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await ApiClient.search(query);
            const data: Search = response.data;

            // Transform the data into a format for the list
            const formattedResults: SearchResult[] = [
                ...data.recipes.map((recipe: Recipe) => ({
                    id: recipe.id || 0,
                    name: recipe.title,
                    type: 'recipe' as const,
                    username: recipe.user?.username
                })),
                ...data.users.map((user: User) => ({
                    id: user.id,
                    name: user.username,
                    type: 'user' as const
                }))
            ];

            setSearchResults(formattedResults);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultPress = async (item: SearchResult) => {
        if (item.type === 'user') {
            try {
                // Navigate to the user dashboard page
                router.push({
                    pathname: '/dashboard',
                    params: { userId: item.id, username: item.name }
                });
            } catch (error) {
                console.error('Failed to get user recipes:', error);
            }
        } else {
            try {
                // Navigate to the recipe details page
                router.push({
                    pathname: '/recipeDetails',
                    params: { recipeId: item.id }
                });
            } catch (error) {
                console.error('Failed to get recipe details:', error);
            }
        }
    };

    const renderSearchResult = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
        >
            {item.type === 'user' ? (
                <View style={styles.userResult}>
                    <Ionicons name="person" size={20} color="#E6B36D" />
                    <Text style={styles.resultText}>{item.name}</Text>
                </View>
            ) : (
                <View style={styles.recipeResult}>
                    <View style={styles.recipeInfo}>
                        <Ionicons name="restaurant" size={20} color="#E6B36D" />
                        <Text style={styles.resultText}>{item.name}</Text>
                    </View>
                    {item.username && (
                        <Text style={styles.usernameText}>by {item.username}</Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.navbarContent}>
                <Link href="/" asChild>
                    <TouchableOpacity>
                        <Text style={styles.title}>MealShare</Text>
                    </TouchableOpacity>
                </Link>
                <View style={styles.rightItems}>
                    <Animated.View style={[
                        styles.searchContainer,
                        { width: searchWidth }
                    ]}>
                        <TextInput
                            ref={searchInputRef}
                            style={[
                                styles.searchInput,
                                { display: isSearchExpanded ? 'flex' : 'none' }
                            ]}
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={debouncedSearch}
                            returnKeyType="search"
                            placeholderTextColor="#A9A9A9"
                        />
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={toggleSearch}
                        >
                            <Ionicons name="search" size={24} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                    <Link href="/settings" asChild>
                        <TouchableOpacity style={styles.userButton}>
                            <Text style={styles.userButtonText}>{user?.username?.charAt(0) || 'U'}</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            {isSearchExpanded && searchResults.length > 0 && (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={searchResults}
                        renderItem={renderSearchResult}
                        keyExtractor={(item) => `${item.type}-${item.id}`}
                        style={styles.resultsList}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#312C51', // Dark purple from the image
        shadowColor: 'transparent', // Remove shadow to eliminate white line
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0, // Remove elevation to eliminate white line on Android
        zIndex: 1000,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
        borderBottomWidth: 0, // Ensure no border at bottom
    },
    navbarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    rightItems: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        marginRight: 16,
        marginLeft: 8,
        position: 'relative',
        width: 40, // Start with just the width of the button
        height: 40,
    },
    searchWrapper: {
        height: 40,
        backgroundColor: '#48426D',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
    }, searchInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontSize: 16,
        paddingLeft: 16,
        paddingRight: 8,
        borderWidth: 0,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#48426D',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
    },
    userButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E6B36D', // Amber color from the image
        alignItems: 'center',
        justifyContent: 'center',
    },
    userButtonText: {
        color: '#312C51',
        fontWeight: 'bold',
        fontSize: 18,
    },
    resultsContainer: {
        backgroundColor: '#48426D',
        maxHeight: 300,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    resultsList: {
        padding: 10,
    },
    resultItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    userResult: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recipeResult: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recipeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    usernameText: {
        color: '#E6B36D',
        fontSize: 14,
    },
});

export default Navbar;
