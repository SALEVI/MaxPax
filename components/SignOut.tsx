import { useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { AppState, View, Text } from 'react-native';

import { supabase } from '~/utils/supabase';

const INACTIVITY_DURATION = 0.1 * 60 * 1000; // 1 minute

const AppStateExample = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null); // Adjusted type to NodeJS.Timeout
  const router = useRouter();

  useEffect(() => {
    const signOutUser = async () => {
      console.log('Signing out due to inactivity...');
      await supabase.auth.signOut();
      router.push('/sign-in');
      console.log('User signed out');
    };

    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // Clear the inactivity timer if the app is active
        if (inactivityTimer.current !== null) {
          clearTimeout(inactivityTimer.current);
          inactivityTimer.current = null; // Reset the timer
        }
      }

      if (nextAppState.match(/inactive|background/)) {
        // Start the inactivity timer
        inactivityTimer.current = setTimeout(signOutUser, INACTIVITY_DURATION);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (inactivityTimer.current !== null) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Current state is: {appStateVisible}</Text>
    </View>
  );
};

export default AppStateExample;
