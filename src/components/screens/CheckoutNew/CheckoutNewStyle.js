import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '../../../theme';

export default StyleSheet.create({
  ViewStyle: {
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  mainBg: {
    minHeight: 128,
    borderRadius: 30,
    marginTop: 38,
  },
  imgBg: {
    borderRadius: 58,
    height: 58,
    width: 58,
    marginTop: -25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinName: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    textAlign: 'center',
    marginTop: 10,
  },
  amountStyle: {
    fontSize: 26,
    fontFamily: Fonts.dmBold,
    textAlign: 'center',
  },
  perAmountStyle: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    textAlign: 'center',
  },
  perAmountStyleNew: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    textAlign: 'center',
  },
  viewBg: {
    minHeight: 32,
    backgroundColor: Colors.textNew,
    borderRadius: 16,
    marginTop: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    textAlign: 'center',
    marginTop: 15,
    marginHorizontal: 10,
    lineHeight: 26,
    marginBottom: 15,
  },
  textStyleNew: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    textAlign: 'center',
  },
  lowerBg: {
    minHeight: 150,
    marginTop: 15,
    borderRadius: 30,
    paddingTop: 7,
    paddingBottom: 15,
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
  },
  innerView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
});
