import { Tables } from 'database.types';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useSegments } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

// dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

type NotificationListItemProps = {
  notification: Tables<'notifications'>;
};

const NotificationListItem = ({ notification }: NotificationListItemProps) => {
  const segments = useSegments();

  return (
    <View className="mx-5 mb-3 flex flex-row items-center justify-between rounded-md border border-zinc-800 p-5">
      <View className="flex h-24 flex-col justify-around">
        <Text className="text-xl font-extrabold antialiased dark:text-white">
          {notification.title.charAt(0).toUpperCase() + notification.title.slice(1)}
        </Text>
        {notification.body && (
          <Text className="text-md font-normal antialiased dark:text-zinc-100">
            {notification.body.charAt(0).toUpperCase() + notification.body.slice(1)}
          </Text>
        )}
        <Text className="mt-1 text-xs font-light antialiased dark:text-zinc-200">
          {dayjs(notification.created_at).format('LLLL')}
        </Text>
      </View>
      {/* 
      <BlurView
        intensity={50}
        tint="systemUltraThinMaterial"
        style={{ overflow: 'hidden' }}
        className="h-8 w-12 items-center justify-center rounded-md"
      /> */}
      <View className="flex h-24 flex-col-reverse items-end justify-between py-1">
        <View
          className={`h-8 w-auto items-center justify-center rounded-lg border  px-3 ${notification.status === 'on' ? 'border-zinc-800' : 'border-red-500'}`}>
          <Text
            className={`text-sm font-medium antialiased ${
              notification.status === 'on' ? 'text-lime-500' : 'text-red-500'
            }`}>
            {notification.status}
          </Text>
        </View>
        {notification.value && (
          <View className="h-8 w-auto items-center justify-center rounded-lg border border-zinc-800 px-3">
            <Text className="text-sm font-medium antialiased dark:text-orange-400">
              Read value : {notification.value}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationListItem;
