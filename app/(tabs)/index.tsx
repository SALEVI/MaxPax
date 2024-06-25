import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function TabIndex() {
  return (
    <View className="flex-1 items-center justify-center dark:bg-black">
      <ActivityIndicator size="large" color="#84cc16" />
      <Redirect href="/home/" />
    </View>
  );
}
