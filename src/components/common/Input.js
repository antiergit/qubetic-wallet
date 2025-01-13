import React, { memo } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../Utils";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts } from "../../theme";
import colors from "../../theme/Colors";
import { moderateScale } from "../../layouts/responsive";

const _Input = ({
  placeholder,
  onChangeText,
  value,
  label,
  style,
  limit,
  multiline,
  numberOfLines,
  inputStyle,
  containerStyle,
  backgroundColor,
  onFocus,
  onBlur,
  returnKeyType = "done",
  maxLength,
  keyboardType,
  editable,
  labelcustom,
  text,
  labelTwo,
  labelOne,
  labelRow,
  disabled,
}) => {
  return (
    <View style={{ width: "100%", ...containerStyle }}>
      {label ? (
        <Text style={[styles.labelStyle, labelcustom]}>{label}</Text>
      ) : null}
      {labelRow ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: dimen(26),
            marginBottom: dimen(10),
          }}
        >
          <Text
            style={[
              styles.labelStyle,
              labelcustom,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {labelOne}
          </Text>
          <Text
            style={[
              styles.labelStyle,
              labelcustom,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {labelTwo}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.container,
          backgroundColor ? { backgroundColor: backgroundColor } : {},
          style,
        ]}
      >
        <TextInput
          disabled={disabled}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          multiline={multiline}
          editable={editable}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardAppearance="dark"
          numberOfLines={numberOfLines}
          placeholderTextColor={ThemeManager.colors.placeHolderText}
          style={[
            styles.textInput,
            inputStyle,
            { borderColor: ThemeManager.colors.inputBorder },
          ]}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {limit ? <Text style={styles.limitStyle}>{limit}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: dimen(12),
    backgroundColor: ThemeManager.white,
    width: "100%",
    height: dimen(50),
    marginTop: heightDimen(10),
  },
  textInput: {
    fontFamily: Fonts.dmRegular,
    color: colors.Black,
    fontSize: dimen(16),
    flex: 1,
    borderRadius: moderateScale(24),
    lineHeight: dimen(20.83),
    borderWidth: 1,
    top: Platform.OS == "android" ? 1 : 0,
    paddingHorizontal: dimen(16),
  },
  limitStyle: {
    color: ThemeManager.colors.settingsText,
    fontFamily: Fonts.dmSemiBold,
    alignSelf: "flex-end",
    fontSize: dimen(14),
    lineHeight: dimen(24),
    marginTop: dimen(12),
  },
  labelStyle: {
    color: ThemeManager.colors.subTextColor,
    fontSize: dimen(14),
    lineHeight: dimen(18.23),
    fontFamily: Fonts.dmMedium,
  },
});

export const Input = memo(_Input);
