import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import { color } from 'react-native-reanimated';
import colors from '../../../theme/Colors';
export default StyleSheet.create({
  ViewStyle1: {
    flex: 1,
    marginHorizontal: dimen(20),
    marginBottom: dimen(20),
  },
  wallet_item: {
    // borderRadius: 10,
    // borderWidth: 1,
    // marginVertical: 5,
    // paddingHorizontal: dimen(16),
    // paddingVertical: dimen(24),
  },
  touchableStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: dimen(15),
    borderRadius: dimen(14),
  },
  imgStyle: {
    height: heightDimen(36),
    width: widthDimen(36),
    // borderRadius: 32,
    resizeMode: 'contain',
  },
  ViewStyle: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimen(20),
    paddingHorizontal: dimen(16)
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
    fontFamily: Fonts.dmBold,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    textAlign: 'center',
    marginLeft: dimen(9),

    alignSelf: 'center',
  },
  horizontalLine: {
    borderBottomColor: ThemeManager.colors.dividerColor,
    // borderBottomWidth: 1,
    // flex:1,
    width: '92%',

    marginHorizontal: dimen(16),
    // marginTop:12
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
  privacyView: {
    borderRadius: dimen(12),
    marginBottom: dimen(16),
    width: '100%',
    // borderWidth: 1,
    borderColor: ThemeManager.colors.carBorder,
    overflow: 'hidden',
    // marginTop: heightDimen(16)
  },
});
