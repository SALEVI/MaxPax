import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, ActivityIndicator, Pressable, SafeAreaView } from 'react-native';

import { useInsertNotification } from '~/api/notifications';
import { useSensorList, useUpdateSensor } from '~/api/sensors';
import { useUpdateSensorListener } from '~/api/sensors/subscriptions';
import { usePushNotifications } from '~/providers/NotificationProvider';
import { notifyUser } from '~/utils/notifications';

const colorCategories = {
  windows: ['#12a04e', '#e1e281', '#e89a41'], // Custom colors for 'motions' category
  doors: ['#ea56bb', '#cfcc8e', '#68d8cb'],
  alarms: ['#e78b73', '#c5b399', '#75a28e'], // Custom colors for 'doors' category
  motions: ['#ecba52', '#88aa5d', '#4c9386'],
  // Add more categories and their corresponding colors here
};

const DeviceDetailsScreen = () => {
  const { category } = useLocalSearchParams();
  const categoryCapitalized =
    (category as string)?.charAt(0)?.toUpperCase() + (category as string)?.slice(1);
  const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});
  const [sensorColors, setSensorColors] = useState<{ [key: number]: string }>({});

  const { data: sensor, error, isLoading } = useSensorList();
  const { mutate: updateSensor } = useUpdateSensor();
  const { mutate: insertNotification } = useInsertNotification();
  const { isEnabled } = usePushNotifications();

  const router = useRouter();

  useUpdateSensorListener();

  useEffect(() => {
    if (sensor) {
      const initialStatusMap = sensor.reduce((map: { [key: number]: string }, s) => {
        map[s.id] = s.status;
        return map;
      }, {});
      setStatusMap(initialStatusMap);

      const colorsMap = {};
      const usedColors = {};

      sensor.forEach((s) => {
        const colors = colorCategories[s.category] || ['#a855f7']; // Fallback color if category not found
        let color;

        for (let i = 0; i < colors.length; i++) {
          if (!usedColors[colors[i]]) {
            color = colors[i];
            usedColors[colors[i]] = true;
            break;
          }
        }

        colorsMap[s.id] = color;
      });

      setSensorColors(colorsMap);
    }
  }, [sensor]);

  // Maybe move to home/index implement id based conditional logic
  useEffect(() => {
    // Check sensor value when it changes
    if (sensor) {
      sensor.forEach((s) => {
        if (s.value > 3000) {
          // Send notification when value exceeds 4000
          // isEnabled && notifyUser(s.name, s.value);
        }
      });
    }
  }, [sensor]);

  // useEffect(() => {
  //   // Check status changes when sensor data changes
  //   if (sensor) {
  //     sensor.forEach((s) => {
  //       const previousStatus = statusMap[s.id];
  //       const currentStatus = s.status;

  //       // Check if status has changed
  //       if (previousStatus && previousStatus !== currentStatus) {
  //         const title = `${s.name.charAt(0).toUpperCase()}${s.name.slice(1)} sensor`;
  //         const body = `has turned ${s.status}`;
  //         // Send notification when status changes
  //         notifyUser(title, body);
  //         insertNotification({
  //           title,
  //           body,
  //           name: s.name,
  //           status: s.status,
  //           value: s.value,
  //         });
  //       }

  //       // Update status map
  //       setStatusMap((prevState) => ({
  //         ...prevState,
  //         [s.id]: currentStatus,
  //       }));
  //     });
  //   }
  // }, [sensor]);

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
    <SafeAreaView className="flex-1 pt-11 dark:bg-black">
      <View className="ml-5">
        <Pressable className=" flex flex-row items-center" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="grey" />
          <Text className="ml-2 text-2xl font-semibold dark:text-white">{categoryCapitalized}</Text>
        </Pressable>
      </View>
      <View className="mt-4 border-b border-zinc-400" />
      <View className="">
        <View className="mx-5 mt-5">
          {sensor
            ?.filter((s) => s.category === category)
            .sort((a, b) => a.id - b.id) // Sort by id to maintain order
            .map((s) => (
              <View
                key={s.id}
                style={{
                  backgroundColor: sensorColors[s.id],
                }}
                className="my-2 flex h-24 flex-row items-center space-x-4 rounded-3xl p-4">
                <View className="flex flex-1 flex-row items-center justify-between">
                  <View className="flex flex-row items-center">
                    <View className="ml-2 rounded-3xl bg-zinc-950 p-4">
                      <MaterialCommunityIcons name={s.icon} size={28} color="white" />
                    </View>
                    <Text className="ml-6 text-lg font-semibold text-stone-950 antialiased">
                      {s.name[0].toUpperCase() + s.name.slice(1)}
                    </Text>
                  </View>
                  <Switch
                    trackColor={{ false: 'rgba(0,0,0,0.6)', true: 'rgba(132,204,22,0.8)' }}
                    //#e4e4e7 #84cc16
                    thumbColor="black"
                    ios_backgroundColor="#27272a"
                    onValueChange={() => toggleSwitch(s.id)}
                    value={statusMap[s.id] === 'on'}
                    style={{
                      borderRadius: 16,
                    }}
                  />
                </View>
              </View>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeviceDetailsScreen;
