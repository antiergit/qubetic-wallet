import { StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  touchableStyle2: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  touchableStyle: {
    marginTop: 20,
    // width: '55%',
    alignSelf: 'center',
    paddingVertical: 5
  },
  restoreStyle: {
    fontFamily: Fonts.dmMedium,
    textDecorationLine: 'underline',
    color: Colors.textColor,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: Fonts.dmBold,
    color: ThemeManager.colors.whiteText,
    marginBottom: 15
  },
  touchableStyle1: {
    height: 35,
    width: 35,
    alignSelf: 'flex-end',
    marginBottom: 15
  },
  wallet_itemText: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: Colors.textColor,
    textAlign: 'center',
    alignSelf: 'center',
  },
  wallet_item: {
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 8,
    paddingHorizontal: 15,
    borderBottomColor: ThemeManager.colors.underLineColor,
  },
  imgStyle: {
    height: 32,
    width: 32,
    borderRadius: 32,
    resizeMode: 'contain',
    marginRight: 9,
    alignSelf: 'center'
  },
  ViewStyle: {
    paddingVertical: 15,
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ViewStyle1: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  imgStyle2: {
    marginLeft: 10,
  },
  imgStyle1: {
    height: 79,
    width: 79,
    resizeMode: 'contain',
  },
  stepStyle: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  wrap: {
    flex: 1,
    paddingHorizontal: widthDimen(20),
    marginTop: heightDimen(30),
  },
  subHeaderStyle: {
    marginTop: 20,
  },
  titlStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 26,
    color: ThemeManager.colors.whiteText,
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: ThemeManager.colors.lightWhiteText,
    textAlign: 'center',
  },
  pin_wrap: {
    alignItems: 'center',
    flex: 0.56,
    justifyContent: 'flex-end',
  },
  pinBlockStyle: {
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
    // borderColor: 'red',
    // borderRadius: 100,
    // padding: getDimensionPercentage(10),

    // padding: 7,
    // textAlign: 'center',
    // alignSelf: 'center',
    // marginRight: 40,
    // margin: Dimensions.get('screen').height > 800 ? 20 : 10,
    // backgroundColor:'green',

    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40),
    justifyContent: 'center',
    alignItems: 'center'


  },
  listStyle: {
    alignItems: 'center',
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
    // padding: getDimensionPercentage(10),
    // margin: Dimensions.get('screen').height > 800 ? 20 : 10,
    // backgroundColor:'pink',
    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40)
  },
  pinBlockTextStyle: {
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.headersTextColor,
    fontSize: getDimensionPercentage(30),
    textAlign: 'center',
    lineHeight: getDimensionPercentage(39)
  },
  itemsStyle: {
    marginHorizontal: 5,
    width: 12,
    height: 12,
    borderRadius: 20,
    borderWidth: 0.7,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',// 'flex-end',
    width: '100%',
    alignItems: 'center',// 'flex-end',
    backgroundColor: '#00000077',
  },
  modalView: {
    minHeight: 350,
    // flex: Platform.OS == 'android' ? 0.45 : 0.5,
    backgroundColor: Colors.White,
    borderRadius: 10,
    // borderTopLeftRadius: 10,
    width: '90%',
    elevation: 4,
    justifyContent: 'center'
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
});
