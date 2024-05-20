import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';

import { useSensorList, useUpdateSensor } from '~/api/sensors';
import SensorsListItem from '~/components/SensorsListItem';
import { useSensor } from '~/providers/SensorProvider';

const SensorsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { colorScheme } = useSensor();

  console.log(colorScheme);

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

  console.log(sensors);

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
    //color scheme not working
    //Might need to modify the contentContainerStyle if this wrecks srolling, need bigger data pull to see
    <ScrollView
      className="flex-1 dark:bg-black"
      contentContainerStyle={{ marginTop: 'auto', marginBottom: 'auto' }}>
      <StatusBar style={`${colorScheme === 'dark' ? 'light' : 'dark'}`} />
      <View className="mx-5 rounded-lg border-zinc-800 bg-zinc-300 dark:bg-zinc-900">
        {Object.keys(groupedSensors).map((category) => (
          <View key={category} className="mt-3 flex">
            <View className="mb-3 flex flex-row items-center justify-between py-2">
              <View className="w-1/3 bg-zinc-100 dark:bg-zinc-800" style={{ height: 1 }} />
              <Text className="text-xl font-semibold dark:text-zinc-400">
                {category[0].toUpperCase() + category.slice(1)}
              </Text>
              <View className="w-1/3 bg-zinc-100 dark:bg-zinc-800" style={{ height: 1 }} />
            </View>
            {groupedSensors[category].map((sensor) => (
              <View key={sensor.id}>
                <SensorsListItem
                  id={sensor.id}
                  status={sensor.status}
                  toggleSwitch={toggleSwitch}
                  iconName="flashlight"
                  colorScheme={colorScheme}
                  settingsName={sensor.name[0].toUpperCase() + sensor.name.slice(1)}
                />
              </View>
              // <View
              //   key={sensor.id}
              //   className="my-2 ml-5 flex flex-row items-center justify-between rounded-lg border-zinc-800 bg-black pl-4 dark:bg-black">
              //   <Text className="rounded-md text-lg font-medium dark:text-zinc-300">
              //     {sensor.name[0].toUpperCase() + sensor.name.slice(1)}
              //   </Text>
              //   <Switch
              //     trackColor={{ false: '#27272a', true: '#84cc16' }}
              //     thumbColor="#e4e4e7"
              //     ios_backgroundColor="#27272a"
              //     onValueChange={() => toggleSwitch(sensor.id)}
              //     value={sensor.status === 'on'}
              //     style={{
              //       borderRadius: 16,
              //       marginRight: 10,
              //     }}
              //   />
              // </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default SensorsScreen;
