import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts } from '../../../theme';
import { verticalScale } from '../../../layouts/responsive';
import { getDimensionPercentage } from '../../../Utils';

export default StyleSheet.create({
  emptyView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(80)
    // marginTop: Dimensions.get('screen').height / 6,
  },
  txtTitle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    marginHorizontal: 23,
    marginTop: 20,
    color: ThemeManager.colors.settingsText,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    alignSelf: 'flex-end',
  },
  viewClose: {
    height: 80,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: getDimensionPercentage(16),
    lineHeight: getDimensionPercentage(24),
  }
});
