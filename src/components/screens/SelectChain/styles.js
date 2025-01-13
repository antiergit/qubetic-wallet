import { StyleSheet } from "react-native";
import { getDimensionPercentage, heightDimen } from "../../../Utils";
import { Fonts } from "../../../theme";
import fonts from "../../../theme/Fonts";

export const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: getDimensionPercentage(22),
  },
  importStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: getDimensionPercentage(14),
    marginBottom: getDimensionPercentage(16),
  },
  createMArkerStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: getDimensionPercentage(14),
    marginBottom: getDimensionPercentage(16),
    marginTop: getDimensionPercentage(24),
  },
  importCard: {
    flexDirection: "row",
    paddingVertical: heightDimen(20),
    marginTop: heightDimen(10),
    paddingHorizontal: heightDimen(10),
    alignItems: "center"
  },
  importTitle: {
    fontFamily: fonts.dmBold,
    fontSize: 18,
    lineHeight: 23
  },
  importDescription: {
    fontFamily: fonts.dmMedium,
    fontSize: 14,
    lineHeight: 18
  },
});
