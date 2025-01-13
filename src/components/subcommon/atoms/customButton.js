import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale } from "../../../layouts/responsive";
import { LanguageManager } from "../../../../LanguageManager";
import { Fonts } from "../../../theme";

const CustomButton = ({ text, color, backgroundColor, onPress, style, styleBtn, disabled }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: backgroundColor,
            borderColor:
              text == LanguageManager.walletMain.receive || LanguageManager.merchantCard.history
                ? "#737373"
                : "#24A09D",
          },
          styleBtn
        ]}
        // onPress={onPress}
        onPress={disabled ? () => { } : onPress}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, { color: color }]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,

  },
  button: {
    backgroundColor: "#24A09D",
    borderWidth: 1,
    borderRadius: 14,
    height: moderateScale(54),
    width: moderateScale(145),
    // flex:1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.dmBold
  },
});

export default CustomButton;
