import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, BackHandler, ImageBackground } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Header, HeaderMain } from '../../common';
import Notifications from './Notifications';
import Announcements from './Announcements';
import { EventRegister } from 'react-native-event-listeners';
import styles from './NotificationsStyle';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { getNotiStatus } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from "../../../Constants";
import { getData } from '../../../Utils/MethodsUtils';

const NotificationsTab = props => {
  const dispatch = useDispatch();
  const [notiEnabled, setNotiEnabled] = useState('noti');
  const [isLoading, setLoading] = useState(false);
  const [isTangem, setIsTangem] = useState(false);
  const { notifications } = LanguageManager;

  /******************************************************************************************/
  useEffect(() => {
    checkIsTangem();
    EventRegister.addEventListener('hitWalletApi', () => {
      console.log('chk currrentscene::::::', Actions.currentScene);
      Actions.currentScene == 'NotificationsTab' && fetchNotiStatus();
    });
    let focusListener = props.navigation.addListener('didFocus', () => {
      checkIsTangem();
      fetchNotiStatus();
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    let blurListener = props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    });
    return () => {
      focusListener?.remove();
      blurListener?.remove();
    };
  }, []);

  const checkIsTangem = async () => {
    let tempLoginData = await getData(Constants.LOGIN_DATA);
    const login_data = typeof tempLoginData == 'string' ? JSON.parse(tempLoginData) : tempLoginData
    setIsTangem(!!login_data?.isTangem);
  }

  /******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log('Backhandler NotificationsTab');
    Actions.pop()
    // Singleton.bottomBar?.navigateTab('_WalletMain') || Singleton.bottomBar?.navigateTab('WalletMain');
    // Actions.jump('WalletMain');
    return true;
  };

  /******************************************************************************************/
  useEffect(() => {
    global.isPushNotificationEnabled = false;
    setLoading(!isLoading);
  }, [notiEnabled]);


  /******************************************************************************************/
  const backCallBack = () => {
    Actions.pop()
    // Actions.jump('WalletMain');
  };

  /******************************************************************************************/
  const fetchNotiStatus = () => {
    const data = {
      key: 0
    };
    dispatch(getNotiStatus({ data })).then(res => {
      console.log('chk noti res::::::', res);
    }).catch(err => {
      console.log('chk noti err::::::', err);
    });
  };

  /******************************************************************************************/
  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <HeaderMain
        backCallBack={() => backCallBack()}
        BackButtonText={notifications.notifications}

      />

      <Notifications navigation={props.navigation} />

    </ImageBackground>
  );
};

export default NotificationsTab;
