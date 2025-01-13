import { Platform, StatusBar, StyleSheet } from 'react-native';
import { fonts } from '../../Theme/Fonts';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  hasNotchWithIOS,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import { FONT_16, FONT_26 } from '../../utils/FontsConstant';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts } from '../../../theme';
import colors from '../../../theme/Colors';
import { horizontalScale, moderateScale } from '../../../layouts/responsive';
import { platform } from 'process';


export default StyleSheet.create({
  mainView: {
    flex: 1,
    // paddingHorizontal: dimen(24),

  },
  mainViewStyle: {
    flex: 1,

  },
  headerTextStyle: {
    color: ThemeManager.black,
  },
  txtheading: {
    marginTop: dimen(30),
    textAlign: 'center',
    fontSize: dimen(24),
    lineHeight: dimen(36),
    color: ThemeManager.cloudy,
    fontFamily: Fonts.dmMedium,
  },
  styleMargin: {
    // marginHorizontal: dimen(8),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor:'red'


  },

  subView: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginTop: heightDimen(10)
  },
  subViewTwo: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginTop: heightDimen(10)
    // alignItems: 'center'
  },
  txtStyleOne: {
    // textAlign: 'left',
    fontSize: dimen(14),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmRegular,
    marginLeft: widthDimen(10),
    flex: 1,
    // backgroundColor:'red'

  },
  txtStyleTwo: {
    // textAlign: 'left',
    fontSize: dimen(14),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmRegular,
    marginLeft: widthDimen(10),
    flex: 1,
    // backgroundColor:'red'
  },

  mainBtnView: {
    marginBottom: hasNotchWithIOS() ? heightDimen(50) : heightDimen(20),
    marginTop: heightDimen(20),
  },
  btnViewModal: {
    marginBottom: dimen(40),
    marginTop: dimen(32),
    width: '95%',

  },
  txtButtonContainer: {
    // backgroundColor:'red',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: dimen(24)
  },

  buttonstyle: {
    backgroundColor: ThemeManager.mainColor,
    width: '100%',
  },
  mnemonicsStyle: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: dimen(18.34),
  },
  mnemonic: {
    borderRadius: dimen(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: heightDimen(10),
    paddingVertical: heightDimen(8),
    paddingHorizontal: widthDimen(5),
    width: "31%"
  },
  mnemonicBg: {
    // overflow:'hidden',
    borderRadius: 14,
    paddingHorizontal: dimen(16.96),
    marginTop: heightDimen(11.66),
    marginHorizontal: (5.83),
    height: dimen(43.92),
    justifyContent: 'center'
  },
  serialStyle: {
    color: ThemeManager.cloudy,
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(14)
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(16),
    lineHeight: dimen(27.17)
  },
  copyMainView: {
    marginTop: dimen(30),
    minHeight: 170
  },
  copyView: {
    flexDirection: 'row',
    borderRadius: dimen(14),
    // paddingHorizontal: dimen(16),
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    minHeight: 400,
    position: 'relative',
    overflow: 'hidden',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: ThemeManager.white,
    paddingTop: 8,
  },
  swipeTopLine: {
    backgroundColor: ThemeManager.topLineModalColor,
    height: 5,
    width: 40,
    borderRadius: 3,
    marginTop: dimen(10),
  },
  headingStyle: {
    fontSize: dimen(18),
    lineHeight: dimen(22),
    paddingHorizontal: dimen(50),
    fontFamily: Fonts.dmBold,
    textAlign: 'center',
    marginTop: dimen(12),
  },
  paraView: {
    alignSelf: 'flex-start',
  },
  imagetextContainer: {
    flexDirection: 'row',
    marginTop: dimen(32),
  },
  imagetextContainerTwo: {
    flexDirection: 'row',
    marginTop: dimen(16),
    // alignSelf:"flex-start",
    // justifyContent:"space-between",
    // backgroundColor:"red"
  },
  txt1: {
    fontSize: dimen(18),
    lineHeight: dimen(22),
    color: ThemeManager.black,
    fontFamily: Fonts.dmBold,
    textAlign: 'center',
    marginTop: dimen(12),
  },
  txt2: {
    fontSize: dimen(14),
    lineHeight: dimen(22),
    color: ThemeManager.black,
    fontFamily: Fonts.dmMedium,
    // textAlign: 'flex-start',
    marginLeft: dimen(8),
  },

  lastPara: {
    fontSize: dimen(14),
    lineHeight: dimen(22),
    color: ThemeManager.mainColor,
    fontFamily: Fonts.dmMedium,
    // textAlign: 'flex-start',
    marginLeft: dimen(8),
  },
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: ThemeManager.colors.dividerColor,
    marginHorizontal: dimen(4),
    marginTop: dimen(15),

  },
  checkboxbg: {
    backgroundColor: ThemeManager.black,
    borderRadius: 12,
    marginVertical: 10,
  },
  marginVw: {
    marginTop: -10,
    marginHorizontal: 10,
  },
  logo: {
    height: dimen(105),
    width: dimen(101),
    resizeMode: 'contain',
    marginTop: dimen(24),
  },
  dotStyle: {
    height: dimen(6),
    width: dimen(6),
    resizeMode: 'contain',
    marginTop: 5,
  },
  dotStyleTwo: {
    height: dimen(6),
    width: dimen(6),
    resizeMode: 'contain',
    marginTop: 5,
  },
  alertIconStyle: {
    height: dimen(15),
    width: dimen(17),
    resizeMode: 'contain',
    marginTop: dimen(5),
  },
  mainStyle: {
    alignItems: 'center',
    // marginHorizontal: dimen(24),
  },
  imgView: {
    paddingVertical: dimen(14),
    paddingLeft: dimen(13),
  },
  copyIconStyle: {
    resizeMode: 'contain',
  },
  copyText: {
    fontSize: dimen(16),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmBold,
    marginLeft: dimen(4),
    paddingVertical: dimen(13),
    paddingRight: dimen(15),
    color: ThemeManager.mainColor,
  },
  tickImgStyle: {
    height: dimen(22),
    width: dimen(22),
    resizeMode: 'contain',
    marginTop: heightDimen(3)
  },
  unCheckBox: {
    height: dimen(20),
    width: dimen(22),
    borderWidth: 1.5,
    borderRadius: 3,
    marginTop: heightDimen(5),
  },
  checkImg: {
    width: dimen(17), height: dimen(17), marginRight: widthDimen(8)
  },
});
