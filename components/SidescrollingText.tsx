import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ScrollView, Text } from 'react-native';

dayjs.extend(localizedFormat);

const SidescrollingText = ({ title, body, created_at }) => {
  return (
    <ScrollView
      className="mr-3"
      contentContainerStyle={{
        alignItems: 'center',
      }}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <Ionicons name="chevron-forward" size={20} color="white" className="ml-2 mr-3" />
      <MaterialIcons name="notifications-on" size={20} color="white" />
      <Text className="ml-2 self-center text-lg font-semibold dark:text-white">
        {title} {body}
      </Text>
      <Text className="text-md self-center font-medium dark:text-white"> </Text>
      <Text className="text-md ml-2 self-center font-thin dark:text-zinc-300">
        {dayjs(created_at).format('llll')}
      </Text>
    </ScrollView>
  );
};

export default SidescrollingText;
