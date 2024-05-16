import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { remapProps } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';

import { useSensorList, useUpdateSensor } from '~/api/sensors';
import { useUpdateSensorListener } from '~/api/sensors/subscriptions';
import CategoryListItem from '~/components/CategoryListItem';
import { notifyUser } from '~/utils/notifications';
// import { Tables } from '~/database.types';
// import { Tables } from '~/types';

// This might be unnecessary since of v4 nativewind
remapProps(FlatList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
  columnWrapperClassName: 'columnWrapperStyle',
});

export default function Home() {
  const { data: sensors, error, isLoading } = useSensorList();
  const { mutate: updateSensor } = useUpdateSensor();

  const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});

  useUpdateSensorListener();

  useEffect(() => {
    // Check status changes when sensor data changes
    if (sensors) {
      sensors.forEach((s) => {
        const previousStatus = statusMap[s.id];
        const currentStatus = s.status;

        // Check if status has changed
        if (previousStatus && previousStatus !== currentStatus) {
          // Send notification when status changes
          notifyUser(s.name, s.status);
        }

        // Update status map
        setStatusMap((prevState) => ({
          ...prevState,
          [s.id]: currentStatus,
        }));
      });
    }
  }, [sensors]);

  useEffect(() => {
    if (sensors) {
      const initialStatusMap = sensors.reduce((map: { [key: number]: string }, sensor) => {
        map[sensor.id] = sensor.status;
        return map;
      }, {});
      setStatusMap(initialStatusMap);
    }
  }, [sensors]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#84cc16" />;
  }

  if (error) {
    return <Text>Failed to load data</Text>;
  }

  // Sort sensors by id before reducing to unique categories
  // Keep track of unique categories using an object
  const categoryMap: { [key: string]: boolean } = {};

  // Sort sensors by id
  const sortedSensors = (sensors || []).sort((a, b) => a.id - b.id);

  // Get unique categories
  const uniqueCategories = sortedSensors.reduce<
    {
      category: string;
      created_at: string;
      id: number;
      name: string;
      status: string;
      value: number | null;
    }[]
  >((acc, sensor) => {
    // Check if the category already exists
    if (!categoryMap[sensor.category]) {
      // If it doesn't exist, add it to the result array and mark it as seen
      acc.push(sensor);
      categoryMap[sensor.category] = true;
    }
    return acc;
  }, []);

  const toggleAllSensorsInCategory = (category: string) => {
    const updatedStatusMap = { ...statusMap };
    const sensorsInCategory = sortedSensors.filter((sensor) => sensor.category === category);
    const allOff = sensorsInCategory.every((sensor) => statusMap[sensor.id] === 'off');

    sensorsInCategory.forEach((sensor) => {
      const newStatus = allOff ? 'on' : 'off';
      updatedStatusMap[sensor.id] = newStatus;
      updateSensor({ id: sensor.id, status: newStatus });
    });

    setStatusMap(updatedStatusMap);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      {/* Maybe redo this into a Header component */}
      <View className="flex-1 dark:bg-black">
        <View className="min-h-72 w-full pl-5 pt-12 dark:bg-lime-500">
          <Text className="text-3xl font-medium">Your home is</Text>
          <Text className="text-4xl font-extrabold">Secured</Text>
        </View>
        <View className="bottom-12 flex-1 bg-white py-2 dark:bg-black" style={{ borderRadius: 30 }}>
          <View className="flex-row items-center pl-5 pt-5 ">
            <MaterialIcons name="sensors" size={36} color="white" />
            <Text className="pl-2 text-3xl font-bold dark:text-zinc-50">Sensors</Text>
          </View>
          <FlatList
            contentContainerClassName="flex-grow flex-row flex-wrap justify-around gap-4 p-5 mt-10"
            data={uniqueCategories}
            renderItem={({ item }) => (
              <CategoryListItem
                sensor={item}
                statusMap={statusMap}
                toggleAllSensorsInCategory={toggleAllSensorsInCategory} // Pass the function here
              />
            )}
            numColumns={2}
            columnWrapperClassName="gap-4"
          />
        </View>
      </View>
    </>
  );
}
