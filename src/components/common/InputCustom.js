import React from 'react';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts } from '../../theme';
import { Text, View } from 'react-native';
import { TextInput, StyleSheet } from 'react-native';
import Singleton from '../../Singleton';
import { getDimensionPercentage, widthDimen } from '../../Utils';
const InputCustom = props => {

  //******************************************************************************************/
  return (
    <>
      {props.showText ? (
        <View style={[styles.ViewStyle, { borderColor: ThemeManager.colors.inputBorder, paddingHorizontal: props.value ? 19 : 15 }]}>
          <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.subTextColor }]}>{props.value ? Singleton.getInstance().CurrencySymbol : ''}</Text>
          <TextInput
            onFocus={props.onFocus}
            allowFontScaling={false}
            secureTextEntry={props.secureTextEntry}
            value={props.value?.toString()}
            placeholder={props.placeHolder}
            onChangeText={props.onChangeText}
            style={[styles.inputStyleNew, { color: ThemeManager.colors.subTextColor }]}
            autoCorrect={false}
            keyboardType={props.keyboardType}
            editable={props.editable}
            maxLength={props.maxLength}
            placeholderTextColor={props.placeholderTextColor}
            placeholderColor={ThemeManager.colors.lightWhiteText}
            autoCapitalize={props.autoCapitalize}
            onBlur={props.onBlur}
            onSubmitEditing={props.onSubmitEditing}
            returnKeyType={props.returnKeyType}
            numberOfLines={1}
          />
        </View>
      ) : (
        <>
          {props.label ? (
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText, marginBottom: 5 }, props.txtStyle]}>{props.label}</Text>
          ) : null}

          <TextInput
            allowFontScaling={false}
            secureTextEntry={props.secureTextEntry}
            value={props.value}
            placeholder={props.placeHolder}
            onChangeText={props.onChangeText}
            style={[styles.inputStyle, props.customInputStyle, { borderColor: ThemeManager.colors.inputBorder, color: ThemeManager.colors.blackWhiteText }]}
            autoCorrect={false}
            keyboardType={props.keyboardType}
            editable={props.editable}
            maxLength={props.maxLength}
            placeholderTextColor={props.placeholderTextColor}
            placeholderColor={ThemeManager.colors.lightWhiteText}
            autoCapitalize={props.autoCapitalize}
            onBlur={props.onBlur}
            onSubmitEditing={props.onSubmitEditing}
            returnKeyType={props.returnKeyType}
            onFocus={props.onFocus}
          />
        </>
      )}
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  textStyle: {
    fontSize: getDimensionPercentage(14),
    fontFamily: Fonts.dmRegular,
  },
  ViewStyle: {
    paddingHorizontal: widthDimen(22),
    borderWidth: 1,
    height: getDimensionPercentage(55),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyle: {
    // color: ThemeManager.colors.whiteText,
    paddingHorizontal: widthDimen(16),
    // alignSelf:"center",
    fontSize: getDimensionPercentage(16),
    // borderWidth: 1,
    // lineHeight: getDimensionPercentage(24),
    height: getDimensionPercentage(50),
    borderRadius: 10,
    fontFamily: Fonts.dmRegular,
    // 
  },
  inputStyleNew: {
    color: ThemeManager.colors.whiteText,
    paddingHorizontal: widthDimen(5),
    fontSize: getDimensionPercentage(16),
    height: getDimensionPercentage(55),
    fontFamily: Fonts.dmRegular,
    width: '100%',
  },
});
export { InputCustom };


