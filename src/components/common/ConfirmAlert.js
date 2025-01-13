import React from 'react';
import { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Colors, Fonts, Images } from '../../theme';
import { Button } from './Button';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { LanguageManager } from '../../../LanguageManager';

export const ConfirmAlert = ({ hideAlertDialog, ConfirmAlertDialog, alertTxt, customStyle, myStyle, text }) => {
  const { sendTrx, merchantCard } = LanguageManager;
  const [modalVisible, setModalVisible] = useState(true);
  // console.log('showTxt', alertTxt);

  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => { }}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      />
      <View style={[styles.centeredView, styles.absoluteView, customStyle]}>
        <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.mainBgNew }]}>
          <View style={{ alignItems: 'center' }}>
            <Image style={{ height: 22, width: 22 }} source={Images.tryAgain} />
            <Text allowFontScaling={false} style={[styles.modalTitle, { color: ThemeManager.colors.blackWhiteText }]}>{alertTxt}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => { hideAlertDialog() }} style={customStyle}>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                colors={[ThemeManager.colors.mnemonicsBg, ThemeManager.colors.mnemonicsBg]}
                style={[styles.sendBtnStyle, myStyle]}>
                <Text allowFontScaling={false} style={[styles.sendBtnTextStyle, { color: ThemeManager.colors.subTextColor }]}>{sendTrx.Cancel}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ width: 5 }}></View>
            <Button
              myStyle={{ width: Dimensions.get('screen').width / 3, marginBottom: 5, alignSelf: 'center', height: 55 }}
              buttontext={text ? text : merchantCard.done}
              onPress={() => { ConfirmAlertDialog() }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

//******************************************************************************************/
export const styles = {
  sendBtnTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
  },
  sendBtnStyle: {
    width: Dimensions.get('screen').width / 3,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  absoluteView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 1,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalView: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
    // borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    color: ThemeManager.colors.whiteText,
    marginBottom: 15,
  },
};
