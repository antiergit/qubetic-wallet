import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Clipboard,
  Platform,
  Modal,
  BackHandler,
  Pressable,
  Keyboard,
  Linking,
} from 'react-native';
import styles from './VirtualCardStyle';
import {
  Header,
  AppAlert,
  Button,
  InputCustom,
  InputCustomTick,
  InputCustomNumber,
  CardViewoption,
  LoaderView,
} from '../../common';
import * as Constants from '../../../Constants';
import { Colors, Fonts, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { getData } from '../../../Utils/MethodsUtils';
import { InputCustomWithQrButton } from '../../common/InputCustomWithQrButton';
import CustomInprogress from '../../common/CustomInprogress';
import { BlurView } from '@react-native-community/blur';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { CustomCongratsModel } from '../../common/CustomCongratsModel';
import { ModalCountryList } from '../../common/ModalCountryList';
import { EventRegister } from 'react-native-event-listeners';
import Toast from 'react-native-easy-toast';
import {
  email,
  emailCheck,
  phoneNoCheck,
  wordsWithOutSpace,
} from '../../../Utils';
import {
  sendOtp,
  verifyOTP,
  saveUserData,
  getVirtualCardFees,
  getUspCardFees,
  applyCard,
  getCountryCodes,
} from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { LanguageManager } from '../../../../LanguageManager';

const currencyList = [
  {
    title: 'USD',
    id: 2,
    image: Images.coinUSD,
  },
];
let timeintervPhone;
let timeintervalEmail;

class VirtualCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertTxt: '',
      themeSelected: '',
      stepOne: this.props.status != 'inactive' ? false : true,
      showQr: false,
      progTwo: false,
      progThree: false,
      progCountTwo: false,
      progCountThree: false,
      showCongrats: false,
      showCurrModal: false,
      showModalCodeCountry: false,
      currency: this.props.data?.currency ? this.props.data?.currency : 'USD',
      countryCode: '',
      countryList: [],
      firstName: '',
      lastName: '',
      phoneNo: '',
      unique_id: '',
      email: this.props?.status != 'inactive' ? this.props?.data?.email : '',
      fullCountryList: [],
      phoneCode: '',
      emailCode: '',
      phoneOTPStatus: LanguageManager.merchantCard.verify,
      emailOTPStatus: LanguageManager.merchantCard.verify,
      disablePhoneOTP: false,
      disableEmailOTP: false,
      phoneButton: LanguageManager.walletMain.send,
      emailButton: LanguageManager.walletMain.send,
      loading: false,
      showSuccess: false,
      showAlertDialog: false,
      showSuccessAlert: false,
      fees: 0,
      coin_data: props.coin_data,
      feeSuccess: false,
      stepOneSuccess: this.props?.status != 'inactive' ? true : false,
      disableDone: false,
      errors: {
        firstName: '',
        phoneNo: '',
        lastName: '',
        email: '',
        phoneCode: '',
        emailCode: '',
      },
      address: this.props?.status != 'inactive' ? this.props?.liminalAddress : '',
    };
  }

  //******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(this.state.address);
  };

  //******************************************************************************************/
  getCurrencySymbol = type => {
    console.log(':::::::::::::::', this.state.currency);
    if (type.toLowerCase() == 'usd') {
      return '$';
    } else {
      return '€';
    }
  };

  //******************************************************************************************/
  checkValidations() {
    const { alertMessages } = LanguageManager;
    console.log('++++++++++', this.props);
    let error = this.state.errors;
    if (this.state.firstName.length == 0) {
      error = { ...error, firstName: alertMessages.firstNameismandatory };
    }
    if (this.state.lastName.length == 0) {
      error = { ...error, lastName: alertMessages.lastNameismandatory };
    }
    if (this.state.phoneNo.length == 0) {
      error = { ...error, phoneNo: alertMessages.phoneNumberismandatory };
    } else if (this.state.phoneNo.length > 13 || this.state.phoneNo?.length < 7) {
      error = { ...error, phoneNo: alertMessages.pleaseEnterValidPhonenumber };
    }
    if (this.state.phoneCode.length == 0) {
      error = { ...error, phoneCode: alertMessages.pleaseenterOTP };
    } else if (this.state.phoneCode.length != 6) {
      error = { ...error, phoneCode: alertMessages.pleaseentervalidOTP };
    } else if (this.state.phoneOTPStatus == 'verify') {
      error = { ...error, phoneCode: alertMessages.pleaseVerifyYourOTP };
    }
    if (this.state.email.length == 0) {
      error = { ...error, email: alertMessages.emailAddressIsMandatory };
    } else if (!emailCheck(this.state.email)) {
      error = { ...error, email: alertMessages.pleaseEnterValidEmailAddress };
    }
    if (this.state.emailCode.length == 0) {
      error = { ...error, emailCode: alertMessages.pleaseenterOTP };
    } else if (this.state.emailCode.length != 6) {
      error = { ...error, emailCode: alertMessages.pleaseentervalidOTP };
    } else if (this.state.emailOTPStatus == 'verify') {
      error = { ...error, emailCode: alertMessages.pleaseVerifyYourOTP };
    }
    this.setState({ errors: error });
    setTimeout(() => {
      if (error.firstName.length == 0 && error.lastName.length == 0 && error.phoneNo.length == 0 && error.phoneCode.length == 0 && error.email.length == 0 && error.emailCode.length == 0) {
        this.submit();
      }
    }, 100);
  }

  //******************************************************************************************/
  submit() {

    console.log('usCardData::::::', this.props.usCardData)
    const { usCardData } = this.props;
    this.setState({ loading: true });
    const data = {
      card_type: usCardData.card_type,
      currency: this.state.currency.toLowerCase(),
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone_number: this.state.phoneNo,
      coin: 'trx',
      country_code: '+' + this.state.countryCode,
      cardId: usCardData.card_type?.toLowerCase() == 'us_preferred' ? usCardData.card_id : '',
      unique_id: this.state.unique_id
    };
    this.props.saveUserData(data).then(res => {
      this.setState({ loading: false });
      console.log('saveUserData:::::', res);
      this.setState({
        alertTxt: res.message,
        showSuccessAlert: true,
        address: res.data,
        showSuccess: true,
        stepOneSuccess: true,
      });
    }).catch(err => {
      this.setState({
        alertTxt: err || LanguageManager.alertMessages.somethingWentWrong,
        showAlertDialog: true,
      });
      this.setState({ loading: false });
      console.log('saveUserData:::::err', err);
    });
  }

  //******************************************************************************************/
  hideAlert() {
    this.setState({ showSuccessAlert: false, stepOne: false });
  }

  //******************************************************************************************/
  onPhoneCodeSend() {
    const { usCardData } = this.props;
    Keyboard.dismiss();
    this.setState({ loading: true });
    try {
      const data = {
        sendOtpReq: {
          mobile_no: this.state.phoneNo,
          cardId: usCardData.card_type?.toLowerCase() == 'us_preferred' ? usCardData.card_id : '',
          country_code: '+' + this.state.countryCode
        },
        type: 'mobile',
      };
      this.props.sendOtp(data).then(res => {
        this.setState({ disablePhoneOTP: true, loading: false, phoneButton: LanguageManager.merchantCard.resend });
        timeintervPhone = setTimeout(() => {
          this.setState({ disablePhoneOTP: false });
        }, 15000);
        console.log('res:;:::', res);
      }).catch(err => {
        this.setState({ phoneNo: '', loading: false, errors: { ...this.state.errors, phoneNo: err || LanguageManager.alertMessages.somethingWentWrong } });
        console.log('err:;:::', err);
      });
    } catch (err) {
      this.setState({
        loading: false,
        errors: { ...this.state.errors, phoneNo: LanguageManager.alertMessages.somethingWentWrong },
      });
      console.log('err:;:::', err);
    }
  }

  //******************************************************************************************/
  onEmailCodeSend() {
    const { usCardData } = this.props;
    Keyboard.dismiss();
    this.setState({ loading: true });
    try {
      const data = {
        sendOtpReq: {
          email: this.state.email,
          cardId: usCardData.card_type?.toLowerCase() == 'us_preferred' ? usCardData.card_id : ''
        },
        type: 'email',
      };
      this.props.sendOtp(data).then(res => {
        this.setState({
          disableEmailOTP: true,
          emailButton: LanguageManager.merchantCard.resend,
          loading: false,
        });
        timeintervalEmail = setTimeout(() => {
          this.setState({ disableEmailOTP: false });
        }, 15000);
        console.log('res:;:::', res);
      }).catch(err => {
        this.setState({
          loading: false,
          email: '',
          errors: { ...this.state.errors, email: err || LanguageManager.alertMessages.SomethingwentwrongPleasetryagain }
        });
        console.log('err:;:::', err);
      });
    } catch (err) {
      this.setState({ loading: false });
      console.log('err:;:::', err);
    }
  }

  //******************************************************************************************/
  codeVerify(type) {
    this.setState({ loading: true });
    let data = {
      source: type == 'email' ? this.state.email : '+' + this.state.countryCode + this.state.phoneNo,
      otp: Number(type == 'email' ? this.state.emailCode : this.state.phoneCode),
    };
    try {
      this.props.verifyOTP(data).then(res => {
        if (type == 'email') {
          this.setState({
            emailOTPStatus: LanguageManager.merchantCard.verified,
            loading: false,
            disableEmailOTP: true,
            errors: { ...this.state.errors, emailCode: '' }
          });
          clearInterval(timeintervalEmail);
        } else {
          this.setState({
            phoneOTPStatus: 'verified',
            loading: false,
            disablePhoneOTP: true,
            errors: { ...this.state.errors, phoneCode: '' },
          });
          clearInterval(timeintervPhone);
        }
        console.log('verify::::rs::::', res);
      }).catch(err => {
        this.setState({ loading: false });
        if (type == 'email') {
          this.setState({
            emailCode: '',
            loading: false,
            errors: { ...this.state.errors, emailCode: err || LanguageManager.alertMessages.SomethingwentwrongPleasetryagain },
          });
        } else {
          this.setState({
            phoneCode: '',
            loading: false,
            errors: { ...this.state.errors, phoneCode: err || LanguageManager.alertMessages.SomethingwentwrongPleasetryagain },
          });
        }
        console.log('err:;verifyOTP:::', err);
        console.log('verify::::err::::', err);
      });
    } catch (err) {
      this.setState({ loading: false });
      if (type == 'email') {
        this.setState({
          emailCode: '',
          loading: false,
          errors: { ...this.state.errors, emailCode: LanguageManager.alertMessages.SomethingwentwrongPleasetryagain },
        });
      } else {
        this.setState({
          phoneCode: '',
          loading: false,
          errors: { ...this.state.errors, phoneCode: LanguageManager.alertMessages.SomethingwentwrongPleasetryagain },
        });
      }
      console.log('err:;:verifyOTP::', err);
    }
  }

  /******************************************************************************************/
  onPressDone() {
    let req = {
      email: this.state.email,
    };
    // this.setState({ loading: true })
    // this.props.applyCard(req).then(res => {
    //   this.setState({ loading: false, })
    //   console.log("res::applyCard:::", res);
    this.setState({ showCongrats: true });
    // }).catch(Err => {
    //   this.setState({ alertTxt: Err | 'Something went wrong', showAlertDialog: true })
    //   this.setState({ loading: false })
    //   console.log("Err::applyCard::::", Err);
    // })
  }

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data });
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      console.log('Constants.DOWN_MODAL', Constants.DOWN_MODAL);
      this.setState({
        showCurrModal: false,
        showCongrats: false,
        showModalCodeCountry: false,
        showQr: false,
      });
    });
    this.props.navigation.addListener('didFocus', () => {
      // BackHandler.addEventListener('hardwareBackPress', () => {
      //   if (this.props.status != 'inactive' || this.state.stepOneSuccess) {
      //     Actions.pop();
      //     return true;
      //   } else {
      //     if (!this.state.stepOne) {
      //       this.setState({ stepOne: true });
      //       return true;
      //     } else {
      //       Actions.pop();
      //       return true;
      //     }
      //   }
      // });

      if (global.fromSendTrx) {
        this.onPressDone();
        global.fromSendTrx = false;
      } else {
        this.setState({ loading: true });
        /******************************************************************************************/
        const { usCardData } = this.props;
        Promise.all([
          /******************************************************************************************/
          new Promise((resolve, reject) => {
            const cardID = usCardData.card_id;
            console.log('res::cardID:::', cardID);
            usCardData.card_type?.toLowerCase() == 'us_preferred' ?
              this.props.getUspCardFees(cardID).then(res => {
                console.log('res::getUspCardFees:::', res);
                this.setState({ fees: res.data.amount, feeSuccess: true, disableDone: false });
                resolve();
              }).catch(err => {
                this.setState({ showAlertDialog: true, alertTxt: err || LanguageManager.alertMessages.somethingWentWrong, feeSuccess: false, disableDone: true });
                console.log('err::getUspCardFees:::', err);
                reject();
              })
              : this.props.getVirtualCardFees().then(res => {
                console.log('res::getVirtualCardFees:::', res);
                this.setState({ fees: res.data.amount, feeSuccess: true, disableDone: false });
                resolve();
              }).catch(err => {
                this.setState({ showAlertDialog: true, alertTxt: err || LanguageManager.alertMessages.somethingWentWrong, feeSuccess: false, disableDone: true });
                console.log('err::getVirtualCardFees:::', err);
                reject();
              });
          }),
          /******************************************************************************************/
          new Promise((resolve, reject) => {
            this.props.getCountryCodes().then(res => {
              console.log('countryCode:::::', res);
              this.setState({ countryList: res.data, fullCountryList: res.data, countryCode: this.state.countryCode != '' ? this.state.countryCode : res.data?.[0]?.mobile_area_code ? res.data?.[0]?.mobile_area_code : '' });
              resolve();
            }).catch(err => {
              this.setState({ showAlertDialog: true, alertTxt: err || LanguageManager.alertMessages.somethingWentWrong });
              console.log('countryCode::::err:', err);
              reject();
            });
          }),
        ]).then(res => {
          this.setState({ loading: false });
        }).catch(err => {
          this.setState({ loading: false });
        });
      }
    });
    this.props.navigation.addListener('didBlur', () => {
      EventRegister.removeEventListener(Constants.DOWN_MODAL);
      BackHandler.removeEventListener('hardwareBackPress');
    });
  }

  /******************************************************************************************/
  dismissModal() {
    this.setState({ showCongrats: false });
    Singleton.getInstance().virtualCardStatus = 'Applied';
    Actions.pop();
  }

  /******************************************************************************************/
  stepOneView() {
    const { merchantCard, alertMessages, walletMain, placeholderAndLabels } = LanguageManager;
    return (
      <View>
        <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.settingBg }]}>
          <CardViewoption
            customTypeTextStyle={{ color: '#64748B' }}
            disabled
            typeText={this.state.currency.toUpperCase()}
            onPress={() => { }}
            text={merchantCard.currency}
            themeSelected={this.state.themeSelected}
          />
          <CardViewoption
            disabled
            customTypeTextStyle={{ color: '#64748B' }}
            typeText={this.props.usCardData?.card_type?.toLowerCase() == "us_preferred" ? merchantCard.usPrefferedCard : merchantCard.virtualCard}
            hideBottom={true}
            onPress={() => { }}
            text={merchantCard.type}
            themeSelected={this.state.themeSelected}
          />
        </View>

        <View style={[styles.ViewStyle2]}>
          <InputCustom
            mandatory
            autoCapitalize="words"
            txtStyle={{ marginTop: 20 }}
            label={placeholderAndLabels.firstName}
            placeHolder={placeholderAndLabels.enterFirstnamehere}
            placeholderColor={Colors.placeholderColor}
            placeholderTextColor={ThemeManager.colors.lightWhiteText}
            value={this.state.firstName}
            onChangeText={text => {
              if (wordsWithOutSpace(text)) {
                if (text.length > 20) {
                  this.setState({ firstName: text, errors: { ...this.state.errors, firstName: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ firstName: text, errors: { ...this.state.errors, firstName: '' } });
                }
              } else if (text.length < 2) {
                this.setState({ ...this.state, firstName: '', errors: { ...this.state.errors, firstName: alertMessages.firstNameismandatory } });
              }
            }}
            onBlur={() => {
              if (this.state.firstName.length < 2) {
                this.setState({ ...this.state, errors: { ...this.state.errors, firstName: alertMessages.firstNameismandatory } });
              }
            }}
          />
          {this.state.errors.firstName.length > 0 && (<Text style={styles.errorText}>{this.state.errors.firstName}</Text>)}

          <InputCustom
            txtStyle={{ marginTop: 20 }}
            label={placeholderAndLabels.lastName}
            placeHolder={placeholderAndLabels.enterLastnamehere}
            placeholderColor={Colors.placeholderColor}
            placeholderTextColor={ThemeManager.colors.lightWhiteText}
            value={this.state.lastName}
            onChangeText={text => {
              if (wordsWithOutSpace(text)) {
                if (text.length > 20) {
                  this.setState({ lastName: text, errors: { ...this.state.errors, lastName: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ lastName: text, errors: { ...this.state.errors, lastName: '' } });
                }
              } else if (text.length < 2) {
                this.setState({ ...this.state, lastName: '', errors: { ...this.state.errors, lastName: alertMessages.lastNameismandatory } });
              }
            }}
            onBlur={() => {
              if (this.state.lastName.length < 2) {
                this.setState({ ...this.state, errors: { ...this.state.errors, lastName: alertMessages.lastNameismandatory } });
              }
            }}
          />

          {this.state.errors.lastName.length > 0 && (<Text style={styles.errorText}>{this.state.errors.lastName}</Text>)}

          <InputCustomNumber
            ref={ref => { this.phoneNo = ref }}
            keyboardType="number-pad"
            txtStyle={{ marginTop: 20 }}
            countryCode={'+' + this.state.countryCode}
            onPressCode={() => { this.setState({ showModalCodeCountry: true }) }}
            label={placeholderAndLabels.phoneNumber}
            placeHolder={placeholderAndLabels.EnterNumberhere}
            placeholderColor={Colors.placeholderColor}
            placeholderTextColor={ThemeManager.colors.lightWhiteText}
            value={this.state.phoneNo}
            onChangeText={text => {
              if (timeintervPhone) {
                clearInterval(timeintervPhone);
              }
              this.setState({ disablePhoneOTP: false });
              this.setState({ phoneOTPStatus: merchantCard.verify, phoneCode: '', phoneButton: walletMain.send });
              if (phoneNoCheck(text)) {
                if (text.length > 13 || text.length < 7) {
                  this.setState({ phoneNo: text, errors: { ...this.state.errors, phoneNo: alertMessages.minMAxPhoneLenght } });
                } else {
                  this.setState({ phoneNo: text, errors: { ...this.state.errors, phoneNo: '' } });
                }
              } else if (text.length < 2) {
                this.setState({ phoneNo: '' });
              }
            }}
            onBlur={() => {
              if (this.state.phoneNo.length < 2) {
                this.setState({ errors: { ...this.state.errors, phoneNo: alertMessages.phoneNumberismandatory } });
              }
            }}
          />

          {this.state.errors.phoneNo.length > 0 && (<Text style={styles.errorText}>{this.state.errors.phoneNo}</Text>)}

          <Pressable
            disabled={this.state.phoneNo.length == 0 || this.state.errors.phoneNo.length != 0 || this.state.disablePhoneOTP}
            onPress={() => this.onPhoneCodeSend()}>
            <Text style={[styles.sendCodeStyle, { color: this.state.phoneNo.length == 0 || this.state.errors.phoneNo.length !== 0 || this.state.disablePhoneOTP ? ThemeManager.colors.lightText : ThemeManager.colors.darkMode }]}>{this.state.phoneButton} {merchantCard.code}</Text>
          </Pressable>

          <InputCustomTick
            ref={ref => { this.phoneNoOTP = ref }}
            status={this.state.phoneOTPStatus}
            maxLength={6}
            editable={this.state.phoneOTPStatus != 'verified' ? true : false}
            label={placeholderAndLabels.enterOTP}
            placeHolder={placeholderAndLabels.entercode}
            placeholderColor={Colors.placeholderColor}
            placeholderTextColor={ThemeManager.colors.lightWhiteText}
            value={this.state.phoneCode}
            keyboardType="number-pad"
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                this.setState({ phoneCode: text, errors: { ...this.state.errors, phoneCode: '' } });
              } else if (text.length < 2) {
                this.setState({ phoneCode: '', errors: { ...this.state.errors, phoneCode: alertMessages.otpIsMandatory } });
              }
            }}
            onBlur={() => {
              if (this.state.phoneCode.length < 2) {
                this.setState({ errors: { ...this.state.errors, phoneCode: alertMessages.otpIsMandatory } });
              } else if (this.state.phoneCode.length != 6) {
                this.setState({ errors: { ...this.state.errors, phoneCode: alertMessages.PleaseentervalidOTP } });
              }
            }}
            onPressRight={() => this.codeVerify('mobile')}
            disableRight={this.state.phoneCode.length != 6}
          />

          {this.state.errors.phoneCode.length > 0 && (<Text style={styles.errorText}>{this.state.errors.phoneCode}</Text>)}

          <InputCustom
            ref={ref => { this.email = ref }}
            txtStyle={{ marginTop: 20 }}
            label={placeholderAndLabels.email}
            placeHolder={placeholderAndLabels.enterEmail}
            placeholderColor={Colors.placeholderColor}
            placeholderTextColor={ThemeManager.colors.lightWhiteText}
            value={this.state.email}
            keyboardType="email-address"
            onChangeText={text => {
              if (timeintervalEmail) {
                clearInterval(timeintervalEmail);
              }
              this.setState({ disableEmailOTP: false });
              this.setState({ emailOTPStatus: merchantCard.verify, emailCode: '', emailButton: walletMain.send });

              if (email(text)) {
                this.setState({
                  emailOTPStatus: merchantCard.verify,
                  emailCode: '',
                  emailButton: walletMain.send,
                  disableEmailOTP: false,
                });
                if (emailCheck(text)) {
                  this.setState({
                    email: text,
                    errors: { ...this.state.errors, email: '' },
                  });
                } else {
                  this.setState({
                    email: text,
                    errors: { ...this.state.errors, email: alertMessages.pleaseEnterValidEmailAddressPeriod }
                  });
                }
              } else if (text.length < 2) {
                this.setState({ ...this.state, email: '' });
              }
            }}
            onBlur={() => {
              if (this.state.email.length < 2) {
                this.setState({ errors: { ...this.state.errors, email: alertMessages.emailAddressIsMandatory } });
              } else if (!emailCheck(this.state.email)) {
                this.setState({ errors: { ...this.state.errors, email: alertMessages.pleaseEnterValidEmailAddress } });
              }
            }}
          />

          {this.state.errors.email.length > 0 && (<Text style={styles.errorText}>{this.state.errors.email}</Text>)}

          <TouchableOpacity
            disabled={this.state.email.length == 0 || this.state.errors.email.length != 0 || this.state.disableEmailOTP}
            onPress={() => this.onEmailCodeSend()}>
            <Text style={[styles.sendCodeStyle, { color: this.state.email.length == 0 || this.state.errors.email.length !== 0 || this.state.disableEmailOTP ? ThemeManager.colors.lightText : ThemeManager.colors.darkMode }]}>{this.state.emailButton} {merchantCard.code}</Text>
          </TouchableOpacity>

          <InputCustomTick
            ref={ref => { this.emailOTP = ref }}
            status={this.state.emailOTPStatus}
            maxLength={10}
            label={placeholderAndLabels.enterOTP}
            editable={this.state.emailOTPStatus != 'verified' ? true : false}
            placeHolder={placeholderAndLabels.entercode}
            placeholderColor={Colors.placeholderColor}
            placeholderTextColor={ThemeManager.colors.lightWhiteText}
            value={this.state.emailCode}
            keyboardType="number-pad"
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                this.setState({
                  emailCode: text,
                  errors: { ...this.state.errors, emailCode: '' },
                });
              } else if (text.length < 2) {
                this.setState({
                  emailCode: '',
                  errors: { ...this.state.errors, emailCode: alertMessages.otpIsMandatory },
                });
              }
            }}
            onBlur={() => {
              if (this.state.emailCode.length < 2) {
                this.setState({ errors: { ...this.state.errors, emailCode: alertMessages.otpIsMandatory } });
              } else if (this.state.emailCode.length != 6) {
                this.setState({ errors: { ...this.state.errors, emailCode: alertMessages.PleaseentervalidOTP } });
              }
            }}
            onPressRight={() => this.codeVerify('email')}
            disableRight={this.state.emailCode.length != 6}
          />
          {this.state.errors.emailCode.length > 0 && (<Text style={styles.errorText}>{this.state.errors.emailCode}</Text>)}
          <View style={{ marginTop: 20 }}>
            <Button
              onPress={async () => { this.checkValidations() }}
              buttontext={merchantCard.submit}
            />
          </View>
        </View>
      </View>
    );
  }

  /******************************************************************************************/
  stepTwoView() {
    const { merchantCard, alertMessages } = LanguageManager;
    return (
      <View>
        <View style={[styles.ViewStyle2]}>
          <Text style={styles.textStyle5}>{merchantCard.amountToBePaid}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
            <Text style={styles.textStyle4}>{this.state.fees.toFixed(2)}{' '}</Text>
            <Text style={styles.textStyle3}>{this.state.coin_data?.coin_symbol?.toUpperCase()}</Text>
          </View>

          <Text style={styles.textStyle2}>{merchantCard.pleasePayTheAccountOpeningFee}</Text>

          <View style={[{ borderRadius: 20, marginTop: 40, backgroundColor: ThemeManager.colors.settingBg }]}>
            <CardViewoption
              hideBottom={true}
              disabled
              paddingBottom={5}
              customTypeTextStyle={styles.customTxtstyle1}
              customTextStyle={styles.customTxtstyle}
              typeText={`${this.state.fees.toFixed(2)} ${this.state.coin_data?.coin_symbol?.toUpperCase()}`}
              onPress={() => Linking.openURL(Constants.PRIVACY_POLICY_LINK)}
              text={merchantCard.issuingFee}
              themeSelected={this.state.themeSelected}
            />
            <CardViewoption
              typeText={this.state.coin_data?.coin_symbol?.toUpperCase()}
              paddingBottom={5}
              marginTop={-10}
              disabled
              customTypeTextStyle={styles.customTxtstyle1}
              customTextStyle={styles.customTxtstyle}
              hideBottom={true}
              onPress={() => Linking.openURL(Constants.PRIVACY_POLICY_LINK)}
              text={merchantCard.paymentCurrency}
              themeSelected={this.state.themeSelected}
            />
            <CardViewoption
              marginTop={-10}
              disabled
              customTypeTextStyle={styles.customTxtstyle1}
              customTextStyle={styles.customTxtstyle}
              typeText={`${this.state.fees.toFixed(2)} ${this.state.coin_data?.coin_symbol?.toUpperCase()}`}
              hideBottom={true}
              onPress={() => Linking.openURL(Constants.PRIVACY_POLICY_LINK)}
              text={merchantCard.estimatedPaymentAmount}
              themeSelected={this.state.themeSelected}
            />
          </View>

          <Text style={styles.textStyle1}>{merchantCard.walletAddress}</Text>

          <View style={{ marginTop: 12 }}>
            <InputCustomWithQrButton
              editable={false}
              placeHolder={this.state.address}
              placeholderTextColor={ThemeManager.colors.lightWhiteText}
              showQrCode={() => { this.setState({ showQr: true }) }}
              notScan={true}
              isCopy={true}
              doCopy={() => {
                this.set_Text_Into_Clipboard();
                Keyboard.dismiss();
                this.toast.show(alertMessages.copied);
              }}
              image={Images.showQr}
              customIcon={Images.sendOutlined}
              customIconPress={() => {
                console.log('coin_data:::', this.state.coin_data);
                if (this.state.coin_data?.hasOwnProperty('coin_symbol')) {
                  Actions.SendTrx({
                    cardId: this.props.usCardData?.card_id,
                    selectedCoin: this.state.coin_data,
                    themeSelected: 2,
                    from: 'Card',
                    fee: this.state.fees,
                    address: this.state.address,
                    currency: this.getCurrencySymbol(this.state.currency),
                  });
                } else {
                  console.log('else::::');
                  this.setState({
                    alertTxt: alertMessages.PleaseactivateTronUSDT,
                    showAlertDialog: true,
                    showSuccess: false,
                  });
                }
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  /******************************************************************************************/
  render() {
    const { merchantCard, commonText } = LanguageManager;
    return (
      <>
        <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
          <Header backCallBack={() => {
            Actions.pop();
          }}
            BackButtonText={merchantCard.applyforUsCard}
            bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
          />
          <View style={{ paddingHorizontal: 20 }}>
            <CustomInprogress
              showOnlyTwoProg
              showprogTwo={!this.state.stepOne}
              progOneTxt={'1'}
              progTwoTxt={'2'}
              progressView={{ backgroundColor: ThemeManager.colors.colorVariation, borderColor: ThemeManager.colors.settingBg }}
              progressViewEmpty={{ backgroundColor: 'transparent', borderColor: ThemeManager.colors.settingBg }}
              horizontalLine={{ backgroundColor: ThemeManager.colors.settingBg }}
              progTxt={{ color: ThemeManager.colors.manageWalletModalBg }}
              firstCont={merchantCard.applicationInformation}
              secCont={merchantCard.fee}
              txtTwoStyle={{ right: -35 }}
            />
          </View>

          {/* ********************************************************Country & Currency Modal******************************************************* */}
          <ModalCountryList
            title={commonText.ChooseCountryCode}
            clearSearch={true}
            countryCode={true}
            showCountry={true}
            openModel={this.state.showModalCodeCountry}
            countryList={this.state.countryList}
            onPressIn={() => this.setState({ showModalCodeCountry: false })}
            onpressItem={item => {
              console.log('item:::', item);
              this.setState({ countryCode: item.mobile_area_code, showModalCodeCountry: false, unique_id: item.unique_id });
            }}
            onClearSearch={() => { this.setState({ countryList: this.state.fullCountryList }) }}
            searchCountry={text => {
              if (text.length == 0) {
                this.setState({ countryList: this.state.fullCountryList });
              } else {
                let list = this.state.fullCountryList.filter(country => country.english.toLowerCase().includes(text.toLowerCase()) || country.mobile_area_code.toString()?.toLowerCase().includes(text.toLowerCase()));
                console.log('list', list);
                this.setState({ countryList: list });
              }
            }}
          />

          {/* /****************************************************************************************** */}
          <ModalCountryList
            heading={merchantCard.chooseCurrency}
            openModel={this.state.showCurrModal}
            list={currencyList}
            onPressIn={() => this.setState({ showCurrModal: false })}
            onpressItem={item => {
              console.log('item:::', item);
              this.setState({ currency: item.title, showCurrModal: false });
            }}
          />

          {/* /****************************************************************************************** */}
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            enableAutomaticScroll={Platform.OS == 'ios' ? false : true}
            bounces={false}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            extraScrollHeight={Platform.OS == 'ios' ? 50 : 50}
            contentContainerStyle={{ paddingBottom: 0 }}>
            {this.state.stepOne ? this.stepOneView() : this.stepTwoView()}
          </KeyboardAwareScrollView>
          {!this.state.stepOne && (
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
              <Button
                disabled={this.state.disableDone}
                onPress={() => { this.onPressDone() }}
                buttontext={merchantCard.done}
              />
            </View>
          )}

          {/* /****************************************************************************************** */}
          {
            <Modal
              statusBarTranslucent
              animationType="fade"
              transparent={true}
              visible={this.state.showQr}
              onRequestClose={() => {
                this.setState({ showQr: false });
              }}>
              <BlurView
                style={styles.blurView}
                blurType="light"
                blurAmount={5}
                reducedTransparencyFallbackColor="white"
              />
              <View style={[styles.centeredView]}>
                <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.Mainbg, borderColor: ThemeManager.colors.Mainbg }]}>
                  <Text style={styles.QrText}>{merchantCard.scanQRcode}</Text>
                  <TouchableOpacity style={{ marginTop: -36 }} onPress={() => { this.setState({ showQr: false }) }}>
                    <Image style={{ height: 33, width: 33, alignSelf: 'flex-end' }} source={Images.crossQr} />
                  </TouchableOpacity>
                  <View style={styles.ViewStyle3}>

                  </View>
                </View>
              </View>
            </Modal>
          }

          {/* /****************************************************************************************** */}
          <CustomCongratsModel
            textStyle={styles.textStyle}
            openModel={this.state.showCongrats}
            dismiss={() => { this.dismissModal() }}
            title1={merchantCard.applicationSuccessful}
            title2={merchantCard.oncePaymetConfirmes}
          />

          {this.state.showAlertDialog && (
            <AppAlert
              showSuccess={true}
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => {
                this.setState({ showAlertDialog: false });
              }}
            />
          )}
        </View>

        <LoaderView isLoading={this.state.loading} />

        <Toast
          ref={toast => (this.toast = toast)}
          position="bottom"
          positionValue={210}
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />

        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={false}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              if (!this.state.feeSuccess) {
                this.setState({ showAlertDialog: false });
                Actions.pop();
              } else {
                this.setState({ showAlertDialog: false });
              }
            }}
          />
        )}

        {this.state.showSuccessAlert && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.hideAlert();
            }}
          />
        )}
      </>
    );
  }
}

export default connect(null, {
  sendOtp,
  verifyOTP,
  saveUserData,
  getVirtualCardFees,
  getUspCardFees,
  applyCard,
  getCountryCodes,
})(VirtualCard);
