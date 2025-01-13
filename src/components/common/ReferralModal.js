import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Modal } from 'react-native';
import { Header } from './Header';
import { ThemeManager } from '../../../ThemeManager';
import { Button } from './Button';
import { Colors, Fonts, Images } from '../../theme';
import { InputCustom } from './InputCustom';
import { AppAlert } from './AppAlert';
import { LanguageManager } from '../../../LanguageManager';
import { LoaderView } from './LoaderView';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../Utils';
function ReferralModal(props) {
  const { commonText } = LanguageManager;

  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={props.showReferralModal}
      onRequestClose={props.handleBack}>
      <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.colorVariation }}>

        <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
          <View style={{ flex: 1 }}>
            <Header
              backCallBack={props.handleBack}
              // bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
              BackButtonText={commonText.ReferralCode}
            />
            <Image style={styles.appLogo} source={ThemeManager.ImageIcons.futureLogo} />
            <Text allowFontScaling={false} style={[styles.txtStyle, { color: ThemeManager.colors.subTextColor }]}>{commonText.YouNeedToEnterTheReferralCode}</Text>
            <View style={styles.ViewStyle1}>
              <InputCustom
                editable={props.editable}
                maxLength={10}
                label={commonText.ReferralCode}
                value={props.value}
                placeHolder={commonText.EnterReferralCode}
                placeholderColor={Colors.placeholderColor}
                placeholderTextColor={ThemeManager.colors.lightWhiteText}
                onChangeText={props.onChangeText}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: ThemeManager.colors.Mainbg,
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingTop: 20,
          }}>
          <Button onPress={props.onPress} buttontext={commonText.Confirm} myStyle={{ marginBottom: dimen(66) }} />
          {props.onPressSkip && <Button
            onPress={props.onPressSkip}
            isLogout={true}
            buttontext={commonText.SKIP}
            restoreStyle={styles.restoreStyle}
          />
          }
        </View>

        {props.showAlert && (
          <AppAlert
            showSuccess={props.Txt == LanguageManager.referral.addSuccess ? true : false}
            alertTxt={props.Txt}
            hideAlertDialog={props.hideAlertDialog}
          />
        )}
        {props.isLoading && <LoaderView isLoading={props.isLoading} />}
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: ThemeManager.colors.safeBottom }} />
    </Modal>
  );
}

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle1: {
    paddingHorizontal: 23,
    flex: 0.6,
    justifyContent: 'center',
  },
  txtStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    marginHorizontal: dimen(48),
    marginTop: dimen(25),
    textAlign: 'center',
  },
  appLogo: {
    alignSelf: 'center',
    marginTop: dimen(52),
  },
  restoreStyle: {
    fontFamily: Fonts.dmMedium,
    textDecorationLine: 'underline',
    color: Colors.logoutColor
  },
});

export default ReferralModal;
