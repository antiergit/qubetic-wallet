import { View, Text, StyleSheet, BackHandler, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Actions } from 'react-native-router-flux'
import { ThemeManager } from '../../../../ThemeManager'
import { AppAlert, Button, Header, LoaderView, ModalCoinList } from '../../common'
import CustomInprogress from '../../common/CustomInprogress'
import { CardViewVirtualPhy } from '../../common/CardViewVirtualPhy'
import { Colors, Fonts, Images } from '../../../theme'
import DatePicker from 'react-native-date-picker';
import moment from 'moment'
import CustomStatus from '../PrepaidCard/CustomStatus'
import Singleton from '../../../Singleton'
import { ModalCountryList } from '../../common/ModalCountryList'
import { EventRegister } from 'react-native-event-listeners'
import * as Constants from '../../../Constants';
import { addressCheck, phoneNoCheck, wordsWithOutSpace, wordsWithSpace } from '../../../Utils'
import { attachBtnClicked, attachCameraClicked } from '../../../Utils/MethodsUtils'
import { useDispatch } from 'react-redux'
import { getUspUserDetails, uploadKycDetails } from '../../../Redux/Actions'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { useRef } from 'react'
const RNFS = require('react-native-fs');
// import ImageResizer from '@bam.tech/react-native-image-resizer';
import ImageResizer1 from '@bam.tech/react-native-image-resizer';
import { LanguageManager } from '../../../../LanguageManager'
let progStep = 1
let DocumentList = [
  {
    title: "Passport",
    id: 1,
  }
]
let ErrorsLocal = {
  sign: '.'
}

