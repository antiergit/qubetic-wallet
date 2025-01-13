import { StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  ViewStyle2: {
    borderRadius: 5,
    marginTop: 5,
    height: 5,
    width: 80,
    backgroundColor: Colors.lossColor,
  },
  ViewStyle: {
    marginVertical: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
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
    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40),
    alignItems: 'center',
  },
  listStyle: {
    alignItems: 'center',
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
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
});
