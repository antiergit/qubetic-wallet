import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '../../../theme';

export default StyleSheet.create({
  sendBtnStyle: {
    // marginTop: 20,
    marginBottom: 25,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sendBtnTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  imgView: {
    height: 25,
    width: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.border
  },
  myStyle: {
    alignSelf: 'center',
    width: '100%',
    fontFamily: Fonts.dmBold,
    fontSize: 18,
    color: Colors.txt_new,
    lineHeight: 39,
    letterSpacing: 0.13,
    textAlign: 'center',
  },
  signView: {
    marginTop: 10,
    alignSelf: 'center',
    marginHorizontal: 22,
    width: '88%',
    borderColor: '#99A5B4',
    borderWidth: 1,
    // borderRadius: 10,
    // height: 88,
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  buttonStyle2: {
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingLeft: 20
  },
  buttonStyle: {
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  buttonText: {
    fontFamily: Fonts.dmMedium
  },
  touchableOuterView2: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20
  },
  checkTouchStyle: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 30,
    justifyContent: "flex-start",
  },
  checkStyle: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 5
  },
  readAndAccept: {
    color: Colors.Black,
    fontSize: 13,
    fontFamily: Fonts.dmRegular,
    paddingLeft: 10
  },
  wrapMainStyle: {
    flex: 1,
    // paddingHorizontal: 22,
    marginTop: 30,
  },
  titleStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center'
  },
  subtitleStyle: {
    paddingHorizontal: 20,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 20
  },
  subText: {
    paddingHorizontal: 20,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 20
  },
  subtitleStyle1: {
    paddingHorizontal: 20,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 20
  },
  subtitleStyleNew: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 20
  },
  subtitleStyle12: {
    paddingHorizontal: 20,
    fontFamily: Fonts.dmBold,
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 20
  },
  link: {
    color: 'blue',
    paddingHorizontal: 20,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    textAlign: 'left',
    textDecorationLine: 'underline',
    marginTop: 2
  },
  entertitleStyle: {
    textDecorationLine: 'none',
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.placeholderColor,
    marginBottom: 10,
  },
  numbertitleStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    color: Colors.placeholderColor,
    marginBottom: 10,
  },
  subTitleStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.borderLight,
    marginBottom: '8%',
  },
  buttonWrap: {
    paddingVertical: 40,
  },
  agreetitleStyle: {
    fontFamily: Fonts.dmRegular,
    color: Colors.dark,
  },
  termstitleStyle: {
    fontFamily: Fonts.dmRegular,
    color: Colors.Black,
    fontSize: 12

  },
  termsView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    marginHorizontal: 5,
  },
  checkBoxView: {
    width: 20,
    height: 20,
    backgroundColor: Colors.White,
    borderRadius: 5,
    marginRight: 10,
    borderColor: Colors.buttonBgColor,
    borderWidth: 1,
  },
  checkBoxViewSelected: {
    width: 20,
    height: 20,
    backgroundColor: Colors.buttonBgColor,
    borderRadius: 5,
    marginRight: 10,
  },
  unselectedView: {
    width: 25,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.grayBlack,
    marginRight: 3.5
  },
  selectedView: {
    width: 25,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.buttonBgColor,
    marginRight: 3.5
  },
  proptitleStyle: {
    paddingHorizontal: 22,
    fontFamily: Fonts.dmBold,
    fontSize: 16,
    color: Colors.Black,
    marginBottom: 10,
    alignSelf: 'center'
  },
  proptitleStyle1: {
    paddingHorizontal: 22,
    fontFamily: Fonts.dmBold,
    fontSize: 16,
    color: Colors.Black,
    marginBottom: 10,
  },
  leftTitleStyle: {
    paddingHorizontal: 22,
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    color: Colors.Black,
    marginTop: 40,
    // alignSelf: 'center'
  },
  proptitleStyle11: {
    paddingHorizontal: 22,
    fontFamily: Fonts.dmBold,
    fontSize: 16,
    color: Colors.Black,
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  text1: {
    paddingHorizontal: 22,
    fontFamily: Fonts.dmBold,
    fontSize: 14,
    color: Colors.Black,
    marginTop: 10,
    textDecorationLine: 'underline'
  },
  clearview: {
    alignSelf: 'flex-end',
    marginVertical: 15
  },
  cleartitleStyle: {
    fontFamily: Fonts.dmRegular,
    color: Colors.logoutColor,
    fontSize: 14

  },
  contentTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 13,
    color: Colors.Black,
  },
});