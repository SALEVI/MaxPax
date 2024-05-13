import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';

export default function TabLayout() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#84cc16' : 'black',
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={isDarkMode ? '#84cc16' : 'black'} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarShowLabel: false,
          title: 'Devices',
          tabBarIcon: ({ color }) => <Ionicons name="code" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
