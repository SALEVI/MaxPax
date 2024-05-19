import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, ActivityIndicator, Pressable } from 'react-native';

import { useInsertNotification } from '~/api/notifications';
import { useSensorList, useUpdateSensor } from '~/api/sensors';
import { useUpdateSensorListener } from '~/api/sensors/subscriptions';
import { notifyUser } from '~/utils/notifications';

const DeviceDetailsScreen = () => {
  const { category } = useLocalSearchParams();
  const categoryCapitalized =
    (category as string)?.charAt(0)?.toUpperCase() + (category as string)?.slice(1);
  const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});
  const { data: sensor, error, isLoading } = useSensorList();
  const { mutate: updateSensor } = useUpdateSensor();
  const { mutate: insertNotification } = useInsertNotification();

  const router = useRouter();

  useUpdateSensorListener();

  useEffect(() => {
    if (sensor) {
      const initialStatusMap = sensor.reduce((map: { [key: number]: string }, s) => {
        map[s.id] = s.status;
        return map;
      }, {});
      setStatusMap(initialStatusMap);
    }
  }, [sensor]);

  //Maybe move to home/index implement id based conditional logic
  useEffect(() => {
    // Check sensor value when it changes
    if (sensor) {
      sensor.forEach((s) => {
        if (s.value > 3000) {
          // Send notification when value exceeds 4000
          notifyUser(s.name, s.value);
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
    <View className="flex-1 pt-14 dark:bg-black">
      <View className="ml-5">
        <Pressable className=" flex flex-row items-center" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="grey" />
          <Text className="ml-2 text-2xl font-semibold dark:text-white">{categoryCapitalized}</Text>
        </Pressable>
      </View>
      <View className="mt-4 border-b border-zinc-800" />
      <View className="">
        <View className="mx-5 mt-5 rounded-lg border border-zinc-800">
          {sensor
            ?.filter((s) => s.category === category)
            .sort((a, b) => a.id - b.id) // Sort by id to maintain order
            .map((s) => (
              <View
                key={s.id}
                className="flex flex-row items-center justify-between space-x-4 border-b border-zinc-800">
                <Text className="rounded-md p-5 text-lg font-medium dark:text-white">
                  {s.name[0].toUpperCase() + s.name.slice(1)} + id: {s.id} + value {s.value}
                </Text>
                <Switch
                  trackColor={{ false: '#27272a', true: '#84cc16' }}
                  thumbColor="#e4e4e7"
                  ios_backgroundColor="#27272a"
                  onValueChange={() => toggleSwitch(s.id)}
                  value={statusMap[s.id] === 'on'}
                  style={{
                    borderRadius: 16,
                    marginRight: 10,
                  }}
                />
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default DeviceDetailsScreen;
