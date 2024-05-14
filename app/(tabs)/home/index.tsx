import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { remapProps } from 'nativewind';
import { View, FlatList, Text } from 'react-native';

import devices from '~/assets/data/devices';
import CategoryListItem from '~/components/CategoryListItem';

//this might be unnecessary since of v4 nativewind
remapProps(FlatList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
  columnWrapperClassName: 'columnWrapperStyle',
});

export default function Home() {
  const uniqueCategories = devices.reduce((acc, device) => {
    const categoryExists = acc.find((item) => item.category === device.category);
    if (!categoryExists) {
      acc.push(device);
    }
    return acc;
  }, []);
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="flex-1 dark:bg-black">
        <View className="min-h-72 w-full pl-5 pt-12 dark:bg-lime-300">
          <Text className="text-3xl font-medium">Your home is</Text>
          <Text className="text-4xl font-extrabold">Secured</Text>
        </View>
        <View className="bottom-12 flex-1 bg-white py-2 dark:bg-black" style={{ borderRadius: 30 }}>
          <View className="flex-row items-center pl-5 pt-5 ">
            <MaterialIcons name="sensors" size={36} color="white" />
            <Text className="pl-2 text-3xl font-bold dark:text-zinc-50">Devices</Text>
          </View>
          <FlatList
            contentContainerClassName="flex-grow flex-row flex-wrap justify-evenly gap-4 p-5 mt-10"
            data={uniqueCategories}
            renderItem={({ item }) => <CategoryListItem device={item} />}
            numColumns={2}
            columnWrapperClassName="gap-4"
          />
        </View>
      </View>
    </>
  );
}
