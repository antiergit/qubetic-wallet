import { Dimensions, StyleSheet } from "react-native";
import { dimen, getDimensionPercentage } from "../../../Utils";
import { Fonts } from "../../../theme";

export const styles = StyleSheet.create({
  placeHolderStyle: {
    fontSize: dimen(16),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmMedium,
  },
  textStyle: {
    fontSize: dimen(14),
    fontFamily: Fonts.dmRegular,
    marginTop: dimen(24),
  },
  cameraStyle: {
    height: Dimensions.get("window").height / 2,
    width: "80%",
    alignSelf: "center",
  },
  cancelText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 15,
    marginTop: 20,
    marginRight: 25,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});
