
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';
import { Colors, Fonts } from '../../../theme';
import { horizontalScale, moderateScale, verticalScale } from '../../../layouts/responsive';
import { ThemeManager } from '../../../../ThemeManager';



export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(24),
    marginTop: heightDimen(30)

  },
  subView: {
    flex: 1,
    // alignItems: 'center',

  },
  termsText: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(14),
    lineHeight: dimen(24)
  },
  termsTextBold: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(14),
    lineHeight: dimen(24)
  },
  termsView: {
    flexDirection: 'row',
    // marginBottom: dimen(35),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,

    // backgroundColor:'red',

  },
  legalText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(27),
    lineHeight: dimen(32),
    marginBottom: heightDimen(12),
  },
  reviewText: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    marginBottom: heightDimen(24),
  },
  privacyView: {
    borderRadius: dimen(12),
    paddingVertical: dimen(13),
    width: '100%',
    // borderWidth: 1,
    borderColor: ThemeManager.colors.carBorder,
    overflow: 'hidden',
    marginTop: heightDimen(16),
    justifyContent: 'center'
  },
  cardText: {
    fontSize: dimen(16),
    fontFamily: Fonts.dmRegular,
    marginLeft: widthDimen(10),
    lineHeight: dimen(20.8)
  },
  subContent: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingLeft: widthDimen(22),
    paddingRight: widthDimen(17),
    alignItems: 'center',
  },
  checkImg: {
    width: dimen(16), height: dimen(16), marginRight: widthDimen(10)
  },
  cardView: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },



});