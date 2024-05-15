import '../global.css';
import { Stack } from 'expo-router';

import AuthProvider from '~/providers/AuthProvider';
import SensorProvider from '~/providers/SensorProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <SensorProvider>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </SensorProvider>
    </AuthProvider>
  );
}
