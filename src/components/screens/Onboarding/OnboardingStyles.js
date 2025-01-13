
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, getDimensionPercentage, hasNotchWithIOS, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';
import { moderateScale } from '../../../layouts/responsive';
import { platform } from 'process';
import DeviceInfo from 'react-native-device-info';




export default StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: Platform.OS == 'ios'
      ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
        ? getDimensionPercentage(95)
        : getDimensionPercentage(95)

      : getDimensionPercentage(95),
    paddingHorizontal: widthDimen(28),
    //  marginTop: Platform.OS == 'ios' ?  heightDimen(40) : heightDimen(60) ,
  },
  subView: {
    alignItems: 'center',
    marginTop: dimen(82),
  },
  headerText: {
    marginTop: dimen(26),
    fontFamily: Fonts.dmBold,
    fontSize: dimen(28),
    textAlign: 'center',
    lineHeight: dimen(34),
    marginHorizontal: widthDimen(28),
  },
  boldText: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(16),
    lineHeight: getDimensionPercentage(24),
    textAlign: "center",
    marginTop: heightDimen(10)

  },
  importText: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(16),
    alignSelf: 'center',
    lineHeight: dimen(20)
  },
  logoView: {
    height: getDimensionPercentage(91), width: getDimensionPercentage(91)
  },
  walletImg: {
    height: getDimensionPercentage(307), width: getDimensionPercentage(305)
  },
  btnView: {
    justifyContent: 'flex-end',
    paddingHorizontal: widthDimen(24),
    paddingBottom: heightDimen(hasNotchWithIOS() ? 20 : 5)
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }

});