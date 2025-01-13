import React, { Component } from "react";
import Router from "./Router";
import {
  View,
  AppState,
  NativeEventEmitter,
  NativeModules,
  Image,
  Text,
  Platform,
  Keyboard,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { ThemeManager } from "../ThemeManager";
import { Provider } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import { store, persistor } from "./Redux/Reducers";
import { Colors, Images } from "./theme";
import { Actions } from "react-native-router-flux";
import messaging from "@react-native-firebase/messaging";
import { firebase } from "@react-native-firebase/messaging";
import { EventRegister } from "react-native-event-listeners";
import styles from "./components/screens/Welcome/WelcomeStyle";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { AppView, Button } from "./components/common";
import * as Constants from "./Constants";
import { getData, saveData } from "./Utils/MethodsUtils";
import Singleton from "./Singleton";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { request } from "react-native-permissions";
import DeviceInfo from "react-native-device-info";
import { LanguageManager } from "../LanguageManager";
import ReferralModal from "./components/common/ReferralModal";
import { getReferralStatus, updateRefCode } from "./Redux/Actions";
import { Modal } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { PersistGate } from "redux-persist/integration/react";
import CheckerReqModal from "./components/common/CheckerReqModal";
import ReqStatusModal from "./components/common/ReqStatusModal";
import WalletConnectInstance from "./Utils/WalletConnectInstance";
import Toast from "react-native-easy-toast";
import TransactionRequest from "./components/screens/WalletConnection/UiComponents/TransactionRequest";
import { createNotificationChannel, showNotification } from "./LocalNotification";

const { ScreenshotDelegate } = NativeModules;
const screenShotEmitter = new NativeEventEmitter(ScreenshotDelegate);

let isFirstLaunch = true;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: ThemeManager.colors.darkMode ? "black" : "white",
      WalletConnectReducer: store.getState().walletConnectReducer,
      routerShow: false,
      makerReqStatus: "",
    };
    this.appState = AppState.currentState;
    this.appState = null;
    this.screenShotRef = null;
  }

  /******************************************************************************************/
  async componentWillMount() {
    // console.log('chk uniqueId::::', response);
    const uniqueId = await DeviceInfo.getUniqueId();
    console.log("chk uniqueId::::", uniqueId);
    Singleton.getInstance().unique_id = uniqueId;
    WalletConnectInstance.getInstance();

    NetInfo.addEventListener(this.checkConnection);
    screenShotEmitter.addListener("screenshotEvent", this.screenShotEmitter);
    this.checkDefaultLanguage();
    this.checkTheme();
    this.requestUserPermission();
    this.notification();
  }



  /******************************************************************************************/
  checkTheme() {
    console.log("checkthem:: ");
    getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
      if (theme) {
        theme == 1
          ? ThemeManager.setLanguage("darkMode")
          : ThemeManager.setLanguage("lightMode");
        EventRegister.emit("getThemeChanged", theme);
        EventRegister.emit("theme", theme == 1 ? "#0C0C0D" : Colors.White);
        Singleton.getInstance().themeStatus = theme;
        saveData(Constants.DARK_MODE_STATUS, theme);
        this.setState({ routerShow: true });

        console.log("checkthem::11111 ", theme);
      } else {
        Singleton.getInstance().themeStatus = "1";
        ThemeManager.setLanguage("darkMode");
        EventRegister.emit("getThemeChanged", "1");
        EventRegister.emit("theme", "#0C0C0D");
        saveData(Constants.DARK_MODE_STATUS, 1);
        console.log("checkthem::default ");
        this.setState({ routerShow: true });
      }
    });
  }

  /******************************************************************************************/
  async checkDefaultLanguage() {
    const defaultLanguage = await getData(Constants.SELECTED_LANGUAGE);
    console.log("chk defaultLanguage::::", defaultLanguage);
    if (defaultLanguage) {
      LanguageManager.setLanguage(
        defaultLanguage == "en" ? "English" : "Spanish"
      );
      Singleton.getInstance().SelectedLanguage = defaultLanguage;
    } else {
      LanguageManager.setLanguage("English");
      Singleton.getInstance().SelectedLanguage = "en";
      saveData(Constants.SELECTED_LANGUAGE, "en");
    }
  }

  /******************************************************************************************/
  async componentDidMount() {
    // this.addDeepLinkListner();
    this.appStateListner = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        console.log("componentDidMount AppState App.js active");
        setTimeout(
          () => {
            console.log('isFirstLaunch -------', isFirstLaunch)
            isFirstLaunch = false;
          },
          isFirstLaunch ? 4000 : 0
        );
      }
      this.handleAppStateChange(nextState);
    });
  }

  /******************************************************************************************/
  componentWillUnmount() {
    this.appStateListner?.remove();
  }

  /******************************************************************************************/
  screenShotEmitter = (event) => {
    EventRegister.emit(Constants.DOWN_MODAL, "yes");
    Singleton.getInstance().updateAlert.showWarning();
  };

  /******************************************************************************************/
  async requestUserPermission() {
    createNotificationChannel()
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      firebase
        .messaging()
        .getToken()
        .then((fcmToken) => {
          console.log("fcm token:::::::", fcmToken);
          fcmToken && saveData(Constants.DEVICE_TOKEN, fcmToken);
          console.log("chk fcm token::::", fcmToken);
        })
        .catch(err => {
          console.log('getToken err ------', err)
        });
    }
  }

  /******************************************************************************************/
  checkConnection = (state) => {
    global.isConnected = state.isConnected;
    global.isInternetReachable =
      state.isInternetReachable == null ? true : state.isInternetReachable;
  };

  /******************************************************************************************/
  notification() {
    messaging()
      .getInitialNotification()
      .then((notificationOpen) => {
        console.log(
          "getInitialNotification:::::",
          "push notification",
          notificationOpen
        );
      });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // CHECK IF CHECKER HAS RECEIVED A REQUEST NOTIFICATION
      // THEN SHOW THE REQUEST BOUNCING VIEW
      // THEN SHOW THE REQUEST MODAL ON CLICK
      // this.checkerReqModal?.show();
      getData(Constants.ACCESS_TOKEN).then((token) => {
        if (token) {
          Actions.Main({ type: "reset" });
        } else {
          Actions.Walkthrough({ type: "reset" });
        }
      });
    });
    //work when app is in forground mode
    messaging().onMessage(async (remoteMessage) => {
      console.log("onMessage:::::", "push notification", remoteMessage);

      showNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        remoteMessage.messageId,
      )
      // showMessage({
      //     position: "top",
      //     message:
      //       remoteMessage.notification.body ||
      //       remoteMessage.notification.title,
      //     type: "success",
      //     duration: 4000,
      //     backgroundColor: ThemeManager.colors.primaryColor,
      //     titleStyle: {
      //       color: Colors.Black,
      //       height: Platform.OS == "android" ? 35 : 50,
      //       marginTop: Platform.OS == "android" ? 30 : 15,
      //     },
      //     onPress: () => {
      //       console.log("push notificaton onpress>>>>>>");
      //       getData(Constants.PIN_LOCK).then((pinLock) => {
      //         const isLoggedIn = pinLock && pinLock != "null";
      //         isLoggedIn && Actions.currentScene != "Welcome" &&
      //           Actions.currentScene != "EnterPin" &&
      //           Actions.currentScene != "NotificationsTab" &&
      //           Actions.NotificationsTab({ themeSelected: 2 });
      //       });
      //     },
      //   });
      getData(Constants.ACCESS_TOKEN).then((token) => {
        if (token) EventRegister.emit("hitWalletApi", "");
      });
    });
  }

  /******************************************************************************************/
  handleAppStateChange = (nextAppState) => {
    if (nextAppState == "background") {
      let time = new Date().getTime();
      saveData(Constants.LAST_TIME, time);
    }
    console.log(
      "Singleton.isPermission=true:::::111111:",
      Singleton.isPermission
    );
    if (
      (this.appState == "active" || this.appState == "inactive") &&
      nextAppState == "background"
    ) {
      Keyboard.dismiss();
      EventRegister.emit(Constants.DOWN_MODAL, "yes");
      Singleton.getInstance().updateRefModal?.hideRefModal();
      console.log("Singleton.isPermission=true::::::", Singleton.isPermission);
      Singleton.isPermission ? null : (Singleton.isCameraOpen = false);
    }
    if (this.appState == "background" && nextAppState == "active") {
      console.log(
        "Singleton.isPermission=true:::333:::",
        Singleton.isPermission
      );

      Singleton.getInstance().updateRefModal?.hideRefModal();
      Singleton.getInstance().updateAlertModal?.hideCustomAlert();
      getData(Constants.ACCESS_TOKEN).then((access_token) => {
        getData(Constants.PIN_LOCK).then((pin) => {
          console.log("chk pin:::::", pin);
          if (!pin || pin?.length < 6) {
            return;
          }
          if (access_token != null) {
            EventRegister.emit("enableTouchable", true);
            console.log("Singleton.isCameraOpen::::", Singleton.isCameraOpen);
            if (Singleton.isCameraOpen) {
              Singleton.isCameraOpen = false;
              return;
            }
            getData(Constants.PIN_TIMEOUT).then((timeOut) => {
              getData(Constants.LAST_TIME).then((res) => {
                console.log(res, "timeOut:::::::::", timeOut);
                if (res) {
                  let pin_timeout = timeOut || 0;
                  let newTime = new Date().getTime();
                  let diff = newTime - res;
                  if (diff > pin_timeout) {
                    setTimeout(() => {
                      Actions.currentScene != "EnterPin" && Actions.EnterPin();
                    }, 20);
                  }
                } else {
                  setTimeout(() => {
                    Actions.currentScene != "EnterPin" && Actions.EnterPin();
                  }, 20);
                }
              });
            });
          }
        });
      });
    }
    console.log(nextAppState, "this.appState", this.appState);
    this.appState = nextAppState;
  };

  /******************************************************************************************/
  render() {
    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              {this.state.routerShow && (
                <AppView>
                  <AvoidScreenshot
                    ref={(refs) => {
                      Singleton.getInstance().updateAlert = refs;
                    }}
                  />
                  <RefModal
                    ref={(refs) => {
                      Singleton.getInstance().updateRefModal = refs;
                    }}
                  />
                  <AlertCustom
                    ref={(refs) => {
                      Singleton.getInstance().updateAlertModal = refs;
                    }}
                  />
                  <TransactionRequest
                    ref={(refs) => {
                      Singleton.getInstance().walletConnectRef = refs
                    }}
                  />

                  <Toast
                    position="bottom"
                    positionValue={250}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    ref={(refs) => { Singleton.getInstance().showToast = refs }}
                  />

                  <Router
                    onRouteChanged={() => {
                      EventRegister.emit("screenChanged", Actions.currentScene);
                    }}
                  />
                </AppView>
              )}
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
        <FlashMessage position="top" />
      </>
    );
  }
}

