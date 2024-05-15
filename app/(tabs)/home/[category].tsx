import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme, Switch, ActivityIndicator } from 'react-native';

import { useSensorList, useUpdateSensor } from '~/api/sensors';

const DeviceDetailsScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { category } = useLocalSearchParams();
  const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

  const { data: sensor, error, isLoading } = useSensorList();
  const [statusMap, setStatusMap] = useState({});

  const { mutate: updateSensor } = useUpdateSensor();

  useEffect(() => {
    if (sensor) {
      const initialStatusMap = sensor.reduce((map, s) => {
        map[s.id] = s.status;
        return map;
      }, {});
      setStatusMap(initialStatusMap);
    }
  }, [sensor]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (error) {
    return <Text>Failed to load data</Text>;
  }

  const toggleSwitch = (id) => {
    const newStatus = statusMap[id] === 'on' ? 'off' : 'on';
    setStatusMap({ ...statusMap, [id]: newStatus });
    updateSensor(
      { id, status: newStatus },
      {
        onSuccess: () => {
          console.log('success');
        },
        onError: () => {
          // Revert the status if the update fails
          setStatusMap((prevState) => ({
            ...prevState,
            [id]: prevState[id] === 'on' ? 'off' : 'on',
          }));
        },
      }
    );
  };

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
      <View className="min-h-full dark:bg-zinc-950">
        <View className="mx-5 mt-5 rounded-lg border border-zinc-800">
          {sensor
            .filter((sensor) => sensor.category === category)
            .sort((a, b) => a.id - b.id) // Sort by id to maintain order
            .map((sensor) => (
              <View
                key={sensor.id}
                className="flex flex-row items-center justify-between space-x-4 border-b border-zinc-800">
                <Text className="rounded-md p-5 text-lg font-medium text-white">
                  {sensor.name[0].toUpperCase() + sensor.name.slice(1)} + id: {sensor.id}
                </Text>
                <Switch
                  trackColor={{ false: '#27272a', true: '#fafafa' }}
                  thumbColor={statusMap[sensor.id] === 'on' ? '#09090b' : '#09090b'}
                  ios_backgroundColor="#27272a"
                  onValueChange={() => toggleSwitch(sensor.id)}
                  value={statusMap[sensor.id] === 'on'}
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
