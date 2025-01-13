import React from 'react';
import { Fonts, Colors } from '../../theme';

const InputCustomWithPasteButton = props => {

  //******************************************************************************************/
  return (
    <View style={styles.ViewStyle}>
      <TextInput
        secureTextEntry={props.secureTextEntry}
        value={props.value}
        placeholder={props.placeHolder}
        onChangeText={props.onChangeText}
        style={[styles.inputStyle, props.customInputStyle]}
        autoCorrect={false}
        keyboardType={props.keyboardType}
        editable={props.editable}
        maxLength={props.maxLength}
        placeholderTextColor={props.placeholderTextColor}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        allowFontScaling={false}
      />
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle: {
    flexDirection: 'row',
    width: '88%',
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: 12,
    borderColor: 'transparent',
    paddingEnd: 10,
  },
  inputStyle: {
    color: Colors.inputTextColor,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: Colors.White,
    height: 52,
    fontFamily: Fonts.dmRegular,
    width: '100%',
  },
});
export { InputCustomWithPasteButton };
import { TextInput, View, StyleSheet } from 'react-native';
