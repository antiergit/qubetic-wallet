import React, { Component } from 'react';
import {
  View,
  NativeModules,
  StatusBar,
  Platform,
  BackHandler,
  Image, Text, ImageBackground, Dimensions,
  Alert
} from 'react-native';
import styles from './WelcomeStyle';
import { Colors, Images } from '../../../theme/';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import Lottie from 'lottie-react-native';
import JailMonkey from 'jail-monkey';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import { getData, saveData } from '../../../Utils/MethodsUtils';
import DeviceInfo from 'react-native-device-info';
import { AppAlert } from '../../common';
import { requestWalletLogin } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { connect } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';
import LinearGradient from 'react-native-linear-gradient';
import changeNavigationBarColor, { } from 'react-native-navigation-bar-color';
import { store } from '../../../Redux/Reducers';
import { getWalletMakerStatus } from '../../../Utils/CheckerMarkerUtils';
import images from '../../../theme/Images';
import Video, { VideoRef } from 'react-native-video';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // themeSelected: store.getState().walletReducer.cureentTheme,
      themeSelected: 1,
      alertTxt: '',
      showAlertDialog3: false,
      isshow: false
    };
  }

  /******************************************************************************************/
  async componentDidMount() {

    this.focus = this.props.navigation.addListener("didFocus", () => {
      this.backhandle = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      // console;
      getData(Constants.DARK_MODE_STATUS).then(async theme => {


        console.log('chk theme::::status', theme);

        if (theme) {
          console.log("predefined======", theme)

          theme == 1 ? ThemeManager.setLanguage('darkMode') : ThemeManager.setLanguage('lightMode');
          EventRegister.emit('getThemeChanged', theme);
          EventRegister.emit('theme', theme == 1 ? '#0C0C0D' : Colors.White);
          Singleton.getInstance().themeStatus = theme

          saveData(Constants.DARK_MODE_STATUS, theme);
          this.setState({ themeSelected: theme });
          this.navigateApp();
        } else {
          console.log("bydefault======")
          ThemeManager.setLanguage('darkMode');
          Singleton.getInstance().themeStatus = '1'
          EventRegister.emit('getThemeChanged', '1');
          EventRegister.emit('theme', '#0C0C0D');
          saveData(Constants.DARK_MODE_STATUS, 1);
          this.setState({ themeSelected: 1 });
          this.navigateApp();
        }
      })
    });
    // const response = await changeNavigationBarColor('#80b3ff');
    if (ThemeManager.colors.theme == 'light') {
      changeNavigationBarColor('#ffffff');
    } else {
      changeNavigationBarColor('#121117');
    }
    // const response = await changeNavigationBarColor(ThemeManager.colors.mainBgNew);
    // console.log('chk theme::::response', response);

  }

  handleBackButtonClick() {
    return true;
  }

  /******************************************************************************************/
  async navigateApp() {
    if (Platform.OS == 'android') {

      if (await DeviceInfo.isEmulator()) {
        this.moveForward();
        // return this.setState({ alertTxt: 'Your device is rooted. You cannot proceed.', showAlertDialog3: true });
      } else {
        const { rootStatus } = NativeModules.EncryptionModule;
        rootStatus().then(async res => {
          if (res) {
            res == 'It is not rooted device' ? this.moveForward() : this.setState({ alertTxt: 'Your device is rooted. You cannot proceed.', showAlertDialog3: true });
          }
        }).catch(err => {
          console.log('-----------root error--------', err);
        });
      }
    } else {
      this.moveForward();
    }
  }

  /******************************************************************************************/
  moveForward() {
    EventRegister.emit('fromscreen', 'welcome')
    if (JailMonkey.isJailBroken()) {
      this.navigate();
      // return alert('Your device is rooted. You cannot proceed.');
    } else {
      this.navigate();
    }
  }

  /******************************************************************************************/
  navigate() {
    getData(Constants.ACCESS_TOKEN).then(value => {
      getData(Constants.PIN_LOCK).then(pin => {
        if (value && pin) {
          getData(Constants.ACTIVE_ADDRESS_LIST).then(addressList => {
            console.log('addressList:::::', addressList);
            const addressArr = addressList ? JSON.parse(addressList) : []
            const isHavingBnb = addressArr?.find((item) => item?.symbol?.toLowerCase() == 'bnb')
            console.log('isHavingBnb::::::::', isHavingBnb);
            if (addressArr.length > 0) {
              this.moveToApp(value, pin)
            } else {
              this.createWallet(value, pin);
            }
          });
        } else this.moveToApp(value, pin)
      })
    });
    this.createRefLink();
  }

  /******************************************************************************************/
  createRefLink = async () => {

  }
  /******************************************************************************************/
  moveToApp(value, pin, fromCreate = false) {


    if (value && pin) {
      if (fromCreate) {
        // Actions.currentScene != 'Main' && Actions.Main({ type: 'reset' });
        Actions.currentScene != 'EnterPin' && Actions.EnterPin({ from: "welcome" });
      } else {
        setTimeout(() => {
          // Actions.currentScene != 'Main' && Actions.Main({ type: 'reset' });
          Actions.currentScene != 'EnterPin' && Actions.EnterPin({ from: "welcome" });
          EventRegister.emit('fromscreen', '')
        }, 4500);
      }
    } else {
      fromCreate ? Actions.currentScene != 'Onboarding' && Actions.Onboarding({ type: 'reset' }) :
        setTimeout(() => {
          Actions.currentScene != 'Onboarding' && Actions.Onboarding({ type: 'reset' });
          EventRegister.emit('fromscreen', '')
        }, 4500);
    }
  }

  /******************************************************************************************/
  createWallet(value, pin) {
    getData(Constants.MULTI_WALLET_LIST).then(async list => {
      getData(Constants.LOGIN_DATA).then(async (res) => {
        const response = JSON.parse(res);
        const WallList = JSON.parse(list);
        const defaultWallet = WallList?.find((item) => item?.defaultWallet == true)
        console.log('defaultWallet::::::::', defaultWallet);
        const web3Res = defaultWallet?.web3Res
        const data = {
          device_id: Singleton.getInstance().unique_id,
          login_type: web3Res?.userInfo?.typeOfLogin,
          social_id: web3Res?.sessionId,
          email: web3Res?.userInfo?.email,
          wallet_address: response.defaultEthAddress,
          device_token: (await getData(Constants.DEVICE_TOKEN)) || 'abc',
          wallet_name: web3Res?.userInfo?.name || 'Basic',
          referral_code: response.refCode,
          addressList: [
            { symbol: 'bnb', address: response.defaultEthAddress, coin_family: 1 },
            { symbol: 'eth', address: response.defaultEthAddress, coin_family: 2 },
            // { symbol: 'matic', address: response.defaultEthAddress, coin_family: 4 },
            { symbol: 'btc', address: response.defaultBtcAddress, coin_family: 3 },
            { symbol: 'trx', address: response.defaultTrxAddress, coin_family: 6 },
          ],
        };
        const addrsListKeys = [
          response.defaultEthAddress,
          response.defaultEthAddress,
          response.defaultEthAddress,
          // response.defaultBtcAddress,
          response.defaultTrxAddress,
        ];
        const coinFamilyKeys = [1, 2, 4, 3, 6];
        this.props.requestWalletLogin({ data }).then(res2 => {
          Singleton.getInstance().defaultBnbAddress = response.defaultEthAddress;
          Singleton.getInstance().defaultTicsAddress = response.defaultEthAddress;
          const login_data = {
            access_token: res2.data.token,
            defaultEthAddress: response.defaultEthAddress,
            // defaultBtcAddress: response.defaultBtcAddress,
            defaultTrxAddress: response.defaultTrxAddress,
            defaultBnbAddress: response.defaultEthAddress,
            defaultLtcAddress: response.defaultLtcAddress,
            defaultMaticAddress: response.defaultEthAddress,
            walletName: web3Res?.userInfo?.name || 'Basic',
            userId: res2.data.userId,
            userEmail: web3Res?.userInfo?.email,
            refCode: response.refCode,
          };
          const Wallet_Array = [
            {
              walletName: web3Res?.userInfo?.name || 'Basic',
              loginRequest: data,
              defaultWallet: true,
              user_jwtToken: res2.data?.token,
              user_refreshToken: res2.data?.token,
              userEmail: web3Res.userInfo?.email,
              typeOfLogin: web3Res?.userInfo?.typeOfLogin,
              addrsListKeys: addrsListKeys,
              coinFamilyKeys: coinFamilyKeys,
              login_data: login_data,
              web3Res: defaultWallet?.web3Res,
            },
          ];
          saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(Wallet_Array));
          saveData(Constants.ACCESS_TOKEN, res2.data.token);
          saveData(Constants.ACTIVE_ADDRESS_LIST, JSON.stringify(data.addressList));
          saveData(Constants.ADDRESS_LIST, JSON.stringify(addrsListKeys));
          saveData(Constants.COIN_FAMILY_LIST, JSON.stringify(coinFamilyKeys));
          saveData(Constants.LOGIN_DATA, JSON.stringify(login_data));
          saveData(Constants.REFRESH_TOKEN, res2.data.refreshToken);
          Singleton.getInstance().walletName = web3Res?.userInfo?.name || 'Basic';
          this.moveToApp(value, pin, true)
        })
      });
    });
  }

  /******************************************************************************************/
  render() {
    // console.log('chk this.state.themeSelected welcpme', store.getState().walletReducer.cureentTheme)
    // if(this.state.themeSelected == 0){
    //   return null
    // }
    return (
      <>
        <View style={{
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          backgroundColor: ThemeManager.colors.mainBgNew,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Video
            source={images.tickAnimation}
            style={styles.backgroundVideo}
            resizeMode="contain"
          />
          <Lottie
            style={{ height: 300, }}
            source={Images.splashLogo}
            autoPlay
            loop={false}
          />
        </View>
        {this.state.showAlertDialog3 && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog3: false }, () => BackHandler.exitApp()); }}
          />
        )}
      </>
    );
  }
}

export default connect(null, { requestWalletLogin })(Welcome);
