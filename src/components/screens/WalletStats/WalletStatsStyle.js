import { Dimensions, StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';

import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import { platform } from 'process';
import { Platform } from 'react-native';

export default StyleSheet.create({
  imgViewStyle: {
    height: 33,
    alignSelf: 'center',
    width: 33,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: dimen(18),
    lineHeight: dimen(23),
    fontFamily: Fonts.dmRegular,
  },
  textStyle1: {
    fontSize: 18,
    fontFamily: Fonts.dmSemiBold,
  },
  ViewStyle: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ViewStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: widthDimen(10),
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: getDimensionPercentage(22),
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  TriangleShapeCSS: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#00BCD4',
    alignSelf: 'center',
    transform: [{ rotate: '90deg' }],
  },
  ViewNew: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: Dimensions.get('screen').height / 3.8,
  },
  balAmount: {
    textAlign: 'center',
    fontSize: getDimensionPercentage(50),
    fontFamily: Fonts.dmBold,
  },
  bal: {
    textAlign: 'center',
    fontSize: getDimensionPercentage(40),
    fontFamily: Fonts.dmSemiBold,

    // marginBottom: 20
  },
});
