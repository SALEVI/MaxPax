import React, { useState } from 'react';
import { View, Text, useColorScheme, Switch, ActivityIndicator } from 'react-native';

import { useSensorList, useUpdateSensor } from '~/api/sensors';

const SensorsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const { data: sensors, error, isLoading } = useSensorList();
  const { mutate: updateSensor } = useUpdateSensor();

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

  const toggleSwitch = (id: number) => {
    // Ensure sensor exists before proceeding
    if (!sensors) return;

    const currentStatus = sensors.find((sensor) => sensor.id === id)?.status || 'off'; // Get the current status of the sensor
    const newStatus = currentStatus === 'on' ? 'off' : 'on'; // Toggle the status
    setIsEnabled(newStatus === 'on'); // Update isEnabled based on the new status

    // Update the sensor status optimistically
    updateSensor(
      { id, status: newStatus },
      {
        onSuccess: () => {
          console.log('success');
        },
        onError: () => {
          // Revert the status if the update fails
          setIsEnabled(currentStatus === 'on'); // Revert isEnabled to the previous status
        },
      }
    );
  };

  // Group devices by category
  const groupedSensors = (sensors || []).reduce((acc: { [key: string]: any }, sensor) => {
    const category = sensor.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sensor);
    return acc;
  }, {});

  return (
    <View>
      <View className=" min-h-full dark:bg-black ">
        {/* rounded-lg border border-zinc-800 optional styling for the View below */}
        <View className="mx-5 mt-5 rounded-lg border border-zinc-800 ">
          {/* Map through unique categories */}
          {Object.keys(groupedSensors).map((category) => (
            <View key={category} className="mb-2">
              <Text className="rounded-md border-t border-zinc-800 p-4 text-xl font-bold dark:text-white">
                {category[0].toUpperCase() + category.slice(1)}
              </Text>
              {/* Map through devices for the current category */}
              {groupedSensors[category].map(
                (sensor: { id: number; name: string; status: string }) => (
                  <View key={sensor.id} className="flex flex-row items-center justify-between ">
                    <Text className="rounded-md p-4 text-lg font-medium dark:text-zinc-300">
                      {sensor.name[0].toUpperCase() + sensor.name.slice(1)}
                    </Text>
                    <Switch
                      disabled={isEnabled}
                      trackColor={{ false: '#27272a', true: '#fafafa' }}
                      thumbColor={sensor.status === 'on' ? '#09090b' : '#09090b'}
                      ios_backgroundColor="#27272a"
                      onValueChange={() => toggleSwitch(sensor.id)} // Pass the id to toggleSwitch
                      value={sensor.status === 'on'}
                      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginRight: 5 }}
                    />
                  </View>
                )
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SensorsScreen;
