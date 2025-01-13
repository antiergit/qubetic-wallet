import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Text,
  Pressable,
  SafeAreaView,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { Colors, Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { LanguageManager } from "../../../LanguageManager";
import { getData } from "../../Utils/MethodsUtils";
import * as Constants from "../../Constants";
import { EventRegister } from "react-native-event-listeners";
import { HeaderMain } from "./HeaderMain";
import { Divider } from "./Divider";
import DeviceInfo from 'react-native-device-info';


let deviceName = '';
export const CustomTokenModal = (props) => {
  const { commonText } = LanguageManager;
  const [themeSelected, setThemeSelected] = useState();


  //******************************************************************************************/
  useEffect(() => {
    onFocus();
    EventRegister.addEventListener("getThemeChanged", (data) => {
      setThemeSelected(data);

    });
  }, []);

  const onFocus = async () => {
    deviceName = await DeviceInfo.getDeviceName();
  }

  //******************************************************************************************/
  const getBgColor = (index, selectedIndex) => {
    let color = "";
    if (themeSelected == 2) {
      color =
        index == selectedIndex
          ? ThemeManager.colors.colorVariation
          : ThemeManager.colors.Mainbg;
    } else {
      color =
        index == selectedIndex
          ? ThemeManager.colors.settingBg
          : ThemeManager.colors.searchBg;
    }
    return color;
  };

  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={props.openModel}
      onRequestClose={props.onPressIn}
    >
      {/* <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      /> */}
      {/* <SafeAreaView style={[styles.centeredView]}> */}
      <View
        style={[
          styles.modalView,
          {
            backgroundColor: ThemeManager.colors.mainBgNew,
            // paddingTop: Platform.OS == 'ios' ? (DeviceInfo.hasNotch() ? 50 : 0) : (deviceName == 'OPPO F19 Pro' || 'OnePlus NordCE 5G' ? 0 : 20)
          },
        ]}
      >
        <HeaderMain
          backCallBack={props.onPressIn}
          BackButtonText={"Network"}
        ></HeaderMain>
        <View style={{ marginHorizontal: 15 }}>
          {props.list?.map((item, index) => {
            return (
              <TouchableOpacity
                disabled={props.disabled}
                key={index + ""}
                onPress={() => props.onPress(item, index)}
                style={[
                  styles.touchableStyle,
                  {
                    borderBottomWidth: 1,
                    borderColor: ThemeManager.colors.dividerColor,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image style={styles.imgStyle} source={{ uri: item.image }} />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.textStyle1,
                      {
                        color:
                          index == props.selectedIndex
                            ? ThemeManager.colors.blackWhiteText
                            : ThemeManager.colors.blackWhiteText,
                        fontFamily: index == props.selectedIndex
                          ? Fonts.dmSemiBold
                          : Fonts.dmLight
                      },
                    ]}
                  >
                    {item.symbol}
                  </Text>
                </View>
                <Image source={ThemeManager.ImageIcons.forwardIcon} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* <TouchableOpacity onPress={props.onPressIn} style={[styles.centeredView1]} /> */}

      {/* </SafeAreaView> */}
      {/* <SafeAreaView style={{ backgroundColor: ThemeManager.colors.bottomSheetColor }} /> */}
    </Modal>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  textStyle1: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
  },
  textStyle2: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  modalView: {
    // backgroundColor: Colors.White,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    // width: '100%',
    // padding: 15,

    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.White,
  },
  centeredView1: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  touchableStyle: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    justifyContent: "space-between",
  },
  imgStyle: {
    height: 32,
    width: 32,
    borderRadius: 32,
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
});
