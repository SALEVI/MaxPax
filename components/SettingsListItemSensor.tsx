import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Switch, ActivityIndicator } from 'react-native';

import { useSensorList, useUpdateSensor } from '~/api/sensors';

const SettingsListItemSensor = ({ settingName, isEnabled, iconName, id, status }) => {
  const [isSensorEnable, setIsSensorEnabled] = useState(false);

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
    setIsSensorEnabled(newStatus === 'on');

    // Optimistically update the sensor status
    updateSensor(
      { id, status: newStatus },
      {
        onSuccess: () => {
          console.log('success');
        },
        onError: () => {
          // Revert the status if the update fails
          setIsSensorEnabled(currentSensor.status === 'on');
        },
      }
    );
  };

  return (
    <View className={`${isEnabled ? 'flex' : 'hidden'} mt-3`}>
      <View className="flex h-14 flex-row justify-between rounded-lg pl-4 dark:bg-black">
        <View className="justify-center">
          <View className="flex flex-row items-center">
            <Ionicons name={iconName} size={22} color="white" />
            <Text className="pl-8 text-lg font-medium dark:text-zinc-300">{settingName}</Text>
          </View>
        </View>
        <View className="mr-2">
          <Switch
            trackColor={{ false: '#27272a', true: '#84cc16' }}
            thumbColor="#e4e4e7"
            style={{ opacity: isEnabled ? 1 : 0 }}
            onValueChange={() => toggleSwitch(id)}
            value={status === 'on'}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsListItemSensor;
