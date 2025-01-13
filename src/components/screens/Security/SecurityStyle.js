import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
export default StyleSheet.create({
  imgStyle: {
    marginBottom: 15,
  },
  ViewStyle1: {
    height: 1,
    width: '100%',
    marginVertical: 5,
  },
  ViewStyle: {
    borderRadius: 10,
    paddingHorizontal: dimen(16),
    paddingVertical: dimen(19),
    marginTop: 25,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: -5,
  },
  securityItem_list: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    marginLeft: 13,
  },
  securityItem_list_textstyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 15,
    color: Colors.textColor,
  },
});
