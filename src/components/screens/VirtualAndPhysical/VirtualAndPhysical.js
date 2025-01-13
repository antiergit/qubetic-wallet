import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  BackHandler,
  Keyboard,
  Pressable,
  Linking,
  Platform,
  Clipboard,
} from 'react-native';
import {
  AppAlert,
  LoaderView,
  Header,
  Button,
  CardViewoption,
  ModalCoinList,
} from '../../common';
import {
  addressCheck,
  addressCheck1,
  email,
  emailCheck,
  phoneNoCheck,
  wordsWithOutSpace,
} from '../../../Utils';
import {
  sendOtp,
  verifyOTP,
  getCountryCodes,
  saveShippingAddress,
  getPhysicalCardFees,
} from '../../../Redux/Actions';
import React, { Component } from 'react';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts, Images } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import CustomInprogress from '../../common/CustomInprogress';
import styles from './VirtualAndPhysicalStyle';
import { CardViewVirtualPhy } from '../../common/CardViewVirtualPhy';
import { ModalCountryList } from '../../common/ModalCountryList';
import { InputCustomWithQrButton } from '../../common/InputCustomWithQrButton';
import { CustomCongratsModel } from '../../common/CustomCongratsModel';
import Singleton from '../../../Singleton';
import { BlurView } from '@react-native-community/blur';
import * as Constants from '../../../Constants';
import { EventRegister } from 'react-native-event-listeners';
import Toast from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';
import { getData } from '../../../Utils/MethodsUtils';

let timeintervPhone;
let timeintervalEmail;


const currencyList = [
  {
    title: 'EUR',
    id: 1,
    image: Images.coinEUR,
  },
  {
    title: 'USD',
    id: 2,
    image: Images.coinUSD,
  },
];

