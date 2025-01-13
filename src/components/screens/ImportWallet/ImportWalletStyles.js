import { StatusBar, StyleSheet } from 'react-native';
import { fonts } from '../../Theme/Fonts';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';

import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';

export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(24),
    marginTop: heightDimen(30)


  },
  mainViewStyle: {
    flex: 1,
  },
  headerTextStyle: {

  },
  txtheading: {
    marginTop: dimen(20),
    textAlign: 'center',
    fontSize: dimen(16),
    lineHeight: dimen(24),

    fontFamily: Fonts.dmMedium,
  },
  styleMargin: {

    borderRadius: dimen(12),
    marginTop: dimen(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 12,
  },
  lineStyle: {
    borderBottomWidth: 1,

    marginHorizontal: dimen(10),
  },

  subView: {
    flex: 1,
    // alignItems: 'center',
  },
  txtStyle: {
    textAlign: 'center',

    fontSize: dimen(16),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmMedium,
  },
  rightArrowStyle: {
    height: dimen(12),
    width: dimen(7),
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: heightDimen(50)
  },
  btntxtStyle: {
    fontSize: dimen(18),
    fontFamily: Fonts.dmBold,
    lineHeight: dimen(24),
    letterSpacing: -dimen(0.36),
    flex: 1,
  },
  buttonstyle: {

  },

  copyMainView: {
    marginTop: dimen(25),
  },
  placeHolderStyle: {
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: dimen(14),
    paddingTop: dimen(14)
  },
  inputPhraseStyle: {
    height: dimen(228),
    marginTop: dimen(30),
  },
  copyView: {
    flexDirection: 'row',
  },
  center: {
    alignItems: "flex-end",
    justifyContent: "center",
    position: "absolute",
    // marginTop: dimen(-48),
    bottom: dimen(40),
    right: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imgView: {
    paddingVertical: dimen(14),
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
    paddingRight: dimen(17),

  },
  primary_heading: {
    fontSize: dimen(14),
    lineHeight: dimen(22),

    fontFamily: Fonts.dmMedium,
    marginTop: dimen(17)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  walletTextStyle: {
    fontSize: dimen(16),
    lineHeight: dimen(20),
    textAlign: 'center',
    fontFamily: Fonts.dmBold,
    marginBottom: dimen(20),
  },
  reviewText: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(24),
    textAlign: 'center',
    lineHeight: dimen(36),
    // marginBottom:heightDimen(24),
  },
});
