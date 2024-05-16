import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Pressable } from 'react-native';

// import { Tables } from '~/database.types';
import { Tables } from 'types';

const image = {
  uri: 'https://th.bing.com/th/id/OIG2.WQoWQuuEZL4iNRkQceXu?pid=ImgGn',
};

type CategoryListItemProps = {
  sensor: Tables<'sensor_data'>;
  statusMap: { [key: string]: string };
  toggleAllSensorsInCategory: (category: string) => void;
};

const CategoryListItem = ({
  sensor,
  statusMap,
  toggleAllSensorsInCategory,
}: {
  sensor: Tables<'sensor_data'>;
  statusMap: { [key: string]: string };
  toggleAllSensorsInCategory: (category: string) => void;
}) => {
  // Your component logic here
  const [isPressed, setIsPressed] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#84cc16');

  useEffect(() => {
    const sensorsInCategory = Object.keys(statusMap).filter(
      (sensorId) => sensor.category === sensor.category
    );
    const allOff = sensorsInCategory.every((sensorId) => statusMap[sensorId] === 'off');

    if (allOff) {
      setBackgroundColor('red');
    } else {
      setBackgroundColor('#84cc16');
    }
  }, [statusMap]);

  const handlePress = () => {
    toggleAllSensorsInCategory(sensor.category);
    setIsPressed(!isPressed);
  };

  return (
    <Link
      href={{
        pathname: `/home/${sensor.category}`,
        // params: { id: sensor.id },
      }}
      asChild>
      <Pressable>
        <ImageBackground source={image} resizeMode="cover" imageStyle={{ borderRadius: 16 }}>
          <View className="min-h-48 min-w-48 basis-1/4 rounded-2xl bg-black/15 backdrop-blur-sm dark:bg-black/45">
            <View className="flex-1 justify-between p-4">
              <View>
                <Text className="text-2xl font-bold text-slate-200 dark:text-zinc-50">
                  {sensor.category[0].toUpperCase() + sensor.category.slice(1)}
                </Text>
                <Text className="text-sm text-slate-900 dark:text-zinc-200">{sensor.name}</Text>
              </View>
              <Pressable
                onPress={handlePress}
                style={{ backgroundColor: isPressed ? 'red' : backgroundColor }}
                className="w-12 items-center justify-center rounded-full p-2 dark:bg-black">
                <Ionicons name="power" size={28} color="black" />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
};

export default CategoryListItem;
