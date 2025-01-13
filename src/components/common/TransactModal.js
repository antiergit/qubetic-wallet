import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Text,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors, Fonts, Images } from '../../theme/';
import { ThemeManager } from '../../../ThemeManager';
import { LanguageManager } from '../../../LanguageManager';
import { EventRegister } from 'react-native-event-listeners';
import { getData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants'

export const TransactModal = props => {
  const { commonText, buySell, walletMain } = LanguageManager;
  const AssetList = [
    { title: walletMain.send, id: 1 },
    { title: walletMain.receive, id: 2 },
    { title: buySell.buy, id: 3 },
    { title: buySell.sell, id: 4 },
  ];

  const [themeSelected, setThemeSelected] = useState();

  //******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      setThemeSelected(theme);
    })
  }, []);

  //******************************************************************************************/
  const getBgColor = (index, selectedIndex) => {
    let color = ''
    if (themeSelected == 2) {
      color = (index == selectedIndex) ? ThemeManager.colors.colorVariation : ThemeManager.colors.Mainbg
    } else {
      color = (index == selectedIndex) ? ThemeManager.colors.subTitle : ThemeManager.colors.searchBg
    }
    return color;
  }

  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={props.openModel}
      onRequestClose={props.onPressIn}>

      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      />
      <SafeAreaView style={[styles.centeredView]}>
        <TouchableOpacity onPress={props.onPressIn} style={[styles.centeredView1]} />

        <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.bottomSheetColor }]}>
          <Pressable style={{ paddingVertical: 5 }} onPressIn={props.onPressIn}>
            <Image style={{ alignSelf: 'center', marginTop: 20, tintColor: ThemeManager.colors.colorVariationBorder }} source={Images.modal_top_line} />
          </Pressable>

          <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText }]}>{commonText.ChooseAction}</Text>

          {AssetList?.map((item, index) => {
            return (
              <TouchableOpacity
                disabled={props.disabled}
                key={index + ''}
                onPress={() => props.onPress(item, index)}
                style={[styles.touchableStyle, { borderWidth: 1, borderColor: ThemeManager.colors.underLineColor, backgroundColor: getBgColor(index, props.selectedIndex) }]}>
                <Text allowFontScaling={false} style={[styles.textStyle1, { color: index == props.selectedIndex ? ThemeManager.colors.Mainbg : ThemeManager.colors.settingsText }]}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: ThemeManager.colors.bottomSheetColor }} />
    </Modal>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  textStyle1: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
  },
  modalView: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    padding: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#00000077',
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  touchableStyle: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
});
