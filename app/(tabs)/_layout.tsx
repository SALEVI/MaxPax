import { Link, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#84cc16' : 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          headerShown: true,
          tabBarStyle: { backgroundColor: isDarkMode ? 'black' : 'white' },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="code" color={isDarkMode ? '#84cc16' : 'black'} />
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
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
