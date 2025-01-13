import React, { useEffect, useState } from 'react';
import { Fonts, Colors, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';

const InputCustomWithDeposit = props => {
  const [themeSelected, setThemeSelected] = useState(2);

  //******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
  }, []);

  //******************************************************************************************/
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={props.onPress}
      style={[styles.ViewStyle, props.outsideView, { borderColor: ThemeManager.colors.borderColor }]}>
      {props.children}
      <TextInput
        onFocus={props.onFocus}
        secureTextEntry={props.secureTextEntry}
        value={props.value}
        placeholder={props.placeHolder}
        onChangeText={props.onChangeText}
        style={[styles.inputStyle, props.customInputStyle, { color: ThemeManager.colors.settingsText }]}
        autoCorrect={false}
        keyboardType={props.keyboardType}
        editable={props.editable}
        maxLength={props.maxLength}
        placeholderTextColor={props.placeholderTextColor}
        allowFontScaling={false}
      />
      <View style={[styles.ViewStyle1, props.customBtnsView]}>

        {props.isText == true ? (
          <View disabled={props.disablePaste} style={{ alignSelf: 'center', paddingVertical: 5 }} onPress={props.onPressPaste}>
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.Text }]}>{props.Txt}</Text>
          </View>
        ) : null}

        {props.isImage == true ? (
          <TouchableOpacity
            style={[{ marginRight: 15 }, props.copystyle]}
            onPress={async () => { props.doCopy() }}>
            <Image source={props.image} style={{ tintColor: ThemeManager.colors.qrCodeColor }} />
          </TouchableOpacity>
        ) : null}

      </View>
    </TouchableOpacity>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle1: {
    width: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ViewStyle: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: 10,
    paddingRight: 10,
    height: 55,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 16,
    marginRight: 12,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.whiteText,
  },
  inputStyle: {
    color: ThemeManager.colors.whiteText,
    paddingHorizontal: 22,
    fontSize: 16,
    height: 55,
    borderRadius: 10,
    fontFamily: Fonts.dmMedium,
    width: '75%',
  },
});
export { InputCustomWithDeposit };
import {
  TextInput,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getData } from '../../Utils/MethodsUtils'; import { EventRegister } from 'react-native-event-listeners';

