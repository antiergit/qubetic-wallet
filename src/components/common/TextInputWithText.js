import React from 'react';
import { Text, TextInput, Image, StyleSheet, View } from 'react-native';
import { Colors, Fonts } from '../../theme';

const TextInputWithText = props => {

  /******************************************************************************************/
  return (
    <View style={styles.bgView}>
      <Text
        allowFontScaling={false}
        style={[styles.textStyle, props.textStyle]}>
        {props.Text}
      </Text>
      <View style={[styles.View, props.ViewStyle]}>
        <TextInput
          style={[styles.TextInputStyle, props.TextInputstyle]}
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          value={props.value}
          editable={props.editable}
          autoCapitalize={props.autoCapitalize}
          secureTextEntry={props.secureTextEntry}
          defaultValue={props.defaultValue}
          autoCorrect={false}
          keyboardType={props.keyboardType}
          placeholderTextColor={props.placeholderTextColor}
          allowFontScaling={false}
        />
        <Image style={[styles.ImgStyle, props.ImgStyle]} source={props.img} />
      </View>
      <View style={props.bottomView}></View>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  bgView: {
    flexDirection: 'column',
    paddingHorizontal: 24,
    marginTop: 28,
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 12,
    color: Colors.textLight,
  },
  View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    maxHeight: 55,
    borderColor: Colors.defaultInputBorderColor,
    borderWidth: 1,
    marginTop: 5,
    borderRadius: 3,
    paddingHorizontal: 20,
    backgroundColor: Colors.White,
  },
  ImgStyle: {
    alignSelf: 'center',
  },

  TextInputStyle: {
    fontSize: 20,
    fontFamily: Fonts.dmRegular,
    color: Colors.Black,
    opacity: 22,
    flexGrow: 1,
    width: '78%',
  },
});

export { TextInputWithText };
