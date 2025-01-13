import notifee, { AndroidImportance, TriggerType, AndroidVisibility } from '@notifee/react-native';
import { Appearance, Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
let lastMessageId = 0

const showNotification = async (title, message, messageId) => {
  if (messageId != lastMessageId) {
    console.log("TEST>>>", title, message);

    lastMessageId = messageId
    const channelId = await notifee.createChannel({
      id: messageId,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
    console.log("channelId", channelId)
    await notifee.displayNotification({
      title: title,
      body: message,
      android: {
        timestamp: new Date().getTime(),
        channelId: channelId,
        smallIcon: 'ic_stat_name',
        // color: Appearance.getColorScheme() === 'dark' ? '#ffffff' : '#7e7e7e',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }


}

const handleScheduleNotification = async (title, message, time) => {
  // console.log("title----", title, message);
  try {
    const date = new Date(Date.now() + (time));
    const channelId = await notifee.createChannel({
      id: time?.toString(),
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      // alarmManager: true,
    };
    await notifee.createTriggerNotification(
      {
        title: title,
        body: message,
        android: {
          channelId: channelId,
          smallIcon: 'ic_stat_name',
          color: Appearance.getColorScheme() === 'dark' ? '#ffffff' : '#7e7e7e',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger,
    );
  } catch (error) {
    console.log("error----", error);

  }

}

const handleCancelAndScheduleNotification = (title, message, time) => {


  notifee.getTriggerNotificationIds().then(ids => {

    notifee.cancelTriggerNotifications(ids).finally(res => {

      handleScheduleNotification(title, message, time)
    })

  });

}

const handleCancel = () => {
  notifee.getTriggerNotificationIds().then(ids => {
    notifee.cancelTriggerNotifications(ids)
  });
}

const createNotificationChannel = async () => {
  if (Platform.OS == "ios") {
    await notifee.requestPermission()
  } else {
    await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    await notifee.createChannel({
      id: 'default',
      name: 'Qubetics',
      vibration: true,
      badge: true,
      soundName: "default",
    });
  }
}


export { showNotification, handleScheduleNotification, handleCancelAndScheduleNotification, handleCancel, createNotificationChannel, }
