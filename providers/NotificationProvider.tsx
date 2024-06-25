import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpoPushToken } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from 'utils/notifications';

import { useInsertNotificationListener } from '~/api/notifications/subscriptions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const PushNotificationContext = createContext({});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState<ExpoPushToken>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const [isEnabled, setIsEnabled] = useState(true); // Initialize isEnabled as true
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useInsertNotificationListener();

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const storedStatus = await AsyncStorage.getItem('notificationsEnabled');
      if (storedStatus !== null) {
        setIsEnabled(storedStatus === 'true'); // Log the retrieved status
        console.log(`Retrieved notification status from storage: ${storedStatus}`);
      }
    };

    checkNotificationStatus();

    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token ?? '');
      })
      .catch((error: any) => {
        setExpoPushToken(`${error}`);
      });

    // Check if isEnabled is true before adding listeners

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    // Cleanup function to remove listeners when isEnabled changes
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []); // Depend on isEnabled to rerun the effect when it changes

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      await AsyncStorage.setItem('notificationsEnabled', 'false');
      setIsEnabled(false);
      console.log('Push Notifications turned off'); // Log when notifications are turned off
      alert('Push Notifications turned off');
    } else {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access notifications was denied');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('New push token:', token); // Log the new push token

      await AsyncStorage.setItem('notificationsEnabled', 'true');
      setIsEnabled(true);
      console.log('Push Notifications turned on'); // Log when notifications are turned on
      alert('Push Notifications turned on');
    }
  };

  console.log('Current push token:', expoPushToken);
  console.log('Current notification:', notification);

  return (
    <PushNotificationContext.Provider value={{ isEnabled, handleToggleNotifications }}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export default NotificationProvider;

export const usePushNotifications = () => useContext(PushNotificationContext);
