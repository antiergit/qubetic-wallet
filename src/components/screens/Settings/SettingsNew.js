import React, { Component } from 'react';
import {
  View,
  BackHandler,
  ScrollView,
  Linking,
  Share,
  NativeModules,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Header,
  TabIcon,
  AppAlert,
  CardView,
  Button,
  LoaderView,
} from '../../common';
import { Colors, Images } from '../../../theme/';
import { ActionConst, Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { EventRegister } from 'react-native-event-listeners';
import { clearStorage, getData, saveData } from '../../../Utils/MethodsUtils';
import styles from './SettingsStyle';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { logoutUser } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: 'false',
      alertTxt: '',
      showAlertDialog3: false,
      alertTxt3: '',
      showModel: false,
      showbackupType: false,
      themeSelected: '',
      bgColor: ThemeManager.colors.Mainbg,
      alertTxtConfirm: '',
      showAlertDialogConfirm: false,
      isLoading: false,
      referralUrl: '',
      isdisable: false
    };
    this.backhandle = null;
    this.scrollRef = React.createRef();
  }

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialogConfirm: false,
        alertTxtConfirm: '',
        showAlertDialog: false,
        alertTxt: '',
      });
    });
    EventRegister.addEventListener('enableTouchable', data => {
      this.setState({ isdisable: false })
    });
    EventRegister.addEventListener('theme', data => {
      this.setState({ bgColor: data });
    });
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data ? data : 2 });
    });
    this.focus = this.props.navigation.addListener('didFocus', async event => {
      this.setState({ isdisable: false })
      this.getRefLink();
      // EventRegister.emit('theme', (this.state.themeSelected == 2) ? ThemeManager.colors.colorVariation : ThemeManager.colors.MainbgNew);
      Singleton.isCameraOpen = false;
      this.backhandle = BackHandler.addEventListener('hardwareBackPress', () => {
        // Singleton.bottomBar?.navigateTab('WalletMain');
        // Actions.jump('WalletMain');
        return true;
      },
      );
    });
    this.unfocus = this.props.navigation.addListener('didBlur', event => {
      this._scrollToTop();
      this.setState({ showAlertDialog3: false, showModel: false });
      BackHandler.removeEventListener('hardwareBackPress', () => null);
      if (this.backhandle) this.backhandle.remove();
    });
  }

  /******************************************************************************************/
  componentWillUnmount() {
    this.focus?.remove();
    this.unfocus?.remove();
  }

  /******************************************************************************************/
  _scrollToTop() {
    if (this.scrollRef !== null) {
      if (this.scrollRef.current !== null) {
        this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  }

  /******************************************************************************************/
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      tabBarLabel: ' ',
      tabBarIcon: ({ focused }) => (
        <TabIcon
          focused={focused}
          title={LanguageManager.setting.settings}
          ImgSize={{ width: 23, height: 23, tintColor: focused ? ThemeManager.colors.whiteText : ThemeManager.colors.lightWhiteText }}
          activeImg={Images.setting_inactive}
          defaultImg={Images.setting_inactive}
          titleColor={{ color: focused ? ThemeManager.colors.whiteText : ThemeManager.colors.lightWhiteText }}
        />
      ),
      tabBarOptions: {
        style: { borderTopColor: 'transparent', borderColor: 'black', backgroundColor: ThemeManager.colors.tabBottomColor },
        keyboardHidesTabBar: true,
      },
    };
  };
  /******************************************************************************************/
  logoutPressed() {
    this.setState({
      showAlertDialogConfirm: true,
      alertTxtConfirm: LanguageManager.alertMessages.willBeLoggedOutFromTheApp,
    });
  }
  /******************************************************************************************/
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
          ThemeManager.setLanguage('darkMode');
          EventRegister.emit('getThemeChanged', 1);
          LanguageManager.setLanguage('English');
          Singleton.getInstance().userRefCode = '';
          global.isDeepLink = false
          Singleton.getInstance().SelectedLanguage = 'en';
          saveData(Constants.SELECTED_LANGUAGE, 'en')
          EventRegister.emit('theme', Colors.White);
          Actions.currentScene != 'Onboarding' && Actions.Onboarding({ type: ActionConst.RESET });
        }, 1200);
        this.setState({ isLoading: false });
      }).catch(err => {
        console.log('chk logotu err::::=======', err);
        this.setState({ isLoading: false });
      });
    });
  }
  /******************************************************************************************/
  getRefLink = async () => {
    getData(Constants.REF_LINK).then(url => {
      this.setState({ referralUrl: url })
    })
    return

  }
  /* *********************************************onPressRef***************************************** */
  onPressRef() {
    this.setState({ isdisable: true })
    Singleton.isCameraOpen = true;
    Singleton.isPermission = true;
    const code = Singleton.getInstance().refCode
    const result = Share.share({ message: LanguageManager.referral.getReward + code + `\n${LanguageManager.referral.plsDownload}\n` + this.state.referralUrl });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('hererrere2');
      } else {
        console.log('hererrere1');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('hererrere');
    }
  }

  render() {
    const { setting, referral } = LanguageManager;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        {/* <StatusBar backgroundColor={ThemeManager.colors.statusBarColor1} /> */}
        <Header
          TextcustomStyle={{ marginLeft: -14 }}
          showBackBtn={true}
          BackButtonText={setting.settings}
          bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
          backCallBack={() => { }}
        />
        <ScrollView
          bounces={false}
          ref={this.scrollRef}
          style={{ flex: 1, marginBottom: 20 }}
          showsVerticalScrollIndicator={false}>

          <View style={{ ...styles.ViewStyle22, backgroundColor: ThemeManager.colors.searchBg }}>
            <Text style={[styles.txt, { width: '58%', color: ThemeManager.colors.settingsText }]}>{LanguageManager.commonText.ReferralCode}</Text>
            <TouchableOpacity activeOpacity={0.7} disabled={Platform.OS == 'ios' ? false : this.state.isdisable} onPress={() => this.onPressRef()} style={[styles.codeBg, { width: '40%', backgroundColor: ThemeManager.colors.settingsText }]}>
              <Text style={[styles.txt, { color: ThemeManager.colors.Mainbg }]}>{Singleton.getInstance().refCode}</Text>
              <Image style={[styles.imgStyle1, { tintColor: ThemeManager.colors.Mainbg }]} source={Images.share_icon_light} />
            </TouchableOpacity>
          </View>

          <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.searchBg }]}>
            {/* ----------------------------------------------------------- */}
            <CardView
              imgStyle={{ height: 18, width: 22 }}
              onPress={() =>
                Actions.currentScene != 'WalletManageList' && Actions.WalletManageList()

                // Actions.currentScene != 'ManageWallet' && Actions.ManageWallet()
              }
              img={Images.manageWallet}
              text={setting.manageAccount}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => Actions.currentScene != 'ReferralRewards' && Actions.ReferralRewards()}
              // onPress={() => Actions.currentScene != 'Terms' && Actions.Terms()}
              img={Images.reward}
              text={referral.referralnRewards}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => { Singleton.getInstance().virtualCardStatus = 'inactive'; Actions.currentScene != 'PrepaidCard' && Actions.PrepaidCard() }}
              img={Images.Card}
              text={setting.triskelCards}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              imgStyle={{ height: 21, width: 22 }}
              onPress={() => Actions.currentScene != 'ThemeChange' && Actions.ThemeChange()}
              img={Images.theme}
              text={setting.theme}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              imgStyle={{ height: 21, width: 22 }}
              onPress={() => Actions.currentScene != 'Language' && Actions.Language()}
              img={Images.language}
              text={setting.language}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => Actions.currentScene != 'Security' && Actions.Security()}
              img={Images.policy}
              text={setting.security}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => Actions.currentScene != 'Currency' && Actions.Currency()}
              img={Images.currency}
              text={setting.currencyPreference}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => Actions.currentScene != 'PriceAlert' && Actions.PriceAlert({ themeSelected: this.state.themeSelected })}
              img={Images.alert}
              text={setting.priceAlert}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => Actions.currentScene != 'AddressBook' && Actions.AddressBook({ themeSelected: this.state.themeSelected, symbol: 'all' })}
              img={Images.Contact}
              text={setting.addressBook}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              hideBottom={false}
              onPress={() => Actions.currentScene != 'ContactUs' && Actions.ContactUs()}
              img={Images.contactUs}
              text={setting.contactUS}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              hideBottom={false}
              onPress={() => Actions.currentScene != 'HelpTab' && Actions.HelpTab()}
              img={Images.icon_help}
              text={setting.help}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              onPress={() => Linking.openURL(Constants.ABOUT_US_LINK)}
              img={Images.aboutUs}
              text={setting.aboutUs}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
            <CardView
              hideBottom={true}
              onPress={() => Linking.openURL(Constants.PRIVACY_POLICY_LINK)}
              img={Images.security}
              text={setting.privacyPolicy}
              themeSelected={this.state.themeSelected}
            />
            {/* ----------------------------------------------------------- */}
          </View>
        </ScrollView>

        <View style={styles.buttonView}>
          <Button
            restoreStyle={{ color: Colors.logoutColor }}
            onPress={() => this.logoutPressed()}
            isLogout={true}
            myStyle={styles.buttonStyle}
            buttontext={setting.logout}
          />
        </View>
        {this.state.showAlertDialogConfirm && (
          <ConfirmAlert
            text={setting.yes}
            alertTxt={this.state.alertTxtConfirm}
            hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }) }}
            ConfirmAlertDialog={() => { this.logout() }}
          />
        )}

        {this.state.showAlertDialog3 && (
          <AppAlert
            alertTxt={this.state.alertTxt3}
            hideAlertDialog={() => { this.setState({ showAlertDialog3: false }) }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />
      </View>
    );
  }
}
export default connect(null, { logoutUser })(Settings);
