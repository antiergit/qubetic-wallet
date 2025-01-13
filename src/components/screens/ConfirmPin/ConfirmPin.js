/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  Modal,
  ImageBackground,
} from 'react-native';
import styles from './ConfirmPinStyle';
import { Header, AppAlert, Button, HeaderMain, OnboardingHeadings } from '../../common';
import { Colors, Fonts, Images } from '../../../theme/';
import { ActionConst, Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { CongratsModel } from '../../common/CongratsModel';
import { createPrivateKeyWalletLocal, createUserWalletLocal, getData, saveData, saveEncryptedData } from '../../../Utils/MethodsUtils';
import Singleton from '../../../Singleton';
import ReactNativeBiometrics from 'react-native-biometrics';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import { BlurView } from '@react-native-community/blur';
import { getLanguageList, getReferralStatus, updateLanguage } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { store } from '../../../Redux/Reducers';
import { verticalScale } from '../../../layouts/responsive';
import SecretCodeInput from '../../subcommon/molecules/secretCodeInput';
import images from '../../../theme/Images';
import { getDimensionPercentage, widthDimen } from '../../../Utils';
import { checkAndShowStatusPopup } from '../../../Utils/CheckerMarkerUtils';

const DATA = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];

class ConfirmPin extends Component {
  state = {
    showAlertDialog: false,
    alertTxt: '',
    myPin: '',
    showCongrats: false,
    themeSelected: '',
    itemPressed: '',
    resetDuration: 1,
    toggleStatus: false,
    showView: false,
    text: '',
    showButton: false,
    showLangModal: false,
    languageList: [],
    defaultCurrency: 'en',
    showREfModal: false,
    alreadyUsed: false,
    secretTxt: [false, false, false, false, false, false]
  };

