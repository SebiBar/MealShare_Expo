// app/_layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: 'Home', headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        {/* Add other screens here */}
        {/* Other screens */}
      </Stack>
    </AuthProvider>
  );
}