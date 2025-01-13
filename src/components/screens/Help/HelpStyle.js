import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";

export default StyleSheet.create({
  coinTextStyle: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    marginTop: 10,
  },
  viewMain: {
    flex: 1,
    justifyContent: 'center',
  },
  ViewStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ViewStyle1: {
    paddingHorizontal: 22,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 12,
    marginHorizontal: 19
  },
  tab_wrapstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  tabsWrap: {
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 3,
    width: '93%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab_isActiveStyle: {
    backgroundColor: Colors.White,
    height: 50,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  tab_isActiveTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  tab_inActiveStyle: {
    width: '50%',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
  },
  textStyle1: {
    fontSize: 15,
    fontFamily: Fonts.dmRegular,
  },
  textStyle2: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    textTransform: 'capitalize',
    // backgroundColor: 'pink'
  }
})