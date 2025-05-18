import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isSignedIn, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isSignedIn && user) {
        // Redirect to user's dashboard if logged in
        router.replace({
          pathname: '/dashboard',
          params: { userId: user.id, username: user.username },
        });
      } else {
        // Redirect to login if not logged in
        router.replace('/login');
      }
    }
  }, [isSignedIn, user, isLoading]);

  // Show loading state while determining where to route
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#48426D' }}>
      <ActivityIndicator size="large" color="#E6B36D" />
    </View>
  );
}