import { StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { bottomNotchWidth, getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';


export default StyleSheet.create({
  imgStyle2: {
    height: 28,
    width: 28,
    resizeMode: 'contain'
  },
  imgStyle1: {
    height: 8,
    width: 6,
    resizeMode: 'contain'
  },
  ViewStyle3: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '88%',
  },
  imgStyle: {
    height: 40,
    width: 40,
    resizeMode: 'contain'
  },
  viewStyle2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  titleTextStyleNew: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
  },
  ViewStyle2: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '35%',
  },
  ViewStyle1: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 10,
    // borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 10,
    overflow: 'hidden'
  },
  ViewStyle: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Title: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(18),
    color: ThemeManager.colors.whiteText,
    paddingLeft: 10,
    lineHeight: dimen(23)
  },
  TitleNew: {
    fontFamily: Fonts.dmBold,
    fontSize: 13,
    color: ThemeManager.colors.whiteText,
    paddingLeft: 10,
    textAlign: 'right',
  },
  Title1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
    paddingLeft: 10,
  },
  ViewStyle4: {
    borderRadius: 14,
    height: 40,
    width: 40,
    justifyContent: 'center',

  },
  date: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    paddingLeft: 10,
  },
  viewMain: {
    flex: 1,
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  tab_wrapstyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  tabsWrap: {
    height: 50,
    borderRadius: 14,
    // paddingHorizontal: 3,
    width: '93%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab_isActiveStyle: {
    // backgroundColor: Colors.White,
    height: 50,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
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
});
