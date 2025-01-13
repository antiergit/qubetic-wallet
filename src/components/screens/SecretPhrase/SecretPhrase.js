import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Clipboard,
  ImageBackground,
} from 'react-native';
import styles from './SecretPhraseStyles';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Button, HeaderMain, OnboardingHeadings } from '../../common';
import CommonModal from '../../common/CommonModal';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-easy-toast';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../../theme/Images';
import { heightDimen } from '../../../Utils';
import { set } from 'react-native-reanimated';

const SecretPhrase = (props) => {
  const { alertMessages } = LanguageManager;
  const toast = useRef(null);
  const [mnemonics, setmnemonics] = useState(props?.walletData?.mnemonics);

  const [isSecretPhrase, setIsSecretPhrase] = useState(false);
  const [isAgreeOne, setIsAgreeOne] = useState(false);
  const [isAgreeTwo, setIsAgreeTwo] = useState(false);
  const [alertData, setAlertData] = useState({
    isShow: false,
    title: '',
  });


  useEffect(() => {
    setIsAgreeTwo(false)
    setIsAgreeOne(false)
  }, []);


  const copyAction = () => {
    Clipboard.setString(mnemonics);
    toast.current?.show(alertMessages.copied)
  }
  return (
    <>

      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <HeaderMain />
        <View style={{ marginTop: heightDimen(30), paddingHorizontal: (20) }}>

          <OnboardingHeadings title={LanguageManager.secretPhrase.secretPhrase} subTitle={LanguageManager.secretPhrase.writeDown} />
          <View style={styles.mnemonicsStyle}>


            {mnemonics?.split(' ')?.map((item, index) => {
              return (
                <View key={`key_${index}`} style={[styles.mnemonic, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}>
                  <Text
                    style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}
                  >
                    <Text style={{ color: ThemeManager.colors.legalGreyColor }}>{index + 1}. </Text>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.copyMainView}>
            <TouchableOpacity
              onPress={() => { copyAction() }}
              style={[styles.copyView,]}
            >
              <Image
                style={styles.copyIconStyle}
                source={images.copyDarkButtonText}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.txtButtonContainer}>
          <View style={styles.styleMargin}>
            <TouchableOpacity
              onPress={() => {
                setIsAgreeOne(!isAgreeOne)
              }}
              style={styles.subView}>
              <View
                style={styles.termsView}>
                {isAgreeOne ? <Image
                  source={images.fillCheckBox}
                  style={{ ...styles.checkImg }}
                  resizeMode={'contain'}
                /> :
                  <View style={{ ...styles.checkImg, borderWidth: 1, borderColor: ThemeManager.colors.dropDownColor, borderRadius: 8 }} />}
              </View>

              <Text style={[styles.txtStyleOne, { color: ThemeManager.colors.legalGreyColor, }]}>{LanguageManager.secretPhrase.doNotShare}</Text>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsAgreeTwo(!isAgreeTwo)
              }}
              style={styles.subViewTwo}>
              <View

                style={styles.termsView}>
                {isAgreeTwo ? <Image
                  source={images.fillCheckBox}
                  style={{ ...styles.checkImg }}
                  resizeMode={'contain'}
                /> :
                  <View style={{ ...styles.checkImg, borderWidth: 1, borderColor: ThemeManager.colors.dropDownColor, borderRadius: 8 }} />}
              </View>


              <Text style={[styles.txtStyleTwo, { color: ThemeManager.colors.legalGreyColor, }]}>
                {LanguageManager.secretPhrase.futureWalletSupport}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.mainBtnView]}>
            <Button
              buttontext={LanguageManager.pins.Continue}
              iscreateWallet={true}
              isDisabled={!(isAgreeOne && isAgreeTwo)}
              disabled={!(isAgreeOne && isAgreeTwo)}
              onPress={() => {
                // if (!isAgreeOne && !isAgreeTwo) {
                //   setAlertData({
                //     isShow: true,
                //     title: "Please accept both terms and conditions",
                //   })
                // } else {
                console.log("props?.screen----- ", props?.screen)
                setIsSecretPhrase(false);
                if (props?.screen == 'managewallet') {
                  Actions.currentScene != 'ManageVerifySecretPhrase' && Actions.ManageVerifySecretPhrase({ walletData: props?.walletData, walletName: props?.walletName })
                }
                else {
                  Actions.currentScene != 'VerifySecretPhrase' && Actions.VerifySecretPhrase({ walletData: props?.walletData, walletName: props?.walletName })

                }
                // }
                // setTimeout(() => {
                //   setIsSecretPhrase(true);
                // }, 150);
              }}


            />
          </View>
        </View>
        <Toast
          ref={toast}
          position="bottom"
          positionValue={250}
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />
      </ImageBackground >

      {isSecretPhrase && (
        <CommonModal
          visible={isSecretPhrase}
          onClose={() => setIsSecretPhrase(false)}
          button={true}>
          <View style={styles.mainStyle}>
            <Image style={styles.logo} source={ThemeManager.ImageIcons.alertsecret} />
            <Text style={[styles.headingStyle, { color: ThemeManager.colors.TextColor }]}>{LanguageManager.secretPhrase.neverShareYour}</Text>
            {/* ***************Text Container One************* */}
            <View style={styles.paraView}>
              <View style={styles.imagetextContainer}>
                <Image style={styles.dotStyle} source={ThemeManager.ImageIcons.bullet} />
                <Text style={styles.txt2}>{LanguageManager.secretPhrase.your12Word}</Text>
              </View>
              <View style={styles.lineStyle}></View>
            </View>

            {/* ***************Text Container Two************* */}
            <View style={styles.paraView}>
              <View style={styles.imagetextContainerTwo}>
                <Image
                  style={styles.dotStyleTwo}
                  source={ThemeManager.ImageIcons.bullet}
                />
                <Text style={styles.txt2}>{LanguageManager.secretPhrase.futurerWalletDoesNot}</Text>
              </View>
              <View style={styles.lineStyle}></View>
            </View>

            {/* ***************Text Container Three************* */}
            <View style={styles.paraView}>
              <View style={styles.imagetextContainerTwo}>
                <Image style={styles.dotStyle} source={ThemeManager.ImageIcons.bullet} />
                <Text style={styles.txt2}>{LanguageManager.secretPhrase.unencryptedDigital}</Text>
              </View>
              <View style={styles.lineStyle}></View>
            </View>

            {/* ***************Text Container four************* */}
            <View style={styles.paraView}>
              <View style={styles.imagetextContainerTwo}>
                <Image style={styles.dotStyle} source={ThemeManager.ImageIcons.bullet} />
                <Text style={styles.txt2}>{LanguageManager.secretPhrase.writeDown}</Text>
              </View>
              <View style={styles.lineStyle}></View>
            </View>

            {/* ***************Text Container five************* */}
            <View style={styles.paraView}>
              <View style={styles.imagetextContainerTwo}>
                <Image
                  style={styles.alertIconStyle}
                  source={ThemeManager.ImageIcons.smallAlert}
                />
                <Text style={styles.lastPara}>{LanguageManager.secretPhrase.your12WordSecret}</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.btnViewModal]}>
            <Button
              buttontext={LanguageManager.pins.Continue}
              onPress={() => {

                setIsSecretPhrase(false);
                // Actions.ManageVerifySecretPhrase()
                if (props?.screen == 'managewallet') {
                  Actions.currentScene != 'ManageVerifySecretPhrase' && Actions.ManageVerifySecretPhrase({ walletData: props?.walletData, walletName: props?.walletName })
                }
                else {
                  Actions.currentScene != 'VerifySecretPhrase' && Actions.VerifySecretPhrase({ walletData: props?.walletData, walletName: props?.walletName })

                }
              }}
            />
          </View>

        </CommonModal>
      )
      }
      {alertData.isShow && <AppAlert

        alertTxt={alertData.title}
        hideAlertDialog={() => {
          setAlertData({ isShow: false, title: '' })
        }} />}
    </>
  );
};

export default SecretPhrase;
