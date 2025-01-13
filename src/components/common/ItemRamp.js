import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Colors, Fonts, Images } from '../../theme';
import { LanguageManager } from '../../../LanguageManager';

export const ItemRamp = props => {
  const { commonText } = LanguageManager;

  //******************************************************************************************/
  return (
    <>
      {props.transakText || props.alchemyText ? (
        <Text allowFontScaling={false} style={[styles.textStyle, { fontSize: 13, color: ThemeManager.colors.settingsText, marginTop: 30 }]}>{commonText.PaymentGateway}</Text>
      ) : null}

      {props.transakText ? (
        <TouchableOpacity disabled={props.disabledTransak} onPress={props.onPressTransak} style={[styles.mainStyle, props.mainStyle, { borderColor: ThemeManager.colors.toastBg, borderWidth: props.isSelectedTransak ? 1 : 0, marginTop: 10, backgroundColor: ThemeManager.colors.searchBg }]}>
          <View>
            <View style={[styles.viewStyle]}>
              <Image style={styles.imgStyle1} source={Images.transakLogo} />
              <View style={{ width: '75%' }}>
                <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText }]}>{commonText.Transak}</Text>
                <Text allowFontScaling={false} style={[styles.textStyle, { width: '100%', marginTop: 3, textAlign: 'left', color: props.isTransakErr ? Colors.lossColor : ThemeManager.colors.lightText, fontSize: 14 }]}>{props.transakText}</Text>
              </View>
            </View>
          </View>

          {props.isTransakErr ? null : (
            <View style={[styles.viewStyleNew]}>
              <Image style={[styles.imgStyle, { tintColor: props.isSelectedTransak ? Colors.successColor : ThemeManager.colors.colorVariationBorder }]} source={props.isSelectedTransak ? Images.radio_active : Images.radio_inactive} />
            </View>
          )}
        </TouchableOpacity>
      ) : null}

      {props.alchemyText ? (
        <TouchableOpacity disabled={props.disabledAlchemy} onPress={props.onPressAlchemy} style={[styles.mainStyle, props.mainStyle, { borderColor: ThemeManager.colors.toastBg, borderWidth: props.isSelectedAlchemy ? 1 : 0, marginTop: 10, backgroundColor: ThemeManager.colors.searchBg }]}>
          <View>
            <View style={[styles.viewStyle]}>
              <Image style={styles.imgStyle1} source={Images.alchemy} />
              <View style={{ width: '75%' }}>
                <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText }]}>{commonText.Alchemy}</Text>
                <Text allowFontScaling={false} style={[styles.textStyle, { width: '100%', marginTop: 3, textAlign: 'left', color: props.isAlchemyErr ? Colors.lossColor : ThemeManager.colors.lightText, fontSize: 14 }]}>{props.alchemyText}</Text>
              </View>
            </View>
          </View>

          {props.isAlchemyErr ? null : (
            <View style={[styles.viewStyleNew]}>
              <Image style={[styles.imgStyle, { tintColor: props.isSelectedAlchemy ? Colors.successColor : ThemeManager.colors.colorVariationBorder }]} source={props.isSelectedAlchemy ? Images.radio_active : Images.radio_inactive} />
            </View>
          )}
        </TouchableOpacity>
      ) : null}

      {props.isSelectedAlchemy ? (
        <Text
          allowFontScaling={false}
          style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>
          {commonText.Range}: {props.minAmount} - {props.maxAmount}
        </Text>
      ) : null}
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  mainStyle: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    marginLeft: 5,
  },
  imgStyle: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  imgStyle1: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  viewStyleNew: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    textAlign: 'right',
    marginTop: 5,
  },
});