  /******************************************************************************************/
  async componentDidMount() {
    this.setState({
      secretTxt: [false, false, false, false, false, false],
      showCongrats: false
    });
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      if (access_token) this.getRefStatus(access_token);
    });
    this.checkBiometricAvailabilty();

    const SELECTED_CURRENCY = await getData(Constants.SELECTED_CURRENCY);
    const SELECTED_SYMBOL = await getData(Constants.SELECTED_SYMBOL);
    const SELECTED_LANGUAGE = await getData(Constants.SELECTED_LANGUAGE);
    Singleton.getInstance().CurrencySymbol = SELECTED_SYMBOL;
    Singleton.getInstance().CurrencySelected = SELECTED_CURRENCY;
    Singleton.getInstance().SelectedLanguage = SELECTED_LANGUAGE;
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data });
    })
  }

  /******************************************************************************************/
  getRefStatus(access_token) {
    getData(Constants.LOGIN_DATA).then(res => {
      let response = JSON.parse(res);
      const data = {
        device_id: Singleton.getInstance().unique_id,
        wallet_address: response.defaultEthAddress,
      };
      store.dispatch(getReferralStatus({ data })).then(res => {
        console.log('chk getrefstatus:::::', res);
        if (res.message == 1) {
          this.setState({ showREfModal: true, alreadyUsed: false })
        } else {
          this.setState({ showREfModal: false, alreadyUsed: true })
        }
      }).catch(err => {
        global.isRefLink = false
        console.log('chk err refstatus:::::App.js', err);
        global.showErr = true;
      });
    });
  }

  /******************************************************************************************/
  checkBiometricAvailabilty() {
    const { pins } = LanguageManager;
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log('TouchID is supported');
        this.setState({ text: pins.enableBiometrics });
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
        this.setState({ text: pins.enableFaceId });
      } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        console.log('Biometrics is supported');
        this.setState({ text: pins.enableBiometrics });
      } else {
        console.log('Biometrics not supported');
      }
      console.log('chk available:::::', available);
      this.setState({ showView: available ? true : false });
      saveData(Constants.BIOMETRIC_SUPPORTED, available ? 'true' : false);
      getData(Constants.BIOMETRIC_MODE).then(res => {
        console.log('chk biometric mode:::::', res);
        this.setState({ toggleStatus: res == 'true' ? true : false });
      })
    });
  }

  /******************************************************************************************/
  async fetchLanguageList() {
    this.props.getLanguageList({}).then(res => {
      this.setState({ languageList: res })
      console.log('chk language res:::::', res)
    }).catch(err => {
      console.log('chk language err:::::', err)

    })
  }
  /******************************************************************************************/
  pinMismatch = async () => {
    this.setState({
      secretTxt: [false, false, false, false, false, false]
    });
    this.showError(LanguageManager.alertMessages.enteredPINDoesNotMatch);
  };

  /******************************************************************************************/
  didSelect(item) {
    this.timeout && clearTimeout(this.timeout);
    this.setState({ itemPressed: item });
    this.timeout = setTimeout(() => {
      this.setState({ itemPressed: '' });
    }, 200);
    if (item == 'd') {
    } else if (item == 'Forgot?') {
      this.forgotPassword();
    } else if (item == 'Del') {
      let pin = this.state.myPin;
      let newPin = pin.slice(0, -1);
      const updatePin = pin;
      const updatedCircleStates = [...this.state.secretTxt];
      updatedCircleStates[updatePin.length - 1] = false; // Mark the last circle as false
      this.setState({
        myPin: newPin,
        // itemPressed: newPin.length == 0 ? null : item,
        showButton: false,
        secretTxt: updatedCircleStates
      });
    } else {
      let pin = this.state.myPin;
      if (pin.length < 6) {
        pin = pin + item;
        const newCircleStates = [...this.state.secretTxt];
        newCircleStates[this.state.secretTxt.indexOf(false)] = true;
        this.setState({ myPin: pin, showButton: pin.length == 6 ? true : false, secretTxt: newCircleStates });
        pin.length == 6 && this.continuePressed()
      }
    }
  }

  /******************************************************************************************/
  showError(msg) {
    this.setState({ showAlertDialog: true, alertTxt: msg, resetDuration: 1 });
  }

  /******************************************************************************************/
  async onSwipeSuccess() {
    // create user local wallet here
    const createWalletData = {
      resp: this.props?.walletApiRes,
      walletData: this.props?.walletData,
      walletName: this.props?.walletName,
      pin: this.state.myPin,
      isTangem: this.props?.isTangem,
    };

    console.log("isMakerWallet =======", Singleton.getInstance().isMakerWallet)
    if (this.props?.isPrivateKey) {
      await createPrivateKeyWalletLocal(createWalletData);
    } else {
      await createUserWalletLocal(createWalletData);
    }

    // saving this as it is being used to check if user is logged in
    // here value is such that the length checks are also passed - pinSet
    saveData(Constants.PIN_LOCK, 'pinSet');
    getData(Constants.BIOMETRIC_MODE).then(async bio_mode => {
      if (bio_mode == 'true') {
        await Singleton.getInstance().handleSetItemUsingTouchIDOnPress(this.state.myPin)
      }
    })

    saveEncryptedData(Constants.PIN_LOCK, this.state.myPin, this.state.myPin);
    // saveData(Constants.BIOMETRIC_MODE, this.state.toggleStatus.toString());
    EventRegister.emit('theme', ThemeManager.colors.colorVariation);
    console.log('Singleton.getInstance().userRefCode::::::::', Singleton.getInstance().userRefCode);
    if (global.isDeepLink == true) {
      if (Singleton.getInstance().refCode != Singleton.getInstance().userRefCode) {
        (Singleton.getInstance().userRefCode && this.state.showREfModal) ? Singleton.getInstance().updateRefModal?.showRefModal() : null
      }
    }
    Actions.Main({ type: ActionConst.RESET });

    checkAndShowStatusPopup(true);

    this.setState({ showCongrats: false }, () => {
      if (global.isDeepLink == true) {
        if (this.state.alreadyUsed) {
          Singleton.getInstance().updateRefModal?.hideRefModal();
          Singleton.getInstance().updateAlertModal?.showCustom_Alert();
        }
      }
    });

  }

  /******************************************************************************************/
  togglePress() {
    this.setState({ toggleStatus: !this.state.toggleStatus }, () => {
      // console.log('chk toggle statte:::::', this.state.toggleStatus);
      saveData(Constants.BIOMETRIC_MODE, this.state.toggleStatus.toString());
    });
  }

  /******************************************************************************************/
  continuePressed() {
    setTimeout(() => {
      if (this.state.myPin == this.props.pin) {

        setTimeout(() => {
          // this.props.title == 'new' ? this.setState({ showCongrats: true }) : this.setState({ showLangModal: true });
          this.setState({ showCongrats: true })
        }, 500);
      } else if (this.state.myPin != this.props.pin) {
        this.setState({ myPin: '', showButton: false });
        this.pinMismatch();
      }
    }, 50);
  }

  /******************************************************************************************/
  getTitle() {
    const { pins } = LanguageManager;
    const { text, toggleStatus } = this.state;
    if (text == pins.enableBiometrics && toggleStatus == true) {
      return pins.biometricsEnabled;
    } else if (text == pins.enableFaceId && toggleStatus == true) {
      return pins.faceIdEnabled;
    } else {
      return text;
    }
  }

  /******************************************************************************************/
  async itemPressed(item) {
    if (!global.isConnected) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.pleaseCheckYourNetworkConnection });
    }
    // console.log('chk item::::', item);
    LanguageManager.setLanguage(item.name);
    const data = {
      fiat_currency: await getData(Constants.SELECTED_CURRENCY)
    }
    this.props.updateLanguage({ data }).then(res => {
      this.setState({ defaultCurrency: item.code, showLangModal: false, showCongrats: true })
      // console.log('chk updateLanguage res:::::', res);
      Singleton.getInstance().SelectedLanguage = item.code;
      saveData(Constants.SELECTED_LANGUAGE, item.code);
    }).catch(err => {
      console.log('chk updateLanguage err:::::', err)

    })
  }

  /******************************************************************************************/
  render() {
    const { pins, commonText } = LanguageManager;
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <HeaderMain />

        <View style={[styles.wrap]}>
          <OnboardingHeadings title={pins.confirmSecretCode1} subTitle={pins.pleaseEnterYourDigitCode} />

          <View style={{
            flex: 0.4,
          }}>
            <SecretCodeInput secretTxt={this.state.secretTxt}
              biometric={this.state.showView} togglePress={() => { this.togglePress() }} toggleStatus={this.state.toggleStatus}
            />

          </View>

          {/* -------------------------------------------------------- */}
          <View style={[styles.pin_wrap]}>
            <FlatList
              data={DATA}
              numColumns={3}
              bounces={false}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return index == 9 ? (<View style={styles.listStyle}>
                  <Text style={{ ...styles.pinBlockTextStyle, color: ThemeManager.colors.blackWhiteText }}></Text></View>) : (
                  <TouchableOpacity
                    style={styles.pinBlockStyle}
                    onPress={this.didSelect.bind(this, item)}>
                    {item === 'Del' ? (<Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: getDimensionPercentage(24), width: getDimensionPercentage(32) }} />) : (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>)}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        {/* -------------------------------------------------------- */}


        {/* -------------------------------------------------------- */}
        {/* {this.state.showButton && (
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <Button buttontext={pins.Continue} onPress={() => this.continuePressed()} />
            </View>
          )} */}

        {/* -------------------------------------------------------- */}
        {this.state.showCongrats && <CongratsModel
          // text={this.props.title == 'new' ? pins.yourWalletAccessIsRestored : pins.yourWalletisCreated}
          openModel={this.state.showCongrats}
          title={this.props?.fromForgot != undefined ? 'Pin Changed\nSuccessfully.' : commonText.walletCreatedSuccessfully}
          onPress={() => { this.onSwipeSuccess() }}
        />}

        {/* -------------------------------------------------------- */}
        <Modal
          visible={this.state.showLangModal}
          onRequestClose={() => this.setState({ showLangModal: false })}
          transparent>
          <BlurView
            style={styles.blurView}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View
            style={[styles.centeredView]}>
            <View style={styles.modalView}>
              <View style={styles.ViewStyle1}>
                <TouchableOpacity style={styles.touchableStyle1} onPress={() => this.setState({ showLangModal: false, showCongrats: true })}>
                  <Image resizeMode="contain" source={Images.CancelIcon} />
                </TouchableOpacity>
                <Text allowFontScaling={false} style={[styles.modalTitle, { fontFamily: Fonts.dmBold, color: ThemeManager.colors.settingsText }]}>{'Select Language'}</Text>
                {this.state.languageList?.map((item, index) => {
                  return (
                    <View key={index + ''} style={[styles.wallet_item, { borderColor: ThemeManager.colors.underLineColor }]}>
                      <TouchableOpacity onPress={() => { item.code?.toLowerCase() == this.state.defaultCurrency?.toLowerCase() ? '' : this.itemPressed(item, index) }} style={styles.touchableStyle2}>
                        <View style={[styles.ViewStyle]}>
                          <View style={{ flexDirection: 'row' }}>
                            <FastImage style={styles.imgStyle} source={{ uri: item.image }} />
                            <Text allowFontScaling={false} style={[styles.wallet_itemText, { color: ThemeManager.colors.whiteText }]}>{item.name}</Text>
                          </View>
                          {item.code?.toLowerCase() == this.state.defaultCurrency?.toLowerCase() && (<Image source={Images.done} style={{ tintColor: Colors.successColor }} />)}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}

                <TouchableOpacity style={[styles.touchableStyle]} onPress={() => this.setState({ showLangModal: false, showCongrats: true })}>
                  <Text allowFontScaling={false} style={[styles.wallet_itemText, { color: ThemeManager.colors.whiteText, textDecorationLine: 'underline' }]}>{'Continue'}</Text>
                </TouchableOpacity>
                {/* <Button
                  myStyle={{ marginTop: 10 }}
                  onPress={() => this.setState({ showLangModal: false, showCongrats: true })}
                  isLogout={true}
                  buttontext={commonText.SKIP}
                  restoreStyle={styles.restoreStyle}
                /> */}
              </View>
            </View>
          </View>
        </Modal>

        {/* -------------------------------------------------------- */}
        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
          />
        )}
      </ImageBackground>
    );
  }
}

export default connect(null, { getLanguageList, updateLanguage })(ConfirmPin);