/******************************************************************************************/
const USPrefCardKYC = (props) => {
  const dispatch = useDispatch();
  let typeOfImg1 = '';
  const { alertMessages, merchantCard, placeholderAndLabels } = LanguageManager;
  const genderList = [merchantCard.male, merchantCard.female]
  const optionList = [placeholderAndLabels.camera, placeholderAndLabels.gallery]
  const [progressStep, setProgressStep] = useState(1)
  const [showFromDatePicker, setshowFromDatePicker] = useState(false)
  const [showDocExpiryPicker, setshowDocExpiryPicker] = useState(false)
  const [todayDate, setTodayDate] = useState(new Date())
  const [minimumDate, setminimumDate] = useState(new Date())
  const [fromDate, setfromDate] = useState("")
  const [documentNo, SetDocumentNo] = useState("")
  const [emergencyContact, SetemergencyContact] = useState("")
  const [emergencyNumber, SetemergencyNumber] = useState("")
  const [showModalCodeCOuntry, setshowModalCodeCOuntry] = useState(false)
  const [country, setCountry] = useState({ english: '', unique_id: '' })
  const [showModalDocument, setshowModalDocument] = useState(false)
  const [document, SetDocument] = useState(placeholderAndLabels?.passport);
  const [documentFront, setDocumentFront] = useState('')
  const [documentSignature, setDocumentSignature] = useState('')
  const [documentSelfie, setDocumentSelfie] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [state, set_State] = useState('')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState('')
  const [zipCode, setzipCode] = useState('')
  const [docExpiry, setDocExpiry] = useState('')
  const [countryList, setCountryList] = useState([])
  const [fullCountryList, setFullCountryList] = useState([])
  const [frontBase64Images, setFrontBase64Images] = useState('')
  const [selfieBase64Images, setSelfieBase64Images] = useState('')
  const [signBase64Images, setSignBase64Images] = useState('')
  const [alertTxt, setAlertTxt] = useState('')
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState('')
  const [signatureFile, setSignatureFile] = useState('')
  const [disableReset, setDisableReset] = useState(false)
  const [showGenderModal, setshowGenderModal] = useState(false)
  const [showOptionModal, setshowOptionModal] = useState(false)
  const [typeOfImg, setTypeOfImg] = useState('')
  const [frontId, setFrontId] = useState('')
  const [signature1, setSignature1] = useState('')
  const [signatureBase64Images, setSignatureBase64Images] = useState('')
  const [selfie, setSelfie] = useState('')
  const [userData, setUserData] = useState('')
  const [errors, setErrors] = useState({
    lastName: '',
    address: '',
    state: '',
    city: '',
    gender: '',
    zipCode: '',
    fromDate: '',
    documentNo: '',
    docExpiry: '',
    // country: '',
    emergencyContact: '',
    // emergencyNumber: '',
    documentFront: '',
    signature1: '',
    documentSelfie: '',
    signature: '',
    frontID: '',
    selfie: '',
    sign: ''
  })

  const sign = useRef(null);
  /******************************************************************************************/
  const resetSign = () => {
    setDisableReset(false);
    setSignBase64Images('');
    sign.current.resetImage()
    ErrorsLocal.sign = placeholderAndLabels.SignatureMandatory
    // setErrors({ ...errors, sign: placeholderAndLabels.SignatureMandatory })
  }

  /******************************************************************************************/
  const saveSign = () => {
    sign.current.saveImage()
    ErrorsLocal.sign = "."
    setErrors({ ...errors, sign: '' })
  }

  /******************************************************************************************/
  useEffect(() => {
    getUser_Details();
    props.navigation.addListener('didFocus', () => {
      EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
        setshowDocExpiryPicker(false)
        setShowAlertDialog(false);
        setshowFromDatePicker(false)
        setshowModalCodeCOuntry(false);
        setshowGenderModal(false);
        setshowOptionModal(false);
      })
      BackHandler.addEventListener("hardwareBackPress", () => {
        Actions.USPreferdCardScreen({ usCardData: props.usCardData })
        // Actions.PrepaidCard({ isKyc: true })
        return true
      })
      // setLoading(true);
    })
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener("hardwareBackPress")
      EventRegister.removeEventListener(Constants.DOWN_MODAL)
    })
  }, [])

  /******************************************************************************************/
  useEffect(() => {
    console.log("errors:useEffect:::>>>", errors);
  }, [errors])

  /******************************************************************************************/
  const getUser_Details = () => {
    console.log('chk usCardData:::::', props.usCardData)
    setLoading(true);
    const data = {
      cardId: props.usCardData?.card_type?.toLowerCase() == 'us_preferred' ? props.usCardData?.card_id : ''
    }
    dispatch(getUspUserDetails({ data })).then(res => {
      console.log('chk getUserDetails::::', res);
      setUserData(res);
      setLoading(false);
    }).catch(err => {
      setShowAlertDialog(true);
      setAlertTxt(err)
      setLoading(false);
    })
  }

  /******************************************************************************************/
  const checkValidations = () => {
    let errorsInner = errors;
    if (address?.length == 0) {
      errorsInner = { ...errorsInner, address: alertMessages.addressMandatory };
    } if (state?.length == 0) {
      errorsInner = { ...errorsInner, state: alertMessages.stateMandatory };
    } if (city?.length == 0) {
      errorsInner = { ...errorsInner, city: alertMessages.cityIsMandatory };
    } if (gender?.length == 0) {
      errorsInner = { ...errorsInner, gender: alertMessages.genderMandatory };
    } if (zipCode?.length == 0) {
      errorsInner = { ...errorsInner, zipCode: alertMessages.zipCodeMandatory };
    } if (fromDate?.length == 0) {
      errorsInner = { ...errorsInner, fromDate: alertMessages.pleaseSelectDateOfBirth };
    } if (documentNo == '') {
      errorsInner = { ...errorsInner, documentNo: alertMessages.pleaseEnterDocumentNo };
    } if (docExpiry == '') {
      errorsInner = { ...errorsInner, docExpiry: alertMessages.pleaseEnterDocumentExpiry };
    } if (emergencyContact == '') {
      errorsInner = { ...errorsInner, emergencyContact: alertMessages.pleaseEnterEmergencyContact };
    } if (frontBase64Images == '') {
      errorsInner = { ...errorsInner, frontID: alertMessages.pleaseUploadFrontIDphoto };
    } if (selfieBase64Images == '') {
      errorsInner = { ...errorsInner, selfie: alertMessages.pleaseUploadSelfieOfHandHoldingIDcard };
    } if (signatureBase64Images == '') {
      errorsInner = { ...errorsInner, signature1: alertMessages.pleaseUploadSignature };
    }

    // if (signBase64Images == '') {
    //   ErrorsLocal.sign = alertMessages.pleaseSaveYourSignature;
    //   errorsInner = { ...errorsInner, sign: alertMessages.pleaseSaveYourSignature };
    // } if (signBase64Images != '' && !disableReset) {
    //   ErrorsLocal.sign = alertMessages.pleaseSaveYourSignature;
    //   errorsInner = { ...errorsInner, sign: alertMessages.pleaseSaveYourSignature };
    // }
    console.log('if::::', ErrorsLocal?.sign?.length, ErrorsLocal);
    // if (ErrorsLocal?.sign?.length == 1 && errorsInner.address?.length == 0 && errorsInner.city?.length == 0 && errorsInner.docExpiry?.length == 0 && errorsInner.gender?.length == 0 && errorsInner.state?.length == 0 && errorsInner.zipCode?.length == 0 && errorsInner.frontID?.length == 0 && errorsInner.selfie?.length == 0 && errorsInner.fromDate?.length == 0 && errorsInner.documentNo?.length == 0 && errorsInner.emergencyContact?.length == 0) {
    if (errorsInner.address?.length == 0 && errorsInner.city?.length == 0 && errorsInner.docExpiry?.length == 0 && errorsInner.gender?.length == 0 && errorsInner.state?.length == 0 && errorsInner.zipCode?.length == 0 && errorsInner.frontID?.length == 0 && errorsInner.selfie?.length == 0 && errorsInner.fromDate?.length == 0 && errorsInner.documentNo?.length == 0 && errorsInner.signature1?.length == 0 && errorsInner.emergencyContact?.length == 0) {
      console.log('____');
      submitKYC();
    } else {
      setErrors(errorsInner);
    }
  };


  /******************************************************************************************/
  const submitKYC = () => {
    const formData = new FormData();
    formData.append("email", userData?.email);
    formData.append("first_name", userData?.first_name);
    formData.append("last_name", userData?.last_name);
    formData.append("phone_number", userData?.phone_number);
    formData.append("mobile_code", `+${userData?.mobile_code}`);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("unique_id", userData?.unique_id);
    formData.append("doc_no", documentNo);
    formData.append("emergency_contact", emergencyContact);
    formData.append("gender", gender?.toLowerCase() == 'male' ? 1 : 2);
    formData.append("state", state);
    formData.append("zip_code", zipCode);
    formData.append("birthday", moment(fromDate).format('YYYY-MM-DD'));
    formData.append("doc_expire_date", moment(docExpiry).format('YYYY-MM-DD'));
    formData.append("cardId", props.usCardData?.card_type?.toLowerCase() == 'us_preferred' ? props.usCardData?.card_id : '');
    formData.append("docs_type", document);

    formData.append("files", {
      uri: frontId.uri,//BASE_IMAGE_URL + frontId.file_name,//
      type: "image/png",
      name: "front_id_pic",
    });
    formData.append("files", {
      uri: selfie.uri,//BASE_IMAGE_URL + selfie.file_name,//
      type: "image/png",
      name: "selfie",
    });
    formData.append("files", {
      uri: signature1.uri,// signatureFile.pathName,
      type: "image/png",
      name: "sign",
    });
    console.log("country::::::::", formData);

    setLoading(true)
    dispatch(uploadKycDetails(formData)).then(resKYC => {
      console.log("resKYC:::::::", resKYC);
      setLoading(false)
      setAlertTxt(resKYC.message || alertMessages.kycDetailsSubmittedSuccessfully)
      setShowSuccessAlert(true)
    }).catch(err => {
      setLoading(false)
      console.log("err:::::::", err);
      setAlertTxt(err || alertMessages.somethingWentWrong)
      setShowAlertDialog(true)
    })
  }

  /******************************************************************************************/
  const requestExternalStoreageRead = async () => {
    try {
      if (Platform.OS == "ios")
        return true;
      Singleton.isPermission = true
      Singleton.isCameraOpen = true
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (Platform.Version >= 33) {
        return true
      }
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        return true
      }
      else {
        alert(alertMessages.grantStoragePermissionInSettings);
        return false
      }
    }
    catch (err) {
      return false;
    }
  }

  /******************************************************************************************/
  const uploadFile = (res, type, base64, file) => {
    console.log(file, "res::::uploadFile", res);
    let filePath = file.uri
    let width = 350
    let height = 350
    let typeFile = 'JPEG'
    let quality = 250
    let rotation = 0
    let outputPath = null
    if (Platform.OS == 'android') {
      ImageResizer1?.createResizedImage(filePath, width, height, typeFile, 100, rotation).then((response) => {
        console.log("response:::::::::ImageResizer", response);
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
        console.log("response:::::::::ImageResizer", response);
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
    console.log(photoType, 'typeOfImg:::::', type)
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
        console.log('res::::attachCameraClicked', res);
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
    setShowSuccessAlert(false)
    progStep = 2
    setProgressStep(2)
  }

  /******************************************************************************************/
  const onImageUpload = async (type) => {
    global.imageUpload = true
    typeOfImg1 = type
    setTypeOfImg(type);
    setshowOptionModal(true);
  }

  /******************************************************************************************/
  const stepOne = () => {
    const { alertMessages } = LanguageManager
    return (
      <>
        <View style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.settingBg }]}>
          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={userData?.email || ''}
            text={placeholderAndLabels.email}
            placeholder={placeholderAndLabels.email}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            editable={false}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={userData?.first_name || ''}
            text={placeholderAndLabels.firstName}
            placeholder={placeholderAndLabels.firstName}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            editable={false}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={userData?.last_name || ''}
            placeholderTextColor={ThemeManager.colors.lightText}
            rightImg={Images.rightArrowNew}
            placeholder={placeholderAndLabels.lastName}
            text={placeholderAndLabels.lastName}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            editable={false}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={userData ? `+${userData?.mobile_code} ${userData?.phone_number}` : ''}
            text={placeholderAndLabels.phoneNumber}
            placeholder={placeholderAndLabels.phoneNumber}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            editable={false}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={address}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            placeholder={placeholderAndLabels.address}
            text={placeholderAndLabels.address}
            editable={true}
            onChangeText={(text) => {
              if (addressCheck(text)) {
                if (text.length > 100) {
                  set_State(text)
                  setErrors({ ...errors, state: alertMessages.inputlimitexceed })
                } else {
                  setAddress(text)
                  setErrors({ ...errors, address: '' })
                }
              } else if (text.length < 2) {
                setAddress('')
                setErrors({ ...errors, address: alertMessages.addressMandatory })
              }
            }}
            onBlur={() => {
              if (address.length < 2) {
                setAddress('')
                setErrors({ ...errors, address: alertMessages.addressMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.address.length > 0 && <Text style={styles.errorText}>{errors.address}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={state}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            placeholder={merchantCard.state}
            text={merchantCard.state}
            editable={true}
            onChangeText={(text) => {
              if (wordsWithOutSpace(text)) {
                if (text.length > 20) {
                  set_State(text)
                  setErrors({ ...errors, state: alertMessages.inputlimitexceed })
                } else {
                  set_State(text)
                  setErrors({ ...errors, state: '' })
                }
              } else if (text.length < 2) {
                set_State('')
                setErrors({ ...errors, state: alertMessages.stateMandatory })
              }
            }}
            onBlur={() => {
              if (state.length < 2) {
                set_State('')
                setErrors({ ...errors, state: alertMessages.stateMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.state.length > 0 && <Text style={styles.errorText}>{errors.state}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={city}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            placeholder={merchantCard.city}
            text={merchantCard.city}
            editable={true}
            onChangeText={(text) => {
              if (wordsWithOutSpace(text)) {
                if (text.length > 20) {
                  setCity(text)
                  setErrors({ ...errors, city: alertMessages.inputlimitexceed })
                } else {
                  setCity(text)
                  setErrors({ ...errors, city: '' })
                }
              } else if (text.length < 2) {
                setCity('')
                setErrors({ ...errors, city: alertMessages.cityIsMandatory })
              }
            }}
            onBlur={() => {
              if (city.length < 2) {
                setCity('')
                setErrors({ ...errors, city: alertMessages.cityIsMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.city.length > 0 && <Text style={styles.errorText}>{errors.city}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            onPressTxt={() => setshowGenderModal(true)}
            textRight={gender ? gender : merchantCard.gender}
            rightTxtStyle={{ color: ThemeManager.colors.lightText }}
            ViewStyle={{ paddingVertical: 8 }}
            dropDownView={true}
            text={merchantCard.gender}
            rightImg={Images.rightArrowNew}
            bottomText={() => {
              return (<>{errors.gender.length > 0 && <Text style={styles.errorText}>{errors.gender}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={zipCode}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            placeholder={merchantCard.zip_code}
            text={merchantCard.zip_code}
            editable={true}
            keyboardType="number-pad"
            onChangeText={(text) => {
              if (phoneNoCheck(text)) {
                if (text.length > 10) {
                  setzipCode(text)
                  setErrors({ ...errors, zipCode: alertMessages.inputlimitexceed })
                } else {
                  setzipCode(text)
                  setErrors({ ...errors, zipCode: '' })
                }
              } else if (text.length < 2) {
                setzipCode('')
                setErrors({ ...errors, zipCode: alertMessages.zipCodeMandatory })
              }
            }}
            onBlur={() => {
              if (zipCode.length < 2) {
                setzipCode('')
                setErrors({ ...errors, zipCode: alertMessages.zipCodeMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.zipCode.length > 0 && <Text style={styles.errorText}>{errors.zipCode}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            onPressTxt={() => { setshowFromDatePicker(true) }}
            textRight={fromDate ? moment(fromDate).format('DD MMM YYYY') : placeholderAndLabels.selectDOB}
            rightTxtStyle={{ color: ThemeManager.colors.lightText }}
            ViewStyle={{ paddingVertical: 8 }}
            dropDownView={true}
            text={placeholderAndLabels.dateOfBirth}
            rightImg={Images.rightArrowNew}
            bottomText={() => {
              return (<>{errors.fromDate.length > 0 && <Text style={styles.errorText}>{errors.fromDate}</Text>}</>)
            }}
          />

          {/* <CardViewVirtualPhy
            onPressTxt={() => setshowModalCodeCOuntry(true)}
            textRight={country.english ? country.english : placeholderAndLabels.selectNationality}
            rightTxtStyle={{ color: ThemeManager.colors.lightText }}
            ViewStyle={{ paddingVertical: 8 }}
            dropDownView={true}
            text={placeholderAndLabels.nationality}
            rightImg={Images.rightArrowNew}
            bottomText={() => {
              return (<>{errors.country.length > 0 && <Text style={styles.errorText}>{errors.country}</Text>}</>)
            }}
          /> */}

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            // rightImg={Images.rightArrowNew}
            disabled={true}
            dropDownView={true}
            textRight={document}
            text={placeholderAndLabels.documentType}
            placeholder={placeholderAndLabels.passport}
            disableTouch={true}
            placeholderTextColor={ThemeManager.colors.colorVariation}
            inputStyle={{ color: ThemeManager.colors.colorVariation, textAlign: 'right' }}
          />

          <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={documentNo}
            text={placeholderAndLabels.documentNo}
            placeholder={placeholderAndLabels.enterDocumentNo}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            onChangeText={(text) => {
              if (addressCheck(text)) {
                if (text.length > 20) {
                  SetDocumentNo(text)
                  setErrors({ ...errors, documentNo: alertMessages.inputlimitexceed })
                } else {
                  SetDocumentNo(text)
                  setErrors({ ...errors, documentNo: '' })
                }
              } else if (text.length < 2) {
                SetDocumentNo('')
                setErrors({ ...errors, documentNo: alertMessages.documentNumberIsMandatory })
              }
            }}
            onBlur={() => {
              if (documentNo.length == 0) {
                setErrors({ ...errors, documentNo: alertMessages.documentNumberIsMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.documentNo.length > 0 && <Text style={styles.errorText}>{errors.documentNo}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            onPressTxt={() => { setshowDocExpiryPicker(true) }}
            textRight={docExpiry ? moment(docExpiry).format('DD MMM YYYY') : placeholderAndLabels.enterDocumentExpiry}
            rightTxtStyle={{ color: ThemeManager.colors.lightText }}
            ViewStyle={{ paddingVertical: 8 }}
            dropDownView={true}
            textStyle11={{ width: '45%', textAlign: 'left' }}
            text={placeholderAndLabels.documentExpiry}
            rightImg={Images.rightArrowNew}
            bottomText={() => {
              return (<>{errors.docExpiry.length > 0 && <Text style={styles.errorText}>{errors.docExpiry}</Text>}</>)
            }}
          />

          {/* <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8 }}
            value={docExpiry}
            text={placeholderAndLabels.documentExpiry}
            placeholder={placeholderAndLabels.enterDocumentExpiry}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            onChangeText={(text) => {
              if (phoneNoCheck(text)) {
                setDocExpiry(text)
                setErrors({ ...errors, docExpiry: '' })
              } else if (text.length < 2) {
                setDocExpiry('')
                setErrors({ ...errors, docExpiry: alertMessages.documentExpNumberIsMandatory })
              }
            }}
            onBlur={() => {
              if (docExpiry.length == 0) {
                setErrors({ ...errors, docExpiry: alertMessages.documentExpNumberIsMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.docExpiry.length > 0 && <Text style={styles.errorText}>{errors.docExpiry}</Text>}</>)
            }}
          /> */}

          <CardViewVirtualPhy
            isUpload={true}
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
              return (<>{errors.frontID.length > 0 && <Text style={styles.errorText}>{errors.frontID}</Text>}</>)
            }}
          />

          <CardViewVirtualPhy
            isUpload={true}
            ViewStyle={{ paddingVertical: 8, width: '100%' }}
            text={placeholderAndLabels.SelfieOfHandHoldingIDcard}
            righttopTxt={placeholderAndLabels.Upload}
            righttopTxtPress={() => { pickDocument('selfie', 'camera'); }}
            UploadImgOne={documentSelfie != '' ? { uri: documentSelfie } : Images.selfieHoldingImg}
            radiobtnStyle={{ backgroundColor: ThemeManager.colors.lightText, marginTop: 15 }}
            txtLineOne={merchantCard.pleaseUploadTheSelfieWithHoldingIDcard}
            txtLineTwo={merchantCard.takeSelfieWithHandHoldingPassportInformationPageWithAvater}
            txtLineOneStyle={{ color: ThemeManager.colors.lightText, marginTop: 10 }}
            bottomText={() => {
              return (<>{errors.selfie.length > 0 && <Text style={styles.errorText}>{errors.selfie}</Text>}</>)
            }}
          />

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
              return (<>{errors.signature1.length > 0 && <Text style={styles.errorText}>{errors.signature1}</Text>}</>)
            }}
          />

          {/* <CardViewVirtualPhy
            ViewStyle={{ paddingVertical: 8, width: '100%' }}
            text={placeholderAndLabels.Signature}
            isSignature={true}
            righttopTxt={''}
            righttopTxtPress={() => { }}
            radiobtnStyle={{ backgroundColor: ThemeManager.colors.lightText, marginTop: 15 }}
            txtLineOne={merchantCard.pleaseUploadTheSelfieWithHoldingIDcard}
            txtLineTwo={merchantCard.takeSelfieWithHandHoldingPassportInformationPageWithAvater}
            txtLineOneStyle={{ color: ThemeManager.colors.lightText, marginTop: 10 }}
            bottomText={() => {
              return (<>{errors.sign?.length > 1 && <Text style={styles.errorText}>{errors.sign}</Text>}</>)
            }}
            onSaveSignature={(sign) => {
              setDisableReset(true)
              // console.log("::::::sign:::::", sign);
              setSignBase64Images(sign)
              setErrors({ ...errors, sign: '' })
              ErrorsLocal.sign = "."
            }}
            signatureComponent={() => {
              return (
                <>
                  <View style={{ width: '100%', borderColor: '#99A5B4', borderWidth: 1, }}>
                    <SignatureCapture
                      style={{ width: '100%', height: 100, borderRadius: 10, borderColor: '#99A5B4', borderWidth: 1 }}
                      ref={sign}
                      onSaveEvent={(res) => {
                        console.log(":::::");
                        console.log("res:::::", res);
                        setDisableReset(true)
                        setSignBase64Images(res?.encoded)
                        setSignatureFile(res)
                        ErrorsLocal.sign = "."
                      }}
                      onDragEvent={(res) => {
                        console.log("res::::onDragEvent:", res);
                        console.log("::documentNo:::", documentNo);
                        setDisableReset(false)
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

                  <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }}>
                    <TouchableOpacity disabled={disableReset} style={styles.buttonStyle} onPress={() => { saveSign() }} >
                      <Text style={[styles.buttonText, { color: disableReset ? ThemeManager.colors.lightText : ThemeManager.colors.settingsText }]}>{merchantCard.save}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle2} onPress={() => { resetSign() }} >
                      <Text style={[styles.buttonText, { color: ThemeManager.colors.settingsText }]}>{merchantCard.reset}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            }}
            signature={signature}
          /> */}

          <CardViewVirtualPhy
            hideBottom={true}
            ViewStyle={{ paddingVertical: 8, alignItems: 'flex-start' }}
            value={emergencyContact}
            text={placeholderAndLabels.emergencyContact}
            placeholder={placeholderAndLabels.pleaseEntertheName}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right', minHeight: 60 }}
            rightImg={Images.rightArrowNew}
            onChangeText={(text) => {
              if (wordsWithSpace(text)) {
                SetemergencyContact(text)
                setErrors({ ...errors, emergencyContact: '' })
              } else if (text.length < 2) {
                SetemergencyContact('')
                setErrors({ ...errors, emergencyContact: alertMessages.pleaseEnterEmergencyContact })
              }
            }}
            onBlur={() => {
              if (emergencyContact.length == 0) {
                setErrors({ ...errors, emergencyContact: alertMessages.pleaseEnterEmergencyContact })
              }
            }}
            bottomText={() => {
              return (<>{errors.emergencyContact.length > 0 && <Text style={[styles.errorText]}>{errors.emergencyContact}</Text>}</>)
            }}
          />

          {/* <CardViewVirtualPhy
            hideBottom={true}
            ViewStyle={{ paddingVertical: 8 }}
            value={emergencyNumber}
            keyboardType='number-pad'
            text={placeholderAndLabels.emergencyNumber}
            placeholder={placeholderAndLabels.pleaseEnterNumber}
            placeholderTextColor={ThemeManager.colors.lightText}
            inputStyle={{ color: ThemeManager.colors.lightText, textAlign: 'right' }}
            rightImg={Images.rightArrowNew}
            onChangeText={(text) => {
              if (phoneNoCheck(text)) {
                SetemergencyNumber(text)
                setErrors({ ...errors, emergencyNumber: '' })
              } else if (text.length < 2) {
                SetemergencyNumber('')
                setErrors({ ...errors, emergencyNumber: alertMessages.emergencyNumberMandatory })
              }
            }}
            onBlur={() => {
              if (emergencyNumber.length == 0) {
                setErrors({ ...errors, emergencyNumber: alertMessages.emergencyNumberMandatory })
              }
            }}
            bottomText={() => {
              return (<>{errors.emergencyNumber.length > 0 && <Text style={styles.errorText}>{errors.emergencyNumber}</Text>}</>)
            }}
          /> */}

        </View>
        <Button buttontext={merchantCard.submit} myStyle={{ marginTop: 30, marginBottom: 17, marginHorizontal: 20 }} onPress={() => {
          checkValidations()
        }} />
      </>
    )
  }

  /******************************************************************************************/
  const stepTwo = () => {
    return (
      <View style={[styles.ViewStyle2]}>
        <View style={styles.reviewContainer}>
          <CustomStatus animation={Images.review} titleText={placeholderAndLabels.informationInReview} text={merchantCard.kycInreviewProcessTime} style={{ top: -70 }} titleStyle={{ marginTop: -30, fontSize: 18 }} textStyle={{ marginTop: 10, marginHorizontal: 40 }} />
        </View>
        <Button buttontext={merchantCard.done} myStyle={{ marginTop: 30, marginBottom: 17, width: '100%', bottom: 0 }} onPress={() => {
          Actions.currentScene !== 'USPreferdCardScreen' && Actions.USPreferdCardScreen({ usCardData: props.usCardData })
        }} />
      </View>
    )
  }

  /******************************************************************************************/
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header expandHeader backCallBack={() => {
        console.log("progStep", progStep);
        Actions.pop();
        // if (progStep == 1) {
        //   Actions.pop()
        // } else {
        //   Actions.jump('PrepaidCard')
        //   // progStep = 1
        //   // setProgressStep(1)
        // }
      }} BackButtonText={merchantCard.applyforTriskelCard} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />

      {/* ********************************************************Modal for from Date******************************************************* */}
      <DatePicker
        modal
        theme={'light'}
        mode="date"
        open={showFromDatePicker}
        dateFormat="DD-MM-YYYY"
        date={fromDate ? fromDate : new Date(moment(new Date()).subtract(18, 'years'))}
        maximumDate={new Date(moment(new Date()).subtract(18, 'years'))}
        confirmText={merchantCard.confirm}
        onConfirm={date => {
          setminimumDate(date)
          setfromDate(new Date(date))
          setErrors({ ...errors, fromDate: '' })
          setshowFromDatePicker(false)
        }}
        onCancel={() => setshowFromDatePicker(false)}
        androidVariant='iosClone'
        style={{ marginVertical: Platform.OS == 'android' ? 20 : 5 }}
      />


      {/* ********************************************************Modal for doc exp Date******************************************************* */}
      <DatePicker
        modal
        theme={'light'}
        mode="date"
        open={showDocExpiryPicker}
        dateFormat="DD-MM-YYYY"
        date={docExpiry ? docExpiry : new Date(moment(new Date()))}
        // maximumDate={new Date(moment(new Date()))}
        confirmText={merchantCard.confirm}
        onConfirm={date => {
          setminimumDate(date)
          setDocExpiry(new Date(date))
          setErrors({ ...errors, docExpiry: '' })
          setshowDocExpiryPicker(false)
        }}
        onCancel={() => setshowDocExpiryPicker(false)}
        androidVariant='iosClone'
        style={{ marginVertical: Platform.OS == 'android' ? 20 : 5 }}
      />

      {/* ***************************** gender View ************************* */}
      <ModalCoinList
        title={showGenderModal ? merchantCard.selectGender : placeholderAndLabels.select}
        contactUs={true}
        list={showGenderModal ? genderList : optionList}
        openModel={showGenderModal || showOptionModal}
        onPressIn={() => showGenderModal ? setshowGenderModal(false) : setshowOptionModal(false)}
        onPress={async item => {
          console.log("item:::", item);
          if (showGenderModal) {
            setGender(item)
            setErrors({ ...errors, gender: '' })
            setshowGenderModal(false);
          } else {
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
          }

        }}
      />

      {/* ***************************** Camera View ************************* */}
      {/* <ModalCoinList
        title={placeholderAndLabels.select}
        kyc={true}
        list1={optionList}
        openModel={showOptionModal}
        onPressIn={() => setshowOptionModal(false)}
        onPress={async item => {
          console.log("item:::", item);
          setshowOptionModal(false)
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
      /> */}

      {/* ***************************** country View************************* */}
      <ModalCountryList
        clearSearch={true}
        showCountry={true}
        openModel={showModalCodeCOuntry}
        countryList={countryList}
        onPressIn={() => setshowModalCodeCOuntry(false)}
        onpressItem={(item) => {
          console.log("item:::", item);
          setCountry(item)
          setErrors({ ...errors, country: '' })
          setshowModalCodeCOuntry(false)
        }}
        onClearSearch={() => {
          setCountryList(fullCountryList)
        }}
        searchCountry={(text) => {
          if (text.length == 0) {
            setCountryList(fullCountryList)
          } else {
            let list = fullCountryList.filter((country) => country.english.toLowerCase().includes(text.toLowerCase()) || country.mobile_area_code.toString()?.toLowerCase().includes(text.toLowerCase()))
            console.log("list", list);
            setCountryList(list)
          }
        }}
      />

      {/* *****************************Doc View************************* */}
      <ModalCountryList
        heading={placeholderAndLabels.chooseDocumentType}
        openModel={showModalDocument}
        list={DocumentList}
        onpressItem={(item) => {
          setshowModalDocument(false)
          SetDocument(item.title)
        }}
        onPressIn={() => { setshowModalDocument(false) }}
      />

      {/* *****************************progress View************************* */}

      <View style={{ marginHorizontal: 20 }}>
        <CustomInprogress
          showOnlyTwoProg={true}
          showprogTwo={progressStep == 1 ? false : true}
          progOneTxt={'1'}
          progTwoTxt={'2'}
          txtTwoStyle={{ color: progressStep == 2 ? ThemeManager.colors.text_Color : ThemeManager.colors.lightText, right: -40 }}
          progressView={{ backgroundColor: ThemeManager.colors.colorVariation, borderColor: ThemeManager.colors.settingBg }}
          progressViewEmpty={{ backgroundColor: 'transparent', borderColor: ThemeManager.colors.settingBg }}
          horizontalLine={{ backgroundColor: ThemeManager.colors.settingBg, }}
          progTxt={{ color: ThemeManager.colors.manageWalletModalBg, }}
          firstCont={placeholderAndLabels.userKYC}
          secCont={merchantCard.reviewInformation}
          containerView={{ marginHorizontal: 40 }}

        />

      </View>

      {progressStep == 1 ?
        <KeyboardAwareScrollView enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS == 'ios' ? false : true}
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          extraScrollHeight={Platform.OS == 'ios' ? 50 : 50}
          contentContainerStyle={{ paddingBottom: 0 }}  >
          {stepOne()}
        </KeyboardAwareScrollView>
        :
        <View style={{ flex: 1 }}>
          {stepTwo()}
        </View>
      }
      {showSuccessAlert && (<AppAlert showSuccess={true} alertTxt={alertTxt} hideAlertDialog={() => { hideAlert() }} />)}
      {showAlertDialog && (<AppAlert showSuccess={false} alertTxt={alertTxt} hideAlertDialog={() => { setShowAlertDialog(false) }} />)}
      <LoaderView isLoading={loading} />
    </View >
  )
}

/******************************************************************************************/
export default USPrefCardKYC
const styles = StyleSheet.create({
  ViewStyle2: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'space-between'
  },
  ViewStyle1: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  reviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: Fonts.dmMedium
  },
  errorText: {
    fontFamily: Fonts.dmRegular,
    color: Colors.lossColor,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'left'
  },
  buttonStyle2: {
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingLeft: 20
  },
  buttonStyle: {
    alignItems: 'flex-end',
    paddingTop: 20,
  },
})