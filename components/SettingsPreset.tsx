import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import SettingsListItemSensor from './SettingsListItemSensor';

const SettingsPreset = ({ presetName, preset, colorScheme }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [dropDownIcon, setDropDownIcon] = useState('chevron-down');

  // Sort the sensors before grouping them
  const sortedPreset = (preset || []).sort((a, b) => a.id - b.id);

  // Group the sorted sensors
  const groupedSensors = sortedPreset.reduce((acc, sensor) => {
    const category = sensor.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sensor);
    return acc;
  }, {});

  return (
    <View className="my-2 rounded-lg bg-zinc-300 p-5 dark:bg-zinc-900">
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
          <View className="flex flex-row items-center justify-between py-2">
            <View className="w-1/3 bg-zinc-100 dark:bg-zinc-800" style={{ height: 1 }} />
            <Text className="font-semibold dark:text-zinc-400">
              {category[0].toUpperCase() + category.slice(1)}
            </Text>
            <View className="w-1/3 bg-zinc-100 dark:bg-zinc-800" style={{ height: 1 }} />
          </View>
          {groupedSensors[category].map((sensor) => (
            <View key={sensor.id}>
              <SettingsListItemSensor
                settingName={sensor.name[0].toUpperCase() + sensor.name.slice(1)}
                iconName="flash-outline"
                preset={sensor}
                presetName={presetName}
                colorScheme={colorScheme}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default SettingsPreset;
