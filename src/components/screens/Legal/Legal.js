import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, Platform, ImageBackground, Linking } from 'react-native';
import styles from './LegalStyles'
import { ThemeManager } from '../../../../ThemeManager';
import { LanguageManager } from '../../../../LanguageManager';
import { AppAlert, Button, HeaderMain, OnboardingHeadings } from '../../common';
import { Actions } from 'react-native-router-flux';
import images from '../../../theme/Images';
import { heightDimen } from '../../../Utils';
import LinearGradient from 'react-native-linear-gradient';

const CardRow = ({ text, arrowIcon = false, shieldUser, privacyView, pressLink }) => {
  return (
    <LinearGradient
      colors={["#69DADB00", "#69DADB06"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7403, y: 0.6763 }}
      style={[styles.privacyView, { backgroundColor: ThemeManager.colors.mainBgNew }, privacyView]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={pressLink}>
        <View style={styles.subContent}>
          <View style={{ ...styles.cardView }}>
            {shieldUser && <Image source={shieldUser} resizeMode={'contain'} />}
            <Text
              style={[
                styles.cardText,
                { color: ThemeManager.colors.blackWhiteText },
              ]}>
              {text}
            </Text>
          </View>
          {arrowIcon && <Image source={arrowIcon} resizeMode={'contain'} />}
        </View>
      </TouchableOpacity>
    </LinearGradient>
  )
}



const Legal = (props) => {
  const [isCheck, setIsCheck] = useState(false)
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState('');

  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <HeaderMain />
      <View style={[styles.mainView,]}>
        <View style={styles.subView}>

          <OnboardingHeadings title={LanguageManager.legal.legal} subTitle={LanguageManager.legal.review} />
          <CardRow
            pressLink={() => {
              // Actions.currentScene != 'PrivacyPolicy' && Actions.PrivacyPolicy()
            }}
            text={LanguageManager.legal.privacy}
            arrowIcon={ThemeManager.ImageIcons.rightArrowLong}
            shieldUser={images.shieldUser} />
          <CardRow
            pressLink={() => {
              // Actions.currentScene != 'TermsandConditions' && Actions.TermsandConditions()
            }}
            text={LanguageManager.legal.termsservice}
            arrowIcon={ThemeManager.ImageIcons.rightArrowLong}
            shieldUser={images.documentService}
            privacyView={{ marginTop: 10 }}
          />
        </View>
        <View style={{ marginBottom: heightDimen(50), }}>
          <TouchableOpacity
            onPress={() => {
              setIsCheck(!isCheck)
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View

              style={styles.termsView}>
              {isCheck ? <Image
                source={images.fillCheckBox}
                style={{ ...styles.checkImg }}
                resizeMode={'contain'}
              /> :
                <View style={{ ...styles.checkImg, borderWidth: 1, borderColor: ThemeManager.colors.dropDownColor, borderRadius: 8 }} />}
            </View>


            <Text style={[styles.termsText, { color: ThemeManager.colors.blackWhiteText }]}>
              {LanguageManager.legal.terms}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
            // onPress={() => Actions.TermsandConditions()}
            ><Text style={[styles.termsTextBold, { color: ThemeManager.colors.primaryColor }]}>{LanguageManager.legal.termsservice}</Text></TouchableOpacity>
            <Text style={[styles.termsText, { color: ThemeManager.colors.headersTextColor }]}>
              <Text style={[styles.termsText, { color: ThemeManager.colors.blackWhiteText }]}>
                &{" "}</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={1}
            // onPress={() => Actions.PrivacyPolicy()}
            ><Text style={[styles.termsTextBold, { color: ThemeManager.colors.primaryColor }]}>{LanguageManager.legal.privacy}</Text></TouchableOpacity>
          </TouchableOpacity>

          {/* </TouchableOpacity> */}
          <Button
            // disabled={!isCheck} 
            onPress={() => {
              console.log("here==", isCheck)
              if (!isCheck) {
                setAlertModal(true)
                setAlertText('Please accept The Terms of Service and Privacy Policy')

              } else {
                props.from == 'createwallet' ? Actions.currentScene != 'WalletName' && Actions.WalletName({ screen: props?.screen }) : Actions.currentScene != 'ImportWallet' && Actions.ImportWallet({ screen: props?.screen })
              }
            }}
            myStyle={{ marginTop: heightDimen(16), }}
            buttontext={LanguageManager.pins.Continue}
          />
        </View>
      </View>
      {alertModal && (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => { setAlertModal(false) }}
        />
      )}
    </ImageBackground>
  );
};

export default Legal;
