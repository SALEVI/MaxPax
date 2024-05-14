import { Redirect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay or perform any initialization tasks here
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the delay as needed
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
        <Text className="mt-2 text-3xl font-bold dark:text-white">Welcome</Text>
      </View>
    );
  }

  return <Redirect href="/sign-in" />;
}
