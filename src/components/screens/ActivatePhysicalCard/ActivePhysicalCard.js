import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Button, Header, LoaderView, ModalCoinList } from '../../common';
import CustomInprogress from '../../common/CustomInprogress';
import { CardViewVirtualPhy } from '../../common/CardViewVirtualPhy';
import { Colors, Fonts, Images } from '../../../theme';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CustomStatus from '../PrepaidCard/CustomStatus';
import Singleton from '../../../Singleton';
import { ModalCountryList } from '../../common/ModalCountryList';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import { addressCheck, phoneNoCheck, wordsWithSpace } from '../../../Utils';
import { attachBtnClicked, attachCameraClicked, getData } from '../../../Utils/MethodsUtils';
import { useDispatch } from 'react-redux';
import { getCountryCodes, userKyc } from '../../../Redux/Actions';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import SignatureCapture from 'react-native-signature-capture';
import { useRef } from 'react';
// import ImageResizer from '@bam.tech/react-native-image-resizer';
import { LanguageManager } from '../../../../LanguageManager';
import ImageResizer1 from '@bam.tech/react-native-image-resizer';
import FastImage from 'react-native-fast-image';

let progStep = 1;
let DocumentList = [{ title: 'Passport', id: 1 }];
let ErrorsLocal = {
  sign: '.',
};
const ActivePhysicalCard = props => {
  const dispatch = useDispatch();
  let typeOfImg1 = '';
  const { alertMessages, merchantCard, placeholderAndLabels, contactUs } = LanguageManager;
  const optionList = [placeholderAndLabels.camera, placeholderAndLabels.gallery]
  // console.log('props.data:::::::::::::', props.data);
  const [language, setLanguage] = useState('en');
  const [progressStep, setProgressStep] = useState(1);
  const [themeSelected, setThemeSelected] = useState();
  const [showFromDatePicker, setshowFromDatePicker] = useState(false);
  const [showImgView, setShowImgView] = useState(false);
  const [ImgView, setImgView] = useState('');
  const [showOptionModal, setshowOptionModal] = useState(false)
  const [todayDate, setTodayDate] = useState(new Date());
  const [minimumDate, setminimumDate] = useState(new Date());
  const [fromDate, setfromDate] = useState('');
  const [documentNo, SetDocumentNo] = useState('');
  const [emergencyContact, SetemergencyContact] = useState('');
  const [emergencyNumber, SetemergencyNumber] = useState('');
  const [showModalCodeCOuntry, setshowModalCodeCOuntry] = useState(false);
  const [country, setCountry] = useState({ english: '', unique_id: '' });
  const [showModalDocument, setshowModalDocument] = useState(false);
  const [document, SetDocument] = useState(placeholderAndLabels?.passport);
  const [documentFront, setDocumentFront] = useState('');
  const [documentSelfie, setDocumentSelfie] = useState('');
  const [firstName, setFirstName] = useState(props.data?.first_name || 'Sohit');
  const [lastName, setLastName] = useState(props.data?.last_name || 'Ahhuja');
  const [countryList, setCountryList] = useState([]);
  const [fullCountryList, setFullCountryList] = useState([]);
  const [frontBase64Images, setFrontBase64Images] = useState('');
  const [selfieBase64Images, setSelfieBase64Images] = useState('');
  const [signBase64Images, setSignBase64Images] = useState('');
  const [alertTxt, setAlertTxt] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [typeOfImg, setTypeOfImg] = useState('')
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [signatureFile, setSignatureFile] = useState('');
  const [disableReset, setDisableReset] = useState(false);
  const [frontId, setFrontId] = useState('');
  const [signatureBase64Images, setSignatureBase64Images] = useState('')
  const [documentSignature, setDocumentSignature] = useState('')
  const [signature1, setSignature1] = useState('')
  const [selfie, setSelfie] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    documentNo: '',
    fromDate: '',
    country: '',
    emergencyContact: '',
    emergencyNumber: '',
    documentFront: '',
    signature1: '',
    documentSelfie: '',
    signature: '',
    frontID: '',
    selfie: '',
    sign: '',
  });

  const sign = useRef(null);
  /******************************************************************************************/
  const resetSign = () => {
    sign.current.resetImage();
  };
  /******************************************************************************************/
  const saveSign = () => {
    sign.current.saveImage();
  };
  /******************************************************************************************/
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getData(Constants.DARK_MODE_STATUS).then(async theme => {
        setThemeSelected(theme);
      })
      getLanguage();
      EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
        setImgView('');
        setShowImgView(false);
        setshowFromDatePicker(false);
        setshowModalCodeCOuntry(false);
        setshowOptionModal(false);
      });
      BackHandler.addEventListener('hardwareBackPress', () => {
        Actions.PrepaidCard({ from: 'PhysicalCard', physicalCardData: props.physicalCardData, isKyc: true });
        // if (progStep == 1) {
        //   Actions.pop();
        //   return true;
        // } else {
        //   progStep = 1;
        //   setProgressStep(1);
        //   return true;
        // }
      });
      setLoading(true);
      dispatch(getCountryCodes()).then(res => {
        setCountryList(res.data);
        setFullCountryList(res.data);
        setLoading(false);
      }).catch(err => {
        console.log('err:::::', err);
        setLoading(false);
      });
    });
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress');
      EventRegister.removeEventListener(Constants.DOWN_MODAL);
    });
  }, []);

  /******************************************************************************************/
  useEffect(() => {
    console.log('errors:useEffect:::>>>', errors);
  }, [errors]);

  /******************************************************************************************/
  const getLanguage = async () => {
    const lang = await getData(Constants.SELECTED_LANGUAGE) || 'en'
    setLanguage(lang)
  }

  /******************************************************************************************/
  const checkValidations = () => {
    let errorsInner = errors;
    if (fromDate?.length == 0) {
      errorsInner = { ...errorsInner, fromDate: alertMessages.pleaseSelectDateOfBirth };
    } if (country.unique_id == '') {
      errorsInner = { ...errorsInner, country: alertMessages.pleaseSelectNationality };
    } if (documentNo == '') {
      errorsInner = { ...errorsInner, documentNo: alertMessages.pleaseEnterDocumentNo };
    } if (emergencyContact == '') {
      errorsInner = { ...errorsInner, emergencyContact: alertMessages.pleaseEnterEmergencyContact };
    } if (emergencyNumber == '') {
      errorsInner = { ...errorsInner, emergencyNumber: alertMessages.pleaseEnterEmergencyNumber };
    } if (frontBase64Images == '') {
      errorsInner = { ...errorsInner, frontID: alertMessages.pleaseUploadFrontIDphoto };
    } if (selfieBase64Images == '') {
      errorsInner = { ...errorsInner, selfie: alertMessages.pleaseUploadSelfieOfHandHoldingIDcard };
    } if (signatureBase64Images == '') {
      errorsInner = { ...errorsInner, signature1: alertMessages.pleaseUploadSignature };
    }
    //  if (signBase64Images == '') {
    //   ErrorsLocal.sign = alertMessages.pleaseSaveYourSignature;
    // } if (signBase64Images != '' && !disableReset) {
    //   ErrorsLocal.sign = alertMessages.pleaseSaveYourSignature;
    // }
    console.log('if::::', ErrorsLocal?.sign?.length, ErrorsLocal);
    if (
      errorsInner.frontID?.length == 0 &&
      errorsInner.selfie?.length == 0 &&
      errorsInner.fromDate?.length == 0 &&
      errorsInner.documentNo?.length == 0 &&
      errorsInner.country?.length == 0 &&
      errorsInner.signature1?.length == 0 &&
      errorsInner.emergencyContact?.length == 0 &&
      errorsInner.emergencyNumber?.length == 0
    ) {
      console.log('____');
      submitKYC();
    } else {
      setErrors(errorsInner);
    }
  };

  /******************************************************************************************/
  const submitKYC = () => {
    const formData = new FormData();
    formData.append('card_type', 'Physical');
    formData.append('card_id', props.physicalCardData?.card_id);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('dob', moment(fromDate).format('YYYY-MM-DD'));
    formData.append('docs_type', document);
    formData.append('nation', country.unique_id);
    formData.append('docs_number', documentNo);
    formData.append('files', {
      uri: frontId.uri,
      type: 'image/png',
      name: 'front_id_pic',
    });
    formData.append('files', {
      uri: selfie.uri,
      type: 'image/png',
      name: 'selfie',
    });
    formData.append('files', {
      uri: signature1.uri,
      type: 'image/png',
      name: 'sign',
    });
    formData.append('emergency_no', emergencyNumber);
    formData.append('emergency_contact', emergencyContact);
    // console.log('country::::::::', formData);
    setLoading(true);
    dispatch(userKyc(formData)).then(resKYC => {
      // console.log('resKYC:::::::', resKYC);
      setLoading(false);
      setAlertTxt(resKYC.message || alertMessages.kycDetailsSubmittedSuccessfully);
      setShowSuccessAlert(true);
    }).catch(err => {
      setLoading(false);
      console.log('err:::::::', err);
      setAlertTxt(err || alertMessages.somethingWentWrong);
      setShowAlertDialog(true);
    });
  };

  /******************************************************************************************/
  const requestExternalStoreageRead = async () => {
    try {
      if (Platform.OS == 'ios') return true;
      Singleton.isPermission = true
      Singleton.isCameraOpen = true;
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (Platform.Version >= 33) {
        return true;
      }
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        alert(alertMessages.grantStoragePermissionInSettings);
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  /******************************************************************************************/
  const uploadFile = (res, type, base64, file) => {
    // console.log(file, "res::::uploadFile", res);
    let filePath = file.uri
    let width = 1160
    let height = 2272
    let typeFile = 'JPEG'
    let quality = 100
    let rotation = 0
    let outputPath = null
    if (Platform.OS == 'android') {
      ImageResizer1?.createResizedImage(filePath, width, height, typeFile, 100, rotation).then((response) => {
        // console.log("response:::::::::ImageResizer", response);
        if (type == 'selfie') {
          setSelfieBase64Images(base64)
          setSelfie(response)
          setDocumentSelfie(response.uri)
          setErrors({ ...errors, selfie: '' })
        } else if (type == 'signature') {
          setSignature1(response)
          console.log("else::::");
          setSignatureBase64Images(base64)
          setDocumentSignature(response.uri)
          setErrors({ ...errors, signature1: '' })
        } else {
          setFrontId(response)
          console.log("else::::");
          setFrontBase64Images(base64)
          setDocumentFront(response.uri)
          setErrors({ ...errors, frontID: '' })
        }
      }).catch((err) => {
        console.log("err:::::::::ImageResizer", err);
      });
    } else {
      ImageResizer1.createResizedImage(filePath, width, height, typeFile, quality, rotation, outputPath).then((response) => {
        // console.log("response:::::::::ImageResizer", response);
        if (type == 'selfie') {
          setSelfieBase64Images(base64)
          setSelfie(response)
          setDocumentSelfie(response.uri)
          setErrors({ ...errors, selfie: '' })
        } else if (type == 'signature') {
          setSignature1(response)
          console.log("else::::");
          setSignatureBase64Images(base64)
          setDocumentSignature(response.uri)
          setErrors({ ...errors, signature1: '' })
        } else {
          setFrontId(response)
          console.log("else::::");
          setFrontBase64Images(base64)
          setDocumentFront(response.uri)
          setErrors({ ...errors, frontID: '' })
        }
      }).catch((err) => {
        console.log("err:::::::::ImageResizer", err);
      });
    }

  }

  /******************************************************************************************/
  const pickDocument = async (type, photoType) => {
    Singleton.isPermission = true;
    Singleton.isCameraOpen = true;
    if (photoType == 'gallery') {
      attachBtnClicked().then(res => {
        if (res.uri) {
          uploadFile(res.uri, type, res.base64, res)
        }
        console.log("res::::attachBtnClicked", res);
      }).catch(err => {
        console.log("err::::", err);
        setAlertTxt(err)
        setShowAlertDialog(true)
      })
    } else if (photoType == 'camera') {
      attachCameraClicked().then(res => {
        // console.log('res::::attachCameraClicked', res);
        if (res.uri) {
          uploadFile(res.uri, type, res.base64, res)
        }
      }).catch(err => {
        console.log("err::::", err);
        setAlertTxt(err)
        setShowAlertDialog(true)
      });
    }
  }

  /******************************************************************************************/
  const hideAlert = () => {
    setShowSuccessAlert(false);
    progStep = 2;
    setProgressStep(2);
  };

  /******************************************************************************************/
  const onImageUpload = async type => {
    global.imageUpload = true
    typeOfImg1 = type
    setTypeOfImg(type);
    setshowOptionModal(true);
    // global.imageUpload = true;
    // if (await requestExternalStoreageRead()) {
    //   pickDocument(type);
    // }
  };

  /******************************************************************************************/
  const selfieUpload = () => {
    Singleton.getInstance().cameraPermission().then(res => {
      if (res == 'granted') {
        Singleton.isPermission = true;
        Singleton.isCameraOpen = true;
        pickDocument('selfie', 'camera');
      }
    });
  }

  /******************************************************************************************/
  const updateImg = (img) => {
    setShowImgView(true);
    setImgView(img);
  }

  /******************************************************************************************/
  const stepOne = () => {
    return (
      <>
        <View style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.searchBg }]}>
          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={firstName}
            text={placeholderAndLabels.firstName}
            placeholder={placeholderAndLabels.firstName}
            placeholderTextColor={ThemeManager.colors.Text}
            inputStyle={{ color: ThemeManager.colors.Text, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            editable={false}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={lastName}
            placeholderTextColor={ThemeManager.colors.Text}
            inputStyle={{ color: ThemeManager.colors.Text, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            placeholder={placeholderAndLabels.lastName}
            text={placeholderAndLabels.lastName}
            editable={false}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            onPressTxt={() => { setshowFromDatePicker(true) }}
            textRight={fromDate ? moment(fromDate).format('DD MMM YYYY') : placeholderAndLabels.selectDOB}
            rightTxtStyle={{ color: ThemeManager.colors.lightText, marginLeft: 8 }}
            ViewStyle={{ paddingVertical: 8 }}
            dropDownView={true}
            text={placeholderAndLabels.dateOfBirth}
            rightImg={Images.rightArrowNew}
            bottomText={() => {
              return (<>{errors.fromDate?.length > 0 && (<Text style={styles.errorText}>{errors.fromDate}</Text>)}</>);
            }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            onPressTxt={() => setshowModalCodeCOuntry(true)}
            textRight={country.english ? country.english : placeholderAndLabels.selectNationality}
            rightTxtStyle={{ color: ThemeManager.colors.lightText }}
            ViewStyle={{ paddingVertical: 8 }}
            dropDownView={true}
            text={placeholderAndLabels.nationality}
            rightImg={Images.rightArrowNew}
            bottomText={() => {
              return (<>{errors.country?.length > 0 && (<Text style={styles.errorText}>{errors.country}</Text>)}</>);
            }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            hideImage={true}
            ViewStyle={{ paddingVertical: 8 }}
            rightImg={Images.rightArrowNew}
            disabled={true}
            dropDownView={true}
            textRight={document}
            text={placeholderAndLabels.documentType}
            placeholder={placeholderAndLabels.passport}
            disableTouch={true}
            placeholderTextColor={ThemeManager.colors.lightText}
            rightTxtStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right' }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={documentNo}
            text={placeholderAndLabels.documentNo}
            placeholder={placeholderAndLabels.enterDocumentNo}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right', minHeight: language == 'en' ? 0 : 85 }}
            rightImg={Images.rightArrowNew}
            onChangeText={text => {
              if (addressCheck(text)) {
                if (text?.length > 20) {
                  SetDocumentNo(text)
                  setErrors({ ...errors, documentNo: alertMessages.inputlimitexceed })
                } else {
                  SetDocumentNo(text)
                  setErrors({ ...errors, documentNo: '' })
                }
              } else if (text?.length < 2) {
                SetDocumentNo('');
                setErrors({ ...errors, documentNo: alertMessages.documentNumberIsMandatory });
              }
            }}
            onBlur={() => {
              if (documentNo?.length == 0) {
                setErrors({ ...errors, documentNo: alertMessages.documentNumberIsMandatory });
              }
            }}
            bottomText={() => {
              return (<>{errors.documentNo?.length > 0 && (<Text style={styles.errorText}>{errors.documentNo}</Text>)}</>);
            }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            isUpload={true}
            onPressImg={() => documentFront != '' ? updateImg(documentFront) : null}
            ViewStyle={{ paddingVertical: 8, width: '100%' }}
            text={placeholderAndLabels.frontIDphoto}
            righttopTxt={placeholderAndLabels.Upload}
            righttopTxtPress={() => { onImageUpload('front') }}
            UploadImgOne={documentFront != '' ? { uri: documentFront } : Images.frontIdImg}
            radiobtnStyle={{ backgroundColor: ThemeManager.colors.lightText, marginTop: 15 }}
            txtLineOne={merchantCard.pleaseUploadThePassportInformationPageWithOnAvatar}
            txtLineTwo={merchantCard.ensureIDframeCompleteFontClearBrightnessUniform}
            txtLineThree={merchantCard.photoShouldBeLessThenSupportJpgJpegPng}
            txtLineOneStyle={{ color: ThemeManager.colors.lightText, marginTop: 10 }}
            bottomText={() => {
              return (<>{errors.frontID?.length > 0 && (<Text style={styles.errorText}>{errors.frontID}</Text>)}</>);
            }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            isUpload={true}
            onPressImg={() => documentSelfie != '' ? updateImg(documentSelfie) : null}
            ViewStyle={{ paddingVertical: 8, width: '100%' }}
            text={placeholderAndLabels.SelfieOfHandHoldingIDcard}
            righttopTxt={placeholderAndLabels.Upload}
            righttopTxtPress={() => { onImageUpload('selfie') }}
            UploadImgOne={documentSelfie != '' ? { uri: documentSelfie } : Images.selfieHoldingImg}
            radiobtnStyle={{ backgroundColor: ThemeManager.colors.lightText, marginTop: 15 }}
            txtLineOne={merchantCard.pleaseUploadTheSelfieWithHoldingIDcard}
            txtLineTwo={merchantCard.takeSelfieWithHandHoldingPassportInformationPageWithAvater}
            txtLineOneStyle={{ color: ThemeManager.colors.lightText, marginTop: 10 }}
            bottomText={() => {
              return (<>{errors.selfie?.length > 0 && (<Text style={styles.errorText}>{errors.selfie}</Text>)}</>);
            }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            hideImg={documentSignature == '' ? true : false}
            isUpload={true}
            ViewStyle={{ paddingVertical: 8, width: '100%' }}
            text={placeholderAndLabels.Signature}
            righttopTxt={placeholderAndLabels.Upload}
            righttopTxtPress={() => { onImageUpload('signature') }}
            UploadImgOne={documentSignature != '' ? { uri: documentSignature } : ''}
            radiobtnStyle={{ backgroundColor: ThemeManager.colors.lightText, marginTop: 15 }}
            txtLineOne={merchantCard.pleaseUploadTheSignature}
            txtLineOneStyle={{ color: ThemeManager.colors.lightText, marginTop: 10 }}
            bottomText={() => {
              return (<>{errors.signature1?.length > 0 && <Text style={styles.errorText}>{errors.signature1}</Text>}</>)
            }}
          />
          {/* <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8, width: '100%' }}
            text={placeholderAndLabels.Signature}
            isSignature={true}
            righttopTxt={''}
            righttopTxtPress={() => { }}
            UploadImgOne={documentSelfie != '' ? { uri: documentSelfie } : Images.selfieHoldingImg}
            radiobtnStyle={{ backgroundColor: ThemeManager.colors.lightText, marginTop: 15 }}
            txtLineOne={merchantCard.pleaseUploadTheSelfieWithHoldingIDcard}
            txtLineTwo={merchantCard.takeSelfieWithHandHoldingPassportInformationPageWithAvater}
            txtLineOneStyle={{ color: ThemeManager.colors.lightText, marginTop: 10 }}
            bottomText={() => {
              return (<>{ErrorsLocal.sign?.length > 1 && (<Text style={styles.errorText}>{ErrorsLocal.sign}</Text>)}</>);
            }}
            onSaveSignature={sign => {
              setDisableReset(true);
              console.log('::::::sign:::::', sign);
              setSignBase64Images(sign);
              ErrorsLocal.sign = '';
            }}
            signatureComponent={() => {
              return (
                <>
                  <View style={styles.ViewStyle3}>
                    <SignatureCapture
                      style={styles.ViewStyle4}
                      ref={sign}
                      onSaveEvent={res => {
                        console.log(':::::');
                        console.log('res:::::', res);
                        setDisableReset(true);
                        setSignBase64Images(res?.encoded);
                        setSignatureFile(res);
                        ErrorsLocal.sign = '';
                      }}
                      onDragEvent={res => {
                        console.log('res::::onDragEvent:', res);
                        console.log('::documentNo:::', documentNo);
                        setDisableReset(false);
                        ErrorsLocal.sign = '';
                      }}
                      maxSize={500}
                      showNativeButtons={false}
                      showBorder={false}
                      saveImageFileInExtStorage={false}
                      showTitleLabel={false}
                      minStrokeWidth={2}
                      maxStrokeWidth={2}
                      viewMode={'portrait'}
                      backgroundColor="#F1F5F9"
                    />
                  </View>
                  <View style={styles.ViewStyle5}>
                    <TouchableOpacity
                      style={styles.buttonStyle}
                      onPress={() => { saveSign() }}>
                      <Text style={styles.buttonText}>{merchantCard.save}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonStyle2}
                      onPress={() => { resetSign() }}>
                      <Text style={[styles.buttonText, { color: ThemeManager.colors.settingsText }]}>{merchantCard.reset}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            }}
            signature={signature}
          /> */}
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8, alignItems: 'flex-start' }}
            value={emergencyContact}
            text={placeholderAndLabels.emergencyContact}
            placeholder={placeholderAndLabels.pleaseEntertheName}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right', minHeight: language == 'en' ? 60 : 85 }}
            rightImg={Images.rightArrowNew}
            onChangeText={text => {
              if (wordsWithSpace(text)) {
                SetemergencyContact(text);
                setErrors({ ...errors, emergencyContact: '' });
              } else if (text?.length < 2) {
                SetemergencyContact('');
                setErrors({ ...errors, emergencyContact: alertMessages.emergencyContactIsMandatory });
              }
            }}
            onBlur={() => {
              if (emergencyContact?.length == 0) {
                setErrors({ ...errors, emergencyContact: alertMessages.emergencyContactIsMandatory });
              }
            }}
            bottomText={() => {
              return (<>{errors.emergencyContact?.length > 0 && (<Text style={[styles.errorText, { alignSelf: 'flex-end' }]}>{errors.emergencyContact}</Text>)}</>);
            }}
          />
          {/* ----------------------------------------------------------- */}
          <CardViewVirtualPhy
            hideBottom={true}
            ViewStyle={{ paddingVertical: 8, alignItems: 'flex-start' }}
            value={emergencyNumber}
            keyboardType="number-pad"
            text={placeholderAndLabels.emergencyNumber}
            placeholder={placeholderAndLabels.pleaseEnterNumber}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right', minHeight: language == 'en' ? 60 : 85 }}
            rightImg={Images.rightArrowNew}
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                SetemergencyNumber(text);
                setErrors({ ...errors, emergencyNumber: '' });
              } else if (text?.length < 2) {
                SetemergencyNumber('');
                setErrors({ ...errors, emergencyNumber: alertMessages.emergencyNumberMandatory });
              }
            }}
            onBlur={() => {
              if (emergencyNumber?.length == 0) {
                setErrors({ ...errors, emergencyNumber: alertMessages.emergencyNumberMandatory });
              }
            }}
            bottomText={() => {
              return (<>{errors.emergencyNumber?.length > 0 && (<Text style={styles.errorText}>{errors.emergencyNumber}</Text>)}</>);
            }}
          />
        </View>
        {/* ----------------------------------------------------------- */}
        <Button
          buttontext={merchantCard.submit}
          myStyle={{ marginTop: 30, marginBottom: 17, marginHorizontal: 20 }}
          onPress={() => { checkValidations() }}
        />
      </>
    );
  };

  /******************************************************************************************/
  const stepTwo = () => {
    return (
      <View style={[styles.ViewStyle2]}>
        <View style={styles.reviewContainer}>
          <CustomStatus
            animation={ThemeManager.ImageIcons.review}
            titleText={placeholderAndLabels.informationInReview}
            text={merchantCard.kycInreviewProcessTime}
            style={{ top: -70 }}
            titleStyle={{ marginTop: -30, fontSize: 18 }}
            textStyle={{ marginTop: 10, marginHorizontal: 40 }}
          />
        </View>
        <Button
          buttontext={merchantCard.done}
          myStyle={{ marginTop: 30, marginBottom: 17, width: '100%', bottom: 0 }}
          onPress={() => {
            Singleton.getInstance().physicalCardStatus = 'Activation In Progress';
            Actions.currentScene !== 'PrepaidCard' && Actions.PrepaidCard({ isKyc: true, from: props.from == 'ReApply' ? 'ReApplyPhysicalCard' : 'ApplyPhysicalCard' });
          }}
        />
      </View>
    );
  };

  /******************************************************************************************/
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        expandHeader
        backCallBack={() => {
          console.log('progStep', progStep);
          Actions.pop();
        }}
        BackButtonText={merchantCard.applyforTriskelCard}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      {/* ********************************************************Modal for from Date******************************************************* */}
      <DatePicker
        modal
        theme={themeSelected == 2 ? 'light' : Platform.OS == 'android' ? 'auto' : 'dark'}
        mode="date"
        open={showFromDatePicker}
        dateFormat="DD-MM-YYYY"
        date={fromDate ? fromDate : new Date(moment(new Date()).subtract(18, 'years'))}
        maximumDate={new Date(moment(new Date()).subtract(18, 'years'))}
        confirmText={merchantCard.confirm}
        onConfirm={date => {
          setminimumDate(date);
          setfromDate(new Date(date));
          setErrors({ ...errors, fromDate: '' });
          setshowFromDatePicker(false);
        }}
        onCancel={() => setshowFromDatePicker(false)}
        androidVariant="iosClone"
        style={{ marginVertical: Platform.OS == 'android' ? 20 : 5 }}
      />

      {/* /****************************************************************************************** */}
      <ModalCountryList
        clearSearch={true}
        showCountry={true}
        openModel={showModalCodeCOuntry}
        countryList={countryList}
        onPressIn={() => setshowModalCodeCOuntry(false)}
        onpressItem={item => {
          // console.log('item:::', item);
          setCountry(item);
          setErrors({ ...errors, country: '' });
          setshowModalCodeCOuntry(false);
        }}
        onClearSearch={() => { setCountryList(fullCountryList) }}
        searchCountry={text => {
          if (text?.length == 0) {
            setCountryList(fullCountryList);
          } else {
            let list = fullCountryList.filter(country => country.english.toLowerCase().includes(text.toLowerCase()) || country.mobile_area_code.toString()?.toLowerCase().includes(text.toLowerCase()));
            // console.log('list', list);
            setCountryList(list);
          }
        }}
      />

      {/* /****************************************************************************************** */}
      <ModalCountryList
        heading={placeholderAndLabels.chooseDocumentType}
        openModel={showModalDocument}
        list={DocumentList}
        onpressItem={item => { setshowModalDocument(false); SetDocument(item.title) }}
        onPressIn={() => { setshowModalDocument(false) }}
      />

      {/* /****************************************************************************************** */}
      <ModalCoinList
        title={placeholderAndLabels.select}
        contactUs={true}
        list={optionList}
        openModel={showOptionModal}
        onPressIn={() => setshowOptionModal(false)}
        onPress={async item => {
          setshowOptionModal(false);
          if (item == 'Camera') {
            Singleton.getInstance().cameraPermission().then(res => {
              if (res == 'granted') {
                Singleton.isPermission = true;
                Singleton.isCameraOpen = true;
                pickDocument(typeOfImg, 'camera');
              }
            });
          } else {
            if (await requestExternalStoreageRead()) {
              Singleton.isPermission = true;
              Singleton.isCameraOpen = true;
              pickDocument(typeOfImg, 'gallery');
            }
          }
        }}
      />

      {/* *****************************progress View************************* */}
      <View style={{ marginHorizontal: 20 }}>
        <CustomInprogress
          showOnlyTwoProg={true}
          showprogTwo={progressStep == 1 ? false : true}
          progOneTxt={'1'}
          progTwoTxt={'2'}
          txtTwoStyle={{ color: progressStep == 2 ? ThemeManager.colors.text_Color : ThemeManager.colors.lightText, right: -40 }}
          progressView={{ backgroundColor: ThemeManager.colors.activeTab, borderColor: ThemeManager.colors.settingBg }}
          progressViewEmpty={{ backgroundColor: 'transparent', borderColor: ThemeManager.colors.settingBg }}
          horizontalLine={{ backgroundColor: ThemeManager.colors.horizontalLine }}
          progTxt={{ color: ThemeManager.colors.pieInnerColor }}
          firstCont={placeholderAndLabels.userKYC}
          secCont={merchantCard.reviewInformation}
          containerView={{ marginHorizontal: 40 }}
        />
      </View>

      {/* ********************************************************** img Preview Modal ******************************************************* */}
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={showImgView}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.colorVariation }}>
          <View style={{ backgroundColor: 'black', flex: 1, marginTop: Platform.OS == 'ios' ? 0 : -35 }}>
            <Header backCallBack={() => setShowImgView(false)} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} BackButtonText={merchantCard.doc} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <FastImage
                resizeMode={'contain'}
                style={{ width: '93%', height: '100%', alignSelf: 'center' }}
                source={{ uri: ImgView }}
              />
            </View>
          </View>
        </SafeAreaView>
        <SafeAreaView style={{ backgroundColor: 'black', }} />
      </Modal>

      {progressStep == 1 ? (
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS == 'ios' ? false : true}
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          extraScrollHeight={Platform.OS == 'ios' ? 50 : 50}
          contentContainerStyle={{ paddingBottom: 0 }}>
          {stepOne()}
        </KeyboardAwareScrollView>
      ) : (
        <View style={{ flex: 1 }}>{stepTwo()}</View>
      )}
      {/* ----------------------------------------------------------- */}
      {showSuccessAlert && (
        <AppAlert
          showSuccess={true}
          alertTxt={alertTxt}
          hideAlertDialog={() => { hideAlert() }}
        />
      )}
      {/* ----------------------------------------------------------- */}
      {showAlertDialog && (
        <AppAlert
          showSuccess={false}
          alertTxt={alertTxt}
          hideAlertDialog={() => { setShowAlertDialog(false) }}
        />
      )}
      <LoaderView isLoading={loading} />
    </View>
  );
};

export default ActivePhysicalCard;
const styles = StyleSheet.create({
  ViewStyle5: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ViewStyle4: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    borderColor: '#99A5B4',
    borderWidth: 1,
  },
  ViewStyle3: {
    width: '100%',
    borderColor: '#99A5B4',
    borderWidth: 1,
  },
  ViewStyle2: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  ViewStyle1: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  reviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.dmMedium,
  },
  errorText: {
    fontFamily: Fonts.dmRegular,
    color: Colors.lossColor,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'right',
  },
  buttonStyle2: {
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingLeft: 20,
  },
  buttonStyle: {
    alignItems: 'flex-end',
    paddingTop: 20,
  },
});
