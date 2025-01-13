import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts } from '../../../theme';
import { dimen } from '../../../Utils';

export default StyleSheet.create({
  trashBox: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    // backgroundColor:'red'
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    width: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  trash: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  emptyView: {
    height: Dimensions.get('screen').height / 1.25,
    marginHorizontal: dimen(20)
  },
  txtTitle: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: Fonts.dmMedium,
    marginHorizontal: 23,
    marginTop: 20,
    color: ThemeManager.colors.settingsText,
  },
  emptyTxt: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: Fonts.dmSemiBold,
    marginHorizontal: 23,

  },
  viewClose: {
    height: 80,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  ViewStyle: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 45,
    width: 45,
  },
});
