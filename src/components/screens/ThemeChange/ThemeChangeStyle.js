import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
export default StyleSheet.create({
  imgstyle: {
    resizeMode: 'contain',
    marginRight: dimen(18),
    // height: 20,
    // width: 20,
    tintColor: ThemeManager.colors.cloudy,
  },
  ViewStyle11: {
    borderRadius: dimen(12),
    // paddingHorizontal: 15,
    // paddingVertical: 8,
    marginTop: dimen(24),
    // marginHorizontal: dimen(24)
  },
  ViewStyle: {
    // alignSelf: 'center',
    // width: '90%',
    // justifyContent: 'center',
    // paddingVertical: 12,
    // marginTop: 20,
    // borderRadius: 10,
  },
  wallet_item1: {
    flexDirection: 'row',
    width: '98%',
    justifyContent: 'center',
  },
  wallet_item: {
    paddingHorizontal: 15,
  },
  touchableStyle: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  ViewStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  imgStyle: {
    height: 22,
    width: 22,
    borderRadius: 32,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  ViewStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  wrap: {
    display: 'flex',
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 23,
    paddingTop: 71,
  },
  subHeaderStyle: {
    marginTop: 35,
  },
  titlStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 32,
    color: Colors.textColor,
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 18,
    color: Colors.textColor,
    textAlign: 'center',
    marginBottom: 45,
  },
  wallet_itemText: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: Colors.textColor,
    textAlign: 'left',
    alignSelf: 'center',
  },
  wallet_option: {
    position: 'absolute',
    height: 68,
    flexDirection: 'row',
    right: '80%',
    backgroundColor: Colors.White,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    alignItems: 'center',
    borderRadius: 12,
    top: -20,
    justifyContent: 'space-around',
  },
  btnStyle: {
    alignItems: 'center',
  },
  btnTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 12,
    color: ThemeManager.colors.whiteText,
  },
  resetTextBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreWalletTextStyle: {
    padding: 5,
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    color: Colors.themeColor,
  },
});
