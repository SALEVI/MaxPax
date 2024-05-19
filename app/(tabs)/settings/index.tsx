import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import SettingsListItem from '../../../components/SettingsListItem';

import { usePresetAwayList, usePresetDisarmedList, usePresetHomeList } from '~/api/presets';
import SettingsPreset from '~/components/SettingsPreset';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const router = useRouter();

  const {
    // refetch: refetchPresetAway,
    data: presetAway,
    error: presetAwayError,
    isLoading: presetAwayIsLoading,
  } = usePresetAwayList();

  const {
    // refetch: refetchPresetHome,
    data: presetHome,
    error: presetHomeError,
    isLoading: presetHomeIsLoading,
  } = usePresetHomeList();

  const {
    // refetch: refetchPresetDisarmed,
    data: presetDisarmed,
    error: presetDisarmedError,
    isLoading: presetDisarmedIsLoading,
  } = usePresetDisarmedList();

  if (presetAwayIsLoading || presetHomeIsLoading || presetDisarmedIsLoading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (presetAwayError) {
    return <Text>Failed to load presetAway</Text>;
  }

  if (presetHomeError) {
    return <Text>Failed to load presetHome</Text>;
  }

  if (presetDisarmedError) {
    return <Text>Failed to load presetDisarmed</Text>;
  }

  // const handleRefresh = () => {
  //   refetchPresetAway();
  //   refetchPresetHome();
  //   refetchPresetDisarmed();
  // };

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
            <SettingsPreset presetName="Away" preset={presetAway} />
            <SettingsPreset presetName="Home" preset={presetHome} />
            <SettingsPreset presetName="Disarmed" preset={presetDisarmed} />
          </View>

          <View className="mt-5 border dark:border-zinc-900" />
          <View className="-ml-3 mb-5 mt-3">
            {/* <Pressable onPress={signOutUser} className="-ml-3 mb-5 mt-3"> */}
            <View className="flex flex-row items-center px-5 dark:bg-black">
              <Ionicons name="log-out-outline" size={26} color="#dc2626" />
              <TouchableOpacity onPress={signOutUser}>
                <Text className="pl-3 text-2xl font-bold antialiased dark:text-zinc-200">
                  Sign out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* </Pressable> */}
        </View>
      </ScrollView>
    </>
  );
}
