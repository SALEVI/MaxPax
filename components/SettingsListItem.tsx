import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Switch } from 'react-native';

const SettingsListItem = ({ settingsName, iconName }) => {
  return (
    <View className="mb-3 flex h-14 flex-row justify-between rounded-lg border pl-4 dark:border-zinc-800">
      <View className="justify-center">
        <View className="flex flex-row items-center">
          <Ionicons name={iconName} size={22} color="white" />
          <Text className="pl-8 text-lg font-medium dark:text-zinc-300">{settingsName}</Text>
        </View>
      </View>
      <View className="mr-2">
        <Switch trackColor={{ false: '#27272a', true: '#84cc16' }} thumbColor="#e4e4e7" />
      </View>
    </View>
  );
};

export default SettingsListItem;
