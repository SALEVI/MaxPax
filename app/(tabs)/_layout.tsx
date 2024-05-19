import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { Link, Redirect, Tabs } from 'expo-router';
import React from 'react';

import { HeaderButton } from '../../components/HeaderButton';

import { useAuth } from '~/providers/AuthProvider';
import { useSensor } from '~/providers/SensorProvider';

export default function TabLayout() {
  const { session } = useAuth();
  const { colorScheme, toggleColorScheme } = useSensor();

  if (!session) {
    return <Redirect href="/" />;
  }

  NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? 'black' : '#fafafa');
  NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');

  // Function to get the correct icon color based on the color scheme
  const getIconColor = (focused) => {
    if (colorScheme === 'dark') {
      return focused ? 'white' : 'gray'; // Dark mode: White icons when focused, gray otherwise
    } else {
      return focused ? 'black' : 'gray'; // Light mode: Black icons when focused, gray otherwise
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? 'white' : 'black', // Active tint color
        tabBarInactiveTintColor: 'gray', // Inactive tint color
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa' },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={getIconColor(focused)}
            />
          ),
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
          tabBarStyle: { backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa' },
          title: 'Sensors',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa',
          },
          headerTintColor: colorScheme === 'dark' ? 'white' : 'black',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="sensors" size={28} color={getIconColor(focused)} />
          ),
          headerLeft: () => (
            <MaterialIcons
              name="sensors"
              size={24}
              color={getIconColor(true)}
              className="ml-5 items-center"
            /> // Assuming always visible in light mode
          ),
        }}
      />
      <Tabs.Screen name="notificationsScreen" options={{ href: null }} />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa' },
          title: 'Notifications',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa',
          },
          headerTintColor: colorScheme === 'dark' ? 'white' : 'black',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name={focused ? 'notifications' : 'notifications-none'}
              size={28}
              color={getIconColor(focused)}
            />
          ),
          headerLeft: () => (
            <MaterialIcons
              name="notifications"
              size={24}
              color={getIconColor(true)}
              className="ml-5 items-center"
            /> // Assuming always visible in light mode
          ),
        }}
      />
      <Tabs.Screen name="settingsScreen" options={{ href: null }} />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa' },
          title: 'Settings',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'black' : '#fafafa',
          },
          headerTintColor: colorScheme === 'dark' ? 'white' : 'black',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={28}
              color={getIconColor(focused)}
            />
          ),
          headerLeft: () => (
            <Ionicons
              name="settings"
              size={24}
              color={getIconColor(true)}
              className="ml-5 items-center"
            /> // Assuming always visible in light mode
          ),
        }}
      />
    </Tabs>
  );
}
