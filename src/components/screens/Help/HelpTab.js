import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, BackHandler } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Header } from '../../common';
import SupportTicket from './SupportTicket';
import SupportHistory from './SupportHistory';
import { EventRegister } from 'react-native-event-listeners';
import styles from './HelpStyle';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { saveData } from '../../../Utils/MethodsUtils';
import { getNotiStatus } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';

const HelpTab = props => {
  const dispatch = useDispatch();
  const [notiEnabled, setNotiEnabled] = useState('support_ticket');
  const [isLoading, setLoading] = useState(false);
  const { help, setting } = LanguageManager;

  useEffect(() => {
    // EventRegister.addEventListener('hitWalletApi', () => {
    //   console.log('chk currrentscene::::::', Actions.currentScene);
    //   Actions.currentScene == 'NotificationsTab' && fetchNotiStatus();
    // });
    let focusListener = props.navigation.addListener('didFocus', () => {
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

  /******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log('Backhandler HelpTab');
    Singleton.bottomBar?.navigateTab('_Settings') || Singleton.bottomBar?.navigateTab('Settings');
    Actions.jump('Settings');
    return true;
  };
  /******************************************************************************************/
  useEffect(() => {
    setLoading(!isLoading);
  }, [notiEnabled]);

  /******************************************************************************************/
  const onPress = type => {
    setNotiEnabled(type);
    console.log('chk type:::::', type);
  };

  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        BackButtonText={setting.help}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />

      <View style={{ flex: 1 }}>
        <View style={[styles.tab_wrapstyle]}>
          <View style={[styles.tabsWrap, { backgroundColor: ThemeManager.colors.modalCard }]}>
            <TouchableOpacity onPress={() => onPress('support_ticket')} style={notiEnabled == 'support_ticket' ? [styles.tab_isActiveStyle, { backgroundColor: ThemeManager.colors.activeTab }] : styles.tab_inActiveStyle}>
              <Text allowFontScaling={false} style={[styles.tab_isActiveTextStyle, { color: notiEnabled == 'support_ticket' ? ThemeManager.colors.Mainbg : ThemeManager.colors.inActiveTabText }]}>
                {help.supportTicket}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={notiEnabled == 'support_history' ? [styles.tab_isActiveStyle, { backgroundColor: ThemeManager.colors.activeTab }] : styles.tab_inActiveStyle} onPress={() => onPress('support_history')}>
              <Text allowFontScaling={false} style={[styles.tab_isActiveTextStyle, { color: notiEnabled == 'support_history' ? ThemeManager.colors.Mainbg : ThemeManager.colors.inActiveTabText }]}>
                {help.supportHistory}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {notiEnabled == 'support_ticket' ? (
          <SupportTicket navigation={props.navigation} />
        ) : (
          <SupportHistory navigation={props.navigation} />
        )}
      </View>
    </View>
  );
};

export default HelpTab;
