import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, useColorScheme, Switch, ActivityIndicator } from 'react-native';

import { useSensorCategory } from '~/api/sensors';

const DeviceDetailsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const { category, id } = useLocalSearchParams();

  const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

  const { data: sensor, error, isLoading } = useSensorCategory(category);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  console.log(sensor);

  if (error) {
    return <Text>Failed to load data</Text>;
  }

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View>
      <Stack.Screen
        options={{
          title: categoryCapitalized,
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
        }}
      />
      <View className=" min-h-full dark:bg-zinc-950">
        {/* separator under the title */}
        {/* <View className="mb-2 h-[1px] w-full bg-gray-600 " /> */}
        <View className="mx-5 mt-5 rounded-lg border border-zinc-800">
          {sensor
            .filter((sensor) => sensor.category === category)
            .map((sensor) => (
              <View
                key={sensor.id}
                className="flex flex-row items-center justify-between space-x-4 border-b border-zinc-800">
                <Text className="rounded-md p-5 text-lg font-medium text-white">
                  {sensor.name[0].toUpperCase() + sensor.name.slice(1)} + id: {sensor.id}
                </Text>
                <Switch
                  trackColor={{ false: '#27272a', true: '#fafafa' }}
                  thumbColor={isEnabled ? '#09090b' : '#09090b'}
                  ios_backgroundColor="#27272a"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginRight: 5 }}
                />
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default DeviceDetailsScreen;
