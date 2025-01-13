import React, { useState } from 'react';
import { View, Image, Text, Modal, TouchableOpacity } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Colors, Fonts, Images } from '../../theme';
import { BlurView } from '@react-native-community/blur';
import { getDimensionPercentage } from '../../Utils';
import { Button } from './Button';
import LinearGradient from 'react-native-linear-gradient';

export const AppAlert = ({
  hideAlertDialog,
  alertTxt,
  text = 'Ok',
  restoreStyle,
  buttontext,
  customStyle,
  themeSelected,
  myStyle,
  showSuccess = false,
  fromTheme,
  isvisible
}) => {
  const [ThemeSelected, setThemeSelected] = useState(themeSelected || '');

  /******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      // visible={fromTheme ? isvisible:true}
      visible={true}

      onRequestClose={() => { hideAlertDialog() }}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={3}
        reducedTransparencyFallbackColor="white"
      />
      <View style={[styles.centeredView]}>
        <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.whiteBlacktext, borderColor: ThemeManager.colors.whiteBlacktext }]}>

          <View style={{ alignItems: 'center' }}>
            {showSuccess ? (
              <Image style={{ height: getDimensionPercentage(20), width: getDimensionPercentage(20), resizeMode: 'contain' }} source={Images.icon_default} />
            ) : (
              <Image style={{ height: getDimensionPercentage(22), width: getDimensionPercentage(22) }} source={Images.tryAgain} />
            )}
            <Text allowFontScaling={false} style={[styles.modalTitle, { color: ThemeManager.colors.blackWhiteText }]}>{alertTxt}</Text>
          </View>

          <Button
            isNeedToClose={true}
            onPress={() => {
              hideAlertDialog()
            }}
            buttontext={text}
          />


        </View>
      </View>
    </Modal>
  );
};

/******************************************************************************************/
export const styles = {
  sendBtnStyle: {
    marginTop: 10,
    height: getDimensionPercentage(50),
    borderRadius: 10,
    justifyContent: 'center',
  },
  sendBtnTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  btnTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    elevation: 1,
  },
  modalView: {
    // backgroundColor: Colors.successColor,
    borderRadius: 12,
    padding: getDimensionPercentage(20),
    width: '90%',
    borderWidth: 1,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
  },
};
