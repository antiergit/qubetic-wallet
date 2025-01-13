import { StyleSheet } from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import { Colors, Fonts } from "../../../theme/";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../../Utils";

export default StyleSheet.create({
  buttonView: {
    justifyContent: "flex-end",
    // width: '90%',
    flex: 1,
    alignSelf: "center",
  },
  ViewStyle2: {
    // marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },
  txt: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
  },
  codeBg: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  imgStyle1: {
    marginLeft: 8,
    alignSelf: "center",
  },
  ViewStyle22: {
    marginTop: 15,
    alignSelf: "center",
    marginHorizontal: 20,
    minHeight: 60,
    marginBottom: 15,
    paddingHorizontal: 20,
    width: "90%",
    borderRadius: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonStyle: {
    borderColor: Colors.logoutColor,
    borderWidth: 1.5,
  },
  ViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ViewStyle1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imgStyle: {
    height: 8,
    width: 8,
    resizeMode: "contain",
    marginRight: 5,
  },
  wrap: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapStyle: {
    width: 32,
    height: 32,
  },

  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 15,
    color: ThemeManager.colors.whiteText,
  },

  setting_item: {
    marginTop: 20,
    marginBottom: -10,
    backgroundColor: ThemeManager.colors.lightBlack,
    height: 59,
    borderRadius: 7,
    justifyContent: "center",
    padding: 7,
  },
  social_heading: {
    marginTop: 41,
    marginBottom: 15,
  },
  social_textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    color: Colors.textColor,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    minHeight: "10%",
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tokenItem: {
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.borderColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tokenItem2: {
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.borderColor,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tokenItem_first: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tokenImage_style: {
    width: 28,
    height: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderRadius: 38 / 2,
  },
  tokenText_style: {
    fontFamily: Fonts.dmBold,
    fontSize: 16,
    color: Colors.textDark,
    marginRight: 5,
    marginLeft: 10,
  },
  tokenAbr_style: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.coinText,
    marginRight: 5,
    marginLeft: 10,
  },
  tokenItem_last: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  tokenValueTextStyle_style: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: "rgba(50,55,73,0.33)",
  },
  ph_text: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: Colors.themeColor,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  imgRightArrow: {
    height: 8,
    width: 8,
    resizeMode: "contain",
    marginRight: 5,
  },

  imgBackup: {
    resizeMode: "contain",
    height: 32,
    width: 32,
    tintColor: ThemeManager.colors.colorVariation,
  },
  txtChooseCoin: {
    marginTop: 10,
    fontSize: 15,
    alignSelf: "center",
    fontFamily: Fonts.osSemibold,
  },
  lineView: {
    marginTop: 10,
    height: 1,
    width: "100%",
    backgroundColor: "#D3D4D5",
  },

  txtBackupType: {
    marginTop: 10,
    fontSize: 15,
    alignSelf: "center",
    fontFamily: Fonts.dmSemiBold,
  },
  mainView: {
    flex: 1,
    // position:'absolute', top:0, bottom:0, left:0, right:0
  },
  mainViewStyle: {
    flex: 1,
    // paddingBottom:20
    // paddingHorizontal: getDimensionPercentage(24)
  },
  cardStyle: { flexDirection: "row", alignItems: "center", },
  imageStyle: { height: heightDimen(14), width: heightDimen(14) },
  arrowIcon: { height: dimen(16), width: dimen(16), alignSelf: "center" },
  imageStyle2: { height: heightDimen(24), width: heightDimen(24) },
  titleStyle: {
    marginLeft: widthDimen(20),
    fontFamily: dimen(16),
    fontFamily: Fonts.dmMedium,
  },
  imageContainer: {
    height: heightDimen(24),
    width: heightDimen(24),
    borderRadius: dimen(5),
    backgroundColor: "#1975d1",
    justifyContent: "center",
    alignItems: "center",
  },

  txt2: {
    fontSize: dimen(18),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmBold,
    marginRight: dimen(30),
  },
  txt3: {
    fontSize: dimen(14),
    lineHeight: dimen(21),
    fontFamily: Fonts.dmMedium,
    // marginRight:dimen(20),
    marginTop: dimen(17),
  },
  imagetextContainer: {
    marginTop: dimen(43),
    // marginTop: dimen(32),
  },
  imagetextContainerNew: {
    marginTop: dimen(33),
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: dimen(32),
  },
  imagetextContainerOne: {
    flexDirection: "row",
    // alignItems: "center",
    marginTop: dimen(21),
  },
  imagetextContainerTwo: {
    flexDirection: "row",
    marginTop: dimen(15),
  },
  imagetextContainerThree: {
    flexDirection: "row",
    marginTop: dimen(16),
  },
  dotStyle: {
    height: dimen(18),
    width: dimen(18),
    justifyContent: "center",
    marginTop: getDimensionPercentage(3),
    resizeMode: "contain",
    alignSelf: "center",
    // padding:5
    marginTop: 5,
  },
  txt4: {
    fontSize: dimen(12),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmMedium,
    marginLeft: dimen(6),
    // marginRight:1
  },
  btnViewModal: {
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: dimen(35),
    marginBottom: dimen(40),
    marginTop: dimen(36),
  },

  crossIconStyle: {
    height: dimen(20),
    width: dimen(20),
    resizeMode: "contain",
  },

  buttonstyleOne: {
    backgroundColor: ThemeManager.colors.mainColor,
    // borderColor: ThemeManager.colors.mainColor,
    // borderWidth: 1,
    // paddingLeft:10,
    // width: '50%',
    paddingRight: dimen(8),
  },
  buttonstyle: {
    // paddingLeft: dimen(10)
    marginBottom: heightDimen(50),
    // width: '50%',
    // marginLeft: dimen(8),
  },
  borderButtonStyle: {
    width: "99%",
    height: "96%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dimen(14),

  },
});
