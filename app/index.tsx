import { Redirect } from 'expo-router';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { useAuth } from '~/providers/AuthProvider';

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
        <Text className="mt-2 text-3xl font-bold dark:text-white">Loading</Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/sign-up" />;
}
