import '../global.css';
import { initializeApp } from '@react-native-firebase/app';
import { Stack } from 'expo-router';

import NotificationFCMV1 from '~/components/NotificationsFCMV1';
import AuthProvider from '~/providers/AuthProvider';
import NotificationProvider from '~/providers/NotificationProvider';
import QueryProvider from '~/providers/QueryProvider';
import SensorProvider from '~/providers/SensorProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryProvider>
        <NotificationProvider>
          <SensorProvider>
            <NotificationFCMV1 />
            <Stack initialRouteName="(tabs)">
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </SensorProvider>
        </NotificationProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
