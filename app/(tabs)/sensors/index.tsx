import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, useColorScheme, Switch } from 'react-native';

import devices from '~/assets/data/devices';

const DeviceDetailsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [lastDisplayedCategory, setLastDisplayedCategory] = useState(''); // Step 1: Initialize state for last displayed category
  if (!devices) {
    return <Text>Sensors not found</Text>;
  }
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Sensors',
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
        }}
      />
      <View className=" min-h-full dark:bg-black">
        {/* separator under the title */}
        {/* <View className="mb-2 h-[1px] w-full bg-gray-600 " /> */}
        <View className="mx-5 mt-5 rounded-lg border border-zinc-800">
          {devices.map((device) => (
            <View
              key={device.id}
              className="flex flex-row items-center justify-between space-x-4 border-b border-zinc-800">
              <Text className="rounded-md p-5 text-lg font-medium dark:text-white">
                {device.name[0].toUpperCase() + device.name.slice(1)}
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
