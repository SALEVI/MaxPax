import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, useColorScheme, Switch } from 'react-native';

import devices from '~/assets/data/devices';

const SensorsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  if (!devices) {
    return <Text>Sensors not found</Text>;
  }
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // Group devices by category
  const groupedDevices = devices.reduce((acc, device) => {
    const category = device.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(device);
    return acc;
  }, {});

  return (
    <View>
      <View className=" min-h-full dark:bg-black ">
        {/* rounded-lg border border-zinc-800 optional styling for the View below */}
        <View className="mx-5 mt-5 rounded-lg border border-zinc-800 ">
          {/* Map through unique categories */}
          {Object.keys(groupedDevices).map((category) => (
            <View key={category} className="mb-2">
              <Text className="rounded-md border-t border-zinc-800 p-4 text-xl font-bold dark:text-white">
                {category[0].toUpperCase() + category.slice(1)}
              </Text>
              {/* Map through devices for the current category */}
              {groupedDevices[category].map((device) => (
                <View key={device.id} className="flex flex-row items-center justify-between ">
                  <Text className="rounded-md p-4 text-lg font-medium dark:text-zinc-300">
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
          ))}
        </View>
      </View>
    </View>
  );
};

export default SensorsScreen;
