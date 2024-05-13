import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { View, Text, ImageBackground, Pressable } from 'react-native';

import devices from '~/assets/data/devices';
const image = {
  uri: 'https://th.bing.com/th/id/OIG2.WQoWQuuEZL4iNRkQceXu?pid=ImgGn',
};
const image2 = {
  uri: 'https://th.bing.com/th/id/OIG3.KKmQoRrXmXm1hP.eTdlE?pid=ImgGn',
};

const device = devices[0];

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 flex-row flex-wrap justify-around p-3">
          <Pressable>
            <ImageBackground source={image} resizeMode="cover" imageStyle={{ borderRadius: 16 }}>
              <View className="min-h-48 min-w-48 max-w-48 basis-1/4 rounded-2xl bg-black/15 p-3 backdrop-blur-sm dark:bg-black/45">
                <View className="flex-1 justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-slate-200 dark:text-slate-50">
                      {device.category[0].toUpperCase() + device.category.slice(1)}
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-200">
                      {device.name}
                    </Text>
                  </View>
                  <Pressable className="w-12 items-center rounded-full p-2 dark:bg-black">
                    <Ionicons name="power" size={28} color="white" />
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      </View>
    </>
  );
}
