/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Clipboard,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import styles from './ConfirmPinSecurityStyle';
import { Header, AppAlert, Button, HeaderMain, OnboardingHeadings } from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';

import * as Constants from '../../../Constants';
import { getData, getEncryptedData, saveData, saveEncryptedData } from '../../../Utils/MethodsUtils';
import { Actions } from 'react-native-router-flux';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import SecretCodeInput from '../../subcommon/molecules/secretCodeInput';
import { horizontalScale, verticalScale } from '../../../layouts/responsive';
import images from '../../../theme/Images';
import { dimen, getDimensionPercentage, heightDimen } from '../../../Utils';
import Singleton from '../../../Singleton';

const DATA = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];

class ConfirmPinSecurity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlertDialog: false,
      alertTxt: '',
      myPin: '',
      showCongrats: false,
      showButton: false,
      showSuccess: false,
      secretTxt: [false, false, false, false, false, false]

    };
  }
  componentDidMount() {
    console.log('-----this.props.pin', this.props.pin);
    this.props.navigation.addListener('didFocus', event => {
      this.setState({ myPin: '', showButton: false });
      const color = this.props.themeSelected == 2 ? Colors.White : Colors.newSafe
      EventRegister.emit('theme', color);
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: '',
        myPin: '',
        showButton: false,
        showSuccess: false,
        secretTxt: [false, false, false, false, false, false]

      });
    });
  }

  /******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(this.state.myPin);
    this.setState({
      showAlertDialog: true,
      alertTxt: LanguageManager.alertMessages.enteredPINDoesNotMatch,
      showButton: false,
      showSuccess: false,
    });
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
      const updatedCircleStates = [...this.state.secretTxt];
      updatedCircleStates[pin.length - 1] = false;

      this.setState({
        myPin: newPin,

        itemPressed: newPin.length == 0 ? null : item,
        showButton: false,
        secretTxt: updatedCircleStates

      });
    } else {
      let pin = this.state.myPin;
      pin = pin + item;
      if (pin.length <= 6) {
        const newCircleStates = [...this.state.secretTxt];
        newCircleStates[this.state.secretTxt.indexOf(false)] = true;
        pin.length == 6 ? this.continuePressed(pin) : null;
        this.setState({ showButton: pin.length == 6 ? true : false, myPin: pin, secretTxt: newCircleStates });
      }
    }
  }

  /******************************************************************************************/
  hideAlert() {
    this.setState({ showAlertDialog: false });
    if (this.state.showButton == true) {
      // StatusBar.setBackgroundColor(ThemeManager.colors.statusBarColor);
      const theme = this.props.themeSelected == 1 ? ThemeManager.colors.MainbgNew : Colors.newHeader
      EventRegister.emit('theme', theme);
      this.setState({ myPin: '', secretTxt: [false, false, false, false, false, false] });
      if (this.state.alertTxt != LanguageManager.alertMessages.enteredPINDoesNotMatch) {
        Actions.pop();
        Actions.pop();
      }

    }
  }

  /******************************************************************************************/
  continuePressed(pin) {

    // return
    if (pin == this.props.pin) {
      this.updateSensitiveInfo(this.props?.oldPin, pin)
      saveEncryptedData(Constants.PIN_LOCK, pin, pin);
      getData(Constants.BIOMETRIC_MODE).then(async bio_mode => {
        if (bio_mode == 'true') {
          await Singleton.getInstance().deleteKeyChainData()
          await Singleton.getInstance().handleSetItemUsingTouchIDOnPress(pin)
        }
      })




      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.PINChangedSuccessfully,
        showSuccess: true,
      });
    } else if (pin != this.props.pin) {
      this.setState({ myPin: '', secretTxt: [false, false, false, false, false, false] });
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.enteredPINDoesNotMatch,
        showButton: false,
        showSuccess: false,
      });
      // this.set_Text_Into_Clipboard();
    }
  }

  updateSensitiveInfo = async (oldPin, newPin) => {
    let multiWallet = await getData(Constants.MULTI_WALLET_LIST)
    let multiWalletData = JSON.parse(multiWallet)
    multiWalletData.map(async walletObj => {
      if (!walletObj?.login_data?.isTangem) {
        const ethPvtKey = await getEncryptedData(`${walletObj?.login_data?.defaultEthAddress}_pk`, oldPin);
        await saveEncryptedData(`${walletObj?.login_data?.defaultEthAddress}_pk`, ethPvtKey, newPin);
        const btcPvtKey = await getEncryptedData(`${walletObj?.login_data?.defaultBtcAddress}_pk`, oldPin);
        await saveEncryptedData(`${walletObj?.login_data?.defaultBtcAddress}_pk`, btcPvtKey, newPin);
        const tronPvtKey = await getEncryptedData(`${walletObj?.login_data?.defaultTrxAddress}_pk`, oldPin);
        await saveEncryptedData(`${walletObj?.login_data?.defaultTrxAddress}_pk`, tronPvtKey, newPin);
        console.log("ethPvtKey>>", ethPvtKey);
        console.log("btcPvtKey>>", btcPvtKey);
        console.log("tronPvtKey>>", tronPvtKey);

      }
    })
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
          paddingHorizontal: dimen(20),
          marginTop: heightDimen(30)
        }}>

          <OnboardingHeadings title={this.props?.from == "NewSecretCode" ? 'Confirm code' : LanguageManager.pins.secretCodeNew} subTitle={pins.pleaseEnterYourDigitCode} />

          {/* -------------------------------------------------------- */}
          <View style={{
            flex: 0.4,
          }}>
            <SecretCodeInput secretTxt={this.state.secretTxt} />

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
                return index == 9 ? (<View style={styles.listStyle}><Text style={{ ...styles.pinBlockTextStyle, color: ThemeManager.colors.blackWhiteText }}></Text></View>) : (
                  <TouchableOpacity
                    style={styles.pinBlockStyle}
                    onPress={this.didSelect.bind(this, item)}>
                    {item === 'Del' ? (<Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: getDimensionPercentage(24), width: getDimensionPercentage(32) }} />) : (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>)}
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* -------------------------------------------------------- */}
          {/* {this.state.showButton && (
              <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
                <Button
                  buttontext={pins.Continue}
                  onPress={() => this.continuePressed()}
                />
              </View>
            )} */}
        </View>

        {/* -------------------------------------------------------- */}
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.hideAlert() }}
          />
        )}
      </ImageBackground>
    );
  }
}

export default ConfirmPinSecurity;
