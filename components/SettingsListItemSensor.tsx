import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Switch } from 'react-native';

import { useUpdatePresetAway, useUpdatePresetHome, useUpdatePresetDisarmed } from '~/api/presets';

const SettingsListItemSensor = ({ settingName, iconName, preset, presetName }) => {
  const { mutate: updatePresetAway } = useUpdatePresetAway();
  const { mutate: updatePresetHome } = useUpdatePresetHome();
  const { mutate: updatePresetDisarmed } = useUpdatePresetDisarmed();

  const toggleSwitch = () => {
    if (!preset) return;

    const newStatus = preset.status === 'on' ? 'off' : 'on';

    const mutation =
      presetName === 'Away'
        ? updatePresetAway
        : presetName === 'Home'
          ? updatePresetHome
          : updatePresetDisarmed;

    // Optimistically update the sensor status
    mutation(
      { id: preset.id, status: newStatus },
      {
        onSuccess: () => {
          console.log('success ' + presetName);
        },
        onError: () => {
          // Revert the status if the update fails
          console.log('error ' + presetName);
        },
      }
    );
  };

  return (
    <View className="mt-3">
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
            onValueChange={toggleSwitch}
            value={preset.status === 'on'}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsListItemSensor;
