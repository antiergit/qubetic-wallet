import React from 'react';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Images } from '../../theme';
import { Text, View, Image, TouchableOpacity } from 'react-native';

const InputCustomNumber = props => {

  //******************************************************************************************/
  return (
    <>
      {props.label ? (
        <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText, marginBottom: 5 }, props.txtStyle]}>{props.label}</Text>
      ) : null}

      <View style={[styles.inputStyle, { borderColor: ThemeManager.colors.borderColor, color: ThemeManager.colors.settingsText, flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={props.onPressCode} style={styles.touchStyle}>
          <Text style={styles.textStyle1}>{props.countryCode}</Text>
          <Image style={{ marginLeft: 6 }} source={Images.dropdownnew} />
        </TouchableOpacity>
        <TextInput
          width="100%"
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
      </View>
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  textStyle1: {
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
    color: '#8B9CB5'
  },
  touchStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8B9CB5',
    backgroundColor: '#F1F5F9',
    height: 26,
    paddingHorizontal: 4,
    marginRight: 10,
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
});
export { InputCustomNumber };
import { TextInput, StyleSheet } from 'react-native';
import Singleton from '../../Singleton';