class VirtualAndPhysical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'en',
      unique_id: '',
      progTwo: false,
      progThree: this.props?.status != 'inactive' ? true : false,
      progCountTwo: this.props?.status != 'inactive' ? true : false,
      progCountThree: this.props?.status != 'inactive' ? true : false,
      firstName: '',
      lastName: '',
      province: '',
      city: '',
      streetAdd: '',
      postCode: '',
      country: '',
      countryCode: '',
      countryList: [],
      fullCountryList: [],
      phoneCode: '',
      phoneNo: '',
      emailCode: '',
      email: '',
      currency: this.props.physicalCardData?.fiat_currency || 'USD',
      gender: LanguageManager.merchantCard.male,
      showModalCountry: false,
      showModalGender: false,
      showFromDatePicker: false,
      todaysDate: new Date(),
      minimumDate: '',
      fromDate: '',
      showCongrats: false,
      showCurrModal: false,
      showQr: false,
      showModalCodeCountry: false,
      loading: false,
      disablePhoneOTP: false,
      disableEmailOTP: false,
      phoneButton: 'Send',
      emailButton: 'Send',
      phoneOTPStatus: 'verify',
      emailOTPStatus: 'verify',
      alertTxt: '',
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
        province: '',
        city: '',
        streetAdd: '',
        postCode: '',
      },
      address: this.props?.status != 'inactive' ? this.props?.address : '',
    };
  }

  /******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    console.log('this.state.address:::::', this.state.address);
    await Clipboard.setString(this.state.address);
  };

  /******************************************************************************************/
  getCurrencySymbol = type => {
    console.log(':::::::::::::::', this.state.currency);
    if (type.toLowerCase() == 'usd') {
      return '$';
    } else {
      return '€';
    }
  };

  /******************************************************************************************/
  onSubmit() {
    console.log('this.state.unique_id::::', this.state.unique_id)
    this.setState({ loading: true });
    let data = {
      currency: this.state.currency,
      card_type: 'Physical',
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      gender: this.state.gender?.toLowerCase() == 'male' ? 1 : 2,
      country: this.state.country,
      province: this.state.province,
      city: this.state.city,
      street_address: this.state.streetAdd,
      post_code: this.state.postCode,
      unique_id: this.state.unique_id.toString(),
      country_code: this.state.countryCode.toString(),
      phone_number: this.state.phoneNo,
      email: this.state.email,
      card_id: this.props.physicalCardData.card_id
    };
    this.props.saveShippingAddress(data).then(res => {
      console.log('res:::::::::saveShippingAddress', res);
      this.setState({ loading: false });
      this.setState({
        alertTxt: res.message,
        showSuccessAlert: true,
        address: res.data.address,
        showSuccess: true,
        stepOneSuccess: true,
      });
    }).catch(err => {
      console.log('err:::::::::saveShippingAddress', err);
      this.setState({ loading: false });
    });
  }

  /******************************************************************************************/
  hideAlert() {
    this.setState({
      progThree: true,
      progCountThree: true,
      progTwo: false,
      progCountTwo: true,
      showSuccessAlert: false,
    });
  }

  /******************************************************************************************/
  checkValidations() {
    const { alertMessages } = LanguageManager;
    console.log('++++++++++', this.state.firstName?.length);
    let error = this.state.errors;
    if (this.state.firstName?.length == 0) {
      error = { ...error, firstName: alertMessages.firstNameismandatory };
    }
    if (this.state.lastName?.length == 0) {
      error = { ...error, lastName: alertMessages.lastNameismandatory };
    }
    if (this.state.province?.length == 0) {
      error = { ...error, province: alertMessages.provinceIsMandatory };
    }
    if (this.state.city?.length == 0) {
      error = { ...error, city: alertMessages.cityIsMandatory };
    }
    if (this.state.streetAdd?.length == 0) {
      error = { ...error, streetAdd: alertMessages.streetAddressIsMandatory };
    }
    if (this.state.postCode?.length == 0) {
      error = { ...error, postCode: alertMessages.postcodeIsMandatory };
    }
    if (this.state.phoneNo?.length == 0) {
      error = { ...error, phoneNo: alertMessages.phoneNumberismandatory };
    }
    if (this.state.phoneNo?.length > 13 || this.state.phoneNo?.length < 7) {
      error = { ...error, phoneNo: alertMessages.pleaseEnterValidPhonenumber };
    }
    if (this.state.phoneCode?.length == 0) {
      error = { ...error, phoneCode: alertMessages.pleaseenterOTP };
    }
    if (this.state.phoneCode?.length == 0) {
      error = { ...error, phoneCode: alertMessages.pleaseentervalidOTP };
    }
    if (this.state.email?.length == 0) {
      error = { ...error, email: alertMessages.emailAddressIsMandatory };
    }
    if (!emailCheck(this.state.email)) {
      error = { ...error, email: alertMessages.pleaseEnterValidEmailAddress };
    }
    if (this.state.emailCode?.length == 0) {
      error = { ...error, emailCode: alertMessages.pleaseenterOTP };
    }
    if (this.state.emailCode?.length > 6) {
      error = { ...error, emailCode: alertMessages.pleaseentervalidOTP };
    }
    this.setState({ errors: error });
    setTimeout(() => {
      if (
        error.firstName?.length == 0 &&
        error.lastName?.length == 0 &&
        error.phoneNo?.length == 0 &&
        error.phoneCode?.length == 0 &&
        error.email?.length == 0 &&
        error.emailCode?.length == 0 &&
        error.province?.length == 0 &&
        error.city?.length == 0 &&
        error.streetAdd?.length == 0 &&
        error.postCode?.length == 0 == 0
      ) {
        this.onSubmit();
      }
    }, 100);
  }

  /******************************************************************************************/
  onPressDone() {
    this.setState({ showCongrats: true });
  }

  /******************************************************************************************/
  componentDidMount() {
    console.log('this.props.physicalCardData?.fiat_currency?.toUpperCase() :::::', this.props.physicalCardData?.fiat_currency?.toUpperCase())

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showModalCountry: false,
        showCurrModal: false,
        showModalGender: false,
        showCongrats: false,
        showModalCodeCountry: false,
        showQr: false,
      });
    });
    this.props.navigation.addListener('didFocus', async () => {
      const lang = await getData(Constants.SELECTED_LANGUAGE);
      this.setState({ language: lang });
      BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('this.state.progThree', this.state.progThree);
        Actions.pop();
        return true;
      });
      if (global.fromSendTrx) {
        this.onPressDone();
        global.fromSendTrx = false;
      } else {
        this.setState({ loading: true });
        Promise.all([
          new Promise((resolve, reject) => {
            this.props.getCountryCodes().then(res => {
              this.setState({
                countryList: res.data,
                fullCountryList: res.data,
                countryCode: this.state.countryCode != '' ? this.state.countryCode : res.data?.[0]?.mobile_area_code ? res.data?.[0]?.mobile_area_code : '',
                country: this.state.country != '' ? this.state.country : res.data?.[0]?.english ? res.data?.[0]?.english : '',
                unique_id: this.state.unique_id != '' ? this.state.unique_id : res.data?.[0]?.unique_id ? res.data?.[0]?.unique_id : ''
              });
              resolve();
            }).catch(err => {
              this.setState({ showAlertDialog: true, alertTxt: err || LanguageManager.alertMessages.somethingWentWrong });
              console.log('countryCode::::err:', err);
              reject();
            });
          }),
          /******************************************************************************************/
          new Promise((resolve, reject) => {
            const { physicalCardData } = this.props;
            const cardID = physicalCardData.card_id;
            this.props.getPhysicalCardFees(cardID).then(res => {
              console.log('res:::::::getPhysicalCardFees', res);
              this.setState({ fees: res.data.amount, feeSuccess: true, disableDone: false });
              resolve();
            }).catch(err => {
              this.setState({ showAlertDialog: true, alertTxt: err || LanguageManager.alertMessages.somethingWentWrong, disableDone: true });
              console.log('getPhysicalCardFees::::err:', err);
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
  onPhoneCodeSend() {
    console.log('+++++++++++++++');
    Keyboard.dismiss();
    this.setState({ loading: true });
    try {
      let data = {
        sendOtpReq: {
          mobile_no: this.state.phoneNo,
          cardId: this.props.physicalCardData.card_id,
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
        errors: {
          ...this.state.errors,
          phoneNo: LanguageManager.alertMessages.somethingWentWrong,
        },
      });
      console.log('err:;:::', err);
    }
  }

  /******************************************************************************************/
  onEmailCodeSend() {
    Keyboard.dismiss();
    this.setState({ loading: true });
    try {
      let data = {
        sendOtpReq: { email: this.state.email, cardId: this.props.physicalCardData.card_id, },
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
          errors: { ...this.state.errors, email: err || LanguageManager.alertMessages.SomethingwentwrongPleasetryagain },
        });
        console.log('err:;:::', err);
      });
    } catch (err) {
      this.setState({ loading: false });
      console.log('err:;:::', err);
    }
  }

  /******************************************************************************************/
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
            emailOTPStatus: 'verified',
            loading: false,
            disableEmailOTP: true,
            errors: { ...this.state.errors, emailCode: '' },
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
  addCountryFn() {
    this.setState({ showModalCountry: true });
  }

  /******************************************************************************************/
  addCountryCodeFn() {
    this.setState({ showModalCodeCountry: true });
  }

  /******************************************************************************************/
  addGenderFn() {
    this.setState({ showModalGender: true });
  }

  /******************************************************************************************/
  dismissModal() {
    this.setState({ showCongrats: false });
    Actions.PrepaidCard({ from: 'PhysicalCard', physicalCardData: this.props.physicalCardData });
    Singleton.getInstance().physicalCardStatus = 'Applied';
  }

  /******************************************************************************************/
  stepOne() {
    const { merchantCard, alertMessages, walletMain, placeholderAndLabels } = LanguageManager;
    return (
      <>
        <Text style={[styles.headingText, { color: ThemeManager.colors.Text }]}>{merchantCard.pleaseFillInTheCorrectDetails}</Text>
        <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.searchBg }]}>
          <CardViewVirtualPhy
            hideImage={true}
            disableTouch={true}
            textRight={this.state.currency?.toUpperCase()}
            rightTxtStyle={{ color: ThemeManager.colors.txtNew1 }}
            ViewStyle={{ paddingVertical: 10 }}
            dropDownView={true}
            text={merchantCard.currency}
            rightImg={Images.rightArrowNew}
          />

          <CardViewVirtualPhy
            dropDownView={true}
            ViewStyle={{ paddingVertical: 10 }}
            disableTouch
            text={'Type'}
            onPressTxt={() => alert(1)}
            textRight={merchantCard.physicalCard}
            rightTxtStyle={{ color: ThemeManager.colors.txtNew1, right: -10 }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            text={placeholderAndLabels.firstName}
            placeholder={placeholderAndLabels.firstName}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            value={this.state.firstName}
            onChangeText={text => {
              if (wordsWithOutSpace(text)) {
                if (text?.length > 20) {
                  this.setState({
                    firstName: text,
                    errors: { ...this.state.errors, firstName: alertMessages.inputlimitexceed },
                  });
                } else {
                  this.setState({
                    firstName: text,
                    errors: { ...this.state.errors, firstName: '' },
                  });
                }
              } else if (text?.length < 2) {
                this.setState({
                  ...this.state,
                  firstName: '',
                  errors: { ...this.state.errors, firstName: alertMessages.firstNameismandatory }
                });
              }
            }}
            onBlur={() => {
              if (this.state.firstName?.length < 2) {
                this.setState({
                  ...this.state,
                  errors: { ...this.state.errors, firstName: alertMessages.firstNameismandatory }
                });
              }
            }}
            bottomText={() => { return (<>{this.state.errors.firstName?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.firstName}</Text>)}</>) }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={this.state.lastName}
            onChangeText={text => {
              if (wordsWithOutSpace(text)) {
                if (text?.length > 20) {
                  this.setState({ lastName: text, errors: { ...this.state.errors, lastName: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ lastName: text, errors: { ...this.state.errors, lastName: '' } });
                }
              } else if (text?.length < 2) {
                this.setState({ ...this.state, lastName: '' });
              }
            }}
            onBlur={() => {
              if (this.state.lastName?.length < 2) {
                this.setState({ errors: { ...this.state.errors, lastName: alertMessages.lastNameismandatory } });
              }
            }}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            placeholder={placeholderAndLabels.lastName}
            text={placeholderAndLabels.lastName}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.lastName?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.lastName}</Text>)}
                </>
              );
            }}
          />

          <CardViewVirtualPhy
            dropDownView={true}
            ViewStyle={{ paddingVertical: 10 }}
            onPressTxt={() => this.addGenderFn()}
            textRight={this.state.gender}
            rightTxtStyle={{ color: ThemeManager.colors.txtNew1 }}
            rightImg={Images.rightArrowNew}
            text={merchantCard.gender}
          />

          <CardViewVirtualPhy
            dropDownView={true}
            ViewStyle={{ paddingVertical: 10 }}
            onPressTxt={() => this.addCountryFn()}
            textRight={this.state.country}
            rightTxtStyle={{ color: ThemeManager.colors.txtNew1 }}
            rightImg={Images.rightArrowNew}
            text={merchantCard.country}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={this.state.province}
            onChangeText={text => {
              if (addressCheck(text)) {
                if (text?.length > 30) {
                  this.setState({ province: text, errors: { ...this.state.errors, province: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ province: text, errors: { ...this.state.errors, province: '' } });
                }
              } else if (text?.length < 2) {
                this.setState({ province: '', errors: { ...this.state.errors, province: alertMessages.provinceIsMandatory } });
              }
            }}
            onBlur={() => {
              if (this.state.province?.length < 2) {
                this.setState({ errors: { ...this.state.errors, province: alertMessages.provinceIsMandatory } });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.province?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.province}</Text>)}
                </>
              );
            }}
            placeholder={placeholderAndLabels.enterProvince}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            text={merchantCard.province}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={this.state.city}
            placeholder={placeholderAndLabels.enterCity}
            onChangeText={text => {
              if (addressCheck(text)) {
                if (text?.length > 20) {
                  this.setState({ city: text, errors: { ...this.state.errors, city: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ city: text, errors: { ...this.state.errors, city: '' } });
                }
              } else if (text?.length < 2) {
                this.setState({ ...this.state, city: '', errors: { ...this.state.errors, city: alertMessages.cityIsMandatory } });
              }
            }}
            onBlur={() => {
              if (this.state.city?.length < 2) {
                this.setState({
                  ...this.state,
                  errors: { ...this.state.errors, city: alertMessages.cityIsMandatory }
                });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.city?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.city}</Text>)}
                </>
              );
            }}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            text={merchantCard.city}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={this.state.streetAdd}
            placeholder={placeholderAndLabels.enterStreet}
            onChangeText={text => {
              if (addressCheck1(text)) {
                if (text?.length > 40) {
                  this.setState({ streetAdd: text, errors: { ...this.state.errors, streetAdd: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ streetAdd: text, errors: { ...this.state.errors, streetAdd: '' } });
                }
              } else if (text?.length < 2) {
                this.setState({
                  ...this.state,
                  streetAdd: '',
                  errors: { ...this.state.errors, streetAdd: alertMessages.streetAddressIsMandatory }
                });
              }
            }}
            onBlur={() => {
              if (this.state.streetAdd?.length < 2) {
                this.setState({
                  ...this.state,
                  errors: { ...this.state.errors, streetAdd: alertMessages.streetAddressIsMandatory }
                });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.streetAdd?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.streetAdd}</Text>)}
                </>
              );
            }}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            text={placeholderAndLabels.streetAddress}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            keyboardType="number-pad"
            value={this.state.postCode}
            placeholder={placeholderAndLabels.enterPostcode}
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                if (text?.length > 10) {
                  this.setState({ postCode: text, errors: { ...this.state.errors, postCode: alertMessages.inputlimitexceed } });
                } else {
                  this.setState({ postCode: text, errors: { ...this.state.errors, postCode: '' } });
                }
              } else if (text?.length < 2) {
                this.setState({ ...this.state, postCode: '', errors: { ...this.state.errors, postCode: alertMessages.postcodeIsMandatory } });
              }
            }}
            onBlur={() => {
              if (this.state.postCode?.length < 2) {
                this.setState({ ...this.state, errors: { postCode: alertMessages.postcodeIsMandatory } });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.postCode?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.postCode}</Text>)}
                </>
              );
            }}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            text={merchantCard.postcode}
          />

          <CardViewVirtualPhy
            dropDownView={true}
            ViewStyle={{ paddingVertical: 10 }}
            onPressTxt={() => this.addCountryCodeFn()}
            textRight={'+' + this.state.countryCode}
            rightTxtStyle={{ color: ThemeManager.colors.txtNew1 }}
            rightImg={Images.rightArrowNew}
            text={merchantCard.countryCode}
          />

          <CardViewVirtualPhy
            showSendCode={true}
            ViewStyle={{ paddingVertical: 8 }}
            onPressCountryCode={() => { this.setState({ showModalCodeCountry: true }) }}
            multiline={true}
            keyboardType="number-pad"
            phoneCodeView={{ borderColor: ThemeManager.colors.txtNew1 }}
            phoneCodetxtStyle={{ color: ThemeManager.colors.txtNew1 }}
            value={this.state.phoneNo}
            placeholder={merchantCard.number}
            onChangeText={text => {
              if (timeintervPhone) {
                clearInterval(timeintervPhone);
              }
              this.setState({ disablePhoneOTP: false });
              this.setState({ phoneOTPStatus: 'verify', phoneCode: '', phoneButton: walletMain.send });
              if (phoneNoCheck(text)) {
                if (text?.length > 13 || text?.length < 7) {
                  this.setState({
                    phoneNo: text,
                    errors: { ...this.state.errors, phoneNo: alertMessages.minMAxPhoneLenght }
                  });
                } else {
                  this.setState({
                    phoneNo: text,
                    errors: { ...this.state.errors, phoneNo: '' },
                  });
                }
              } else if (text?.length < 2) {
                this.setState({ phoneNo: '' });
              }
            }}
            onBlur={() => {
              if (this.state.phoneNo?.length < 2) {
                this.setState({ errors: { ...this.state.errors, phoneNo: alertMessages.phoneNumberismandatory } });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.phoneNo?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.phoneNo}</Text>)}
                </>
              );
            }}
            endButton={() => {
              return (
                <>
                  {
                    this.state.phoneNo?.length != 0 && this.state.errors.phoneNo?.length == 0 && (
                      <Pressable
                        disabled={this.state.phoneNo?.length == 0 || this.state.errors.phoneNo?.length != 0 || this.state.disablePhoneOTP}
                        onPress={() => this.onPhoneCodeSend()}>
                        <Text style={[styles.sendCodeStyle, { color: this.state.phoneNo?.length == 0 || this.state.errors.phoneNo?.length !== 0 || this.state.disablePhoneOTP ? ThemeManager.colors.txtNew1 : ThemeManager.colors.darkMode }]}>{this.state.phoneButton} {merchantCard.code}</Text>
                      </Pressable>
                    )
                  }
                </>
              );
            }}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right', flex: 1, display: 'flex' }}
            rightImg={Images.rightArrowNew}
            text={placeholderAndLabels.phoneNumber}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            editable={this.state.phoneOTPStatus == 'verify' ? true : false}
            keyboardType="number-pad"
            value={this.state.phoneCode}
            placeholder={placeholderAndLabels.enterCode}
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                this.setState({
                  phoneCode: text,
                  errors: { ...this.state.errors, phoneCode: '' },
                });
              } else if (text?.length < 2) {
                this.setState({
                  ...this.state,
                  phoneCode: '',
                  errors: { ...this.state.errors, phoneCode: alertMessages.otpIsMandatory }
                });
              }
            }}
            onBlur={() => {
              if (this.state.phoneCode?.length < 2) {
                this.setState({
                  ...this.state,
                  errors: { ...this.state.errors, phoneCode: alertMessages.otpIsMandatory }
                });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.phoneCode?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.phoneCode}</Text>)}
                </>
              );
            }}
            disableRight={this.state.phoneCode?.length != 6 || this.state.phoneNo?.length == 0 || this.state.errors.phoneNo?.length != 0}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right', minHeight: this.state.language == 'en' ? 0 : 75 }}
            maxLength={6}
            rightImg={Images.rightArrowNew}
            text={merchantCard.SMSCode}
            onPressRight={() => this.codeVerify('mobile')}
            OTPstatus={this.state.phoneOTPStatus}
          />

          <CardViewVirtualPhy
            showSendCode={true}
            ViewStyle={{ paddingVertical: 8 }}
            value={this.state.email}
            multiline={true}
            placeholder={placeholderAndLabels.email}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            textStyle11={{ width: '45%', textAlign: 'left' }}
            text={placeholderAndLabels.email}
            onChangeText={text => {
              if (timeintervalEmail) {
                clearInterval(timeintervalEmail);
              }
              this.setState({ disableEmailOTP: false });
              this.setState({ emailOTPStatus: 'verify', emailCode: '', emailButton: walletMain.send });
              if (email(text)) {
                if (emailCheck(text)) {
                  this.setState({
                    email: text,
                    errors: { ...this.state.errors, email: '' },
                  });
                } else {
                  this.setState({
                    email: text,
                    errors: { ...this.state.errors, email: alertMessages.pleaseEnterValidEmailAddress }
                  });
                }
              } else if (text?.length < 2) {
                this.setState({ email: '' });
              }
            }}
            onBlur={() => {
              if (this.state.email?.length < 2) {
                this.setState({
                  ...this.state,
                  errors: { ...this.state.errors, email: alertMessages.emailIsMandatory }
                });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.email?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.email}</Text>)}
                </>
              );
            }}
            endButton={() => {
              return (
                <>
                  {this.state.email?.length != 0 && this.state.errors.email?.length == 0 && (
                    <TouchableOpacity
                      disabled={this.state.email?.length == 0 || this.state.errors.email?.length != 0 || this.state.disableEmailOTP}
                      onPress={() => this.onEmailCodeSend()}>
                      <Text style={[styles.sendCodeStyle, { color: this.state.email?.length == 0 || this.state.errors.email?.length !== 0 || this.state.disableEmailOTP ? ThemeManager.colors.txtNew1 : ThemeManager.colors.darkMode }]}>{this.state.emailButton} {merchantCard.code}</Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            editable={this.state.emailOTPStatus == 'verify' ? true : false}
            keyboardType="number-pad"
            hideBottom={true}
            value={this.state.emailCode}
            placeholder={placeholderAndLabels.enterCode}
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                this.setState({
                  emailCode: text,
                  errors: { ...this.state.errors, emailCode: '' },
                });
              } else if (text?.length < 2) {
                this.setState({
                  emailCode: '',
                  errors: { ...this.state.errors, emailCode: alertMessages.otpIsMandatory }
                });
              }
            }}
            onBlur={() => {
              if (this.state.emailCode?.length < 2) {
                this.setState({ ...this.state, errors: { ...this.state.errors, emailCode: alertMessages.otpIsMandatory } });
              } else if (this.state.emailCode?.length != 6) {
                this.setState({ errors: { ...this.state.errors, emailCode: alertMessages.PleaseentervalidOTP } });
              }
            }}
            bottomText={() => {
              return (
                <>
                  {this.state.errors.emailCode?.length > 0 && (<Text style={styles.errorText}>{this.state.errors.emailCode}</Text>)}
                </>
              );
            }}
            disableRight={this.state.emailCode?.length != 6 || this.state.email?.length == 0 || this.state.errors.email?.length != 0}
            placeholderTextColor={ThemeManager.colors.txtNew1}
            inputStyle={{ color: ThemeManager.colors.txtNew1, textAlign: 'right', minHeight: this.state.language == 'en' ? 0 : 75 }}
            rightImg={Images.rightArrowNew}
            textStyle11={{ width: '45%', textAlign: 'left' }}
            text={merchantCard.emailCode}
            maxLength={6}
            onPressRight={() => this.codeVerify('email')}
            OTPstatus={this.state.emailOTPStatus}
          />
        </View>
      </>
    );
  }

  /******************************************************************************************/
  stepThree() {
    const { merchantCard, alertMessages } = LanguageManager;
    return (
      <View>
        <View style={[styles.ViewStyle2]}>
          <Text style={[styles.ViewStyle3, , { color: ThemeManager.colors.newTitle }]}>{merchantCard.amountToBePaid}</Text>

          <View style={styles.ViewStyle1}>
            <Text style={[styles.textStyle7, { color: ThemeManager.colors.Text }]}>{this.state.fees.toFixed(2)}{' '}
            </Text>
            <Text style={[styles.textStyle6, { color: ThemeManager.colors.subTitle1 }]}>{this.state.coin_data?.coin_symbol?.toUpperCase()}</Text>
          </View>

          <Text style={[styles.textStyle5, { color: ThemeManager.colors.subTitle1 }]}>{merchantCard.pleasePayTheAccountOpeningFee}</Text>

          <View style={[{ borderRadius: 20, marginTop: 40, backgroundColor: ThemeManager.colors.searchBg }]}>
            <CardViewoption
              hideBottom={true}
              disabled
              paddingBottom={5}
              customTypeTextStyle={styles.textStyle3}
              customTextStyle={[styles.textStyle2, { color: ThemeManager.colors.subTitle1 }]}
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
              customTypeTextStyle={styles.textStyle4}
              customTextStyle={[styles.textStyle2, { color: ThemeManager.colors.subTitle1 }]}
              hideBottom={true}
              onPress={() => { }}
              text={merchantCard.paymentCurrency}
              themeSelected={this.state.themeSelected}
            />

            <CardViewoption
              marginTop={-10}
              disabled
              customTypeTextStyle={styles.textStyle3}
              customTextStyle={[styles.textStyle2, { color: ThemeManager.colors.subTitle1 }]}
              typeText={`${this.state.fees.toFixed(2)} ${this.state.coin_data?.coin_symbol?.toUpperCase()}`}
              hideBottom={true}
              onPress={() => { }}
              text={merchantCard.estimatedPaymentAmount}
              themeSelected={this.state.themeSelected}
            />
          </View>

          <Text style={[styles.textStyle, { color: ThemeManager.colors.inActiveTabText }]}>{merchantCard.walletAddress}</Text>

          <View style={{ marginTop: 12 }}>
            <InputCustomWithQrButton
              editable={false}
              placeHolder={this.state.address}
              placeholderTextColor={ThemeManager.colors.txtColor}
              showQrCode={() => { this.setState({ showQr: true }) }}
              notScan={true}
              isCopy={true}
              doCopy={() => { this.set_Text_Into_Clipboard(); Keyboard.dismiss(); this.toast.show(alertMessages.copied); }}
              image={Images.showQr}
              customIcon={Images.sendOutlined}
              customIconPress={() => {
                console.log('coin_data:::', this.state.coin_data);
                if (this.state.coin_data?.hasOwnProperty('coin_symbol')) {
                  Actions.SendTrx({ cardId: this.props.physicalCardData?.card_id, selectedCoin: this.state.coin_data, themeSelected: 2, from: 'Card', fee: this.state.fees, address: this.state.address, currency: this.getCurrencySymbol(this.state.currency) });
                } else {
                  console.log('else::::');
                  this.setState({ alertTxt: alertMessages.PleaseactivateTronUSDT, showAlertDialog: true, showSuccess: false });
                }
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  /********************************************************************************************/
  render() {
    const { merchantCard } = LanguageManager;
    const GenderList = [merchantCard.male, merchantCard.female];
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header
          backCallBack={() => { Actions.pop() }}
          BackButtonText={merchantCard.applyforTriskelCard}
          bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
        />

        <View style={{ paddingHorizontal: 20 }}>
          {/* *****************************progress View************************* */}
          <CustomInprogress
            showOnlyTwoProg
            showprogTwo={this.state.progCountTwo}
            showprogThree={this.state.progCountThree}
            progOneTxt={'1'}
            progTwoTxt={'2'}
            progThreeTxt={'3'}
            txtThreeStyle={{ color: this.state.progCountThree ? ThemeManager.colors.text_Color : ThemeManager.colors.lightText }}
            progressView={{ backgroundColor: ThemeManager.colors.activeTab, borderColor: ThemeManager.colors.settingBg }}
            progressViewEmpty={{ backgroundColor: 'transparent', borderColor: ThemeManager.colors.settingBg }}
            horizontalLine={{ backgroundColor: ThemeManager.colors.horizontalLine }}
            progTxt={{ color: ThemeManager.colors.pieInnerColor }}
            firstCont={merchantCard.ApplicationInformation}
            firstCountStyle={{ marginTop: -5 }}
            secCont={merchantCard.fee}
            txtTwoStyle={{ right: -38, marginTop: -5 }}
          />
        </View>

        {/* *****************************Data View************************* */}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS == 'ios' ? false : true}
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          extraScrollHeight={Platform.OS == 'ios' ? 50 : 50}
          contentContainerStyle={{ paddingBottom: 0 }}>
          <View style={{ paddingBottom: 20 }}>
            {this.state.progThree == true ? this.stepThree() : this.stepOne()}
          </View>
        </KeyboardAwareScrollView>

        {/* ************************Button View****************************** */}
        <View style={{ marginHorizontal: 23 }}>
          <Button
            disabled={this.state.progThree ? this.state.disableDone : false}
            onPress={this.state.progThree ? () => { this.setState({ progTwo: false, progCountTwo: false, progThree: false, progCountThree: false, showCongrats: true }) } : () => { this.checkValidations() }}
            buttontext={this.state.progThree ? merchantCard.done : merchantCard.submit}
          />
        </View>

        {/* ********************************************************Country Modal******************************************************* */}
        <ModalCountryList
          clearSearch={true}
          showCountry={true}
          openModel={this.state.showModalCountry}
          countryList={this.state.countryList}
          onPressIn={() => this.setState({ showModalCountry: false })}
          onpressItem={item => {
            console.log('item:::', item);
            this.setState({ country: item.english, unique_id: item.unique_id, countryCode: item.mobile_area_code, showModalCountry: false });
          }}
          onClearSearch={() => { this.setState({ countryList: this.state.fullCountryList }) }}
          searchCountry={text => {
            if (text?.length == 0) {
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
          countryCode={true}
          showCountry={true}
          openModel={this.state.showModalCodeCountry}
          countryList={this.state.countryList}
          onPressIn={() => this.setState({ showModalCodeCountry: false })}
          onpressItem={item => {
            console.log('item:::', item);
            this.setState({ unique_id: item.unique_id, countryCode: item.mobile_area_code, showModalCodeCountry: false });
          }}
          onClearSearch={() => { this.setState({ countryList: this.state.fullCountryList }) }}
          searchCountry={text => {
            if (text?.length == 0) {
              this.setState({ countryList: this.state.fullCountryList });
            } else {
              let list = this.state.fullCountryList.filter(country => country.english.toLowerCase().includes(text.toLowerCase()) || country.mobile_area_code.toString()?.toLowerCase().includes(text.toLowerCase()));
              console.log('list', list);
              this.setState({ countryList: list });
            }
          }}
        />

        {/* /****************************************************************************************** */}
        <ModalCoinList
          title={merchantCard.selectGender}
          contactUs={true}
          list={GenderList}
          openModel={this.state.showModalGender}
          onPressIn={() => this.setState({ showModalGender: false })}
          onPress={async item => { this.setState({ gender: item, showModalGender: false }) }}
        />

        {/* /****************************************************************************************** */}
        <ModalCountryList
          heading={merchantCard.chooseCurrency}
          openModel={this.state.showCurrModal}
          list={currencyList}
          onpressItem={item => this.setState({ currency: item.title, showCurrModal: false })}
          onPressIn={() => { this.setState({ showCurrModal: false }) }}
        />

        {/* ********************************************************successfull Modal******************************************************* */}
        <CustomCongratsModel
          textStyle={[styles.textStyle1, { color: ThemeManager.colors.lightText }]}
          openModel={this.state.showCongrats}
          dismiss={() => { this.dismissModal() }}
          title1={merchantCard.applicationSuccessful}
          title2={merchantCard.oncePaymetConfirmes}
        />

        {/* /****************************************************************************************** */}
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
              <Text style={[styles.QrText, { color: ThemeManager.colors.Text }]}>{merchantCard.scanQRcode}</Text>

              <TouchableOpacity style={{ marginTop: -36 }} onPress={() => { this.setState({ showQr: false }) }}>
                <Image style={{ height: 33, width: 33, alignSelf: 'flex-end' }} source={ThemeManager.ImageIcons.cancel} />
              </TouchableOpacity>

              <View style={styles.ViewStyle}>

              </View>
            </View>
          </View>
        </Modal>

        {/* /****************************************************************************************** */}
        <Toast
          ref={toast => (this.toast = toast)}
          position="bottom"
          positionValue={210}
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />

        {/* /****************************************************************************************** */}
        <LoaderView isLoading={this.state.loading} />

        {/* /****************************************************************************************** */}
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

        {/* /****************************************************************************************** */}
        {this.state.showSuccessAlert && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.hideAlert() }}
          />
        )}
      </View>
    );
  }
}
export default connect(null, {
  sendOtp,
  verifyOTP,
  saveShippingAddress,
  getPhysicalCardFees,
  getCountryCodes,
})(VirtualAndPhysical);
