import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

const DeviceDetailsScreen = () => {
  const { category } = useLocalSearchParams();
  const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <View>
      <Stack.Screen options={{ title: categoryCapitalized }} />
      <Text className="text-lg">DeviceDetailsScreen for category: {category}</Text>
    </View>
  );
};

export default DeviceDetailsScreen;
