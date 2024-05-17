import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import SettingsListItemSensor from './SettingsListItemSensor';
import { useSensor } from '../providers/SensorProvider';

// import { useSensorList, useUpdateSensor } from '~/api/sensors';

const SettingsPreset = ({ presetName, sensor }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [dropDownIcon, setDropDownIcon] = useState('chevron-down');
  // const { data: sensors, error, isLoading } = useSensorList();

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center dark:bg-black">
  //       <ActivityIndicator size="large" color="#84cc16" />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return <Text>Failed to load data</Text>;
  // }
  // Group devices by category
  const groupedSensors = (sensor || []).reduce((acc, sensor) => {
    const category = sensor.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sensor);
    return acc;
  }, {});

  return (
    <View className="my-2 rounded-lg p-5 dark:bg-zinc-900">
      <Pressable
        onPress={() => {
          setIsEnabled(!isEnabled);
          setDropDownIcon(isEnabled ? 'chevron-down' : 'chevron-up');
        }}
        className="flex flex-row items-center justify-between">
        <Text className={`${isEnabled ? 'text-2xl' : 'text-xl'} font-semibold dark:text-zinc-200`}>
          {presetName}
        </Text>
        <Ionicons name={dropDownIcon} size={24} color="white" className="ml-2 items-center" />
      </Pressable>

      {Object.keys(groupedSensors).map((category) => (
        <View key={category} className={`mb-2 ${isEnabled ? 'flex' : 'hidden'}`}>
          <Text className="rounded-md border-t border-zinc-800 p-4 text-xl font-bold dark:text-white">
            {category[0].toUpperCase() + category.slice(1)}
          </Text>
          {groupedSensors[category].map((sensor) => (
            <View key={sensor.id} className="flex flex-row items-center justify-between">
              <SettingsListItemSensor
                settingName={sensor.name[0].toUpperCase() + sensor.name.slice(1)}
                isEnabled={isEnabled}
                iconName="flash-outline"
                id={sensor.id}
                status={sensor.status}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default SettingsPreset;
