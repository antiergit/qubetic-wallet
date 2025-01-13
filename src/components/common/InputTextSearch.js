import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Fonts, Colors, Images } from '../../theme';
import FastImage from 'react-native-fast-image';
import { ThemeManager } from '../../../ThemeManager';
import { getDimensionPercentage } from '../../Utils';


const InputtextSearch = (props) => {
  //******************************************************************************************/
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={[
        styles.inputWrapStyle,
        props.style,
        { borderColor: ThemeManager.colors.inputBorder },
      ]}
    >
      {props.label ? (
        <Text
          allowFontScaling={false}
          style={[styles.labelTextStyle, props.labelStyle]}
        >
          {props.label}
        </Text>
      ) : null}

      {props.search && (
        <View style={styles.SearchImgStyle}>
          <Image
            style={[
              styles.ImgStyle1,
              // { tintColor: ThemeManager.colors.subTextColor },
            ]}
            source={ThemeManager.ImageIcons.searchIcon}
          />
        </View>
      )}

      <TextInput
        maxLength={props.maxLength}
        autoCapitalize={props.autoCapitalize}
        editable={props.editable}
        style={[
          styles.inputStyle,
          props.inputStyle,
          {
            paddingLeft: props.search ? 8 : 25,
            color: ThemeManager.colors.blackWhiteText,
          },
        ]}
        placeholder={props.placeholder}
        onChangeText={props.onChangeNumber}
        placeholderTextColor={ThemeManager.colors.placeHolderText || props.placeholderTextColor}
        value={props.value}
        keyboardType={props.keyboardType}
        onBlur={props.onBlur}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}
        allowFontScaling={false}
        onPressIn={props.onPressIn}
        keyboardAppearance="dark"
      />
      {props.clear && (
        <TouchableOpacity onPress={props.pressClear} style={styles.ImgStyle}>
          <FastImage
            tintColor={ThemeManager.colors.lightWhiteText}
            style={{ width: 28, height: 28 }}
            resizeMode={FastImage.resizeMode.contain}
            source={Images.close_icon}
          />
        </TouchableOpacity>
      )}
      <View style={props.rightStyle}>{props.children}</View>
    </TouchableOpacity>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ImgStyle1: {
    height: getDimensionPercentage(22),
    width: getDimensionPercentage(22),
    resizeMode: 'contain',
  },
  inputWrapStyle: {
    alignSelf: "center",
    position: "relative",
    // width: "90%",
    flexDirection: "row",
    marginTop: 19,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 15,
    height: 40,
    marginBottom: 8
  },
  labelTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: Colors.White,
    textAlign: "center",
  },
  inputStyle: {
    height: 50,
    paddingLeft: 5,
    color: ThemeManager.colors.placeholderColorNew,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    flex: 1,
    // marginHorizontal:15,
    // width: "85%",
    alignSelf: "center",
    // marginTop: Platform.OS == "ios" ? 0 : 5,
  },
  SearchImgStyle: {
    // width: "10%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,

  },
  ImgStyle: {
    width: "10%",
    // alignItems: 'flex-end',
    justifyContent: "center",
    // marginLeft: 18,
    // backgroundColor: 'red'
  },
});

export { InputtextSearch };
