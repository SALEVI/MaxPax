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
    if (!sensors) return;

    const currentSensor = sensors.find((sensor) => sensor.id === id);
    if (!currentSensor) return;

    const newStatus = currentSensor.status === 'on' ? 'off' : 'on';
    setIsEnabled(newStatus === 'on');

    // Optimistically update the sensor status
    updateSensor(
      { id, status: newStatus },
      {
        onSuccess: () => {
          console.log('success');
        },
        onError: () => {
          // Revert the status if the update fails
          setIsEnabled(currentSensor.status === 'on');
        },
      }
    );
  };

  // Group devices by category
  const groupedSensors = (sensors || []).reduce((acc, sensor) => {
    const category = sensor.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sensor);
    return acc;
  }, {});

  return (
    <View className="flex-1 dark:bg-black">
      <View className="mx-5 mt-5 rounded-lg border border-zinc-800">
        {Object.keys(groupedSensors).map((category) => (
          <View key={category} className="mb-2">
            <Text className="rounded-md border-t border-zinc-800 p-4 text-xl font-bold dark:text-white">
              {category[0].toUpperCase() + category.slice(1)}
            </Text>
            {groupedSensors[category].map((sensor) => (
              <View key={sensor.id} className="flex flex-row items-center justify-between">
                <Text className="rounded-md p-4 text-lg font-medium dark:text-zinc-300">
                  {sensor.name[0].toUpperCase() + sensor.name.slice(1)}
                </Text>
                <Switch
                  trackColor={{ false: '#27272a', true: '#84cc16' }}
                  thumbColor="#e4e4e7"
                  ios_backgroundColor="#27272a"
                  onValueChange={() => toggleSwitch(sensor.id)}
                  value={sensor.status === 'on'}
                  style={{
                    borderRadius: 16,
                    marginRight: 10,
                  }}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SensorsScreen;
