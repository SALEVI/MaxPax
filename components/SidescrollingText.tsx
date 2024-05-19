import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

dayjs.extend(localizedFormat);

const SidescrollingText = ({ title, body, created_at }) => {
  const router = useRouter();
  // Define the action to perform on press
  const handlePress = () => {
    router.push('/notifications');
  };

  return (
    <ScrollView
      className="mr-2"
      contentContainerStyle={{
        alignItems: 'center',
      }}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <Ionicons name="chevron-forward" size={20} color="white" className="ml-2" />
      <MaterialIcons name="notifications-on" size={20} color="white" />
      <TouchableOpacity onPress={handlePress}>
        <Text className="ml-2 self-center text-lg font-semibold text-white">
          {title} {body}
        </Text>
      </TouchableOpacity>
      <Text className="text-md ml-2 self-center font-thin text-zinc-300">
        {dayjs(created_at).format('llll')}
      </Text>
    </ScrollView>
  );
};
export default SidescrollingText;
