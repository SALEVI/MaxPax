import { Stack } from 'expo-router';
import { View, FlatList } from 'react-native';

import devices from '~/assets/data/devices';
import CategoryListItem from '~/components/CategoryListItem';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="flex items-center justify-center bg-white py-40 dark:bg-black">
        <FlatList
          contentContainerClassName="flex-grow flex-row flex-wrap justify-evenly gap-4 p-5"
          data={devices}
          renderItem={({ item }) => <CategoryListItem device={item} />}
          numColumns={2}
          columnWrapperClassName="gap-4"
        />
      </View>
    </>
  );
}
