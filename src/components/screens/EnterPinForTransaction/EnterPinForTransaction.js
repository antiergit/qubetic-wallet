import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
  FlatList,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native';
import styles from './EnterPinForTransactionStyle';
import { AppAlert, Button, OnboardingHeadings } from '../../common';
import { Images } from '../../../theme/';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import ReactNativeBiometrics from 'react-native-biometrics';
import { getData, getEncryptedData } from '../../../Utils/MethodsUtils';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import SecretCodeInput from '../../subcommon/molecules/secretCodeInput';
import Singleton from '../../../Singleton';

const DATA = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];

class EnterPinForTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      password: '',
      showAlertDialog: false,
      alertTxt: '',
      showButton: false,
      secretTxt: [false, false, false, false, false, false]

    };
  }

  //******************************************************************************************/
  componentDidMount() {
    this.setState({ code: '', password: '', showButton: false });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: '',
        showButton: false,
        secretTxt: [false, false, false, false, false, false]
      });
    });
    if (this.props.checkBiometric) {
      getData(Constants.BIOMETRIC_MODE).then((bio_mode) => {
        console.log("bio_mode>>>", bio_mode);

        if (bio_mode == "true") {
          this.checkBiometricAvailabilty()
        }
      });

    }
  }

  //******************************************************************************************/
  componentWillUnmount() {
    BackHandler.removeEventListener();
    if (this.backhandle) this.backhandle.remove();
  }

  //******************************************************************************************/
  handleBackButtonClick() {
    return true;
  }

  //******************************************************************************************/
  checkBiometricAvailabilty() {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log('TouchID is supported');
        this.bimetricPrompt();
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
        this.bimetricPrompt();
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        console.log('Biometrics is supported');
        this.bimetricPrompt();
      } else {
        console.log('Biometrics not supported');
      }
    });
  }

  //******************************************************************************************/
  bimetricPrompt() {
    try {
      Singleton.getInstance().getTouchIDItem().then((res) => {
        this.props.closeEnterPin(res);
      }).catch((err) => {
      })
    } catch (e) {
      console.log('Device not Support Fingerprint');
    }
  }

  //******************************************************************************************/
  didSelect(item) {
    // console.log('-=-=-q-=-=-=-', item);
    this.timeout && clearTimeout(this.timeout);
    this.setState({ itemPressed: item });
    this.timeout = setTimeout(() => {
      this.setState({ itemPressed: '' });
    }, 200);

    if (item == 'd') {
    } else if (item == 'Forgot?') {
      // this.forgotPassword();
    } else if (item == 'Del') {
      let pin = this.state.code;
      let newPin = pin.slice(0, -1);

      const updatedCircleStates = [...this.state.secretTxt];
      updatedCircleStates[pin.length - 1] = false;
      this.setState({
        code: newPin,
        itemPressed: newPin.length == 0 ? null : item,
        showButton: false,
        secretTxt: updatedCircleStates
      });
      // console.log('chk neew pin:::::', newPin.length, '::::::', pin.length);
    } else {
      let pin = this.state.code;
      pin = pin + item;
      const newCircleStates = [...this.state.secretTxt];
      newCircleStates[this.state.secretTxt.indexOf(false)] = true;
      if (pin.length <= 6) {
        this.setState({ showButton: pin.length == 6 ? true : false, code: pin, secretTxt: newCircleStates });
      }
      if (pin.length >= 6) {
        this.continuePressed(pin)
      }

    }
  }

  //******************************************************************************************/
  continuePressed(enteredPin) {
    console.log("enteredPin>>", enteredPin);

    getEncryptedData(Constants.PIN_LOCK, enteredPin).then(value => {
      if (enteredPin == value) this.props.closeEnterPin(enteredPin);
      else {
        this.setState({ code: '' });
        this.setState({
          showAlertDialog: true,
          alertTxt: LanguageManager.alertMessages.wrongPIN,
          showButton: false,
          secretTxt: [false, false, false, false, false, false]
        });
      }
    })
      .catch(err => {
        console.log("getEncryptedData PIN_LOCK continuePressed err -----", err)
      });
  }

  //******************************************************************************************/
  render() {
    const { pins } = LanguageManager;
    const { code } = this.state;
    return (<ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={[styles.wrap]}>
          <View style={styles.subHeaderStyle}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity style={styles.touchStyle} onPress={() => { this.props.onBackClick() }}>
                <Image
                  source={Images.arrowLeft}
                  style={{ tintColor: ThemeManager.colors.blackWhiteText, }}
                />
              </TouchableOpacity>

              <View style={{ width: 10, height: 10 }}></View>
            </View>

          </View>

          <View style={{ marginTop: heightDimen(30) }}>
            <OnboardingHeadings title={(this.props?.title ? this.props?.title + " " : "") + pins.confirmSecretCode} subTitle={pins.please + " " + (this.props?.subtitle ? this.props?.subtitle + " " : "") + pins.enterYourDigitCode} />

          </View>



          <View style={{
            flex: 0.6,
            paddingHorizontal: widthDimen(11)
          }}>
            <SecretCodeInput secretTxt={this.state.secretTxt} />

          </View>
          {/* -------------------------------------------------------- */}
          {/* <View style={{ marginTop: 10 }}>
            <View style={styles.stepStyle}>
              <View style={[styles.itemsStyle, { borderColor: ThemeManager.colors.blackWhiteText }, code.length >= 1 ? { backgroundColor: ThemeManager.colors.blackWhiteText } : styles.itemsStyle]} />
              <View style={[styles.itemsStyle, { borderColor: ThemeManager.colors.blackWhiteText }, code.length >= 2 ? { backgroundColor: ThemeManager.colors.blackWhiteText } : styles.itemsStyle]} />
              <View style={[styles.itemsStyle, { borderColor: ThemeManager.colors.blackWhiteText }, code.length >= 3 ? { backgroundColor: ThemeManager.colors.blackWhiteText } : styles.itemsStyle]} />
              <View style={[styles.itemsStyle, { borderColor: ThemeManager.colors.blackWhiteText }, code.length >= 4 ? { backgroundColor: ThemeManager.colors.blackWhiteText } : styles.itemsStyle]} />
              <View style={[styles.itemsStyle, { borderColor: ThemeManager.colors.blackWhiteText }, code.length >= 5 ? { backgroundColor: ThemeManager.colors.blackWhiteText } : styles.itemsStyle]} />
              <View style={[styles.itemsStyle, { borderColor: ThemeManager.colors.blackWhiteText }, code.length >= 6 ? { backgroundColor: ThemeManager.colors.blackWhiteText } : styles.itemsStyle]} />
            </View>
          </View> */}
          {/* -------------------------------------------------------- */}
          <View style={[styles.pin_wrap]}>
            <FlatList
              data={DATA}
              numColumns={3}
              bounces={false}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return index == 9 ? (<View style={styles.listStyle} />) : (
                  <TouchableOpacity
                    style={styles.pinBlockStyle}
                    onPress={this.didSelect.bind(this, item)}>
                    {item === 'Del' ? (<Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: getDimensionPercentage(20), width: getDimensionPercentage(28) }} />) : (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>)}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          {/* {this.state.showButton && (
            <View style={{ marginTop: getDimensionPercentage(10), paddingHorizontal: 20, marginBottom: getDimensionPercentage(52) }}>
              <Button
                buttontext={pins.Continue}
                onPress={() => this.continuePressed()}
              />
            </View>
          )} */}
        </View>
        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}
      </ScrollView>
    </ImageBackground>
    );
  }
}

export default EnterPinForTransaction;
