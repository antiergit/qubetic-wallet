
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';



export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(25)

  },
  subView: {
    flex: 1,
    marginTop: dimen(24)

  },
  walletNameText: {
    fontFamily: Fonts.dmBold,
    fontSize: 16,

  },
  subwallText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,

  },
  descText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    marginTop: dimen(10),
    textAlign: 'center'
  },
  importText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    alignSelf: 'center'

  },
  mainStyle: {
    // alignItems: 'center',
  },
  mainStyleOne: {
  },
  logo: {
    // height: dimen(105),
    // width: dimen(101),
    resizeMode: 'contain',
    marginTop: dimen(24),
  },
  textStyle: {
    fontSize: dimen(18),
    lineHeight: dimen(23),
    fontFamily: Fonts.dmBold,
    marginLeft: dimen(15)
  },
  headingStyle: {
    fontSize: dimen(18),
    lineHeight: dimen(22),
    paddingHorizontal: dimen(50),
    fontFamily: Fonts.dmBold,
    textAlign: 'center',
    // marginTop: dimen(12),
  },
  paraView: {
    alignSelf: 'flex-start',
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
  cardCrossStyle: {
    height: dimen(20),
    width: dimen(20),
    resizeMode: 'contain',
    alignSelf: 'center',
    // marginTop: 5,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 1,
    // backgroundColor: ThemeManager.colors.modalBg,
  },
  txt2: {
    fontSize: dimen(18),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmBold,
    marginRight: dimen(30)
  },
  txt3: {
    fontSize: dimen(14),
    lineHeight: dimen(21),
    fontFamily: Fonts.dmMedium,
    // marginRight:dimen(20),
    marginTop: dimen(17)
  },
  ViewStyle2: {
    // marginTop: -10,
    // height: 56,
    // flexDirection: 'row',
    borderRadius: 10,
    // borderWidth: 1,
  },
  ViewStyle4: {
    borderColor: 'transparent',
    borderWidth: 0,
    fontSize: 16,
    // width: '70%',
    backgroundColor: "rgba(7, 24, 24, 1)"    // marginLeft: 5,

  },
  txtWallet: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(14),
    lineHeight: dimen(21),
    color: ThemeManager.colors.whiteText,
    // marginBottom: 10,
  },
  txtDelete: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(14),
    lineHeight: dimen(21),
    color: ThemeManager.colors.whiteText,
    marginTop: dimen(15),
    marginBottom: dimen(30),
  },
  dotStyle: {
    height: dimen(16),
    width: dimen(16),
    // resizeMode: 'contain',
    alignSelf: "center",
    // backgroundColor:"red",
    // padding:5
    // marginTop: 5,
  },
  paraView: {
    alignSelf: 'flex-start',
  },

  imagetextContainerOne: {
    flexDirection: 'row',
    marginTop: dimen(21),
  },
  imagetextContainerTwo: {
    flexDirection: 'row',
    marginTop: dimen(15),
  },
  imagetextContainerThree: {
    flexDirection: 'row',
    marginTop: dimen(16),
  },
  txt4: {
    fontSize: dimen(14),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmMedium,
    marginLeft: dimen(6),
    // marginRight:1
  },



  btnViewModal: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: dimen(35),
    marginBottom: dimen(40),
    marginTop: dimen(36),
  },

  crossIconStyle: {
    height: dimen(20),
    width: dimen(20),
    resizeMode: "contain"
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
    backgroundColor: ThemeManager.colors.mainColor,
    marginBottom: heightDimen(50)
    // width: '50%',
    // marginLeft: dimen(8),
  },

  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    elevation: 1,
  },
  modalView: {
    // backgroundColor: Colors.successColor,
    borderRadius: 12,
    padding: getDimensionPercentage(20),
    width: '90%',
    borderWidth: 1,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
  },

});