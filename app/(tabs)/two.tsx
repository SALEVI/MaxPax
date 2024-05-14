import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { useSensor } from '~/providers/SensorProvider';

export default function Home() {
  const { sensors } = useSensor();

  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
        <Text> {sensors.length}</Text>
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
