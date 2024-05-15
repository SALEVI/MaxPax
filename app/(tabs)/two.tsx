import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View, Text, Button } from 'react-native';

import { useSensor } from '~/providers/SensorProvider';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const { sensors } = useSensor();

  const router = useRouter();

  async function signOutUser() {
    await supabase.auth.signOut();
    router.push('/sign-in');
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
        <Text> {sensors.length}</Text>
        <Button title="Sign out" onPress={signOutUser} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
