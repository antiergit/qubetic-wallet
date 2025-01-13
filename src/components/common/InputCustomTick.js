import React from 'react';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Images } from '../../theme';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { TextInput, StyleSheet } from 'react-native';
import { LanguageManager } from '../../../LanguageManager';

const InputCustomTick = props => {
  const { commonText } = LanguageManager;
  console.log('status:::', props.disabled);

  //******************************************************************************************/
  return (
    <>
      {props.label ? (
        <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText, marginBottom: 5 }, props.txtStyle]}>{props.label}</Text>
      ) : null}

      <View style={[styles.inputStyle, { borderColor: ThemeManager.colors.borderColor, color: ThemeManager.colors.settingsText, flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          ref={props.ref}
          onPressIn={props.onPressIn}
          width="85%"
          style={{ fontFamily: Fonts.dmRegular, fontSize: 14 }}
          allowFontScaling={false}
          secureTextEntry={props.secureTextEntry}
          value={props.value}
          placeholder={props.placeHolder}
          onChangeText={props.onChangeText}
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
        <TouchableOpacity onPress={props.onPressRight} disabled={props.disableRight || props.status == 'verified'}>
          {props.status == 'verify' ? (
            <Text style={[styles.verifyTextStyle, { color: props.disableRight ? ThemeManager.colors.lightText : 'black', paddingHorizontal: 10 }]}>{commonText.Verify}</Text>
          ) : (
            <Image style={styles.imgStyle} source={Images.completed} />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  imgStyle: {
    paddingHorizontal: 6,
    width: 12,
    height: 9,
    right: -20
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  inputStyle: {
    color: ThemeManager.colors.whiteText,
    paddingHorizontal: 22,
    fontSize: 14,
    borderWidth: 1,
    height: 55,
    borderRadius: 10,
    fontFamily: Fonts.dmRegular,
  },
  verifyTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
  },
});
export { InputCustomTick };
