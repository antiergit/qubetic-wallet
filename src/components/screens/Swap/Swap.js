import React, { useState } from "react";
import { View, Text, BackHandler, TouchableOpacity, ImageBackground } from "react-native";
import styles from "./SwapStyle";
import { AppAlert, Header, HeaderMain } from "../../common";
import { Images } from "../../../theme";
import Singleton from "../../../Singleton";
import { TabIcon } from "../../../components/common";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import CrossChain from "./CrossChain";
import { getData } from "../../../Utils/MethodsUtils";
import OnChainSwapNew from "./OnChainSwapNew";
import { EventRegister } from "react-native-event-listeners";
import { LanguageManager } from "../../../../LanguageManager";
import { SwapHeader } from "../../common/SwapHeader";
import OneInchSwap from "./OneInchSwap";
import { getIsMakerFromStorage } from "../../../Utils/CheckerMarkerUtils";
import { heightDimen, widthDimen } from "../../../Utils";
import LinearGradient from "react-native-linear-gradient";

let ccCount = 0;
let ocCount = 1;
const Swap = (props) => {
  const { swapText, alertMessages } = LanguageManager;
  const [isLoading, setLoading] = useState(false);
  const [swapEnabled, setSwapEnabled] = useState("oc");
  const [themeSelected, SetThemeSelected] = useState("");
  const [walletName, setWalletName] = useState("");
  const [isset, setisset] = useState(false);
  const [isMakerWallet, setIsMakerWallet] = useState(false);
  const [isPrivateKey, setIsPrivateKey] = useState(false);
  const [alertData, setAlertData] = useState({
    isShow: false,
    msg: ""
  })


  /******************************************************************************************/
  React.useEffect(() => {

    checkPrivateKeyWallet()
    checkIsOnChain()

    EventRegister.addEventListener("getThemeChanged", (data) => {
      SetThemeSelected(data);
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    getData(Constants.WALLET_NAME).then(async (res) => {
      setWalletName(res)
    });
    props.navigation.addListener("didFocus", () => {
      checkPrivateKeyWallet()
      checkIsOnChain()
      setisset(!isset)
      getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
        SetThemeSelected(theme);
      });
      getData(Constants.WALLET_NAME).then(async (res) => {
        setWalletName(res)
      });
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

    });
    props.navigation.addListener("didBlur", () => {
      Singleton.getInstance().swapSelectedCoin = null;
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    });
    return () => { };
  }, [isset]);

  const checkPrivateKeyWallet = () => {
    getData(Constants.MULTI_WALLET_LIST)
      .then(list => {
        let currentWallet = JSON.parse(list)
        currentWallet = currentWallet.find(res => res?.defaultWallet)
        if (currentWallet?.isPrivateKey) {
          setIsPrivateKey(true)
          onPress("oc")
        } else {
          setIsPrivateKey(false)
        }
      })
  }

  const checkIsOnChain = () => {
    if (Singleton.getInstance().swapSelectedCoin != null) {
      setSwapEnabled(Singleton.getInstance().swapSelectedCoin?.isOnChain ? "oc" : "cc")
    }
  }

  /******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log("Backhandler Swap");
    Singleton.bottomBar?.navigateTab("WalletMain");
    // Actions.jump("WalletMain");
    Actions.pop()
    return true;
  };

  /******************************************************************************************/
  const onPress = (type) => {
    if (type == "cc") {
      ccCount = ccCount + 1;
      ocCount = 0;
    } else if (type == "oc") {
      ocCount = ocCount + 1;
      ccCount = 0;
    }
    setSwapEnabled(type);
    console.log("ccCount", ccCount, "ocCount:::", ocCount, type);
    (ccCount == 1 || ocCount == 1) &&
      EventRegister.emit(Constants.DOWN_MODAL, "yes");
  };


  /******************************************************************************************/
  return (
    <>
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >

        <HeaderMain
          showBackBtn={true}
          BackButtonText={swapText.swap}
          beforeImport={true}
          imgSecondStyle={{
            width: heightDimen(31),
            height: widthDimen(31),
          }}
          imgSecondViewStyle={{
            width: heightDimen(31),
            height: widthDimen(31),
          }}
          onPressIcon={() => {
            Singleton.isNotification = false
            Actions.currentScene != "NotificationsTab" &&
              Actions.NotificationsTab({ themeSelected: themeSelected });
          }}
          imgSecond={swapEnabled == "oc" ? Singleton.isNotification ? Images.notiDot : Images.noti : null}
        />

        <View style={[styles.tab_wrapstyle]}>
          <View
            style={[
              styles.tabsWrap,
              { backgroundColor: ThemeManager.colors.mnemonicsBg },
            ]}
          >

            <TouchableOpacity
              onPress={() => {
                onPress("oc");

              }}
              style={styles.tab_inActiveStyle}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={
                  swapEnabled == "oc" ? ["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"] : [ThemeManager.colors.mnemonicsBg, ThemeManager.colors.mnemonicsBg]
                }

                style={styles.tab_inActiveStyleLeft}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.tab_isActiveTextStyle,
                    {
                      color: ThemeManager.colors.blackWhiteText,
                    },
                  ]}
                >
                  {swapText.onChain}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // setAlertData({ isShow: true, msg: "In Progress" })
                isPrivateKey ? setAlertData({ isShow: true, msg: alertMessages.crossChainNotSupport }) : onPress("cc");

              }}
              style={styles.tab_inActiveStyle}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={
                  swapEnabled == "cc" ? ["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"] : [ThemeManager.colors.mnemonicsBg, ThemeManager.colors.mnemonicsBg]
                }
                style={styles.tab_inActiveStyleRight}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.tab_isActiveTextStyle,
                    {
                      color: ThemeManager.colors.blackWhiteText,
                    },
                  ]}
                >
                  {swapText.crossChain}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <CrossChain
          isVisible={swapEnabled == "cc" && !isLoading}
          themeSelected={themeSelected}
          navigation={props.navigation}

        />

        <OneInchSwap
          isVisible={swapEnabled == "oc" && !isLoading}
          themeSelected={themeSelected}
          navigation={props.navigation}
        />

        {alertData.isShow && (
          <AppAlert
            alertTxt={alertData.msg}
            hideAlertDialog={() => {
              setAlertData({ isShow: false, msg: "" })
            }}
          />
        )}
      </ImageBackground>
    </>
  );
};

Swap.navigationOptions = () => {
  return {
    header: null,
    tabBarLabel: " ",
    tabBarIcon: ({ focused }) => (
      <TabIcon
        focused={focused}
        title={"Swap"}
        ImgSize={{
          width: 23,
          height: 23,
          tintColor: focused
            ? ThemeManager.colors.whiteText
            : ThemeManager.colors.lightWhiteText,
        }}
        activeImg={Images.swap_active}
        defaultImg={Images.swap_inactive}
        titleColor={{
          color: focused
            ? ThemeManager.colors.whiteText
            : ThemeManager.colors.lightWhiteText,
        }}
      />
    ),
    tabBarOptions: {
      style: {
        borderTopColor: "transparent",
        borderColor: "black",
        backgroundColor: ThemeManager.colors.tabBottomColor,
      },
      keyboardHidesTabBar: true,
    },
  };
};

export default Swap;
