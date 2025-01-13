import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { isIphoneX, getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { getDimensionPercentage } from '../../../Utils';

export default StyleSheet.create({
  modalView: {},
  cancel: {
    fontFamily: Fonts.dmRegular,
    fontSize: 15,
    color: Colors.White,
    marginTop: 20,
    marginRight: 15,
    alignSelf: 'flex-end',
    marginBottom: 10,

  },

  cancelText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 15,
    marginTop: 20,
    marginRight: 25,
    alignSelf: 'flex-end',
    marginBottom: 20,
  }
  , imgStyle1: {
    height: 30,
    width: 30,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  imgStyle: {
    marginRight: 10,
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  cameraStyle: {
    height: Dimensions.get('window').height / 2,
    width: '80%',
    alignSelf: 'center',
  },
  ViewStyle3: {
    position: 'relative',
    flex: 1,
    marginRight: 7,
    marginBottom: 15,
    height: 80,
  },
  ViewStyle: {
    height: isIphoneX()
      ? Dimensions.get('window').height -
      200 -
      getBottomSpace() -
      getStatusBarHeight()
      : Dimensions.get('window').height - 200,
    paddingHorizontal: 23,
  },
  ViewStyle1: {
    marginTop: 8,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1
  },
  ViewStyle2: {
    position: 'relative',
    marginBottom: 15,
    marginTop: 10,
  },
  wrap: {
    display: 'flex',
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 23,
    paddingTop: 71,
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
  networkTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 10,
    top: 75,
    right: 20,
    borderWidth: 1,
  },
  coinTextStyle: {
    fontSize: getDimensionPercentage(16),
    lineHeight: getDimensionPercentage(24),
    fontFamily: Fonts.dmMedium,
    color: Colors.themeColor,
    marginTop: 2,
    marginLeft: 8,
  },
  placeHolderStyle: {
    fontSize: getDimensionPercentage(16),
    // lineHeight: getDimensionPercentage(16),
    fontFamily: Fonts.dmRegular,

  },
  txtNetwork: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.lightWhiteText,
    marginTop: 20,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.dmRegular,
    color: "rgba(247, 147, 26, 1)",
    paddingHorizontal: 10
  },
});
