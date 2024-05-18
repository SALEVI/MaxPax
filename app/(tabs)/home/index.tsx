import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { remapProps } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, Pressable } from 'react-native';

import { useInsertNotification } from '~/api/notifications';
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
  const { mutate: insertNotification } = useInsertNotification();

  const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});

  //Need to save on phone storage the last selected preset
  const [selectedPreset, setSelectedPreset] = useState('Away');

  //After loging in always looking for notifications
  useUpdateSensorListener();

  useEffect(() => {
    // Check status changes when sensor data changes
    if (sensors) {
      sensors.forEach((s) => {
        const previousStatus = statusMap[s.id];
        const currentStatus = s.status;

        // Check if status has changed
        if (previousStatus && previousStatus !== currentStatus) {
          const title = `${s.name.charAt(0).toUpperCase()}${s.name.slice(1)} sensor`;
          const body = `has turned ${s.status}`;
          // Send notification when status changes

          notifyUser(title, body);
          insertNotification({
            title,
            body,
            name: s.name,
            status: s.status,
            value: s.value,
          });
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
        <View
          className={`min-h-72 w-full pl-3 pt-1 ${
            selectedPreset === 'Away'
              ? 'dark:bg-lime-500'
              : selectedPreset === 'Home'
                ? 'dark:bg-amber-400'
                : selectedPreset === 'Disarmed'
                  ? 'dark:bg-red-600'
                  : 'dark:bg-transparent'
          }`}>
          <View className="mt-5 flex-1 flex-col justify-evenly">
            <View>
              <Text className="text-3xl font-medium">Your home is</Text>
              <Text className="text-4xl font-extrabold">
                {selectedPreset === 'Away'
                  ? 'Secured'
                  : selectedPreset === 'Home'
                    ? 'Welcoming'
                    : selectedPreset === 'Disarmed'
                      ? 'Unsecured'
                      : 'dark:bg-transparent'}
              </Text>
            </View>
            <View
              className={`mx-3 mb-14 mr-7 flex h-14 flex-row items-center justify-evenly rounded-lg p-1 px-2  ${
                selectedPreset === 'Away'
                  ? 'dark:bg-lime-600'
                  : selectedPreset === 'Home'
                    ? 'dark:bg-amber-500'
                    : selectedPreset === 'Disarmed'
                      ? 'dark:bg-red-700'
                      : 'dark:bg-transparent'
              }`}>
              <Pressable
                className={`mr-2 h-full w-1/3 flex-row items-center justify-center rounded-md ${
                  selectedPreset === 'Away'
                    ? 'dark:bg-orange-500'
                    : selectedPreset === 'Home'
                      ? 'dark:bg-transparent'
                      : selectedPreset === 'Disarmed'
                        ? 'dark:bg-transparent'
                        : 'dark:bg-transparent'
                }`}
                onPress={() => {
                  setSelectedPreset('Away');
                }}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={`${
                    selectedPreset === 'Away'
                      ? 'white'
                      : selectedPreset === 'Home'
                        ? 'black'
                        : selectedPreset === 'Disarmed'
                          ? 'black'
                          : 'black'
                  }`}
                />
                <Text
                  className={`ml-1 ${
                    selectedPreset === 'Away'
                      ? 'text-xl font-bold dark:text-white'
                      : selectedPreset === 'Home'
                        ? 'text-xl font-semibold'
                        : selectedPreset === 'Disarmed'
                          ? 'text-xl font-semibold'
                          : 'dark:bg-transparent'
                  }`}>
                  Away
                </Text>
              </Pressable>
              <Pressable
                className={`mr-2 h-full w-1/3 flex-row items-center justify-center rounded-md ${
                  selectedPreset === 'Away'
                    ? 'dark:bg-transparent'
                    : selectedPreset === 'Home'
                      ? 'dark:bg-orange-900'
                      : selectedPreset === 'Disarmed'
                        ? 'dark:bg-transparent'
                        : 'dark:bg-transparent'
                }`}
                onPress={() => {
                  setSelectedPreset('Home');
                }}>
                <MaterialCommunityIcons
                  name="home-lock"
                  size={20}
                  color={`${
                    selectedPreset === 'Away'
                      ? 'black'
                      : selectedPreset === 'Home'
                        ? 'white'
                        : selectedPreset === 'Disarmed'
                          ? 'black'
                          : 'black'
                  }`}
                />
                <Text
                  className={`ml-1 ${
                    selectedPreset === 'Away'
                      ? 'text-xl font-semibold'
                      : selectedPreset === 'Home'
                        ? 'text-xl font-bold dark:text-white'
                        : selectedPreset === 'Disarmed'
                          ? 'text-xl font-semibold'
                          : 'dark:bg-transparent'
                  }`}>
                  Home
                </Text>
              </Pressable>
              <Pressable
                className={`h-full w-1/3 flex-row items-center justify-center rounded-md ${
                  selectedPreset === 'Away'
                    ? 'dark:bg-transparent'
                    : selectedPreset === 'Home'
                      ? 'dark:bg-transparent'
                      : selectedPreset === 'Disarmed'
                        ? 'dark:bg-zinc-900'
                        : 'dark:bg-transparent'
                }`}
                onPress={() => setSelectedPreset('Disarmed')}>
                <MaterialCommunityIcons
                  name="lock-open-variant-outline"
                  size={20}
                  color={`${
                    selectedPreset === 'Away'
                      ? 'black'
                      : selectedPreset === 'Home'
                        ? 'black'
                        : selectedPreset === 'Disarmed'
                          ? 'white'
                          : 'black'
                  }`}
                />
                <Text
                  className={`ml-1 ${
                    selectedPreset === 'Away'
                      ? 'text-xl font-semibold'
                      : selectedPreset === 'Home'
                        ? 'text-xl font-semibold '
                        : selectedPreset === 'Disarmed'
                          ? 'text-xl font-bold dark:text-white'
                          : 'dark:bg-transparent'
                  }`}>
                  Disarmed
                </Text>
              </Pressable>
            </View>
          </View>
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
