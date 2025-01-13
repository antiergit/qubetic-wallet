/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  FlatList,
  StatusBar,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "./EnterPinSecurityStyle";
import { Header, AppAlert, Button, HeaderMain, OnboardingHeadings } from "../../common";
import { Images } from "../../../theme";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import ReactNativeBiometrics from "react-native-biometrics";
import { getData, getEncryptedData } from "../../../Utils/MethodsUtils";
import { EventRegister } from "react-native-event-listeners";
import { LanguageManager } from "../../../../LanguageManager";
import images from "../../../theme/Images";
import { getDimensionPercentage, widthDimen } from "../../../Utils";

import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
} from "../../../Utils";
import SecretCodeInput from "../../subcommon/molecules/secretCodeInput";
import Singleton from "../../../Singleton";

const DATA = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "Del"];

class EnterPinSecurity extends Component {
  state = {
    myPin: "",
    showAlertDialog: false,
    alertTxt: "",
    themeSelected: "",
    multiWallet: [],
    PIN: "",
    showButton: false,
    secretTxt: [false, false, false, false, false, false],
  };

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        myPin: "",
        showAlertDialog: false,
        alertTxt: "",
        showButton: false,
        secretTxt: [false, false, false, false, false, false],
      });
    });

    getData(Constants.BIOMETRIC_MODE).then(bio_mode => {
      if (bio_mode != 'false') this.checkBiometricAvailabilty();
    });
    this.props.navigation.addListener("didFocus", (event) => {
      getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
        this.setState({ themeSelected: theme });
      });
      getData(Constants.MULTI_WALLET_LIST).then((multiWalletArray) => {
        this.setState({ multiWallet: JSON.parse(multiWalletArray) });
      });
      this.setState({ showButton: false });
      this.backhandle = BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
      );
    });
    this.props.navigation.addListener("didBlur", (event) => {
      if (this.backhandle) this.backhandle.remove();
    });
    EventRegister.addEventListener("getThemeChanged", (data) => {
      this.setState({ themeSelected: data });
    });
  }

  /******************************************************************************************/
  componentWillUnmount() {
    // StatusBar.setBackgroundColor(ThemeManager.colors.statusBarColor1);
    BackHandler.removeEventListener();
    if (this.backhandle) this.backhandle.remove();
  }

  /******************************************************************************************/
  handleBackButtonClick() {
    // StatusBar.setBackgroundColor(ThemeManager.colors.statusBarColor1);
    EventRegister.emit("theme", ThemeManager.colors.statusBarColor1);
    Actions.pop();
    return true;
  }

  /******************************************************************************************/
  updatePin(text) {
    let pin = this.props.pin;
    pin = pin + text;
    this.props.loginPinFormUpdate({ prop: "pin", value: pin });
    if (pin.length == 6) {
      pin == this.pinCode ? this.goBack() : this.startShake();
      this.props.loginPinFormUpdate({ prop: "pin", value: "" });
    }
  }

  /******************************************************************************************/
  checkBiometricAvailabilty() {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log("TouchID is supported");
        this.bimetricPrompt();
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log("FaceID is supported");
        this.bimetricPrompt();
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        console.log("Biometrics is supported");
        this.bimetricPrompt();
      } else {
        console.log("Biometrics not supported");
      }
    });
  }

  /******************************************************************************************/
  bimetricPrompt() {
    try {
      Singleton.getInstance().getTouchIDItem().then((res) => {
        this.continuePressed(res)
      }).catch((err) => {
      })
      // continuePressed(enteredPin)
    } catch (e) {
      console.log("Device not Support Fingerprint");
    }
  }

  /******************************************************************************************/
  didSelect(item) {
    this.timeout && clearTimeout(this.timeout);
    this.setState({ itemPressed: item });
    this.timeout = setTimeout(() => {
      this.setState({ itemPressed: "" });
    }, 200);
    if (item == "d") {
    } else if (item == "Forgot?") {
    } else if (item == "Del") {
      let pin = this.state.myPin;
      const newPin = pin.slice(0, -1);
      const updatePin = pin;

      const updatedCircleStates = [...this.state.secretTxt];
      updatedCircleStates[updatePin.length - 1] = false;
      this.setState({
        myPin: newPin,
        itemPressed: newPin.length == 0 ? null : item,
        showButton: false,
        secretTxt: updatedCircleStates,
      });
    } else {
      let pin = this.state.myPin;
      pin = pin + item;
      if (pin.length <= 6) {
        const newCircleStates = [...this.state.secretTxt];
        newCircleStates[this.state.secretTxt.indexOf(false)] = true;
        pin.length == 6 ? this.continuePressed(pin) : null;
        this.setState({
          showButton: pin.length == 6 ? true : false,
          myPin: pin,
          secretTxt: newCircleStates,
        });
        this.setState({
          showButton: pin.length == 6 ? true : false,
          myPin: pin,
        });
      }
    }
  }

  /******************************************************************************************/
  backCallBack() {
    EventRegister.emit("theme", ThemeManager.colors.colorVariation);
    Actions.pop();
  }
  returnPinByProps(enteredPin) {
    this.props?.walletPin(enteredPin)
    Actions.pop()
  }

  /******************************************************************************************/
  continuePressed(enteredPin) {
    getEncryptedData(Constants.PIN_LOCK, enteredPin).then((value) => {
      if (enteredPin == value) {
        this.props?.fromScreen != undefined &&
          (this.props?.fromScreen == "Security") ? this.returnPinByProps(enteredPin) :
          this.props?.fromScreen == "WalletManage"
            ? this.props.selectionType == "mnemonics"
              ? Actions.replace("ShowRecoveryPhrase", {
                walletItem: this.props.walletItem,
                pin: enteredPin
              })
              : Actions.replace("ExportPrivateKeys", {
                walletItem: this.props.walletItem,
                pin: enteredPin
              })
            : Actions.replace("CreatePinSecurity", {
              themeSelected: this.state.themeSelected,
              fromScreen: 'enterPinSecurity',
              oldPin: enteredPin
            });
      } else {
        this.setState({
          myPin: "",
          secretTxt: [false, false, false, false, false, false],
        });
        this.setState({
          showAlertDialog: true,
          alertTxt: LanguageManager.alertMessages.wrongPIN,
          showButton: false,
          secretTxt: [false, false, false, false, false, false]
        });
      }
    })
      .catch(err => {
        console.log("getEncryptedData PIN_LOCK continuePressed EnterPinSecurity err -----", err)
        this.setState({
          myPin: "",
          secretTxt: [false, false, false, false, false, false],
        });
        this.setState({
          showAlertDialog: true,
          alertTxt: LanguageManager.alertMessages.wrongPIN,
          showButton: false,
          secretTxt: [false, false, false, false, false, false]
        });
      });;
  }

  /******************************************************************************************/
  render() {
    const { pins } = LanguageManager;
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >

        <HeaderMain />
        <View style={{
          flex: 1,
          paddingHorizontal: widthDimen(20),
          marginTop: heightDimen(30)
        }}>
          <OnboardingHeadings
            title={this.props?.fromScreen == "WalletManage" ? 'Confirm Code' : !!this.props?.walletPin ? 'Enter Secret Code' : this.props?.from == 'Security' ? LanguageManager.pins.confirmOldSecretCode : "Your Secret Code"} subTitle={pins.pleaseEnterYourDigitCode} />

          <View
            style={{
              flex: 0.4,
            }}
          >
            <SecretCodeInput secretTxt={this.state.secretTxt} />
          </View>
          <View style={[styles.pin_wrap]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={DATA}
              numColumns={3}
              bounces={false}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return index == 9 ? (
                  <View style={styles.listStyle}>
                    <Text style={{ ...styles.pinBlockTextStyle, color: ThemeManager.colors.blackWhiteText }}>.</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.pinBlockStyle}
                    onPress={this.didSelect.bind(this, item)}
                  >
                    {item === "Del" ? (
                      <Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: dimen(24), width: dimen(32) }} />
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.pinBlockTextStyle,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {item}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}
      </ImageBackground>
    );
  }
}

export default EnterPinSecurity;
