import React, { useEffect, useRef, useState } from 'react'
import { Image, Linking, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Colors, Images } from '../../../theme';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Button, Header, LoaderView, ModalCoinList } from '../../common';
import styles from './TermsStyle';
import { EventRegister } from 'react-native-event-listeners';
import SignatureCapture from 'react-native-signature-capture';
import * as Constants from '../../../Constants';
import { Actions } from 'react-native-router-flux';
import { uploadSignature } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { CardViewVirtualPhy } from '../../common/CardViewVirtualPhy';
import Singleton from '../../../Singleton';
import { attachBtnClicked, attachCameraClicked } from '../../../Utils/MethodsUtils';
//import ImageResizer from '@bam.tech/react-native-image-resizer';
import ImageResizer1 from '@bam.tech/react-native-image-resizer';
import Toast from 'react-native-easy-toast';

const Terms = (props) => {
  const sign = useRef(null);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { referral, alertMessages, merchantCard, placeholderAndLabels, aggreement } = LanguageManager;
  const optionList = [placeholderAndLabels.camera, placeholderAndLabels.gallery]
  const [disableReset, setDisableReset] = useState(false);
  const [selected, setSelected] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('')
  const [showSuccess, setShowSuccess] = useState(false);
  const [signBase64Images, setSignBase64Images] = useState('');
  const [signature, setSignature] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showOptionModal, setshowOptionModal] = useState(false)

  /******************************************************************************************/
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
        setshowOptionModal(false);
        setShowAlertDialog(false);
        setShowSuccess(false);
        setAlertTxt('');
      });
    })
  }, [])

  /******************************************************************************************/
  const saveSign = () => {
    console.log(signature, 'signBase64Images:::::', signBase64Images)
    signature && sign.current.saveImage();
    // setSignature(true)
  }

  /******************************************************************************************/
  const resetSign = () => {
    sign.current.resetImage();
    setSignature(false);
    setSignBase64Images('');
    setDisableReset(false);
  }

  /******************************************************************************************/
  const onProceed = () => {
    console.log('chk signBase64Images  && signature::::::', signBase64Images, signature)
    if (!signBase64Images && !signature) {
      setShowAlertDialog(true);
      setAlertTxt(placeholderAndLabels.SignatureMandatory)
      return
    } else if (!signBase64Images || !disableReset) {
      setShowAlertDialog(true);
      setAlertTxt(alertMessages.pleaseSaveYourSignature)
      return
    }
    else {
      signContract()
    }
  }

  /******************************************************************************************/
  const signContract = () => {
    setLoading(true);
    setTimeout(() => {
      const formData = new FormData();
      formData.append("referral_type_id", props.refType);
      formData.append("coin", 'trx');
      formData.append("sign", signBase64Images);
      // formData.append("files", {
      //   uri: signBase64Images,
      //   type: "image/png",
      //   name: "sign",
      // });
      console.log('chk uploadSignature formData::::::', formData)
      dispatch(uploadSignature(formData)).then(res => {
        console.log('chk uploadSignature res::::::', res)
        setLoading(false);
        setShowAlertDialog(true);
        setShowSuccess(true);
        setAlertTxt(alertMessages.contractSignedSuccess);
        Actions.pop()
        // Actions.PayFee({ next_level_refTyp: props.next_level_refTyp, refType: props.refType, fees: props?.fees, coin_data: props?.coin_data, address: res?.liminal_address })
      }).catch(err => {
        setLoading(false);
        setShowAlertDialog(true);
        setShowSuccess(false);
        setAlertTxt(err)
      })
    }, 100);
  }

  /******************************************************************************************/
  const onImageUpload = async () => {
    global.imageUpload = true
    setshowOptionModal(true);
  }

  /******************************************************************************************/
  const pickDocument = async (photoType) => {
    console.log(photoType, 'typeOfImg:::::')
    Singleton.isPermission = true;
    Singleton.isCameraOpen = true;
    if (photoType == 'gallery') {
      attachBtnClicked().then(res => {
        if (res.uri) {
          uploadFile(res.uri, res.base64, res)
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
          uploadFile(res.uri, res.base64, res)
        }
      }).catch(err => {
        console.log("err::::", err);
        setAlertTxt(err)
        setShowAlertDialog(true)
      });
    }
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
  const uploadFile = (res, base64, file) => {
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
        setSignBase64Images(response.uri)
      }).catch((err) => {
        console.log("err:::::::::ImageResizer", err);
      });
    } else {
      ImageResizer1.createResizedImage(filePath, width, height, typeFile, quality, rotation, outputPath).then((response) => {
        console.log("response:::::::::ImageResizer", response);
        setSignBase64Images(response.uri)
      }).catch((err) => {
        console.log("err:::::::::ImageResizer", err);
      });
    }
  }

  /******************************************************************************************/
  return (
    <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        BackButtonText={referral.signContract}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <ScrollView
        bounces={false}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}>

        <View style={styles.wrapMainStyle}>
          <Text style={[styles.proptitleStyle, { color: ThemeManager.colors.Text }]}>{aggreement.agreement}</Text>
          <Text style={[styles.subtitleStyle, { color: ThemeManager.colors.Text }]}>{aggreement.agreText}<Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.agreText22}</Text><Text style={[styles.subtitleStyle, { color: ThemeManager.colors.Text }]}>{aggreement.agreText23}</Text></Text>

          <Text style={[styles.subtitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.agreText1}
            <Text style={[styles.subtitleStyle12, { color: ThemeManager.colors.Text }]}>{` ${Singleton.getInstance().defaultEmail} `}</Text>
            <Text style={[styles.subtitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.agreText21}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(Constants.TERM_LINK)}><Text style={styles.link}>{aggreement.termsLink}<Text style={[styles.entertitleStyle, { color: ThemeManager.colors.Text }]}>{`   ${aggreement.and}`}</Text></Text></TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(Constants.POLICY_LINK)}><Text style={styles.link}>{aggreement.privacyLink}</Text></TouchableOpacity>
          </Text>
          <Text style={[styles.subtitleStyle1, { color: ThemeManager.colors.Text, marginTop: -6 }]}>{aggreement.agreText4}</Text>

          <Text style={[styles.subtitleStyle, { color: ThemeManager.colors.Text }]}>{aggreement.agreText2}</Text>
          <Text style={[styles.proptitleStyle, { color: ThemeManager.colors.Text }]}>{aggreement.agreText3}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.def}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.defContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.agree}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.agreeContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.combo}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.comboContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.Commission}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.CommissionContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.digiCard}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.digiCardContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.genPub}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.genPubContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.physCard}<Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.physCardContent}</Text></Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.agreText5}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.scope}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.consideration}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.considerationText}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.relationShip}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.relationShipText}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.duration}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.durationText}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.assignment}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.assignmentText}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.govtLaw}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.govtLawText}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.severability}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.severabilityText}</Text>
          <Text style={[styles.proptitleStyle1, { color: ThemeManager.colors.Text }]}>{aggreement.liability}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text, marginTop: 0 }]}>{aggreement.liabilityText}</Text>

          <Text style={[styles.proptitleStyle11, { color: ThemeManager.colors.Text }]}>{aggreement.schedule}</Text>
          <Text style={[styles.proptitleStyle11, { color: ThemeManager.colors.Text }]}>{aggreement.commissions}</Text>
          <Text style={[styles.text1, { color: ThemeManager.colors.Text, textDecorationLine: 'none' }]}>1.<Text style={[styles.text1, { color: ThemeManager.colors.Text }]}>{aggreement.comText1}</Text></Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.subtext1}</Text>
          <Text style={[styles.text1, { color: ThemeManager.colors.Text, textDecorationLine: 'none' }]}>2.<Text style={[styles.text1, { color: ThemeManager.colors.Text }]}>{aggreement.comText2}</Text></Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.subtext2}</Text>
          <Text style={[styles.text1, { color: ThemeManager.colors.Text, textDecorationLine: 'none' }]}>3.<Text style={[styles.text1, { color: ThemeManager.colors.Text }]}>{aggreement.comText3}</Text></Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.subtext3}</Text>
          <Text style={[styles.text1, { color: ThemeManager.colors.Text, textDecorationLine: 'none' }]}>4.<Text style={[styles.text1, { color: ThemeManager.colors.Text }]}>{aggreement.comText4}</Text></Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.subtext4}</Text>

          <Text style={[styles.text1, { color: ThemeManager.colors.Text }]}>{aggreement.note}</Text>
          <Text style={[styles.subText, { color: ThemeManager.colors.Text }]}>{aggreement.noteText}</Text>

          <Text style={[styles.text1, { color: ThemeManager.colors.Text }]}>{aggreement.signcontract}</Text>

          <View style={styles.signView}>
            <SignatureCapture
              style={{ height: 80, }}
              ref={sign}
              onSaveEvent={(res) => {
                console.log(":::::");
                console.log("res:::::", res);
                toast.current?.show(referral.signSave)
                setSignature(true);
                setDisableReset(true);
                setSignBase64Images(res?.encoded);
              }}
              onDragEvent={(res) => {
                console.log("res::::onDragEvent:", res);
                setDisableReset(false)
                setSignature(true)
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

          <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end', marginRight: 25, marginBottom: 10 }}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => { saveSign() }} >
              <Text style={[styles.buttonText, { color: disableReset ? ThemeManager.colors.lightText : ThemeManager.colors.settingsText }]}>{merchantCard.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle2} onPress={() => { resetSign() }} >
              <Text style={[styles.buttonText, { color: ThemeManager.colors.settingsText }]}>{merchantCard.reset}</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.touchableOuterView2}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSelected(!selected)} style={styles.checkTouchStyle}>
              <View style={styles.imgView}>
                {selected ? <Image source={ThemeManager.ImageIcons.radioActive} /> : <Image source={ThemeManager.ImageIcons.radioInactive} />}
              </View>
              <Text style={[styles.readAndAccept, { color: ThemeManager.colors.Text }]}>{aggreement.terms}</Text>
            </TouchableOpacity>

            {selected ? <Button
              disabled={selected ? false : true}
              onPress={() => onProceed()}
              myStyle={[styles.myStyle]}
              buttontext={merchantCard.proceed}
            />
              :
              <View style={[styles.sendBtnStyle, { backgroundColor: ThemeManager.colors.settingBg }]}>
                <Text allowFontScaling={false} style={[styles.sendBtnTextStyle]}>{merchantCard.proceed}</Text>
              </View>
            }
          </View>

        </View>

      </ScrollView>

      {showAlertDialog && (
        <AppAlert
          showSuccess={showSuccess}
          alertTxt={alertTxt}
          hideAlertDialog={() => {
            setShowAlertDialog(false);
            setShowSuccess(false)
          }}
        />
      )}

      <Toast
        ref={toast}
        position="bottom"
        positionValue={270}
        style={{ backgroundColor: ThemeManager.colors.toastBg }}
      />

      <LoaderView isLoading={isLoading} />

    </View>
  )
}

export default Terms;