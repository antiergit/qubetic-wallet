/* eslint-disable react-native/no-inline-styles */
import { Image } from 'react-native';
import React from 'react';
import { Fonts, Colors, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';
import CountryFlag from 'react-native-country-flag';

const BuyItem = props => {

  /******************************************************************************************/
  const getFiatValue = (item, amount) => {
    const fiatval = item.currentPriceInMarket;
    const value = toFixedExp(parseFloat(amount) * parseFloat(fiatval), 2);
    return isNaN(value) || value == 0 ? '0.00' : value;
  };

  /******************************************************************************************/
  return (
    <View>
      <View style={[styles.inputandselectStyle, props.inputandselectStyle, { paddingTop: 5, backgroundColor: ThemeManager.colors.searchBg, height: 68, borderRadius: 10, borderColor: ThemeManager.colors.borderColor }]}>

        <View style={[styles.inputStyle__left]}>
          <TextInput
            allowFontScaling={false}
            style={[styles.inputStyle, { color: ThemeManager.colors.settingsText, fontSize: 22, fontFamily: Fonts.dmMedium }]}
            editable={props.editable}
            placeholder={props.placeholder}
            onChangeText={props.onChangeNumber}
            maxLength={props.maxLength}
            placeholderTextColor={ThemeManager.colors.settingsText}
            value={props.value}
            keyboardType={'numeric'}
            onBlur={props.onBlur}
          />
        </View>

        <View style={{ alignItems: 'flex-end', paddingRight: 5 }}>
          <TouchableOpacity onPress={props.onPressCoin} style={[styles.currencySelectOption]}>

            <View style={styles.imgView}>
              {props.item?.country_code && props.item?.country_code != 'NOK' ? (
                <CountryFlag isoCode={props.item?.country_code || 'US'} style={{ borderRadius: 33, height: 33, width: 33 }} />
              ) : (
                <View style={styles.ViewStyle1}>
                  <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.Text }]}>{props.item?.country_name?.toLowerCase() == 'not_present' ? props.item?.fiat_currency?.charAt(0) : props.item?.country_name?.charAt(0)?.toUpperCase()}</Text>
                </View>
              )}
              <Text allowFontScaling={false} style={{ marginLeft: 8, color: ThemeManager.colors.Text, fontSize: 16, fontFamily: Fonts.dmMedium }}>{props.item ? props.item?.fiat_currency?.toUpperCase() : '--'}</Text>
              <Image style={{ tintColor: ThemeManager.colors.colorVariationBorder, marginLeft: 10 }} source={ThemeManager.ImageIcons.dropDown} />
            </View>

          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Fonts.dmSemiBold,
  },
  ViewStyle1: {
    backgroundColor: '#B9CADB',
    justifyContent: 'center',
    height: 26,
    width: 26,
    borderRadius: 20,
  },
  imgView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export { BuyItem };
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { toFixedExp } from '../../Utils/MethodsUtils';

