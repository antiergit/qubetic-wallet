import React, { Component } from 'react';
import { Images } from '../../../theme/';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import { connect } from 'react-redux';
import * as Constants from '../../../Constants';
import { LoaderView } from '../../common/LoaderView';
import Singleton from '../../../Singleton';
import { InputCustomWithQrButton } from '../../common/InputCustomWithQrButton';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { EventRegister } from 'react-native-event-listeners';
import { validateBTCAddress } from '../../../Utils/BtcUtils';
import { validateLTCAddress } from '../../../Utils/LtcUtils';
import { validateTRXAddress } from '../../../Utils/TronUtils';
import { LanguageManager } from '../../../../LanguageManager';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Modal,
  Keyboard,
  Clipboard,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from 'react-native';
import styles from './AddContactStyle';
import {
  Button,
  Header,
  InputCustom,
  AppAlert,
  ModalCoinList,
  HeaderMain,
  QRCodeScannerNew,
} from '../../common';
import {
  addAddress,
  searchWalletName,
  searchContactName,
} from '../../../Redux/Actions';
import { heightDimen, widthDimen } from '../../../Utils';
import LinearGradient from 'react-native-linear-gradient';
import { getData } from '../../../Utils/MethodsUtils';
import { validateSolanaAddress } from '../../../Utils/SolUtils';

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      showModel: false,
      selectedCoin: null,
      showAllCoinFamily: -1,
      userName: '',
      toAddress: '',
      showAlertDialog: false,
      isLoading: false,
      errorMsg: '',
      alertTxt: '',
      WalletName: '',
      showSuccess: false,
      walletNamePlaceHolder: LanguageManager.placeholderAndLabels.enterWalletNameHere,
      contactNameList: [],
      dropdown: false,
      selectedImage: '',
      privateKeyWalletAddress: ''
    };
  }

  async componentDidMount() {
    Singleton.isCameraOpen = false;
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        dropdown: false,
        showModel: false,
        isVisible: false,
        showAlertDialog: false,
        alertTxt: '',
        showSuccess: false,
        walletNamePlaceHolder: LanguageManager.placeholderAndLabels.enterWalletNameHere,
      });
    });
    getData(Constants.MULTI_WALLET_LIST).then(list => {
      const currentWallet = JSON.parse(list).find(wallet => wallet?.defaultWallet);
      this.setState({
        privateKeyWalletAddress: !!currentWallet?.isPrivateKey ? currentWallet.walletAddress : undefined
      });
    });

    this.unfocus = this.props.navigation.addListener('didBlur', event => {
      this.setState({
        showModel: false,
        isVisible: false,
        walletNamePlaceHolder: LanguageManager.placeholderAndLabels.enterWalletNameHere,
      });
      this.backhandle = BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      if (this.backhandle) this.backhandle.remove();
    });
  }
  /******************************************************************************************/
  requestCameraPermission() {
    Singleton.getInstance().cameraPermission().then(res => {
      if (res == 'granted') {
        Singleton.isCameraOpen = true;
        this.setState({ dropdown: false, isVisible: true });
      }
    });
  }
  /******************************************************************************************/
  async saveContact() {
    const { alertMessages, placeholderAndLabels } = LanguageManager;
    console.log('selectedCoin>>>>>>  ', this.state.selectedCoin);
    console.log("WalletName>>>>>", this.state.WalletName.trim().length);
    const WALLET_NAME_REGEX = /^[a-zA-Z0-9 ]*$/;
    Keyboard.dismiss();
    if (this.state.userName?.trim().length < 3) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidContactName });
    } else if (!Constants.NOT_ONLY_NUMBER_REGEX.test(this.state.userName)) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enterValidContactNameFormat });
    } else if (this.state.toAddress?.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterAddress });
    } else if (!WALLET_NAME_REGEX.test(this.state.WalletName.trim())) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidWalletName });
    } else if (!Constants.NOT_ONLY_NUMBER_REGEX.test(this.state.WalletName)) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enterValidWallettNameFormat });
    }
    else if (this.state?.selectedCoin?.coin_symbol == undefined) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseSelectNetwork });
    } else if (!/^(0x){1}[0-9a-fA-F]{40}$/i.test(this.state.toAddress) && this.state.selectedCoin.coin_family != 6 && this.state.selectedCoin.coin_family != 3 && this.state.selectedCoin.coin_family != 5) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidWalletAddress });
    } else if (!validateBTCAddress(this.state.toAddress) && this.state.selectedCoin.coin_family == 3) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidWalletAddress });
    } else if (!validateSolanaAddress(this.state.toAddress) && this.state.selectedCoin.coin_family == 5) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidWalletAddress });
    } else if (!validateTRXAddress(this.state.toAddress) && this.state.selectedCoin.coin_family == 6) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidWalletAddress });
    } else if (this.state.WalletName.trim().length == 0) {//&& this.state.walletNamePlaceHolder == placeholderAndLabels.enterWalletNameHere
      this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterWalletName });
    } else {

      this.setState({ isLoading: true });
      const addressMap = {
        1: Singleton.getInstance().defaultBnbAddress,
        2: Singleton.getInstance().defaultEthAddress,
        3: Singleton.getInstance().defaultBtcAddress,
        4: Singleton.getInstance().defaultMaticAddress,
        5: Singleton.getInstance().defaultLtcAddress,
        6: Singleton.getInstance().defaultTrxAddress,
      };

      const selectedCoinFamily = Number(this.state.selectedCoin.coin_family);
      const defaultAddress =
        addressMap[selectedCoinFamily] ||
        Singleton.getInstance().defaultEthAddress;
      const data = {
        address: !!this.state.privateKeyWalletAddress
          ? this.state.privateKeyWalletAddress
          : defaultAddress,
        wallet_name: this.state.WalletName.trim(),
        contact_name: this.state.userName.trim(),
        coin_family: this.state.selectedCoin.coin_family,
        wallet_address: this.state.toAddress,
      };
      console.log("Data----", data)
      this.props.addAddress({ data }).then(res => {
        this.setState({
          isLoading: false,
          showAlertDialog: true,
          alertTxt: alertMessages.contactAddedSuccessfully,
          showSuccess: true,
        });
      }).catch(err => {
        this.setState({
          isLoading: false,
          showAlertDialog: true,
          alertTxt: err,
        });
      });
    }
  }
  /******************************************************************************************/
  onChangeText(value) {
    if (Constants.ALPHANUMERIC_SPACE_REGEX.test(value)) {
      this.setState({ userName: value });
      if (value.trim().length >= 3) {
        return this.updateSearch(value);
      } else if (value == '' || value.length == 0) {
        return this.setState({ dropdown: false });
      }
    }
  }
  /******************************************************************************************/
  updateSearch(value) {
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getSearchList(value);
    }, 1000);
  }
  /******************************************************************************************/
  getSearchList(text) {
    const data = {
      search: text
    };
    this.props.searchContactName({ data }).then(res => {
      this.setState({
        isLoading: false,
        contactNameList: res,
        dropdown: res.length > 0 ? true : false,
      });
      // console.log('chk searchContactName:::::res', res);
    }).catch(err => {
      this.setState({ isLoading: false });
      console.log('chk searchContactName:::::err', err);
    });
  }
  /******************************************************************************************/
  onChangeWalletName(value) {
    if (Constants.ALPHANUMERIC_SPACE_REGEX.test(value)) {
      this.setState({ WalletName: value });
    }
  }

  /******************************************************************************************/
  itemPressed(item) {
    // console.log('chk item:::::', item);
    if (this.state.WalletName.trim().length == 0) {
      this.setState({ selectedCoin: item, showModel: false });
      return this.fetchPlaceHolder(item);
    } else {
      this.setState({ selectedCoin: item, showModel: false });
    }
  }

  /******************************************************************************************/
  fetchPlaceHolder(item) {
    this.setState({ isLoading: true });
    const data = {
      contact_name: this.state.userName,
      coin_family: item.coin_family,
      wallet_name: '',
      address: Singleton.getInstance().defaultEthAddress,
    };
    this.props.searchWalletName({ data }).then(res => {
      this.setState({
        isLoading: false,
        walletNamePlaceHolder: res == '' ? LanguageManager.placeholderAndLabels.enterWalletNameHere : res
      });
      // console.log('chk searchWalletName:::::res', res);
    }).catch(err => {
      this.setState({ isLoading: false });
      console.log('chk searchWalletName:::::err', err);
    });
  }
  /******************************************************************************************/
  async onPressPaste() {
    this.setState({ dropdown: false, toAddress: await Clipboard.getString() });
  }
  /******************************************************************************************/
  selectNetwork() {

    this.setState({ dropdown: false });
    // if (this.state.userName?.trim().length < 3) {
    //   this.setState({
    //     showAlertDialog: true,
    //     alertTxt: LanguageManager.alertMessages.pleaseEnterValidContactName
    //   });
    //   return;
    // }
    this.setState({ showModel: true });
  }
  /******************************************************************************************/
  render() {
    console.log(Singleton.getInstance().defaultEthAddress, this.state.privateKeyWalletAddress, 'Singleton.getInstance().defaultEthAddress');

    const { alertMessages, placeholderAndLabels, sendTrx, addressBook } = LanguageManager;
    if (this.state.isVisible)
      return (
        <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
          <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.isVisible}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: ThemeManager.colors.mainBgNew, flex: 1, marginTop: -5 }}>
                <QRCodeScannerNew
                  cameraStyle={styles.cameraStyle}
                  onRead={event => {
                    console.log('chk event:::::', event);
                    Singleton.isCameraOpen = false;
                    this.setState({ isVisible: false, toAddress: event.data });
                  }}
                />
                <TouchableOpacity
                  onPress={() => { Singleton.isCameraOpen = false; this.setState({ isVisible: false }) }}>
                  <Text allowFontScaling={false} style={[styles.cancelText, { marginBottom: 20, color: ThemeManager.colors.blackWhiteText }]}>{sendTrx.Cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );

    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
        <HeaderMain BackButtonText={addressBook.addNewAddress} />
        <TouchableWithoutFeedback disabled={!this.state.dropdown} onPress={() => { this.setState({ dropdown: false }) }}>
          <View style={{ marginHorizontal: 20, marginTop: 20, flex: 1 }}>
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.blackWhiteText }]}>{addressBook.nameYourContact}</Text>
            <View style={{ marginBottom: 16, marginTop: 7 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterNamehere}
                placeholderTextColor={ThemeManager.colors.greyText}
                maxLength={15}
                onChangeText={value => this.onChangeText(value)}
                value={this.state.userName}
                customInputStyle={{ borderWidth: 1, borderColor: "red" }}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            {this.state.dropdown && (
              <LinearGradient
                colors={ThemeManager.colors.dropDownClr}
                style={[styles.dropdown, { backgroundColor: ThemeManager.colors.placeholderBg, borderColor: ThemeManager.colors.searchBorderColor, paddingVertical: 10 }]}>
                {this.state.contactNameList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index + ''}
                      style={{ borderBottomColor: ThemeManager.colors.Mainbg, borderBottomWidth: this.state.contactNameList.length - 1 == index ? 0 : 1 }}
                      onPress={() => this.setState({ userName: item.name, dropdown: false })}>
                      <Text allowFontScaling={false} style={[styles.textStyle1, { textTransform: 'capitalize', color: ThemeManager.colors.blackWhiteText }]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </LinearGradient>
            )}
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.blackWhiteText }]}>
              {addressBook.addWalletAddress}
            </Text>
            <View style={{ marginBottom: 16, marginTop: 7 }}>
              <InputCustomWithQrButton
                onFocus={() => this.setState({ dropdown: false })}
                isPaste={true}
                paste={placeholderAndLabels.paste}
                onPressPaste={() => this.onPressPaste()}
                placeHolder={placeholderAndLabels.pasteWalletaddress}
                showQrCode={() => { this.requestCameraPermission() }}
                placeholderTextColor={ThemeManager.colors.placeholderColorNew}
                value={this.state.toAddress}
                onChangeText={value => {
                  this.setState({ toAddress: value });
                }}
                customInputStyle={{ borderWidth: 0 }}
                outsideView={{ borderWidth: 1 }}
                customBtnsView={{ width: "28%" }}
              />
            </View>
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.blackWhiteText }]}>{addressBook.addWalletName}</Text>
            {/* ----------------------------------------------------------- */}
            <View style={{ marginBottom: 16, marginTop: 7 }}>
              <InputCustom
                onFocus={() => this.setState({ dropdown: false })}
                placeHolder={this.state.walletNamePlaceHolder}
                placeholderTextColor={ThemeManager.colors.placeholderColorNew}
                maxLength={15}
                onChangeText={value => this.onChangeWalletName(value)}
                value={this.state.WalletName}
                customInputStyle={{ borderWidth: 1 }}

              />
            </View>
            {/* ----------------------------------------------------------- */}
            <Text
              allowFontScaling={false}
              style={[styles.txtTitle, { color: ThemeManager.colors.blackWhiteText }]}>
              {addressBook.network}
            </Text>
            <View style={{ marginBottom: 15, marginTop: 7 }}>
              {this.state.selectedCoin ? (
                <InputCustomWithQrButton
                  customInputStyle={{ width: '63%', paddingHorizontal: 10 }}
                  editable={false}
                  notScan={true}
                  image={ThemeManager.ImageIcons.dropDown}
                  isPaste={false}
                  placeHolder={placeholderAndLabels.selectNetwork}
                  showQrCode={() => { }}
                  outsideView={{ borderWidth: 1 }}
                  placeholderTextColor={ThemeManager.colors.placeholderColorNew}
                  value={this.state.selectedCoin?.coin_name}
                  onPress={() => this.selectNetwork()}>
                  <View style={{ justifyContent: 'center' }}>
                    <Image style={styles.imgStyle}
                      source={{ uri: this.state.selectedCoin?.coin_image }}
                    />
                  </View>
                </InputCustomWithQrButton>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.selectNetwork()
                  }}
                >


                  <InputCustomWithQrButton
                    qrstyle={{ paddingVertical: 20, paddingHorizontal: 20, marginRight: 0, }}
                    editable={false}
                    notScan={true}
                    image={ThemeManager.ImageIcons.dropDown}
                    isPaste={false}
                    placeHolder={placeholderAndLabels.selectNetwork}
                    showQrCode={() => {
                      this.selectNetwork()
                    }}
                    placeholderTextColor={ThemeManager.colors.placeholderColorNew}
                    value={this.state.selectedCoin?.coin_name}
                    onPress={() => {
                      this.selectNetwork()
                    }}
                    outsideView={{ borderWidth: 1 }}
                    customBtnsView={{ width: "28%" }}

                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ justifyContent: 'flex-end', marginBottom: heightDimen(50), marginHorizontal: widthDimen(24) }}>
          <Button
            buttontext={addressBook.saveContact}
            onPress={() => { this.saveContact() }}
          />
        </View>
        {this.state.isVisible && <View style={styles.ViewStyle2} />}

        {/* ********************************************************** Network Modal ******************************************************* */}
        <ModalCoinList
          openModel={this.state.showModel}
          onPressIn={() => this.setState({ showModel: false })}
          onPress={item => { this.itemPressed(item) }}
        />

        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false, showSuccess: false });
              if (this.state.alertTxt == alertMessages.contactAddedSuccessfully) {
                Actions.pop();
              }
            }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />
      </ImageBackground>
    );
  }
}

const mapStateToProp = state => {
  const { gasPriceList } = state.sendCoinReducer;
  return { gasPriceList };
};

export default connect(mapStateToProp, {
  addAddress,
  searchWalletName,
  searchContactName,
})(AddContact);
