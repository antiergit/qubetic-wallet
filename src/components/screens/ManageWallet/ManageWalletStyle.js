import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';

export default StyleSheet.create({
  appLogo: {
    marginVertical: 25,
    alignSelf: 'center',
  },
  txtBold: {
    color: ThemeManager.colors.whiteText,
    fontSize: 38,
    marginHorizontal: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    padding: 5,
    fontFamily: Fonts.dmBold,
    letterSpacing: 0.27,
  },
  txtStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 18,
    marginHorizontal: 30,
    textAlign: 'center',
  },
  textStyleN: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 15,
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
  touchableStyle2: {
    height: 50,
    width: 74,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  touchableStyle1: {
    width: '80%',
  },
  touchableStyle: {
    padding: 2
  },
  imgView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    height: 22,
    width: 22,
  },
  imgStyle1: {
    height: 9,
    width: 12,
    alignSelf: 'center',
  },
  textStyle1: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    marginLeft: 10,
  },
  textStyle11: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: -0.28,
  },
  ViewStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    alignContent: 'center',
  },
  ViewStyle2: {
    marginTop: 25,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginBottom: 20,
    paddingTop: 35,
  },
  imgStyle: {
    height: 91,
    width: 126,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
  },
  imgStyle11: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 13,
    marginTop: 5,
  },
  ViewStyle11: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  ViewStyle12: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    height: 30,
  },
});
