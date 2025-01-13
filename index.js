/**
 * @format
 */
import 'whatwg-fetch';
import 'text-encoding-polyfill'
import 'react-native-url-polyfill/auto';
import messaging from '@react-native-firebase/messaging';
import './shim';
import '@react-native-anywhere/polyfill-base64';
import { AppRegistry, Platform, Text } from 'react-native';

import App from './src/App';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-community/async-storage';
export const crypt = crypto;
import SplashScreen from 'react-native-splash-screen'

if (!messaging().isDeviceRegisteredForRemoteMessages) {
  messaging().registerDeviceForRemoteMessages();
}
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    console.log('Message handled in the background!', remoteMessage);
  } catch (error) {
    console.log(' Message handled error ', error);
  }
});
SplashScreen.hide();


AppRegistry.registerComponent(appName, () => App);