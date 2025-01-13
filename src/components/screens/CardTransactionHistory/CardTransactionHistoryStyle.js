import { StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';

export default StyleSheet.create({
  fromStatusStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 12,
    color: ThemeManager.colors.textColor,
  },
  fromRechargeStyle: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.textColor,
  },
  renderHistoryMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginTop: 10,
  },
  renderHistoryImageContainer: {
    width: '12%',
  },
  renderHistoryImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain'
  },
  centerContainer: {
    width: '60%',
  },
  infoCardRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  currencyStyle: {
    width: '60%',
    textAlign: 'right',
    color: ThemeManager.colors.settingsText,
  },
  feeStyle: {
    width: '50%',
    textAlign: 'right',
    color: ThemeManager.colors.settingsText,
  },
  priceAndDateContainer: {
    width: '25%',
    alignItems: 'flex-end',
  },
});
