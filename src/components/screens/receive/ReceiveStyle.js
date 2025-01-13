import { StyleSheet, Dimensions } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Images, Colors, Fonts } from "../../../theme";
import {
  dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import { moderateScale } from "../../../layouts/responsive";

export default StyleSheet.create({
  ViewStyle2: {
    justifyContent: "flex-end",
    minHeight: Dimensions.get("screen").height / 3.2,
    paddingHorizontal: 23,
  },
  imgStyle: {
    height: 21,
    width: 17,
    resizeMode: "contain",
    padding: 3,
  },
  ViewStyle: {
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  ViewStyle1: {
    width: 14,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wrap: {
    display: "flex",
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 23,
    paddingTop: 71,
  },
  qrBlock: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: heightDimen(15),
    padding: 20,
    // backgroundColor:'white',

    // paddingHorizontal:35,
    // paddingVertical:35,
  },
  qrAddress: {
    marginHorizontal: widthDimen(20),
    paddingHorizontal: widthDimen(20),
    paddingVertical: widthDimen(10),
    borderWidth: getDimensionPercentage(1),
    borderRadius: getDimensionPercentage(12),
    flexDirection: "row",
    alignItems: "center",
  },
  qrAddressTextStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: moderateScale(16),
    color: Colors.textColor,
    textAlign: "center",
    marginTop: 3
  },
  copyShareButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  copyShareButtonsText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 16,
    color: ThemeManager.colors.text_color,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  warningText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: ThemeManager.colors.text_color,
    lineHeight: heightDimen(24),
    textAlign: "center",
  },
  buttonsStyle: {
    borderRadius: 10,
    marginLeft: 5,
    padding: 15,
    borderWidth: 1,
  },
  imageStyle: {
    height: heightDimen(50),
    width: heightDimen(50),
    resizeMode: "contain",
  },
  imageStyleInfo: {
    height: heightDimen(14),
    width: heightDimen(14),
    resizeMode: "contain",
    left: widthDimen(-5),
    top: heightDimen(3),
  },
  text: {
    alignSelf: "center",
    marginTop: heightDimen(5),
    fontSize: getDimensionPercentage(14),
    fontFamily: Fonts.dmMedium,
  },
  circleView: {
    alignSelf: "center",
    // height: heightDimen(60),
    // width: heightDimen(60),
    // borderRadius: heightDimen(60),
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    margin: heightDimen(20),
    marginTop: heightDimen(30),
    paddingBottom: getDimensionPercentage(20),
    borderRadius: getDimensionPercentage(12),
    fontFamily: Fonts.dmSemiBold
  },
  svg: {
    backgroundColor: 'white',
    borderRadius: 36,
    overflow: 'hidden',
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  copyButtonText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(14),
    lineHeight: dimen(18),
    textAlign: "center",
    marginRight: widthDimen(3),
  },
});
