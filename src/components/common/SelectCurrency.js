// / eslint-disable react-native/no - inline - styles /
import { Image } from 'react-native';
import React from 'react';
import { Fonts, Colors, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';

const SelectCurrency = props => {
  const { commonText } = LanguageManager;
  // console.log('props.min:::::', props.min);

  /******************************************************************************************/
  return (
    <View>
      {props.balance && (
        <View style={[styles.abvlWrapStyle, { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 }]}>
          {props.min ? (
            <Text allowFontScaling={false} style={[styles.abvlWrapTextStyle, { color: ThemeManager.colors.Text }, props.custStyle]}>{commonText.Range}: {(parseFloat(props.min) + parseFloat(0.001)) + ' - ' + props.max}{` ${props.currency}`}</Text>
          ) : props.showRange == true ? (
            <Text allowFontScaling={false} style={[styles.abvlWrapTextStyle, { color: ThemeManager.colors.Text }, props.custStyle]}>{commonText.Range}: {'0.00' + ' - ' + '0.00'}{` ${props.currency}`}</Text>
          ) : null}
        </View>
      )}

      <View style={[styles.inputandselectStyle, props.inputandselectStyle, { paddingTop: props.fromBuy ? 5 : 10, backgroundColor: ThemeManager.colors.searchBg, minHeight: props.fromBuy ? 68 : 99, borderRadius: 10, borderColor: ThemeManager.colors.borderColor }]}>
        <View style={[styles.inputStyle__left]}>
          <TextInput
            style={[styles.inputStyle, { color: ThemeManager.colors.settingsText, fontSize: 22, fontFamily: props.fromBuy ? Fonts.dmMedium : Fonts.dmSemiBold }]}
            editable={props.editable}
            placeholder={props.placeholder}
            onChangeText={props.onChangeNumber}
            maxLength={props.maxLength}
            placeholderTextColor={ThemeManager.colors.settingsText}
            value={props.value}
            keyboardType={'numeric'}
            onBlur={props.onBlur}
            allowFontScaling={false}
          />
          {props.fromBuy ? null : (
            <Text allowFontScaling={false} style={[styles.txtStyle, { color: ThemeManager.colors.lightText }]}>{props.fiatValue ? Singleton.getInstance().CurrencySymbol + toFixedExp(props.fiatValue, 3) : ' ---'}</Text>
          )}

        </View>
        <View style={{ alignItems: 'flex-end', paddingRight: 5 }}>
          <TouchableOpacity
            onPress={props.onPressCoin}
            style={[styles.currencySelectOption]}>
            <View style={styles.imgView}>
              {props.coinImage ? (
                <Image source={{ uri: props.coinImage }} style={styles.imgStyle} resizeMode="cover" />
              ) : (
                <View style={{ backgroundColor: ThemeManager.colors.borderUnderLine, alignItems: 'center', justifyContent: 'center', height: props.fromBuy ? 27 : 25, width: props.fromBuy ? 27 : 25, borderRadius: 20 }}>
                  <Text allowFontScaling={false} style={{ color: ThemeManager.colors.Text, fontSize: 15, fontFamily: Fonts.dmMedium }}>{props?.currency?.charAt(0)}</Text>
                </View>
              )}
              <Text allowFontScaling={false} style={{ marginLeft: 8, color: ThemeManager.colors.Text, fontSize: 16, fontFamily: Fonts.dmMedium }}>{props.currency ? props.currency : '--'}</Text>

              {props.fromBuy ? (
                <Image style={{ tintColor: ThemeManager.colors.whiteText, marginLeft: 10 }} source={Images.dropdown} />
              ) : (
                <Image style={{ tintColor: ThemeManager.colors.whiteText, marginLeft: 10, transform: [{ rotate: '270deg' }] }} source={Images.dropdown} />
              )}

            </View>
          </TouchableOpacity>

          {props.fromBuy ? null : (
            <Text allowFontScaling={false} style={{ textAlign: 'right', marginTop: 15, marginRight: 8, color: ThemeManager.colors.lightText, fontSize: 12, fontFamily: Fonts.dmMedium }}>
              {commonText.Balance}:<Text allowFontScaling={false} style={{ color: ThemeManager.colors.settingsText, fontSize: 12, fontFamily: Fonts.dmMedium }}>{props.balance ? ` ${props.balance}` : ' ---'}</Text>
            </Text>
          )}

        </View>
      </View>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  txtStyle: {
    marginTop: -14,
    paddingLeft: 6,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
  },
  imgView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    height: 23,
    width: 23,
    borderRadius: 12.5,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  ViewStyle: {
    height: 20,
    width: 1,
    backgroundColor: 'grey',
    marginLeft: 10,
  },
  inputandselectStyle: {
    flexDirection: 'row',
  },
  inputStyle__left: {
    flex: 1,
    marginLeft: 10,
  },
  inputStyle: {
    textAlign: 'left',
    color: Colors.White,
    fontSize: 25,
    fontFamily: Fonts.dmSemiBold,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  currencySelectOption: {
    position: 'relative',
    paddingRight: 15,
    paddingTop: 15,
  },
  abvlWrapStyle: {
    marginTop: 6,
    justifyContent: 'flex-end',
  },
  abvlWrapTextStyle: {
    color: ThemeManager.colors.lightText,
    fontSize: 12,
    fontFamily: Fonts.dmMedium,
  },
});

export { SelectCurrency };
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { toFixedExp } from '../../Utils/MethodsUtils';
import Singleton from '../../Singleton'; import { LanguageManager } from '../../../LanguageManager';

