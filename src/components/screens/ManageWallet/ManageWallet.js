import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native';
import { AppAlert, Button, Header, HeaderMain, InputCustom, LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './ManageWalletStyle';
import { Colors, Images } from '../../../theme';
import { callWeb3Auth, clearStorage, getData, saveData } from '../../../Utils/MethodsUtils';
import * as Constants from '../../../Constants';
import { requestCoinList, requestWalletLogin, logoutUser } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import Singleton from '../../../Singleton';
import { convertPrivateKeyToAddress } from '../../../Utils/EthUtils';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { convertBtcPrivateKeyToAddress } from '../../../Utils/BtcUtils';
import { convertLtcPrivateKeyToAddress } from '../../../Utils/LtcUtils';
import { EventRegister } from 'react-native-event-listeners';
import { store } from '../../../Redux/Reducers';
import { convertTrxPrivateKeyToAddress } from '../../../Utils/TronUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LanguageManager } from '../../../../LanguageManager';
import { ActionConst, Actions } from 'react-native-router-flux';

class ManageWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      multiWalletList: [],
      showAlertDialog: false,
      alertTxt: '',
      showAlertDialogConfirm: false,
      alertTxtConfirm: '',
      selectedItem: '',
      showAlertDialogConfirm1: false,
      alertTxtConfirm1: '',
      selectedIndex: null,
      socialLinks: [],
      showModal: false,
      email: '',
      defaultEmail: '',
      fromAppleLink: false,
      fromMakeDefualt: false,
      themeSelected: ''
    };
  }
  componentDidMount() {
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data })
    });
    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      this.setState({ themeSelected: theme })
    })
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        fromAppleLink: false,
        showModal: false,
        showAlertDialogConfirm1: false,
        alertTxtConfirm1: '',
        showAlertDialogConfirm: false,
        alertTxtConfirm: '',
        showAlertDialog: false,
        alertTxt: '',
      });
    });
    this.fetchWalletList();
  }

  /* *********************************************fetchWalletList***************************************** */
  fetchWalletList() {
    getData(Constants.MULTI_WALLET_LIST).then(list => {
      console.log('chk MULTI_WALLET_LIST:::::', JSON.parse(list));
      this.setState({ multiWalletList: JSON.parse(list) });
    });
  }

  /* *********************************************itemPressed***************************************** */
  itemPressed(loginProvider) {
    if (!global.isConnected) {
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.pleaseCheckYourNetworkConnection,
      });
    } else if (loginProvider == 'email_passwordless')
      return this.setState({ email: '', showModal: true });
    else {
      this.addAccount(loginProvider);
    }
  }

  /* *********************************************deleteWallet***************************************** */
  deleteWallet(item) {
    const { multiWalletList } = this.state;
    console.log('item:::::::delete', item)
    this.setState({
      selectedItem: item,
      showAlertDialogConfirm: true,
      alertTxtConfirm: multiWalletList.length == 1 ? `${LanguageManager.manage.logout}` : LanguageManager.alertMessages.wantToDeleteThisWallet,
    });
  }

  /* *********************************************delete***************************************** */
  delete() {
    const { multiWalletList } = this.state;
    if (multiWalletList.length == 1) {
      this.logout()
    } else {
      this.setState({ showAlertDialogConfirm: false, isLoading: true });
      const arr = this.state.multiWalletList;
      arr.map((item, index) => {
        if (item.userEmail == this.state.selectedItem.userEmail) {
          arr.splice(index, 1);
        }
      });
      this.setState({ multiWalletList: arr, isLoading: false }, () => {
        saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(this.state.multiWalletList));
      });
    }
  }

  /* *********************************************logout***************************************** */
  logout() {
    this.setState({ showAlertDialogConfirm: false, isLoading: true });
    getData(Constants.DEVICE_TOKEN).then(device_token => {
      let data = {
        deviceToken: device_token,
      };
      this.props.logoutUser({ data }).then(res => {
        clearStorage();
        saveData(Constants.DEVICE_TOKEN, data.deviceToken);
        if (Platform.OS == 'android') {
          var ClrStorageModule = NativeModules.EncryptionModule;
          ClrStorageModule.clearApplicationData();
        }
        setTimeout(() => {
          saveData(Constants.DARK_MODE_STATUS, 1);
          ThemeManager.setLanguage('lightMode');
          EventRegister.emit('getThemeChanged', 2);
          LanguageManager.setLanguage('English');
          Singleton.getInstance().userRefCode = '';
          global.isDeepLink = false
          Singleton.getInstance().SelectedLanguage = 'en';
          saveData(Constants.SELECTED_LANGUAGE, 'en')
          EventRegister.emit('theme', Colors.White);
          Actions.currentScene != 'Walkthrough' && Actions.Walkthrough({ type: ActionConst.RESET });
        }, 1200);
        this.setState({ isLoading: false });
      }).catch(err => {
        console.log('chk logotu err::::???????', err);
        this.setState({ isLoading: false });
      });
    });
  }

  /* *********************************************onPressItem***************************************** */
  onPressItem(item, index) {
    if (item.defaultWallet == true) return;
    else {
      if (!global.isConnected) {
        return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.pleaseCheckYourNetworkConnection });
      }
      this.setState({
        selectedIndex: index,
        selectedItem: item,
        showAlertDialogConfirm1: true,
        alertTxtConfirm1: LanguageManager.alertMessages.wantToMakeThisWalletDefault,
      });
    }
  }

  /* *********************************************makeDefault***************************************** */
  makeDefault() {
    this.setState({ isLoading: true, showAlertDialogConfirm1: false });
    const typeOfLogin = this.state.selectedItem.typeOfLogin == 'jwt' ? 'email_passwordless' : this.state.selectedItem.typeOfLogin;
    setTimeout(() => {
      this.restoreAccount(typeOfLogin, this.state.selectedItem.userEmail);
    }, 150);
  }

  /* *********************************************restoreAccount***************************************** */
  restoreAccount(loginProvider, userEmail) {
    Singleton.isCameraOpen = true;
    Singleton.isPermission = true;
    setTimeout(async () => {
      try {
        const state = await callWeb3Auth(loginProvider, userEmail);
        this.setState({ web3AuthRes: state, defaultEmail: userEmail });
        if (state.userInfo?.email) {
          this.checkIsMismatch(state, userEmail);
        } else {
          this.setState({
            fromMakeDefualt: true,
            isLoading: false,
            showModal: true,
            fromAppleLink: true,
            email: '',
          });
        }
      } catch (err) {
        console.log('err:::::', err);
        this.setState({ isLoading: false });
      }
    }, 200);
  }

  /* *********************************************checkIsMismatch***************************************** */
  checkIsMismatch(state, userEmail) {
    const isMismatch = state.userInfo?.email.toLowerCase() != userEmail.toLowerCase();
    if (isMismatch) {
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.emailMismatch,
        isLoading: false,
      });
    } else {
      const arr = this.state.multiWalletList;
      let newArray = [];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        console.log(element, '****');
        const isExist = element.userEmail == this.state.selectedItem.userEmail && element.typeOfLogin?.toLowerCase() == this.state.selectedItem.typeOfLogin?.toLowerCase();
        if (isExist) {
          element['defaultWallet'] = true;
        } else {
          element['defaultWallet'] = false;
        }
        newArray.push(element);
      }
      this.updateLocal(newArray);
    }
  }

  /* *********************************************updateLocal***************************************** */
  updateLocal(newArray) {
    const item = this.state.selectedItem;
    // console.log('chk updateItem:::::', JSON.stringify(newArray));
    let ethAddress = '';
    let btcAdress = '';
    let LtcAddress = '';
    let trxAddress = '';
    item.loginRequest.addressList.map((item, index) => {
      const symbol = item.symbol?.toLowerCase();
      symbol == 'trx' ? (trxAddress = item.address) : symbol == 'btc' ? (btcAdress = item.address) : symbol == 'ltc' ? (LtcAddress = item.address) : (ethAddress = item.address);
    });
    Singleton.getInstance().defaultEthAddress = ethAddress;
    Singleton.getInstance().defaultBnbAddress = ethAddress;
    Singleton.getInstance().defaultMaticAddress = ethAddress;
    Singleton.getInstance().defaultBtcAddress = btcAdress;
    Singleton.getInstance().defaultTrxAddress = trxAddress;
    Singleton.getInstance().defaultLtcAddress = LtcAddress;
    Singleton.getInstance().defaultEmail = item.login_data?.userEmail;
    Singleton.getInstance().refCode = item.login_data?.refCode;
    saveData(Constants.USER_ID, item.login_data.userId);
    saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(newArray));
    saveData(Constants.ACCESS_TOKEN, item.user_jwtToken);
    saveData(Constants.ACTIVE_ADDRESS_LIST, JSON.stringify(item.loginRequest.addressList));
    saveData(Constants.ADDRESS_LIST, JSON.stringify(item.addrsListKeys));
    console.log("CoinsList==3===", item.coinFamilyKeys)

    saveData(Constants.COIN_FAMILY_LIST, JSON.stringify(item.coinFamilyKeys));
    saveData(Constants.LOGIN_DATA, JSON.stringify(item.login_data));
    saveData(Constants.WALLET_NAME, item.walletName);
    saveData(Constants.REFRESH_TOKEN, item.user_refreshToken);
    saveData(Constants.FAVORITE, JSON.stringify([]));
    Singleton.getInstance().walletName = item.walletName;
    Singleton.isFirsLogin = true;
    setTimeout(() => {
      store.dispatch(requestCoinList({})).then(res => { this.setState({ isLoading: false }) }).catch(err => {
        this.setState({ isLoading: false });
      });
      this.setState({ isLoading: false });
    }, 150);
  }

  /* *********************************************emailSubmit***************************************** */
  emailSubmit() {
    const { email, web3AuthRes, fromAppleLink, defaultEmail, fromMakeDefualt } = this.state;
    if (email.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enterEmail });
    } else if (!Constants.EMAIL_REGEX.test(email)) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enterValidEmail });
    } else {
      if (fromAppleLink) {
        this.setState({ showModal: false, isLoading: true });
        setTimeout(() => {
          web3AuthRes.userInfo.email = email?.toLowerCase();
          fromMakeDefualt ? this.checkIsMismatch(web3AuthRes, defaultEmail) : this.createWallet(web3AuthRes)
        }, 100);
      } else {
        this.setState({ showModal: false });
        this.addAccount('email_passwordless', email);
      }
    }
  }

  /* *********************************************getImage***************************************** */
  getImage(item) {
    // console.log('chk item::::::', item)
    if (item.typeOfLogin == 'jwt') {
      return ThemeManager.ImageIcons.mail;
    } else if (item.typeOfLogin == LOGIN_PROVIDER.FACEBOOK) {
      return ThemeManager.ImageIcons.fb;
    } else if (item.typeOfLogin == LOGIN_PROVIDER.APPLE) {
      return ThemeManager.ImageIcons.apple;
    } else if (item.typeOfLogin == LOGIN_PROVIDER.LINKEDIN) {
      return ThemeManager.ImageIcons.linkedIn;
    } else if (item.typeOfLogin == LOGIN_PROVIDER.GOOGLE) {
      return ThemeManager.ImageIcons.google;
    }
  }

  /* *********************************************getEmail***************************************** */
  getEmail(item) {
    if (item.userEmail) {
      const email = item.userEmail.toString().length > 25 ? item.userEmail.substring(0, 25) + '...' : item.userEmail;
      return email;
    } else {
      const name_ = item.web3Res.userInfo?.name;
      const email = name_ ? name_.toString().length > 25 ? name_.substring(0, 25) + '...' : name_ : 'Basic';
      return email;
    }
  }

  /* ************************************************************************************** */
  render() {
    const { merchantCard, placeholderAndLabels, pins, manage, addressBook } = LanguageManager;
    const { multiWalletList } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <HeaderMain
          BackButtonText={manage.manageAccount}

        />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}>
          {/* -------------------------------------------------------- */}
          <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.searchBg }]}>
            <Image style={styles.imgStyle} source={ThemeManager.ImageIcons.walletManage} />
            {multiWalletList.map((item, index) => {
              return (
                <View key={index + ''}>
                  {item.defaultWallet == true && (<Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText }]}>{manage.defaultAccount}</Text>)}
                  <View style={styles.ViewStyle11}>
                    <TouchableOpacity onPress={() => this.onPressItem(item, index)} style={styles.ViewStyle12}>
                      <Image style={[styles.imgStyle11, { borderRadius: 15, }]} source={this.getImage(item)} />
                      <Text numberOfLines={1} allowFontScaling={false} style={{ ...styles.textStyle1, width: '85%', color: ThemeManager.colors.Text }}>{this.getEmail(item)}</Text>
                    </TouchableOpacity>

                    <View style={{ width: '15%', alignItems: 'flex-end' }}>
                      {(item.defaultWallet == true && multiWalletList.length > 1) ? (
                        <View style={[styles.imgView]}>
                          <Image style={styles.imgStyle1} source={Images.completed} />
                        </View>
                      ) : (
                        <TouchableOpacity style={[styles.touchableStyle]} onPress={() => this.deleteWallet(item)}>
                          <Image source={Images.bin} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          {/* -------------------------------------------------------- */}
          {multiWalletList.length < 11 && (
            <View style={{ marginBottom: 25 }}>
              <Text allowFontScaling={false} style={{ ...styles.textStyle11, color: ThemeManager.colors.light_Txt }}>{manage.addAccountUsing}</Text>
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
                      onPress={() => this.itemPressed(item.title)}
                      key={index + ''}
                      style={[styles.touchableStyle2, { borderRadius: this.state.themeSelected == 2 ? 0 : 8 }]}>
                      <Image source={item.socialImage} />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
        {/* *********************************************Modal***************************************** */}
        <Modal
          statusBarTranslucent
          animationType="fade"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}>
          <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
            <KeyboardAwareScrollView enableOnAndroid keyboardShouldPersistTaps={'always'} style={{ flex: 1 }}>
              <View style={{ minHeight: Dimensions.get('screen').height / 1.1, backgroundColor: ThemeManager.colors.Mainbg }}>
                <View style={{ flex: 1 }}>
                  <Header
                    imgStyle={true}
                    backCallBack={() => this.setState({ showModal: false })}
                    bgColor={{ backgroundColor: ThemeManager.colors.Mainbg }}
                    BackButtonText={''}
                  />
                  <Image style={styles.appLogo} source={ThemeManager.ImageIcons.appLogo} />
                  <Text allowFontScaling={false} style={[styles.txtBold, { fontSize: 25, color: ThemeManager.colors.whiteText }]}>{pins.loginToTriskelWallet}</Text>

                  <Text allowFontScaling={false} style={[styles.txtStyle, { fontSize: 15, color: ThemeManager.colors.lightText }]}>{pins.youNeedToEnterTheEmailToAccessTheAccount}</Text>

                  <View style={{ paddingHorizontal: 23, flex: 0.6, justifyContent: 'center' }}>
                    <InputCustom
                      label={placeholderAndLabels.email}
                      value={this.state.email}
                      placeHolder={placeholderAndLabels.enterEmail}
                      placeholderColor={Colors.placeholderColor}
                      keyboardType="email-address"
                      placeholderTextColor={ThemeManager.colors.lightWhiteText}
                      onChangeText={text => this.setState({ email: text })}
                    />
                  </View>
                </View>

                <View style={{ paddingHorizontal: 20, marginTop: 60 }}>
                  <Button
                    style={{ width: '80%' }}
                    buttontext={merchantCard.submit}
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

        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
          />
        )}

        {this.state.showAlertDialogConfirm && (
          <ConfirmAlert
            text={addressBook.yes}
            alertTxt={this.state.alertTxtConfirm}
            hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }) }}
            ConfirmAlertDialog={() => { this.delete() }}
          />
        )}

        {this.state.showAlertDialogConfirm1 && (
          <ConfirmAlert
            text={addressBook.yes}
            alertTxt={this.state.alertTxtConfirm1}
            hideAlertDialog={() => { this.setState({ showAlertDialogConfirm1: false }) }}
            ConfirmAlertDialog={() => { this.makeDefault() }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />
      </View>
    );
  }

  /* *********************************************addAccount***************************************** */
  addAccount(loginProvider, login_hint = '') {
    this.setState({ isLoading: true });
    setTimeout(async () => {
      Singleton.isCameraOpen = true;
      Singleton.isPermission = true;
      try {
        const state = await callWeb3Auth(loginProvider, login_hint);
        if (state) {
          if (state.userInfo?.email) {
            this.createWallet(state);
          } else {
            this.setState({
              fromMakeDefualt: false,
              isLoading: false,
              showModal: true,
              fromAppleLink: true,
              web3AuthRes: state,
              email: '',
            });
          }
        } else {
          this.setState({ isLoading: false, showAlertDialog: true, alertTxt: LanguageManager.alertMessages.somethingWentWrong });
        }
      } catch (error) {
        console.log('chk error web3Auth:::::', error);
        this.setState({ isLoading: false });
      }
    }, 200);
  }

  /* *********************************************createWallet***************************************** */
  async createWallet(state) {
    const isEmailExist = this.state.multiWalletList.find(item => item.userEmail.toLowerCase() == state.userInfo?.email.toLowerCase() && item.typeOfLogin.toLowerCase() == state.userInfo?.typeOfLogin.toLowerCase());
    if (isEmailExist) {
      return this.setState({
        isLoading: false,
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.walletAlreadyExists,
      });
    }
    const PrivKey = `0x${state.privKey}`;
    const WalletData = convertPrivateKeyToAddress(PrivKey);
    const bitcoinData = convertBtcPrivateKeyToAddress(PrivKey);
    const litcoinData = convertLtcPrivateKeyToAddress(PrivKey);
    const trxData = convertTrxPrivateKeyToAddress(state.privKey);
    const addrsListKeys = [WalletData.eth_address,
    WalletData.eth_address,
    WalletData.eth_address,
    bitcoinData.btc_address,
    trxData.trx_address
    ];
    // const coinFamilyKeys = [1, 2, 6];
    const coinFamilyKeys = [1, 2, 3, 6];

    const data = {
      device_id: Singleton.getInstance().unique_id,
      login_type: state.userInfo?.typeOfLogin,
      social_id: state.sessionId,
      email: state.userInfo?.email,
      wallet_address: WalletData.eth_address,
      device_token: await getData(Constants.DEVICE_TOKEN) || 'abc',
      wallet_name: state.userInfo?.name || 'Basic',
      addressList: [
        { symbol: 'bnb', address: WalletData.eth_address, coin_family: 1 },
        { symbol: 'eth', address: WalletData.eth_address, coin_family: 2 },
        // { symbol: 'matic', address: WalletData.eth_address, coin_family: 4 },
        { symbol: 'btc', address: bitcoinData.btc_address, coin_family: 3 },
        { symbol: 'trx', address: trxData.trx_address, coin_family: 6 },
      ],
    };
    this.props.requestWalletLogin({ data }).then(res2 => {
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
      const Wallet_Array = {
        walletName: state.userInfo?.name || 'Basic',
        loginRequest: data,
        defaultWallet: false,
        user_jwtToken: res2.data?.token,
        user_refreshToken: res2.data?.token,
        userEmail: state.userInfo?.email,
        typeOfLogin: state.userInfo?.typeOfLogin,
        addrsListKeys: addrsListKeys,
        coinFamilyKeys: coinFamilyKeys,
        login_data: login_data,
        web3Res: state,
      };
      let MultiWalletArray = [];
      getData(Constants.MULTI_WALLET_LIST).then(multiWalletArray => {
        MultiWalletArray = JSON.parse(multiWalletArray);
        MultiWalletArray?.push(Wallet_Array);
        saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(MultiWalletArray));
        setTimeout(() => {
          this.fetchWalletList();
          this.setState({ isLoading: false });
        }, 150);
      });
    }).catch(e => {
      this.setState({ isLoading: false });
      this.setState({ showAlertDialog: true, alertTxt: e });
    });
  }
}
export default connect(null, { requestWalletLogin, requestCoinList, logoutUser })(ManageWallet);
