import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  BackHandler,
  Image,
  FlatList,
  ScrollView,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Colors, Images } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import walkthroughStyle from './WalkthroughStyle';
import { callWeb3Auth, getData, saveData } from '../../../Utils/MethodsUtils';
import Lottie from 'lottie-react-native';
import { AppAlert, Button, Header, InputCustom, LoaderView } from '../../common';
import { convertPrivateKeyToAddress } from '../../../Utils/EthUtils';
import { convertBtcPrivateKeyToAddress } from '../../../Utils/BtcUtils';
import { convertLtcPrivateKeyToAddress } from '../../../Utils/LtcUtils';
import Singleton from '../../../Singleton';
import * as Constants from '../../../Constants';
import { requestWalletLogin, getReferralStatus } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import { convertTrxPrivateKeyToAddress } from '../../../Utils/TronUtils';
import ReferralModal from '../../common/ReferralModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LanguageManager } from '../../../../LanguageManager';

const styles = walkthroughStyle(ThemeManager);

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themeSelected: '',
      isLoading: false,
      showAlertDialog: false,
      socialLinks: [],
      showModal: false,
      email: '',
      fromAppleLink: false,
      web3AuthRes: '',
      showReferralModal: false,
      refCode: '',
    };
  }
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: '',
        showModal: false,
        fromAppleLink: false,
      });
    });
    // StatusBar.setTranslucent(true);
    // StatusBar.setBackgroundColor('white');
    // StatusBar.setBarStyle('dark-content');
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data });
    });
    this.props.navigation.addListener('didFocus', event => {
      this.backhandle = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    });
    this.props.navigation.addListener('didBlur', event => {
      if (this.backhandle) this.backhandle.remove();
    });
  }

  //******************************************************************************************/
  componentWillUnmount() {
    if (this.backhandle) this.backhandle.remove();
  }
  //*********************************************handleBackButtonClick***************************************** */ }
  handleBackButtonClick() {
    return true;
  }
  //*********************************************onPressWeb3Auth***************************************** */ }
  onPressWeb3Auth(loginProvider, login_hint = '') {
    this.setState({ isLoading: true });
    setTimeout(async () => {
      try {
        const state = await callWeb3Auth(loginProvider, login_hint);
        console.log('chk state:::::', state)
        if (state) {
          if (state.userInfo?.email) {
            this.createWallet(state);
          } else {
            this.setState({
              isLoading: false,
              showModal: true,
              fromAppleLink: true,
              web3AuthRes: state,
              email: '',
            });
          }
        } else {
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt: LanguageManager.alertMessages.somethingWentWrong,
          });
        }
      } catch (error) {
        console.log('chk error web3Auth:::::', error);
        this.setState({ isLoading: false });
      }
    }, 200);
  }

  //*********************************************createWallet***************************************** */ }
  async createWallet(state) {
    this.setState({ web3AuthRes: state });
    const PrivKey = `0x${state.privKey}`;
    const WalletData = convertPrivateKeyToAddress(PrivKey);
    // const refStatus = await this.getRefStatus(WalletData.eth_address);
    // console.log('chk ref::::::status::::::', refStatus)
    // if (refStatus.message == 1) {
    //   this.setState({ isLoading: false, showReferralModal: true, refCode: '' })
    // } else {
    this.hitCreateApi(state);
    // }
  }

  //*********************************************hitCreateApi***************************************** */ }
  async hitCreateApi(state) {
    const PrivKey = `0x${state.privKey}`;
    const WalletData = convertPrivateKeyToAddress(PrivKey);
    const bitcoinData = convertBtcPrivateKeyToAddress(PrivKey);
    const trxData = convertTrxPrivateKeyToAddress(state.privKey);
    const litcoinData = convertLtcPrivateKeyToAddress(PrivKey);
    //  console.log('chk trxData:::::', trxData);
    console.log('chk state:::::', state);
    const data = {
      device_id: Singleton.getInstance().unique_id,
      login_type: state.userInfo?.typeOfLogin,
      social_id: state.sessionId,
      email: state.userInfo?.email,
      wallet_address: WalletData.eth_address,
      device_token: (await getData(Constants.DEVICE_TOKEN)) || 'abc',
      wallet_name: state.userInfo?.name || 'Basic',
      referral_code: this.state.refCode,
      addressList: [
        { symbol: 'bnb', address: WalletData.eth_address, coin_family: 1 },
        { symbol: 'eth', address: WalletData.eth_address, coin_family: 2 },
        // { symbol: 'matic', address: WalletData.eth_address, coin_family: 4 },
        { symbol: 'btc', address: bitcoinData.btc_address, coin_family: 3 },
        { symbol: 'trx', address: trxData.trx_address, coin_family: 6 },
      ],
    };
    const addrsListKeys = [
      WalletData.eth_address,
      WalletData.eth_address,
      // WalletData.eth_address,
      bitcoinData.btc_address,
      trxData.trx_address,
    ];
    // const coinFamilyKeys = [1, 2, 6];
    const coinFamilyKeys = [1, 2, 3, 6];

    this.props.requestWalletLogin({ data }).then(async res2 => {
      Singleton.getInstance().defaultEthAddress = WalletData.eth_address;
      Singleton.getInstance().defaultBnbAddress = WalletData.eth_address;
      // Singleton.getInstance().defaultMaticAddress = WalletData.eth_address;
      Singleton.getInstance().defaultBtcAddress = bitcoinData.btc_address;
      Singleton.getInstance().defaultTrxAddress = trxData.trx_address;
      // Singleton.getInstance().defaultLtcAddress = litcoinData.ltc_address;
      Singleton.getInstance().defaultEmail = state.userInfo?.email;
      Singleton.getInstance().refCode = res2.data?.referral_code;


      let linkProperties = {
        feature: 'share',
        channel: 'facebook',
      };
      let controlParams = {
        $fallback_url: res2.data?.referral_code,
      };

      const login_data = {
        access_token: res2.data.token,
        defaultEthAddress: WalletData.eth_address,
        defaultBtcAddress: bitcoinData.btc_address,
        defaultTrxAddress: trxData.trx_address,
        defaultBnbAddress: WalletData.eth_address,
        // defaultLtcAddress: litcoinData.ltc_address,
        // defaultMaticAddress: WalletData.eth_address,
        walletName: state.userInfo?.name || 'Basic',
        userId: res2.data.userId,
        userEmail: state.userInfo?.email,
        refCode: res2.data?.referral_code,
      };
      const Wallet_Array = [
        {
          walletName: state.userInfo?.name || 'Basic',
          loginRequest: data,
          defaultWallet: true,
          user_jwtToken: res2.data?.token,
          user_refreshToken: res2.data?.token,
          userEmail: state.userInfo?.email,
          typeOfLogin: state.userInfo?.typeOfLogin,
          addrsListKeys: addrsListKeys,
          coinFamilyKeys: coinFamilyKeys,
          login_data: login_data,
          web3Res: state,
        },
      ];
      saveData(Constants.USER_ID, res2.data.userId);
      saveData(Constants.USER_ID, res2.data.userId);
      saveData(Constants.LOGIN_TYPE, state.userInfo?.typeOfLogin);
      saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(Wallet_Array));
      saveData(Constants.ACCESS_TOKEN, res2.data.token);
      saveData(Constants.SELECTED_CURRENCY, 'USD');
      saveData(Constants.SELECTED_LANGUAGE, 'en');
      saveData(Constants.SELECTED_SYMBOL, '$');
      saveData(Constants.ACTIVE_ADDRESS_LIST, JSON.stringify(data.addressList));
      saveData(Constants.ADDRESS_LIST, JSON.stringify(addrsListKeys));
      saveData(Constants.COIN_FAMILY_LIST, JSON.stringify(coinFamilyKeys));
      saveData(Constants.LOGIN_DATA, JSON.stringify(login_data));
      saveData(Constants.WALLET_NAME, state.userInfo?.name || 'Basic');
      saveData(Constants.REFRESH_TOKEN, res2.data.refreshToken);
      saveData(Constants.DARK_MODE_STATUS, '1');
      Singleton.getInstance().walletName = state.userInfo?.name || 'Basic';
      Singleton.isFirsLogin = true;
      Actions.currentScene != 'CreatePin' && Actions.CreatePin({ title: 'Create', subtitle: 'create' });
      this.setState({ isLoading: false, fromAppleLink: false });
    })
      .catch(e => {
        this.setState({ isLoading: false });
        this.setState({ showAlertDialog: true, alertTxt: e });
      });
  }

  //*********************************************getRefStatus***************************************** */ }
  getRefStatus(address) {
    return new Promise((resolve, reject) => {
      const data = {
        device_id: Singleton.getInstance().unique_id,
        wallet_address: address,
      };
      this.props.getReferralStatus({ data }).then(res => {
        console.log('chk getrefstatus:::::', res);
        resolve(res);
      }).catch(err => {
        console.log('chk err refstatus:::::', err);
        resolve(err);
        this.setState({ isLoading: false });
      });
    });
  }

  //*********************************************emailSubmit***************************************** */ }
  emailSubmit() {
    const { email, web3AuthRes, fromAppleLink } = this.state;
    if (email.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enterEmail });
    } else if (!Constants.EMAIL_REGEX.test(email)) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enterValidEmail });
    } else {
      if (fromAppleLink) {
        this.setState({ showModal: false, isLoading: true });
        setTimeout(() => {
          web3AuthRes.userInfo.email = email;
          console.log('ctateDatattatatata:::::::', web3AuthRes);
          this.createWallet(web3AuthRes);
        }, 100);
      } else {
        this.setState({ showModal: false });
        this.onPressWeb3Auth('email_passwordless', email);
      }
    }
  }

  //*********************************************confirmRef***************************************** */ }
  confirmRef() {
    const { refCode, web3AuthRes } = this.state;
    console.log('chk refCode:::::', refCode?.trim().length)
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
    }
    else {
      this.setState({ showReferralModal: false, isLoading: true }, () => {
        this.hitCreateApi(web3AuthRes);
      });
    }
  }

  //*********************************************onPressItem***************************************** */ }
  onPressItem(loginProvider) {
    if (!global.isConnected) {
      return this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.pleaseCheckYourNetworkConnection,
      });
    }
    if (loginProvider == 'email_passwordless')
      return this.setState({ email: '', showModal: true });
    else {
      this.onPressWeb3Auth(loginProvider);
    }
  }

  //******************************************************************************************/
  render() {
    const { themeSelected } = this.state;
    return (
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <ImageBackground style={styles.imgBg} resizeMode="cover">
          <View style={styles.ViewStyle1}>
            <Lottie source={Images.triskelAnim} autoPlay loop />
          </View>
          <View style={{ marginTop: 23 }}>
            <Text allowFontScaling={false} style={[styles.txtBold, { color: ThemeManager.colors.whiteText }]}>{LanguageManager.walletMain.welcometoTriskelWallet}</Text>
            <Text allowFontScaling={false} style={[styles.txtStyle, { color: this.state.themeSelected == 2 ? ThemeManager.colors.lightText : ThemeManager.colors.text_color }]}>{LanguageManager.walletMain.decentralizedEcosystem}</Text>
          </View>
          <View style={{ marginTop: 23, marginHorizontal: 40 }}>
            <View style={styles.ViewStyle}>
              <Text allowFontScaling={false} style={{ ...styles.textStyle11, color: ThemeManager.colors.light_Txt }}>{LanguageManager.walletMain.AccessUsingWeb3Auth}</Text>
              <FlatList
                bounces={false}
                contentContainerStyle={styles.contentContainerStyle}
                numColumns={3}
                data={this.state.socialLinks}
                keyExtractor={(item, index) => index + ''}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => this.onPressItem(item.title)}
                      key={index + ''}
                      style={styles.touchableStyle2}>
                      <Image source={item.socialImage} />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </ImageBackground>

        {/* *********************************************ReferralModal***************************************** */}
        <ReferralModal
          showReferralModal={this.state.showReferralModal}
          onPressSkip={() => this.setState({ isLoading: true, showReferralModal: false, refCode: '' }, () => this.hitCreateApi(this.state.web3AuthRes))}
          handleBack={() => this.setState({ showReferralModal: false, refCode: '' })}
          onChangeText={text => this.setState({ refCode: text.replace(/\s/g, '') })}
          onPress={() => this.confirmRef()}
          value={this.state.refCode}
          Txt={this.state.alertTxt}
          showAlert={this.state.showAlertDialog}
          hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
        />
        {(this.state.showAlertDialog && !this.state.showReferralModal) && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />

        {/* *********************************************Modal***************************************** */}
        <Modal
          statusBarTranslucent
          animationType="fade"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}>
          <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} enableOnAndroid bounces={false} keyboardShouldPersistTaps={'always'} style={{ flex: 1 }}>
              <View style={{ minHeight: Dimensions.get('screen').height / 1.2, backgroundColor: ThemeManager.colors.Mainbg }}>
                <View style={{ flex: 1 }}>
                  <Header
                    imgStyle={true}
                    backCallBack={() => this.setState({ showModal: false })}
                    bgColor={{ backgroundColor: ThemeManager.colors.Mainbg }}
                    BackButtonText={''}
                  />
                  <Image style={styles.appLogo} source={Images.appLogo} />
                  <Text allowFontScaling={false} style={[styles.txtBold, { fontSize: 25, color: ThemeManager.colors.whiteText }]}>{LanguageManager.pins.loginToTriskelWallet}</Text>
                  <Text allowFontScaling={false} style={[styles.txtStyle, { fontSize: 15, color: ThemeManager.colors.lightText }]}>{LanguageManager.pins.youNeedToEnterTheEmailToAccessTheAccount}</Text>
                  <View style={{ paddingHorizontal: 23, flex: 0.6, justifyContent: 'center' }}>
                    <InputCustom
                      label={LanguageManager.placeholderAndLabels.email}
                      value={this.state.email}
                      placeHolder={LanguageManager.alertMessages.enterEmail}
                      placeholderColor={Colors.placeholderColor}
                      keyboardType="email-address"
                      placeholderTextColor={ThemeManager.colors.lightWhiteText}
                      onChangeText={text => this.setState({ email: text })}
                    />
                  </View>
                </View>
                <View style={{ paddingHorizontal: 23 }}>
                  <Button
                    style={{ width: '80%' }}
                    buttontext={LanguageManager.merchantCard.submit}
                    onPress={() => { this.emailSubmit() }}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>

          {this.state.showAlertDialog && (
            <AppAlert
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
            />
          )}
          <LoaderView isLoading={this.state.isLoading} />
        </Modal>
      </ScrollView>
    );
  }
}
export default connect(null, { requestWalletLogin, getReferralStatus })(Walkthrough);
