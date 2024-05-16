import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, ImageBackground, Pressable } from 'react-native';
import { Tables } from 'types';

const categoryImages = {
  motions: {
    uri: '*******/storage/v1/object/sign/category-images/PIRmotionTBG-115.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvUElSbW90aW9uVEJHLTExNS5wbmciLCJpYXQiOjE3MTU4NTAyODEsImV4cCI6MTc0NzM4NjI4MX0.7ED86TKveazBFWAlDmEKV0_vUK-FALqFUHadloFstYo&t=2024-05-16T09%3A04%3A19.475Z',
  },
  windows: {
    uri: '*******/storage/v1/object/sign/category-images/DoorTBG-100.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvRG9vclRCRy0xMDAucG5nIiwiaWF0IjoxNzE1ODUwMzE0LCJleHAiOjE3NDczODYzMTR9.EmeFZchq93i6eh3vFn7gDuyKfEE_kD-lM2SWjqLj4g8&t=2024-05-16T09%3A04%3A52.088Z',
  },
  doors: {
    uri: '*******/storage/v1/object/sign/category-images/DoorTBG-100.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvRG9vclRCRy0xMDAucG5nIiwiaWF0IjoxNzE1ODUwMzM3LCJleHAiOjE3NDczODYzMzd9.Y9WEK-lqRJrlIzAJxzzKBBvpaCPsKmmfkD_9uVgf_A0&t=2024-05-16T09%3A05%3A15.587Z',
  },
  alarms: {
    uri: '*******/storage/v1/object/sign/category-images/AlarmTBG-1000g.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvQWxhcm1UQkctMTAwMGcucG5nIiwiaWF0IjoxNzE1ODUwMzAwLCJleHAiOjE3NDczODYzMDB9.wRostGzVJ6s0NVWjmyN7HHHHnX8Fgk6tmP7PwcrGbnc&t=2024-05-16T09%3A04%3A38.821Z',
  },
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
}: CategoryListItemProps) => {
  // Your component logic here
  const [isPressed, setIsPressed] = useState(false);
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
        <ImageBackground
          source={categoryImages[sensor.category as keyof typeof categoryImages]}
          resizeMode="cover"
          imageStyle={{ borderRadius: 16 }}>
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
                className="w-12 items-center justify-center rounded-full p-2 dark:bg-lime-500">
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
