import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import DeviceInfo from 'react-native-device-info';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';


export default StyleSheet.create({
  touchStyle: {
    width: 25,
    height: 22,


  },
  stepStyle: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  wrap: {
    display: 'flex',
    paddingHorizontal: 23,
    marginTop:
      Platform.OS == 'ios'
        ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
          ? getDimensionPercentage(60)
          : getDimensionPercentage(0)

        : getDimensionPercentage(0),



  },
  subHeaderStyle: {
    paddingTop: DeviceInfo.hasNotch() ? 45 : DeviceInfo.getDeviceName() == 'OPPO F19 Pro' || 'OnePlus NordCE 5G' ? 50 : 32,
  },
  titlStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 26,
    color: ThemeManager.colors.whiteText,
    textAlign: 'center',

    // marginTop: 50,
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
