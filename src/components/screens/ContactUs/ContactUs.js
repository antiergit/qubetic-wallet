import React, { Component } from 'react';
import styles from './ContactUsStyle';
import { connect } from 'react-redux';
import * as Constants from '../../../Constants';
import { LoaderView } from '../../common/LoaderView';
import Singleton from '../../../Singleton';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  Image,
  Platform,
  PermissionsAndroid,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Button,
  Header,
  InputCustom,
  AppAlert,
  ModalCoinList,
} from '../../common';
import { Images } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import { uploadImage, hitContactUs } from '../../../Redux/Actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputCustomWithQrButton } from '../../common/InputCustomWithQrButton';
import { attachBtnClicked, attachCameraClicked } from '../../../Utils/MethodsUtils';
import FastImage from 'react-native-fast-image';
import { BASE_IMAGE_URL } from '../../../EndPoint';
import images from '../../../theme/Images';
import { ConfirmAlert } from '../../common/ConfirmAlert';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      userName: '',
      email: Singleton.getInstance().defaultEmail,
      subject: '',
      msg: '',
      category: '',
      walletAddress: '',
      txnLink: '',
      frst_screenshot: '',
      scnd_screenshot: '',
      showAlertDialog: false,
      isLoading: false,
      errorMsg: '',
      alertTxt: '',
      WalletName: '',
      showSuccess: false,
      selectedImage: '',
      showImgModal: false,
      showAlertDialogConfirm: false,
      alertTxtConfirm: ''
    };
  }
  /******************************************************************************************/
  async componentDidMount() {
    Singleton.isCameraOpen = false;
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showModel: false,
        showAlertDialog: false,
        alertTxt: '',
        showSuccess: false,
        showImgModal: false,
        showAlertDialogConfirm: false,
        alertTxtConfirm: ''
      });
    });
    this.unfocus = this.props.navigation.addListener('didBlur', () => {
      this.setState({ showModel: false });
      this.backhandle = BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      if (this.backhandle) this.backhandle.remove();
    });
  }
  /******************************************************************************************/
  sendReq() {
    Keyboard.dismiss();
    const { alertMessages } = LanguageManager;
    const { userName, email, subject, msg, category, walletAddress } = this.state
    if (userName?.trim().length < 3) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidName });
    } else if (email?.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidEmail });
    } else if (!Constants.EMAIL_REGEX.test(email)) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidEmail });
    } else if (subject?.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidSubject });
    } else if (msg?.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidMessage });
    } else if (category?.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidCategory });
    } else if (walletAddress?.trim().length < 30) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.enterValidWalletAddress });
    } else {
      this.contactUs();
    }
  }
  /******************************************************************************************/
  contactUs() {
    const { userName, email, subject, msg, category, walletAddress, txnLink, frst_screenshot, scnd_screenshot } = this.state
    const data = {
      name: userName,
      email: email,
      subject: subject,
      message: msg,
      category: category,
      wallet_address: walletAddress,
      trnx_links: txnLink,
      screenshots: (frst_screenshot && !scnd_screenshot) ? [frst_screenshot] : (frst_screenshot && scnd_screenshot) ? [frst_screenshot, scnd_screenshot] : []
    }
    this.setState({ isLoading: true })
    setTimeout(() => {
      this.props.hitContactUs({ data }).then(res => {
        this.setState({ showSuccess: true, isLoading: false, showAlertDialog: true, alertTxt: LanguageManager.alertMessages.requestSubmitted })
      }).catch(err => {
        console.log('chk err hitContactUs:::::', err)
        this.setState({ isLoading: false, showAlertDialog: true, alertTxt: err })
      })
    }, 100);
  }
  /******************************************************************************************/
  itemPressed(item) {
    this.setState({ category: item, showModel: false });
  }
  /******************************************************************************************/
  onImageUpload = async type => {
    global.imageUpload = true;
    if (type == 'gallery') {
      if (await this.requestExternalStoreageRead()) {
        this.pickDocument(type);
      }
    } else if (type == 'camera') {
      Singleton.getInstance().cameraPermission().then(res => {
        if (res == 'granted') {
          Singleton.isCameraOpen = true;
          this.pickDocument(type);
        }
      });
    }
  };
  /******************************************************************************************/
  requestExternalStoreageRead = async () => {
    try {
      if (Platform.OS == 'ios') return true;
      Singleton.isCameraOpen = true;
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (Platform.Version >= 33) {
        return true;
      }
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        alert(LanguageManager.alertMessages.grantStoragePermissionInSettings);
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  /******************************************************************************************/
  pickDocument = async (type) => {
    Singleton.isPermission = true;
    Singleton.isCameraOpen = true;
    if (type == 'gallery') {
      attachBtnClicked().then(img_res => {
        console.log('res::::attachBtnClicked', img_res);
        if (img_res?.fileName) {
          this.hitUploadApi(img_res);
        }
      }).catch(err => {
        console.log('err::::', err);
        this.setState({ alertTxt: err, showAlertDialog: true, isLoading: false });
      });
    } else if (type == 'camera') {
      attachCameraClicked().then(img_res => {
        if (img_res?.fileName) {
          this.hitUploadApi(img_res);
        }
      }).catch(err => {
        console.log('err::::', err);
        this.setState({ alertTxt: err, showAlertDialog: true, isLoading: false });
      });
    }
  };
  /******************************************************************************************/
  hitUploadApi(img_res) {
    this.setState({ isLoading: true })
    const formData = new FormData();
    formData.append('files', { name: img_res.fileName, type: img_res.type, uri: img_res.uri });
    this.props.uploadImage(formData).then(res => {
      console.log('chk res upload img:::::', res)
      this.setState({ isLoading: false }, () => {
        this.setState({ frst_screenshot: this.state.frst_screenshot ? this.state.frst_screenshot : res?.file_name, scnd_screenshot: this.state.frst_screenshot ? res?.file_name : '' })
      })
    }).catch(err => {
      console.log('chk err upload img:::::', err)
    })
  }
  /******************************************************************************************/
  openImage(type) {
    this.setState({ showImgModal: true, selectedImage: type })
  }
  /******************************************************************************************/
  onPressDelete() {
    this.setState({ showImgModal: false, showAlertDialogConfirm: true, alertTxtConfirm: LanguageManager.alertMessages.doYouWantToDeleteS })
  }
  /******************************************************************************************/
  confirmDelete() {
    const { selectedImage, frst_screenshot, scnd_screenshot } = this.state
    if (selectedImage == 'first') {
      if (frst_screenshot && scnd_screenshot) {
        this.setState({ frst_screenshot: scnd_screenshot, scnd_screenshot: '' })
      } else if (frst_screenshot && !scnd_screenshot) {
        this.setState({ frst_screenshot: '', scnd_screenshot: '' })
      }
    } else if (selectedImage == 'second') {
      if (frst_screenshot && scnd_screenshot) {
        this.setState({ frst_screenshot: frst_screenshot, scnd_screenshot: '' })
      }
    }
    this.setState({ showAlertDialogConfirm: false, showImgModal: false })
  }
  /******************************************************************************************/
  render() {
    const { alertMessages, placeholderAndLabels, contactUs, addressBook } = LanguageManager;
    const categories = [contactUs.buySell, contactUs.sendReceive, contactUs.swap, contactUs.cardRelated, contactUs.accountRelated];
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header
          BackButtonText={contactUs.GetInTouch}
        />
        <KeyboardAwareScrollView enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS == 'ios' ? false : true}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          extraScrollHeight={Platform.OS == 'ios' ? 50 : 50}
          contentContainerStyle={{ paddingBottom: 0 }}
          style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
          <Text allowFontScaling={false} style={[styles.txtTitle1, { color: ThemeManager.colors.lightText }]}>
            {contactUs.supportText}
          </Text>

          {/* ----------------------------------------------------------- */}
          <View style={{ marginHorizontal: 20, flex: 1 }}>
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.name}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterNamehere}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                maxLength={15}
                onChangeText={value => this.setState({ userName: value })}
                value={this.state.userName}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.email}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterEmailhere}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                maxLength={45}
                onChangeText={value => this.setState({ email: value })}
                value={this.state.email}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.subject}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterSubjectHere}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                maxLength={45}
                onChangeText={value => this.setState({ subject: value })}
                value={this.state.subject}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.message}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterMessageHere}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                maxLength={45}
                onChangeText={value => this.setState({ msg: value })}
                value={this.state.msg}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.category}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              {this.state.category ? (
                <InputCustomWithQrButton
                  customInputStyle={{ width: '76%', paddingHorizontal: 10 }}
                  editable={false}
                  notScan={true}
                  image={Images.dropdown}
                  isPaste={false}
                  placeHolder={placeholderAndLabels.select}
                  showQrCode={() => { }}
                  placeholderTextColor={ThemeManager.colors.lightWhiteText}
                  value={this.state.category}
                  onPress={() => this.setState({ showModel: true })}>
                </InputCustomWithQrButton>
              ) : (
                <InputCustomWithQrButton
                  customInputStyle={{ width: '76%', paddingHorizontal: 10 }}
                  editable={false}
                  notScan={true}
                  image={Images.dropdown}
                  isPaste={false}
                  placeHolder={placeholderAndLabels.select}
                  showQrCode={() => { }}
                  placeholderTextColor={ThemeManager.colors.lightWhiteText}
                  value={this.state.category}
                  onPress={() => this.setState({ showModel: true })}
                />
              )}
            </View>
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.walletAddress}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterWalletHere}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                maxLength={75}
                onChangeText={value => this.setState({ walletAddress: value })}
                value={this.state.walletAddress}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
              {contactUs.txnLink}
            </Text>
            <View style={{ marginBottom: 12, marginTop: 6 }}>
              <InputCustom
                placeHolder={placeholderAndLabels.enterTxnLink}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                maxLength={45}
                onChangeText={value => this.setState({ txnLink: value })}
                value={this.state.txnLink}
              />
            </View>
            {/* ----------------------------------------------------------- */}
            {(this.state.frst_screenshot?.length == 0 || this.state.scnd_screenshot?.length == 0) ?
              <>
                <View style={styles.ViewStyle4}>
                  <View style={{ height: 24, width: 24, justifyContent: 'center', borderWidth: 1, borderRadius: 3, borderColor: ThemeManager.colors.borderColor }}>
                    <Image style={[styles.imgStyle, { tintColor: ThemeManager.colors.colorVariationBorder }]} source={Images.add} />
                  </View>
                  <Text allowFontScaling={false} style={[styles.txtTitle2, { color: ThemeManager.colors.settingsText }]}>
                    {contactUs.attachScreenshot}
                  </Text>
                </View>

                <View style={[styles.ViewStyle4, { marginTop: 10 }]}>
                  <TouchableOpacity onPress={() => this.onImageUpload('camera')} style={[styles.ViewStyle5, { backgroundColor: ThemeManager.colors.settingBg, marginRight: 10 }]}>
                    <FastImage
                      style={{ width: 40, height: 40 }}
                      source={images.image_camera}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.onImageUpload('gallery')} style={[styles.ViewStyle5, { backgroundColor: ThemeManager.colors.settingBg, }]}>
                    <FastImage
                      style={{ width: 40, height: 40 }}
                      source={images.image_gallery}
                    />
                  </TouchableOpacity>
                </View>
              </>
              :
              <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
                {contactUs.screenshot}
              </Text>}
            {/* ----------------------------------------------------------- */}
          </View>

          <View style={[styles.btnView, { marginTop: 10 }]}>
            {this.state.frst_screenshot ? <TouchableOpacity onPress={() => this.openImage('first')} style={[styles.buttonStyle1, { borderColor: ThemeManager.colors.lightText }]}>
              <FastImage
                style={{ width: '100%', height: '100%' }}
                source={{ uri: BASE_IMAGE_URL + this.state.frst_screenshot }}
              />
            </TouchableOpacity> : null}
            {this.state.scnd_screenshot ? <TouchableOpacity onPress={() => this.openImage('second')} style={[styles.buttonStyle1, { borderColor: ThemeManager.colors.lightText }]}>
              <FastImage
                style={{ width: '100%', height: '100%' }}
                source={{ uri: BASE_IMAGE_URL + this.state.scnd_screenshot }}
              />
            </TouchableOpacity> : null}
          </View>

          <View style={styles.btnView}>
            <Button
              isLogout={true}
              restoreStyle={{ color: ThemeManager.colors.Text }}
              myStyle={[styles.buttonStyle, { borderColor: ThemeManager.colors.activeTab }]}
              buttontext={contactUs.cancel}
              onPress={() => { Actions.pop() }}
            />
            <Button
              myStyle={[styles.buttonStyle, { borderWidth: 0 }]}
              buttontext={contactUs.send}
              onPress={() => { this.sendReq() }}
            />
          </View>

          {/* ********************************************************** Network Modal ******************************************************* */}
          <ModalCoinList
            contactUs={true}
            list={categories}
            openModel={this.state.showModel}
            onPressIn={() => this.setState({ showModel: false })}
            onPress={item => {
              this.itemPressed(item);
            }}
          />
          {/* ----------------------------------------------------------- */}
          {this.state.showAlertDialog && (
            <AppAlert
              showSuccess={this.state.showSuccess}
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => {
                this.setState({ showAlertDialog: false, showSuccess: false });
                if (this.state.alertTxt == alertMessages.requestSubmitted) {
                  Actions.currentScene == 'ContactUs' ? Actions.pop() : null
                }
              }}
            />
          )}
          {/* ----------------------------------------------------------- */}
          {this.state.showAlertDialogConfirm && (
            <ConfirmAlert
              text={addressBook.yes}
              alertTxt={this.state.alertTxtConfirm}
              hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false, showImgModal: true }) }}
              ConfirmAlertDialog={() => { this.confirmDelete() }}
            />
          )}
          <LoaderView isLoading={this.state.isLoading} />
        </KeyboardAwareScrollView>

        {/* ********************************************************** img Preview Modal ******************************************************* */}
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showImgModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.colorVariation }}>
            <View style={{ backgroundColor: 'black', flex: 1, marginTop: Platform.OS == 'ios' ? 0 : -35 }}>
              <Header imgSecond={Images.icon_delete} onPressIcon={() => this.onPressDelete()} backCallBack={() => this.setState({ showImgModal: false })} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} BackButtonText={contactUs.screenshot} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <FastImage
                  resizeMode={'contain'}
                  style={{ width: '93%', height: Dimensions.get('screen').height - 250, alignSelf: 'center' }}
                  source={{ uri: this.state.selectedImage == 'first' ? BASE_IMAGE_URL + this.state.frst_screenshot : BASE_IMAGE_URL + this.state.scnd_screenshot }}
                />
              </View>
            </View>
          </SafeAreaView>
          <SafeAreaView style={{ backgroundColor: 'black', }} />
        </Modal>
      </View>
    );
  }
}

const mapStateToProp = state => {
  const { gasPriceList } = state.sendCoinReducer;
  return { gasPriceList };
};

export default connect(mapStateToProp, { uploadImage, hitContactUs })(ContactUs);
