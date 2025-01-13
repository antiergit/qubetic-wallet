import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';

export default StyleSheet.create({
  imgStyle1: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 10,
    paddingRight: 10,
  },
  imgStyle: {
    height: 30,
    width: 30,
    borderRadius: 32,
    resizeMode: 'contain',
  },
  ViewStyle: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewStyle1: {
    width: 14,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    display: 'flex',
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 23,
    paddingTop: 71,
  },
  qrBlock: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  qrAddress: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 60,
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
  },
  qrAddressTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    color: Colors.textColor,
    paddingHorizontal: 1,
    textAlign: 'center',
  },
  copyShareButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  copyShareButtonsText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 16,
    color: ThemeManager.colors.text_color,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  warningText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.text_color,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
  },
  buttonsStyle: {
    borderRadius: 10,
    marginLeft: 5,
    padding: 15,
    borderWidth: 1,
  },
  txtText: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    color: '#64748B',
  },
  txtinst: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,
    color: '#1A202E',
  },
  selectToken: {
    height: 52,
    borderRadius: 12,
    paddingLeft: 15,
    paddingRight: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ViewStyle2: {
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  coinTextStyle: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    color: Colors.themeColor,
    marginTop: 2,
    marginLeft: 8,
  },
});
