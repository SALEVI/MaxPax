import { View, Text, ActivityIndicator, FlatList } from 'react-native';

import { useNotificationList } from '~/api/notifications';
import { useInsertNotificationListener } from '~/api/notifications/subscriptions';
import NotificationListItem from '~/components/NotificationListItem';

export default function NotificationsScreen() {
  const { data: notifications, error, isLoading } = useNotificationList();

  useInsertNotificationListener();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-black">
        <ActivityIndicator size="large" color="#84cc16" />
      </View>
    );
  }

  if (error) {
    return <Text>Failed to load data</Text>;
  }

  return (
    <>
      <View className="flex-1 dark:bg-black">
        <FlatList
          className="mt-3"
          data={notifications}
          renderItem={({ item }) => <NotificationListItem notification={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </>
  );
}