/******************************************************************************************/
class AvoidScreenshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
  }

  /******************************************************************************************/
  showWarning() {
    this.setState({ showAlert: true });
  }

  /******************************************************************************************/
  render() {
    if (!this.state.showAlert) return null;
    return (
      <View style={styles.safeAreaView}>
        <View
          style={[
            styles.screenmain,
            { backgroundColor: ThemeManager.colors.mainBgNew },
          ]}
        >
          <Image
            style={{
              marginBottom: 40,
              tintColor: ThemeManager.colors.sheetTopLine,
            }}
            source={Images.modal_top_line}
          />
          <Image
            style={{ width: 100, height: 100 }}
            source={Images.logo}
            resizeMode={"contain"}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.secreenshotText,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {LanguageManager.walletMain.screenshot}
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.secreenshotsubText,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {LanguageManager.walletMain.screenShotMsg}
          </Text>
          <View style={styles.line} />
          <Button
            myStyle={{ paddingHorizontal: 100, marginBottom: 10 }}
            buttontext={LanguageManager.walletMain.iUnder}
            onPress={() => {
              this.setState({ showAlert: false });
            }}
          />
        </View>
        {/* // this.setState({showAlert: false }) */}
      </View>
    );
  }
}

/******************************************************************************************/
class AlertCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustomAlert: false,
    };
  }

  /******************************************************************************************/
  showCustom_Alert() {
    this.setState({ showCustomAlert: true });
  }

  /******************************************************************************************/
  hideCustomAlert() {
    this.setState({ showCustomAlert: false });
  }

  /******************************************************************************************/
  render() {
    if (!this.state.showCustomAlert) return null;
    return (
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => { }}
      >
        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={3}
          reducedTransparencyFallbackColor="white"
        />
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: ThemeManager.colors.Mainbg,
                borderColor: ThemeManager.colors.Mainbg,
              },
            ]}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                style={{ height: 22, width: 22 }}
                source={Images.tryAgain}
              />
              <Text
                allowFontScaling={false}
                style={[
                  styles.modalTitle,
                  { color: ThemeManager.colors.alertText },
                ]}
              >
                {LanguageManager.referral.alreadyAvailed}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.hideCustomAlert();
              }}
              style={[
                styles.sendBtnStyle,
                { backgroundColor: ThemeManager.colors.colorVariation },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[styles.sendBtnTextStyle, { color: "white" }]}
              >
                {"Ok"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

/******************************************************************************************/
class RefModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRef: false,
      refCode: Singleton.getInstance().userRefCode,
      showAlertDialog: false,
      alertTxt: "",
      isLoading: false,
    };
  }

  /******************************************************************************************/
  showRefModal() {
    this.setState({
      showRef: true,
      refCode: Singleton.getInstance().userRefCode,
    });
  }

  /******************************************************************************************/
  hideRefModal() {
    getData(Constants.ACCESS_TOKEN).then((access_token) => {
      access_token ? (Singleton.getInstance().userRefCode = "") : null;
    });
    this.setState({ showRef: false, refCode: "" });
    global.isRefLink = false;
    global.showErr = false;
  }

  /******************************************************************************************/
  confirmRef() {
    const { refCode } = this.state;
    if (refCode.trim().length == 0) {
      return this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.pleaseEnterReferralCode,
      });
    } else if (refCode.trim().length < 8) {
      return this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.enterValidRefCode,
      });
    } else {
      this.setState({ isLoading: true });
      setTimeout(async () => {
        const data = {
          device_id: Singleton.getInstance().unique_id,
          user_id: await getData(Constants.USER_ID),
          referral_code: refCode,
        };
        store
          .dispatch(updateRefCode({ data }))
          .then((res) => {
            this.setState({
              isLoading: false,
              showAlertDialog: true,
              alertTxt: LanguageManager.referral.addSuccess,
            });
            global.isRefLink = false;
            console.log("chk updateRefCode:::::", res);
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              showAlertDialog: true,
              alertTxt: err,
            });
            console.log("chk err updateRefCode:::::", err);
          });
      }, 200);
    }
  }

  /******************************************************************************************/
  render() {
    console.log(
      "this.state.showRef:::::",
      this.state.showRef,
      Singleton.getInstance().userRefCode,
      "chk userRefCode:::::",
      this.state.refCode
    );
    if (!this.state.showRef) return null;
    return (
      <ReferralModal
        editable={false}
        showReferralModal={this.state.showRef}
        handleBack={() => {
          this.setState({ showRef: false, refCode: "" });
          global.isRefLink = false;
        }}
        onChangeText={(text) =>
          this.setState({ refCode: text.replace(/\s/g, "") })
        }
        onPress={() => this.confirmRef()}
        value={Singleton.getInstance().userRefCode}
        Txt={this.state.alertTxt}
        showAlert={this.state.showAlertDialog}
        hideAlertDialog={() => {
          if (this.state.alertTxt == LanguageManager.referral.addSuccess) {
            this.setState({ showRef: false });
          }
          this.setState({ showAlertDialog: false, alertTxt: "" });
        }}
        isLoading={this.state.isLoading}
      />
    );
  }
}
