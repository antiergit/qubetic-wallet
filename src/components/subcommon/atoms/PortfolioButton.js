import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale } from "../../../layouts/responsive";
import { LanguageManager } from "../../../../LanguageManager";
import { Fonts, Images } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
import { heightDimen } from "../../../Utils";

const PortfolioButton = ({ text, color, image = Images.walletSendIcon, backgroundColor, onPress, style, styleBtn, disabled, imageStyle, isSwapAvailable }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          styleBtn
        ]}
        onPress={disabled ? () => { } : onPress}
        disabled={disabled}
      >
        <View>
          <Image source={image} style={imageStyle} />
        </View>
        <Text style={[styles.buttonText, { color: ThemeManager.colors.legalGreyColor }]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18.23),
    fontFamily: Fonts.dmMedium,
    marginTop: heightDimen(5)
  },
});

export default PortfolioButton;
