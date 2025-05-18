// app/_layout.tsx
import Navbar from '@/components/Navbar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { View } from 'react-native';

function AppLayout() {
  const { isSignedIn, isLoading } = useAuth();

  // Only show navbar when user is signed in
  const shouldShowNavbar = isSignedIn && !isLoading;

  return (
    <View style={{ flex: 1, backgroundColor: '#48426D' }}>
      {shouldShowNavbar && <Navbar />}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#48426D',
            paddingTop: 0
          }
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: 'Home' }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="recipeDetails" />
        <Stack.Screen name="settings" />
        {/* Add other screens here */}
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Ubuntu': require('../assets/fonts/Ubuntu/Ubuntu-Regular.ttf'),
    'Ubuntu-Bold': require('../assets/fonts/Ubuntu/Ubuntu-Bold.ttf'),
    'Ubuntu-Medium': require('../assets/fonts/Ubuntu/Ubuntu-Medium.ttf'),
    'Ubuntu-Light': require('../assets/fonts/Ubuntu/Ubuntu-Light.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}