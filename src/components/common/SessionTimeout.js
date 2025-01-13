import React, { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Header } from './Header';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts } from '../../theme';
import { TouchableOpacity } from 'react-native';
import { RadioButton } from './RadioButton';
import { getData, saveData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants';
import { LanguageManager } from '../../../LanguageManager';


export const SessionTimeout = props => {
  const { commonText } = LanguageManager;
  const [selectedIndex, setIndex] = useState(null);
  const sessionList = [commonText.immediately, `5 ${commonText.seconds}`, `10 ${commonText.seconds}`, `15 ${commonText.seconds}`, `30 ${commonText.seconds}`, `1 ${commonText.minute}`, `5 ${commonText.minutes}`];

  /******************************************************************************************/
  useEffect(() => {
    getData(Constants.PIN_TIMEOUT).then(PIN_TIMEOUT => {
      console.log('PIN_TIMEOUT:::::', PIN_TIMEOUT);
      PIN_TIMEOUT == '5000' ? setIndex(1) : PIN_TIMEOUT == '10000' ? setIndex(2) : PIN_TIMEOUT == '15000' ? setIndex(3) : PIN_TIMEOUT == '30000' ? setIndex(4) : PIN_TIMEOUT == '60000' ? setIndex(5) : PIN_TIMEOUT == '300000' ? setIndex(6) : setIndex(0);
    });
  }, [props]);

  /******************************************************************************************/
  const itemPressed = (item, index) => {
    console.log('chk item::::::', item);
    // const time = item == '5 Seconds' ? 5000 : item == '10 Seconds' ? 10000 : item == '15 Seconds' ? 15000 : item == '30 Seconds' ? 30000 : item == '1 Minute' ? 60000 : item == '5 Minutes' ? 300000 : 0;
    const time = index == 1 ? 5000 : index == 2 ? 10000 : index == 3 ? 15000 : index == 4 ? 30000 : index == 5 ? 60000 : index == 6 ? 300000 : 0;
    saveData(Constants.PIN_TIMEOUT, time);
    setIndex(index);
  };

  /******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={props.showSessionTimeoutModal}
      onRequestClose={props.handleBack}>
      <>
        <SafeAreaView style={{ flex: 1, backgroundColor: ThemeManager.colors.colorVariation }}>
          <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
            <Header
              backCallBack={props.handleBack}
              BackButtonText={commonText.SessionTimeout}
              bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
            />
            <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 20 }}>
                  <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.newTitle }]}>{commonText.SelectSessionTimeout}</Text>
                  <View style={[styles.ViewStyle, { backgroundColor: ThemeManager.colors.searchBg, marginBottom: 25 }]}>
                    {sessionList.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index + ''}
                          onPress={() => itemPressed(item, index)}
                          style={[styles.ViewStyle2, { borderBottomWidth: index == sessionList?.length - 1 ? 0 : 1, borderBottomColor: ThemeManager.colors.borderUnderLine }]}>
                          <RadioButton
                            onPress={() => itemPressed(item, index)}
                            status={selectedIndex == index ? 'checked' : ''}
                          />
                          <Text allowFontScaling={false} style={[styles.coinText, { color: ThemeManager.colors.settingsText }]}>{item}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
        <SafeAreaView style={{ backgroundColor: ThemeManager.colors.safeBottom }} />
      </>
    </Modal>
  );
};
const styles = StyleSheet.create({
  ViewStyle2: {
    flexDirection: 'row',
    // marginTop: 15,
    height: 55,
    alignItems: 'center',
    borderRadius: 15,
    borderBottomWidth: 1,
  },
  imgStyle: {
    width: 10,
    height: 5,
    alignSelf: 'center',
    marginRight: 20,
  },
  txtTitle: {
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,
    marginTop: 15,
    marginBottom: 5,
  },
  txtTitle1: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  tokenImage_style: {
    width: 25,
    height: 25,
    borderRadius: 30,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginLeft: 10,
    resizeMode: 'cover',
  },
  ViewStyle: {
    // borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 15,
  },
  coinText: {
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  ViewStyle1: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    justifyContent: 'space-between',
    position: 'relative',
    marginRight: 7,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
  },
});
