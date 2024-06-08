import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Switch } from 'react-native';

const SensorsListItem = ({ settingsName, iconName, colorScheme, toggleSwitch, id, status }) => {
  return (
    <View className="mx-3 mb-3 flex h-14 flex-row justify-between rounded-lg bg-zinc-200 pl-4 dark:bg-black">
      <View className="justify-center">
        <View className="flex flex-row items-center">
          <MaterialCommunityIcons
            name={iconName}
            size={22}
            color={`${colorScheme === 'dark' ? 'white' : 'black'}`}
          />
          <Text className="pl-8 text-lg font-medium dark:text-zinc-300">{settingsName}</Text>
        </View>
      </View>
      <View className="mr-1 justify-center">
        <Switch
          trackColor={{ false: '#27272a', true: '#84cc16' }}
          thumbColor="#e4e4e7"
          ios_backgroundColor="#27272a"
          onValueChange={() => toggleSwitch(id)}
          value={status === 'on'}
          style={{
            borderRadius: 16,
            marginRight: 10,
          }}
        />
      </View>
    </View>
  );
};

export default SensorsListItem;
