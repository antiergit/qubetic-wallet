
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';
import { Colors, Fonts } from '../../../theme';
import { horizontalScale, moderateScale, verticalScale } from '../../../layouts/responsive';
import { ThemeManager } from '../../../../ThemeManager';



export default StyleSheet.create({
  mainView: {
    flex: 1,
    // paddingHorizontal: dimen(24),
    marginTop: heightDimen(30)

  },
  subView: {
    // flex: 1,
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
    // backgroundColor:'red',

  },
  reviewText: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(24),
    textAlign: 'center',
    lineHeight: dimen(36),
    // marginBottom:heightDimen(24)
  },
  privacyView: {
    borderRadius: dimen(12),
    paddingVertical: dimen(21),
    width: '100%',
    borderWidth: 1,
    borderColor: ThemeManager.colors.carBorder,
    overflow: 'hidden',
    marginTop: heightDimen(16)
  },
  cardText: {
    fontSize: dimen(18),
    fontFamily: Fonts.dmSemiBold,
    marginLeft: widthDimen(29),
    lineHeight: dimen(23.4)
  },
  subContent: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingLeft: widthDimen(22),
    paddingRight: widthDimen(17)
  },
  checkImg: {
    width: dimen(16), height: dimen(16), marginRight: widthDimen(10)
  },
  cardView: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  placeHolderStyle: {
    textAlignVertical: 'top',
    borderRadius: dimen(12)
  },
  inputPhraseStyle: {
    height: dimen(228),
    paddingHorizontal: dimen(24),
    marginTop: dimen(30)
    // marginTop: dimen(20),
  },

  copyMainView: {
    marginTop: dimen(22),

  },
  copyView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: dimen(55),
    borderColor: 'rgba(27, 228, 35.04, 0.20)',
    paddingHorizontal: dimen(16),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  copyIconStyle: {
    height: dimen(20),
    width: dimen(20),
    resizeMode: 'contain',
  },
  copyText: {
    fontSize: dimen(16),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmBold,
    marginLeft: dimen(4),
    paddingVertical: dimen(13),
    paddingHorizontal: dimen(10),
    color: ThemeManager.mainColor,
  },


});