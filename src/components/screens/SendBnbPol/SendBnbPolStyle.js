import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { moderateScale } from '../../../layouts/responsive';
import { widthDimen } from '../../../Utils';
export default StyleSheet.create({
  sendBtnStyle: {
    marginTop: 20,
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
  ViewStyle8: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  TextStyle2: {
    fontSize: 12,
    fontFamily: Fonts.dmRegular,
    marginTop: -4,
  },
  feeView: {
    paddingVertical: 10,
    width: '100%',
    borderRadius: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 15
  },
  TextStyle1: {
    marginBottom: 7,
    fontSize: 16,
    fontFamily: Fonts.dmBold,
  },
  ViewStyle6: {
    width: '100%',
    justifyContent: 'space-between',
    borderColor: 'grey',
    borderWidth: 0,
    marginTop: 20,
  },
  TextStyle: {
    marginTop: 3,
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    textAlign: 'right',
    width: '45%',
  },
  ViewStyle5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
  },
  fiatStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    marginLeft: widthDimen(4),
    // marginTop: 3,
    // width: '40%',
  },
  cameraStyle: {
    height: Dimensions.get('window').height / 2,
    width: '80%',
    alignSelf: 'center',
  },
  maxText: {
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,

  },
  ViewStyle4: {
    borderColor: 'transparent',
    borderWidth: 0,
    fontSize: 16,
    width: '70%',
    paddingLeft: 15,
    alignSelf: "center",

  },
  ViewStyle7: {
    fontSize: 16,
  },
  maxStyle: {
    height: 52,
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinSymbolStyle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  ViewStyle: {
    justifyContent: 'center',
    height: 55,
    borderRadius: moderateScale(14),
    padding: 4,
    borderWidth: 1,
    backgroundColor: ThemeManager.colors.inputBorder
  },
  ViewStyle1: {
    alignSelf: 'center',
    width: '72%',
    // paddingTop: Platform.OS == 'ios' ? 0 : 8,
    // marginTop: 5,
    // height: Platform.OS === 'android' ? 44 : 30,
  },
  ViewStyle2: {
    marginTop: -20,
    height: 56,
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
  },
  ViewStyle3: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ImgStyle: {
    borderRadius: 100,
    resizeMode: 'contain',
    height: 25,
    width: 25,
    alignSelf: 'center',
  },
  scan: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalView: {
    borderRadius: 12,
    paddingBottom: 0,
  },
  txtWallet: {
    fontFamily: Fonts.dmRegular,
    fontSize: moderateScale(14),
    color: ThemeManager.colors.whiteText,
    marginBottom: 10,
  },
  txtWallet1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.colorVariation,
    marginBottom: 10,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    color: ThemeManager.colors.whiteText,
  },
  securityItem_list_textstyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 15,
    color: ThemeManager.colors.whiteText,
    marginLeft: 7,
  },
  securityItem_list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  mainView: {
    paddingHorizontal: 23,
    minHeight: 10,
    marginTop: 20,
  },
  txtCancel: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 15,
    marginTop: 20,
    marginRight: 25,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  view2: {
    backgroundColor: ThemeManager.colors.lightBlack,
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  lineView: {
    backgroundColor: ThemeManager.colors.Mainbg,
    height: 1,
    width: '100%',
    marginVertical: 5,
  },
  txtCharErr: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    padding: 4,
    color: ThemeManager.colors.colorVariation,
    alignSelf: 'flex-start',
    marginTop: -10,
    marginBottom: 10,
  },

  progressBar: {
    height: 10,
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressCompleted: {
    backgroundColor: '#4caf50',
    height: '100%',
  },
  progressRemaining: {
    backgroundColor: '#ddd',
    height: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'gray',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'gray',
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedCircle: {
    backgroundColor: 'green', // Change color for selected option
  },
});
