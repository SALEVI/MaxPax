import messaging from '@react-native-firebase/messaging';
import React, { useEffect, createContext, useContext } from 'react';
import { Alert } from 'react-native';

const NotificationFCMV1Context = createContext({});

const NotificationFCMV1Provider = ({ children }) => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status: ', authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log(token);
        });
    } else {
      console.log('Permission not granted', authStatus);
    }

    //Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification cause app to open from quite state:',
            remoteMessage.notification
          );
        }
      });

    //Asume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notfication caused app to open from background state:',
        remoteMessage.notification
      );
    });

    //Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <NotificationFCMV1Context.Provider value={{ messaging }}>
      {children}
    </NotificationFCMV1Context.Provider>
  );
};

export default NotificationFCMV1Provider;

export const useNotificationFCMV1 = () => useContext(NotificationFCMV1Context);
