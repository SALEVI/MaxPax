import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View className="flex-1 bg-white dark:bg-slate-800">
        <Text className="text-3xl font-bold text-slate-700 dark:text-slate-200">Hello world</Text>
        <View className="flex-1 flex-row flex-wrap justify-around p-2">
          <View className="min-h-48 min-w-48 max-w-48 basis-1/4 rounded-lg bg-slate-800 p-5 backdrop-blur-sm dark:bg-white/15">
            <Text className="text-3xl font-bold text-slate-200 dark:text-slate-200">Alarm</Text>
            <Text className="text-sm font-bold text-slate-900 dark:text-slate-200">
              Pir, Motion, etc
            </Text>
          </View>
          <View className="min-h-48 min-w-48 max-w-48 basis-1/4 rounded-lg bg-slate-800 p-5 backdrop-blur-sm dark:bg-white/15">
            <Text className="text-3xl font-bold text-slate-200 dark:text-slate-200">Alarm</Text>
            <Text className="text-sm font-bold text-slate-900 dark:text-slate-200">
              Pir, Motion, etc
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
