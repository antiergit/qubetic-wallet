import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';

export default StyleSheet.create({
  wrap: {
    display: 'flex',
    paddingHorizontal: 23,
  },
  res_wallet_subheader: {
    alignItems: 'center',
  },
  titleStyle: {
    fontFamily: Fonts.dmLight,
    fontSize: 24,
    lineHeight: 40,
    color: ThemeManager.colors.whiteText,
  },
  WalletCreateForm: {
    justifyContent: 'center',
    marginTop: 51,
  },
  res_links_text: {
    fontFamily: Fonts.dmMedium,
    fontSize: 24,
    lineHeight: 40,
    color: Colors.textColor,
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
  txtFont: {
    fontFamily: Fonts.dmLight,
    fontSize: 15,
    lineHeight: 30,
    color: ThemeManager.colors.lightWhiteText,
    marginTop: 10,
  },
  txtField: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
  },
  txtChar: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: ThemeManager.colors.colorVariation,
    alignSelf: 'flex-end',
  },
  txtCharErr: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    padding: 4,
    color: ThemeManager.colors.colorVariation,
    alignSelf: 'flex-start',
    marginTop: -10,
  },
});

