import { StyleSheet } from 'react-native';
import { Fonts, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import React from 'react';

export const RewardItem = props => {

  //******************************************************************************************/
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.mainView, { marginBottom: props.data?.length - 1 == props.index ? 30 : 0 }]}>
      <View style={styles.ViewStyle1}>

        <View style={styles.ViewStyle2}>
          <Image source={props.item?.type?.toLowerCase() == 'sent' ? Images.send_bg : Images.receive_bg} style={[styles.imgStyle, { resizeMode: 'contain' }]} />
          <View style={[styles.ViewStyle]}>
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText }]}>{props.item?.type}</Text>
            <Text allowFontScaling={false} style={[styles.textStyle2, { color: ThemeManager.colors.lightText }]}>{props.item?.created_at}</Text>
          </View>
        </View>

        <View style={{ justifyContent: 'center' }}>
          <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.settingsText }]}>{props.item?.amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewStyle: {
    marginLeft: 13,
  },
  ViewStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainView: {
    paddingTop: 15,
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  textStyle1: {
    fontFamily: Fonts.dmBold,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  textStyle2: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    lineHeight: 26,
  },
  imgStyle: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
