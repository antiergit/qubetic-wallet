/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Keyboard,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  callWeb3Auth,
  clearStorage,
  getData,
  getEncryptedData,
  saveData,
} from '../../../Utils/MethodsUtils';
import styles from './EnterPinStyle';
import { AppAlert, Button, Header, InputCustom, LoaderView, OnboardingHeadings } from '../../common';
import { Colors, Fonts, Images } from '../../../theme/';
import { ActionConst, Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import { refreshToken, requestWalletLogin } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import ReactNativeBiometrics from 'react-native-biometrics';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { convertPrivateKeyToAddress } from '../../../Utils/EthUtils';
import { EventRegister } from 'react-native-event-listeners';
import { convertBtcPrivateKeyToAddress } from '../../../Utils/BtcUtils';
import { convertLtcPrivateKeyToAddress } from '../../../Utils/LtcUtils';
import { convertTrxPrivateKeyToAddress } from '../../../Utils/TronUtils';
import { LanguageManager } from '../../../../LanguageManager';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import SecretCodeInput from '../../subcommon/molecules/secretCodeInput';
import { checkAndShowStatusPopup, getWalletMakerStatus } from '../../../Utils/CheckerMarkerUtils';

const DATA = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];

class EnterPin extends Component {
  state = {
    myPin: '',
    showAlertDialog: false,
    alertTxt: '',
    themeSelected: '',
    showAlertDialogConfirm: false,
    alertTxtConfirm: '',
    isLoading: false,
    showModal: false,
    email: '',
    defaultEmail: '',
    secretTxt: [false, false, false, false, false, false]

  };

