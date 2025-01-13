import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Clipboard,
  ScrollView,
  Linking,
  NativeModules,
  StatusBar,
  Platform,
  BackHandler,
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ThemeManager } from "../../../../ThemeManager";
import { Button, CardView, HeaderMain, LoaderView } from "../../common";
import { LanguageManager } from "../../../../LanguageManager";
import styles from "./SettingsStyle";
import { clearStorage, getData, saveData } from "../../../Utils/MethodsUtils";
import images from "../../../theme/Images";
import {
  getDimensionPercentage as dimen,
  hasNotchWithIOS,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import FastImage from "react-native-fast-image";
import Toast from "react-native-easy-toast";
import { ActionConst, Actions } from "react-native-router-flux";
import { EventRegister } from "react-native-event-listeners";
import Singleton from "../../../Singleton";
import * as Constants from "../../../Constants";
import { ConfirmAlert } from "../../common/ConfirmAlert";
import {
  logoutUser,
} from "../../../Redux/Actions";
import { connect, useDispatch } from "react-redux";
import { Colors } from "../../../theme";
import DeviceInfo from "react-native-device-info";
import CommonModal from "../../common/CommonModal";
import notifee, { AndroidImportance, TriggerType, AndroidVisibility } from '@notifee/react-native';
import { showNotification } from "../../../LocalNotification";

const { alertMessages, referral, pins } = LanguageManager;

const STATIC_LIST = [
  {
    id: 1,
    images: "manageAccountIcon",
    title: LanguageManager.manage.manageAccount,
    showView: false,
  },
  {
    id: 2,
    images: "securityIcon",
    title: LanguageManager.setting.security,
    showView: false,
  },
  {
    id: 3,
    images: "nativeCurrency",
    title: LanguageManager.setting.nativeCurrency,
    showView: true,
  },

  // {
  //   id: 4,
  //   images: "aboutUs",
  //   title: LanguageManager.setting.aboutUs,
  //   showView: true,
  // },
  {
    id: 4,
    images: "walletConnect",
    title: LanguageManager.setting.walletConnect,
    showView: true,
  },
  {
    id: 5,
    images: "privacyPolicy",
    title: LanguageManager.setting.privacyPolicy,
    showView: false,
  },
  {
    id: 7,
    images: "transactionHistory",
    title: LanguageManager.merchantCard.transactionHistory,
    showView: false,
  },
  {
    id: 8,
    images: "addressBookIcon",
    title: LanguageManager.setting.addressBook,
    showView: true,
  },
  // {
  //   id: 9,
  //   images: "prefrenceIcon",
  //   title: LanguageManager.setting.preferences,
  //   showView: false,
  // },
  {
    id: 10,
    images: "logOutIcon",
    title: LanguageManager.setting.logout,
    showView: false,
  },
];

const Settings = (props) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const { setting, referral } = LanguageManager;
  const [themeSelected, setThemeSelected] = useState("");
  const [showAlertDialogConfirm, setshowAlertDialogConfirm] = useState(false);
  const [alertTxt, setalertTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBioMatric, setIsBioMatric] = useState(false);
  const [allUserIds, setAllUserIds] = useState([]);
  const [allMakerIds, setAllMakerIds] = useState([]);
  const [logoutWarning, setLogoutWarning] = useState(false)
  const [checkedOne, setcheckedOne] = useState(false)
  const [checkedThree, setcheckedThree] = useState(false)

  useEffect(() => {
    EventRegister.addEventListener("getThemeChanged", (data) => {
      setThemeSelected({ themeSelected: data ? data : 2 });
    });
    console.log("useeefect---setting");
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

    // REQUIRED HERE AS WELL SINCE didFocus IS NOT CALLED THE FIRST TIME
    getLogoutRequiredIds();
    const focusListener = props.navigation.addListener("didFocus", () => {
      console.log("didFocus---setting");
      getLogoutRequiredIds();

      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
      getData(Constants.BIOMETRIC_MODE).then((bio_mode) => {
        console.log("bio_mode----", bio_mode);
        bio_mode == "true" ? setIsBioMatric(true) : setIsBioMatric(false);
      });
    });
    const blurListener = props.navigation.addListener("didBlur", () => {
      console.log("didBlur---setting");

      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    });

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      setLogoutWarning(false);
      setshowAlertDialogConfirm(false);
    });
    return () => {
      console.log("Removing event listeners");
      focusListener.remove();
      blurListener.remove();
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  const getLogoutRequiredIds = async () => {
    let multiWalletArray = await getData(Constants.MULTI_WALLET_LIST);
    multiWalletArray = multiWalletArray ? JSON.parse(multiWalletArray) : [];
    console.log("multiWalletArray -------", multiWalletArray);
    const tempMakerIds = [];
    const tempUserIds = multiWalletArray.map((val) => {
      const tempUserId = val.login_data.userId;
      if (val.login_data?.makerUserId) {
        tempMakerIds.push(val.login_data.makerUserId);
      }
      return tempUserId;
    });
    console.log("tempUserIds ------", tempUserIds);
    console.log("tempMakerIds ------", tempMakerIds);
    setAllUserIds(tempUserIds);
    setAllMakerIds(tempMakerIds);
  };

  const onPressCard = (item) => {
    if (item.title == LanguageManager.manage.manageAccount) {
      Actions.currentScene != "MyWalletList" && Actions.MyWalletList({ isFrom: "setting" });
    } else if (item.title == LanguageManager.setting.security) {
      Actions.currentScene != "Security" &&
        Actions.Security({ isBioMatricData: isBioMatric });
    } else if (item.title == LanguageManager.setting.preferences) {
      Actions.currentScene != "ThemeChange" && Actions.ThemeChange();
    } else if (item.title == LanguageManager.setting.referalAndRewards) {
      Actions.currentScene != "ReferralRewards" && Actions.ReferralRewards();
    } else if (item.title == LanguageManager.setting.nativeCurrency) {
      Actions.currentScene != "Currency" && Actions.Currency();
    } else if (item.title == LanguageManager.setting.addressBook) {
      Actions.currentScene != "AddressBook" &&
        Actions.AddressBook({ themeSelected: themeSelected, symbol: "all" });
    } else if (item.title == LanguageManager.setting.contactUS) {
      Actions.currentScene != "ContactUs" && Actions.ContactUs();
    } else if (item.title == LanguageManager.setting.walletConnect) {
      Actions.currentScene != "WalletConnection" && Actions.WalletConnection();
    }
    else if (item.title == LanguageManager.setting.aboutUs) {
      // Actions.AboutUs();
    } else if (item.title == LanguageManager.setting.privacyPolicy) {
      // Actions.PrivacyPolicy();
      // showMess()
    } else if (item.title == LanguageManager.walletMain.termsandConditions) {
      Actions.TermsandConditions();
    } else if (item.title == LanguageManager.merchantCard.transactionHistory) {
      Actions.currentScene != "DetailTransaction" &&
        Actions.DetailTransaction({
          themeSelected: themeSelected,
          symbol: "all",
        });
    } else if (item.title == LanguageManager.setting.prepaidCards) {
      Singleton.getInstance().virtualCardStatus = "inactive";
      Actions.currentScene != "PrepaidCard" && Actions.PrepaidCard();
    } else if (item.title == LanguageManager.setting.logout) {
      logoutPressed();
    }
  };
  /******************************************************************************************/
  const logoutPressed = () => {
    setLogoutWarning(true);
  };

  const showMess = async () => {
    try {
      showNotification(
        "remoteMessage.notification.title",
        "remoteMessage.notification.body",
        "12",
      )
    } catch (e) {
      console.log("error in notification", e)
    }
  }
  /******************************************************************************************/
  const logout = () => {
    setshowAlertDialogConfirm(false);
    setLoading(true);

    getData(Constants.DEVICE_TOKEN).then((device_token) => {
      let data = {
        deviceId: Singleton.getInstance().unique_id,
        userIds: allUserIds,
        type: "all"
      };
      dispatch(logoutUser({ data }))
        .then(async (res) => {
          resetAppData(data)
        })
        .catch((err) => {
          console.log("chk logotu err::::>>>>>>>>", err);
          resetAppData(data)
          setLoading(false);
        });
    });
  };

  const resetAppData = async (data) => {
    clearStorage();
    saveData(Constants.DEVICE_TOKEN, data.deviceToken);
    if (Platform.OS == "android") {
      var ClrStorageModule = NativeModules.EncryptionModule;
      ClrStorageModule.clearApplicationData();
    }
    await Singleton.getInstance().deleteKeyChainData();
    // reset values for following case
    // on fresh install maker makes an account and login, then logout
    // then it imports a wallet (any checker) then these values were not being reset and causing issue
    // for example - not showing checker key codes
    Singleton.getInstance().isMakerWallet = false;
    Singleton.getInstance().isOnlyBtcCoin = false;
    Singleton.getInstance().isOnlyTrxCoin = false;

    setTimeout(() => {
      setLoading(false);

      saveData(Constants.DARK_MODE_STATUS, 1);
      ThemeManager.setLanguage("darkMode");
      EventRegister.emit("getThemeChanged", 1);
      EventRegister.emit("theme", "#0C0C0D");
      LanguageManager.setLanguage("English");
      Singleton.getInstance().userRefCode = "";
      global.isDeepLink = false;
      Singleton.getInstance().SelectedLanguage = "en";
      saveData(Constants.SELECTED_LANGUAGE, "en");

      Actions.currentScene != "Onboarding" &&
        Actions.Onboarding({ type: ActionConst.RESET });
    }, 1200);
  };

  // const handleBackButtonClick = () => {
  //   console.log('Backhandler Buy-----');
  //   Actions.jump('WalletMain');
  //   return true;
  // };

  // const handleBackButtonClick = () => {
  //   console.log('Backhandler NotificationsTab');
  //  Singleton.bottomBar?.navigateTab('WalletMain');
  //   Actions.jump('WalletMain');
  //   return true;
  // };

  const handleBackButtonClick = () => {
    console.log("Backhandler setting----");
    Singleton.bottomBar?.navigateTab("WalletMain");
    // Actions.jump("WalletMain");
    // Actions.pop()
    Actions.Main({ type: ActionConst.RESET });

    return true;
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        disabled={
          item.title == LanguageManager.setting.addressBook &&
          Singleton.getInstance().isMakerWallet
        }
        style={[styles.cardStyle, {}]}
        onPress={() => onPressCard(item)}
      >
        <View style={{ flex: 1 }}>
          <CardView
            disabled={
              item.title == LanguageManager.setting.addressBook &&
              Singleton.getInstance().isMakerWallet
            }
            imgStyle={{}}
            viewStyle={{ justifyContent: "center" }}
            leftImg={true}
            leftIcon={ThemeManager.ImageIcons?.[item.images]}
            leftText={item.title}
            // bottomText={'dsdklsdkskdsks'}
            gradientStyle={{}}
            imgIcon={ThemeManager.ImageIcons.rightArrow}
            showIcon={true}
            // mainStyle={{ marginTop: dimen(12) }}
            hideBottom={true}
            onPress={() => onPressCard(item)}
            themeSelected={themeSelected}
          />

          {/* {!item.showView ? <FastImage source={item.images} style={styles.imageStyle2} resizeMode="contain" /> :
                        <View style={styles.imageContainer}>
                            <FastImage source={item.images} style={styles.imageStyle} resizeMode="contain" />
                        </View>
                    }
                    <Text style={styles.titleStyle}>{item.title}</Text> */}
        </View>
        {/* <FastImage source={images.rightArrow} style={styles.arrowIcon} resizeMode="contain" /> */}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <View style={[styles.mainView]}>
        <HeaderMain
          BackButtonText={setting.settings}
          customStyle={{ paddingHorizontal: widthDimen(24) }}
          showBackBtn={true}
        // mainStyle={{
        // height: Platform.OS == 'ios'
        //   ? DeviceInfo.hasNotch()||DeviceInfo.hasDynamicIsland()
        //     ? 110
        //     : 110
        //   : StatusBar.currentHeight
        //   ? StatusBar.currentHeight+70
        //   : 110,
        // }}
        />
        <View style={styles.mainViewStyle}>
          <FlatList
            data={STATIC_LIST}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              marginTop: dimen(24),
              paddingBottom: dimen(24),
            }}
            renderItem={renderItem}
          />
        </View>
        <Toast
          ref={toast}
          position="bottom"
          positionValue={230}
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />
        {showAlertDialogConfirm && (
          <ConfirmAlert
            text={LanguageManager.addressBook.yes}
            alertTxt={alertTxt}
            hideAlertDialog={() => {
              setshowAlertDialogConfirm(false);
            }}
            ConfirmAlertDialog={() => {
              logout();
            }}
          />
        )}

        <CommonModal
          isTopLine={false}
          visible={logoutWarning}
          mainContainerModal={{ backgroundColor: "transparent" }}
          onClose={() => {
            setLogoutWarning(false);
          }}
          button={true}
        >
          <View >
            <View style={styles.imagetextContainer}>
              <Text
                style={[
                  styles.txt2,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                Are you sure?
              </Text>
              {/* <Text
                style={[
                  styles.txt3,
                  { color: ThemeManager.colors.legalGreyColor },
                ]}
              >
                {LanguageManager.walletName.tapOnAll}
              </Text> */}
            </View>
            <TouchableOpacity
              onPress={() => setcheckedOne(!checkedOne)}
              style={styles.imagetextContainerOne}>
              <View>
                <Image
                  style={[
                    styles.dotStyle,
                    { tintColor: ThemeManager.colors.primaryColor },
                  ]}
                  source={
                    checkedOne
                      ? ThemeManager.ImageIcons.checkedIcon
                      : ThemeManager.ImageIcons.unCheckedIcon
                  }
                  resizeMode="contain"
                />
              </View>

              <Text
                style={[
                  styles.txt4,
                  { color: ThemeManager.colors.legalGreyColor },
                ]}
              >
                {LanguageManager.walletName.logoutWarning1}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setcheckedThree(!checkedThree)}
              style={styles.imagetextContainerThree}>
              <View >
                <Image
                  style={[
                    styles.dotStyle,
                    { tintColor: ThemeManager.colors.primaryColor },
                  ]}
                  source={
                    checkedThree
                      ? ThemeManager.ImageIcons.checkedIcon
                      : ThemeManager.ImageIcons.unCheckedIcon
                  }
                />
              </View>
              <Text
                style={[
                  styles.txt4,
                  { color: ThemeManager.colors.legalGreyColor },
                ]}
              >
                {LanguageManager.walletName.logoutWarning2}
              </Text>
            </TouchableOpacity>

            <View style={[styles.btnViewModal]}>
              <View style={{ marginRight: dimen(8) }}>
                <Button
                  buttontext={LanguageManager.sendTrx.Cancel}
                  onPress={() => {
                    setcheckedOne(false);
                    setcheckedThree(false);
                    setLogoutWarning(false);
                  }}
                  myStyle={{ width: widthDimen(182), alignItems: "center" }}
                  viewStyle={{
                    backgroundColor: ThemeManager.colors.mnemonicsBg,
                    ...styles.borderButtonStyle
                  }}
                />
              </View>
              <View style={{ marginLeft: dimen(8) }}>
                <Button
                  buttontext={LanguageManager.pins.Continue}
                  disabled={!(checkedOne && checkedThree)}
                  myStyle={{ width: widthDimen(182), alignItems: "center" }}
                  onPress={() => {
                    setcheckedOne(false);
                    setcheckedThree(false);
                    setLogoutWarning(false);
                    setTimeout(() => {
                      setshowAlertDialogConfirm(true);
                      setalertTxt(LanguageManager.alertMessages.willBeLoggedOutFromTheApp);
                    }, 1000);
                  }}
                />
              </View>
            </View>
          </View>
        </CommonModal>
        <LoaderView isLoading={loading} />
      </View>
    </ImageBackground>
  );
};

export default connect(undefined, {
})(Settings);
