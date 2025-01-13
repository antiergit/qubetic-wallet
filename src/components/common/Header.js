import React, { useEffect, useState } from 'react';
import { Fonts, Images } from '../../theme/';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../ThemeManager';
import DeviceInfo from 'react-native-device-info';
import { bottomNotchWidth, getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../Utils';

let deviceName = '';

const Header = props => {
  const [themeSelected, setThemeSelected] = useState(0);

  //******************************************************************************************/
  useEffect(() => {
    getDeviceName();
  }, [props]);

  //******************************************************************************************/
  const getDeviceName = async () => {
    deviceName = await DeviceInfo.getDeviceName();
    // console.log('deviceName::::', deviceName);
  };

  //******************************************************************************************/
  useEffect(async () => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
  }, [props]);

  //******************************************************************************************/
  return (
    <View style={[styles.HeaderStyle, { borderColor: ThemeManager.colors.dividerColor }, props.bgColor, props.customStyle,]}>

      {props.backCallBack ? (
        <TouchableOpacity style={{ width: 25, }} onPress={() => props.backCallBack()}>
          {!props?.showBackBtn && (
            <Image source={Images.blackBack} style={[props.imgStyle,]} />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.touchableStyle} onPress={() => { Actions.pop() }}>
          {!props?.showBackBtn && (
            <Image source={Images.blackBack} />
          )}
        </TouchableOpacity>
      )}

      {props.beforeImport ? (
        <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.TextColor }, props.TextcustomStyle]} numberOfLines={1}>{props.BackButtonText}</Text>
      ) : (
        <Text allowFontScaling={false} style={[styles.textStyleNew, { color: ThemeManager.colors.TextColor }, props.TextcustomStyle]} numberOfLines={props.expandHeader ? 2 : 1}>{props.BackButtonText}</Text>
      )}

      {props.imgThird && (
        <TouchableOpacity onPress={props.onPressCsv} style={{ width: 25, height: 22, marginRight: 5 }}>
          <Image source={Images.csv} style={styles.imgStyle1} />
        </TouchableOpacity>
      )}

      {props.imgSecond ? (
        <TouchableOpacity onPress={props.onPressIcon} style={{ width: 25, height: 22 }}>
          <Image source={props.imgSecond} style={styles.imgStyle1} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ width: 25, height: 25 }}></TouchableOpacity>
      )}

    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  imgStyle1: {
    resizeMode: 'contain',
    width: 19,
    height: 19,
    tintColor: 'white',
  },
  textStyle: {
    textAlign: 'center',
    flex: 2,
    fontFamily: Fonts.dmBold,
    fontSize: 18,
  },
  textStyleNew: {
    textAlign: 'center',
    flex: 2,
    fontFamily: Fonts.dmBold,
    fontSize: dimen(20),
    lineHeight: dimen(25),
    letterSpacing: 0.27,
  },
  touchableStyle: {
    width: 28,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  HeaderStyle: {
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS == 'ios' ? DeviceInfo.hasNotch() ? 0 : 20 : deviceName == 'OPPO F19 Pro' || 'OnePlus NordCE 5G' ? 25 : 25,
    borderBottomWidth: 1,

  },
  backButtonTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 18,
    color: ThemeManager.colors.whiteText,
    marginLeft: 14.7,
  },
});

export { Header };
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { getData } from '../../Utils/MethodsUtils'; import { EventRegister } from 'react-native-event-listeners';