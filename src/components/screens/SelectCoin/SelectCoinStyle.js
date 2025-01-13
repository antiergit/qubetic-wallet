import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts } from '../../../theme/';

export default StyleSheet.create({
  wrap: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.screenBg,
  },
  subHeader: {
    paddingHorizontal: 23,
    marginTop: 18,
    marginBottom: 18,
  },
  subHeaderTitleStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 32,
    color: Colors.textColor,
    paddingHorizontal: 8,
    marginBottom: 7,
  },
  subHeaderTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: Colors.textColor,
    paddingHorizontal: 8,
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
    color: Colors.White,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 2.5,
  },
});
