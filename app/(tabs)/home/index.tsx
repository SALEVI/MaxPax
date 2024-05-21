import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { remapProps } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, Pressable } from 'react-native';

import { useInsertNotification, useNotificationLatest } from '~/api/notifications';
import { usePresetAwayList, usePresetDisarmedList, usePresetHomeList } from '~/api/presets';
import { useSensorList, useUpdateSensor } from '~/api/sensors';
import { useUpdateSensorListener } from '~/api/sensors/subscriptions';
import CategoryListItem from '~/components/CategoryListItem';
import SidescrollingText from '~/components/SidescrollingText';
import { usePushNotifications } from '~/providers/NotificationProvider';
import { useNotificationFCMV1 } from '~/providers/NotificationsFCMV1Provider';
import { useSensor } from '~/providers/SensorProvider';
import { notifyUser } from '~/utils/notifications';

// This might be unnecessary since of v4 nativewind
remapProps(FlatList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
  columnWrapperClassName: 'columnWrapperStyle',
});

export default function Home() {
  const { data: sensors, error, isLoading } = useSensorList();
  const {
    data: presetAwayData,
    error: presetAwayError,
    isLoading: presetAwayIsLoading,
  } = usePresetAwayList();
  const {
    data: presetHomeData,
    error: presetHomeError,
    isLoading: presetHomeIsLoading,
  } = usePresetHomeList();
  const {
    data: presetDisarmedData,
    error: presetDisarmedError,
    isLoading: presetDisarmedIsLoading,
  } = usePresetDisarmedList();
  const {
    data: latestNotification,
    error: latestNotificationError,
    isLoading: latestNotificationIsLoading,
  } = useNotificationLatest();

  const { mutate: updateSensor } = useUpdateSensor();
  const { mutate: insertNotification } = useInsertNotification();
  const { colorScheme, toggleColorScheme } = useSensor();
  const { isEnabled } = usePushNotifications();
  // const { messaging } = useNotificationFCMV1();
  const [statusMap, setStatusMap] = useState<{ [key: number]: string }>({});

  const saveVariable = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving variable:', error);
    }
  };

  const readVariable = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        console.log(`No value found for key ${key}`);
        return null;
      }
    } catch (error) {
      console.error('Error reading variable:', error);
      return null;
    }
  };

  readVariable('lastSelectedPreset').then((value) => {
    if (value) setSelectedPreset(value);
  });

  const [selectedPreset, setSelectedPreset] = useState('Away');

  //After loging in always looking for notifications
  useUpdateSensorListener();

  const [isItACustomPreset, setIsItACustomPreset] = useState(false);

  const checkIfOnAPreset = (sensors, presetAwayData, presetHomeData, presetDisarmedData) => {
    let isItACustomPreset = true; // Assume it's a custom preset

    // Helper function to check if a sensor matches a preset
    const sensorMatchesPreset = (sensorId, sensorStatus, presetData) => {
      return presetData.some(
        (presetSensor) => presetSensor.id === sensorId && presetSensor.status === sensorStatus
      );
    };

    // Arrays to store match results
    const matchesAwayArray = [];
    const matchesHomeArray = [];
    const matchesDisarmedArray = [];

    // Iterate over each sensor
    sensors.forEach((sensor) => {
      // Check if the sensor matches any preset and store the result in the corresponding array
      matchesAwayArray.push(sensorMatchesPreset(sensor.id, sensor.status, presetAwayData));
      matchesHomeArray.push(sensorMatchesPreset(sensor.id, sensor.status, presetHomeData));
      matchesDisarmedArray.push(sensorMatchesPreset(sensor.id, sensor.status, presetDisarmedData));
    });

    console.log('MatchesAway:', matchesAwayArray);
    console.log('MatchesHome:', matchesHomeArray);
    console.log('MatchesDisarmed:', matchesDisarmedArray);

    // Check if any of the arrays contain only true values
    if (
      matchesAwayArray.every((match) => match === true) ||
      matchesHomeArray.every((match) => match === true) ||
      matchesDisarmedArray.every((match) => match === true)
    ) {
      isItACustomPreset = false;
    }

    // Update the state with the result
    setIsItACustomPreset(isItACustomPreset);
    console.log('Is it a custom preset?', isItACustomPreset);
  };

  // Call checkIfOnAPreset when the component mounts and all necessary data has been loaded
  useEffect(() => {
    if (sensors && presetAwayData && presetHomeData && presetDisarmedData) {
      console.log('Calling checkIfOnAPreset...'); // Log when the function is called
      checkIfOnAPreset(sensors, presetAwayData, presetHomeData, presetDisarmedData);
      console.log('Is it a custom preset?', isItACustomPreset);
    }
  }, [sensors, presetAwayData, presetHomeData, presetDisarmedData]); // Dependencies

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

          console.log('Push notifications are ', isEnabled);

          // isEnabled && notifyUser(title, body);
          // isEnabled &&
          //   messaging.sendMessage({
          //     data: {
          //       title,
          //       body,
          //     },
          //   });
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
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (error) {
    return <Text>Failed to load sensor data</Text>;
  }

  if (latestNotificationIsLoading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (latestNotificationError) {
    return <Text>Failed to load latest notification data</Text>;
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

  const handlePresetSwitch = (presetName: string) => {
    if (presetName === 'Away') {
      if (presetAwayIsLoading) {
        return (
          <View className="flex-1 items-center justify-center dark:bg-black">
            <ActivityIndicator size="large" color="#84cc16" />
          </View>
        );
      }

      if (presetAwayError) {
        return <Text>Failed to load presetAway data</Text>;
      }

      presetAwayData?.forEach((sensor) => {
        const { id, status } = sensor;
        updateSensor(
          { id, status },
          {
            onSuccess: () => {
              console.log('Success sensors updated based on the "Away" preset');
            },
            onError: () => {
              console.log('Failed to update the sensors with the preset "Away"');
            },
          }
        );
      });
    }

    if (presetName === 'Home') {
      if (presetHomeIsLoading) {
        return (
          <View className="flex-1 items-center justify-center dark:bg-black">
            <ActivityIndicator size="large" color="#84cc16" />
          </View>
        );
      }

      if (presetHomeError) {
        return <Text>Failed to load presetHome data</Text>;
      }

      presetHomeData?.forEach((sensor) => {
        const { id, status } = sensor;
        updateSensor(
          { id, status },
          {
            onSuccess: () => {
              console.log('Success sensors updated based on the "Home" preset');
            },
            onError: () => {
              console.log('Failed to update the sensors with the preset "Home"');
            },
          }
        );
      });
    }

    if (presetName === 'Disarmed') {
      if (presetDisarmedIsLoading) {
        return (
          <View className="flex-1 items-center justify-center dark:bg-black">
            <ActivityIndicator size="large" color="#84cc16" />
          </View>
        );
      }

      if (presetDisarmedError) {
        return <Text>Failed to load presetDisarmed data</Text>;
      }

      presetDisarmedData?.forEach((sensor) => {
        const { id, status } = sensor;
        updateSensor(
          { id, status },
          {
            onSuccess: () => {
              console.log('Success sensors updated based on the "Disarmed" preset');
            },
            onError: () => {
              console.log('Failed to update the sensors with the preset "Disarmed"');
            },
          }
        );
      });
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      {/* Maybe redo this into a Header component */}
      <View className="flex-1 bg-zinc-100 dark:bg-black">
        <View
          className={`min-h-[40%] w-full pl-3 pt-1 ${
            isItACustomPreset
              ? 'bg-stone-300'
              : selectedPreset === 'Away'
                ? 'bg-lime-500'
                : selectedPreset === 'Home'
                  ? 'bg-amber-400'
                  : selectedPreset === 'Disarmed'
                    ? 'bg-red-600'
                    : 'bg-transparent'
          }`}>
          <View className="mt-5 flex-1 flex-col justify-evenly">
            <View className="flex flex-row justify-between">
              <View>
                <Text className="ml-2 mt-3 text-4xl font-semibold antialiased">Your home is</Text>
                <Text className="ml-2 mt-1 text-5xl font-extrabold antialiased">
                  {isItACustomPreset
                    ? 'Unknown'
                    : selectedPreset === 'Away'
                      ? 'Secured'
                      : selectedPreset === 'Home'
                        ? 'Welcoming'
                        : selectedPreset === 'Disarmed'
                          ? 'Unsecured'
                          : 'bg-transparent'}
                </Text>
              </View>
              <Pressable
                onPress={toggleColorScheme}
                className={`mr-8 mt-3 flex flex-row items-center self-center rounded-full px-3 py-1 ${
                  isItACustomPreset
                    ? 'bg-stone-600'
                    : selectedPreset === 'Away'
                      ? 'bg-lime-600'
                      : selectedPreset === 'Home'
                        ? 'bg-amber-500'
                        : selectedPreset === 'Disarmed'
                          ? 'bg-red-700'
                          : 'bg-transparent'
                }`}>
                <Text className="text-sm font-extrabold text-zinc-300 antialiased">switch to </Text>
                <Text className="text-3xl">{`${colorScheme === 'dark' ? '🌞' : '🌙'}`}</Text>
              </Pressable>
            </View>
            <View
              className={`mx-3 mr-7 flex flex-row items-center justify-center self-center rounded-lg p-1 px-2 ${isItACustomPreset === true ? 'flex' : 'hidden'}`}>
              <Ionicons name="warning" size={22} color="orange" />
              <Text className="ml-1 text-lg font-medium text-amber-500 antialiased">
                Be careful you are on a custom preset
              </Text>
            </View>
            <View
              className={`mx-3 mb-14 mr-7 flex h-14 flex-row items-center justify-evenly rounded-lg p-1 px-2  ${
                isItACustomPreset
                  ? 'bg-stone-400'
                  : selectedPreset === 'Away'
                    ? 'bg-lime-600'
                    : selectedPreset === 'Home'
                      ? 'bg-amber-500'
                      : selectedPreset === 'Disarmed'
                        ? 'bg-red-700'
                        : 'bg-transparent'
              }`}>
              <Pressable
                android_ripple={{ color: '#d97706', radius: 58 }}
                className={`mr-2 h-full w-1/3 flex-row items-center justify-center rounded-md ${
                  isItACustomPreset
                    ? 'bg-transparent'
                    : selectedPreset === 'Away'
                      ? 'bg-orange-500'
                      : selectedPreset === 'Home'
                        ? 'bg-transparent'
                        : selectedPreset === 'Disarmed'
                          ? 'bg-transparent'
                          : 'bg-transparent'
                }`}
                onPress={() => {
                  setSelectedPreset('Away');
                  saveVariable('lastSelectedPreset', 'Away');
                  handlePresetSwitch('Away');
                }}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={`${
                    isItACustomPreset
                      ? 'black'
                      : selectedPreset === 'Away'
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
                    isItACustomPreset
                      ? 'text-xl font-semibold'
                      : selectedPreset === 'Away'
                        ? 'text-xl font-bold text-white'
                        : selectedPreset === 'Home'
                          ? 'text-xl font-semibold'
                          : selectedPreset === 'Disarmed'
                            ? 'text-xl font-semibold'
                            : 'bg-transparent'
                  }`}>
                  Away
                </Text>
              </Pressable>
              <Pressable
                android_ripple={{ color: '#451a03', radius: 58 }}
                className={`mr-2 h-full w-1/3 flex-row items-center justify-center rounded-md ${
                  isItACustomPreset
                    ? 'bg-transparent'
                    : selectedPreset === 'Away'
                      ? 'bg-transparent'
                      : selectedPreset === 'Home'
                        ? 'bg-orange-900'
                        : selectedPreset === 'Disarmed'
                          ? 'bg-transparent'
                          : 'bg-transparent'
                }`}
                onPress={() => {
                  setSelectedPreset('Home');
                  saveVariable('lastSelectedPreset', 'Home');
                  handlePresetSwitch('Home');
                }}>
                <MaterialCommunityIcons
                  name="home-lock"
                  size={20}
                  color={`${
                    isItACustomPreset
                      ? 'black'
                      : selectedPreset === 'Away'
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
                    isItACustomPreset
                      ? 'text-xl font-semibold'
                      : selectedPreset === 'Away'
                        ? 'text-xl font-semibold'
                        : selectedPreset === 'Home'
                          ? 'text-xl font-bold text-white'
                          : selectedPreset === 'Disarmed'
                            ? 'text-xl font-semibold'
                            : 'bg-transparent'
                  }`}>
                  Home
                </Text>
              </Pressable>
              <Pressable
                android_ripple={{ color: '#09090b', radius: 58 }}
                className={`h-full w-1/3 flex-row items-center justify-center rounded-md ${
                  isItACustomPreset
                    ? 'bg-transparent'
                    : selectedPreset === 'Away'
                      ? 'bg-transparent'
                      : selectedPreset === 'Home'
                        ? 'bg-transparent'
                        : selectedPreset === 'Disarmed'
                          ? 'bg-zinc-900'
                          : 'bg-transparent'
                }`}
                onPress={() => {
                  setSelectedPreset('Disarmed');
                  saveVariable('lastSelectedPreset', 'Disarmed');
                  handlePresetSwitch('Disarmed');
                }}>
                <MaterialCommunityIcons
                  name="lock-open-variant-outline"
                  size={20}
                  color={`${
                    isItACustomPreset
                      ? 'black'
                      : selectedPreset === 'Away'
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
                    isItACustomPreset
                      ? 'text-xl font-semibold'
                      : selectedPreset === 'Away'
                        ? 'text-xl font-semibold'
                        : selectedPreset === 'Home'
                          ? 'text-xl font-semibold '
                          : selectedPreset === 'Disarmed'
                            ? 'text-xl font-bold text-white'
                            : 'bg-transparent'
                  }`}>
                  Disarmed
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex-1 flex-col justify-between">
          <View
            className="bottom-12 flex-1 bg-zinc-100 py-2 dark:bg-black"
            style={{ borderRadius: 30 }}>
            <View className="flex-row items-center pl-5 pt-3 ">
              <MaterialIcons
                name="sensors"
                size={36}
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
              <Text className="pl-2 text-3xl font-bold dark:text-zinc-50">Sensors</Text>
            </View>
            <View className="flex h-full flex-col px-5">
              <View className="flex-grow" />
              {/* Notification container */}
              {/* Maybe add a text to say that this is the last notification*/}
              <View className="h-11 flex-row items-center rounded-lg bg-zinc-900">
                <SidescrollingText
                  title={latestNotification?.title}
                  body={latestNotification?.body}
                  created_at={latestNotification?.created_at}
                />
              </View>

              {/* Spacer to fill available space */}
              <View className="flex-grow" />

              {/* FlatList container */}
              <View className="flex-grow">
                <FlatList
                  contentContainerClassName="flex flex-row flex-wrap justify-around gap-4 p-5"
                  data={uniqueCategories}
                  renderItem={({ item }) => (
                    <CategoryListItem
                      sensor={item}
                      statusMap={statusMap}
                      toggleAllSensorsInCategory={toggleAllSensorsInCategory}
                      colorScheme={colorScheme}
                    />
                  )}
                  numColumns={2}
                  columnWrapperClassName="gap-4"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
