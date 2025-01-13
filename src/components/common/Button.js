import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts, Images } from '../../theme/';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../theme/Fonts';
import { ThemeManager } from '../../../ThemeManager';
import * as Constants from '../../Constants';
import { getData } from '../../Utils/MethodsUtils';
import { ButtonNew } from './buttonNew';
import { EventRegister } from 'react-native-event-listeners';
import { getDimensionPercentage as dimen, } from '../../Utils';

const BtnContainer = {
  GRADIENT: LinearGradient,
  TOUCHABLE: TouchableOpacity,
}

const Button = (props) => {
  const [themeSelected, setThemeSelected] = useState(
    props?.themeSelected || ""
  );
  const [isPin, setIsPin] = useState(false);

  /******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener("getThemeChanged", (data) => {
      checkPin();
      setThemeSelected(data);
    });
    getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
      checkPin();
      setThemeSelected(theme);
    });
  }, []);

  /******************************************************************************************/
  const checkPin = () => {
    getData(Constants.PIN_LOCK).then((pin) => {
      const havingPin = pin ? true : false;
      setIsPin(havingPin);
    });
  };

  let Container = BtnContainer.GRADIENT;
  if (props?.isTouchableBtn) {
    Container = BtnContainer.TOUCHABLE;
  }
  /******************************************************************************************/

  return (
    <ButtonNew
      disabled={props.disabled}
      onPress={props.onPress}
      style={props.customStyle}
      isNeedToClose={props.isNeedToClose}
    >
      {props.isLogout ? (
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={
            props.isDisabled ? ["#737373", "#737373", "#737373", "#737373"] :
              ["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"]
          }
          style={[styles.sendBtnStyle, props.myStyle]}
        >
          <Text
            allowFontScaling={false}
            style={[styles.sendBtnTextStyle, props.restoreStyle]}
          >
            {props.buttontext}
          </Text>
        </LinearGradient>
      ) : props.isManage ? (
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={
            props.img && !props.showWhiteBg
              ? [
                ThemeManager.colors.settingsText,
                ThemeManager.colors.settingsText,
              ]
              : props.showWhiteBg
                ? [Colors.White, Colors.White]
                : [Colors.White, Colors.White]
          }
          style={[
            styles.sendMyStyle,
            props.myStyle,
            { borderWidth: 0, borderColor: ThemeManager.colors.text_Color },
          ]}
        >
          <Image
            style={[styles.imgStyle, props.imgstyle]}
            source={props.img || Images.add}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.sendBtnTextStyle,
              props.restoreStyle,
              {
                color: props.img ? "white" : ThemeManager.colors.text_Color,
                textAlign: "center",
                marginLeft: 8,
              },
            ]}
          >
            {props.buttontext}
          </Text>
        </LinearGradient>
      ) : props.isManageNew ? (
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={[Colors.White, Colors.White]}
          style={[
            styles.sendMyStyle,
            props.myStyle,
            { borderWidth: 1, borderColor: ThemeManager.colors.text_Color },
          ]}
        >
          <Image
            style={[styles.imgStyle, props.imgstyle]}
            source={props.img || Images.add}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.sendBtnTextStyle,
              props.restoreStyle,
              {
                color: ThemeManager.colors.text_Color,
                textAlign: "center",
                marginLeft: 8,
              },
            ]}
          >
            {props.buttontext}
          </Text>
        </LinearGradient>
      ) : props.iscreateWallet ? (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={
            props.isDisabled ? ["#737373", "#737373", "#737373", "#737373"] :
              ["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"]
          }
          style={[styles.sendBtnStyle, props.myStyle]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.sendBtnTextStyle,
              props.restoreStyle,
              { color: ThemeManager.colors.headersTextColor },
            ]}
          >
            {props.buttontext}
          </Text>
        </LinearGradient>
      ) : (
        <Container
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={
            props.isDisabled ? ["#737373", "#737373", "#737373", "#737373"] :
              ["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"]
          }
          style={[styles.sendBtnStyle, props.myStyle]}
          onPress={props.onPress}
        >
          <View style={props.viewStyle}>
            <Text
              allowFontScaling={false}
              style={[
                styles.sendBtnTextStyle,
                { color: ThemeManager.colors.headersTextColor },
                props.restoreStyle,
              ]}
            >
              {props.buttontext}
            </Text>
          </View>
        </Container>
      )}

      {props.normalBtn && (
        <TouchableOpacity
          disabled={props.disabled}
          onPress={props.onPress}
          style={[styles.parentBtnStyle, props.btnstyle]}
          activeOpacity={props.activeOpacity}
        >
          <View
            style={[
              props.linearGradientColors,
              {
                ...styles.container,
              },
            ]}
          >
            <Text style={[styles.btnTextStyle, props.btnTextStyle]}>
              {props.buttontext}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </ButtonNew>
  );
};;

/******************************************************************************************/
const styles = StyleSheet.create({
  imgStyle: {
    alignSelf: 'center',
    height: 15,
    width: 15,
    tintColor: 'white',
  },
  sendMyStyle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    backgroundColor: 'black',
  },
  sendBtnStyle: {
    height: dimen(50),
    borderRadius: dimen(14),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: "100%",

    // marginBottom: 27,
  },
  sendBtnTextStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(16),
    lineHeight: dimen(24.19),
    color: ThemeManager.colors.buttonText,
    // fontFamily: fonts.dmSemiBold
  },
  btnTextStyle: {
    fontFamily: fonts.dmMedium,
    fontSize: 14,
  },
});

export { Button };
