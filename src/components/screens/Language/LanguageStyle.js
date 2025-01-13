import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';

export default StyleSheet.create({
  ViewStyle11: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 25,
    marginHorizontal: 23
  },
  ViewStyle2: {
    height: 12,
    width: 12,
    borderRadius: 10,
    backgroundColor: Colors.grayBlack,
    alignSelf: 'center',
    marginRight: 10
  },
  ViewStyle1: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15
  },
  wallet_item: {
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  touchableStyle: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'center',
  },
  imgStyle: {
    height: 28,
    width: 28,
    borderRadius: 32,
    resizeMode: 'contain',
    marginRight: 0,
    alignSelf: 'center'
  },
  ViewStyle: {
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'center',
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
