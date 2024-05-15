import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, Redirect, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';

import { useAuth } from '~/providers/AuthProvider';

export default function TabLayout() {
  const { session } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? 'white' : 'black', // Active tint color
        tabBarInactiveTintColor: 'gray', // Inactive tint color
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
          tabBarIcon: ({ focused }) => {
            // Explicitly set the icon color based on whether the tab is focused (active)
            const iconColor = focused ? 'white' : 'gray'; // Adjust 'gray' to the desired inactive color
            return <Ionicons name="home" size={28} color={iconColor} />;
          },
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="sensorsScreen" options={{ href: null }} />
      <Tabs.Screen
        name="sensors"
        options={{
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
          title: 'Sensors',
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
          tabBarIcon: ({ color }) => <MaterialIcons name="sensors" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
