
import { StatusBar, StyleSheet } from 'react-native';
import { getDimensionPercentage as dimen, hasNotchWithIOS, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';


export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(24),

  },
  mainViewStyle: {
    // flex: 1,
    marginHorizontal: dimen(24)

  },
  headerTextStyle: {
    color: ThemeManager.colors.TextColor,
  },
  txtheading: {
    marginTop: dimen(30),
    textAlign: 'center',
    fontSize: dimen(24),
    lineHeight: dimen(36),
    color: ThemeManager.cloudy,
    fontFamily: Fonts.dmMedium,
  },

  txtButtonContainer: {
    marginBottom: hasNotchWithIOS() ? dimen(50) : dimen(20),
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: dimen(20)

  },
  buttonstyle: {
    width: '100%',
  },
  mnemonicInput: {
    borderRadius: 12,
    paddingHorizontal: dimen(10.5),
    paddingVertical: dimen(7),
    height: dimen(238),
    // minHeight: dimen(228),
    // maxHeight: dimen(288),
    flexDirection: 'row',
    overflow: 'scroll',
    flexWrap: 'wrap',
    marginTop: dimen(30),
    borderWidth: widthDimen(1)

  },
  mnemonicsStyle: {
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: dimen(24),
  },
  mnemonic_style: {
    borderRadius: dimen(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: heightDimen(10),
    paddingVertical: heightDimen(8),
    paddingHorizontal: widthDimen(5),
    width: "31%"
  },
  jumleText: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(16),
    lineHeight: dimen(27.52),

  },
  mnemonicActive: {
    borderStyle: 'dotted',
    borderRadius: 12,


  },


});
