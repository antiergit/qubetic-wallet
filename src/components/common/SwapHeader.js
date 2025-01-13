import React, { useEffect, useState } from "react";
import { Colors, Fonts, Images } from "../../theme/";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../ThemeManager";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";


import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Dimensions,
  StatusBar
} from "react-native";
import { getData } from "../../Utils/MethodsUtils";
import { EventRegister } from "react-native-event-listeners";
import { getDimensionPercentage, heightDimen, widthDimen } from "../../Utils";
import { horizontalScale, moderateScale } from "../../layouts/responsive";
import images from "../../theme/Images";
import { LanguageManager } from "../../../LanguageManager";
import Singleton from "../../Singleton";
import * as Constants from "../../Constants";
const { width } = Dimensions.get('window')

let deviceName = "";

const SwapHeader = (props) => {
  const [themeSelected, setThemeSelected] = useState(0);
  const [walletName, setWalletName] = useState("");

  //******************************************************************************************/
  useEffect(() => {

    EventRegister.addEventListener("getThemeChanged", (data) => {
      setThemeSelected(data);
    });
  }, [props]);


  //******************************************************************************************/
  return (
    <>
      {console.log("Singleton.isNotification ", Singleton.isNotification)}
      <ImageBackground
        source={ThemeManager.ImageIcons.headerBackground}
        style={{ ...styles.main }}
        resizeMode={"cover"}
      >
        {/* <LinearGradient colors={["#69DADB00", "#69DADB33"]} style={styles.main}> */}
        <View style={[styles.HeaderStyle, , props.bgColor, props.customStyle]}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              // marginTop: heightDimen(Platform.OS == 'ios' ? 0 : 20),
              // marginTop:    Platform.OS == 'ios'
              // ? DeviceInfo.hasNotch()||DeviceInfo.hasDynamicIsland()
              //   ? 48
              //   : 48
              // : StatusBar.currentHeight
              // ? StatusBar.currentHeight
              // : 28,
              flexDirection: "row",
            }}
          >
            {/* <ImageBackground
            source={ThemeManager.ImageIcons.walletNameBg}
            style={{
              // flex: 1,

              height: getDimensionPercentage(40),
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
              // justifyContent: "center",
              borderRadius: getDimensionPercentage(14),
              paddingHorizontal: widthDimen(10),
              paddingVertical: heightDimen(6),
              marginEnd: getDimensionPercentage(50),
              maxWidth: getDimensionPercentage(135),
              overflow: "hidden",
              // width: getDimensionPercentage(135),
              // height: getDimensionPercentage(40),
              // flexDirection: "row",
              // alignItems: "center",
              // // justifyContent: "center",
              // borderRadius: getDimensionPercentage(14),
              // paddingHorizontal: widthDimen(8),
              // paddingVertical: heightDimen(6),
              // overflow:'hidden'
            }}
          > */}
            <TouchableOpacity
              onPress={() => {
                // const showBal=this.showBal()
                // const arr = showBal.split('.');
                if (Actions.currentScene !== "MyWalletList") {
                  Actions.MyWalletList()
                }
              }}

            >
              <LinearGradient
                colors={ThemeManager.colors.addressBgGradient}
                style={styles.nameView}
                start={{ x: 0.28, y: -0.09 }}
                end={{ x: 0.15, y: 0.99 }}
              >
                <View style={{ flexDirection: "row", }}>
                  <Image source={ThemeManager.ImageIcons.portfolio_active} style={{ height: heightDimen(28), width: widthDimen(28), resizeMode: "contain" }} />
                  <Text
                    // numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      marginLeft: widthDimen(6),
                      fontSize: getDimensionPercentage(14),
                      color: Colors.primaryColor,
                      fontFamily: Fonts.dmMedium,
                      lineHeight: getDimensionPercentage(14),
                      // marginEnd: props.name?.length > 10 ? 20 : 0,
                      alignSelf: "center",

                      maxWidth: width / 1.9



                      // paddingHorizontal:10
                    }}
                  >
                    {props.name}
                  </Text>
                  <Image source={ThemeManager.ImageIcons.newDropDown} style={{ resizeMode: "contain", alignSelf: "center", marginLeft: widthDimen(13) }} />

                </View>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              {props?.onChain && <TouchableOpacity
                onPress={() => {
                  EventRegister.emit("showSlippage", "yes");
                }}
                style={[styles.touchableStyle, { marginLeft: 7, }]}
              >
                {/* {this.state.is_notification && 
             <Image
                      source={Images.Notification_Point}
                      resizeMode={"contain"}
                      style={{ position: 'absolute', zIndex: 1, left: getDimensionPercentage(5), bottom: getDimensionPercentage(7) }}
                    />
                   } */}
                <Image source={Images.slipSettings} />
              </TouchableOpacity>}
              <TouchableOpacity
                onPress={() => {
                  // this.setState({ is_notification: false });
                  if (props.fromDapp) {
                    props.onPress()
                  }
                  else {
                    Singleton.isNotification = false
                    Actions.currentScene != "NotificationsTab" &&
                      Actions.NotificationsTab({ themeSelected: themeSelected });
                  }

                }}
                style={[styles.touchableStyle, { marginLeft: 7, }]}
              >
                {/* {this.state.is_notification && 
             <Image
                      source={Images.Notification_Point}
                      resizeMode={"contain"}
                      style={{ position: 'absolute', zIndex: 1, left: getDimensionPercentage(5), bottom: getDimensionPercentage(7) }}
                    />
                   } */}
                <Image style={[styles.imgNoti, {
                  // tintColor: props.fromDapp ? ThemeManager.colors.DarkRed : ThemeManager.colors.primaryColor
                }]} source={props.fromDapp ? Images.deleteIcon : Singleton.isNotification ? Images.notiDot : Images.noti} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* </LinearGradient> */}
      </ImageBackground>
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  main: {
    // width: "95%",
    // height: getDimensionPercentage(Platform.OS == 'ios' ? 70 : 110),

    height:
      Platform.OS == 'ios'
        ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
          ? getDimensionPercentage(130)
          : getDimensionPercentage(110)
        : StatusBar.currentHeight
          ? StatusBar.currentHeight + getDimensionPercentage(90)
          : getDimensionPercentage(110),
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomEndRadius: getDimensionPercentage(20),
    overflow: "hidden",
    borderBottomStartRadius: getDimensionPercentage(20),
    paddingBottom: getDimensionPercentage(20)
    // paddingTop:50,


    // height:   Platform.OS == 'ios'
    //         ? DeviceInfo.hasNotch()||DeviceInfo.hasDynamicIsland()
    //           ? 120
    //           : 120
    //         : StatusBar.currentHeight
    //         ? StatusBar.currentHeight+80
    //         : 28,

    // paddingTop: Platform.OS == 'ios'
    //   ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
    //     ? 0
    //     : 0
    //   : StatusBar.currentHeight
    //     ? StatusBar.currentHeight
    //     : 28,
  },

  nameView: {
    paddingLeft: widthDimen(10),
    paddingRight: widthDimen(10),

    //  paddingRight: widthDimen(9),


    borderRadius: 14,
    paddingVertical: 6
  },
  imgStyle1: {
    resizeMode: "contain",
    width: 19,
    height: 19,
    // tintColor: 'white',
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
    fontFamily: Fonts.dmSemiBold,
    fontSize: getDimensionPercentage(20),
    lineHeight: heightDimen(25),
    letterSpacing: getDimensionPercentage(0.27),
  },
  // touchableStyle: {
  //   // width: 28,
  //   // paddingVertical: 10,
  // },

  touchableStyle: {
    borderRadius: 5,
    width: 33,
    height: 33,
    marginLeft: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderStyle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: getDimensionPercentage(25),
    // marginTop: 10
  },
  backButtonTextStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 20,
  },
  slippageIcon: {
    width: 20,
    height: 20,
  },
});

export { SwapHeader };


