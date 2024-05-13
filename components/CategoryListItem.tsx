import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { View, Text, ImageBackground, Pressable } from 'react-native';

const image = {
  uri: 'https://th.bing.com/th/id/OIG2.WQoWQuuEZL4iNRkQceXu?pid=ImgGn',
};

const CategoryListItem = ({ device }) => {
  return (
    <Link href={`/home/${device.category}`} asChild>
      <Pressable>
        <ImageBackground source={image} resizeMode="cover" imageStyle={{ borderRadius: 16 }}>
          <View className="min-h-48 min-w-48 basis-1/4 rounded-2xl bg-black/15 backdrop-blur-sm dark:bg-black/45">
            <View className="flex-1 justify-between p-4">
              <View>
                <Text className="text-2xl font-bold text-slate-200 dark:text-zinc-50">
                  {device.category[0].toUpperCase() + device.category.slice(1)}
                </Text>
                <Text className="text-sm text-slate-900 dark:text-zinc-200">{device.name}</Text>
              </View>
              <Pressable className=" w-12 items-center justify-center rounded-full p-2 dark:bg-black">
                <Ionicons name="power" size={28} color="white" />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
};

export default CategoryListItem;
