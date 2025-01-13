import React, { useEffect, useState } from "react";
import { Fonts, Images } from "../../theme/";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../ThemeManager";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  widthDimen,
} from "../../Utils";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { getDimensionPercentage, heightDimen } from "../../Utils";
import { LanguageManager } from "../../../LanguageManager";
import Singleton from "../../Singleton";

const HeaderMain = (props) => {
  const [istouchdis, setistouchdis] = useState(false);

  //******************************************************************************************/
  useEffect(() => {
    // EventRegister.addEventListener("getThemeChanged", (data) => {
    //   setThemeSelected(data);
    // });
  }, []);


  //******************************************************************************************/



  return (
    <View
      style={[
        styles.main,
        {
          height:
            Platform.OS == "ios"
              ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
                ? props.showFullImage
                  ? getDimensionPercentage(210)
                  : getDimensionPercentage(120)
                : props.showFullImage
                  ? getDimensionPercentage(190)
                  : getDimensionPercentage(110)
              : StatusBar.currentHeight
                ? props.showFullImage
                  ? StatusBar.currentHeight + getDimensionPercentage(160)
                  : StatusBar.currentHeight + getDimensionPercentage(80)
                : props.showFullImage
                  ? getDimensionPercentage(180)
                  : getDimensionPercentage(110),
        },
        props?.customMainStyle,
      ]}
    >
      <View style={[styles.HeaderStyle, props.bgColor, props.customStyle]}>
        <View style={{ flex: 0.3, justifyContent: "flex-start" }}>
          {props.backCallBack ? (
            <TouchableOpacity
              style={{ width: 25 }}
              disabled={istouchdis}
              onPress={() => {
                setistouchdis(true);
                // if (__DEV__) {
                //   props.backCallBack()
                // } else {
                //   setTimeout(() => {
                //     props.backCallBack()
                //   }, 1500);
                // }
                props.backCallBack();
              }}
            >
              {!props?.showBackBtn && (
                <Image
                  source={Images.arrowLeft}
                  style={[
                    props.imgStyle,
                    { tintColor: ThemeManager.colors.blackWhiteText },
                  ]}
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.touchableStyle}
              disabled={istouchdis}
              onPress={() => {
                setistouchdis(true);
                Actions.pop();
                setTimeout(() => {
                  setistouchdis(false);
                }, 1500);
              }}
            >
              {!props?.showBackBtn && (
                <Image
                  source={Images.arrowLeft}
                  style={{ tintColor: ThemeManager.colors.blackWhiteText }}
                />
              )}
            </TouchableOpacity>
          )}
        </View>


        {props.beforeImport ? (
          <Text
            allowFontScaling={false}
            style={[
              styles.textStyle,
              { color: ThemeManager.colors.headersTextColor },
              props.TextcustomStyle,
            ]}
            numberOfLines={1}
          >
            {props.BackButtonText}
          </Text>
        ) : (
          <Text
            allowFontScaling={false}
            style={[
              styles.textStyleNew,
              { color: ThemeManager.colors.blackWhiteText },
              props.TextcustomStyle,
            ]}
            numberOfLines={props.expandHeader ? 2 : 1}
          >
            {props.BackButtonText}
          </Text>
        )}
        <View style={{ flexDirection: "row", flex: 0.3, justifyContent: "flex-end" }}>
          {props.imgThird && (
            <TouchableOpacity
              onPress={props.onPressCsv}
              style={{ width: 25, height: 22, marginRight: 5 }}
            >
              <Image
                source={Images.csv}
                style={[styles.imgStyle1, props.imgStyle1]}
              />
            </TouchableOpacity>
          )}

          {props.imgNew && (
            <TouchableOpacity
              onPress={props.onPressImgNew}
              style={[{ width: 25, height: 22, marginRight: 5 }, props?.imgNewView]}
            >
              <Image
                source={props.imgNew}
                style={[styles.imgStyle1, props.imgStyle1]}
              />
            </TouchableOpacity>
          )}

          {props.imgSecond ? (
            <TouchableOpacity
              onPress={props.onPressIcon}
              style={[{ width: 25, height: 22 }, props.imgSecondViewStyle]}
              {...props?.imgSecondTouchableProps}
            >
              <Image
                source={props.imgSecond}
                style={[styles.imgStyle1, props.imgSecondStyle]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ width: 25, height: 25 }}
            ></TouchableOpacity>
          )}
          {props.showFullImage ? (
            <View style={{ height: getDimensionPercentage(80) }}></View>
          ) : (
            <View></View>
          )}
        </View>

      </View>
      <View>
        {props.showtext && (
          <Text style={{ color: ThemeManager.colors.lightBorderColor }}>
            {LanguageManager.walletMain.totalBal}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: "row" }}>

      </View>
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  main: {
    height:
      Platform.OS == "ios"
        ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
          ? getDimensionPercentage(120)
          : getDimensionPercentage(110)
        : StatusBar.currentHeight
          ? StatusBar.currentHeight + getDimensionPercentage(80)
          : getDimensionPercentage(110),
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomEndRadius: getDimensionPercentage(20),
    overflow: "hidden",
    borderBottomStartRadius: getDimensionPercentage(20),
    paddingBottom: getDimensionPercentage(20),
  },
  imgStyle1: {
    resizeMode: "contain",
    width: heightDimen(24),
    height: widthDimen(23),
    // tintColor: 'red',
  },
  textStyle: {
    textAlign: "center",
    flex: 2,
    fontFamily: Fonts.dmBold,
    fontSize: 18,
  },
  textStyleNew: {
    textAlign: "center",
    flex: 1,
    fontFamily: Fonts.dmMedium,
    fontSize: getDimensionPercentage(18),
    lineHeight: getDimensionPercentage(20),
    marginTop: 2
    // letterSpacing: getDimensionPercentage(0.27),
  },
  touchableStyle: {
    // width: 28,
    // paddingVertical: 10,
  },
  HeaderStyle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: getDimensionPercentage(25),
    // marginTop: getDimensionPercentage(Platform.OS == 'ios'? 0 : 0),
    // marginTop: 10
  },
  backButtonTextStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 20,
    lineHeight: 20,
  },
  bal: {
    textAlign: "center",
    fontSize: getDimensionPercentage(20),

    fontFamily: Fonts.dmRegular,

    // marginBottom: 20
  },
  balAmount: {
    textAlign: "center",
    fontSize: getDimensionPercentage(40),
    fontFamily: Fonts.dmExtraLight,
    lineHeight: 43,
    marginTop: getDimensionPercentage(5),

    // marginBottom: 20
  },
});


export { HeaderMain };
