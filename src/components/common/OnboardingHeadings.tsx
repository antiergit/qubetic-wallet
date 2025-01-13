import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Fonts } from "../../theme";
import { dimen, heightDimen } from "../../Utils";
import { ThemeManager } from "../../../ThemeManager";

const OnboardingHeadings = ({ title, subTitle }: { title: string, subTitle: string }) => {
  return (
    <View>
      <Text style={[styles.legalText, { color: ThemeManager.colors.blackWhiteText }]}>
        {title}
      </Text>
      <Text style={[styles.reviewText, { color: ThemeManager.colors.legalGreyColor }]}>
        {subTitle}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  legalText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(27),
    lineHeight: dimen(32),
    marginBottom: heightDimen(12),
  },
  reviewText: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    marginBottom: heightDimen(24),
  },
});


export { OnboardingHeadings };
