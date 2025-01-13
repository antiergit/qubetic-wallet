import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { platform } from 'process';
import DeviceInfo from 'react-native-device-info';


export default StyleSheet.create({
  ViewStyle: {
    paddingHorizontal: 23,
    flex: 0.6,
    justifyContent: 'center',
  },
  forgot: {
    justifyContent: 'center',
    flex: 0.5,
    marginBottom: 25,
    width: '50%',
    alignSelf: 'center',
  },
  appLogo: {
    marginVertical: 25,
    alignSelf: 'center',
  },
  txtBold: {
    color: ThemeManager.colors.whiteText,
    fontSize: 38,
    marginHorizontal: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    padding: 5,
    fontFamily: Fonts.dmBold,
    letterSpacing: 0.27,
  },
  txtStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 18,
    marginHorizontal: 30,
    textAlign: 'center',
  },
  stepStyle: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  wrap: {
    flex: 1,
    marginTop:
      Platform.OS == 'ios'
        ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
          ? getDimensionPercentage(60)
          : getDimensionPercentage(0)

        : getDimensionPercentage(0),

  },
  subHeaderStyle: {
    marginTop: Platform.OS == 'ios'
      ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
        ? getDimensionPercentage(70)
        : getDimensionPercentage(60)
      : getDimensionPercentage(80),
    // marginTop: Platform.OS === 'ios' ? getDimensionPercentage(40) :  getDimensionPercentage(60),
  },
  titlStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 26,
    color: ThemeManager.colors.whiteText,
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: ThemeManager.colors.lightWhiteText,
    textAlign: 'center',
  },
  pin_wrap: {
    alignItems: 'center',
    flex: 0.4,
    justifyContent: 'flex-end'

  },
  pinBlockStyle: {
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40),
    alignItems: 'center'
  },
  listStyle: {
    alignItems: 'center',
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40)
  },
  pinBlockTextStyle: {
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.headersTextColor,
    fontSize: getDimensionPercentage(30),
    textAlign: 'center',
    lineHeight: getDimensionPercentage(39)
  },
  itemsStyle: {
    marginHorizontal: 5,
    width: 12,
    height: 12,
    borderRadius: 20,
    borderWidth: 0.7,
  },
});
