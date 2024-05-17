import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, ScrollView } from 'react-native';

import SettingsListItem from '../../../components/SettingsListItem';

import SettingsPreset from '~/components/SettingsPreset';
import { useSensor } from '~/providers/SensorProvider';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const router = useRouter();
  const { presetAway, presetHome, presetDisarmed } = useSensor();

  async function signOutUser() {
    await supabase.auth.signOut();
    router.push('/sign-in');
  }

  const settingsName = 'Push notifications';
  return (
    <>
      <ScrollView className="flex-1 px-7 dark:bg-black">
        <View className="">
          <Text className=" pb-3 pt-5 text-2xl font-bold antialiased dark:text-zinc-100">
            Preference
          </Text>
          <SettingsListItem settingsName={settingsName} iconName="notifications-off-outline" />

          <Text className=" pb-3 text-2xl font-bold antialiased dark:text-zinc-100">Presets</Text>

          <View>
            <SettingsPreset presetName="Away" sensor={presetAway} />
            <SettingsPreset presetName="Home" sensor={presetHome} />
            <SettingsPreset presetName="Disarmed" sensor={presetDisarmed} />
          </View>

          <View className="mt-5 border dark:border-zinc-900" />
          <Pressable onPress={signOutUser} className="-ml-3 mb-5 mt-3">
            <View className="flex flex-row items-center px-5 dark:bg-black">
              <Ionicons name="log-out-outline" size={26} color="#dc2626" />
              <Text className="pl-3 text-2xl font-bold antialiased dark:text-zinc-200">
                Sign out
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
