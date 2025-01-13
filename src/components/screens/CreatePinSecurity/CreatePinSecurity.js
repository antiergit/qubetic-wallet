/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import styles from './CreatePinSecurityStyle';
import { Header, AppAlert, Button, HeaderMain, OnboardingHeadings } from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import Toast from 'react-native-easy-toast';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import { LanguageManager } from '../../../../LanguageManager';
import images from '../../../theme/Images';
import { moderateScale, verticalScale } from '../../../layouts/responsive';
import SecretCodeInput from '../../subcommon/molecules/secretCodeInput';
import KeyPad from '../../subcommon/molecules/keyPad';
import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
const DATA = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];




class CreatePinSecurity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlertDialog: false,
      alertTxt: '',
      myPin: '',
      isWeak: false,
      showView: false,
      showButton: false,
      secretTxt: [false, false, false, false, false, false]

    };
  }
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({ showAlertDialog: false, alertTxt: '', showButton: false });
    });
    this.props.navigation.addListener('didBlur', event => {
      this.setState({
        myPin: '',
        showView: false,
        isWeak: false,
        showButton: false,
        secretTxt: [false, false, false, false, false, false]

      });
    });
  }

  /******************************************************************************************/
  updatePin(text) {
    let pin = this.props.pin;
    pin = pin + text;
    this.props.loginPinFormUpdate({ prop: 'pin', value: pin });
    if (pin.length == 6) {
      pin == this.pinCode ? this.goBack() : this.startShake();
      this.props.loginPinFormUpdate({ prop: 'pin', value: '' });
    }
  }

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
        showView: false,
        secretTxt: updatedCircleStates

      });
    } else {
      let pin = this.state.myPin;
      pin = pin + item;
      if (pin.length <= 6) {
        const newCircleStates = [...this.state.secretTxt];
        newCircleStates[this.state.secretTxt.indexOf(false)] = true;

        this.setState({ showButton: pin.length == 6 ? true : false, myPin: pin, secretTxt: newCircleStates });
        pin.length == 6 ? this.continuePressed(pin) : null;
        // this.checkPin(pin);
      }
    }
  }

  /******************************************************************************************/
  checkPin(pin) {
    const pinArr = pin.split('');
    console.log(pin, 'chk pin arrr:::::', pinArr);
    const is_AscendodDescend = pinArr.every((num, i) => i === pinArr.length - 1 || num < pinArr[i + 1]);
    const allSame = pinArr.every(v => v === pinArr[0]);
    console.log("allSame>>>>", allSame);
    console.log("is_AscendodDescend>>>>", is_AscendodDescend);

    if (allSame || is_AscendodDescend) {
      pin.length == 6 ? this.continuePressed(pin) : null;
      this.setState({ isWeak: true, showView: true });
    } else {
      this.setState({ isWeak: false, showView: true });
    }
  }

  /******************************************************************************************/
  continuePressed(pin) {
    Actions.currentScene != 'ConfirmPinSecurity' && Actions.ConfirmPinSecurity({ pin: pin, themeSelected: this.props.themeSelected, from: "NewSecretCode", oldPin: this.props.oldPin });
    this.setState({ myPin: '' });
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
          <OnboardingHeadings title={this.props?.fromScreen == "enterPinSecurity" ? 'New Secret code' : LanguageManager.pins.secretCodeNew} subTitle={pins.pleaseEnterYourDigitCode} />

          {/* -------------------------------------------------------- */}
          <View style={{
            flex: 0.4,

          }}>
            <SecretCodeInput secretTxt={this.state.secretTxt} />

          </View>
          {/* -------------------------------------------------------- */}
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
                  <View style={styles.listStyle}><Text style={{ ...styles.pinBlockTextStyle, color: ThemeManager.colors.blackWhiteText }}></Text></View>) : (
                  <TouchableOpacity
                    style={styles.pinBlockStyle}
                    onPress={this.didSelect.bind(this, item)}>
                    {/* {item === 'Del' ? (<Image source={images.delete} resizeMode={'contain'} style={{tintColor: ThemeManager.colors.blackWhiteText}}/>) : (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>)} */}
                    {item === 'Del' ? (<Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: dimen(24), width: dimen(32) }} />) : (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>)}


                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* -------------------------------------------------------- */}
          {/* {this.state.showView == true && (
              <View style={styles.ViewStyle}>
                <View style={{ alignItems: 'center' }}>
                  <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText }]}>{pins.Weak}</Text>
                  <View style={[styles.ViewStyle2, { backgroundColor: this.state.isWeak ? Colors.lossColor : ThemeManager.colors.underLineColor }]} />
                </View>
                <View style={{ alignItems: 'center', marginLeft: 10 }}>
                  <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText }]}>{pins.strong}</Text>
                  <View style={[styles.ViewStyle2, { backgroundColor: !this.state.isWeak ? Colors.successColor : ThemeManager.colors.underLineColor }]} />
                </View>
              </View>
            )} */}

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
        <Toast
          ref={toast => (this.toast = toast)}
          position="bottom"
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />

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

export default CreatePinSecurity;
