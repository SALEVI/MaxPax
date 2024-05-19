import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View, Text, ImageBackground, Pressable } from 'react-native';
import { Tables } from 'types';

const categoryImages = {
  motions: {
    uri: '*******/storage/v1/object/sign/category-images/Motions.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvTW90aW9ucy5wbmciLCJpYXQiOjE3MTYwNTc4MTAsImV4cCI6MTc0NzU5MzgxMH0.mSZZNcWtN8q8HsRSSvWfQ4UeRF8fvUmxPN4qTQIQsYo&t=2024-05-18T18%3A43%3A04.737Z',
  },
  windows: {
    uri: '*******/storage/v1/object/sign/category-images/Windows2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvV2luZG93czIucG5nIiwiaWF0IjoxNzE2MDU4MzI2LCJleHAiOjE3NDc1OTQzMjZ9.wI2jTUU6tsskxLEe_w3thh-EiVw2B7YJjzLd_K70KaM&t=2024-05-18T18%3A51%3A40.884Z',
  },
  doors: {
    uri: '*******/storage/v1/object/sign/category-images/Doors2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvRG9vcnMyLnBuZyIsImlhdCI6MTcxNjA1ODM0MCwiZXhwIjoxNzQ3NTk0MzQwfQ.kQzAQc827dd4f1qeLYDFRtXMej7TT999AdI1uye7ZDI&t=2024-05-18T18%3A51%3A54.862Z',
  },
  alarms: {
    uri: '*******/storage/v1/object/sign/category-images/Alarms.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJjYXRlZ29yeS1pbWFnZXMvQWxhcm1zLnBuZyIsImlhdCI6MTcxNjA1Nzg3NCwiZXhwIjoxNzQ3NTkzODc0fQ.MIVgH3TUAdmSGGidjRCJFfcheQzaAiSE5AG2lfUwpyY&t=2024-05-18T18%3A44%3A08.689Z',
  },
};

type CategoryListItemProps = {
  sensor: Tables<'sensor_data'>;
  statusMap: { [key: string]: string };
  toggleAllSensorsInCategory: (category: string) => void;
  colorScheme: 'light' | 'dark';
};

const CategoryListItem = ({
  sensor,
  statusMap,
  toggleAllSensorsInCategory,
  colorScheme,
}: CategoryListItemProps) => {
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
          imageStyle={{ borderRadius: 10 }}>
          <View className="min-h-28 min-w-52 basis-1/4 backdrop-blur-sm dark:bg-black/25">
            <View className="ml-3 mr-2 flex-1 justify-evenly">
              <View>
                <Text className="text-xl font-bold text-slate-200 dark:text-zinc-50">
                  {sensor.category[0].toUpperCase() + sensor.category.slice(1)}
                </Text>
              </View>
              <Pressable
                //border or borderless hmm
                android_ripple={{ color: '#d9f99d', radius: 22, borderless: true }}
                onPress={handlePress}
                className="w-10 items-center self-end rounded-full bg-lime-500 p-2 blur-sm">
                <Ionicons
                  name="power"
                  size={18}
                  color={`${colorScheme === 'dark' ? 'black' : 'white'}`}
                />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
};

export default CategoryListItem;
