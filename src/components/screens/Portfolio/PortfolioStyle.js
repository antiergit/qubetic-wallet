import { Platform, StatusBar, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import DeviceInfo from 'react-native-device-info';

export default styles = StyleSheet.create({
  tab_wrapstyle: {
    justifyContent: 'center',
    marginTop: 45,
    alignSelf: 'center',
  },
  tabsWrap: {
    // backgroundColor: Colors.tabsWrapBg,
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 22,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  tab_isActiveStyle: {
    backgroundColor: Colors.White,
    height: 50,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
  tab_isActiveTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 18,
    color: ThemeManager.colors.whiteText,
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  tab_inActiveStyle: {
    width: '50%',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: "rgba(128, 128, 128, 0.1)",
    height: 50
  },
  ViewStyle2: {

    // height: 210,
    // backgroundColor:'green',
    // paddingVertical:20,
    // paddingHorizontal: 20,
    paddingHorizontal: getDimensionPercentage(25),

    width: '100%',
    // backgroundColor:'pink',
    // marginTop:heightDimen(Platform.OS == 'ios' ? 10: 50),
    marginTop: Platform.OS == 'ios'
      ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
        ? 0
        : 0
      : StatusBar.currentHeight
        ? StatusBar.currentHeight
        : 28,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  ViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getDimensionPercentage(20),
    justifyContent: "space-between"
  },
  walletNameIcon: {
    fontFamily: Fonts.dmBold,
    fontSize: dimen(25.46),
    fontWeight: '700',
  },
  walletName: {
    textTransform: "capitalize",
    marginLeft: widthDimen(6),
    fontSize: getDimensionPercentage(20),
    fontFamily: Fonts.dmSemiBold,
    lineHeight: getDimensionPercentage(20),
    maxWidth: widthDimen(230),
    marginTop: heightDimen(5),
  }
});
