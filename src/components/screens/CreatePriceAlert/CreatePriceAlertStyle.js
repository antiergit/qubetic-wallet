import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts } from '../../../theme';

export default StyleSheet.create({
  ViewStyle1: {
    position: 'relative',
    flex: 1,
    marginRight: 7,
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  ViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imgStyle: {
    width: 10,
    height: 5,
    alignSelf: 'center',
    marginRight: 20,
  },
  touchableStyle: {
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
  },
  tokenImage_styleNew: {
    alignSelf: 'center',
    marginLeft: 10,
    resizeMode: 'cover',
    width: 30,
    height: 30,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  tokenImage_stylee: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    backgroundColor: ThemeManager.colors.Mainbg,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 10,
  },
  tokenAbr_stylee: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
  },
  coinTextStyle: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    marginTop: 10,
  },
  coinText: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    marginTop: 25,
    marginBottom: 5,
  },
});