  /******************************************************************************************/
  async componentDidMount() {
    console.log("ENTER---PIN==MOUNT==", this.state.myPin)
    this.setState({ myPin: '' })

    EventRegister.addEventListener('getThemeChanged', data => {
      console.log('chk theme status enter pin:::::', data)
      this.setState({ themeSelected: data });
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showModal: false,
        showAlertDialogConfirm: false,
        alertTxtConfirm: '',
        showAlertDialog: false,
        alertTxt: '',
        secretTxt: [false, false, false, false, false, false],
        myPin: ''

      });
    });
    Keyboard.dismiss();
    const SELECTED_CURRENCY = await getData(Constants.SELECTED_CURRENCY);
    const SELECTED_SYMBOL = await getData(Constants.SELECTED_SYMBOL);
    const SELECTED_LANGUAGE = await getData(Constants.SELECTED_LANGUAGE);
    Singleton.getInstance().CurrencySymbol = SELECTED_SYMBOL;
    Singleton.getInstance().CurrencySelected = SELECTED_CURRENCY;
    Singleton.getInstance().SelectedLanguage = SELECTED_LANGUAGE;
    getData(Constants.BIOMETRIC_MODE).then(bio_mode => {
      if (bio_mode != 'false') this.checkBiometricAvailabilty();
    });

    this.props.navigation.addListener('didFocus', event => {
      console.log("ENTER---PIN==Focus==", this.state.myPin)
      this.setState({ myPin: '' })
      getData(Constants.DARK_MODE_STATUS).then(async theme => {
        console.log('chk theme status enter pin didFocus:::::', theme)
        this.setState({ themeSelected: theme });
      })
      EventRegister.emit('enableTouchable', true);
      // getData(Constants.BIOMETRIC_MODE).then(bio_mode => {
      //   if (bio_mode != 'false') this.checkBiometricAvailabilty();
      // });
      const color = ThemeManager.colors.Mainbg
      // StatusBar.setTranslucent(true);
      // StatusBar.setBackgroundColor(color);
      EventRegister.emit('theme', color);
      this.backhandle = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    });
    this.props.navigation.addListener('didBlur', event => {
      const color = ThemeManager.colors.Mainbg
      console.log('chk didBlur enter pin:::::');
      // StatusBar.setTranslucent(false);
      EventRegister.emit('theme', color);
      if (this.backhandle) this.backhandle.remove();
    });
  }

  componentWillMount() {
    console.log("ENTER---PIN==Focus==", this.state.myPin)
    this.setState({ myPin: '' })

  }
  /******************************************************************************************/
  componentWillUnmount() {
    console.log("ENTER---PIN==MOUNT==14234123", this.state.myPin)
    this.setState({ myPin: '' })
    if (this.backhandle) this.backhandle.remove();
  }

  /******************************************************************************************/
  handleBackButtonClick() {
    return true;
  }

  /* *********************************************checkBiometricAvailabilty***************************************** */
  checkBiometricAvailabilty() {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log('TouchID is supported');
        this.bimetricPrompt();
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
        this.bimetricPrompt();
      } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        console.log('Biometrics is supported');
        this.bimetricPrompt();
      } else {
        console.log('Biometrics not supported');
      }
    });
  }

  /* *********************************************bimetricPrompt***************************************** */
  bimetricPrompt() {
    try {
      ReactNativeBiometrics.simplePrompt({ promptMessage: LanguageManager.alertMessages.confirmFingerprint }).then(resultObject => {
        setTimeout(() => {
          Keyboard.dismiss();
        }, 500);
        const { success } = resultObject;
        Singleton.isCameraOpen = false;
        if (success) {
          console.log('successful biometrics provided');
          this.postRefreshToken();
        } else {
          console.log('user cancelled biometric prompt');
        }
      }).catch(() => {
        console.log('biometrics failed');
      });
    } catch (e) {
      Singleton.isCameraOpen = false;
      console.log('Device not Support Fingerprint');
    }
  }

  /* *********************************************didSelect***************************************** */
  didSelect(item) {
    this.timeout && clearTimeout(this.timeout);
    this.setState({ itemPressed: item });
    this.timeout = setTimeout(() => {
      this.setState({ itemPressed: '' });
    }, 200);

    if (item == 'd') {
    } else if (item == 'Forgot?') {
    } else if (item == 'Del') {
      let pin = this.state.myPin;
      let newPin = pin.slice(0, -1);
      const updatedCircleStates = [...this.state.secretTxt];
      updatedCircleStates[pin.length - 1] = false;


      this.setState({
        myPin: newPin,
        itemPressed: newPin.length == 0 ? null : item,
        secretTxt: updatedCircleStates

      });
    } else {
      let pin = this.state.myPin;
      pin = pin + item;
      const newCircleStates = [...this.state.secretTxt];
      newCircleStates[this.state.secretTxt.indexOf(false)] = true;
      this.setState({ showButton: pin.length == 6 ? true : false, myPin: pin, secretTxt: newCircleStates });
      console.log("ENTER---PIN==", pin)
      if (pin.length == 6) {
        console.log("ENTER---PIN==INSIDE", pin)

        getEncryptedData(Constants.PIN_LOCK, pin).then(value => {
          if (pin == value) {
            this.postRefreshToken();
          } else {
            this.setState({ myPin: '' });
            this.setState({
              showAlertDialog: true,
              alertTxt: LanguageManager.alertMessages.wrongPIN,
              secretTxt: newCircleStates,
              secretTxt: [false, false, false, false, false, false],
              myPin: ''
            });
          }
        })
          .catch(err => {
            console.log("getEncryptedData PIN_LOCK enter pin err -----", err);
            this.setState({ myPin: '' });
            this.setState({
              showAlertDialog: true,
              alertTxt: LanguageManager.alertMessages.wrongPIN,
              secretTxt: newCircleStates,
              secretTxt: [false, false, false, false, false, false],
              myPin: ''
            });
          });
      }
    }
  }


  /* *********************************************postRefreshToken***************************************** */
  async postRefreshToken() {
    let myReferralCode = ''
    await getData(Constants.LOGIN_DATA).then(async (res) => {
      console.log('postRefreshToken res ------', res, Singleton.getInstance().unique_id)
      let response;
      if (res) {
        response = JSON.parse(res);
      } else {
        console.error("postRefreshToken JSON parse err -----");
        this.setState({
          showAlertDialogConfirm: true,
          alertTxtConfirm: "Something went wrong, please try again later",
        });
        return;
      }
      console.log('chk pin content::::::', response);
      Singleton.getInstance().defaultEthAddress = response?.defaultEthAddress || response?.defaultBnbAddress;
      Singleton.getInstance().defaultMaticAddress = response.defaultMaticAddress;
      Singleton.getInstance().defaultSolAddress = response.defaultSolAddress;
      Singleton.getInstance().defaultBnbAddress = response.defaultBnbAddress;
      Singleton.getInstance().defaultBtcAddress = response.defaultBtcAddress;
      Singleton.getInstance().defaultTrxAddress = response.defaultTrxAddress;
      Singleton.getInstance().defaultTicsAddress = response?.defaultEthAddress || response?.defaultBnbAddress;
      Singleton.getInstance().walletName = response.walletName;
      Singleton.getInstance().defaultEmail = response.userEmail;
      Singleton.getInstance().refCode = response.refCode;
      myReferralCode = response.refCode
    });
    // StatusBar.setBackgroundColor(ThemeManager.colors.statusBarColor1);
    Singleton.isFirsLogin = false;
    if (global.isForgot) {
      global.isForgot = false
      console.log('Actions postRefreshToken  isForgot')
      Actions.Main({ type: ActionConst.RESET });

    } else {
      global.isForgot = false
      // EventRegister.addEventListener('NotificationPush', () => {
      //   console.log("chk NotificationPush scene:::::", Actions.currentScene);
      //   Actions.currentScene != "NotificationsTab" &&
      //   Actions.NotificationsTab({ themeSelected: this.state.themeSelected });
      //  });
      if (global.notify) {
        Actions.currentScene != "NotificationsTab" &&
          Actions.NotificationsTab({ themeSelected: this.state.themeSelected });
      } else {
        if (this.props?.from == "welcome") {
          Actions.Main({ type: 'reset' });
        } else {
          console.log('Actions postRefreshToken poping')
          Actions.pop();
        }
      }

    }
    const color = (this.state.themeSelected == 2) ? ThemeManager.colors.colorVariation : ThemeManager.colors.MainbgNew
    EventRegister.emit('theme', color);
    if (global.isRefLink == true && Singleton.getInstance().userRefCode != myReferralCode) {
      return Singleton.getInstance().updateRefModal.showRefModal();
    } else if (global.showErr == true) {
      Singleton.getInstance().updateRefModal?.hideRefModal();
      Singleton.getInstance().updateAlertModal?.showCustom_Alert();
      return
    }
  }


  /* *********************************************logout***************************************** */
  logout() {
    this.setState({ showAlertDialogConfirm: false, isLoading: true });
    setTimeout(() => {
      getData(Constants.DEVICE_TOKEN).then(device_token => {
        let data = {
          deviceToken: device_token,
        };
        clearStorage();
        saveData(Constants.DEVICE_TOKEN, data.deviceToken);
      });
    }, 150);
  }

  render() {
    const { merchantCard, alertMessages, placeholderAndLabels, pins } = LanguageManager;
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: ThemeManager.colors.mainBgNew }}>
        <ImageBackground
          source={ThemeManager.ImageIcons.mainBgImgNew}
          style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
        >

          <View style={[styles.wrap, { paddingHorizontal: widthDimen(20) }]}>
            <View style={[styles.subHeaderStyle,]}>
              <OnboardingHeadings
                title={(this.props?.title || "") + " " + pins.confirmSecretCode}
                subTitle={pins.pleaseEnterYourDigitCode} />
            </View>

            <View style={{
              flex: 0.4,

            }}>
              <SecretCodeInput secretTxt={this.state.secretTxt} />

            </View>

            <View style={[styles.pin_wrap]}>
              <FlatList
                data={DATA}
                numColumns={3}
                bounces={false}
                scrollEnabled={false}
                keyExtractor={(item, index) => index + ''}
                renderItem={({ item, index }) => {
                  return index == 9 ? (
                    <View style={styles.listStyle}>
                      <Text style={{ ...styles.pinBlockTextStyle, color: ThemeManager.colors.blackWhiteText }}></Text></View>) : (
                    <TouchableOpacity
                      style={styles.pinBlockStyle}
                      onPress={this.didSelect.bind(this, item)}>
                      {item === 'Del' ? (
                        <Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: getDimensionPercentage(24), width: getDimensionPercentage(32) }} />) :
                        (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>)}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </ImageBackground>

        {/* -------------------------------------------------------- */}
        {
          this.state.showAlertDialogConfirm && (
            <ConfirmAlert
              text={alertMessages.Ok}
              alertTxt={this.state.alertTxtConfirm}
              hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }) }}
              ConfirmAlertDialog={() => { this.logout() }}
            />
          )
        }

        {/* -------------------------------------------------------- */}
        {
          this.state.showAlertDialog && (
            <AppAlert
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
            />
          )
        }
        <LoaderView isLoading={this.state.isLoading} />

      </ScrollView >
    );
  }
}

export default connect(null, { refreshToken, requestWalletLogin })(EnterPin);